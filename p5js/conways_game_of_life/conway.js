let conways, buttons;
let squareSize, brush;
let playing, lastPlay;
let oldSize;
let learnMoreLink;
let putSliders = 0;

function setup() {
  /*Canvas declaration*/
  buttons = [];
  playing = 0;
  lastPlay = 0;
  let theCanvas = createCanvas(650, 500);
  theCanvas.parent("p5_container");
  
  /*Reset, play/pause, and step buttons, and randomise button*/
  buttons.push(new Button(width - 130, height - 90, 40, new StopIcon(), resetConways));
  buttons.push(new Button(width - 90, height - 90, 40, new PlayIcon(), play));
  buttons.push(new Button(width - 50, height - 90, 40, new StepIcon(), step));
  buttons.push(new Button(width - 170, height - 90, 40, new RandomIcon(), randomizeConways));
  
  /*Brush selection buttons*/
  let brushStart = width - 190;
  buttons.push(new Button(brushStart - 40, height - 90, 40, new SingleSquareIcon(), brushSquare));
  buttons.push(new Button(brushStart - 80, height - 90, 40, new GliderIcon(), brushGlider));
  buttons.push(new Button(brushStart - 120, height - 90, 40, new LWSSIcon(), brushLWSS));
  buttons.push(new Button(brushStart - 80, height - 50, 40, new EraseIcon(), brushErase));
  buttons.push(new Button(brushStart - 40, height - 50, 40, new RotateIcon(), brushRotate));
  
  /*Conway creation*/
  squareSize = sizeSlider.value;
  let wpix = Math.ceil(width / squareSize);
  let hpix = Math.ceil(height / squareSize);
  conways = blankConways(wpix, hpix);
}

function draw() {


  /*Resize conway array on slider manipulation*/
  if (sizeSlider.value != oldSize) {
    squareSize = sizeSlider.value;
    let wpix = Math.ceil(width / squareSize);
    let hpix = Math.ceil(height / squareSize);
    conways = blankConways(wpix, hpix);
    oldSize = sizeSlider.value;
  }
  background(220);
  rectMode(CORNERS);
  stroke(100);
  
  /*Test if user if hovering over any of the buttons*/
  buttons.forEach(button => button.state = button.getState(mouseX, mouseY));
  
  /*Limit the fram rate of the simulation*/
  if (playing && millis() - lastPlay > speedSlider.value) {
    conways = newConways(conways);
    playing --;
    lastPlay = millis();
  }
  
  /*If the user has a brush selected, draw the hover of it*/
  if (brush) {
    drawHover(mouseX, mouseY, brush);
  }
  
  /*Draw grid lines and filled in squares*/
  conways.forEach(function (horiz_arr, i) {
    line(0, i * squareSize, width, i * squareSize);
    horiz_arr.forEach(function (value, j) {
      if (i == 0) {
        line(j * squareSize, 0, j * squareSize, height);
      }
      if (value == 1) {
        drawSquare(j * squareSize, i * squareSize, squareSize, 0);
      }
    });
  });
  
  /*Draw button containers and buttons*/
  fill(220);
  stroke(0);
  rectMode(CORNERS);
  rect(width - 180, height - 100, width, height);
  rect(width - 320, height - 100, width - 180, height);
  buttons.forEach(button => button.draw());
  fill(0);
  text(`Spd: ${speedSlider.value} ms`, width - 170, height - 15);
  text(`Size: ${sizeSlider.value} px`, width - 90, height - 15);
}





/*FUNCTIONS WITH SIDE EFFECTS*/
function drawSquare(x, y, size, color) {
  /*Draws a square with top left corner at x, y*/
  push();
  rectMode(CORNER);
  fill(color);
  stroke(0);
  rect(x, y, size);
  pop();
}

