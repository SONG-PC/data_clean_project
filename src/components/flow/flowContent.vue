<template>
  <!--页面内容-->
  <transition name="tabs">
    <div class="flow-container">



   
      <div class="mid">
        <!--<div class="tools">
           <ul style="z-index:1">
             <el-tooltip content="开始运行"  placement="bottom" effect="light">
               <li class="split split_right" style="background-color:yellowgreen">
                 <i class="el-icon-loading"></i>
               </li>
             </el-tooltip>
             <el-tooltip content="执行报告"  placement="bottom" effect="light">
               <li class="split split_right" style="background-color:orange">
                 <el-badge :value="200" :max="99" class="item">
                   <i class="el-icon-edit-outline"></i>
                 </el-badge>
               </li>
               </el-tooltip>
           </ul>
           <el-progress style="position:absolute;right:60px;top:120px;" color="yellowgreen" :width="49" :stroke-width=3  type="circle" :percentage="25"></el-progress>
        </div>-->
        <div>
        </div>


        <div class="graph jtk-demo-canvas canvas-wide flowchart-demo jtk-surface jtk-surface-nopan" id="canvas">

          <div v-if="format" id="show_format" style="border:1px  gray solid;line-height:25px;transition:all 0.3s  ease;position:absolute;width:auto;height:auto;padding:15px 15px 15px 15px;background-color:#fff;border-radius:5px;z-index:999">
            <p class="split" v-if="!f.isExtend" style="color:goldenrod;width:100%;text-align:center" v-for="f in format">{{f.name}}({{ getDataTypeName(f.type_code)}})</p>
            <p class="split" v-if="f.isExtend" style="color:dodgerblue;width:100%;text-align:center" v-for="f in format"><span v-if="!f.name" style='color:gray'>扩展字段-(待配置)</span><span v-if="f.name" style='color:gray'>{{f.name}}({{ getDataTypeName(f.type_code)}})</span></p>
          </div>
          <div v-on:mouseenter="showExcepetion(index,$event)" v-on:mouseleave="hideExcepetion()" v-on:mousedown.stop.prevent="drag($event,p.id)" v-on:mousemove="move($event,p)" v-on:mouseup="de_drag($event)" v-bind:data-index="index" v-if="p" v-on:contextmenu.stop.prevent="showItemMenu(p,$event,index)" v-on:click="showTip(p,$event,index)" v-bind:class="{'edit':p.isEdit,'window':true,'jtk-node':true,'selected':p.isSelect,'real-node':true,'prepared':p.state.status=='prepared','unprepared':p.state.status=='unprepared'}" v-for="(p,index) in  flowEle.node" v-bind:id="p.id" v-bind:style="{'backgroundSize':'40% 40%',left:p.x?p.x+'px':'90px',top:p.y?p.y+'px':'80px',width:p.width?p.width+'px':'72px',height: compute_height(p)+'px'}">
            <div style="width:100%;height:100%;position:absolute;left:0;top:0">
              <i style="width:100%;height:100%;background-size:45px 45px" v-bind:class="[ getAppByid(p.app_id)?getAppByid(p.app_id).img:'']"></i>

            </div>
            <div class="button_menu" v-bind:data-id="p.id">
              <div v-on:click.stop.prevent="create_node(p,pram.id,$event)" v-bind:class="{item:true,show:p.isTip}" v-bind:title="pram.name" v-bind:style="{transform:p.isTip?'rotate('+(60*idx)+'deg)':''}" v-for="(pram,idx) in tip"><i v-bind:class="[pram.img]"></i></div>
            </div>

          </div>
          <div v-if="excepetion&&excepetion.length>0" class="excepetion" style="border:1px rgb(255, 106, 0) solid;position:absolute;top:0;width:auto;box-sizing:border-box;z-index:102;color:darkgrey;background-color:lemonchiffon;border-radius:5px;padding:10px 20px 10px 20px; white-space:nowrap;">
            <div v-for="(ecp,idx) in excepetion" v-bind:style="{'fontSize':'10px','lineHeight':'20px','height':'20px',marginBottom:excepetion[idx+1]?'6px':'0px'}"><i class="error"></i><span style="color:red;margin-left:5px;">异常{{idx+1}}:</span><span style="margin-left:10px">{{ecp.message}}</span></div>
          </div>
          <div v-if="p" v-on:mousedown.stop.prevent="addNode(p.app_id,p.x,p.y,p.source_id)" v-bind:class="{'window':true,'jtk-node':true}" v-for="(p,index) in pre_node" v-bind:id="p.id" v-bind:style="{'backgroundSize':'40% 40%',left:p.x?p.x+'px':'90px',top:p.y?p.y+'px':'90px',width:p.width?p.width+'px':'72px',height: compute_height(p)+'px',opacity:0.5,border:'1px gray dashed'}">
            <div style="width:100%;height:100%;position:absolute;left:0;top:0">
              <i style="width:100%;height:100%;background-size:50px 50px" v-bind:class="[ getAppByid(p.app_id)?getAppByid(p.app_id).img:'']"></i>
            </div>
          </div>
          <drowlist ref="mychild" />
        </div>
      </div>
      <div class="node split_right" v-on:mouseover="format=null" style="height:100%;">
        <div class="title split"><i class="app"></i>我的应用</div>
        <ul>
          <li class="split" v-bind:guid="p.id" v-for="p in flowApp"><i v-bind:class="[p.img]"></i>{{p.name}}</li>
        </ul>
      </div>
      <div class="setting split_left" v-on:mouseover="format=null" style="overflow:hidden">
        <div v-if="show_setting&&setting_node" style="width:100%;height:90%;overflow:auto">
          <div class="setting_module " v-for="p in setting">
            <div class="split" v-on:click="flodSettingModule(p,$event)" style="width:100%;height:45px;box-sizing:border-box; line-height:45px;padding-left:15px;background-color:#FCFCFC;"><i style="height:100%" v-bind:class="{open:p.isOpen,close:!p.isOpen}"></i><span style="padding-left:20px;font-weight:600">{{p.name}}</span></div>
            <div class="split" v-bind:style="{display:p.isOpen?'block':'none'}">
              <parameters v-bind:floor="0" v-on:getFormatFromEndpoint="getFormatFromEndpoint" v-on:addEndpoint="addEndpoint" v-on:deleteEndpoint="deleteEndpoint" v-on:updateEndpoint="updateEndpoint" v-if="p.parameters&&p.parameters.length>0" v-bind:parameters="p.parameters" v-bind:node="setting_node" v-bind:endpoints="setting_endpoints(setting_node.id)" />
            </div>
          </div>

        </div>
        <div class="button_group" v-if="show_setting&&setting_node&&buttons" style="width:100%;height:10%;background-color:snow;">
          <button v-for="p in  buttons" v-on:click="buttonResponse(p)">{{p.name}}</button>
        </div>
      </div>
      <div style="clear:both"></div>

    </div>
    </transition>
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


  import jP from '../../assets/js/global/global_jsplumb'
  import $ from 'jquery'
  import '../../assets/js/global/global_drag.js'
  import html2canvas from 'html2canvas';
  import common from '../../assets/js/common'
  var Mock = require('mockjs');
  import Vue from 'vue'
  import drowlist from '../common/drowlist'
  import range from '../../assets/js/global/global_range'
  var errorHandler = function (caller) {

    return function (message, type, desc) {
      caller.$notify({
        title: desc,
        message: message,
        type: type
      });
    }

  }
  var isDrag = false;
  var originPT = null;
  export default {
    mounted: function () {
      ////绘制背景
      //var a = document.getElementById("bg-canvas"),
      //  b = document.documentElement.clientWidth,
      //  c = document.documentElement.clientHeight;
      //a.width = b,
      //  a.height = c;
      //var d = a.getContext("2d");
      //d.strokeStyle = "#f6f6f6",
      //  d.lineWidth = 1,
      //  d.beginPath(),
      //  d.translate(.5, .5);
      //for (var e = 10; e <= c; e += 10) d.moveTo(0, e),
      //  d.lineTo(b, e);
      //for (var e = 10; e <= b; e += 10) d.moveTo(e, 0),
      //  d.lineTo(e, c);
      //d.closePath(),
      //  d.stroke()
     // 模拟状态数据
      var Jp = this.Jp = new jP("canvas", this);
      this.$store.dispatch("flow");
      this.$store.dispatch("flowApp");
      var _super = this;
      this.$watch('flowEle.node', function (newValue, oldValue) {

        newValue.forEach(function (v) {
          if (v && !v.jsPlumbNode) {
            v.jsPlumbNode = Jp._init(v.id);
          }
        }.bind(this));
      }.bind(this));

      this.$watch('flowEle.endpoints', function (newValue, oldValue) {

        var change_node = [];
        newValue.forEach(function (v) {
          if (!v.jsPlumbNode) {
            var node = this.getNodeById(v.node_id);
            change_node.push(node);
            if (v.isTarget) {
              v.jsPlumbNode = Jp._addEndpointInput(node.jsPlumbNode, v);
            }
            else {
              v.jsPlumbNode = Jp._addEndpointOutput(node.jsPlumbNode, v);
            }
          }
        }.bind(this));
        Array.from(new Set(change_node)).forEach(function (v) {
          Jp.resizeEndPoint(true, v.jsPlumbNode);
          Jp.resizeEndPoint(false, v.jsPlumbNode);
        })
      }.bind(this));
      this.$watch('flowEle.lines', function (newValue, oldValue) {

        newValue.forEach(function (v) {
          if (!v.jsPlumbNode) {
            v.jsPlumbNode = Jp._connection([v.sourceEndpoint.id, v.targetEndpoint.id], v.id, v.format);
          }
        }.bind(this));
      }.bind(this));
      range(".graph", function (rect) {
        console.log("dada")
        var nodeArry = $(".real-node");
        _super.hideTip();
        _super.deleteAllnext();
        _super.hideSetting();
        _super.format = null
        nodeArry.each(function (i, v) {
          if (v) {
            var index = $(v).attr("data-index");
            var postion = { x: parseInt($(v).css("left")), y: parseInt($(v).css("top")), width: parseInt($(v).css("width")), height: parseInt($(v).css("height")) };
            if (common.collide(rect, postion)) {
              _super.flowEle.node[index].isSelect = true;


            }
            else {
              _super.flowEle.node[index].isSelect = false;
            }
          }
        });

      });
      $Drag.enableDrag(".node", "li");

      $(".node").on("change_end", function (e, real_obj, drag_real_obj) {
        var id = real_obj.attr("guid");
        var left = parseInt(drag_real_obj.css("left"));
        var top = parseInt(drag_real_obj.css("top"));
        var leftPosition = left - 200;
        var topPosition = top - 72;
        if (leftPosition > 0 && top - 72 > 0) {
          this.addNode(id, leftPosition, topPosition, null);
        }

      }.bind(this));






    },
    destroyed: function () {

      setTimeout(function () {
        html2canvas($("#canvas")[0], { scale: 2, logging: false, useCORS: true }).then(function (canvas) {
          var dataUrl = canvas.toDataURL();
          window.ExampleImg = dataUrl;
        });
      }, 0)
    },
    updated: function () {

    },
    computed: {
      buttons: function () {

        var button = $.extend(true, [], this.getAppByid(this.setting_node.app_id).buttons);

        button && button.forEach(function (v, i) {

          if (v.need_node_state && !this.setting_node.state.status == 'prepared') {
            button.splice(i, 1);
            i--;
          }
          else {
            v.dependence.forEach(function (k) {
              if (this.setting_node.parameters && !this.setting_node.parameters[k]) {
                button.splice(i, 1);
                i--;
              }

            });
          }

        }.bind(this));
        return button;
      },
      basicType: function () {

        return this.$store.getters.getBaicDataType;
      },
      flowEle: function () {

        return this.$store.state.flowEle;
      },
      flowApp: function () {
        return this.$store.state.flowApp; getOfflineNode
      },
      excepetion: function () {
        if (this.excepetion_index) {
          return this.$store.state.flowEle.node[this.excepetion_index].excepetion;
        }
        else {
          return null;
        }

      },
      setting_node: function () {
        if (this.$store.state.flowEle.node.length > 0) {
          return this.$store.state.flowEle.node[this.setting_index];
        }
        else {
          return null;
        }
      }
    },
    methods: {
      buttonResponse: function (p) {
        if (p.type == "navigation") {
          this.$router.push({ path: '/wash' })
        }
      },
      showExcepetion: function (index, e) {
        var _super = this;
        var target = $(e.target);
        var target_position = target.offset();
        this.excepetion_index = index;
        Vue.nextTick(function () {
          $(".excepetion").css("top", target_position.top - 72 + _super.getScroll().top + 60 + 'px')
          $(".excepetion").css("left", target_position.left - 200 + _super.getScroll().left + parseInt(target.css("width")) + 20 + 'px')
        })
      },
      hideExcepetion: function (index) {

        this.excepetion_index = null;
      },
      flodSettingModule: function (p, e) {
        p.isOpen = !p.isOpen;
        if (p.isOpen) {
          console.log($(e.currentTarget).next());
          $(e.currentTarget).next().slideDown(300);
        }
        else {
          $(e.currentTarget).next().slideUp(300);
        }
      },
      create_node: function (node, app_id, e) {
        if (!node.isTip)
          return;
        this.deleteAllnext();
        var pr = $(e.currentTarget).parent().parent();
        var isInitAdd = this.Source_hasAnyconnectionByNode(node);
        var position = this.computedDefaultPosition(node, parseInt(pr.css("left")), parseInt(pr.css("top")), isInitAdd);
        this.addNode(app_id, position.x, position.y, node.id);
      },
      getDataTypeName: function (code) {
        return this.$store.getters.getTypeNameFromDicByCode(code);
      },
      show_format: function (format, top, left) {
        this.format = format;
        Vue.nextTick(function () {
          $("#show_format").css({ left: left + 'px', top: top + 'px' });

        })
      },
      setting_endpoints: function (node_id) {

        var endpoints = [];

        this.$store.state.flowEle.endpoints.forEach(function (v) {
          if (node_id == v.node_id) {
            endpoints.push(v);
          }

        });
        return endpoints;

      },
      getState: function (id) {
        //根据入口数据和当前节点配置获取本层状态
        // var all_fields = this.getAllSourceFields(id);
        var node = this.getNodeById(id);
        if (node) {

          return node.state;
          //node.inputs = all_fields;
        }


      },

      getFormatFromEndpoint: function (ep_id) {
        return this.$store.getters.getFormatFromEndpoint(ep_id);
      },
      compute_height: function (p) {

        if (p.jsPlumbNode) {
          var count = (p.jsPlumbNode.in_index > p.jsPlumbNode.out_index ? p.jsPlumbNode.in_index : p.jsPlumbNode.out_index) - 1;
          return 72+ count * 25;
        }

      },
      drag: function (e, id) {
        var allow = $("#" + id).hasClass("selected");
        if (allow) {
          isDrag = true;
          originPT = e;
        }
      },
      de_drag: function () {
        isDrag = false;
        originPT = null;
      },
      move: function (e, node) {
        var _super = this;
        if (isDrag) {
          var deltaX = e.clientX - originPT.clientX;
          var deltaY = e.clientY - originPT.clientY;

          var selected = $(".graph .selected");
          selected.each(function (i, v) {
            var v_id = $(v).attr("id");
            if (v_id != node.id) {
              $(v).css({ "left": parseInt($(v).css("left")) + deltaX, "top": parseInt($(v).css("top")) + deltaY });
            }
          });
          this.Jp.instance.repaintEverything();
          originPT = e;
        }
      },
      getScroll: function () {

        return { left: $(".graph").scrollLeft(), top: $(".graph").scrollTop() }
      },
      showTip: function (node, e, index) {
        if (node.isTip)
          return;
        this.deleteAllnext();
        this.showSetting(node, index);
        this.hideTip();
        if (node.state.status != 'prepared')
          return;
        this.format = null;
        if (node.output_count <= 0)
          return;
        this.create_next(node, e, function (next_id) {
          this.tip = [];
          this.flowApp.forEach(function (v) {
            if (next_id != v.id)
              this.tip.push(v);

          }.bind(this));
          setTimeout(function () {
            node.isTip = true;
          }, 50)
        }.bind(this));

      },
      nodeHasSourceConnection(node) {
        var endpoints = node.jsPlumbNode.endpoints;
        var rtn = false;
        for (let i = 0; i < endpoints.length; i++) {
          if (endpoints[i].isSource && endpoints[i].connections.length > 0) {
            rtn = true;
            break;
          }
        }
        return rtn;
      },
      getANoConnectionSourceEndpoint(node) {
        var endpoints = node.jsPlumbNode.endpoints;
        var rtn = false;
        for (let i = 0; i < endpoints.length; i++) {
          if (endpoints[i].isSource && endpoints[i].connections.length <= 0) {
            rtn = endpoints[i];
            break;
          }
        }
        return rtn;
      },
      getANoConnectionTargetEndpoint(node) {
        var endpoints = node.jsPlumbNode.endpoints;

        var rtn = false;
        for (let i = 0; i < endpoints.length; i++) {
          if (endpoints[i].isTarget && endpoints[i].connections.length <= 0) {
            rtn = endpoints[i];
            break;
          }
        }
        return rtn;
      },
      deleteAllnext: function () {

        this.pre_node.forEach(function (v, i) {
          if (v) {
            this.Jp.instance.removeAllEndpoints(v.id);
            Vue.set(this.pre_node, i, null);
          }
        }.bind(this))

      },
      create_next: function (node, e, callback) {

        var rtn = false;

        if (!this.nodeHasSourceConnection(node) && node.state.status == 'prepared') {

          var pnode = this.getAppByid(node.app_id);

          if (pnode && pnode.next_id) {
            callback(pnode.next_id);
            var next_app = this.getAppByid(pnode.next_id);
            var pre_node = this.getOfflineNode(pnode.next_id);
            pre_node.source_id = node.id;
            var sourceEndpoint = this.getANoConnectionSourceEndpoint(node);
            if (sourceEndpoint && pre_node) {

              var pr = $(e.currentTarget);
              var position = this.computedDefaultPosition(node, parseInt(pr.css("left")), parseInt(pr.css("top")));
              pre_node.x = position.x;
              pre_node.y = position.y;
              pre_node.jsPlumbNode = this.Jp._init(pre_node.id);
              this.pre_node.push(pre_node);
              Vue.nextTick(function () {


                for (let i = 0; i < next_app.input_count; i++) {
                  var ep = {
                    id: 'preview_ep_in' + Mock.Random.id()
                  }
                  this.Jp._addEndpointInput(pre_node.jsPlumbNode, ep);
                }
                this.Jp.resizeEndPoint(true, pre_node.jsPlumbNode);
                this.Jp.resizeEndPoint(false, pre_node.jsPlumbNode);
                setTimeout(function () {
                  var targetEndpoint = this.getANoConnectionTargetEndpoint(pre_node);
                  if (targetEndpoint) {
                    this.Jp._connection([sourceEndpoint.uuid, targetEndpoint.uuid], 'preview_conn' + Mock.Random.id(), null);
                  }
                }.bind(this), 0);

              }.bind(this))


            }
          }
        }
        else {

          callback(null);
        }
      },
      Source_hasAnyconnectionByNode: function (node) {


      },
      hasAnyNoconnectNodeByid: function (id) {

      },
      getAppByid: function (id) {

        var rtn;
        for (let i = 0; i < this.flowApp.length; i++) {

          if (id == this.flowApp[i].id) {
            rtn = this.flowApp[i];
            break;
          }
        }
        return rtn;
      },
      showSetting: function (node, index) {
        $(".flow-container").css({ "padding-right": "360px" });
        $(".setting").css({ "margin-left": "-360px", "right": "-360px", "width": "360px" });
        this.show_setting = true;
        var getSetting = this.getSettingFromApp(node.app_id);
        var mySetting = $.extend(true, [], getSetting);
        mySetting.forEach(function (v) {
          console.log(v);
          // common.resolve_parm(node.parameters, v);
        });

        this.setting = mySetting;

        this.setting_index = index;
        this.flowEle.node.forEach(function (v, i) {
          if (v && v.id == node.id) {
            v.isEdit = true;
          }
          else if (v) {
            v.isEdit = false;
          }
        }.bind(this))

      },

      getSettingFromApp: function (id) {
        var rtn;
        for (let i = 0; i < this.flowApp.length; i++) {
          if (this.flowApp[i].id == id) {
            rtn = this.flowApp[i].setting;
            break;
          }
        }
        return rtn;
      },
      hideSetting: function () {
        $(".flow-container").css({ "padding-right": "0px" });
        $(".setting").css({ "margin-left": "0px", "right": "0px", "width": "0px" });
        this.show_setting = false;
        this.setting = [];
        this.setting_index = null;
        // this.setting_node = null;
        this.flowEle.node.forEach(function (v, i) {
          if (v) {
            v.isEdit = false;
          }
        }.bind(this))

      },
      showItemMenu: function (node, e, index) {
        var _super = this;
        var list = [{
          desc: "配置",
          fn: function () {
            _super.showTip(node, e, index);
          }
        }];
        if (!node.origin) {
          list.push({
            desc: "删除",
            fn: function () {
              _super.deleteNode(node)
            }

          });

        }


        this.$refs.mychild._show({
          list: list,
          top: e.clientY ,
          left: e.clientX - 200 + _super.getScroll().left
        });

      },
      deleteNode: function (node) {
        var _super = this;
        this.$store.dispatch("flowOpRest", {
          data: {
            params: {
              node_id: node.id
            }
          },
          callback: function () {

            _super.Jp.instance.removeAllEndpoints(node.id);
            _super.Jp.instance.repaintEverything();
          },
          onError: errorHandler(_super),
          extraData: { method: "delete", obj: "Node" }

        });

      },
      addEndpoint: function (payload) {
        var _super = this;
        this.$store.dispatch("flowOpRest", {
          data: {
            node_id: payload.node_id,
            is_source: payload.is_source
          },
          onError: errorHandler(_super),
          extraData: { method: "post", obj: "Endpoint" }

        });
      },
      updateEndpoint: function (payload) {
        var _super = this;
        this.$store.dispatch("flowOpRest", {
          data: {

            update_data: payload.update_data
          },
          rollback: payload.rollback,
          onError: errorHandler(_super),
          onSuccess: errorHandler(_super),
          extraData: { method: "put", obj: "Endpoint" }
        });
      },
      deleteEndpoint: function (payload) {

        var _super = this;
        this.$store.dispatch("flowOpRest", {
          data: {
            params: {
              endpoint_id: payload.endpoint.uuid
            }
          },
          callback: function () {
            _super.Jp.instance.deleteEndpoint(payload.endpoint);
            payload.node.jsPlumbNode.endpoints.forEach(function (v, i) {
              if (v.id == payload.endpoint.id) {
                payload.node.jsPlumbNode.endpoints.splice(i, 1);
                if (v.isTarget) {
                  payload.node.jsPlumbNode.in_index -= 1;
                  _super.Jp.resizeEndPoint(false, payload.node.jsPlumbNode);
                }
                else {
                  payload.node.jsPlumbNode.out_index -= 1;
                  _super.Jp.resizeEndPoint(true, payload.node.jsPlumbNode);
                }
              }
            })
          },
          onError: errorHandler(_super),
          extraData: { method: "delete", obj: "Endpoint" }

        });

      },
      addNode: function (app_id, x, y, source_node_id) {
        this.deleteAllnext();
        var _super = this;
        this.$store.dispatch("flowOpRest", {
          data: {
            app_id: app_id,
            x: x,
            y: y,
            source_node_id: source_node_id
          }
          ,
          onError: errorHandler(_super),
          extraData: { method: "post", obj: "Node" }

        });
      },
      addLine: function (target_epid, source_epid) {
        var _super = this;
        this.$store.dispatch("flowOpRest", {
          data: {
            target_epid: target_epid,
            source_epid: source_epid,
          }
          ,
          onError: errorHandler(_super),
          extraData: { method: "post", obj: "Line" }
        });



      },
      deleteLine: function (conn) {
        var _super = this;

        this.$store.dispatch("flowOpRest", {
          data: {
            params: {
              connection_id: conn.connid
            }
          },
          callback: function () {
            _super.Jp.instance.deleteConnection(conn)
          }
          ,
          onError: errorHandler(_super),
          extraData: { method: "delete", obj: "Line" }
        });
      },

      getOfflineNode: function (id) {
        var obj = {};
        this.flowApp.forEach(function (v) {
          if (v.id == id) {
            obj.img = v.img;
            obj.y = v.y;
            obj.width = v.width;
            obj.x = v.x;
            obj.app_id = v.id;
            obj.id = 'preview_' + Mock.Random.id()
          }
        })

        return obj;

      },
      hideTip: function () {
        this.flowEle.node.forEach(function (v) {
          v && (v.isTip = false);
        })
      },
      showConnect: function (node_id) {

        this.flowEle.node.forEach(function (v, idx) {
          if (v) {
            v.jsPlumbNode.endpoints.forEach(function (k, i) {
              if (!k.isSource && k.connections.length == 0 && k.elementId != node_id) {

                $(k.canvas).addClass("pulse");
              }
              else {
                $(k.canvas).removeClass("pulse");
              }

            })
          }


        })

      },
      computedDefaultPosition: function (node, x, y, isInitAdd) {

        var nodeArry = $(".real-node");

        var graphWidth = $(".graph")[0].getBoundingClientRect().width;
        var Xoffset = 120;
        var Yoffset = 120;
        var test_node = { x: x || 81, y: y || 81, width: node.width || 72, height: node.height ||72 };
        var [x_step, y_step] = [test_node.width + Xoffset, test_node.height + Yoffset];
        if (isInitAdd) {
          test_node.x += x_step;
          test_node.y += y_step;
        }
        while (true) {
          var flag = true;
          nodeArry.each(function (i, v) {
            var postion = { x: parseInt($(v).css("left")), y: parseInt($(v).css("top")), width: parseInt($(v).css("width")), height: parseInt($(v).css("height")) };

            if (common.collide(test_node, postion)) {
              flag = false;
            }
          });
          if (flag) {

            break;
          }
          else {

            if (test_node.x + x_step + test_node.width < graphWidth) {

              test_node.x += x_step;
            }
            else {

              test_node.x = 80;
              test_node.y += y_step;

            }

          }
        }
        return test_node;

      },
      hideConnect: function () {
        this.flowEle.node.forEach(function (v, idx) {
          if (v) {
            v.jsPlumbNode.endpoints.forEach(function (k, i) {
              $(k.canvas).removeClass("pulse");
            });
          }
        });

      },
      getNodeById: function (id) {
        var node = null;
        this.flowEle.node.forEach(function (v, idx) {
          if (v && v.id == id) {
            node = v;

          }
        });

        return node;
      }
      ,
      getNodeIndexById: function (id) {
        var index = -1;
        this.flowEle.node.forEach(function (v, idx) {
          if (v && v.id == id) {
            index = idx;

          }
        });

        return index;
      }
    },
    components: {
      drowlist
    },
    destroyed: function () {


    },
    data: function () {
      return {
        setting: [],
        format: null,
        setting_index: null,
        excepetion_index: null,
        show_setting: false,
        pre_node: [],
        tip: [],
        Jp: null
      }
    }
  }

</script>
