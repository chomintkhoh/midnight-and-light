/* Teacher-led trial: introduction, five vowels with short checkpoints,
   recognition practice, greetings and a first self-introduction. */

const app = document.getElementById("exp-app");

/* ---------- Language ---------- */

const LANG_KEY = "expLangV1";
let lang = "en";
try {
  const saved = localStorage.getItem(LANG_KEY);
  if (saved === "en" || saved === "zh") lang = saved;
  else if (/^zh/i.test(navigator.language || "")) lang = "zh";
} catch (e) {}

const L = (en, zh) => (lang === "zh" ? zh : en);
const k = s => `<span class="kana" lang="ja">${s}</span>`;

// Every translatable node remembers how to repaint itself, so switching
// language never resets drawings, game progress or revealed cards.
const live = new Map();
function paint(node) {
  const e = live.get(node);
  if (e.html) node.innerHTML = e.fn(); else node.textContent = e.fn();
}
function setT(node, fn, html = false) {
  live.set(node, { fn, html });
  paint(node);
  return node;
}
function el(tag, cls, text, html = false) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (typeof text === "function") setT(n, text, html);
  else if (text != null) { if (html) n.innerHTML = text; else n.textContent = text; }
  return n;
}

function paintHeader() {
  document.documentElement.lang = lang === "zh" ? "zh-Hans" : "en";
  const set = (id, fn, html) => { const n = document.getElementById(id); if (n) { if (html) n.innerHTML = fn(); else n.textContent = fn(); } };
  set("exp-eyebrow", () => L("Free Trial", "免费体验"));
  set("exp-title", () => L("Experience a Lesson", "体验一堂日语课"));
  set("exp-lead", () => L(
    `A short, interactive first look at Japanese — learn your first five Hiragana, ${k("あいうえお")}.`,
    `简短的互动体验课——学会你的第一批平假名：${k("あいうえお")}。`
  ), true);
}

function setLang(next) {
  lang = next;
  try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}
  paintHeader();
  live.forEach((_, node) => { if (node.isConnected) paint(node); });
  document.querySelectorAll(".lang-toggle button").forEach(b => b.classList.toggle("active", b.dataset.lang === lang));
}

function langToggle() {
  const box = el("div", "lang-toggle");
  box.setAttribute("role", "group");
  box.setAttribute("aria-label", "Language / 语言");
  [["en", "English"], ["zh", "中文"]].forEach(([id, label]) => {
    const b = el("button", id === lang ? "active" : "", label);
    b.type = "button";
    b.dataset.lang = id;
    b.addEventListener("click", () => setLang(id));
    box.appendChild(b);
  });
  return box;
}

/* ---------- Lesson data ---------- */

const CHARS = [
  { char: "あ", vocab: [
      { word: "あめ", romaji: "ame", emoji: "🌧️", en: "Rain", zh: "雨" },
      { word: "あさ", romaji: "asa", emoji: "🌅", en: "Morning", zh: "早上" },
      { word: "あか", romaji: "aka", emoji: "🔴", en: "Red", zh: "红色" }
    ] },
  { char: "い", vocab: [
      { word: "いぬ", romaji: "inu", emoji: "🐶", en: "Dog", zh: "狗" },
      { word: "いえ", romaji: "ie", emoji: "🏠", en: "House", zh: "房子" },
      { word: "いす", romaji: "isu", emoji: "🪑", en: "Chair", zh: "椅子" }
    ] },
  { char: "う", vocab: [
      { word: "うみ", romaji: "umi", emoji: "🌊", en: "Sea", zh: "海" },
      { word: "うし", romaji: "ushi", emoji: "🐄", en: "Cow", zh: "牛" },
      { word: "うた", romaji: "uta", emoji: "🎵", en: "Song", zh: "歌" }
    ] },
  { char: "え", vocab: [
      { word: "えき", romaji: "eki", emoji: "🚉", en: "Station", zh: "车站" },
      { word: "えんぴつ", romaji: "enpitsu", emoji: "✏️", en: "Pencil", zh: "铅笔" },
      { word: "えほん", romaji: "ehon", emoji: "📖", en: "Picture book", zh: "绘本" }
    ] },
  { char: "お", vocab: [
      { word: "おちゃ", romaji: "ocha", emoji: "🍵", en: "Tea", zh: "茶" },
      { word: "おかし", romaji: "okashi", emoji: "🍪", en: "Snacks", zh: "零食" },
      { word: "おと", romaji: "oto", emoji: "🔊", en: "Sound", zh: "声音" }
    ] }
];

const SCRIPT_NAMES = {
  Hiragana: { en: "Hiragana", zh: "平假名" },
  Katakana: { en: "Katakana", zh: "片假名" },
  Kanji: { en: "Kanji", zh: "汉字" }
};

const SCRIPT_EXPLANATIONS = {
  Hiragana: {
    en: "Hiragana — grammar, particles, endings and many Japanese words",
    zh: "平假名——用于助词、词尾、文法以及许多日语词汇"
  },
  Katakana: {
    en: "Katakana — foreign words, names and special emphasis",
    zh: "片假名——用于外来语、外国名字以及特别强调"
  },
  Kanji: {
    en: "Kanji — carries the main meaning of many words",
    zh: "汉字——承载许多词汇的主要意思"
  }
};

const SENTENCES = [
  {
    parts: [
      { text: "私", label: "Kanji" },
      { text: "は", label: "Hiragana" },
      { text: "マレーシア", label: "Katakana" },
      { text: "人", label: "Kanji" },
      { text: "です", label: "Hiragana" },
      { text: "。", label: null }
    ],
    en: "I am Malaysian.", zh: "我是马来西亚人。"
  },
  {
    parts: [
      { text: "私", label: "Kanji" },
      { text: "は", label: "Hiragana" },
      { text: "コーヒー", label: "Katakana" },
      { text: "が", label: "Hiragana" },
      { text: "すき", label: "Hiragana" },
      { text: "です", label: "Hiragana" },
      { text: "。", label: null }
    ],
    en: "I like coffee.", zh: "我喜欢咖啡。"
  }
];

