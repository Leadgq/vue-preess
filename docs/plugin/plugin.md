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

```vue
<script setup lang="ts">
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { useAuthStore } from '@/store'
import { fileDownloadUrl } from '@/api'

const props = defineProps({
  htmlContent: {
    type: String,
    default: '',
    required: false,
  },
  projectId: {
    type: String,
    default: '',
    required: true,
  },
  isDisabled: {
    type: Boolean,
    default: false,
    required: false,
  },
  width: {
    type: String,
    default: '100%',
    required: false,
  },
})
const authStore = useAuthStore()
// 编辑器实例，必须用 shallowRef，重要！
const editorRef = shallowRef()

const insertImage = ref([])

// 内容 HTML
const valueHtml = ref('')

// 添加一个提取图片 src 的函数
function extractImageSrcs(htmlContent: string): string[] {
  const imgRegex = /<img[^>]+src="([^">]+)"/g
  const srcs: string[] = []

  const matches = Array.from(htmlContent.matchAll(imgRegex))

  for (const match of matches) {
    // match[1] 包含 src 的值
    const src = match[1]
    // 只获取文件名部分 (download/ 后面的部分)
    const fileName = src.split('download/')[1]
    if (fileName) {
      srcs.push(fileName)
    }
  }

  return srcs
}

watch(
  () => props.htmlContent,
  (newVal) => {
    if (newVal) {
      valueHtml.value = newVal
      if (props.isDisabled) {
        return
      }
      // 获取所有图片的 src
      const imageSrcs = extractImageSrcs(newVal)
      // 更新已插入图片列表
      insertImage.value = imageSrcs.map(src => ({
        src: fileDownloadUrl.replace('{fileName}', src),
      }))
    }
  },
  {
    immediate: true,
    deep: true,
  },
)

watch(
  () => props.isDisabled,
  (newDisabled) => {
    setDisabled(newDisabled)
  },
  {
    flush: 'post',
    deep: true,
  },
)

// 编辑器配置
const editorConfig = ref({
  placeholder: '请输入内容...',
  scroll: false,
  MENU_CONF: {
    uploadImage: {
      server: '', // 初始为空
      fieldName: 'file',
      maxFileSize: 10 * 1024 * 1024,
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`,
      },
      customInsert,
    },
    insertImage: {
      onInsertedImage(imageNode) {
        if (!imageNode) {
          return
        }
        insertImage.value.push(imageNode)
      },
    },
  },
})

// 监听 projectId 变化
watch(
  () => props.projectId,
  (newProjectId) => {
    if (newProjectId) {
      editorConfig.value.MENU_CONF.uploadImage.server = `/api/file/project/${newProjectId}/upload`
    }
  },
  { immediate: true },
)

function handleCreated(editor) {
  editorRef.value = editor // 记录 editor 实例，重要！
  setDisabled(props.isDisabled)
}

function setDisabled(disabled) {
  if (disabled) {
    editorRef.value?.disable()
  }
  else {
    editorRef.value?.enable()
  }
}

const toolbarConfig = {
  excludeKeys: ['fullScreen'],
}

function customInsert(responseBody, insertFn) {
  const saveName = responseBody.data.saveName
  const url = fileDownloadUrl.replace('{fileName}', `${saveName}`)
  insertFn(url)
}

function destroyEditor() {
  const editor = editorRef.value
  if (editor == null)
    return
  editor.destroy()
}

function getHtmlContent() {
  // 获取当前编辑器中的所有剩下图片
  const currentImages = editorRef.value.getElemsByType('image')
  // 找出在 insertImage 中但不在当前编辑器中的图片，这些就是被删除的图片
  const deleteImages = insertImage.value.filter(
    insertedImg =>
      !currentImages.some(currentImg => currentImg.src === insertedImg.src),
  )
  // 得到最终的src 并只要download/后面的地址
  const finalSrc = deleteImages.map(item => item.src.split('download/')[1])
  return {
    html: valueHtml.value,
    deleteImages: finalSrc,
  }
}

defineExpose({
  destroyEditor,
  getHtmlContent,
})

// 组件销毁时，及时销毁编辑器
onBeforeUnmount(() => {
  destroyEditor()
})
</script>

