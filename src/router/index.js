import Vue from 'vue'
import Router from 'vue-router'
import page_wash from '../page/wash'
import page_flow from '../page/flow'
import page_index from '../page/index'
import page_login from '../page/login'
Vue.use(Router)
export default new Router({
  routes: [
    {
      path: '/', component: page_login,
      meta: {
        keepAlive: false// 需要被缓存
      }},
    { path: '/index', component: page_index },
    { path: '/wash', component: page_wash },
    { path: '/flow', component: page_flow } 
  ]
})
