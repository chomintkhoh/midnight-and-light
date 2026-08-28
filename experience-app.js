/* ══════════════════════════════════════════════
   Experience / Trial Lesson — あいうえお
   Revision pass: English is the primary instructional
   language throughout; Japanese is reserved for the
   actual learning material (the characters themselves).
   Teaching screens use Previous/Next based on stepIndex.
   Guided handwriting uses two boxes for each new character:
   one tracing box and one free-writing box.
   Practice begins with a transition screen, then advances only
   through Listening, Find the Difference, and Hiragana Maze.
   Real Hiragana audio (repo-root mp3 files) is used by the
   speaker buttons and listening practice. Vocabulary has no audio.
══════════════════════════════════════════════ */

const app = document.getElementById("exp-app");

const CHARS = [
  { char: "あ", romaji: "a", vocab: [
      { word: "あめ", romaji: "ame", emoji: "🌧️", meaning: "Rain" },
      { word: "あさ", romaji: "asa", emoji: "🌅", meaning: "Morning" },
      { word: "あか", romaji: "aka", emoji: "🔴", meaning: "Red" }
    ] },
  { char: "い", romaji: "i", vocab: [
      { word: "いぬ", romaji: "inu", emoji: "🐶", meaning: "Dog" },
      { word: "いえ", romaji: "ie", emoji: "🏠", meaning: "House" },
      { word: "いす", romaji: "isu", emoji: "🪑", meaning: "Chair" }
    ] },
  { char: "う", romaji: "u", vocab: [
      { word: "うみ", romaji: "umi", emoji: "🌊", meaning: "Sea" },
      { word: "うし", romaji: "ushi", emoji: "🐄", meaning: "Cow" },
      { word: "うた", romaji: "uta", emoji: "🎵", meaning: "Song" }
    ] },
  { char: "え", romaji: "e", vocab: [
      { word: "えき", romaji: "eki", emoji: "🚉", meaning: "Station" },
      { word: "えんぴつ", romaji: "enpitsu", emoji: "✏️", meaning: "Pencil" },
      { word: "えほん", romaji: "ehon", emoji: "📖", meaning: "Picture book" }
    ] },
  { char: "お", romaji: "o", vocab: [
      { word: "おちゃ", romaji: "ocha", emoji: "🍵", meaning: "Tea" },
      { word: "おかし", romaji: "okashi", emoji: "🍪", meaning: "Snack / Sweets" },
      { word: "おと", romaji: "oto", emoji: "🔊", meaning: "Sound" }
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
   button on each learnChar screen and Game 1. Vocabulary
   intentionally has NO audio anywhere. */

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
  // Practice screens do not call appendNav, so their own interactions
  // control progression without exposing Previous / Next.
  if (showNext && stepIndex < steps.length - 1) row.appendChild(primaryButton("Next", goNext));
  c.appendChild(row);
}

function goNext() {
  if (stepIndex < steps.length - 1) { stepIndex++; render(); }
}
function goPrevious() {
  if (stepIndex > 0) { stepIndex--; render(); }
}

/* ---------- Guided handwriting canvas ---------- */

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
    if (e && canvas.hasPointerCapture(e.pointerId)) {
      canvas.releasePointerCapture(e.pointerId);
    }
  }

  canvas.addEventListener("pointerup", stopDrawing);
  canvas.addEventListener("pointercancel", stopDrawing);
  canvas.addEventListener("pointerleave", e => {
    if (e.buttons === 0) stopDrawing(e);
  });
}

/* ---------- Build the linear step sequence ---------- */

