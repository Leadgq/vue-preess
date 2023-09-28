# electron

## 概念

```
 electron 是一个使用 JavaScript, HTML 和 CSS 构建跨平台桌面应用的开源库，
 集成了 Node.js 和 Chromium 的运行时环境、同时也提供了一系列的electron API用于操作系统的底层功能。
 electron 分三种进程：主进程、预加载、浏览器进程（可挑选你任意喜欢的框架vue、react）
```

## 主进程

```js
const {app, BrowserWindow} = require('electron')
const path = require('path')

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      // 沙盒是否打开(false:不打开，true:打开)
      sandbox: true,
      // 是否开启nodejs环境
      nodeIntegration: false,
      // 上下文开启隔离 ==> 默认情况下是开启的
      contextIsolation: true,
    }
  })
  mainWindow.loadFile('index.html')
  if (is.dev) {
    mainWindow.webContents.openDevTools();
  }
}


app.whenReady().then(() => {
  createWindow();
  // 如果不是mac，关闭所有窗口后退出
  app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
  })
  // mac下，点击dock图标时，如果没有窗口则新建一个
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})
ipcMain.handle('invoke', (event, arg) => {
  BrowserWindow.webContents(event.sender)
})

```

## 主进程与预加载进程通信

```
  electron提供了ipcMain、ipcRenderer、contextBridge三个模块用于主进程、渲染进程、预加载进行通信
```

## 预加载

```js
const {ipcRenderer, contextBridge} = require('electron')

// 桥接
contextBridge.exposeInMainWorld("api", {
  // 发送
  add: () => {
    ipcRenderer.send('add')
  },
  // 接收
  recetive: (callback) => {
    ipcRenderer.on('recetive', (event, arg) => {
      callback(arg)
    })
  },
  // 双向
  invoke: async () => {
    const result = await ipcRenderer.invoke('invoke')
    return result
  }
})

```

## 渲染进程

```
  渲染进程、一般都是使用vue、react等框架进行开发、也可使用传统html、css、js进行开发。
  由于预加载进程的存在、electron允许你在渲染进程中使用触发预加载进程、预加载进程调用部分node.js的api，
  如果需要让渲染进程使用全部api，可以开启nodeIntegration: true,但是这样会导致安全问题。
  (vite-electron-app) 和 (electron-vue) 这些成熟的脚手架它们的做法都是开启node.js环境
```

### 渲染进程触发预加载方法

```js
window.api.add()
window.api.recetive((arg) => {
  console.log(arg)
})
```

## 主进程常用方法

```js
 // 获取当前窗口
BrowserWindow.getFocusedWindow()
// 获取所有窗口
BrowserWindow.getAllWindows()
// 获取当前窗口的webContents
BrowserWindow.webContents(event.sender)
// 主进程接受
IPCMain.on();
// 主进程双向
IPCMain.handle();
// 主进程发送
IPCMain.send();
// 关闭app
app.quit();
// 获取app的版本
app.getVersion();
// 获取app的名称
app.getName();
// 打开文件
dialog.showOpenDialog();
// 保存文件
dialog.showSaveDialog();
// 提示
dialog.showMessageBox();
// 报错
dialog.showErrorBox();
// 通知
BrowserWindow.fromWebContents(event.sender)
// 获取当前窗口位置 
wind.getPosition();
// 设置窗口大小
wind.setSize();
// 设置窗口最大化
wind.maximize();
// 设置窗口最小化
wind.minimize();
// 嵌入式窗口
 win.loadURL('http://220.202.55.167:25000')
// 获取屏幕的宽度
const { width ,height } = screen.getPrimaryDisplay().workAreaSize
```

## 开发

```
   开发框架使用： electron-vite 
```

## pnpm 参数必须修改

```
pnpm config set electron_mirror=https://npm.taobao.org/mirrors/electron/
pnpm config set electron_builder_binaries_mirror=https://npm.taobao.org/mirrors/electron-builder-binaries/


pnpm config set electron_mirror https://mirrors.huaweicloud.com/electron/
pnpm config set electron_builder_binaries_mirror https://mirrors.huaweicloud.com/electron-builder-binaries/

否则打包会出现错误
```

## 打包

```
   插件使用: electron-builder
   pnpm build:win
   pnpm build:mac
   打包的时候图标是有要求的： 大小控制 
```

## YML 

```
   什么是YML:
   YAML (YAML Aint Markup Language)是一种标记语言，
   通常以.yml或者.yaml为后缀的文件，是一种直观的能够被电脑识别的数据序列化格式，
   并且容易被人类阅读，容易和脚本语言交互的，可以被支持YAML库的不同的编程语言程序导入，
   一种专门用来写配置文件的语言。可用于如： Java，C/C++, Ruby, Python, Perl, C#, PHP等
   在electron中，我们使用YML来配置打包的一些参数，例如：appId、productName、artifactName等等 
   底层是给c++

   YML语法: 
    不可以使用tab键，只能使用空格键
    以空格的缩进来控制层级关系
    对于大小写敏感
    例子  appId: com.electron.myApp 
```

## electron-builder.YML 说明
``` yml
  appId: 你的应用程序的标识符，通常是反向DNS表示法（例如，com.electron.myApp）。
    productName: 你的应用程序的名称，例如MyApp。
    win:
    executableName: 你的在windows上的应用程序的名称，例如myApp
    nsis:
    artifactName:  安装包的名称，例如${productName} Setup ${version}.${ext}
    shortcutName:  在桌面快捷方式的名称，例如myApp
    uninstallDisplayName: 卸载程序的名称，例如myApp
    createDesktopShortcut: 是否创建桌面快捷方式  true
    nsis: 是用于windows的安装程序生成器，它可以创建一个安装程序，该安装程序将安装你的应用程序并将其添加到用户的PATH环境变量中。
    没有这个，你的应用程序将无法在命令行中运行，在你进行build的时候，会自动下载这个安装程序生成器
```