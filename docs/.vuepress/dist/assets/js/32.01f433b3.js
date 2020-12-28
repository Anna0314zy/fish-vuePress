(window.webpackJsonp=window.webpackJsonp||[]).push([[32],{387:function(v,_,t){"use strict";t.r(_);var e=t(42),a=Object(e.a)({},(function(){var v=this,_=v.$createElement,t=v._self._c||_;return t("ContentSlotsDistributor",{attrs:{"slot-key":v.$parent.slotKey}},[t("p"),t("div",{staticClass:"table-of-contents"},[t("ul",[t("li",[t("a",{attrs:{href:"#理解本文先要学习的几个概念"}},[v._v("理解本文先要学习的几个概念")]),t("ul",[t("li",[t("a",{attrs:{href:"#node-js-模块分类"}},[v._v("Node.js 模块分类")])]),t("li",[t("a",{attrs:{href:"#libuv"}},[v._v("libuv")])]),t("li",[t("a",{attrs:{href:"#iocp"}},[v._v("IOCP")])]),t("li",[t("a",{attrs:{href:"#线程池"}},[v._v("线程池")])])])]),t("li",[t("a",{attrs:{href:"#node-与底层之间的-异步i-o-调用流程"}},[v._v("Node 与底层之间的异步I/O调用流程")]),t("ul",[t("li",[t("a",{attrs:{href:"#事件循环"}},[v._v("事件循环")])]),t("li",[t("a",{attrs:{href:"#底层调用与事件产生"}},[v._v("底层调用与事件产生")])])])]),t("li",[t("a",{attrs:{href:"#异步-i-o-助力-node-js-高性能"}},[v._v("异步 I/O 助力 Node.js 高性能")]),t("ul",[t("li",[t("a",{attrs:{href:"#关注我"}},[v._v("关注我")])])])]),t("li",[t("a",{attrs:{href:"#参考"}},[v._v("参考")])])])]),t("p"),v._v(" "),t("p",[v._v("本文你能学到：")]),v._v(" "),t("ul",[t("li",[v._v("Node.js 与底层之间是如何执行异步I/O调用的？和事件循环怎么联系上的呢？")]),v._v(" "),t("li",[v._v("为什么说 Node 高性能，Node 的异步I/O 对高性能助力了什么？")]),v._v(" "),t("li",[v._v("Node 的事件循环，你对事件怎么理解？")])]),v._v(" "),t("blockquote",[t("p",[v._v("看完本文后，你应该能更好的去理解事件循环，知道事件是怎么来的，Node 究竟执行异步I/O调用。如果面试官再问事件循环还有Node与底层之间如何执行异步I/O，我觉得你把本文的流程说清楚，应该能加分！本文对事件循环中的具体步骤没有详细讲解，每个步骤看官方文档更佳。")])]),v._v(" "),t("h2",{attrs:{id:"理解本文先要学习的几个概念"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#理解本文先要学习的几个概念"}},[v._v("#")]),v._v(" 理解本文先要学习的几个概念")]),v._v(" "),t("h3",{attrs:{id:"node-js-模块分类"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#node-js-模块分类"}},[v._v("#")]),v._v(" Node.js 模块分类")]),v._v(" "),t("p",[v._v("nodejs模块可以分为下面三类：")]),v._v(" "),t("ul",[t("li",[v._v("核心模块(native模块)：包含在 Node.js 源码中，被编译进 Node.js 可执行二进制文件 JavaScript 模块，其实也就是lib和deps目录下的js文件，比如常用的http,fs等等。")]),v._v(" "),t("li",[v._v("内建模块(built-in模块)：一般我们不直接调用，而是在 native 模块中调用，然后我们再require。")]),v._v(" "),t("li",[v._v("第三方模块：非 Node.js 源码自带的模块都可以统称第三方模块，比如 express，webpack 等等。\n"),t("ul",[t("li",[v._v("JavaScript 模块，这是最常见的，我们开发的时候一般都写的是 JavaScript 模块")]),v._v(" "),t("li",[v._v("JSON 模块，这个很简单，就是一个 JSON 文件")]),v._v(" "),t("li",[v._v("C/C++ 扩展模块，使用 C/C++ 编写，编译之后后缀名为 .node")])])])]),v._v(" "),t("p",[v._v("比如 Node 源码lib目录下的 fs.js 就是 native 模块，而fs.js调用的 src 目录下的 node_fs.cc 就是内建模块。")]),v._v(" "),t("h3",{attrs:{id:"libuv"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#libuv"}},[v._v("#")]),v._v(" libuv")]),v._v(" "),t("p",[v._v("Libuv是一个高性能的，事件驱动的异步I/O库，它本身是由C语言编写的，具有很高的可移植性。libuv封装了不同平台底层对于异步IO模型的实现，libuv 的 API 包含有时间，非阻塞的网络，异步文件操作，子进程等等，所以它还本身具备着Windows, Linux都可使用的跨平台能力。")]),v._v(" "),t("p",[v._v("经典libuv图(来源网上)")]),v._v(" "),t("p",[v._v("(http://img.xiaogangzai.cn/AsyncIO_20200718_1.jpg)")]),v._v(" "),t("h3",{attrs:{id:"iocp"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#iocp"}},[v._v("#")]),v._v(" IOCP")]),v._v(" "),t("p",[v._v("概念:输入输出完成端口（Input/Output Completion Port，IOCP）, 是支持多个同时发生的异步I/O操作的应用程序编程接口，在Windows NT的3.5版本以后，或AIX5版以后或Solaris第十版以后，开始支持。")]),v._v(" "),t("p",[v._v("我直接这么说概念你可能也不太懂。可以暂时知道 Windows 下注意通过 IOCP 来向系统内核发送 I/O 调用和从内核获取已完成的 I/O 操作，配以事件循环，完成异步I/O的过程。在 linux 下通过 epoll 实现这个过程，也就是由 libuv 自行实现。")]),v._v(" "),t("p",[v._v("IOCP 的另一个应用场景在之前Node.js进程与线程那篇文章也有写过。Mater 和 app worker 进程通信使用到。")]),v._v(" "),t("h3",{attrs:{id:"线程池"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#线程池"}},[v._v("#")]),v._v(" 线程池")]),v._v(" "),t("p",[v._v("线程池，是一种线程的使用模式，它为了降低线程使用中频繁的创建和销毁所带来的资源消耗与代价。\n通过创建一定数量的线程，让他们时刻准备就绪等待新任务的到达，而任务执行结束之后再重新回来继续待命。")]),v._v(" "),t("p",[v._v("这就是线程池最核心的设计思路，「复用线程，平摊线程的创建与销毁的开销代价」。")]),v._v(" "),t("p",[v._v("本文使用到线程池的地方:在 Node 中，无论是 *nix 还是 Window 平台。内部完成 I/O 任务的都有用到线程池。")]),v._v(" "),t("p",[v._v("libuv 目前使用了一个全局的线程池，所有的循环都可以往其中加入任务。目前有三种操作会在这个线程池中执行：")]),v._v(" "),t("ul",[t("li",[t("p",[v._v("文件系统操作")])]),v._v(" "),t("li",[t("p",[v._v("DNS 函数（getaddrinfo 和 getnameinfo）")])]),v._v(" "),t("li",[t("p",[v._v("通过 uv_queue_work() 添加的用户代码")])])]),v._v(" "),t("h2",{attrs:{id:"node-与底层之间的异步i-o调用流程"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#node-与底层之间的异步i-o调用流程"}},[v._v("#")]),v._v(" Node 与底层之间的"),t("strong",[v._v("异步I/O")]),v._v("调用流程")]),v._v(" "),t("p",[v._v("对比图中两段经典api代码("),t("code",[v._v("server.listen")]),v._v("和"),t("code",[v._v("fs.open")]),v._v("，选择两种api的原因：网络 I/O 代表和文件 I/O 代表)和之前 libuv 图片，我们来一起理解异步I/O调用流程")]),v._v(" "),t("p",[v._v("(http://img.xiaogangzai.cn/AsyncIO_20200718_2.jpg)\n上图展示了libuv细节的流程，图中代码很简单，包括2个部分：")]),v._v(" "),t("ol",[t("li",[t("p",[v._v("server.listen() 是用来创建 TCP server 时，通常放在最后一步执行的代码。主要指定服务器工作的端口以及回调函数。")])]),v._v(" "),t("li",[t("p",[v._v("fs.open() 是用异步的方式打开一个文件。")])])]),v._v(" "),t("p",[v._v("选择两个示例很简单，因为 libuv 架构图可视：libuv 对 Network I/O和 File I/O 采用不同的机制。")]),v._v(" "),t("p",[v._v("上图右半部分，主要分成两个部分：")]),v._v(" "),t("ol",[t("li",[t("p",[v._v("主线程：主线程也是 node 启动时执行的现成。node 启动时，会完成一系列的初始化动作，启动 V8 engine，进入下一个循环。")])]),v._v(" "),t("li",[t("p",[v._v("线程池：线程池的数量可以通过环境变量 UV_THREADPOOL_SIZE 配置，最大不超过 128 个，默认为 4 个。")])])]),v._v(" "),t("blockquote",[t("p",[t("strong",[v._v("在Node.js 中经典的代码调用方式：都是从 JavaScript 调用 Node 核心模块，核心模块调用 C++ 内建模块，内建模块通过 libuv 进行系统调用。请记住这段话")])])]),v._v(" "),t("h3",{attrs:{id:"事件循环"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#事件循环"}},[v._v("#")]),v._v(" 事件循环")]),v._v(" "),t("p",[v._v("不管是"),t("code",[v._v("server.listen")]),v._v("还是"),t("code",[v._v("fs.open")]),v._v("，他们在开启一个 node 服务(进程)的时候，Node会创建一个while(true)的循环，这个循环就是事件循环。每执行一次循环体的过程，我们称之为Tick。每个Tick的过程就是"),t("strong",[v._v("查看是否有事件待处理")]),v._v("，如果有，就取出事件及其相关的回调函数。如果存在关联的回调函数，就执行。然后进入下一个循环，如果不再有事件处理，退出进程。")]),v._v(" "),t("p",[v._v("(http://img.xiaogangzai.cn/AsyncIO_20200718_3.jpg)")]),v._v(" "),t("p",[v._v("这里我们知道事件循环已经创建了，上面加粗字体查看"),t("strong",[v._v("是否有事件待处理，去哪里查看？事件怎么进入事件循环的？什么情况会产生事件继续往下看")]),v._v("。")]),v._v(" "),t("h3",{attrs:{id:"底层调用与事件产生"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#底层调用与事件产生"}},[v._v("#")]),v._v(" 底层调用与事件产生")]),v._v(" "),t("p",[v._v("(http://img.xiaogangzai.cn/AsyncIO_20200718_2.jpg)")]),v._v(" "),t("p",[v._v("继续看这张图，讲解一下事件产生基本流程，（注意网络I/O和文件I/O会有一些不同）这里对c++代码调用简单提一下，有兴趣的小伙伴可以继续深入研究。")]),v._v(" "),t("h4",{attrs:{id:"file-i-o"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#file-i-o"}},[v._v("#")]),v._v(" File I/O")]),v._v(" "),t("p",[v._v("（这里就用到了文初提到的模块分类知识）先是 javascript 代码，然后调用 "),t("code",[v._v("lib/fs.js")]),v._v(" 核心模块代码 "),t("code",[v._v("fs.open")]),v._v(" ，核心模块调用 C++ 内建模块 "),t("code",[v._v("src/node_file.cc")]),v._v("，内建模块c++代码会有一个平台判断，然后通过 libuv 进行系统调用。")]),v._v(" "),t("p",[v._v("从前面到达 libuv ，会有一个参数，"),t("strong",[v._v("请求对象")]),v._v("，也就是open函数前面整个流程传递进来的请求对象，它保存了所有状态，包括送入线程池等待执行以及I/O操作完毕后的回调处理。")]),v._v(" "),t("p",[v._v("请求对象组装完成后，送入 libuv 中创建的 I/O 线程池，线程池中的 I/O 操作完毕后，会将获取的结果存储到 req->result 属性上，然后通知某函数通知 "),t("strong",[v._v("IOCP")]),v._v(" ，告知当前对象操作已经完成。")]),v._v(" "),t("p",[v._v("在这整个过程中，进程初期创建的事件循环中有一个 I/O 观察者，每次 Tick 的执行中，它会调用 IOCP 相关的方法检查线程池中是否有执行完成的请求，如果存在，会讲请求对象和之前绑定的 result 属性，加入到 I/O 观察者的队列中，然后将其当作事件处理。")]),v._v(" "),t("blockquote",[t("p",[v._v("看到这里，前面提到的**是否有事件待处理，去哪里查看？事件怎么进入事件循环的？**这两个问题是不是搞懂了。")])]),v._v(" "),t("p",[v._v("文字配上图。更清晰！\n(http://img.xiaogangzai.cn/AsyncIO_20200718_5.jpg)")]),v._v(" "),t("h4",{attrs:{id:"network-i-o"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#network-i-o"}},[v._v("#")]),v._v(" Network I/O")]),v._v(" "),t("p",[v._v("V8 engine 执行从 "),t("code",[v._v("server.listen()")]),v._v(" 开始，调用 "),t("code",[v._v("builtin module Tcp_wrap")]),v._v(" 的过程。")]),v._v(" "),t("p",[v._v("在创建TCP链接的过程中，libuv直接参与"),t("code",[v._v("Tcp_wrap.cc")]),v._v("函数中的 "),t("code",[v._v("TCPWrap::listen()")]),v._v(" 调用uv_listen()开始到执行"),t("code",[v._v("uv_io_start()")]),v._v("结束。看起来很短暂的过程，其实是类似linux kernel的中断处理机制。")]),v._v(" "),t("p",[t("code",[v._v("uv_io_start()")]),v._v("负载将 handle 插入到处理的"),t("code",[v._v("water queue")]),v._v("中。这样的好处是请求能够立即得到处理。中断处理机制里面的下半部分与数据处理操作相似，交由主线程去完成处理。")]),v._v(" "),t("p",[v._v("(http://img.xiaogangzai.cn/leading.png)")]),v._v(" "),t("blockquote",[t("p",[v._v("重要：虽然 libuv 的异步文件 I/O 操作是通过线程池实现的，但是网络 I/O 总是在单线程中执行的，注意最后还是会把完成的内容作为事件加入事件循环，事件循环就和文件I/O相同了。")])]),v._v(" "),t("h2",{attrs:{id:"异步-i-o-助力-node-js-高性能"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#异步-i-o-助力-node-js-高性能"}},[v._v("#")]),v._v(" 异步 I/O 助力 Node.js 高性能")]),v._v(" "),t("p",[v._v("传统的服务器模型")]),v._v(" "),t("ul",[t("li",[v._v("同步式: 同步的服务，一次只能处理一个请求，并且其余请求都处于等待状态。")]),v._v(" "),t("li",[v._v("每进程/每请求: 为每个请求启动一个进程，这样可以处理多个请求，但是不具有扩展性，系统资源有限，开启太多进程不太合适")]),v._v(" "),t("li",[v._v("每线程/每请求: 为每个请求启动一个线程来处理。尽管线程比进程轻量，但是每个线程也都会占用一定内存，当大并发请求的时候，也会占用很大内存，导致服务器缓慢。")])]),v._v(" "),t("p",[t("strong",[v._v("Node就不一样了！")])]),v._v(" "),t("p",[v._v("看了文章前面的内容，Node 通过事件驱动的方式处理请求，无需为每个请求创建额外的对应线程，可以省掉"),t("strong",[v._v("创建线程和销毁线程")]),v._v("的开销，同时操作系统在调度任务时因为线程较少，"),t("strong",[v._v("上下文切换")]),v._v("的代价很低。这也是 Node.js 高性能之一")]),v._v(" "),t("blockquote",[t("p",[v._v("Nginx 目前也采用了和 Node 相同的事件驱动方式，有兴趣的也去了解下，不过 Nginx 采用 c 语言编写。")])]),v._v(" "),t("h3",{attrs:{id:"关注我"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#关注我"}},[v._v("#")]),v._v(" 关注我")]),v._v(" "),t("blockquote",[t("p",[v._v("作者简介：koala，专注完整的 Node.js 技术栈分享，从 JavaScript 到 Node.js,再到后端数据库，祝您成为优秀的高级 Node.js 工程师。【程序员成长指北】作者，Github 博客开源项目 https://github.com/koala-coding/goodBlog")])]),v._v(" "),t("ul",[t("li",[v._v("欢迎加我微信【 ikoala520 】，拉你 进 "),t("strong",[v._v("Node.js")]),v._v(" 高级进阶群，长期交流学习...")]),v._v(" "),t("li",[v._v("欢迎关注「程序员成长指北」,一个用心帮助你成长的公众号...\n(http://img.xiaogangzai.cn/leading.png)")])]),v._v(" "),t("h2",{attrs:{id:"参考"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#参考"}},[v._v("#")]),v._v(" 参考")]),v._v(" "),t("p",[v._v("本文很多内容来自朴灵老师的 《深入浅出Node.js》，这本书虽然出版很久了，给我的感觉还是越看越香,自己可以边看边扩展，推荐。")]),v._v(" "),t("p",[v._v("Libuv学习——文件处理\nhttps://zhuanlan.zhihu.com/p/97789391")]),v._v(" "),t("p",[v._v("高性能异步 I/O 模型库 libuv 设计思路概述\nhttps://blog.csdn.net/ababab12345/article/details/103951026")])])}),[],!1,null,null,null);_.default=a.exports}}]);