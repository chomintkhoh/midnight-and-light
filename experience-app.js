/* ══════════════════════════════════════════════
   Experience / Trial Lesson — あいうえお
   Revision pass: English is the primary instructional
   language throughout; Japanese is reserved for the
   actual learning material (the characters themselves).
   Bidirectional navigation (Previous/Next) based on
   stepIndex. Real Hiragana audio (repo-root mp3 files)
   is kept — confirmed still valid — used by the speaker
   buttons, the review screen, and the listening-based
   Game 1. Vocabulary has no audio, as before.
══════════════════════════════════════════════ */

const app = document.getElementById("exp-app");

const CHARS = [
  { char: "あ", romaji: "a", vocab: [
      { word: "あめ", emoji: "🌧️", meaning: "Rain" },
      { word: "あさ", emoji: "🌅", meaning: "Morning" },
      { word: "あか", emoji: "🔴", meaning: "Red" }
    ] },
  { char: "い", romaji: "i", vocab: [
      { word: "いぬ", emoji: "🐶", meaning: "Dog" },
      { word: "いえ", emoji: "🏠", meaning: "House" },
      { word: "いす", emoji: "🪑", meaning: "Chair" }
    ] },
  { char: "う", romaji: "u", vocab: [
      { word: "うみ", emoji: "🌊", meaning: "Sea" },
      { word: "うし", emoji: "🐄", meaning: "Cow" },
      { word: "うた", emoji: "🎵", meaning: "Song" }
    ] },
  { char: "え", romaji: "e", vocab: [
      { word: "えき", emoji: "🚉", meaning: "Station" },
      { word: "えんぴつ", emoji: "✏️", meaning: "Pencil" },
      { word: "えほん", emoji: "📖", meaning: "Picture book" }
    ] },
  { char: "お", romaji: "o", vocab: [
      { word: "おちゃ", emoji: "🍵", meaning: "Tea" },
      { word: "おかし", emoji: "🍪", meaning: "Snack / Sweets" },
      { word: "おと", emoji: "🔊", meaning: "Sound" }
    ] }
];

/* ---------- Reusable lesson data ----------
   This lesson's vowel group and a generic distractor pool. A future
   lesson (かきくけこ, etc.) only needs its own GROUP + DISTRACTOR_POOL
   — every game runner below is generic over these, not hardcoded to
   あいうえお specifically. */

// Two genuinely different example sentences for the writing-system
// identification activity. Both use only 私 in common (deliberately,
// for reinforcement) — otherwise different vocabulary, different
// grammar pattern, and the second one shows that not every sentence
// needs all three writing systems.
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
    translation: "I am Malaysian."
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
    translation: "I like coffee."
  }
];

// The Gojuon chart, for orientation only — not memorisation. Empty
// strings represent the real gaps in the historical 5x10 grid (や row
// has no yi/ye; わ row has only わ and を; ん stands alone).
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
  { consonant: "K", vowel: "A", romaji: "KA", kana: "か" },
  { consonant: "K", vowel: "I", romaji: "KI", kana: "き" },
  { consonant: "K", vowel: "U", romaji: "KU", kana: "く" },
  { consonant: "K", vowel: "E", romaji: "KE", kana: "け" },
  { consonant: "K", vowel: "O", romaji: "KO", kana: "こ" }
];

const PREVIEW_SOUNDS = [
  { label: "Voiced sounds", pairs: [{ from: "か", to: "が" }, { from: "さ", to: "ざ" }] },
  { label: "Semi-voiced sounds", pairs: [{ from: "は", to: "ぱ" }] },
  { label: "Combination sounds", pairs: [{ from: "き + ゃ", to: "きゃ" }, { from: "し + ゅ", to: "しゅ" }] }
];

const GROUP = CHARS.map(c => c.char); // ["あ","い","う","え","お"]
const DISTRACTOR_POOL = ["か", "き", "く", "け", "こ", "さ", "し", "す", "せ", "そ"];

// One listening question per character in `group`, each appearing as
// the target exactly once (guaranteed by mapping over the group itself).
function buildListeningQuestions(group, distractorPool) {
  return group.map(target => {
    const otherOptions = shuffle([...group.filter(c => c !== target), ...distractorPool]).slice(0, 4);
    return { target, choices: shuffle([target, ...otherOptions]) };
  });
}

