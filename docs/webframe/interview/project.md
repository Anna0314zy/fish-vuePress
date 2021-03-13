---
title: 项目实战
date: 2019-06-11
tags:
   - Vue
   - Vuex
---

[[toc]]
## 项目中tab栏切换
问题描述: 每次切换tab栏的时候，请求了后端接口，如何保证内容的正确性
因为 连续请求后端的时候 接口是异步的 无法保证最后一个回来的内容是你想要的
解决方案: 
- 1.按钮禁用
- 2.请求接口的时候，给接口传个标识，返回的结果加上这个标识，如果是想要的内容才显示
- 3.用axios.CancelToken
1.实例化axios 
```js
class AjaxRequest {
  constructor() {
    // development production
    this.baseURL = process.env.NODE_ENV !== 'production' ? 'http://localhost:3000/api'
      : '/'; // 基础路径
    this.timeout = 3000; // 超时时间
  }

  setInterceptor(instance, url) {
    instance.interceptors.request.use((config) => { // 请求拦截
      const Cancel = axios.CancelToken;
      // 每次请求前 将token 放到请求中
      config.headers.token = localStorage.getItem('token') || '';
      config.cancelToken = new Cancel(((c) => {
        store.commit(types.PUSH_TOKEN, c); //订阅
      }));
      return config;
    }, err => Promise.reject(err));
  }
  request(options) {
    const instance = axios.create();
    const config = {
      ...options,
      baseURL: this.baseURL,
      timeout: this.timeout,
    };
    // 给这个实例增加拦截器
    this.setInterceptor(instance, options.url); // 给这个实例增加拦截功能
    return instance(config); // 返回的是一个promise
  }
}

export default new AjaxRequest();

```
2.store
```js
 mutations: {
     //订阅
    [types.PUSH_TOKEN](state, cancel) {
      state.ajaxToken = [...state.ajaxToken, cancel];
    },
    //取消
    [types.CLEAR_TOKEN](state) {
      state.ajaxToken.forEach(cancel => cancel());
      state.ajaxToken = [];
    }
}
```
3.切换tab的时候
```js
store.commit(types.CLEAR_TOKEN);
```
## axios封装 接口加载中处理
```js
class AjaxRequest {
  constructor() {
    //...
    // message组件
    this.queue = {}; // 请求队列
  }

  setInterceptor(instance, url) {
    instance.interceptors.request.use((config) => { // 请求拦截
      //...
      // 请求前  增加请求队列
      if (Object.keys(this.queue).length === 0) {
        this.toast = Toast.$create({
          txt: '正在加载',
          time: 0,
        });
        this.toast.show();
      }
      this.queue[url] = url;
      return config;
    }, err => Promise.reject(err));
    instance.interceptors.response.use((res) => { // 响应拦截
      delete this.queue[url];
      // 请求完成删除对应的url 当队列被情况隐藏掉
      if (Object.keys(this.queue).length === 0) {
        this.toast.hide();
      }
      // res.data.code = 401;
      if (res.data.code === 0) {
        return res.data.data;
      }
      return Promise.reject(res.data);
    }, (err) => {
      delete this.queue[url];
      // 请求完成删除对应的url 当队列被情况隐藏掉
      if (Object.keys(this.queue).length === 0) {
        this.toast.hide();
      }
      Promise.reject(err);
    });
  }

  request(options) {
    const instance = axios.create();
    const config = {
      ...options,
      baseURL: this.baseURL,
      timeout: this.timeout,
    };
    // 给这个实例增加拦截器
    this.setInterceptor(instance, options.url); // 给这个实例增加拦截功能
    return instance(config); // 返回的是一个promise
  }
}
```
## vuex的使用
1.actionTypes
用来定义变量名字 防止调用的时候出错
```js
// 1) 分类功能
export const SET_CATEGORIES = 'SET_CATEGORIES';
// 2) 添加当前选中的课程
export const SET_CURRENT_LESSON = 'SET_CURRENT_LESSON'

```
2.store-index.vue
定义vuex
```js
new Vuex.Store({
  modules: {
    home, //模块
  },
 //以下是跟组件
  state: {
    user: {}, // user.meauList
    hasPermisson: false, // 校验通过
    menuPermisson: false, // 菜单是否要求权限
    todos: [
      { id: 1, text: '...', done: true },
      { id: 2, text: '...', done: false }
    ]
  },
//类似计算属性
 getters: {
    doneTodos: state => {
      return state.todos.filter(todo => todo.done)
    }
  },
 //同步方法
  mutations: {
    [types.SET_USER](state, payload) {
      state.user = payload;
      state.hasPermisson = true;
    },
    [types.SET_MENU_LIST](state) {
      state.menuPermisson = true;
    },
  },
 //异步
  actions: {
    async [types.LOGIN]({ commit }, user) {
      try {
        const result = await login(user);
        //...
        commit(types.SET_USER, result);
        localStorage.setItem(('token'), result.token);
      } catch (e) {
        //...
      }
    }
  },
});
```
3.如何使用
- 写法一
如果不是模块下面的数据，可以不用写模块名字，直接调用
```js
import {mapState, mapActions,mapMutations } from 'vuex';
export default {
  computed: {
   ...mapGetters([
      'doneTodos'
      // ...
    ]),
    ...mapState('home', ['categories', 'slides']) //属性映射
  },
  mounted() {
    this[types.SET_CATEGORIES]();
  },
  methods: {
    // 切换课程
   ...mapActions('home', [types.SET_CATEGORIES]),
   ...mapMutations('home', [types.SET_CURRENT_LESSON]),
  },
};
```
- 写法二
```js
import { createNamespacedHelpers } from 'vuex';
const { mapActions, mapState, mapMutations } = createNamespacedHelpers('home');
export default {
  computed: {
     ...mapState(['categories', 'slides']),
  },
  mounted() {
    // this.$store.dispatch('home/setCategories');
    this[types.SET_CATEGORIES]();
    this[types.SET_SLIDES]();
  },
  methods: {
    ...mapActions([types.SET_CATEGORIES, types.SET_SLIDES]),
    ...mapMutations([types.SET_CURRENT_LESSON]),
    change(value) {
      this[types.SET_CURRENT_LESSON](value[0]);
    },
  },

};

```
## 级联组件 el-cascader
::: tip
回显值得关键必须要把需要回显的都写到options里面，
且最后一项要加上leaf:true,表示无下级了才可以回显；
这里写死，实际要根绝接口返回的需要回显的数据，来递归循环到结果，赋值给这里；
:::
一：实现思路
定位原因：懒加载的级联下拉框无法回显是因为，只绑定了model的值，没有options的数据支撑的话，获取不到节点的内容导致；

