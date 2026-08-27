/* ══════════════════════════════════════════════
   Experience / Trial Lesson — あいうえお
   Vanilla JS, single linear step sequence. No frameworks,
   no backend, no scoring/accounts — a teaching aid, not
   the teacher, exactly per the brief.
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

function speak(text) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "ja-JP";
  utter.rate = 0.85;
  window.speechSynthesis.speak(utter);
}

function speakerButton(text) {
  const btn = document.createElement("button");
  btn.className = "exp-speaker";
  btn.textContent = "🔊";
  btn.addEventListener("click", () => speak(text));
  return btn;
}

function primaryButton(label, onClick, opts = {}) {
  const btn = document.createElement("button");
  btn.className = "exp-btn" + (opts.secondary ? " secondary" : "");
  btn.textContent = label;
  btn.addEventListener("click", onClick);
  return btn;
}

function card() {
  const c = document.createElement("div");
  c.className = "exp-card";
  app.innerHTML = "";
  app.appendChild(c);
  return c;
}

/* ---------- Build the linear step sequence ---------- */

const steps = [];
steps.push({ type: "intro" });
steps.push({ type: "writingTypes" });
steps.push({ type: "sentenceDemo" });
steps.push({ type: "hiraganaIntro" });
CHARS.forEach(c => {
  steps.push({ type: "learnChar", char: c });
  steps.push({ type: "vocab", char: c });
});
steps.push({ type: "review" });
steps.push({ type: "game1" });
steps.push({ type: "game2" });
steps.push({ type: "game3" });
["あ", "い", "う"].forEach(c => steps.push({ type: "writing", char: c }));
steps.push({ type: "finalReview" });
steps.push({ type: "finish" });

let stepIndex = 0;
function goNext() { stepIndex++; render(); }

/* ---------- Screen renderers ---------- */

function render() {
  const step = steps[stepIndex];
  renderers[step.type](step);
}