// `count` odd-one-out questions. Each shows the group MINUS one random
// member, plus one distractor — 5 total choices, matching the format
// "あ い う え か → か" (four of the five vowels, not all five).
function buildOddOneOutQuestions(group, distractorPool, count) {
  return shuffle(distractorPool).slice(0, count).map(distractor => {
    const omitted = group[Math.floor(Math.random() * group.length)];
    const shownGroup = group.filter(c => c !== omitted);
    return { target: distractor, choices: shuffle([...shownGroup, distractor]) };
  });
}

/* ---------- Real Hiragana audio (repo-root mp3 files) ----------
   Confirmed to exist at the repo root (a.mp3, i.mp3, u.mp3, e.mp3,
   o.mp3) — kept per explicit confirmation. Used by the speaker
   button on each learnChar screen, the review screen's tap-to-hear,
   and Game 1. Vocabulary intentionally has NO audio anywhere. */

const HIRAGANA_AUDIO_FILES = { "あ": "a.mp3", "い": "i.mp3", "う": "u.mp3", "え": "e.mp3", "お": "o.mp3" };
let currentAudio = null;

function playHiraganaAudio(char) {
  const src = HIRAGANA_AUDIO_FILES[char];
  if (!src) return;
  if (currentAudio) { currentAudio.pause(); }
  currentAudio = new Audio(src);
  currentAudio.play().catch(() => { /* ignore — e.g. autoplay restrictions */ });
}

function speakerButton(char) {
  const btn = document.createElement("button");
  btn.className = "exp-speaker";
  btn.textContent = "🔊";
  btn.addEventListener("click", () => playHiraganaAudio(char));
  return btn;
}

/* ---------- Small helpers ---------- */

function primaryButton(label, onClick, opts = {}) {
  const btn = document.createElement("button");
  btn.className = "exp-btn" + (opts.secondary ? " secondary" : "");
  btn.textContent = label;
  btn.addEventListener("click", onClick);
  return btn;
}

function instructionBlock(main, sub) {
  const wrap = document.createElement("div");
  const m = document.createElement("div");
  m.className = "exp-instruction";
  m.textContent = main;
  wrap.appendChild(m);
  if (sub) {
    const s = document.createElement("div");
    s.className = "exp-subinstruction";
    s.textContent = sub;
    wrap.appendChild(s);
  }
  return wrap;
}

function card() {
  const c = document.createElement("div");
  c.className = "exp-card";
  app.innerHTML = "";
  app.appendChild(c);
  return c;
}

// Shared "fast student" extension offer — used by any game runner that
// has an optional extraQuestions set. Kept lightweight and generic
// rather than duplicated per game, per the reusability requirement.
function renderExtraOffer(onExtra, onContinue) {
  const c = card();
  c.appendChild(instructionBlock("Nicely done!", "Want a little more practice?"));
  const row = document.createElement("div");
  row.className = "exp-nav-row";
  row.appendChild(primaryButton("Continue", onContinue, { secondary: true }));
  row.appendChild(primaryButton("Extra Practice", onExtra));
  c.appendChild(row);
}

/* ---------- Bidirectional navigation ---------- */

function appendNav(c, { showNext = true } = {}) {
  const row = document.createElement("div");
  row.className = "exp-nav-row";
  if (stepIndex > 0) row.appendChild(primaryButton("Previous", goPrevious, { secondary: true }));
  // showNext:false is used on every mid-activity screen inside a multi-
  // question game runner. Without this, the global Next button (which
  // advances the top-level stepIndex) let a student skip straight past
  // an entire game — including finalReview — without answering anything,
  // since it has no awareness of a game's own internal question index.
  // This was a real, reproduced bug, not a theoretical one.
  if (showNext && stepIndex < steps.length - 1) row.appendChild(primaryButton("Next", goNext));
  c.appendChild(row);
}

function goNext() {
  if (stepIndex < steps.length - 1) { stepIndex++; render(); }
}
function goPrevious() {
  if (stepIndex > 0) { stepIndex--; render(); }
}

/* ---------- Build the linear step sequence ---------- */

const steps = [];
steps.push({ type: "welcome" });
steps.push({ type: "writingSystems" });
steps.push({ type: "sentenceExample", sentence: SENTENCES[0] });
steps.push({ type: "sentenceExample", sentence: SENTENCES[1] });
steps.push({ type: "gojuonIntro" });
steps.push({ type: "gojuonChart" });
steps.push({ type: "fiveVowels" });
steps.push({ type: "soundPattern" });
steps.push({ type: "lookAhead" });
steps.push({ type: "hiraganaIntro" });
CHARS.forEach(c => {
  steps.push({ type: "learnChar", char: c });
  steps.push({ type: "vocab", char: c });
});
// Practice: Listening + Find the Difference only, per the confirmed
// simplified structure for this first lesson. Maze, drag-and-drop,
// sequence fill-in-the-blank, and all handwriting canvases are
// deliberately NOT included — saved for a later lesson, once more
// Hiragana have been taught. Their code has been removed from this
// file (not just left unused) per the explicit cleanup request.
steps.push({ type: "game1" });
steps.push({ type: "game2" });
steps.push({ type: "finish" });

