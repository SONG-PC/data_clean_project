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

        <input placeholder=" 搜索一个函数开始吧..." type="text" />
      </div>
    </div>
    <div class="function_group">
      <div v-for="(item,index) in  grouplist">
        <div  class="function_group_title">{{item.group_name}}</div>
        <ul class="function suggestion">
          <li v-for="(child,index) in item.fn_list" v-bind:data-name="child.fn_name">
            <Function v-bind:function_data="child" v-bind:operator_data="select_object" v-bind:operator_name="select_object.selected_text"/>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
  import '../assets/js/global/global_drag.js'
  import loading_gif from '../resourse/968f5530a66a4124366500c7de835816.gif'
  import Function from './part/function'

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
  export default {
    components: { Function},
    mounted: function () {
      var _super = this;
      window.Bus.$watch('gridSelected', function (newValue, oldValue) {


        this.select_object = newValue;
        this.refesh();
      }.bind(this));
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
      loading: function () {
        this.function_container.css("background-image", "url('" + loading_gif + "')");
      },
      hideLoading: function () {
        this.function_container.css("background-image", "");
      },
      refesh: function () {

        var _super = this;
        this.grouplist = [];
        this.loading();
        setTimeout(function () {
   
          this.grouplist = data;
          this.hideLoading();
        }.bind(this), 1500);
      
      }
    },
    name: "FunctionList"
  }
</script>
