/* ══════════════════════════════════════════════
   PREPARE — Multiple Choice
   Per your requirement: question generation stays
   activity-specific (this module), not a universal
   generator shared with other activity types.

   Supports, per option:
     { contentId, field }  — resolved through the content registry + adapter
     { text: "..." }        — literal, authored directly

   Option ORDER is fixed by `correctPosition` (matching
   the original hand-authored correctIndex), not randomised
   — the original UI never shuffled options, so neither does this.
══════════════════════════════════════════════ */

import { resolveField } from "./matching-prepare.js";

function displayForOption(ref, field, getContent, adapter) {
  if (ref.text != null) return ref.text;
  const item = getContent(ref.contentId);
  if (!item) return null;
  if (field === "term" || field === "character") {
    // MC options historically omit the trailing 。 that flashcards/matching
    // show — preserved here as a deliberate, documented display convention
    // for this activity type, not a bug.
    const raw = resolveField(item, field, adapter);
    return raw ? raw.replace(/。$/, "") : raw;
  }
  return resolveField(item, field, adapter);
}

export function resolveMCQQuestion(q, { getContent, adapter }) {
  const field = q.field || "meaning";

  const correctDisplay = q.correctLabel != null
    ? q.correctLabel
    : displayForOption({ contentId: q.correctId }, field, getContent, adapter);

  const distractorDisplays = q.distractors.map(d => displayForOption(d, field, getContent, adapter));
  const distractorContentIds = q.distractors.map(d => d.contentId || null);

  const pos = q.correctPosition || 0;
  const options = [...distractorDisplays];
  options.splice(pos, 0, correctDisplay);

  const optionContentIds = [...distractorContentIds];
  optionContentIds.splice(pos, 0, q.correctId || null);

  return {
    id: q.id,
    promptText: q.promptText,
    options,
    optionContentIds,
    correctIndex: pos,
    correctContentId: q.correctId || null,
    explanation: q.explanation
  };
}
