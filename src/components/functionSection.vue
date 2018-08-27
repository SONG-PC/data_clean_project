<template>
  <section>
    <transition-group name="flip-list" tag="ul" id="control_list">
      <li v-on:mouseover="showButton($event)" v-on:mouseleave="hideButton($event)" v-for="(item, index) in op_list" :key="item.data_id" data-type="run" v-bind:data-index="index" class="section" v-bind:style="{top:   itemHeight*index+'px'}">
        <div class="title">
          {{item.name}}
        </div><div class="turn_on_of"></div>
        <div class="button close"></div><div class="button menu">
        </div><div class="button arrow_up"></div><div class="button arrow_down"></div>
      </li>
    </transition-group>
    <div class="line" v-bind:style="{top:itemHeight/2+'px',height:  lineHeight}"></div>
  </section>
</template>
<style> 
  .flip-list-move {
    transition: transform .5s ease;
  }
</style>
<script>
  import common from '../assets/js/common.js'
  import $ from 'jquery'
  import '../assets/js/global/global_drag.js'
  function getBreakPoint(obj, state) {
    if (state == "pre")
      return parseInt($(obj).offset().top) + parseInt($(obj).css("height")) * 0.5;
    else
      return parseInt($(obj).offset().top) - parseInt($(obj).css("height")) * 0.5;
  }
  var lockButton = false;
  export default {
    mounted: function () {
      var _super = this;
      var container = $("#control_list");
      var offsetTop = parseInt(container.offset().top);
      this.itemHeight = parseInt(container.find(".section").css("height"));
      var line = $(".line");
      line.fadeIn(0);
      var item_list = $("#control_list li");
      var turn_off = item_list.find(".turn_on_of");
      $Drag.enableDrag("#control_list", "li");
      item_list.on("change_start", function () {
        line.fadeOut(0);
        turn_off.addClass("off");
        lockButton = true;
      });
      item_list.on("change_end", function () {
        line.fadeIn(0);
        turn_off.removeClass("off");
        lockButton =false;
      })
      item_list.on("change_positon", function (e, real_obj, top, drag_obj) {
        var index = parseInt(real_obj.attr("data-index"));
        drag_obj.addClass("transparent");
        var pre = (index - 1) >= 0 ? index - 1 : index;
        var after = (index + 1) >= _super.op_list.length ? index : index + 1;
        if (index != pre) {
          //前驱对象临界点
          var pre_obj_break_point = (offsetTop + _super.itemHeight * pre) + _super.itemHeight * 0.5;
          //后驱对象临界点
          if (top < pre_obj_break_point) { 
            _super.op_list = common.swap_arry(_super.op_list, index, pre);
            real_obj.attr("data-index", pre);
          }
        }
        if (index != after) {
          var pre_obj_break_point = (offsetTop + _super.itemHeight * after) - _super.itemHeight * 0.5;
          //如果当前虚拟对象位置小于临界点
          if (top > pre_obj_break_point) {
            _super.op_list = common.swap_arry(_super.op_list, index, after);
            real_obj.attr("data-index", after);
          }
        }
      });
    },
    methods: {
      shuffle: function () {
       this.op_list = common.swap_arry(this.op_list, 0,1);
      },
      showButton: function (e) {
        if (lockButton) {
          return;
        }
        $(e.currentTarget).find(".button").fadeIn(100);
      },
      hideButton: function (e) {
        $(e.currentTarget).find(".button").fadeOut(100);
      }
    }, computed: {
      lineHeight: function () {
        return this.itemHeight * (this.$data.op_list.length - 1) +'px';
      }
    },
    data: function () {
      return {
        count: 0,
        itemHeight: 0,     
        op_list: [
          {
            data_id:"0",
            name: '大写转小写'
          }, {
            data_id: "1",
            name: '小写转大写'
          },
          {
            data_id: "2",
            name: '提取身份证'
          },
          {
            data_id: "3",
            name: '获取电话号码'
          },
          {
            data_id: "4",
            name: '查看经纬度'
          },
          {
            data_id: "5",
            name: '查看经纬度'
          },
          {
            data_id: "6",
            name: '查看经纬度'
          },
          {
            data_id: "7",
            name: '查看经纬度'
          }]
      }
    },
    name: 'App'
  }
</script>
