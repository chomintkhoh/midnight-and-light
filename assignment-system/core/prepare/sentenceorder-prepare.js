/* ══════════════════════════════════════════════
   PREPARE — Sentence Ordering
   Sentence content (domain: "sentence") is its own
   content type — never vocabulary, per your Step 6
   requirement. This module resolves ONE sentence
   content item into displayable {id, jp} chunks.

   Each token may be EITHER:
     { id, vocabRef }  — resolved through the content
                         registry + language adapter
     { id, text }      — a literal chunk with no
                         content backing
   A single sentence may freely mix both kinds.

   Tokenisation itself is never inferred from spaces —
   it's whatever the sentence content's `tokens` array
   says it is, which is exactly what makes this work
   for Mandarin (我/喜欢/吃/苹果, no spaces) without any
   change here.
══════════════════════════════════════════════ */

import { resolveField } from "./matching-prepare.js";

const FIXED_PRONOUN = "わたし"; // Same Step 2 compatibility shim — no pronoun-choice UI yet.

function resolveTokenText(token, getContent, adapter) {
  if (token.text != null) return token.text;

  const item = getContent(token.vocabRef);
  if (!item) return null;

  if (item.template) {
    // {{name}} deliberately left unresolved — the existing engine's T()
    // substitutes it at render time, same as Step 2's flashcards bridge.
    return item.template.replace("{{pronoun}}", FIXED_PRONOUN);
  }

  const display = adapter.formatDisplay(item);
  return (display && display.text) || resolveField(item, "term", adapter);
}

export function resolveSentenceOrderItem(sentenceContentItem, { getContent, adapter }) {
  const chunks = sentenceContentItem.tokens.map(tok => ({
    id: tok.id,
    jp: resolveTokenText(tok, getContent, adapter)
  }));

  return {
    id: sentenceContentItem.id,
    label: sentenceContentItem.label,
    chunks,
    correctOrder: sentenceContentItem.correctOrder
  };
}
