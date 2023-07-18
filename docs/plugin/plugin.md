# 常用插件

## vue数据缓存

```shell
pnpm i pinia-plugin-persistedstate
```

```js  
// 来到main.js
import {createPinia} from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
```

```js 
// 来到你的store、之后不在需要由你控制、自动帮你缓存
import {defineStore} from 'pinia'

export const useStore = defineStore('store', {
  state: () => {
    return {
      someState: 'hello pinia',
    }
  },
  persist: {
    storage: sessionStorage,
    paths: ['someState'],
  },
})
```

## h5文件下载

```js
import FileSaver from "file-saver";

FileSaver.saveAs(blob对象 | 地址, 它的名字是什么);
```

## 富文本编译器

### vue2

```shell
yarn add @wangeditor/editor-for-vue
```

### vue3

```shell
yarn add @wangeditor/editor-for-vue@next
```

提供大量方法、同时支持vue2、vue3、react  [gitHub:地址](https://www.wangeditor.com/)

### vue2使用富文本

```vue

<template>
  <div>
    <Toolbar
        style="border-bottom: 1px solid #ccc"
        :editor="editor"
        :defaultConfig="toolbarConfig"
        :mode="mode"
    />
    <Editor
        style="min-height: 345px;max-height: 345px;  overflow-y: auto"
        v-model="form.noticeContent"
        @onDestroyed="onDestroyed"
        :defaultConfig="editorConfig"
        :mode="mode"
        @onCreated="onCreated"
    />
  </div>
</template>
<script>
import {Editor, Toolbar} from '@wangeditor/editor-for-vue';

export default {
  data() {
    return {
      // 富文本配置
      editor: null,
      toolbarConfig: {
        excludeKeys: ['fullScreen', 'insertLink', 'group-video']
      },
      form: {
        noticeContent: undefined,
      },
      editorConfig: {
        placeholder: '请输入内容...',
        scroll: false,
        MENU_CONF: {
          server: undefined,
          'uploadImage': {
            fieldName: 'file',
            maxFileSize: 10 * 1024 * 1024,
            headers: {
              Authorization: undefined
            },
            customInsert: undefined
          }
        }
      },
      mode: 'default',
    }
  },
  components: {
    Editor,
    Toolbar
  },
  beforeDestroy() {
    if (this.editor === null) return;
    this.editor.destroy(); // 组件销毁时，及时销毁编辑器
  },
  methods: {
    // 设置富文本
    setEditorConfig() {
      // 你的服务器地址
      this.editorConfig.MENU_CONF.uploadImage.server = server.api.file.upload;
      // 设置token
      this.editorConfig.MENU_CONF.uploadImage.headers.Authorization = 'Bearer' + '' + this.accessToken;
      // 设置图片插入函数
      this.editorConfig.MENU_CONF.uploadImage.customInsert = this.customInsert;
    },
    // 初始化富文本
    onCreated(editor) {
      this.editor = Object.seal(editor);
      // 自动聚焦
      this.editor.focus();
    },
    // 销毁富文本
    onDestroyed() {
      if (this.editor === null) return;
      this.editor.destroy();
    },
    // 插入函数
    customInsert(responseBody, insertFn) {
      const url = responseBody.data.bucketName + '-' + responseBody.data.fileName
      insertFn(url);
    },
  }
}
</script>
```

### vue3使用富文本

```
大同小异
```

## vueUse

```shell
npm i @vueuse/core
```

提供大量方法、同时支持vue2、vue3[gitHub](https://vueuse.org/guide)。

## 图片预览

```shell
npm install viewerjs
```

```vue

<style lang="less">
#viewer {
  position: absolute;
  display: none;
  opacity: 0;
  width: 100%;

  img {
    width: 100%;
    height: auto;
  }
}
</style>
<template>
  <div id="viewer"><img :src="viewSrc" alt=""></div>
</template>
<script>
import Viewer from 'viewerjs';
import 'viewerjs/dist/viewer.css';

let singleImgViewer;
export default {
  data() {
    return {
      viewSrc: undefined
    }
  },
  beforeDestroy() {
    this.destroyViewJs();
  },
  methods: {
    initData() {
      this.initViewJs();
    },
    initViewJs() {
      this.$nextTick(() => {
        const container = document.getElementById('viewer');
        singleImgViewer = new Viewer(container, {
          button: false,
          navbar: false,
          toolbar: false,
          container: document.getElementById('drawer')
        });
      });
    },
    // 销毁图片预览实例对象
    destroyViewJs() {
      singleImgViewer && singleImgViewer.destroy();
    },
    // 预览图片
    prevImage(item) {
      this.viewSrc = server.api.file.download.replace('{fileName}', item);
      this.$nextTick(() => {
        singleImgViewer && singleImgViewer.update();
        singleImgViewer && singleImgViewer.show();
      });
    },
  }
}
</script>
```

## 时间处理

### moment

```shell
  yarn  add  moment;
```

```js
moment(new Date()).format('YYYY-MM-DD');
moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
// 时间戳做差，变为秒
moment(endTimeStamp - nowStamp).format('X');
```

[gitHub中文地址](http://momentjs.cn/)

### Day.js

```shell
yarn  add dayjs
npm install dayjs --save
```

[gitHub中文地址](https://github.com/iamkun/dayjs/)


## 西瓜视频

```shell
npm install xgplayer
```

```html
<div id="mse"></div>
```

```js
import Player from 'xgplayer';
let player = new Player({
  id: 'mse',
  url: '//abc.com/**/*.mp4',
  lang: 'zh-cn'
});
```

## peer.js

```
peer.js 基于webRTC实现即时通信
允许网页应用不通过中间服务器就能互相直接传输任意数据，比如视频流、音频流、文件流、普通数据等
```
```shell
npm install peer.js
```
[gitHub中文地址](https://peerjs.com/)

```js
// 如果需要使用call先获取设备授权
var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
getUserMedia({video: true, audio: true}, function(stream) {
  const  call = peer.call('another-peers-id', stream);
  call.on('stream', function(remoteStream) {
    const video = document.querySelector('video');
    video.srcObject = remoteStream;
    video.onloadedmetadata = (()=> video.play())
  });
}, function(err) {
  console.log('Failed to get local stream' ,err);
});
```

## PPT插件
```shell
npm init slidev@latest
```
[gitHub中文地址](https://cn.sli.dev/guide/install.html#starter-template)



## 二维码生成

```shell
npm install vue-qr
```

```vue
  <vue-qr
    :size="180"
    :margin="0"
    :auto-color="true"
    :dot-scale="1"
    :text="'二维码信息'"
    class="qrImage"
/>
```
[gitHub中文地址](https://github.com/Binaryify/vue-qr)


## html转换为canvas

```shell
npm install html2canvas
```

```js
const tansferHtmlToBlob =  ()=>{
  return new Promise(async (resolve)=>{
    const canvas = await html2canvas(qrContainer, {
      dpi: window.devicePixelRatio * 2,
      width: qrContainerWidth,
      height: qrContainerHeight,
      scale: 0.75,
      useCORS: false,
      ignoreElements: (element) => {
        const classNameList = ['qrImage', 'qr-header-text', 'qr-footer-desc'];
        if (classNameList.includes(element.className)) return true;
      }
    });
    canvas.id = 'myCanvas';
    // 将canvas转换为blob
    canvas.toBlob((contentDataURL)=>{
      resolve(contentDataURL)
    });
  })
}
```
[gitHub中文地址](https://github.com/niklasvh/html2canvas)


## 组织树

```shell
npm i vue2-org-tree
```

```vue
    <vue2-org-tree :data="item" 
                   :renderContent="renderContent"
                   @on-node-click="onNodeClick"
                   :horizontal="false"
                   collapsable 
                   @on-expand="onExpand"
    />
```
```js
// ---> renderContent使用是h函数返回vNode就可
// ---> 固定写法
onExpand(_, data){
  if ('expand' in data) {
    data.expand = !data.expand;
    if (!data.expand && data.children) {
      this.collapse(data.children);
    }
  } else {
    this.$set(data, 'expand', true);
  }
}
collapse(list){
  list.forEach((child) => {
    if (child.expand) child.expand = false;
    child.children && this.collapse(child.children);
  });
}
```
[gitHub中文地址](github.com/hukaibaihu/vue-org-tree)
