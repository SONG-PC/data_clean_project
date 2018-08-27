import animate_worker from './global_animate'
export default (function () {
  var dragObj = null;
  var dragState = false;
  var originalPoint = {}, newPoint = {};
  var position = {};
  var allow_x = true;
  var startTime, endTime;
  var animatework = new animate_worker();
  var nowChild, nowFather;
  function release() {
    dragObj ? dragObj= null : false;
    dragState ? dragState = false : false;
    originalPoint ? originalPoint = {} : false;
    newPoint ? newPoint = {} : false;
    position ? position = {} : false;
    startTime ? startTime = null : false;
    endTime ? endTime = null : false;
  }
  var momentumX = function (distance, time, pm_x, pm_y, p_sin, p_cos) {
    var speed = Math.abs(distance) / time,
      duration,
      deceleration = 0.002;
    duration = speed / deceleration;
    return {
      speed: speed,
      duration: duration,
      deceleration: -deceleration,
      pm_x: pm_x,
      pm_y: pm_y,
      p_sin: p_sin,
      p_cos: p_cos
    }
  }
  var momentumMove = function (momentum, father, obj) {
    var nowSpeed = momentum.speed, duration = momentum.duration, deceleration = momentum.deceleration, p_cos = momentum.p_cos, p_sin = momentum.p_sin, pm_x = momentum.pm_x, pm_y = momentum.pm_y, _super = this;
    if (animatework.nowAnimateState == animatework.animateState.move) { animatework.closeAnimate(); }
    var then = +new Date;
    var t = +new Date;
    var allway = 0;
    animatework.nowAnimateState = animatework.animateState.move;
    var a = function () {
      animatework.animateStart(a);
      var now = +new Date;
      var v = nowSpeed + deceleration * (now - then);
      var x = (Math.pow(v, 2) - Math.pow(nowSpeed, 2)) / (2 * deceleration);
      allway += x;
      var insX = (x * p_cos) * pm_x;
      var insY = (x * p_sin) * pm_y;
      if (!isBound(father, obj, -insX)) {
        obj.css("left", parseInt(obj.css("left")) - insX);
        nowSpeed = v;
        then = now;
        if (v < 0) {
          animatework.closeAnimate();

        }
      }
      else {
        animatework.closeAnimate();

      }

    }
    a();
  }
  var ns = function (el, child) {
    nowFather = this.father = $(el);
    nowChild = this.child = $(child);
    this.bind_envent(el, child);
  }
  function isBound(father, child, deltaX) {
    var will = parseInt(child.css("left")) + deltaX
    if (will >= 0) {
      return true;
    }
    var view_width = will + parseInt(child.css("width"));
    var screen_width = parseInt(father.css("width"));
    if (view_width <= screen_width) {

      return true;
    }
    else {

      return false;
    }
  }
  ns.prototype = {
    bind_envent: function (el, child) {
      $(el).delegate(child, "mousedown", function (e) {
        if (animatework.nowAnimateState == animatework.animateState.move) { animatework.closeAnimate(); }
        startTime = +new Date;
        dragState = true;
        dragObj = $(this);
        position.x = parseInt($(this).css("left"));
        position.y = parseInt($(this).css("top"));
        originalPoint.x = newPoint.x = e.clientX;
      });
   }
  }
  $(document).on("mousemove", function (e) {
    if (dragState && dragObj) {
      var deltaX = allow_x ? (e.clientX - newPoint.x) : 0;
      if (!isBound(nowFather, nowChild, deltaX)) {
        position.x += deltaX;
        $(nowChild).css("left", position.x + 'px');

        newPoint.x = e.clientX;
      }

    }
  });
  $(document).on("mouseup", function (e) {
    if (dragState && dragObj) {
      endTime = +new Date;
      var duration = endTime - startTime;
      var delX = e.clientX - originalPoint.x;
      var delY = 0;
      var distanceX = Math.abs(delX);
      var distanceY = 0;
      var distance = Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2));
      if (duration < 300 && (distance) > 15) {
        var momentum = momentumX(distance, duration, delX > 0 ? -1 : 1, delY > 0 ? 1 : -1, distanceY / distance, distanceX / distance);
        momentumMove(momentum, nowFather, nowChild);
      }
    }
    release();
  });






  return ns;
}());