let stepIndex = 0;

function render() {
  const step = steps[stepIndex];
  renderers[step.type](step);
}

/* ---------- Screen renderers ---------- */

const renderers = {
  welcome() {
    const c = card();
    c.innerHTML = `<div class="exp-mid">Welcome!</div>`;
    c.appendChild(instructionBlock("This is a short trial lesson.", "Let's learn your first Hiragana characters together."));
    appendNav(c);
  },

  writingSystems() {
    const c = card();
    c.innerHTML = `<div class="exp-mid">Japanese Writing Systems</div>`;
    const row = document.createElement("div");
    row.className = "exp-writing-row";
    row.innerHTML = `
      <div class="exp-writing-item"><span class="type-label">Hiragana</span>あ　い　う</div>
      <div class="exp-writing-item"><span class="type-label">Katakana</span>ア　イ　ウ</div>
      <div class="exp-writing-item"><span class="type-label">Kanji</span>日　本　人</div>
    `;
    c.appendChild(row);
    const note = document.createElement("p");
    note.className = "exp-note";
    note.textContent = "Japanese often uses these writing systems together in the same sentence.";
    c.appendChild(note);
    appendNav(c);
  },

  sentenceExample(step) {
    const c = card();
    c.appendChild(instructionBlock("Tap each part to see which writing system it uses."));

    const sentence = document.createElement("div");
    sentence.className = "exp-clickable-sentence";
    const reveal = document.createElement("div");
    reveal.className = "exp-tag-reveal";

    step.sentence.parts.forEach(p => {
      const span = document.createElement("span");
      span.textContent = p.text;
      if (p.label) {
        span.addEventListener("click", () => {
          sentence.querySelectorAll("span").forEach(s => s.classList.remove("tapped"));
          span.classList.add("tapped");
          reveal.textContent = p.label;
        });
      }
      sentence.appendChild(span);
    });
    c.appendChild(sentence);
    c.appendChild(reveal);

    const translation = document.createElement("p");
    translation.className = "exp-note";
    translation.textContent = step.sentence.translation;
    c.appendChild(translation);

    appendNav(c);
  },

  gojuonIntro() {
    const c = card();
    c.innerHTML = `<div class="exp-mid">Gojūon 五十音</div>`;
    const note1 = document.createElement("p");
    note1.className = "exp-note";
    note1.textContent = "Gojūon is the basic sound chart used to organise Hiragana.";
    c.appendChild(note1);
    const note2 = document.createElement("p");
    note2.className = "exp-note";
    note2.textContent = "You do not need to learn the whole chart today.";
    c.appendChild(note2);
    appendNav(c);
  },

  gojuonChart() {
    const c = card();
    c.appendChild(instructionBlock("Today, we will start here."));
    const chart = document.createElement("div");
    chart.className = "exp-gojuon-chart";
    GOJUON_ROWS.forEach((row, ri) => {
      row.forEach(ch => {
        const cell = document.createElement("div");
        cell.className = "exp-gojuon-cell" + (ri === 0 && ch ? " highlight" : "");
        cell.textContent = ch;
        chart.appendChild(cell);
      });
    });
    c.appendChild(chart);
    appendNav(c);
  },

  fiveVowels() {
    const c = card();
    c.innerHTML = `<div class="exp-mid">The Five Vowels</div>`;
    const big = document.createElement("div");
    big.className = "exp-big";
    big.textContent = "あ　い　う　え　お";
    c.appendChild(big);
    const romaji = document.createElement("div");
    romaji.className = "exp-romaji";
    romaji.textContent = "a  i  u  e  o";
    c.appendChild(romaji);
    const note = document.createElement("p");
    note.className = "exp-note";
    note.textContent = "These are the five basic vowel sounds in Japanese.";
    c.appendChild(note);
    appendNav(c);
  },

  soundPattern() {
    const c = card();
    c.innerHTML = `<div class="exp-mid">How the Sound Pattern Works</div>`;
    const rows = document.createElement("div");
    rows.className = "exp-pattern-rows";
    K_ROW_PATTERN.forEach(p => {
      const row = document.createElement("div");
      row.className = "exp-pattern-row";
      row.textContent = `${p.consonant} + ${p.vowel} → ${p.romaji} → ${p.kana}`;
      rows.appendChild(row);
    });
    c.appendChild(rows);
    const note = document.createElement("p");
    note.className = "exp-note";
    note.textContent = "The same vowel pattern continues through many other Hiragana rows.";
    c.appendChild(note);
    const chain = document.createElement("div");
    chain.className = "exp-pattern-chain";
    chain.innerHTML = "A I U E O<br>↓<br>KA KI KU KE KO<br>↓<br>SA SHI SU SE SO";
    c.appendChild(chain);
    appendNav(c);
  },

  lookAhead() {
    const c = card();
    c.innerHTML = `<div class="exp-mid">A Quick Look Ahead</div>`;
    PREVIEW_SOUNDS.forEach(group => {
      const label = document.createElement("div");
      label.className = "exp-preview-label";
      label.textContent = group.label;
      c.appendChild(label);
      const row = document.createElement("div");
      row.className = "exp-preview-row";
      row.textContent = group.pairs.map(p => `${p.from} → ${p.to}`).join("   ");
      c.appendChild(row);
    });
    const note = document.createElement("p");
    note.className = "exp-note";
    note.textContent = "You do not need to learn these today. We will meet them later.";
    c.appendChild(note);
    appendNav(c);
  },

  hiraganaIntro() {
    const c = card();
    c.innerHTML = `<div class="exp-mid">Today: あいうえお</div>`;
    c.appendChild(instructionBlock("Let's start with the five basic vowel sounds."));
    const big = document.createElement("div");
    big.className = "exp-big";
    big.textContent = "あ　い　う　え　お";
    c.appendChild(big);
    appendNav(c);
  },

  learnChar(step) {
    const c = card();
    const { char, romaji } = step.char;
    c.innerHTML = `<div class="exp-big">${char}</div><div class="exp-romaji">${romaji}</div>`;
    c.appendChild(speakerButton(char));
    c.appendChild(instructionBlock("Listen and repeat.", `Say "${romaji}" out loud.`));
    appendNav(c);
  },

  vocab(step) {
    const c = card();
    const { char, vocab } = step.char;
    c.innerHTML = `<div class="exp-mid">Words with ${char}</div>`;
    const grid = document.createElement("div");
    grid.className = "exp-vocab-grid";
    vocab.forEach(v => {
      const item = document.createElement("div");
      item.className = "exp-vocab-card";
      const highlighted = v.word.replace(char, `<strong>${char}</strong>`);
      item.innerHTML = `
        <div class="emoji">${v.emoji}</div>
        <div>
          <div class="word">${highlighted}</div>
          <div class="meaning">${v.meaning}</div>
        </div>
      `;
      // Visual-only reveal — no audio anywhere in vocabulary.
      item.addEventListener("click", () => item.classList.toggle("revealed"));
      grid.appendChild(item);
    });
    c.appendChild(grid);
    c.appendChild(instructionBlock("Tap a word to see its meaning."));
    appendNav(c);
  },

  /* Game 1 — listening recognition. Target never appears in the
     question text; uses the real Hiragana audio, same as elsewhere. */
  game1() {
    // 5 required questions — every character in GROUP appears as the
    // target exactly once, guaranteed by the generator itself.
    const questions = buildListeningQuestions(GROUP, DISTRACTOR_POOL);
    runListeningGame({ questions, onDone: goNext });
  },

  game2() {
    const questions = buildOddOneOutQuestions(GROUP, DISTRACTOR_POOL, 3);
    runChoiceGame({
      instruction: "Which one is different?",
      questions,
      buildChoices: q => q.choices,
      isCorrect: (choice, q) => choice === q.target,
      onDone: goNext
    });
  },

  finish() {
    const c = card();
    c.innerHTML = `<div class="exp-mid">Great job!</div>`;
    const note1 = document.createElement("p");
    note1.className = "exp-note";
    note1.textContent = "You can now recognise:";
    c.appendChild(note1);
    const big = document.createElement("div");
    big.className = "exp-big";
    big.textContent = "あ　い　う　え　お";
    c.appendChild(big);
    const note2 = document.createElement("p");
    note2.className = "exp-note";
    note2.textContent = "You learned the five basic Japanese vowel sounds and practised matching them to Hiragana.";
    c.appendChild(note2);
    // Finish is the true endpoint — no Previous/Next, only Start Again.
    c.appendChild(primaryButton("Start Again", () => { stepIndex = 0; render(); }));
  }
};

