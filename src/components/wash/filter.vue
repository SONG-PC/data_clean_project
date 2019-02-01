<template>
  <div style="position:relative">
    <div class="filter">
      <input id="filter_input" v-model="message" v-on:keyup="input_change($event);key_response($event)" v-on:keydown="input_keydown" placeholder=" 输入一个过滤规则..." type="text" />

    </div>
    <div class="filter_container">
      <div class="filter_content">
        <transition-group name="list" tag="div" class="slider" style="font-size:0">
          <div v-for="(item, index) in filterlist" v-bind:key="index" class="item" data-index="index">
            <div style="display:inline-block" class="txt">{{item.filterNode[0].value}}</div>
            <div style="display:inline-block;margin-left:5px;" class="txt">{{item.filterNode[1].value}}</div>
            <div v-if="i.node.type=='parm'" style="display:inline-block;margin-left:5px;width:50px" v-for="i in item.filterNode" class="parm">
              <input v-on:change="filter_parm_update(i,$event)" type="text" style="width:100%;font-size:10px;text-align:center" v-bind:value="i.value" />
            </div>
            <div v-if="item.child" class="child" v-for="(c,idx) in item.child" >
              <div style="display:inline-block" class="txt">{{c[0].value}}</div>
              <div style="display:inline-block;margin-left:5px;" class="txt">{{c[1].value}}</div>
              <div v-if="c_i.node.type=='parm'" style="display:inline-block;margin-left:5px;width:50px" v-for="c_i in c" class="parm">
                <input v-on:change="filter_parm_update(c_i,$event)" type="text" style="width:100%;font-size:10px;text-align:center" v-bind:value="c_i.value" />
              </div>
              <div class="close" v-on:click="close_filter(index,idx)">
                {{c[1].value}}
              </div>
            </div>
            <div style="clear:both"></div>
            <div class="close" v-on:click="close_filter(index)">
              {{item.filterNode[1].value}}
            </div>
          </div>
        </transition-group>

      </div>
      <div class="clear_all" v-on:click="deleteAll"></div>
    </div>

    <div style="position:absolute;width:100%;overflow:hidden" v-if="tipShow==true" id="input_tip" class="input_tip">
      <ul>
        <li v-on:click="select_item" v-if="item.render_type=='tip'" v-for="(item, index) in tiplist" v-bind:class="{select: item.selected }" v-bind:data-index="index" v-bind:data-value="item.value">
          {{item.value}}  <span class="tip">{{item.tip}}</span>
        </li>
        <li v-on:click="select_item" v-if="item.render_type=='warning'" v-for="(item, index) in tiplist">
          <span class="tip">{{item.tip}}</span>
        </li>
        <li v-on:click="select_item" v-if="item.render_type=='suc'" v-for="(item, index) in tiplist">
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
  import DB from '../../assets/js/global/global_database.js'
  import NS from '../../assets/js/global/global_scoller'
  import Vue from 'vue'
  import layer from 'vue-layer'
  import Input from '../form/input'
  Vue.prototype.$layer = layer(Vue);
