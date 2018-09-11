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
  var drag_real_obj = null;
  var originPoint = {};
  var originTime = null;
  var start = false;
  var dom = null;
  function release() {
    drag_obj ? (drag_obj.parent().removeClass("transparent"), drag_obj.trigger("change_end")) : false;
    drag_real_obj ? (document.body.removeChild(dom),drag_real_obj = null): false;
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
        dom = document.createElement("div");
        dom.id = "drag";

        positon.x = drag_obj.offset().left;
        positon.y = drag_obj.offset().top;
        originPoint.x = point.x = e.clientX;
        originPoint.y = point.y = e.clientY;
        var oStyle = (window.getComputedStyle && window.getComputedStyle(drag_obj[0], null)) || drag_obj[0].currentStyle;
  
        for (var key in oStyle) {
          var v = oStyle[key];

          if (/^[a-z]/i.test(key) && [null, '', undefined].indexOf(v) === -1 && key != "length" ) {
            if (key == "position") {
              continue;
            }
            try {
              dom.style[key] = v;
            }
            catch (e) {

            }
          }
        }
        dom.style["position"] = "absolute";
        dom.style["display"] = "none";
        dom.style["z-index"] = "99999";
        document.body.appendChild(dom);
        drag_real_obj = $(dom);
      });
    }
  }
  $(document).on("mousemove", function (e) {
    if (drag_state && drag_obj) {
      var now = +new Date;
      if (now - originTime > 150) {
        drag_real_obj.html(drag_obj.prop("outerHTML"));
     
        positon.x = positon.x + (e.clientX - point.x);
        positon.y = positon.y + (e.clientY - point.y);
        drag_real_obj.css("left", positon.x);
        drag_real_obj.css("top", positon.y);
        if (start == false) {
          start = true;
          drag_real_obj.css("display", "block");
          drag_obj.trigger("change_start");
        }
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
