<template>
  <div>
    <div class="filter">
      <input id="filter_input" v-model="message" v-on:keyup="input_change($event);key_response($event)"  v-on:keydown="input_keydown"   placeholder=" 输入一个过滤规则..." type="text" />

    </div>
    <div  class="filter_content">
        <transition-group name="list" tag="div" class="slider">
          <div v-for="(item, index) in orderlist"  v-bind:key="item.gid"  class="item" data-index="index"><div class="txt">{{item.txt}}</div><div class="close" v-on:click="close_filter(index)">{{item.op}}</div></div>
          </transition-group>
    </div>
    <div style="position:absolute;width:100%;padding-right:6px;" v-if="tipShow==true" id="input_tip" class="input_tip">
      <ul>
        <li v-on:click="select_item" v-if="item.render_type=='tip'" v-for="(item, index) in tiplist" v-bind:class="{select: item.selected }" v-bind:data-index="index" v-bind:data-value="item.value">
          {{item.value}}  <span class="tip">{{item.tip}}</span>
        </li>
        <li  v-on:click="select_item"  v-if="item.render_type=='warning'" v-for="(item, index) in tiplist" >
          <span class="tip">{{item.tip}}</span>
        </li>
        <li  v-on:click="select_item" v-if="item.render_type=='suc'" v-for="(item, index) in tiplist">
          <span class="suc">{{item.tip}}</span>

        </li>
      </ul>
      </div>
  </div>
</template>
<style>
  .list-item {
    display: inline-block;
    margin-right: 10px;

  }

  .list-enter-active, .list-leave-active {
    transition: all .3s;
  }

  .list-enter, .list-leave-to
  /* .list-leave-active for below version 2.1.8 */ {
    opacity: 0;
    transform: translateY(30px);
  }

</style>
<script>
  import DB from '../assets/js/global/global_database.js'
  import NS from '../assets/js/global/global_scoller'
  import Vue from 'vue'