import common from '../../assets/js/common.js';
  var count = 0;
  var select = -1;
  var last_valid_cursor = -1;
  var isValid = false;
  var pre_root = null;
  var order_edit = null;
  //节点结构
  function Node(value, next, tip, type, data_type,reg,id) {
    this.next = next;
    this.value = value;
    this.id = id;
    this.reg=reg
    this.tip = tip;
    this.type = type;
    this.data_type = data_type;
  }
  var root = [];
  function _createTree(columns,caller) {
    //根节点 ,列
   
    root = [];
    columns.forEach(function (v) {
      if (!v.primary) {
        var node = new Node(v.name, null, null, "colum", v.data_type_code, null, v.id);
        root.push(node);
        var child = [];
        var type = caller.$store.getters.getDataType(v.data_type_code);
        type.op_code.forEach(function (t) {
          var op = caller.$store.getters.getOpByCode(t);
          var fnNode = new Node(op.sign, null, op.tip, "fn", op.code);
          var lastNode = null;
          for (let i = 0; i < op.param_count; i++) {
            var nowNode = new Node("", null, "请输入第" + (i + 1) + "个" + type.name + "类型参数", "parm", null, new RegExp(type.reg));
            if (i > 0) {
              var douhao = new Node(",", null, "输入逗号结束","split");
              lastNode.next = [douhao];
              douhao.next = [nowNode];
              lastNode = nowNode;
            }
            else {
    
              fnNode.next = [nowNode] 
              lastNode = nowNode;
            }
          }
          child.push(fnNode);
        }) 
        node.next = child;
      }
    });
 
  }

  export default {
    created: function () {
      this.$watch('$store.state.col_metadata.col_data', function (newValue, oldValue) {
       
        _createTree(newValue, this) 

      }.bind(this));

      this.$watch('filterlist', function (newValue, oldValue) {
        
        this.updateFilter();

      }.bind(this));




     

    },
    components: {
      Input
    },
    computed: {


    },
    mounted: function () {

      
      this.input_control = $("#filter_input");
      this.parent = $(".mid");
      this.filter_bar = $(".filter_content");
      this.slider = this.filter_bar.find(".slider");
    
      new NS(".filter_content", ".slider");
 
    },
    methods: {
      filter_parm_update: function (update, e) {
        var update_value = e.currentTarget.value;
        if (update.node.reg.test(update_value)) {
          update.value = update_value;
          this.updateFilter();
        }
        else {
          this.$notify({
            title: "修改错误",
            message:"当前修改内容格式不正确",
            type: "error"
          });
        }
       
      },
      compile: function (v) {
        var filter = {
          type: "value",
          col_id: v[0].node.id,
          op_code:v[1].node.data_type
        };
        var parameters = [];
        v.forEach(function (k) {
 
          if (k.node.type == "parm") {
            parameters.push(k.value)
          }
        });
        filter.parameters = parameters;
        return filter;
      },
      updateFilter: function () {
    
        var filters = [];
        this.filterlist.forEach(function (v) {
          var filter = this.compile(v.filterNode);
          if (v.child && v.child.length > 0) {
            filter.child = [];
            v.child.forEach(function (k) {
              filter.child.push(this.compile(k));
            }.bind(this))
          }
          filters.push(filter);
        }.bind(this));
        this.$store.dispatch("getFilter", {
          data: {
            filters: filters
          }
        });
        this.$store.commit('setFilters', filters)
      },
      guess: function (v, str, cursor, root, total) {
        this.tiplist = [];

        //边界-所有节点命中
        if (!root) {   
          //若命中全部节点-但游标还未走到尾部,那么继续判断后继字符
          if (cursor <= total) {   
            root = pre_root;

          }
          //命中,且不存在后继字符,全部结束
          else {

            this.tiplist = [{ tip: "满足条件的表达式,按回车生效", render_type: "suc", selected: false }];
            isValid = true;
            return;
          }

        }
        //若游标遍历到尾部,还没命中全部节点
        if (cursor > total) {
          if (root instanceof Array) {
            root.forEach(function (v) {

              v.render_type = "tip";
              v.selected = false;
              this.tiplist.push(v);
              count++;
            }.bind(this))

          }
          return;

        }
       //边界结束

      //命中逻辑
        v += str[cursor]; //当前输入字符串
        pre_root = root;//设置上一节点
       
        if (root instanceof Array) {
   
          for (let i = 0; i < root.length; i++) {
            var mz = false;
            if (root[i].reg) {
    
              if (root[i].reg.test(v)) {
             
                mz = true;
                last_valid_cursor = cursor;
                if ((cursor + 1 < str.length) && str[cursor + 1] != ",") {
                  this.guess(v, str, cursor + 1, root, total);
                  if (last_valid_cursor != cursor) {

                    return;
                  }

                }
                
      
              }
            }
            else if (root[i].value == v) {
              mz = true;
              last_valid_cursor = cursor;
             
            }
            if (mz) {
              if (root[i].type != "split") {
                this.hitNode.push({ node: root[i], value: v });
              }
              v = "";         
              root = root[i].next;

              break;
            }

          }
        }

        cursor++;
        this.guess(v, str, cursor, root, total);
      },
      deleteAll: function () {

        this.filterlist = [];
        this.refreshBar();
      
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
        var bottom = parseInt(this.parent.css("padding-bottom"));
        var zl;
        var resize = function () {
          zl = this.slider[0].offsetHeight;
          this.parent.css("padding-bottom", 86 + zl);
          $(document).trigger("resize");
        }.bind(this);
        if (this.filterlist.length > 0) {
          if (!this.sliderShow) {

            this.sliderShow = true;
            this.filter_bar.slideDown(150, function () {
              resize();
            }.bind(this));
          }
          else {
            Vue.nextTick(function () {
              resize();

            }.bind(this))
           
          }
        }
        else {
          if (this.sliderShow)
            this.sliderShow = false;
          this.filter_bar.slideUp(150, function () {
            resize();
          }.bind(this));
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

              this.hitNode[0].child = this.hitNode;
              this.filterlist.push({ filterNode: this.hitNode, child: [] });
              console.log(this.filterlist);
              this.tipShow = false;
              this.message = "";
              this.hitNoe = [];
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
      close_filter: function (index,idx) {
        if (this.lock)
          return;
        this.filterlist.forEach(function (v, i) {
          if (index == i) {
            if (idx>=0) {
              v.child.forEach(function (child, k) {
                if (idx == k) {
                  v.child.splice(idx, 1);                      
                }
              }.bind(this))
            }
            else {
        
              this.filterlist.splice(index, 1);
            
            
            }
          }

        }.bind(this));
  
        this.refreshBar();
      },
      selected: function () {

        for (var i = 0; i < this.tiplist.length; i++) {
          if (i == select) {
            this.tiplist[i].selected = true;
            Vue.set(this.tiplist, i, this.tiplist[i])
  
          }
          else {
            this.tiplist[i].selected = false;
            Vue.set(this.tiplist, i, this.tiplist[i])
          }
        }
      
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
       // str = str.replace(/\s+/g, "");
        if (str.length > 0) {
          this.tipShow = true;      
            this.clearFlag();
          this.selected();
          this.hitNode = [];
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
        filterlist:[],
        message: "",
        tipShow: false,
        sliderShow: false,
        hitNode:[]
     
      }
    },
    name: 'InputFilter'
  };


</script>


