/* ══════════════════════════════════════════════
   LANGUAGE ADAPTER — Mandarin Chinese
   Real tone-validation logic lives here — the shared
   core NEVER contains `if (language === "zh")` or any
   tone-related logic. The core only ever calls
   adapter.validateAnswer(userInput, questionLikeObject).

   validationMode is explicit, not inferred:
     "tone-required" — nǐhǎo and nihao are NOT equivalent (DEFAULT, per approved decision:
                        tone is an explicit learning target in this curriculum)
     "tone-optional" — nǐhǎo and nihao ARE equivalent
   Chosen per question/content item — tone-required only
   applies when a question doesn't explicitly opt out via
   validationMode: "tone-optional".

   TONE VALUE SCHEMA (applies to every `tone` field on any
   Mandarin reading object, e.g. { pinyin: "zi", tone: 0 }):
     1, 2, 3, 4 — the four lexical tones
     0          — neutral tone (轻声)
   This is the one formally defined convention for `tone`
   values across the Mandarin content model — content
   authors should never use 5, "neutral", or any other
   marker. (Note: validateAnswer below compares pinyin
   STRINGS with their diacritic marks — it does not read
   this numeric `tone` field directly. The numeric value
   is the canonical schema field for content/display and
   future validation use, not currently consulted by the
   string-comparison logic itself.)
══════════════════════════════════════════════ */

const TONE_MARK_MAP = {
  ā: "a", á: "a", ǎ: "a", à: "a",
  ē: "e", é: "e", ě: "e", è: "e",
  ī: "i", í: "i", ǐ: "i", ì: "i",
  ō: "o", ó: "o", ǒ: "o", ò: "o",
  ū: "u", ú: "u", ǔ: "u", ù: "u",
  ǖ: "v", ǘ: "v", ǚ: "v", ǜ: "v", ü: "v"
};

function stripToneMarks(str) {
  return (str || "").split("").map(ch => TONE_MARK_MAP[ch] || ch).join("");
}

function normalize(str) {
  return (str || "").trim().toLowerCase();
}

function equivalent(a, b, validationMode) {
  if (validationMode === "tone-required") {
    return normalize(a) === normalize(b);
  }
  // "tone-optional" — compare with tone marks stripped from both sides,
  // so "nǐhǎo" and "nihao" (or "ni3hao3") are treated as the same answer.
  // (No longer the default — tone-required is, per the approved decision.)
  return normalize(stripToneMarks(a)) === normalize(stripToneMarks(b));
}

export const adapter = {
  language: "zh",

  validateAnswer(userInput, contentItem) {
    const mode = contentItem.validationMode || "tone-required";

    if (contentItem.acceptedAnswers) {
      return contentItem.acceptedAnswers.some(a => equivalent(a, userInput, mode));
    }
    if (contentItem.alwaysCorrect) {
      return normalize(userInput).length > 0;
    }
    return equivalent(userInput, contentItem.term || contentItem.meaning, mode);
  },

  // Reserved for future pinyin/tone rendering above characters.
  // Not implemented as a UI in this phase — only the data shape is proven.
  formatDisplay(contentItem) {
    return {
      text: contentItem.character || contentItem.term || null,
      pinyin: contentItem.pinyin || null,
      tone: contentItem.tone || null
    };
  }
};
