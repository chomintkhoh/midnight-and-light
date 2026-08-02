/* ══════════════════════════════════════════════
   CONTENT — Japanese Vocabulary — Unit 1: Greetings
   Domain: "vocabulary"
   One entry per real-world expression. Referenced by
   id from sentences, reading, and assignment activities
   — never duplicated as raw text elsewhere.
══════════════════════════════════════════════ */

export const VOCAB = {
  "ja-vocab-konnichiwa": {
    id: "ja-vocab-konnichiwa", language: "ja", domain: "vocabulary",
    term: "こんにちは。", meaning: "Hello", audio: "こんにちは"
  },
  "ja-vocab-onamae": {
    id: "ja-vocab-onamae", language: "ja", domain: "vocabulary",
    term: "おなまえは？", meaning: "What's your name?", audio: "おなまえは"
  },
  "ja-vocab-watashi-desu": {
    id: "ja-vocab-watashi-desu", language: "ja", domain: "vocabulary",
    template: "{{pronoun}}は{{name}}です。",
    pronounOptions: ["わたし", "ぼく"],
    meaning: "I am {{name}}.",
    audio: "{{pronoun}}は{{name}}です"
  },
  "ja-vocab-hajimemashite": {
    id: "ja-vocab-hajimemashite", language: "ja", domain: "vocabulary",
    term: "はじめまして。", meaning: "Nice to meet you (first time)", audio: "はじめまして"
  },
  "ja-vocab-yoroshiku": {
    id: "ja-vocab-yoroshiku", language: "ja", domain: "vocabulary",
    term: "よろしくおねがいします。", meaning: "Looking forward to it", audio: "よろしくおねがいします"
  },
  "ja-vocab-douzo": {
    id: "ja-vocab-douzo", language: "ja", domain: "vocabulary",
    term: "どうぞ。", meaning: "Here you go / please", audio: "どうぞ"
  },
  "ja-vocab-arigatou-gozaimasu": {
    id: "ja-vocab-arigatou-gozaimasu", language: "ja", domain: "vocabulary",
    term: "ありがとうございます。", meaning: "Thank you", audio: "ありがとうございます"
  },
  "ja-vocab-ohayou": {
    id: "ja-vocab-ohayou", language: "ja", domain: "vocabulary",
    term: "おはよう。", meaning: "Good morning (casual)", audio: "おはよう", register: "casual"
  },
  "ja-vocab-ohayou-gozaimasu": {
    id: "ja-vocab-ohayou-gozaimasu", language: "ja", domain: "vocabulary",
    term: "おはようございます。", meaning: "Good morning (polite)", audio: "おはようございます", register: "polite"
  },
  "ja-vocab-ittekimasu": {
    id: "ja-vocab-ittekimasu", language: "ja", domain: "vocabulary",
    term: "いってきます。", meaning: "I'm heading out (I'll be back)", audio: "いってきます", pairRole: "leaving"
  },
  "ja-vocab-itterasshai": {
    id: "ja-vocab-itterasshai", language: "ja", domain: "vocabulary",
    term: "いってらっしゃい。", meaning: "Take care / see you later", audio: "いってらっしゃい", pairRole: "staying"
  },
  "ja-vocab-tadaima": {
    id: "ja-vocab-tadaima", language: "ja", domain: "vocabulary",
    term: "ただいま。", meaning: "I'm home", audio: "ただいま", pairRole: "arriving"
  },
  "ja-vocab-okaeri": {
    id: "ja-vocab-okaeri", language: "ja", domain: "vocabulary",
    term: "おかえり。", meaning: "Welcome home", audio: "おかえり", pairRole: "greeting-arrival"
  }
};