function drawHover(x, y, hover) {
  /*Maps a 2d array onto the background array as grey squares*/
  let posX = Math.floor(x / squareSize) * squareSize;
  let posY = Math.floor(y / squareSize) * squareSize;
  let halfSizeX = Math.floor(hover[0].length / 2);
  let halfSizeY = Math.floor(hover.length / 2);
  for (var i = - halfSizeY; i <= halfSizeY; i++) {
    for (var j = - halfSizeX; j <= halfSizeX; j++) {
      if (hover[i + halfSizeY][j + halfSizeX] == 1) {
        drawSquare(posX + j * squareSize, posY + i * squareSize,
                   squareSize, 128);
      }
    }
  }
}

function placeHover(x, y, hover) {
  /*Places a 2D array onto the background array*/
  let indX = Math.floor(x / squareSize);
  let indY = Math.floor(y / squareSize);
  let halfSizeX = Math.floor(hover[0].length / 2);
  let halfSizeY = Math.floor(hover.length / 2);
  for (var i = - halfSizeY; i <= halfSizeY; i++) {
    for (var j = - halfSizeX; j <= halfSizeX; j++) {
      if (buttons[7].selected) {
        conways[indY][indX] = 0;
      }
      else if (hover[i + halfSizeY][j + halfSizeX] == 1) {
        conways[indY + i][indX + j] = 1;
      }
    }
  }
}

function mousePressed() {
  /*CHeck if the buttons have been pressed*/
  for (button of buttons) {
    if (button.state == "hovered") {
      button.state = "pressed";
    }
  }
  /*Check if the user wants to paint onto the canvas, and is not in range of the buttons*/
  if (brush) {
    if (!isInRectangle(mouseX, mouseY, width - 320, height - 100, width, height)) {
      placeHover(mouseX, mouseY, brush);
    }
  }
}

function mouseDragged() {
  /*Check if the user would like to drag and draw (for the basic square shape*/
  if (brush) {
    if (!isInRectangle(mouseX, mouseY, width - 320, height - 100, width, height)) {
      placeHover(mouseX, mouseY, brush);
    }
  }
}

function mouseReleased() {
  /*Buttons are pressed upon release*/
  for (button of buttons) {
    if (button.state == "pressed") {
      button.press();
      button.state = "unpressed";
    }
  }
}

/*BUTTON FUNCTIONS*/
function play() {
  /*Sets the number of executions to 'a lot' (277 hours at 100ms steps)*/
  playing = 9999999;
  buttons[1].icon = new PauseIcon(buttons[1].size);
  buttons[1].func = pause;
  lastPlay = millis();
}

function pause() {
  /*Stops all execution*/
  playing = 0;
  this.icon = new PlayIcon(this.size);
  this.func = play;
}

function step() {
  /*Sets the number of executions to just 1*/
  playing = 1;
}

function resetConways() {
  /*Blank the background array*/
  for (var i = 0; i < conways.length; i++) {
    for (var j = 0; j < conways[i].length; j++) {
      conways[i][j] = 0;
    }
  }
  playing = 0;
  buttons[1].icon = new PlayIcon(buttons[1].size);
  buttons[1].func = play;
}

function randomizeConways() {
  /*Randomise the background array*/
  let fractionBlack = 0.2
  for (i = 0; i < conways.length; i++) {
    for (j = 0; j < conways[i].length; j++) {
      conways[i][j] = (Math.random() > 1 - fractionBlack) ? 1 : 0;
    }
  }
  playing = 0;
  buttons[1].icon = new PlayIcon(buttons[1].size);
  buttons[1].func = play;
}

function brushRotate() {
  /*Rotate the brush (for complex shapes)*/                        
  brush = rotateMatrix(brush);
}

function brushErase() {
  /*Set brush to erase mode (note this is identical to square mode)*/
  newBrush = [[1]];
  if (this.selected) {
    this.selected = false;
    brush = undefined;
  }
  else if (!this.selected) {
    brush = newBrush;
    buttons.forEach(button => button.selected = false);
    this.selected = true;
  }
}

function brushSquare() {
  /*Set brush to square mode*/
  newBrush = [[1]];
  if (this.selected) {
    this.selected = false;
    brush = undefined;
  }
  else if (!this.selected) {
    brush = newBrush;
    buttons.forEach(button => button.selected = false);
    this.selected = true;
  }
}

