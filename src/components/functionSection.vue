<template>
    <div class="card">

      <transition-group name="flip-list" tag="ul" id="control_list">
        <li v-for="(item, index) in op_list" :key="item.data_id" data-type="run" v-bind:data-index="index" class="section" v-bind:style="{top:computedHeight(index)+'px'}">
          <div class="drag" v-bind:data-index="index" v-on:mouseover="showButton($event)" v-on:mouseleave="hideButton($event)">
            <div class="title">
              {{item.name}}
            </div><div class="turn_on_of"></div>
            <div class="button close"></div><div class="button menu">
            </div><div class="button arrow_up"></div><div class="button arrow_down"></div>
          </div>
          <div class="filter">
            <div class="item" v-for="(fi, idx) in item.filter" v-html="fi">
            </div>
          </div>
        </li>
      </transition-group>
      <div class="line" v-bind:style="{top:(itemHeight/2+30)+'px',height:  lineHeight()}"></div>
    </div>

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
  import flip from '../assets/js/global/global_flip.js'
  import Vue from 'vue'
  function getBreakPoint(obj, state) {
    if (state == "pre")
      return parseInt($(obj).offset().top) + parseInt($(obj).css("height")) * 0.5;
    else
      return parseInt($(obj).offset().top) - parseInt($(obj).css("height")) * 0.5;
  }
  var lockButton = false;
  var item_list = null;
  export default {
    mounted: function () {
      var _super = this;
      var container = $("#control_list");
      var offsetTop = parseInt(container.offset().top);
      this.itemHeight = parseInt(container.find(".drag:eq(0)").css("height"));
      var line = $(".line");
      line.fadeIn(0);
      item_list = $("#control_list li");
      this.reComputeHeight();
      var turn_off = item_list.find(".turn_on_of");
      $Drag.enableDrag("#control_list", ".drag");
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
        drag_obj.parent().addClass("transparent");
        var pre = (index - 1) >= 0 ? index - 1 : index;
        var after = (index + 1) >= _super.op_list.length ? index : index + 1;
        if (index != pre) {
          //前驱对象临界点
          var pre_obj_break_point = (offsetTop + _super.computedHeight(pre)) + _super.op_list[pre].height * 0.5;
          //后驱对象临界点
          if (top < pre_obj_break_point) { 
            _super.op_list = common.swap_arry(_super.op_list, index, pre);
            real_obj.attr("data-index", pre);
          }
        }
        if (index != after) {
          var pre_obj_break_point = (offsetTop + + _super.computedHeight(after) ) - _super.op_list[after].height * 0.5;
          //如果当前虚拟对象位置小于临界点
          if (top > pre_obj_break_point) {
            _super.op_list = common.swap_arry(_super.op_list, index, after);
            real_obj.attr("data-index", after);
          }
        }
      });
      window.Bus.$watch('filter', function (newValue, oldValue) {
        console.log("rea");
       this.stuffFilter(0, newValue);
      }.bind(this));
    },
    methods: {
      reComputeHeight: function () {
        var arry = this.op_list.concat();
        item_list = $("#control_list li");
        item_list.each(function (idx, item) {
          arry[idx].height = parseInt($(item).css("height"));
        }.bind(this));
        this.op_list = arry;
      },
      stuffFilter: function (index, $filter) {
        var items = $filter.find(".item");
        items.each(function (idx, item) {
          this.op_list[index].filter.push($(item).html());
        }.bind(this));
        Vue.nextTick(function () {
          this.reComputeHeight();
          this.op_list = this.op_list;
          var items = $filter.find(".item");
          flip(items, item_list.eq(index).find(".item"));
        }.bind(this))
      
      },
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
      },
      computedHeight: function (idx) {
        var top = 0;
        this.op_list.forEach(function (item, index, arr) {
          if (index < idx) {
            top += item.height;
          }
          else {
            return;
          }
        })
        return top;
      },
      lineHeight: function () {
        var height = 0;
        this.op_list.forEach(function (item, index, arr) {
          if (index < this.op_list.length-1) {
            height += item.height;
          }

        }.bind(this));
        return height + 'px';
      }
    }, computed: {
     
    },
    data: function () {
      return {
        count: 0,
        itemHeight: 0,     
        op_list: [
          {
            data_id:"0",
            name: '大写转小写',
            filter:[]
          }, {
            data_id: "1",
            name: '小写转大写',
            filter: []
          },
          {
            data_id: "2",
            name: '提取身份证',
            filter: []
          },
          {
            data_id: "3",
            name: '获取电话号码',
            filter: []
          },
          {
            data_id: "4",
            name: '查看经纬度',
            filter: []
          },
          {
            data_id: "5",
            name: '查看经纬度',
            filter: []
          },
          {
            data_id: "6",
            name: '查看经纬度',
            filter: []
          },
          {
            data_id: "7",
            name: '查看经纬度',
            filter: []
          }]
      }
    },
    name: 'App'
  }
</script>
