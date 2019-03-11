import common from '../common.js'
import right_png from '../../../resourse/right.png'
import quality_bg from '../../../resourse/O7MGO]JY7Y9(J5ANH{{I5(X.png'
import Vue from 'vue'
import $ from 'jquery'
import DB from '../global/global_database'
import { fail } from 'assert';
import flip from '../global/global_flip.js'
var errorHandler = function (caller) {

  return function (message, type, desc) {
    caller.$notify({
      title: desc,
      message: message,
      type: type
    });
  }

}
export default (function () {
  //异步加载包
  function asnyc_load(cb) {
    require.ensure([], function () {
      /* slick_grid需要的样式 */
      require('../../plugins/SlickGrid-master/slick.grid.css');
      require('../../plugins/SlickGrid-master/css/smoothness/jquery-ui-1.11.3.custom.css');
      require('../../plugins/SlickGrid-master/examples/examples.css');
      require('../../plugins/SlickGrid-master/plugins/slick.headermenu.css');
      require('../../plugins/SlickGrid-master/controls/slick.columnpicker.css');
      /* slick_grid需要的JS */
      require('../../plugins/SlickGrid-master/lib/jquery-ui-1.11.3.min.js');
      require('../../plugins/SlickGrid-master/lib/jquery.event.drag-2.3.0.js');
      require('../../plugins/SlickGrid-master/slick.core.js');
      require('../../plugins/SlickGrid-master/slick.grid.js');
      require('../../plugins/SlickGrid-master/slick.editors.js');
      /* slick_grid 插件库 */
      require('../../plugins/SlickGrid-master/plugins/slick.draggablegrouping.js');
      require('../../plugins/SlickGrid-master/plugins/slick.headermenu.js');
      require('../../plugins/SlickGrid-master/plugins/slick.rowselectionmodel.js');
      require('../../plugins/SlickGrid-master/plugins/slick.cellselectionmodel.js');
      require('../../plugins/SlickGrid-master/plugins/slick.cellrangeselector.js');
      require('../../plugins/SlickGrid-master/plugins/slick.cellrangedecorator.js');
      cb();
    });

  }
  //所有操作,将出发右侧函数
  var options = {
    enableCellNavigation: true,
    enableColumnReorder: false,
    autoEdit: false,
    editable: true,
    showHeaderRow: true,
    headerRowHeight: 7,
    createPreHeaderPanel: true,
    showPreHeaderPanel: true,
    preHeaderPanelHeight: 0,
    showHeaderRow: true,
    explicitInitialization: true


  };
  var select_all_col = null;
  var allow_fresh = true;
  var select_col = [];
  var s_mode_r = null;
  var s_mode_c = null;
  var headerMenuPlugin = null;
  var draggableGrouping = null;
  function compile_data(data, rows) {
    var arry = [];

    rows.forEach(function (v, k) {
     
      arry.push(data[v]["-"]);

    });
    return arry;
  }
  my_slick_grid.prototype = {
    _getColIndexByColid: function (colid) {

      var rtn = null;
      this.columns && this.columns.forEach(
        function (v, i) {
          if (v.id == colid)
            rtn = i;
        });
      return rtn;

    },
    _bindEvent: function (grid, columns,col_analysis,data,father) {
      var _super = this;
      grid.onBeforeCellEditorDestroy.subscribe(function (e,args) {

        console.log(args.grid.getActiveCell());
      })

      grid.onHeaderRowCellRendered.subscribe(function (e, args) {
        var color = [" #b6be00", "#FF7F50", "red"];
        var id = columns[args.index].id;
        var item = "<div data-value=\"{{data_value}}\" data-primary=\"" + columns[args.index].primary + "\"  data-id=\"" + id + "\"  class=\"quality_bar\" style=\"cursor:" + (columns[args.index].primary ? 'cross' : 'pointer') +";display:inline-block;width:{{width}};height:100%;background-color:{{color}}\" title=\"{{title}}\">{{value}}</div>"
        $(args.node).empty();
        var a = $("<div style=\"position:absolute;width:100%;height:100%;font-size:0px;border-right:1px rgb(239,239,239) solid\" class=\"guess_bar\"></div>").appendTo(args.node);
        var value, width, title, tag;
        tag = ["有效", "空值", "非法"];
        if (args.index == 0) {
       
          value = ["", "", ""];
          title = ["有效", "空值", "非法"];
          width = ["33.3%", "33.3%", "33.3%"];
       
          bind();
   
        }
        function bind() {
          for (var i = 0; i < color.length; i++) {
            var html = item;

            html = html.replace("{{color}}", color[i]);
            html = html.replace("{{value}}", value[i]);
            html = html.replace("{{width}}", width[i]);
            html = html.replace("{{title}}", title[i]);
            html = html.replace("{{data_value}}", tag[i]);
            a.append(html)
          }
        }
 
        var quality = col_analysis[id]&& col_analysis[id].quality;    
        if (quality) {



          value = [];
          width = [];
          title = [];
          quality.forEach(function (v) {
            if (v.percent > 50) {
              value.push(v.type);
            }
            else {
              value.push("");
            }
            width.push(v.percent + '%');
            title.push(v.type + '(' + v.count + ')');
          })
          setTimeout((function (ele, idx, quality) {
            return function () {
              bind();
            }
          }(a, args.index, quality)), 0);
        }

        a.parent().css(
          {
  
            "background-size": "100% 100%",
            "background-repeat": "repeat",
          }
        );
      });

      //grid.onScroll.subscribe(function (e, arg) {

      //  allow_fresh = false;
      //  this._selectAllCol(grid, select_all_col);
      //  allow_fresh = true;

      //}.bind(this));
        grid.onHeaderClick.subscribe(function(e, arg) {
      
            if (!arg.column || arg.column.primary || !this._hasCol(arg.column) || father.$store.state.grid.diff_data.length>0) {
        return;
        }
          if (e.ctrlKey) {
            var re = false;
            var row = false;
            for (var i = 0; i < select_col.length; i++) {
              if (select_col[i].primary) {
                row = true;
              }
              if (select_col[i].id == arg.column.id) {
                select_col.splice(i, 1);
                i--;
                re = true;
                break;
              }
            }
            if (!re) {
              if (row) {
                select_col = [arg.column];
              }
              else {
                select_col.push(arg.column);
              }
            }
        }
        else {
          select_col = [arg.column];
        }
        var range = [];
        select_col.forEach(function (v) {
          var colidx = grid.getColumnIndex(v.id);
          range.push({
            fromCell: colidx,
            toCell: colidx,
            fromRow: 0,
            toRow: data.length - 1
          });
        })
        grid.setSelectedCells(range);
      }.bind(this));
   
      grid.onColumnsReordered.subscribe(function (e, arg) {

        var old_index = this._getColIndexByColid(arg.col_id);
        var changeColid;
        arg.reordered_ids.forEach(function (v,i) {
          if (v == arg.col_id) {
 
            if (i > old_index) {
              changeColid = arg.reordered_ids[i - 1];
            }
            else if (i < old_index) {
              changeColid = arg.reordered_ids[i + 1];
            }
          }
        })
        if (changeColid) {
          console.log(changeColid)
        }
        father.$store.dispatch("washAction", {
          data: {
            actions: [{
              fn_code: father.$store.state.dictionary.grid_op_mapping["swap"],
              parameters: {
                scope: "col",
                col_id: arg.col_id,
                col_content: null,
                swap_col_id: changeColid
              },
              filters: father.$store.state.filters
            }]
          },
          onError: function () {
            grid.setColumns(columns);
          },
          onSuccess: function () {
            window.Bus.callback.push(
              function (toEle) {
                if ($(".slider .item").length > 0) {

                  flip($(".slider .item"), toEle);
                }
              }
            )
          }
        });

      }.bind(this));
      //当选中有变化,更新函数选择器对象.
      grid.onSelectedRowsChanged.subscribe(function (e, arg) {
        //father.suggestion(arg);
        //headerMenuPlugin.hideMenu();
        //if (!allow_fresh) return;
        //if (select_all_col) {
        //  arg.all_col = select_all_col;
        //  arg.colId = columns[arg.cells[0]].id;
        //  arg.colName = columns[arg.cells[0]].name;
        //}
        //else if (arg.cells[0] == 0) {
        //  console.log(arg.rows);
        //  arg.all_row = compile_data(_super._data, arg.rows);
        //  arg.colName ="行";
        //}
        //else {
        //  arg.normal = true;      
        //  arg.rows = compile_data(_super._data, arg.rows);
        //  arg.colName = columns[arg.cells[0]].name;
        //}
       
       

      }.bind(this));

      grid.onMouseDown.subscribe(function (e, arg) {
        select_col = [columns[arg.cell]];
      });


      $(window).resize(function () {
        //当浏览器大小变化时
        grid && grid.resizeCanvas();

      });

    },
    _convertoText: function (arg) {
   
    },
    _selectAllRow: function (grid, column,rows) {
      grid.setSelectedCells({
        fromCell: 0,
        toCell: column.length-1,
        fromRow: rows[0],
        toRow: rows[rows.length-1]
      });

    },
    _setCol: function (columns) {
      this.columns = columns;
      this._grid.setColumns(columns);
    },
    _hasCol: function (column) {
      var rtn = false;
      this.columns.forEach(function (v, k) {
     
        if (v.id == column.id) {
          rtn = true;
          return;
        }
      })
      return rtn;
    },
    //_selectAllCol: function (grid, column) {


    //  if (!column || column.primary) {

    //    return;
    //  }
    //  if (!this._hasCol(column))
    //    return;
    //  var inf = grid.getRenderedRange();

    //  var start = inf.top;
    //  var end = inf.bottom;
    //  var colidx = grid.getColumnIndex(column.id);
    //  console.log(colidx);
    //  grid.setSelectedCells({
    //    fromCell: colidx,
    //    toCell: colidx,
    //    fromRow: start,
    //    toRow: end
    //  });



    //},
    _zoomObj: function (arg) {

      this._grid.setZoom(arg);
    }
    ,
    _clearZoom: function () {

      this._grid.clearZoom();
    },
    _refreshMenu: function (newcolumns) {
      this.columns= newcolumns;
      for (var i = 0; i < newcolumns.length; i++) {
        if (newcolumns[i].primary) {
          continue;
        }
        newcolumns[i].editor = Slick.Editors.Text;
        newcolumns[i].header = {
          menu: {
            items: [
              {

                title: "智能识别",
                //disabled:true,
                command: "result",
                iconImage: right_png

              },
              {

                title: "重命名",
                // disabled: !columns[i].sortable,
                command: "rename",
                iconImage: right_png
              },
              {
                title: "删除列",
                command: "delete_col",
                //tooltip: "Can't hide this column"
              }
            ]
          }
        };
      }
    }
  };
  var clear;
  function my_slick_grid(container, data, col_metadata,father,callback) {
    //列菜单配置
    var _super = this;
    var precolumns = $.extend(true, [], col_metadata.col_data);
    var columns = [];
    precolumns.forEach(function (v) {
      var isFilter = false;
      window.Bus.colfilter.forEach(function (k) {
        if (v.id == k) {
          isFilter = true
        }

      });
      if (!isFilter) {
        columns.push(v);
      }
    })

    var Dictionary = father.$store.state.Dictionary;
    var nowCommand;
    clear = function () {
      nowCommand = null;
      father.menu_data = [];
      father.menu_col = -1;
    }
    asnyc_load(function () {
    
      s_mode_c = new Slick.CellSelectionModel();
      s_mode_c.onSelectedRangesChanged.subscribe(function (e, arg) {
        console.log(arg);
        father.suggestion(arg);

      });
      s_mode_c.column = columns;
      s_mode_c.data= data;
      headerMenuPlugin = new Slick.Plugins.HeaderMenu({ autoAlignOffset: false, autoAlignOffset: 150 });
      headerMenuPlugin.onCommand.subscribe(function (e, args) {
        clear();
        if (args.command == "delete_col") {
          father.$store.dispatch("washAction", {
            data: {
              actions: [{
                fn_code: father.$store.state.dictionary.grid_op_mapping["delete"],
                parameters: {
                  scope: "col",
                  col_id: args.column.id,
                  col_content: null
                },
                filters: father.$store.state.filters
              }]
            },
            onError: errorHandler(father)

          });
        }
      });
      headerMenuPlugin.onBeforeMenuShow.subscribe(function (e, args) {
        clear();
      });
      $(document).on("click", function (e) {
        clear();
      });
      headerMenuPlugin.onMouseleave.subscribe(function (e, args) {

        if (father.menu_data.length <=0) {
          headerMenuPlugin.hideMenu();
          father.menu_data =[];
          father.menu_col =null;
        }

      });
      headerMenuPlugin.onMouseover.subscribe(function (e, args) {
        if (args.command == "result" || args.command == "rename") {
          var topOffset = 0;
          if (args.command == "result") {

            father.menu_data = [];
            father.menu_col = columns[ args.index];
            columns[args.index].data_type_suggestion.forEach(function (item, idx) {
              var isSelect = false;
              if (item.code == columns[args.index].data_type_code) {
                isSelect =true;
              }
              else {
                isSelect = false;
              }
              var itemName = father.$store.getters.getTypeNameFromDicByCode(item.code);
              if (!item.isBasic) {

                father.menu_data.push({ content: itemName, seleted: isSelect, probability: item.match_per + "%可能性", highlight: true, type: "field" });
              }
              else {
                father.menu_data.push({ content: itemName, seleted: isSelect, highlight: false, type: "field" });
              }
            });



         
          }
          else if (args.command == "rename") {


            father.menu_data = [];
            father.menu_col = columns[args.index];
            father.menu_data.push({ placeholder: "请输入新列名", type: "input_text" });
            topOffset = 30;
          
          
          }
        }
        else {
          father.menu_data = [];
          father.menu_col = null;

        }
        Vue.nextTick(function () {
          var containerWidth = parseInt($(".wash_container .mid").css("width"));
          var nowLeft = parseInt($(e.currentTarget).parent().css("left"));
          var menuWidth = parseInt($(e.currentTarget).css("width"));
          var itemWidth = parseInt($(".wash_container .mid #menu").css("width"));
          var leftOffset = 0;

          if (nowLeft + itemWidth + menuWidth > containerWidth) {
            leftOffset = itemWidth;
          }
          else {
            leftOffset = -(menuWidth+4);
          }
          father.position_data = { left: (parseInt($(e.currentTarget).parent().css("left")) - leftOffset) + 'px', top: parseInt($(e.currentTarget).parent().css("top")) + topOffset + 'px' }
        }.bind(this))
       
      });
      draggableGrouping = new Slick.DraggableGrouping();
      options.enableColumnReorder = draggableGrouping.getSetupColumnReorder;
      _super._refreshMenu(columns);

      var grid = new Slick.Grid(container, data, columns, options, callback);
      _super._grid = grid;
      _super.columns = columns;
      _super._data=data;
      grid.setSelectionModel(s_mode_c);
      grid.registerPlugin(headerMenuPlugin);
      grid.registerPlugin(draggableGrouping);

      _super._bindEvent(grid, columns, col_metadata.col_analysis, data, father);
      //select_all_col = columns[1];
      //_super._selectAllCol(grid, select_all_col);

      grid.init();

 
     
    });
    
  };
  return    my_slick_grid;
}());
