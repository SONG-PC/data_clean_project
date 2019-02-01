/* eslint-disable */
import DB from './global/global_database.js'
import { MessageBox } from 'element-ui';
import Vue from 'vue'
import layer from 'vue-layer'
import datetime from '../../components/setting/datetime';
Vue.prototype.$layer = layer(Vue);
export default 
(function (window, $) {
  var inv = null, 
  prefix = function () {
    var div = document.createElement('div');
    var cssText = '-webkit-transition:all .1s; -moz-transition:all .1s; -o-transition:all .1s; -ms-transition:all .1s; transition:all .1s;';
    div.style.cssText = cssText;
    var style = div.style;
    if (style.webkitTransition) {
      return '-webkit-';
    }
    if (style.MozTransition) {
      return '-moz-';
    }
    if (style.oTransition) {
      return '-o-';
    }
    if (style.msTransition) {
      return '-ms-';
    }
    return '';
  }(), TRNEND_EV = (function () {
    if (prefix === false) return false;

    var transitionEnd = {
      '': 'transitionend',
      '-webkit-': 'webkitTransitionEnd',
      '-moz-': 'transitionend',
      '-o-': 'otransitionend',
      '-ms-': 'MSTransitionEnd'
    };

    return transitionEnd[prefix];
  })();
    return {
      ieVersionIE: function () {
        return navigator.appName == "Microsoft Internet Explorer" && parseInt(navigator.appVersion.split(";")[1].replace(/[ ]/g, "").replace("MSIE", ""))
      },
      getPreFix: function () {

        return prefix;
      },
      getTrasitionEnd: function () {
        return TRNEND_EV;
      },
      testFunctionTime: function (fn, desc) {
        var start = new Date().getTime();
        if (fn) fn();
        var end = new Date().getTime();
        console.log(desc + ":" + (end - start));
      },
      loading: function () {
        $("#mask").fadeIn(0);
        $("#loading").fadeIn(0);
      },
      loadingHide: function () {
        $("#mask").fadeOut(0);
        $("#loading").fadeOut(500);

      },
      getRandomByRank: function (from, to) {
        return Math.floor(Math.random() * (to - from + 1) + from)
      },
      getFullArrayCombo: function (start, arry, all) {

        if (start.length > 0) {

          all.push(start.concat());
        }

        for (var i = 0; i < arry.length; i++) {
          var copy = arry.concat();
          var dele = copy.splice(i, 1);
          var n = start.concat();
          n.push(dele);
          this.getFullArrayCombo(n, copy, all)

        }

      },
      GUID: function () {

        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
          var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });

      },
      rotatePoint: function (center, point, angle) {
        var x, y;
        var deg  = angle * Math.PI / 180;/*角度变成弧度*/ 
        x = (point.x - center.x) * Math.cos(deg) + (point.y - center.y) * Math.sin(deg) + center.x;
        y = -(point.x - center.x) * Math.sin(deg) + (point.y - center.y) * Math.cos(deg) + center.y;
        return {
          x: x,
          y: y
        }

      },
      getYPoint: function (start, end, x) {
        var k = (end.y - start.y) / (end.x - start.x);
        var b = start.y - k * start.x;
        return k * x + b;

      },
      getK: function (start, end) {
        var k = (end.y - start.y) / (end.x - start.x);
        return k;
      },
      swap_arry: function (arry, i, j) {
        var temp = arry[i];
        arry[i] = arry[j];
        arry[j] = temp;
        return arry.concat();
      },
      getDataByString: function (key) {
        if (DB.comData.hasOwnProperty(key))
          return DB.comData[key]
        else {
          console.error("未找到绑定数据")
        }
      },
      ObjectHasV: function (data,value) {
        for (var p in data) {
          if (data[p] == value)
            return p
        }
        return null;
      },

      interpolationByBezier: function (point0, point1, point2, point3,t) {
        return {
          x: (point0.x * Math.pow((1 - t), 3)) + (3 * point1.x *t* Math.pow(1 - t, 2)) + (3 * point2.x * Math.pow(t, 2) * (1 - t)) + (point3.x * Math.pow(t, 3)),
          y: (point0.y * Math.pow((1 - t), 3)) + (3 * point1.y * t * Math.pow(1 - t, 2)) + (3 * point2.y * Math.pow(t, 2) * (1 - t)) + (point3.y * Math.pow(t, 3))
        }
      },
      getFnByType: function (obj) {

        switch (obj.type) {
          case 'string': return ["⊇", "⊉"]; break;
          case 'integer': return ["=", ">=","<=","<>",">","<"]; break;
          case 'decimal': return ["=", ">=", "<=", "<>", ">", "<"]; break;
          case 'datetime': return ["=", ">=", "<=", "<>", ">", "<"]; break;
          case 'boolean': return ["=", "<>"]; break;
          default: if (obj.fn) { return fn } else { return ["⊇", "⊉"] }; break;
        }

      }
      ,

      isInPolygon:function (checkPoint, polygonPoints) {
      var counter = 0;
      var i;
      var xinters;
      var p1, p2;
      var pointCount = polygonPoints.length;
      p1 = polygonPoints[0];

      for (i = 1; i <= pointCount; i++) {
        p2 = polygonPoints[i % pointCount];
        if (
          checkPoint[0] > Math.min(p1[0], p2[0]) &&
          checkPoint[0] <= Math.max(p1[0], p2[0])
        ) {
          if (checkPoint[1] <= Math.max(p1[1], p2[1])) {
            if (p1[0] != p2[0]) {
              xinters =
                (checkPoint[0] - p1[0]) *
                (p2[1] - p1[1]) /
                (p2[0] - p1[0]) +
                p1[1];
              if (p1[1] == p2[1] || checkPoint[1] <= xinters) {
                counter++;
              }
            }
          }
        }
        p1 = p2;
      }
      if (counter % 2 == 0) {
        return false;
      } else {
        return true;
      }
    }
      ,
      collide : function (rect1, rect2) {
        var maxX, maxY, minX, minY

        maxX = rect1.x + rect1.width >= rect2.x + rect2.width ? rect1.x + rect1.width : rect2.x + rect2.width
        maxY = rect1.y + rect1.height >= rect2.y + rect2.height ? rect1.y + rect1.height : rect2.y + rect2.height
        minX = rect1.x <= rect2.x ? rect1.x : rect2.x
        minY = rect1.y <= rect2.y ? rect1.y : rect2.y

        if (maxX - minX <= rect1.width + rect2.width && maxY - minY <= rect1.height + rect2.height) {
          return true
        } else {
          return false
        }
      },
      smart_input: function (type, _super, cb) {

        switch (type) {

          case 'datetime': 
            _super.$layer.iframe({
              content: {
                content: datetime, //传递的组件对象
                parent: _super,//当前的vue对象
                data: { "bind_data":cb }//props,

              },

              area: ['280px', '200px'],
              title: "系统检测到您需要一个时间输入工具"
            });break;

        }


      },
      getDistanceBy2Point: function (x1, y1, x2, y2) {
        return Math.abs(Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2)));
      },
      create_node_parm: function (obj, parms) {
        parms.forEach(function (v) {
          if (v.type == "select") {
            obj[v.name] = v.value || v.default;
            if (v.configuration) {
              v.configuration.values.forEach(function (v) {
                this.create_node_parm(obj, v.parameters);
              }.bind(this))
            }
          } else {
            obj[v.name] = v.value|| v.default;
          }
        }.bind(this));
      },
      resolve_parm: function (parm, parm_obj) {
        if ((!parm || !parm_obj) &&!(parm_obj instanceof Array))
          return;
        parm_obj.forEach(function (v) {
          if (v.type == "select") {
            v.value = parm[v.name] || v.default || null
            if (v.configuration) {
              v.configuration.values.forEach(function (v) {

                this.resolve_parm(parm, v.parameters);

              }.bind(this))


            }
          }
          else {
            v.value = parm[v.name] ||v.default|| null
          }
        }.bind(this));
      }

    }
})(window, $);
