let planets = [];
let oldX, oldY;
let fresh_id = 0;
let draw_line = false;
let delete_planets = [];
let ghost_planet;
let vel_factor = 2;
let xsys;
let paused = false, pausing = false;

function setup() {
  frameRate(60);
  let theCanvas = createCanvas(700, 400);
  theCanvas.parent("p5_container");
}

function draw() {
  background(220);
  fill(0);
  if (draw_line) {
    dashed_line(oldX, oldY, mouseX, mouseY, 50);
    fill(random_color);
    /*ellipse(oldX, oldY, diameter_slider.value);*/
    ghost_planet.draw();
    xsys = ghost_planet.path(8, 120);
    dashed_array(xsys[0], xsys[1]);
  }
  for (planet of planets) {
    if (!paused) {
      planet.vel.add(planet.new_accel(deltaTime / 1000));
      planet.pos.add(planet.new_vel(deltaTime / 1000));
    }
    planet.draw();
  }
  for (collision of find_colliders(planets)) {
    update_colliders(planets[collision[0]], planets[collision[1]]);
    delete_planets.push(collision[0]);
    delete_planets.push(collision[1]);
  }
  delete_planets.sort();
  delete_planets.reverse();
  for (delete_planet of delete_planets) {
    planets.splice(delete_planet, 1);
  }
  delete_planets = [];
}

function mousePressed() {
  oldX = mouseX;
  oldY = mouseY;
  if (mouse_in_box(0, 0, width, height)) {
    draw_line = true;
    if (pausing_check.checked) {paused = true}
    random_color = color(random(100, 255), random(100, 255), random(100, 255));
    ghost_planet = new Planet(oldX, oldY, 0, 0, diameter_slider.value, random_color);
  }
}

function mouseReleased() {
  if (draw_line) {
    let vx = (oldX - mouseX) / vel_factor;
    let vy = (oldY - mouseY) / vel_factor;
    ghost_planet = undefined;
    planets.push(new Planet(oldX, oldY, vx, vy, diameter_slider.value, random_color));
    draw_line = false;
    if (!pausing) {paused = false}
  }
}

function mouse_in_box(x1, y1, x2, y2) {
  if (mouseX > x1 && mouseX < x2 &&
    mouseY > y1 && mouseY < y2) {
    return true;
  }
  return false;
}

