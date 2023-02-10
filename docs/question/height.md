# 高难度

## 树形结构获取路径名

```js
const treeData = [
  {
    name: "root",
    children: [
      {name: "src", children: [{name: "index.html"}]},
      {name: "public", children: []},
    ],
  },
];

// 返回 [root,src,index.html,pubilc]
// 这里必须使用闭包的概念、在外面使用变量
function handlerName(treeData) {
  let result = [];
  const getTreeName = (data) => {
    for (const datum of data) {
      result.push(datum['name'])
      if (datum.children && datum.children.length > 0) getTreeName(datum.children);
    }
  }
  getTreeName(treeData);
  return result;
}
```

## 深度优先的方式

```js

const tree = {
  name: 'root',
  children: [
    {
      name: 'c1',
      children: [
        {
          name: 'c11',
          children: []
        },
        {
          name: 'c12',
          children: []
        }
      ]
    },
    {
      name: 'c2',
      children: [
        {
          name: 'c21',
          children: []
        },
        {
          name: 'c22',
          children: []
        }
      ]
    }
  ]
}
// 深度优先的方式遍历 打印 name
// ['root', 'c1','c11', 'c12', 'c2', 'c21', 'c22']
function solve(root) {
  let result = [];
  const solveName = (root) => {
    for (const key in root) {
      if (key === 'name') {
        result.push(root[key])
      } else if (key === 'children') {
        root[key].forEach(item => solveName(item))
      }
    }
  }
  solveName(root);
  return result;
}
```

## JSON2DOM

```js
let root = {
  tag: 'DIV',
  attrs: {
    id: 'app'
  },
  children: [
    {
      tag: 'SPAN',
      children: [
        {tag: 'A', children: []}
      ]
    },
    {
      tag: 'SPAN',
      children: [
        {tag: 'A', children: []},
        {tag: 'A', children: []}
      ]
    }
  ]
}

function _render(vNode) {
  const {tag, attrs, children} = vNode;
  const root = document.createElement(tag.toLowerCase());
  for (let key in attrs) {
    root.setAttribute(key, attrs[key]);
  }
  if (typeof children === 'string') {
    root.appendChild(document.createTextNode(children))
  } else if (Array.isArray(children) && children.length > 0) {
    children.forEach(item => root.appendChild(_render(item)))
  }
  return root;
}

document.body.appendChild(_render(vDom))
```

## 查找json中的children路径

```js
  //已知每个节点id唯一，编写findNode(id)，返回路径，如findNode(5 输出 1->4->5
const json = {
  id: 1,
  children: [
    {id: 2, children: [{id: 3, children: []}]},
    {
      id: 4,
      children: [
        {id: 5, children: []},
        {id: 6, children: []},
      ],
    },
    {id: 7, children: []},
  ],
};

function findNode(obj, target) {
  const res = []

  function dfs(obj, path, target) {
    if (!obj) return;
    if (obj.id === target) {
      path += obj.id;
      res.push(path);
      return;
    }
    path += obj.id + '->';
    obj.children && obj.children.forEach((ele) => {
      dfs(ele, path, target);
    })
  }

  dfs(obj, '', target);
  return res;
}
```

## 对象字符串转化成树形结构

```js
let strArr = {
  'a-b-c-d': 1,
  'a-b-c-e': 2,
  'a-b-f': 3,
  'a-j': 4
}

function transformation(obj) {
  return Object.keys(obj).reduce((acc, cur) => {
    const keys = cur.split("-");
    let temp = acc;
    keys.forEach((key, index) => {
      if (index === keys.length - 1) {
        temp[key] = obj[cur];
      } else {
        if (!temp[key]) temp[key] = {};
        temp = temp[key];
      }
    });
    return acc;
  }, {});
}
```

## 非递归实现树的遍历(深度优先)

```js
let treeData = [{
  key: '1',
  title: 'Parent 1',
  check: false,
  children: [{
    key: '1-1',
    title: 'child 1',
    check: false,
  }, {
    key: '1-2',
    title: 'child 2',
    check: false,
    children: [{
      key: '1-2-1',
      title: 'grandchild 1',
      check: false,
    }, {
      key: '1-2-2',
      title: 'grandchild 2',
      check: false,
    },]
  },]
}];

function findKey(treeData, key) {
  const stack = [...treeData];
  let nodes = [];
  while (Array.isArray(stack) && stack.length > 0) {
    const item = stack.pop();
    const children = item.children || [];
    if (item.key === key) {
      nodes.push(item);
      break;
    }
    for (let i = children.length - 1; i >= 0; i--) {
      // 下一次循环将会执行当前item的children 
      stack.push(children[i]);
    }
  }
  return nodes;
}
```

## 非递归广度优先

