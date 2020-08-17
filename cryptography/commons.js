// ALfie Renn
// 16/8/2020
// Common functions for crypto

// %% Common cryptography functions
var Common = {};

// %% Pure Functions - Letter functions
Common.shiftLetter = function(letter, shift = 0) {
  let min, max;
  ind = letter.charCodeAt(0);
  if (ind > 96 && ind < 123) {min = 97; max = 122;}
  else if (ind > 64 && ind < 91) {min = 65; max = 90;}
  else {console.log("ERROR in shiftLetter");}
  ind += shift;
  while (!(ind >= min)) {
    ind += 26;
  }
  while (!(ind <= max)) {
    ind -=26;
  }
  return String.fromCharCode(ind);
}

Common.isLowercase = function(letter) {
  let pos = letter.charCodeAt(0);
  return (pos > 96 && pos < 123);
}

Common.isUppercase = function(letter) {
  let pos = letter.charCodeAt(0);
  return (pos > 64 && pos < 91);
}

Common.isAlphabetic = function(letter) {
  return (this.isLowercase(letter) || this.isUppercase(letter));
}



// %% Pure Functions - Trigram statistics
Common.evalTrigrams = function(message, trigrams) {
  return [...Array(message.length - 2).keys()]
  .map(x => message.slice(x, x+3))
  .map(x => Math.log10((trigrams[x] || 0.1) / trigrams.total))
  .reduce((a, b) => a + b);
}



// %% Impure functions - Trigram statistics
Common.loadTrigrams = function() {
  if (Common.trigrams) {
    return Common.trigrams;
  }
  else {
    return $.getJSON("trigrams.json", function(json) {
      json.total = Object.values(json).reduce((a,b) => parseInt(a) + parseInt(b));
      return json;
    })
  }
}

// %% Impure functions
Common.clear = function(box) {
  toClear = document.getElementById(box);
  toClear.value = "";
}

Common.copy = function(box) {
  toCopy = document.getElementById(box);
  toCopy.select();
  toCopy.setSelectionRange(0, 99999);

  document.execCommand("copy")
}
