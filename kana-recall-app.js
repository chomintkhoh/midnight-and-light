/* ══════════════════════════════════════════════
   Kana Recall Practice — active recall for Hiragana
   Separate, lightweight module. Does not touch worksheet.html /
   worksheet-app.js or experience.html / experience-app.js — the only
   change elsewhere is a single "Test Your Memory" link added to
   experience-app.js's finish() screen.

   The writing-box drawing code below (createCanvasController) is the
   same Pointer Events engine used by the Hiragana worksheet
   (worksheet-app.js): CSS-pixel stroke storage so resizing never loses
   what was drawn, coalesced pointermove events, undo/clear. Trimmed
   here to a single ink colour and no print handling, since this
   activity has neither a pen-colour picker nor a print view.

   No login, no database, no storage — everything lives in memory for
   the current browser session only, per spec.
══════════════════════════════════════════════ */

/* ---------- Centralised kana data ----------
   Add further rows here (t/n/h/m/y/r/w) in the same shape — nothing
   else in this file needs to change. ROW_ORDER controls both the
   range-selector order and what counts as "previously learned" for
   the cumulative review mix. */

const HIRAGANA_ROWS = {
  a: [
    { kana: "あ", romaji: "a" },
    { kana: "い", romaji: "i" },
    { kana: "う", romaji: "u" },
    { kana: "え", romaji: "e" },
    { kana: "お", romaji: "o" }
  ],
  k: [
    { kana: "か", romaji: "ka" },
    { kana: "き", romaji: "ki" },
    { kana: "く", romaji: "ku" },
    { kana: "け", romaji: "ke" },
    { kana: "こ", romaji: "ko" }
  ],
  s: [
    { kana: "さ", romaji: "sa" },
    { kana: "し", romaji: "shi" }, // beginner-correct romanisation — never "si"
    { kana: "す", romaji: "su" },
    { kana: "せ", romaji: "se" },
    { kana: "そ", romaji: "so" }
  ]
};

const ROW_ORDER = ["a", "k", "s"];
const ROW_META = {
  a: { line: "あ　い　う　え　お", note: "Vowels" },
  k: { line: "か　き　く　け　こ", note: "K-row" },
  s: { line: "さ　し　す　せ　そ", note: "S-row" }
};

/* ---------- Small helpers ---------- */

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function randomChoiceAvoiding(pool, avoidKana) {
  if (pool.length === 1) return pool[0];
  let choice;
  let tries = 0;
  do {
    choice = pool[Math.floor(Math.random() * pool.length)];
    tries++;
  } while (choice.kana === avoidKana && tries < 10);
  return choice;
}

// Reorders `items` (shuffling first) so that no two adjacent entries
// share the same key, as far as that's possible given the multiset.
// Used both for "don't show the same kana twice in a row" (key = kana)
// and, in the review round, "don't show the literal same question
// twice in a row" (key = kana + direction).
function shuffleNoAdjacentDup(items, keyFn) {
  let list = shuffle(items);
  for (let pass = 0; pass < 6; pass++) {
    let fixed = true;
    for (let i = 1; i < list.length; i++) {
      if (keyFn(list[i]) === keyFn(list[i - 1])) {
        // find a later item that's safe to swap into this slot
        let swapWith = -1;
        for (let j = i + 1; j < list.length; j++) {
          if (keyFn(list[j]) !== keyFn(list[i - 1]) &&
              (i + 1 >= list.length || keyFn(list[j]) !== keyFn(list[i + 1]))) {
            swapWith = j;
            break;
          }
        }
        if (swapWith !== -1) {
          [list[i], list[swapWith]] = [list[swapWith], list[i]];
          fixed = false;
        }
      }
    }
    if (fixed) break;
  }
  return list;
}

function normalizeAnswer(s) {
  return s.trim().toLowerCase();
}

