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

// A shuffled grid layout for the "find in order" maze: the full group
// plus enough distractors to fill `gridSize` cells.
function buildFindInOrderLayout(group, distractorPool, gridSize) {
  const needed = Math.max(gridSize - group.length, 0);
  return shuffle([...group, ...shuffle(distractorPool).slice(0, needed)]);
}

// Fill-in-the-blank questions — one per "interior" position (never the
// first or last character), matching the given examples exactly.
function buildSequenceBlankQuestions(group) {
  const results = [];
  for (let i = 1; i < group.length - 1; i++) {
    const answer = group[i];
    const sequence = group.map((c, idx) => (idx === i ? null : c));
    const distractorChoices = shuffle(group.filter(c => c !== answer)).slice(0, 2);
    results.push({ sequence, answer, choices: shuffle([answer, ...distractorChoices]) });
  }
  return shuffle(results);
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
steps.push({ type: "hiraganaIntro" });
CHARS.forEach(c => {
  steps.push({ type: "learnChar", char: c });
  steps.push({ type: "vocab", char: c });
});
// Practice: Listening + Find the Difference only, per the confirmed
// simplified structure for this first lesson. Maze, drag-and-drop,
// sequence fill-in-the-blank, and all handwriting canvases are
// deliberately NOT included here — saved for a later lesson, once
// more Hiragana have been taught. Their code is kept intact below
// (unused, not deleted) so they're easy to bring back for that lesson.
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

  hiraganaIntro() {
    const c = card();
    c.innerHTML = `<div class="exp-mid">Hiragana</div>`;
    c.appendChild(instructionBlock("Today, we will learn your first five Hiragana characters."));
    const big = document.createElement("div");
    big.className = "exp-big";
    big.textContent = "あ　い　う　え　お";
    c.appendChild(big);
    const note = document.createElement("p");
    note.className = "exp-note";
    note.textContent = "These five characters represent basic Japanese sounds.";
    c.appendChild(note);
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

  vocabWriting(step) {
    const c = card();
    const { vocab } = step.char;
    const word = vocab[0].word; // one word, written once — per the new requirement
    c.innerHTML = `<div class="exp-mid">Write ${word}</div>`;
    c.appendChild(instructionBlock("Write one vocabulary word."));
    const grid = document.createElement("div");
    grid.className = "exp-writing-grid";
    grid.appendChild(buildWritingSlot(word, "Practice", 400, 190));
    c.appendChild(grid);
    appendNav(c);
  },

  review() {
    const c = card();
    c.innerHTML = `<div class="exp-mid">Review</div><div class="exp-big" id="reviewRow"></div>`;
    const row = c.querySelector("#reviewRow");
    CHARS.forEach(cc => {
      const span = document.createElement("span");
      span.textContent = cc.char + "　";
      span.style.cursor = "pointer";
      span.addEventListener("click", () => {
        playHiraganaAudio(cc.char);
        span.style.color = "var(--pale-gold)";
        setTimeout(() => { span.style.color = ""; }, 500);
      });
      row.appendChild(span);
    });
    c.appendChild(instructionBlock("Tap each character to hear it again."));
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

  game3() {
    runFindInOrderGame({ group: GROUP, distractorPool: DISTRACTOR_POOL, rounds: 2, gridSize: 15, onDone: goNext });
  },

  game4() {
    runOrderedDragDropRounds({
      group: GROUP,
      rounds: 2,
      onDone: goNext,
      instruction: "Drag each character into a box.",
      subinstruction: "Put あいうえお in the correct order."
    });
  },

  writing(step) {
    const c = card();
    const char = step.char;
    c.innerHTML = `<div class="exp-mid">Write ${char}</div>`;
    c.appendChild(instructionBlock("Trace or copy the character.", "Write it three times."));

    const grid = document.createElement("div");
    grid.className = "exp-writing-grid";
    for (let i = 1; i <= 3; i++) {
      grid.appendChild(buildWritingSlot(char, `Practice ${i}`));
    }
    c.appendChild(grid);
    appendNav(c);
  },

  sequenceBlank() {
    const questions = buildSequenceBlankQuestions(GROUP);
    runFillBlankGame({ questions, onDone: goNext });
  },

  finalReview() {
    runFinalReview(goNext);
  },

  finish() {
    const c = card();
    c.innerHTML = `<div class="exp-mid">Great job!</div>`;
    const note1 = document.createElement("p");
    note1.className = "exp-note";
    note1.textContent = "You learned your first five Hiragana characters.";
    c.appendChild(note1);
    const big = document.createElement("div");
    big.className = "exp-big";
    big.textContent = "あ　い　う　え　お";
    c.appendChild(big);
    const note2 = document.createElement("p");
    note2.className = "exp-note";
    note2.textContent = "You can now recognize and read your first five Hiragana characters.";
    c.appendChild(note2);
    appendNav(c);
  }
};

/* ---------- Independent writing canvas builder ---------- */

function buildWritingSlot(char, label, width = 180, height = 180) {
  const slot = document.createElement("div");
  slot.className = "exp-writing-slot";

  const labelEl = document.createElement("div");
  labelEl.className = "exp-writing-slot-label";
  labelEl.textContent = label;
  slot.appendChild(labelEl);

  const wrap = document.createElement("div");
  wrap.className = "exp-canvas-wrap";
  const ref = document.createElement("div");
  ref.className = "exp-writing-ref" + (char.length > 1 ? " vocab" : "");
  ref.style.whiteSpace = "nowrap"; // guarantees horizontal display for multi-character vocab words
  ref.textContent = char;
  const canvas = document.createElement("canvas");
  canvas.className = "exp-writing-canvas";
  canvas.width = width; canvas.height = height;
  wrap.appendChild(ref);
  wrap.appendChild(canvas);
  slot.appendChild(wrap);

  const ctx = canvas.getContext("2d");
  ctx.lineWidth = 6; ctx.lineCap = "round"; ctx.strokeStyle = "#F4F1EA";
  let drawing = false, lastX = 0, lastY = 0;
  const posFromEvent = (evt) => {
    const rect = canvas.getBoundingClientRect();
    return [(evt.clientX - rect.left) * (canvas.width / rect.width), (evt.clientY - rect.top) * (canvas.height / rect.height)];
  };
  canvas.addEventListener("pointerdown", (evt) => {
    drawing = true;
    canvas.setPointerCapture(evt.pointerId);
    [lastX, lastY] = posFromEvent(evt);
  });
  canvas.addEventListener("pointermove", (evt) => {
    if (!drawing) return;
    const [x, y] = posFromEvent(evt);
    ctx.beginPath(); ctx.moveTo(lastX, lastY); ctx.lineTo(x, y); ctx.stroke();
    [lastX, lastY] = [x, y];
  });
  canvas.addEventListener("pointerup", () => { drawing = false; });
  canvas.addEventListener("pointercancel", () => { drawing = false; });

  const clearBtn = document.createElement("button");
  clearBtn.className = "exp-clear-btn";
  clearBtn.textContent = "Clear";
  // Clears ONLY this canvas's own context — every slot has its own
  // closured ctx/canvas, so clearing one can never affect another.
  clearBtn.addEventListener("click", () => ctx.clearRect(0, 0, canvas.width, canvas.height));
  slot.appendChild(clearBtn);

  return slot;
}

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

    playHiraganaAudio(q.target); // auto-play once; Listen button replays
  }

  renderQuestion();
}