// Empty strings are the real gaps in the grid (や row, わ row, ん).
const GOJUON_ROWS = [
  ["あ", "い", "う", "え", "お"],
  ["か", "き", "く", "け", "こ"],
  ["さ", "し", "す", "せ", "そ"],
  ["た", "ち", "つ", "て", "と"],
  ["な", "に", "ぬ", "ね", "の"],
  ["は", "ひ", "ふ", "へ", "ほ"],
  ["ま", "み", "む", "め", "も"],
  ["や", "", "ゆ", "", "よ"],
  ["ら", "り", "る", "れ", "ろ"],
  ["わ", "", "", "", "を"],
  ["ん", "", "", "", ""]
];

const DAKUTEN_ROWS = [
  ["が", "ぎ", "ぐ", "げ", "ご"],
  ["ざ", "じ", "ず", "ぜ", "ぞ"],
  ["だ", "ぢ", "づ", "で", "ど"],
  ["ば", "び", "ぶ", "べ", "ぼ"]
];
const HANDAKUTEN_ROW = ["ぱ", "ぴ", "ぷ", "ぺ", "ぽ"];
const COMBINATION_ROWS = [
  ["きゃ", "きゅ", "きょ"], ["しゃ", "しゅ", "しょ"], ["ちゃ", "ちゅ", "ちょ"],
  ["にゃ", "にゅ", "にょ"], ["ひゃ", "ひゅ", "ひょ"], ["みゃ", "みゅ", "みょ"],
  ["りゃ", "りゅ", "りょ"], ["ぎゃ", "ぎゅ", "ぎょ"], ["じゃ", "じゅ", "じょ"],
  ["びゃ", "びゅ", "びょ"], ["ぴゃ", "ぴゅ", "ぴょ"]
];

const K_ROW_PATTERN = [
  { vowel: "A", romaji: "KA", kana: "か" },
  { vowel: "I", romaji: "KI", kana: "き" },
  { vowel: "U", romaji: "KU", kana: "く" },
  { vowel: "E", romaji: "KE", kana: "け" },
  { vowel: "O", romaji: "KO", kana: "こ" }
];

const PREVIEW_SOUNDS = [
  { en: "Voiced sounds", zh: "浊音", pairs: [["か", "が"], ["さ", "ざ"]] },
  { en: "Semi-voiced sounds", zh: "半浊音", pairs: [["は", "ぱ"]] },
  { en: "Combination sounds", zh: "拗音", pairs: [["き + ゃ", "きゃ"], ["し + ゅ", "しゅ"]] }
];

const GROUP = CHARS.map(c => c.char);
// Distractors only; the targets are always あいうえお.
const DISTRACTOR_POOL = [
  "か", "き", "く", "け", "こ", "さ", "し", "す", "せ", "そ",
  "た", "ち", "つ", "て", "と", "な", "に", "ぬ", "ね", "の",
  "は", "ひ", "ふ", "へ", "ほ", "ま", "み", "む", "め", "も",
  "や", "ゆ", "よ", "ら", "り", "る", "れ", "ろ", "わ", "を", "ん"
];

/* ---------- Practice sets ---------- */

let lastPracticeSignature = null;
let currentPracticeSet = null;

function sampleUnique(pool, count, excluded = []) {
  const blocked = new Set(excluded);
  return shuffle(pool.filter(ch => !blocked.has(ch))).slice(0, count);
}

function buildPracticeSet(group, distractorPool) {
  let set, signature, attempts = 0;
  do {
    const listening = shuffle(group).map(target => ({
      target, choices: shuffle([target, ...sampleUnique(distractorPool, 4)])
    }));
    const oddOneOut = sampleUnique(distractorPool, 3).map((distractor, index) => {
      const omitted = group[(Math.floor(Math.random() * group.length) + index) % group.length];
      return { target: distractor, choices: shuffle([...group.filter(c => c !== omitted), distractor]) };
    });
    set = { listening, oddOneOut };
    signature = JSON.stringify(set);
    attempts++;
  } while (signature === lastPracticeSignature && attempts < 30);
  lastPracticeSignature = signature;
  return set;
}

function ensurePracticeSet() {
  if (!currentPracticeSet) currentPracticeSet = buildPracticeSet(GROUP, DISTRACTOR_POOL);
  return currentPracticeSet;
}
function resetPracticeSet() {
  currentPracticeSet = buildPracticeSet(GROUP, DISTRACTOR_POOL);
}

/* ---------- Audio (characters only; vocabulary has no audio) ---------- */

const HIRAGANA_AUDIO_FILES = {
  "あ": "assets/audio/japanese/hiragana/a.mp3",
  "い": "assets/audio/japanese/hiragana/i.mp3",
  "う": "assets/audio/japanese/hiragana/u.mp3",
  "え": "assets/audio/japanese/hiragana/e.mp3",
  "お": "assets/audio/japanese/hiragana/o.mp3"
};
let currentAudio = null;

function playHiraganaAudio(char, btn) {
  const src = HIRAGANA_AUDIO_FILES[char];
  if (!src) return;
  if (currentAudio) currentAudio.pause();
  currentAudio = new Audio(src);
  if (btn) {
    btn.classList.add("playing");
    const done = () => btn.classList.remove("playing");
    currentAudio.addEventListener("ended", done);
    currentAudio.addEventListener("error", done);
    currentAudio.addEventListener("pause", done);
  }
  currentAudio.play().catch(() => {});
}

/* ---------- Small helpers ---------- */

function primaryButton(label, onClick, opts = {}) {
  const btn = el("button", "exp-btn" + (opts.secondary ? " secondary" : ""), label, opts.html);
  btn.type = "button";
  btn.addEventListener("click", onClick);
  return btn;
}

function instructionBlock(main, sub) {
  const wrap = el("div");
  wrap.appendChild(el("div", "exp-instruction", main, true));
  if (sub) wrap.appendChild(el("div", "exp-subinstruction", sub, true));
  return wrap;
}

function note(text, cls = "exp-note") {
  return el("p", cls, text, true);
}

