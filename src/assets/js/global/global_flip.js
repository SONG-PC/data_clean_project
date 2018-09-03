import $ from 'jquery'
import common from '../common.js';
var transform = common.getPreFix() + "transform"
var transition = common.getPreFix() + "transition"
export default function flip(fromEle, toEle, intoCss, leaveCss) {
  var size = [];
  fromEle.each(function (index, value) {
    var value_to = toEle.eq(index)[0];
    var from = value.getBoundingClientRect();
    var to = value_to.getBoundingClientRect();
    console.log(to);
    var invertPosition = {
      x: from.left - to.left, y: to.top - from.top
    }
    console.log(invertPosition);
    var invertSize = {
      width: to.width, height: to.height, index: value_to.style["index"]
    }

    console.log(invertPosition.y );
    value_to.style[transform] = 'translate(' + invertPosition.x + 'px,' + -invertPosition.y + 'px)';
    value_to.style.width = from.width + 'px';
    value_to.style.height = from.height + 'px';
    value_to.style["index"] = "9999999999999999999999999999999999999999";
    size.push(invertSize);
    if (intoCss) {
      for (var css in intoCss) {
        value_to.style["css"] = intoCss[css];
      }
    }
  });
  requestAnimationFrame(function () {

    toEle.each(function (index, value) {
      value.style[transition] = "all .5s";
      value.style.width = size[index].width+'px';
      value.style.height = size[index].height + 'px';
      value.style[transform] = '';
      value.addEventListener(common.getTrasitionEnd(), (function (obj,idx) {
        return function () {
          obj.style[transition] = 'all 0s';
          obj.style["index"] = size[index].index; 
          if (leaveCss) {
            for (var css in leaveCss) {
              obj.style["css"] = leaveCss[css];
            }
          }       
        }
      }(value, index)))
    })
  });


}
