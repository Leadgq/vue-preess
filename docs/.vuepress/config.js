module.exports = {
  title: '我的文档地址',
  description: '在线文档地址',
  themeConfig: {
    sidebarDepth: 2,
    smoothScroll: true,
    nav: [
      {text: '主页', link: '/'},
      {
        text: '基础知识',
        items: [
          {text: '正则', link: '/base/reg'},
          {text: '数组', link: '/base/arr'},
          {text: '对象', link: '/base/object'},
        ]
      },
      {
        text: '题库',
        items: [
          {text: '树', link: '/question/tree'}
        ]
      },
      {text: '常用插件', link: '/plugin/plugin'},
      {
        text: '常用配置',
        items: [
          {text: 'vite常用配置', link: '/config/vite-config'},
          {text: 'tailwindcss的配置', link: '/config/tailwindcss'},
        ],
      }
    ],
    sidebar: {
      '/config/': ['vite-config', 'tailwindcss'],
      '/base/': ['reg', 'arr', 'object'],
      '/plugin/': ['plugin'],
      '/question/': ['tree']
    }
  },
}
