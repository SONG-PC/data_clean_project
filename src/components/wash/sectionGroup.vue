<template>
  <div class="section_container">
    <div  v-bind:class="{active:main_state}" v-on:click="open_main" style="width:27%; text-align:center;  height: 25px;line-height:25px;float:left;border-right:1px solid #CFC8C8">操作面板</div>
    <div class="section_group">

      <div class="list">

        <div v-on:click.capture="changeSeleted(index)"  v-for="(item,index) in tabs" v-bind:class="{tabs:true,active: item.isActive, virtual:item.virtual}"><span class="name">{{item.name}}</span><span v-if="item.fnlist.length>0" class="count">{{item.fnlist.length}}个函数</span><span  class="delete_btn" v-if=" item.isActive&&tabs.length>1&&!item.virtual&&false" v-on:click.stop="deleteOne(index)"><span class="text">x</span></span></div>
      </div>

    </div>
    <div class="more" v-on:click="togglePanel"><div v-if="tabs.length>0&&!panel_show" style="position:absolute;min-width:17px;height:17px;padding:2px 5px 2px 5px;border-radius:17px;background-color:red;color:#fff;right:0px;top:4px;line-height:13px">{{tabs.length}}</div><span v-if="!panel_show">...</span><span v-if="panel_show">X</span></div>
    <div style="clear:both"></div>
    <transition name="fade">
      <div v-if="panel_show" class="panel">
        <div class="title">共<span>{{tabs.length}}</span>组操作对象,<span>{{  allTabsCount}}</span>个函数</div>
        <ul style="width:100%">
          <li v-on:click="changeSeleted(idx,true)" v-for="(obj,idx) in tabs" v-bind:class="{active: obj.isActive}">{{obj.name}} <span> {{obj.fnlist.length}}</span>个函数</li>

        </ul>
        <div class="clearfix"></div>
        <div class="clear_all" v-on:click="clear_all">清除全部</div>
      </div>
    </transition>
  </div>
</template>
<style>
  .fade-enter-active, .fade-leave-active {
    transition: all .3s;
    z-index: -1;
  }

  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0.5;
    transform:translateX(-100%);

  }
</style>
<script>

  import NS from '../../assets/js/global/global_scoller'
  import md5 from 'js-md5'
  import Vue from 'vue'
  import layer from 'vue-layer'
  Vue.prototype.$layer = layer(Vue);
  var scroll;
  export default {
    props: ['main_state'],
    mounted: function () {
      scroll=  new NS(".section_group", ".list");
      this.tabs = window.Bus.card_segment;
      console.log(this.tabs);
      var _super = this;
      window.Bus.$watch('card_segment', function (newValue, oldValue) {
       
        this.tabs = newValue;
 
      }.bind(this));

    },
    data: function(){
      return {
        tabs: [],
        panel_show:false
      }
    },
    computed: {
      allTabsCount: function () {
        var count = 0;
        this.tabs.forEach(function (item, idx) {
          count += item.fnlist.length;
        }.bind(this));
        return count;
      }
    },
    methods: {
      open_main: function () {
        this.$emit('open_panel');
        this.unSelectAll();
      },
      togglePanel: function () {
        this.panel_show = !this.panel_show;
      },
      getSelectedIndex: function () {
        var rtn;
        this.tabs.forEach(function (item, idx) {
          if (item.isActive == true) {
            rtn = idx;
          }
        });
        return rtn;
      },
      changeSeleted: function (index,isScroll) {
       
        this.selectOne(index);
        this.$emit('close_panel');
        Vue.nextTick(function () {

          isScroll&& scroll.scrollTo(index, 12);
        }.bind(this));
      },
      deleteOne: function (index) {
        this.tabs.splice(index, 1);
        var change_index;
        if (index - 1 < 0) {
           change_index=this.tabs.length - 1;
        }
        else {
          change_index = index - 1;
    
        }
        this.changeSeleted(change_index );

      },
      scrollToLeft: function () {
        Vue.nextTick(function () {
          scroll.scrollTo(0, 12);
        });
      },
      selectOne: function (index) {

        var obj = this.tabs[index];
        if (obj.isActive) {
          return;
        }
        else {
          this.unSelectAll();
          obj.isActive = true;
        }
        Vue.set(this.tabs, index, obj);

      },
      deleteVirtual: function () {

        this.tabs.forEach(function (item, idx) {

          if (item.virtual) {
            this.tabs.splice(idx, 1);
          }
        }.bind(this));
      
      },
      unSelectAll: function () {
   
        this.tabs.forEach(function (item, idx) {
       
          if (item.isActive) {
            item.isActive = false
            Vue.set(this.tabs, idx, item);
          }
        }.bind(this));

      },
      clear_all: function () {
        var _super = this;
        if (this.tabs.length > 0) {
          _super.$layer.closeAll();
          this.$layer.confirm("是否确定要删除全部操作?", {
       
            shade: true,//是否显示遮罩
         
          }, function () { _super.$emit("clear"); _super.$layer.closeAll(); _super.panel_show = false; }, function () { _super.$layer.closeAll(); });
        }
        else {
          _super.panel_show = false;
        }
      
      },
      hasChild: function (hash) {
        var rtn = -1;
        this.tabs.forEach(function (item, idx) {
          if (item.hash == hash) {
            rtn = idx;
          }
        }.bind(this));
        return rtn;
      }

    },
    name: "sectionGroup"
  }

</script>
