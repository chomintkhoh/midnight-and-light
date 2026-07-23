/* ══════════════════════════════════════════════
   Engine v2 — same step-type data model, but:
   - beats accumulate within a scene (visual-novel
     log) instead of replacing the whole screen
   - one illustration persists per scene, only
     resets when the scene number changes
   - dialogue is colour-coded per character
   - choices are styled as in-story options, not
     quiz buttons
   - practice flow: listen → record → playback →
     listen again → Try Again / Got It (Continue
     stays separate and always available)
══════════════════════════════════════════════ */

const state = {
  index: 0,
  name: "",
  pronoun: "わたし",
};

const app = document.getElementById("app");
let currentScene = null;
let logEl = null;

/* ---------- audio (placeholder: browser speech synthesis) ---------- */
function speakJa(text) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "ja-JP";
  utter.rate = 0.9;
  window.speechSynthesis.speak(utter);
}

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

function nameLineJp() {
  return `${state.pronoun}は ${state.name || "……"} です。`;
}

/* ---------- the 5-step speaking practice widget ----------
   1. Listen  2. Record  3. Playback  4. Listen again
   5. Try Again / I Think I Got It  (Continue is separate
   and always present regardless of this widget's state) */
function buildPracticeWidget(audioText) {
  const wrap = document.createElement("div");
  wrap.className = "practice-widget";

  const row1 = document.createElement("div");
  row1.className = "practice-row";
  const listenBtn = document.createElement("button");
  listenBtn.className = "audio-btn";
  listenBtn.innerHTML = `<span class="icon">🔊</span> Listen`;
  listenBtn.addEventListener("click", () => speakJa(audioText));
  row1.appendChild(listenBtn);

  const recordBtn = document.createElement("button");
  recordBtn.className = "record-btn";
  recordBtn.innerHTML = `<span class="icon">🎤</span> Record yourself (optional)`;
  row1.appendChild(recordBtn);
  wrap.appendChild(row1);

  const afterRow = document.createElement("div");
  afterRow.className = "practice-row";
  afterRow.style.display = "none";
  wrap.appendChild(afterRow);

  const choiceRow = document.createElement("div");
  choiceRow.className = "practice-choice-row";
  choiceRow.style.display = "none";
  wrap.appendChild(choiceRow);

  let recorder, chunks = [], recording = false, blobUrl = null;

  function resetToStart() {
    afterRow.style.display = "none";
    choiceRow.style.display = "none";
    afterRow.innerHTML = "";
    choiceRow.innerHTML = "";
    recordBtn.disabled = false;
    recordBtn.innerHTML = `<span class="icon">🎤</span> Record yourself (optional)`;
  }

  function showAfterRecording() {
    afterRow.innerHTML = "";
    afterRow.style.display = "flex";

    const playBtn = document.createElement("button");
    playBtn.className = "audio-btn";
    playBtn.innerHTML = `<span class="icon">▶️</span> Play your recording`;
    playBtn.addEventListener("click", () => { if (blobUrl) new Audio(blobUrl).play(); });
    afterRow.appendChild(playBtn);

    const listenAgainBtn = document.createElement("button");
    listenAgainBtn.className = "audio-btn";
    listenAgainBtn.innerHTML = `<span class="icon">🔊</span> Listen to reference again`;
    listenAgainBtn.addEventListener("click", () => speakJa(audioText));
    afterRow.appendChild(listenAgainBtn);

    choiceRow.innerHTML = "";
    choiceRow.style.display = "flex";

    const tryAgainBtn = document.createElement("button");
    tryAgainBtn.className = "choice-pill";
    tryAgainBtn.textContent = "Try Again";
    tryAgainBtn.addEventListener("click", () => { resetToStart(); });
    choiceRow.appendChild(tryAgainBtn);

    const gotItBtn = document.createElement("button");
    gotItBtn.className = "choice-pill gotit";
    gotItBtn.textContent = "I Think I Got It ✓";
    gotItBtn.addEventListener("click", () => {
      gotItBtn.classList.add("confirmed");
      gotItBtn.textContent = "Nice — noted ✓";
      tryAgainBtn.disabled = false;
    });
    choiceRow.appendChild(gotItBtn);
  }

  recordBtn.addEventListener("click", async () => {
    if (!navigator.mediaDevices || !window.MediaRecorder) {
      recordBtn.textContent = "Recording isn't available here — that's okay, just continue whenever you're ready.";
      recordBtn.disabled = true;
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
          blobUrl = URL.createObjectURL(blob);
          stream.getTracks().forEach(t => t.stop());
          showAfterRecording();
        };
        recorder.start();
        recording = true;
        recordBtn.classList.add("recording");
        recordBtn.innerHTML = `<span class="icon">⏺</span> Recording… tap to stop`;
      } catch (err) {
        recordBtn.textContent = "No worries — recording is optional. Continue whenever you like.";
        recordBtn.disabled = true;
      }
    } else if (recorder && recorder.state === "recording") {
      recorder.stop();
      recording = false;
      recordBtn.classList.remove("recording");
    }
  });

  return wrap;
}

