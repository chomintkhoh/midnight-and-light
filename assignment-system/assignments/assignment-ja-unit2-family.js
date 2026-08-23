/* ══════════════════════════════════════════════
   ASSIGNMENT DEFINITION — Japanese Beginner, Unit 2: Family
   Genuinely new content, second real assignment. Uses only
   already-established mechanisms — no schema/engine change.
══════════════════════════════════════════════ */

export const ASSIGNMENT = {
  id: "assignment-ja-unit2-family",
  language: "ja",
  domain: "vocabulary",
  level: "Beginner",
  topic: "Family",
  title: "Unit 2: Family",
  needsName: true,
  intro: {
    title: "Unit 2: Family",
    text: "Learn to introduce your family members in Japanese — 家族, 父, 母, and more."
  },

  activities: [
    {
      type: "flashcards",
      display: { title: "Review", eyebrow: "Learning · Step 1", sub: "Flip each card. Take your time — nothing here is timed or graded." },
      contentIds: ["ja-vocab-kazoku", "ja-vocab-chichi", "ja-vocab-haha", "ja-vocab-ani", "ja-vocab-ane", "ja-vocab-otouto", "ja-vocab-imouto", "ja-vocab-neko"]
    },

    { type: "multipleChoice", learningObjective: "recognise-meaning",
      display: { title: "What does it mean?", eyebrow: "Practice · Step 2", sub: "Understanding meaning through context." },
      questions: [
        { id: "u2q1", field: "term", correctPosition: 0, promptText: "Which word means \"father\"?",
          correctId: "ja-vocab-chichi", distractors: [{ contentId: "ja-vocab-haha" }, { contentId: "ja-vocab-ani" }],
          explanation: "父 (chichi) means \"father\" (used when referring to your own)." },
        { id: "u2q2", field: "meaning", correctPosition: 0, promptText: "What does 兄 mean?",
          correctId: "ja-vocab-ani", distractors: [{ contentId: "ja-vocab-imouto" }, { contentId: "ja-vocab-haha" }],
          explanation: "兄 (ani) is your older brother — Japanese distinguishes older/younger siblings explicitly." },
        { id: "u2q3", field: "term", correctPosition: 1, promptText: "Which word means \"younger sister\"?",
          correctId: "ja-vocab-imouto", distractors: [{ contentId: "ja-vocab-ane" }, { contentId: "ja-vocab-otouto" }],
          explanation: "妹 (imouto) is your younger sister." },
        { id: "u2q4", field: "meaning", correctPosition: 0, promptText: "What does 家族 mean?",
          correctId: "ja-vocab-kazoku", distractors: [{ contentId: "ja-vocab-chichi" }, { contentId: "ja-vocab-neko" }],
          explanation: "家族 (kazoku) means \"family\" as a whole." },
        { id: "u2q5", correctPosition: 0, promptText: "What does 猫 mean?",
          correctId: "ja-vocab-neko", correctLabel: "cat",
          distractors: [{ text: "dog" }, { text: "bird" }],
          explanation: "猫 (neko) means \"cat\"." },
        { id: "u2q6", field: "term", correctPosition: 0, promptText: "Which word means \"older sister\"?",
          correctId: "ja-vocab-ane", distractors: [{ contentId: "ja-vocab-imouto" }, { contentId: "ja-vocab-haha" }],
          explanation: "姉 (ane) is your older sister." }
      ]
    },

    { type: "matching", learningObjective: "recognise-meaning",
      display: { title: "Match the meaning", eyebrow: "Practice · Step 3", sub: "Tap one word on the left, then its matching meaning on the right." },
      leftField: "term", rightField: "meaning",
      contentIds: ["ja-vocab-kazoku", "ja-vocab-chichi", "ja-vocab-haha", "ja-vocab-ani", "ja-vocab-ane", "ja-vocab-otouto", "ja-vocab-imouto", "ja-vocab-neko"]
    },

    { type: "answerInput", mode: "wordBank", learningObjective: "recall-form",
      contentId: "ja-vocab-chichi", promptParts: ["__BLANK__", "は父です。"],
      bank: [{ text: "これ" }, { text: "それ" }, { text: "あれ" }], correctBankIndex: 0, questionId: "u2b4q1",
      explanation: "これ (\"this\") is used for something close to you, like a photo you're holding." },
    { type: "answerInput", mode: "typing", learningObjective: "recall-form",
      contentId: "ja-vocab-haha", promptParts: ["Type \"mother\": これは", "__BLANK__", "です。"],
      acceptedAnswers: ["母"], questionId: "u2b4q2",
      explanation: "母 (haha) means \"mother\"." },
    { type: "answerInput", mode: "typing", learningObjective: "recall-form",
      contentId: "ja-vocab-ani", promptParts: ["Type \"older brother\": これは", "__BLANK__", "です。"],
      acceptedAnswers: ["兄"], questionId: "u2b4q3",
      explanation: "兄 (ani) means \"older brother\"." },
    { type: "answerInput", mode: "typing", learningObjective: "recall-form",
      contentId: "ja-vocab-neko", promptParts: ["Type \"cat\": これは", "__BLANK__", "です。"],
      acceptedAnswers: ["猫"], questionId: "u2b4q4",
      explanation: "猫 (neko) means \"cat\"." },

    { type: "sentenceOrdering", contentId: "ja-sentence-kore-wa-ane" },
    { type: "sentenceOrdering", contentId: "ja-sentence-kore-wa-otouto" },
    { type: "sentenceOrdering", contentId: "ja-sentence-neko-mo-kazoku" },

    { type: "reading", contentId: "ja-reading-unit2-family",
      display: { title: "My Family", eyebrow: "Application · Step 6", sub: "Only expressions from this unit appear below — nothing new to decode." } },

    { type: "readingQuestions", passageRef: "ja-reading-unit2-family",
      display: { title: "About the Family", eyebrow: "Application · Step 6–7", sub: "Based on what you just read." },
      questions: [
        { id: "u2b7q1", kind: "mcq", field: "term", correctPosition: 0, learningObjective: "vocabulary-in-context",
          promptText: "Which family member does {{name}} introduce first (after 家族 itself)?",
          correctId: "ja-vocab-chichi", distractors: [{ contentId: "ja-vocab-haha" }, { contentId: "ja-vocab-ani" }] },
        { id: "u2b7q2", kind: "trueFalse", learningObjective: "sequence-comprehension",
          promptText: "{{name}} introduces their cat before their mother.",
          correctAnswer: false, contentId: "ja-reading-unit2-family" },
        { id: "u2b7q3", kind: "answerInput", learningObjective: "factual-recall",
          promptParts: ["{{name}}'s pet is a ", "__BLANK__", " (in Japanese)."],
          contentId: "ja-vocab-neko", acceptedAnswers: ["猫"] },
        { id: "u2b7q4", kind: "mcq", field: "term", correctPosition: 1, learningObjective: "inference",
          promptText: "Which of these does {{name}} NOT mention in the passage?",
          correctId: "ja-vocab-ane", distractors: [{ contentId: "ja-vocab-haha" }, { contentId: "ja-vocab-ani" }] }
      ]
    }
  ]
};
