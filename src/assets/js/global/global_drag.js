/* eslint-disable */
//给元素拖动功能
import common from '../common.js'
(function (window, $) {
  var drag_state = false;
  var drag_obj = null;
  var point = {};
  var positon = {};
  var z_index = 0;
  var drag_real_obj = $("#drag");
  var originPoint = {};
  function release() {

    drag_obj ? (drag_obj.parent().removeClass("transparent"), drag_obj.trigger("change_end")) : false;
    drag_real_obj ? drag_real_obj.css("display", "none") : false;
    positon = {};
    point = {};
    drag_obj = null;
    drag_state = false;
  }

  var $Drag= {
    enableDrag: function (parent, children) {


      $(parent).delegate(children, "mousedown", function (e) {

        drag_obj = $(this);
        drag_real_obj.html(drag_obj.prop("outerHTML"));
        drag_state = true;

        var oStyle = (window.getComputedStyle && window.getComputedStyle(drag_obj[0], null)) || drag_obj[0].currentStyle;
   
        for (var key in oStyle) {

        
          var v = oStyle[key];

          if (/^[a-z]/i.test(key) && [null, '', undefined].indexOf(v) === -1 && key != "length") {
            try {
              drag_real_obj[0].style[key] = v;
            }
            catch(e){

            }
          }
        }
  
        drag_real_obj[0].style.cursor = "pointer";
        z_index = drag_obj.css("z-index");
        drag_real_obj.css("z-index", "999");
        positon.x = drag_obj.offset().left;
        positon.y = drag_obj.offset().top;
        drag_real_obj.find("*").css("top", "");
        drag_real_obj.find("*").css(common.getPreFix() + "transition", "all 0s");
        drag_real_obj.css(common.getPreFix() + "transition", "all 0s");
        drag_real_obj.css("position", "absolute");
        drag_real_obj.css("top", positon.y).css("left", positon.x).css("display", "block");
        originPoint.x = point.x = e.clientX;
        originPoint.y = point.y = e.clientY;
        drag_obj.trigger("change_start");
        drag_real_obj.attr("data-index", drag_obj.attr("data-index"));
     
      });


    }
  }
  $(document).on("mousemove", function (e) {

    if (drag_state && drag_obj) {

      positon.x = positon.x + (e.clientX - point.x);
      positon.y = positon.y + (e.clientY - point.y);
      drag_real_obj.css("left", positon.x);
      drag_real_obj.css("top", positon.y);
      point.x = e.clientX;
      point.y = e.clientY;

      drag_obj.trigger("change_positon", [drag_real_obj, positon.y, drag_obj]);
    }

  });
  $(document).on("mouseup", function (e) {

    if (Math.abs(e.clientX - originPoint.x) < 5 && Math.abs(e.clientY - originPoint.y) < 5) {

      drag_obj.trigger("click", e);
    }
    else {
      e.preventDefault();
    }
    release();
  });
  window.$Drag = $Drag;

})(window, $);