// Every screen starts with a top bar: position on the left, language on the right.
function card(label) {
  if (currentAudio) currentAudio.pause();
  live.clear();
  const c = el("div", "exp-card");
  const bar = el("div", "exp-topbar");
  bar.appendChild(el("div", "exp-step-count", label || `${stepIndex + 1} / ${steps.length}`));
  bar.appendChild(langToggle());
  c.appendChild(bar);
  const progress = el("div", "exp-progress");
  const fill = el("div", "exp-progress-fill");
  fill.style.width = `${((stepIndex + 1) / steps.length) * 100}%`;
  progress.appendChild(fill);
  c.appendChild(progress);
  app.innerHTML = "";
  app.appendChild(c);
  return c;
}

function practiceLabel(n, en, zh) {
  return () => L(`Practice ${n} of 3 · ${en}`, `练习 ${n} / 3 · ${zh}`);
}

function vowelLine() {
  return el("div", "exp-big exp-vowel-line kana", "あ　い　う　え　お");
}

/* ---------- Navigation ---------- */

function appendNav(c, { nextLabel, onNext } = {}) {
  const row = el("div", "exp-nav-row");
  if (stepIndex > 0) row.appendChild(primaryButton(() => L("← Previous", "← 上一页"), goPrevious, { secondary: true }));
  if (stepIndex < steps.length - 1) row.appendChild(primaryButton(nextLabel || (() => L("Next →", "下一页 →")), onNext || goNext));
  c.appendChild(row);
}

function goNext() {
  if (stepIndex < steps.length - 1) { stepIndex++; render(); }
}
function goPrevious() {
  if (stepIndex > 0) { stepIndex--; render(); }
}
function goToPractice() {
  stepIndex = steps.findIndex(s => s.type === "game1");
  resetPracticeSet();
  render();
}

/* ---------- Handwriting canvas ---------- */

function enableDrawing(canvas) {
  const ctx = canvas.getContext("2d");
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = "#252B45";
  ctx.lineWidth = 12;
  let drawing = false;

  function pointFromEvent(e) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height)
    };
  }
  canvas.addEventListener("pointerdown", e => {
    drawing = true;
    canvas.setPointerCapture(e.pointerId);
    const p = pointFromEvent(e);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
  });
  canvas.addEventListener("pointermove", e => {
    if (!drawing) return;
    const p = pointFromEvent(e);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
  });
  function stopDrawing(e) {
    if (!drawing) return;
    drawing = false;
    ctx.closePath();
    if (e && canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId);
  }
  canvas.addEventListener("pointerup", stopDrawing);
  canvas.addEventListener("pointercancel", stopDrawing);
  canvas.addEventListener("pointerleave", e => { if (e.buttons === 0) stopDrawing(e); });
}

/* Stroke path data: KanjiVG, Copyright (C) 2009/2010/2011 Ulrich Apel.
   https://kanjivg.tagaini.net — CC BY-SA 3.0.
   Extracted paths retain their original geometry. Display/animation added here.
   https://creativecommons.org/licenses/by-sa/3.0/ */
const VOWEL_STROKES = {"あ":["M31.01,33c0.88,0.88,2.75,1.82,5.25,1.75c8.62-0.25,20-2.12,29.5-4.25c1.51-0.34,4.62-0.88,6.62-0.5","M49.76,17.62c0.88,1,1.82,3.26,1.38,5.25c-3.75,16.75-6.25,38.13-5.13,53.63c0.41,5.7,1.88,10.88,3.38,13.62","M65.63,44.12c0.75,1.12,1.16,4.39,0.5,6.12c-4.62,12.26-11.24,23.76-25.37,35.76c-6.86,5.83-15.88,3.75-16.25-8.38c-0.34-10.87,13.38-23.12,32.38-26.74c12.42-2.37,27,1.38,30.5,12.75c4.05,13.18-3.76,26.37-20.88,30.49"],"い":["M21.5,29.66c2.01,2.17,2.61,4.68,2.17,7.43c-3.09,19.16-1.03,32.01,7.93,41.45c6.12,6.45,6.26,3.14,7.04-5.21","M72.96,36.51c9.44,8.05,17.79,18.82,18.41,33.83"],"う":["M42,15.5c5.62,2.12,9.62,3,12.88,3c8.27,0,8,1.12-0.38,5.5","M33,42.38c2.12,1.12,4.12,2.88,8.5,1.38c4.38-1.5,12.75-7.12,18.5-7c5.75,0.12,10.25,5,10.25,18c0,15.49-8.25,30.24-24.37,41.24"],"え":["M40.52,13.25c5.62,2.12,10,3,14.12,3c8.27,0,8,1.12-0.38,5.5","M32.52,45.12c1.88,1.25,4.5,1.75,7.38,0.62c3.29-1.29,17-7.88,21.25-9.88c4.25-2,8.32,0.04,4.38,4.62c-12.26,14.27-27.26,31.52-39.51,44.4c-3.26,3.42-0.58,3.54,1.5,1.37c13.5-14.12,18.12-20.12,23.62-20.12c7.13,0,3.5,16.75,6.75,22.38c3.25,5.63,19.12,3.75,26.12,2.12"],"お":["M22.88,35.12c1.38,1,3.62,2.38,6,2.12c2.38-0.26,19.62-5.12,21.12-5.74c1.5-0.62,4-1.25,5.88-2","M41.5,16.12c2.25,1,3.59,4.39,3.12,7.38c-2.5,16.12-3.37,45.53-2.25,58.38c0.75,8.62-0.64,10.45-7.12,7.12c-5.13-2.62-13.75-8-13.75-12.38c0-7.5,24.38-23.62,44.75-23.62c17.25,0,25,8.25,25,17.25c0,8.25-9.38,18.88-26.75,21","M73,22.12c5.38,2.62,8.88,5.88,10.62,8.25c2.27,3.08,0.38,4.5-1.12,5"]};
function strokeModel(char) {
  const box = el("div", "exp-stroke-model");
  box.innerHTML = '<svg viewBox="0 0 109 109" role="img" aria-label="Stroke model for ' + char + '">' +
    VOWEL_STROKES[char].map(d => '<path class="stroke-guide" d="' + d + '"/>').join("") +
    VOWEL_STROKES[char].map(d => '<path class="stroke-ink" pathLength="1" d="' + d + '"/>').join("") + '</svg>';
  return box;
}
function strokeControls(model, char) {
  let shown = 0;
  const wrap = el("div", "exp-stroke-controls");
  const status = el("p", "exp-note small", () => L("Watch the strokes, then trace.", "先看笔顺，再描写。"));
  status.setAttribute("aria-live", "polite");
  const button = primaryButton(() => L("Show next stroke", "显示下一笔"), () => {
    if (shown === VOWEL_STROKES[char].length) {
      model.querySelectorAll(".stroke-ink").forEach(p => p.classList.remove("visible"));
      shown = 0;
    }
    const path = model.querySelectorAll(".stroke-ink")[shown++];
    path.classList.add("visible");
    setT(status, () => L("Stroke " + shown + " of " + VOWEL_STROKES[char].length,
      "第 " + shown + " / " + VOWEL_STROKES[char].length + " 笔"));
    setT(button, () => shown === VOWEL_STROKES[char].length ? L("Replay from stroke 1", "重新从第一笔开始") : L("Show next stroke", "显示下一笔"));
  }, {secondary:true});
  wrap.append(status, button);
  return wrap;
}