方案：拿到选中的项的时候，用这些值去递归循环获取相应的节点的一些属性，赋值给options，然后注意最后一个节点的leaf属性一定要有且是true了才可以回显；

 

回到顶部
二：绑定了options还是没有回显的可能原因
2.1 赋值options的格式不对；

2.2 赋值的option里面最后一项没有加上 leaf:true,导致插件以为还有下级所以无法回显；

2.3 赋值的id数据类型和实际不一致，如果model里面的是字符串，option里面的id也要转换成字符串；

2.4 options整个数据必须是响应式的数据 
```vue
<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" />
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    <el-cascader
            ref="cascaderHandle"
      :props="test_props"
      :options="test_options"
      v-model="test_model"
      @change="change"
    ></el-cascader>
  </div>
</template>

<script>
// import HelloWorld from "./components/HelloWorld.vue";
export default {
  name: "App",
  components: {
    // HelloWorld,
  },
  data() {
    let id2 = 2;

    return {
      test_options: [
        //回显值得关键必须要把需要回显的都写到options里面，且最后一项要加上leaf:true,表示无下级了才可以回显；这里写死，实际要根绝接口返回的需要回显的数据，来递归循环到结果，赋值给这里；
        {
          value: "选项1",
          label: "选项1",
          leaf: false,//true 表示肯定没有下级了
          children: [], //如果可能有下级 给个[] 直接给leaf:true代表没下级了
          // children: [{ value: "选项3", label: "选项3", leaf: true }],
        },
        {
          value: "选项2",
          label: "选项2",
        },
      ],
      test_model: ["选项1","选项3"], //模拟后台取到的默认值，这里是单选
      test_props: {
        checkStrictly: true,
        lazy: true,
        lazyLoad(node, resolve) {
          const { level } = node;
          if (level === 2) resolve();
          setTimeout(() => {
            const nodes = Array.from({ length: 8 }).map(() => {
              ++id2;
              return {
                value: `选项${id2}`,
                label: `选项${id2}`,
                leaf: level >= 1,
              };
            });
            // 通过调用resolve将子节点数据返回，通知组件数据加载完成
            resolve(nodes);
          }, 1000);
        },
      },
    };
  },
    mounted() {
      //点击文字的时候 让左边的按钮事件执行
      document.querySelectorAll('.el-cascader-panel').forEach(el => {
          el.onclick = function (e) {
               e = e || window.event;
              let target = e.target || e.srcElement;
              console.dir(target, 'target');
              if (target.className === 'el-cascader-node__label') {
                  if (target.previousElementSibling) target.previousElementSibling.click()
              }
          }
      })
    },
    methods:{
      change(val) {
         if (val.length === 2) this.$refs.cascaderHandle.dropDownVisible = false
      }
    }
};
</script>

<style>
  
</style>

```
## el-select大数据渲染

