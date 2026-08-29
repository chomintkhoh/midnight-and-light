import {
  buildTime,
  pickQuestionTimes,
  timeKey,
  checkTypedAnswer,
  hourAngle,
  minuteAngle,
  checkClockAnswer
} from "./clock-logic.js";

const app = document.getElementById("app");
const readTab = document.getElementById("readTab");
const setTab = document.getElementById("setTab");

const QUESTIONS_PER_WORKSHEET = 9;
const HISTORY_DEPTH = 4;
const STAMP_SRC = "./assets/great-stamp.png";
const SUCCESS_SOUND_SRC = "./assets/success-stamp.mp3";
const SUCCESS_SOUND_MIN_SCORE = 5;

const successSound = new Audio(SUCCESS_SOUND_SRC);
successSound.preload = "auto";
successSound.volume = 0.8;

function playSuccessSound() {
  successSound.pause();
  successSound.currentTime = 0;
  successSound.play().catch(() => {
    // Some browsers may block audio if playback is not directly triggered by a user action.
  });
}

const state = {
  page:"read",
  difficulty:"mixed",
  worksheet:[],
  history:{ oclock:[], every10:[], every5:[], minutes1to10:[], mixed:[] },
  typedChecked:false,
  setClock:{
    current:null,
    lastKeys:[],
    clock:null,
    locked:false
  }
};

const MODES = [
  ["oclock","O'clock"],
  ["every10","Every 10 Minutes"],
  ["every5","Every 5 Minutes"],
  ["minutes1to10","Minutes 1–10"],
  ["mixed","Mixed"]
];

function setPage(page) {
  state.page = page;
  readTab.setAttribute("aria-selected", String(page === "read"));
  setTab.setAttribute("aria-selected", String(page === "set"));
  if (page === "read") renderReadPage();
  else renderSetPage();
}

readTab.addEventListener("click", () => setPage("read"));
setTab.addEventListener("click", () => setPage("set"));

function createEl(tag, className, text) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text !== undefined) el.textContent = text;
  return el;
}

