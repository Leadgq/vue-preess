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
这是全局守卫;
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

## 局部守卫

```ts
在app.module.ts 中引入守卫模块;
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

```

```ts
import { Strategy } from "passport-jwt";
import { ExtractJwt } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../prisma-util/prisma-util.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(configService: ConfigService, private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get("SECRET_KEY")!,
    });
  }

  async validate({ userId }) {
    return this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
  }
}
```

```ts
import { Controller, Post, Body, Req, Get, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/auto-register.dot";
import { LoginDto } from "./dto/auth-login.dot";
import { AuthGuard } from "@nestjs/passport";
import type { Request } from "express";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Get("all")
  @UseGuards(AuthGuard("jwt"))
  getAll(@Req() req: Request) {
    return this.authService.getAll();
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

## 表单验证

```bash
 pnpm add class-validator class-transformer
```

### dto

```ts
import { IsNotEmpty } from "class-validator";

// 这是dto
export class LoginDto {
  @IsNotEmpty({ message: "用户名不能为空" })
  username: string;

  @IsNotEmpty({ message: "密码不能为空" })
  password: string;
}

 // 这是controller的代码
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  在去main.ts中写全局过滤器

   app.useGlobalPipes(
    new ValidationPipe(),
  );

```
### 验证数据唯一性

```ts
import { PrismaService } from '../prisma-util/prisma-util.service';

import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

// 表单字段是否唯一
export function isNotExistsRule(
  table: string,
  validationOptions: ValidationOptions,
) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'isNotExistsRule',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate: async (value: any, args: ValidationArguments) => {
          const prismaService = new PrismaService();
          const res = await prismaService[table].findFirst({
            where: {
              [args.property]: value,
            },
          });
          return !Boolean(res);
        },
      },
    });
  };
}
```

## minio

```bash
 pnpm add  minio
 pnpm add  @types/multer -D
```

### 安装 MinIO

打开网址：`https://minio.org.cn/download.shtml#/windows`

1. 下载 server -> minio.exe
2. 下载 client -> mc.exe

两个都要下载，下载完成之后放入文件夹即可,在文件夹里面新建两个文件名字可以随便取，我这儿叫`minio-data` `minio-data2`。进行集群存储，方便数据备份。

windows CMD 命令行启动

新建一个文件`start.cmd`

```cmd
set MINIO_ROOT_USER=admin
set MINIO_ROOT_PASSWORD=12345678
minio.exe server .\minio-data .\minio-data2 --console-address ":9001"
```

### 密钥生成

```bash
前置 mc alias set myminio http://localhost:9000 admin 12345678
mc admin user svcacct add myminio admin
```

### 删除Bucket

```
mc rb --force myminio/avatar
```


### 使用密钥

```json

# minio access秘钥
MINIO_ACCESS_KEY="OZ0Q833E5RPMFALGKKXT"
# minio secret秘钥
MINIO_SECRET_KEY="deW1+xXBiCI6ep6BvUpUJQxfxbJjhCLoWiPPBgWd"
# minio 地址
MINIO_URL="192.168.101.32"
# minio 端口
MINIO_PORT=9000
# 是否使用SSL
MINIO_USE_SSL=0
# minio 桶名
MINIO_BUCKET="avatar"

```

```ts
//  自己创建service和module
import { Injectable, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as Minio from "minio";
@Injectable()
export class MinioService implements OnModuleInit {
  private readonly minioClient: Minio.Client;
  constructor(private configService: ConfigService) {
    this.minioClient = new Minio.Client({
      endPoint: this.configService.get("MINIO_URL")!,
      port: this.configService.get("MINIO_PORT"),
      useSSL: !!Number(this.configService.get("MINIO_USE_SSL")),
      accessKey: this.configService.get("MINIO_ACCESS_KEY"),
      secretKey: this.configService.get("MINIO_SECRET_KEY"),
    });
  }

  async onModuleInit() {
    // 读取桶命
    const bucket = this.getBucket();
    // 是否存在
    const bucketExists = await this.minioClient.bucketExists(bucket);
    if (!bucketExists) {
      // 创建桶
      await this.minioClient.makeBucket(bucket);
      // 设置桶策略
      await this.minioClient.setBucketPolicy(
        bucket,
        JSON.stringify({
          Version: "2012-10-17",
          Statement: [
            {
              Sid: "PublicReadObjects", //给这个规则起一个名字
              Effect: "Allow", //允许打开这个规则 Allow 允许 Deny 拒绝
              Principal: "*", //所有人
              Action: ["s3:GetObject"], //允许浏览器获取对象
              Resource: ["arn:aws:s3:::avatar/*"], //允许读取 avatar桶内的所有资源
            },
          ],
        }),
      );
    }
  }

  getClient() {
    return this.minioClient;
  }

  getBucket() {
    return this.configService.get("MINIO_BUCKET")!;
  }
}
```
