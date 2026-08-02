/* ══════════════════════════════════════════════
   REAL CONTENT — Mandarin Sentences, Unit 1: Greetings
   The self-intro sentence deliberately mixes a vocabRef
   token with a literal-text token (the name placeholder),
   proving the mixed-token capability with real content —
   previously only proven with synthetic fixtures.
══════════════════════════════════════════════ */

export const ZH_SENTENCES_UNIT1 = {
  "zh-sentence-self-intro": {
    id: "zh-sentence-self-intro", language: "zh", domain: "sentence",
    label: "Your self-introduction",
    tokens: [
      { id: "t1", vocabRef: "zh-vocab-wo" },
      { id: "t2", vocabRef: "zh-vocab-jiao" },
      { id: "t3", text: "{{name}}。" } // literal — the name has no vocabulary entry of its own
    ],
    correctOrder: ["t1", "t2", "t3"]
  },
  "zh-sentence-greeting-order": {
    id: "zh-sentence-greeting-order", language: "zh", domain: "sentence",
    label: "Greeting someone and saying how you feel",
    tokens: [
      { id: "t1", text: "你好，", vocabRef: "zh-vocab-nihao" },
      { id: "t2", vocabRef: "zh-vocab-wo" },
      { id: "t3", vocabRef: "zh-vocab-hen" },
      { id: "t4", text: "高兴。", vocabRef: "zh-vocab-gaoxing" }
    ],
    correctOrder: ["t1", "t2", "t3", "t4"]
  }
};
