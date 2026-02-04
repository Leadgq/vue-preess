const base = require('./base');
const sidebar = require("./sidebar")

module.exports = {
  plugins: ["@vuepress/back-to-top"],
  title: '我的文档地址',
  description: '在线文档地址',
  base: '/vue-preess/',
  themeConfig: {
    sidebarDepth: 2,
    smoothScroll: true,
    nav: [
      { text: '主页', link: '/' },
      {
        text: '基础知识',
        items: base.items
      },
      {
        text: '跨端',
        items: [
          { text: 'uniApp', link: '/cross/uniApp' },
          { text: 'electron', link: '/cross/electron' },
        ]
      },
      { text: '常用插件', link: '/plugin/plugin' },
      {
        text: '常用配置',
        items: [
          { text: 'vite常用配置', link: '/config/vite-config' },
          { text: 'tailwindcss的配置', link: '/config/tailwindcss' },
          { text: 'nodemon配置', link: '/config/nodemon' },
          { text: 'git', link: '/config/git' },
          { text: 'vscode', link: '/config/vscode' },
          { text: 'monorepo', link: '/config/monorepo' },
          { text: 'prisma', link: '/config/prisma' },
          { text: 'three', link: '/config/three' },
          { text: 'nest', link: '/config/nest' },
        ],
      },
      {
        text: 'node',
        items: [
          { text: 'node知识', link: '/node/node' }
        ]
      },
      {
        text: '题库',
        items: [
          { text: '基础问题', link: '/question/base' },
          { text: 'AI', link: '/question/AI' },
          { text: 'langchain', link: '/question/langchain' },
        ]
      }
    ],
    sidebar
  },
}
