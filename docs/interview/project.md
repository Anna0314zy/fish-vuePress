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
##
## 如何实现项目主题色

方案一
- 1.[先把默认主题文件中涉及到颜色的 CSS 值替换成关键词：](https://github.com/ElementUI/theme-preview/blob/master/src/app.vue#L250-L274)
- 2.[根据用户选择的主题色生成一系列对应的颜色值：](https://github.com/ElementUI/theme-preview/blob/master/src/utils/formula.json)
- 3.[把关键词再换回刚刚生成的相应的颜色值：](https://github.com/ElementUI/theme-preview/blob/master/src/utils/color.js)
- 4.[直接在页面上加 style 标签，把生成的样式填进去：](https://github.com/ElementUI/theme-preview/blob/master/src/app.vue#L198-L211)
