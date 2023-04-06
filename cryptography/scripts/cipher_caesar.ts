// functions to encode, decode and crack Caesar ciphers
// functions:
// encode(message, shift)
// decode(message, shift)
// crack(message)

// import * as trigrams_untyped from "../stats/trigrams.json";
// type Trigrams = {
//   [key: string]: number;
// };
// const trigrams: Trigrams = trigrams_untyped;
import trigrams_json from "../stats/trigrams.json";
const default_trigrams: Record<string, number> = trigrams_json;

export function encode(message: string, shift: number): string {
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

export function decode(message: string, shift: number): string {
  // To decode, we simply use the negative of the shift value
  const decodedMessage = encode(message, -shift);
  return decodedMessage;
}

export function trigramScore(
  message: string,
  trigrams: Record<string, number>
): number {
  // remove non-alphabetic characters
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
  // Decode the message with all possible shifts
  // the message with the highest trigram score is the most likely to be the correct one
  const decodedMessages = [...Array(26).keys()].map((shift) =>
    decode(message, shift)
  );
  const trigramScores = decodedMessages.map((decodedMessage) =>
    trigramScore(decodedMessage, trigrams)
  );
  // for (let i = 0; i < 26; i++) {
  // console.log(
  //   `Shift: ${i}, Score: ${trigramScores[i]}, Message: ${decodedMessages[i]}`
  // );
  // }

  const maxScore = Math.max(...trigramScores);
  const maxScoreIndex = trigramScores.indexOf(maxScore);
  const crackedMessage = decodedMessages[maxScoreIndex];
  return crackedMessage;
}