function rangeLabel(rowKey) {
  const rowIndex = ROW_ORDER.indexOf(rowKey);
  const first = HIRAGANA_ROWS[ROW_ORDER[0]][0].kana;
  const lastRow = HIRAGANA_ROWS[rowKey];
  const last = lastRow[lastRow.length - 1].kana;
  return rowIndex === 0 ? ROW_META.a.line.replace(/　/g, "") : `${first}〜${last}`;
}

/* ---------- Drawing engine (writing box) ----------
   Copied from worksheet-app.js's createCanvasController — same
   coordinate approach (CSS-pixel stroke storage, redraw-from-data on
   resize) — with the pen-colour switcher and print colour
   substitution removed, since neither applies here. */

function createCanvasController(canvas) {
  const ctx = canvas.getContext("2d");
  const INK_COLOR = "#F4F1EA";
  let strokes = []; // each: { points: [{x,y}] }
  let currentStroke = null;
  let drawing = false;

  function sizeToDisplay() {
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return; // not laid out yet
    const dpr = window.devicePixelRatio || 1;
    const targetW = Math.round(rect.width * dpr);
    const targetH = Math.round(rect.height * dpr);
    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    redraw();
  }

  function redraw() {
    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 10;
    ctx.strokeStyle = INK_COLOR;
    ctx.fillStyle = INK_COLOR;
    strokes.forEach(stroke => {
      const pts = stroke.points;
      if (pts.length < 2) {
        if (pts.length === 1) {
          ctx.beginPath();
          ctx.arc(pts[0].x, pts[0].y, ctx.lineWidth / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        return;
      }
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
      ctx.stroke();
    });
  }

  function pointFromEvent(e) {
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  canvas.addEventListener("pointerdown", e => {
    drawing = true;
    try { canvas.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
    currentStroke = { points: [pointFromEvent(e)] };
    strokes.push(currentStroke);
    redraw();
  });

  canvas.addEventListener("pointermove", e => {
    if (!drawing) return;
    const events = (typeof e.getCoalescedEvents === "function") ? e.getCoalescedEvents() : null;
    const pts = (events && events.length) ? events : [e];
    pts.forEach(ev => currentStroke.points.push(pointFromEvent(ev)));
    redraw();
  });

  function stopDrawing(e) {
    if (!drawing) return;
    drawing = false;
    currentStroke = null;
    try {
      if (e && canvas.hasPointerCapture && canvas.hasPointerCapture(e.pointerId)) {
        canvas.releasePointerCapture(e.pointerId);
      }
    } catch (err) { /* ignore — state is already safely reset above */ }
  }
  canvas.addEventListener("pointerup", stopDrawing);
  canvas.addEventListener("pointercancel", stopDrawing);
  canvas.addEventListener("pointerleave", e => { if (e.buttons === 0) stopDrawing(e); });

  const resizeObserver = new ResizeObserver(() => sizeToDisplay());
  resizeObserver.observe(canvas);

  return {
    canvas,
    undo() { strokes.pop(); redraw(); },
    clear() { strokes = []; redraw(); },
    destroy() { resizeObserver.disconnect(); }
  };
}

let activeCanvasController = null;
function destroyActiveCanvas() {
  if (activeCanvasController) { activeCanvasController.destroy(); activeCanvasController = null; }
}

/* ---------- Round building ----------
   Cumulative pool: everything up to and including the selected row.
   The newest row is guaranteed full coverage (all 5 kana appear at
   least once); remaining slots follow a ~60/40 current/previous split
   (100/0 for the first row, which has no "previous"). This is a
   suggested weighting, not a hard guarantee, per the brief. */

let lastRoundSignature = null;

function buildRound(rowKey) {
  const rowIndex = ROW_ORDER.indexOf(rowKey);
  const currentRow = HIRAGANA_ROWS[rowKey];
  const previousPool = ROW_ORDER.slice(0, rowIndex).flatMap(k => HIRAGANA_ROWS[k]);
  const TOTAL = 10;

  let questions;
  let attempts = 0;
  do {
    const previousCount = previousPool.length > 0 ? Math.round(TOTAL * 0.4) : 0;
    const currentCount = TOTAL - previousCount;

    const picks = currentRow.slice(); // guaranteed: one of each current-row kana
    for (let i = picks.length; i < currentCount; i++) {
      picks.push(randomChoiceAvoiding(currentRow, picks[picks.length - 1].kana));
    }
    for (let i = 0; i < previousCount; i++) {
      picks.push(randomChoiceAvoiding(previousPool, picks[picks.length - 1].kana));
    }

    const ordered = shuffleNoAdjacentDup(picks, item => item.kana);
    questions = ordered.map(k => ({ kana: k.kana, romaji: k.romaji, type: Math.random() < 0.5 ? "A" : "B" }));
    // Light guard against long same-type runs, so it never reads as
    // "all Hiragana→Romaji first, all Romaji→Hiragana after".
    for (let i = 2; i < questions.length; i++) {
      if (questions[i].type === questions[i - 1].type && questions[i].type === questions[i - 2].type) {
        questions[i].type = questions[i].type === "A" ? "B" : "A";
      }
    }
    attempts++;
  } while (
    JSON.stringify(questions.map(q => q.kana + q.type)) === lastRoundSignature &&
    attempts < 10
  );

  lastRoundSignature = JSON.stringify(questions.map(q => q.kana + q.type));
  return questions;
}

// ~5–6 questions (more if there are many difficult kana), covering
// each at least once and using both directions where possible.
function buildReviewRound(difficultKanaObjs) {
  const target = difficultKanaObjs.length <= 3 ? 6 : Math.min(8, difficultKanaObjs.length * 2);
  const result = difficultKanaObjs.map((k, i) => ({ kana: k.kana, romaji: k.romaji, type: i % 2 === 0 ? "A" : "B" }));

  let i = 0;
  while (result.length < target) {
    const k = difficultKanaObjs[i % difficultKanaObjs.length];
    const usedTypes = result.filter(q => q.kana === k.kana).map(q => q.type);
    const type = usedTypes.includes("A") && !usedTypes.includes("B") ? "B"
               : usedTypes.includes("B") && !usedTypes.includes("A") ? "A"
               : (Math.random() < 0.5 ? "A" : "B");
    result.push({ kana: k.kana, romaji: k.romaji, type });
    i++;
  }
  return shuffleNoAdjacentDup(result, q => q.kana + "|" + q.type);
}

function kanaLookup(rowKey) {
  const rowIndex = ROW_ORDER.indexOf(rowKey);
  const map = {};
  ROW_ORDER.slice(0, rowIndex + 1).forEach(k => HIRAGANA_ROWS[k].forEach(item => { map[item.kana] = item; }));
  return map;
}

/* ---------- Session state ---------- */

const session = {
  rowKey: "a",
  mode: "main",       // "main" | "review"
  questions: [],
  qIndex: 0,
  score: 0,
  correctSet: new Set(),
  difficultSet: new Set(),
  attempt: 0,
  lookup: {}
};

/* ---------- Small DOM helpers (mirrors experience-app.js's idiom) ---------- */

const app = document.getElementById("kr-app");

function card() {
  const c = document.createElement("div");
  c.className = "kr-card";
  app.innerHTML = "";
  app.appendChild(c);
  return c;
}

function btn(label, onClick, opts = {}) {
  const b = document.createElement("button");
  b.className = "kr-btn" + (opts.secondary ? " secondary" : "") + (opts.small ? " small" : "");
  b.textContent = label;
  b.addEventListener("click", onClick);
  return b;
}

function instructionBlock(main, sub, jpSub) {
  const wrap = document.createElement("div");
  const m = document.createElement("div");
  m.className = "kr-instruction";
  m.textContent = main;
  wrap.appendChild(m);
  if (jpSub) {
    const j = document.createElement("div");
    j.className = "kr-jp-sub";
    j.textContent = jpSub;
    wrap.appendChild(j);
  }
  if (sub) {
    const s = document.createElement("div");
    s.className = "kr-subinstruction";
    s.textContent = sub;
    wrap.appendChild(s);
  }
  return wrap;
}

/* ---------- Range selection screen ---------- */

function renderRangeSelect() {
  destroyActiveCanvas();
  const c = card();
  c.appendChild(instructionBlock(
    "Choose what you have learned.",
    "The practice will mix in everything learned so far, with extra focus on the newest row."
  ));

  const grid = document.createElement("div");
  grid.className = "kr-range-grid";
  ROW_ORDER.forEach(rowKey => {
    const meta = ROW_META[rowKey];
    const b = document.createElement("div");
    b.className = "kr-range-btn" + (session.rowKey === rowKey ? " selected" : "");
    b.innerHTML = `
      <div>
        <div class="kana-line">${meta.line}</div>
        <div class="row-note">${meta.note}</div>
      </div>
      <div class="kr-range-check">✓</div>
    `;
    b.addEventListener("click", () => { session.rowKey = rowKey; renderRangeSelect(); });
    grid.appendChild(b);
  });
  c.appendChild(grid);

  c.appendChild(btn("Start Practice", () => startRound(session.rowKey)));
}

function startRound(rowKey) {
  session.rowKey = rowKey;
  session.mode = "main";
  session.lookup = kanaLookup(rowKey);
  session.questions = buildRound(rowKey);
  session.qIndex = 0;
  session.score = 0;
  session.correctSet = new Set();
  session.difficultSet = new Set();
  renderQuestion();
}

/* ---------- Question dispatch ---------- */

function renderQuestion() {
  destroyActiveCanvas();
  const q = session.questions[session.qIndex];
  session.attempt = 0;
  if (q.type === "A") renderTypeA(q);
  else renderTypeB(q);
}

function advance() {
  session.qIndex++;
  if (session.qIndex >= session.questions.length) {
    if (session.mode === "review") renderReviewResult();
    else renderRoundResult();
  } else {
    renderQuestion();
  }
}

/* ---------- Type A: Hiragana -> Romaji ---------- */

function renderTypeA(q) {
  const c = card();

  const label = document.createElement("div");
  label.className = "kr-range-label";
  label.textContent = `Range: ${rangeLabel(session.rowKey)}`;
  c.appendChild(label);

  const progress = document.createElement("div");
  progress.className = "kr-progress";
  progress.textContent = `Question ${session.qIndex + 1} of ${session.questions.length}`;
  c.appendChild(progress);

  c.appendChild(instructionBlock("What sound is this?", null, "このひらがなは？"));

  const big = document.createElement("div");
  big.className = "kr-big-kana";
  big.textContent = q.kana;
  c.appendChild(big);

  const input = document.createElement("input");
  input.className = "kr-answer-input";
  input.type = "text";
  input.placeholder = "type the sound";
  input.autocomplete = "off";
  input.autocapitalize = "off";
  input.spellcheck = false;
  c.appendChild(input);

  const feedback = document.createElement("div");
  feedback.className = "kr-feedback";
  c.appendChild(feedback);

  const actions = document.createElement("div");
  actions.className = "kr-nav-row";
  c.appendChild(actions);

  function showCheckButton() {
    actions.innerHTML = "";
    actions.appendChild(btn("Check", check));
  }
  function showNextButton() {
    actions.innerHTML = "";
    actions.appendChild(btn("Next", advance));
  }

  function check() {
    const answer = normalizeAnswer(input.value);
    if (!answer) { input.focus(); return; }
    session.attempt++;

    if (answer === q.romaji) {
      feedback.className = "kr-feedback good";
      feedback.textContent = "✓ Correct!";
      session.score++;
      session.correctSet.add(q.kana);
      input.disabled = true;
      showNextButton();
      return;
    }

    if (session.attempt === 1) {
      feedback.className = "kr-feedback bad";
      feedback.textContent = "✗ Try again";
      input.value = "";
      input.focus();
      // Check button stays as-is for the second attempt.
    } else {
      feedback.className = "kr-feedback reveal";
      feedback.textContent = `Correct answer: ${q.kana} = ${q.romaji}`;
      session.difficultSet.add(q.kana);
      input.disabled = true;
      showNextButton();
    }
  }

  showCheckButton();
  input.addEventListener("keydown", e => { if (e.key === "Enter") check(); });
  input.focus();
}

/* ---------- Type B: Romaji -> Hiragana (write it) ---------- */

function renderTypeB(q) {
  const c = card();

  const label = document.createElement("div");
  label.className = "kr-range-label";
  label.textContent = `Range: ${rangeLabel(session.rowKey)}`;
  c.appendChild(label);

  const progress = document.createElement("div");
  progress.className = "kr-progress";
  progress.textContent = `Question ${session.qIndex + 1} of ${session.questions.length}`;
  c.appendChild(progress);

  c.appendChild(instructionBlock("Write the Hiragana.", null, "ひらがなを かこう。"));

  const prompt = document.createElement("div");
  prompt.className = "kr-romaji-prompt";
  prompt.textContent = q.romaji;
  c.appendChild(prompt);

  const canvasWrap = document.createElement("div");
  canvasWrap.className = "kr-canvas-wrap";
  const guide = document.createElement("div");
  guide.className = "kr-canvas-guide";
  canvasWrap.appendChild(guide);
  const canvas = document.createElement("canvas");
  canvas.className = "kr-writing-canvas";
  canvasWrap.appendChild(canvas);
  c.appendChild(canvasWrap);

  const controller = createCanvasController(canvas);
  activeCanvasController = controller;

  const writeControls = document.createElement("div");
  writeControls.className = "kr-write-controls";
  writeControls.appendChild(btn("Undo", () => controller.undo(), { secondary: true, small: true }));
  writeControls.appendChild(btn("Clear", () => controller.clear(), { secondary: true, small: true }));
  c.appendChild(writeControls);

  const revealArea = document.createElement("div");
  c.appendChild(revealArea);

  const actions = document.createElement("div");
  actions.className = "kr-nav-row";
  c.appendChild(actions);

  function showShowAnswerButton() {
    actions.innerHTML = "";
    actions.appendChild(btn("Show Answer", reveal));
  }

  function reveal() {
    revealArea.innerHTML = "";
    const revealedKana = document.createElement("div");
    revealedKana.className = "kr-revealed-kana";
    revealedKana.textContent = q.kana;
    revealArea.appendChild(revealedKana);
    const checkPrompt = document.createElement("div");
    checkPrompt.className = "kr-check-prompt";
    checkPrompt.textContent = "Did you get it right?";
    revealArea.appendChild(checkPrompt);

    actions.innerHTML = "";
    actions.appendChild(btn("✓ Yes", onYes));
    actions.appendChild(btn("Try Again", onTryAgain, { secondary: true }));
  }

  function onYes() {
    session.score++;
    session.correctSet.add(q.kana);
    advance();
  }

  function onTryAgain() {
    session.difficultSet.add(q.kana);
    controller.clear();
    revealArea.innerHTML = "";
    showShowAnswerButton();
  }

  showShowAnswerButton();
}

/* ---------- End of round ---------- */

function uniqueInOrder(set, rowKey) {
  const order = [];
  ROW_ORDER.slice(0, ROW_ORDER.indexOf(rowKey) + 1).forEach(k => HIRAGANA_ROWS[k].forEach(item => order.push(item.kana)));
  return order.filter(k => set.has(k));
}

function renderKanaRow(kanaList, opts = {}) {
  const row = document.createElement("div");
  row.className = "kr-result-kana-row" + (opts.review ? " review" : "");
  kanaList.forEach(k => {
    const span = document.createElement("span");
    span.className = "item";
    span.textContent = k;
    row.appendChild(span);
  });
  return row;
}

function renderRoundResult() {
  destroyActiveCanvas();
  const c = card();

  const label = document.createElement("div");
  label.className = "kr-range-label";
  label.textContent = `Range: ${rangeLabel(session.rowKey)}`;
  c.appendChild(label);

  const title = document.createElement("div");
  title.className = "kr-instruction";
  title.textContent = "Practice Complete!";
  c.appendChild(title);

  const score = document.createElement("div");
  score.className = "kr-score";
  score.textContent = `${session.score} / ${session.questions.length}`;
  c.appendChild(score);

  const remembered = uniqueInOrder(session.correctSet, session.rowKey);
  const difficult = uniqueInOrder(session.difficultSet, session.rowKey);

  if (remembered.length) {
    const sec = document.createElement("div");
    sec.className = "kr-result-section";
    const lbl = document.createElement("div");
    lbl.className = "kr-result-label";
    lbl.textContent = "You remembered";
    sec.appendChild(lbl);
    sec.appendChild(renderKanaRow(remembered));
    c.appendChild(sec);
  }

  const actions = document.createElement("div");
  actions.className = "kr-nav-row";

  if (difficult.length) {
    const sec = document.createElement("div");
    sec.className = "kr-result-section";
    const lbl = document.createElement("div");
    lbl.className = "kr-result-label";
    lbl.textContent = "Let's review";
    sec.appendChild(lbl);
    sec.appendChild(renderKanaRow(difficult, { review: true }));
    c.appendChild(sec);

    actions.appendChild(btn("Review Difficult Kana", () => startReviewRound(difficult)));
    actions.appendChild(btn("Practice Again", () => startRound(session.rowKey), { secondary: true }));
  } else {
    const good = document.createElement("div");
    good.className = "kr-result-good-msg";
    good.textContent = "Great! You remembered them all.";
    c.appendChild(good);
    actions.appendChild(btn("Practice Again", () => startRound(session.rowKey)));
  }

  c.appendChild(actions);

  const changeRange = document.createElement("div");
  changeRange.style.marginTop = "14px";
  changeRange.appendChild(btn("Choose a Different Range", renderRangeSelect, { secondary: true, small: true }));
  c.appendChild(changeRange);
}

/* ---------- Difficult kana review round ---------- */

function startReviewRound(difficultKanaChars) {
  const kanaObjs = difficultKanaChars.map(k => session.lookup[k]).filter(Boolean);
  session.mode = "review";
  session.questions = buildReviewRound(kanaObjs);
  session.qIndex = 0;
  session.score = 0;
  session.correctSet = new Set();
  session.difficultSet = new Set();
  renderQuestion();
}

function renderReviewResult() {
  destroyActiveCanvas();
  const c = card();

  const title = document.createElement("div");
  title.className = "kr-instruction";
  title.textContent = "Review Complete!";
  c.appendChild(title);

  const stillDifficult = [...session.difficultSet];

  if (stillDifficult.length === 0) {
    const good = document.createElement("div");
    good.className = "kr-result-good-msg";
    good.textContent = "✓ You remembered them!";
    c.appendChild(good);
  } else {
    const sec = document.createElement("div");
    sec.className = "kr-result-section";
    const lbl = document.createElement("div");
    lbl.className = "kr-result-label";
    lbl.textContent = "Still needs more practice";
    sec.appendChild(lbl);
    sec.appendChild(renderKanaRow(stillDifficult, { review: true }));
    c.appendChild(sec);
  }

  const actions = document.createElement("div");
  actions.className = "kr-nav-row";
  actions.appendChild(btn("Practice Again", () => startRound(session.rowKey)));
  actions.appendChild(btn("Choose a Different Range", renderRangeSelect, { secondary: true }));
  c.appendChild(actions);
}

/* ---------- Entry point ----------
   ?range=a|k|s preselects a row (used by the "Test Your Memory" link
   on the Experience page's finish screen) — it only pre-selects, the
   student/teacher still confirms with Start Practice. */

(function init() {
  const params = new URLSearchParams(window.location.search);
  const requested = params.get("range");
  if (requested && HIRAGANA_ROWS[requested]) session.rowKey = requested;
  renderRangeSelect();
})();
