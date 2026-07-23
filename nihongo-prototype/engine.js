/* ══════════════════════════════════════════════
   Engine — renders whatever step type the data
   says it is. No scene-specific logic lives here.
══════════════════════════════════════════════ */

const state = {
  index: 0,
  name: "",
  pronoun: "わたし", // default; overwritten by pronounChoice step
};

const app = document.getElementById("app");

/* ---------- audio (placeholder: browser speech synthesis) ---------- */
function speakJa(text) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "ja-JP";
  utter.rate = 0.9;
  window.speechSynthesis.speak(utter);
}

/* Plays わたしは ... です with a pause where the learner reads their own name */
function speakNameLine() {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const part1 = new SpeechSynthesisUtterance(state.pronoun + "は");
  const part2 = new SpeechSynthesisUtterance("です。");
  part1.lang = "ja-JP"; part2.lang = "ja-JP";
  part1.rate = 0.9; part2.rate = 0.9;
  part1.onend = () => setTimeout(() => window.speechSynthesis.speak(part2), 650);
  window.speechSynthesis.speak(part1);
}

/* ---------- optional recording (never blocks anything) ---------- */
function attachOptionalRecorder(container) {
  const btn = document.createElement("button");
  btn.className = "record-btn";
  btn.innerHTML = `<span class="icon">🎤</span> Try saying it (optional)`;
  let recorder, chunks = [], recording = false, lastBlobUrl = null;

  btn.addEventListener("click", async () => {
    if (!navigator.mediaDevices || !window.MediaRecorder) {
      btn.textContent = "Recording isn't available on this device — that's okay!";
      return;
    }
    if (!recording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        chunks = [];
        recorder = new MediaRecorder(stream);
        recorder.ondataavailable = (e) => chunks.push(e.data);
        recorder.onstop = () => {
          const blob = new Blob(chunks, { type: "audio/webm" });
          lastBlobUrl = URL.createObjectURL(blob);
          btn.innerHTML = `<span class="icon">▶️</span> Play what you said`;
          stream.getTracks().forEach(t => t.stop());
        };
        recorder.start();
        recording = true;
        btn.classList.add("recording");
        btn.innerHTML = `<span class="icon">⏺</span> Recording… tap to stop`;
      } catch (err) {
        // Permission denied or unsupported — never block, just inform gently
        btn.textContent = "No worries — recording is optional.";
      }
    } else if (recorder && recorder.state === "recording") {
      recorder.stop();
      recording = false;
      btn.classList.remove("recording");
    } else if (lastBlobUrl) {
      new Audio(lastBlobUrl).play();
    }
  });

  container.appendChild(btn);
}

/* ---------- illustration placeholder ---------- */
function illustrationEl(key) {
  const div = document.createElement("div");
  div.className = "illustration";
  div.innerHTML = `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="36" r="16" fill="#3A342B" opacity="0.25"/>
      <path d="M20 90 Q50 55 80 90 Z" fill="#3A342B" opacity="0.25"/>
    </svg>
    <span class="placeholder-label">illustration placeholder — ${key}</span>
  `;
  return div;
}

/* ---------- progress dots ---------- */
function progressDots(currentScene) {
  const wrap = document.createElement("div");
  wrap.className = "progress-dots";
  for (let s = 1; s <= 5; s++) {
    const dot = document.createElement("span");
    if (s < currentScene) dot.classList.add("done");
    else if (s === currentScene) dot.classList.add("active");
    wrap.appendChild(dot);
  }
  return wrap;
}

function nameLineJp() {
  return `${state.pronoun}は ${state.name || "……"} です。`;
}

/* ---------- main render ---------- */
function render() {
  const step = STEPS[state.index];
  app.innerHTML = "";

  const wrap = document.createElement("div");
  wrap.className = "step-fade";

  const tag = document.createElement("div");
  tag.className = "location-tag";
  tag.textContent = step.location;
  wrap.appendChild(tag);

  wrap.appendChild(illustrationEl(step.illustration));
  wrap.appendChild(progressDots(step.scene));

  switch (step.type) {
    case "narration": renderNarration(wrap, step); break;
    case "guess": renderGuess(wrap, step); break;
    case "nameInput": renderNameInput(wrap, step); break;
    case "pronounChoice": renderPronounChoice(wrap, step); break;
    case "revealNameLine": renderRevealNameLine(wrap, step); break;
    case "dialogueReveal": renderDialogueReveal(wrap, step); break;
    case "sequenceAssembly": renderSequenceAssembly(wrap, step); break;
    case "binaryChoice": renderBinaryChoice(wrap, step); break;
    case "endOfPrototype": renderEnd(wrap, step); break;
  }

  app.appendChild(wrap);
}

