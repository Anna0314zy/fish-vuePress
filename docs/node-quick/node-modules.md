---
title: Node中的模块
date: 2019-01-06
tags:
  - Node.js
---

# Node 中的模块

## 一.commonjs 规范

开发会有命名冲突 命名空间防止冲突（调用时不方便）
esModule commonjs umd 统一模块 amd 模块(很少)
import export 浏览器 es6
require module.exports node 使用的（node 中使用需要使用 es6 babel 编译）

- 1.每个 js 文件都是一个模块
- 2.模块的导出 module.exports
- 3.模块的导入 require

## 二.node 中的模块的分类

- 1.核心模块/内置模块 fs http path 不需要安装 引入的时候不需要增加相对路径、绝对路径
  fs path vm

  ```js
  const fs = require("fs");
  const result = fs.readFileSync("./node.md", "utf8");
  console.log("result"); //同步的方法
  fs.existsSync("./node.md"); //文件是否存在
  const path = require("path");
  path.resolve("note.md"); //你给我一个相对路径 -- 绝对路径 返回的是当前工作路径（可能会改变）
  path.resolve(__dirname, "note.md", "a"); //当前文件的所在路径
  //如果遇到带/的路径  path.resolve会认为是根路径 join只是简单拼接在一起
  path.join(); //只是简单的拼接路径
  path.extname("a.min.js"); //后缀名
  path.relative("a", "a/a.js"); //a.js 第一个a是相对路径 去掉相同的路径
  path.dirname(__dirname); //取父路径 __dirname = path.dirname
  const vm = require("vm");
  const a = 100;
  const log = `console.log(a)`;
  vm.runInThisContext(log); //让字符串直接执行 并在沙箱环境中
  ```

- 2.第三方模块**需要安装**
- 3.**自定义模块**需要通过绝对路径或者相对路径进行引入 require()

## 三.模块实现

实现 node 中的模块化机制

let r = require('./a);

require 中可以存放相对路径 绝对路径 可以默认省略.js .json

- 先去读取 a 文件 拿到 a 文件内容进行函数的包裹 module.exports = 'hello'

```js
function(exports, module, require, __dirname, __filename) {
  module.exports = 'hello';
  return module.exports

}(exports, module, require, __dirname, __filename)
```

- 2 vm 让函数执行

思路 1.

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

### 3.1 默认 module.exports

**默认 module.exports 以下只会导出 1**module.exports 导出的是个具体的值

```js
exports.a = 100;
exports.b = 10;
module.exports = 1;
```

### 3.2 查找原则

> 尽量文件名字不要跟文件夹的名字一样
> let r = require('./a)

- 先找.js 再找 json -> 找不到找文件夹中的 index.js
- 如果没有 index.js 则会查找 package.json 中的 main 字段 确认入口文件
- 如果文件不是绝对路径和相对路径 则会去 node_modules 去找（除了核心模块）
  如果当前 node_modules 会逐一向上查找-直到根目录

## 代码如何调试

node --inspect-brk usea.js 借助浏览器调试

chrome://inspect/#device

vscode 调试

## 四.Events 模块

node 中自己实现的发布订阅模块,订阅是将方法对应成一种一对多的关系，on 方法用来订阅事件

```js
let EventEmitter = require("./events");
// let e = new EventEmitter();
//让我的类具备这种功能
function Girl() {
  // EventEmitter.call(this);
}
//继承原型上的方法
util.inherits(Girl, EventEmitter);
//Object.setPrototypeOf(Girl.prototype, EventEmitter.prototype)
//Girl.prototype.__proto__ = EventEmitter.prototype;
//Girl.prototype = Object.create(EventEmitter.prototype)
let girl = new Girl();
// 当用户监听了失恋  就去执行这个函数
let lisenter = w => {
  console.log(w + "吃东西");
};
let lisenter1 = w => {
  console.log(w + "逛街");
};
girl.once("女生失恋", lisenter); //只能触发一次
girl.on("女生失恋", lisenter);
girl.on("女生失恋", lisenter1);
girl.off("女生失恋", lisenter);
girl.emit("女生失恋", "我"); //发布的时候传参

girl.on('newListener', (type) => {
    if (type === '失恋') {//每次on 就执行一次
        process.nextTick(() => {
            girl.emit(type);//执行的时候 数组有2个 2*2 = 4 这个要执行2次
        })
    }
})
```

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
```

off 方法可以移除对应的事件监听

```js
// 移除绑定的事件
EventEmitter.prototype.off = function(eventName, callback) {
  if (this._events[eventName]) {
    this._events[eventName] = this._events[eventName].filter(fn => {
      return fn != callback && fn.l !== callback;
    });
  }
};
```

emit 用来执行订阅的事件

```js
EventEmitter.prototype.emit = function(eventName, ...args) {
  if (this._events[eventName]) {
    this._events[eventName].forEach(fn => {
      fn.call(this, ...args);
    });
  }
};
```

once 绑定事件当执行后自动删除订阅的事件

```js
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
