<template>
  <div class="section_container">
    <div class="section_group">
      <div class="list">
        <!--<div class="tabs active" ><span>任务号</span></div>
      <div class="tabs"><span>项目编号</span></div>
      <div class="tabs"><span>开始时间</span></div>
      <div class="tabs"><span>项目周期</span></div>
      <div class="tabs"><span>结束时间</span></div>-->
        <div v-on:click.capture="changeSeleted(index)" v-for="(item,index) in tabs" v-bind:class="{tabs:true,active: item.isActive, virtual:item.virtual}"><span class="name">{{item.name}}</span><span v-if="item.fnlist.length>0" class="count">{{item.fnlist.length}}个函数</span><span class="delete_btn" v-if=" item.isActive&&tabs.length>1&&!item.virtual" v-on:click.stop="deleteOne(index)"><span class="text">x</span></span></div>
      </div>

    </div>
    <div class="more" v-on:click="togglePanel"><span v-if="!panel_show">...</span><span v-if="panel_show">X</span></div>
    <div style="clear:both"></div>
    <transition name="fade">
      <div v-if="panel_show" class="panel">
        <div class="title">共<span>{{tabs.length}}</span>组操作对象,<span>{{  allTabsCount}}</span>个函数</div>
        <ul style="width:100%">
          <li v-on:click="changeSeleted(idx)" v-for="(obj,idx) in tabs" v-bind:class="{active: obj.isActive}">{{obj.name}} <span> {{obj.fnlist.length}}</span>个函数</li>

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
  var scroll;
  export default {
    mounted: function () {
      scroll=  new NS(".section_group", ".list");
      this.tabs = window.Bus.card;
      var _super = this;
      window.Bus.$watch('card', function (newValue, oldValue) {
        this.tabs = newValue;
        Vue.nextTick(function () {
          scroll.scrollTo(this.getSelectedIndex(),12);
        }.bind(this));
      }.bind(this));
      window.Bus.$watch('gridSelected', function (newValue, oldValue) {

        var hash_data;
          if (newValue.all_col) {
            hash_data = {
              cells: newValue.cells
            }
          }
          else if (newValue.all_row)
          {
            hash_data = {
              all_row: newValue.all_row
            }
          }
          else {
            hash_data = {
              cells: newValue.cells,
              rows: newValue.rows
            }
          }
        var hash = md5(JSON.stringify(hash_data));
        var index=  this.hasChild(hash)
        if (index<0) {
          //删除未操作的虚节点

          this.deleteVirtual();
          //取消所有选中
          this.unSelectAll();
          //创建虚拟节点

          this.tabs.push({
            hash: hash,
            name: newValue.selected_text,
            operator_data:
              {
                all_col: newValue.all_col,
                isAllCol: newValue.all_col ? true : false,
                rows: newValue.rows,
                cells: newValue.cells
              },
            fnlist: [],
            virtual: true,
            isActive: true
          });
          this.changeSeleted(this.tabs.length - 1);
   
        } else {
          if (!this.tabs[index].virtual) {
            this.deleteVirtual();
          }
          this.selectOne(index);
  
        }
  
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
      changeSeleted: function (index) {
        Vue.set(window.Bus, "groupSelected", $.extend(true, {}, this.tabs[index].operator_data));    
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
        //Vue.nextTick(function () {

        //  scroll.scrollTo(index);
        //})
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
        var arry = [];
        this.tabs.forEach(function (item, idx) {
          if (item.isActive ==true) {
            item.virtual = true;
            item.fnlist = [];
            arry.push(item);
          }
        }.bind(this));
        Vue.set(window.Bus, "card", arry);
        this.panel_show = false;
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
