// ALfie Renn
// 16/8/2020
// Common functions for crypto

// %% Common cryptography functions
var Common = {};

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
