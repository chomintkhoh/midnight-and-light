/* ══════════════════════════════════════════════
   REAL CONTENT — Japanese Kanji (Phase 2 pilot)
   水 chosen deliberately: a simple, unambiguous kanji
   with both an onyomi and a kunyomi reading, and a
   real example-vocabulary reference (not embedded text).
══════════════════════════════════════════════ */

export const JA_KANJI_PILOT = {
  "ja-kanji-水": {
    id: "ja-kanji-水", language: "ja", domain: "kanji",
    character: "水",
    readings: [
      { reading: "スイ", type: "onyomi" },
      { reading: "みず", type: "kunyomi" }
    ],
    meaning: "water",
    furigana: "みず",
    exampleVocabulary: ["ja-vocab-mizu"] // reference into the real vocabulary pilot above
  }
};