/* ---------- Steps ---------- */

const steps = [
  { type: "welcome" },
  { type: "motivation" },
  { type: "writingSystems" },
  { type: "kanaOverview" },
  { type: "vowelsChart" },
  ...CHARS.flatMap((c, i) => [
    { type: "learnChar", char: c },
    ...(i === 1 || i === 3 ? [{type:"miniCheck", group:CHARS.slice(0, i + 1).map(x => x.char)}] : [])
  ]),
  { type: "soundPattern" },
  { type: "game1" },
  { type: "game2" },
  { type: "game3" },
  { type: "greetings" },
  { type: "introduce" },
  { type: "finish" }
];

let stepIndex = 0;

function render() {
  document.body.classList.toggle("lesson-active", stepIndex > 0);
  const step = steps[stepIndex];
  renderers[step.type](step);
  app.querySelectorAll(".exp-teacher-note:not(details)").forEach(n => {
    const details = el("details", "exp-teacher-note");
    details.appendChild(el("summary", "", () => L("Teacher notes", "教师备注")));
    n.className = "exp-teacher-note-body";
    n.replaceWith(details);
    details.appendChild(n);
  });
  const top = app.getBoundingClientRect().top + window.scrollY - 90;
  window.scrollTo({ top: Math.max(0, top), behavior: "auto" });
}

