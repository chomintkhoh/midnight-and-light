/* ══════════════════════════════════════════════
   REAL CONTENT — Mandarin Characters (Phase 2 pilot)

   日 (sun) and 月 (moon) are each independently real,
   standalone characters — AND are referenced as the
   (genuinely correct, semantic) components of 明 (bright).
   This is not a synthetic example: 明's traditional
   radical classification really is 日, and its component
   breakdown really is 日 + 月.

   行 is included separately to demonstrate a genuinely
   polyphonic character (xíng / háng) — 明 is not
   polyphonic, so a second character was needed to prove
   this specific capability with real data rather than
   force it onto content that doesn't actually have it.
══════════════════════════════════════════════ */

export const ZH_CHARACTER_PILOT = {
  "zh-char-日": {
    id: "zh-char-日", language: "zh", domain: "character",
    character: "日",
    readings: [{ pinyin: "rì", tone: 4 }],
    meaning: "sun / day",
    radical: "zh-radical-日",
    components: [],
    strokeCount: 4
  },

  "zh-char-月": {
    id: "zh-char-月", language: "zh", domain: "character",
    character: "月",
    readings: [{ pinyin: "yuè", tone: 4 }],
    meaning: "moon / month",
    radical: null, // 月's own traditional radical is itself — not modelled separately in this small pilot
    components: [],
    strokeCount: 4
  },

  "zh-char-明": {
    id: "zh-char-明", language: "zh", domain: "character",
    character: "明",
    readings: [{ pinyin: "míng", tone: 2 }],
    meaning: "bright",
    radical: "zh-radical-日", // genuinely correct traditional classification
    components: [
      { contentId: "zh-char-日", role: "semantic" },
      { contentId: "zh-char-月", role: "semantic" }
    ],
    strokeCount: 8
  },

  "zh-char-行": {
    id: "zh-char-行", language: "zh", domain: "character",
    character: "行",
    readings: [
      { pinyin: "xíng", tone: 2, meaningContext: "to go" },
      { pinyin: "háng", tone: 2, meaningContext: "row / profession" }
    ],
    meaning: "to go / row, profession",
    radical: null, // 行 is itself a traditional radical (#144) — not separately modelled in this small pilot
    components: [],
    strokeCount: 6
  }
};