/* ---------- Game 3: find-in-order maze, now multi-round ----------
   Generic over any group/distractorPool, so a future lesson's maze
   just calls this with its own character group. ---------- */

function runFindInOrderGame({ group, distractorPool, rounds, gridSize, onDone }) {
  let round = 0;
  function renderRound() {
    const c = card();
    const stepLabel = document.createElement("div");
    stepLabel.className = "exp-step-count";
    stepLabel.textContent = `Round ${round + 1} / ${rounds}`;
    c.appendChild(stepLabel);
    c.appendChild(instructionBlock("Find the characters in order.", `Start with ${group[0]} and find the ${group.length} characters in order.`));

    const dots = document.createElement("div");
    dots.className = "exp-progress-dots";
    c.appendChild(dots);
    const feedback = document.createElement("div");
    feedback.className = "exp-feedback";
    c.appendChild(feedback);

    const grid = document.createElement("div");
    grid.className = "exp-maze";
    const layout = buildFindInOrderLayout(group, distractorPool, gridSize);
    let progress = 0;
    const updateDots = () => { dots.textContent = group.map((_, i) => i < progress ? "●" : "○").join(" "); };
    updateDots();

    layout.forEach(ch => {
      const btn = document.createElement("button");
      btn.textContent = ch;
      btn.addEventListener("click", () => {
        if (btn.disabled) return;
        if (ch === group[progress]) {
          btn.classList.add("found");
          btn.disabled = true;
          progress++;
          updateDots();
          if (progress === group.length) {
            feedback.textContent = "You made it!";
            feedback.className = "exp-feedback good";
            grid.querySelectorAll("button").forEach(b => b.disabled = true);
            setTimeout(() => {
              round++;
              if (round < rounds) renderRound();
              else onDone();
            }, 900);
          } else {
            feedback.textContent = "";
            feedback.className = "exp-feedback";
          }
        } else {
          feedback.textContent = "Try again.";
          feedback.className = "exp-feedback bad";
        }
      });
      grid.appendChild(btn);
    });
    c.appendChild(grid);
    appendNav(c, { showNext: false }); // mid-round — see the appendNav fix note above
  }
  renderRound();
}

