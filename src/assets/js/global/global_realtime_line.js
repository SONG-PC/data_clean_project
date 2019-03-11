var inteval = null;

export default
  function realtime_line(id) {
  var renderNumber = 20;

  var getRandomByRank = function (from, to) {
    return Math.floor(Math.random() * (to - from + 1) + from)
  };
  var createLine = function () {
    line1.push(canvas.clientHeight - getRandomByRank(50, 200));
    line2.push(canvas.clientHeight - getRandomByRank(50, 200));
    line1_cursor = [(line1.length - renderNumber) < 0 ? 0 : (line1.length - renderNumber), line1.length];
    line2_cursor = [(line2.length - renderNumber) < 0 ? 0 : (line2.length - renderNumber), line2.length];
  }
  ////绘制背景
  var canvas;
  var a = canvas = document.getElementById(id),
    b = canvas.clientWidth,
    c = canvas.clientHeight;
  var step = canvas.clientWidth / 19;
  console.log(step);
  var line1 = [canvas.clientHeight - 0];
  var line2 = [canvas.clientHeight - 0];
  var line1_cursor;
  var line2_cursor;

  a.width = b,
    a.height = c;
  var d = a.getContext("2d");


  function loop(ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    d.strokeStyle = "#E6E6FA",
      d.lineWidth = 0.5,
      d.beginPath();
    for (var e = 20; e <= c; e += 20) d.moveTo(0, e),
      d.lineTo(b, e);
    for (var e = 20; e <= b; e += 20) d.moveTo(e, 0),
      d.lineTo(e, c);
    d.closePath(),
      d.stroke();
    d.lineWidth = 0.5,
      ctx.strokeStyle = "blue",
      ctx.beginPath();
    var count = 0;
    for (var i = line1_cursor[0]; i < line1_cursor[1]; i++) {
      ctx.lineTo(count, line1[i]);
      count += step;
    }
    ctx.stroke();
    ctx.strokeStyle = "red",
      ctx.beginPath();
    count = 0;
    for (var i = line2_cursor[0]; i < line2_cursor[1]; i++) {
      ctx.lineTo(count, line2[i]);
      count += step;
    }
    ctx.stroke();

  }
  var frame = 0;
  inteval && clearInterval(inteval);
  inteval= setInterval(function () {

    if (frame < 3000) {
      createLine();

      loop(d);
    }
    frame++;

  }, 1000);
}
