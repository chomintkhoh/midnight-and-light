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
  { kana: "あ", romaji: "a", row: "A-row", enabled: true, vocab: [
      { word: "あめ", romaji: "ame", meaning: "rain", emoji: "🌧️" },
      { word: "あり", romaji: "ari", meaning: "ant", emoji: "🐜" },
      { word: "あし", romaji: "ashi", meaning: "foot / leg", emoji: "🦶" }
    ] },
  { kana: "い", romaji: "i", row: "A-row", enabled: true, vocab: [
      { word: "いぬ", romaji: "inu", meaning: "dog", emoji: "🐶" },
      { word: "いす", romaji: "isu", meaning: "chair", emoji: "🪑" },
      { word: "いちご", romaji: "ichigo", meaning: "strawberry", emoji: "🍓" }
    ] },
  { kana: "う", romaji: "u", row: "A-row", enabled: true, vocab: [
      { word: "うま", romaji: "uma", meaning: "horse", emoji: "🐴" },
      { word: "うし", romaji: "ushi", meaning: "cow", emoji: "🐄" },
      { word: "うみ", romaji: "umi", meaning: "sea", emoji: "🌊" }
    ] },
  { kana: "え", romaji: "e", row: "A-row", enabled: true, vocab: [
      { word: "え", romaji: "e", meaning: "picture / drawing", emoji: "🖼️" },
      { word: "えき", romaji: "eki", meaning: "station", emoji: "🚉" },
      { word: "えび", romaji: "ebi", meaning: "shrimp", emoji: "🦐" }
    ] },
  { kana: "お", romaji: "o", row: "A-row", enabled: true, vocab: [
      { word: "おに", romaji: "oni", meaning: "ogre", emoji: "👹" },
      { word: "おばけ", romaji: "obake", meaning: "ghost", emoji: "👻" },
      { word: "おにぎり", romaji: "onigiri", meaning: "rice ball", emoji: "🍙" }
    ] },
  // K-row
  { kana: "か", romaji: "ka", row: "K-row", enabled: true, vocab: [
      { word: "かさ", romaji: "kasa", meaning: "umbrella", emoji: "☂️" },
      { word: "かに", romaji: "kani", meaning: "crab", emoji: "🦀" },
      { word: "かめ", romaji: "kame", meaning: "turtle", emoji: "🐢" }
    ] },
  { kana: "き", romaji: "ki", row: "K-row", enabled: true, vocab: [
      { word: "き", romaji: "ki", meaning: "tree", emoji: "🌳" },
      { word: "きりん", romaji: "kirin", meaning: "giraffe", emoji: "🦒" },
      { word: "きのこ", romaji: "kinoko", meaning: "mushroom", emoji: "🍄" }
    ] },
  { kana: "く", romaji: "ku", row: "K-row", enabled: true, vocab: [
      { word: "くま", romaji: "kuma", meaning: "bear", emoji: "🐻" },
      { word: "くつ", romaji: "kutsu", meaning: "shoes", emoji: "👟" },
      { word: "くるま", romaji: "kuruma", meaning: "car", emoji: "🚗" }
    ] },
  { kana: "け", romaji: "ke", row: "K-row", enabled: true, vocab: [
      { word: "けむし", romaji: "kemushi", meaning: "caterpillar", emoji: "🐛" },
      { word: "けしごむ", romaji: "keshigomu", meaning: "eraser", emoji: "🧽" },
      { word: "けいさつ", romaji: "keisatsu", meaning: "police", emoji: "🚓" }
    ] },
  { kana: "こ", romaji: "ko", row: "K-row", enabled: true, vocab: [
      { word: "こあら", romaji: "koara", meaning: "koala", emoji: "🐨" },
      { word: "こま", romaji: "koma", meaning: "spinning top", emoji: "🎯" },
      { word: "こおり", romaji: "koori", meaning: "ice", emoji: "🧊" }
    ] },
  // S-row
  { kana: "さ", romaji: "sa", row: "S-row", enabled: true, vocab: [
      { word: "さかな", romaji: "sakana", meaning: "fish", emoji: "🐟" },
      { word: "さる", romaji: "saru", meaning: "monkey", emoji: "🐒" },
      { word: "さくら", romaji: "sakura", meaning: "cherry blossom", emoji: "🌸" }
    ] },
  { kana: "し", romaji: "shi", row: "S-row", enabled: true, vocab: [
      { word: "しか", romaji: "shika", meaning: "deer", emoji: "🦌" },
      { word: "しお", romaji: "shio", meaning: "salt", emoji: "🧂" },
      { word: "しま", romaji: "shima", meaning: "island", emoji: "🏝️" }
    ] },
  { kana: "す", romaji: "su", row: "S-row", enabled: true, vocab: [
      { word: "すし", romaji: "sushi", meaning: "sushi", emoji: "🍣" },
      { word: "すいか", romaji: "suika", meaning: "watermelon", emoji: "🍉" },
      { word: "すずめ", romaji: "suzume", meaning: "sparrow", emoji: "🐦" }
    ] },
  { kana: "せ", romaji: "se", row: "S-row", enabled: true, vocab: [
      { word: "せみ", romaji: "semi", meaning: "cicada", emoji: "🦗" },
      { word: "せんせい", romaji: "sensei", meaning: "teacher", emoji: "🧑‍🏫" },
      { word: "せんたくき", romaji: "sentakuki", meaning: "washing machine", emoji: "🧺" }
    ] },
  { kana: "そ", romaji: "so", row: "S-row", enabled: true, vocab: [
      { word: "そら", romaji: "sora", meaning: "sky", emoji: "☁️" },
      { word: "そば", romaji: "soba", meaning: "soba", emoji: "🍜" },
      { word: "そり", romaji: "sori", meaning: "sled", emoji: "🛷" }
    ] }
];

