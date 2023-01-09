# vite常用配置

```
vite的常用配置包括:跨域配置,自动导入hook,自动加载组件,mock数据配置,别名配置
yarn add  unplugin-auto-import
yarn add  unplugin-vue-components
```

## 跨域配置

```
server: {
            port: 5173,
            open: true,
            proxy: {
                '/api': {
                    target: env.VITE_HOST,
                    changeOrigin: true,
                    rewrite: path => path.replace(/^\/api/, '')
                },
                '/ws': {
                    target: env.VITE_WS,
                    changeOrigin: true,
                    rewrite: path => path.replace(/^\/ws/, '')
                }
            }
}
```

## 自动导入hook

<p>导入<i style="color: red">hook</i>可以让你节省对方法的导入比如ref,reactive</p>

```vue3
 import {ref} from  "vue"
```

```
import AutoImport from "unplugin-auto-import/vite";
plugins:[
       AutoImport({
                imports: ['vue', 'vue-router', '@vueuse/core', {
                    '@vueuse/math': ['useSum']
                }],
                dts: "src/auto-import.d.ts"
            })
]
```

## 自动加载组件

```handlebars
自动加载组件,不需要你每次进行导入,而是可以使用第三方包的组件
例如
<el-button>按钮</el-button> 在页面中就可以直接使用
```

```handlebars
import Components from "unplugin-vue-components/vite";
import { AntDesignVueResolver, ElementPlusResolver } from "unplugin-vue-components/resolvers";
Components({
dirs: ['src/components'],
resolvers: [ElementPlusResolver(),AntDesignVueResolver()],
dts: true,
include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
exclude: [/[\\/]node_modules[\\/]/, /[\\/]\.git[\\/]/, /[\\/]\.nuxt[\\/]/],
deep: true
})],
```

## 别名配置

```handlebars
import path from "path";
resolve: {
alias: {
'@': path.resolve(__dirname, 'src')
}
},
```

## mock数据

```handlebars
    yarn add vite-plugin-mock
    import { viteMockServe } from "vite-plugin-mock";
    viteMockServe({
        mockPath: './src/mock',
        localEnabled: command === 'serve',
        prodEnabled: command !== 'serve' && Boolean(env.VITE_MOCK_STATE),
        injectCode: `
        import { setupProdMockServer } from './mock/mockProdServer';
        setupProdMockServer();
    `
    })
```

## webWork
```handlebars
   开启webWorker之后打包会报错,所以需要处理一下打包方式
     worker: {
        format: 'es'
    },
```
