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

/* ---------- Bidirectional navigation ---------- */

function appendNav(c) {
  const row = document.createElement("div");
  row.className = "exp-nav-row";
  if (stepIndex > 0) row.appendChild(primaryButton("Previous", goPrevious, { secondary: true }));
  if (stepIndex < steps.length - 1) row.appendChild(primaryButton("Next", goNext));
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
steps.push({ type: "sentenceExample" });
steps.push({ type: "hiraganaIntro" });
CHARS.forEach(c => {
  steps.push({ type: "learnChar", char: c });
  steps.push({ type: "writing", char: c.char });
  steps.push({ type: "vocab", char: c });
  steps.push({ type: "vocabWriting", char: c });
});
steps.push({ type: "review" });
steps.push({ type: "game1" });
steps.push({ type: "game2" });
steps.push({ type: "game3" });
steps.push({ type: "game4" });
steps.push({ type: "sequenceBlank" });
steps.push({ type: "finalReview" });
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

  sentenceExample() {
    const c = card();
    c.innerHTML = `<div class="exp-mid">A Real Sentence</div>`;
    const parts = [
      { text: "私", label: "Kanji" },
      { text: "は", label: "Hiragana" },
      { text: "マレーシア", label: "Katakana" },
      { text: "人", label: "Kanji" },
      { text: "です", label: "Hiragana" },
      { text: "。", label: null }
    ];
    const sentence = document.createElement("div");
    sentence.className = "exp-clickable-sentence";
    const reveal = document.createElement("div");
    reveal.className = "exp-tag-reveal";

    parts.forEach(p => {
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

    const translation = document.createElement("p");
    translation.className = "exp-note";
    translation.style.marginBottom = "4px";
    translation.textContent = "I am Malaysian.";
    c.appendChild(translation);

    c.appendChild(reveal);
    c.appendChild(instructionBlock("Tap each part to see which writing system it uses."));
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
    grid.appendChild(buildWritingSlot(word, "Practice"));
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
    const questions = [
      { target: "あ", choices: ["あ", "い", "か", "さ", "う"] },
      { target: "い", choices: ["い", "あ", "か", "き", "え"] },
      { target: "う", choices: ["う", "え", "こ", "い", "す"] },
      { target: "え", choices: ["え", "あ", "き", "う", "お"] },
      { target: "お", choices: ["お", "い", "こ", "あ", "え"] }
    ];
    runListeningGame({ questions, onDone: goNext });
  },

  game2() {
    const distractors = ["か", "き", "さ"];
    const questions = distractors.map(d => ({ target: d, choices: shuffle([...CHARS.map(c => c.char), d]) }));
    runChoiceGame({
      instruction: "Which one is different?",
      questions,
      buildChoices: q => q.choices,
      isCorrect: (choice, q) => choice === q.target,
      onDone: goNext
    });
  },

  game3() {
    const c = card();
    c.appendChild(instructionBlock("Find the characters in order.", "Start with あ and find the five characters in order."));
    const dots = document.createElement("div");
    dots.className = "exp-progress-dots";
    c.appendChild(dots);
    const feedback = document.createElement("div");
    feedback.className = "exp-feedback";
    c.appendChild(feedback);

    const grid = document.createElement("div");
    grid.className = "exp-maze";
    const layout = shuffle(["あ", "い", "う", "え", "お", "か", "き", "さ", "た", "こ", "ぬ", "す", "し", "く", "け", "せ"]);
    const order = ["あ", "い", "う", "え", "お"];
    let progress = 0;

    const updateDots = () => { dots.textContent = order.map((_, i) => i < progress ? "●" : "○").join(" "); };
    updateDots();

    layout.forEach(ch => {
      const btn = document.createElement("button");
      btn.textContent = ch;
      btn.addEventListener("click", () => {
        if (btn.disabled) return;
        if (ch === order[progress]) {
          btn.classList.add("found");
          btn.disabled = true;
          progress++;
          updateDots();
          feedback.textContent = "";
          feedback.className = "exp-feedback";
          if (progress === order.length) {
            const goalMsg = document.createElement("div");
            goalMsg.className = "exp-mid";
            goalMsg.textContent = "You made it!";
            c.insertBefore(goalMsg, grid);
            grid.querySelectorAll("button").forEach(b => b.disabled = true);
          }
        } else {
          feedback.textContent = "Try again.";
          feedback.className = "exp-feedback bad";
        }
      });
      grid.appendChild(btn);
    });
    c.appendChild(grid);
    appendNav(c);
  },

  game4() {
    runDragDropGame({
      target: ["あ", "い", "う", "え", "お"],
      start: ["う", "あ", "お", "い", "え"],
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
    const questions = [
      { sequence: ["あ", "い", null, "え", "お"], answer: "う", choices: ["う", "え", "お"] },
      { sequence: ["あ", null, "う", "え", "お"], answer: "い", choices: ["い", "あ", "う"] },
      { sequence: ["あ", "い", "う", null, "お"], answer: "え", choices: ["え", "い", "お"] }
    ];
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
    note2.textContent = "You can now recognize, read, and write your first five Hiragana characters.";
    c.appendChild(note2);
    appendNav(c);
  }
};

/* ---------- Independent writing canvas builder ---------- */

function buildWritingSlot(char, label) {
  const slot = document.createElement("div");
  slot.className = "exp-writing-slot";

  const labelEl = document.createElement("div");
  labelEl.className = "exp-writing-slot-label";
  labelEl.textContent = label;
  slot.appendChild(labelEl);

  const wrap = document.createElement("div");
  wrap.className = "exp-canvas-wrap";
  const ref = document.createElement("div");
  ref.className = "exp-writing-ref";
  ref.textContent = char;
  const canvas = document.createElement("canvas");
  canvas.className = "exp-writing-canvas";
  canvas.width = 180; canvas.height = 180;
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

function runChoiceGame({ instruction, subinstruction, questions, buildChoices, isCorrect, onDone, showCount = true }) {
  let qi = 0;
  function renderQuestion() {
    const c = card();
    const q = questions[qi];
    if (showCount) {
      const stepLabel = document.createElement("div");
      stepLabel.className = "exp-step-count";
      stepLabel.textContent = `Question ${qi + 1} / ${questions.length}`;
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
            if (qi < questions.length) renderQuestion();
            else onDone();
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
    appendNav(c);
  }
  renderQuestion();
}

/* ---------- Game 1's listening variant: Listen button (auto-plays,
   replayable) instead of text naming the target. ---------- */

function runListeningGame({ questions, onDone }) {
  let qi = 0;
  function renderQuestion() {
    const c = card();
    const q = questions[qi];
    const stepLabel = document.createElement("div");
    stepLabel.className = "exp-step-count";
    stepLabel.textContent = `Question ${qi + 1} / ${questions.length}`;
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
            if (qi < questions.length) renderQuestion();
            else onDone();
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
    appendNav(c);

    playHiraganaAudio(q.target); // auto-play once; Listen button replays
  }
  renderQuestion();
}

/* ---------- Game 4 / finalReview drag-and-drop runner ----------
   Uses Pointer Events (not native HTML5 drag-and-drop, which has poor
   touch support) so mouse, touch, and stylus all work the same way. */

function runDragDropGame({ target, start, onDone, instruction = "Put the Hiragana in the correct order.", subinstruction = "Drag the characters into the correct order." }) {
  const c = card();
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
  appendNav(c);
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
    appendNav(c);
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
    appendNav(c);
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