/* ---------- Game 4: drag-and-drop, now multi-round ----------
   Thin wrapper around runDragDropGame — reuses it unchanged, just
   loops it with a fresh shuffled starting arrangement each round. ---------- */

function runOrderedDragDropRounds({ group, rounds, onDone, instruction, subinstruction }) {
  let round = 0;
  function nextRound() {
    if (round >= rounds) { onDone(); return; }
    runDragDropGame({
      target: group,
      start: shuffle(group),
      instruction,
      subinstruction,
      roundLabel: `Round ${round + 1} / ${rounds}`,
      onDone: () => { round++; nextRound(); }
    });
  }
  nextRound();
}

/* ---------- Game 4 / finalReview drag-and-drop runner ----------
   Uses Pointer Events (not native HTML5 drag-and-drop, which has poor
   touch support) so mouse, touch, and stylus all work the same way. */

function runDragDropGame({ target, start, onDone, instruction = "Put the Hiragana in the correct order.", subinstruction = "Drag the characters into the correct order.", roundLabel = null }) {
  const c = card();
  if (roundLabel) {
    const stepLabel = document.createElement("div");
    stepLabel.className = "exp-step-count";
    stepLabel.textContent = roundLabel;
    c.appendChild(stepLabel);
  }
  c.appendChild(instructionBlock(instruction, subinstruction));

  const slotsRow = document.createElement("div");
  slotsRow.className = "exp-dnd-slots";
  const slots = target.map(() => {
    const slot = document.createElement("div");
    slot.className = "exp-dnd-slot";
    slot.textContent = "—";
    slotsRow.appendChild(slot);
    return slot;
  });
  c.appendChild(slotsRow);

  const tray = document.createElement("div");
  tray.className = "exp-dnd-tray";
  c.appendChild(tray);

  const feedback = document.createElement("div");
  feedback.className = "exp-feedback";

  function slotValues() { return slots.map(s => s.dataset.char || null); }

  function makeChip(ch) {
    const chip = document.createElement("div");
    chip.className = "exp-dnd-chip";
    chip.textContent = ch;
    chip.dataset.char = ch;

    chip.addEventListener("pointerdown", (evt) => {
      const ghost = document.createElement("div");
      ghost.className = "exp-dnd-ghost";
      ghost.textContent = ch;
      document.body.appendChild(ghost);
      const moveGhost = (x, y) => { ghost.style.left = (x - 31) + "px"; ghost.style.top = (y - 31) + "px"; };
      moveGhost(evt.clientX, evt.clientY);
      chip.classList.add("dragging");

      const onMove = (e) => moveGhost(e.clientX, e.clientY);
      const onUp = (e) => {
        document.removeEventListener("pointermove", onMove);
        document.removeEventListener("pointerup", onUp);
        ghost.remove();
        chip.classList.remove("dragging");

        // Hit-test against slot bounding boxes.
        let placed = false;
        for (const slot of slots) {
          const r = slot.getBoundingClientRect();
          if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) {
            if (!slot.dataset.char) {
              slot.dataset.char = ch;
              slot.textContent = ch;
              slot.classList.add("filled");
              chip.remove();
              placed = true;
            }
            break;
          }
        }
        if (!placed) { /* snaps back — chip was never removed from tray */ }
      };
      document.addEventListener("pointermove", onMove);
      document.addEventListener("pointerup", onUp);
    });

    // Tap a filled slot to return its chip to the tray.
    return chip;
  }

  slots.forEach(slot => {
    slot.addEventListener("click", () => {
      if (slot.dataset.char) {
        tray.appendChild(makeChip(slot.dataset.char));
        delete slot.dataset.char;
        slot.textContent = "—";
        slot.classList.remove("filled");
      }
    });
  });

  shuffle(start).forEach(ch => tray.appendChild(makeChip(ch)));

  const checkBtn = primaryButton("Check", () => {
    const values = slotValues();
    const correct = values.length === target.length && values.every((v, i) => v === target[i]);
    if (correct) {
      feedback.textContent = "Correct.";
      feedback.className = "exp-feedback good";
      checkBtn.disabled = true;
      setTimeout(onDone, 700);
    } else {
      feedback.textContent = "Try again.";
      feedback.className = "exp-feedback bad";
    }
  });
  c.appendChild(checkBtn);
  c.appendChild(feedback);
  appendNav(c, { showNext: false }); // must complete via Check — see the appendNav fix note above
}

