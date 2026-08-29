import {
  buildTime, generateTimePool, pickQuestionTimes, shuffle,
  checkTypedAnswer, hourAngle, minuteAngle, checkClockAnswer
} from "./clock-logic.js";

const app = document.getElementById("app");
const QUESTIONS_PER_SESSION = 10;
const QUESTION_TYPES = ["typeReading", "setFromDigital", "setFromReading"];
const LAYOUTS = ["A", "B", "C"];

const state = { mode: null, times: [], index: 0, score: 0, results: [] };

/* ---------- SVG analog clock ---------- */

function buildClockSVG({ interactive }) {
  const NS = "http://www.w3.org/2000/svg";
  const size = 240;
  const cx = size / 2, cy = size / 2, r = size / 2 - 10;
  const svg = document.createElementNS(NS, "svg");
  svg.setAttribute("viewBox", `0 0 ${size} ${size}`);
  svg.setAttribute("width", size);
  svg.setAttribute("height", size);

  const face = document.createElementNS(NS, "circle");
  face.setAttribute("cx", cx); face.setAttribute("cy", cy); face.setAttribute("r", r);
  face.setAttribute("fill", "rgba(244,241,234,0.06)");
  face.setAttribute("stroke", "rgba(217,196,142,0.5)");
  face.setAttribute("stroke-width", "2");
  svg.appendChild(face);

  for (let n = 1; n <= 12; n++) {
    const angle = (n * 30 - 90) * Math.PI / 180;
    const tx = cx + Math.cos(angle) * (r - 22);
    const ty = cy + Math.sin(angle) * (r - 22);
    const text = document.createElementNS(NS, "text");
    text.setAttribute("x", tx); text.setAttribute("y", ty + 6);
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("font-size", "16");
    text.setAttribute("fill", "#F4F1EA");
    text.textContent = n;
    svg.appendChild(text);
  }

  const hourHand = document.createElementNS(NS, "line");
  hourHand.setAttribute("x1", cx); hourHand.setAttribute("y1", cy);
  hourHand.setAttribute("x2", cx); hourHand.setAttribute("y2", cy - r * 0.5);
  hourHand.setAttribute("stroke", "#D9C48E"); hourHand.setAttribute("stroke-width", "6");
  hourHand.setAttribute("stroke-linecap", "round");
  hourHand.dataset.hand = "hour";

  const minuteHand = document.createElementNS(NS, "line");
  minuteHand.setAttribute("x1", cx); minuteHand.setAttribute("y1", cy);
  minuteHand.setAttribute("x2", cx); minuteHand.setAttribute("y2", cy - r * 0.8);
  minuteHand.setAttribute("stroke", "#B6A9DA"); minuteHand.setAttribute("stroke-width", "4");
  minuteHand.setAttribute("stroke-linecap", "round");
  minuteHand.dataset.hand = "minute";

  svg.appendChild(hourHand);
  svg.appendChild(minuteHand);

  const center = document.createElementNS(NS, "circle");
  center.setAttribute("cx", cx); center.setAttribute("cy", cy); center.setAttribute("r", 5);
  center.setAttribute("fill", "#F4F1EA");
  svg.appendChild(center);

  const setHand = (hand, deg) => {
    (hand === "hour" ? hourHand : minuteHand).setAttribute("transform", `rotate(${deg} ${cx} ${cy})`);
  };

  let angles = { hour: 0, minute: 0 };
  let activeHand = "hour";

  if (interactive) {
    svg.style.cursor = "pointer";
    const pointToAngle = (evt) => {
      const rect = svg.getBoundingClientRect();
      const px = (evt.clientX - rect.left) / rect.width * size;
      const py = (evt.clientY - rect.top) / rect.height * size;
      let deg = Math.atan2(px - cx, -(py - cy)) * 180 / Math.PI;
      if (deg < 0) deg += 360;
      return deg;
    };
    let dragging = false;
    svg.addEventListener("pointerdown", (evt) => {
      dragging = true;
      svg.setPointerCapture(evt.pointerId);
      angles[activeHand] = pointToAngle(evt);
      setHand(activeHand, angles[activeHand]);
    });
    svg.addEventListener("pointermove", (evt) => {
      if (!dragging) return;
      angles[activeHand] = pointToAngle(evt);
      setHand(activeHand, angles[activeHand]);
    });
    svg.addEventListener("pointerup", () => { dragging = false; });
    svg.addEventListener("pointercancel", () => { dragging = false; });
  }

  return {
    svg,
    setStatic(hAngle, mAngle) { setHand("hour", hAngle); setHand("minute", mAngle); angles = { hour: hAngle, minute: mAngle }; },
    setActiveHand(h) { activeHand = h; },
    getAngles() { return angles; }
  };
}

/* ---------- Screens ---------- */

