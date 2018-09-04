// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
//总线数据---可能由多个组件发布订阅的数据
window.Bus = new Vue({
  data: {
    columns: {},//数据列信息
    operatingCommand: {}, //数据操作命令集合
    gridSelected: {}, //当前表格选中元素
    order: {},//当前命令
    filter: {},//需要装填的过滤器
  }

});
window.Bus.$watch('filter', function (newValue, oldValue) {
console.log("filter有变化")
}.bind(this));
window.Promise = Promise
import Vue from 'vue'
import App from './components/FunctionSection'
import Grid from './components/dataTable'
import InputFilter from './components/filter'
import FunctionList from './components/functionList'
import QualityAnalysis from './components/qualityAnalysis'
//主页面样式
import sectionGroup from './components/part/sectionGroup'
import './assets/css/css_rest.css'
import './assets/scss/main.scss'
import './assets/scss/menu.scss'
import './assets/scss/section.scss'
import $ from 'jquery'
Vue.config.productionTip = false
/* eslint-disable no-new */

new Vue({
  el: '#left',
  data: {
    drawer_content: "",
    drawer_position: {
      top:0,
      left:0
    }
  },
  methods: {
    showDrawer: function (content,top,left) {
      console.log(top);
      this.drawer_content = content;
      this.drawer_position = {
        top: top ,
        left: left}
    }
  },
  components: { App, sectionGroup},
  template: ' <div class="left"  ><sectionGroup/><App /> </div>'

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


//import { Observable, Subject, ReplaySubject, from, of, range } from 'rxjs';
//import common from './assets/js/common';
//import { setTimeout } from 'timers';
//new Vue({
//  el: '#right',
//  template: ' <div class="right"><input id="ok" type="button" value="test_change" v-on:click="test2"/></div>',
//  methods: {

//    test2: function () {
//      Vue.set(window.Bus, "order", { index: common.getRandomByRank(1,10000) });

     
//     // observable.subscribe({
//     //   next: x => console.log(x),
//     //   error: error => console.log(error),
//     //   complete: () => console.log('Observer got a complete notification')
//     // });
      
//    }

//  }

//});
//var  observable = Observable.create(
//        function subscribe(observer) {
//          try {
//            setTimeout(function () {
//              observer.complete();

//            }, 5000);
          
//          } catch (e) {
//            observer.error(e);
//          }
//  });
//var subscribe_obj = null;

//window.Bus.$watch("order", function (nv, ov) {
//  subscribe_obj&&subscribe_obj.unsubscribe();
//  subscribe_obj = observable.subscribe({
//    next: x => console.log(x),
//    error: error => console.log(error),
//    complete: () => console.log('Observer got a complete notification')
//  });
//});

