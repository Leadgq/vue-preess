# prisma

## 安装 prisma

```bash
npm install prisma --save-dev
npm install dotenv
npm install @prisma/adapter-pg
npm install @prisma/client
```

## 依赖展示

```json
  "dependencies": {
    "@prisma/adapter-pg": "^7.3.0",
    "@prisma/client": "^7.3.0",
    "@types/node": "^25.0.10",
    "prisma": "^7.3.0"
  },
  "devDependencies": {
    "dotenv": "^17.2.3"
  }
```

## 初始化 prisma

```bash
npx prisma init
```

在 schema.prisma 中进行对表的定义

```ts
generator client {
  provider = "prisma-client"
  output   = "../generated/prisma"
}

datasource db {
  provider = "postgresql"
}

model user {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  posts     Post[]
}

model Post {
  id        String   @id @default(cuid())
  title     String
  content   String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  userId    String
  user      user     @relation(fields: [userId], references: [id], onDelete: Cascade, onUpdate: Cascade)
}


@relation(fields: [userId], references: [id], onDelete: Cascade, onUpdate: Cascade)
它的意思是当用户被删除时，所有关联的帖子也会被删除。
```

## 链接数据库

### 在.env 文件中配置数据库连接

```ts

DATABASE_URL = "postgresql://postgres:123456@localhost:5432/test";

含义: 配置数据库连接字符串, 用于连接到 PostgreSQL 数据库。
用户名：postgres
密码：123456
主机：localhost
端口：5432
数据库名：test
```

## 创建迁移文件

```bash
npx prisma migrate dev --name
含义: 创建一个迁移文件, 用于初始化数据库 schema。
```

## 生成 prisma 客户端

```bash
npx prisma generate   
```