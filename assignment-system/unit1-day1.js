/* ══════════════════════════════════════════════
   CONTENT — Japanese Reading Passage — Unit 1, Day 1
   Domain: "reading" — its own domain.

   Each spoken line supports:
     vocabRef   — single vocabulary item, resolved via
                  the content registry + adapter
     vocabRefs  — multiple items concatenated into one
                  spoken line (no separator)
     text       — literal override, used ONLY where the
                  original passage's exact wording differs
                  from the vocabulary item's canonical form
                  (see the two 「！」 exclamations below —
                  a deliberate narrative style choice in the
                  original, not an error to normalise away).
                  vocabRef/vocabRefs are still kept even when
                  `text` overrides display, so the line stays
                  linked to real content for future analytics.
══════════════════════════════════════════════ */

export const READING = {
  "ja-reading-unit1-day1": {
    id: "ja-reading-unit1-day1", language: "ja", domain: "reading",
    lines: [
      { stage: "Arriving at the house" },
      { speaker: "Anna", vocabRef: "ja-vocab-konnichiwa" },
      { speaker: "{{name}}", vocabRefs: ["ja-vocab-konnichiwa", "ja-vocab-hajimemashite", "ja-vocab-watashi-desu"] },
      { speaker: "Anna", vocabRef: "ja-vocab-yoroshiku" },

      { stage: "The next morning" },
      { speaker: "Anna", vocabRef: "ja-vocab-ohayou", text: "おはよう！" },
      { speaker: "{{name}}", vocabRefs: ["ja-vocab-ohayou", "ja-vocab-ittekimasu"], text: "おはよう！いってきます。" },
      { speaker: "Anna", vocabRef: "ja-vocab-itterasshai" },

      { stage: "At school" },
      { speaker: "Teacher", vocabRef: "ja-vocab-ohayou-gozaimasu" },
      { speaker: "{{name}}", vocabRef: "ja-vocab-ohayou-gozaimasu" },

      { stage: "Arriving home" },
      { speaker: "Anna", vocabRef: "ja-vocab-okaeri", text: "おかえり！" },
      { speaker: "{{name}}", vocabRef: "ja-vocab-tadaima" }
    ]
  }
};
