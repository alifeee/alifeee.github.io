const { encode, decode, trigramScore, crack } = require('./cipher_caesar');
const trigrams = require("../stats/trigrams.json");

describe("encode", () => {
  it("should encode a message with a given shift", () => {
    expect(encode("hello", 3)).toBe("khoor");
    expect(encode("HELLO", 3)).toBe("KHOOR");
    expect(encode("the quick brown fox jumps over the lazy dog", 13)).toBe(
      "gur dhvpx oebja sbk whzcf bire gur ynml qbt"
    );
  });
});

describe("decode", () => {
  it("should decode a message with a given shift", () => {
    expect(decode("khoor", 3)).toBe("hello");
    expect(decode("KHOOR", 3)).toBe("HELLO");
    expect(decode("gur dhvpx oebja sbk whzcf bire gur ynml qbt", 13)).toBe(
      "the quick brown fox jumps over the lazy dog"
    );
  });
});

describe("trigramScore", () => {
  it("should score a single trigram", () => {
    const trigram = "THE";
    expect(trigramScore(trigram, trigrams)).toBe(
      Math.log10(trigrams[trigram] / trigrams.total)
    );
  });
  it("should score three trigrams", () => {
    const message = "wheel";
    expect(trigramScore(message, trigrams)).toBe(
      Math.log10(trigrams.WHE / trigrams.total) +
        Math.log10(trigrams.HEE / trigrams.total) +
        Math.log10(trigrams.EEL / trigrams.total)
    );
  });
  it("should ignore non-alphabetic characters", () => {
    const message = "wh!e  #el$";
    expect(trigramScore(message, trigrams)).toBe(
      Math.log10(trigrams.WHE / trigrams.total) +
        Math.log10(trigrams.HEE / trigrams.total) +
        Math.log10(trigrams.EEL / trigrams.total)
    );
  });
});

describe("crack", () => {
  it("should crack a message", () => {
    expect(crack("khoor", trigrams)).toBe("hello");
    expect(crack("KHOOR", trigrams)).toBe("HELLO");
    expect(crack("gur dhvpx oebja sbk whzcf bire gur ynml qbt", trigrams)).toBe(
      "the quick brown fox jumps over the lazy dog"
    );
  });
});
