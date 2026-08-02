/* ══════════════════════════════════════════════
   REAL CONTENT — Mandarin Reading Passage, Unit 1
   Uses only vocabulary already taught in this lesson.
   `vocabRefs` (plural) concatenates multiple vocabulary
   items into one line — the same established capability
   used in the Japanese Unit 1 reading passage.

   NOTE (content decision, not an architecture issue):
   The self-introduction line uses "我名字是{{name}}。",
   deliberately omitting the possessive particle 的 (more
   standard as "我的名字是..."), since 的 is not yet taught
   vocabulary in this lesson. This REPLACES the earlier
   "我叫{{name}}。" line rather than sitting alongside it —
   a prior revision added both lines back-to-back, which
   read as the same speaker introducing their name twice,
   two different ways, in one breath. 叫 already receives
   real contextual reinforcement elsewhere (zh-b2q3 tests
   its meaning directly; zh-b4q1 uses it in a live sentence
   frame, "我叫___。"), so removing its one appearance here
   does not leave it under-reinforced — while 是 and 名字,
   which previously had none, now get their first and only
   in-context appearance in this single line.
══════════════════════════════════════════════ */

export const ZH_READING_UNIT1 = {
  "zh-reading-unit1-greeting": {
    id: "zh-reading-unit1-greeting", language: "zh", domain: "reading",
    lines: [
      { stage: "Meeting a new classmate" },
      { speaker: "Classmate", text: "你好。", vocabRef: "zh-vocab-nihao" },
      { speaker: "{{name}}", text: "你好。", vocabRef: "zh-vocab-nihao" },
      { speaker: "{{name}}", text: "我名字是{{name}}。", vocabRefs: ["zh-vocab-mingzi", "zh-vocab-shi"] },
      { speaker: "Classmate", text: "认识你。", vocabRefs: ["zh-vocab-renshi", "zh-vocab-ni"] },
      { speaker: "{{name}}", text: "我很高兴。", vocabRefs: ["zh-vocab-wo", "zh-vocab-hen", "zh-vocab-gaoxing"] }
    ]
  }
};
