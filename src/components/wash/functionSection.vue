<template>
  <div class="card">
    <div v-if="state&&state.length>0"  v-bind:style="{'border':'1px  gray solid','border-color':state_color,'line-height':'25px;transition:all 0.3s  ease','position':'absolute','width':'auto','height':'auto','padding':'15px 15px 15px 15px','background-color':'#fff','border-radius':'5px','z-index':'999','left':state_x,'top':state_y}">
      <p v-bind:style="{'border-color':state_color,'color':state_color,'width':'100%','text-align':'center','font-size':'12px'}" v-for="f in state">{{f}}</p>
    </div>
    <div class="card_list">
      <transition-group name="list-complete" tag="ul" id="control_list">
        <li v-on:mousemove="editOp(index)" v-for="(item, index) in    my_op_list" :key="item.id" data-type="run" v-bind:data-index="index" class="section list-complete-item" v-bind:style="{top:computedHeight(index)+'px'}">
          <div v-bind:data-index="index" class="drag">
            <div style="position:absolute;left:15px;top:6px;height:100%">
              <el-switch v-model="item.turn" style="zoom:0.8" v-on:change="turn(item.id,item)"
                         active-color="#13ce66"
                         inactive-color="rgb(200,200,200)">
              </el-switch>
            </div>
            <!--<div class="wash_op_state" style="position:absolute;left:76px;top:36px;">
              <div  v-on:mouseleave="hideState()"  v-if="item.exception&&item.exception.length>0" style="display:inline-block">
                <div v-on:mouseover="showState(item.exception,$event)" class="simular_icon error">x</div>
                <span class="count">{{item.exception.length}}</span>
              </div>
              <div  v-on:mouseleave="hideState()" v-if="item.warning&&item.warning.length>0" style="display:inline-block;">
                <div     v-on:mouseover="showState(item.warning,$event)" class="simular_icon warning">!</div>
                <span class="count">{{item.warning.length}}</span>
              </div>

              <div v-on:mouseleave="hideState()"  v-if="item.info&&item.info.length>0" style="display:inline-block;">
                <div  v-on:mouseover="showState(item.info,$event)"  class="simular_icon info">i</div>
                <span class="count">{{item.info.length}}</span>
              </div>
            </div>-->
            <div class="title" style="position:absolute;left:76px;top:6px;width:200px">{{getFnName(item.fn_list_code)}}</div>
            <div style="color:orangered;position:absolute;left:118px;top:20px;width:200px">{{item.tip}}</div>
            <div v-if="item.isEdit" v-on:click.stop="openOption($event)" class="button menu"></div>
            <div v-if="item.isEdit&&index>0" v-on:click.stop="exchangeUp(index)" class="button arrow_up"></div>
            <div v-if="item.isEdit&&index<op_list.length-1" v-on:click.stop="exchangeDown(index)" class="button arrow_down"></div>
            <div v-if="item.isEdit" v-on:click.stop="deleteOp(item.id,$event)" class="button close"></div>
          </div>
          <div v-if="item.filters&&item.filters.length>0" class="filter">
            <div v-for="(filter, idx) in item.filters" v-bind:key="index" class="item" data-index="index">
              <div style="display:inline-block" class="txt">{{$store.getters.getColByColid(filter.col_id).name}}</div>
              <div style="display:inline-block;margin-left:5px;" class="txt">{{$store.getters.getOpByCode(filter.op_code).sign}}</div>
              <div style="display:inline-block;margin-left:5px;width:50px" v-for="i in filter.parameters" class="parm">
                <input disabled="disabled" readonly="readonly" type="text" style="width:100%;font-size:10px;text-align:center" v-bind:value="i" />
              </div>
              <div v-if="filter.child" class="child" v-for="(c,idx2) in filter.child">
                <div style="display:inline-block" class="txt">{{$store.getters.getColByColid(c.col_id).name}}</div>
                <div style="display:inline-block;margin-left:5px;" class="txt">{{$store.getters.getOpByCode(c.op_code).sign}}</div>
                <div style="display:inline-block;margin-left:5px;width:50px" v-for="c_i in c.parameters" class="parm">
                  <input disabled="disabled" readonly="readonly" type="text" style="width:100%;font-size:10px;text-align:center" v-bind:value="c_i" />
                </div>
                <div class="close" v-on:click="closeFilter(index,idx,idx2)">
                  {{$store.getters.getOpByCode(c.op_code).sign}}
                </div>
              </div>
              <div style="clear:both"></div>
              <div class="close" v-on:click="closeFilter(index,idx)">
                {{$store.getters.getOpByCode(filter.op_code).sign}}
              </div>
            </div>
          </div>
          <div class="option" style="display:none;height:auto;padding-bottom:10px">
            <FnParameters v-bind:op="item" v-on:updateOp="updateOp" v-bind:floor="0" v-bind:parameters="settings[index]" />
          </div>
        </li>
      </transition-group>
    </div>
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

  import common from '../../assets/js/common.js'
  import $ from 'jquery'
  import '../../assets/js/global/global_drag.js'

  import Vue from 'vue'

  import layer from 'vue-layer'
  Vue.prototype.$layer = layer(Vue);
  var lockButton = false;
  var item_list = null;
  var dragPositon = null;
  var container;
  var offsetTop;
  var offsetPadding = 25;
  var inteval = null;
  var card = null;
  var isChange = false;
  var scrollHeight;
  var line;
  var inteval;//定时器
  var rollback = null;
  export default {
    components: { Option },
    mounted: function () {
      var _super = this;
      container = $("#control_list");
      offsetTop = parseInt(container.offset().top);
      card = $(".card");
      scrollHeight = parseInt(card.css("height"));
      line = $(".line");

      setTimeout(function () {
        this.reComputeHeight();
        $Drag.enableDrag("#control_list", ".drag");
        //拖拽开始 
        $("#control_list").delegate("li", "change_start", function (e, position) {
          rollback = $.extend(true, [], this.my_op_list);
          lockButton = true;
          !inteval ? inteval = setInterval(function () {
            if (position.y < offsetTop) {
              var now = card.scrollTop();
              var delta = now > 0 ? ((now - 2)) : 0;
              if (delta > 0) {
                card.scrollTop(delta);
              }

            }
            if (position.y > offsetTop + scrollHeight - 86) {
              var now = card.scrollTop();
              var delta = now < card[0].scrollHeight ? ((now + 2)) : 0;
              if (delta > 0) {
                card.scrollTop(delta);
              }
            }

          }, 0) : false;
        }.bind(this));
        //拖拽结束
        $("#control_list").delegate("li", "change_end", function (drag_obj, real_obj,e) {
         // this.editOp(-1);
        
          inteval ? (clearInterval(inteval), inteval = null) : false;
          var index = parseInt(real_obj.attr("data-index"));
          if (_super.my_op_list[index] && _super.my_op_list[index].tip) {
            _super.deleteOp(_super.my_op_list[index].id, e, real_obj,);
          }
          var pre_index = (index -1< 0 ? index : index - 1);
          if (isChange) {
            var postData = {
              current_op_id: this.my_op_list[index].id,
              previous_op_id: this.my_op_list[pre_index].id,
              type: "swap"
            }

            _super.changePosition(postData);
            isChange = false;
          }

        }.bind(this));
        //拖拽中
        $("#control_list").delegate("li","change_positon", function (e, real_obj, top, drag_obj) {
 
          var index = parseInt(real_obj.attr("data-index"));
          drag_obj.parent().addClass("transparent");
          _super.contactTest(real_obj, index);
          var pre = (index - 1) >= 0 ? index - 1 : index;
          top = card.scrollTop() + top;
          var after = (index + 1) >= _super.my_op_list.length ? index : index + 1;
          if (index != pre) {
            //前驱对象临界点
            var pre_obj_break_point = (offsetTop + _super.computedHeight(pre)) + dragPositon;
            //后驱对象临界点
            if (top < pre_obj_break_point) {
           
              _super.my_op_list = common.swap_arry(_super.my_op_list, index, pre);
              _super.settings = common.swap_arry(_super.settings, index, pre);
              real_obj.attr("data-index", pre);
              isChange = true;
            }
          }
          if (index != after) {
       
            var pre_obj_break_point = (offsetTop + _super.computedHeight(after)) - dragPositon;
            //如果当前虚拟对象位置小于临界点
            if (top > pre_obj_break_point) {      
              _super.my_op_list = common.swap_arry(_super.my_op_list, index, after);
              _super.settings = common.swap_arry(_super.settings, index, after);
              isChange = true;
              real_obj.attr("data-index", after);
            }
          }
        });
      }.bind(this), 1000)
      this.$watch('op_list', function (newValue, oldValue) {
        if (newValue.length == 0) {
          $(".wash_container").css("padding-left", "0px")
        }
        else {
          $(".wash_container").css("padding-left", "260px")
        }
        var isInsert = false;
        if (newValue.length >= oldValue.length) {
          isInsert = true;
        }
        var old_op_list = $.extend(true, [], this.my_op_list);
        var my_op_list = $.extend(true, [], newValue);
        old_op_list.forEach(function (v) {
          my_op_list.forEach(function (k,i) {
            if (v.id == k.id) {
              k.height = v.height;
          
            }
          }.bind(this))
        }.bind(this))
        this.my_op_list = my_op_list;
        this.refreshSetting();
        Vue.nextTick(function () {
          if (isInsert) {
            this.reComputeHeight();
            if (newValue.length > oldValue.length) {
              var ele = item_list.eq(newValue.length - 1).find(".item");
              ele.each(function (index, value) {
                value.style["opacity"] = "0";
              }
              );
              setTimeout(function () {
                ele.each(function (index, value) {
                  value.style["opacity"] = "1";
                }
                );
                window.Bus.callback.forEach(function (v) {
                  v(ele);
                })
                window.Bus.callback = [];
              }, 500)
            }
         
          }
        }.bind(this))
      }.bind(this));
    },
    methods: {
      showState: function (state, event) {
        var offset = $(event.currentTarget).offset();
        this.state = state;
        this.state_x = offset.left+'px';
        this.state_y = offset.top - 50 + 'px';
        this.state_color = $(event.currentTarget).css("background-color");
      },
      hideState: function () {
        this.state = [];
      },
      refreshSetting: function () {
        this.settings = [];
        this.op_list.forEach(function (v) {
          var Setting= $.extend(true, [],this.$store.getters.getFunctionList(v.fn_list_code).parameters);
          common.resolve_parm(v.parameters, Setting);
          this.settings.push(Setting);
        }.bind(this));

      },
      getOpIndexById: function (id) {
        var rtn = null;
        for (let i = 0; i < this.my_op_list.length; i++) {
          if (this.my_op_list[i].id == id) {
            rtn = i;
            break;
          }
        }
        return rtn;

      },
      changePosition: function (postData) {
        this.$store.dispatch("cardOp", {
          data: postData
        });
      },
      updateOp: function (payload) {
        var parameters = {};
        common.create_node_parm(parameters, this.settings[this.getOpIndexById(payload.current_op_id)]);
        payload.parameters = parameters;
        this.$store.dispatch("washActionPut", {
          data: {
            updates: [payload]
          }
        });

      },
      closeFilter: function (index, idx, idx_c) {
 
        var updata_fn;
        this.my_op_list.forEach(function (fn_v, fn_index) {
          if (fn_index == index) {
            updata_fn= $.extend(true, {}, fn_v);
            updata_fn.filters.forEach(function (filter_v, filter_i) {
              if (filter_i == idx) {
                if (idx_c>=0) {
                  filter_v.child.forEach(function (child_v, child_i) {
                    if (child_i == idx_c) {
                      filter_v.child.splice(child_i, 1);
                    }

                  })

                }
                else {
                  updata_fn.filters.splice(filter_i, 1);
                }
              }
         
            });
          

          }

        }.bind(this))

        this.updateFilter({
          "current_op_id": updata_fn.id,
          "parameters": updata_fn.parameters,
          "filters": updata_fn.filters
        });

      },
      updateFilter: function (payload) {

        this.$store.dispatch("washActionPut", {
          data: {
            updates: [payload]
          }
        });

      },
      turn: function (current_id, item) {
        var caller = this;
        setTimeout(function () {
          this.$store.dispatch("cardOp", {
            data: {
              "current_op_id": current_id,
              "previous_op_id": null,
              "type": "turn"
            },
            onError: function (message) {
              item.turn = !item.turn;
              caller.$notify({
                title: "执行错误",
                message: message,
                type: "error"
              });
            }
            ,
          });

        }.bind(this), 500)
       
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
      editOp: function (index) {
        this.my_op_list.forEach(function (item, idx) {
          if (index == idx) {
            item.isEdit = true;
          }
          else {
            item.isEdit = false;
          }
        });

      },
      exchangeUp: function (index) {
        var previous_index = index - 2 >= 0 ? index - 2 : index;
        var postData = {
          current_op_id: this.my_op_list[index].id,
          previous_op_id: this.my_op_list[previous_index ].id,
          type:"swap"
        }

        this.changePosition(postData);

      },
      exchangeDown: function (index) {
        var postData = {
          current_op_id: this.my_op_list[index].id,
          previous_op_id: this.my_op_list[index +1].id,
          type: "swap"
        }
        this.changePosition(postData);

      },
      deleteOp: function (id, e, real_obj) {
        //var option;
        //var filter;
        //if (real_obj) {
         
        //   option = real_obj.parent().parent().find(".option");
        //  // filter = real_obj.parent().parent().find(".filter");
      
        //}
        //else {
         
        //   option = $(e.currentTarget).parent().parent().find(".option");
        //   filter = $(e.currentTarget).parent().parent().find(".filter");
        //}

        //option.css("display", "none");
        //filter.css("display", "none");
        this.$store.dispatch("cardOp", {
          data: {
            "current_op_id": id,
            "previous_op_id": null,
            "type": "delete"
          }
        });
       
      },
      reComputeHeight: function () {
        var height = 0;
        item_list = $("#control_list li");
        dragPositon = parseInt(item_list.find(".drag").css("height")) * 0.5;
        this.my_op_list.forEach(function (v, i) {
          v.height = parseInt($(item_list[i]).css("height"));

        }.bind(this))
      },
      computedHeight: function (idx) {
        var top = 0;
     
        this.my_op_list.forEach(function (item, index, arr) {
          if (index < idx) {
            top += item.height+5;
          }
          else {
            return;
          }
        });
        return top;
      },
      getFnName: function (fn_code) {
     
        var result = this.$store.getters.getFunctionList(fn_code);
        return result ? result.label : "";
      },
      contactTest: function (obj, index) {
    
        if (obj.offset().left > $(".mid").offset().left) {
          if (this.my_op_list[index] && !this.my_op_list[index].tip) {
            this.my_op_list[index].tip = "松开将删除此函数"
          }
        }
        else {
          if (this.my_op_list[index] && this.my_op_list[index].tip) {
            this.my_op_list[index].tip = null;     
          }

        }

      }
    },
    computed: {
      op_list: function () {

        var rtn = this.$store.state.operation ? this.$store.state.operation.op_list : [];
        return rtn;
      } 
    },
    data: function () {
      return {
        my_op_list: [],
        settings: [],
        state: [],
        state_x:0,
        state_y: 0,
        state_color: null
      }
    },
    name: 'App'
  }
</script>
