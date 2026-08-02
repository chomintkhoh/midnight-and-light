/* ══════════════════════════════════════════════
   LANGUAGE ADAPTER — Japanese
   Two concerns live here, kept distinct:
   1. validateAnswer  — used by the Answer Input engine
   2. formatDisplay   — presentation concerns (e.g. furigana)

   Presentation is NOT implemented yet — this is a
   reserved slot so furigana support can be added later
   without restructuring the shared core engines.
══════════════════════════════════════════════ */

function normalize(str) {
  return (str || "").trim();
}

export const adapter = {
  language: "ja",

  validateAnswer(userInput, contentItem) {
    if (contentItem.acceptedAnswers) {
      return contentItem.acceptedAnswers.some(a => normalize(a) === normalize(userInput));
    }
    if (contentItem.alwaysCorrect) {
      return normalize(userInput).length > 0;
    }
    return normalize(userInput) === normalize(contentItem.term || contentItem.meaning);
  },

  // Reserved for future furigana rendering above kanji.
  // Not implemented in this phase — returns the term unannotated.
  formatDisplay(contentItem) {
    return {
      text: contentItem.term || null,
      furigana: null // future: [{ text, reading }] segments for kanji
    };
  }
};
