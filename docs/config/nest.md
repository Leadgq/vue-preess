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
