/* ══════════════════════════════════════════════
   Experience / Trial Lesson — あいうえお
   13 steps: welcome → one page per character (listen, write, words)
   → vowels & chart → sound pattern → writing systems → 3 practices → finish.
   Learning pages have no romaji (speaker only); explanation pages keep it.
   English / Simplified Chinese, one at a time; switching keeps page state.
══════════════════════════════════════════════ */

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
  ctx.strokeStyle = "#F4F1EA";
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

/* ---------- Steps ---------- */

const steps = [
  { type: "welcome" },
  ...CHARS.map(c => ({ type: "learnChar", char: c })),
  { type: "vowelsChart" },
  { type: "soundPattern" },
  { type: "writingSystems" },
  { type: "game1" },
  { type: "game2" },
  { type: "game3" },
  { type: "finish" }
];

let stepIndex = 0;

function render() {
  const step = steps[stepIndex];
  renderers[step.type](step);
  const top = app.getBoundingClientRect().top + window.scrollY - 90;
  if (window.scrollY > top) window.scrollTo({ top, behavior: "smooth" });
}

const renderers = {
  welcome() {
    const c = card();
    c.appendChild(el("div", "exp-mid", () => L("Welcome!", "欢迎！")));
    c.appendChild(note(() => L(
      "Japanese is written with Hiragana, Katakana and Kanji. Everyone starts with Hiragana.",
      "日语用平假名、片假名和汉字来书写。大家都从平假名开始学。"
    )));
    c.appendChild(vowelLine());
    c.appendChild(note(() => L(
      "In the next few minutes you'll learn your first five — how they sound, how to write them, and a few words that use them.",
      "接下来几分钟，你会学会最先的五个：怎么念、怎么写，还有用到它们的几个词。"
    )));
    appendNav(c, { nextLabel: () => L("Start →", "开始 →") });

    const shortcut = el("div", "exp-practice-shortcut");
    shortcut.appendChild(el("div", "exp-subinstruction", () => L(`Already know ${k("あいうえお")}?`, `已经会 ${k("あいうえお")} 了？`), true));
    shortcut.appendChild(primaryButton(() => L("Go to Practice →", "直接去练习 →"), goToPractice, { secondary: true }));
    c.appendChild(shortcut);
  },

  learnChar(step) {
    const c = card();
    const { char, vocab } = step.char;

    c.appendChild(el("div", "exp-big exp-char kana", char));

    const speaker = el("button", "exp-speaker");
    speaker.type = "button";
    speaker.innerHTML = `<span aria-hidden="true">🔊</span>`;
    speaker.setAttribute("aria-label", "Play the sound / 播放发音");
    speaker.addEventListener("click", () => playHiraganaAudio(char, speaker));
    c.appendChild(speaker);
    c.appendChild(el("div", "exp-subinstruction", () => L("Tap to listen, then say it out loud.", "点一下听发音，然后大声跟着念。")));

    // Write it
    c.appendChild(el("div", "exp-section-title", () => L("Write it", "写一写")));
    const pair = el("div", "exp-writing-pair");
    const canvases = [];
    [[() => L("Trace", "描一描"), true], [() => L("By yourself", "自己写"), false]].forEach(([label, withRef]) => {
      const box = el("div", "exp-writing-box");
      box.appendChild(el("div", "exp-writing-label", label));
      const wrap = el("div", "exp-canvas-wrap");
      const canvas = el("canvas", "exp-writing-canvas");
      canvas.width = 440;
      canvas.height = 440;
      canvas.setAttribute("aria-label", `Writing practice for ${char}`);
      wrap.appendChild(canvas);
      if (withRef) wrap.appendChild(el("div", "exp-writing-ref kana", char));
      box.appendChild(wrap);
      pair.appendChild(box);
      enableDrawing(canvas);
      canvases.push(canvas);
    });
    c.appendChild(pair);
    const clear = el("button", "exp-clear-btn", () => L("Clear", "清除"));
    clear.type = "button";
    clear.addEventListener("click", () => canvases.forEach(cv => cv.getContext("2d").clearRect(0, 0, cv.width, cv.height)));
    c.appendChild(clear);

    // Words
    c.appendChild(el("div", "exp-section-title", () => L(`Words with ${k(char)}`, `有 ${k(char)} 的词`), true));
    c.appendChild(el("div", "exp-subinstruction", () => L("Tap a word to see its meaning.", "点一下词语，看看是什么意思。")));
    const grid = el("div", "exp-vocab-grid");
    vocab.forEach(v => {
      const item = el("button", "exp-vocab-card");
      item.type = "button";
      item.appendChild(el("div", "emoji", v.emoji));
      item.appendChild(el("div", "word kana", v.word.replace(char, `<strong>${char}</strong>`), true));
      item.appendChild(el("div", "vocab-romaji", v.romaji));
      item.appendChild(el("div", "meaning", () => L(v.en, v.zh)));
      item.addEventListener("click", () => item.classList.toggle("revealed"));
      grid.appendChild(item);
    });
    c.appendChild(grid);

    appendNav(c);
  },

  vowelsChart() {
    const c = card();
    c.appendChild(el("div", "exp-mid", () => L("The Five Vowels", "五个元音")));
    c.appendChild(vowelLine());
    c.appendChild(el("div", "exp-romaji exp-vowel-romaji", "a　i　u　e　o"));
    c.appendChild(note(() => L(
      "You just learned all five. They are the first row of the Hiragana chart, called Gojūon (五十音).",
      "你已经学会这五个了。它们是平假名表的第一行，这张表叫“五十音”。"
    )));
    const chart = el("div", "exp-gojuon-chart kana");
    GOJUON_ROWS.forEach((row, ri) => row.forEach(ch => {
      chart.appendChild(el("div", "exp-gojuon-cell" + (ri === 0 && ch ? " highlight" : ""), ch));
    }));
    c.appendChild(chart);
    c.appendChild(note(() => L("You don't need to learn the whole chart today.", "今天不用学整张表。"), "exp-note small"));
    appendNav(c);
  },

  soundPattern() {
    const c = card();
    c.appendChild(el("div", "exp-mid", () => L("How the Chart Works", "这张表的规律")));
    c.appendChild(note(() => L(
      "Each row is one consonant + the five vowels. Here is the K row:",
      "每一行都是一个辅音，加上这五个元音。比如 K 这一行："
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
            setT(reveal, () => L(SCRIPT_NAMES[p.label].en, SCRIPT_NAMES[p.label].zh));
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

    appendNav(c, { nextLabel: () => L("Start Practice →", "开始练习 →"), onNext: () => { resetPracticeSet(); goNext(); } });
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
    c.appendChild(note(() => L("You can now hear, read and write:", "你现在会听、会认、也会写：")));
    c.appendChild(vowelLine());
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

function runListeningGame({ questions, onDone }) {
  let qi = 0;
  function renderQuestion() {
    const c = card();
    const q = questions[qi];
    const label = practiceLabel(1, "Listening", "听力");
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
          setT(feedback, () => L("Correct!", "答对了！"));
          feedback.className = "exp-feedback good";
          grid.querySelectorAll("button").forEach(b => b.disabled = true);
          setTimeout(() => {
            qi++;
            if (qi < questions.length) renderQuestion(); else onDone();
          }, 1000);
        } else {
          btn.classList.add("wrong");
          setT(feedback, () => L("Try again.", "再试一次。"));
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
          setT(feedback, () => L("Correct!", "答对了！"));
          feedback.className = "exp-feedback good";
          grid.querySelectorAll("button").forEach(b => b.disabled = true);
          setTimeout(() => {
            qi++;
            if (qi < questions.length) renderQuestion(); else onDone();
          }, 800);
        } else {
          btn.classList.add("wrong");
          setT(feedback, () => L("Try again.", "再试一次。"));
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
            setTimeout(onComplete, 900);
          }
        } else {
          btn.classList.add("wrong");
          setT(feedback, () => L("Try again.", "再试一次。"));
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
