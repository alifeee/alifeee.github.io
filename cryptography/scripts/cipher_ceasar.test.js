import { encode, decode, trigramScore, crack } from "./cipher_caesar";
import trigrams from "../stats/trigrams.json";

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
  it("should have access to the trigrams frequency table", () => {
    expect(trigrams).not.toBeNull();
  });

  it("should crack a simple message", () => {
    const { shift, message } = crack("khoor", trigrams);

    expect(shift).toBe(3);
    expect(message).toBe("hello");
  });

  it("should be case-insensitive", () => {
    const { shift, message } = crack("KHOOR", trigrams);

    expect(shift).toBe(3);
    expect(message).toBe("HELLO");
  });

  it("should crack a longer message", () => {
    const { shift, message } = crack(
      "gur dhvpx oebja sbk whzcf bire gur ynml qbt",
      trigrams
    );

    expect(shift).toBe(13);
    expect(message).toBe("the quick brown fox jumps over the lazy dog");
  });
});
