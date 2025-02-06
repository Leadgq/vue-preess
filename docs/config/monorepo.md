## 多包管理

- pnpm init 
- 添加 pnpm-workspace.yaml
```
packages:
  - 'packages/*'
  - 'apps/*'
```
这里的意思是我的项目中有一个packages目录，里面存放的是我的包，还有一个apps目录，里面存放的是我的应用

- 添加 .npmrc
```
shamefully-hoist=true
```
这里配置了shamefully-hoist=true，意思是强制提升依赖，也就是强制提升依赖到根目录下


- 下载依赖
```
 pnpm i  typescript minimist  esbuild -D -w
```

```
  -w 是所有packages和apps都使用依赖
```

## packages

```
packages 下的所有包都要拥有自己的package.json
```

### 包之间的依赖关系管理

当需要在一个包内使用另一个包时，有两个关键步骤：

1. 配置 tsconfig.json 的路径别名：
```json
{
    "paths": {
      "@/*": ["packages/*/src"]
    }
}
```

2. 安装工作空间内的依赖：
```bash
pnpm install @vue/shared --workspace --filter @vue/reactivity
```

这个命令的含义：
- `--workspace`：表示安装的是工作空间（workspace）中的包，而不是从 npm 仓库安装
- `--filter @vue/reactivity`：指定要安装依赖的目标包
- `@vue/shared`：要被安装的依赖包

这样做的好处：
- 确保使用的是项目内部的包版本
- 可以实时反映内部依赖包的改动
- 避免版本不一致导致的问题
- 便于本地开发和调试


3. esbuild 打包

```js
esbuild.context({
    entryPoints: [entry],
    outfile: path.resolve(__dirname, `../packages/${target}/dist/${target}.js`),
    sourcemap: true,  // 是否可以调试
    bundle: true,  // 是否打包
    format,
    platform:'browser',  // 平台
    globalName: pkg.buildOptions?.name,
}).then(ctx => {
    console.log('finish and watch');
    return  ctx.watch();
}).catch(err => {
    console.log(err);
})
```

```js
import { createRequire } from 'module';
import path from 'path';

// 实现node的require
const require = Module.createRequire(import.meta.url);

// 获取当前文件的目录
const  __dirname = path.dirname(import.meta.url);
```

