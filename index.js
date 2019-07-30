const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);


let singletonInstance = null;

class Ball {
  constructor(x, y) {
    this.radius = 3;
    this.x = x;
    this.y = y;
    this.dx = 0;
    this.dy = 0;
    this.gravity = 0.85;
    this.drag = 0.7;
    if (!singletonInstance) {
      singletonInstance = this;
    }
    return singletonInstance;
  }
  move () {
    this.dy -= this.gravity;
    this.x += this.dx;
    this.y += this.dy;

    if(this.x <= this.radius) {
      this.dx *= -1;
    }
    if(this.x >= 100-this.radius) {
      this.dx *= -1;
    }
    if(this.y < this.radius) {
      this.y = this.radius;
      this.dy = -this.dy * this.drag;
      this.dx = this.dx * this.drag;
    }
  }
  get X() {
    return this.x;
  }
  get Y() {
    return this.y;
  }
  get gRadius() {
    return this.radius;
  }
  set sDX(data) {
    this.dx = data;
  }
  set sDY(data) {
    this.dy = data;
  }
  set sX(data) {
    this.x = data;
  }
  set sY(data) {
    this.y = data;
  }
}

var ball = new Ball(20, 90);
let player = {};

io.on('connection', function(socket){
  socket.on('player point', (e) => {
    player = JSON.parse(e);
  })
});

setInterval(async () => {
  let Dx = ball.x - player.x;
  let Dy = ball.y - player.y;
  let d = Math.sqrt(Dx*Dx+Dy*Dy);

  let rb = ball.gRadius;
  let rp = player.radius;

  if (d < rb + rp) {
    let ax = Math.floor(Dx/d);
    let ay = Math.floor(Dy/d);

    let Vn1 = Math.floor(player.dx*ax + player.dy*ay);
    let Vt1 = Math.floor(-player.dx*ay + player.dy*ax);

    let Vn2 = Math.floor(ball.dx*ax + ball.dy*ay);
    let Vt2 = Math.floor(-ball.dx*ay + ball.dy*ax);

    Vn2 = Math.floor(Vn1-Vn2);

    ball.sDX=Math.floor(Vn2*ax - Vt2*ay);
    ball.sDY=Math.floor(Vn2*ay + Vt2*ax);

    console.log(Vn1, Vn2, Vt2, 'dx', ball.dx, "dy", ball.dy);
  }

  await ball.move();
}, 100);
setInterval(async () => {
  await io.emit('ball point', JSON.stringify({ x: parseInt(ball.X, 10), y: parseInt(ball.Y, 10) }) );
}, 1);
setInterval(async () => {
  ball.sX = 20;
  ball.sY = 90;
}, 5000);

http.listen(3030, function(){
  console.log('listening on *:3030');
});