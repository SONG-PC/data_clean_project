/* eslint-disable */
//给元素拖动功能
import common from '../common.js'
import { stat } from 'fs';
(function (window, $) {
  var drag_state = false;
  var drag_obj = null;
  var point = {};
  var positon = {};
  var z_index = 0;
  var drag_real_obj = $("#drag");
  var originPoint = {};
  var originTime = null;
  var start = false;
  function release() {

    drag_obj ? (drag_obj.parent().removeClass("transparent"), drag_obj.trigger("change_end")) : false;
    drag_real_obj ? drag_real_obj.css("display", "none") : false;
    positon = {};
    point = {};
    drag_obj = null;
    drag_state = false;
    originTime = null;
    start = false;
  }

  var $Drag= {
    enableDrag: function (parent, children) {
      $(parent).delegate(children, "mousedown", function (e) {
        originTime = +new Date;
        drag_obj = $(this);
        drag_state = true;    
        positon.x = drag_obj.offset().left;
        positon.y = drag_obj.offset().top;
        originPoint.x = point.x = e.clientX;
        originPoint.y = point.y = e.clientY;
        var oStyle = (window.getComputedStyle && window.getComputedStyle(drag_obj[0], null)) || drag_obj[0].currentStyle;
        for (var key in oStyle) {
          var v = oStyle[key];

          if (/^[a-z]/i.test(key) && [null, '', undefined].indexOf(v) === -1 && key != "length") {
            try {
              drag_real_obj[0].style[key] = v;
            }
            catch (e) {

            }
          }
        }
        drag_real_obj.css("z-index", "99999");
        drag_real_obj.css("display", "none");
        drag_real_obj.css("position", "absolute");
      });
    }
  }
  $(document).on("mousemove", function (e) {
    if (drag_state && drag_obj) {
      var now = +new Date;
      if (now - originTime > 150) {
        drag_real_obj.html(drag_obj.prop("outerHTML"));
        if (start == false) {        
          start = true;
          drag_real_obj.css("display", "block");
          drag_obj.trigger("change_start");
        }
        positon.x = positon.x + (e.clientX - point.x);
        positon.y = positon.y + (e.clientY - point.y);
        drag_real_obj.css("left", positon.x);
        drag_real_obj.css("top", positon.y);
        point.x = e.clientX;
        point.y = e.clientY;
        drag_real_obj.attr("data-index", drag_obj.attr("data-index"));
        drag_obj.trigger("change_positon", [drag_real_obj, positon.y, drag_obj]);
   

      }
     

    }

  
  });
  $(document).on("mouseup", function (e) {

    release();
  });
  window.$Drag = $Drag;

})(window, $);