const renderers = {
  welcome() {
    const c = card();
    c.appendChild(el("div", "exp-slide-kicker", () => L("Free Japanese Trial Lesson", "日语免费体验课")));
    c.appendChild(el("div", "exp-mid", () => L("Welcome to Your Trial Lesson", "欢迎来到日语体验课程")));
    c.appendChild(el("div", "exp-big kana", "ようこそ"));
    c.appendChild(note(() => L(
      "Today, we will explore how Japanese is written and learn your first five Hiragana sounds together.",
      "今天，我们会一起认识日语的书写方式，并学习最开始的五个平假名发音。"
    )));
    c.appendChild(el("div", "exp-teacher-note", () => L(
      "<strong>Teacher opening:</strong> Welcome the student, introduce yourself briefly, and explain that they can ask questions at any time.",
      "<strong>老师开场：</strong>欢迎学生，简单自我介绍，并告诉学生过程中随时可以提问。"
    ), true));
    appendNav(c, { nextLabel: () => L("Let’s begin →", "开始体验 →") });
  },

  motivation() {
    const c = card();
    c.appendChild(el("div", "exp-slide-kicker", () => L("Before we begin", "开始之前")));
    c.appendChild(el("div", "exp-mid", () => L("Why Japanese?", "为什么想学日语？")));
    c.appendChild(note(() => L(
      "Choose anything that interests you. There is no right answer — this helps your teacher understand you.",
      "选择你感兴趣的项目。没有标准答案——这能帮助老师了解你。"
    )));

    const topics = [
      ["🎌", "Japan", "日本"], ["✈️", "Travel", "旅行"], ["🎮", "Games", "游戏"],
      ["🎬", "Anime & films", "动漫与电影"], ["🍙", "Food", "日本料理"], ["📚", "Study or work", "学习或工作"]
    ];
    const grid = el("div", "exp-prompt-grid");
    topics.forEach(([icon, en, zh]) => {
      const b = el("button", "exp-prompt");
      b.type = "button";
      const iconNode = el("span", "", icon); iconNode.setAttribute("aria-hidden", "true");
      b.appendChild(iconNode);
      b.appendChild(el("b", "", () => L(en, zh)));
      b.addEventListener("click", () => b.classList.toggle("selected"));
      grid.appendChild(b);
    });
    c.appendChild(grid);
    c.appendChild(el("div", "exp-teacher-note", () => L(
      "<strong>Teacher prompt:</strong> Have you learned Japanese before? Do you already know any Japanese words? What would you like to do in Japanese?",
      "<strong>老师提示：</strong>以前学过日语吗？已经认识哪些日语？最希望将来能用日语做什么？"
    ), true));
    appendNav(c, { nextLabel: () => L("Let’s explore Japanese →", "一起认识日语 →") });
  },

  learnChar(step) {
    const c = card();
    c.classList.add("exp-learn-slide");
    const { char, vocab } = step.char;
    const layout = el("div", "exp-learn-layout");
    const writingCol = el("section", "exp-learn-writing");
    const infoCol = el("section", "exp-learn-info");

    writingCol.appendChild(el("div", "exp-section-title", () => L("Write it", "写一写")));
    const pair = el("div", "exp-writing-pair");
    const canvases = [];
    let model;
    [[() => L("Trace", "描一描"), true], [() => L("By yourself", "自己写"), false]].forEach(([label, withRef]) => {
      const box = el("div", "exp-writing-box");
      box.appendChild(el("div", "exp-writing-label", label));
      const wrap = el("div", "exp-canvas-wrap");
      const canvas = el("canvas", "exp-writing-canvas");
      canvas.width = 440;
      canvas.height = 440;
      canvas.setAttribute("aria-label", `Writing practice for ${char}`);
      wrap.appendChild(canvas);
      if (withRef) { model = strokeModel(char); wrap.appendChild(model); }
      box.appendChild(wrap);
      pair.appendChild(box);
      enableDrawing(canvas);
      canvases.push(canvas);
    });
    writingCol.appendChild(pair);
    const clear = el("button", "exp-clear-btn", () => L("Clear both", "全部清除"));
    clear.type = "button";
    clear.addEventListener("click", () => canvases.forEach(cv => cv.getContext("2d").clearRect(0, 0, cv.width, cv.height)));
    writingCol.appendChild(clear);
    writingCol.appendChild(strokeControls(model, char));
    const writingNote = el("div", "exp-teacher-note");
    writingNote.appendChild(el("p", "", () => L(
      "Show one stroke at a time, then let the student trace and try independently. The three words are examples; memorising all of them is optional.",
      "逐笔示范，再让学生描写和自己尝试。三个单词是发音例子，不需要全部记熟。")));
    writingNote.appendChild(el("p", "exp-credits",
      'Stroke paths © Ulrich Apel / <a href="https://kanjivg.tagaini.net/" target="_blank" rel="noopener">KanjiVG</a> · <a href="https://creativecommons.org/licenses/by-sa/3.0/" target="_blank" rel="noopener">CC BY-SA 3.0</a>. Original paths; step display added.', true));
    writingCol.appendChild(writingNote);

    const soundHead = el("div", "exp-learn-sound");
    soundHead.appendChild(el("div", "exp-big exp-char kana", char));
    const soundText = el("div", "exp-learn-sound-actions");
    const speaker = el("button", "exp-speaker");
    speaker.type = "button";
    speaker.innerHTML = `<span aria-hidden="true">🔊</span>`;
    speaker.setAttribute("aria-label", "Play the sound / 播放发音");
    speaker.addEventListener("click", () => playHiraganaAudio(char, speaker));
    soundText.appendChild(speaker);
    soundText.appendChild(el("div", "exp-subinstruction", () => L("Listen, then say it aloud.", "听一听，然后大声跟读。")));
    soundHead.appendChild(soundText);
    infoCol.appendChild(soundHead);

    infoCol.appendChild(el("div", "exp-section-title", () => L(`Words with ${k(char)}`, `有 ${k(char)} 的词`), true));
    infoCol.appendChild(el("div", "exp-subinstruction", () => L("Tap a word to reveal its meaning.", "点一下词语，显示意思。")));
    const grid = el("div", "exp-vocab-grid");
    vocab.forEach(v => {
      const item = el("button", "exp-vocab-card");
      item.type = "button";
      item.appendChild(el("div", "emoji", v.emoji));
      const wordBlock = el("div", "exp-vocab-wordblock");
      wordBlock.appendChild(el("div", "word kana", v.word.replace(char, `<strong>${char}</strong>`), true));
      wordBlock.appendChild(el("div", "vocab-romaji", v.romaji));
      item.appendChild(wordBlock);
      item.appendChild(el("div", "meaning", () => L(v.en, v.zh)));
      item.addEventListener("click", () => item.classList.toggle("revealed"));
      grid.appendChild(item);
    });
    infoCol.appendChild(grid);

    layout.appendChild(infoCol);
    layout.appendChild(writingCol);
    c.appendChild(layout);
    appendNav(c);
  },

  miniCheck(step) {
    runListeningGame({
      questions: shuffle(step.group).slice(0, 2).map(target => ({target, choices:shuffle(step.group)})),
      onDone: goNext,
      quick: true
    });
  },

  greetings() {
    const c = card();
    c.appendChild(el("div", "exp-slide-kicker", () => L("A little conversation", "开口说日语")));
    c.appendChild(el("div", "exp-mid", () => L("Say Hello — and Thank You", "打个招呼，说声谢谢")));
    c.appendChild(note(() => L("Listen to your teacher, then try saying each phrase.", "先听老师说，再试着跟读。")));
    const grid = el("div", "exp-phrase-grid");
    [
      ["こんにちは", "konnichiwa", "Hello / Good afternoon", "你好／下午好"],
      ["ありがとうございます", "arigatō gozaimasu", "Thank you (polite)", "谢谢（礼貌表达）"],
      ["またね", "mata ne", "See you! (casual)", "再见！（朋友间）"]
    ].forEach(([ja, romaji, en, zh]) => {
      const box = el("div", "exp-phrase");
      box.append(el("div", "kana", ja), el("div", "exp-phrase-romaji", romaji), note(() => L(en, zh)));
      grid.appendChild(box);
    });
    c.appendChild(grid);
    c.appendChild(el("div", "exp-teacher-note", () => L("Model one phrase at a time. Greet the student, let them reply, then swap roles. Explain that またね is casual; use it here as a friendly goodbye.", "一次示范一句。先向学生打招呼，让学生回应，再交换角色。说明「またね」适合熟人之间，这里用作轻松的告别。")));
    appendNav(c, {nextLabel: () => L("Introduce yourself →", "介绍自己 →")});
  },

  introduce() {
    const c = card();
    c.appendChild(el("div", "exp-slide-kicker", () => L("Your first introduction", "第一次自我介绍")));
    c.appendChild(el("div", "exp-mid", () => L("Hello, I’m…", "你好，我是……")));
    c.appendChild(note(() => L("Say your name in the blank. Your usual name is fine.", "把自己的名字说进空格里，使用平常的名字就可以。")));
    const phrase = el("div", "exp-phrase");
    phrase.append(el("div", "kana", "わたしは　＿＿＿　です。"),
      el("div", "exp-phrase-romaji", "watashi wa [your name] desu"),
      note(() => L("I’m [your name]. Here, は is pronounced “wa”.", "我是［你的名字］。这里的「は」读作 wa。")));
    c.appendChild(phrase);
    const prompt = el("details", "exp-dialogue");
    prompt.appendChild(el("summary", "", () => L("Try a short conversation", "试一段小对话")));
    prompt.appendChild(note(() => L("Teacher: こんにちは。 → You: こんにちは。", "老师：こんにちは。→ 你：こんにちは。")));
    prompt.appendChild(el("div", "kana exp-dialogue-line", "わたしは　＿＿＿　です。"));
    prompt.appendChild(note(() => L("Finish with a thank-you: ありがとうございます。", "最后说声谢谢：ありがとうございます。")));
    c.appendChild(prompt);
    c.appendChild(el("div", "exp-teacher-note", () => L("Model your own introduction first. Support the student's pronunciation; no need to teach all the grammar or memorise every phrase today.", "先示范老师自己的自我介绍，再帮助学生发音。今天不需要解释全部文法，也不用背熟每一句。")));
    appendNav(c, {nextLabel: () => L("Finish the lesson →", "完成体验课 →")});
  },

  kanaOverview() {
    const c = card();
    c.classList.add("exp-map-slide");
    c.appendChild(el("div", "exp-slide-kicker", () => L("The sound map", "日语声音地图")));
    c.appendChild(el("div", "exp-mid", () => L("The Complete Hiragana System", "完整的平假名系统")));
    const mapLayout = el("div", "exp-kana-map-layout");

    const basic = el("section", "exp-map-panel exp-map-basic");
    basic.appendChild(el("h3", "", () => L("Basic Gojūon", "基础五十音")));
    const chart = el("div", "exp-gojuon-chart kana");
    GOJUON_ROWS.forEach((row, ri) => row.forEach(ch => {
      chart.appendChild(el("div", "exp-gojuon-cell" + (ri === 0 && ch ? " highlight" : ""), ch));
    }));
    basic.appendChild(chart);

    const advanced = el("section", "exp-map-panel exp-map-advanced");
    const voicedTitle = el("h3", "", () => L("Dakuten & Handakuten", "浊音与半浊音"));
    advanced.appendChild(voicedTitle);
    const voiced = el("div", "exp-sound-grid exp-sound-grid-five kana");
    [...DAKUTEN_ROWS, HANDAKUTEN_ROW].forEach((row, ri) => row.forEach(ch => {
      voiced.appendChild(el("div", "exp-sound-cell" + (ri === DAKUTEN_ROWS.length ? " handakuten" : ""), ch));
    }));
    advanced.appendChild(voiced);
    advanced.appendChild(el("h3", "exp-combo-title", () => L("Combination Sounds", "拗音／组合音")));
    const combos = el("div", "exp-sound-grid exp-sound-grid-three kana");
    COMBINATION_ROWS.forEach(row => row.forEach(ch => combos.appendChild(el("div", "exp-sound-cell", ch))));
    advanced.appendChild(combos);

    mapLayout.appendChild(basic);
    mapLayout.appendChild(advanced);
    c.appendChild(mapLayout);
    c.appendChild(note(() => L(
      "This is the whole map. Today we will focus only on the highlighted first row.",
      "这就是完整的学习地图。今天只专注左边标亮的第一行。"
    ), "exp-note small"));
    appendNav(c, { nextLabel: () => L("Today’s five vowels →", "今天的五个元音 →") });
  },

  vowelsChart() {
    const c = card();
    c.appendChild(el("div", "exp-slide-kicker", () => L("Today’s lesson", "今天的课程")));
    c.appendChild(el("div", "exp-mid", () => L("We’ll Start with the Five Vowels", "今天先学习五个元音")));
    c.appendChild(vowelLine());
    c.appendChild(el("div", "exp-romaji exp-vowel-romaji", "a　i　u　e　o"));
    c.appendChild(note(() => L(
      "These are the first row and the foundation of the Hiragana chart. We will learn how they sound, how they look and how to write them.",
      "它们是平假名表的第一行，也是后面所有发音的基础。今天会学习它们的声音、字形和写法。"
    )));
    c.appendChild(el("div", "exp-teacher-note", () => L(
      "<strong>Lesson goal:</strong> By the end, the student should be able to hear, recognise and try writing あ・い・う・え・お.",
      "<strong>本课目标：</strong>课程结束时，学生可以听辨、认读并尝试书写「あ・い・う・え・お」。"
    ), true));
    appendNav(c, { nextLabel: () => L("Learn あ →", "开始学习「あ」→") });
  },

  soundPattern() {
    const c = card();
    c.appendChild(el("div", "exp-mid", () => L("How the Chart Works", "这张表的规律")));
    c.appendChild(note(() => L(
      "Many rows combine a consonant with the five vowels. Here is the K row:",
      "许多行由一个辅音搭配这五个元音组成。比如 K 这一行："
    )));
    const rows = el("div", "exp-pattern-rows");
    K_ROW_PATTERN.forEach(p => {
      rows.appendChild(el("div", "exp-pattern-row", `K + ${p.vowel} → ${p.romaji} → ${k(p.kana)}`, true));
    });
    c.appendChild(rows);
    c.appendChild(el("div", "exp-pattern-chain", "A I U E O<br>↓<br>KA KI KU KE KO<br>↓<br>SA SHI SU SE SO", true));
    c.appendChild(note(() => L(
      "So if you know the vowels well, every new row is easier.",
      "所以元音学好了，后面每一行都会更容易。"
    )));

    c.appendChild(el("div", "exp-preview-label", () => L("Later on", "以后会学到")));
    const preview = el("div", "exp-preview");
    PREVIEW_SOUNDS.forEach(g => {
      const item = el("div", "exp-preview-item");
      item.appendChild(el("div", "exp-preview-name", () => L(g.en, g.zh)));
      item.appendChild(el("div", "exp-preview-row kana", g.pairs.map(([a, b]) => `<span>${a} → ${b}</span>`).join(""), true));
      preview.appendChild(item);
    });
    c.appendChild(preview);
    appendNav(c);
  },

  writingSystems() {
    const c = card();
    c.appendChild(el("div", "exp-mid", () => L("Three Writing Systems", "三种文字")));
    const row = el("div", "exp-writing-row");
    [["Hiragana", "あ い う"], ["Katakana", "ア イ ウ"], ["Kanji", "日 本 人"]].forEach(([name, sample]) => {
      const item = el("div", "exp-writing-item");
      item.appendChild(el("span", "type-label", () => L(SCRIPT_NAMES[name].en, SCRIPT_NAMES[name].zh)));
      item.appendChild(el("span", "kana", sample));
      row.appendChild(item);
    });
    c.appendChild(row);
    c.appendChild(instructionBlock(
      () => L("They are often mixed in one sentence.", "一个句子里常常三种一起用。"),
      () => L("Tap each part to see which one it is.", "点每个部分，看看它是哪一种。")
    ));

    let si = 0;
    const sentence = el("div", "exp-clickable-sentence kana");
    sentence.lang = "ja";
    const reveal = el("div", "exp-tag-reveal");
    const translation = el("p", "exp-note");
    function showSentence() {
      const s = SENTENCES[si];
      sentence.innerHTML = "";
      setT(reveal, () => "");
      s.parts.forEach(p => {
        const span = el("span", "", p.text);
        if (p.label) {
          span.addEventListener("click", () => {
            sentence.querySelectorAll("span").forEach(x => x.classList.remove("tapped"));
            span.classList.add("tapped");
            setT(reveal, () => L(SCRIPT_EXPLANATIONS[p.label].en, SCRIPT_EXPLANATIONS[p.label].zh));
          });
        }
        sentence.appendChild(span);
      });
      setT(translation, () => L(s.en, s.zh));
    }
    showSentence();
    c.appendChild(sentence);
    c.appendChild(reveal);
    c.appendChild(translation);
    const another = el("button", "exp-clear-btn", () => L("Another sentence", "换一句"));
    another.type = "button";
    another.addEventListener("click", () => { si = (si + 1) % SENTENCES.length; showSentence(); });
    c.appendChild(another);

    appendNav(c, { nextLabel: () => L("See the sound system →", "看看日语的声音系统 →") });
  },

  game1() {
    runListeningGame({ questions: ensurePracticeSet().listening, onDone: goNext });
  },

  game2() {
    runChoiceGame({
      label: practiceLabel(2, "Find the Difference", "找不同"),
      instruction: () => L("Which one is different?", "哪一个不一样？"),
      sub: () => L("Four of them are from today's lesson.", "其中四个是今天学过的。"),
      questions: ensurePracticeSet().oddOneOut,
      onDone: goNext
    });
  },

  game3() {
    runHiraganaMaze({ group: GROUP, distractorPool: DISTRACTOR_POOL, onDone: goNext });
  },

  finish() {
    const c = card();
    c.appendChild(el("div", "exp-mid", () => L("Great job!", "做得好！")));
    c.appendChild(note(() => L("Today you practised listening, recognising and writing:", "今天你练习了听辨、认读和书写：")));
    c.appendChild(vowelLine());
    c.appendChild(note(() => L("You also tried greeting someone and introducing yourself in Japanese.", "你也尝试了用日语打招呼和介绍自己。")));
    c.appendChild(el("div", "exp-instruction", () => L("Want to keep learning Japanese with me?", "想继续跟我学日语吗？")));
    c.appendChild(note(() => L(
      "If you enjoyed this trial, contact me to ask about lessons.",
      "如果你喜欢这堂体验课，欢迎联系我了解课程。"
    )));

    const actions = el("div", "exp-nav-row");
    actions.appendChild(primaryButton(() => L("Contact Me", "联系我"), () => { window.location.href = "contact.html"; }));
    actions.appendChild(primaryButton(() => L("Practice Again", "再练一次"), goToPractice, { secondary: true }));
    actions.appendChild(primaryButton(() => L("Start Again", "从头开始"), () => { stepIndex = 0; render(); }, { secondary: true }));
    c.appendChild(actions);

    const shortcut = el("div", "exp-practice-shortcut");
    shortcut.appendChild(el("div", "exp-subinstruction", () => L("Want to check what you really remember?", "想测一测自己真正记住了多少？")));
    shortcut.appendChild(primaryButton(
      () => L(`Test Your Memory · ${k("かな おさらい")}`, `记忆测验 · ${k("かな おさらい")}`),
      () => { window.location.href = "kana-recall.html?range=a"; },
      { secondary: true, html: true }
    ));
    c.appendChild(shortcut);
  }
};

