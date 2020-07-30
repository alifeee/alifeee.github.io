let planets = [];
let oldX, oldY;
let draw_line;
const G = 0.0000001;
let id = 0;
let to_delete = -1, delete_index;

function setup() {
  frameRate(60);
  let theCanvas = createCanvas(600, 400);
  theCanvas.parent("orbit_container");
  planets.push(new Planet(width/2, height/2, 0, 0, 50, id));
  id += 1;
  /*planets.push(new Planet(width/4, height/2 - 1, 0, 1, 5, id));
  id += 1;*/
}

function draw() {
  background(220);
  if (draw_line) {
    dashed_line(oldX, oldY, mouseX, mouseY);
  }

  for (planet of planets) {
    planet.draw();
    planet.update_posit();
    planet.collision_detect();
  }
  if (to_delete != -1) {
    delete_index = 0
    for (planet of planets) {
      if (planet.id == to_delete) {
        break;
      }
      delete_index += 1;
    }
    planets.splice(delete_index, 1);
    to_delete = -1;
  }
  for (planet of planets) {
  planet.update_accel();
  }
}

function mousePressed() {
  oldX = mouseX;
  oldY = mouseY;
  draw_line = true;
}

function mouseReleased() {
  let vx = ( oldX - mouseX) / 50;
  let vy = ( oldY - mouseY) / 50;
  planets.push(new Planet(oldX, oldY, vx, vy, 5 + random(), id));
  id += 1;
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

class Planet {
  constructor(initX, initY, initVX, initVY, diameter, id) {
    this.position = createVector(initX, initY);
    this.velocity = createVector(initVX, initVY);
    this.diameter = diameter;
    this.mass = diameter**3;
    this.id = id;
  }
  draw() {
    ellipse(this.position.x, this.position.y, this.diameter);
  }  
  update_accel() {
    let accel = createVector(0,0);
    let r, r_unit, single_accel;
    let plan1, plan2;
    for (planet of planets) {
      if (this.id == planet.id) {
        continue;
      }
      plan1 = planet.position;
      plan2 = this.position;
      r = p5.Vector.sub(plan1, plan2);
      r_unit = r.normalize();
      single_accel = (G * planet.mass) / (r.magSq());
      accel.add(r_unit.mult(single_accel)); 
    }
    this.velocity.add(accel);
  }
  update_posit() {
    this.position = this.position.add(this.velocity);
  }
  collision_detect() {
    let dist_vec, dist_scal;
    for (planet of planets) {
      if (this.id == planet.id) {
        continue
      }
      dist_vec = p5.Vector.sub(this.position, planet.position);
      dist_scal = dist_vec.magSq();
      if (dist_scal < (this.diameter/2 + planet.diameter/2)**2) {
        /*console.log("Collision between " + this.id + " of mass " + this.mass + " and " planet.id + " of mass " + planet.mass);*/
        console.log(this.id, this.mass, planet.id, planet.mass);
        if (this.mass > planet.mass) {
          to_delete = planet.id;
        }
        else if (this.mass < planet.mass) {
          to_delete = this.id;
        }
        else {
          to_delete = planet.id;
        }
        console.log("Delete ID " + to_delete);
      }
    }
  }
}
  
  
  