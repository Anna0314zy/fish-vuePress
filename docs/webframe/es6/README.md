## es6 目录


## reduce - compose
初级compose 
```js
let compose = (...fns) => (...args) => {
    let fn = fns.pop();
    return fns.reduceRight((a,b) => b(a), fn(...args));
}
```
终极
```js
const compose = (...fns) => fns.reduce((a, b) =>(...args) => a(b(...args)));

```
使用
```js
function sum(a, b) {
    return a + b;
}
function add$(str) {
    return 's'+ str
}
function len(str) {
    return str.length
}

const r = add$(len(sum('a', 'b')));

```
可以解决函数多层嵌套问题 清楚
```js
const r1= compose(add$, len , sum)('a','b');
```
用法2
```js
let keys = ['name', 'age'];
let values = ['珠峰', 19];
let obj = keys.reduce((a, b, i) => (a[b] = values[i],a), {});
```
>原理
```js
Array.prototype.reduce= function(callback, prev) {
    for(let i = 0; i < this.length;i++) {
        if (typeof prev === undefined) {
            prev = callback(this[i], this[i+1], i+1, this);
            i++;
        }else {
            prev = callback(prev, this[i], i, this);
        }
    }
   
    return prev
}
```
## new Set
```js
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
function deff() {
    let s1 = new Set(arr1);
    let s2 = new Set(arr2);
    return [...s1].filter(x => !s2.has(x));
}
```