/* ---------- Sequence fill-in-the-blank (Section 5) ----------
   Reuses the same pointer-drag pattern as runDragDropGame, simplified
   to a single blank slot instead of a full 5-slot sequence. ---------- */

function runFillBlankGame({ questions, onDone }) {
  let qi = 0;
  function renderQuestion() {
    const c = card();
    const stepLabel = document.createElement("div");
    stepLabel.className = "exp-step-count";
    stepLabel.textContent = `Question ${qi + 1} / ${questions.length}`;
    c.appendChild(stepLabel);
    c.appendChild(instructionBlock("Drag the correct character into the blank.", "Complete the Hiragana sequence."));

    const q = questions[qi];
    const seqRow = document.createElement("div");
    seqRow.className = "exp-dnd-slots";
    let blankSlot = null;
    q.sequence.forEach(ch => {
      if (ch === null) {
        const slot = document.createElement("div");
        slot.className = "exp-dnd-slot";
        slot.textContent = "—";
        seqRow.appendChild(slot);
        blankSlot = slot;
      } else {
        const fixed = document.createElement("div");
        fixed.className = "exp-dnd-slot filled";
        fixed.textContent = ch;
        seqRow.appendChild(fixed);
      }
    });
    c.appendChild(seqRow);

    const tray = document.createElement("div");
    tray.className = "exp-dnd-tray";
    c.appendChild(tray);

    const feedback = document.createElement("div");
    feedback.className = "exp-feedback";

    function checkAnswer(ch) {
      if (ch === q.answer) {
        blankSlot.textContent = ch;
        blankSlot.classList.add("filled");
        feedback.textContent = "Correct.";
        feedback.className = "exp-feedback good";
        tray.querySelectorAll(".exp-dnd-chip").forEach(chip => { chip.style.pointerEvents = "none"; });
        setTimeout(() => {
          qi++;
          if (qi < questions.length) renderQuestion();
          else onDone();
        }, 700);
      } else {
        feedback.textContent = "Try again.";
        feedback.className = "exp-feedback bad";
      }
    }

    function makeChip(ch) {
      const chip = document.createElement("div");
      chip.className = "exp-dnd-chip";
      chip.textContent = ch;
      chip.dataset.char = ch;
      chip.addEventListener("pointerdown", (evt) => {
        const ghost = document.createElement("div");
        ghost.className = "exp-dnd-ghost";
        ghost.textContent = ch;
        document.body.appendChild(ghost);
        const moveGhost = (x, y) => { ghost.style.left = (x - 31) + "px"; ghost.style.top = (y - 31) + "px"; };
        moveGhost(evt.clientX, evt.clientY);
        chip.classList.add("dragging");
        const onMove = (e) => moveGhost(e.clientX, e.clientY);
        const onUp = (e) => {
          document.removeEventListener("pointermove", onMove);
          document.removeEventListener("pointerup", onUp);
          ghost.remove();
          chip.classList.remove("dragging");
          const r = blankSlot.getBoundingClientRect();
          if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) {
            checkAnswer(ch);
          }
        };
        document.addEventListener("pointermove", onMove);
        document.addEventListener("pointerup", onUp);
      });
      return chip;
    }

    shuffle(q.choices).forEach(ch => tray.appendChild(makeChip(ch)));
    c.appendChild(feedback);
    appendNav(c, { showNext: false }); // mid-question — see the appendNav fix note above
  }
  renderQuestion();
}

