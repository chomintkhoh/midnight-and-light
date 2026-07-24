/* ══════════════════════════════════════════════
   CONTENT DATA ONLY — no interface logic lives here.
   This is the file you'd copy/edit to create a new
   assignment (Japanese or Mandarin, any level/topic).
   {{name}} is replaced at runtime with the learner's
   typed name (see engine.js).
══════════════════════════════════════════════ */

const ASSIGNMENT = {
  id: "ja-beginner-unit1-greetings",
  language: "ja",              // "ja" | "zh" — drives font + audio locale
  level: "Beginner",
  topic: "Greetings",
  needsName: true,              // engine asks for the learner's name before starting

  intro: {
    title: "Unit 1: Greetings",
    text: "Practice the expressions you've already met in the story — こんにちは, はじめまして, and more. Nothing new here, just a chance to make them stick."
  },

  blocks: [
    /* ───────── BLOCK 1 — Flashcards (unscored) ───────── */
    {
      id: "b1", type: "flashcards", scored: false,
      title: "Review", eyebrow: "Learning · Step 1",
      sub: "Flip each card. Take your time — nothing here is timed or graded.",
      data: {
        cards: [
          { jp: "こんにちは。", audio: "こんにちは", en: "Hello" },
          { jp: "おなまえは？", audio: "おなまえは", en: "What's your name?" },
          { jp: "わたしは{{name}}です。", audio: "わたしは{{name}}です", en: "I am {{name}}." },
          { jp: "はじめまして。", audio: "はじめまして", en: "Nice to meet you (first time)" },
          { jp: "よろしくおねがいします。", audio: "よろしくおねがいします", en: "Looking forward to it" },
          { jp: "どうぞ。", audio: "どうぞ", en: "Here you go / please" },
          { jp: "ありがとうございます。", audio: "ありがとうございます", en: "Thank you" },
          { jp: "おはよう。", audio: "おはよう", en: "Good morning (casual)" },
          { jp: "いってきます。", audio: "いってきます", en: "I'm heading out (I'll be back)" },
          { jp: "いってらっしゃい。", audio: "いってらっしゃい", en: "Take care / see you later" },
          { jp: "おはようございます。", audio: "おはようございます", en: "Good morning (polite)" },
          { jp: "ただいま。", audio: "ただいま", en: "I'm home" },
          { jp: "おかえり。", audio: "おかえり", en: "Welcome home" }
        ]
      }
    },

    /* ───────── BLOCK 2 — Multiple Choice (scored) ───────── */
    {
      id: "b2", type: "multipleChoice", scored: true,
      title: "What does it mean?", eyebrow: "Practice · Step 2",
      sub: "Understanding meaning through context.",
      data: {
        questions: [
          { id:"b2q1", kind:"mcq", prompt:{ text:"Anna greets you at the door. What does she say?" },
            options:["こんにちは","おはよう","ただいま"], correctIndex:0,
            explanation:"こんにちは is a general daytime greeting — perfect for meeting someone at the door." },
          { id:"b2q2", kind:"mcq", prompt:{ text:"What does おなまえは？ mean?" },
            options:["What's your name?","Where are you from?","How are you?"], correctIndex:0,
            explanation:"おなまえは？ literally asks for your name." },
          { id:"b2q3", kind:"mcq", prompt:{ text:"What do people say the very first time they meet someone?" },
            options:["ただいま","はじめまして","おかえり"], correctIndex:1,
            explanation:"はじめまして is reserved for first meetings — you won't say it to the same person twice." },
          { id:"b2q4", kind:"mcq", prompt:{ text:"Mika opens the door and gestures for you to go first, saying どうぞ. What's she inviting you to do?" },
            options:["Wait outside","Go ahead / go in first","Say sorry"], correctIndex:1,
            explanation:"どうぞ is an invitation — \u201chere you go\u201d / \u201cplease, go ahead.\u201d" },
          { id:"b2q5", kind:"mcq", prompt:{ text:"Which greeting would you use with a teacher, not a close friend?" },
            options:["おはよう","おはようございます"], correctIndex:1,
            explanation:"おはようございます is the more polite form — suited to teachers and formal settings. おはよう is for close friends and family." },
          { id:"b2q6", kind:"mcq", prompt:{ text:"Who says いってらっしゃい — the person leaving, or the person staying home?" },
            options:["The person leaving","The person staying home"], correctIndex:1,
            explanation:"いってきます is said by the person leaving; いってらっしゃい is the reply from whoever stays behind." }
        ]
      }
    },

    /* ───────── BLOCK 3 — Matching (scored, tap-to-connect) ───────── */
    {
      id: "b3", type: "matching", scored: true,
      title: "Match the meaning", eyebrow: "Practice · Step 3",
      sub: "Tap one word on the left, then its matching meaning on the right.",
      data: {
        pairs: [
          { id:"p1", left:"ありがとうございます。", right:"Thank you" },
          { id:"p2", left:"よろしくおねがいします。", right:"Looking forward to it" },
          { id:"p3", left:"ただいま。", right:"I'm home" },
          { id:"p4", left:"おかえり。", right:"Welcome home" },
          { id:"p5", left:"いってきます。", right:"I'm heading out" },
          { id:"p6", left:"いってらっしゃい。", right:"Take care / see you later" },
          { id:"p7", left:"おはよう。", right:"Good morning (casual)" },
          { id:"p8", left:"おはようございます。", right:"Good morning (polite)" }
        ]
      }
    },

    /* ───────── BLOCK 4 — Fill in the Blank (scored, mixed mode) ───────── */
    {
      id: "b4", type: "fillBlank", scored: true,
      title: "Complete the phrase", eyebrow: "Practice · Step 3–4",
      sub: "Some you'll type yourself, some you'll pick from a word bank.",
      data: {
        questions: [
          { id:"b4q1", kind:"fillBlankTyping", alwaysCorrect:true,
            promptParts:["わたしは", "__BLANK__", "です。"],
            acceptedAnswers:["*"],
            explanation:"This one's about you — any name you type here is correct." },
          { id:"b4q2", kind:"fillBlankBank",
            promptParts:["__BLANK__", "おねがいします。"],
            bank:["よろしく","どうぞ","ありがとう"], correctAnswer:"よろしく",
            explanation:"よろしくおねがいします — the set phrase for \u201clooking forward to it.\u201d" },
          { id:"b4q3", kind:"fillBlankTyping",
            promptParts:["いってきます。 → いってら", "__BLANK__", "。"],
            acceptedAnswers:["しゃい","っしゃい"],
            explanation:"いってらっしゃい completes the pair — said by whoever stays home." },
          { id:"b4q4", kind:"fillBlankTyping",
            promptParts:["おかえり。 → た", "__BLANK__", "。"],
            acceptedAnswers:["だいま"],
            explanation:"ただいま completes the homecoming pair — said by whoever's arriving." }
        ]
      }
    },

    /* ───────── BLOCK 5 — Sentence Ordering (scored) ───────── */
    {
      id: "b5", type: "sentenceOrder", scored: true,
      title: "Put it in order", eyebrow: "Practice · Step 5",
      sub: "Tap the pieces in the order that feels right.",
      data: {
        items: [
          { id:"o1", label:"Your self-introduction",
            chunks:[{id:"a",jp:"はじめまして。"},{id:"b",jp:"わたしは{{name}}です。"},{id:"c",jp:"よろしくおねがいします。"}],
            correctOrder:["a","b","c"] },
          { id:"o2", label:"How the greeting naturally unfolds",
            chunks:[{id:"a",jp:"こんにちは。"},{id:"b",jp:"おなまえは？"},{id:"c",jp:"わたしは{{name}}です。"}],
            correctOrder:["a","b","c"] },
          { id:"o3", label:"Leaving the house",
            chunks:[{id:"a",jp:"いってきます。"},{id:"b",jp:"いってらっしゃい。"}],
            correctOrder:["a","b"] }
        ]
      }
    },

    /* ───────── BLOCK 6 — Short Reading (unscored) ───────── */
    {
      id: "b6", type: "reading", scored: false,
      title: "A Day in the Story", eyebrow: "Application · Step 6",
      sub: "Only expressions from this unit appear below — nothing new to decode.",
      data: {
        passage: [
          { stage: "Arriving at the house" },
          { speaker: "Anna", jp: "こんにちは。" },
          { speaker: "{{name}}", jp: "こんにちは。はじめまして。わたしは{{name}}です。" },
          { speaker: "Anna", jp: "よろしくおねがいします。" },
          { stage: "The next morning" },
          { speaker: "Anna", jp: "おはよう！" },
          { speaker: "{{name}}", jp: "おはよう！いってきます。" },
          { speaker: "Anna", jp: "いってらっしゃい。" },
          { stage: "At school" },
          { speaker: "Teacher", jp: "おはようございます。" },
          { speaker: "{{name}}", jp: "おはようございます。" },
          { stage: "Arriving home" },
          { speaker: "Anna", jp: "おかえり！" },
          { speaker: "{{name}}", jp: "ただいま。" }
        ]
      }
    },

    /* ───────── BLOCK 7 — Reading Questions (scored) ───────── */
    {
      id: "b7", type: "readingQuestions", scored: true, passageRef: "b6",
      title: "About the story", eyebrow: "Application · Step 6–7",
      sub: "Based on what you just read.",
      data: {
        questions: [
          { id:"b7q1", kind:"mcq", prompt:{ text:"What does Anna say when she first sees you at the door?" },
            options:["こんにちは","ただいま","おかえり"], correctIndex:0,
            explanation:"Anna opens with こんにちは — the standard daytime greeting." },
          { id:"b7q2", kind:"trueFalse", prompt:{ text:"You are the one who says いってらっしゃい before leaving for school." },
            correctAnswer:false,
            explanation:"Actually the reverse — you say いってきます (you're leaving); Anna says いってらっしゃい (she's staying)." },
          { id:"b7q3", kind:"fillBlankTyping", promptParts:["When you arrive home, you say ", "__BLANK__", "。"],
            acceptedAnswers:["ただいま"],
            explanation:"ただいま — announcing that you're home." },
          { id:"b7q4", kind:"mcq", prompt:{ text:"Why does the teacher say おはようございます instead of おはよう?" },
            options:["It's more polite/formal","It means something different","No particular reason"], correctIndex:0,
            explanation:"Same meaning, different politeness level — おはようございます suits school and formal settings." }
        ]
      }
    }
  ]
};
