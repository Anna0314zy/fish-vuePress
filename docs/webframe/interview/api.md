---
title: 关于前端服务请求
date: 2019-01-06
tags:
- JS
---
## JQ Ajax、Axios、Fetch的核心区别
**Ajax前后端数据通信「同源、跨域」**
```js
let xhr = new XMLHttpRequest;
xhr.open('get', 'http://127.0.0.1:8888/user/list');
xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
        let text = xhr.responseText;
        console.log(JSON.parse(text));
    }
};
xhr.send(); 

```
```js
$.ajax({
    url: 'http://127.0.0.1:8888/user/list',
    method: 'get',
    success(result) {
        console.log(result);
    }
});
// 回调地狱
$.ajax({
    url: 'http://127.0.0.1:8888/user/login',
    method: 'post',
    data: Qs.stringify({
        account: '18310612838',
        password: md5('1234567890')
    }),
    success(result) {
        if (result.code === 0) {
            // 登录成功
            $.ajax({
                url: 'http://127.0.0.1:8888/user/list',
                method: 'get',
                success(result) {
                    console.log(result);
                }
            });
        }
    }
});
```
Axios也是对ajax的封装，基于Promise管理请求，解决回调地狱问题（await） *!/

```js

(async function () {
    let result = await axios.post('/user/login', {
        account: '18310612838',
        password: md5('1234567890')
    });

    result = await axios.get('/user/list');
    console.log(result);
})(); 
```
**Fetch是ES6新增的通信方法，不是ajax，但是他本身实现数据通信，就是基于promise管理的**

```js
(async function () {
    let result = await fetch('http://127.0.0.1:8888/user/login', {
        method: 'post',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: Qs.stringify({
            account: '18310612838',
            password: md5('1234567890')
        })
    }).then(response => {
        return response.json();
    });

    result = await fetch('http://127.0.0.1:8888/user/list').then(response => {
        return response.json();
    });
    console.log(result);
})(); 
```


##  Promise.all并发限制及async-pool的应用

基于Promise.all实现Ajax的串行和并行 
// 串行：请求是异步的，需要等待上一个请求成功，才能执行下一个请求
// 并行：同时发送多个请求「HTTP请求可以同时进行，但是JS的操作都是一步步的来的，因为JS是单线程」,等待所有请求都成功，我们再去做什么事情?


**Promise.all**

不关心一次执行多少个任务 

```js

Promise.all(tasks.map(task => task())).then(results => {
    console.log(results);
}).catch((e) => {
    console.log(e, 'e-------');
})
```

```js
/*
 * Promise.all并发限制及async-pool的应用
 *   + 并发限制指的是，每个时刻并发执行的promise数量是固定的，最终的执行结果还是保持与原来的
 */
const delay = function delay(interval) {
    return new Promise((resolve, reject) => {

        setTimeout(() => {
            console.log(interval, 'interval----');
            if (interval === 1006) reject('xxx');
            resolve(interval);
        }, interval);
    });
};
let tasks = [() => {
    return delay(1000);
}, () => {
    return delay(1003);
}, () => {
    return delay(1005);
}, () => {
    return delay(1002);
}, () => {
    return delay(1004);
}, () => {
    return delay(1006);
}];
//
/**

 */

let results = [];
//限制同时并发执行的个数  tasks一共有多少个promise同时执行
asyncPool(2, tasks, (task, next) => {
    //2个任务同时并发执行 然后再执行其他任务
    task().then(result => {
        results.push(result);
        next();
    }).catch(() => {
        //一旦有报错就执行到这里
    console.error(results);
    })
}, () => {
    //所有都成功才会执行到
    console.log(results);
});

```
## JS实现Ajax并发请求控制的两大解决方案
tasks：数组，数组包含很多方法，每一个方法执行就是发送一个请求「基于Promise管理」
```js
function createRequest(tasks, pool) {
    pool = pool || 5;
    let results = [],
        together = new Array(pool).fill(null),
        index = 0;
    together = together.map(() => {
        return new Promise((resolve, reject) => {
            const run = function run() {
                if (index >= tasks.length) {
                    resolve();
                    return;
                };
                let old_index = index,
                    task = tasks[index++];
                task().then(result => {
                    results[old_index] = result;
                    run();
                }).catch(reason => {
                    reject(reason);
                });
            };
            run();
        });
    });
    return Promise.all(together).then(() => results);
}

createRequest(tasks, 2).then(results => {
    // 都成功，整体才是成功，按顺序存储结果
    console.log('成功-->', results);
}).catch(reason => {
    // 只要有也给失败，整体就是失败
    console.log('失败-->', reason);
}); 
```

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
