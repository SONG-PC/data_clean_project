<template>
  <div class="right-top">
    <div class="col_info">

      <div class="title">
        <transition name="fade">
          <div v-if="select_object.all_col" class="now_column">{{col}} </div>
          <div v-if="select_object.all_row" class="now_column">{{row}}</div>
          <div v-if="select_object.normal" class="now_column">{{cell}}</div>
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
            <Function v-bind:function_data="child" v-bind:operator_data="select_object" v-bind:operator_name="select_name"/>
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
        select_object: {},
        select_name:""
      }
    },
    computed: {
      col: function () {
        this.select_name = this.select_object.all_col.name;
        return this.select_name;
      },
      row: function () {
        var start = this.select_object.all_row[0] + 1;
        var end = this.select_object.all_row[this.select_object.all_row.length - 1] + 1;
        if (start == end) {
          this.select_name = '第' + start + "行";
        }
        else {
          this.select_name = '第' + start + "行 至 第" + end + "行";
      
        }
        return this.select_name
       
      },
      cell: function () {
     
        var cells_start = this.select_object.cells[0];
        var cells_end = this.select_object.cells[this.select_object.cells.length - 1] ;
        var rows_start = this.select_object.rows[0] ;
        var rows_end = this.select_object.rows[this.select_object.rows.length - 1] ;
        var row_info = '';
        if (rows_start == rows_end) {
          row_info = " 第" + (rows_start+1) + "行";
        }
        else {
          row_info = " 行(" + (rows_start + 1) + "," + (rows_end + 1) + ")";
        }
        if (cells_start == cells_end) {
          var columns = window.Bus["columns"];
          this.select_name =  columns[cells_start].name + row_info
        }
        else {
          this.select_name = '列(' + (cells_start + 1) + ',' + (cells_end + 1) + ')' + row_info;
         
        }
        return this.select_name;
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
