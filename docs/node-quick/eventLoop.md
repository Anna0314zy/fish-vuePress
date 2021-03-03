---
title: 异步&事件环
date: 2019-01-06
tags:
   - Node.js
---


# 异步&事件环
## 一.Promise.all原理
// 判断是否是promise
```js
const isPromise = value =>{
    if((typeof value === 'object' && value !== null) ||typeof value === 'function'){
        return typeof value.then === 'function'
    }
    return false;
}
Promise.all = function (promises) {
    return new Promise((resolve,reject)=>{
        let arr = []; 
        let i = 0;
        let processData = (index,data)=>{
            arr[index] = data; // 保证返回结果顺序
            if(++i === promises.length){
                resolve(arr);
            }
        }
        for(let i = 0; i< promises.length;i++){
            let current = promises[i];
            if(isPromise(current)){
                current.then(data=>{ 
                    processData(i,data)
                },reject)
            }else{
                processData(i,current);
            }
        }
    })
}
```
>Promise.all可以解决异步并发问题，并且返回的结果按照调用的顺序进行存储。全部成功后才成功否则执行失败逻辑



## 二.Promise.race原理
#### 1.实现原理
```js
Promise.race = function (promises) {
    return new Promise((resolve, reject) => {
        // 谁返回的结果最快 就用谁的
        for (let i = 0; i < promises.length; i++) {
            let current = promises[i];
            if (isPromise(current)) {
                current.then(resolve, reject)
            } else {
                resolve(current);
            }
        }
    })
}
```
>race只采用第一个成功或者失败的结果

#2.应用场景
```js
let p = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('成功');
    }, 3000); 
})
function wrap(p){
    let abort;
    let p1 = new Promise((resolve,reject)=>{
        abort = reject;
    });
    let newPromise = Promise.race([p1,p])
    newPromise.abort = abort
    return newPromise
}
let p1 = wrap(p); 
p1.then(data => {
    console.log('success', data)
}, err => {
    console.log('error', err)
})
setTimeout(() => {
    p1.abort('超过2s了');
}, 2000);
```

借助race的特点，可以实现立即中断promise变为失败态。常用作超时操作

#三.promisify原理
```js
function promisify(fn){
    return function (...args) {
        return new Promise((resolve,reject)=>{
            fn(...args,function (err,data) {
                if(err) reject();
                resolve(data);
            })
        });
    }
}
let read = promisify(fs.readFile);
```
>我们可以快速的将node的api方法转化成promise,核心原理就是借助了error-first的特性。在内部手动处理错误

## 四.generator使用
### 1.遍历器的基本实现
```js
const interable = { 0: 'a', 1: 'b', 2: 'c', length: 3 };
interable[Symbol.iterator] = function() {
    let index = 0;
    return { // 遍历器对象
        next: () => {
            return { value: this[index], done: index++ == this.length }
        }
    }
}
```
>如果我们自己去迭代一个对象需要实现一个迭代器接口，自己返回一个具有next方法的对象。内部会调用这个next方法返回结果包含value和done,当done为true时迭代完成。

### 2.通过生成器实现
   ```js
const iterable = { 0: 'a', 1: 'b', 2: 'c', length: 3 };
iterable[Symbol.iterator] = function*() {
    let index = 0;
    while (index !== this.length) {
        yield this[index++]
    }
}
console.log([...iterable]);
```
### 3.生成器使用
```js
function * read(){ // 感觉写代码就是同步的写，但是执行还是异步嵌套的执行
    let content = yield fs.readFile('./name.txt','utf8'); // 1
    let age = yield fs.readFile(content,'utf8'); // 2
    return age;
}
```
## 五.co库原理
```js
function co(it){
    return new Promise((resolve,reject)=>{
        function next(data){
            let {value,done} = it.next(data);
            if(!done){
                Promise.resolve(value).then(data=>{
                    next(data);
                },reject)
            }else{
                resolve(value);
            }
        }
        next();
    });
}
```
>这里我们主是掌握思想，异步迭代的思想。（产生一个迭代函数，当做回调函数使用）

## 六.浏览器事件环
### 1.浏览器的进程
每一个页卡都是进程 (互不影响)

浏览器也有一个主进程 (用户界面)

渲染进程 每个页卡里 都有一个渲染进程 (浏览器内核)

网络进程 （处理请求）

GPU进程 3d绘制

第三方插件的进程

### 2. 渲染进程（包含着多个线程）
GUI渲染线程 （渲染页面的）

js引擎线程 他和页面渲染时互斥

事件触发线程 独立的线程 EventLoop

事件 click、setTimeout、ajax也是一个独立线程
![](./../.vuepress/public/images/loop.1db11d95.jpg)


### 3.宏任务,微任务
宏任务 宿主环境提供的异步方法 都是宏任务 script ui 渲染

微任务 语言标准提供promise mutationObserver

### 4.微任务和GUI渲染
```js
<script>
        document.body.style.background = 'red';
        console.log(1)
        Promise.resolve().then(()=>{
            console.log(2)
            document.body.style.background = 'yellow';
        })
        console.log(3);
</script>
```
### 5.事件任务
```js
<script>
        button.addEventListener('click',()=>{
            console.log('listener1');
            Promise.resolve().then(()=>console.log('micro task1'))
        })
        button.addEventListener('click',()=>{
            console.log('listener2');
            Promise.resolve().then(()=>console.log('micro task2'))
        })
        button.click(); // click1() click2()
// listener1
// listener2
// micro task1
// micro task2
</script>
```
### 6.定时器任务
```js
<script>
        Promise.resolve().then(() => {
            console.log('Promise1')
            setTimeout(() => {
                console.log('setTimeout2')
            }, 0);
        })
        setTimeout(() => {
            console.log('setTimeout1');
            Promise.resolve().then(() => {
                console.log('Promise2')
            })
        }, 0);
// Promise1
// setTimeout1
// Promise2
// setTimeout2
</script>
```
### 7.任务执行面试题
```js
console.log(1);
async function async () {
    console.log(2);
    await console.log(3);
    console.log(4)
}
setTimeout(() => {
	console.log(5);
}, 0);
const promise = new Promise((resolve, reject) => {
    console.log(6);
    resolve(7)
})
promise.then(res => {
	console.log(res)
})
async (); 
console.log(8);
// 1
// 6
// 2
// 3
// 8
// 7
// 4
// 5
```
掌握Vue中nextTick原理