function buildClockSVG({ interactive = false, onChange = null } = {}) {
  const NS = "http://www.w3.org/2000/svg";
  const size = 240;
  const cx = size / 2, cy = size / 2, r = size / 2 - 10;
  const svg = document.createElementNS(NS, "svg");
  svg.setAttribute("viewBox", `0 0 ${size} ${size}`);
  svg.setAttribute("class", "clock-svg");
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", interactive ? "Interactive analog clock" : "Analog clock");

  const face = document.createElementNS(NS, "circle");
  face.setAttribute("cx", cx); face.setAttribute("cy", cy); face.setAttribute("r", r);
  face.setAttribute("fill", "rgba(244,241,234,0.06)");
  face.setAttribute("stroke", "rgba(217,196,142,0.55)");
  face.setAttribute("stroke-width", "2");
  svg.appendChild(face);

  for (let i = 0; i < 60; i++) {
    const angle = i * 6 * Math.PI / 180;
    const major = i % 5 === 0;
    const outer = r - 6;
    const inner = r - (major ? 14 : 9);
    const tick = document.createElementNS(NS, "line");
    tick.setAttribute("x1", cx + Math.sin(angle) * inner);
    tick.setAttribute("y1", cy - Math.cos(angle) * inner);
    tick.setAttribute("x2", cx + Math.sin(angle) * outer);
    tick.setAttribute("y2", cy - Math.cos(angle) * outer);
    tick.setAttribute("stroke", major ? "rgba(217,196,142,.75)" : "rgba(244,241,234,.22)");
    tick.setAttribute("stroke-width", major ? "2" : "1");
    svg.appendChild(tick);
  }

  for (let n = 1; n <= 12; n++) {
    const angle = (n * 30 - 90) * Math.PI / 180;
    const tx = cx + Math.cos(angle) * (r - 29);
    const ty = cy + Math.sin(angle) * (r - 29);
    const text = document.createElementNS(NS, "text");
    text.setAttribute("x", tx); text.setAttribute("y", ty + 7);
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("font-size", "19");
    text.setAttribute("font-weight", "600");
    text.setAttribute("fill", "#F4F1EA");
    text.textContent = n;
    svg.appendChild(text);
  }

  const hourHand = document.createElementNS(NS, "line");
  hourHand.setAttribute("x1", cx); hourHand.setAttribute("y1", cy);
  hourHand.setAttribute("x2", cx); hourHand.setAttribute("y2", cy - r * 0.5);
  hourHand.setAttribute("stroke", "#D9C48E");
  hourHand.setAttribute("stroke-width", "7");
  hourHand.setAttribute("stroke-linecap", "round");

  const minuteHand = document.createElementNS(NS, "line");
  minuteHand.setAttribute("x1", cx); minuteHand.setAttribute("y1", cy);
  minuteHand.setAttribute("x2", cx); minuteHand.setAttribute("y2", cy - r * 0.78);
  minuteHand.setAttribute("stroke", "#B6A9DA");
  minuteHand.setAttribute("stroke-width", "4.5");
  minuteHand.setAttribute("stroke-linecap", "round");

  svg.appendChild(hourHand);
  svg.appendChild(minuteHand);

  // Wide invisible hit areas let students drag either hand directly.
  const hourHit = document.createElementNS(NS, "line");
  hourHit.setAttribute("x1", cx); hourHit.setAttribute("y1", cy);
  hourHit.setAttribute("x2", cx); hourHit.setAttribute("y2", cy - r * 0.5);
  hourHit.setAttribute("stroke", "transparent");
  hourHit.setAttribute("stroke-width", "28");
  hourHit.setAttribute("stroke-linecap", "round");
  hourHit.style.cursor = "grab";

  const minuteHit = document.createElementNS(NS, "line");
  minuteHit.setAttribute("x1", cx); minuteHit.setAttribute("y1", cy);
  minuteHit.setAttribute("x2", cx); minuteHit.setAttribute("y2", cy - r * 0.78);
  minuteHit.setAttribute("stroke", "transparent");
  minuteHit.setAttribute("stroke-width", "24");
  minuteHit.setAttribute("stroke-linecap", "round");
  minuteHit.style.cursor = "grab";

  svg.appendChild(hourHit);
  svg.appendChild(minuteHit);

  const center = document.createElementNS(NS, "circle");
  center.setAttribute("cx", cx); center.setAttribute("cy", cy); center.setAttribute("r", 5.5);
  center.setAttribute("fill", "#F4F1EA");
  svg.appendChild(center);

  let angles = { hour:0, minute:0 };
  let draggingHand = null;
  let locked = false;

  const setHand = (hand, deg, emit = false) => {
    const normalized = ((deg % 360) + 360) % 360;
    angles[hand] = normalized;
    const visible = hand === "hour" ? hourHand : minuteHand;
    const hit = hand === "hour" ? hourHit : minuteHit;
    visible.setAttribute("transform", `rotate(${normalized} ${cx} ${cy})`);
    hit.setAttribute("transform", `rotate(${normalized} ${cx} ${cy})`);
    if (emit && onChange) onChange({...angles});
  };

  const pointToAngle = evt => {
    const rect = svg.getBoundingClientRect();
    const px = (evt.clientX - rect.left) / rect.width * size;
    const py = (evt.clientY - rect.top) / rect.height * size;
    let deg = Math.atan2(px - cx, -(py - cy)) * 180 / Math.PI;
    if (deg < 0) deg += 360;
    return deg;
  };

  if (interactive) {
    svg.style.touchAction = "none";

    const startDrag = (hand, evt) => {
      if (locked) return;
      evt.preventDefault();
      evt.stopPropagation();
      draggingHand = hand;
      const hit = hand === "hour" ? hourHit : minuteHit;
      hit.style.cursor = "grabbing";
      svg.setPointerCapture(evt.pointerId);
      setHand(hand, pointToAngle(evt), true);
    };

    hourHit.addEventListener("pointerdown", evt => startDrag("hour", evt));
    minuteHit.addEventListener("pointerdown", evt => startDrag("minute", evt));

    svg.addEventListener("pointermove", evt => {
      if (!draggingHand || locked) return;
      setHand(draggingHand, pointToAngle(evt), true);
    });

    const stop = () => {
      hourHit.style.cursor = locked ? "default" : "grab";
      minuteHit.style.cursor = locked ? "default" : "grab";
      draggingHand = null;
    };
    svg.addEventListener("pointerup", stop);
    svg.addEventListener("pointercancel", stop);
  }

  return {
    svg,
    setStatic(h, m) { setHand("hour", h); setHand("minute", m); },
    getAngles() { return {...angles}; },
    setLocked(value) {
      locked = Boolean(value);
      hourHit.style.cursor = locked ? "default" : "grab";
      minuteHit.style.cursor = locked ? "default" : "grab";
    }
  };
}

