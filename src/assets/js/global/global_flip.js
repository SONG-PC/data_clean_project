import $ from 'jquery'
import common from '../common.js';
var transform = common.getPreFix() + "transform"
var transition = common.getPreFix() + "transition"
export default function flip(fromEle, toEle, intoCss, leaveCss) {
  var size = [];
  var animateDom = [];
  fromEle.each(function (index, value) {
    var value_to = toEle.eq(index)[0];
    var from = value.getBoundingClientRect();
    var to = value_to.getBoundingClientRect();
    var dom = document.createElement("div");
    dom.innerHTML = value_to.innerHTML;
    var oStyle = (window.getComputedStyle && window.getComputedStyle(value_to, null)) || value_to.currentStyle;
    for (var key in oStyle) {
      var v = oStyle[key];
      if (/^[a-z]/i.test(key) && [null, '', undefined].indexOf(v) === -1 && key != "length") {
        try {
          dom.style[key] = v;
        }
        catch (e) {
        }
      }
    }
    dom.style["z-index"] = "9999999999999999999999999999999999999999";
    dom.style["position"] = "absolute";
    dom.style["left"] = to.left+'px';
    dom.style["top"] = to.top + 'px';


    var invertPosition = {
      x: from.left - to.left, y: to.top - from.top
    }
    var invertSize = {
      width: to.width, height: to.height, index: value_to.style["index"]
    }


    value_to.style["opacity"] = "0";
    dom.style[transform] = 'translate(' + invertPosition.x + 'px,' + -invertPosition.y + 'px)';
    dom.style.width = from.width + 'px';
    dom.style.height = from.height + 'px';
    size.push(invertSize);
    animateDom.push(dom);
    document.body.appendChild(dom);
    if (intoCss) {
      for (var css in intoCss) {
        dom.style["css"] = intoCss[css];
      }
    }
  });
  requestAnimationFrame(function () {

    animateDom.forEach(function (value, index) {
      value.style[transition] = "all .5s";
      value.style.width = size[index].width+'px';
      value.style.height = size[index].height + 'px';
      value.style[transform] = '';
      var count = 0;

      value.addEventListener(common.getTrasitionEnd(), (function (obj,idx,ct) {
        return function () {
          console.log(ct);
         // if (ct == 2) {
            obj.style[transition] = 'all 0s';
            var value_to = toEle.eq(idx)[0];
            value_to.style["opacity"] = "1";
            obj.style["z-index"] = size[idx].index;
            if (leaveCss) {
              for (var css in leaveCss) {
                obj.style["css"] = leaveCss[css];
              }

            }
     
            document.body.removeChild(obj);
        //  }
          ct++;
        }
      }(value, index,count)))
    })
  });


}
