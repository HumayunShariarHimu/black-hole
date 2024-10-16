var canvas = document.createElement("canvas"),
  c = canvas.getContext("2d");
var w = (canvas.width = window.innerWidth),
  h = (canvas.height = window.innerHeight);

document.body.appendChild(canvas);
var particles,
  t = 1,
  mr = 10;

class particle {
  constructor(x, y, s) {
    this.x = x;
    this.y = y;
    this.pos = {
      x: this.x,
      y: this.y
    };
    this.s = s;
    this.col = Math.floor(Math.random() * 255);
    this.ang = Math.atan2(h / 2 - this.y, w / 2 - this.x) + 3 * Math.PI / 4;
    this.vx = 2 * Math.cos(this.ang);
    this.vy = 2 * Math.sin(this.ang);
    this.ax = 0;
    this.ay = 0;
    this.hist = [];
  }

  move(xt, yt) {
    this.tx = xt;
    this.ty = yt;
    //distance from target
    this.dist = Math.sqrt(Math.pow(this.x - xt, 2) + Math.pow(this.y - yt, 2));
    //gravitational acceleration
    this.mg = 100;
    //gravity force angle
    this.ang = Math.atan2(yt - this.y, xt - this.x);
    //gravity force strenght
    this.force = this.mg * this.s * mr / Math.pow(this.dist, 2);
    //acceleration
    this.ax = this.force * Math.cos(this.ang);
    this.ay = this.force * Math.sin(this.ang);
    if (this.dist > mr + this.s) {
      //velocity
      this.vx += 0.9 * this.ax * t;
      this.vy += 0.9 * this.ay * t;
      //friction
      this.vx *= 0.9;
      this.vy *= 0.9;
      //movement
      this.x += this.vx * t;
      this.y += this.vy * t;
    } else {
      //what happens behind event horizon
      this.x = Math.random() * (w + 20) - 10;
      this.y = Math.random() * (h + 20) - 10;
      while (this.x > 0 && this.x < w && this.y > 0 && this.y < h) {
        this.x = Math.random() * (w + 20) - 10;
        this.y = Math.random() * (h + 20) - 10;
      }
      this.ang = Math.atan2(h / 2 - this.y, w / 2 - this.x) + 3 * Math.PI / 4;
      this.vx = 1 * Math.cos(this.ang);
      this.vy = 1 * Math.sin(this.ang);
      this.ax = 0;
      this.ay = 0;
      this.s = Math.pow(Math.random() * 1.1 + 0.1, 4) + 1;
      //black hole gaining some mass
      mr = Math.pow(Math.pow(mr, 2) + Math.pow(this.s, 2), 1 / 2);
      this.hist.splice(0, this.hist.length);
    }
    //tails
    this.pos = {
      x: this.x,
      y: this.y
    };
    this.hist.push(this.pos);
    if (this.hist.length > 5) {
      this.hist.splice(0, 1);
    }
  }

  show() {
    //showing tails
    c.beginPath();
    this.hist.forEach(hi => c.lineTo(hi.x, hi.y));
    c.lineWidth = 2 * this.s;
    c.lineJoin = "round";
    c.lineCap = "round";
    c.strokeStyle = "rgba(255,255,255,0.1)";
    c.stroke();
    //showing bodies
    c.beginPath();
    c.arc(this.x, this.y, this.s, 0, 2 * Math.PI);
    c.fillStyle = "white";
    c.fill();
    //showing black hole
    c.beginPath();
    c.arc(this.tx, this.ty, mr, 0, 2 * Math.PI);
    c.fillStyle = "black";
    c.fill();
  }
}
// universe creation
particles = Array(300)
  .fill()
  .map(
    p =>
      new particle(
        Math.random() * w,
        Math.random() * h,
        Math.pow(Math.random() * 1.1 + 0.1, 4) + 1
      )
  );
var i = 0;
//there time begins
function draw() {
  particles.forEach(p => p.move(mouse.x, mouse.y));
  particles.forEach(p => p.show());
}
//controlling black hole
var mouse = {
  x: w / 2,
  y: h / 2
};
var last_mouse = {
  x: 0,
  y: 0
};

canvas.addEventListener(
  "mousemove",
  function(e) {
    last_mouse.x = mouse.x;
    last_mouse.y = mouse.y;

    mouse.x = e.pageX - this.offsetLeft;
    mouse.y = e.pageY - this.offsetTop;
  },
  false
);

window.requestAnimFrame = (function() {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback) {
      window.setTimeout(callback, 1000 / 60);
    }
  );
})();

function loop() {
  setTimeout(function() {
    window.requestAnimFrame(loop);
    c.fillStyle = "rgba(30,30,30,1)";
    c.fillRect(0, 0, w, h);
    draw();
  }, 1000 / 60);
}

window.addEventListener("resize", function() {
  (w = canvas.width = window.innerWidth),
    (h = canvas.height = window.innerHeight);
  c.fillStyle = "rgba(30,30,30,1)";
  c.fillRect(0, 0, w, h);
});

loop();