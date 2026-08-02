/* ══════════════════════════════════════════════
   REAL CONTENT — Mandarin Characters, Unit 1: Greetings
   Radical/component breakdowns are simplified for a
   beginner lesson (not exhaustive etymology) but every
   one given is genuinely accurate, not invented.
   兴 is included deliberately as a real polyphonic
   character (xīng "to rise" / xìng "mood, interest") —
   distinct from the pilot's 行, using different tones.
══════════════════════════════════════════════ */

export const ZH_CHARACTER_UNIT1 = {
  "zh-char-你": { id: "zh-char-你", language: "zh", domain: "character", character: "你", readings: [{ pinyin: "nǐ", tone: 3 }], meaning: "you", radical: null, components: [], strokeCount: 7 },
  "zh-char-女": { id: "zh-char-女", language: "zh", domain: "character", character: "女", readings: [{ pinyin: "nǚ", tone: 3 }], meaning: "woman", radical: "zh-radical-女", components: [], strokeCount: 3 },
  "zh-char-子": { id: "zh-char-子", language: "zh", domain: "character", character: "子", readings: [{ pinyin: "zǐ", tone: 3 }], meaning: "child / son", radical: "zh-radical-子", components: [], strokeCount: 3 },
  "zh-char-好": {
    id: "zh-char-好", language: "zh", domain: "character", character: "好",
    readings: [{ pinyin: "hǎo", tone: 3 }], meaning: "good",
    radical: "zh-radical-女",
    components: [{ contentId: "zh-char-女", role: "semantic" }, { contentId: "zh-char-子", role: "semantic" }],
    strokeCount: 6
  },
  "zh-char-我": { id: "zh-char-我", language: "zh", domain: "character", character: "我", readings: [{ pinyin: "wǒ", tone: 3 }], meaning: "I / me", radical: null, components: [], strokeCount: 7 },
  "zh-char-是": { id: "zh-char-是", language: "zh", domain: "character", character: "是", readings: [{ pinyin: "shì", tone: 4 }], meaning: "to be / am / is", radical: "zh-radical-日", components: [], strokeCount: 9 },
  "zh-char-口": { id: "zh-char-口", language: "zh", domain: "character", character: "口", readings: [{ pinyin: "kǒu", tone: 3 }], meaning: "mouth", radical: "zh-radical-口", components: [], strokeCount: 3 },
  "zh-char-叫": {
    id: "zh-char-叫", language: "zh", domain: "character", character: "叫",
    readings: [{ pinyin: "jiào", tone: 4 }], meaning: "to be called / to shout",
    radical: "zh-radical-口",
    components: [{ contentId: "zh-char-口", role: "semantic" }],
    strokeCount: 5
  },
  "zh-char-名": {
    id: "zh-char-名", language: "zh", domain: "character", character: "名",
    readings: [{ pinyin: "míng", tone: 2 }], meaning: "name",
    radical: "zh-radical-口",
    components: [{ contentId: "zh-char-口", role: "semantic" }],
    strokeCount: 6
  },
  "zh-char-字": {
    id: "zh-char-字", language: "zh", domain: "character", character: "字",
    readings: [{ pinyin: "zì", tone: 4 }], meaning: "character / word",
    radical: "zh-radical-子",
    components: [{ contentId: "zh-char-子", role: "semantic" }],
    strokeCount: 6
  },
  "zh-char-很": { id: "zh-char-很", language: "zh", domain: "character", character: "很", readings: [{ pinyin: "hěn", tone: 3 }], meaning: "very", radical: null, components: [], strokeCount: 9 },
  "zh-char-高": { id: "zh-char-高", language: "zh", domain: "character", character: "高", readings: [{ pinyin: "gāo", tone: 1 }], meaning: "tall / high", radical: null, components: [], strokeCount: 10 },
  "zh-char-兴": {
    id: "zh-char-兴", language: "zh", domain: "character", character: "兴",
    readings: [
      { pinyin: "xīng", tone: 1, meaningContext: "to rise / to prosper" },
      { pinyin: "xìng", tone: 4, meaningContext: "mood / interest (as in 高兴, happy)" }
    ],
    meaning: "to rise / mood, interest", radical: null, components: [], strokeCount: 6
  },
  "zh-char-认": { id: "zh-char-认", language: "zh", domain: "character", character: "认", readings: [{ pinyin: "rèn", tone: 4 }], meaning: "to recognize", radical: "zh-radical-讠", components: [], strokeCount: 4 },
  "zh-char-识": { id: "zh-char-识", language: "zh", domain: "character", character: "识", readings: [{ pinyin: "shí", tone: 2 }], meaning: "to know", radical: "zh-radical-讠", components: [], strokeCount: 7 }
};
