import animate_worker from './global_animate'
import { Transform } from 'stream';
import common from '../common';
export default (function () {
  var dragObj = null,
   dragState = false,
   originalPoint = {}, newPoint = {},
   position = {},
    allow_x = true,
    preFix = common.getPreFix() ,
    transition = preFix + "transition",
    transform = preFix+ "transform",
    transitionDuration = preFix+"traendnsition-duration",
    startTime, endTime,
    TRNEND_EV = (function () {
      if (preFix === false) return false;

      var transitionEnd = {
        '': 'transitionend',
        '-webkit-': 'webkitTransitionEnd',
        '-moz-': 'transitionend',
        '-o-': 'otransitionend',
        '-ms-': 'MSTransitionEnd'
      };

      return transitionEnd[preFix];
    })(),
   animatework = new animate_worker(),
  nowChild, nowFather,fatherRect;
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
      deceleration = 0.0006;
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
    var origin_x = parseInt(position.x), origin_y = 0;
    var a = function () {
      
      animatework.animateStart(a);
      var now = +new Date;
      var v = nowSpeed + deceleration * (now - then);
      var x = (Math.pow(v, 2) - Math.pow(nowSpeed, 2)) / (2 * deceleration);
      allway += x;
      var insX = (x * p_cos) * pm_x;
      var insY = (x * p_sin) * pm_y;
      origin_x = origin_x - insX;
        obj[0].style[transform] = 'translate(' + origin_x + 'px,' + 0 + 'px) translateZ(0)';
        nowSpeed = v;
      then = now;
      var back = isBound();
      if (back != null) {
        deceleration =-0.05;
      }
      if (v < 0) {
    
        animatework.closeAnimate();
        reset_pos(400,back);
        }
     
    };
    a();
  }
  function isBound() {
    var slideRect = nowChild.offset();
    var fatherRect = nowFather.offset();
    position.x = slideRect.left - fatherRect.left;
    position.y = slideRect.top - fatherRect.top;
    var childWidth = parseInt(nowChild.css("width")),
      fatherWidth = parseInt(nowFather.css("width"));
    if (position.x > 0) {
      return 0
    }
    else if (childWidth - Math.abs(position.x) < fatherWidth) {
      if (fatherWidth - childWidth < 0)
        return fatherWidth - childWidth;
      else
        return 0
    }
    else {
      return null;
    }
  }
  function reset_pos(time, pos) {
    if (pos == null)
      return;
      nowChild[0].style[transition] = 'all '+time + 'ms';
      nowChild[0].style[transform] = 'translate(' + pos+'px,0px) translateZ(0)';
  }
  var ns = function (el, child) {
    nowFather = this.father = $(el);
    fatherRect = nowFather[0].getBoundingClientRect();
    nowChild = this.child = $(child);
    this.bind_envent(el, child);
  }
  function allow_move() {
    var childWidth = parseInt(nowChild.css("width")),
      fatherWidth = parseInt(nowFather.css("width"));
    if (fatherWidth > childWidth) {
      return false;
    }
    else {
      return true;
    }
  }
  ns.prototype = {
    bind_envent: function (el, child) {
      nowChild.on("mousedown", function (e) {
        if (!allow_move()) {
          reset_pos(400, 0);
          return;
        }
        nowChild[0].style[transition] = 'all 0ms';
        if (animatework.nowAnimateState == animatework.animateState.move) { animatework.closeAnimate(); }
        startTime = +new Date;
        dragState = true;
        dragObj = $(this);
        var slideRect = nowChild.offset();
        var fatherRect = nowFather.offset();
        position.x = slideRect.left - fatherRect.left;
        position.y = slideRect.top - fatherRect.top;
        originalPoint.x = newPoint.x = e.clientX;
      });
      nowChild.on(TRNEND_EV, function (e) {
        
      });
   }
  }
  $(document).on("mousemove", function (e) {

    if (dragState && dragObj) {
      var deltaX = allow_x ? (e.clientX - newPoint.x) : 0;
      position.x += deltaX;
      nowChild[0].style[transform] = 'translate(' + position.x + 'px,' + 0 + 'px) translateZ(0)';
      newPoint.x = e.clientX;     
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
      else {
        reset_pos(400, isBound());
      }
    }
    release();
  });
  return ns;
}());
