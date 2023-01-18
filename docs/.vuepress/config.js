const base = require('./base');
module.exports = {
  title: '我的文档地址',
  description: '在线文档地址',
  themeConfig: {
    sidebarDepth: 2,
    smoothScroll: true,
    nav: [
      {text: '主页', link: '/'},
      {
        text: base.text,
        items: base.items
      },
      {
        text: '跨端',
        items: [
          {text: 'uniApp', link: '/Cross/uniApp'}
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
      '/question/': ['tree'],
      '/Cross/': ['uniApp'],
    }
  },
}
