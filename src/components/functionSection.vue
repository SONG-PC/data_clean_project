<template>
  <div class="card">
    <div class="card_list" v-bind:style="{height: parentHeight+'px'}">
      <transition-group name="list-complete" tag="ul" id="control_list">
        <li v-for="(item, index) in op_list" :key="item.data_id" data-type="run" v-bind:data-index="index" class="section list-complete-item" v-bind:style="{top:computedHeight(index)+'px'}">
          <div class="drag" v-bind:data-index="index" v-on:mouseover="showButton($event)" v-on:mouseleave="hideButton($event)">
            <div class="title">
              {{item.fn_label}}
            </div><div class="turn_on_of"></div>
            <div class="button close" v-on:click="deleteOne"></div><div class="button menu" v-on:click="openOption">
            </div><div v-if="index>0" class="button arrow_up" v-on:click="exchangeUp"></div><div v-if="index<op_list.length-1" class="button arrow_down" v-on:click="exchangeDown"></div>
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
      <div class="line" v-bind:style="{top:(itemHeight/2)+'px',height:  lineHeight()}"></div>
    </div>
    <div class="empty" v-if=" op_list.length<=0">无清洗函数,请从右侧列表添加</div>
  </div>

</template>
<style>

  .list-complete-item {
    transition: all .5s;
    display: inline-block;
 
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
  var lockButton = false;
  var item_list = null;
  var dragPositon = null;
  var container;
  var offsetTop;
  export default {
    components: { Option },
    mounted: function () {
      container = $("#control_list");
      offsetTop = parseInt(container.offset().top);
      $Drag.enableDrag("#control_list", ".drag");
    },
    methods: {
      update: function () {

        var _super = this;
        this.op_list = this.c_data.fnlist;
        console.log(this.op_list == this.c_data.fnlist)
        Vue.nextTick(function () {
          this.stuffFilter();
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
               _super.c_data.fnlist= _super.op_list = common.swap_arry(_super.op_list, index, pre);
                real_obj.attr("data-index", pre);
              }
            }
            if (index != after) {
              var pre_obj_break_point = (offsetTop + _super.computedHeight(after)) - dragPositon;
              //如果当前虚拟对象位置小于临界点
              if (top > pre_obj_break_point) {
                _super.c_data.fnlist =  _super.op_list = common.swap_arry(_super.op_list, index, after);
                real_obj.attr("data-index", after);
              }
            }
          });
        }.bind(this));

      },
      deleteOne: function (e) {
        var li = $(e.currentTarget).parent().parent();
        var index = li.attr("data-index");
        this.op_list.splice(index, 1);
        if (this.op_list <= 0) {
          this.c_data.virtual = true;
        }

      },
      exchangeUp: function (e) {
        var li = $(e.currentTarget).parent().parent();
        var index = parseInt(li.attr("data-index"));
        var pre = (index - 1) >= 0 ? index - 1 : index;

        if (index == pre) {
          return
        } else {
         this.c_data.fnlist = this.op_list = common.swap_arry(this.op_list, index, pre);
        }

      },
      exchangeDown: function (e) {
        var li = $(e.currentTarget).parent().parent();
        var index = parseInt(li.attr("data-index"));
        var after = (index + 1) >= this.op_list.length ? index : index + 1;

        if (index == after) {
          return
        } else {
          this.c_data.fnlist =  this.op_list = common.swap_arry(this.op_list, index, after);
        }
      },
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
      reComputeHeight: function () {
        var height = 0;
        item_list = $("#control_list li");

        item_list.each(function (idx, item) {
          this.op_list[idx].height = parseInt($(item).css("height"));
          Vue.set(this.op_list, idx, this.op_list[idx]);
          height += this.op_list[idx].height;
        }.bind(this));
        this.parentHeight = height;
      },
      stuffFilter: function () {
        var $filter = window.Bus.filter;
        var needAni = [];
        var items = $filter ? $filter.find(".item") : [];
        this.op_list.forEach(function (item, idx) {
          if (item.needFilter) {
            if (items.length > 0) {
              items.each(function (index, filter_item) {
                item.filter.push($(filter_item).html());
                needAni.push(idx)
              }.bind(this));
            }
            item.needFilter = false;
          }

        });
        Vue.nextTick(function () {
          needAni.forEach(function (item, idx) {
            this.reComputeHeight();
            this.op_list = this.op_list;
            flip(items, item_list.eq(item).find(".item"));
          }.bind(this))
        }.bind(this));
      },
      shuffle: function () {
        this.op_list = common.swap_arry(this.op_list, 0, 1);
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
          if (index < this.op_list.length - 1) {
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
        parentHeight: 0,
        op_list: []
      }
    },
    props: ['c_data'],
    name: 'App'
  }
</script>
