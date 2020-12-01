// Alfie Renn
// 01/12/2020
// Functions decoding and encoding binary

// %% Binary Functions
var Binary = {};

Binary.encode = function(message) {
  let letterList = message.split("")
  return letterList.map(x =>
    x.charCodeAt().toString(2)).join(" ")
}

Binary.decode = function(message) {
  let binList = message.split(" ")
  return binList.map(x =>
    String.fromCharCode(parseInt(x, 2))).join("")
}


// %% HTML Embedding
Binary.rawTextBox = document.getElementById("binary_raw");
Binary.encodedTextBox = document.getElementById("binary_encoded");


// %% Button functions
Binary.buttonEncode = function() {
  let toEncode = this.rawTextBox.value;
  this.encodedTextBox.value = this.encode(toEncode, this.shift);
  this.sliderMode = "encoding";
}

Binary.buttonDecode = function() {
  let toDecode = this.encodedTextBox.value;
  this.rawTextBox.value = this.decode(toDecode, this.shift);
  this.sliderMode = "decoding";
}