function attachStamp(card) {
  const img = document.createElement("img");
  img.className = "stamp";
  img.src = STAMP_SRC;
  img.alt = "Great!";
  img.addEventListener("load", () => img.classList.add("show"), {once:true});

  const fallback = createEl("div", "fallback-stamp", "GREAT!");
  img.addEventListener("error", () => fallback.classList.add("show"), {once:true});

  card.appendChild(img);
  card.appendChild(fallback);
}

function generateWorksheet() {
  const recentSets = state.history[state.difficulty];
  state.worksheet = pickQuestionTimes(state.difficulty, QUESTIONS_PER_WORKSHEET, recentSets);
  recentSets.push(state.worksheet.map(timeKey));
  if (recentSets.length > HISTORY_DEPTH) recentSets.shift();
  state.typedChecked = false;
}

function renderReadPage() {
  if (!state.worksheet.length) generateWorksheet();

  app.innerHTML = "";
  const panel = createEl("div", "panel");

  const toolbar = createEl("div", "toolbar");
  toolbar.appendChild(createEl("div", "instruction", "Look at the clocks and answer in Japanese."));

  const row = createEl("div", "toolbar-row");
  row.appendChild(createEl("div", "toolbar-label", "Minute pattern"));
  const modeGrid = createEl("div", "mode-grid");
  MODES.forEach(([id,label]) => {
    const b = createEl("button", `mode-btn ${state.difficulty === id ? "active" : ""}`, label);
    b.type = "button";
    b.addEventListener("click", () => {
      if (state.difficulty === id) return;
      state.difficulty = id;
      generateWorksheet();
      renderReadPage();
    });
    modeGrid.appendChild(b);
  });
  row.appendChild(modeGrid);
  toolbar.appendChild(row);
  panel.appendChild(toolbar);

  const grid = createEl("div", "worksheet-grid");
  const cards = [];
  const drawingCanvases = [];
  let selectedAnswer = null;

  state.worksheet.forEach((time, index) => {
    const card = createEl("article", "question-card");
    card.dataset.index = String(index);
    card.appendChild(createEl("div", "q-number", `Question ${index + 1}`));

    if (index === 0) card.appendChild(createEl("div", "section-hint", "Match the answers."));
    if (index === 3) card.appendChild(createEl("div", "section-hint", "Type the time in Japanese."));
    if (index === 6) card.appendChild(createEl("div", "section-hint", "Write the time in Japanese."));

    const clockWrap = createEl("div", "clock-wrap");
    const clock = buildClockSVG();
    clock.setStatic(hourAngle(time.hour12, time.minute), minuteAngle(time.minute));
    clockWrap.appendChild(clock.svg);
    card.appendChild(clockWrap);

    if (index < 3) {
      const zone = createEl("div", "drop-zone", "Drop answer here");
      zone.dataset.answer = "";
      zone.tabIndex = 0;
      const assign = answer => {
        if (!answer) return;
        // Return any answer already in this zone to the bank by simply replacing it.
        zone.dataset.answer = answer;
        zone.textContent = answer;
        zone.classList.add("filled");
        selectedAnswer = null;
        document.querySelectorAll(".answer-chip").forEach(c => c.classList.remove("selected"));
      };
      zone.addEventListener("dragover", e => { e.preventDefault(); zone.classList.add("drag-over"); });
      zone.addEventListener("dragleave", () => zone.classList.remove("drag-over"));
      zone.addEventListener("drop", e => {
        e.preventDefault();
        zone.classList.remove("drag-over");
        assign(e.dataTransfer.getData("text/plain"));
      });
      zone.addEventListener("click", () => assign(selectedAnswer));
      card.appendChild(zone);
      card.appendChild(createEl("div", "feedback"));
    } else if (index < 6) {
      const answerZone = createEl("div", "answer-zone");
      const input = createEl("input", "answer-input");
      input.type = "text";
      input.autocomplete = "off";
      input.spellcheck = false;
      input.placeholder = "e.g. はちじ ごふん";
      input.setAttribute("aria-label", `Answer for question ${index + 1}`);
      answerZone.appendChild(input);
      answerZone.appendChild(createEl("div", "feedback"));
      card.appendChild(answerZone);
    } else {
      const box = createEl("div", "writing-box");
      const canvas = createEl("canvas", "writing-canvas");
      canvas.setAttribute("aria-label", `Handwriting area for question ${index + 1}`);
      box.appendChild(canvas);
      card.appendChild(box);
      const tools = createEl("div", "canvas-tools");
      const clear = createEl("button", "small-btn", "Clear");
      clear.type = "button";
      clear.addEventListener("click", () => clearCanvas(canvas));
      tools.appendChild(clear);
      card.appendChild(tools);
      card.appendChild(createEl("div", "feedback handwriting-feedback"));
      drawingCanvases.push(canvas);
    }

    cards.push(card);
    grid.appendChild(card);
  });

  panel.appendChild(grid);

  // One shared answer bank for Questions 1–3. Shuffle display order each render.
  const bank = createEl("div", "answer-bank-wrap");
  bank.appendChild(createEl("div", "answer-bank-title", "Answer Bank"));
  const bankInner = createEl("div", "answer-bank");
  const bankAnswers = state.worksheet.slice(0,3).map(t => t.japaneseReading).sort(() => Math.random() - 0.5);
  bankAnswers.forEach(answer => {
    const chip = createEl("button", "answer-chip", answer);
    chip.type = "button";
    chip.draggable = true;
    chip.addEventListener("dragstart", e => e.dataTransfer.setData("text/plain", answer));
    chip.addEventListener("click", () => {
      selectedAnswer = answer;
      bankInner.querySelectorAll(".answer-chip").forEach(c => c.classList.toggle("selected", c === chip));
    });
    bankInner.appendChild(chip);
  });
  bank.appendChild(bankInner);
  bank.appendChild(createEl("div", "bank-tip", "Drag an answer to a clock, or tap an answer and then tap a box."));
  // Place the shared bank immediately after Questions 1–3.
  grid.insertBefore(bank, cards[3]);

  panel.appendChild(createEl("p", "write-note", "For Questions 7–9, compare your handwriting with the answer after checking."));

  const actions = createEl("div", "actions");
  const check = createEl("button", "btn primary", "Check Answers");
  check.type = "button";
  check.addEventListener("click", () => checkWorksheet(cards));
  actions.appendChild(check);

  const clearAll = createEl("button", "btn", "Clear Handwriting");
  clearAll.type = "button";
  clearAll.addEventListener("click", () => panel.querySelectorAll("canvas").forEach(clearCanvas));
  actions.appendChild(clearAll);

  const fresh = createEl("button", "btn", "New Questions");
  fresh.type = "button";
  fresh.addEventListener("click", () => { generateWorksheet(); renderReadPage(); });
  actions.appendChild(fresh);
  panel.appendChild(actions);

  const score = createEl("div", "score-box hidden");
  score.id = "worksheetScore";
  panel.appendChild(score);
  app.appendChild(panel);

  if (drawingCanvases.length) requestAnimationFrame(() => drawingCanvases.forEach(initDrawingCanvas));
}

