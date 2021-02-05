---
title: 从零开始，手写完整的Promise原理
date: 2020-12-30
tags:
  - Node.js
---

# 从零开始，手写完整的 Promise 原理

## 目标

- 掌握高阶函数的使用，使用高阶函数解决异步问题。

- 掌握发布订阅模式和观察者模式

- 掌握 promise 核心应用，使用 promise 解决异步编程问题

- 实现一个完整的 promise 库

- 扩展 promise 中常见方法 all,race,finally...
- async await 实现原理


promise完整代码仓库路径 Anna0314zy/node-zy/2.promise/promise
## 高阶函数

什么是高阶函数： 把函数作为参数或者返回值的一类函数。

### before 函数

```js
Function.prototype.before = function(beforeFn) {
  return () => {
    beforeFn();
    this();
  };
};
function fn() {
  console.log("source");
}
const newFn = fn.before(say => {
  console.log("say");
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
  return function(params) {
    return Object.prototype.toString.call(params) === `[object ${typing}]`;
  };
}
let uilts = {};
["Number", "String", "Boolean"].forEach(key => {
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
  return function(...args) {
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
类型检测;
function isType(typing) {
  return function(params) {
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
> 发布订阅有个中介管理 订阅事件 然后用户可以选择发布

实现效果 -- 文件都读取完毕了 打印 obj

```js
let eventObj = {
  arr: [], //中介
  on(fn) {
    this.arr.push(fn);
  },
  emit() {
    this.arr.forEach(fn => fn());
  }
};
fs.readFile("./a.text", "utf8", function(err, data) {
  if (err) return console.log(err);
  obj.name = data;
  eventObj.emit();
});
fs.readFile("./b.text", "utf8", function(err, data) {
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

解决异步回调

> 把观察者集中到被观察者内部 一旦状态发生改变 通知观察者

```js
class Subject {
  constructor(name) {
    this.name = name;
    this.state = "在玩呢";
    this.observers = [];
  }
  attach(o) {
    this.observers.push(o);
  }
  setState(newState) {
    this.state = newState;
    this.observers.forEach(o => o.update(this));
  }
}
class Observer {
  constructor(name) {
    this.name = name;
  }
  update(baby) {
    console.log(`${baby.name}跟${this.name} 说 ${baby.state}`);
  }
}
let baby = new Subject("baby");
let o1 = new Observer("mama");
let o2 = new Observer("baba");
baby.attach(o1);
baby.attach(o2);
baby.setState("有人打我");
```

# 手写 Promise

## promise 解决了哪些问题

- 解决了哪些问题 异步并发 异步串行
- 解决回调地狱 上一个输出是下一个输入
- 错误处理非常方便 catch 方法
- 缺陷 依旧基于回调函数

## promise 详解 写作思路

### 基础 promise

- promse 是一个类 类需要传入 executor 执行器 两个参数 resolve reject 默认会立即执行
- 3 个状态（PENDING，RESOLVED，REJECTED） 一旦成功能就不能失败 一旦失败就不能成功
- 内部有个 then 函数 返回的是一个新的 promise 实例 有两个回调 (resolve, reject)
  1.  传入 executor 立马执行 executor throw Error 走到 then 的 reject 中
  2.  记录 成功参数 resolve(value) 失败参数 reject(reject)
      当状态改变 传递给 then 的参数 onfulfilled onrejected
  3.  executor 写一个异步回调 then 中 一秒后打印出结果 把回调存起来 等状态改变了 执行
      promise 源码模拟
  ```js
  const STATUS = {
    PENDING: "PENDING", //等待
    RESOLVED: "RESOLVED", //成功
    REJECTED: "REJECTED" //失败
  };
  class Promise {
    constructor(executor) {
      this.status = STATUS.PENDING; //默认是等待它
      this.value = undefined;
      this.reason = undefined;
      //专门存放成功的回调函数 等状态变了 执行对应的函数
      this.onResolevedCallbacks = [];
      this.onRejectedCallbacks = [];
      //专门存放失败的回调函数
      const resolve = value => {
        if (this.status === STATUS.PENDING) {
          this.status = STATUS.RESOLVED;
          this.value = value;
          //需要将成功的方法依次执行
          this.onResolevedCallbacks.forEach(fn => fn());
        }
      };
      const reject = reason => {
        if (this.status === STATUS.PENDING) {
          this.status = STATUS.REJECTED;
          this.reason = reason;
          //需要将成功的方法依次执行
          this.onRejectedCallbacks.forEach(fn => fn());
        }
      };
      try {
        executor(resolve, reject);
      } catch (e) {
        reject(e);
      }
    }
    then(onfulfilled, onrejected) {
      if (this.status === STATUS.RESOLVED) {
        onfulfilled(this.value);
      }
      if (this.status === STATUS.REJECTED) {
        onrejected(this.reason);
      }
      //如果executor 中是一个异步函数 此时还是pending状态 收集起来 等时间到了执行
      if (this.status === STATUS.PENDING) {
        this.onResolevedCallbacks.push(() => {
          onfulfilled(this.value);
        });
        this.onRejectedCallbacks.push(() => {
          onrejected(this.reason);
        });
      }
    }
  }
  module.exports = Promise;
  ```

测试示例

```js
const p = new Promise((reslove, reject) => {
  console.time("cost");
  // throw Error('抛出一个错误')
  setTimeout(() => {
    reject("ok");
  }, 1000);
}).then(
  data => {
    console.timeEnd("cost");
    console.log("data:", data);
    return 12;
  },
  err => {
    console.log("err:", err);
  }
);
```

### 实现链式调用

链式调用 每次调用返回一个新的 promise

- 不管成功或者失败 都会走到下一次的 then 方法中
- 如果 then 方法中（成功或者失败）返回的不是一个 promise 会将这个值传递给外层下一次 then 的成功结果
- 如果执行 then 方法中的方法出错了 抛出异常 走到下一个 then 的失败中
- 返回的是一个 promise 会用这个 promise 的结果作为下一次 then 的成功或者失败
- 如果没有处理错误 会继续向下找 错误会就近找 如果上一个 then 中的 err 捕获错误了 catch 捕获不到 没有中断

::: tip 走失败只有两种可能

1.发生了错误 2.返回了一个失败的 promise
:::
分批解决

> - 如果执行 then 方法中的方法出错了 抛出异常 走到下一个 then 的失败中
> - 如果 then 方法中（成功或者失败）返回的不是一个 promise 会将这个值传递给外层下一次 then 的成功结果

```js
 then(onfulfilled, onrejected) {
     let promise2;
     promise2 = new Promise((resolve, reject) => {
        if (this.status === STATUS.RESOLVED) {
            try {
                let x = onfulfilled(this.value);
                resolve(x);
            }catch(e) {
                reject(e);
            }

          }
          if (this.status === STATUS.REJECTED) {

            try {
               let x =  onrejected(this.reason);
               resolve(x);
            }catch(e) {
                reject(e);
            }
          }
          //如果executor 中是一个异步函数 此时还是pending状态 收集起来 等时间到了执行
          if (this.status === STATUS.PENDING) {
            this.onResolevedCallbacks.push(() => {
                try {
                    let x = onfulfilled(this.value);
                    resolve(x);
                }catch(e) {
                    reject(e);
                }

            });
            this.onRejectedCallbacks.push(() => {
                try {
                   let x =  onrejected(this.reason);
                   resolve(x);
                }catch(e) {
                    reject(e);
                }

            });
          }
     })
     return promise2;

  }
```

测试代码

```js
const fs = require("fs");
let read = (...args) => {
  return new Promise((resolve, reject) => {
    fs.readFile(...args, function(err, data) {
      if (err) reject();
      resolve(data);
    });
  });
};

read("./a.text", "utf8")
  .then(
    data => {
      throw new Error("我错了");
      // return 100;
    },
    err => {
      return 200;
    }
  )
  .then(
    data => {
      console.log("success" + data);
    },
    err => {
      console.log("err:" + err);
    }
  );
```

> 返回的是一个 promise 会用这个 promise 的结果作为下一次 then 的成功或者失败
>
> - 难点 如何拿到 promise2 用异步获取
> - 递归解析 x resolvePromise(promise2, x, resolve, reject)

    -目的判断x 是不是一个promise 还要考虑到resolve有可能还是一个promise 递归解析x
    - 引用的promise 可能调用别人的promise 防止又掉成功 又掉失败

如何拿到 promise 2

```js
if (this.status === STATUS.RESOLVED) {
  setTimeout(() => {
    try {
      let x = onfulfilled(this.value);
      resolvePromise(promise2, x, resolve, reject);
    } catch (e) {
      reject(e);
    }
  }, 0);
}
```

- 对 x 的类型判断 常量可以直接跑出来 但是如果是 promise 需要采取当前的 promise 的状态
- 所有人写的 promise 都必须遵循规范 尽可能考虑别人的 promise 出错的地方

```js
function resolvePromise(promise2, x, resolve, reject) {
  if (promise2 === x) {
    //a+规范  返回相同一个promise promise循环引用了
    return reject(
      new TypeError("Chaining cycle detected for promise #<Promise>")
    );
  }
  if ((typeof x === "object" && x !== null) || typeof x === "function") {
    //尝试取then 方法 官网这么说的  （取then的时候 别人setter 定义 抛出异常）
    let called;
    try {
      let then = x.then;
      //可能别人如下定义 所以取then的时候取一次就行了
      //   Object.defineProperty('then', {
      //       set() {
      //           if (index++) {
      //               throw new Error('')
      //           }
      //       }
      //   })
      if (typeof then === "function") {
        //就认为他是一个promise

        then.call(
          x,
          y => {
            if (called) return;
            called = true;
            //可能reslove(里面还有可能是一个promise) 递归解析
            resolvePromise(promise2, y, resolve, reject);
          },
          r => {
            if (called) return;
            called = true;
            reject(r); //让当前的失败即可
          }
        );
      } else {
        //x就是一个普通对象
        resolve(x);
      }
    } catch (e) {
      if (called) return;
      called = true;
      reject(e);
    }
  } else {
    //x是一个普通值
    resolve(x);
  }
}
```

### onfulfilled, onrejected 不是必填

实现效果

```js
let p1 = new Promise((resolve, reject) => {
  resolve(200);
});
p1.then()
  .then()
  .then(data => {
    console.log(data); // 还能拿到200
  });
```

实现

```js
class Promise {
  then(onfulfilled, onrejected) {
    onfulfilled = typeof onfulfilled === "function" ? onfulfilled : v => v;
    onrejected =
      typeof onrejected === "function"
        ? onrejected
        : err => {
            throw err;
          };
  }
}
```

### 测试 promise

源码中写上

```js
Promise.defer = Promise.deferred = function() {
  let dfd = {};
  dfd.promise = new Promise((resolve, reject) => {
    dfd.resolve = resolve;
    dfd.reject = reject;
  });
  return dfd;
};
```

延迟对象还能这样用

```js
read = (...args) => {
  let dfd = Promise.defer();
  fs.readFile(...args, function(err, data) {
    if (err) dfd.reject();
    dfd.resolve(data);
  });
  return dfd.promise;
};
read("./a.text", "utf8").then(
  data => {
    // throw new Error('我错了');
    console.log(data, "daya--");
  },
  err => {
    return 200;
  }
);
```

```markdown
npm i promises-aplus-tests

> promises-aplus-tests 需要测试的文件
```

### catch

```js
class Promise {
  //...
  catch(err) {
    this.then(null, err);
  }
}
```

### Promise.resolve()

静态方法 通过 Promise.resolve 调用
里面的方法是异步执行的 有等待效果

```js
class Promise {
  constructor() {
    //...递归解析val 可能是一个promise 是的话 val.then 保证了代码异步执行
    const resolve = val => {
      if (val instanceof Promise) {
        return val.then(resolve, reject);
      }
    };
  }
  static resolve(val) {
    return new Promise((resolve, reject) => {
      resolve(val); //返回的可能是一个promise
    });
  }
}
```

### Promise.reject

直接改变 promise 的状态 没有等待效果

```js
class Promise {
  constructor() {
    // const reject =() => {} ...
  }
  static reject(reason) {
    return new Promise((resolve, reject) => {
      reject(reason);
    });
  }
}
```

### Promise.all

> 异步串行并发 都成功了 才成功 如果有失败的立马失败

```js
static all(prmosies) {
    function isPromise(val) {
        return val && typeof val.then === "function";
    }

    return new Promise((resolve, reject) => {
      let results = [];
      let times = 0;
      function processData(val, index) {
        results[index] = val;
        if (++times === prmosies.length) {
          resolve(results);
        }
      }
      for (let i = 0; i < prmosies.length; i++) {
        let p = prmosies[i];
        if (isPromise(p)) {
          p.then((data) => {
              console.log(data, 'data');
            processData(data, i);
          }, reject);
        } else {
          processData(p, i);
        }
      }
    });
  }
```

用法

```js
let fs = require("fs").promises;

let getName = fs.readFile("./a.text", "utf8");
let getAge = fs.readFile("./b.text", "utf8");
Promise.all([1, getName, getAge, 2])
  .then(data => {
    console.log(data); //拿到返回的所有结果
  })
  .catch(err => {
    console.log(err, "err"); //一旦有一个失败 只返回失败的那个结果
  });
```

### promise.finally

- 原型上的方法 无论如何都执行 没有参数 其实就是执行 then 方法
- 内部可以返回一个 promise 成功或者失败的结果将作为 then 的参数

```js
Promise.prototype.finally = function(callback) {
  return this.then(
    data => {
      return Promise.resolve(callback()).then(() => data); //让本次的返回值作为下一次的参数
    },
    err => {
      return Promise.resolve(callback()).then(() => {
        throw err;
      }); //让本次的返回值作为下一次的参数
    }
  );
};
```

用法

```js
Promise.resolve(123)
  .finally(data => {
    //这里传入的函数 无论如何都执行
    console.log("finally", data); //没有任何参数
    //可以返回一个promise 等待效果
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve("ok");
      }, 1000);
    });
  })
  .then(
    data => {
      console.log(data); //会拿到上一次的结果
    },
    err => {
      console.log(err, "err");
    }
  );
```

### promise.race

比的是谁先结束 谁先结束 把结果返给下层的 then

```js
Promise.race = function(promises) {
  return new Promise((resolve, reject) => {
    for (let i = 0; i < promises.length; i++) {
      let current = promises[i];
      if (current && typeof current.then === "function") {
        // current.then((data) => resolve(data), (err) => reject(err));
        current.then(resolve, reject);
      } else {
        resolve(current);
      }
    }
  });
};
```

用法

```js
const Promise = require("./promiseyu");
const p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("ok");
  }, 2000);
});
const p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject("ok-p2");
  }, 1000);
});
Promise.race([p1, p2, 3])
  .then(values => {
    console.log(values);
  })
  .catch(err => {
    console.log(err, "err");
  });
```

### Promise 链条如何中断-超时中断

fetch 无法中断，但是可以丢弃本次请求 依然是基于回调的方式，好处可以扁平化处理我们的逻辑，处理错误比较方便

> 实现中断 跟一个新的 promise 组合 新的 promise 中断了 promise 就失败了

```js
function wrap(promise) {
  let abort;
  let p2 = new Promise((reslove, reject) => {
    abort = reject;
  });
  let newP = Promise.race([promise, p2]);
  newP.abort = abort;
  return newP;
}
```

使用

```js
let p1 = new Promise((reslove, reject) => {
  setTimeout(() => {
    reslove("成功");
  }, 3000);
});
let p2 = wrap(p1);
setTimeout(() => {
  p2.abort("失败了");
}, 2000);
p2.then(data => {
  console.log("s" + data);
}).catch(err => {
  console.log("err" + err);
});
```

## Promise 在 node 里的运用

node 解决异步的方法基本都是基于回调的

### promisify

常用方式- fs 模块运用

let fs = require("fs").promises; 也可以.then 调用

> let {promisify } = require('util') 模拟这个方法

```js
function promisify(fn) {
  return function(...args) {
    return new Promise((resolve, reject) => {
      fn(...args, function(err, data) {
        if (err) reject(err);
        resolve(data);
      });
    });
  };
}
```

使用效果

```js
const readFile = promisify(fs.readFile);
readFile("./a.text", "utf8").then(data => {
  console.log(data);
});
```

### promisifyAll

```js
function promisifyAll(target) {
  //Object.keys
  Reflect.ownKeys(target).forEach(key => {
    if (typeof target[key] === "function") {
      target[key + "Async"] = promisify(target[key]);
    }
  });
  return target;
}
```

## async await

异步回调的终结解决方案

> 实现方式 generator + co + promise
> promise 还是要写回调 不友好

async 函数返回一个 Promise 对象，可以使用 then 方法添加回调函数。当函数执行的时候，
一旦遇到 await 就会先返回，等到异步操作完成，再接着执行函数体内后面的语句。

async 函数的实现原理
async 函数的实现原理，就是将 Generator 函数和自动执行器，包装在一个函数里。

```markdown
async function fn(args) {
// ...
}

// 等同于

function fn(args) {
return spawn(function\* () {
// ...
});
}
```

所有的 async 函数都可以写成上面的第二种形式，其中的 spawn 函数就是自动执行器。

下面给出 spawn 函数的实现，基本就是前文自动执行器的翻版。

基于 generator 的特性 可以扁平化代码 基于同步的方式写代码

> 关于 generator <https://es6.ruanyifeng.com/#docs/generator>
如下调用 等同于async await
```js
let fs = require("fs").promises;
async function* read() {
  let name = yield fs.readFile("./a.text", "utf8"); //可以try catch 捕获异常 基于的是generator的特性
  let age = yield fs.readFile(name, "utf8");
  return age;
}
co(read)
  .then((data) => {
    console.log(data, "data----");
  })
  .catch((err) => {
    console.log(err, "err");
  });
```
co库的模拟
- 使用
```js
let fs = require("fs").promises;
function* read() {
  let name;
  // try {
  //   name = yield fs.readFile("./a.text", "utf8");
  // } catch (e) {
  //   console.log("err", e);
  // }
  name = yield fs.readFile("./a.text", "utf8");
  
  let age = yield fs.readFile(name, "utf8");
  return age;
}
co(read)
  .then((data) => {
    console.log(data, "data----");
  })
  .catch((err) => {
    console.log(err, "err");
  });
```
- 简单版本
```js
function co(it){
    return new Promise((resolve,reject)=>{
        function next(data){
            let {value,_done_} = it.next(data);
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
- 完整版 有try catch 捕获逻辑
```js
function co(genf) {
  const gen = genf(); //生成器
  return new Promise((resolve, reject) => {
    function step(genF) {
      let next;
      try {
        next = genF();
      } catch (e) {
        reject(e);////这个能捕获整个promise的错误---让promise  reject了而已 传递给下一个then的错误回调中
      }
      if (next.done) {
        return resolve(next.value);
      }
      Promise.resolve(next.value).then(
        (v) => {
          return step(() => gen.next(v));
        },
        (err) => {
          return step(() => gen.throw(err));
        }
      );
    }
    step(() => gen.next(undefined));
  });
}
```
> 使用

```markdown
let foo = await getFoo();
let bar = await getBar();
```

上面代码中，getFoo 和 getBar 是两个独立的异步操作（即互不依赖），被写成继发关系。
这样比较耗时，因为只有 getFoo 完成以后，才会执行 getBar，完全可以让它们同时触发。

```markdown
// 写法一
let [foo, bar] = await Promise.all([getFoo(), getBar()]);

// 写法二
let fooPromise = getFoo();
let barPromise = getBar();
let foo = await fooPromise;
let bar = await barPromise;
```
await命令后面的 Promise 对象如果变为reject状态，则reject的参数会被catch方法的回调函数接收到。
```js
async function f() {
  await Promise.reject('出错了');
}

f()
.then(v => console.log(v))
.catch(e => console.log(e))
// 出错了
```
注意，上面代码中，await语句前面没有return，但是reject方法的参数依然传入了catch方法的回调函数。这里如果在await前面加上return，效果是一样的。

任何一个await语句后面的 Promise 对象变为reject状态，那么整个async函数都会中断执行。
```js
async function f() {
  await Promise.reject('出错了');
  await Promise.resolve('hello world'); // 不会执行
}
```
上面代码中，第二个await语句是不会执行的，因为第一个await语句状态变成了reject。

有时，我们希望即使前一个异步操作失败，也不要中断后面的异步操作。这时可以将第一个await放在try...catch结构里面，
这样不管这个异步操作是否成功，第二个await都会执行。
```js
async function f() {
  try {
    await Promise.reject('出错了');
  } catch(e) {
  }
  return await Promise.resolve('hello world');
}

f()
.then(v => console.log(v))
// hello world
```
另一种方法是await后面的 Promise 对象再跟一个catch方法，处理前面可能出现的错误。
```js
async function f() {
       await Promise.reject('出错了')
         .catch(e => console.log(e));
       return await Promise.resolve('hello world');
     }
     
     f()
     .then(v => console.log(v))
     // 出错了
     // hello world
```
## 类数组

类数组能够迭代的原因是因为内置了迭代器

```js
function arg() {
  let arr = [
    ...{
      0: 1,
      1: 2,
      2: 3,
      length: 3,
      [Symbol.iterator]: function() {
        let index = 0;
        return {
          next: () => {
            return { done: index === this.length, value: this[index++] };
          }
        };
      }
    }
  ];
  return arr;
}
console.log(arg());
```

简化

```js
function arg() {
  let arr = [
    ...{
      0: 1,
      1: 2,
      2: 3,
      length: 3,
      [Symbol.iterator]: function*() {
        let index = 0;
        while (index !== this.length) {
          yield this[index++];
        }
      }
    }
  ];
  return arr;
}
```
### 关于promsie的面试题
```js

```
