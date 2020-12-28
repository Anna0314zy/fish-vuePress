(window.webpackJsonp=window.webpackJsonp||[]).push([[6],{354:function(t,s,a){t.exports=a.p+"assets/img/17155705b7258e79.3bc9d5f2.png"},386:function(t,s,a){"use strict";a.r(s);var n=a(42),e=Object(n.a)({},(function(){var t=this,s=t.$createElement,n=t._self._c||s;return n("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[n("blockquote",[n("p",[t._v("原文：Building an API Gateway using Node.js")]),t._v(" "),n("p",[t._v("地址：https://blog.risingstack.com/building-an-api-gateway-using-nodejs/")])]),t._v(" "),n("p",[t._v("外部客户端访问微服务架构中的服务时，服务端会对认证和传输有一些常见的要求。API 网关提供共享层来处理服务协议之间的差异，并满足特定客户端（如桌面浏览器、移动设备和老系统）的要求。")]),t._v(" "),n("h2",{attrs:{id:"微服务和消费者"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#微服务和消费者"}},[t._v("#")]),t._v(" 微服务和消费者")]),t._v(" "),n("p",[t._v("微服务是面向服务的架构，团队可以独立设计、开发和发布应用程序。它允许在系统各个层面上的技术多样性，团队可以在给定的技术难题中使用最佳语言、数据库、协议和传输层，从而受益。例如，一个团队可以使用 "),n("code",[t._v("HTTP REST")]),t._v(" 上的 JSON，而另一个团队可以使用 "),n("code",[t._v("HTTP/2")]),t._v(" 上的 gRPC 或 RabbitMQ 等消息代理。")]),t._v(" "),n("p",[t._v("在某些情况下使用不同的数据序列化和协议可能是强大的，但要使用我们的产品的客户可能有不同的需求。该问题也可能发生在具有同质技术栈的系统中，因为客户可以从桌面浏览器通过移动设备和游戏机到遗留系统。一个客户可能期望 XML 格式，而另一个客户可能希望 JSON 。在许多情况下，您需要同时支持它们。")]),t._v(" "),n("p",[t._v("当客户想要使用您的微服务时，您可以面对的另一个挑战来自于通用的"),n("strong",[t._v("共享逻辑")]),t._v("（如身份验证），因为您不想在所有服务中重新实现相同的事情。")]),t._v(" "),n("p",[t._v("总结：我们不想在我们的微服务架构中实现我们的内部服务，以支持多个客户端并可以重复使用相同的逻辑。这就是 API 网关出现的原因，其作为共享层来处理服务协议之间的差异并满足特定客户端的要求。")]),t._v(" "),n("h2",{attrs:{id:"什么是-api-网关"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#什么是-api-网关"}},[t._v("#")]),t._v(" 什么是 API 网关？")]),t._v(" "),n("p",[t._v("API 网关是微服务架构中的一种服务，它为客户端提供共享层和 API，以便与内部服务进行通信。API 网关可以进行路由请求、转换协议、聚合数据以及实现共享逻辑，如认证和速率限制器。")]),t._v(" "),n("p",[t._v("您可以将 API 网关视为我们的微服务世界的入口点。")]),t._v(" "),n("p",[t._v("我们的系统可以有一个或多个 API 网关，具体取决于客户的需求。例如，我们可以为桌面浏览器、移动应用程序和公共 API 提供单独的网关。")]),t._v(" "),n("p",[t._v("(../.vuepress/public/images/171554cdb4df51e1.png)\nAPI 网关作为微服务的切入点")]),t._v(" "),n("h3",{attrs:{id:"node-js-用于前端团队的-api-网关"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#node-js-用于前端团队的-api-网关"}},[t._v("#")]),t._v(" Node.js 用于前端团队的 API 网关")]),t._v(" "),n("p",[t._v("由于 API 网关为客户端应用程序（如浏览器）提供了功能，它可以由负责开发前端应用程序的团队实施和管理。")]),t._v(" "),n("p",[t._v("这也意味着用哪种语言实现 API Gateway 应由负责特定客户的团队选择。由于 JavaScript 是开发浏览器应用程序的主要语言，即使您的微服务架构以不同的语言开发，Node.js 也可以成为实现 API 网关的绝佳选择。")]),t._v(" "),n("p",[t._v("Netflix 成功地使用 Node.js API 网关及其 Java 后端来支持广泛的客户端 ，如果想要了解更多关于它们的方法，可以看看这篇文章"),n("a",{attrs:{href:"https://www.infoq.com/news/2017/06/paved-paas-netflix/",target:"_blank",rel:"noopener noreferrer"}},[t._v(' The "Paved Road" PaaS for Microservices at Netflix'),n("OutboundLink")],1)]),t._v(" "),n("p",[t._v("(../.vuepress/public/images/1715551ad47c8f64.png)")]),t._v(" "),n("h2",{attrs:{id:"api-网关功能"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#api-网关功能"}},[t._v("#")]),t._v(" API 网关功能")]),t._v(" "),n("p",[t._v("我们之前讨论过，可以将通用共享逻辑放入您的 API 网关，本节将介绍最常见的网关职责。")]),t._v(" "),n("h3",{attrs:{id:"路由和版本控制"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#路由和版本控制"}},[t._v("#")]),t._v(" 路由和版本控制")]),t._v(" "),n("p",[t._v("我们将 API网关定义为您的微服务的入口点。在网关服务中，你可以指定从客户端路由到特定服务的路由请求。甚至可以通过路由处理版本或更改后端接口，而公开的接口可以保持不变。你还可以在您的API网关中定义与多个服务配合的新端点。")]),t._v(" "),n("p",[t._v("(../.vuepress/public/images/17155592280ae05a.png)\nAPI 网关作为微服务入口点")]),t._v(" "),n("h3",{attrs:{id:"网关设计的进化"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#网关设计的进化"}},[t._v("#")]),t._v(" 网关设计的进化")]),t._v(" "),n("p",[t._v("API网关方法可以帮助你"),n("strong",[t._v("分解整体应用程序")]),t._v("。在大多数情况下，作为微服务端，重构系统并不是一个好主意，而且也是不可能的，因为我们需要在过渡期间为业务提供功能。")]),t._v(" "),n("p",[t._v("在这种情况下，我们可以将代理或 API 网关置于我们的整体应用程序之前，将新功能作为微服务实现，并将新端点路由到新服务，同时通过原有的路由服务旧端点。这样以后，我们也可以通过将原有功能转变为新服务来分解整体。")]),t._v(" "),n("p",[t._v("通过渐进式设计，我们可以从整体架构平稳过渡到微服务。")]),t._v(" "),n("p",[t._v("(../.vuepress/public/images/1715562a16cae517.png)")]),t._v(" "),n("h3",{attrs:{id:"认证方式"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#认证方式"}},[t._v("#")]),t._v(" 认证方式")]),t._v(" "),n("p",[t._v("大多数微服务基础架构都需要处理身份验证。将身份验证之类的"),n("strong",[t._v("共享逻辑")]),t._v("放入API网关可以帮助你"),n("strong",[t._v("缩小服务的体积")]),t._v("并"),n("strong",[t._v("专注管理域")]),t._v("。")]),t._v(" "),n("p",[t._v("在微服务架构中，你可以通过网络配置将服务保留在DMZ（保护区）中，并通过API网关将其"),n("strong",[t._v("公开")]),t._v("给客户端。该网关还可以处理多种身份验证方法，例如，您可以同时支持基于cookie和token的身份验证。")]),t._v(" "),n("p",[n("img",{attrs:{src:a(354),alt:"具有认证功能的 API 网关"}})]),t._v(" "),n("h3",{attrs:{id:"数据汇总"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#数据汇总"}},[t._v("#")]),t._v(" 数据汇总")]),t._v(" "),n("p",[t._v("在微服务体系结构中，可能会发生客户端需要不同聚合级别的数据的情况，例如对各种微服务中产生的数据实体进行非规范化。在这种情况下，我们可以使用我们的API网关来解决这些依赖关系并从多个服务中收集数据。")]),t._v(" "),n("p",[t._v("在下图中，您可以看到API 网关 如何合并用户和信用信息，并作为一条数据返回给客户端。请注意，它们由不同的微服务拥有和管理。")]),t._v(" "),n("p",[t._v("(../.vuepress/public/images/1715575e175699a0.jpg)")]),t._v(" "),n("h3",{attrs:{id:"序列化格式转换"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#序列化格式转换"}},[t._v("#")]),t._v(" 序列化格式转换")]),t._v(" "),n("p",[t._v("我们可能需要支持具有"),n("strong",[t._v("不同数据序列化格式")]),t._v("要求的客户端。 想象一下这种情况：我们的微服务使用JSON，但是我们的一位客户只能使用XML API。在这种情况下，我们可以在API网关中将JSON转换为XML，而不是在所有微服务中去实现。")]),t._v(" "),n("p",[t._v("(./../.vuepress/public/images/1715579141fbe5a3.png)")]),t._v(" "),n("h3",{attrs:{id:"协议转换"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#协议转换"}},[t._v("#")]),t._v(" 协议转换")]),t._v(" "),n("p",[t._v("微服务架构允许"),n("strong",[t._v("多语言协议传输")]),t._v("从而获得不同技术的好处。但是，大多数客户端仅支持一种协议。在这种情况下，我们需要为客户端转换服务协议。")]),t._v(" "),n("p",[t._v("API 网关还可以处理客户端和微服务器之间的协议转换。")]),t._v(" "),n("p",[t._v("在下一张图片中，您可以看到客户端希望通过 HTTP REST 进行的所有通信，而内部的微服务使用 gRPC 和 GraphQL 。")]),t._v(" "),n("p",[t._v("(./../.vuepress/public/images/1715579141fbe5a3.png)")]),t._v(" "),n("h3",{attrs:{id:"限速和缓存"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#限速和缓存"}},[t._v("#")]),t._v(" 限速和缓存")]),t._v(" "),n("p",[t._v("在前面的例子中，您可以看到我们可以把通用的共享逻辑（如身份验证）放在 API 网关中。除了身份验证之外，您还可以在 API 网关中实现速率限制，缓存以及各种可靠性功能。")]),t._v(" "),n("h3",{attrs:{id:"超负荷的-api-网关"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#超负荷的-api-网关"}},[t._v("#")]),t._v(" 超负荷的 API 网关")]),t._v(" "),n("p",[t._v("实现API网关时，应避免将非通用逻辑（例如特定领域的数据转换）放入网关。 服务应始终对其"),n("strong",[t._v("数据域")]),t._v("拥有"),n("strong",[t._v("完全所有权")]),t._v("。构建一个超负荷的API网关，让微服务团队来控制，这违背了微服务的理念。")]),t._v(" "),n("p",[t._v("这就是为什么你应该谨慎使用API网关中的数据聚合的原因，使用起来可能功能强大，但也应避免的特定于域的数据转换或规则处理逻辑。")]),t._v(" "),n("p",[t._v("始终为您的 API 网关定义"),n("strong",[t._v("明确的责任")]),t._v("，并且只包括其中的通用共享逻辑。")]),t._v(" "),n("h2",{attrs:{id:"node-js-api-网关"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#node-js-api-网关"}},[t._v("#")]),t._v(" Node.js API 网关")]),t._v(" "),n("p",[t._v("当您希望在 API 网关中执行简单的操作，比如将请求路由到特定服务，您可以使用像 nginx 这样的反向代理。但在某些时候，您可能需要实现一般代理不支持的逻辑。在这种情况下，您可以在 Node.js 中实现自己的 API 网关。")]),t._v(" "),n("p",[t._v("在 Node.js 中，您可以使用 "),n("code",[t._v("http-proxy")]),t._v(" 软件包简单地代理对特定服务的请求，也可以使用更多丰富功能的 "),n("code",[t._v("express-gateway")]),t._v(" 来创建 API 网关。")]),t._v(" "),n("p",[t._v("在我们的第一个 API 网关示例中，我们在将代码委托给 user 服务之前验证请求。")]),t._v(" "),n("div",{staticClass:"language-javascript extra-class"},[n("pre",{pre:!0,attrs:{class:"language-javascript"}},[n("code",[t._v("   "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" express "),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("require")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token string"}},[t._v("'express'")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n    "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" httpProxy "),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("require")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token string"}},[t._v("'express-http-proxy'")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n    "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" app "),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("express")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n\n    "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" userServiceProxy "),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("httpProxy")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token string"}},[t._v("'https://user-service'")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n\n    "),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 身份认证")]),t._v("\n    app"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("use")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token parameter"}},[t._v("req"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" res"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" next")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n      "),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// TODO: 身份认证逻辑")]),t._v("\n      "),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("next")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n    "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n\n    "),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 代理请求")]),t._v("\n    app"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("get")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token string"}},[t._v("'/users/:userId'")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token parameter"}},[t._v("req"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" res"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" next")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n      "),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("userServiceProxy")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("req"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" res"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" next"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n    "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n")])])]),n("p",[t._v("另一种示例可能是在您的 API 网关中发出新的请求，并将响应返回给客户端：")]),t._v(" "),n("div",{staticClass:"language-javascript extra-class"},[n("pre",{pre:!0,attrs:{class:"language-javascript"}},[n("code",[t._v("   "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" express "),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("require")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token string"}},[t._v("'express'")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n    "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" request "),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("require")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token string"}},[t._v("'request-promise-native'")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n    "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" app "),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("express")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n\n    "),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 解决: GET /users/me")]),t._v("\n    app"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("get")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token string"}},[t._v("'/users/me'")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("async")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token parameter"}},[t._v("req"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" res")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n      "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" userId "),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" req"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("session"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("userId\n      "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" uri "),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token template-string"}},[n("span",{pre:!0,attrs:{class:"token template-punctuation string"}},[t._v("`")]),n("span",{pre:!0,attrs:{class:"token string"}},[t._v("https://user-service/users/")]),n("span",{pre:!0,attrs:{class:"token interpolation"}},[n("span",{pre:!0,attrs:{class:"token interpolation-punctuation punctuation"}},[t._v("${")]),t._v("userId"),n("span",{pre:!0,attrs:{class:"token interpolation-punctuation punctuation"}},[t._v("}")])]),n("span",{pre:!0,attrs:{class:"token template-punctuation string"}},[t._v("`")])]),t._v("\n      "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" user "),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("await")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("request")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("uri"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n      res"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("json")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("user"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n    "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n")])])]),n("h3",{attrs:{id:"node-js-api-网关总结"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#node-js-api-网关总结"}},[t._v("#")]),t._v(" Node.js API 网关总结")]),t._v(" "),n("p",[t._v("API 网关提供了一个共享层，以通过微服务架构来满足客户需求。它有助于保持您的服务小而专注。您可以将不同的通用逻辑放入您的 API 网关，但是您应该避免API网关的过度使用，因为很多逻辑可以从服务团队中获得控制。")])])}),[],!1,null,null,null);s.default=e.exports}}]);