/* ---------- Practice 1 — listening ---------- */

function runListeningGame({ questions, onDone, quick = false }) {
  let qi = 0;
  function renderQuestion() {
    const c = card();
    const q = questions[qi];
    const label = quick ? () => L("Quick check", "小练习") : practiceLabel(1, "Listening", "听力");
    setT(c.querySelector(".exp-step-count"), () => `${label()} · ${qi + 1}/${questions.length}`);
    c.appendChild(instructionBlock(() => L("Listen and choose the Hiragana you hear.", "听一听，选出你听到的平假名。")));

    const listenBtn = primaryButton(() => L("🔊 Listen", "🔊 听"), () => playHiraganaAudio(q.target, listenBtn));
    c.appendChild(listenBtn);

    const feedback = el("div", "exp-feedback");
    const grid = el("div", "exp-choice-grid kana");
    q.choices.forEach(choice => {
      const btn = el("button", "exp-choice", choice);
      btn.type = "button";
      btn.addEventListener("click", () => {
        if (choice === q.target) {
          btn.classList.add("correct");
          setT(feedback, () => L("✓ Correct!", "✓ 答对了！"));
          feedback.className = "exp-feedback good";
          grid.querySelectorAll("button").forEach(b => b.disabled = true);
          c.appendChild(primaryButton(() => qi === questions.length - 1 ? L("Continue →", "继续 →") : L("Next question →", "下一题 →"), () => {
            qi++;
            if (qi < questions.length) renderQuestion(); else onDone();
          }));
        } else {
          btn.classList.add("wrong");
          setT(feedback, () => L("↻ Try again.", "↻ 再试一次。"));
          feedback.className = "exp-feedback bad";
        }
      });
      grid.appendChild(btn);
    });
    c.appendChild(grid);
    c.appendChild(feedback);

    if (qi === 0) {
      const row = el("div", "exp-nav-row");
      row.appendChild(primaryButton(() => L("← Back to the lesson", "← 回到课程"), goPrevious, { secondary: true }));
      c.appendChild(row);
    }

    playHiraganaAudio(q.target, listenBtn);
  }
  renderQuestion();
}