function checkWorksheet(cards) {
  let score = 0;
  const AUTO_GRADED = 6;

  cards.forEach((card, index) => {
    card.classList.remove("correct", "incorrect");
    card.querySelectorAll(".stamp,.fallback-stamp").forEach(x => x.remove());
    const time = state.worksheet[index];
    const feedback = card.querySelector(".feedback");

    if (index < 3) {
      const zone = card.querySelector(".drop-zone");
      const correct = checkTypedAnswer(zone.dataset.answer || "", time);
      if (correct) {
        score++;
        card.classList.add("correct");
        feedback.innerHTML = `<strong>Correct!</strong>`;
        attachStamp(zone);
      } else {
        card.classList.add("incorrect");
        feedback.innerHTML = `<strong>Check this one.</strong><span class="answer-jp">${time.japaneseReading}</span>`;
      }
    } else if (index < 6) {
      const input = card.querySelector(".answer-input");
      const correct = checkTypedAnswer(input.value, time);
      if (correct) {
        score++;
        card.classList.add("correct");
        feedback.innerHTML = `<strong>Correct!</strong>`;
        attachStamp(card.querySelector(".answer-zone"));
      } else {
        card.classList.add("incorrect");
        feedback.innerHTML = `<strong>Check this one.</strong><span class="answer-jp">${time.japaneseReading}</span>`;
      }
    } else {
      feedback.innerHTML = `<strong>Compare your writing:</strong><span class="answer-jp">${time.japaneseReading}</span>`;
    }
  });

  const scoreBox = document.getElementById("worksheetScore");
  scoreBox.classList.remove("hidden");
  scoreBox.innerHTML = `Auto-checked Score<div class="big">${score} / ${AUTO_GRADED}</div><div class="score-note">Questions 7–9 are for handwriting practice and self-checking.</div>`;
  if (score >= SUCCESS_SOUND_MIN_SCORE) playSuccessSound();
}

