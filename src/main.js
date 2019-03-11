
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
//前端总线数据---可能由多个组件发布订阅的数据
window.Bus = new Vue({
  data: {
    timeOut: null,
    //columns: {},//数据列信息
    //operatingCommand: {}, //数据操作命令集合
    gridSelected: null, //当前表格选中元素\
    filterPoint: null,
    isPreview: false,
    fnlistPoint: null,
    gridPoint: null,
    oplistPoint: null,
    colfilter: [],
    preRollback: null,
   // groupSelected: {},//当前卡牌组选择对象
    //order: {},//当前命令
    //filter: null,//需要装<k填的过滤器
    //card: [{
    //  fnlist: [],
    //  isActive:true
    //}],//卡牌队列
    //card_segment:[],
    //filterlist: [],
    //data_frame: [],
    //grid: {},
    callback: []
  }
});
document.body.onselectstart = function () {
  return false;
};
window.Promise = Promise
import Vue from 'vue'
import store from './vuex/store'
import { Switch, Table, TableColumn, Breadcrumb, BreadcrumbItem, Badge, Progress, DatePicker, Alert, Pagination, Tag, Menu, Row, MenuItemGroup, DropdownMenu, Dropdown, DropdownItem, MenuItem, Submenu, Input, InputNumber, Select, Tooltip, Button, Notification, MessageBox, Message } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
import Parameters from '../src/components/flow/parameters'
import FnParameters from '../src/components/wash/parameters2'
import 'babel-polyfill'
import VueParticles from 'vue-particles'
Vue.use(VueParticles);
Vue.component('Parameters', Parameters);
Vue.component('FnParameters', FnParameters);
Vue.use(Switch);

Vue.use(Breadcrumb);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(BreadcrumbItem);
Vue.use(Progress);
Vue.use(Badge);
Vue.use(Submenu);
Vue.use(Pagination);
Vue.use(Tag);
Vue.use(Menu);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Dropdown);
Vue.use(Row);
Vue.use(MenuItemGroup);
Vue.use(DropdownMenu);
Vue.use(MenuItem);
Vue.use(Tooltip);
Vue.use(DatePicker);
Vue.use(Input);
Vue.use(InputNumber);
Vue.use(Select);
Vue.use(Button);

Vue.prototype.$notify = Notification;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$message = Message; 

Vue.prototype.$confirm = MessageBox.confirm;
import router from './router'
router.beforeEach(async (to, from, next) => {
  let user = window.login;
  if (to.path === '/') {
    if (user) {
      next({ path: '/index' });
    }
    else {
      next();
    }
    return
  } else if (user) {
    next();
    return;
  }
  else {
    next({ path: '/'});
  }
   

});
const R = require('ramda');
console.log(R);
Vue.config.productionTip = false
/* eslint-disable no-new */

new Vue({
  store: store,
  el: '#mask',

  mounted: function () {
    this.$store.dispatch("getDictionary");
    this.$watch("$store.state.dictionary", function (newValue, oldValue) {
      console.log("dwadwa")
      if (newValue) {

        new Vue({
          el: '#app',
          router,
          store: store,
          beforeCreate: function () {


          },
          template: '<router-view />'
        });

      }
    });
  },
  template: '<div id="mask" class="mask" v-if="$store.state.loading"> </div>'
});





