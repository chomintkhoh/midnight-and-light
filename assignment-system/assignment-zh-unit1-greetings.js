/* ══════════════════════════════════════════════
   ASSIGNMENT DEFINITION — Mandarin Beginner, Unit 1: Greetings
   First full Phase 2 content batch. Mirrors the Japanese
   Unit 1 pattern exactly — same activity-type coverage,
   same reuse of shared prepare modules, different language.
══════════════════════════════════════════════ */

export const ASSIGNMENT = {
  id: "assignment-zh-unit1-greetings",
  language: "zh",
  domain: "vocabulary",
  level: "Beginner",
  topic: "Greetings",
  title: "Unit 1: Greetings (Mandarin)",
  needsName: true,
  intro: {
    title: "Unit 1: Greetings",
    text: "Meet a new classmate and practice introducing yourself in Mandarin — 你好, 我叫..., and more."
  },

  activities: [
    {
      type: "flashcards",
      display: { title: "Review", eyebrow: "Learning · Step 1", sub: "Flip each card. Take your time — nothing here is timed or graded." },
      contentIds: [
        "zh-vocab-nihao", "zh-vocab-ni", "zh-vocab-wo", "zh-vocab-shi",
        "zh-vocab-jiao", "zh-vocab-mingzi", "zh-vocab-hen", "zh-vocab-gaoxing", "zh-vocab-renshi"
      ]
    },

    {
      type: "multipleChoice", learningObjective: "recognise-meaning",
      display: { title: "What does it mean?", eyebrow: "Practice · Step 2", sub: "Understanding meaning through context." },
      questions: [
        { id: "zh-b2q1", field: "term", correctPosition: 0,
          promptText: "How do you greet someone in Mandarin?",
          correctId: "zh-vocab-nihao",
          distractors: [{ contentId: "zh-vocab-mingzi" }, { contentId: "zh-vocab-hen" }],
          explanation: "你好 (nǐhǎo) is the standard greeting." },
        { id: "zh-b2q2", field: "meaning", correctPosition: 0,
          promptText: "What does 我 mean?",
          correctId: "zh-vocab-wo",
          distractors: [{ contentId: "zh-vocab-ni" }, { contentId: "zh-vocab-shi" }],
          explanation: "我 (wǒ) means \"I / me\"." },
        { id: "zh-b2q3", field: "term", correctPosition: 1,
          promptText: "Which word means \"to be called\" (used for names)?",
          correctId: "zh-vocab-jiao",
          distractors: [{ contentId: "zh-vocab-shi" }, { contentId: "zh-vocab-renshi" }],
          explanation: "叫 (jiào) is used specifically for stating your name — 我叫... = \"I'm called...\"." },
        { id: "zh-b2q4", field: "meaning", correctPosition: 0,
          promptText: "What does 高兴 (gāoxìng) mean?",
          correctId: "zh-vocab-gaoxing",
          distractors: [{ contentId: "zh-vocab-hen" }, { contentId: "zh-vocab-mingzi" }],
          explanation: "高兴 (gāoxìng) means \"happy\" — note 兴 here is read xìng (4th tone), not xīng." },
        { id: "zh-b2q5", field: "term", correctPosition: 2,
          promptText: "Which word means \"very\"?",
          correctId: "zh-vocab-hen",
          distractors: [{ contentId: "zh-vocab-shi" }, { contentId: "zh-vocab-renshi" }],
          explanation: "很 (hěn) means \"very\" — it's used often before adjectives in Mandarin, even when not emphatic." },
        { id: "zh-b2q6", field: "term", correctPosition: 1,
          promptText: "好 (hǎo) is written with 女 (woman) and which other component?",
          correctId: "zh-char-子",
          distractors: [{ contentId: "zh-char-口" }, { contentId: "zh-char-你" }],
          explanation: "好 = 女 (woman) + 子 (child) — a classic semantic-semantic compound." }
      ]
    },

    {
      type: "matching", learningObjective: "recognise-meaning",
      display: { title: "Match the meaning", eyebrow: "Practice · Step 3", sub: "Tap one word on the left, then its matching meaning on the right." },
      leftField: "term", rightField: "meaning",
      contentIds: [
        "zh-vocab-nihao", "zh-vocab-wo", "zh-vocab-shi", "zh-vocab-jiao",
        "zh-vocab-mingzi", "zh-vocab-hen", "zh-vocab-gaoxing", "zh-vocab-renshi"
      ]
    },

    { type: "answerInput", mode: "typing", learningObjective: "self-expression",
      contentId: "zh-vocab-jiao", alwaysCorrect: true, questionId: "zh-b4q1",
      promptParts: ["我叫", "__BLANK__", "。"],
      explanation: "This one's about you — any name you type here is correct." },
    { type: "answerInput", mode: "wordBank", learningObjective: "recall-form",
      contentId: "zh-vocab-ni", promptParts: ["__BLANK__", "好。"],
      bank: [{ contentId: "zh-vocab-ni", bankText: "你" }, { text: "我" }, { text: "很" }],
      correctBankIndex: 0, questionId: "zh-b4q2",
      explanation: "你好 — the standard greeting starts with 你 (you)." },
    { type: "answerInput", mode: "typing", learningObjective: "recall-form",
      contentId: "zh-vocab-renshi", promptParts: ["很高兴", "__BLANK__", "你。"],
      acceptedAnswers: ["认识"], questionId: "zh-b4q3",
      explanation: "认识 (rènshi) completes the idiom 很高兴认识你 — the standard way to say \"nice to meet you\" in Mandarin." },
    { type: "answerInput", mode: "typing", learningObjective: "recall-form",
      contentId: "zh-vocab-gaoxing", promptParts: ["认识你，我很", "__BLANK__", "。"],
      acceptedAnswers: ["高兴"], questionId: "zh-b4q4",
      explanation: "高兴 (gāoxìng) — \"happy\". Note the tone here is xìng, not xīng." },

    { type: "sentenceOrdering", contentId: "zh-sentence-self-intro" },
    { type: "sentenceOrdering", contentId: "zh-sentence-greeting-order" },

    { type: "reading", contentId: "zh-reading-unit1-greeting",
      display: { title: "Meeting a New Classmate", eyebrow: "Application · Step 6", sub: "Only expressions from this unit appear below — nothing new to decode." } },

    {
      type: "readingQuestions", passageRef: "zh-reading-unit1-greeting",
      display: { title: "About the Conversation", eyebrow: "Application · Step 6–7", sub: "Based on what you just read." },
      questions: [
        { id: "zh-b7q1", kind: "mcq", field: "term", correctPosition: 0,
          learningObjective: "vocabulary-in-context",
          promptText: "What does the classmate say first when meeting {{name}}?",
          correctId: "zh-vocab-nihao",
          distractors: [{ contentId: "zh-vocab-renshi" }, { contentId: "zh-vocab-gaoxing" }] },
        { id: "zh-b7q2", kind: "trueFalse",
          learningObjective: "sequence-comprehension",
          promptText: "{{name}} introduces their name before the classmate says 你好.",
          correctAnswer: false,
          contentId: "zh-reading-unit1-greeting" },
        { id: "zh-b7q3", kind: "answerInput", promptParts: ["When happy to meet someone, {{name}} says 我很", "__BLANK__", "。"],
          learningObjective: "factual-recall",
          contentId: "zh-vocab-gaoxing", acceptedAnswers: ["高兴"] },
        { id: "zh-b7q4", kind: "mcq", correctPosition: 0,
          learningObjective: "inference",
          promptText: "In 高兴 (gāoxìng), which tone is 兴 read with?",
          correctId: "zh-char-兴",
          correctLabel: "4th tone (xìng)",
          distractors: [{ text: "1st tone (xīng)" }, { text: "2nd tone" }] }
      ]
    }
  ]
};
