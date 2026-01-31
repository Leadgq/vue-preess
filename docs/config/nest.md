# nest

## 什么是 nest.js

Nest.js 是一个用于构建高效、可扩展的 Node.js 服务器端应用程序的框架。它基于 TypeScript 并结合了 Angular 的架构模式，提供了一种结构化的方式来开发应用程序。

## 鉴权

```bash
 pnpm install @nestjs/jwt
```

```ts
import { JwtModule } from "@nestjs/jwt";
import { Module, Global } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

@Global()
@Module({
  providers: [],
  exports: [JwtModule, ConfigModule],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get("SECRET_KEY"),
        signOptions: { expiresIn: "1d" },
      }),
    }),
  ],
})
export class SharedModule {}
```

## 创建 token

```ts
import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SharedModule } from "@libs/shared";

@Module({
  imports: [SharedModule],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
```

```ts
AuthService 实现生成token;
import { Token, TokenPayload, RefreshToken } from "@en/common/user";
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  generateToken(payload: TokenPayload): Token {
    return {
      accessToken: this.jwtService.sign<RefreshToken>({
        ...payload,
        tokenType: "access",
      }),
      refreshToken: this.jwtService.sign<RefreshToken>(
        {
          ...payload,
          tokenType: "refresh",
        },
        {
          expiresIn: "7d",
        },
      ),
    };
  }
}
```

## 路由守卫

```bash
 创建一个守卫模块
 nest g guard auth
```

```ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { JwtService } from "@nestjs/jwt";
import { RefreshToken } from "@en/common/user";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const headers = request.headers;
    if (!headers.authorization) {
      throw new UnauthorizedException("别偷了哥,买点东西吧");
    }
    const token = headers.authorization.split(" ")[1];
    try {
      const payload = this.jwtService.verify<RefreshToken>(token);
      if (payload.tokenType !== "access") {
        throw new UnauthorizedException("token类型错误");
      }
      request.user = payload;
      return true;
    } catch (err) {
      throw new UnauthorizedException("token 失效了");
    }
  }
}
```

## 前端配合

```ts
import axios from "axios";
import type { Token } from "@en/common/user";
import type { Response } from "../index.ts";

const refreshServer = axios.create({
  baseURL: "/api/v1",
  timeout: 50000,
});

refreshServer.interceptors.response.use(
  (config) => {
    return config.data;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export const refreshTokenApi = (data: Omit<Token, "accessToken">) => {
  return refreshServer.post("/user/refresh-token", data) as Promise<
    Response<Token>
  >;
};

```


```ts

export const serverApi = axios.create({
  baseURL: "/api/v1",
  timeout: TIMEOUT,
});

// 创建锁
let isRefreshing = false;
// 创建失败的队列
let requestQueue: ((newAccessToken: string) => void)[] = [];
// 请求拦截
serverApi.interceptors.request.use((config) => {
  const user = userStore();
  if (user.getAccessToken) {
    config.headers.Authorization = `Bearer ${user.getAccessToken}`;
  }
  return config;
});

// 响应拦截
serverApi.interceptors.response.use(
  (config) => {
    return config.data;
  },
  async (error) => {
    if (error.response.status !== 401) {
      return Promise.reject(error);
    } else {
      const user = userStore();
      const accessToken = user.getAccessToken;
      const refreshToken = user.getRefreshToken;
      const originalRequest = error.config;
      if (!accessToken || !refreshToken) {
        ElMessage.error("没有任何token,无法刷新，请重新登录  ");
        user.loginOut();
        router.replace("/");
        return Promise.reject(error);
      }
      if (isRefreshing) {
        return new Promise((resolve) => {
          // 加入队列
          requestQueue.push((newAccessToken: string) => {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            resolve(serverApi(originalRequest));
          });
        });
      }
      isRefreshing = true;
      try {
        const newToken = await refreshTokenApi({ refreshToken });
        if (newToken.success) {
          user.updateToken(newToken.data);
        } else {
          user.loginOut();
          router.replace("/");
          return Promise.reject(error);
        }
        requestQueue.forEach((callback) => callback(newToken.data.accessToken));
        return serverApi(originalRequest);
      } catch (error) {
        return Promise.reject(error);
      } finally {
        requestQueue = [];
        isRefreshing = false;
      }
    }
  },
);
```