function goNext() {
  if (state.index < STEPS.length - 1) {
    state.index++;
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function primaryButton(label, onClick, disabled = false) {
  const bar = document.createElement("div");
  bar.className = "continue-bar";
  const btn = document.createElement("button");
  btn.className = "btn-primary";
  btn.textContent = label;
  btn.disabled = disabled;
  btn.addEventListener("click", onClick);
  bar.appendChild(btn);
  return bar;
}

/* ---------- step renderers ---------- */

function renderNarration(wrap, step) {
  const p = document.createElement("p");
  p.className = "narration";
  p.textContent = step.text;
  wrap.appendChild(p);
  wrap.appendChild(primaryButton(step.continueLabel || "Continue", goNext));
}

function renderGuess(wrap, step) {
  const d = document.createElement("div");
  d.className = "dialogue-block";
  d.innerHTML = `
    <div class="speaker-name">${step.speaker}</div>
    <div class="jp-line">${step.jp}</div>
  `;
  wrap.appendChild(d);

  const audioBtn = document.createElement("button");
  audioBtn.className = "audio-btn";
  audioBtn.style.marginLeft = "26px";
  audioBtn.innerHTML = `<span class="icon">🔊</span> Listen`;
  audioBtn.addEventListener("click", () => speakJa(step.audio));
  wrap.appendChild(audioBtn);

  const prompt = document.createElement("p");
  prompt.className = "prompt";
  prompt.textContent = step.prompt;
  wrap.appendChild(prompt);

  const opts = document.createElement("div");
  opts.className = "options";
  const feedback = document.createElement("div");

  step.options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = opt;
    btn.addEventListener("click", () => {
      [...opts.children].forEach(b => b.disabled = true);
      if (i === step.correctIndex) {
        btn.classList.add("correct");
        showFeedback(feedback, step.feedbackCorrect, step, true);
      } else {
        btn.classList.add("chosen-wrong");
        opts.children[step.correctIndex].classList.add("correct");
        showFeedback(feedback, step.feedbackWrong, step, false);
      }
    });
    opts.appendChild(btn);
  });

  wrap.appendChild(opts);
  wrap.appendChild(feedback);
}

function showFeedback(feedbackEl, message, step, correct) {
  feedbackEl.className = "feedback";
  feedbackEl.style.margin = "10px 26px 0";
  feedbackEl.textContent = message;
  feedbackEl.style.display = "block";

  if (step.reveal) {
    const revealBox = document.createElement("div");
    revealBox.className = "dialogue-block";
    revealBox.innerHTML = `<div class="jp-line">${step.reveal.jp}</div><div class="en-line">${step.reveal.en}</div>`;
    feedbackEl.after(revealBox);

    if (step.showRepeat) {
      const repeatWrap = document.createElement("div");
      repeatWrap.style.padding = "0 26px";
      attachOptionalRecorder(repeatWrap);
      revealBox.after(repeatWrap);
    }
  }

  const bar = primaryButton("Continue", goNext);
  feedbackEl.parentElement.appendChild(bar);
}

function renderNameInput(wrap, step) {
  const prompt = document.createElement("p");
  prompt.className = "prompt";
  prompt.textContent = step.prompt;
  wrap.appendChild(prompt);

  const inputWrap = document.createElement("div");
  inputWrap.className = "name-input-wrap";
  const input = document.createElement("input");
  input.className = "name-input";
  input.type = "text";
  input.placeholder = "Your name";
  input.maxLength = 24;
  inputWrap.appendChild(input);
  wrap.appendChild(inputWrap);

  const bar = primaryButton("Continue", () => {
    state.name = input.value.trim() || "You";
    goNext();
  });
  wrap.appendChild(bar);

  input.addEventListener("input", () => {
    bar.querySelector("button").disabled = false;
  });
}

function renderPronounChoice(wrap, step) {
  const prompt = document.createElement("p");
  prompt.className = "prompt";
  prompt.textContent = step.prompt;
  wrap.appendChild(prompt);

  const opts = document.createElement("div");
  opts.className = "options";
  step.options.forEach(opt => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.innerHTML = `${opt.label}<br><span style="font-size:12.5px;color:var(--ink-soft)">${opt.note}</span>`;
    btn.addEventListener("click", () => {
      state.pronoun = opt.value;
      goNext();
    });
    opts.appendChild(btn);
  });
  wrap.appendChild(opts);
}

function renderRevealNameLine(wrap, step) {
  const d = document.createElement("div");
  d.className = "dialogue-block";
  d.innerHTML = `<div class="jp-line">${nameLineJp()}</div><div class="en-line">I am ${state.name}.</div>`;
  wrap.appendChild(d);

  const audioBtn = document.createElement("button");
  audioBtn.className = "audio-btn";
  audioBtn.style.marginLeft = "26px";
  audioBtn.innerHTML = `<span class="icon">🔊</span> Listen (read your name aloud in the pause)`;
  audioBtn.addEventListener("click", speakNameLine);
  wrap.appendChild(audioBtn);

  const feedback = document.createElement("p");
  feedback.className = "feedback";
  feedback.style.margin = "14px 26px 0";
  feedback.textContent = step.feedbackCorrect;
  wrap.appendChild(feedback);

  const recWrap = document.createElement("div");
  recWrap.style.padding = "10px 26px 0";
  attachOptionalRecorder(recWrap);
  wrap.appendChild(recWrap);

  wrap.appendChild(primaryButton("Continue", goNext));
}

