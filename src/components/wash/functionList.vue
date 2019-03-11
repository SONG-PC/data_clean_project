<template>
  <div v-on:mousemove="unpreview()" class="right-top  split">
   
    
    <div  class="function_group" style="background-color:#fff">
      <div style="height:89px;">
        <ul class="tabs split">
          <li class="active" v-on:click="tab(0)">函数列表</li>
          <li v-on:click="tab(1)">系统推荐</li>
          <li v-if="unready_list.length>0" v-bind:style="{color:'orangered'}" v-on:click="tab(2)">配置中({{unready_list.length}})</li>     
        </ul>
        <div class="selectBox split">

          <input placeholder="搜索一个函数开始吧..." type="text" />
        </div>
      </div>
      <div v-if="tab_index==2" class="unready" style="overflow-x:hidden">
        <div style="width:100%;position:absolute;height:100%;top:50%;text-align:center;color:lightslategray;font-size:13px;">当前视图选中状态无可推荐内容</div>
        <ul name="fnlist" tag="ul" style="width:100%;height:auto">
          <li class="split" v-for="(value,index) in   unready_list" v-bind:key="index" style="float:none;width:97%;margin-left:1.5%;margin-top:5px;border:1px solid rgb(230,230,230);border-radius:5px">
            <div style="height:40px;line-height:40px;position:relative;font-weight:600;border-bottom:1px dashed rgb(230,230,230)">
              <i class="setting"></i> {{value.label}}
              <!--<el-tooltip content="添加这个函数到操作队列" placement="left" effect="light">-->
              <div v-on:mousemove.stop.prevent="preview('index',value)" v-on:click="add_op(value,index,unready_list)" style="position:absolute;font-size:26px;font-weight:500;color:yellowgreen;right:10px;top:-2px;">+</div>
              <!--</el-tooltip>-->
              <!--<el-tooltip content="从待添加列表删除" placement="left" effect="light">-->
              <div v-on:click="updateOpFromUnready(index)" style="position:absolute;font-size:26px;font-weight:500;color:red;right:39px;top:-2px;">-</div>
              <!--</el-tooltip>-->
            </div>
            <div style="height:auto;width:100%;padding-left:16px;margin-bottom:20px;">
              <FnParameters v-on:updateOp="updateOp()" v-bind:floor="0" v-bind:parameters="value.parameters" />
              </div>
          </li>
        </ul>

      </div>
      <div v-if="tab_index==1" class="suggestion" style="overflow-x:hidden">
        <div style="width:100%;position:absolute;height:100%;top:50%;text-align:center;color:lightslategray;font-size:13px;">当前视图选中状态无可推荐内容</div>
        <ul name="fnlist" tag="ul" style="width:100%;height:auto">
          <li class="split" v-for="(value,index) in   suggest_list" v-bind:key="index" style="float:none;width:97%;margin-left:1.5%;margin-top:5px;border:1px solid rgb(230,230,230);border-radius:5px">
            <div style="height:40px;line-height:40px;position:relative;border-bottom:1px dashed rgb(230,230,230);font-weight:600">
              <i class="ideal"></i> {{value.label}}
              <!--<el-tooltip content="添加这个函数到操作队列" placement="left" effect="light">-->
              <div v-on:mousemove.stop.prevent="preview('index',value)" v-on:click="add_op(value)" style="position:absolute;font-size:26px;font-weight:500;color:yellowgreen;right:10px;top:-2px;">+</div>
              <!--</el-tooltip>-->
            </div>
            <div style="height:auto;width:100%;padding-left:16px;margin-bottom:20px;">
              <FnParameters v-on:updateOp="updateOp()" v-bind:floor="0" v-bind:parameters="value.parameters" />
              </div>
          </li>
        </ul>
      </div>
      <div v-if="tab_index==0" class="fn_group_list">
        <div style="width:100%" v-for="(value, key, index) in   fn_list">
          <div class="txt split">{{key}}</div>
          <ul style="width:100%;height:auto">
            <li class="split" style="float:none" v-for="(p, index) in value">
              <div class="fn label split" style="position:relative">
                {{p.label}}
                <div class="desc"><a target="_blank" v-bind:href="p.doc_url" style="color:skyblue;font-weight:500">{{p.description}}</a></div>
                <!--<el-tooltip content="添加这个函数到操作队列" placement="left" effect="light">-->
                  <div v-on:mousemove.stop.prevent="preview('index',p)"  v-on:click="add_op(p)" style="position:absolute;font-size:26px;font-weight:500;color:yellowgreen;right:10px;top:-2px;">+</div>
                <!--</el-tooltip>-->
              </div>
              <div style="height:auto;width:100%;padding-left:16px;margin-bottom:20px;">
                <FnParameters v-on:updateOp="updateOp()" v-bind:floor="0" v-bind:parameters="p.parameters" />
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<style>
  .fnlist-item {
    display: inline-block;  
  }

  .fnlist-enter-active, .fnlist-leave-active {
    transition: all .3s;
  }

  .fnlist-enter, .fnlist-leave-to
  /* .list-leave-active for below version 2.1.8 */ {
    opacity: 0;
    transform: translate3d(150px, 0, 0);
  }
