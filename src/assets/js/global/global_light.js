export default
  light



function light(id) {
  function drawLightning(x1, y1, x2, y2, displace) {
    if (displace < curDetail) {

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      ctx.closePath();

    }
    else {
      var mid_x = (x2 + x1) / 2;
      var mid_y = (y2 + y1) / 2;
      mid_x += (Math.random() - .5) * displace;
      mid_y += (Math.random() - .5) * displace;
      drawLightning(x1, y1, mid_x, mid_y, displace / 2);
      drawLightning(x2, y2, mid_x, mid_y, displace / 2);
    }
  }
  var canvas = document.getElementById(id);
  var canvas_rect = canvas.getBoundingClientRect();
  var canvas_width = parseInt(canvas_rect.width);

  var canvas_height = parseInt(canvas_rect.height);
  var y = parseInt(canvas_height) / 2;
  var ctx = canvas.getContext("2d");
  ctx.lineWidth = 1;
  var request = null;
  var curDetail = 10;
  ctx.strokeStyle = "#00FF00";
  function loop() {
    setTimeout(function () {
      ctx.clearRect(0, 0, canvas_width, canvas_height);
      drawLightning(0, y, canvas_width, y, 29);
      if (request)
      request = window.requestAnimationFrame(loop)
    }, 0)
  }
  this.start = function () {
    request = window.requestAnimationFrame(loop);

  }
  this.stop = function () {
    window.cancelAnimationFrame(request);
    request = null;
  }

}

