<template>
  <div class="right-top">
   
    
    <div class="function_group">
      <div style="height:89px;">
        <ul class="tabs">
          <li class="active" v-on:click="tab(0)">函数列表</li>
          <li  v-on:click="tab(1)">系统推荐</li>
        </ul>
        <div class="selectBox">

          <input placeholder="搜索一个函数开始吧..." type="text" />
        </div>
      </div>
      <div v-if="tab_index==1" class="suggestion" style="overflow-x:hidden">

          <transition-group name="fnlist" tag="ul" style="width:100%;height:auto" >
            <li :key="index" v-for="(value,index) in   suggest_list" style="float:none;width:97%;margin-left:1.5%;margin-top:5px;border:1px solid rgb(230,230,230);border-radius:5px">
              <div style="height:40px;line-height:40px;position:relative;border-bottom:1px dashed rgb(230,230,230)">
                <i class="ideal"></i> {{value.label}}
                <el-tooltip content="添加这个函数到操作队列" placement="left" effect="light">
                  <div v-on:click="add_op(value)" style="position:absolute;font-size:26px;font-weight:500;color:yellowgreen;right:10px;top:-2px;">+</div>
                </el-tooltip>
              </div>
              <FnParameters v-on:updateOp="updateOp()" v-bind:floor="0" v-bind:parameters="value.parameters" />
            </li>
           </transition-group>
      </div>
      <div v-if="tab_index==0" class="fn_group_list">
        <div style="width:100%" v-for="(value, key, index) in   fn_list">
          <div class="txt">{{key}}</div>
          <ul style="width:100%;height:auto">
            <li style="float:none" v-for="(p, index) in value" >
              <div class="fn label" style="position:relative">
                {{p.label}}
                <div class="desc" ><a target="_blank" v-bind:href="p.doc_url" style="color:skyblue;font-weight:500">{{p.description}}</a></div>
                <el-tooltip content="添加这个函数到操作队列" placement="left" effect="light">
                  <div  v-on:click="add_op(p)"  style="position:absolute;font-size:26px;font-weight:500;color:yellowgreen;right:10px;top:-2px;">+</div>
                  </el-tooltip>
              </div>
              <div style="height:auto;width:100%;padding-left:16px;margin-bottom:20px;">
               <FnParameters v-on:updateOp="updateOp()" v-bind:floor="0" v-bind:parameters="p.parameters"  />
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
    transform: translateX(150px);
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
  var item_list;
  var test_box;
  var text;
  var con;
  //var inputStream = Rx.Observable.fromEvent(text[0], 'keyup').debounce(500).pluck('target', 'value').subscribe(data => _super.search(data)); // 接收数据
  export default {
    components: { Function},
    mounted: function () {
      con = $(".function_group .tabs");
      con.delegate("li", "click", function () {
        con.find("li").removeClass("active");
        $(this).addClass("active");
      })
      this.fn_list = $.extend(true, {}, this.fn_group_list);
      this.$watch('fn_group_list', function (newValue, oldValue) {
     
        this.fn_list = $.extend(true, {}, newValue);
      }.bind(this));
      this.$watch('$store.state.suggestion', function (newValue, oldValue) {
        this.suggest_list = [];
        setTimeout(function () {
        
          this.suggest_list = $.extend(true, [], newValue);
          this.tab(1);
        }.bind(this),300)
       
      }.bind(this));
    },
    data: function () {
      return {
        fn_list: [],
        suggest_list: [],
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
      updateOp: function () {

      },
      tab: function (index) {
        this.tab_index = index;
        con.children().eq(index).trigger("click");
      },
      add_op: function (v) {
    
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
              function (toEle) {
                if ($(".slider .item").length > 0) {

                  flip($(".slider .item"), toEle);
                }
              }
            )
          }
        });
       
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