```js
// 先进先出
function breadthFirstSearch(treeData, key) {
  const stack = [...treeData];
  const result = [];
  while (Array.isArray(stack) && stack.length > 0) {
    // 弹出头部
    const node = stack.shift();
    if (node.key === key) {
      result.push(item);
      break;
    }
    const len = node.children && node.children.length;
    for (let i = 0; i < len; i++) {
      // 将当前节点的children都放到后面、下一次执行将走同层
      stack.push(node.children[i])
    }
  }
  return result;
}
```

## 获取树结构中的name

```js
let data = [
  {
    "name": "1-1",
    "kind": "oo",
    "children": [
      {
        "name": "2-2",
        "kind": "ii",

      },
      {
        "name": "3-3",
        "children": [
          {
            "name": "4-4",
            "children": [
              {
                "name": '707'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "name": "5-5",
  },
  {
    "name": "6-6"
  }
]

function getName(data, key = "name") {
  let result = [];

  function dfs(data, key) {
    data.forEach((item) => {
      if (item[key]) result.push(item[key]);
      if (item.children && item.children.length > 0) dfs(item.children, key);
    });
  }

  dfs(data, key);
  return result;
}

function getName2(data, key = 'name') {
  let result = [];
  if (Array.isArray(data)) {
    for (let item of data) {
      if (item[key]) result.push(item[key])
      if (item.children && item.children.length > 0) result = result.concat(item.children);
    }
    return result;
  } else {
    return result;
  }
}
```

## 获取url中的参数

```
描述: 需要获取url中的参数 '?type=host&id=192331255'
```

```js
const params = window.URLSearchParams(window.location.search);
// params是可迭代对象、具体查看mdn
for (const [key, value] of params)
```

## 获取下标

```
描述：请你写出一个当前数组的下一个index是什么的函数
let  arr = [15,22,66];
findLastIndexFn(22) ==> 3
findLastIndexFn(66) ==> 0
```

```ts
const findLastIndexFn = (data: number[], value: number): number => {
    return (arr.indexOf(item => item === value) + 1) % arr.length;
}
```

```js
function findIndexFn(data, key, value) {
  return (arr.findIndex(item => item[key] === value) + 1) % arr.length
}
```

## 红绿灯

```
描述：红绿灯，红灯3秒亮一次，绿灯1秒亮一次，黄灯2秒亮一次；如何让三个灯不断交替重复亮灯？ (发布订阅模式)
```

```js 
class eventEmitter {
  // 延迟函数
  delay(time) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      }, time * 1000);
    })
  }

  constructor(options) {
    this.sing = options.init;
    this.time = options.time;
    this.light = options.light;
    this.enventMap = new Map();
    this.enventMap.set('trick', new Set());
    this.enventMap.set('exchange', new Set());
    this.setTime();
    this.exchange();
  }

  //  订阅
  on(event, handler) {
    this.enventMap.get(event).add(handler);
  }

  // 取消订阅
  off(event, handler) {
    this.enventMap.get(event).delete(handler);
  }

  // 发布
  emit(event) {
    this.enventMap.get(event).forEach(handler => handler.call(this, this))
  }


  get next() {
    return this.light[(this.light.findIndex(item => item === this.sing) + 1) % this.light.length];
  }

  get remain() {
    let diff = this.endTime - new Date().getTime();
    if (diff < 0) diff = 0;
    return diff / 1000;
  }

  // 切换
  async exchange() {
    await 1;
    if (this.remain > 0) {
      await this.delay(1);
      this.emit("trick")
    } else {
      this.sing = this.next;
      this.setTime();
      this.emit("exchange")
    }
    await this.exchange();
  }

  // 记录时间
  setTime() {
    this.startTime = new Date().getTime();
    const index = this.light.findIndex(item => item === this.sing);
    this.endTime = this.startTime + this.time[index] * 1000;
  }
}

const event = new eventEmitter({
  init: 'red',
  light: ['red', 'yellow', 'green'],
  // 时间
  time: [10, 5, 3],
})

event.on("trick", (event) => {
  console.log(event, '我是1')
})

event.off('trick')
```

## 扁平对象

```js
  const obj = {
  a: 1,
  b: [1, 2, {c: true}],
  c: {e: 2, f: 3},
  g: null,
};
// 转换成这样
let objRes = {
  a: 1,
  "b[0]": 1,
  "b[1]": 2,
  "b[2].c": true,
  "c.e": 2,
  "c.f": 3,
  g: null,
};
```

```js
function flatenObject(obj) {
  let result = {};
  const process = (key, value) => {
    if (Object(value) !== value) {
      if (key) result[key] = value;
    } else if (Array.isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        process(`${key}[${i}]`, value[i])
      }
      if (value.length === 0) result[key] = []
    } else {
      const keys = Object.keys(value);
      key.forEach((item) => {
        process(key ? `${key}.${item}` : item, value[item])
      })
      if (keys.length === 0 && key) result[key] = {};
    }
  }
  process('', obj);
  return result;
}
```
