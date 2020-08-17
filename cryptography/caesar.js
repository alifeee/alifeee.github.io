// Alfie Renn
// 16/8/2020
// Functions providing use of the caesar cipher
//      abcdefghijklmnopqrstuvwxyz
// abcdefghijklmnopqrstuvwxyz

// %% Caesar functions
var Caesar = {};

Caesar.encode = function(message, shift) {
  let letterList = message.split("");
  return letterList.map(x =>
    (Common.isAlphabetic(x)) ? Common.shiftLetter(x, shift) : x).join("");
}

Caesar.decode = function(message, shift) {
  return this.encode(message, -shift);
}



// %% HTML Embedding
Caesar.shiftSlider = document.getElementById("caesar_slider");
Caesar.shiftInfo = document.getElementById("caesar_shift_label");
Caesar.alphabetInfo = document.getElementById("caesar_alphabet");
Caesar.rawTextBox = document.getElementById("caesar_raw");
Caesar.encodedTextBox = document.getElementById("caesar_encoded");
Caesar.shift = parseInt(Caesar.shiftSlider.value);
Caesar.shiftInfo.innerHTML = Caesar.shift;
Caesar.alphabetInfo.innerHTML = Caesar.encode("ABCDEFGHIJKLMNOPQRSTUVWXYZ", Caesar.shift);
Caesar.sliderMode = false;

// %% Button Functions
Caesar.sliderShift = function() {
  this.shift = parseInt(this.shiftSlider.value);
  this.shiftInfo.innerHTML = this.shift;
  this.alphabetInfo.innerHTML = Caesar.encode("ABCDEFGHIJKLMNOPQRSTUVWXYZ", this.shift);
  if (this.sliderMode === "encoding") {
    this.encodedTextBox.value = this.encode(this.rawTextBox.value, this.shift);
  }
  else if (this.sliderMode === "decoding") {
    this.rawTextBox.value = this.decode(this.encodedTextBox.value, this.shift);
  }
}

Caesar.buttonEncode = function() {
  let toEncode = this.rawTextBox.value;
  this.encodedTextBox.value = this.encode(toEncode, this.shift);
  this.sliderMode = "encoding";
}

Caesar.buttonDecode = function() {
  let toDecode = this.encodedTextBox.value;
  this.rawTextBox.value = this.decode(toDecode, this.shift);
  this.sliderMode = "decoding";
}

Caesar.buttonAutoDecode = async function() {
  if (!Common.trigrams) {
    Common.trigrams = await Common.loadTrigrams();
  }

  let toDecode = this.encodedTextBox.value
  .split("")
  .filter(x => Common.isAlphabetic(x))
  .map(x => x.toUpperCase())
  .join("");

  let triVals = [...Array(26).keys()]
    .map(x => this.decode(toDecode, x))
    .map(x => Common.evalTrigrams(x, Common.trigrams));

  let shift = triVals.indexOf(Math.max(...triVals));

  Caesar.shiftSlider.value = shift;
  Caesar.sliderShift();
  Caesar.rawTextBox.value = this.decode(this.encodedTextBox.value, shift);
}
