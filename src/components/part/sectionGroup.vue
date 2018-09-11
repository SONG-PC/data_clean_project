<template>
  <div class="section_container">
    <div class="section_group">
      <div class="list">
        <!--<div class="tabs active" ><span>任务号</span></div>
  <div class="tabs"><span>项目编号</span></div>
  <div class="tabs"><span>开始时间</span></div>
  <div class="tabs"><span>项目周期</span></div>
  <div class="tabs"><span>结束时间</span></div>-->
        <div v-on:click="changeSeleted(index)"  v-for="(item,index) in tabs" v-bind:class="{tabs:true,active: item.isActive, virtual:item.virtual}"><span class="name">{{item.name}}</span><span v-if="item.fnlist.length>0" class="count">{{item.fnlist.length}}</span><span class="delete_btn"  v-if=" item.isActive&&tabs.length>1&&!item.virtual" v-on:click="deleteOne(index)"><span class="text" >x</span></span></div>
      </div>

    </div>
    <div class="more">...</div>
    <div style="clear:both"></div>
  </div>
</template>
<script>

  import NS from '../../assets/js/global/global_scoller'
  import md5 from 'js-md5'
  import Vue from 'vue'
  export default {
    mounted: function () {
      new NS(".section_group", ".list");
      this.tabs = window.Bus.card;
      var _super = this;
      window.Bus.$watch('card', function (newValue, oldValue) {
        this.tabs = newValue;
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
      
          this.selectOne(index);
  
        }
  
        }.bind(this));
    },
    data: function(){
      return {
      tabs:[]
      }
    },
    methods: {
      changeSeleted: function (index) {
        Vue.set(window.Bus, "groupSelected", $.extend(true, {}, this.tabs[index].operator_data));    
      },
      deleteOne: function (index) {
        this.tabs.splice(index, 1);
        if (index - 1 < 0) {
          this.changeSeleted(this.tabs.length - 1);
        }
        else {
          this.changeSeleted(index- 1);
        }
   
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
