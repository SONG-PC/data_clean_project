<template>
  <div class="card">
    <div class="card_list" v-bind:style="{height: parentHeight+'px'}">
      <transition-group name="list-complete" tag="ul" id="control_list">
        <li v-for="(item, index) in op_list" :key="item.data_id" data-type="run" v-bind:data-index="index" class="section list-complete-item" v-bind:style="{top:computedHeight(index)+'px'}">
          <div class="drag" v-bind:data-index="index" v-on:mouseover="showButton($event)" v-on:mouseleave="hideButton($event)">
            <div class="title">
              {{item.fn_label}}<span class="tip">{{item.tip}}</span>
            </div><div v-bind:class="{turn_on_of: true,off:!item.open}" v-on:click="turnOnOff(index)"></div>
            <div class="button close" v-on:click="deleteOne"></div><div class="button menu" v-on:click="openOption">
            </div><div v-if="index>0" class="button arrow_up" v-on:click="exchangeUp"></div><div v-if="index<op_list.length-1" class="button arrow_down" v-on:click="exchangeDown"></div>
          </div>
          <div class="filter">
            <div v-on:click="deleteFilter(index,idx)" class="item" v-for="(fi, idx) in item.filter" v-html="fi">
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
  var offsetPadding = 25;
  var inteval = null;
  var card = null;
  var scrollHeight;
  var line;
  export default {
    components: { Option },
    mounted: function () {
      container = $("#control_list");
      offsetTop = parseInt(container.offset().top);
      $Drag.enableDrag("#control_list", ".drag");
      card = $(".card");
      scrollHeight = parseInt(card.css("height"));
      line = $(".line");
  
    },
    methods: {
     turnOnOff: function (idx) {

       this.op_list.forEach(function (item, index) {
         if (index < idx) {
           item.open = true;
         }
         else if (index > idx) {
           if (!this.op_list[idx].item)
             item.open = false;
         }
         else {
           item.open = !item.open;
         }
       }.bind(this));
      },
      update: function () {
        var _super = this;
        this.op_list = this.c_data.fnlist;
        if (this.op_list.length < 1) {
          this.resetHeight();
          return;
        }
        Vue.nextTick(function () {
          this.stuffFilter();      
          this.scrollView = card;
          this.itemHeight = parseInt(container.find(".drag:eq(0)").css("height"));
          line.fadeIn(0);
          item_list ? item_list.unbind() : false;
          item_list = $("#control_list li");
          dragPositon = parseInt(item_list.find(".drag").css("height")) * 0.5;
          this.reComputeHeight();
          var turn_off = item_list.find(".turn_on_of");

          item_list.on("change_start", function (e,position) {
            line.fadeOut(0);        
            lockButton = true;
            !inteval ? inteval = setInterval(function () {
              if (position.y < offsetTop) {
                var now = card.scrollTop();
                var delta = now > 0 ? ((now - 2)) : 0;
                if (delta > 0) {
                  card.scrollTop(delta);
                }
               
              }
              if (position.y > offsetTop + scrollHeight-86 ) {
                var now = card.scrollTop();
                var delta = now < card[0].scrollHeight ? ((now + 2)) : 0;
                if (delta > 0) {
                  card.scrollTop(delta);
                }
              }
              
            }, 0) : false;
          });
          item_list.on("change_end", function (e, real_obj) {
            var index = parseInt(real_obj.attr("data-index"));
            if (_super.op_list[index].tip) {
              _super.deleteOne(e, index);
            }
            line.fadeIn(0);
            inteval ? clearInterval(inteval) : false, inteval = null;
            lockButton = false;
          })
          item_list.on("change_positon", function (e, real_obj, top, drag_obj) {

          
            var index = parseInt(real_obj.attr("data-index"));
            _super.contactTest(real_obj, index);
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
      contactTest: function (obj,index) {
        if (obj.offset().left > $(".mid").offset().left) {
          if (!this.op_list[index].tip) {
            this.op_list[index].tip = "松开将删除此函数"
            Vue.set(this.op_list, index, this.op_list[index]);
          }
        }
        else {
          if (this.op_list[index].tip) {
            this.op_list[index].tip = null;
            Vue.set(this.op_list, index, this.op_list[index]);
          }
     
        }
       
      },
    
      scrollToBottom: function (cb) {
        var card = $(".card");
        card.animate({
          scrollTop: card[0].scrollHeight
        }, 0, cb);  
      },
      deleteFilter: function (index,idx) {

        this.op_list[index].filter.splice(idx, 1);
        Vue.nextTick(function () {
          this.reComputeHeight();
        }.bind(this))
    
      },
      deleteOne: function (e,idx) {
        var li = $(e.currentTarget).parent().parent();
        var index = idx?idx: li.attr("data-index");
        this.op_list.splice(index, 1);
        if (this.op_list <= 0) {
          this.c_data.virtual = true;
        }
        this.resetHeight();
      },
      resetHeight: function () {
        var height = 0;
        this.op_list.forEach(function (item, idx) {
          height += item.height;

        });

        this.parentHeight = height + offsetPadding;
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

        this.parentHeight = height + offsetPadding ;
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
              });
            }
    
            item.needFilter = false;
          }

        }.bind(this));
        Vue.nextTick(function () {
          if (needAni.length > 0) {
            needAni.forEach(function (item, idx) {
              this.reComputeHeight();

              this.op_list = this.op_list;
              Vue.nextTick(function () {
                this.scrollToBottom(function () {
                  flip(items, item_list.eq(item).find(".item"));
                });
              }.bind(this));

            }.bind(this));
          } else {
            Vue.nextTick(function () {
              this.scrollToBottom();
            }.bind(this));
          }
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

          if ((index + 1) < this.op_list.length&&!this.op_list[index + 1].open)
            return
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
