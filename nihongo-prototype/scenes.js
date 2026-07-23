/* ══════════════════════════════════════════════
   Scene data — Scenes 1–5 (Day 1 prototype, v2)
   Adds: character personality config, gesture/stage
   direction lines, story-embedded prompt framing.
══════════════════════════════════════════════ */

const CHARACTERS = {
  Anna: { color: "#D9784F", tint: "#FBE9DF" }, // warm, outgoing
  Mika: { color: "#5E8785", tint: "#E4EEEC" }, // calm, observant
  You:  { color: "#8A6FB0", tint: "#EFE7F5" }
};

const STEPS = [

  /* ───────── SCENE 1 — Arriving in Japan ───────── */
  {
    scene: 1, location: "Airport Arrivals Hall",
    type: "narration",
    illustration: "airport",
    text: "The automatic doors slide open, and the noise of the arrivals hall hits you all at once. Somewhere in the crowd, someone is holding a sign with your name on it.",
    continueLabel: "Continue"
  },
  {
    scene: 1, location: "Airport Arrivals Hall",
    type: "narration",
    illustration: "airport",
    gesture: "The coordinator waves the sign a little higher and smiles when she spots you.",
    text: "She speaks to you right away — in your own language. \u201cYou must be so tired from the flight. Let's get you home.\u201d",
    continueLabel: "Let's go"
  },

  /* ───────── SCENE 2 — Meeting Anna and Mika ───────── */
  {
    scene: 2, location: "Shared Accommodation — Entrance",
    type: "narration",
    illustration: "entrance",
    text: "The door opens before you even knock. Two faces appear — one grinning, one quietly curious.",
    continueLabel: "Continue"
  },
  {
    scene: 2, location: "Shared Accommodation — Entrance",
    type: "guess",
    illustration: "entrance",
    speaker: "Anna",
    gesture: "Anna bounces on her heels and waves with both hands, already talking before you're through the door.",
    jp: "こんにちは。",
    audio: "こんにちは",
    prompt: "You don't understand the words yet — but her smile is easy to read. What do you think she's saying?",
    options: ["Good morning", "Hello", "Good night"],
    correctIndex: 1,
    reveal: { jp: "こんにちは。", en: "Hello." },
    feedbackCorrect: "You guessed it — こんにちは just means Hello. A simple word to carry you through the door.",
    feedbackWrong: "Close — こんにちは actually means Hello. You'll hear it constantly, so it's a good one to have.",
    showRepeat: true
  },

  /* ───────── SCENE 3 — Asking the learner's name ───────── */
  {
    scene: 3, location: "Shared Accommodation — Entrance",
    type: "guess",
    illustration: "entrance",
    speaker: "Anna",
    gesture: "Anna tilts her head and points gently at you, waiting.",
    jp: "おなまえは？",
    audio: "おなまえは",
    prompt: "She's clearly asking you something — and it feels like she's waiting for a specific kind of answer.",
    options: ["What's your name?", "Where are you from?", "How old are you?"],
    correctIndex: 0,
    reveal: { jp: "おなまえは？", en: "What's your name?" },
    feedbackCorrect: "Right — she wants to know your name.",
    feedbackWrong: "She's actually asking your name — おなまえは？",
    showRepeat: false
  },
  {
    scene: 3, location: "Shared Accommodation — Entrance",
    type: "nameInput",
    illustration: "entrance",
    gesture: "Mika leans against the doorway, watching quietly with a small smile.",
    prompt: "You realize you should probably answer. What do you tell her?"
  },
  {
    scene: 3, location: "Shared Accommodation — Entrance",
    type: "pronounChoice",
    illustration: "entrance",
    prompt: "Before you can say it, you pause — there's more than one way to say \u201cI am\u201d in Japanese. Which feels more like you?",
    options: [
      { value: "わたし", label: "わたし (watashi)", note: "Neutral — anyone can use this." },
      { value: "ぼく",   label: "ぼく (boku)",     note: "Often used by boys/men, casual." }
    ]
  },
  {
    scene: 3, location: "Shared Accommodation — Entrance",
    type: "revealNameLine",
    illustration: "entrance",
    gesture: "Anna repeats your name back to you, delighted, like she's trying it on for size.",
    feedbackCorrect: "Nice to meet you! Anna already looks like she won't forget it."
  },

  /* ───────── SCENE 4 — First meeting & self-introduction ───────── */
  {
    scene: 4, location: "Shared Accommodation — Living Room",
    type: "narration",
    illustration: "living-room",
    text: "Anna claps her hands together. Mika, a step behind her, adds something quieter but just as warm.",
    continueLabel: "Continue"
  },
  {
    scene: 4, location: "Shared Accommodation — Living Room",
    type: "dialogueReveal",
    illustration: "living-room",
    gesture: "Anna bows slightly, still smiling. Mika does the same, a beat slower and softer.",
    lines: [
      { speaker: "Anna", jp: "はじめまして。", audio: "はじめまして", en: "Nice to meet you (first time)." },
      { speaker: "Mika", jp: "よろしくおねがいします。", audio: "よろしくおねがいします", en: "Looking forward to it." }
    ],
    prompt: "These are words for a very particular moment — the first time two people meet."
  },
  {
    scene: 4, location: "Shared Accommodation — Living Room",
    type: "sequenceAssembly",
    illustration: "living-room",
    prompt: "It's your turn now. Both of them are looking at you, waiting. Put the words in an order that feels right.",
    pieces: [
      { id: "a", jp: "はじめまして。" },
      { id: "b", jp: "__NAME_LINE__" },
      { id: "c", jp: "よろしくおねがいします。" }
    ],
    correctOrder: ["a", "b", "c"],
    retryLabel: "Something's not quite right yet"
  },

  /* ───────── SCENE 5 — Entering the room ───────── */
  {
    scene: 5, location: "The New Room",
    type: "narration",
    illustration: "room",
    gesture: "Mika walks ahead down the short hallway and stops at a door.",
    text: "Mika opens a door at the end of the hall and steps aside, holding out one hand toward the room.",
    continueLabel: "Continue"
  },
  {
    scene: 5, location: "The New Room",
    type: "guess",
    illustration: "room",
    speaker: "Mika",
    gesture: "She keeps the door open, patient, letting you go first.",
    jp: "どうぞ。",
    audio: "どうぞ",
    prompt: "She's not saying much — but the gesture makes the meaning almost obvious.",
    options: ["Wait here", "Here you go / please", "I'm sorry"],
    correctIndex: 1,
    reveal: { jp: "どうぞ。", en: "Here you go / please, go ahead." },
    feedbackCorrect: "Exactly — どうぞ is an invitation. Go ahead.",
    feedbackWrong: "どうぞ actually means \u201chere you go\u201d / \u201cplease, go ahead.\u201d",
    showRepeat: false
  },
  {
    scene: 5, location: "The New Room",
    type: "binaryChoice",
    illustration: "room",
    prompt: "She let you step in first. Something in you wants to acknowledge that.",
    options: ["ありがとうございます", "すみません"],
    correctIndex: 0,
    reveal: { jp: "ありがとうございます。", en: "Thank you." },
    feedbackCorrect: "Perfect — ありがとうございます fits this moment exactly.",
    feedbackWrong: "ありがとうございます (thank you) is what fits here."
  },
  {
    scene: 5, location: "The New Room",
    type: "endOfPrototype",
    gesture: "Mika gives a small nod and leaves you to settle in. Down the hall, you can still hear Anna humming to herself.",
    illustration: "room",
    text: "The room is small, plain, and entirely yours. You set your suitcase down and finally sit still for the first time all day. You didn't understand everything today — but you understood more than you expected to."
  }
];