/* ---------- illustration (persists per scene) ---------- */
function buildIllustration(key) {
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

function progressDots(sceneNum) {
  const wrap = document.createElement("div");
  wrap.className = "progress-dots";
  for (let s = 1; s <= 5; s++) {
    const dot = document.createElement("span");
    if (s < sceneNum) dot.classList.add("done");
    else if (s === sceneNum) dot.classList.add("active");
    wrap.appendChild(dot);
  }
  return wrap;
}

/* Called once per step. Resets the view only when the scene number
   actually changes; otherwise appends a new "beat" into the log so
   the story reads as one continuous scene, not a new screen each time. */
function ensureSceneShell(step) {
  if (step.scene !== currentScene) {
    currentScene = step.scene;
    app.innerHTML = "";

    const tag = document.createElement("div");
    tag.className = "location-tag";
    tag.textContent = step.location;
    app.appendChild(tag);

    app.appendChild(buildIllustration(step.illustration));
    app.appendChild(progressDots(step.scene));

    logEl = document.createElement("div");
    logEl.className = "story-log";
    app.appendChild(logEl);
  }
}

function appendBeat(el) {
  el.classList.add("beat-fade");
  logEl.appendChild(el);
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function goNext() {
  if (state.index < STEPS.length - 1) {
    state.index++;
    render();
  }
}

function gestureLine(text) {
  const p = document.createElement("p");
  p.className = "gesture-line";
  p.textContent = "(" + text + ")";
  return p;
}

function speakerTag(name) {
  const c = CHARACTERS[name] || { color: "#8A6FB0" };
  const tag = document.createElement("div");
  tag.className = "speaker-name";
  tag.style.color = c.color;
  tag.textContent = name;
  return tag;
}

function dialogueBubble(name, jp) {
  const c = CHARACTERS[name] || { color: "#8A6FB0", tint: "#F0EAF7" };
  const bubble = document.createElement("div");
  bubble.className = "dialogue-bubble";
  bubble.style.background = c.tint;
  bubble.style.borderColor = c.color;
  bubble.appendChild(speakerTag(name));
  const jpLine = document.createElement("div");
  jpLine.className = "jp-line";
  jpLine.textContent = jp;
  bubble.appendChild(jpLine);
  return bubble;
}

function primaryButton(label, onClick) {
  const bar = document.createElement("div");
  bar.className = "continue-bar";
  const btn = document.createElement("button");
  btn.className = "btn-primary";
  btn.textContent = label;
  btn.addEventListener("click", onClick);
  bar.appendChild(btn);
  return bar;
}

/* ---------- step renderers — each appends ONE beat to the log ---------- */

function render() {
  const step = STEPS[state.index];
  ensureSceneShell(step);

  const beat = document.createElement("div");

  switch (step.type) {
    case "narration": renderNarration(beat, step); break;
    case "guess": renderGuess(beat, step); break;
    case "nameInput": renderNameInput(beat, step); break;
    case "pronounChoice": renderPronounChoice(beat, step); break;
    case "revealNameLine": renderRevealNameLine(beat, step); break;
    case "dialogueReveal": renderDialogueReveal(beat, step); break;
    case "sequenceAssembly": renderSequenceAssembly(beat, step); break;
    case "binaryChoice": renderBinaryChoice(beat, step); break;
    case "endOfPrototype": renderEnd(beat, step); break;
  }

  appendBeat(beat);
}

function renderNarration(beat, step) {
  if (step.gesture) beat.appendChild(gestureLine(step.gesture));
  const p = document.createElement("p");
  p.className = "narration";
  p.textContent = step.text;
  beat.appendChild(p);
  beat.appendChild(primaryButton(step.continueLabel || "Continue", goNext));
}

function renderGuess(beat, step) {
  if (step.gesture) beat.appendChild(gestureLine(step.gesture));
  beat.appendChild(dialogueBubble(step.speaker, step.jp));

  const listenBtn = document.createElement("button");
  listenBtn.className = "audio-btn inline";
  listenBtn.innerHTML = `<span class="icon">🔊</span> Listen`;
  listenBtn.addEventListener("click", () => speakJa(step.audio));
  beat.appendChild(listenBtn);

  const prompt = document.createElement("p");
  prompt.className = "story-prompt";
  prompt.textContent = step.prompt;
  beat.appendChild(prompt);

  const choices = document.createElement("div");
  choices.className = "choice-list";

  step.options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.className = "choice-pill";
    btn.textContent = opt;
    btn.addEventListener("click", () => {
      [...choices.children].forEach(b => b.disabled = true);
      const correct = i === step.correctIndex;
      if (correct) btn.classList.add("correct");
      else {
        btn.classList.add("chosen-wrong");
        choices.children[step.correctIndex].classList.add("correct");
      }
      revealAfterChoice(beat, step, correct);
    });
    choices.appendChild(btn);
  });
  beat.appendChild(choices);
}

