## node常用命令

```bash
 npm config list
 node -v
 npm ls -g 
```

```
 npm config list 这个命令可展示
 registry = "https://registry.npmmirror.com/" 这个是npm的镜像地址
 node bin location = C:\Program Files\nodejs\node.exe 这个是node的安装地址
 node version = v16.16.0   这个是node的版本
 npm local prefix = C:\Users\Admin 这个是npm的安装地址
 npm version = 8.11.0 这个是npm的版本
 cwd = C:\Users\Admin    这个是当前的工作目录
 HOME = C:\Users\Admin 这个是当前的用户目录
```

## package.json

```json
{
  "name": "node",
  "version": "1.0.0",
  "description": "node",
  // commonjs模块 找个模块
  "main": "index.js",
  // esm模块 找找个模块
  "module": "index.js",
  // 你要上传的文件报名
  "files": [
    "lib",
    "esm"
  ],
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    // 这个是自定义的命令
    "start": "node index.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  // 这个是依赖
  "dependencies": {
    "axios": "^0.24.0",
    "express": "^4.17.2"
  },
  // 这个是开发依赖
  "devDependencies": {
    "nodemon": "^2.0.15",
    "webpack" : "^5.65.0",
  }
}
```


## npm install 原理

```
首先安装的依赖都会存放在根目录的node_modules,默认采用扁平化的方式安装，
并且排序规则.bin第一个然后@系列，再然后按照首字母排序abcd等，
并且使用的算法是广度优先遍历，在遍历依赖树时,npm会首先处理项目根目录下的依赖，
然后逐层处理每个依赖包的依赖，
直到所有依赖都被处理完毕。在处理每个依赖时，
npm会检查该依赖的版本号是否符合依赖树中其他依赖的版本要求，
如果不符合，则会尝试安装适合的版本
```

## npm install 后序过程

```
 npm instll 之后 会执行npm config list
 先去项目级别找寻.npmrc文件，如果没有找到，就去用户级别找寻.npmrc文件，
 如果还是没有找到，就去全局级别找寻.npmrc文件，
 如果还是没有找到，就去内置的npmrc文件中找寻，如果还是没有找到，就使用默认的配置。
 在检查是否存在packag.json文件和package-lock文件，
 如果存在，就会根据package-lock.json文件中的依赖版本号进行安装，
 如果不存在，就会根据package.json文件中的依赖版本号进行安装。
 有冲突的时候，会根据package.json中的依赖版本号进行安装
 没有冲突的时候，下载完毕进行缓存检查，如果缓存中存在，直接将文件解压到node_modules中。
```

## node_modules .bin

```
node_modules中的.bin文件夹会存放可执行文件，这些文件只需要你在
scripts中提供、其他平台的所有跨端命令都会被制作好
```


## npx 命令

```
  npm 5.2.0版本之后，就有了npx命令，
  npx可运行.bin文件夹下中可执行文件
  npx专注于命令 
  npm专注于包管理
```
## npx 使用方式

```bash
  npx create-react-app my-app
  npx webpack
  npx webpack --config webpack.config.js
  npx webpack-dev-server
```

## npx 原理

```
  npx会首先检查本地是否存在该命令，如果存在就执行本地命令，
  如果不存在就会去远程仓库下载该命令并执行，执行完毕后删除。
  它是一次性的，不占用空间。
```
