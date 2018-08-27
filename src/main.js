// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
//总线数据---可能由多个组件发布订阅的数据
window.Bus = new Vue({
  data: {
    columns: {},//数据列信息
    operatingCommand: {}, //数据操作命令集合
    gridSelected: {} //当前表格选中元素
  }

});
window.Promise = Promise
import Vue from 'vue'
import App from './components/FunctionSection'
import Grid from './components/dataTable'
import InputFilter from './components/filter'
import FunctionList from './components/functionList'
import QualityAnalysis from './components/qualityAnalysis'
//主页面样式
import './assets/css/css_rest.css'
import './assets/scss/main.scss'
import './assets/scss/menu.scss'
import './assets/scss/section.scss'

import $ from 'jquery'
Vue.config.productionTip = false
/* eslint-disable no-new */

new Vue({
  el: '#left',
  components: { App },
  template: ' <div class="left"><App/>   </div>'

});
new Vue({
  el: '#mid',
  components: { InputFilter,Grid},
  template: ' <div class="mid"><div id="loading" ></div><InputFilter/><Grid/></div>'

});
new Vue({
  el: '#right',
  components: { FunctionList, QualityAnalysis },
  template: ' <div class="right"><FunctionList/><QualityAnalysis/></div>'

});
document.body.onselectstart = function () {
  return false;
};

