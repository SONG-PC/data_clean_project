<template>
  <div class="right-top">
    <div class="col_info">

      <div class="title">
        <transition name="fade">
          <div class="now_column">{{select_object.selected_text}} </div>

          </transition>
          <ul class="tabs"><li v-bind:class="{active:select_object.all_col}">列</li><li v-bind:class="{active:select_object.all_row}">行</li><li v-bind:class="{active:select_object.normal}">单元格</li></ul>
      </div>
      <div class="selectBox">

        <input placeholder="搜索一个函数开始吧..." type="text" />
      </div>
    </div>
    <div class="function_group">
      <div v-if="!item.hidden"  v-for="(item,index) in  grouplist">
        <div  class="function_group_title">{{item.group_name}}</div>
        <ul class="function suggestion">
          <li v-if="!child.hidden" v-for="(child,idx) in item.fn_list" v-bind:data-name="child.fn_name">
            <Function  ref="mychild" v-bind:group_index="index" v-bind:fn_index="idx" v-bind:function_data="child" v-bind:operator_data="select_object" v-bind:operator_name="select_object.selected_text"/>
          </li>
        </ul>
        <div style="clear:both"></div>
      </div>
    </div>
  </div>
</template>
<script>
  import '../assets/js/global/global_drag.js'
  import loading_gif from '../resourse/968f5530a66a4124366500c7de835816.gif'
  import Function from './part/function'
  import Vue from 'vue'
  var Rx = require('@rxjs/rx');

  //先出个原型，慢慢完善吧
  var data = [{
    group_name: "推荐函数", fn_list: [{
      fn_name: "test",
      fn_label: "测试",
      parm:
        [
          //参数1
          {
            parm_name: //服务端参数名称,请求时使用
              "name",
            parm_type: //参数类型,和前端data文件保持一致
              "number",
            components://当前参数所使用的组件信息
              {
                tag: "input",
                type: "text",//select,textarea......
                value: null,//默认值
                label: "名字",//组件的标签
                placeholder: "请输入",//如果是输入组件,提示输入的内容
                data:[],//如果是选择组建,可传入key-value键值对
                desc: "这是一个输入组件"   //对组件的描述
              }
          }

          //参数N.....

        ]
    },
      {
      fn_name: "test",
      fn_label: "测试2",
      parm:
        [
          //参数1
          {
            parm_name: //服务端参数名称,请求时使用
              "name",
            parm_type: //参数类型,和前端data文件保持一致
              "string",
            components://当前参数所使用的组件信息
              {
                tag: "select",
                // type: "text",//select,textarea......
                //value: null,//默认值
                label: "名字",//组件的标签
                //  placeholder: "请输入",//如果是输入组件,提示输入的内容
                value: true,
                data: "normal",//如果是选择组建,可传入key-value键值对
                desc: "这是一个输入组件"   //对组件的描述
              }
          }
          ,
          {
            parm_name: //服务端参数名称,请求时使用
              "desc",
            parm_type: //参数类型,和前端data文件保持一致
              "string",
            components://当前参数所使用的组件信息
              {
                tag: "textarea",
                value: null,//默认值
                label: "介绍",//组件的标签
                placeholder: "请输入",//如果是输入组件,提示输入的内容
                data: [],//如果是选择组建,可传入key-value键值对
                desc: "这是一个输入组件"   //对组件的描述
              }
          }
          //参数N.....

        ]
    },
      {
      fn_name: "test",
      fn_label: "测试3",
      parm:
        [
          //参数1
          {
            parm_name: //服务端参数名称,请求时使用
              "name",
            parm_type: //参数类型,和前端data文件保持一致
              "string",
            components://当前参数所使用的组件信息
              {
                tag: "select",
                // type: "text",//select,textarea......
                //value: null,//默认值
                label: "名字",//组件的标签
                //  placeholder: "请输入",//如果是输入组件,提示输入的内容
                data: [{ key: "124", value: "456" }],//如果是选择组建,可传入key-value键值对
                desc: "这是一个输入组件"   //对组件的描述
              }
          },
          //参数1
          {
            parm_name: //服务端参数名称,请求时使用
              "name",
            parm_type: //参数类型,和前端data文件保持一致
              "string",
            components://当前参数所使用的组件信息
              {
                tag: "select",
                // type: "text",//select,textarea......
                //value: null,//默认值
                label: "名字",//组件的标签
                //  placeholder: "请输入",//如果是输入组件,提示输入的内容
                data: [{ key: "124", value: "456" }],//如果是选择组建,可传入key-value键值对
                desc: "这是一个输入组件"   //对组件的描述
              }
          }

          //参数N.....

        ]
    },
      {
        fn_tip: "123",
      fn_name: "test",
      fn_label: "测试4",
      parm:
        [
          //参数1
          {
            parm_name: //服务端参数名称,请求时使用
              "name",
            parm_type: //参数类型,和前端data文件保持一致
              "string",
            components://当前参数所使用的组件信息
              {
                tag: "select",
                // type: "text",//select,textarea......
                //value: null,//默认值
                label: "名字",//组件的标签
                //  placeholder: "请输入",//如果是输入组件,提示输入的内容
                data: [{ key: "124", value: "456" }],//如果是选择组建,可传入key-value键值对
                desc: "这是一个输入组件"   //对组件的描述
              }
          }

          //参数N.....

        ]
    }]
  }];
  var item_list;
  var test_box;
  var text;
  export default {
    components: { Function},
    mounted: function () {
      var _super = this;
      text = $(".selectBox input");

      var inputStream = Rx.Observable.fromEvent(text[0], 'keyup').debounce(500).pluck('target', 'value').subscribe(data => _super.search(data)); // 接收数据
      window.Bus.$watch('gridSelected', function (newValue, oldValue) {
        this.select_object = newValue;
        this.refesh();
      }.bind(this));
      test_box = $(".mid");
      this.function_container =$(".function_group");
      $Drag.enableDrag(".function_group", ".label");
      this.function_container.delegate(".label", "click", function () {
    
        $(this).parent().find(".content").slideToggle(200);
        _super.function_container.animate({ scrollTop: $(this).offset().top - _super.function_container.offset().top + _super.function_container.scrollTop() }, 200);
      });

    },
    data: function () {
      return {
        grouplist: [],
        select_object: {}
      }
    },
    methods: {
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

        var testLeft = test_box.offset().left;
        var testWidth = parseInt(test_box.css("width"));
        var objLeft = obj.offset().left;
        var objWidth = parseInt(obj.css("width"));

        if (obj.offset().left < (testWidth - objWidth) + testLeft) {
          if (!this.grouplist[g_idx].fn_list[f_idx].fn_tip ) {
            this.grouplist[g_idx].fn_list[f_idx].fn_tip = "松开将添加函数";
            Vue.set(this.grouplist, g_idx, this.grouplist[g_idx]);
          }
        }
        else {
          if (this.grouplist[g_idx].fn_list[f_idx].fn_tip ) {
            this.grouplist[g_idx].fn_list[f_idx].fn_tip = null;
            Vue.set(this.grouplist, g_idx, this.grouplist[g_idx]);
          }

        }

      },
      loading: function () {
        this.function_container.css("background-image", "url('" + loading_gif + "')");
      },
      hideLoading: function () {
        this.function_container.css("background-image", "");
      },
      render: function () {
        var _super = this;
        Vue.nextTick(function () {

          item_list ? item_list.unbind() : false;
          item_list = $(".function_group li");

          item_list.on("change_start", function (e, position) {

          });
          item_list.on("change_end", function (e, real_obj) {
            var group_index = real_obj.attr("group_index");
            var fn_index = real_obj.attr("fn_index");
            var isJoin = false;
            if (_super.grouplist[group_index].fn_list[fn_index].fn_tip) {
              _super.$refs.mychild.forEach(function (item, idx) {
                if (item.group_index == group_index && item.fn_index == fn_index) {
                  isJoin = item.join();
                  _super.grouplist[group_index].fn_list[fn_index].fn_tip = null;
                  Vue.set(_super.grouplist, group_index, _super.grouplist[group_index]);
                }
              });
              if (!isJoin) {
                var par = real_obj.parent().find(".content");
                if (!par.is(":visible")) {
                  par.slideToggle(200);
                }
              }
            }
            
          })
          item_list.on("change_positon", function (e, real_obj, top, drag_obj) {
            var group_index = drag_obj.attr("group_index");
            var fn_index = drag_obj.attr("fn_index");
            _super.contactTest(real_obj, group_index, fn_index);

          });

        }.bind(this))
      },
      refesh: function () {

        var _super = this;
        this.grouplist = [];
        this.loading();
        setTimeout(function () {
          data.forEach(function (item, idx) {
            item.fn_list.forEach(function (v, i) {
              v.fn_tip = null;
              v.hidden = false;
              v.strRange = null;
            });
          })
          this.grouplist = data;
          this.render();
          this.hideLoading();
          Vue.nextTick(function () {
            
            this.search(text.val());
          }.bind(this));
        }.bind(this), 1500);
      
      }
    },
    name: "FunctionList"
  }
</script>
