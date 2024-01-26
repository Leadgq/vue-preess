# 题库

## vue父子组件的生命周期

```vue
<!-- 父组件 -->
<template>
  <div>
    <child></child>
  </div>
</template>

<script>
  import child from './child.vue'

  export default {
    components: {
      child
    }
  }
</script>

<!-- 子组件 -->
<template>
  <div>
    <p>子组件</p>
  </div>
</template>
```

``` 
 只要你懂的render函数的运行时机那么上面的问题就很简单
     1.运行父 beforeCreate 我得先创建父亲
     2.运行父 created 父亲创建好了
     3.运行父 beforeMount 父亲准备挂载
        这时候 render函数开始运行
        render(){
            // 在这里我发现我需要子组件，那么我就去创建子组件
             4.运行子 beforeCreate 我得先创建儿子
             5.运行子 created 儿子创建好了
             6.运行子 beforeMount 儿子准备挂载
             7.运行子 mounted 儿子挂载完毕
        }
    8.运行父 mounted 父亲挂载完毕
```


## webView嵌入模式，生产发布时，代码缓存

```
发生问题：生产发布时，代码缓存，导致页面不更新
发生问题的原因：由于浏览器的协商缓存机制，导致页面不更新
解决方案：在生产发布时，需要修改nginx配置，添加如下配置
add_header Cache-Control "no-cache, must-revalidate, proxy-revalidate, no-store";
如果使用 no-cache, 那么每次都去服务器验证，如果资源未修改，可以使用缓存，如果资源已修改，
那么就重新下载资源。
如果使用 no-store, 不会使用缓存，直接去服务器下载资源。
如果都不像使用 no-store 可以使用移除 etag 或者 last-modified
no-store ===  etag off; last_modified off;
```

## webView 预加载

```vue 
发生问题：嵌入的时候，当访问子应用的时候，白屏时间过长
    h5 uniApp 的解决方法 : 创建一个空白的webView 用来预加载
    <web-view :src="url" :style="width:0,height:0"></web-view>
    url 就是子应用的地址, 宽高为0,这样就不会显示出来
```


## 如何唤起app

```vue
<template>
  <div>
    <button @click="openApp">打开抖音</button>
  </div>
</template>
<script>

export default {
  components: {

  },
  data() {
    return {};
  },
  mounted() {

  },
  computed: {
  },
  methods: {
    openApp() {
      // window.location.href = 'snssdk1128://';
      window.location.href = 'weixin://scanqrcode';
    }
  },
};
</script>
```