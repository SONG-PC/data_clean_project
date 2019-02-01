
<template>
  <!--数据表-->
  <div style="position:relative;width:100%;height:100%;z-index:1;">
    <div id="myGrid" style="position:relative">

    </div>
   
    <Menu v-on:select-one="select_type" v-bind:position_data="position_data" v-bind:menu_data="menu_data"></Menu>
  </div>
</template>
<style>
  .slick-header-menu {
   
    background: #fff;
    padding: 5px;

    -moz-box-shadow: 2px 3px 2px rgba(160,255,160,0.35);
    -webkit-box-shadow: 2px 3px 2px rgba(160,255,160,0.35);
    z-index: 99999999;
  }


  .slick-header-menuitem {
    padding: 2px 12px 2px 12px;
   
    border-radius: 3px;

  }

    .slick-header-menuitem:hover {
      border-color: silver;
      background: white;
    }

  .slick-header-menuitem-disabled {
    border-color: transparent !important;
    background: inherit !important;
  }

  /*.icon-help {
    background-image: url(../assets/plugins/SlickGrid-master/images/help.png);
  }*/
</style>
<script>
  import grid from '../../assets/js/global/global_grid'
  import common from '../../assets/js/common.js'
  import Vue from 'vue'
  import Menu from './menu'
  var my_grid;
  import Vuex from 'vuex'
  import md5 from 'js-md5'
  export default {
    components: { Menu },
    data: function () {
      return {
        menu_data: [],
        menu_col:-1,
        position_data: {},
        focus: null,
        now_data_count:0
      }
    },
    methods: {
      suggestion: function (change) {
   
        var row = [];
        var col = [];
        var scope;
        change.forEach(function (v) {
          if (!scope) {
            if (v.toRow - v.fromRow >= this.now_data_count - 1) {
              scope = "col";
            }
            else {
              scope = "row";
            }
          }
          if (scope == "col") {
            col.push(this.RenderData.col_metadata.col_data[v.fromCell].id);
          }
          else if (row.length<=0) {
            for (let i = v.fromRow; i <= v.toRow; i++) {
              row.push(i + 1);
            }
          }
        }.bind(this));
        var postData = {
          type: scope,
          col_id_range: col,  //列编码
          row_id_range: row, //列名
          select_content:""
        }
        var hash_o = md5(JSON.stringify( this.focus || ""));
        var hash_n = md5(JSON.stringify(postData));

        if (hash_o == hash_n)
          return;
        this.focus = postData;
        this.$store.dispatch("focusSuggestion", {
          data: postData
        });
      },
      render_data: function () {
    
        if (this.RenderData) {
          this.RenderData.col_metadata.col_data.forEach(function (v) {
            v.field = v.id;
            v.data_type_name = this.$store.getters.getTypeNameFromDicByCode(v.data_type_code);
          }.bind(this));
          var data = $.extend(true, [], this.RenderData.full_data);
          var view_range_index = 0;
        
          if (this.RenderData.view_range && this.RenderData.view_range.length > 0) {
            for (let i = 0; i < data.length; i++) {
             
              if (data[i]["-"] == this.RenderData.view_range[view_range_index]) {
                view_range_index++;
              }
              else {
                data.splice(i, 1);
                i--;
              }
            }
          }
          this.now_data_count = data.length;
          my_grid = new grid("#myGrid", data, this.RenderData.col_metadata, this);
       
        }
      },
      select_type: function (index) {
        if (this.menu_col > -1) {
          var selectArry = columns[this.menu_col].recognization;
          selectArry.forEach(function (v, idx) {
            if (idx == index) {
              selectArry[idx].selected = true;
              columns[this.menu_col].type = selectArry[idx].type;
              my_grid._grid.setColumns(columns);
            }
            else {
              selectArry[idx].selected = false;
            }
          }.bind(this));


        }
        var selectObj = window.Bus.gridSelected;
        if (selectObj.cells.length > 0) {
          if (selectObj.cells[0] == selectObj.cells[selectObj.cells.length - 1]) {
            //如果是单列或单格则重新刷新函数,因为类型变化
      
               
          }
        }

      },
    }
    ,
    updated: function () {
    },
    computed: {
      RenderData: function () {
        return this.$store.getters.getGridRenderData;
      }
    },
    mounted: function () {
     
   
      setTimeout(function () {


        this.$watch('RenderData', function (newValue, oldValue) {
 
          if (newValue.col_metadata.col_data && newValue.col_metadata.col_analysis) {
            this.render_data()
          }
       
        }.bind(this));
        this.$watch('$store.state.grid.view_range', function (newValue, oldValue) {

          console.log("过滤发生变化");


        }.bind(this));
      }.bind(this), 0)
      //随机生成模拟数据
  
    },
    destroyed: function () {
      my_grid&& my_grid._grid.destroy();
      my_grid &&(my_grid._grid = null);
      my_grid && (my_grid = null);
    },
    name: "Grid"
  }
</script>