import common from '../assets/js/common.js';
  var count = 0;
  var select = -1;
  var last_valid_cursor = -1;
  var isValid = false;
  var pre_root = null;
  var order_edit = null;
  //节点结构
  function node(value, next, tip, type) {
    this.next = next;
    this.value = value;
    this.tip = tip;
    this.type = type;
  }
  var root = [];
  function _createTree(columns) {
    var child = [];
    var fn = DB.fn;
    for (var i = 0; i < fn.length; i++) {
      var temp = null;
      for (var j = fn[i].parm.length - 1; j >= 0; j--) {

        temp = new node(fn[i].parm[j], temp, fn[i].parm[j].type.input_decs, DB.nodeType.parm);
        if (j > 0) {
          temp = new node(",", temp, "结束");
        }
      }
      child.push(new node(fn[i].view, temp, fn[i].tip, DB.nodeType.fn));
    }
    child.push(new node(",", root, "接着选择一列"));
    for (var i = 0; i < columns.length; i++) {
      if (columns[i].isIgonore) {
        continue;
      }
      root.push(new node(columns[i].name, child, null, DB.nodeType.col))
    }

  }

  export default {
    mounted: function () {
  
      window.Bus.$watch('columns', function (newValue, oldValue) {
        _createTree(newValue);
      });
      this.input_control = $("#filter_input");
      this.parent = $(".mid");
      this.filter_bar = $(".filter_content");
      this.slider = this.filter_bar.find(".slider");
    
      new NS(".filter_content", ".slider");
     
    },
    methods: {
      create_order: function (node, v) {
        //类型存在，表示需要加入命令而不仅仅是为了语法判断
        if (node) {
          if (node.type) {
            var type = node.type;
            order_edit = order_edit || {};
            order_edit[node.type] = order_edit[node.type] || [];
            order_edit[node.type].push(v ? v : node.value);
          }
        }

      },
      guess: function (v, str, cursor, root, total) {

        if (!root) {
          this.tiplist=[];
          this.tiplist = [{ tip: "满足条件的表达式,按回车生效", render_type: "suc" }];
          if (cursor <= total) {
            root = pre_root;
          }
          else {
            isValid = true;
            return;
          }

        }
        if (cursor > total) {
          this.tiplist = [];
          var html = '';
          if (root instanceof Array) {

            for (var k = 0; k < root.length; k++) {
             
              root[k].render_type = "tip";
              this.tiplist.push(root[k]);
              count++;

            }
          }
          else {
            root.render_type = "warning";
            this.tiplist.push(root);
            count++;
          }

          return;
        }
        v += str[cursor];
        pre_root = root;
        if (root instanceof Array) {
          var mz = false;
          for (var i = 0; i < root.length; i++) {
            if (typeof (root[i].value) == "string") {
              if (root[i].value.replace(/\s+/g, "") == v) {
                last_valid_cursor = cursor;
                this.guess(v, str, cursor + 1, root, total);
                if (last_valid_cursor != cursor) {
               
                  return;
                }
                else {
                  this.create_order(root[i], v);
                  v = "";
                  root = root[i].next;
                  break;
                }
              }

            }
            else {
              var result = root[i].value.type.reg.test(v);
              if (result) {
                last_valid_cursor = cursor;
                this.guess(v, str, cursor + 1, root, total);
                if (last_valid_cursor != cursor) {
                  return;
                }
                else {
                  this.create_order(root[i], v);
                  v = "";
                  root = root[i].next;
                  last_valid_cursor = cursor;
                  break;
                }
              }
            }
          }

        }
        else {
          var result = root.value.type.reg.test(v);
          if (result) {
            last_valid_cursor = cursor;
            this.guess(v, str, cursor + 1, root, total);
            if (last_valid_cursor != cursor) {
              return;
            }
            else {
              this.create_order(root, v);
              v = "";
              root = root.next;
              last_valid_cursor = cursor;
            }

          };

        }
        cursor++;
        this.guess(v, str, cursor, root, total);

      },
      clearFlag: function () {
        count = 0;
        select = -1;
        last_valid_cursor = -1;
        isValid = false;
        pre_root = null;
        order_edit = null;
       
      },
      input_keydown: function (e) {
        if (DB.keybordCode.Up == e.keyCode) {
          if (e.preventDefault) {
            e.preventDefault();
            e.stopPropagation();
          }
          else {

            return false;
          }
        }
      },
      refreshBar: function () {
        if (this.orderlist.length > 0) {
          if (!this.sliderShow) {
     
            this.sliderShow = true;
            this.toggleFilterBar();
          }
        }
        else {
          if (this.sliderShow)
            this.sliderShow = false;
            this.toggleFilterBar();
        }
        Vue.nextTick(function () {
          Vue.set(window.Bus, "filter", this.filter_bar.find(".slider"));  
        }.bind(this))
     
      },
      toggleFilterBar: function () {
       
        var bottom = parseInt(this.parent.css("padding-bottom"));

        var zl = parseInt(this.filter_bar.css("height"));
        if (this.sliderShow) {

          this.filter_bar.slideDown(150);
          this.parent.css("padding-bottom", bottom + zl);
          $(document).trigger("resize");
         
        }
        else {
          this.filter_bar.slideUp(150);
          this.parent.css("padding-bottom", bottom - zl);
          $(document).trigger("resize");
        }      
      },
      key_response: function (e) {
        if (this.tipShow) {
          if (e.keyCode == DB.keybordCode.Up) {
            if (count > 0) {
              select > -1 ? --select : -1;
            }
          }
          else if (e.keyCode == DB.keybordCode.Down) {
            if (count > 0) {
              select < count - 1 ? ++select : count - 1;
            }
          }
          else if (e.keyCode == DB.keybordCode.Enter) {
     
            if (isValid) {
              order_edit.txt = this.message;
              order_edit.op = order_edit[DB.nodeType.fn][0];
              order_edit.gid=common.GUID();
              this.orderlist.push(order_edit);
              this.tipShow = false;
              this.message = "";
              this.refreshBar();
        
            }
            else {
           
              this.enter_selected();
            }

          }
        }
        this.selected();
      },
      select_item: function (e) {
        select = $(e.currentTarget).attr("data-index");
        this.enter_selected();
        this.input_control.focus();
      },
      enter_selected: function () {

        if (select > -1) {
          var txt = this.input_control.val().replace(/\s+/g, "");
          var data = this.tiplist[select].value.replace(/\s+/g, "");
          if (data) {
            var newValue = txt.substring(0, last_valid_cursor + 1) + data;
            this.input_control.val(newValue);
            this.message = newValue;
            this.input_change();
          }
        }
      },
      close_filter: function (index) {
        if (this.lock)
          return;
        this.orderlist.splice(index, 1);
        this.refreshBar();
      },
      selected: function () {
        var arry = this.tiplist.concat();
        for (var i = 0; i < this.tiplist.length; i++) {
          if (i == select) {
            this.tiplist[i].selected = true;
  
          }
          else {
            this.tiplist[i].selected = false;
          }
        }
        this.tiplist = arry;   
      },
      input_change: function (e) {
        var str = this.input_control.val();
        var isOp = false;
        if (e) {
          for (var key in DB.keybordCode) {
            if (DB.keybordCode[key] == e.keyCode) {
              isOp = true;
              e.preventDefault();
              return;
            }
         }    
        }
        str = str.replace(/\s+/g, "");
        if (str.length > 0) {
          this.tipShow = true;      
            this.clearFlag();
            this.selected();
            this.guess("", str, 0, root, str.length - 1); 
        }
        else {
          this.tipShow = false;
        }
      }
    },
    data: function () {
      return {
        lock: false,
        tiplist: [],
        orderlist:[],
        message: "",
        tipShow: false,
        sliderShow:false
     
      }
    },
    name: 'InputFilter'
  };


</script>