function revealAfterChoice(beat, step, correct) {
  const line = document.createElement("p");
  line.className = "story-line";
  line.textContent = correct ? step.feedbackCorrect : step.feedbackWrong;
  beat.appendChild(line);

  if (step.reveal) {
    const en = document.createElement("p");
    en.className = "en-line";
    en.textContent = step.reveal.en;
    beat.appendChild(en);

    if (step.showRepeat) {
      beat.appendChild(buildPracticeWidget(step.audio));
    }
  }
  beat.appendChild(primaryButton("Continue", goNext));
}

function renderNameInput(beat, step) {
  if (step.gesture) beat.appendChild(gestureLine(step.gesture));
  const prompt = document.createElement("p");
  prompt.className = "story-prompt";
  prompt.textContent = step.prompt;
  beat.appendChild(prompt);

  const inputWrap = document.createElement("div");
  inputWrap.className = "name-input-wrap";
  const input = document.createElement("input");
  input.className = "name-input";
  input.type = "text";
  input.placeholder = "Your name";
  input.maxLength = 24;
  inputWrap.appendChild(input);
  beat.appendChild(inputWrap);

  beat.appendChild(primaryButton("Continue", () => {
    state.name = input.value.trim() || "You";
    goNext();
  }));
}

function renderPronounChoice(beat, step) {
  const prompt = document.createElement("p");
  prompt.className = "story-prompt";
  prompt.textContent = step.prompt;
  beat.appendChild(prompt);

  const choices = document.createElement("div");
  choices.className = "choice-list";
  step.options.forEach(opt => {
    const btn = document.createElement("button");
    btn.className = "choice-pill wide";
    btn.innerHTML = `${opt.label}<br><span class="choice-note">${opt.note}</span>`;
    btn.addEventListener("click", () => {
      state.pronoun = opt.value;
      goNext();
    });
    choices.appendChild(btn);
  });
  beat.appendChild(choices);
}

function renderRevealNameLine(beat, step) {
  if (step.gesture) beat.appendChild(gestureLine(step.gesture));
  beat.appendChild(dialogueBubble("You", nameLineJp()));

  const en = document.createElement("p");
  en.className = "en-line";
  en.textContent = `I am ${state.name}.`;
  beat.appendChild(en);

  const listenBtn = document.createElement("button");
  listenBtn.className = "audio-btn inline";
  listenBtn.innerHTML = `<span class="icon">🔊</span> Listen (read your name aloud in the pause)`;
  listenBtn.addEventListener("click", speakNameLine);
  beat.appendChild(listenBtn);

  const line = document.createElement("p");
  line.className = "story-line";
  line.textContent = step.feedbackCorrect;
  beat.appendChild(line);

  beat.appendChild(buildPracticeWidget(nameLineJp()));
  beat.appendChild(primaryButton("Continue", goNext));
}