function brushGlider() {
  /*Set brush to draw gliders*/
  newBrush = [[0, 0, 1],
              [1, 0, 1],
              [0, 1, 1]];
  if (this.selected) {
    this.selected = false;
    brush = undefined;
  }
  else if (!this.selected) {
    brush = newBrush;
    buttons.forEach(button => button.selected = false);
    this.selected = true;
  } 
}

function brushLWSS() {
  /*Set brush to draw lightweight spaceships*/
  newBrush = [[0, 1, 0, 0, 1],
              [1, 0, 0, 0, 0],
              [1, 0, 0, 0, 1],
              [1, 1, 1, 1, 0],
              [0, 0, 0, 0, 0]];
  if (this.selected) {
    this.selected = false;
    brush = undefined;
  }
  else if (!this.selected) {
    brush = newBrush;
    buttons.forEach(button => button.selected = false);
    this.selected = true;
  } 
}

/*PURE FUNCTIONS*/
function countNeighbours(x, y, arr) {
  /*Given a position in the array, count the number of neighbours it has*/
  let total = 0;
  for (i = y - 1; i <= y + 1; i++) {
    for (j = x - 1; j <= x + 1; j++) {
      if (i == y && j == x) {
        continue;
      }
      if (i < 0 || i >= arr.length) {
        continue;
      }
      if (j < 0 || j >= arr[i].length) {
        continue;
      }
      total += arr[i][j];
    }
  }
  return total;
}

function liveOrDie(value, neighbours) {
  /*Conway's basic rules - if a live cell has 2 or 3 neighbours, it stays alive. If a dead cell has 3 neighbours, it becomes alive. Otherwise, it is dead*/
  if (value == 1 && (neighbours == 2 || neighbours == 3)) {
    return 1;
  }
  else if (value == 0 && neighbours == 3) {
    return 1;
  }
  else {
    return 0;
  }
}

function newConways(arr) {
  /*Create a new conway array based on conway's rules of neighbourhood*/
  new_arr = new Array(arr.length);
  for (i = 0; i < new_arr.length; i++) {
    new_arr[i] = new Array(arr[0].length);
  }
  for (var i = 0; i < arr.length; i++) {
    for (var j = 0; j < arr[0].length; j++) {
      new_arr[i][j] = liveOrDie(arr[i][j], countNeighbours(j, i, arr));
    }
  }
  return new_arr;
}

function rotateMatrix(matrix) {
  /*Rotate a matrix by 90 degrees*/
  const N = matrix.length - 1;
  const result = matrix.map((row, i) => 
                            row.map((val, j) =>
                                    matrix[N - j][i]));
  return result
}

function isInRectangle(x, y, x1, y1, x2, y2) {
  /*Returns true if x and y fall within the rectangle created by x1, y1, x2 and y2 (top left and bottom right corner)*/
  if (x > x1 && x < x2
      && y > y1 && y < y2) {
    return true;
  }
  return false;
}

function blankConways(w, h) {
  /*Create a blank conways array*/
  let new_arr = new Array(h);
  for (i = 0; i < new_arr.length; i++) {
    new_arr[i] = new Array(w).fill(0);
  }
  return new_arr;
}


/*CLASSES*/
class Button {
  constructor(x, y, size, icon, func) {
    this.pos = createVector(x, y);
    this.size = size;
    this.state = "unpressed";
    this.selected = false;
    this.icon = icon;
    this.func = func;
  }
  draw() {
    /*Draw the button onto the canvas*/
    push();
    rectMode(CORNER);
    fill(255);
    stroke(0);
    if (this.state == "pressed") {
      fill(150);
    }
    else if (this.state == "hovered") {
      fill(200);
    }
    strokeWeight(1);
    if (this.selected) {
      strokeWeight(5);
    }
    translate(this.pos.x, this.pos.y);
    rect(0, 0, this.size);
    strokeWeight(1);
    translate(this.size/2, this.size/2);
    this.icon.draw(this.size);
    pop();
  }
  getState(mX, mY) {
    /*Get the state of this button*/
    if (this.state == "pressed") {
      return "pressed";
    }
    else if (mX > this.pos.x && mX < this.pos.x + this.size
       && mY > this.pos.y && mY < this.pos.y + this.size) {
      return "hovered";
    }
    else {
      return "unpressed";
    }
  }
  press() {
    /*Execute this button's function*/
    this.func();
  }
}