function dashed_line(x1, y1, x2, y2, small_length) {
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

function dashed_array(xs, ys) {
  fill(0);
  for (i = 0; i < xs.length; i+=2) {
    line(xs[i], ys[i], xs[i+1], ys[i+1]);
  }
}

function find_colliders(circles) {
  let colliders = [];
  for (i = 0; i < circles.length; i++) {
    for (j = i + 1; j < circles.length; j++) {
      if (circle_collision(circles[i], circles[j])) {
        colliders.push([i, j]);
      }
    }
  }
  return colliders;
}

function circle_collision(c1, c2) {
  let threshold = (c1.radius + c2.radius) ** 2;
  let sep_vec = p5.Vector.sub(c1.pos, c2.pos);
  let dist_sq = sep_vec.magSq();
  if (dist_sq < threshold) {
    return true;
  }
  return false;
}

function update_colliders(c1, c2) {
  let relDist = p5.Vector.sub(c2.pos, c1.pos);
  let mass_frac = 1 / (1 + c1.mass / c2.mass);
  let COM = p5.Vector.add(c1.pos, p5.Vector.mult(relDist, mass_frac));
  
  let new_vel = p5.Vector.mult(
    p5.Vector.add(
      p5.Vector.mult(c1.vel, c1.mass),
      p5.Vector.mult(c2.vel, c2.mass)
      ),
    1 / (c1.mass + c2.mass));
  
  let new_mass = c1.mass + c2.mass;
  let new_diameter = new_mass**(1/3);
  
  let new_color = combine_colors(c1, c2);
  if (c1.diameter > c2.diameter) {
    new_color = c1.color;
  }
  else if (c2.diameter > c1.diameter) {
    new_color = c2.color;
  }

  planets.push(new Planet(COM.x, COM.y, new_vel.x, new_vel.y, new_diameter, new_color));
}

function combine_colors(o1, o2) {
  let col1 = o1.color;
  let col2 = o2.color;
  let r = (col1.levels[0] + col2.levels[0]) / 2
  let g = (col1.levels[1] + col2.levels[1]) / 2
  let b = (col1.levels[2] + col2.levels[2]) / 2
  return color(r, g, b);
}

class Planet {
  constructor(initX, initY, initVX, initVY, diameter, color) {
    this.pos = createVector(initX, initY);
    this.vel = createVector(initVX, initVY);
    this.diameter = diameter;
    this.radius = this.diameter/2;
    this.mass = this.diameter**3;
    this.color = color;
    this.id = fresh_id;
    fresh_id ++;
  }
  draw() {
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, this.diameter);
  }
  new_vel(dt) {
    return p5.Vector.mult(this.vel, dt);
  }
  new_accel(dt) {
    let accel = createVector(0,0);
    let r, r_norm;
    let accel_mag;
    for (var planet_ of planets) {
      if (this.id == planet_.id) {
        continue;
      }
      r = p5.Vector.sub(planet_.pos, this.pos);
      accel_mag = (grav_slider.value * planet_.mass) / r.magSq();
      r_norm = r.normalize();
      accel.add(r_norm.mult(accel_mag));
    }
    return p5.Vector.mult(accel, dt);
  }
  path(time, steps) {
    let dt = time / steps;
    let vx = (oldX - mouseX) / vel_factor;
    let vy = (oldY - mouseY) / vel_factor;
    let v = createVector(vx, vy);
    let xs = [oldX];
    let ys = [oldY];
    for (i = 1; i < steps; i++) {
      v.add(p5.Vector.mult(
        static_accel(xs[xs.length-1], ys[ys.length-1]),
        dt));
      xs.push(xs[xs.length-1] + v.x * dt);
      ys.push(ys[ys.length-1] + v.y  *dt);
    }
    return [xs, ys];
  }
}
  
function static_accel(x, y) {
  let accel = createVector(0, 0);
  let pos = createVector(x, y);
  let r, r_norm;
  let accel_mag;
  for (var planet_ of planets) {
    r = p5.Vector.sub(planet_.pos, pos)
    accel_mag = (grav_slider.value * planet_.mass) / r.magSq();
    r_norm = r.normalize();
    accel.add(r_norm.mult(accel_mag));
  }
  return accel;
}

function create_solar_system() {
  let radius, r, r0, r1, v_mag, v, planet_color;
  planets = [];
  let sun_rand = random(0, 80);
  planets.push(new Planet(width/2, height/2, 0, 0, 60 + sun_rand, color(240, 240-.5*sun_rand*240/80, 0)));
  for (i=0; i < random(4, 8); i++) {
    radius = random(150, Math.min(width, height)/2);
    r0 = createVector(width/2, height/2);
    r1 = p5.Vector.random2D();
    r1.mult(radius);
    r = p5.Vector.add(r0, r1);
    v_mag = Math.sqrt( (grav_slider.value * planets[0].mass) / radius );
    v = p5.Vector.fromAngle(r1.heading() + Math.PI / 2 + random(-0.5, 0.5));
    v.mult(v_mag);
    v.mult(Math.random() < 0.9 ? -1: 1);
    planet_color = color(random(100, 255), random(100, 255), random(100, 255));
    planets.push(new Planet(r.x, r.y, v.x, v.y, random(10, 25), planet_color));
  }
}

function create_random_planets() {
  let x, y, vx, vy, d, col;
  for (i=0; i < 10; i++) {
    x = random(0, width);
    y = random(0, height);
    vx = random(-200, 200);
    vy = random(-200, 200);
    d = random(10, 50);
    col = color(random(100, 255), random(100, 255), random(100, 255));
    planets.push(new Planet(x, y, vx, vy, d, col));
  }
}