/* ---------- Final review: 5 short activities in sequence ---------- */

function runFinalReview(onAllDone) {
  const activities = [
    { kind: "choice", instruction: 'Which one is "a"?', choices: shuffle(["あ", "い", "う"]), correct: "あ" },
    { kind: "choice", instruction: 'Which one is "o"?', choices: shuffle(["え", "お", "あ"]), correct: "お" },
    { kind: "choice", instruction: "Which one is different?", choices: shuffle(["あ", "い", "か", "う"]), correct: "か" },
    { kind: "dnd", instruction: "Put the Hiragana in the correct order.", start: ["え", "あ", "お", "う", "い"], target: ["あ", "い", "う", "え", "お"] },
    { kind: "sequence", instruction: "Complete the sequence.", display: "あ → い → ?", choices: shuffle(["え", "う", "お"]), correct: "う" }
  ];
  let ai = 0;

  function renderActivity() {
    if (ai >= activities.length) { onAllDone(); return; }
    const a = activities[ai];

    if (a.kind === "dnd") {
      runDragDropGame({ target: a.target, start: a.start, onDone: () => { ai++; renderActivity(); } });
      return;
    }

    const c = card();
    const stepLabel = document.createElement("div");
    stepLabel.className = "exp-step-count";
    stepLabel.textContent = `Review ${ai + 1} / ${activities.length}`;
    c.appendChild(stepLabel);

    if (a.kind === "sequence") {
      const seq = document.createElement("div");
      seq.className = "exp-mid";
      seq.textContent = a.display;
      c.appendChild(seq);
    }
    c.appendChild(instructionBlock(a.instruction));

    const feedback = document.createElement("div");
    feedback.className = "exp-feedback";

    const grid = document.createElement("div");
    grid.className = "exp-choice-grid";
    a.choices.forEach(choice => {
      const btn = document.createElement("button");
      btn.className = "exp-choice";
      btn.textContent = choice;
      btn.addEventListener("click", () => {
        if (choice === a.correct) {
          btn.classList.add("correct");
          feedback.textContent = "Correct.";
          feedback.className = "exp-feedback good";
          grid.querySelectorAll("button").forEach(b => b.disabled = true);
          setTimeout(() => { ai++; renderActivity(); }, 700);
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
    appendNav(c, { showNext: false }); // mid-review-activity — see the appendNav fix note above
  }
  renderActivity();
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
