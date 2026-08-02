/* ══════════════════════════════════════════════
   PREPARE — Flashcards
   Produces one consistent display model for EVERY
   domain — approved decision: the shared renderer must
   never need to know whether content is vocabulary,
   kanji, or a Mandarin character.

     { contentId, front, back, metadata, audio }

   back is ALWAYS exactly these 4 keys, every domain,
   no exceptions — fields that don't apply are simply
   empty arrays, not omitted, not renamed:

     back.meanings    — array of strings, always
     back.readings    — array of reading objects, empty if none
     back.components  — array of {contentId, role}, empty if none
     back.examples    — array of contentId references, empty if none

   Per-reading metadata (meaningContext, exampleVocabulary,
   etc.) is OPTIONAL per the approved decision — a reading
   entry with just {reading, type} or {pinyin, tone} is
   perfectly valid on its own.

   {{name}}/{{pronoun}} templates are resolved here for the
   pronoun (a content-authoring compatibility concern) but
   {{name}} itself is deliberately left unresolved — the
   existing engine's T() substitutes it at render time,
   same pattern established in Step 2.
══════════════════════════════════════════════ */

const FIXED_PRONOUN = "わたし"; // Same Step 2 compatibility shim — no pronoun-choice UI yet.

function resolveTemplate(str) {
  if (typeof str !== "string") return str;
  return str.replace("{{pronoun}}", FIXED_PRONOUN);
}

export function prepareFlashcard(contentItem, { adapter } = {}) {
  const base = { contentId: contentItem.id, metadata: {} };

  switch (contentItem.domain) {
    case "vocabulary": {
      const front = contentItem.template
        ? resolveTemplate(contentItem.template)
        : contentItem.term;
      const audio = contentItem.template
        ? resolveTemplate(contentItem.audio)
        : contentItem.audio;
      return {
        ...base,
        front,
        back: {
          meanings: [contentItem.meaning],
          readings: contentItem.readings || [], // empty for today's real Unit 1 items — they have no separate reading field
          components: [],
          examples: []
        },
        audio
      };
    }

    case "kanji": {
      return {
        ...base,
        front: contentItem.character,
        back: {
          meanings: [contentItem.meaning],
          readings: contentItem.readings || [],      // [{reading, type: "onyomi"|"kunyomi", ...optional}]
          components: [],                              // kanji don't have components in this model — only Mandarin characters do
          examples: contentItem.exampleVocabulary || [] // references, not embedded text
        },
        metadata: { furigana: contentItem.furigana || null },
        audio: contentItem.audio || null
      };
    }

    case "character": { // Mandarin
      return {
        ...base,
        front: contentItem.character,
        back: {
          meanings: [contentItem.meaning],
          readings: contentItem.readings || [],     // [{pinyin, tone, ...optional}] — tone stays attached to its exact reading
          components: contentItem.components || [], // [{contentId, role}]
          examples: contentItem.exampleVocabulary || []
        },
        metadata: { radical: contentItem.radical || null }, // reference to a zh-radical-* domain item
        audio: contentItem.audio || null
      };
    }

    default: {
      // Generic fallback for any future/unknown domain — never throws,
      // never assumes a field exists, same 4-key shape as every other domain.
      return {
        ...base,
        front: contentItem.term || contentItem.character || contentItem.id,
        back: {
          meanings: contentItem.meaning ? [contentItem.meaning] : [],
          readings: contentItem.readings || [],
          components: contentItem.components || [],
          examples: contentItem.exampleVocabulary || []
        },
        audio: contentItem.audio || null
      };
    }
  }
}
