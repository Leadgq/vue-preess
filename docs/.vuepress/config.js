module.exports = {
  title: '我的文档地址',
  description: '在线文档地址',
  themeConfig: {
    sidebarDepth:2,
    smoothScroll: true,
    nav: [
      {text: '主页', link: '/'},
      {
        text: '常用配置',
        items: [
          {text: 'vite常用配置', link: '/config/vite-config'},
          {text: 'tailwindcss的配置', link: '/config/tailwindcss'},
        ],
      },
      {
        text: '基础知识',
        items: [
          {text: '正则', link: '/base/reg'},
        ]
      }
    ],
    sidebar: {
      '/config/': ['vite-config', 'tailwindcss'],
      '/base/': ['reg'],
    }
  },
}
