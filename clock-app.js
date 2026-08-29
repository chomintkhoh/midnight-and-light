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

const state = {
  page:"read",
  difficulty:"mixed",
  answerMode:"type",
  worksheet:[],
  history:{ oclock:[], every10:[], every5:[], minutes1to10:[], mixed:[] },
  typedChecked:false,
  setClock:{
    promptType:"digital",
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

  const center = document.createElementNS(NS, "circle");
  center.setAttribute("cx", cx); center.setAttribute("cy", cy); center.setAttribute("r", 5.5);
  center.setAttribute("fill", "#F4F1EA");
  svg.appendChild(center);

  let angles = { hour:0, minute:0 };
  let activeHand = "minute";
  let dragging = false;
  let locked = false;

  const setHand = (hand, deg, emit = false) => {
    const normalized = ((deg % 360) + 360) % 360;
    angles[hand] = normalized;
    (hand === "hour" ? hourHand : minuteHand)
      .setAttribute("transform", `rotate(${normalized} ${cx} ${cy})`);
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
    svg.style.cursor = "grab";
    svg.addEventListener("pointerdown", evt => {
      if (locked) return;
      dragging = true;
      svg.style.cursor = "grabbing";
      svg.setPointerCapture(evt.pointerId);
      setHand(activeHand, pointToAngle(evt), true);
    });
    svg.addEventListener("pointermove", evt => {
      if (!dragging || locked) return;
      setHand(activeHand, pointToAngle(evt), true);
    });
    const stop = () => {
      dragging = false;
      svg.style.cursor = locked ? "default" : "grab";
    };
    svg.addEventListener("pointerup", stop);
    svg.addEventListener("pointercancel", stop);
  }

  return {
    svg,
    setStatic(h, m) { setHand("hour", h); setHand("minute", m); },
    setActiveHand(hand) { activeHand = hand; },
    getActiveHand() { return activeHand; },
    nudge(hand, amount) {
      if (locked) return;
      setHand(hand, angles[hand] + amount, true);
    },
    getAngles() { return {...angles}; },
    setLocked(value) { locked = Boolean(value); svg.style.cursor = locked ? "default" : "grab"; }
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
  const instruction = createEl("div", "instruction", "Look at the clock and write the time in Japanese.");
  toolbar.appendChild(instruction);

  const row1 = createEl("div", "toolbar-row");
  row1.appendChild(createEl("div", "toolbar-label", "Choose how you want to answer."));
  const answerSeg = createEl("div", "segmented");

  [["write","Write by Hand"],["type","Type"]].forEach(([id,label]) => {
    const b = createEl("button", `seg-btn ${state.answerMode === id ? "active" : ""}`, label);
    b.type = "button";
    b.addEventListener("click", () => {
      state.answerMode = id;
      state.typedChecked = false;
      renderReadPage();
    });
    answerSeg.appendChild(b);
  });
  row1.appendChild(answerSeg);
  toolbar.appendChild(row1);

  const row2 = createEl("div", "toolbar-row");
  row2.appendChild(createEl("div", "toolbar-label", "Minute pattern"));
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
  row2.appendChild(modeGrid);
  toolbar.appendChild(row2);
  panel.appendChild(toolbar);

  const grid = createEl("div", "worksheet-grid");
  const cards = [];

  state.worksheet.forEach((time, index) => {
    const card = createEl("article", "question-card");
    card.dataset.index = String(index);
    card.appendChild(createEl("div", "q-number", `Question ${index + 1}`));

    const clockWrap = createEl("div", "clock-wrap");
    const clock = buildClockSVG();
    clock.setStatic(hourAngle(time.hour12, time.minute), minuteAngle(time.minute));
    clockWrap.appendChild(clock.svg);
    card.appendChild(clockWrap);

    if (state.answerMode === "type") {
      const input = createEl("input", "answer-input");
      input.type = "text";
      input.autocomplete = "off";
      input.spellcheck = false;
      input.placeholder = "e.g. はちじ ごふん";
      input.setAttribute("aria-label", `Answer for question ${index + 1}`);
      card.appendChild(input);
      card.appendChild(createEl("div", "feedback"));
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
      initDrawingCanvas(canvas);
    }

    cards.push(card);
    grid.appendChild(card);
  });

  panel.appendChild(grid);

  if (state.answerMode === "write") {
    const note = createEl("p", "write-note",
      "Handwriting stays on this page for visual checking. Automatic handwriting recognition is not enabled in this version.");
    panel.appendChild(note);
  }

  const actions = createEl("div", "actions");

  if (state.answerMode === "type") {
    const check = createEl("button", "btn primary", "Check Answers");
    check.type = "button";
    check.addEventListener("click", () => checkWorksheet(cards));
    actions.appendChild(check);
  } else {
    const clearAll = createEl("button", "btn", "Clear All");
    clearAll.type = "button";
    clearAll.addEventListener("click", () => {
      panel.querySelectorAll("canvas").forEach(clearCanvas);
    });
    actions.appendChild(clearAll);
  }

  const fresh = createEl("button", "btn", "New Questions");
  fresh.type = "button";
  fresh.addEventListener("click", () => {
    generateWorksheet();
    renderReadPage();
  });
  actions.appendChild(fresh);

  panel.appendChild(actions);

  const score = createEl("div", "score-box hidden");
  score.id = "worksheetScore";
  panel.appendChild(score);

  app.appendChild(panel);
}

function checkWorksheet(cards) {
  let score = 0;
  cards.forEach((card, index) => {
    card.classList.remove("correct", "incorrect");
    card.querySelectorAll(".stamp,.fallback-stamp").forEach(x => x.remove());

    const input = card.querySelector(".answer-input");
    const feedback = card.querySelector(".feedback");
    const time = state.worksheet[index];
    const correct = checkTypedAnswer(input.value, time);

    if (correct) {
      score++;
      card.classList.add("correct");
      feedback.innerHTML = `<strong>Correct!</strong>`;
      attachStamp(card);
    } else {
      card.classList.add("incorrect");
      feedback.innerHTML = `<strong>Check this one.</strong><span class="answer-jp">${time.japaneseReading}</span>`;
    }
  });

  const scoreBox = document.getElementById("worksheetScore");
  scoreBox.classList.remove("hidden");
  scoreBox.innerHTML = `Your Score<div class="big">${score} / ${QUESTIONS_PER_WORKSHEET}</div>`;
  state.typedChecked = true;
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

  const row1 = createEl("div", "toolbar-row");
  row1.appendChild(createEl("div", "toolbar-label", "Question display"));
  const promptSeg = createEl("div", "segmented");
  [["digital","Digital Time"],["reading","Japanese Reading"]].forEach(([id,label]) => {
    const b = createEl("button", `seg-btn ${state.setClock.promptType === id ? "active" : ""}`, label);
    b.type = "button";
    b.addEventListener("click", () => {
      state.setClock.promptType = id;
      renderSetPage();
    });
    promptSeg.appendChild(b);
  });
  row1.appendChild(promptSeg);
  toolbar.appendChild(row1);

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
    state.setClock.promptType === "digital" ? time.digitalTime : time.japaneseReading
  ));

  const tip = createEl("p", "write-note",
    "Choose Hour Hand or Minute Hand, then drag on the clock. You can also use the − / + buttons for precise adjustment.");
  promptCard.appendChild(tip);

  const handSeg = createEl("div", "segmented");
  const hourSelect = createEl("button", "seg-btn", "Hour Hand");
  const minuteSelect = createEl("button", "seg-btn active", "Minute Hand");
  hourSelect.type = minuteSelect.type = "button";
  handSeg.append(hourSelect, minuteSelect);
  promptCard.appendChild(handSeg);

  const handControls = createEl("div", "hand-controls");
  handControls.innerHTML = `
    <div class="hand-row">
      <div class="label">Hour Hand</div>
      <button class="round-btn" type="button" data-nudge="hour:-1" aria-label="Move hour hand backward">−</button>
      <button class="round-btn" type="button" data-nudge="hour:1" aria-label="Move hour hand forward">+</button>
    </div>
    <div class="hand-row">
      <div class="label">Minute Hand</div>
      <button class="round-btn" type="button" data-nudge="minute:-1" aria-label="Move minute hand backward">−</button>
      <button class="round-btn" type="button" data-nudge="minute:1" aria-label="Move minute hand forward">+</button>
    </div>`;
  promptCard.appendChild(handControls);

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
  clock.setActiveHand("minute");
  state.setClock.clock = clock;
  state.setClock.locked = false;
  clockWrap.appendChild(clock.svg);
  clockPanel.appendChild(clockWrap);

  hourSelect.addEventListener("click", () => {
    clock.setActiveHand("hour");
    hourSelect.classList.add("active");
    minuteSelect.classList.remove("active");
  });
  minuteSelect.addEventListener("click", () => {
    clock.setActiveHand("minute");
    minuteSelect.classList.add("active");
    hourSelect.classList.remove("active");
  });

  handControls.querySelectorAll("[data-nudge]").forEach(btn => {
    btn.addEventListener("click", () => {
      const [hand, direction] = btn.dataset.nudge.split(":");
      const step = hand === "minute" ? 6 : 1;
      clock.nudge(hand, Number(direction) * step);
    });
  });

  check.addEventListener("click", () => {
    if (state.setClock.locked) return;
    const angles = clock.getAngles();
    const correct = checkClockAnswer(angles.hour, angles.minute, time);
    state.setClock.locked = true;
    clock.setLocked(true);
    check.disabled = true;
    handControls.querySelectorAll("button").forEach(b => b.disabled = true);
    hourSelect.disabled = minuteSelect.disabled = true;

    if (correct) {
      feedback.innerHTML = `<strong>Correct!</strong><span class="answer-jp">${time.japaneseReading} (${time.digitalTime})</span>`;
      attachStamp(clockPanel);
    } else {
      feedback.innerHTML = `<strong>Not quite.</strong><span class="answer-jp">Correct time: ${time.japaneseReading} (${time.digitalTime})</span>`;
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
