/* ══════════════════════════════════════════════
   REAL CONTENT — Mandarin Vocabulary (Phase 2 pilot)
   Both words deliberately use ONLY characters that exist
   in this same pilot (日/月/行) — no dangling references,
   so resolution can be verified against real, complete data.
══════════════════════════════════════════════ */

export const ZH_VOCAB_PILOT = {
  "zh-vocab-日月": {
    id: "zh-vocab-日月", language: "zh", domain: "vocabulary",
    term: "日月",
    readings: [{ pinyin: "rì", tone: 4 }, { pinyin: "yuè", tone: 4 }],
    meaning: "sun and moon",
    characters: ["zh-char-日", "zh-char-月"], // vocabulary owns the reference — approved direction
    audio: "rìyuè"
  },
  "zh-vocab-行": {
    id: "zh-vocab-行", language: "zh", domain: "vocabulary",
    term: "行",
    readings: [{ pinyin: "xíng", tone: 2 }],
    meaning: "OK / alright (colloquial)",
    characters: ["zh-char-行"],
    audio: "xíng"
  }
};
