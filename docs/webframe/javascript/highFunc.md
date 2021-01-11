---
title: 从零开始，手写完整的Promise原理
date: 2020-12-30
tags:
   - Node.js
---
# 从零开始，手写完整的Promise原理
## 目标
- 掌握高阶函数的使用，使用高阶函数解决异步问题。

- 掌握发布订阅模式和观察者模式

- 掌握promise核心应用，使用promise解决异步编程问题

- 实现一个完整的promise库

- 掌握promise中常见的面试题

- 扩展promise中常见方法 all,race,finally...
- async await 实现原理


## 高阶函数
什么是高阶函数： 把函数作为参数或者返回值的一类函数。

### before函数
```js
Function.prototype.before = function(beforeFn){
    return ()=>{
        beforeFn();
        this();
    }
}
function fn(){
    console.log('source')
}
const newFn = fn.before(say=>{
    console.log('say');
});
newFn();
```

AOP(面向切面编程)的主要作用是把一些跟核心业务逻辑模块无关的功能抽离出来，其实就是给原函数增加一层，不用管原函数内部实现
### 类型检测
这种写法耦合性大 不建议 容易出错
```js
function isType(typing, params) {
  return Object.prototype.toString.call(params) === `[object ${typing}]`;
}
console.log(isType("Number", 1));
```
高阶函数 解耦


```js
function isType(typing) {
  return function (params) {
    return Object.prototype.toString.call(params) === `[object ${typing}]`;
  };
}
let uilts = {};
["Number", "String", "Boolean"].forEach((key) => {
  uilts[`is${key}`] = isType(key);
});
```
```js
调用 用起来不易出错
console.log(uilts.isNumber(9));
```
### 柯里化函数
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

### 发布订阅模式
> 其实也是为解决异步回调问题
发布订阅有个中介管理 订阅事件  然后用户可以选择发布
```js
let eventObj = {
  arr: [], //中介
  on(fn) {
    this.arr.push(fn);
  },
  emit() {
    this.arr.forEach((fn) => fn());
  },
};
fs.readFile("./a.text", "utf8", function (err, data) {
  if (err) return console.log(err);
  obj.name = data;
  eventObj.emit();
});
fs.readFile("./b.text", "utf8", function (err, data) {
  if (err) return console.log(err);
  obj.age = data;
  console.log(err, data);
  eventObj.emit();
});
//注册
eventObj.on(() => {
  if (Reflect.ownKeys(obj).length === 2) {
    console.log(obj);
  }
});
```
### 观察者模式
