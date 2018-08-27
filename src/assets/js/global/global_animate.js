export default (function () {


  function ani() {

    this.animateState = {
      noWork: -1,
      zoom: 0,
      move: 1
    }
    this.nowAnimateState = this.animateState.noWork;
    this.animate = null;
    this.animateQueue = [];
    this.animateCursor = 0;
  }
  ani.prototype = {

    animateStart: function (callback) {
      this.animate = window.requestAnimationFrame(callback);

    },
    closeAnimate: function () {
      this.animate && window.cancelAnimationFrame(this.animate);
      this.animateQueue = [];
      this.animateCursor = 0;
      this.nowAnimateState = this.animateState.noWork;
    }
  }
  return ani;

}());
