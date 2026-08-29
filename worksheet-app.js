/* ══════════════════════════════════════════════
   Hiragana Writing Practice / Worksheet
   Reusable, data-driven — one template renders any
   kana entry. Fully independent from experience.html /
   experience-app.js (not touched, not shared with).
══════════════════════════════════════════════ */

/* ---------- Centralised kana data ---------- */
/* Change vocabulary/meanings here only — nothing in the
   worksheet markup needs to change when this data changes. */

const KANA_DATA = [
  // A-row
  { kana: "あ", romaji: "a", row: "A-row", vocab: [
      { word: "あめ", romaji: "ame", meaning: "rain" },
      { word: "あり", romaji: "ari", meaning: "ant" },
      { word: "あし", romaji: "ashi", meaning: "foot / leg" }
    ] },
  { kana: "い", romaji: "i", row: "A-row", vocab: [
      { word: "いぬ", romaji: "inu", meaning: "dog" },
      { word: "いす", romaji: "isu", meaning: "chair" },
      { word: "いちご", romaji: "ichigo", meaning: "strawberry" }
    ] },
  { kana: "う", romaji: "u", row: "A-row", vocab: [
      { word: "うま", romaji: "uma", meaning: "horse" },
      { word: "うし", romaji: "ushi", meaning: "cow" },
      { word: "うみ", romaji: "umi", meaning: "sea" }
    ] },
  { kana: "え", romaji: "e", row: "A-row", vocab: [
      { word: "え", romaji: "e", meaning: "picture / drawing" },
      { word: "えき", romaji: "eki", meaning: "station" },
      { word: "えび", romaji: "ebi", meaning: "shrimp" }
    ] },
  { kana: "お", romaji: "o", row: "A-row", vocab: [
      { word: "おに", romaji: "oni", meaning: "ogre" },
      { word: "おばけ", romaji: "obake", meaning: "ghost" },
      { word: "おにぎり", romaji: "onigiri", meaning: "rice ball" }
    ] },
  // K-row
  { kana: "か", romaji: "ka", row: "K-row", vocab: [
      { word: "かさ", romaji: "kasa", meaning: "umbrella" },
      { word: "かに", romaji: "kani", meaning: "crab" },
      { word: "かめ", romaji: "kame", meaning: "turtle" }
    ] },
  { kana: "き", romaji: "ki", row: "K-row", vocab: [
      { word: "き", romaji: "ki", meaning: "tree" },
      { word: "きりん", romaji: "kirin", meaning: "giraffe" },
      { word: "きのこ", romaji: "kinoko", meaning: "mushroom" }
    ] },
  { kana: "く", romaji: "ku", row: "K-row", vocab: [
      { word: "くま", romaji: "kuma", meaning: "bear" },
      { word: "くつ", romaji: "kutsu", meaning: "shoes" },
      { word: "くるま", romaji: "kuruma", meaning: "car" }
    ] },
  { kana: "け", romaji: "ke", row: "K-row", vocab: [
      { word: "けむし", romaji: "kemushi", meaning: "caterpillar" },
      { word: "けしごむ", romaji: "keshigomu", meaning: "eraser" },
      { word: "けいさつ", romaji: "keisatsu", meaning: "police" }
    ] },
  { kana: "こ", romaji: "ko", row: "K-row", vocab: [
      { word: "こあら", romaji: "koara", meaning: "koala" },
      { word: "こま", romaji: "koma", meaning: "spinning top" },
      { word: "こおり", romaji: "koori", meaning: "ice" }
    ] },
  // S-row
  { kana: "さ", romaji: "sa", row: "S-row", vocab: [
      { word: "さかな", romaji: "sakana", meaning: "fish" },
      { word: "さる", romaji: "saru", meaning: "monkey" },
      { word: "さくら", romaji: "sakura", meaning: "cherry blossom" }
    ] },
  { kana: "し", romaji: "shi", row: "S-row", vocab: [
      { word: "しか", romaji: "shika", meaning: "deer" },
      { word: "しお", romaji: "shio", meaning: "salt" },
      { word: "しま", romaji: "shima", meaning: "island" }
    ] },
  { kana: "す", romaji: "su", row: "S-row", vocab: [
      { word: "すし", romaji: "sushi", meaning: "sushi" },
      { word: "すいか", romaji: "suika", meaning: "watermelon" },
      { word: "すずめ", romaji: "suzume", meaning: "sparrow" }
    ] },
  { kana: "せ", romaji: "se", row: "S-row", vocab: [
      { word: "せみ", romaji: "semi", meaning: "cicada" },
      { word: "せんせい", romaji: "sensei", meaning: "teacher" },
      { word: "せんたくき", romaji: "sentakuki", meaning: "washing machine" }
    ] },
  { kana: "そ", romaji: "so", row: "S-row", vocab: [
      { word: "そら", romaji: "sora", meaning: "sky" },
      { word: "そば", romaji: "soba", meaning: "soba" },
      { word: "そり", romaji: "sori", meaning: "sled" }
    ] }
];