// Modularity layer for future per-student content control. Nothing
// here builds accounts/auth/permissions — it's just a single seam
// (this function) that a later settings layer could swap to return a
// filtered list, without touching navigation or rendering code at all.
function getActiveKana() {
  return KANA_DATA.filter(k => k.enabled !== false);
}

const ROWS = ["A-row", "K-row", "S-row"];

/* ---------- Stroke-order data ----------
   Hand-built, original path coordinates — not traced from any
   third-party worksheet. Each stroke: a path, a number-badge position,
   and an arrow (position + rotation) marking its starting direction.
   Style approved by the user for あ・き・す before the remaining 12
   were built to match. */

const STROKE_ORDER = {
  "あ": [
    { d: "M28,32 C38,29 48,28 56,27", num: [20, 30], arrow: [24, 32, -8] },
    { d: "M48,15 C46,30 42,48 36,62 C33,69 30,72 25,70", num: [55, 13], arrow: [48, 15, 95] },
    { d: "M68,33 C58,24 50,32 52,42 C40,42 33,52 35,62 C37,76 55,82 67,73 C77,65 75,50 62,48", num: [76, 30], arrow: [68, 33, 210] }
  ],
  "い": [
    { d: "M35,20 C32,35 30,55 35,72 C37,76 40,74 42,68", num: [27, 16], arrow: [35, 20, 100] },
    { d: "M62,15 C60,28 58,42 56,52", num: [70, 12], arrow: [62, 15, 100] }
  ],
  "う": [
    { d: "M30,22 C40,19 50,18 58,20", num: [24, 18], arrow: [30, 22, -8] },
    { d: "M35,35 C48,30 62,35 60,48 C58,62 45,75 32,72", num: [27, 32], arrow: [35, 35, 350] }
  ],
  "え": [
    { d: "M28,28 C38,25 48,24 56,25", num: [20, 24], arrow: [28, 28, -8] },
    { d: "M50,15 C40,25 30,35 32,48 C34,58 55,55 65,65 C72,73 68,82 55,84", num: [56, 12], arrow: [50, 15, 130] }
  ],
  "お": [
    { d: "M26,28 C36,25 46,24 54,25", num: [18, 24], arrow: [26, 28, -8] },
    { d: "M46,15 C44,32 40,50 34,64 C30,74 36,82 46,80 C58,77 62,62 56,52 C52,45 44,46 40,50", num: [38, 12], arrow: [46, 15, 100] },
    { d: "M68,20 C72,25 74,32 70,38", num: [76, 16], arrow: [68, 20, 60] }
  ],
  "か": [
    { d: "M45,15 C40,32 32,52 22,68", num: [37, 12], arrow: [45, 15, 115] },
    { d: "M55,22 C58,35 60,50 55,62 C50,74 38,80 28,74", num: [63, 19], arrow: [55, 22, 100] },
    { d: "M68,18 C72,24 74,30 70,36", num: [76, 14], arrow: [68, 18, 60] }
  ],
  "き": [
    { d: "M24,24 C36,21 48,20 60,18", num: [12, 16], arrow: [22, 24, -10] },
    { d: "M24,44 C36,41 48,40 62,38", num: [12, 50], arrow: [22, 44, -10] },
    { d: "M68,14 C58,32 45,52 30,74", num: [76, 10], arrow: [68, 14, 125] },
    { d: "M34,82 C44,90 58,90 68,80", num: [26, 86], arrow: [32, 80, 35] }
  ],
  "く": [
    { d: "M65,20 C50,35 38,45 32,50 C40,58 55,72 68,82", num: [73, 16], arrow: [65, 20, 145] }
  ],
  "け": [
    { d: "M28,18 C26,35 25,55 27,72", num: [20, 15], arrow: [28, 18, 95] },
    { d: "M35,32 C45,30 52,29 58,28", num: [27, 28], arrow: [35, 32, -8] },
    { d: "M68,18 C66,35 64,55 60,74 C58,80 54,82 48,80", num: [76, 15], arrow: [68, 18, 95] }
  ],
  "こ": [
    { d: "M25,30 C38,26 52,25 65,28", num: [18, 25], arrow: [25, 30, -12] },
    { d: "M22,62 C36,72 55,76 70,66 C74,63 74,58 70,55", num: [15, 65], arrow: [22, 62, 20] }
  ],
  "さ": [
    { d: "M28,26 C38,23 48,22 56,23", num: [20, 22], arrow: [28, 26, -8] },
    { d: "M48,14 C44,26 38,40 32,52", num: [55, 11], arrow: [48, 14, 110] },
    { d: "M24,58 C36,72 55,76 70,64 C75,60 74,54 68,52", num: [17, 61], arrow: [24, 58, 25] }
  ],
  "し": [
    { d: "M42,18 C38,35 34,55 36,68 C38,78 50,82 62,76", num: [50, 14], arrow: [42, 18, 100] }
  ],
  "す": [
    { d: "M18,32 C30,29 42,28 54,27", num: [10, 30], arrow: [16, 32, -10] },
    { d: "M62,14 C55,24 38,28 42,42 C45,52 62,48 60,62 C58,76 42,84 30,78", num: [70, 11], arrow: [62, 14, 115] }
  ],
  "せ": [
    { d: "M22,42 C36,39 50,38 64,40", num: [14, 38], arrow: [22, 42, -6] },
    { d: "M58,20 C57,30 56,38 55,46", num: [66, 16], arrow: [58, 20, 95] },
    { d: "M38,16 C36,28 34,40 32,52 C30,64 40,74 55,72 C64,70 70,64 68,58", num: [30, 13], arrow: [38, 16, 100] }
  ],
  "そ": [
    { d: "M24,22 C38,18 52,20 58,26 C48,32 34,36 38,46 C44,56 60,54 64,64 C68,74 60,82 46,80", num: [16, 18], arrow: [24, 22, -5] }
  ]
};

