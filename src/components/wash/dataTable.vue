
<template>
  <!--数据表-->
  <div style="position:relative;width:100%;height:100%;z-index:1;   ">
    
    <div id="myGrid" style="position:relative;background-color: rgb(230,230,230);">

    </div>

    <Menu v-on:rename="rename" v-on:select-one="select_type" v-bind:position_data="position_data" v-bind:menu_data="menu_data"></Menu>
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
  var style = document.createElement('style');
  var isStyle = false;
  style.type = "text/css";
  style.innerHTML = ".slick-cell.selected{background-color:transparent;color:black;}";
  var header= document.getElementsByTagName('HEAD').item(0);
  import Menu from './menu'
  var my_grid;
  import Vuex from 'vuex'
  import md5 from 'js-md5'
  var errorHandler = function (caller) {

    return function (message, type, desc) {
      caller.$notify({
        title: desc,
        message: message,
        type: type
      });
    }

  }
  export default {
    created: function () {
      window.Bus.gridPoint = this;

    },
    components: { Menu },
    data: function () {
      return {
        menu_data: [],
        menu_col:-1,
        position_data: {},
        myGrid:null,
        focus: null,
        now_data_count:0
      }
    },
    methods: {
      getRenderRange: function () {
        var view_range = [];
        var render_range = my_grid&& my_grid._grid.getRenderedRange()
        var start_index = render_range && render_range.top;
        var end_index = render_range && render_range.bottom;
        if (my_grid&&my_grid._data) {
          for (var i = start_index; i <= end_index; i++) {
            view_range.push(my_grid._data[i]["-"]);
          }
        }
        return view_range;
      },
      rename: function (name) {
        var _super = this;
        if (this.menu_col) {
          var op_col = this.menu_col;
          var originName = op_col.name;
          if (originName == name) {

            errorHandler(this)("输入名称与原名一致,系统已阻止更改", "warning", "警告" )
          }
          else {
            this.$store.dispatch("updateCol", {
              data: {
                id: op_col.id,
                name: name
              },
              onError: errorHandler(_super),
              onSuccess: errorHandler(_super)
            });

          }          
        }
      },
      select_type: function (index) {
        var _super = this;
        if (this.menu_col) {
          var op_col = this.menu_col;
          var update_code = op_col.data_type_suggestion[index].code;
          if (op_col.data_type_code == update_code ) {
            errorHandler(this)("修改类型与原类型一致,系统已阻止更改", "warning", "警告")
          }
          else {
            this.$store.dispatch("updateCol", {
              data: {
                id: op_col.id,
                data_type_code: update_code 
              },
              onError: errorHandler(_super),
              onSuccess: errorHandler(_super)
            });

          }

        }

      },
      suggestion: function (change) {
        if (change.length == 0) {
          this.$store.commit("clearSuggestion");
          this.focus = null;
          window.Bus.gridSelected = null;
          return;
        }
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
            col.push(my_grid.columns[v.fromCell].id);
          }
          else if (row.length<=0) {
            for (let i = v.fromRow; i <= v.toRow; i++) {
              row.push(my_grid._data[i]["-"]);
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

        if (hash_o == hash_n) {
          return;
        }
        this.focus = postData;
        this.$store.dispatch("focusSuggestion", {
          data: postData
        });
        Vue.set(window.Bus, "gridSelected", change);
      },
      girdSelect: function () {
        var range = [];
        if (this.focus && this.focus.type == "col") {
   
          this.focus.col_id_range.forEach(function (v, i) {
            var col_index = my_grid._getColIndexByColid(v);
            if (col_index &&col_index>=0) {
              range.push({
                fromCell: col_index ,
                toCell: col_index ,
                fromRow:0,
                toRow: my_grid._data.length - 1
              });

            }
          }.bind(this));

        }
        else if (this.focus && this.focus.type == "row") {
          this.focus.row_id_range.forEach(function (v) {
            for (let i = 0; i < my_grid._data.length; i++) {
              if ((v) == my_grid._data[i]["-"]) {
                range.push({
                  fromCell: 0,
                  toCell: my_grid.columns.length-1,
                  fromRow: i,
                  toRow: i
                });
                break;
              }
            }
          }.bind(this));

        }
        
        if (range.length > 0) {
          this.focus = null;
          console.log(range)
          my_grid._grid.setSelectedCells(range);
     
        }
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
          if (!my_grid ) {

            this.myGrid= my_grid = new grid("#myGrid", data, this.RenderData.col_metadata, this);
          }
          else {
            if (!window.Bus.fnlistPoint.isPreview) {
              this.$store.commit("clearSuggestion");
            }
            window.Bus.gridSelected = null;
            this.col_index = null;
            this.menu_data = [];
            this.myGrid = my_grid = new grid("#myGrid", data, this.RenderData.col_metadata, this, function () {
              
              if (this.$store.state.grid.diff_data.length <= 0) {
                  this.girdSelect();
              }
              else {
                  my_grid && my_grid._grid && my_grid._grid.setZoom(this.RenderData.diff_data);
              }
            }.bind(this));
            
       
          }

          
        }
      }
  
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
      var _super = this;
      $("#myGrid").delegate(".quality_bar", "click", function (e) {
        var isPrimary = $(this).attr("data-primary");

        if (isPrimary=="false") {
          var id = $(this).attr("data-id");
          var value = $(this).attr("data-value");
          var isCtrl =e.ctrlKey;
          var op = _super.$store.getters.getOpBySign("is"); 
          var col = _super.$store.getters.getColByColid(id);
          window.Bus.filterPoint.addFilterForOtherPage(col, op, value, isCtrl);
        }
      })
      //setTimeout(function () {


        this.$watch('RenderData', function (newValue, oldValue) {
 
          if (newValue.col_metadata.col_data && newValue.col_metadata.col_analysis) {
           
            this.render_data()
          }
       
        }.bind(this));
        window.Bus.$watch('colfilter', function (newValue, oldValue) {
  
          this.render_data();

        }.bind(this));  
        //}.bind(this));

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
