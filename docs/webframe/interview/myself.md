---
title: 面试题总结
date: 2019-08-04
tags:
   - ES6
---

## 浏览器渲染
性能优化是前端开发中避不开的问题，性能问题无外乎两方面原因：渲染速度慢、请求时间长。性能优化虽然涉及很多复杂的原因和解决方案，但其实只要通过合理地使用标签，就可以在一定程度上提升渲染速度以及减少请求时间。

###  script 标签：调整加载顺序提升渲染速度
由于浏览器的底层运行机制，渲染引擎在解析 HTML 时，若遇到 script 标签引用文件，则会暂停解析过程，同时通知网络线程加载文件，文件加载后会切换至 JavaScript 引擎来执行对应代码，代码执行完成之后切换至渲染引擎继续渲染页面。

在这一过程中可以看到，页面渲染过程中包含了请求文件以及执行文件的时间，但页面的首次渲染可能并不依赖这些文件，这些请求和执行文件的动作反而延长了用户看到页面的时间，从而降低了用户体验。

为了减少这些时间损耗，可以借助 script 标签的 3 个属性来实现。

   - async 属性。立即请求文件，但不阻塞渲染引擎，而是文件加载完毕后阻塞渲染引擎并立即执行文件内容。

   - defer 属性。立即请求文件，但不阻塞渲染引擎，等到解析完 HTML 之后再执行文件内容。

    - HTML5 标准 type 属性，对应值为“module”。让浏览器按照 ECMA Script 6 标准将文件当作模块进行解析，默认阻塞效果同 defer，也可以配合 async 在请求完成后立即执行。


从图中可以得知，采用 3 种属性都能减少请求文件引起的阻塞时间，只有 defer 属性以及 type="module" 情况下能保证渲染引擎的优先执行，从而减少执行文件内容消耗的时间，让用户更快地看见页面（即使这些页面内容可能并没有完全地显示）。

除此之外还应当注意，当渲染引擎解析 HTML 遇到 script 标签引入文件时，会立即进行一次渲染。所以这也就是为什么构建工具会把编译好的引用 JavaScript 代码的 script 标签放入到 body 标签底部，因为当渲染引擎执行到 body 底部时会先将已解析的内容渲染出来，然后再去请求相应的 JavaScript 文件。如果是内联脚本（即不通过 src 属性引用外部脚本文件直接在 HTML 编写 JavaScript 代码的形式），渲染引擎则不会渲染。


### link 标签：通过预处理提升渲染速度
- dns-prefetch。当 link 标签的 rel 属性值为“dns-prefetch”时，浏览器会对某个域名预先进行 DNS 解析并缓存。这样，当浏览器在请求同域名资源的时候，能省去从域名查询 IP 的过程，从而减少时间损耗。下图是淘宝网设置的 DNS 预解析。

- preconnect。让浏览器在一个 HTTP 请求正式发给服务器前预先执行一些操作，这包括 DNS 解析、TLS 协商、TCP 握手，通过消除往返延迟来为用户节省时间。

- prefetch/preload。两个值都是让浏览器预先下载并缓存某个资源，但不同的是，prefetch 可能会在浏览器忙时被忽略，而 preload 则是一定会被预先下载。

- prerender。浏览器不仅会加载资源，还会解析执行页面，进行预渲染。

## MVC 和 MVVM 区别
传统的 MVC 指的是,用户操作会请求服务端路由，路由会调用对应的控制器来处理,控制器会获取数 据。将结果返回给前端,页面重新渲染
MVVM :传统的前端会将数据手动渲染到页面上, MVVM 模式不需要用户收到操作 dom 元素,
将数据绑 定到 viewModel 层上，会自动将数据渲染到页面中，
视图变化会通知 viewModel层 更新数据。 ViewModel 就是我们 MVVM 模式中的桥梁. 
Vue并没有完全遵循MVVM模型，严格的MVVM模式中,View层不能直接和Model层通信,只能通过ViewModel来进行通信。


## 组件间如何通信

```js
function broadcast(componentName, eventName, params) {
  this.$children.forEach(child => {
    var name = child.$options.componentName;

    if (name === componentName) {
      child.$emit.apply(child, [eventName].concat(params));
    } else {
      broadcast.apply(child, [componentName, eventName].concat([params]));
    }
  });
}
export default {
  methods: {
    dispatch(componentName, eventName, params) {
      var parent = this.$parent || this.$root;
      var name = parent.$options.componentName;

      while (parent && (!name || name !== componentName)) {
        parent = parent.$parent;

        if (parent) {
          name = parent.$options.componentName;
        }
      }
      if (parent) {
        parent.$emit.apply(parent, [eventName].concat(params));
      }
    },
    broadcast(componentName, eventName, params) {
      broadcast.call(this, componentName, eventName, params);
    }
  }
};
```
## 3.vue的双向绑定原理

数据--->驱动视图 

视图改变去驱动数据

```js
//手写vue的数据双向绑定原理

// import { nextTick } from "../util";

// 原理 new Vue 对申明在data里的数据 每一项声明 getter 和 Setter 

//数组观测是改写数组原型改写 切片编程 加一些逻辑 

let data = {
    name: 'zy',
    obj:{
        name:'li'
    },
    arr:[
        {
            name:'zou'
        }
    ]
}

let oldPrototype = Array.prototype;

let arraryProtype = Object.create(oldPrototype);

const methods = [
    'shift',
    'unshift',
    'pop',
    'push',
    'reverse',
    'splice'

]

methods.forEach(method => {
    arraryProtype[method] = function(...args) {
       oldPrototype[method].call(this, ...args);
       console.log(method,args)
       let inserted;
       let ob = this.__ob__;
       switch(method) {
           case 'unshift':
           case 'push':
            inserted = args;
            break;
            case 'splice':
            inserted = args.splice(2);
            break;
       }

       console.log(inserted,'inserted');
       if (inserted) ob.observeArray(inserted);

       ob.update();
    }
})

class Observe {
    constructor(data) {
        Object.defineProperty(data,'__ob__',{
            value:this,
            enumerable:false
        })

        if (Array.isArray(data)) {

            data.__proto__ = arraryProtype;

        }else {
            this.walk(data);
        }

    }
    walk(data) {
        Object.keys(data).forEach(key=> {
            defineReative(data,key,data[key])
        })
    }
    observeArray(value){
        value.forEach(item=>{
            observe(item); // 观测数组中的对象类型
        })
    }

    update() {
        console.log('数组修改了');
    }
}
observe(data);

//观测数据变化
function observe(data) {
    if (typeof data !=='object' && data !== null) return;

    if (data.__ob__) {
        return data.__ob__;
    }
    return new Observe(data);

}

function defineReative(data,key,value) {
    observe(value);

    Object.defineProperty(data,key,{
        get() {
            return value
        },
        set(newVal) {
            console.log('更新了---')
            value = newVal

        }
    })

}
data.name = 'ppp'
// data.obj.name= 'pppp'
data.arr.push({
    name:'ppp'
})
//数据驱动视图  视图更改影响数据
```
```js

const toProxy = new WeakMap(); // 存放被代理过的对象
const toRaw = new WeakMap(); // 存放已经代理过的对
function reactive(target){
  // 创建响应式对象
  return createReactiveObject(target);
}
function isObject(target){
  return typeof target === 'object' && target!== null;
}

function hasOwn(target,key){
  return target.hasOwnProperty(key);
}
function createReactiveObject(target){
  // 判断target是不是对象,不是对象不必继续
  console.log(target)
  if(!isObject(target)){
      return target;
  }
 
  let observed = toProxy.get(target);
  if(observed){ // 判断是否被代理过
    return observed;
  }
  if(toRaw.has(target)){ // 判断是否要重复代理
    return target;
  }
  const handlers = {
      get(target,key,receiver){ // 取值
        console.log("获取");
        let res = Reflect.get(target, key, receiver);
        return isObject(res) // 懒代理，只有当取值时再次做代理，vue2.0中一上来就会全部递归增加getter,setter
        ? reactive(res) : res;
    
      },
      set(target,key,value,receiver){ // 更改 、 新增属性
        let oldValue = target[key]; // 获取上次的值
        let hadKey = hasOwn(target,key); // 看这个属性是否存在
        let result = Reflect.set(target, key, value, receiver);
        if(!hadKey){ // 新增属性
            console.log('更新 添加')
        }else if(oldValue !== value){ // 修改存在的属性
            console.log('更新 修改')
        }
        // 当调用push 方法第一次修改时数组长度已经发生变化
        // 如果这次的值和上次的值一样则不触发更新
    
          return result;
      },
      deleteProperty(target,key){ // 删除属性
          console.log('删除')
          const result = Reflect.deleteProperty(target,key);
          return result;
      }
  }
  // 开始代理
  observed = new Proxy(target,handlers);
  
  return observed;
}
let p = reactive({name:'youxuan',obj:{a:1}});
console.log(p.name); // 获取
console.log(p.obj.a); // 获取

// p.name = 'webyouxuan'; // 设置
// p.age = 10
p.obj.a = 10
delete p.name; // 删除
console.log(p);
```
## 浏览器 渲染


性能优化
性能优化是前端开发中避不开的问题，性能问题无外乎两方面原因：渲染速度慢、请求时间长。性能优化虽然涉及很多复杂的原因和解决方案，但其实只要通过合理地使用标签，就可以在一定程度上提升渲染速度以及减少请求时间。

script 标签：调整加载顺序提升渲染速度
由于浏览器的底层运行机制，渲染引擎在解析 HTML 时，若遇到 script 标签引用文件，则会暂停解析过程，同时通知网络线程加载文件，文件加载后会切换至 JavaScript 引擎来执行对应代码，代码执行完成之后切换至渲染引擎继续渲染页面。

在这一过程中可以看到，页面渲染过程中包含了请求文件以及执行文件的时间，但页面的首次渲染可能并不依赖这些文件，这些请求和执行文件的动作反而延长了用户看到页面的时间，从而降低了用户体验。

为了减少这些时间损耗，可以借助 script 标签的 3 个属性来实现。

async 属性。立即请求文件，但不阻塞渲染引擎，而是文件加载完毕后阻塞渲染引擎并立即执行文件内容。

defer 属性。立即请求文件，但不阻塞渲染引擎，等到解析完 HTML 之后再执行文件内容。

HTML5 标准 type 属性，对应值为“module”。让浏览器按照 ECMA Script 6 标准将文件当作模块进行解析，默认阻塞效果同 defer，也可以配合 async 在请求完成后立即执行。


从图中可以得知，采用 3 种属性都能减少请求文件引起的阻塞时间，只有 defer 属性以及 type="module" 情况下能保证渲染引擎的优先执行，从而减少执行文件内容消耗的时间，让用户更快地看见页面（即使这些页面内容可能并没有完全地显示）。

除此之外还应当注意，当渲染引擎解析 HTML 遇到 script 标签引入文件时，会立即进行一次渲染。所以这也就是为什么构建工具会把编译好的引用 JavaScript 代码的 script 标签放入到 body 标签底部，因为当渲染引擎执行到 body 底部时会先将已解析的内容渲染出来，然后再去请求相应的 JavaScript 文件。如果是内联脚本（即不通过 src 属性引用外部脚本文件直接在 HTML 编写 JavaScript 代码的形式），渲染引擎则不会渲染。


link 标签：通过预处理提升渲染速度
dns-prefetch。当 link 标签的 rel 属性值为“dns-prefetch”时，浏览器会对某个域名预先进行 DNS 解析并缓存。这样，当浏览器在请求同域名资源的时候，能省去从域名查询 IP 的过程，从而减少时间损耗。下图是淘宝网设置的 DNS 预解析。

