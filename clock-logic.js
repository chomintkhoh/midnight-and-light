/* ══════════════════════════════════════════════
   CLOCK PRACTICE — Core Logic (no DOM, no UI)
   Pure functions: time generation, Japanese reading
   generation, answer normalization/checking, and
   clock-hand angle math. Kept separate from the page
   so each piece can be tested/reused independently.
══════════════════════════════════════════════ */

/* ---------- Japanese time reading ---------- */

const HOUR_READINGS = {
  1: "いちじ", 2: "にじ", 3: "さんじ", 4: "よじ", 5: "ごじ", 6: "ろくじ",
  7: "しちじ", 8: "はちじ", 9: "くじ", 10: "じゅうじ", 11: "じゅういちじ", 12: "じゅうにじ"
};

const MINUTE_ONES = {
  1: "いっぷん", 2: "にふん", 3: "さんぷん", 4: "よんぷん", 5: "ごふん",
  6: "ろっぷん", 7: "ななふん", 8: "はっぷん", 9: "きゅうふん"
};

const MINUTE_TENS_PREFIX = { 1: "じゅう", 2: "にじゅう", 3: "さんじゅう", 4: "よんじゅう", 5: "ごじゅう" };
const MINUTE_TENS_EXACT = { 1: "じゅっぷん", 2: "にじゅっぷん", 3: "さんじゅっぷん", 4: "よんじゅっぷん", 5: "ごじゅっぷん" };

export function hourReading(hour12) {
  return HOUR_READINGS[hour12] || "";
}

export function minuteReading(minute) {
  if (minute === 0) return "";
  const tens = Math.floor(minute / 10);
  const ones = minute % 10;
  if (ones === 0) return MINUTE_TENS_EXACT[tens] || "";
  const prefix = tens === 0 ? "" : (MINUTE_TENS_PREFIX[tens] || "");
  return prefix + (MINUTE_ONES[ones] || "");
}

export function fullReading(hour24, minute) {
  const h12 = ((hour24 + 11) % 12) + 1;
  const h = hourReading(h12);
  const m = minuteReading(minute);
  return m ? `${h} ${m}` : h;
}

/* ---------- Time question generation ---------- */

export function buildTime(hour24, minute) {
  const h12 = ((hour24 + 11) % 12) + 1;
  return {
    hour: hour24,
    hour12: h12,
    minute,
    digitalTime: `${h12}:${String(minute).padStart(2, "0")}`,
    japaneseReading: fullReading(hour24, minute)
  };
}

function randomHour() {
  return 1 + Math.floor(Math.random() * 12); // 1-12, kept simple for an MVP (no explicit AM/PM teaching yet)
}

const MODE_MINUTE_POOLS = {
  oclock: [0],
  every10: [0, 10, 20, 30, 40, 50],
  every5: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55],
  minutes1to10: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
};

export function generateTimePool(mode) {
  const minutes = mode === "mixed"
    ? MODE_MINUTE_POOLS.every5.concat(MODE_MINUTE_POOLS.minutes1to10)
    : MODE_MINUTE_POOLS[mode];
  const pool = [];
  for (let h = 1; h <= 12; h++) {
    minutes.forEach(m => pool.push(buildTime(h, m)));
  }
  return pool;
}

// Picks `count` times from the pool, shuffled, never repeating the
// immediately-previous time unless the pool is too small to avoid it.
export function pickQuestionTimes(mode, count) {
  const pool = shuffle(generateTimePool(mode));
  const result = [];
  let lastKey = null;
  let cursor = 0;
  let guard = 0;
  while (result.length < count && guard < count * 50) {
    guard++;
    if (cursor >= pool.length) { shuffle(pool); cursor = 0; }
    const candidate = pool[cursor++];
    const key = `${candidate.hour}:${candidate.minute}`;
    if (key === lastKey && pool.length > 1) continue;
    result.push(candidate);
    lastKey = key;
  }
  return result;
}

export function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ---------- Answer normalization & checking (Type A: type the reading) ---------- */

const FULLWIDTH_DIGIT_OFFSET = 0xFF10 - 0x30; // '０'(FF10) -> '0'(30)

function toHalfWidthDigits(str) {
  return str.replace(/[０-９]/g, ch => String.fromCharCode(ch.charCodeAt(0) - FULLWIDTH_DIGIT_OFFSET));
}

export function normalizeAnswer(raw) {
  if (typeof raw !== "string") return "";
  let s = toHalfWidthDigits(raw);
  s = s.replace(/\s+/g, "");                 // all whitespace
  s = s.replace(/[。.、,！!？?]/g, "");        // trailing/embedded punctuation
  s = s.replace(/です$/u, "");                 // optional polite ending
  s = s.replace(/ぷ/g, "ふ");                  // ぷ/ふ leniency — see README note
  return s;
}

// Builds the accepted-answer set for a given time: the proper kana
// reading, and a digit-numeral form (e.g. "8じ5ふん"), both normalized.
export function buildAcceptedAnswers(time) {
  const kana = normalizeAnswer(fullReading(time.hour, time.minute));
  const digitForm = time.minute === 0
    ? `${time.hour12}じ`
    : `${time.hour12}じ${time.minute}ふん`;
  return new Set([kana, normalizeAnswer(digitForm)]);
}

export function checkTypedAnswer(rawInput, time) {
  const accepted = buildAcceptedAnswers(time);
  return accepted.has(normalizeAnswer(rawInput));
}

/* ---------- Clock hand angle math (Type B/C: set the clock) ---------- */

export function hourAngle(hour12, minute) {
  const h = hour12 % 12;
  return (h * 30) + (minute * 0.5); // moves gradually with the minutes, never snapped
}

export function minuteAngle(minute) {
  return minute * 6;
}

// A student's dragged minute hand only needs to be "close enough" to a
// real 5-minute tick for Type B/C (dragging pixel-perfect to the exact
// minute is unreasonable on a touchscreen); tolerance is intentionally
// generous but still requires the right general position.
export function checkClockAnswer(setHourAngle, setMinuteAngle, time) {
  const targetHourAngle = hourAngle(time.hour12, time.minute);
  const targetMinuteAngle = minuteAngle(time.minute);
  const hourDiff = angleDiff(setHourAngle, targetHourAngle);
  const minuteDiff = angleDiff(setMinuteAngle, targetMinuteAngle);
  return hourDiff <= 4 && minuteDiff <= 4; // ~4° tolerance either side
}

function angleDiff(a, b) {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
}