const steps = [];
steps.push({ type: "welcome" });
steps.push({ type: "writingSystems" });
steps.push({ type: "sentenceExample", sentence: SENTENCES[0] });
steps.push({ type: "sentenceExample", sentence: SENTENCES[1] });
steps.push({ type: "gojuonChart" });
steps.push({ type: "fiveVowels" });
steps.push({ type: "soundPattern" });
steps.push({ type: "lookAhead" });
steps.push({ type: "hiraganaIntro" });
CHARS.forEach(c => {
  steps.push({ type: "learnChar", char: c });
  steps.push({ type: "writingPractice", char: c });
  steps.push({ type: "vocab", char: c });
});
// Guided handwriting belongs to teaching, not to the quiz section.
// Practice begins with a transition screen, then uses three short
// interaction-led activities. Drag-and-drop, fill-in-the-blank,
// vocabulary writing, and the old Final Review remain removed.
steps.push({ type: "practiceIntro" });
steps.push({ type: "game1" });
steps.push({ type: "game2" });
steps.push({ type: "game3" });
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
    const intro = document.createElement("p");
    intro.className = "exp-note";
    intro.textContent = "Japanese uses three main writing systems: Hiragana, Katakana, and Kanji.";
    c.appendChild(intro);
    c.appendChild(row);
    const note = document.createElement("p");
    note.className = "exp-note";
    note.textContent = "They often appear together in the same sentence.";
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

  gojuonChart() {
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
    c.appendChild(instructionBlock("Today, we will start here."));
    appendNav(c);
  },

  fiveVowels() {
    const c = card();
    c.innerHTML = `<div class="exp-mid">The Five Vowels</div>`;
    const big = document.createElement("div");
    big.className = "exp-big exp-vowel-line";
    big.textContent = "あ　い　う　え　お";
    c.appendChild(big);
    const romaji = document.createElement("div");
    romaji.className = "exp-romaji exp-vowel-romaji";
    romaji.textContent = "a　i　u　e　o";
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
      group.pairs.forEach(p => {
        const example = document.createElement("span");
        example.className = "exp-preview-example";
        example.textContent = `${p.from} → ${p.to}`;
        row.appendChild(example);
      });
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
    big.className = "exp-big exp-vowel-line";
    big.textContent = "あ　い　う　え　お";
    c.appendChild(big);
    appendNav(c);
  },

  learnChar(step) {
    const c = card();
    const { char, romaji } = step.char;
    c.innerHTML = `<div class="exp-big">${char}</div><div class="exp-romaji">${romaji}</div>`;
    c.appendChild(instructionBlock("Listen and repeat.", `Say "${romaji}" out loud.`));
    c.appendChild(speakerButton(char));
    appendNav(c);
  },

  writingPractice(step) {
    const c = card();
    const { char } = step.char;
    c.innerHTML = `<div class="exp-mid">Write ${char}</div>`;
    c.appendChild(instructionBlock(`Trace ${char} once, then try writing it by yourself.`));

    const practice = document.createElement("div");
    practice.className = "exp-handwriting";
    const pair = document.createElement("div");
    pair.className = "exp-writing-pair";

    function makeWritingBox(labelText, withReference) {
      const item = document.createElement("div");
      item.className = "exp-writing-box";

      const label = document.createElement("div");
      label.className = "exp-writing-label";
      label.textContent = labelText;
      item.appendChild(label);

      const wrap = document.createElement("div");
      wrap.className = "exp-canvas-wrap";
      const canvas = document.createElement("canvas");
      canvas.className = "exp-writing-canvas";
      canvas.width = 440;
      canvas.height = 440;
      canvas.setAttribute("aria-label", `${labelText} writing practice for ${char}`);
      wrap.appendChild(canvas);

      if (withReference) {
        const reference = document.createElement("div");
        reference.className = "exp-writing-ref";
        reference.textContent = char;
        wrap.appendChild(reference);
      }

      item.appendChild(wrap);
      return { item, canvas };
    }

    const traceBox = makeWritingBox("Trace", true);
    const freeBox = makeWritingBox("Try it yourself", false);
    pair.appendChild(traceBox.item);
    pair.appendChild(freeBox.item);
    practice.appendChild(pair);

    const clear = document.createElement("button");
    clear.className = "exp-clear-btn";
    clear.textContent = "Clear";
    clear.addEventListener("click", () => {
      [traceBox.canvas, freeBox.canvas].forEach(canvas => {
        canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
      });
    });
    practice.appendChild(clear);
    c.appendChild(practice);

    enableDrawing(traceBox.canvas);
    enableDrawing(freeBox.canvas);
    appendNav(c);
  },

  vocab(step) {
    const c = card();
    const { char, vocab } = step.char;
    c.innerHTML = `<div class="exp-mid">Words with ${char}</div>`;
    c.appendChild(instructionBlock("Tap a word to see its meaning."));
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
          <div class="vocab-romaji">${v.romaji}</div>
          <div class="meaning">${v.meaning}</div>
        </div>
      `;
      // Visual-only reveal — no audio anywhere in vocabulary.
      item.addEventListener("click", () => item.classList.toggle("revealed"));
      grid.appendChild(item);
    });
    c.appendChild(grid);
    appendNav(c);
  },

  practiceIntro() {
    const c = card();
    c.innerHTML = `<div class="exp-mid">Practice Time</div>`;
    c.appendChild(instructionBlock("Now let's check what you remember.", "You'll try three short activities."));

    const activities = document.createElement("div");
    activities.className = "exp-practice-list";
    ["Listening", "Find the Difference", "Hiragana Maze"].forEach(label => {
      const item = document.createElement("div");
      item.className = "exp-practice-item";
      item.textContent = label;
      activities.appendChild(item);
    });
    c.appendChild(activities);

    const row = document.createElement("div");
    row.className = "exp-nav-row";
    row.appendChild(primaryButton("Previous", goPrevious, { secondary: true }));
    row.appendChild(primaryButton("Start Practice", goNext));
    c.appendChild(row);
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

  game3() {
    runHiraganaMaze({ group: GROUP, distractorPool: DISTRACTOR_POOL, onDone: goNext });
  },

  finish() {
    const c = card();
    c.innerHTML = `<div class="exp-mid">Great job!</div>`;
    const note1 = document.createElement("p");
    note1.className = "exp-note";
    note1.textContent = "You can now recognise:";
    c.appendChild(note1);
    const big = document.createElement("div");
    big.className = "exp-big exp-vowel-line";
    big.textContent = "あ　い　う　え　お";
    c.appendChild(big);
    const note2 = document.createElement("p");
    note2.className = "exp-note";
    note2.textContent = "You practised listening, recognising, and writing the five basic Hiragana vowel sounds.";
    c.appendChild(note2);
    // Finish is the true endpoint — no Previous/Next, only Start Again.
    c.appendChild(primaryButton("Start Again", () => { stepIndex = 0; render(); }));
  }
};

/* ---------- Shared choice-game runner (Game 2) ---------- */

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

    c.appendChild(instructionBlock("Listen and choose the Hiragana you hear."));

    const listenBtn = document.createElement("button");
    listenBtn.className = "exp-btn";
    listenBtn.innerHTML = `🔊 Listen`;
    listenBtn.addEventListener("click", () => playHiraganaAudio(q.target));
    c.appendChild(listenBtn);

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

/* ---------- Game 3 — Hiragana Maze / Find in Order ---------- */

function runHiraganaMaze({ group, distractorPool, onDone }) {
  const c = card();
  c.appendChild(instructionBlock("Find the Hiragana in order.", "Start with あ, then continue to お."));

  const targetLine = document.createElement("div");
  targetLine.className = "exp-maze-sequence";
  targetLine.textContent = group.join(" → ");
  c.appendChild(targetLine);

  const progress = document.createElement("div");
  progress.className = "exp-maze-progress";
  c.appendChild(progress);

  const feedback = document.createElement("div");
  feedback.className = "exp-feedback";

  // 5 targets + 11 distractors gives a compact 4×4 board. Duplicate
  // distractors are allowed only when needed to fill the board, while
  // each target appears exactly once so the path remains unambiguous.
  const distractors = shuffle([...distractorPool, ...distractorPool]).slice(0, 11);
  const cells = shuffle([...group, ...distractors]);
  let nextIndex = 0;

  function updateProgress() {
    progress.innerHTML = group.map((char, i) =>
      `<span class="${i < nextIndex ? "done" : ""}">${i < nextIndex ? "●" : "○"}</span>`
    ).join("");
  }
  updateProgress();

  const grid = document.createElement("div");
  grid.className = "exp-maze-grid";
  cells.forEach(char => {
    const btn = document.createElement("button");
    btn.className = "exp-maze-cell";
    btn.textContent = char;
    btn.addEventListener("click", () => {
      if (btn.disabled) return;
      if (char === group[nextIndex]) {
        btn.classList.add("correct");
        btn.disabled = true;
        nextIndex++;
        feedback.textContent = nextIndex < group.length ? `Good! Next: ${group[nextIndex]}` : "Great! You found them all.";
        feedback.className = "exp-feedback good";
        updateProgress();
        if (nextIndex === group.length) {
          grid.querySelectorAll("button").forEach(b => b.disabled = true);
          setTimeout(onDone, 1000);
        }
      } else {
        btn.classList.add("wrong");
        feedback.textContent = "Try again.";
        feedback.className = "exp-feedback bad";
        setTimeout(() => btn.classList.remove("wrong"), 450);
      }
    });
    grid.appendChild(btn);
  });

  c.appendChild(grid);
  c.appendChild(feedback);
  // No Previous/Next — completion of the maze advances the lesson.
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