function renderModeSelect() {
  app.innerHTML = "";
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <h1>Japanese Clock Practice</h1>
    <div class="subtitle">とけいの れんしゅう — Choose a practice mode to begin.</div>
    <div class="mode-grid" id="modeGrid"></div>
  `;
  app.appendChild(card);

  const modes = [
    { id: "oclock", label: "🕐 O'clock" },
    { id: "every10", label: "🕑 Every 10 Minutes" },
    { id: "every5", label: "🕒 Every 5 Minutes" },
    { id: "minutes1to10", label: "⏱ Minutes 1–10" },
    { id: "mixed", label: "🎲 Mixed" }
  ];
  const grid = card.querySelector("#modeGrid");
  modes.forEach(m => {
    const btn = document.createElement("button");
    btn.className = "mode-btn";
    btn.textContent = m.label;
    btn.addEventListener("click", () => startSession(m.id));
    grid.appendChild(btn);
  });
}

function startSession(mode) {
  state.mode = mode;
  state.times = pickQuestionTimes(mode, QUESTIONS_PER_SESSION);
  state.index = 0;
  state.score = 0;
  state.results = [];
  renderQuestion();
}

function renderQuestion() {
  const time = state.times[state.index];
  const qType = shuffle(QUESTION_TYPES)[0];
  const layout = shuffle(LAYOUTS)[0];

  app.innerHTML = "";
  const card = document.createElement("div");
  card.className = `card layout-${layout}`;
  card.innerHTML = `<div class="progress">Question ${state.index + 1} / ${QUESTIONS_PER_SESSION}</div>`;
  app.appendChild(card);

  if (qType === "typeReading") {
    const prompt = document.createElement("div");
    prompt.className = "prompt";
    prompt.textContent = "なんじですか？";
    card.appendChild(prompt);

    const clockWrap = document.createElement("div");
    clockWrap.className = "clock-wrap";
    const clock = buildClockSVG({ interactive: false });
    clock.setStatic(hourAngle(time.hour12, time.minute), minuteAngle(time.minute));
    clockWrap.appendChild(clock.svg);
    card.appendChild(clockWrap);

    const input = document.createElement("input");
    input.className = "answer-input";
    input.placeholder = "はちじ ごふんです";
    card.appendChild(input);

    const btn = document.createElement("button");
    btn.className = "btn-primary";
    btn.textContent = "チェック";
    btn.addEventListener("click", () => {
      const correct = checkTypedAnswer(input.value, time);
      showFeedback(card, correct, time);
      input.disabled = true; btn.disabled = true;
    });
    card.appendChild(btn);
  } else {
    // setFromDigital or setFromReading
    if (qType === "setFromDigital") {
      const digital = document.createElement("div");
      digital.className = "jp-display";
      digital.textContent = time.digitalTime;
      card.appendChild(digital);
    } else {
      const reading = document.createElement("div");
      reading.className = "jp-display";
      reading.textContent = time.japaneseReading;
      card.appendChild(reading);
    }

    const handSelector = document.createElement("div");
    handSelector.className = "hand-selector";
    handSelector.innerHTML = `<button class="hand-btn active" data-hand="hour">時 Hour</button><button class="hand-btn" data-hand="minute">分 Minute</button>`;
    card.appendChild(handSelector);

    const clockWrap = document.createElement("div");
    clockWrap.className = "clock-wrap";
    const clock = buildClockSVG({ interactive: true });
    clock.setStatic(0, 0);
    clockWrap.appendChild(clock.svg);
    card.appendChild(clockWrap);

    handSelector.querySelectorAll(".hand-btn").forEach(hb => {
      hb.addEventListener("click", () => {
        handSelector.querySelectorAll(".hand-btn").forEach(x => x.classList.remove("active"));
        hb.classList.add("active");
        clock.setActiveHand(hb.dataset.hand);
      });
    });

    const btn = document.createElement("button");
    btn.className = "btn-primary";
    btn.textContent = "チェック";
    btn.addEventListener("click", () => {
      const angles = clock.getAngles();
      const correct = checkClockAnswer(angles.hour, angles.minute, time);
      showFeedback(card, correct, time);
      btn.disabled = true;
      handSelector.querySelectorAll(".hand-btn").forEach(x => x.disabled = true);
    });
    card.appendChild(btn);
  }

  state.results.push({ time, qType, correct: null }); // filled in on check
}

function showFeedback(card, correct, time) {
  if (correct) state.score++;
  state.results[state.results.length - 1].correct = correct;

  const fb = document.createElement("div");
  fb.className = `feedback ${correct ? "correct" : "incorrect"}`;
  fb.innerHTML = `
    <div>${correct ? "せいかい！ 🎉" : "おしい！"}</div>
    <div class="answer-line">${time.japaneseReading}です。 (${time.digitalTime})</div>
  `;
  card.appendChild(fb);

  const nextBtn = document.createElement("button");
  nextBtn.className = "btn-primary";
  nextBtn.textContent = state.index + 1 < QUESTIONS_PER_SESSION ? "つぎへ →" : "けっか を みる";
  nextBtn.addEventListener("click", () => {
    state.index++;
    if (state.index < QUESTIONS_PER_SESSION) renderQuestion();
    else renderResults();
  });
  card.appendChild(nextBtn);
}

function renderResults() {
  app.innerHTML = "";
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <div class="score-hero">
      <div>10 Questions Completed!</div>
      <div class="big">${state.score} / ${QUESTIONS_PER_SESSION}</div>
    </div>
  `;
  const btn = document.createElement("button");
  btn.className = "btn-primary";
  btn.textContent = "Play Again";
  btn.addEventListener("click", renderModeSelect);
  card.appendChild(btn);
  app.appendChild(card);
}

renderModeSelect();
