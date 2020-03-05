;(function() {
  // 粒子相关
  var PIXEL_RATIO = window.devicePixelRatio || 2;
  var MAX_RADIUS = 18 * PIXEL_RATIO,
      NUM = 25,
      particle = null,
      particles = [];

  // 粒子的原型对象
  var ball = {
    color: 'rgba(255, 255, 255, 0.36)',
    radius: MAX_RADIUS,
    setColor: function (color) {
      this.color = color;
    },
    setRadius: function (radius) {
      this.radius = radius;
    },
    draw: function (ctx) {
      ctx.beginPath();
      ctx.fillStyle = this.color;
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      ctx.fill();
      ctx.closePath();
    }
  };

  // 画布相关
  var header = document.querySelector('.header');
  var canvas = document.querySelector('#canvas'),
      clientWidth = header.offsetWidth * PIXEL_RATIO,
      clientHeight = header.offsetHeight * PIXEL_RATIO,
      canvasWidth = clientWidth,
      canvasHeight = clientHeight,
      ctx = canvas.getContext('2d');


  canvas.width = clientWidth;
  canvas.height = clientHeight;

  // canvas.style.transform = 'scale(' + (1 / PIXEL_RATIO) + ')';
  
  // 数学函数、常量 PI
  var PI = Math.PI,
      random = Math.random,
      floor = Math.floor,
      sin = Math.sin,
      cos = Math.cos;

  // 随机出所有粒子
  for(var i = 0; i < NUM; i++) {
    particle = Object.create(ball);
    particle.x = +(random() * canvasWidth).toFixed(2);
    particle.y = +(random() * canvasHeight).toFixed(2);
    particle.radius = +(random() * MAX_RADIUS).toFixed(2);
    particle.angle = +(random() * 360).toFixed(2);
    particles.push(particle);
  }

  // 粒子间距小于一定距离 连线
  function connect(ctx, pointA, pointB, limt) {
    var x = pointA.x - pointB.x,
        y = pointA.y - pointB.y,
        distance = Math.sqrt(x*x + y*y);
    
    if(distance > limt) {
      return ;
    }

    ctx.beginPath();
    ctx.lineWidth = 0.6 * PIXEL_RATIO;
    ctx.moveTo(pointA.x, pointA.y);
    ctx.lineTo(pointB.x, pointB.y);
    ctx.strokeStyle = 'rgba(255, 255, 255, '+ (1 - distance/limt) +')';
    ctx.stroke();
    ctx.closePath();
  }

  // 开始绘画
  function run() {
    var speed = 1;

    window.requestAnimationFrame(run);

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    for(var i = 0, len = particles.length; i < len; i++) {
      var j = i + 1;

      while(j < len) {
        connect(ctx, particles[i], particles[j], 120);
        j++;
      }
    }

    particles.forEach(function (particle) {
      var thisRadius = particle.radius,
          thisAngel;

      var x = particle.x;
      var y = particle.y;

      if(x > canvasWidth + 2 * MAX_RADIUS || x < -2 * MAX_RADIUS) {
        particle.angle += 90;
      }

      if(y > canvasHeight + 2 * MAX_RADIUS || y < -2 * MAX_RADIUS) {
        particle.angle *= -1;
      }

      thisAngle = particle.angle;

      particle.x += cos(thisAngle * PI / 180) * speed;
      particle.y += sin(thisAngle * PI / 180) * speed;
      particle.draw(ctx);
    });
  }

  run();
}())
