let bouncers = [];
let acceleration;
let oldX, oldY;
let draw_line = false;
let random_color;

function setup() {
  frameRate(60);
  var theCanvas = createCanvas(600, 400);
  theCanvas.parent("p5_container");
  acceleration = createVector(acc_x_slider.value, acc_y_slider.value);
}

function draw() {
  background(240);
  fill(0);
  if (draw_line) {
    /*'If the mouse if being held', draw the dashed line and fake ball*/
    dashed_line(oldX, oldY, mouseX, mouseY, 50);
    fill(random_color);
    ellipse(oldX, oldY, diameter_slider.value);
  }
  for (bouncer of bouncers) {
    bouncer.update_vel(deltaTime);
    bouncer.update_pos(deltaTime / 1000);
    bouncer.wall_collision()
    bouncer.draw();
  }
  for (collision of find_colliders()) {
    update_colliders(bouncers[collision[0]], bouncers[collision[1]]);
  }
}

function mousePressed() {
  /*Record mouse position, this is where the ball spawns and where the
    line is drawn from*/
  oldX = mouseX;
  oldY = mouseY;
  /*Only draw if the mouse is within the canvas*/
  if (mouse_in_box(0, 0, width, height)) {
    draw_line = true;
    random_color = color(random(100, 255), random(100, 255), random(100, 255));
  }
}

function mouseReleased() {
  /*Create a new ball on mouse release*/
  if (draw_line) {
    let vx = (oldX - mouseX) / 1;
    let vy = (oldY - mouseY) / 1;
    bouncers.push(new Bouncer(oldX, oldY, vx, vy, diameter_slider.value, random_color));
    draw_line = false;
  }
}

function mouse_in_box(x1, y1, x2, y2) {
  /*Returns true if the mouse is within the rectangle specified
    x1, y1 is top left, x2, y2 is bottom right*/
  if (mouseX > x1 && mouseX < x2 &&
    mouseY > y1 && mouseY < y2) {
    return true;
  }
  return false;
}

function dashed_line(x1, y1, x2, y2, small_length) {
  /*Draw a dashed line with dashes of length small_length
    between two points*/
  fill(0);
  let distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  let num_lines = distance / small_length * 2;
  num_lines = 2 * Math.floor(num_lines / 2) + 1;
  let xfrac = (x2 - x1) / num_lines;
  let yfrac = (y2 - y1) / num_lines;
  for (let i = 0; i < num_lines; i += 2) {
    line(x1 + xfrac * i, y1 + yfrac * i,
      x1 + xfrac * (i + 1), y1 + yfrac * (i + 1));
  }
}

function find_colliders() {
  /*Find pairs of indices of colliding objects*/
  let colliders = [];
  for (i = 0; i < bouncers.length; i++) {
    for (j = i + 1; j < bouncers.length; j++) {
      if (circle_collision(bouncers[i], bouncers[j])) {
        colliders.push([i, j]);
      }
    }
  }
  return colliders;
}

function update_colliders(c1, c2) {
  /*Update velocities based on momentum considerations*/
  let vCollision = p5.Vector.sub(c2.pos, c1.pos);
  let vRelativeVelocity = p5.Vector.sub(c1.vel, c2.vel);
  let speed = p5.Vector.dot(vRelativeVelocity, vCollision);
  if (speed < 0) {
    return;
  }

  let impulse = 2 * speed / (c1.mass + c2.mass) / vCollision.magSq();
  impulse *= Math.min(c1.restitution, c2.restitution);

  c1.vel = p5.Vector.sub(c1.vel, p5.Vector.mult(vCollision, impulse * c2.mass));
  c2.vel = p5.Vector.add(c2.vel, p5.Vector.mult(vCollision, impulse * c1.mass));

}

function circle_collision(c1, c2) {
  /*Returns true if two circles are colliding*/
  let threshold = (c1.radius + c2.radius) ** 2;
  let sep_vec = p5.Vector.sub(c1.pos, c2.pos);
  let dist_sq = sep_vec.magSq();
  if (dist_sq < threshold) {
    return true;
  }
  return false;
}

function add_random_n(num) {
  /*Creates n random balls*/
  for (i = 0; i < num; i++) {
    bouncers.push(new Bouncer(random(0, width), random(0, height), random(-2000, 2000), random(-2000, 2000), random(5, 50), color(random(100, 255), random(100, 255), random(100,255))));
  }
}

class Bouncer {
  constructor(initX, initY, initVX, initVY, diameter, color) {
    this.pos = createVector(initX, initY);
    this.vel = createVector(initVX, initVY);
    this.diameter = diameter;
    this.radius = this.diameter / 2;
    this.color = color;
    this.mass = this.diameter ** 3;
    this.restitution = 0.90;
    this.friction = 0.98;
  }
  draw() {
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, this.diameter);
  }
  update_pos(dt) {
    this.pos.add(p5.Vector.mult(this.vel, dt));
  }
  update_vel(dt) {
    this.vel.add(p5.Vector.mult(acceleration, dt));
  }
  wall_collision() {
    if (this.pos.x < this.radius) {
      this.pos.x = this.radius;
      this.vel.x = Math.abs(this.vel.x) * this.restitution;
      this.vel.y *= this.friction;
    } else if (this.pos.x > width - this.radius) {
      this.pos.x = width - this.radius;
      this.vel.x = -Math.abs(this.vel.x) * this.restitution;
      this.vel.y *= this.friction;
    }
    if (this.pos.y < this.radius) {
      this.pos.y = this.radius;
      this.vel.y = Math.abs(this.vel.y) * this.restitution;
      this.vel.x *= this.friction;
    } else if (this.pos.y > height - this.radius) {
      this.pos.y = height - this.radius;
      this.vel.y = -Math.abs(this.vel.y) * this.restitution;
      this.vel.x *= this.friction;
    }
  }
}