const renderers = {
  intro() {
    const c = card();
    c.innerHTML = `<div class="exp-mid">こんにちは！</div><p class="exp-note">Today, let's learn some Japanese!</p>`;
    c.appendChild(primaryButton("はじめよう！", goNext));
  },

  writingTypes() {
    const c = card();
    c.innerHTML = `
      <div class="exp-writing-row">
        <div class="exp-writing-item"><span class="type-label">ひらがな Hiragana</span>あ　い　う</div>
        <div class="exp-writing-item"><span class="type-label">カタカナ Katakana</span>ア　イ　ウ</div>
        <div class="exp-writing-item"><span class="type-label">漢字 Kanji</span>日　本　人</div>
      </div>
      <p class="exp-note">Japanese uses different types of writing together.</p>
    `;
    c.appendChild(primaryButton("つぎへ", goNext));
  },

  sentenceDemo() {
    const c = card();
    const parts = [
      { text: "私", label: "漢字" },
      { text: "は", label: "ひらがな" },
      { text: "日本人", label: "漢字" },
      { text: "です", label: "ひらがな" },
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
    c.appendChild(reveal);
    const note = document.createElement("p");
    note.className = "exp-note";
    note.textContent = "日本語では、いろいろな文字を組み合わせて文を書きます。";
    c.appendChild(note);
    c.appendChild(primaryButton("つぎへ", goNext));
  },

  hiraganaIntro() {
    const c = card();
    c.innerHTML = `
      <div class="exp-mid">ひらがな</div>
      <p class="exp-note">Today we will learn:</p>
      <div class="exp-big">あ　い　う　え　お</div>
    `;
    c.appendChild(primaryButton("はじめよう！", goNext));
  },

  learnChar(step) {
    const c = card();
    const { char, romaji } = step.char;
    c.innerHTML = `<div class="exp-big">${char}</div><div class="exp-romaji">${char} = ${romaji}</div>`;
    c.appendChild(speakerButton(char));
    const instr = document.createElement("p");
    instr.className = "exp-instruction";
    instr.textContent = `「${char}」と いってみよう！`;
    c.appendChild(instr);
    c.appendChild(primaryButton("できた！", goNext));
  },

  vocab(step) {
    const c = card();
    const { char, vocab } = step.char;
    c.innerHTML = `<div class="exp-mid">${char} のことば</div>`;
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
      item.addEventListener("click", () => {
        item.classList.toggle("revealed");
        speak(v.word);
      });
      grid.appendChild(item);
    });
    c.appendChild(grid);
    c.appendChild(primaryButton("つぎへ", goNext));
  },

  review() {
    const c = card();
    c.innerHTML = `<div class="exp-big" id="reviewRow"></div><p class="exp-instruction">いっしょに いってみよう！</p>`;
    const row = c.querySelector("#reviewRow");
    CHARS.forEach(cc => {
      const span = document.createElement("span");
      span.textContent = cc.char + "　";
      span.style.cursor = "pointer";
      span.addEventListener("click", () => {
        speak(cc.char);
        span.style.color = "var(--pale-gold)";
        setTimeout(() => { span.style.color = ""; }, 500);
      });
      row.appendChild(span);
    });
    c.appendChild(primaryButton("ゲームを はじめよう！", goNext));
  },

  game1() {
    const questions = [
      { target: "あ", choices: ["あ", "い", "か", "さ", "う"] },
      { target: "い", choices: ["い", "あ", "か", "き", "え"] },
      { target: "う", choices: ["う", "え", "こ", "い", "す"] },
      { target: "え", choices: ["え", "あ", "き", "う", "お"] },
      { target: "お", choices: ["お", "い", "こ", "あ", "え"] }
    ];
    runChoiceGame({
      title: q => `「${q.target}」は どれ？`,
      questions,
      buildChoices: q => shuffle(q.choices),
      isCorrect: (choice, q) => choice === q.target,
      onDone: goNext
    });
  },

  game2() {
    const distractors = ["か", "き", "さ"];
    const questions = distractors.map(d => ({ target: d, choices: shuffle([...CHARS.map(c => c.char), d]) }));
    runChoiceGame({
      title: () => "どれが ちがう？",
      questions,
      buildChoices: q => q.choices,
      isCorrect: (choice, q) => choice === q.target,
      onDone: goNext
    });
  },

  game3() {
    const c = card();
    c.innerHTML = `<div class="exp-mid">START → あ → い → う → え → お → GOAL</div>`;
    const dots = document.createElement("div");
    dots.className = "exp-progress-dots";
    c.appendChild(dots);
    const feedback = document.createElement("div");
    feedback.className = "exp-feedback";
    c.appendChild(feedback);

    const grid = document.createElement("div");
    grid.className = "exp-maze";
    const layout = ["あ", "か", "い", "さ", "う", "こ", "え", "き", "お"];
    const order = ["あ", "い", "う", "え", "お"];
    let progress = 0;

    const updateDots = () => {
      dots.textContent = order.map((_, i) => i < progress ? "●" : "○").join(" ");
    };
    updateDots();

    layout.forEach(ch => {
      const btn = document.createElement("button");
      btn.textContent = ch;
      btn.addEventListener("click", () => {
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
            goalMsg.textContent = "ゴール！";
            c.insertBefore(goalMsg, grid);
            grid.querySelectorAll("button").forEach(b => b.disabled = true);
            c.appendChild(primaryButton("つぎへ", goNext));
          }
        } else {
          feedback.textContent = "もう一度！";
          feedback.className = "exp-feedback bad";
        }
      });
      grid.appendChild(btn);
    });
    c.appendChild(grid);
  },

  writing(step) {
    const c = card();
    const char = step.char;
    c.innerHTML = `<div class="exp-mid">${char} を かいてみよう</div>`;
    const wrap = document.createElement("div");
    wrap.className = "exp-canvas-wrap";
    const ref = document.createElement("div");
    ref.className = "exp-writing-ref";
    ref.textContent = char;
    ref.style.left = "50%"; ref.style.top = "50%";
    ref.style.transform = "translate(-50%,-50%)";
    const canvas = document.createElement("canvas");
    canvas.className = "exp-writing-canvas";
    canvas.width = 260; canvas.height = 260;
    wrap.appendChild(ref);
    wrap.appendChild(canvas);
    c.appendChild(wrap);

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

    const btnRow = document.createElement("div");
    btnRow.className = "exp-btn-row";
    const clearBtn = primaryButton("けす", () => ctx.clearRect(0, 0, canvas.width, canvas.height), { secondary: true });
    const doneBtn = primaryButton("できた！", goNext);
    btnRow.appendChild(clearBtn);
    btnRow.appendChild(doneBtn);
    c.appendChild(btnRow);
  },

  finalReview() {
    const c = card();
    c.innerHTML = `<div class="exp-mid">できるかな？</div>`;
    const feedback = document.createElement("div");
    feedback.className = "exp-feedback";

    const challenges = [
      { type: "choice", prompt: "「お」は どれ？", choices: shuffle(["お", "あ", "い"]), correct: "お" },
      { type: "choice", prompt: "あ → い → ?", choices: shuffle(["う", "え", "お"]), correct: "う" }
    ];
    let ci = 0;

    function renderChallenge() {
      c.querySelectorAll(".exp-instruction, .exp-choice-grid").forEach(el => el.remove());
      if (ci >= challenges.length) {
        const finalPrompt = document.createElement("div");
        finalPrompt.className = "exp-instruction";
        finalPrompt.innerHTML = `あ　い　う　え　お<br>いっしょに いってみよう！`;
        c.insertBefore(finalPrompt, feedback);
        const nextBtn = primaryButton("つぎへ", goNext);
        nextBtn.classList.add("only-once");
        c.appendChild(nextBtn);
        return;
      }
      const ch = challenges[ci];
      const prompt = document.createElement("div");
      prompt.className = "exp-instruction";
      prompt.textContent = ch.prompt;
      c.insertBefore(prompt, feedback);

      const grid = document.createElement("div");
      grid.className = "exp-choice-grid";
      ch.choices.forEach(choice => {
        const btn = document.createElement("button");
        btn.className = "exp-choice";
        btn.textContent = choice;
        btn.addEventListener("click", () => {
          if (choice === ch.correct) {
            btn.classList.add("correct");
            feedback.textContent = "できた！";
            feedback.className = "exp-feedback good";
            grid.querySelectorAll("button").forEach(b => b.disabled = true);
            setTimeout(() => { ci++; renderChallenge(); }, 700);
          } else {
            btn.classList.add("wrong");
            feedback.textContent = "もう一度！";
            feedback.className = "exp-feedback bad";
          }
        });
        grid.appendChild(btn);
      });
      c.insertBefore(grid, feedback);
    }

    c.appendChild(feedback);
    renderChallenge();
  },

  finish() {
    const c = card();
    c.innerHTML = `
      <div class="exp-mid">🎉 できた！</div>
      <p class="exp-note">今日おぼえた ひらがな</p>
      <div class="exp-big">あ　い　う　え　お</div>
      <p class="exp-note">よくできました！</p>
    `;
  }
};

/* ---------- Small shared game-runner for game1/game2 (same shape) ---------- */

function runChoiceGame({ title, questions, buildChoices, isCorrect, onDone }) {
  let qi = 0;
  function renderQuestion() {
    const c = card();
    const q = questions[qi];
    const stepLabel = document.createElement("div");
    stepLabel.className = "exp-step-count";
    stepLabel.textContent = `Question ${qi + 1} / ${questions.length}`;
    c.appendChild(stepLabel);

    const prompt = document.createElement("div");
    prompt.className = "exp-mid";
    prompt.textContent = title(q);
    c.appendChild(prompt);

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
          feedback.textContent = "できた！";
          feedback.className = "exp-feedback good";
          grid.querySelectorAll("button").forEach(b => b.disabled = true);
          setTimeout(() => {
            qi++;
            if (qi < questions.length) renderQuestion();
            else onDone();
          }, 700);
        } else {
          btn.classList.add("wrong");
          feedback.textContent = "もう一度！";
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

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

render();
