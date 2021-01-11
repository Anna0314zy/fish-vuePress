---
title: 面试题
date: 2019-06-11
tags:
   - Vue
   - Vuex
---

[[toc]]
## 九宫格高亮
考察点: 九宫格高亮的时候 要显示边框 如何控制样式
```less
ul {
  display: flex;
  flex-direction:row;
  flex-wrap:wrap;
  width:300px;
  height:300px;
  li {
    width:33%;
    list-style:none;
    border:1px solid #ccc;
    box-sizing:border-box;
    margin-right:-1px;
    margin-bottom:-1px;
    &.actiive {
      border: 1px solid red;
      position: relative;
    }
  }
}
```
## 如果获取页面的所有html标签
- 如果节点是一个元素节点，nodeType 属性返回1

- 如果节点是属性节点, nodeType 属性返回2 如`script标签的type="text/javascript"`

- 如果节点是一个文本节点，nodeType 属性返回3`标签中的文本`

- 如果节点是一个注释节点，nodeType 属性返回8
```js
let arr = [];
    let findTagName = (nodeList) => {
      if (nodeList.nodeType === 1) {
        arr.push(nodeList.tagName);
      }
      let children = nodeList.childNodes;
      if (children && children.length > 0) {
        Array.from(children,  child=> findTagName(child))
      }
    }
    findTagName(document);
    console.log(new Set(arr));
```
## 柯里化函数
> 科里化简化传参，参数只有一个，返回的是一个高阶函数, 函数的主要作用收集参数,参数够了执行回调函数

通用的柯里化函数
```js
const curring = (fn, arr = []) => {
  let len = fn.length;
  return function (...args) {
    const newArgs = [...arr, ...args];
    if (newArgs.length === len) {
      return fn(...newArgs);
    } else {
      return curring(fn, newArgs);
    }
  };
};
```
使用
```js
function sum(a, b, c, d, e) {
  return a + b + c + d + e;
}
let newSum = curring(sum);
console.log(newSum(1, 3, 3)(4, 5));
console.log(newSum(1)(2)(3)(4)(4));
```
```js
类型检测
function isType(typing) {
  return function (params) {
    return Object.prototype.toString.call(params) === `[object ${typing}]`;
  };
}
//拿到类型
let isNumber = isType("String");
//执行
console.log(isNumber(12));
```