/* ---------- Shared choice-game runner (Game 2 and finalReview items) ---------- */

function runChoiceGame({ instruction, subinstruction, questions, extraQuestions, buildChoices, isCorrect, onDone, showCount = true }) {
  let qi = 0;
  let activeQuestions = questions;
  function renderQuestion() {
    const c = card();
    const q = activeQuestions[qi];
    if (showCount) {
      const stepLabel = document.createElement("div");
      stepLabel.className = "exp-step-count";
      stepLabel.textContent = `Question ${qi + 1} / ${activeQuestions.length}`;
      c.appendChild(stepLabel);
    }
    c.appendChild(instructionBlock(instruction, subinstruction));

    const feedback = document.createElement("div");
    feedback.className = "exp-feedback";

    const grid = document.createElement("div");
    grid.className = "exp-choice-grid";
    buildChoices(q).forEach(choice => {
      const btn = document.createElement("button");
      btn.className = "exp-choice";
      btn.textContent = choice;
      btn.addEventListener("click", () => {
        if (isCorrect(choice, q)) {
          btn.classList.add("correct");
          feedback.textContent = "Correct.";
          feedback.className = "exp-feedback good";
          grid.querySelectorAll("button").forEach(b => b.disabled = true);
          setTimeout(() => {
            qi++;
            if (qi < activeQuestions.length) {
              renderQuestion();
            } else if (activeQuestions === questions && extraQuestions && extraQuestions.length) {
              renderExtraOffer(() => { activeQuestions = extraQuestions; qi = 0; renderQuestion(); }, onDone);
            } else {
              onDone();
            }
          }, 700);
        } else {
          btn.classList.add("wrong");
          feedback.textContent = "Try again.";
          feedback.className = "exp-feedback bad";
        }
      });
      grid.appendChild(btn);
    });
    c.appendChild(grid);
    c.appendChild(feedback);
    // No Previous/Next here — Practice uses only the activity's own
    // controls (tapping an answer), per the confirmed lesson structure.
  }
  renderQuestion();
}