preconnect。让浏览器在一个 HTTP 请求正式发给服务器前预先执行一些操作，这包括 DNS 解析、TLS 协商、TCP 握手，通过消除往返延迟来为用户节省时间。

prefetch/preload。两个值都是让浏览器预先下载并缓存某个资源，但不同的是，prefetch 可能会在浏览器忙时被忽略，而 preload 则是一定会被预先下载。

prerender。浏览器不仅会加载资源，还会解析执行页面，进行预渲染。

## http
协议版本	解决的核心问题	解决方式
0.9	HTML 文件传输	确立了客户端请求、服务端响应的通信流程
1.0	不同类型文件传输	设立头部字段
1.1	创建/断开 TCP 连接开销大	建立长连接进行复用
2	并发数有限	二进制分帧
3	TCP 丢包阻塞	采用 UDP 协议

## 强缓存 和 协商缓存

需要注意的是，cache-control 的 max-age 优先级高于 Expires，也就是说如果它们同时出现，浏览器会使用 max-age 的值。

http 1.0 Expires


http 1.1 Cache-Control

no-cache，表示使用协商缓存，即每次使用缓存前必须向服务端确认缓存资源是否更新；

no-store，禁止浏览器以及所有中间缓存存储响应内容；

public，公有缓存，表示可以被代理服务器缓存，可以被多个用户共享；

private，私有缓存，不能被代理服务器缓存，不可以被多个用户共享；

max-age，以秒为单位的数值，表示缓存的有效时间；

must-revalidate，当缓存过期时，需要去服务端校验缓存的有效性。

需要注意的是，cache-control 的 max-age 优先级高于 Expires，也就是说如果它们同时出现，浏览器会使用 max-age 的值。

cache-control: public, max-age=31536000

协商缓存

协商缓存的更新策略是不再指定缓存的有效时间了，而是浏览器直接发送请求到服务端进行确认缓存是否更新，如果请求响应返回的 HTTP 状态为 304，则表示缓存仍然有效。控制缓存的难题就是从浏览器端转移到了服务端。

1. Last-Modified 和 If-Modified-Since

服务端要判断缓存有没有过期，只能将双方的资源进行对比。若浏览器直接把资源文件发送给服务端进行比对的话，网络开销太大，而且也会失去缓存的意义，所以显然是不可取的。有一种简单的判断方法，那就是通过响应头部字段 Last-Modified 和请求头部字段 If-Modified-Since 比对双方资源的修改时间。

具体工作流程如下：

浏览器第一次请求资源，服务端在返回资源的响应头中加入 Last-Modified 字段，该字段表示这个资源在服务端上的最近修改时间；

当浏览器再次向服务端请求该资源时，请求头部带上之前服务端返回的修改时间，这个请求头叫 If-Modified-Since；

服务端再次收到请求，根据请求头 If-Modified-Since 的值，判断相关资源是否有变化，如果没有，则返回 304 Not Modified，并且不返回资源内容，浏览器使用资源缓存值；否则正常返回资源内容，且更新 Last-Modified 响应头内容。

这种方式虽然能判断缓存是否失效，但也存在两个问题：

精度问题，Last-Modified 的时间精度为秒，如果在 1 秒内发生修改，那么缓存判断可能会失效；

准度问题，考虑这样一种情况，如果一个文件被修改，然后又被还原，内容并没有发生变化，在这种情况下，浏览器的缓存还可以继续使用，但因为修改时间发生变化，也会重新返回重复的内容。

2. ETag 和 If-None-Match

为了解决精度问题和准度问题，HTTP 提供了另一种不依赖于修改时间，而依赖于文件哈希值的精确判断缓存的方式，那就是响应头部字段 ETag 和请求头部字段 If-None-Match。

具体工作流程如下：

浏览器第一次请求资源，服务端在返响应头中加入 Etag 字段，Etag 字段值为该资源的哈希值；

当浏览器再次跟服务端请求这个资源时，在请求头上加上 If-None-Match，值为之前响应头部字段 ETag 的值；

服务端再次收到请求，将请求头 If-None-Match 字段的值和响应资源的哈希值进行比对，如果两个值相同，则说明资源没有变化，返回 304 Not Modified；否则就正常返回资源内容，无论是否发生变化，都会将计算出的哈希值放入响应头部的 ETag 字段中。

这种缓存比较的方式也会存在一些问题，具体表现在以下两个方面。

计算成本。生成哈希值相对于读取文件修改时间而言是一个开销比较大的操作，尤其是对于大文件而言。如果要精确计算则需读取完整的文件内容，如果从性能方面考虑，只读取文件部分内容，又容易判断出错。

计算误差。HTTP 并没有规定哈希值的计算方法，所以不同服务端可能会采用不同的哈希值计算方式。这样带来的问题是，同一个资源，在两台服务端产生的 Etag 可能是不相同的，所以对于使用服务器集群来处理请求的网站来说，使用 Etag 的缓存命中率会有所降低。

需要注意的是，强制缓存的优先级高于协商缓存，在协商缓存中，Etag 优先级比 Last-Modified 高。既然协商缓存策略也存在一些缺陷，那么我们转移到浏览器端看看 ServiceWorker 能不能给我们带来惊喜。

ServiceWorker
ServiceWorker 是浏览器在后台独立于网页运行的脚本，也可以这样理解，它是浏览器和服务端之间的代理服务器。ServiceWorker 非常强大，可以实现包括推送通知和后台同步等功能，更多功能还在进一步扩展，但其最主要的功能是实现离线缓存。

1. 使用限制
越强大的东西往往越危险，所以浏览器对 ServiceWorker 做了很多限制：

在 ServiceWorker 中无法直接访问 DOM，但可以通过 postMessage 接口发送的消息来与其控制的页面进行通信；

ServiceWorker 只能在本地环境下或 HTTPS 网站中使用；

ServiceWorker 有作用域的限制，一个 ServiceWorker 脚本只能作用于当前路径及其子路径；

由于 ServiceWorker 属于实验性功能，所以兼容性方面会存在一些问题，具体兼容情况请看下面的截图。



ServiceWorker 在浏览器中的支持情况

2. 使用方法
在使用 ServiceWorker 脚本之前先要通过“注册”的方式加载它。常见的注册代码如下所示：

```js
复制代码
if ('serviceWorker' in window.navigator) {
  window.navigator.serviceWorker
    .register('./sw.js')
    .then(console.log)
    .catch(console.error)
} else {
  console.warn('浏览器不支持 ServiceWorker!')
```
首先考虑到浏览器的兼容性，判断 window.navigator 中是否存在 serviceWorker 属性，然后通过调用这个属性的 register 函数来告诉浏览器 ServiceWorker 脚本的路径。

浏览器获取到 ServiceWorker 脚本之后会进行解析，解析完成会进行安装。可以通过监听 “install” 事件来监听安装，但这个事件只会在第一次加载脚本的时候触发。要让脚本能够监听浏览器的网络请求，还需要激活脚本。

在脚本被激活之后，我们就可以通过监听 fetch 事件来拦截请求并加载缓存的资源了。

下面是一个利用 ServiceWorker 内部的 caches 对象来缓存文件的示例代码。
```js

复制代码
const CACHE_NAME = 'ws'
let preloadUrls = ['/index.css']

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
    .then(function (cache) {
      return cache.addAll(preloadUrls);
    })
  );
});
self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request)
    .then(function (response) {
      if (response) {
        return response;
      }
      return caches.open(CACHE_NAME).then(function (cache) {
          const path = event.request.url.replace(self.location.origin, '')
          return cache.add(path)
        })
        .catch(e => console.error(e))
    })
  );
})
```
这段代码首先监听 install 事件，在回调函数中调用了 event.waitUntil() 函数并传入了一个 Promise 对象。event.waitUntil 用来监听多个异步操作，包括缓存打开和添加缓存路径。如果其中一个操作失败，则整个 ServiceWorker 启动失败。

然后监听了 fetch 事件，在回调函数内部调用了函数 event.respondWith() 并传入了一个 Promise 对象，当捕获到 fetch 请求时，会直接返回 event.respondWith 函数中 Promise 对象的结果。

在这个 Promise 对象中，我们通过 caches.match 来和当前请求对象进行匹配，如果匹配上则直接返回匹配的缓存结果，否则返回该请求结果并缓存。

总结
缓存是解决性能问题的重要手段，使用缓存的好处很多，除了能让浏览器更快地加载网络资源之外，还会带来其他好处，比如节省网络流量和带宽，以及减少服务端的负担。

本课时介绍了 HTTP 缓存策略及 ServiceWorker，HTTP 缓存可以分为强制缓存和协商缓存，强制缓存就是在缓存有效期内直接使用浏览器缓存；协商缓存则需要先询问服务端资源是否发生改变，如果未改变再使用浏览器缓存。

ServiceWorker 可以用来实现离线缓存，主要实现原理是拦截浏览器请求并返回缓存的资源文件。

## $set

不能监听到对象新增属性

数组不能够操作索引去响应数据的变化

```js
function set(target,key,val) {
  if (Array.isArray(target)) {
     target.splice(key,1,val)
     return val;
  }
  const ob = target.__ob__;
  if (!ob) {
      target[key] = val;
      return val;
  }
  defineReative(ob.value,key,val)
  ob.dep.notify();
}
```


## $dipatch

```js

function broadcast(componentName, eventName, params) {
  this.$children.forEach(child => {
    var name = child.$options.componentName;

    if (name === componentName) {
      child.$emit.apply(child, [eventName].concat(params));
    } else {
      broadcast.apply(child, [componentName, eventName].concat([params]));
    }
  });
}
export default {
  methods: {
    dispatch(componentName, eventName, params) {
      var parent = this.$parent || this.$root;
      var name = parent.$options.componentName;

      while (parent && (!name || name !== componentName)) {
        parent = parent.$parent;

        if (parent) {
          name = parent.$options.componentName;
        }
      }
      if (parent) {
        parent.$emit.apply(parent, [eventName].concat(params));
      }
    },
    broadcast(componentName, eventName, params) {
      broadcast.call(this, componentName, eventName, params);
    }
  }
};

```
## vue的模板解析

```js

export function compileToFunctions(template) {
    // html模板 => render函数  (ast是用来描述代码的)
    // 1.需要将html代码转化成"ast"语法树 可以用ast树来描述语言本身

    // 前端必须要掌握的数据结构 (树)
    let ast = parseHTML(template);
//生成的AST语法树主要是层级关系 包括 标签名 标签属性 父子关系 标签类型

 
     let root, currentParent,
         stack = [];//维护dom层级

      while (html) {
     对标签的解析 
    标签分为开始标签和结束标签和文本节点
    解析开始标签拿到 解析到的标签名 标签属性等  如果遇到 > 则开始标签解析完毕
    start() 可以拿到当前解析的内容，生成ast,放到栈中，声明根元素， 并记录当前正在渲染的元素,
    end() 匹配结束标签 删除栈中pop 记录当前渲染元素 并生成父子关系
    
    解析元素节点 生成ast
   当元素全部解析完  返回 root

    // 2.优化静态节点  对静态节点打上标记

    // 3.通过这课树 重新的生成代码
    let code = generate(ast);
     // 1.对文本节点生成_c 

     //代码生成器
    // 4.将字符串变成函数 限制取值范围 通过with来进行取值 稍后调用render函数就可以通过改变this 让这个函数内部取到结果了
    let render = new Function(`with(this){return ${code}}`);
    return render;

}
```

## 代码生成器