function buildStrokeOrderSVG(char) {
  const strokes = STROKE_ORDER[char];
  if (!strokes) return "";
  const parts = strokes.map((s, i) => {
    const [nx, ny] = s.num;
    const [ax, ay, angle] = s.arrow;
    return `
      <path class="so-stroke" d="${s.d}"/>
      <g transform="translate(${ax},${ay}) rotate(${angle})"><path class="so-arrow" d="M-4,-3 L4,0 L-4,3 Z"/></g>
      <circle class="so-num-bg" cx="${nx}" cy="${ny}" r="7"/>
      <text class="so-num-text" x="${nx}" y="${ny + 4}" text-anchor="middle">${i + 1}</text>
    `;
  }).join("");
  return `<svg viewBox="0 0 100 100" class="ws-stroke-order-svg">${parts}</svg>`;
}

/* ---------- Drawing engine ----------
   One controller per canvas. Strokes are stored as arrays of CSS-pixel
   points (not raw device pixels), so the canvas can be safely resized
   / redrawn at a new devicePixelRatio without ever losing what the
   student has already written — resizing redraws from this stored
   data rather than depending on the (destructive) canvas bitmap. */

const PEN_COLORS = { white: "#F4F1EA", blue: "#5B8DEF", red: "#E0687A" };
const PRINT_SUBSTITUTE = { [PEN_COLORS.white]: "#111111" }; // white ink prints as black
let currentPenColor = PEN_COLORS.white;
let printModeActive = false;

