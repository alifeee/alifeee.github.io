// functions to encode, decode and crack Caesar ciphers

import trigrams_json from "../stats/trigrams.json";
const default_trigrams: Record<string, number> = trigrams_json;

export function encode(message: string, shift: number): string {
  /**
   * Encodes a message by shifting each letter by a specified number of positions in the alphabet.
   *
   * @param {string} message - The message to encode.
   * @param {number} shift - The number of positions to shift each letter by.
   * @returns {string} The encoded message.
   */
  const regex = /[a-z]/i;

  return message
    .split("")
    .map((letter) => {
      if (regex.test(letter)) {
        const startCode =
          letter.toLowerCase() === letter
            ? "a".charCodeAt(0)
            : "A".charCodeAt(0);
        const code =
          ((((letter.charCodeAt(0) - startCode + shift) % 26) + 26) % 26) +
          startCode;
        return String.fromCharCode(code);
      } else {
        return letter;
      }
    })
    .join("");
}

encode("hello", 3);

export function decode(message: string, shift: number): string {
  /**
   * Decodes an encoded message by shifting each letter back by a specified number of positions in the alphabet.
   *
   * @param {string} message - The encoded message to decode.
   * @param {number} shift - The number of positions the original message was shifted by.
   * @returns {string} The decoded message.
   */
  const decodedMessage = encode(message, -shift);
  return decodedMessage;
}

export function trigramScore(
  message: string,
  trigrams: Record<string, number>
): number {
  /**
   * Computes the trigram score of a message based on a given trigram frequency table.
   *
   * @param {string} message - The message to compute the trigram score of.
   * @param {Record<string, number>} trigrams - A frequency table of trigrams.
   * @returns {number} The trigram score of the message.
   */
  message = message.replace(/[^a-z]/gi, "");
  const trigramsCount = message.length - 2;
  let score = 0;

  for (let i = 0; i < trigramsCount; i++) {
    const trigram = message.slice(i, i + 3).toUpperCase();

    const trigramFrequency = trigrams[trigram] ?? 0.1;
    const trigramScore = Math.log10(trigramFrequency / trigrams.total);

    score += trigramScore;
  }

  return score;
}

export function crack(
  message: string,
  trigrams: Record<string, number>
): string {
  /**
   * Cracks an encoded message by brute force, using trigram frequency analysis to find the most likely decryption.
   *
   * @param {string} message - The encoded message to crack.
   * @param {Record<string, number>} trigrams - A frequency table of trigrams.
   * @returns {string} The decrypted message.
   */
  const decodedMessages = [...Array(26).keys()].map((shift) =>
    decode(message, shift)
  );
  const trigramScores = decodedMessages.map((decodedMessage) =>
    trigramScore(decodedMessage, trigrams)
  );

  const maxScore = Math.max(...trigramScores);
  const maxScoreIndex = trigramScores.indexOf(maxScore);
  const crackedMessage = decodedMessages[maxScoreIndex];
  return crackedMessage;
}