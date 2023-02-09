const base = require('./base');
const sidebar = require("./sidebar")

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
        items: base.items
      },
      {
        text: '跨端',
        items: [
          {text: 'uniApp', link: '/cross/uniApp'}
        ]
      },
      {
        text: '题库',
        items: [
          {text: '高难度', link: '/question/height'},
          {text: '中难度', link: '/question/middle'},
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
    sidebar: sidebar
  },
}