/* ---------- Game 1's listening variant: Listen button (auto-plays,
   replayable) instead of text naming the target. ---------- */

function runListeningGame({ questions, extraQuestions, onDone }) {
  let qi = 0;
  let activeQuestions = questions;
  function renderQuestion() {
    const c = card();
    const q = activeQuestions[qi];
    const stepLabel = document.createElement("div");
    stepLabel.className = "exp-step-count";
    stepLabel.textContent = `Question ${qi + 1} / ${activeQuestions.length}`;
    c.appendChild(stepLabel);

    const listenBtn = document.createElement("button");
    listenBtn.className = "exp-btn";
    listenBtn.innerHTML = `🔊 Listen`;
    listenBtn.addEventListener("click", () => playHiraganaAudio(q.target));
    c.appendChild(listenBtn);

    c.appendChild(instructionBlock("Which Hiragana did you hear?"));

    const feedback = document.createElement("div");
    feedback.className = "exp-feedback";

    const grid = document.createElement("div");
    grid.className = "exp-choice-grid";
    shuffle(q.choices).forEach(choice => {
      const btn = document.createElement("button");
      btn.className = "exp-choice";
      btn.textContent = choice;
      btn.addEventListener("click", () => {
        if (choice === q.target) {
          btn.classList.add("correct");
          feedback.textContent = `Correct! ${q.target}`;
          feedback.className = "exp-feedback good";
          grid.querySelectorAll("button").forEach(b => b.disabled = true);
          setTimeout(() => {
            qi++;
            if (qi < activeQuestions.length) {
              renderQuestion();
            } else if (activeQuestions === questions && extraQuestions && extraQuestions.length) {
              renderExtraOffer(() => { activeQuestions = extraQuestions; qi = 0; renderQuestion(); }, onDone);
            } else {
              onDone();
            }
          }, 1100);
        } else {
          btn.classList.add("wrong");
          feedback.textContent = "Try again.";
          feedback.className = "exp-feedback bad";
        }
      });
      grid.appendChild(btn);
    });
    c.appendChild(grid);
    c.appendChild(feedback);
    // No Previous/Next here — Practice uses only the activity's own
    // controls (tapping an answer), per the confirmed lesson structure.

    playHiraganaAudio(q.target); // auto-play once; Listen button replays
  }

  renderQuestion();
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

render();
