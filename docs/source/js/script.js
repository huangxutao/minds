;(function() {
  /**
   * 随机产生数据
   * 
   * @param {Number} num 
   * @returns 
   */
  function createData(num) {
    var data = [];

    for(var i = 0; i < num; i++) {
      data.push({
        x: parseInt(Math.random() * 1024, 10),
        y: parseInt(Math.random() * 860, 10),
        r: parseInt(Math.random() * 20, 10)
      });
    }

    return data;
  }
  /**
   * 获取两点间距
   * 
   * @param {Object} pointA 
   * @param {Object} pointB 
   * @returns 
   */
  function getDistance(pointA, pointB) {
    var x = pointA.x - pointB.x;
    var y = pointA.y - pointB.y;

    return Math.sqrt(x*x + y*y);
  }

  /**
   * 绘制圆
   * 
   * @param {Object} ctx 绘图上下文
   * @param {Object} circle
   */
  function drawCircle(ctx, circle) {
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.r, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'rgba(255, 255, 255, .36)';
    ctx.fill();
  }

  /**
   * 两点连线
   * 
   * @param {object} ctx 绘图上下文
   * @param {Number} limt
   * @param {Object} pointA 
   * @param {Object} pointB 
   * @returns 
   */
  function drawLline(ctx, limt, pointA, pointB) {
    var distance = getDistance(pointA, pointB);

    if(distance > limt) {
      return false;
    }

    ctx.beginPath();
    ctx.lineWidth = 0.36;
    ctx.moveTo(pointA.x, pointA.y);
    ctx.lineTo(pointB.x, pointB.y);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.36)';
    ctx.stroke();
  }

  /**
   * 初始化
   * 
   */
  function init() {
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    var circles = createData(40);

    for(var i = 0, len = circles.length; i < len; i++) {
      var j = i + 1;

      while(j < len) {
        drawLline(ctx, 60, circles[i], circles[j]);
        j++;
      }

      drawCircle(ctx, circles[i]);
    }
  }

  init();
}())