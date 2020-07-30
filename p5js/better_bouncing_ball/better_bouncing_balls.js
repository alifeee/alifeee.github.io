let bouncers = [];
let acceleration = [0, 1];
let canvas_size = [600, 300];
let oldX, oldY
let draw_line;
let rad;

function setup() {
  frameRate(60);
  var theCanvas = createCanvas(canvas_size[0], canvas_size[1]);
  theCanvas.parent("ball_container");
}

function draw() {
  background(220);
  if (draw_line) {
    dashed_line(oldX, oldY, mouseX, mouseY);
    ellipse(oldX, oldY, rad);
  }
  for (bouncer of bouncers) {
    bouncer.update();
    bouncer.draw();
  }
}


function mousePressed() {
  oldX = mouseX;
  oldY = mouseY;
  draw_line = true;
  rad = random(10,30);
}

function mouseReleased() {
  let vx = ( oldX - mouseX) / 10;
  let vy = ( oldY - mouseY) / 10;
  bouncers.push(new Bouncer(oldX, oldY, vx, vy, rad));
  draw_line = false;
}

function dashed_line(x1, y1, x2, y2) {
  let distance = Math.sqrt((x2-x1)**2 + (y2-y1)**2);
  let num_lines = distance / 20;
  let xfrac = (x2-x1)/num_lines;
  let yfrac = (y2-y1)/num_lines;
  for (let i = 0; i < num_lines; i+= 2) {
    line(x1 + xfrac*i, y1 + yfrac*i,
        x1 + xfrac*(i+1), y1 + yfrac*(i+1));
  }
}

class Bouncer {
  constructor(initX, initY, initVX, initVY, rad) {
    this.x = initX;
    this.y = initY;
    this.diameter = rad;
    this.vx = initVX;
    this.vy = initVY;
  }
  draw() {
    ellipse(this.x, this.y, this.diameter);
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (abs(this.vx) < 0.1) {
      this.vx = 0;
    }
    if (abs(this.vy) < 0.1) {
      this.vy = 0;
    }
    if (this.x > (canvas_size[0] - this.diameter / 2)) {
      this.vx = abs(this.vx) * -1;
    }   
    else if (this.x < (this.diameter / 2)) {
      this.vx = abs(this.vx);
    }
    
    if (this.y > (canvas_size[1] - this.diameter / 2)) {
      this.vy = abs(this.vy) * -1;
      this.vy = this.vy * 0.95;
      this.vx = this.vx * 0.95;
    }
    else {
     this.vy += acceleration[1]; 
    }

    this.vx += acceleration[0];
    
  }
}