function createCanvasController(canvas) {
  const ctx = canvas.getContext("2d");
  let strokes = []; // each: { points: [{x,y}], color: "#hex" }
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

  function displayColorFor(strokeColor) {
    if (printModeActive && PRINT_SUBSTITUTE[strokeColor]) return PRINT_SUBSTITUTE[strokeColor];
    return strokeColor;
  }

  function redraw() {
    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 6;
    strokes.forEach(stroke => {
      const pts = stroke.points;
      const color = displayColorFor(stroke.color);
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      if (pts.length < 2) {
        // A tap with no movement still shows as a dot.
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
    activeController = controller;
    canvas.classList.add("active-box");
    document.querySelectorAll(".ws-canvas.active-box").forEach(c => { if (c !== canvas) c.classList.remove("active-box"); });
    // Capture failure (rare, but possible) must never block the stroke
    // itself from starting — this is the actual drawing, capture is
    // just there to make scroll-prevention/tracking more reliable.
    try { canvas.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
    currentStroke = { points: [pointFromEvent(e)], color: currentPenColor };
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

  const controller = {
    canvas,
    undo() { strokes.pop(); redraw(); },
    clear() { strokes = []; redraw(); },
    redraw() { redraw(); },
    destroy() { resizeObserver.disconnect(); }
  };

  // Initial sizing happens once the canvas is actually in the DOM and
  // laid out (ResizeObserver fires immediately on observe in all
  // current browsers, so this covers first render too).
  return controller;
}

let activeController = null;
let allControllers = [];

// White ink is invisible on white paper, so it must render as black
// specifically for print output — everything else (screen, PDF colors
// for blue/red) stays as drawn. beforeprint/afterprint is the standard,
// reliable hook for this since canvas bitmaps aren't reachable by CSS.
window.addEventListener("beforeprint", () => {
  printModeActive = true;
  allControllers.forEach(c => c.redraw());
});
window.addEventListener("afterprint", () => {
  printModeActive = false;
  allControllers.forEach(c => c.redraw());
});


/* ---------- Navigation state ----------
   Indexes into getActiveKana() (not KANA_DATA directly) throughout —
   this is the seam that lets a future per-student filter change what
   "the active set" means without touching any of this logic. */

let currentIndex = 0;

function renderRowNav() {
  const active = getActiveKana();
  const nav = document.getElementById("wsRowNav");
  nav.innerHTML = "";
  const rowsPresent = ROWS.filter(row => active.some(k => k.row === row));
  rowsPresent.forEach(row => {
    const btn = document.createElement("button");
    btn.className = "ws-row-btn" + (active[currentIndex].row === row ? " active" : "");
    btn.textContent = row;
    btn.addEventListener("click", () => {
      currentIndex = active.findIndex(k => k.row === row);
      render();
    });
    nav.appendChild(btn);
  });
}

function renderKanaNav() {
  const active = getActiveKana();
  const nav = document.getElementById("wsKanaNav");
  nav.innerHTML = "";
  const currentRow = active[currentIndex].row;
  active.forEach((k, i) => {
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

function buildWordWriteBox() {
  const wrap = document.createElement("div");
  wrap.className = "ws-word-box";
  const guide = document.createElement("div");
  guide.className = "ws-word-baseline";
  wrap.appendChild(guide);
  const canvas = document.createElement("canvas");
  canvas.className = "ws-canvas";
  wrap.appendChild(canvas);
  return { wrap, canvas };
}

function render() {
  const active = getActiveKana();
  const entry = active[currentIndex];

  allControllers.forEach(c => c.destroy());
  allControllers = [];
  activeController = null;

  document.getElementById("wsKanaHeader").textContent = entry.kana;
  document.getElementById("wsRomajiHeader").textContent = entry.romaji;
  document.getElementById("wsModelChar").textContent = entry.kana;
  document.getElementById("wsStrokeOrder").innerHTML = buildStrokeOrderSVG(entry.kana);

  const traceGrid = document.getElementById("wsTraceGrid");
  traceGrid.innerHTML = "";
  for (let i = 0; i < 4; i++) {
    const { wrap, canvas } = buildTraceBox(entry.kana);
    traceGrid.appendChild(wrap);
    allControllers.push(createCanvasController(canvas));
  }

  const writeGrid = document.getElementById("wsWriteGrid");
  writeGrid.innerHTML = "";
  for (let i = 0; i < 10; i++) {
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
      <div class="ws-vocab-pic">${v.emoji || ""}</div>
      <div class="ws-vocab-word">${v.word}</div>
      <div class="ws-vocab-romaji">${v.romaji}</div>
      <div class="ws-vocab-meaning">${v.meaning}</div>
    `;
    const wordWriteRow = document.createElement("div");
    wordWriteRow.className = "ws-word-write-row";
    for (let i = 0; i < 3; i++) {
      const { wrap, canvas } = buildWordWriteBox();
      wordWriteRow.appendChild(wrap);
      allControllers.push(createCanvasController(canvas));
    }
    item.appendChild(wordWriteRow);
    vocabGrid.appendChild(item);
  });

  renderRowNav();
  renderKanaNav();

  document.getElementById("wsPrevBtn").disabled = currentIndex === 0;
  document.getElementById("wsNextBtn").disabled = currentIndex === active.length - 1;
  document.getElementById("wsProgress").textContent = `${currentIndex + 1} / ${active.length}　${entry.kana}`;
}

/* ---------- Page-level controls ---------- */

document.getElementById("wsPrevBtn").addEventListener("click", () => {
  if (currentIndex > 0) { currentIndex--; render(); }
});
document.getElementById("wsNextBtn").addEventListener("click", () => {
  if (currentIndex < getActiveKana().length - 1) { currentIndex++; render(); }
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

/* Pen color selector — affects only strokes drawn AFTER a color is
   chosen; each stroke keeps whatever color was active when it was
   drawn (see createCanvasController), so Undo and mixed-color canvases
   both work naturally with no special-casing needed. */
document.querySelectorAll(".ws-pen-color").forEach(btn => {
  btn.addEventListener("click", () => {
    currentPenColor = PEN_COLORS[btn.dataset.color];
    document.querySelectorAll(".ws-pen-color").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
  });
});
document.getElementById("wsPrintBtn").addEventListener("click", () => {
  window.print();
});

render();
