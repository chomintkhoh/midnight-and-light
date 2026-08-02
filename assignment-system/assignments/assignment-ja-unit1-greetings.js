/* ══════════════════════════════════════════════
   ASSIGNMENT DEFINITION — Unit 1: Greetings
   Every activity references content by id only.
   No Japanese/English text is duplicated here —
   compare against the OLD content-ja-unit1-greetings.js
   (still untouched, still running the live prototype)
   to see the difference directly.
══════════════════════════════════════════════ */

export const ASSIGNMENT = {
  id: "assignment-ja-unit1-greetings",
  language: "ja",
  domain: "vocabulary",
  level: "Beginner",
  topic: "Greetings",
  title: "Unit 1: Greetings",
  needsName: true,
  needsPronoun: true,
  intro: {
    title: "Unit 1: Greetings",
    text: "Practice the expressions you've already met in the story — こんにちは, はじめまして, and more. Nothing new here, just a chance to make them stick."
  },

  activities: [
    {
      type: "flashcards",
      display: { title: "Review", eyebrow: "Learning · Step 1", sub: "Flip each card. Take your time — nothing here is timed or graded." },
      contentIds: [
        "ja-vocab-konnichiwa", "ja-vocab-onamae", "ja-vocab-watashi-desu", "ja-vocab-hajimemashite",
        "ja-vocab-yoroshiku", "ja-vocab-douzo", "ja-vocab-arigatou-gozaimasu", "ja-vocab-ohayou",
        "ja-vocab-ittekimasu", "ja-vocab-itterasshai", "ja-vocab-ohayou-gozaimasu", "ja-vocab-tadaima", "ja-vocab-okaeri"
      ]
    },

    {
      type: "multipleChoice", learningObjective: "recognise-meaning",
      display: { title: "What does it mean?", eyebrow: "Practice · Step 2", sub: "Understanding meaning through context." },
      questions: [
        { id: "b2q1", field: "term", correctPosition: 0,
          promptText: "Anna greets you at the door. What does she say?",
          correctId: "ja-vocab-konnichiwa",
          distractors: [{ contentId: "ja-vocab-ohayou" }, { contentId: "ja-vocab-tadaima" }],
          explanation: "こんにちは is a general daytime greeting — perfect for meeting someone at the door." },
        { id: "b2q2", field: "meaning", correctPosition: 0,
          promptText: "What does おなまえは？ mean?",
          correctId: "ja-vocab-onamae",
          distractors: [{ text: "Where are you from?" }, { text: "How are you?" }],
          explanation: "おなまえは？ literally asks for your name." },
        { id: "b2q3", field: "term", correctPosition: 1,
          promptText: "What do people say the very first time they meet someone?",
          correctId: "ja-vocab-hajimemashite",
          distractors: [{ contentId: "ja-vocab-tadaima" }, { contentId: "ja-vocab-okaeri" }],
          explanation: "はじめまして is reserved for first meetings — you won't say it to the same person twice." },
        { id: "b2q4", field: "meaning", correctPosition: 1,
          promptText: "Mika opens the door and gestures for you to go first, saying どうぞ. What's she inviting you to do?",
          correctId: "ja-vocab-douzo", correctLabel: "Go ahead / go in first",
          distractors: [{ text: "Wait outside" }, { text: "Say sorry" }],
          explanation: "どうぞ is an invitation — \u201chere you go\u201d / \u201cplease, go ahead.\u201d" },
        { id: "b2q5", field: "term", correctPosition: 1,
          promptText: "Which greeting would you use with a teacher, not a close friend?",
          correctId: "ja-vocab-ohayou-gozaimasu",
          distractors: [{ contentId: "ja-vocab-ohayou" }],
          explanation: "おはようございます is the more polite form — suited to teachers and formal settings. おはよう is for close friends and family." },
        { id: "b2q6", field: "meaning", correctPosition: 1,
          promptText: "Who says いってらっしゃい — the person leaving, or the person staying home?",
          correctId: "ja-vocab-itterasshai", correctLabel: "The person staying home",
          distractors: [{ text: "The person leaving" }],
          explanation: "いってきます is said by the person leaving; いってらっしゃい is the reply from whoever stays behind." }
      ]
    },

    {
      type: "matching", learningObjective: "recognise-meaning",
      display: { title: "Match the meaning", eyebrow: "Practice · Step 3", sub: "Tap one word on the left, then its matching meaning on the right." },
      leftField: "term", rightField: "meaning",
      contentIds: [
        "ja-vocab-arigatou-gozaimasu", "ja-vocab-yoroshiku", "ja-vocab-tadaima", "ja-vocab-okaeri",
        "ja-vocab-ittekimasu", "ja-vocab-itterasshai", "ja-vocab-ohayou", "ja-vocab-ohayou-gozaimasu"
      ]
    },

    { type: "answerInput", mode: "typing", learningObjective: "self-expression",
      contentId: "ja-vocab-watashi-desu", alwaysCorrect: true, questionId: "b4q1",
      promptParts: ["わたしは", "__BLANK__", "です。"],
      explanation: "This one's about you — any name you type here is correct." },
    { type: "answerInput", mode: "wordBank", learningObjective: "recall-form",
      contentId: "ja-vocab-yoroshiku", promptParts: ["__BLANK__", "おねがいします。"],
      bank: [{ contentId: "ja-vocab-yoroshiku", bankText: "よろしく" }, { text: "どうぞ" }, { text: "ありがとう" }],
      correctBankIndex: 0, questionId: "b4q2",
      explanation: "よろしくおねがいします — the set phrase for \u201clooking forward to it.\u201d" },
    { type: "answerInput", mode: "typing", learningObjective: "recall-form",
      contentId: "ja-vocab-itterasshai", promptParts: ["いってきます。 → いってら", "__BLANK__", "。"],
      acceptedAnswers: ["しゃい", "っしゃい"], questionId: "b4q3",
      explanation: "いってらっしゃい completes the pair — said by whoever stays home." },
    { type: "answerInput", mode: "typing", learningObjective: "recall-form",
      contentId: "ja-vocab-tadaima", promptParts: ["おかえり。 → た", "__BLANK__", "。"],
      acceptedAnswers: ["だいま"], questionId: "b4q4",
      explanation: "ただいま completes the homecoming pair — said by whoever's arriving." },

    { type: "sentenceOrdering", contentId: "ja-sentence-self-intro" },
    { type: "sentenceOrdering", contentId: "ja-sentence-greeting-exchange" },
    { type: "sentenceOrdering", contentId: "ja-sentence-leaving-exchange" },

    { type: "reading", contentId: "ja-reading-unit1-day1",
      display: { title: "A Day in the Story", eyebrow: "Application · Step 6", sub: "Only expressions from this unit appear below — nothing new to decode." } },

    {
      type: "readingQuestions", passageRef: "ja-reading-unit1-day1",
      display: { title: "About the story", eyebrow: "Application · Step 6–7", sub: "Based on what you just read." },
      questions: [
        { id: "b7q1", kind: "mcq", field: "term", correctPosition: 0,
          learningObjective: "vocabulary-in-context",
          promptText: "What does Anna say when she first sees you at the door?",
          correctId: "ja-vocab-konnichiwa",
          distractors: [{ contentId: "ja-vocab-tadaima" }, { contentId: "ja-vocab-okaeri" }],
          explanation: "Anna opens with こんにちは — the standard daytime greeting." },
        { id: "b7q2", kind: "trueFalse",
          learningObjective: "sequence-comprehension",
          promptText: "You are the one who says いってらっしゃい before leaving for school.",
          correctAnswer: false,
          // Anchored to the PASSAGE itself, not a vocabulary item — this
          // question tests whether the learner tracked who-said-what,
          // not recall of a single term's meaning.
          contentId: "ja-reading-unit1-day1",
          explanation: "Actually the reverse — you say いってきます (you're leaving); Anna says いってらっしゃい (she's staying)." },
        { id: "b7q3", kind: "answerInput", mode: "typing",
          learningObjective: "factual-recall",
          promptParts: ["When you arrive home, you say ", "__BLANK__", "。"],
          contentId: "ja-vocab-tadaima", acceptedAnswers: ["ただいま"],
          explanation: "ただいま — announcing that you're home." },
        { id: "b7q4", kind: "mcq", field: "meaning", correctPosition: 0,
          learningObjective: "inference",
          promptText: "Why does the teacher say おはようございます instead of おはよう?",
          correctId: "ja-vocab-ohayou-gozaimasu", correctLabel: "It's more polite/formal",
          distractors: [{ text: "It means something different" }, { text: "No particular reason" }],
          explanation: "Same meaning, different politeness level — おはようございます suits school and formal settings." }
      ]
    }
  ]
};
