<template>
  <div>
    <div v-bind:id="'mp_'+source_id" class="mapping" v-bind:style="{height:height+'px'}">

      <div class="line_content">
        <canvas  v-bind:id="'draw_line_'+source_id" style="height:100%;width:100%;background-color:aliceblue;border-top: 1px solid rgb(230,230,230);"></canvas>
      </div>

      <ul class="list_view leftside">
        <li v-if="item.name&&!item.disabled" v-bind:title="'当前端口:'+item.name+'('+ getDataTypeName(item.type_code)+')'" style="float: none;height:30px;line-height: 0px;padding-left:0px;text-align:center; width: 100%;line-height:30px;min-height:30px;box-sizing: border-box;" v-bind:data-index="index" v-for="(item,index) in   source " class="item">{{item.name}}</li>
      </ul>
      <ul class="list_view rightside">
        <li v-if="item.name&&!item.disabled" v-bind:title="'映射端口:'+item.name+'('+getDataTypeName(item.type_code)+')'" style="float: none;height:30px;line-height: 0px;padding-left: 0px;text-align:center; width: 100%;line-height:30px;min-height:30px;box-sizing: border-box;" v-bind:data-index="index" v-for="(item,index) in  target " class="item">{{item.name}}</li>
      </ul>
    </div>

    <div style="clear:both"></div>
  </div>

</template>

<script>
  import Vue from 'vue'
  import common from '../../assets/js/common.js'
  import '../../assets/js/global/global_drag.js'
 
  export default
    {
      mounted: function () {

        Vue.nextTick(function () {
            this.boundRect = [];


          setTimeout(function () {
            $Drag.enableDrag("#mp_" + this.source_id + " .list_view.leftside", ".item");

            this.item_list = $("#mp_" + this.source_id + " .list_view.rightside li");
            this.item_list_input = $("#mp_" + this.source_id + " .list_view.leftside");
            this.canvas = document.getElementById('draw_line_' + this.source_id);
            this.ctx = this.canvas.getContext('2d');
            this.drawLoop();
            this.recomputedValue();

            $(window).resize(function () {
              //当浏览器大小变化时
              this.recomputedValue();
          
            }.bind(this));




            this.item_list && this.item_list.unbind();
            this.item_list_input.delegate("li","change_start", function () {
              this.item_list = $("#mp_" + this.source_id + " .list_view.rightside li");
              this.recomputedValue();
            }.bind(this));
            this.item_list_input.delegate("li","change_end", function (e, real_obj) {
              if (this.now_index > -1) {
                var relation = $.extend(true, {}, this.line_relation);
                var p = common.ObjectHasV(this.line_relation, this.now_index);
                if (p) {
                  delete relation [p];
                }
                relation[real_obj.attr("data-index")] = this.now_index;
                this.$emit('update', {
                  relation: relation, endpoint_id: this.source_id, source: this.source, target: this.target, callback: function () {
                  //this.line_relation = relation
                  }.bind(this)
                });
              }
              this.item_list.css("background-color", "#fff")
            }.bind(this))
            this.item_list_input.delegate("li","change_positon", function (e, real_obj, top, drag_obj) {
              //边界命中判断
              var rect = real_obj.offset();
              var x = parseInt(rect.left) + parseInt(real_obj.css("width"));
              var y = parseInt(rect.top) ;
              var index = this.now_index = this.checkBoundByPoint({ x: x, y: y });

              if (index > -1) {
                this.item_list.css("background-color", "#fff")
                this.item_list.eq(index).css("background-color", "#b6be00");
              }
              else {
                this.item_list.css("background-color", "#fff")
              }

            }.bind(this));
          }.bind(this), 0)

       return



        }.bind(this));

      },

      computed: {
        height: function() {

          var inheight = this.source.length * 30;
          var outheight = this.target.length * 30;
          var max = inheight > outheight ? inheight : outheight

          if (max < 300)
            return 300
          else {
            return max
          }
        }

      },
      methods: {
        getDataTypeName: function (code) {
          return this.$store.getters.getTypeNameFromDicByCode(code);
        },
        recomputedValue: function () {
          this.boundRect = [];
          this.item_list.each(function (k, v) {
            this.canvasRect = this.canvas.getBoundingClientRect();
            this.canvasWidth = this.canvasRect.width;
            this.canvas.width = this.canvasRect.width;
            this.canvas.height = this.canvasRect.height;
            this.boundRect.push(v.getBoundingClientRect());
          }.bind(this));
        },
        refreshCanvas: function () {
          this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
          for (var key in this.line_relation) {
            var start = this.getConnPoint(true, parseInt(key));
            var end = this.getConnPoint(false, parseInt(this.line_relation[key]));
            this.ctx.beginPath();
            this.ctx.lineWidth = "1.5";
            this.ctx.strokeStyle = "#b6be00"; // 红色路径
            var real_start = { x: start.x + 0.5, y: start.y + 0.5 };
            var real_end = { x: end.x + 0.5, y: end.y + 0.5 }
            this.ctx.moveTo(real_start.x, real_start.y);
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
            this.ctx.bezierCurveTo(control_point1.x, control_point1.y, control_point2.x, control_point2.y, real_end.x, real_end.y);
            this.ctx.stroke();


            this.ctx.beginPath();
            var tip_point = common.interpolationByBezier(real_start, control_point1, control_point2, real_end, this.t);
            this.ctx.arc(tip_point.x, tip_point.y, 2, 0, 2 * Math.PI);

            this.ctx.stroke();
            this.ctx.lineTo(real_end.x, real_end.y);


          }
          // ctx.clearRect(0, 0, canvasRect.width, canvasRect.height);


        },
        getConnPoint: function (isInPut, idx) {
          if (isInPut)
            return { x: 0, y: idx * 30 + 15 };
          else {
            return { x: this.canvas.width, y: idx * 30 + 15 };

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

        remove_relation: function () {
          this.line_relation = {};
        },
        drawLoop: function () {

          if (!this.inteval) {
            this.inteval = setInterval(function () {
              this.t += 0.006;
              if (this.t > 1) {
                this.t = 0;
              }
              this.refreshCanvas();
            }.bind(this), 0)
          }

        }

      },
      props: ['source', 'target', 'line_relation','source_id'],
      destroyed: function () {

        clearTimeout(this.inteval);
        this.inteval = null;
      },
      data: function () {
        return {
          canvasWidth: 0,
          boundRect: [],
          t: 0,
          item_list:null,
          item_list_input:null,
          now_index:null,
          canvasRect:null,
          canvas:null,
          ctx:null,
          inteval: null
        }
      }
    }

</script>
