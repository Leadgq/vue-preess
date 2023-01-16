# 常用插件

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