module.exports = {
  title: "小鱼儿的博客",
  base: "/fish-vuePress/",
  description: "专注 Node.js 技术栈分享，从前端到Node.js再到数据库",
  markdown: {
    extractHeaders: ["h2", "h3", "h4"]
  },
  themeConfig: {
    sidebarDepth: 2,
    displayAllHeaders: false, // 默认值：false
    sidebar: {
      "/node-zy/": [
        ["", "node目录"],
        ["path", "作为前端也需要知道的路径知识"],
        ["stream", "node核心模块-stream"]
      ],
      "/node/": [
        ["", "node目录"],
        ["promise.md", "深度了解promise"],
        ["what.md", "node.js究竟是什么"],
        ["event_loop.md", "node事件循环"],
        ["util.md", "node-模块util"],

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
      "/vue-quick/": [
        ["vue-up-1", "进阶vue篇一"],
        ["vue-up-2", "进阶vue篇二"],
        ["vue-up-3", "进阶vue篇三"]
      ],
      "/node-quick/": [
        ["promise", "promise原理手写"],
        ["eventLoop", "异步&事件环"],
        ["node", "node基本概念"],
        ["node-modules", "node中的模块"],
        ["npm", "npm常用命令"],
        ["path.md", "node核心模块-path"],
        ["buffer", "Buffer的应用"],
        ["fs", "fs模块"],
        ["stream", "stream模块"],
        ["linkedList", "什么是链表"],
        ["tree", "树"],
        ["http", "HTTP核心概念"],
        ["http-header", "HTTP中Header应用"],
        ["Cookie", "Cookie/Session/JWT"],
        ["express", "Express应用+原理"],
        ["koa", "koa"],
        ["node-loop", "node中的进程和线程"]
      ],
      "/js/": [
          ["regexp", "正则"],
          ["JS2", "js数据类型"],
          ["JS3", "js底层原理的实现"],
          ["math", "前端算法"],
          ["modules", "其他"]
      ],
      "/webframe/": [
        ["", "前端"],
        ["javascript/promise.md", "深度了解promise"],
        ["es6/questions.md", "常见面试题"],
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
            // ["javascript/promise.md", "深度了解promise"],
            ["javascript/datatype", "数据类型]面试常问javascript数据类型"],
            ["javascript/scoped", "[作用域]作用域于作用域链"],
            ["javascript/closure", "javascript中的闭包这一篇就够了"],
            // ["javascript/higherFunc", "[高阶函数]高阶函数详解与实战训练"],
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
            ["es6/decorator.md", "装饰器"],
            ["es6/ejs.md", "模板引擎实现"],
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
            ["tool/shell", "我常用的前端提效 shell 命令"],
            ["tool/markdown", "编写文档常用的语法"]
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
        ["questions.md", "面试题收录"],
        ["unique", "如何答一道惊艳面试官的数组去重问题？"],
        ["rewriteJs", "手写代码[`编程`]"],
        ["vue", "vue篇"],
        ["project", "项目实战篇"],
          ["promise", "promise面试题"],
          ["api", "api"],
          ["1", "数据类型相等比较"]
      ],
      "/react/": []
    },
    nav: [
      { text: "主页", link: "/" },
      {
        text: "小鱼儿",
        items: [
          { text: "快速掌握node", link: "/node-quick/" },
          { text: "快速掌握vue", link: "/vue-quick/" },
          { text: "前端基础", link: "/js/" }
        ]
      },
      { text: "node", link: "/node/" },
      {
        text: "前端",
        link: "/webframe/"
        // items: [
        //   { text: "html", link:"/web/html/"},
        //   { text: "css", link:"/web/css/"},
        //   ]
      },

      { text: "快速掌握vue", link: "/vue-quick/" },
      { text: "数据库", link: "/database/" },
      { text: "android", link: "/android/" },
      { text: "面试问题", link: "/interview/" },
      { text: "其他", link: "/react/" }
    ]
  }
};