```vue
<template>
    <div class="content">
         <el-select filterable v-model="choose" size="small" v-el-select-loadmore="loadMore(num)">
             <el-option
             v-for="(item, index) in list.slice(0, rangeNumber)" 
             :key="index"
             :label="item.label"
             :value="item.value"></el-option>
         </el-select>
    </div>
</template>
 
<script>
import Vue from "vue";
Vue.directive(
    'elSelectLoadmore', {
        bind(el, binding) {
            // 获取element-ui定义好的scroll盒子
            const SELECTWRAP_DOM = el.querySelector('.el-select-dropdown .el-select-dropdown__wrap');
            SELECTWRAP_DOM.addEventListener('scroll', function () {
            
                /**
                * scrollHeight 获取元素内容高度(只读)
                * scrollTop 获取或者设置元素的偏移值,常用于, 计算滚动条的位置, 当一个元素的容器没有产生垂直方向的滚动条, 那它的scrollTop的值默认为0.
                * clientHeight 读取元素的可见高度(只读)
                * 如果元素滚动到底, 下面等式返回true, 没有则返回false:
                * ele.scrollHeight - ele.scrollTop === ele.clientHeight;
                */
                const condition = this.scrollHeight - this.scrollTop <= this.clientHeight;
                if (condition) binding.value()
            });
        }
    }
)
export default {
    data() {
        return {
           list: [],
           choose: "",
           rangeNumber: 10,
           num: 5
        }
    },
    created(){
       this.getList()
    },
    methods: {
        getList(){
            for(let i = 0; i < 100; i++){
                this.list.push({
                   label: "menu" + i,
                   value: "menu" + i
                })
            }//测试数据10万条数据, 这里数据多少条无所谓,list.slice(0, rangeNumber)方法只会默认加载初始的10条数据
        },
        loadMore(rangeNumber){
            //n是默认初始展示的条数会在渲染的时候就可以获取,具体可以打log查看
            //if(n < 8) this.rangeNumber = 10 //elementui下拉超过7条才会出滚动条,如果初始不出滚动条无法触发loadMore方法
            return () => this.rangeNumber += rangeNumber //每次滚动到底部可以新增条数  可自定义
        },
    }
}
</script>
 
<style lang="stylus" scoped>
.content{
   padding: 24px 24px;
   .el-input{
       width: 400px;
       margin: 20px;
   }
}
</style>
```
## 如何实现项目主题色

方案一
- 1.[先把默认主题文件中涉及到颜色的 CSS 值替换成关键词：](https://github.com/ElementUI/theme-preview/blob/master/src/app.vue#L250-L274)
- 2.[根据用户选择的主题色生成一系列对应的颜色值：](https://github.com/ElementUI/theme-preview/blob/master/src/utils/formula.json)
- 3.[把关键词再换回刚刚生成的相应的颜色值：](https://github.com/ElementUI/theme-preview/blob/master/src/utils/color.js)
- 4.[直接在页面上加 style 标签，把生成的样式填进去：](https://github.com/ElementUI/theme-preview/blob/master/src/app.vue#L198-L211)