function renderDialogueReveal(wrap, step) {
  step.lines.forEach(line => {
    const d = document.createElement("div");
    d.className = "dialogue-block";
    d.innerHTML = `
      <div class="speaker-name">${line.speaker}</div>
      <div class="jp-line">${line.jp}</div>
      <div class="en-line">${line.en}</div>
    `;
    wrap.appendChild(d);
    const audioBtn = document.createElement("button");
    audioBtn.className = "audio-btn";
    audioBtn.style.marginLeft = "26px";
    audioBtn.innerHTML = `<span class="icon">🔊</span> Listen`;
    audioBtn.addEventListener("click", () => speakJa(line.audio));
    wrap.appendChild(audioBtn);
  });

  const prompt = document.createElement("p");
  prompt.className = "prompt";
  prompt.textContent = step.prompt;
  wrap.appendChild(prompt);

  wrap.appendChild(primaryButton("Continue", goNext));
}

function renderSequenceAssembly(wrap, step) {
  const prompt = document.createElement("p");
  prompt.className = "prompt";
  prompt.textContent = step.prompt;
  wrap.appendChild(prompt);

  const strip = document.createElement("div");
  strip.className = "assembled-strip";
  wrap.appendChild(strip);

  const bank = document.createElement("div");
  bank.className = "chip-bank";
  wrap.appendChild(bank);

  const feedback = document.createElement("p");
  feedback.className = "feedback neutral";
  feedback.style.margin = "10px 26px 0";
  feedback.style.display = "none";
  wrap.appendChild(feedback);

  let assembled = [];
  const shuffled = [...step.pieces].sort(() => Math.random() - 0.5);

  function resolveText(piece) {
    return piece.jp === "__NAME_LINE__" ? nameLineJp() : piece.jp;
  }

  function renderBank() {
    bank.innerHTML = "";
    shuffled.forEach(piece => {
      const chip = document.createElement("button");
      chip.className = "chip-option";
      chip.textContent = resolveText(piece);
      if (assembled.includes(piece.id)) chip.classList.add("used");
      chip.addEventListener("click", () => {
        if (assembled.includes(piece.id)) return;
        assembled.push(piece.id);
        renderStrip();
        renderBank();
        if (assembled.length === step.pieces.length) checkOrder();
      });
      bank.appendChild(chip);
    });
  }

  function renderStrip() {
    strip.innerHTML = "";
    assembled.forEach(id => {
      const piece = step.pieces.find(p => p.id === id);
      const chip = document.createElement("span");
      chip.className = "chip";
      chip.textContent = resolveText(piece);
      strip.appendChild(chip);
    });
  }

  function checkOrder() {
    const isCorrect = JSON.stringify(assembled) === JSON.stringify(step.correctOrder);
    feedback.style.display = "block";
    if (isCorrect) {
      feedback.className = "feedback";
      feedback.textContent = "Perfect — that's your self-introduction!";
      const recWrap = document.createElement("div");
      recWrap.style.padding = "10px 26px 0";
      attachOptionalRecorder(recWrap);
      feedback.after(recWrap);
      recWrap.after(primaryButton("Continue", goNext));
    } else {
      feedback.className = "feedback neutral";
      feedback.textContent = step.retryLabel + " — tap Reset.";
      const resetBar = document.createElement("div");
      resetBar.className = "continue-bar";
      const resetBtn = document.createElement("button");
      resetBtn.className = "btn-primary";
      resetBtn.textContent = "Reset";
      resetBtn.addEventListener("click", () => {
        assembled = [];
        feedback.style.display = "none";
        renderStrip();
        renderBank();
        resetBar.remove();
      });
      resetBar.appendChild(resetBtn);
      feedback.after(resetBar);
    }
  }

  renderStrip();
  renderBank();
}

function renderBinaryChoice(wrap, step) {
  const prompt = document.createElement("p");
  prompt.className = "prompt";
  prompt.textContent = step.prompt;
  wrap.appendChild(prompt);

  const opts = document.createElement("div");
  opts.className = "options";
  const feedback = document.createElement("div");

  step.options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = opt;
    btn.addEventListener("click", () => {
      [...opts.children].forEach(b => b.disabled = true);
      if (i === step.correctIndex) {
        btn.classList.add("correct");
        showFeedback(feedback, step.feedbackCorrect, step, true);
      } else {
        btn.classList.add("chosen-wrong");
        opts.children[step.correctIndex].classList.add("correct");
        showFeedback(feedback, step.feedbackWrong, step, false);
      }
    });
    opts.appendChild(btn);
  });

  wrap.appendChild(opts);
  wrap.appendChild(feedback);
}

function renderEnd(wrap, step) {
  const p = document.createElement("p");
  p.className = "narration";
  p.textContent = step.text;
  wrap.appendChild(p);

  const note = document.createElement("p");
  note.className = "feedback neutral";
  note.style.margin = "16px 26px 0";
  note.textContent = "Prototype ends here — Scenes 6–13 continue the story on Day 2 and beyond.";
  wrap.appendChild(note);
}

render();
