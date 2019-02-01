import Vue from 'vue'
import Router from 'vue-router'
import page_wash from '../page/wash'
import page_flow from '../page/flow'
import page_index from '../page/index'
Vue.use(Router)
export default new Router({
  routes: [
    { path: '/', component: page_index },
    { path: '/wash', component: page_wash },
    { path: '/flow', component: page_flow } 
  ]
})