/* ---------- Practice 2 — odd one out ---------- */

function runChoiceGame({ label, instruction, sub, questions, onDone }) {
  let qi = 0;
  function renderQuestion() {
    const c = card();
    const q = questions[qi];
    setT(c.querySelector(".exp-step-count"), () => `${label()} · ${qi + 1}/${questions.length}`);
    c.appendChild(instructionBlock(instruction, sub));

    const feedback = el("div", "exp-feedback");
    const grid = el("div", "exp-choice-grid kana");
    q.choices.forEach(choice => {
      const btn = el("button", "exp-choice", choice);
      btn.type = "button";
      btn.addEventListener("click", () => {
        if (choice === q.target) {
          btn.classList.add("correct");
          setT(feedback, () => L("✓ Correct!", "✓ 答对了！"));
          feedback.className = "exp-feedback good";
          grid.querySelectorAll("button").forEach(b => b.disabled = true);
          c.appendChild(primaryButton(() => L("Next question →", "下一题 →"), () => {
            qi++;
            if (qi < questions.length) renderQuestion(); else onDone();
          }));
        } else {
          btn.classList.add("wrong");
          setT(feedback, () => L("↻ Try again.", "↻ 再试一次。"));
          feedback.className = "exp-feedback bad";
        }
      });
      grid.appendChild(btn);
    });
    c.appendChild(grid);
    c.appendChild(feedback);
  }
  renderQuestion();
}

