/* eslint-disable */
export default 
(function (window, $) {
  var inv = null;
  var prefix = function () {
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
  }();
    return {
      ieVersion: function () {
        return navigator.appName == "Microsoft Internet Explorer" && parseInt(navigator.appVersion.split(";")[1].replace(/[ ]/g, "").replace("MSIE", ""))
      },
      getPreFix: function () {

        return prefix;
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
      swap_arry: function (arry, i, j) {
        var temp = arry[i];
        arry[i] = arry[j];
        arry[j] = temp;
        return arry.concat();
      }
    }
})(window, $);
