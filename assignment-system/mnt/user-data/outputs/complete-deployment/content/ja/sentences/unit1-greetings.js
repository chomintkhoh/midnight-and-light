/* ══════════════════════════════════════════════
   CONTENT — Japanese Sentences — Unit 1: Greetings
   Domain: "sentence" — its own domain, not vocabulary.
   Tokens reference vocabulary by id (vocabRef) rather
   than repeating text, per the approved Phase 3 design.
══════════════════════════════════════════════ */

export const SENTENCES = {
  "ja-sentence-self-intro": {
    id: "ja-sentence-self-intro", language: "ja", domain: "sentence",
    label: "Your self-introduction",
    tokens: [
      { id: "t1", vocabRef: "ja-vocab-hajimemashite" },
      { id: "t2", vocabRef: "ja-vocab-watashi-desu" },
      { id: "t3", vocabRef: "ja-vocab-yoroshiku" }
    ],
    correctOrder: ["t1", "t2", "t3"]
  },
  "ja-sentence-greeting-exchange": {
    id: "ja-sentence-greeting-exchange", language: "ja", domain: "sentence",
    label: "How the greeting naturally unfolds",
    tokens: [
      { id: "t1", vocabRef: "ja-vocab-konnichiwa" },
      { id: "t2", vocabRef: "ja-vocab-onamae" },
      { id: "t3", vocabRef: "ja-vocab-watashi-desu" }
    ],
    correctOrder: ["t1", "t2", "t3"]
  },
  "ja-sentence-leaving-exchange": {
    id: "ja-sentence-leaving-exchange", language: "ja", domain: "sentence",
    label: "Leaving the house",
    tokens: [
      { id: "t1", vocabRef: "ja-vocab-ittekimasu" },
      { id: "t2", vocabRef: "ja-vocab-itterasshai" }
    ],
    correctOrder: ["t1", "t2"]
  }
};
