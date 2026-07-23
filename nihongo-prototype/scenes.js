/* ══════════════════════════════════════════════
   Scene data — Scenes 1–5 only (Day 1 prototype)
   Each step has a `scene` tag for location/progress display.
   Adding Scenes 6+ later = adding more steps here, no engine changes.
══════════════════════════════════════════════ */

const STEPS = [

  /* ───────── SCENE 1 — Arriving in Japan ───────── */
  {
    scene: 1, location: "Airport Arrivals Hall",
    type: "narration",
    illustration: "airport",
    text: "You've just landed in Japan. Your suitcase feels heavier than it did this morning. A woman is holding a sign with your name.",
    continueLabel: "Continue"
  },

  /* ───────── SCENE 2 — Meeting Anna and Mika ───────── */
  {
    scene: 2, location: "Shared Accommodation — Entrance",
    type: "narration",
    illustration: "entrance",
    text: "The coordinator introduces you. One of the girls smiles and says something you don't understand yet.",
    continueLabel: "Continue"
  },
  {
    scene: 2, location: "Shared Accommodation — Entrance",
    type: "guess",
    illustration: "entrance",
    speaker: "Anna",
    jp: "こんにちは。",
    audio: "こんにちは",
    prompt: "What do you think she just said?",
    options: ["Good morning", "Hello", "Good night"],
    correctIndex: 1,
    reveal: { jp: "こんにちは。", en: "Hello." },
    feedbackCorrect: "That's right! こんにちは means Hello.",
    feedbackWrong: "Not quite — こんにちは means Hello.",
    showRepeat: true
  },

  /* ───────── SCENE 3 — Asking the learner's name ───────── */
  {
    scene: 3, location: "Shared Accommodation — Entrance",
    type: "guess",
    illustration: "entrance",
    speaker: "Anna",
    jp: "おなまえは？",
    audio: "おなまえは",
    prompt: "She's asking you something — what do you think it means?",
    options: ["What's your name?", "Where are you from?", "How old are you?"],
    correctIndex: 0,
    reveal: { jp: "おなまえは？", en: "What's your name?" },
    feedbackCorrect: "Right — she's asking your name.",
    feedbackWrong: "She's actually asking おなまえは？ — What's your name?",
    showRepeat: false
  },
  {
    scene: 3, location: "Shared Accommodation — Entrance",
    type: "nameInput",
    illustration: "entrance",
    prompt: "Type your name."
  },
  {
    scene: 3, location: "Shared Accommodation — Entrance",
    type: "pronounChoice",
    illustration: "entrance",
    prompt: "Choose how you'd like to say \"I am\":",
    options: [
      { value: "わたし", label: "わたし (watashi)", note: "Neutral — anyone can use this." },
      { value: "ぼく",   label: "ぼく (boku)",     note: "Often used by boys/men, casual." }
    ]
  },
  {
    scene: 3, location: "Shared Accommodation — Entrance",
    type: "revealNameLine",
    illustration: "entrance",
    feedbackCorrect: "Nice to meet you!"
  },

  /* ───────── SCENE 4 — First meeting & self-introduction ───────── */
  {
    scene: 4, location: "Shared Accommodation — Living Room",
    type: "narration",
    illustration: "living-room",
    text: "Anna claps her hands together and says something warm. Mika nods and adds a phrase you'll hear a lot in Japan.",
    continueLabel: "Continue"
  },
  {
    scene: 4, location: "Shared Accommodation — Living Room",
    type: "dialogueReveal",
    illustration: "living-room",
    lines: [
      { speaker: "Anna", jp: "はじめまして。", audio: "はじめまして", en: "Nice to meet you (first time)." },
      { speaker: "Mika", jp: "よろしくおねがいします。", audio: "よろしくおねがいします", en: "Looking forward to it." }
    ],
    prompt: "People often say these when meeting someone for the very first time."
  },
  {
    scene: 4, location: "Shared Accommodation — Living Room",
    type: "sequenceAssembly",
    illustration: "living-room",
    prompt: "Put your self-introduction in order.",
    pieces: [
      { id: "a", jp: "はじめまして。" },
      { id: "b", jp: "__NAME_LINE__" },
      { id: "c", jp: "よろしくおねがいします。" }
    ],
    correctOrder: ["a", "b", "c"],
    retryLabel: "Let's try that order again"
  },

  /* ───────── SCENE 5 — Entering the room ───────── */
  {
    scene: 5, location: "The New Room",
    type: "narration",
    illustration: "room",
    text: "She opens the door to your room and gestures for you to go in.",
    continueLabel: "Continue"
  },
  {
    scene: 5, location: "The New Room",
    type: "guess",
    illustration: "room",
    speaker: "Mika",
    jp: "どうぞ。",
    audio: "どうぞ",
    prompt: "She's gesturing for you to go first. What do you think she's saying?",
    options: ["Wait here", "Here you go / please", "I'm sorry"],
    correctIndex: 1,
    reveal: { jp: "どうぞ。", en: "Here you go / please, go ahead." },
    feedbackCorrect: "Exactly — どうぞ invites you to go ahead.",
    feedbackWrong: "どうぞ actually means \"here you go\" / \"please, go ahead.\"",
    showRepeat: false
  },
  {
    scene: 5, location: "The New Room",
    type: "binaryChoice",
    illustration: "room",
    prompt: "She let you go first. What do you say?",
    options: ["ありがとうございます", "すみません"],
    correctIndex: 0,
    reveal: { jp: "ありがとうございます。", en: "Thank you." },
    feedbackCorrect: "Perfect — ありがとうございます fits here.",
    feedbackWrong: "ありがとうございます (thank you) fits best here."
  },
  {
    scene: 5, location: "The New Room",
    type: "endOfPrototype",
    illustration: "room",
    text: "Your first day in Japan is off to a start. You didn't understand everything — but you understood more than you expected."
  }
];