function initDrawingCanvas(canvas) {
  const ctx = canvas.getContext("2d");
  let drawing = false;
  let last = null;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const ratio = Math.max(1, window.devicePixelRatio || 1);
    const snapshot = document.createElement("canvas");
    snapshot.width = canvas.width;
    snapshot.height = canvas.height;
    snapshot.getContext("2d").drawImage(canvas, 0, 0);

    canvas.width = Math.round(rect.width * ratio);
    canvas.height = Math.round(rect.height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#15172a";

    if (snapshot.width && snapshot.height) {
      ctx.drawImage(snapshot, 0, 0, snapshot.width, snapshot.height, 0, 0, rect.width, rect.height);
    }
  }

  resize();

  const point = evt => {
    const r = canvas.getBoundingClientRect();
    return {x:evt.clientX-r.left, y:evt.clientY-r.top};
  };

  canvas.addEventListener("pointerdown", evt => {
    if (evt.pointerType === "mouse" && evt.button !== 0) return;
    evt.preventDefault();
    drawing = true;
    last = point(evt);
    canvas.setPointerCapture(evt.pointerId);
  });

  canvas.addEventListener("pointermove", evt => {
    if (!drawing) return;
    const p = point(evt);
    ctx.beginPath();
    ctx.moveTo(last.x, last.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    last = p;
  });

  const stop = () => { drawing = false; last = null; };
  canvas.addEventListener("pointerup", stop);
  canvas.addEventListener("pointercancel", stop);
}

function clearCanvas(canvas) {
  const ctx = canvas.getContext("2d");
  const rect = canvas.getBoundingClientRect();
  ctx.clearRect(0, 0, rect.width, rect.height);
}

function pickNextSetTime() {
  const recent = state.setClock.lastKeys.map(k => [k]);
  const [time] = pickQuestionTimes(state.difficulty, 1, recent);
  state.setClock.lastKeys.push(timeKey(time));
  if (state.setClock.lastKeys.length > 8) state.setClock.lastKeys.shift();
  state.setClock.current = time;
  return time;
}

function renderSetPage() {
  if (!state.setClock.current) pickNextSetTime();

  app.innerHTML = "";
  const panel = createEl("div", "panel");

  const toolbar = createEl("div", "toolbar");
  toolbar.appendChild(createEl("div", "instruction", "Set the clock to match the time shown."));

  const row2 = createEl("div", "toolbar-row");
  row2.appendChild(createEl("div", "toolbar-label", "Minute pattern"));
  const modeGrid = createEl("div", "mode-grid");
  MODES.forEach(([id,label]) => {
    const b = createEl("button", `mode-btn ${state.difficulty === id ? "active" : ""}`, label);
    b.type = "button";
    b.addEventListener("click", () => {
      state.difficulty = id;
      state.setClock.lastKeys = [];
      pickNextSetTime();
      renderSetPage();
    });
    modeGrid.appendChild(b);
  });
  row2.appendChild(modeGrid);
  toolbar.appendChild(row2);
  panel.appendChild(toolbar);

  const layout = createEl("div", "set-layout");

  const promptCard = createEl("div", "set-prompt-card");
  promptCard.appendChild(createEl("div", "set-prompt-label", "Set the clock to:"));
  const time = state.setClock.current;
  promptCard.appendChild(createEl(
    "div",
    "set-prompt-value",
    time.japaneseReading
  ));

  const tip = createEl("p", "write-note",
    "Move the clock hands to set the time.");
  promptCard.appendChild(tip);

  const feedback = createEl("div", "set-feedback");
  feedback.id = "setFeedback";
  promptCard.appendChild(feedback);

  const actions = createEl("div", "actions");
  const check = createEl("button", "btn primary", "Check Answer");
  const next = createEl("button", "btn", "New Question");
  check.type = next.type = "button";
  actions.append(check, next);
  promptCard.appendChild(actions);

  const clockPanel = createEl("div", "set-prompt-card interactive-clock");
  const clockWrap = createEl("div", "clock-wrap");
  const clock = buildClockSVG({interactive:true});
  clock.setStatic(0, 0);
  state.setClock.clock = clock;
  state.setClock.locked = false;
  clockWrap.appendChild(clock.svg);
  clockPanel.appendChild(clockWrap);



  check.addEventListener("click", () => {
    if (state.setClock.locked) return;
    const angles = clock.getAngles();
    const correct = checkClockAnswer(angles.hour, angles.minute, time);
    state.setClock.locked = true;
    clock.setLocked(true);
    check.disabled = true;
    if (correct) {
      feedback.classList.add("correct-feedback");
      feedback.innerHTML = `<div class="feedback-head"><strong>Correct!</strong></div><span class="answer-jp">${time.japaneseReading}</span>`;
      attachStamp(feedback.querySelector(".feedback-head"));
      playSuccessSound();
    } else {
      feedback.innerHTML = `<strong>Not quite.</strong><span class="answer-jp">${time.japaneseReading}</span>`;
      // Show the correct hand positions after grading.
      clock.setStatic(hourAngle(time.hour12, time.minute), minuteAngle(time.minute));
    }
  });

  next.addEventListener("click", () => {
    pickNextSetTime();
    renderSetPage();
  });

  layout.append(promptCard, clockPanel);
  panel.appendChild(layout);
  app.appendChild(panel);
}

generateWorksheet();
setPage("read");
