---
title: 装饰器
date: 2019-06-10
tags:
   - ES6
   - class
---

## 类的修饰 

>decorator(target) {}

许多面向对象的语言都有修饰器（Decorator）函数，用来修改类的行为。
```js
@testable
class MyClass {};

function testable(target) {
    target.isTestable = true;
    target.prototype.grade = 3;  // 为类添加实例属性
}

MyClass.isTestable;  // true

```
修饰类如何传参
```js
// 定义装饰器的外层函数
function mixins(...list) {
    // 返回一个装饰器函数
    return function(target) {
        Object.assign(target.prototype, ...list);
    }
}
const args = {
    f1() {}
    f2() {}
    f3() {}
};

// 使用mixins装饰器
@mixins(args)
class MyClass {};

let inst = new MyClass();
inst.f3();

```
## 修饰类的方法
 
>decorator(target, key, descriptor) {}

定义 readonly装饰器：
- 第一个参数是类的原型对象；
- 第二个参数是所要修饰的属性名；
- 第三个参数是该属性的描述对象。

修饰器不仅可以修饰类，还可以修饰类的属性。
```js
class Person {
    @readonly
    // readonly(Person.prototype, 'name', descriptor);
    // 类似于
    // Object.defineProperty(Person.prototype, 'name', descriptor);
    name() { return `${this.name}` }

}
function readonly(target, key, descriptor) {
    // descriptor对象原来的值如下
    // {
    //     value: specifiedFunction,
    //     enumerable: false,
    //     configurable: true,
    //     writable: true
    // }
    decorator.writable = false;  // 不可写
    return descriptor;
}
```
再例：
```js
class A {
    @nonenumerable
    get kidCount() {
        return this.children.length;
    }
}
function nonenumerable(target, key, descriptor) {
    descriptor.enumerable = false;
    return descriptor;
}
```
再例：
```js
class Math {
    @log
    add(a, b) {
        return a + b;
    }
}
function log(target, key, descriptor) {
    var oldValue = descriptor.value;
    // 修改 descriptor属性
    descriptor.value = function() {
        console.log(`${name}`, arguments);
        return oldValue.apply(this, arguments);
    }
    return descriptor;
}
```
修饰器还起到了注释的作用
用装饰器写组件：
```js
@Component({
    tag: 'my-component',
    styleUrl: 'my-component.scss'
})
export class MyComponent {
    @Prop() first: string;
    @Prop() last: string;
    @State() isVisible: boolean = true;
 render() {
        return(
            <p>my name is {this.first} {this.last}</p>
        )
    }
}
```
## 多个装饰器执行顺序
如果同一个方法有多个修饰器，会像剥洋葱一样，先从外到内进入，然后由内向外执行。
定义一个装饰器的外层包装函数：
- 装饰器的进入顺序：dec(1) -> dec(2) -> dec(3)
- 装饰器的执行顺序：dec(3) -> dec(2) -> dec(1)
除了注释，修饰器还能用来类型检查。所以，对于类来说，这项功能相当有用。从长期来看，它将是 JavaScript 代码静态分析的重要工具。
```js
function dec(id) {
    // 返回一个用于修饰类成员的装饰器
    return (target, key, descriptor) => {
        descriptor.writable = false;
    }
}
class Demo {
    @dec(1)
    @dec(2)
    @dec(3)
    method() {}
}
```

**为什么修饰器不能用于函数**

修饰器只能用于类和类的方法，不能用于修饰函数，因为存在函数提升。
由于存在函数提升，使得修饰器不能用于函数。类是不会提升的，所以就没有这方面的问题。

如果一定要修饰函数，可以采用高阶函数的形式直接执行。
```js
function decoratorFn(fn) {
    return function() {
        const res = fn.apply(this, arguments);
        return res;
    }
}

function doSomething() {};
const doSomething2 = decoratorFn(doSomething);
```
## core-decorators.js

core-decorators.js是一个第三方模块，提供了几个常见的修饰器，通过它可以更好地理解修饰器。
- @autobind 修饰器使得方法中的this对象，绑定原始对象。
- @readonly 修饰器使得属性或方法不可写。
- @override 修饰器检查子类的方法，是否正确覆盖了父类的同名方法，如果不正确会报错。
- @deprecate 或 @deprecated 修饰器在控制台显示一条警告，表示该方法将废除。
- @suppressWarnings 修饰器抑制deprecated修饰器导致的console.warn()调用。但是，异步代码发出的调用除外。
```js
import { autobind, readonly } from 'core-decorators';

class Person {
    @autobind
    getPerson() {
        return this;
    }

    @readonly
    age = 23;
}

```
