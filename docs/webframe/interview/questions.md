---
title: 常见面试题
date: 2019-08-04
tags:
   - ES6
---

## 数组的并集 交集 差集 

```javascript

const arr1 = [1,2,4,3,3,2];//[1,2,3,4]
const arr2 = [2,3,4,5];//[2,3,4,5] 差集 [1]
//并集
const union = [...new Set([...arr1,...arr2])];
//交集 [2,3]
function inserction() {
    let s1 = new Set(arr1);
    let s2 = new Set(arr2);
    return [...s1].filter(x => s2.has(x));
}
console.log(inserction())
function deff() {
    let s1 = new Set(arr1);
    let s2 = new Set(arr2);
    return [...s1].filter(x => !s2.has(x));
}
```
## 如何实现对象的深拷贝
```js
// const obj = {a:2};
// JSON.parse(JSON.stringify(obj)); //缺陷目标对象不能放函数等特殊值
//如何实现深拷贝 递归+类型判断
//instance原理 判断当前__proto__ 是否有 RegExp.prototype
// let obj = /\d+/;
// let obj = [1,2, {a:0}];
let obj = {};
obj.a = obj; //循环引用需要做特殊处理
// 我要把拷贝后的结果保留起来 下次用的时候直接 返还回去即可
function deepClone(obj, hash = new WeakMap()) {
    if (obj == null) return obj;
    if (obj instanceof RegExp) return new RegExp(obj);
    if (obj instanceof Date) return new Date(obj);
    // ...
    if (typeof obj !== 'object') return obj; //函数不需要拷贝
    //对象或者数组
    if (hash.has(obj)) return hash.get(obj);
   let instance = new obj.constructor;
   hash.set(obj, instance); //把当前拷贝前的和拷贝后的做一个映射
   for (let key in obj) { //会拷贝原型 的属性
       if (obj.hasOwnProperty(key)) {
           instance[key] = deepClone(obj[key], hash);
       }
   }
   return instance;

}
```
## 数据劫持监听
defineProperty
```js
let obj = [1,3,{c:9}];
function update() {
    console.log('视图更新')
}
let proto = Object.create(Array.prototype);
['shift','push', 'pop','shift','reverse','sort','splice'].forEach(method => {
    proto[method] = function() {
        update();
        let old  = Array.prototype[method];//调用原型上的方法 添加新的逻辑
        old.call(this, ...arguments);
    }

})
function observer(obj) {
    if (Array.isArray(obj)) return obj.__proto__ = proto;
  if (typeof obj !== 'object') return obj;
  for(let key in obj) {
      if (typeof obj[key] === 'object') observer(obj[key]);
      defineReactive(obj, key, obj[key])
  }
}
function defineReactive(obj, key, value) {
    Object.defineProperty(obj, key, {
        set(newVal) {
            if (typeof obj[key] === 'object') observer(newVal);//obj.b = {d:9};
            update();
            value = newVal;
        },
        get() {
            return value;
        }
    })
}
observer(obj);
```
proxy
```js
function update() {
    console.log('视图更新')
}
let handler = {
    set(target, key, value) {
        console.log(key, 'key');
        if (key === 'length') return true; //更新数组的话先改可以 再改可以 会有2次set
        update();
        return Reflect.set(target, key, value)
    },
    get(target, key) {
        if (typeof target[key] === 'object') {
            //如果当前对象是object 继续做代理 返回当前这个对象的代理
            return new Proxy(target[key],  handler)
        }
      return Reflect.get(target, key)
    }
}
let proxyObj = new Proxy(obj,  handler)//代理的方法有16种

proxyObj[2].b = 100; //本身并不是深度监听 
```