<template>
  <div class="h-full w-full flex flex-col" :style="{ width: props.width }">
    <div class="h-full w-full flex flex-col" style="border: 1px solid #ccc">
      <!-- 工具栏 -->
      <Toolbar
        :editor="editorRef"
        :default-config="toolbarConfig"
        style="border-bottom: 1px solid #ccc"
        mode="default"
      />
      <!-- 编辑器 -->
      <Editor
        v-model="valueHtml"
        :default-config="editorConfig"
        mode="default"
        class="flex-1 overflow-y-auto"
        @on-created="handleCreated"
      />
    </div>
  </div>
</template>

<!-- 别忘了引入样式 -->
<style src="@wangeditor/editor/dist/css/style.css"></style>

<style>
.w-e-text-container {
  overflow: auto;
}
html.dark {
  /* 工具栏背景色 */
  --w-e-toolbar-bg-color: #1a202c;

  /* 工具栏文字颜色 */
  --w-e-toolbar-color: #e2e8f0;

  /* 工具栏激活状态的颜色 */
  --w-e-toolbar-active-color: #60a5fa;

  /* 工具栏激活状态的背景色 */
  --w-e-toolbar-active-bg-color: #2d3748;

  /* 工具栏禁用状态的颜色 */
  --w-e-toolbar-disabled-color: #6b7280;

  /* 工具栏边框颜色 */
  --w-e-toolbar-border-color: #4a5568;

  /* 编辑区域背景色 */
  --w-e-textarea-bg-color: #1a202c;

  /* 编辑区域文字颜色 */
  --w-e-textarea-color: #e2e8f0;
}
</style>

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
[gitHub中文地址](https://github.com/hukaibaihu/vue-org-tree)


## 文件预览（pdf、excel、world）


```shell
#docx文档预览组件
npm install @vue-office/docx vue-demi

#excel文档预览组件
npm install @vue-office/excel vue-demi

#pdf文档预览组件
npm install @vue-office/pdf vue-demi
```

```shell
如果是vue2.6版本或以下还需要额外安装 @vue/composition-api
npm install @vue/composition-api
```
```vue
<template>
  <VueOfficeDocx :src="docx" style="height: 100vh;"/>
</template>

<script>
//引入VueOfficeDocx组件
import VueOfficeDocx from '@vue-office/docx'
//引入相关样式
import '@vue-office/docx/lib/index.css'

export default {
  components:{
    VueOfficeDocx
  },
  data(){
    return {
      docx: 'http://static.shanhuxueyuan.com/test6.docx' //设置文档网络地址，可以是相对地址
    }
  }
}
</script>
```
[gitHub中文地址](https://github.com/501351981/vue-office)

## 流程图

```

  npm install @antv/x6 --save
  import { Graph } from '@antv/x6';
```

[gitHub中文地址](https://x6.antv.vision/en/docs/tutorial/getting-started)


## 讯飞插件

```
npm i @muguilin/xf-voice-dictation
```

```js
import { XfVoiceDictation } from '@muguilin/xf-voice-dictation';

let times = null;
const xfVoice = new XfVoiceDictation({
    APPID: 'xxx',
    APISecret: 'xxx',
    APIKey: 'xxx',

    // webSocket请求地址 非必传参数，默认为：wss://iat-api.xfyun.cn/v2/iat
    // url: '',

    // 监听录音状态变化回调
    onWillStatusChange: function (oldStatus, newStatus) {
        // 可以在这里进行页面中一些交互逻辑处理：注：倒计时（语音听写只有60s）,录音的动画，按钮交互等！
        console.log('识别状态：', oldStatus, newStatus);
    },

    // 监听识别结果的变化回调
    onTextChange: function (text) {
        // 可以在这里进行页面中一些交互逻辑处理：如将文本显示在页面中
        console.log('识别内容：',text)

        // 如果3秒钟内没有说话，就自动关闭（60s后也会自动关闭）
        if (text) {
            clearTimeout(times);
            times = setTimeout(() => {
                this.stop();
            }, 3000);
        };
    },

    // 监听识别错误回调
    onError: function(error){
        console.log('错误信息：', error)
    }
});

// 给Dom元素加添事件，来调用开始语音识别！
// xfVoice.start();

// 给Dom元素加添事件，来调用关闭语音识别！
// xfVoice.stop();
```


## Connect Camera

[gitHub中文地址](https://github.com/648540858/wvp-GB28181-pro)

- This is open-source project for GB28181.
For front-end, You may need to play a video for your project.
This open-source provide a plugin and you can use it directly to meet your requirements. 
For back-end, It provide so many abilities that  you can move the position of the  Camera,
Pushing stream and pulling stream.Also, If you would like to get the project code.
you should browse the above address.