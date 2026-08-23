/* ══════════════════════════════════════════════
   PREPARE — Reading
   Reading passage content (domain: "reading") is its
   own content domain — distinct from vocabulary and
   from sentence.

   Phase 3 (Feature B): every line's resolved output is
   ALWAYS a token array — never conditionally a string.
   A legacy line (authored with text/vocabRef/vocabRefs,
   exactly as before) resolves to a ONE-token array with
   annotation:null — visually and functionally identical
   to the old {jp: "..."} output. A newly-authored line
   using `tokens:` resolves to multiple tappable tokens.
   The renderer therefore never branches on "is this old
   or new content" — it only ever asks "does this token
   have an annotation or not."

   Per line (legacy fields):
     text override (if present) always wins for display,
     but vocabRef/vocabRefs are still resolved and kept
     for content-linking, so a literal-override line is
     never "unlinked" from the real content it's about.
══════════════════════════════════════════════ */

import { resolveField } from "./matching-prepare.js";

const FIXED_PRONOUN = "わたし"; // same Step 2 compatibility shim, no pronoun-choice UI yet

function resolveVocabText(vocabRef, getContent, adapter) {
  const item = getContent(vocabRef);
  if (!item) return null;
  if (item.template) {
    return item.template.replace("{{pronoun}}", FIXED_PRONOUN); // {{name}} left for T() at render time
  }
  const display = adapter.formatDisplay(item);
  return (display && display.text) || resolveField(item, "term", adapter);
}

// Builds the {reading, meaning, tone, contentId} annotation for one vocabRef,
// from data the content item already has — no new vocabulary schema field.
//
// KNOWN LIMITATIONS (accepted, not fixed — see Phase 3 status report):
// 1. Only readings[0] is used — a multi-syllable word's annotation shows
//    just its first syllable's reading (e.g. 你好 shows "nǐ", not "nǐ hǎo").
// 2. Japanese vocabulary items with no `readings` field (true of all of
//    today's real Unit 1 kana-only content) produce annotation.reading:null
//    — the reveal falls back to meaning-only, which the renderer already
//    handles gracefully, but there's no reading shown for these items.
function buildAnnotation(vocabRef, getContent) {
  const item = getContent(vocabRef);
  if (!item) return null;
  const firstReading = Array.isArray(item.readings) && item.readings.length ? item.readings[0] : null;
  return {
    reading: firstReading ? (firstReading.reading || firstReading.pinyin || null) : null,
    meaning: item.meaning || null,
    tone: firstReading && firstReading.tone != null ? firstReading.tone : null,
    contentId: item.id
  };
}

export function resolveReadingPassage(passageContentItem, { getContent, adapter }) {
  const lines = passageContentItem.lines.map(line => {
    if (line.stage) return { stage: line.stage };

    let tokens;

    if (line.tokens) {
      // New shape — per-token resolution, each vocabRef token becomes its
      // own tappable unit; literal {text} tokens are never tappable.
      tokens = line.tokens.map(tok => {
        if (tok.text != null) return { text: tok.text, annotation: null };
        const text = resolveVocabText(tok.vocabRef, getContent, adapter);
        return { text, annotation: buildAnnotation(tok.vocabRef, getContent) };
      });
    } else {
      // Legacy shape — unchanged resolution logic, then wrapped as ONE
      // non-annotated token so the renderer's code path never differs.
      let jp;
      if (line.text != null) {
        jp = line.text;
      } else if (line.vocabRefs) {
        jp = line.vocabRefs.map(ref => resolveVocabText(ref, getContent, adapter)).join("");
      } else {
        jp = resolveVocabText(line.vocabRef, getContent, adapter);
      }
      tokens = [{ text: jp, annotation: null }];
    }

    return {
      speaker: line.speaker,
      tokens,
      // Additive — kept for future content-linking, same as before.
      vocabRefs: line.vocabRefs || (line.vocabRef ? [line.vocabRef] : []) ||
        (line.tokens ? line.tokens.filter(t => t.vocabRef).map(t => t.vocabRef) : [])
    };
  });

  return { id: passageContentItem.id, lines };
}
