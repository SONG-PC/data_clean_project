<template>
    <div class="card" >
      <div class="card_list" v-bind:style="{height: parentHeight+'px'}">
        <transition-group name="list-complete" tag="ul" id="control_list">
          <li v-for="(item, index) in op_list" :key="item.data_id" data-type="run" v-bind:data-index="index" class="section list-complete-item" v-bind:style="{top:computedHeight(index)+'px'}">
            <div class="drag" v-bind:data-index="index" v-on:mouseover="showButton($event)" v-on:mouseleave="hideButton($event)">
              <div class="title">
                {{item.fn_label}}
              </div><div class="turn_on_of"></div>
              <div class="button close" ></div><div class="button menu" v-on:click="openOption" >
              </div><div class="button arrow_up"></div><div class="button arrow_down"></div>
            </div>
            <div class="filter">
              <div class="item" v-for="(fi, idx) in item.filter" v-html="fi">
              </div>
            </div>
            <div class="option">
              <Option v-bind:option_data="item" />
            </div>
          </li>

        </transition-group>
        <div class="line" v-bind:style="{top:(itemHeight/2)+'px',height:  lineHeight(),transition:'all .5s'}"></div>
      </div>
    </div>

</template>
<style>

  .list-complete-item {
    transition: all .5s;
    display: inline-block;
    margin-right: 10px;
  }

  .list-complete-enter, .list-complete-leave-to
  /* .list-complete-leave-active for below version 2.1.8 */ {
    opacity: 0;
 
  }

 
</style>
<script>
  import Option from './part/option'
  import common from '../assets/js/common.js'
  import $ from 'jquery'
  import '../assets/js/global/global_drag.js'
  import flip from '../assets/js/global/global_flip.js'
  import Vue from 'vue'
  var exzample = [
    {
      data_id: "0",
      fn_lable: '大写转小写',
      filter: []
    }, {
      data_id: "1",
      fn_lable: '小写转大写',
      filter: []
    },
    {
      data_id: "2",
      fn_lable: '提取身份证',
      filter: []
    },
    {
      data_id: "3",
      fn_lable: '获取电话号码',
      filter: []
    },
    {
      data_id: "4",
      fn_lable: '查看经纬度',
      filter: []
    },
    {
      data_id: "5",
      fn_lable: '查看经纬度',
      filter: []
    },
    {
      data_id: "6",
      fn_lable: '查看经纬度',
      filter: []
    },
    {
      data_id: "7",
      fn_lable: '查看经纬度',
      filter: []
    }];
  var lockButton = false;
  var item_list = null;
  var dragPositon = null;
  export default {
    components: { Option },
    mounted: function () {
      this.shrinkage();
      var container = $("#control_list");
      $Drag.enableDrag("#control_list", ".drag");
      window.Bus.$watch('card', function (newValue, oldValue) {
        var _super = this;
        this.op_list = newValue[0].fnlist;
        this.shrinkage();
     
        Vue.nextTick(function () {
          if (window.Bus.filter.length > 0) {
            this.stuffFilter(this.op_list.length - 1, window.Bus.filter);
          }
   
   
          var offsetTop = parseInt(container.offset().top);
          this.itemHeight = parseInt(container.find(".drag:eq(0)").css("height"));
          this.scrollView = $(".card");
          var line = $(".line");
          line.fadeIn(0);
          item_list ? item_list.unbind() : false;
          item_list = $("#control_list li");     
          dragPositon = parseInt(item_list.find(".drag").css("height")) * 0.5;
          this.reComputeHeight();
          var turn_off = item_list.find(".turn_on_of");
       
          item_list.on("change_start", function () {
            line.fadeOut(0);
            turn_off.addClass("off");
            lockButton = true;
          });
          item_list.on("change_end", function () {
            line.fadeIn(0);
            turn_off.removeClass("off");
            lockButton = false;
          })
          item_list.on("change_positon", function (e, real_obj, top, drag_obj) {
            var index = parseInt(real_obj.attr("data-index"));

            drag_obj.parent().addClass("transparent");
            var pre = (index - 1) >= 0 ? index - 1 : index;
            top = _super.scrollView.scrollTop() + top;
            var after = (index + 1) >= _super.op_list.length ? index : index + 1;
            if (index != pre) {
              //前驱对象临界点
              var pre_obj_break_point = (offsetTop + _super.computedHeight(pre)) + dragPositon;
              //后驱对象临界点
              if (top < pre_obj_break_point) {
                _super.op_list = common.swap_arry(_super.op_list, index, pre);
                real_obj.attr("data-index", pre);
                _super.refresh_data();
              }
            }
            if (index != after) {
              var pre_obj_break_point = (offsetTop + _super.computedHeight(after)) - dragPositon;
              //如果当前虚拟对象位置小于临界点
              if (top > pre_obj_break_point) {
                _super.op_list = common.swap_arry(_super.op_list, index, after);
                real_obj.attr("data-index", after);
                _super.refresh_data();
              }
            }
          });
        }.bind(this));

      }.bind(this));



    },
  
    methods: {
      openOption: function (e) {
        var transform = common.getPreFix() + "transform";
        var li = $(e.currentTarget).parent().parent();
        var drag = li.find(".drag");
        var option = li.find(".option");
        var display = option.css("display");
        if (display == "block") {
          option.css(transform, "translateX(-100%)");
          option.css("display", "none");
        }
        else {

          option.css("display", "block"); 
          setTimeout(function () {

            option.css(transform, "translateX(0)");
          }, 360);
        }  
        this.reComputeHeight();     
      },
      shrinkage: function () {

        if (this.op_list.length <= 0) {
          $(".empty").fadeIn(100);
 
         //$(".container").css("padding-left", "310px");
         // console.log("123");
         // $(".left").css(common.getPreFix() + "transform", "translateX(-100%)");
       
        }
        else {
          $(".empty").fadeOut(100);
          //$(".left").css(common.getPreFix() + "transform", "");
          //$(".container").css("padding-left", "");
        }


      },
      reComputeHeight: function () {
        var arry = this.op_list.concat();
        var height = 0;
        item_list = $("#control_list li");

        item_list.each(function (idx, item) {
          arry[idx].height = parseInt($(item).css("height"));
          height += arry[idx].height;
        }.bind(this));
        this.op_list = arry;
        this.parentHeight = height;
      },
      refresh_data: function () {
        window.Bus.card[0].fnlist = this.op_list;
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
        });
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
        parentHeight:0,
        op_list:[]
      }
    },
    name: 'App'
  }
</script>