</style>
<script>
  import '../../assets/js/global/global_drag.js'
  import loading_gif from '../../resourse/968f5530a66a4124366500c7de835816.gif'
  import Vue from 'vue'
  var Rx = require('@rxjs/rx');
  import $ from 'jquery'
  import flip from '../../assets/js/global/global_flip.js'
  import common from '../../assets/js/common.js';
  var Mock = require('mockjs');
  var item_list;
  var test_box;
  var text;
  var con;

  //var inputStream = Rx.Observable.fromEvent(text[0], 'keyup').debounce(500).pluck('target', 'value').subscribe(data => _super.search(data)); // 接收数据
  export default {
    components: { Function },
    created: function () {
      window.Bus.fnlistPoint = this;
    },
    mounted: function () {
      con = $(".function_group .tabs");
      con.delegate("li", "click", function () {
        con.find("li").removeClass("active");
        $(this).addClass("active");
      })
      this.fn_list = $.extend(true, {}, this.fn_group_list);
      
      this.$watch('unready_list', function (newValue, oldValue) {     
        setTimeout(function () {
          if (newValue.length > 0)
            this.tab(2);
          else
            this.tab(0);
        }.bind(this), 0)
      });

      this.$watch('fn_group_list', function (newValue, oldValue) {
     
        this.fn_list = $.extend(true, {}, newValue);
      }.bind(this));
      this.$watch('$store.state.suggestion', function (newValue, oldValue) {
        this.suggest_list = [];
        setTimeout(function () {
        
          this.suggest_list = $.extend(true, [], newValue);
          if (this.suggest_list.length>0)
          this.tab(1);
        }.bind(this),0)
       
      }.bind(this));
    },
    data: function () {
      return {
        fn_list: [],
        isPreview: false,
        suggest_list: [],
        unready_list:[],
        tab_index:0
      }
    },
    computed: {

      fn_group_list: function () {

        var rtn = this.$store.getters.getFunctionListGroup();
        return rtn;
      }
    },
    
    methods: {

      preview: function (index,item) {

        if (window.Bus.preRollback || window.Bus.isPreview)
          return;
        if (window.Bus.oplistPoint.$refs.mychild.playing)
          return
        window.Bus.timeOut && clearTimeout(window.Bus.timeOut);
        window.Bus.timeOut = setTimeout(function () {
          this.createRollback();
          window.Bus.isPreview  = true;
       
          var previous_version;
          var view_range = [];
          if (window.Bus.gridPoint) {
            view_range = window.Bus.gridPoint.getRenderRange();
          }
          var oplist = $.extend(true, [], this.$store.state.operation.op_list);
          var count = -1;
          oplist.forEach(function (v) {
            if (v.turn && v.isAction) {
              count++;
            }
          });
          if (count >= 0) {
            previous_version = this.$store.state.operation.steps[count];
          }
          var parameters = {};
          common.create_node_parm(parameters, item.parameters)
          oplist.push({
            "height": 0,
            "isEdit": false,
            "tip": null,
            "id": Mock.Random.guid(),
            "fn_list_code": item.code,
            "turn": true,
            "col_data_type": null,
            isPreview:true,
            parameters: parameters ,
            filters: this.$store.state.filters
          });

          this.$store.dispatch('getPreviewId', {
            data: {
              op_list: oplist
            },
            callback: function (res) {
              if (window.Bus.preRollback) {
                this.$store.commit('incrementalUpdataState', {

                  operation: {
                    op_list: oplist

                  }

                });
                this.$store.dispatch('diff', {
                  data: {
                    "view_type": "diff_window",
                    "view_range": view_range,
                    "current_version": res.data,
                    "previous_version": previous_version
                  },
                  compelete: function () {
                    window.Bus.isPreview = false;
                  }
                });
              }
            }.bind(this)
          })
        }.bind(this), 1500);
      },
      unpreview: function () {

        window.Bus.oplistPoint.unpreview();
      },
      createRollback: function () {
        var op_data = $.extend(true, [], this.$store.state.operation.op_list);
        var diff_data = $.extend(true, [], this.$store.state.grid.diff_data);
        window.Bus.preRollback = function () {
          this.$store.commit('incrementalUpdataState', {
            operation: {
              op_list: op_data

            },
            grid: {
              diff_data: diff_data

            }
            
          });
        }.bind(this);
      },

      delete_op: function () {



      },
      updateOpFromUnready: function (index) {
        this.unready_list.splice(index, 1);
      },
      tab: function (index) {
        this.tab_index = index;
        con.children().eq(index).trigger("click");
      },
      add_op: function (v,index,parent) {
        this.unpreview();
        var parameters = {};
        common.create_node_parm(parameters, v.parameters);
        this.$store.dispatch("washAction", {
          data: {
            actions: [{
              fn_code: v.code,
              parameters: parameters,
              filters: this.$store.state.filters
            }]
          },
          onSuccess: function () {
         
            window.Bus.callback.push(
              function (toEle,callback) {
                if ($(".slider .item").length > 0) {

                  flip($(".slider .item"), toEle,null,null, callback);
                }
              }
            )
          }
        });
        if (parent) {
          parent.splice(index, 1);
      
        }
   
      },
      search: function (data) {
        var str = data.replace(/\s+/g, "");
        if (str.length > 0) {
          this.grouplist.forEach(function (item, idx) {
            var count = 0;
            item.fn_list.forEach(function (v, i) {
              var position = v.fn_label.indexOf(str);
              if (position > -1) {
                v.hidden  = false;
                count++;
                v.strRange = { start: position, end: position + str.length }

              }
              else {
                v.hidden  = true;
              }

            });
            if (count == 0) {
              item.hidden  = true;
            }
            else {
              item.hidden  = false;
            }
            Vue.set(this.grouplist, idx, item)
          }.bind(this));
       
        } else {
          this.grouplist.forEach(function (item, idx) {
       
            item.fn_list.forEach(function (v, i) {

              v.hidden  = false;
              v.strRange = null;
            })
            item.hidden = false;
            Vue.set(this.grouplist, idx, item)
          }.bind(this));

        }
        this.render();
      },
      contactTest: function (obj, g_idx, f_idx) {

      

      },
      loading: function () {
        this.function_container.css("background-image", "url('" + loading_gif + "')");
      },
      hideLoading: function () {
        this.function_container.css("background-image", "");
      },
      render: function () {
    
      },
      refesh: function () {

      
      
      }
    },
    name: "FunctionList"
  }
</script>
