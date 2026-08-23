/* ══════════════════════════════════════════════
   CONTENT — Japanese Sentences — Unit 2: Family
   Mixes vocabRef tokens with literal tokens — the same
   established capability already proven in Unit 1.
══════════════════════════════════════════════ */

export const SENTENCES_UNIT2 = {
  "ja-sentence-kore-wa-ane": {
    id: "ja-sentence-kore-wa-ane", language: "ja", domain: "sentence",
    label: "Introducing your older sister",
    tokens: [
      { id: "t1", text: "これは" },
      { id: "t2", vocabRef: "ja-vocab-ane" },
      { id: "t3", text: "です。" }
    ],
    correctOrder: ["t1", "t2", "t3"]
  },
  "ja-sentence-kore-wa-otouto": {
    id: "ja-sentence-kore-wa-otouto", language: "ja", domain: "sentence",
    label: "Introducing your younger brother",
    tokens: [
      { id: "t1", text: "これは" },
      { id: "t2", vocabRef: "ja-vocab-otouto" },
      { id: "t3", text: "です。" }
    ],
    correctOrder: ["t1", "t2", "t3"]
  },
  "ja-sentence-neko-mo-kazoku": {
    id: "ja-sentence-neko-mo-kazoku", language: "ja", domain: "sentence",
    label: "The cat is family too",
    tokens: [
      { id: "t1", vocabRef: "ja-vocab-neko" },
      { id: "t2", text: "も" },
      { id: "t3", vocabRef: "ja-vocab-kazoku" },
      { id: "t4", text: "です。" }
    ],
    correctOrder: ["t1", "t2", "t3", "t4"]
  }
};
