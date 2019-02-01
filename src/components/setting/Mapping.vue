<template>
  <div class="setting">
    <div style="margin-bottom:10px;">
      <label style="width:100%">数据源:</label>
      <br />
      <select style="width:400px;margin-bottom:0px;">
        <option selected="selected">sys</option>
      </select>

      <button class="btn normal" v-on:click="create_conn">新建</button>   <button class="btn normal" v-on:click="get_field">选择导入表</button>

    </div>
    <label>映射关系(入口)</label>
    <br />
 
      <div class="mapping" v-bind:style="{height:height+'px'}">

        <div class="line_content">
          <canvas id="draw_line" style="height:100%;width:100%;background-color:aliceblue;border-top: 2px solid rgb(200,200,200);border-bottom: 2px solid rgb(200,200,200);"></canvas>
        </div>

        <ul class="list_view leftside">
          <li   v-bind:data-index="index" v-for="(item,index) in   input_list "  class="item">{{item.key}}--{{item.type}}</li>
        
        </ul>
        <ul class="list_view rightside">
          <li v-bind:data-index="index" v-for="(item,index) in   output_list " class="item">{{item.key}}--{{item.type}}</li>
        </ul>
      </div>
 
    <div style="clear:both"></div>
    <div class="button">
      <button class="btn confirm">导出</button>   <button class="btn test" style="width:76px" v-on:click="auto_relation">自动匹配</button>  <button class="btn cancel" v-on:click="rempve_relation"  >重置</button>
    </div>
  </div>

</template>
<style>
  .mapping, .list_view, .line_content {
    position: relative;
    float:left;
    box-sizing:border-box;
 
  }
  .mapping {
    width: 522px;
    padding:10px 175px 0px 175px;

    overflow: hidden;
    
  }
    .list_view {
      list-style: none;
      border: 2px solid rgb(200,200,200);
      width: 175px;
      height:100%;
    }
  .line_content {
    width: 100%;
    height: 100%;
  }
  .list_view.leftside {
    width: 175px;
    left: -100%;
    margin-left: -175px;
  }
  .list_view.rightside {
    right: -175px;
    margin-left: -175px;
  }
  .list_view .item{
    float:none;
    height:30px;
    line-height:30px;
    padding-left:20px;
        box-sizing:border-box;

  }