_c('p',undefined,_v("多层obj"+_s(obj))
_c('span',{style:{"background-color":"aqua","font-size":"60px"},name:"zy"},_v("哈哈"),_c('span',undefined,_v("wowo"))) code--------

//子元素是平级关系的

```js

export function generate(el) {
    let children = genChildren(el);// 儿子的生成
    let code = `_c('${el.tag}',${
        el.attrs.length? `${genProps(el.attrs)}`:'undefined'
    }${
        children?`,${children}`:''
    })`;
    return code;
}
function genChildren(el) {
    const children = el.children;
    if (children) { // 将所有转化后的儿子用逗号拼接起来
        return children.map(child => gen(child)).join(',')
    }
}

//gen  如果是元素节点解析成_c  文本节点 _s
```

## axios

从浏览器中创建 XMLHttpRequests
从 node.js 创建 http 请求
支持 Promise API
拦截请求和响应
转换请求数据和响应数据
取消请求
自动转换 JSON 数据
客户端支持防御 XSRF

axios.all(iterable)
axios.spread(callback)


CancelToken是一个构造函数，通过new CancelToken()得到的是一个实例对象，它只有一个属性promise, 它的值是一个能触发取消请求的Promise对象。

执行CancelToken函数做了两件事：

创建一个Promise对象，且将这个对象赋值给promise属性，其resolve参数被暴露出来以备外部引用。
执行executor函数，将内部定义的cancel函数作为参数传递给executor

token值为{promise: Promise对象}
executor函数被执行，即cancel = c执行，因此变量cancel被赋值了，值就是CanelToken内部的那个cancel函数。


```js

// axios --- index.js 源码 


if (config.CancelToken) {
                //config.cancelToken = source.token: new Promise(() => )
               config.CancelToken.then((message:string) => {
                   request.abort();
                   reject(message); //此处的message
               })
            }

axios.CancelToken = new CancelToken();
axios.isCancel = isCancel;
```

```js

export class Cancel {
    message: string;
    constructor(message: string) {
        this.message = message;
    }
}
export function isCancel(error: any) {
    return error instanceof Cancel;
}
export class CancelToken {
    public resolve: any;

    source() {
        return {
            token: new Promise((resolve) => {
                console.log(this, 'this----');
                this.resolve = resolve;
            }),
            cancel: (message: string) => {
                this.resolve(new Cancel(message));
                //看下 message 是不是 Cancle实例的
            }
        }
    }
}
```
实际使用
```js
instance.interceptors.request.use((config) => { // 请求拦截
      // console.log('请求前');
      const Cancel = axios.CancelToken;
      // 每次请求前 将token 放到请求中
      config.headers.token = localStorage.getItem('token') || '';
      config.cancelToken = new Cancel(((c) => {
        // console.log(c);
        store.commit(types.PUSH_TOKEN, c); //订阅
      }));
      // 请求前  增加请求队列
      if (Object.keys(this.queue).length === 0) {
        this.toast = Toast.$create({
          txt: '正在加载',
          time: 0,
        });
        this.toast.show();
      }
      this.queue[url] = url;
      return config;
    }, err => Promise.reject(err));
```


```js
const CancelToken = axios.CancelToken;
let cancel;

axios.get('/user/12345', {
  cancelToken: new CancelToken(function executor(c) {
    // executor 函数接收一个 cancel 函数作为参数
    cancel = c;
  })
});

// cancel the request
cancel();

```
## vuex

Vuex采用MVC模式中的Model层，规定所有的数据必须通过action—>mutaion—>state这个流程进行来改变状态的。再结合Vue的数据视图双向绑定实现页面的更新。统一页面状态管理，

可以让复杂的组件交互变的简单清晰，同时在调试时也可以通过DEVtools去查看状态。

## 对vueX的理解

单向数据流 store统一管理state,

内部定义 方法 action---dipatch({commit},payload)     mutation - commit(state,payload)

实例化过程 

install 方法 通过Vue.minins 给每个组件注册this.$store


可以模块写法


实例化的时候 把所有方法都注册到 store实例上的this.$mutations  相同事件名用数组存放

如果定义多个相同的事件方法--依次执行
  
  所以注意不要同名

同名问题 --- 可以通过namespace 触发

---调用方便 vuex内部写了帮助函数mapState mapGtters mapAction

--- 返回的是一个对象 直接通过解构 把方法都统一放到了组件实例上 进行调用

## Vue和React的不同


组件化：React与Vue都鼓励将你的应用分拆成一个个功能明确的模块，这样的组件化使得结构清晰且易复用。

虚拟Dom：为高效渲染页面，减少性能的消耗，都采取了Virtual Dom。

配套框架：两个框架都专注于UI层，其他的功能如路由、状态管理（vuex,redux）等都交由同伴框架进行处理。

构建工具：React可以使用Create React App (CRA)，而Vue对应的则是vue-cli。


不同

1.ui层

vue 侧重模板语法

react

- vue更侧重双向数据流 vue通信

- react 是单向数据流

2.domdiff 工作原理
diff 算法是指生成更新补丁的方式，主要应用于虚拟 DOM 树变化后，更新真实 DOM。
所以 diff 算法一定存在这样一个过程：触发更新 → 生成补丁 → 应用补丁

React 的 diff 算法，触发更新的时机主要在 state 变化与 hooks 调用之后。
此时触发虚拟 DOM 树变更遍历，采用了深度优先遍历算法。但传统的遍历方式，效率较低。为了优化效率，使用了分治的方式。将单一节点比对转化为了 3 种类型节点的比对，分别是树、组件及元素，以此提升效率。

树比对：由于网页视图中较少有跨层级节点移动，两株虚拟 DOM 树只对同一层次的节点进行比较。

组件比对：如果组件是同一类型，则进行树比对，如果不是，则直接放入到补丁中。

元素比对：主要发生在同层级中，通过标记节点操作生成补丁，节点操作对应真实的 DOM 剪裁操作。

自 React 16 起，引入了 Fiber 架构。为了使整个更新过程可随时暂停恢复，节点与树分别采用了 FiberNode 与 FiberTree 进行重构。
fiberNode 使用了双链表的结构，可以直接找到兄弟节点与子节点。

整个更新过程由 current 与 workInProgress 两株树双缓冲完成。
workInProgress 更新完成后，再通过修改 current 相关指针指向新节点。

React 拥有完整的 Diff 算法策略，且拥有随时中断更新的时间切片能力，
在大批量节点更新的极端情况下，拥有更友好的交互体验。

## react-hooks
首先用 Hooks 开发需要抛弃生命周期的思考模式，以 effects 的角度重新思考。

过去类组件的开发模式中，在 componentDidMount 中放置一个监听事件，
还需要考虑在 componentWillUnmount 中取消监听，甚至可能由于部分值变化，
还需要在其他生命周期函数中对监听事件做特殊处理。
在 Hooks 的设计思路中，
可以将这一系列监听与取消监听放置在一个 useEffect 中，
useEffect 可以不关心组件的生命周期，只需要关心外部依赖的变化即可，

对于开发心智而言是极大的减负。这是 Hooks 的设计根本。

首先用 Hooks 开发需要抛弃生命周期的思考模式，以 effects 的角度重新思考。过去类组件的开发模式中，
在 componentDidMount 中放置一个监听事件，还需要考虑在 componentWillUnmount 中取消监听，
甚至可能由于部分值变化，还需要在其他生命周期函数中对监听事件做特殊处理。在 Hooks 的设计思路中，可以将这一系列监听与取消监听放置在一个 useEffect 中，useEffect 可以不关心组件的生命周期，只需要关心外部依赖的变化即可，对于开发心智而言是极大的减负。这是 Hooks 的设计根本。

在这样一个认知基础上，我总结了一些在团队内部开发实践的心得，做成了开发规范进行推广。

第一点就是 React.useMemo 取代 React.memo，因为 React.memo 并不能控制组件内部共享状态的变化，
而 React.useMemo 更适合于 Hooks 的场景。

第二点就是常量，在类组件中，我们很

## 3.vue的双向绑定原理

数据--->驱动视图 

视图改变去驱动数据

```js
//手写vue的数据双向绑定原理

// import { nextTick } from "../util";



// 原理 new Vue 对申明在data里的数据 每一项声明 getter 和 Setter 

//数组观测是改写数组原型改写 切片编程 加一些逻辑 

let data = {
    name: 'zy',
    obj:{
        name:'li'
    },
    arr:[
        {
            name:'zou'
        }
    ]
}

let oldPrototype = Array.prototype;

let arraryProtype = Object.create(oldPrototype);

const methods = [
    'shift',
    'unshift',
    'pop',
    'push',
    'reverse',
    'splice'

]

methods.forEach(method => {
    arraryProtype[method] = function(...args) {
       oldPrototype[method].call(this, ...args);
       console.log(method,args)
       let inserted;
       let ob = this.__ob__;
       switch(method) {
           case 'unshift':
           case 'push':
            inserted = args;
            break;
            case 'splice':
            inserted = args.splice(2);
            break;
       }

       console.log(inserted,'inserted');
       if (inserted) ob.observeArray(inserted);

       ob.update();
    }
})


class Observe {
    constructor(data) {
        Object.defineProperty(data,'__ob__',{
            value:this,
            enumerable:false
        })

        if (Array.isArray(data)) {

            data.__proto__ = arraryProtype;

        }else {
            this.walk(data);
        }

    }
    walk(data) {
        Object.keys(data).forEach(key=> {
            defineReative(data,key,data[key])
        })
    }
    observeArray(value){
        value.forEach(item=>{
            observe(item); // 观测数组中的对象类型
        })
    }

    update() {
        console.log('数组修改了');
    }
}
observe(data);

//观测数据变化
function observe(data) {
    if (typeof data !=='object' && data !== null) return;

    if (data.__ob__) {
        return data.__ob__;
    }





    return new Observe(data);



}


function defineReative(data,key,value) {
    observe(value);

    Object.defineProperty(data,key,{
        get() {
            return value
        },
        set(newVal) {
            console.log('更新了---')
            value = newVal

        }
    })

}

// data.name = 'ppp'
// data.obj.name= 'pppp'
data.arr.push({
    name:'ppp'
})


//数据驱动视图  视图更改影响数据




```
```js

const toProxy = new WeakMap(); // 存放被代理过的对象
const toRaw = new WeakMap(); // 存放已经代理过的对


function reactive(target){
  // 创建响应式对象
  return createReactiveObject(target);
}
function isObject(target){
  return typeof target === 'object' && target!== null;
}

function hasOwn(target,key){
  return target.hasOwnProperty(key);
}
function createReactiveObject(target){
  // 判断target是不是对象,不是对象不必继续
  console.log(target)
  if(!isObject(target)){
      return target;
  }
 
  let observed = toProxy.get(target);
  if(observed){ // 判断是否被代理过
    return observed;
  }
  if(toRaw.has(target)){ // 判断是否要重复代理
    return target;
  }
  const handlers = {
      get(target,key,receiver){ // 取值
        console.log("获取");
        let res = Reflect.get(target, key, receiver);
        return isObject(res) // 懒代理，只有当取值时再次做代理，vue2.0中一上来就会全部递归增加getter,setter
        ? reactive(res) : res;
    
      },
      set(target,key,value,receiver){ // 更改 、 新增属性
        let oldValue = target[key]; // 获取上次的值
        let hadKey = hasOwn(target,key); // 看这个属性是否存在
        let result = Reflect.set(target, key, value, receiver);
        if(!hadKey){ // 新增属性
            console.log('更新 添加')
        }else if(oldValue !== value){ // 修改存在的属性
            console.log('更新 修改')
        }
        // 当调用push 方法第一次修改时数组长度已经发生变化
        // 如果这次的值和上次的值一样则不触发更新
    
          return result;
      },
      deleteProperty(target,key){ // 删除属性
          console.log('删除')
          const result = Reflect.deleteProperty(target,key);
          return result;
      }
  }
  // 开始代理
  observed = new Proxy(target,handlers);
  
  return observed;
}
let p = reactive({name:'youxuan',obj:{a:1}});
console.log(p.name); // 获取
console.log(p.obj.a); // 获取

// p.name = 'webyouxuan'; // 设置
// p.age = 10
p.obj.a = 10
delete p.name; // 删除
console.log(p);
```
## 浏览器 渲染


性能优化
性能优化是前端开发中避不开的问题，性能问题无外乎两方面原因：渲染速度慢、请求时间长。性能优化虽然涉及很多复杂的原因和解决方案，但其实只要通过合理地使用标签，就可以在一定程度上提升渲染速度以及减少请求时间。

script 标签：调整加载顺序提升渲染速度
由于浏览器的底层运行机制，渲染引擎在解析 HTML 时，若遇到 script 标签引用文件，则会暂停解析过程，同时通知网络线程加载文件，文件加载后会切换至 JavaScript 引擎来执行对应代码，代码执行完成之后切换至渲染引擎继续渲染页面。

在这一过程中可以看到，页面渲染过程中包含了请求文件以及执行文件的时间，但页面的首次渲染可能并不依赖这些文件，这些请求和执行文件的动作反而延长了用户看到页面的时间，从而降低了用户体验。

为了减少这些时间损耗，可以借助 script 标签的 3 个属性来实现。

async 属性。立即请求文件，但不阻塞渲染引擎，而是文件加载完毕后阻塞渲染引擎并立即执行文件内容。

defer 属性。立即请求文件，但不阻塞渲染引擎，等到解析完 HTML 之后再执行文件内容。

HTML5 标准 type 属性，对应值为“module”。让浏览器按照 ECMA Script 6 标准将文件当作模块进行解析，默认阻塞效果同 defer，也可以配合 async 在请求完成后立即执行。


从图中可以得知，采用 3 种属性都能减少请求文件引起的阻塞时间，只有 defer 属性以及 type="module" 情况下能保证渲染引擎的优先执行，从而减少执行文件内容消耗的时间，让用户更快地看见页面（即使这些页面内容可能并没有完全地显示）。

除此之外还应当注意，当渲染引擎解析 HTML 遇到 script 标签引入文件时，会立即进行一次渲染。所以这也就是为什么构建工具会把编译好的引用 JavaScript 代码的 script 标签放入到 body 标签底部，因为当渲染引擎执行到 body 底部时会先将已解析的内容渲染出来，然后再去请求相应的 JavaScript 文件。如果是内联脚本（即不通过 src 属性引用外部脚本文件直接在 HTML 编写 JavaScript 代码的形式），渲染引擎则不会渲染。


link 标签：通过预处理提升渲染速度
dns-prefetch。当 link 标签的 rel 属性值为“dns-prefetch”时，浏览器会对某个域名预先进行 DNS 解析并缓存。这样，当浏览器在请求同域名资源的时候，能省去从域名查询 IP 的过程，从而减少时间损耗。下图是淘宝网设置的 DNS 预解析。

preconnect。让浏览器在一个 HTTP 请求正式发给服务器前预先执行一些操作，这包括 DNS 解析、TLS 协商、TCP 握手，通过消除往返延迟来为用户节省时间。

prefetch/preload。两个值都是让浏览器预先下载并缓存某个资源，但不同的是，prefetch 可能会在浏览器忙时被忽略，而 preload 则是一定会被预先下载。

prerender。浏览器不仅会加载资源，还会解析执行页面，进行预渲染。

## http
协议版本	解决的核心问题	解决方式
0.9	HTML 文件传输	确立了客户端请求、服务端响应的通信流程
1.0	不同类型文件传输	设立头部字段
1.1	创建/断开 TCP 连接开销大	建立长连接进行复用
2	并发数有限	二进制分帧
3	TCP 丢包阻塞	采用 UDP 协议

## 强缓存 和 协商缓存

需要注意的是，cache-control 的 max-age 优先级高于 Expires，也就是说如果它们同时出现，浏览器会使用 max-age 的值。

http 1.0 Expires


http 1.1 Cache-Control

no-cache，表示使用协商缓存，即每次使用缓存前必须向服务端确认缓存资源是否更新；

no-store，禁止浏览器以及所有中间缓存存储响应内容；

public，公有缓存，表示可以被代理服务器缓存，可以被多个用户共享；

private，私有缓存，不能被代理服务器缓存，不可以被多个用户共享；

max-age，以秒为单位的数值，表示缓存的有效时间；

must-revalidate，当缓存过期时，需要去服务端校验缓存的有效性。

需要注意的是，cache-control 的 max-age 优先级高于 Expires，也就是说如果它们同时出现，浏览器会使用 max-age 的值。

cache-control: public, max-age=31536000

协商缓存

协商缓存的更新策略是不再指定缓存的有效时间了，而是浏览器直接发送请求到服务端进行确认缓存是否更新，如果请求响应返回的 HTTP 状态为 304，则表示缓存仍然有效。控制缓存的难题就是从浏览器端转移到了服务端。

1. Last-Modified 和 If-Modified-Since

服务端要判断缓存有没有过期，只能将双方的资源进行对比。若浏览器直接把资源文件发送给服务端进行比对的话，网络开销太大，而且也会失去缓存的意义，所以显然是不可取的。有一种简单的判断方法，那就是通过响应头部字段 Last-Modified 和请求头部字段 If-Modified-Since 比对双方资源的修改时间。

具体工作流程如下：

浏览器第一次请求资源，服务端在返回资源的响应头中加入 Last-Modified 字段，该字段表示这个资源在服务端上的最近修改时间；

当浏览器再次向服务端请求该资源时，请求头部带上之前服务端返回的修改时间，这个请求头叫 If-Modified-Since；

服务端再次收到请求，根据请求头 If-Modified-Since 的值，判断相关资源是否有变化，如果没有，则返回 304 Not Modified，并且不返回资源内容，浏览器使用资源缓存值；否则正常返回资源内容，且更新 Last-Modified 响应头内容。

这种方式虽然能判断缓存是否失效，但也存在两个问题：

精度问题，Last-Modified 的时间精度为秒，如果在 1 秒内发生修改，那么缓存判断可能会失效；

准度问题，考虑这样一种情况，如果一个文件被修改，然后又被还原，内容并没有发生变化，在这种情况下，浏览器的缓存还可以继续使用，但因为修改时间发生变化，也会重新返回重复的内容。

2. ETag 和 If-None-Match

为了解决精度问题和准度问题，HTTP 提供了另一种不依赖于修改时间，而依赖于文件哈希值的精确判断缓存的方式，那就是响应头部字段 ETag 和请求头部字段 If-None-Match。

具体工作流程如下：

浏览器第一次请求资源，服务端在返响应头中加入 Etag 字段，Etag 字段值为该资源的哈希值；

当浏览器再次跟服务端请求这个资源时，在请求头上加上 If-None-Match，值为之前响应头部字段 ETag 的值；

服务端再次收到请求，将请求头 If-None-Match 字段的值和响应资源的哈希值进行比对，如果两个值相同，则说明资源没有变化，返回 304 Not Modified；否则就正常返回资源内容，无论是否发生变化，都会将计算出的哈希值放入响应头部的 ETag 字段中。

这种缓存比较的方式也会存在一些问题，具体表现在以下两个方面。

计算成本。生成哈希值相对于读取文件修改时间而言是一个开销比较大的操作，尤其是对于大文件而言。如果要精确计算则需读取完整的文件内容，如果从性能方面考虑，只读取文件部分内容，又容易判断出错。

计算误差。HTTP 并没有规定哈希值的计算方法，所以不同服务端可能会采用不同的哈希值计算方式。这样带来的问题是，同一个资源，在两台服务端产生的 Etag 可能是不相同的，所以对于使用服务器集群来处理请求的网站来说，使用 Etag 的缓存命中率会有所降低。

需要注意的是，强制缓存的优先级高于协商缓存，在协商缓存中，Etag 优先级比 Last-Modified 高。既然协商缓存策略也存在一些缺陷，那么我们转移到浏览器端看看 ServiceWorker 能不能给我们带来惊喜。

ServiceWorker
ServiceWorker 是浏览器在后台独立于网页运行的脚本，也可以这样理解，它是浏览器和服务端之间的代理服务器。ServiceWorker 非常强大，可以实现包括推送通知和后台同步等功能，更多功能还在进一步扩展，但其最主要的功能是实现离线缓存。

1. 使用限制
越强大的东西往往越危险，所以浏览器对 ServiceWorker 做了很多限制：

在 ServiceWorker 中无法直接访问 DOM，但可以通过 postMessage 接口发送的消息来与其控制的页面进行通信；

ServiceWorker 只能在本地环境下或 HTTPS 网站中使用；

ServiceWorker 有作用域的限制，一个 ServiceWorker 脚本只能作用于当前路径及其子路径；

由于 ServiceWorker 属于实验性功能，所以兼容性方面会存在一些问题，具体兼容情况请看下面的截图。



ServiceWorker 在浏览器中的支持情况

2. 使用方法
在使用 ServiceWorker 脚本之前先要通过“注册”的方式加载它。常见的注册代码如下所示：

```js
复制代码
if ('serviceWorker' in window.navigator) {
  window.navigator.serviceWorker
    .register('./sw.js')
    .then(console.log)
    .catch(console.error)
} else {
  console.warn('浏览器不支持 ServiceWorker!')
```
首先考虑到浏览器的兼容性，判断 window.navigator 中是否存在 serviceWorker 属性，然后通过调用这个属性的 register 函数来告诉浏览器 ServiceWorker 脚本的路径。

浏览器获取到 ServiceWorker 脚本之后会进行解析，解析完成会进行安装。可以通过监听 “install” 事件来监听安装，但这个事件只会在第一次加载脚本的时候触发。要让脚本能够监听浏览器的网络请求，还需要激活脚本。

在脚本被激活之后，我们就可以通过监听 fetch 事件来拦截请求并加载缓存的资源了。

下面是一个利用 ServiceWorker 内部的 caches 对象来缓存文件的示例代码。
```js

复制代码
const CACHE_NAME = 'ws'
let preloadUrls = ['/index.css']

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
    .then(function (cache) {
      return cache.addAll(preloadUrls);
    })
  );
});
self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request)
    .then(function (response) {
      if (response) {
        return response;
      }
      return caches.open(CACHE_NAME).then(function (cache) {
          const path = event.request.url.replace(self.location.origin, '')
          return cache.add(path)
        })
        .catch(e => console.error(e))
    })
  );
})
```
这段代码首先监听 install 事件，在回调函数中调用了 event.waitUntil() 函数并传入了一个 Promise 对象。event.waitUntil 用来监听多个异步操作，包括缓存打开和添加缓存路径。如果其中一个操作失败，则整个 ServiceWorker 启动失败。

然后监听了 fetch 事件，在回调函数内部调用了函数 event.respondWith() 并传入了一个 Promise 对象，当捕获到 fetch 请求时，会直接返回 event.respondWith 函数中 Promise 对象的结果。

在这个 Promise 对象中，我们通过 caches.match 来和当前请求对象进行匹配，如果匹配上则直接返回匹配的缓存结果，否则返回该请求结果并缓存。

总结
缓存是解决性能问题的重要手段，使用缓存的好处很多，除了能让浏览器更快地加载网络资源之外，还会带来其他好处，比如节省网络流量和带宽，以及减少服务端的负担。

本课时介绍了 HTTP 缓存策略及 ServiceWorker，HTTP 缓存可以分为强制缓存和协商缓存，强制缓存就是在缓存有效期内直接使用浏览器缓存；协商缓存则需要先询问服务端资源是否发生改变，如果未改变再使用浏览器缓存。

ServiceWorker 可以用来实现离线缓存，主要实现原理是拦截浏览器请求并返回缓存的资源文件。

## bind call apply 的区别

都能改变this指向 
bind 返回一个回调函数 this指向一旦改变 不能再次改变

apply call 立即执行  传参方式不同

```js

Function.prototype.mycall = function (context, ...args) {
    context = context  || window;
   context.fn = this; //假如  当fn被调用的时候 函数谁调用 this指向谁 改变了this指向
   const result = context.fn(...args)
   delete context.fn
   return result;
 }
let obj = {
    name: 'wo'
}
function a(args) {
    console.log(this.name + '说' + args);
    return 'pp'
}
console.log(a.mycall(obj,'wp'))

```

创建一个新对象；

将构造函数的作用域赋给新对象（this 指向新对象）；

执行构造函数中的代码（为这个新对象添加属性）；

返回新对象。

```js
function myNew(fn,...args) {
    let obj =  Object.create(fn);

     let r = fn.call(fn,...args);

     return r instanceof Object ? r :obj;
}



```


## 浏览器加载js 和 css

受浏览器底层限制，浏览器在解析html代码时，遇到script标签，会立即暂停渲染引擎，等js执行完毕后再执行渲染引擎

--- async 属性-- 不阻塞 -- 立即请求文件请求文件后会阻塞渲染引擎

--- defer --- 不阻塞-- 等html解析完之后再去执行文件内容
--- type="module" 



link 便签

webpack 优化的时候 会按照按需加载的方式来加载对应模块 -- 合理利用 link 标签的ref属性 进行预加载


dns-prefetch -- 解析dns

preconnect。让浏览器在一个 HTTP 请求正式发给服务器前预先执行一些操作，这包括 DNS 解析、TLS 协商、TCP 握手，通过消除往返延迟来为用户节省时间。

prefetch/preload。两个值都是让浏览器预先下载并缓存某个资源，但不同的是，prefetch 可能会在浏览器忙时被忽略，而 preload 则是一定会被预先下载。

prerender。浏览器不仅会加载资源，还会解析执行页面，进行预渲染。

script 可以放到最后 执行完毕css再执行js



1.vue更偏向于用模板去完成 


## $set

不能监听到对象新增属性

数组不能够操作索引去响应数据的变化

```js
function set(target,key,val) {
  if (Array.isArray(target)) {
     target.splice(key,1,val)
     return val;
  }
  const ob = target.__ob__;
  if (!ob) {
      target[key] = val;
      return val;
  }
  defineReative(ob.value,key,val)
  ob.dep.notify();
}
```
## instaceOf 

```js

function instance(A,B) {

    B = B.prototype;
    A = A.__proto__;

    while(true) {
        if (!A) return;
        if (A == B) {
            return true;
        }
        A = A.__proto__;

    }


}
```

## $dipatch

```js

function broadcast(componentName, eventName, params) {
  this.$children.forEach(child => {
    var name = child.$options.componentName;

    if (name === componentName) {
      child.$emit.apply(child, [eventName].concat(params));
    } else {
      broadcast.apply(child, [componentName, eventName].concat([params]));
    }
  });
}
export default {
  methods: {
    dispatch(componentName, eventName, params) {
      var parent = this.$parent || this.$root;
      var name = parent.$options.componentName;

      while (parent && (!name || name !== componentName)) {
        parent = parent.$parent;

        if (parent) {
          name = parent.$options.componentName;
        }
      }
      if (parent) {
        parent.$emit.apply(parent, [eventName].concat(params));
      }
    },
    broadcast(componentName, eventName, params) {
      broadcast.call(this, componentName, eventName, params);
    }
  }
};

```
## vue的模板解析

```js

export function compileToFunctions(template) {
    // html模板 => render函数  (ast是用来描述代码的)
    // 1.需要将html代码转化成"ast"语法树 可以用ast树来描述语言本身

    // 前端必须要掌握的数据结构 (树)
    let ast = parseHTML(template);
//生成的AST语法树主要是层级关系 包括 标签名 标签属性 父子关系 标签类型

 
     let root, currentParent,
         stack = [];//维护dom层级

      while (html) {
     对标签的解析 
    标签分为开始标签和结束标签和文本节点
    解析开始标签拿到 解析到的标签名 标签属性等  如果遇到 > 则开始标签解析完毕
    start() 可以拿到当前解析的内容，生成ast,放到栈中，声明根元素， 并记录当前正在渲染的元素,
    end() 匹配结束标签 删除栈中pop 记录当前渲染元素 并生成父子关系
    
    解析元素节点 生成ast
   当元素全部解析完  返回 root

    // 2.优化静态节点  对静态节点打上标记

    // 3.通过这课树 重新的生成代码
    let code = generate(ast);
     // 1.对文本节点生成_c 

     //代码生成器
    // 4.将字符串变成函数 限制取值范围 通过with来进行取值 稍后调用render函数就可以通过改变this 让这个函数内部取到结果了
    let render = new Function(`with(this){return ${code}}`);
    return render;

}
```

## 代码生成器

_c('p',undefined,_v("多层obj"+_s(obj))
_c('span',{style:{"background-color":"aqua","font-size":"60px"},name:"zy"},_v("哈哈"),_c('span',undefined,_v("wowo"))) code--------

//子元素是平级关系的

```js

export function generate(el) {
    let children = genChildren(el);// 儿子的生成
    let code = `_c('${el.tag}',${
        el.attrs.length? `${genProps(el.attrs)}`:'undefined'
    }${
        children?`,${children}`:''
    })`;
    return code;
}
function genChildren(el) {
    const children = el.children;
    if (children) { // 将所有转化后的儿子用逗号拼接起来
        return children.map(child => gen(child)).join(',')
    }
}

//gen  如果是元素节点解析成_c  文本节点 _s
```

## axios

从浏览器中创建 XMLHttpRequests
从 node.js 创建 http 请求
支持 Promise API
拦截请求和响应
转换请求数据和响应数据
取消请求
自动转换 JSON 数据
客户端支持防御 XSRF

axios.all(iterable)
axios.spread(callback)


CancelToken是一个构造函数，通过new CancelToken()得到的是一个实例对象，它只有一个属性promise, 它的值是一个能触发取消请求的Promise对象。

执行CancelToken函数做了两件事：

创建一个Promise对象，且将这个对象赋值给promise属性，其resolve参数被暴露出来以备外部引用。
执行executor函数，将内部定义的cancel函数作为参数传递给executor

token值为{promise: Promise对象}
executor函数被执行，即cancel = c执行，因此变量cancel被赋值了，值就是CanelToken内部的那个cancel函数。


```js

// axios --- index.js 源码 


if (config.CancelToken) {
                //config.cancelToken = source.token: new Promise(() => )
               config.CancelToken.then((message:string) => {
                   request.abort();
                   reject(message); //此处的message
               })
            }

axios.CancelToken = new CancelToken();
axios.isCancel = isCancel;
```

```js
export class Cancel {
    message: string;
    constructor(message: string) {
        this.message = message;
    }
}
export function isCancel(error: any) {
    return error instanceof Cancel;
}
export class CancelToken {
    public resolve: any;

    source() {
        return {
            token: new Promise((resolve) => {
                console.log(this, 'this----');
                this.resolve = resolve;
            }),
            cancel: (message: string) => {
                this.resolve(new Cancel(message));
                //看下 message 是不是 Cancle实例的
            }
        }
    }
}
```
实际使用
```js
instance.interceptors.request.use((config) => { // 请求拦截
      // console.log('请求前');
      const Cancel = axios.CancelToken;
      // 每次请求前 将token 放到请求中
      config.headers.token = localStorage.getItem('token') || '';
      config.cancelToken = new Cancel(((c) => {
        // console.log(c);
        store.commit(types.PUSH_TOKEN, c); //订阅
      }));
      // 请求前  增加请求队列
      if (Object.keys(this.queue).length === 0) {
        this.toast = Toast.$create({
          txt: '正在加载',
          time: 0,
        });
        this.toast.show();
      }
      this.queue[url] = url;
      return config;
    }, err => Promise.reject(err));
```


```js
const CancelToken = axios.CancelToken;
let cancel;

axios.get('/user/12345', {
  cancelToken: new CancelToken(function executor(c) {
    // executor 函数接收一个 cancel 函数作为参数
    cancel = c;
  })
});

// cancel the request
cancel();

```
## vuex

Vuex采用MVC模式中的Model层，规定所有的数据必须通过action—>mutaion—>state这个流程进行来改变状态的。再结合Vue的数据视图双向绑定实现页面的更新。统一页面状态管理，

可以让复杂的组件交互变的简单清晰，同时在调试时也可以通过DEVtools去查看状态。



## 对vueX的理解

单向数据流 store统一管理state,

内部定义 方法 action---dipatch({commit},payload)     mutation - commit(state,payload)

实例化过程 

install 方法 通过Vue.minins 给每个组件注册this.$store


可以模块写法


实例化的时候 把所有方法都注册到 store实例上的this.$mutations  相同事件名用数组存放

如果定义多个相同的事件方法--依次执行
  
  所以注意不要同名

同名问题 --- 可以通过namespace 触发

---调用方便 vuex内部写了帮助函数mapState mapGtters mapAction

--- 返回的是一个对象 直接通过解构 把方法都统一放到了组件实例上 进行调用

## Vue和React的不同
组件化：React与Vue都鼓励将你的应用分拆成一个个功能明确的模块，这样的组件化使得结构清晰且易复用。

虚拟Dom：为高效渲染页面，减少性能的消耗，都采取了Virtual Dom。

配套框架：两个框架都专注于UI层，其他的功能如路由、状态管理（vuex,redux）等都交由同伴框架进行处理。

构建工具：React可以使用Create React App (CRA)，而Vue对应的则是vue-cli。


不同

1.ui层

vue 侧重模板语法

react

- vue更侧重双向数据流 vue通信

- react 是单向数据流

2.domdiff 工作原理
diff 算法是指生成更新补丁的方式，主要应用于虚拟 DOM 树变化后，更新真实 DOM。
所以 diff 算法一定存在这样一个过程：触发更新 → 生成补丁 → 应用补丁

React 的 diff 算法，触发更新的时机主要在 state 变化与 hooks 调用之后。
此时触发虚拟 DOM 树变更遍历，采用了深度优先遍历算法。但传统的遍历方式，效率较低。为了优化效率，使用了分治的方式。将单一节点比对转化为了 3 种类型节点的比对，分别是树、组件及元素，以此提升效率。

树比对：由于网页视图中较少有跨层级节点移动，两株虚拟 DOM 树只对同一层次的节点进行比较。

组件比对：如果组件是同一类型，则进行树比对，如果不是，则直接放入到补丁中。

元素比对：主要发生在同层级中，通过标记节点操作生成补丁，节点操作对应真实的 DOM 剪裁操作。

自 React 16 起，引入了 Fiber 架构。为了使整个更新过程可随时暂停恢复，节点与树分别采用了 FiberNode 与 FiberTree 进行重构。
fiberNode 使用了双链表的结构，可以直接找到兄弟节点与子节点。

整个更新过程由 current 与 workInProgress 两株树双缓冲完成。
workInProgress 更新完成后，再通过修改 current 相关指针指向新节点。

React 拥有完整的 Diff 算法策略，且拥有随时中断更新的时间切片能力，
在大批量节点更新的极端情况下，拥有更友好的交互体验。

## react-hooks
首先用 Hooks 开发需要抛弃生命周期的思考模式，以 effects 的角度重新思考。

过去类组件的开发模式中，在 componentDidMount 中放置一个监听事件，
还需要考虑在 componentWillUnmount 中取消监听，甚至可能由于部分值变化，
还需要在其他生命周期函数中对监听事件做特殊处理。
在 Hooks 的设计思路中，
可以将这一系列监听与取消监听放置在一个 useEffect 中，
useEffect 可以不关心组件的生命周期，只需要关心外部依赖的变化即可，

对于开发心智而言是极大的减负。这是 Hooks 的设计根本。

首先用 Hooks 开发需要抛弃生命周期的思考模式，以 effects 的角度重新思考。过去类组件的开发模式中，
在 componentDidMount 中放置一个监听事件，还需要考虑在 componentWillUnmount 中取消监听，
甚至可能由于部分值变化，还需要在其他生命周期函数中对监听事件做特殊处理。在 Hooks 的设计思路中，可以将这一系列监听与取消监听放置在一个 useEffect 中，useEffect 可以不关心组件的生命周期，只需要关心外部依赖的变化即可，对于开发心智而言是极大的减负。这是 Hooks 的设计根本。

在这样一个认知基础上，我总结了一些在团队内部开发实践的心得，做成了开发规范进行推广。

第一点就是 React.useMemo 取代 React.memo，因为 React.memo 并不能控制组件内部共享状态的变化，
而 React.useMemo 更适合于 Hooks 的场景。

第二点就是常量，在类组件中，我们很习惯将常量写在类中，但在组件函数中，这意味着每次渲染都会重新声明常量，
这是完全无意义的操作。其次就是组件内的函数每次会被重新创建，如果这个函数需要使用函数组件内部的变量，
那么可以用 useCallback 包裹下这个函数。

第三点就是 useEffect 的第二个参数容易被错误使用。很多同学习惯在第二个参数放置引用类型的变量，
通常的情况下，引用类型的变量很容易被篡改，难以判断开发者的真实意图，所以更推荐使用值类型的变量。
当然有个小技巧是 JSON 序列化引用类型的变量，也就是通过 JSON.stringify 将引用类型变量转换为字符串来解决。
但不推荐这个操作方式，比较消耗性能。


## redux

View（视图层）：用户界面。该用户界面可以是以任何形式实现出来的，React 组件是一种形式，Vue、Angular 也完全 OK。Flux 架构与 React 之间并不存在耦合关系。

Action（动作）：也可以理解为视图层发出的“消息”，它会触发应用状态的改变。

Dispatcher（派发器）：它负责对 action 进行分发。

Store（数据层）：它是存储应用状态的“仓库”，此外还会定义修改状态的逻辑。store 的变化最终会映射到 view 层上去。

Store：它是一个单一的数据源，而且是只读的。

Action 人如其名，是“动作”的意思，它是对变化的描述。

Reducer 是一个函数，它负责对变化进行分发和处理，最终将新的数据返回给 Store。

applyMiddleware.js

bindActionCreators.js

combineReducers.js

compose.js

createStore.js

createStore 方法可以接收以下 3 个入参：

reducer

初始状态内容

指定中间件
```js

// 引入 redux
import { createStore } from 'redux'
// 创建 store
const store = createStore(
    reducer,
    initial_state,
    applyMiddleware(middleware1, middleware2, ...)
);
```

createStore 

getState

subscribe

dispatch
Redux 工作流的核心：dispatch 动作
1. 通过“上锁”避免“套娃式”的 dispatch

在调用 reducer 之前，Redux 首先会将 isDispatching 变量置为 true，待 reducer 执行完毕后，
再将 isDispatching 变量置为 false。这个操作你应该不陌生，
因为在第 11 讲中，setState 的“批处理”也是用类似的“上锁”方式来实现的。
当dispatch action 发生时，Redux 会在 reducer 执行完毕后，
将 listeners 数组中的监听函数逐个执行。这就是 subscribe 与 Redux 主流程之间的关系。


## componse 
实现

```js

function compose(...funcs) {
    if (funcs.length === 0) return args => args;
    if (funcs.length ===1) {
        return funcs[0];
    }
    return funcs.reduce((func, next)=>(...args) => func(next(...args)));
}
```
## api限制并发

```js
function createRequest(tasks, pool, callback) {
    if (typeof pool === "function") {
        callback = pool;
        pool = 5;
    }
    if (typeof pool !== "number") pool = 5;
    if (typeof callback !== "function") callback = function () {};
    //------
    class TaskQueue {
        running = 0;
        queue = [];
        results = [];
        pushTask(task) {
            let self = this;
            self.queue.push(task);
            self.next();
        }
        next() {
            let self = this;
            while (self.running < pool && self.queue.length) {
                self.running++;
                console.log(self.queue, 'self.queue');
                let task = self.queue.shift();
                task().then(result => {
                    self.results.push(result);
                }).finally(() => {
                    self.running--;
                    self.next();
                });
            }
            if (self.running === 0) callback(self.results);
        }
    }
    let TQ = new TaskQueue;
    tasks.forEach(task => TQ.pushTask(task));
}
//使用
createRequest(tasks, 2, results => {
    // console.log(results);
    console.timeEnd('cost');
    console.log(results);
});
```

## componse

```js

 function compose(...funcs) {
     if (funcs.length === 0) return args => args;
     if (funcs.length ===1) {
         return funcs[0];
     }
     return funcs.reduce((func, next)=>(...args) => func(next(...args)));
 }
```

## 性能优化

1.较小的图片用base54加载更快

2.图片加载启用webp/使用阿里云OSS服务 启用webp/项目私有化部署

3.script标签特性
 async  异步加载资源 立即执行 执行的过程中会阻塞
 
 defer 

充分利用link标签 dns-prefetch 

css资源分包处理 实现懒加载

4. 性能优化指标 首屏渲染 请求响应速度 performace 可以查看 页面资源加载速度等

5. tree-shaking

6. 4-2 使用 DllPlugin 可以提高构建速度

7.开启多个子进程进行打包

8. 文件压缩等

## reduce
```js
Array.prototype.reduce = function (callback,prev) {
   //遍历this 数组
   for (let i = 0; i < this.length; i++) {
       //判断有没有设置初始值
       if (typeof prev === "undefined") {
           //没有初始值，则调用callback,转入当前值，下一个值，当前index为下一个,当前数组
           prev = callback(this[i], this[i + 1], i + 1, this);
       } else {
           //有初始值，则调用callback，传入prev为第一个值，第二个为当前的i,当前index为i,当前数组
           prev = callback(prev, this[i], i, this);
       }
   }
   return prev;
};

let r1 = [1, 2, 3, 4].reduce(function (prevValue, currentValue, currentIndex, array) {
   return prevValue + currentValue;
},1);
console.log(r1)
```

## vue-router
```js
 let queue = this.router.beforeHooks;

        const iterator = (hook,next) =>{ // 此迭代函数可以拿到对应的hook
            hook(route,this.current,next);
        }
        runQueue(queue,iterator,()=>{
            this.updateRoute(route);
            cb && cb(); // 默认第一次cb是hashchange

            // 后置的钩子
        })

```
## 异步组件

```js
// 实现loading效果
import Loading from '@/components/Loading.vue';

import ErrorComponent from '../components/error.vue';
console.log(Loading, 'Loading');

console.log(Loading, 'Loading');
const loadable = (asyncFunction) => {
  console.log('异步加载的组件', Loading);
  const component = () => ({
    component: asyncFunction(),
    loading: Loading,
    delay: 200,
    error: ErrorComponent,
    timeout: 3000,
  });

  // 最终要返回一个组件，组件需要有render，通过render 在去渲染一个异步组件
  return { // cli 默认不支持模板
    render(h) {
      return h(component);
    },
  };

  // 组件是一个对象 会变成render函数
};
export default loadable;
```

## 表头固定

```js
if(this.height) {
               //固定表头必须有height属性
               this.table = this.$refs.table;
               this.tableWrapper = this.$refs.tableWrapper;
               //拷贝一个空表格
               let copyTable = this.$refs.table.cloneNode();//不传参数true只能拷贝父节点
               let thead = this.table.children[0];
               //先取高度再移走
               this.tableWrapper.style.paddingTop = thead.getBoundingClientRect().height + 'px';

               copyTable.appendChild(thead);//将thead移动到新新的空表格上
               //被拷贝的元素就没有了
               this.tableWrapper.appendChild(copyTable);//将拷贝后的插入到新的表格中
               copyTable.classList.add('fixed-header')
           }

```
## 树形结构生成
```js
 transferData() {
      let Alldata = _.cloneDeep(this.data);
      let treeMapList = Alldata.reduce((memo, current) => {
        memo[current["id"]] = current;
        return memo;
      }, {});
      //   console.log(treeMapList, "treeMapList");
      let res = Alldata.reduce((arr, current) => {
        current.label = current.name;
        //   console.log(arr, current, "arr-current");
        let pid = current.pid;
        let parent = treeMapList[pid];
        if (parent) {
          parent.children
            ? parent.children.push[current]
            : (parent.children = [current]);
        } else if (pid === 0) {
          arr.push(current);
        }
        return arr;
      }, []);
      this.Alldata = res;
    },
```

## 算法

```js

```
## require
```js

const fs = require("fs");
const path = require("path");
const vm = require("vm");

function Module(filename) {
  this.id = filename; //当前文件名
  this.exports = {};
  this.path = path.dirname(filename); //父亲目录
}
Module.wrapper = [
  `(function(exports,require,module,__filename,__dirname){`,
  `})`
];

Module._extensions = {
  ".js"(module) {
    let content = fs.readFileSync(module.id, "utf8");
    content = Module.wrapper[0] + content + Module.wrapper[1];
    let fn = vm.runInThisContext(content); //让字符串执行
    let exports = module.exports; //指向同一个对象
    // let dirname = path.dirname(module.id);
    //模块中的this是module.exports
    fn.call(exports, exports, req, module, module.id, module.path);
  },
  ".json"(module) {
    let content = fs.readFileSync(module.id, "utf8");
    module.exports = JSON.parse(content); //手动将结果赋值给 module.exports
  }
};
//解析当前的文件名
Module._resolveFilename = function(filename) {
  let absPath = path.resolve(__dirname, filename);
  let isExists = fs.existsSync(absPath);
  if (isExists) {
    return absPath;
  } else {
    // 尝试添加 js json后缀
    let keys = Reflect.ownKeys(Module._extensions);
    for (let i = 0; i < keys.length; i++) {
      let newPath = absPath + keys[i]; //尝试增加后缀
      let flag = fs.existsSync(newPath);
      if (flag) {
        return newPath;
      }
    }
    throw new Error("module not exists");
  }
};

Module.prototype.load = function() {
  let extensions = path.extname(this.id);
  //加载时 获取后缀名 根据不同后缀名 不同处理
  Module._extensions[extensions](this); //this当前模块
};
Module._cache = {};
//let r = req('/a') 同时存在 js json
function req(filename) {
  //1.解析当前的文件名 尝试添加 js json后缀
  filename = Module._resolveFilename(filename);
  //4.2如果有缓存 直接取出
  let cacheModule = Module._cache[filename];
  if (cacheModule) {
    return cacheModule.exports;
  }
  //2.创建一个模块
  let module = new Module(filename);
  //4.1如果在文件中多次引用同一个文件 --- 做个缓存
  //module.exports = a; a 是一个具体的值 内部变量发生变化 检测不到
  //es6模块 内部变量发生变化 取值可以取新新值 只能放在顶层代码块中 不能放在代码块中
  Module._cache[filename] = module;
  //3.加载模块
  module.load();
  return module.exports; //最终要返还回去
}
```

## events
```js
function EventEmitter(){
    this._events = Object.create(null);
}
EventEmitter.prototype.on = function(eventName,callback){
    if(!this._events) this._events = Object.create(null);

    // 如果用户绑定的不是newListener 让newListener的回调函数执行
    if(eventName !== 'newListener'){
        //if(this._events['newListener']){
         //   this._events['newListener'].forEach(fn=>fn(eventName))
       // }
     this.emit("newListener", eventName);
  }
    if(this._events[eventName]){
            this._events[eventName].push(callback)
        }else{
            this._events[eventName] = [callback]; // {newListener:[fn1]}
    }
}
EventEmitter.prototype.off = function(eventName, callback) {
  if (this._events[eventName]) {
    this._events[eventName] = this._events[eventName].filter(fn => {
      return fn != callback && fn.l !== callback;
    });
  }
};

EventEmitter.prototype.emit = function(eventName, ...args) {
  if (this._events[eventName]) {
    this._events[eventName].forEach(fn => {
      fn.call(this, ...args);
    });
  }
};

EventEmitter.prototype.once = function(eventName, callback) {
  let one = (...args) => {
    callback.call(this, ...args);
    // 删除掉这个函数
    this.off(eventName, one); // 执行完后在删除掉
  };
  one.l = callback; // one.l = fn; 用来标识 绑定的时候是one是谁的 我删除的时候单纯判断name找不到
  /**
      girl.once('失恋', function(w) { 
                  console.log(w+'监听到了执行')
              })
      girl.off('失恋', function(w) { 
          console.log(w+'监听到了执行')
      }) //这时候删除 需要 one.l = callback 标识一下
    **/
  // 先绑定一个once函数，等待emit触发完后执行one函数 ，执行原有的逻辑，执行后删除once函数
  this.on(eventName, one);
};
```
## 如何实现图片压缩

## webpack 项目体积过大 怎么优化 

其实就是要说整个思路就得  分析工具去分析  然后去找问题。。。

## 如何实现请求并发

## Promise.all 的原理

## 如何实现虚拟滚动
用法
```js
<virtual-list :size="30" :remain="8" :items="items" :variable="true">
      <Item slot-scope="{ item }" :item="item" />
    </virtual-list>
```

items: Array,
    size: Number,//当前每一个的高度 可以算出滚动条的高度
    remain: Number,//可见多少个  可视区域渲染多少个
    variable: Boolean // 不知道固定高度 每一行高度不确定要开启动态计算
   
   
   ```js
 //可渲染的数据
        visibleData() { //会根据start end去截取渲染
          let start = this.start - this.prevCount; //前面多加载一点
          let end = this.end + this.nextCount; //留一点位置 多加载一点
          return this.formatData.slice(start, end);
        },
```

计算渲染高度
滚动的时候去计算应该渲染多少
```js
 // 计算开始 获取当前应该从第几个开始
        this.start = Math.floor(scrollTop / this.size);
        // 计算结束
        this.end = this.start + this.remain; //当前可渲染的区域
        // 计算偏移量 可视区域计算偏移量
        // this.offset = this.start * this.size - this.prevCount * this.size
        //让当前渲染的内容在可是区域内
        //如果有预留渲染 应该减去前面增加的预留部分
        this.offset =
          scrollTop - (scrollTop % this.size) - this.prevCount * this.size;
```


//先预估高度posionts 然后滚动的时候更新每行的position位置 -- getBoundingClientRect

-- 然后更新最新真实高度 通过二分查找的方式查找当前开始位置

## webpack优化

- 代码层面

img 如果不需要那么大 可以对图片进行压缩上传

数据过多的 考虑到懒加载 和 虚拟滚动去实现

数组循环能用some用some 因为可以提前终止掉

遍历数组的时候 可以用到广度优先遍历 就是找children id 那个 用栈

使用Es6规范导入代码可以实现treeShaking
如果一个函数依赖了另一个函数 可以用高阶函数进行包裹 如果被包裹的函数没有被用到 也会被检测到

组件封装 vue是组件级渲染的 每个组件都有一个渲染watcher

- 网络层面
减少HTTP请求数，合并JS、CSS,合理内嵌CSS、JS

合理设置服务端缓存，提高服务器处理速度。 (强制缓存、对比缓存)

// Expires/Cache-Control   Etag/if-none-match/last-modified/if-modified-since
避免重定向，重定向会降低响应速度 (301,302)

使用dns-prefetch,进行DNS预解析

采用域名分片技术，将资源放到不同的域名下。接触同一个域名最多处理6个TCP链接问题。

采用CDN加速加快访问速度。(指派最近、高度可用)

gzip压缩优化 对传输资源进行体积压缩 (html,js,css)

// Content-Encoding: gzip
加载数据优先级 : preload（预先请求当前页面需要的资源） prefetch（将来页面中使用的资源） 将数据缓存到HTTP缓存中

项目依赖太大 -- 用分析工具分析  ---用DLLPlugin 动态链接库

- http 网络请求这一块


- webpack 
1.通常来说，我们的代码都可以至少简单区分成业务代码和第三方库。如果不做处理，
每次构建时都需要把所有的代码重新构建一次，耗费大量的时间。
然后大部分情况下，很多第三方库的代码并不会发生变更（除非是版本升级），
这时就可以用到dll：把复用性较高的第三方模块打包到动态链接库中，
在不升级这些库的情况下，动态库不需要重新打包，每次构建只重新打包业务代码。

2.babel-plugin-import 实现自动按需打包 。实现的就是按需加载

import { Button } from 'antd';
这样的引用，会使得最终打包的代码中包含所有 antd 导出来的内容。假设应用中并没有使用 antd 提供的 TimePicker 组件，那么对于打包结果来说，无疑增加了代码体积。在这种情况下，如果组件库提供了 ES Module 版本，
并开启了 Tree Shaking，我们就可以通过“摇树”特性，将不会被使用的代码在构建阶段移除。
Webpack 可以在 package.json 中设置sideEffects: false。
我们在 antd 源码当中可以找到（相关 chore commit）：

2.split-chunks-plugin 通过 splitChunk 插件提取公共代码（公共代码分割）。
 提供了以下能力
在压缩前体积大于 30KB 的模块；
在按需加载模块时，并行加载的模块不得超过 5 个；
在页面初始化加载时，并行加载的模块不得超过 3 个。


3.第三方库Cdn

4.css 单独引入 打包成link 利用link的新特性

5. treeShaking Es6模块 使用不到的代码 可以被抛弃
习惯将常量写在类中，但在组件函数中，这意味着每次渲染都会重新声明常量，
这是完全无意义的操作。其次就是组件内的函数每次会被重新创建，如果这个函数需要使用函数组件内部的变量，
那么可以用 useCallback 包裹下这个函数。

第三点就是 useEffect 的第二个参数容易被错误使用。很多同学习惯在第二个参数放置引用类型的变量，
通常的情况下，引用类型的变量很容易被篡改，难以判断开发者的真实意图，所以更推荐使用值类型的变量。
当然有个小技巧是 JSON 序列化引用类型的变量，也就是通过 JSON.stringify 将引用类型变量转换为字符串来解决。
但不推荐这个操作方式，比较消耗性能。


## redux

View（视图层）：用户界面。该用户界面可以是以任何形式实现出来的，React 组件是一种形式，Vue、Angular 也完全 OK。Flux 架构与 React 之间并不存在耦合关系。

Action（动作）：也可以理解为视图层发出的“消息”，它会触发应用状态的改变。

Dispatcher（派发器）：它负责对 action 进行分发。

Store（数据层）：它是存储应用状态的“仓库”，此外还会定义修改状态的逻辑。store 的变化最终会映射到 view 层上去。

Store：它是一个单一的数据源，而且是只读的。

Action 人如其名，是“动作”的意思，它是对变化的描述。

Reducer 是一个函数，它负责对变化进行分发和处理，最终将新的数据返回给 Store。

applyMiddleware.js

bindActionCreators.js

combineReducers.js

compose.js

createStore.js

createStore 方法可以接收以下 3 个入参：

reducer

初始状态内容

指定中间件
```js

// 引入 redux
import { createStore } from 'redux'
// 创建 store
const store = createStore(
    reducer,
    initial_state,
    applyMiddleware(middleware1, middleware2, ...)
);
```

createStore 

getState

subscribe

dispatch
Redux 工作流的核心：dispatch 动作
1. 通过“上锁”避免“套娃式”的 dispatch

在调用 reducer 之前，Redux 首先会将 isDispatching 变量置为 true，待 reducer 执行完毕后，
再将 isDispatching 变量置为 false。这个操作你应该不陌生，
因为在第 11 讲中，setState 的“批处理”也是用类似的“上锁”方式来实现的。
当dispatch action 发生时，Redux 会在 reducer 执行完毕后，
将 listeners 数组中的监听函数逐个执行。这就是 subscribe 与 Redux 主流程之间的关系。


## componse 
实现

```js

function compose(...funcs) {
    if (funcs.length === 0) return args => args;
    if (funcs.length ===1) {
        return funcs[0];
    }
    return funcs.reduce((func, next)=>(...args) => func(next(...args)));
}
```
## api限制并发

```js
function createRequest(tasks, pool, callback) {
    if (typeof pool === "function") {
        callback = pool;
        pool = 5;
    }
    if (typeof pool !== "number") pool = 5;
    if (typeof callback !== "function") callback = function () {};
    //------
    class TaskQueue {
        running = 0;
        queue = [];
        results = [];
        pushTask(task) {
            let self = this;
            self.queue.push(task);
            self.next();
        }
        next() {
            let self = this;
            while (self.running < pool && self.queue.length) {
                self.running++;
                console.log(self.queue, 'self.queue');
                let task = self.queue.shift();
                task().then(result => {
                    self.results.push(result);
                }).finally(() => {
                    self.running--;
                    self.next();
                });
            }
            if (self.running === 0) callback(self.results);
        }
    }
    let TQ = new TaskQueue;
    tasks.forEach(task => TQ.pushTask(task));
}
//使用
createRequest(tasks, 2, results => {
    // console.log(results);
    console.timeEnd('cost');
    console.log(results);
});
```

## componse

```js

 function compose(...funcs) {
     if (funcs.length === 0) return args => args;
     if (funcs.length ===1) {
         return funcs[0];
     }
     return funcs.reduce((func, next)=>(...args) => func(next(...args)));
 }
```

## 性能优化

1.较小的图片用base54加载更快

2.图片加载启用webp/使用阿里云OSS服务 启用webp/项目私有化部署

3.script标签特性
 async  异步加载资源 立即执行 执行的过程中会阻塞
 
 defer 

充分利用link标签 dns-prefetch 

css资源分包处理 实现懒加载

4. 性能优化指标 首屏渲染 请求响应速度 performace 可以查看 页面资源加载速度等

5. tree-shaking

6. 4-2 使用 DllPlugin 可以提高构建速度

7.开启多个子进程进行打包

8. 文件压缩等

## reduce
```js
Array.prototype.reduce = function (callback,prev) {
   //遍历this 数组
   for (let i = 0; i < this.length; i++) {
       //判断有没有设置初始值
       if (typeof prev === "undefined") {
           //没有初始值，则调用callback,转入当前值，下一个值，当前index为下一个,当前数组
           prev = callback(this[i], this[i + 1], i + 1, this);
       } else {
           //有初始值，则调用callback，传入prev为第一个值，第二个为当前的i,当前index为i,当前数组
           prev = callback(prev, this[i], i, this);
       }
   }
   return prev;
};

let r1 = [1, 2, 3, 4].reduce(function (prevValue, currentValue, currentIndex, array) {
   return prevValue + currentValue;
},1);
console.log(r1)
```

## vue-router




```js
 let queue = this.router.beforeHooks;

        const iterator = (hook,next) =>{ // 此迭代函数可以拿到对应的hook
            hook(route,this.current,next);
        }
        runQueue(queue,iterator,()=>{
            this.updateRoute(route);
            cb && cb(); // 默认第一次cb是hashchange

            // 后置的钩子
        })

```
## 异步组件

```js
// 实现loading效果
import Loading from '@/components/Loading.vue';

import ErrorComponent from '../components/error.vue';
console.log(Loading, 'Loading');

console.log(Loading, 'Loading');
const loadable = (asyncFunction) => {
  console.log('异步加载的组件', Loading);
  const component = () => ({
    component: asyncFunction(),
    loading: Loading,
    delay: 200,
    error: ErrorComponent,
    timeout: 3000,
  });

  // 最终要返回一个组件，组件需要有render，通过render 在去渲染一个异步组件
  return { // cli 默认不支持模板
    render(h) {
      return h(component);
    },
  };

  // 组件是一个对象 会变成render函数
};
export default loadable;
```

## 表头固定

```js
if(this.height) {
               //固定表头必须有height属性
               this.table = this.$refs.table;
               this.tableWrapper = this.$refs.tableWrapper;
               //拷贝一个空表格
               let copyTable = this.$refs.table.cloneNode();//不传参数true只能拷贝父节点
               let thead = this.table.children[0];
               //先取高度再移走
               this.tableWrapper.style.paddingTop = thead.getBoundingClientRect().height + 'px';

               copyTable.appendChild(thead);//将thead移动到新新的空表格上
               //被拷贝的元素就没有了
               this.tableWrapper.appendChild(copyTable);//将拷贝后的插入到新的表格中
               copyTable.classList.add('fixed-header')
           }

```
## 树形结构生成
```js
 transferData() {
      let Alldata = _.cloneDeep(this.data);
      let treeMapList = Alldata.reduce((memo, current) => {
        memo[current["id"]] = current;
        return memo;
      }, {});
      //   console.log(treeMapList, "treeMapList");
      let res = Alldata.reduce((arr, current) => {
        current.label = current.name;
        //   console.log(arr, current, "arr-current");
        let pid = current.pid;
        let parent = treeMapList[pid];
        if (parent) {
          parent.children
            ? parent.children.push[current]
            : (parent.children = [current]);
        } else if (pid === 0) {
          arr.push(current);
        }
        return arr;
      }, []);
      this.Alldata = res;
    },
```
## require
```js

const fs = require("fs");
const path = require("path");
const vm = require("vm");

function Module(filename) {
  this.id = filename; //当前文件名
  this.exports = {};
  this.path = path.dirname(filename); //父亲目录
}
Module.wrapper = [
  `(function(exports,require,module,__filename,__dirname){`,
  `})`
];

Module._extensions = {
  ".js"(module) {
    let content = fs.readFileSync(module.id, "utf8");
    content = Module.wrapper[0] + content + Module.wrapper[1];
    let fn = vm.runInThisContext(content); //让字符串执行
    let exports = module.exports; //指向同一个对象
    // let dirname = path.dirname(module.id);
    //模块中的this是module.exports
    fn.call(exports, exports, req, module, module.id, module.path);
  },
  ".json"(module) {
    let content = fs.readFileSync(module.id, "utf8");
    module.exports = JSON.parse(content); //手动将结果赋值给 module.exports
  }
};
//解析当前的文件名
Module._resolveFilename = function(filename) {
  let absPath = path.resolve(__dirname, filename);
  let isExists = fs.existsSync(absPath);
  if (isExists) {
    return absPath;
  } else {
    // 尝试添加 js json后缀
    let keys = Reflect.ownKeys(Module._extensions);
    for (let i = 0; i < keys.length; i++) {
      let newPath = absPath + keys[i]; //尝试增加后缀
      let flag = fs.existsSync(newPath);
      if (flag) {
        return newPath;
      }
    }
    throw new Error("module not exists");
  }
};

Module.prototype.load = function() {
  let extensions = path.extname(this.id);
  //加载时 获取后缀名 根据不同后缀名 不同处理
  Module._extensions[extensions](this); //this当前模块
};
Module._cache = {};
//let r = req('/a') 同时存在 js json
function req(filename) {
  //1.解析当前的文件名 尝试添加 js json后缀
  filename = Module._resolveFilename(filename);
  //4.2如果有缓存 直接取出
  let cacheModule = Module._cache[filename];
  if (cacheModule) {
    return cacheModule.exports;
  }
  //2.创建一个模块
  let module = new Module(filename);
  //4.1如果在文件中多次引用同一个文件 --- 做个缓存
  //module.exports = a; a 是一个具体的值 内部变量发生变化 检测不到
  //es6模块 内部变量发生变化 取值可以取新新值 只能放在顶层代码块中 不能放在代码块中
  Module._cache[filename] = module;
  //3.加载模块
  module.load();
  return module.exports; //最终要返还回去
}
```

## events源码模拟
```js
function EventEmitter(){
    this._events = Object.create(null);
}
EventEmitter.prototype.on = function(eventName,callback){
    if(!this._events) this._events = Object.create(null);

    // 如果用户绑定的不是newListener 让newListener的回调函数执行
    if(eventName !== 'newListener'){
        //if(this._events['newListener']){
         //   this._events['newListener'].forEach(fn=>fn(eventName))
       // }
     this.emit("newListener", eventName);
  }
    if(this._events[eventName]){
            this._events[eventName].push(callback)
        }else{
            this._events[eventName] = [callback]; // {newListener:[fn1]}
    }
}
EventEmitter.prototype.off = function(eventName, callback) {
  if (this._events[eventName]) {
    this._events[eventName] = this._events[eventName].filter(fn => {
      return fn != callback && fn.l !== callback;
    });
  }
};

EventEmitter.prototype.emit = function(eventName, ...args) {
  if (this._events[eventName]) {
    this._events[eventName].forEach(fn => {
      fn.call(this, ...args);
    });
  }
};

EventEmitter.prototype.once = function(eventName, callback) {
  let one = (...args) => {
    callback.call(this, ...args);
    // 删除掉这个函数
    this.off(eventName, one); // 执行完后在删除掉
  };
  one.l = callback; // one.l = fn; 用来标识 绑定的时候是one是谁的 我删除的时候单纯判断name找不到
  /**
      girl.once('失恋', function(w) { 
                  console.log(w+'监听到了执行')
              })
      girl.off('失恋', function(w) { 
          console.log(w+'监听到了执行')
      }) //这时候删除 需要 one.l = callback 标识一下
    **/
  // 先绑定一个once函数，等待emit触发完后执行one函数 ，执行原有的逻辑，执行后删除once函数
  this.on(eventName, one);
};
```
## 如何实现图片压缩

## webpack 项目体积过大 怎么优化 

其实就是要说整个思路就得  分析工具去分析  然后去找问题。。。

## 如何实现请求并发

## Promise.all 的原理

## 如何实现虚拟滚动
用法
```js
<virtual-list :size="30" :remain="8" :items="items" :variable="true">
      <Item slot-scope="{ item }" :item="item" />
    </virtual-list>
```

items: Array,
    size: Number,//当前每一个的高度 可以算出滚动条的高度
    remain: Number,//可见多少个  可视区域渲染多少个
    variable: Boolean // 不知道固定高度 每一行高度不确定要开启动态计算
   
   
   ```js
 //可渲染的数据
        visibleData() { //会根据start end去截取渲染
          let start = this.start - this.prevCount; //前面多加载一点
          let end = this.end + this.nextCount; //留一点位置 多加载一点
          return this.formatData.slice(start, end);
        },
```

计算渲染高度
滚动的时候去计算应该渲染多少
```js
 // 计算开始 获取当前应该从第几个开始
        this.start = Math.floor(scrollTop / this.size);
        // 计算结束
        this.end = this.start + this.remain; //当前可渲染的区域
        // 计算偏移量 可视区域计算偏移量
        // this.offset = this.start * this.size - this.prevCount * this.size
        //让当前渲染的内容在可是区域内
        //如果有预留渲染 应该减去前面增加的预留部分
        this.offset =
          scrollTop - (scrollTop % this.size) - this.prevCount * this.size;
```


//先预估高度posionts 然后滚动的时候更新每行的position位置 -- getBoundingClientRect

-- 然后更新最新真实高度 通过二分查找的方式查找当前开始位置

## webpack优化

- 代码层面

img 如果不需要那么大 可以对图片进行压缩上传

数据过多的 考虑到懒加载 和 虚拟滚动去实现

数组循环能用some用some 因为可以提前终止掉

遍历数组的时候 可以用到广度优先遍历 就是找children id 那个 用栈

使用Es6规范导入代码可以实现treeShaking
如果一个函数依赖了另一个函数 可以用高阶函数进行包裹 如果被包裹的函数没有被用到 也会被检测到

组件封装 vue是组件级渲染的 每个组件都有一个渲染watcher

- 网络层面
减少HTTP请求数，合并JS、CSS,合理内嵌CSS、JS

合理设置服务端缓存，提高服务器处理速度。 (强制缓存、对比缓存)

// Expires/Cache-Control   Etag/if-none-match/last-modified/if-modified-since
避免重定向，重定向会降低响应速度 (301,302)

使用dns-prefetch,进行DNS预解析

采用域名分片技术，将资源放到不同的域名下。接触同一个域名最多处理6个TCP链接问题。

采用CDN加速加快访问速度。(指派最近、高度可用)

gzip压缩优化 对传输资源进行体积压缩 (html,js,css)

// Content-Encoding: gzip
加载数据优先级 : preload（预先请求当前页面需要的资源） prefetch（将来页面中使用的资源） 将数据缓存到HTTP缓存中

项目依赖太大 -- 用分析工具分析  ---用DLLPlugin 动态链接库

- http 网络请求这一块


- webpack 
1.通常来说，我们的代码都可以至少简单区分成业务代码和第三方库。如果不做处理，
每次构建时都需要把所有的代码重新构建一次，耗费大量的时间。
然后大部分情况下，很多第三方库的代码并不会发生变更（除非是版本升级），
这时就可以用到dll：把复用性较高的第三方模块打包到动态链接库中，
在不升级这些库的情况下，动态库不需要重新打包，每次构建只重新打包业务代码。

2.babel-plugin-import 实现自动按需打包 。实现的就是按需加载

import { Button } from 'antd';
这样的引用，会使得最终打包的代码中包含所有 antd 导出来的内容。假设应用中并没有使用 antd 提供的 TimePicker 组件，那么对于打包结果来说，无疑增加了代码体积。在这种情况下，如果组件库提供了 ES Module 版本，
并开启了 Tree Shaking，我们就可以通过“摇树”特性，将不会被使用的代码在构建阶段移除。
Webpack 可以在 package.json 中设置sideEffects: false。
我们在 antd 源码当中可以找到（相关 chore commit）：

2.split-chunks-plugin 通过 splitChunk 插件提取公共代码（公共代码分割）。
 提供了以下能力
在压缩前体积大于 30KB 的模块；
在按需加载模块时，并行加载的模块不得超过 5 个；
在页面初始化加载时，并行加载的模块不得超过 3 个。


3.第三方库Cdn

4.css 单独引入 打包成link 利用link的新特性

5. treeShaking Es6模块 使用不到的代码 可以被抛弃
