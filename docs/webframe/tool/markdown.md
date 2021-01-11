---
title: markdown + vuepress扩展语法
date: 2020-07-06
tags:
    - markdown
    - 工具
---
## 无序列表
```js
* 第一项
* 第二项
* 第三项

+ 第一项
+ 第二项
+ 第三项


- 第一项
- 第二项
- 第三项
```
* 第一项
* 第二项
* 第三项

+ 第一项
+ 第二项
+ 第三项


- 第一项
- 第二项
- 第三项
## 列表嵌套
```js
1. 第一项：
    - 第一项嵌套的第一个元素
    - 第一项嵌套的第二个元素
2. 第二项：
    - 第二项嵌套的第一个元素
    - 第二项嵌套的第二个元素
```
## GitHub 风格的表格
1. 第一项：
    - 第一项嵌套的第一个元素
    - 第一项嵌套的第二个元素
2. 第二项：
    - 第二项嵌套的第一个元素
    - 第二项嵌套的第二个元素
    
 ## 区块
 
> 区块中使用列表
> 1. 第一项
> 2. 第二项
>> + 第一项
>> + 第二项
>> + 第三项
```
> 区块中使用列表
> 1. 第一项
> 2. 第二项
>> + 第一项
>> + 第二项
>> + 第三项
```

# 链接 
```markdown
[链接名称](链接地址)
  
  或者
  
  <链接地址>

```
> 这是一个链接 [菜鸟教程](https://www.runoob.com)
## 图片
```markdown
![alt 属性文本](图片地址)
  
  ![alt 属性文本](图片地址 "可选标题")
```


# 表格
输入
```bash
| Tables        | Are           | Cool  |
| ------------- |:-------------:| -----:|
| col 3 is      | right-aligned | $1600 |
| col 2 is      | centered      |   $12 |
| zebra stripes | are neat      |    $1 |
```
输出
| Tables        | Are           | Cool  |
| ------------- |:-------------:| -----:|
| col 3 is      | right-aligned | $1600 |
| col 2 is      | centered      |   $12 |
| zebra stripes | are neat      |    $1 |


## Emoji
输入
```js
:tada: :100:

```

输出
:tada: :100:
## 目录
输入
```js
[[toc]]
```

输出
[[toc]]
## 自定义容器
输入
```js
 ::: tip
 这是一个提示
 :::
 
 ::: warning
 这是一个警告
 :::
 
 ::: danger
 这是一个危险警告
 :::
```

输出
::: tip
这是一个提示
:::

::: warning
这是一个警告
:::

::: danger
这是一个危险警告
:::

::: details
这是一个详情块，在 IE / Edge 中不生效
:::
自定义标题
````markdown
::: danger STOP
危险区域，禁止通行
:::

::: details 点击查看代码
```js
console.log('你好，VuePress！')
```
:::
````
::: danger STOP
危险区域，禁止通行
:::

::: details 点击查看代码
```js
console.log('你好，VuePress！')
```
:::
