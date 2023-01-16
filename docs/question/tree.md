# 树

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