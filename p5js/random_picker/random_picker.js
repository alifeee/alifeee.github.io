let choices = ["This one", "That one", "Such one", "Much one", "The last one"];
let bbox;
let fontsize = 20;
let spinner_space = fontsize + 5;
let spinners = [];
let label_index = 0;
let spinning = false;
let button_loc, mouse_loc, button_hover = false;
let speed;

if (choices.length == 0) {
  choices = ["No choices loaded!"];
}

function setup() {
  let theCanvas = createCanvas(600, 400);
  theCanvas.parent("p5_container");
  bbox = [width/3, 10, width - 10, height - 10];
  button_loc = createVector(width / 6, height / 2)
  frameRate(60);
  textAlign(CENTER, CENTER);
  textSize(fontsize);
  textFont("Courier New");
  draw_new();
}

function draw() {
  background(220);

  translate((bbox[2] + bbox[0]) / 2, (bbox[3] + bbox[1]) / 2);

  for (spinner of spinners) {
    spinner.draw();
    spinner.colour = 0;
    if (spinning) {
      spinner.move(0, speed);
      speed = speed * 0.999;
      if (speed < 0.05) {
        spinning = false;
      }
    }
  }
  spinners[find_middlest()].colour = "red";

  while (spinners[0].y > (bbox[3] - bbox[1]) / 2 + spinner_space) {
    spinners.shift(); -
    spinners.push(new Spinner(chooseItem(choices, label_index), 0, spinners[spinners.length - 1].y - spinner_space, 0));
    label_index += 1;
  }

  translate(-(bbox[2] + bbox[0]) / 2, -(bbox[3] + bbox[1]) / 2);
  surround(bbox[0], bbox[1], bbox[2], bbox[3]);

  mouse_loc = createVector(mouseX, mouseY);

  fill("#a00");
  ellipse(button_loc.x, button_loc.y, 50);
  if (p5.Vector.sub(mouse_loc, button_loc).magSq() < 25 ** 2) {
    cursor(HAND);
    button_hover = true;
  } else {
    cursor(ARROW);
    button_hover = false;
  }
}

function chooseItem(array, n) {
  let index = n % array.length;
  return array[index];
}

function surround(x1, y1, x2, y2) {
  noStroke();
  fill("#500");
  rect(0, 0, width, y1);
  rect(0, y1, x1, y2 - y1);
  rect(x2, y1, width - x2, y2 - y1);
  rect(0, y2, width, height - y2);
  let midpoint = (y1 + y2) / 2;
  triangle(x1, midpoint - 10, x1, midpoint + 10, x1 + 20, midpoint);
  triangle(x2, midpoint - 10, x2, midpoint + 10, x2 - 20, midpoint);
}

function mousePressed() {
  if (button_hover) {
    spinning = true;
    speed = 20 + random(10);
  }
}

function draw_new() {
  spinners = [];
  let user_entry = document.getElementById("choices_entry").value;
  choices = user_entry.split(/\r?\n/);
  for (var i = 0; i < (bbox[3]-bbox[1])/spinner_space + 1; i++) {
    spinners.push(new Spinner(chooseItem(choices, label_index), 0, -spinner_space * (i - (bbox[3]-bbox[1])/spinner_space+ 1), 0));
    label_index += 1;
  }
}

function find_middlest() {
  let distance = 1000;
  let smallest;
  let i=0;
  for (spinner of spinners) {
    if (abs(spinner.y) < distance) {
      distance = abs(spinner.y);
      smallest = i;
    }
    i++;
  }
  return smallest;
}

class Spinner {
  constructor(label, x, y, colour) {
    this.label = label;
    this.x = x;
    this.y = y;
    this.colour = colour;
  }
  draw() {
    fill(this.colour);
    text(this.label, this.x, this.y);
  }
  move(x, y) {
    this.x += x;
    this.y += y;
  }
}