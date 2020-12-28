module.exports = {
  title: "小鱼儿的博客",
  base: "/fish-vuePress/",
  description: "专注 Node.js 技术栈分享，从前端到Node.js再到数据库",
  themeConfig: {
    sidebar: {
      "/node-zy/": [
        ["", "node目录"],
        ["path", "作为前端也需要知道的路径知识"],
        ["stream", "node核心模块-stream"]
      ],
      "/node/": [
        ["", "node目录"],
        ["what.md", "node.js究竟是什么"],
        ["event_loop.md", "node事件循环"],
        // ["path", "作为前端也需要知道的路径知识"],

        ["path.md", "node核心模块-path"],
        ["module_fs.md", "node核心模块-fs"],
        ["stream", "node核心模块-stream"],
        ["buffer", "node核心模块-buffer"],
        ["processAndThread.md", "深入理解进程与线程"],
        ["queue.md", "Node.js中的消息队列"],
        ["overflow.md", "Node.js 内存溢出时如何处理？"],
        ["events.md", "[源码解读]一文彻底搞懂Events模块"],
        ["errors.md", "nodejs十个常见误区"],
        // ["APIGateway.md", "nodejs搭建一个API网关"],
        ["AsyncIO.md", "Node 与底层之间如何执行异步 I/O 调用"]
      ],

      "/webframe/": [
        ["", "前端"],
        {
          title: "css",
          name: "css",
          collabsable: false,
          children: [
            ["css/", "目录"],
            ["css/1", "css常考面试题"],
            ["css/render", "渲染树的原理你真的懂吗"]
          ]
        },
        {
          title: "javascript",
          name: "javascript",
          collabsable: false,
          children: [
            ["javascript/", "目录"],
            ["javascript/datatype", "数据类型]面试常问javascript数据类型"],
            ["javascript/scoped", "[作用域]作用域于作用域链"],
            ["javascript/closure", "javascript中的闭包这一篇就够了"],
            ["javascript/higherFunc", "[高阶函数]高阶函数详解与实战训练"],
            ["javascript/copy", "[赋值拷贝]js中赋值•浅拷贝•深拷贝"],
            ["javascript/prototype", "javascript中原型链"],
            ["javascript/this", "如何答一道惊艳面试官的数组去重问题？"],
            ["javascript/exports", "exports和module.exports的区别"],
            ["javascript/recircleFun", "聊聊面试必考-递归思想与实战"],
            ["javascript/unique", "js中数组去重(面试如何回答)"]
          ]
        },
        {
          title: "es6",
          name: "es6",
          collabsable: false,
          children: [
            ["es6/", "目录"],
            ["es6/classInherit", "类与继承"],
            ["es6/promise", "ES6 promise"],
            ["es6/async-await", "async和await讲解"]
          ]
        },
        {
          title: "vue",
          name: "vue",
          collabsable: false,
          children: [["vue/messageWays", "vue中使用的8种通信方式"]]
        },
        {
          title: "tool",
          name: "tool",
          collabsable: false,
          children: [
            // ["tool/git", "常见问题汇总"],
            ["tool/", "软件资源"],
            ["tool/vuepressBlog", "vuepress搭建个人博客"],
            ["tool/chrome", "chrome常用插件及日常问题"],
            ["tool/node-versions", "node以前版本"],
            ["tool/shell", "我常用的前端提效 shell 命令"]
          ]
        }
      ],
      "/database/": [
        ["choice", "SQL 和 NoSQL 的区别与选择"],
        ["mysql/baseFrame", "MySQL 基础架构你不知道的那些事"],
        ["mysql/logSystem", "删库跑路后真的没有办法弥补了吗"],
        ["mysql/optimize", "常用的数据库语句"],
        ["mysql/writeSql", "如何写优雅的SQL原生语句"],
        ["detail-redis1", "详细学习redis_入门篇"],
        ["detail-redis2", "详细学习redis_进阶篇"],
        ["detail-redis3", "详细学习redis_项目实战篇"]
      ],
      "/interview/": [
        ["css", "面试题-CSS篇"],
        ["js10", "面试题-JS篇"],
        ["unique", "如何答一道惊艳面试官的数组去重问题？"],
        ["rewriteJs", "手写代码[`编程`]"],
        ["vue", "vue篇"]
      ]
    },
    nav: [
      { text: "主页", link: "/" },
      { text: "小鱼儿", items: [{ text: "node", link: "/node-zy/" }] },
      { text: "node", link: "/node/" },
      {
        text: "前端",
        link: "/webframe/"
        // items: [
        //   { text: "html", link:"/web/html/"},
        //   { text: "css", link:"/web/css/"},
        //   ]
      },
      { text: "数据库", link: "/database/" },
      { text: "android", link: "/android/" },
      { text: "面试问题", link: "/interview/" }
    ]
  }
};
