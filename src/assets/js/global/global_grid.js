import common from '../common.js'
import right_png from '../../../resourse/right.png'
import quality_bg from '../../../resourse/O7MGO]JY7Y9(J5ANH{{I5(X.png'
import Vue from 'vue'
import $ from 'jquery'
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
    headerRowHeight: 10,
    createPreHeaderPanel: true,
    showPreHeaderPanel: true,
    preHeaderPanelHeight: 0,
    showHeaderRow: true,
    explicitInitialization: true


  };
  var select_all_col = null;
  var allow_fresh = true;
  var s_mode_r = null;
  var s_mode_c = null;
  var headerMenuPlugin = null;
  var draggableGrouping = null;
  my_slick_grid.prototype = {
    _bindEvent: function (grid, columns) {
      grid.onHeaderRowCellRendered.subscribe(function (e, args) {

        $(args.node).empty();
        var a = $("<div style=\"position:absolute\" class=\"guess_bar\"></div>").appendTo(args.node);
        var q = columns[args.index].quality;
        if (columns[args.index].quality) {

          setTimeout((function (ele, idx, quality) {
            return function () {
              ele.css("background-color", "rgb(220, " + parseInt(235 * (quality / 100)) + ", 60)");
              ele.css("width", quality + "%");
              ele.css("font-weight", "300");

              if (quality > 50) {
                ele.html(quality + "%");
              }
            }
          }(a, args.index, q)), 0);
        }

        a.parent().css(
          {
            "background-image": "url('" + quality_bg + "')",
            "background-size": "100% 100%",
            "background-repeat": "repeat",
          }
        );
      });

      grid.onScroll.subscribe(function (e, arg) {
        allow_fresh = false;
        this._selectAllCol(grid, select_all_col);
        allow_fresh = true;

      }.bind(this));
      grid.onHeaderClick.subscribe(function (e, arg) {
        select_all_col = arg.column;
        this._selectAllCol(grid, select_all_col);
      }.bind(this));

      //当选中有变化,更新函数选择器对象.
      grid.onSelectedRowsChanged.subscribe(function (e, arg) {
        if (!allow_fresh) return;
        if (select_all_col) {
          arg.all_col = select_all_col;
        }
        else if (arg.cells[0] == 0) {
          this._selectAllRow(grid, columns, arg.rows);
          arg.all_row = arg.rows;
        }
        else {
          arg.normal = true;
        }
        arg.selected_text = this._convertoText(arg);
        Vue.set(window.Bus, "gridSelected", arg);

      }.bind(this));


      grid.onMouseDown.subscribe(function (e, arg) {
        select_all_col = null;
      });

      grid.onClick.subscribe(function (e, arg) {
        if (columns[arg.cell].isIgonore) {
          grid.setSelectedRows([arg.row]);
        }

      });
      $(window).resize(function () {
        //当浏览器大小变化时
        grid && grid.resizeCanvas();

      });

    },
    _convertoText: function (arg) {
      if (arg.all_col) {
        return arg.all_col.name;
      }
      else if (arg.all_row) {
        var start = arg.all_row[0] + 1;
        var end = arg.all_row[arg.all_row.length - 1] + 1;
        if (start == end) {
          return '第' + start + "行";
        }
        else {
         return '第' + start + "行 至 第" + end + "行";

        }
      }
      else if (arg.normal) {
        var cells_start =arg.cells[0];
        var cells_end = arg.cells[arg.cells.length - 1];
        var rows_start = arg.rows[0];
        var rows_end = arg.rows[arg.rows.length - 1];
        var row_info = '';
        if (rows_start == rows_end) {
          row_info = " 第" + (rows_start + 1) + "行";
        }
        else {
          row_info = " 行(" + (rows_start + 1) + "," + (rows_end + 1) + ")";
        }
        if (cells_start == cells_end) {
          var columns = window.Bus["columns"];
          return columns[cells_start].name + row_info
        }
        else {
          return '列(' + (cells_start + 1) + ',' + (cells_end + 1) + ')' + row_info;

        }
      }
      else {
        return "未知对象"
      }
    },
    _selectAllRow: function (grid, column,rows) {
      grid.setSelectedCells({
        fromCell: 0,
        toCell: column.length-1,
        fromRow: rows[0],
        toRow: rows[rows.length-1]
      });

    },
    _selectAllCol: function (grid, column) {

      if (!column || column.isIgonore) {

        return;
      }
      var inf = grid.getRenderedRange();

      var start = inf.top;
      var end = inf.bottom;
      var colidx = grid.getColumnIndex(column.id);
    
      grid.setSelectedCells({
        fromCell: colidx,
        toCell: colidx,
        fromRow: start,
        toRow: end
      });



    },
    _selectByObj: function (arg) {
      if (arg.all_col) {
        select_all_col = arg.all_col;
        this._selectAllCol(this._grid, select_all_col);
      }
      else {
        select_all_col = null;
        this._grid.setSelectedCells({
          fromCell: arg.cells[0],
          toCell: arg.cells[arg.cells.length - 1],
          fromRow: arg.rows[0],
          toRow: arg.rows[arg.rows.length - 1]
        });

      }
    }
 
  };
  function my_slick_grid(container, data, columns) {
    //列菜单配置
    var _super = this;
    asnyc_load(function () {
    
      s_mode_r = new Slick.RowSelectionModel();
      s_mode_c = new Slick.CellSelectionModel();
      headerMenuPlugin = new Slick.Plugins.HeaderMenu({ autoAlignOffset: false, autoAlignOffset: 100 });
      headerMenuPlugin.onCommand.subscribe(function (e, args) {
        console.log(args);
      });

      draggableGrouping = new Slick.DraggableGrouping();
      options.enableColumnReorder = draggableGrouping.getSetupColumnReorder;
      for (var i = 0; i < columns.length; i++) {
        if (columns[i].isIgonore) {
          continue;
        }
        columns[i].editor = Slick.Editors.Text;
        columns[i].header = {
          menu: {
            items: [
              {

                title: "智能识别",
                //disabled:true,
                command: "sort-asc",
                iconImage: right_png,
                tooltip: "自行选择识别的种类"
              },
              {

                title: "重命名",
                // disabled: !columns[i].sortable,
                //command: ""
              },
              {
                title: "删除列",
                command: "hide",
                //tooltip: "Can't hide this column"
              },
              {
                title: "复制列",
                command: "copy"
              }
            ]
          }
        };
      }

      var grid = new Slick.Grid(container, data, columns, options);
      _super._grid = grid;
      grid.setSelectionModel(s_mode_c);
      grid.registerPlugin(headerMenuPlugin);
      grid.registerPlugin(draggableGrouping);
      _super._bindEvent(grid, columns);
      grid.init();
      select_all_col = columns[1];
      _super._selectAllCol(grid, select_all_col);
     
    });
    
  };
  return    my_slick_grid;
}());
