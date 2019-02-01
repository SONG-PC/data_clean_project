import common from '../common';
export default (function () {
  var dom = document.createElement('div');
  dom.style.backgroundColor = "rgba(240,240,255,0.5)";
  dom.style.border = "1px gray dashed";
  dom.style.position = "absolute";
  var isDrag = false;
  var originPT = null;
  var obj = null;
  function Range(selector,fn) {
 
    var rect = $(selector).offset();

    $(selector).on("mousedown", function (e) {
      if (e.button == 0) {

        isDrag = true;
        obj = $(this);
        originPT = e;
        dom.style.left = (e.clientX - rect.left) + $(this).scrollLeft()+ 'px';
        dom.style.top = (e.clientY - rect.top) + $(this).scrollTop()+ 'px';
        dom.style.width = "0px";
        dom.style.height = "0px";
        $(this).append(dom)
      }
    });
    $(selector).on("mousemove", function (e) {
      if (isDrag) {
        var deltaX = e.clientX-originPT.clientX 
        var deltaY = e.clientY -originPT.clientY ;
        if (deltaX < 0 && deltaY < 0) {
          dom.style.left = e.clientX + $(this).scrollLeft() - rect.left + 'px';
          dom.style.top = e.clientY + $(this).scrollTop() - rect.top + 'px';
        }
        else if (deltaX < 0 && deltaY > 0) {
          dom.style.left = e.clientX + $(this).scrollLeft() - rect.left + 'px';
        }
        else if (deltaX > 0 && deltaY < 0) {
          dom.style.top = e.clientY + $(this).scrollTop() - rect.top + 'px';
        }
        dom.style.width = Math.abs(deltaX) + 'px';
        dom.style.height = Math.abs(deltaY) + 'px';

      }
    });
    $(selector).on("mouseup", function (e) {
      if (isDrag) {
    
        fn({ x: parseInt(dom.style.left), y: parseInt(dom.style.top), width: parseInt(dom.style.width), height: parseInt(dom.style.height) });
        isDrag = null;
        originPT = null;
        obj = null;
        this.removeChild(dom);
      }

    });
    $(document).on("mouseup", function (e) {
      if (isDrag) {
        fn({ x: parseInt(dom.style.left), y: parseInt(dom.style.top), width: parseInt(dom.style.width), height: parseInt(dom.style.height) });
        isDrag = null;
        originPT = null;
        obj[0].removeChild(dom);
        obj = null;
      }

    });

  }
  return Range;
})();