</style>
<script>
  import conn from './connSetting.vue'
  import pre_view from '../preview/table'
  import DML from '../helper/DML'
  import Vue from 'vue'
  import layer from 'vue-layer'
  import common from '../../assets/js/common.js'
  import '../../assets/js/global/global_drag.js'
  var item_list;
  var item_list_input;
  var now_index;
  var canvasRect;
  var canvas;
  var ctx;
  var t = 0;
  var inteval = null;
  export default
    {
      mounted: function () {
        
        Vue.nextTick(function () {
            this.boundRect = [];
  
    
          setTimeout(function () {
            $Drag.enableDrag(".list_view.leftside", "li");
      
            item_list = $(".list_view.rightside li");
            item_list_input = $(".list_view.leftside li");
            canvas = document.getElementById('draw_line');
            ctx = canvas.getContext('2d');

            this.recomputedValue();
    
            $(window).resize(function () {
              //当浏览器大小变化时
              this.recomputedValue();
              this.refreshCanvas();
            }.bind(this));
     
       

        
            item_list && item_list.unbind();
            item_list_input.on("change_end", function (e, real_obj) {
              if (now_index > -1) {
                var p = common.ObjectHasV(this.line_relation, now_index);
                if (p) {
                 delete this.line_relation[p];
                }
                this.line_relation[real_obj.attr("data-index")] = now_index;
                this.drawLoop();
               
              }
              item_list.css("background-color", "#fff")
            }.bind(this))
            item_list_input.on("change_positon", function (e, real_obj, top, drag_obj) {
              //边界命中判断

              var x = parseInt(real_obj.offset().left);
              var y = parseInt(real_obj.offset().top);
              var index= now_index= this.checkBoundByPoint({ x: x, y: y });

              if (index > -1) {
                item_list.css("background-color", "#fff")
                item_list.eq(index).css("background-color", "#b6be00");
              }
              else {
                item_list.css("background-color", "#fff")
              }

            }.bind(this));
          }.bind(this), 0)

       return
        


        }.bind(this));
    
      },
      data: function () {
        return {
          canvasWidth :0,
          input_list: [{
            key: "name",
            type:"string"
          },
            {
              key: "age"
              ,
              type: "int"
            },
            {
              key: "email"
              ,
              type: "string"
            },
            {
              key: "sex"
              ,
              type: "string"
            }],
          output_list: [{
            key: "name"
            ,
            type: "varchar(100)"
          },
            {
              key: "age"
              ,
              type: "number"
            },
            {
              key: "email"
              ,
              type: "varchar(100)"
            },
            {
              key: "sex"
              ,
              type: "number"
            }],
          boundRect: [],
          line_relation: {}
        }
      },
      computed: {
        height: function() {
    
          var inheight = this.input_list.length * 30;
          var outheight = this.output_list.length * 30;
          var max = inheight > outheight ? inheight : outheight 
   
          if (max < 300)
            return 300
          else {
            return max
          }
        }

      },
      methods: {
        recomputedValue: function () {
          this.boundRect = [];
          item_list.each(function (k, v) {
            canvasRect = canvas.getBoundingClientRect();
            this.canvasWidth = canvasRect.width;
            canvas.width = canvasRect.width;
            canvas.height = canvasRect.height;
            this.boundRect.push(v.getBoundingClientRect());
          }.bind(this));
        },
        refreshCanvas: function () {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          for (var key in this.line_relation) {

            var start = this.getConnPoint(true, parseInt(key));
            console.log(start);
            var end = this.getConnPoint(false, parseInt(this.line_relation[key]));
            ctx.beginPath();
            ctx.lineWidth = "2.0";
            ctx.strokeStyle = "#b6be00"; // 红色路径
            var real_start = { x: start.x + 0.5, y: start.y + 0.5 };
            var real_end = { x: end.x + 0.5, y: end.y + 0.5 }
            ctx.moveTo(real_start.x, real_start.y);
            var control_point1 = { x: real_end.x * 0.25, y: common.getYPoint(real_start, real_end, real_end.x * 0.25) };
            var control_point2 = {
              x: real_end.x * 0.75, y: common.getYPoint(real_start, real_end, real_end.x * 0.75)
            };
            var center_point = {
              x: real_end.x * 0.5, y: common.getYPoint(real_start, real_end, real_end.x * 0.5)
            };
            var k = common.getK(real_start, real_end);
            control_point1 = common.rotatePoint(center_point, control_point1, 90 * k);
            control_point2 = common.rotatePoint(center_point, control_point2, 90 * k);
            ctx.bezierCurveTo(control_point1.x, control_point1.y, control_point2.x, control_point2.y, real_end.x, real_end.y);
            ctx.stroke();


            ctx.beginPath();
            var tip_point = common.interpolationByBezier(real_start, control_point1, control_point2, real_end, t);
            ctx.arc(tip_point.x, tip_point.y, 2, 0, 2 * Math.PI);

            ctx.stroke();
            ctx.lineTo(real_end.x, real_end.y);


          }
          // ctx.clearRect(0, 0, canvasRect.width, canvasRect.height);


        },
        getConnPoint: function (isInPut, idx) {
          if (isInPut)
            return { x: 0, y: idx * 30 + 15 };
          else {
            return { x: canvas.width, y: idx * 30 + 15 };

          }
        },
        checkBoundByPoint: function (point) {
          var index = -1;

          this.boundRect.forEach(function (v, k) {
            if (point.y > v.top && point.y < (v.top + v.height) && point.x > v.left && point.x < (v.left + v.width)) {
              index = k;
              return;
            }
          });
          return index;
        },

        create_conn: function () {
          var _super = this;
          _super.$layer.iframe({
            content: {
              content: conn, //传递的组件对象
              parent: _super,//当前的vue对象
              data: []//props,

            },

            area: ['888px', '700px'],
            title: "新建数据源"
          });

        },

        get_field: function () {
          var _super = this;
          _super.$layer.iframe({
            content: {
              content: DML, //传递的组件对象
              parent: _super,//当前的vue对象
              data: []//props,

            },

            area: ['500px', '500px'],
            title: "选择导入表"
          });

        },
        auto_relation: function () {
          this.rempve_relation();
          this.input_list.forEach(function (v,k) {

            this.output_list.forEach(function (val, idx) {
              if (v.key == val.key) {
                this.line_relation[k] = idx;

              }
            }.bind(this));

          }.bind(this));
          this.drawLoop();

        },
        rempve_relation: function () {
          this.line_relation = {};
        },
        drawLoop: function () {

          if (!inteval) {
            inteval = setInterval(function () {
              t += 0.006;
              if (t > 1) {
                t = 0;
              }
              this.refreshCanvas();
            }.bind(this), 0)
          }

        }

      },

      destroyed: function () {

        clearTimeout(inteval);
        inteval = null;
      },
      components: { DML, conn }


    }

</script>
