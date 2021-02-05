---
title: 搞不懂JS中赋值·浅拷贝·深拷贝的请看这里
date: 2019-07-14
tags:
  - Javascript
---

[[toc]]
::: tip
本篇所讲的浅拷贝和深拷贝都是对于引用类型的，对于基础类型不会有这种操作
:::

## 数据类型与堆栈的关系

### 基本类型与引用类型

- 基本类型：undefined,null,Boolean,String,Number,Symbol

- 引用类型：Object,Array,Date,Function,RegExp 等

### 存储方式

- 基本类型：基本类型值在内存中占据固定大小，保存在`栈内存`中（不包含`闭包`中的变量）

![](https://user-gold-cdn.xitu.io/2019/7/8/16bd2282836bad2c?w=370&h=346&f=jpeg&s=17652)

- 引用类型：引用类型的值是对象，保存在`堆内存`中。而栈内存存储的是对象的变量标识符以及对象在堆内存中的存储地址(引用)，引用数据类型在栈中存储了指针，该指针指向堆中该实体的起始地址。当解释器寻找引用值时，会首先检索其在栈中的地址，取得地址后从堆中获得实体。

![](https://user-gold-cdn.xitu.io/2019/7/8/16bd228c2ad68a18?w=758&h=256&f=jpeg&s=24273)

## 浅拷贝

### 浅拷贝定义：

> 新的对象复制已有对象中非对象属性的值和对象属性的引用
> 如果这种说法不理解换一种一个新的对象直接拷贝已存在的对象的对象属性的引用,即浅拷贝

### 浅拷贝方法

- Array.prototype.slice
- Object.assign(target, ...sources)
  - Object.assign 注意事项
  1. 只拷贝源对象的自身属性（不拷贝继承属性）
  2. 它不会拷贝对象不可枚举的属性
  3. `undefined`和`null`无法转成对象，它们不能作为`Object.assign`参数，但是可以作为源对象
- Array.prototype.concat
- cloneObj = { ...obj };
  以上 4 中浅拷贝方式都不会改变原数组，只会返回一个浅拷贝了原数组中的元素的一个新数组。

### 自己实现一个浅拷贝

实现原理：新的对象复制已有对象中非对象属性的值和对象属性的`引用`,也就是说对象属性并不复制到内存。

- 实现代码:

```javascript
function cloneShallow(source) {
  var target = {};
  for (var key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      target[key] = source[key];
    }
  }
  return target;
}
```

**for in**

for...in 语句以任意顺序遍历一个对象自有的、继承的、`可枚举的`、非 Symbol 的属性。对于每个不同的属性，语句都会被执行。

**hasOwnProperty**

> 语法：obj.hasOwnProperty(prop)  
> prop 是要检测的属性`字符串`名称或者`Symbol`

该函数返回值为布尔值，所有继承了 Object 的对象都会继承到 hasOwnProperty 方法，和 in 运算符不同，该函数会忽略掉那些从原型链上继承到的属性和自身属性。

## 深拷贝操作

说了赋值操作和浅拷贝操作，大家是不是已经能想到什么是深拷贝了，下面直接说深拷贝的定义。

### 深拷贝定义

> 深拷贝会另外拷贝一份一个一模一样的对象,从堆内存中开辟一个新的区域存放新对象,新对象跟原对象不共享内存，修改新对象不会改到原对象。

### 深拷贝实例

#### JSON.parse(JSON.stringify())

JSON.stringify()是前端开发过程中比较常用的深拷贝方式。原理是把一个对象序列化成为一个 JSON 字符串，将对象的内容转换成字符串的形式再保存在磁盘上，再用 JSON.parse()反序列化将 JSON 字符串变成一个新的对象

实现了深拷贝，当改变数组中对象的值时候，原数组中的内容并没有发生改变。JSON.stringify()虽然可以实现深拷贝，但是还有一些弊端比如不能处理函数等。

- JSON.stringify()实现深拷贝注意点

1. 拷贝的对象的值中如果有函数,undefined,symbol 则经过 JSON.stringify()序列化后的 JSON 字符串中这个键值对会消失
2. 无法拷贝不可枚举的属性，无法拷贝对象的原型链
3. 拷贝 Date 引用类型会变成字符串
4. 拷贝 RegExp 引用类型会变成空对象
5. 对象中含有 NaN、Infinity 和-Infinity，则序列化的结果会变成 null
6. 无法拷贝对象的循环应用(即 obj[key] = obj)

#### 自己实现一个简单深拷贝

深拷贝，主要用到的思想是递归，遍历对象、数组直到里边都是基本数据类型，然后再去复制，就是深度拷贝。
实现代码：

```javascript
let obj = {};
obj.a = obj; //循环引用需要做特殊处理
// 我要把拷贝后的结果保留起来 下次用的时候直接 返还回去即可
function deepClone(obj, hash = new WeakMap()) {
  if (obj == null) return obj;
  if (obj instanceof RegExp) return new RegExp(obj);
  if (obj instanceof Date) return new Date(obj);
  // ...
  if (typeof obj !== "object") return obj; //函数不需要拷贝
  //如果循环引用了就用new WeakMap
  if (hash.has(obj)) return hash.get(obj);
 //对象或者数组 拿到实例
  let instance = new obj.constructor();
  console.log(instance, "instance");
  hash.set(obj, instance); //把当前拷贝前的和拷贝后的做一个映射
  for (let key in obj) {
    //会拷贝原型 的属性
    if (obj.hasOwnProperty(key)) {
      instance[key] = deepClone(obj[key], hash);
    }
  }
  return instance;
}
let newObj = deepClone(obj);
```
方法二
```js
const isComplexDataType = obj => (typeof obj === 'object' || typeof obj === 'function') && (obj !== null)
const deepClone = function (obj, hash = new WeakMap()) {
  if (obj.constructor === Date) 
  return new Date(obj)       // 日期对象直接返回一个新的日期对象
  if (obj.constructor === RegExp)
  return new RegExp(obj)     //正则对象直接返回一个新的正则对象
  //如果循环引用了就用 weakMap 来解决
  if (hash.has(obj)) return hash.get(obj)
  let allDesc = Object.getOwnPropertyDescriptors(obj)
  //遍历传入参数所有键的特性
  let cloneObj = Object.create(Object.getPrototypeOf(obj), allDesc)
  //继承原型链
  hash.set(obj, cloneObj)
  for (let key of Reflect.ownKeys(obj)) { 
    cloneObj[key] = (isComplexDataType(obj[key]) && typeof obj[key] !== 'function') ? deepClone(obj[key], hash) : obj[key]
  }
  return cloneObj
}
// 下面是验证代码
let obj = {
  num: 0,
  str: '',
  boolean: true,
  unf: undefined,
  nul: null,
  obj: { name: '我是一个对象', id: 1 },
  arr: [0, 1, 2],
  func: function () { console.log('我是一个函数') },
  date: new Date(0),
  reg: new RegExp('/我是一个正则/ig'),
  [Symbol('1')]: 1,
};
Object.defineProperty(obj, 'innumerable', {
  enumerable: false, value: '不可枚举属性' }
);
obj = Object.create(obj, Object.getOwnPropertyDescriptors(obj))
obj.loop = obj    // 设置loop成循环引用的属性
let cloneObj = deepClone(obj)
cloneObj.arr.push(4)
console.log('obj', obj)
console.log('cloneObj', cloneObj)
```
## 拷贝内容总结

用一张图总结

![](http://img.xiaogangzai.cn/article_16.jpg)
