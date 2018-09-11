// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
//总线数据---可能由多个组件发布订阅的数据
window.Bus = new Vue({
  data: {
    columns: {},//数据列信息
    operatingCommand: {}, //数据操作命令集合
    gridSelected: {}, //当前表格选中元素
    groupSelected: {},//当前卡牌组选择对象
    order: {},//当前命令
    filter: null,//需要装填的过滤器
    card: []//卡牌队列
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
    card: window.Bus.card
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
  mounted: function () {
    //监听卡牌组变化情况
    window.Bus.$watch('card', function (newValue, oldValue) {
      this.card = newValue;
      //去做一些子组件的更新
      this.$refs.mychild.forEach(function (item, idx) {
        item.update();
      })
    }.bind(this));
  },
  components: { App, sectionGroup},
  template: ' <div class="left"  ><sectionGroup/><App  ref="mychild" v-for="c in  card" v-bind:c_data="c"  v-if="c.isActive"/><div class="empty">无清洗函数,请从右侧列表添加</div> </div>'

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