/* ---------- Practice 3 — Hiragana maze (find in order) ---------- */

function runHiraganaMaze({ group, distractorPool, onDone }) {
  const label = practiceLabel(3, "Hiragana Maze", "平假名迷宫");
  let previousBoardKey = null;
  let previousDistractors = [];

  function buildBoard() {
    let distractors = sampleUnique(distractorPool, 11, previousDistractors);
    if (distractors.length < 11) distractors = sampleUnique(distractorPool, 11);
    let board, key, attempts = 0;
    do {
      board = shuffle([...group, ...distractors]);
      key = board.join("|");
      attempts++;
    } while (key === previousBoardKey && attempts < 30);
    previousBoardKey = key;
    previousDistractors = distractors;
    return board;
  }

  function runRound({ guided, onComplete }) {
    const c = card();
    setT(c.querySelector(".exp-step-count"), label);
    c.appendChild(instructionBlock(
      guided ? () => L("Tap the Hiragana in order.", "按顺序点出平假名。")
             : () => L("Now find all five in order — no hints.", "这次没有提示，按顺序找出五个。"),
      guided ? () => L("Follow the order below.", "照下面的顺序。") : null
    ));

    if (guided) c.appendChild(el("div", "exp-maze-sequence kana", group.join(" → ")));

    const progress = el("div", "exp-maze-progress");
    c.appendChild(progress);
    const feedback = el("div", "exp-feedback");
    let nextIndex = 0;

    function updateProgress() {
      progress.innerHTML = group.map((_, i) =>
        `<span class="${i < nextIndex ? "done" : ""}">${i < nextIndex ? "●" : "○"}</span>`
      ).join("");
    }
    updateProgress();

    const grid = el("div", "exp-maze-grid kana");
    buildBoard().forEach(char => {
      const btn = el("button", "exp-maze-cell", char);
      btn.type = "button";
      btn.addEventListener("click", () => {
        if (btn.disabled) return;
        if (char === group[nextIndex]) {
          btn.classList.add("correct");
          btn.disabled = true;
          nextIndex++;
          const next = group[nextIndex];
          if (nextIndex < group.length) {
            setT(feedback, guided ? () => L(`Good! Next: ${k(next)}`, `很好！下一个：${k(next)}`) : () => L("Good! Keep going.", "很好！继续。"), true);
          } else {
            setT(feedback, () => L("Great! You found them all.", "太棒了！全部找到了。"));
          }
          feedback.className = "exp-feedback good";
          updateProgress();
          if (nextIndex === group.length) {
            grid.querySelectorAll("button").forEach(b => b.disabled = true);
            c.appendChild(primaryButton(() => L("Continue →", "继续 →"), onComplete));
          }
        } else {
          btn.classList.add("wrong");
          setT(feedback, () => L("↻ Try again.", "↻ 再试一次。"));
          feedback.className = "exp-feedback bad";
          setTimeout(() => btn.classList.remove("wrong"), 450);
        }
      });
      grid.appendChild(btn);
    });
    c.appendChild(grid);
    c.appendChild(feedback);
  }

  function renderIndependentIntro() {
    const c = card();
    setT(c.querySelector(".exp-step-count"), label);
    c.appendChild(el("div", "exp-mid", () => L("One more time!", "再来一次！")));
    c.appendChild(instructionBlock(() => L("This time the order hint is hidden.", "这次不显示顺序提示。")));
    c.appendChild(primaryButton(() => L("Try It Yourself", "自己试试"), () => runRound({ guided: false, onComplete: onDone })));
  }

  runRound({ guided: true, onComplete: renderIndependentIntro });
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

paintHeader();
render();


/* Slideshow controls for teacher-led screen sharing. */
document.addEventListener("keydown", event => {
  const tag = (event.target && event.target.tagName || "").toLowerCase();
  if (["input", "textarea", "select"].includes(tag)) return;
  if (event.key === "ArrowRight" || event.key === "PageDown") {
    event.preventDefault();
    goNext();
  } else if (event.key === "ArrowLeft" || event.key === "PageUp") {
    event.preventDefault();
    goPrevious();
  }
});
