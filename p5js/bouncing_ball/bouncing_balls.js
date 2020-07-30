let bouncers = [];
let acceleration = [0, 1];
let canvas_size = [600, 300];

function setup() {
  frameRate(60);
  var theCanvas = createCanvas(canvas_size[0], canvas_size[1]);
  theCanvas.parent("ball_container");
}

function draw() {
  background(220);
  for (bouncer of bouncers) {
    bouncer.update();
    bouncer.draw();
  }
}


function mousePressed() {
  bouncers.push(new Bouncer(mouseX, mouseY));
}

class Bouncer {
  constructor(initX, initY) {
    this.x = initX;
    this.y = initY;
    this.diameter = random(10, 30);
    this.vx = random(-5, 5);
    this.vy = 0;
  }
  draw() {
    ellipse(this.x, this.y, this.diameter);
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x > (canvas_size[0] - this.diameter / 2) ||
      this.x < (this.diameter / 2)) {
      this.vx = this.vx * -1;
    }
    
    if (this.y > (canvas_size[1] - this.diameter / 2)) {
      this.vy = this.vy * -1;
      this.vy = this.vy * 0.95;
      this.vx = this.vx * 0.95;
    }
    else {
     this.vy += acceleration[1]; 
    }

    this.vx += acceleration[0];
    
  }
}