/*THE FOLLOWING CLASSES ARE ALL ICONS USED FOR THE BUTTONS*/
class PlayIcon {
  draw(size) {
    push();
    noStroke();
    fill(0);
    triangle(-size / 4, -size / 4,
             -size / 4, size / 4,
             size / 4, 0);
    pop();
  }
}

class PauseIcon {
  draw(size) {
    push();
    noStroke();
    fill(0);
    rectMode(CENTER);
    rect(-size / 6, 0, size / 8, size / 2);
    rect( size / 6, 0, size / 8, size / 2);
    pop();
  }
}


class StepIcon {
  draw(size) {
    push();
    noStroke();
    fill(0);
    triangle(-size / 4, -size / 4,
             -size / 4, size / 4,
             0, 0);
    triangle(0, -size / 4,
             0, size / 4,
             size / 4, 0);
    pop();
  }
}

class RotateIcon {
  draw(size) {
    push();
    noFill();
    stroke(0);
    strokeWeight(size / 6);
    arc(0, 0, 2 * size / 3, 2 * size / 3, PI / 4, 2*PI - PI / 4);
    rotate(PI / 4);
    translate(size / 3, 0);
    let triangleSize = size / 16;
    triangle(-triangleSize, 0, triangleSize, 0, 0, -triangleSize);
    pop();
  }
}

class StopIcon {
  draw(size) {
    push();
    fill(0);
    rectMode(CENTER);
    rect(0, 0, size / 2);
    pop();
  }
}

class RandomIcon {
  draw(size) {
    push();
    noFill();
    strokeWeight(size / 20);
    rectMode(CORNERS);
    translate(-size / 16, size / 16);
    rect(-size / 4, -size / 4, size / 4, size / 4);
    let offset = size / 8;
    quad(-size / 4, -size / 4,
         - size / 4 + offset, - size / 4 - offset,
         size / 4 + offset, -size / 4 - offset,
         size / 4, -size / 4);
    quad(size / 4, - size / 4,
         size / 4 + offset, -size / 4 - offset,
         size / 4 + offset, size / 4 - offset,
         size / 4, size / 4);
    strokeWeight(1);
    fill(0);
    ellipse(0, 0, size / 16);
    ellipse(size / 8, size / 8, size / 16);
    ellipse(size / 8, -size / 8, size / 16);
    ellipse(-size / 8, -size / 8, size / 16);
    ellipse(-size / 8, size / 8, size / 16);
    pop();
  }
}

class EraseIcon {
  draw(size) {
    push();
    rotate(PI / 4);
    rectMode(CENTER);
    fill(0);
    rect(0, size / 4, size / 4, size / 2);
    fill(255);
    rect(0, -size / 4, size / 4, size / 2);
    pop()
  }
}

class SingleSquareIcon {
  draw(size) {
    push();
    noStroke();
    fill(0);
    rectMode(CENTER);
    rect(0, 0, 10);
    pop();
  }
}

class GliderIcon {
  draw(size) {
    push();
    noStroke();
    fill(0);
    let sq = (size - 10) / 3;
    rectMode(CENTER);
    rect(sq, -sq, sq);
    rect(sq, 0, sq);
    rect(sq, sq, sq);
    rect(0, sq, sq);
    rect(-sq, 0, sq);
    pop();
  }
}

class LWSSIcon {
  draw(size) {
    push();
    noStroke();
    fill(0);
    let sq = Math.floor((size - 10) / 5);
    rectMode(CENTER);
    rect(-sq, -2*sq, sq);
    rect(2*sq, -2*sq, sq);
    rect(-2*sq, -sq, sq);
    rect(-2*sq, 0, sq);
    rect(2*sq, 0, sq);
    rect(-2*sq, sq, sq);
    rect(-sq, sq, sq);
    rect(0, sq, sq);
    rect(sq, sq, sq);
    pop();
  }
}