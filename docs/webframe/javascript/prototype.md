---
title: javascript中的原型链
date: 2019-06-19
tags:
  - Javascript
---

[[toc]]
## 总结

```js
//es3 构造函数充当类
function Animal() {
  //构造函数中的属性 都是实例上的属性
  //以_明明都是私有属性
  this.type = "哺乳类";
  this.age = 20;
  this.name = name;
  return {}; //返回一个引用类型
}
Animal.prototype.say = function() {
  console.log("say" + this.name);
};
Animal.flag = "动物"; //静态属性
let a1 = new Animal(); //{}
let a2 = new Animal();
//每个对象都有一个__proto__指向所属类的原型
// 每个原型会有一个constuctor 指向所属类
console.log(animal.__proto__ === Animal.prototype); //true
console.log(animal.__proto__.constructor === Animal); //true
console.log(animal.constructor === Animal); //true
console.log(Animal.prototype.__proto__ === Object.prototype); //true
console.log(Object.prototype.__proto__ == null); //true
console.log(Animal.__proto__ === Function.prototype); //true
console.log(Function.prototype.__proto__ === Object.prototype); //true
```

如何实现继承

```js
function Dog(name) {
  Animal.call(this, name); //获取实例上的属性
}
//Dog的原型指向了Fn的实例 这个实例的__proto__ 指向了 Animal.prototype
Dog.prototype = Object.create(Animal.prototype, {
  constructor: { value: Dog }
});
let dog = new Dog("xiao"); //实例化子类的时候传参
dog.say();
console.log(dog.constructor); //会指向Animal
// Dog.prototype.__proto__ = Animal.prototype;
// Object.setPrototypeOf(Dog.prototype, Animal.prototype)
```

```js
class Dog extends Animal {
  //不写可以自动传过去 但是写了必须super()
  constructor(type) {
    super(type);
  }
}
let dog = new Dog("gougou"); //不写构造函数 下面可以直接拿到
console.log(dog.type);
```

**Object.create**

```js
function create(parentPrototype) {
  function Fn() {}
  Fn.prototype = parentPrototype;
  let fn = new Fn();
  fn.constructor = Dog;
  return fn;
}
```
## 详细讲解，对象着手

在谈原型链之前，先了解对象。

- 所有引用类型（函数，数组，对象）都拥有**proto**属性（隐式原型）
- 所有函数拥有 prototype 属性（显式原型）（仅限函数）
- 原型对象：拥有 prototype 属性的对象，在定义函数时就被创建

### **prototype 与**proto**两个概念**

- `prototype`：此属性只有构造函数才有，它指向的是当前构造函数的原型对象。
- `__proto__`：此属性是任何对象在创建时都会有的一个属性，它指向了产生当前对象的构造函数的原型对象，由于并非标准规定属性，不要随便去更改这个属性的值，以免破坏原型链，但是可以借助这个属性来学习，所谓的原型链就是由**proto**连接而成的链。

## 原型链详解

在 js 代码中 通过对象创建(下面一段简单的代码)详细分析原型链 一段简单代码:

```javascript
function foo() {}
foo.prototype.z = 3;
var obj = new foo();
obj.y = 2;
obj.x = 1;

//调用
obj.x; //1
obj.y; //2

obj.z; //3

typeof obj.toString; //'function'
"z" in obj; //true
obj.hasOwnProperty("z"); //false

obj.z = 5;
obj.z; //5
"z" in obj; //true
obj.hasOwnProperty("z"); //true
foo.prototype.z; //3
```

**代码简单分析**

上面一段代码，声明第一个函数 foo 的时候，它就会带一个 foo.prototype 的属性，这个属性是一个对象属性，用 new foo();构造器的方式构造一个新的对象 obj。这时候这个 obj 的原型会指向 foo 的 prototype 属性。 对于这个 foo 函数的原型也会指向 Object.prototype,这个 Object.prototype 也是有原型的，它的原型指向 null。

### **代码对象原型链图:**

![](https://camo.githubusercontent.com/bca984b0376f5458b52b30f49c09c3d57f513962/68747470733a2f2f757365722d676f6c642d63646e2e786974752e696f2f323031392f362f31392f313662366261333366326666656430323f773d34363626683d34383826663d706e6726733d3236303336)

### **对象访问属性顺序**

对象访问属性的顺序，是采用向上查找，如果当前对象没有，它会一直向上原型链中查找，一直找到 null，如果还没有会返回 undefind。

**对象中值修改说明**

代码中修改 obj.z 的值后，再次输出 obj.z 的时候是 5,foo.prototype.z 是 3，说明我们在修改或添加对象的属性的时候，只是修改了对象本身 obj.prototype.z 中的值，而原型链中 foo.prototype.z 的值并不会修改。

### **in，hasOwnProperty 等方法的出现**

首先查看整个原型链，会想这两个方法是怎么来的，在 foo 的的 proto 指向上一级 Object.prototype 的时候，就可以访问 Object 中的一些函数和属性了，其中就包括这两个方法。

第一次调用

```javascript
"z" in obj; //true
obj.hasOwnProperty("z"); //false
```

表示的是 z 并不是 obj 这个对象上的，而是对象的原型链上的。

```javascript
"z" in obj; //true
obj.hasOwnProperty("z"); //true
foo.prototype.z; //3
```

第二次修改了 obj.z 的值，z 就是 obj 这个对象上的了，但是也并没有修改原型链中的 z 的值。

### **特殊说明**

*proto*是每一个对象都有的属性，它的指向会有一个特殊说明，大多数情况下 *proto*指向了**产生当前对象的构造函数的原型对象**，也就是那个 prototype。但是会有特殊的情况

- 特殊情况

```javascript
var a = {};
var b = Object.create(a);
```

object.create 是创建了一个空对象，空对象的原型指向 a，a 也是空对象，这其中不存在 prototype;Object.create 在继承中也常被使用，创建一个空对象指向()内的对象，这这样实现了 b 继承 a，也不会篡改 a 中的内容，在这里就不具体说明了。

原理图分析
![](https://camo.githubusercontent.com/93d38d91dfb1c8c02c9dd7c76b79ba7f8d688a72/68747470733a2f2f757365722d676f6c642d63646e2e786974752e696f2f323031392f362f31392f313662366261333366326137383165623f773d34333026683d33363726663d706e6726733d3234343633)


