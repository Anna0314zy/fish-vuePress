(window.webpackJsonp=window.webpackJsonp||[]).push([[113],{674:function(t,e,r){"use strict";r.r(e);var a=r(42),v=Object(a.a)({},(function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[r("h2",{attrs:{id:"浏览器渲染"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#浏览器渲染"}},[t._v("#")]),t._v(" 浏览器渲染")]),t._v(" "),r("p",[t._v("性能优化是前端开发中避不开的问题，性能问题无外乎两方面原因：渲染速度慢、请求时间长。性能优化虽然涉及很多复杂的原因和解决方案，但其实只要通过合理地使用标签，就可以在一定程度上提升渲染速度以及减少请求时间。")]),t._v(" "),r("h3",{attrs:{id:"script-标签-调整加载顺序提升渲染速度"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#script-标签-调整加载顺序提升渲染速度"}},[t._v("#")]),t._v(" script 标签：调整加载顺序提升渲染速度")]),t._v(" "),r("p",[t._v("由于浏览器的底层运行机制，渲染引擎在解析 HTML 时，若遇到 script 标签引用文件，则会暂停解析过程，同时通知网络线程加载文件，文件加载后会切换至 JavaScript 引擎来执行对应代码，代码执行完成之后切换至渲染引擎继续渲染页面。")]),t._v(" "),r("p",[t._v("在这一过程中可以看到，页面渲染过程中包含了请求文件以及执行文件的时间，但页面的首次渲染可能并不依赖这些文件，这些请求和执行文件的动作反而延长了用户看到页面的时间，从而降低了用户体验。")]),t._v(" "),r("p",[t._v("为了减少这些时间损耗，可以借助 script 标签的 3 个属性来实现。")]),t._v(" "),r("ul",[r("li",[r("p",[t._v("async 属性。立即请求文件，但不阻塞渲染引擎，而是文件加载完毕后阻塞渲染引擎并立即执行文件内容。")])]),t._v(" "),r("li",[r("p",[t._v("defer 属性。立即请求文件，但不阻塞渲染引擎，等到解析完 HTML 之后再执行文件内容。")])]),t._v(" "),r("li",[r("p",[t._v("HTML5 标准 type 属性，对应值为“module”。让浏览器按照 ECMA Script 6 标准将文件当作模块进行解析，默认阻塞效果同 defer，也可以配合 async 在请求完成后立即执行。")])])]),t._v(" "),r("p",[t._v('从图中可以得知，采用 3 种属性都能减少请求文件引起的阻塞时间，只有 defer 属性以及 type="module" 情况下能保证渲染引擎的优先执行，从而减少执行文件内容消耗的时间，让用户更快地看见页面（即使这些页面内容可能并没有完全地显示）。')]),t._v(" "),r("p",[t._v("除此之外还应当注意，当渲染引擎解析 HTML 遇到 script 标签引入文件时，会立即进行一次渲染。所以这也就是为什么构建工具会把编译好的引用 JavaScript 代码的 script 标签放入到 body 标签底部，因为当渲染引擎执行到 body 底部时会先将已解析的内容渲染出来，然后再去请求相应的 JavaScript 文件。如果是内联脚本（即不通过 src 属性引用外部脚本文件直接在 HTML 编写 JavaScript 代码的形式），渲染引擎则不会渲染。")]),t._v(" "),r("h3",{attrs:{id:"link-标签-通过预处理提升渲染速度"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#link-标签-通过预处理提升渲染速度"}},[t._v("#")]),t._v(" link 标签：通过预处理提升渲染速度")]),t._v(" "),r("ul",[r("li",[r("p",[t._v("dns-prefetch。当 link 标签的 rel 属性值为“dns-prefetch”时，浏览器会对某个域名预先进行 DNS 解析并缓存。这样，当浏览器在请求同域名资源的时候，能省去从域名查询 IP 的过程，从而减少时间损耗。下图是淘宝网设置的 DNS 预解析。")])]),t._v(" "),r("li",[r("p",[t._v("preconnect。让浏览器在一个 HTTP 请求正式发给服务器前预先执行一些操作，这包括 DNS 解析、TLS 协商、TCP 握手，通过消除往返延迟来为用户节省时间。")])]),t._v(" "),r("li",[r("p",[t._v("prefetch/preload。两个值都是让浏览器预先下载并缓存某个资源，但不同的是，prefetch 可能会在浏览器忙时被忽略，而 preload 则是一定会被预先下载。")])]),t._v(" "),r("li",[r("p",[t._v("prerender。浏览器不仅会加载资源，还会解析执行页面，进行预渲染。")])])]),t._v(" "),r("h2",{attrs:{id:"mvc-和-mvvm-区别"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#mvc-和-mvvm-区别"}},[t._v("#")]),t._v(" MVC 和 MVVM 区别")]),t._v(" "),r("p",[t._v("传统的 MVC 指的是,用户操作会请求服务端路由，路由会调用对应的控制器来处理,控制器会获取数 据。将结果返回给前端,页面重新渲染\nMVVM :传统的前端会将数据手动渲染到页面上, MVVM 模式不需要用户收到操作 dom 元素,\n将数据绑 定到 viewModel 层上，会自动将数据渲染到页面中，\n视图变化会通知 viewModel层 更新数据。 ViewModel 就是我们 MVVM 模式中的桥梁.\nVue并没有完全遵循MVVM模型，严格的MVVM模式中,View层不能直接和Model层通信,只能通过ViewModel来进行通信。")]),t._v(" "),r("h1",{attrs:{id:""}},[r("a",{staticClass:"header-anchor",attrs:{href:"#"}},[t._v("#")])])])}),[],!1,null,null,null);e.default=v.exports}}]);