const ROWS = ["A-row", "K-row", "S-row"];

/* ---------- Drawing engine ----------
   One controller per canvas. Strokes are stored as arrays of CSS-pixel
   points (not raw device pixels), so the canvas can be safely resized
   / redrawn at a new devicePixelRatio without ever losing what the
   student has already written — resizing redraws from this stored
   data rather than depending on the (destructive) canvas bitmap. */

function createCanvasController(canvas) {
  const ctx = canvas.getContext("2d");
  let strokes = [];
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
    // setTransform (not scale) — never accumulates across repeated calls.
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    redraw();
  }

  function redraw() {
    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#2A2740";
    ctx.lineWidth = 7;
    strokes.forEach(stroke => {
      if (stroke.length < 2) {
        // A tap with no movement still shows as a dot.
        if (stroke.length === 1) {
          ctx.beginPath();
          ctx.arc(stroke[0].x, stroke[0].y, ctx.lineWidth / 2, 0, Math.PI * 2);
          ctx.fillStyle = ctx.strokeStyle;
          ctx.fill();
        }
        return;
      }
      ctx.beginPath();
      ctx.moveTo(stroke[0].x, stroke[0].y);
      for (let i = 1; i < stroke.length; i++) ctx.lineTo(stroke[i].x, stroke[i].y);
      ctx.stroke();
    });
  }

  function pointFromEvent(e) {
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  canvas.addEventListener("pointerdown", e => {
    drawing = true;
    activeController = controller;
    canvas.classList.add("active-box");
    document.querySelectorAll(".ws-canvas.active-box").forEach(c => { if (c !== canvas) c.classList.remove("active-box"); });
    // Capture failure (rare, but possible) must never block the stroke
    // itself from starting — this is the actual drawing, capture is
    // just there to make scroll-prevention/tracking more reliable.
    try { canvas.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
    currentStroke = [pointFromEvent(e)];
    strokes.push(currentStroke);
    redraw();
  });

  canvas.addEventListener("pointermove", e => {
    if (!drawing) return;
    const events = (typeof e.getCoalescedEvents === "function") ? e.getCoalescedEvents() : null;
    const pts = (events && events.length) ? events : [e];
    pts.forEach(ev => currentStroke.push(pointFromEvent(ev)));
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

  const controller = {
    canvas,
    undo() { strokes.pop(); redraw(); },
    clear() { strokes = []; redraw(); },
    destroy() { resizeObserver.disconnect(); }
  };

  // Initial sizing happens once the canvas is actually in the DOM and
  // laid out (ResizeObserver fires immediately on observe in all
  // current browsers, so this covers first render too).
  return controller;
}

let activeController = null;
let allControllers = [];

/* ---------- Navigation state ---------- */

let currentIndex = 0;

function renderRowNav() {
  const nav = document.getElementById("wsRowNav");
  nav.innerHTML = "";
  ROWS.forEach(row => {
    const btn = document.createElement("button");
    btn.className = "ws-row-btn" + (KANA_DATA[currentIndex].row === row ? " active" : "");
    btn.textContent = row;
    btn.addEventListener("click", () => {
      const firstIndex = KANA_DATA.findIndex(k => k.row === row);
      currentIndex = firstIndex;
      render();
    });
    nav.appendChild(btn);
  });
}

function renderKanaNav() {
  const nav = document.getElementById("wsKanaNav");
  nav.innerHTML = "";
  const currentRow = KANA_DATA[currentIndex].row;
  KANA_DATA.forEach((k, i) => {
    if (k.row !== currentRow) return;
    const btn = document.createElement("button");
    btn.className = "ws-kana-btn" + (i === currentIndex ? " active" : "");
    btn.textContent = k.kana;
    btn.addEventListener("click", () => { currentIndex = i; render(); });
    nav.appendChild(btn);
  });
}

function buildTraceBox(kana) {
  const wrap = document.createElement("div");
  wrap.className = "ws-box ws-trace-box";
  const guide = document.createElement("div");
  guide.className = "ws-guide-cross";
  wrap.appendChild(guide);
  const ref = document.createElement("div");
  ref.className = "ws-trace-ref";
  ref.textContent = kana;
  wrap.appendChild(ref);
  const canvas = document.createElement("canvas");
  canvas.className = "ws-canvas";
  wrap.appendChild(canvas);
  return { wrap, canvas };
}

function buildWriteBox() {
  const wrap = document.createElement("div");
  wrap.className = "ws-box ws-write-box";
  const guide = document.createElement("div");
  guide.className = "ws-guide-cross";
  wrap.appendChild(guide);
  const canvas = document.createElement("canvas");
  canvas.className = "ws-canvas";
  wrap.appendChild(canvas);
  return { wrap, canvas };
}

function render() {
  const entry = KANA_DATA[currentIndex];

  allControllers.forEach(c => c.destroy());
  allControllers = [];
  activeController = null;

  document.getElementById("wsKanaHeader").textContent = entry.kana;
  document.getElementById("wsRomajiHeader").textContent = entry.romaji;
  document.getElementById("wsModelChar").textContent = entry.kana;

  const traceGrid = document.getElementById("wsTraceGrid");
  traceGrid.innerHTML = "";
  for (let i = 0; i < 4; i++) {
    const { wrap, canvas } = buildTraceBox(entry.kana);
    traceGrid.appendChild(wrap);
    allControllers.push(createCanvasController(canvas));
  }

  const writeGrid = document.getElementById("wsWriteGrid");
  writeGrid.innerHTML = "";
  for (let i = 0; i < 6; i++) {
    const { wrap, canvas } = buildWriteBox();
    writeGrid.appendChild(wrap);
    allControllers.push(createCanvasController(canvas));
  }

  const vocabGrid = document.getElementById("wsVocabGrid");
  vocabGrid.innerHTML = "";
  entry.vocab.forEach(v => {
    const item = document.createElement("div");
    item.className = "ws-vocab-item";
    item.innerHTML = `
      <div class="ws-vocab-word">${v.word}</div>
      <div class="ws-vocab-romaji">${v.romaji}</div>
      <div class="ws-vocab-meaning">${v.meaning}</div>
    `;
    vocabGrid.appendChild(item);
  });

  renderRowNav();
  renderKanaNav();

  document.getElementById("wsPrevBtn").disabled = currentIndex === 0;
  document.getElementById("wsNextBtn").disabled = currentIndex === KANA_DATA.length - 1;
  document.getElementById("wsProgress").textContent = `${currentIndex + 1} / ${KANA_DATA.length}　${entry.kana}`;
}

/* ---------- Page-level controls ---------- */

document.getElementById("wsPrevBtn").addEventListener("click", () => {
  if (currentIndex > 0) { currentIndex--; render(); }
});
document.getElementById("wsNextBtn").addEventListener("click", () => {
  if (currentIndex < KANA_DATA.length - 1) { currentIndex++; render(); }
});
document.getElementById("wsUndoBtn").addEventListener("click", () => {
  if (activeController) activeController.undo();
});
document.getElementById("wsClearBoxBtn").addEventListener("click", () => {
  if (activeController) activeController.clear();
});
document.getElementById("wsResetBtn").addEventListener("click", () => {
  allControllers.forEach(c => c.clear());
});
document.getElementById("wsPrintBtn").addEventListener("click", () => {
  window.print();
});

render();
