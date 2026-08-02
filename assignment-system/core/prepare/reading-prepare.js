/* ══════════════════════════════════════════════
   PREPARE — Reading
   Reading passage content (domain: "reading") is its
   own content domain — distinct from vocabulary and
   from sentence. This module resolves ONE passage's
   lines into the old {stage} / {speaker, jp} shape
   engine.js already renders, unchanged.

   Per line:
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

export function resolveReadingPassage(passageContentItem, { getContent, adapter }) {
  const lines = passageContentItem.lines.map(line => {
    if (line.stage) return { stage: line.stage };

    let jp;
    if (line.text != null) {
      jp = line.text;
    } else if (line.vocabRefs) {
      jp = line.vocabRefs.map(ref => resolveVocabText(ref, getContent, adapter)).join("");
    } else {
      jp = resolveVocabText(line.vocabRef, getContent, adapter);
    }

    return {
      speaker: line.speaker,
      jp,
      // Additive — kept for future content-linking even when `text` overrode display.
      vocabRefs: line.vocabRefs || (line.vocabRef ? [line.vocabRef] : [])
    };
  });

  return { id: passageContentItem.id, lines };
}
