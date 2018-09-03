(function ($) {
  // register namespace
  $.extend(true, window, {
    "Slick": {
      "CellRangeDecorator": CellRangeDecorator
    }
  });

  /***
   * Displays an overlay on top of a given cell range.
   *
   * TODO:
   * Currently, it blocks mouse events to DOM nodes behind it.
   * Use FF and WebKit-specific "pointer-events" CSS style, or some kind of event forwarding.
   * Could also construct the borders separately using 4 individual DIVs.
   *
   * @param {Grid} grid
   * @param {Object} options
   */
  function CellRangeDecorator(grid, options) {
    var _elem;
    var _defaults = {
      selectionCssClass: 'slick-range-decorator',
      selectionCss: {
        "zIndex": "9999",
        "border": "2px dashed red"
      },
      offset: {
        top: -0,
        left: -0,
        height: -0,
        width: -0
      }
    };

    options = $.extend(true, {}, _defaults, options);


    function show(range) {
      if (!_elem) {
        _elem = $("<div></div>", {css: options.selectionCss})
          .addClass(options.selectionCssClass)
          .css("position", "absolute")
          .appendTo(grid.getCanvasNode());
      }

      var from = grid.getCellNodeBox(range.fromRow, range.fromCell);
      var to = grid.getCellNodeBox(range.toRow, range.toCell);

      _elem.css({
        top: from.top + options.offset.top,
        left: from.left + options.offset.left,
        height: to.bottom - from.top + options.offset.height,
        width: to.right - from.left + options.offset.width
      });

      return _elem;
    }

    function hide() {
      if (_elem) {
        _elem.remove();
        _elem = null;
      }
      
     grid.onRangeRectHide.notify();
    }
    $.extend(grid, {
      "onRangeRectHide": new Slick.Event()
    })
    $.extend(this, {
     
      "show": show,
      "hide": hide
    });
  }
})(jQuery);