function renderDialogueReveal(beat, step) {
  if (step.gesture) beat.appendChild(gestureLine(step.gesture));
  step.lines.forEach(line => {
    beat.appendChild(dialogueBubble(line.speaker, line.jp));
    const en = document.createElement("p");
    en.className = "en-line";
    en.textContent = line.en;
    beat.appendChild(en);
    const listenBtn = document.createElement("button");
    listenBtn.className = "audio-btn inline";
    listenBtn.innerHTML = `<span class="icon">🔊</span> Listen`;
    listenBtn.addEventListener("click", () => speakJa(line.audio));
    beat.appendChild(listenBtn);
  });

  const prompt = document.createElement("p");
  prompt.className = "story-line";
  prompt.textContent = step.prompt;
  beat.appendChild(prompt);

  beat.appendChild(primaryButton("Continue", goNext));
}

function renderSequenceAssembly(beat, step) {
  const prompt = document.createElement("p");
  prompt.className = "story-prompt";
  prompt.textContent = step.prompt;
  beat.appendChild(prompt);

  const strip = document.createElement("div");
  strip.className = "assembled-strip";
  beat.appendChild(strip);

  const bank = document.createElement("div");
  bank.className = "chip-bank";
  beat.appendChild(bank);

  const feedbackHost = document.createElement("div");
  beat.appendChild(feedbackHost);

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
    feedbackHost.innerHTML = "";
    const isCorrect = JSON.stringify(assembled) === JSON.stringify(step.correctOrder);
    const line = document.createElement("p");
    line.className = "story-line";

    if (isCorrect) {
      line.textContent = "Perfect — that's your self-introduction.";
      feedbackHost.appendChild(line);
      feedbackHost.appendChild(buildPracticeWidget(step.pieces.map(resolveText).join(" ")));
      feedbackHost.appendChild(primaryButton("Continue", goNext));
    } else {
      line.textContent = step.retryLabel + ".";
      feedbackHost.appendChild(line);
      const resetBar = document.createElement("div");
      resetBar.className = "continue-bar";
      const resetBtn = document.createElement("button");
      resetBtn.className = "btn-primary";
      resetBtn.textContent = "Try again";
      resetBtn.addEventListener("click", () => {
        assembled = [];
        feedbackHost.innerHTML = "";
        renderStrip();
        renderBank();
      });
      resetBar.appendChild(resetBtn);
      feedbackHost.appendChild(resetBar);
    }
  }

  renderStrip();
  renderBank();
}

function renderBinaryChoice(beat, step) {
  const prompt = document.createElement("p");
  prompt.className = "story-prompt";
  prompt.textContent = step.prompt;
  beat.appendChild(prompt);

  const choices = document.createElement("div");
  choices.className = "choice-list";

  step.options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.className = "choice-pill";
    btn.textContent = opt;
    btn.addEventListener("click", () => {
      [...choices.children].forEach(b => b.disabled = true);
      const correct = i === step.correctIndex;
      if (correct) btn.classList.add("correct");
      else {
        btn.classList.add("chosen-wrong");
        choices.children[step.correctIndex].classList.add("correct");
      }
      revealAfterChoice(beat, step, correct);
    });
    choices.appendChild(btn);
  });
  beat.appendChild(choices);
}

function renderEnd(beat, step) {
  if (step.gesture) beat.appendChild(gestureLine(step.gesture));
  const p = document.createElement("p");
  p.className = "narration";
  p.textContent = step.text;
  beat.appendChild(p);

  const note = document.createElement("p");
  note.className = "story-line muted";
  note.textContent = "Prototype ends here — Scenes 6–13 continue the story on Day 2 and beyond.";
  beat.appendChild(note);
}

render();
