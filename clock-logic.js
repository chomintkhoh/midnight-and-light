const HOUR_READINGS = {
  1:"いちじ", 2:"にじ", 3:"さんじ", 4:"よじ", 5:"ごじ", 6:"ろくじ",
  7:"しちじ", 8:"はちじ", 9:"くじ", 10:"じゅうじ", 11:"じゅういちじ", 12:"じゅうにじ"
};

const MINUTE_ONES = {
  1:"いっぷん", 2:"にふん", 3:"さんぷん", 4:"よんぷん", 5:"ごふん",
  6:"ろっぷん", 7:"ななふん", 8:"はっぷん", 9:"きゅうふん"
};

const MINUTE_TENS = {
  10:"じゅっぷん", 20:"にじゅっぷん", 30:"さんじゅっぷん",
  40:"よんじゅっぷん", 50:"ごじゅっぷん"
};

const MINUTE_TENS_PREFIX = {
  10:"じゅう", 20:"にじゅう", 30:"さんじゅう", 40:"よんじゅう", 50:"ごじゅう"
};

export function hourReading(hour) {
  return HOUR_READINGS[((hour - 1) % 12) + 1];
}

export function minuteReading(minute) {
  const m = Number(minute);
  if (m === 0) return "";
  if (MINUTE_TENS[m]) return MINUTE_TENS[m];

  const tens = Math.floor(m / 10) * 10;
  const ones = m % 10;
  if (tens === 0) return MINUTE_ONES[ones];

  const prefix = MINUTE_TENS_PREFIX[tens];
  return `${prefix}${MINUTE_ONES[ones]}`;
}

export function fullReading(hour, minute) {
  const h = hourReading(hour);
  const m = minuteReading(minute);
  return m ? `${h} ${m}` : h;
}

export function buildTime(hour, minute) {
  const hour12 = ((Number(hour) - 1) % 12) + 1;
  const m = Number(minute);
  return {
    hour: hour12,
    hour12,
    minute: m,
    digitalTime: `${hour12}:${String(m).padStart(2, "0")}`,
    japaneseReading: fullReading(hour12, m)
  };
}

const MODE_MINUTES = {
  oclock:[0],
  every10:[0,10,20,30,40,50],
  every5:[0,5,10,15,20,25,30,35,40,45,50,55],
  minutes1to10:[1,2,3,4,5,6,7,8,9,10],
  mixed:[0,1,2,3,4,5,6,7,8,9,10,15,20,25,30,35,40,45,50,55]
};

export function generateTimePool(mode) {
  const minutes = [...new Set(MODE_MINUTES[mode] || MODE_MINUTES.mixed)];
  const pool = [];
  for (let hour = 1; hour <= 12; hour++) {
    for (const minute of minutes) pool.push(buildTime(hour, minute));
  }
  return pool;
}

export function shuffle(items) {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function timeKey(time) {
  return `${time.hour12}:${time.minute}`;
}

/**
 * Selects without replacement inside one worksheet.
 * Recent sets are penalized so "New Questions" changes as much as mathematically possible.
 */
export function pickQuestionTimes(mode, count = 9, recentSets = []) {
  const pool = generateTimePool(mode);
  const target = Math.min(count, pool.length);

  const recentWeight = new Map();
  recentSets.slice(-4).forEach((set, setIndex, arr) => {
    const recency = setIndex + 1; // newer = larger
    const weight = recency * 10;
    for (const item of set) {
      const key = typeof item === "string" ? item : timeKey(item);
      recentWeight.set(key, (recentWeight.get(key) || 0) + weight);
    }
  });

  // Random tie breaking, then least recently exposed first.
  const ranked = shuffle(pool).sort((a, b) => {
    return (recentWeight.get(timeKey(a)) || 0) - (recentWeight.get(timeKey(b)) || 0);
  });

  // Add a little hour variety without sacrificing the recent-history rule.
  const chosen = [];
  const deferred = [];
  const usedHours = new Set();
  const cutoffWeight = ranked.length ? (recentWeight.get(timeKey(ranked[0])) || 0) : 0;

  for (const item of ranked) {
    if (chosen.length >= target) break;
    const w = recentWeight.get(timeKey(item)) || 0;
    if (!usedHours.has(item.hour12) || w > cutoffWeight) {
      chosen.push(item);
      usedHours.add(item.hour12);
    } else {
      deferred.push(item);
    }
  }

  for (const item of deferred) {
    if (chosen.length >= target) break;
    chosen.push(item);
  }

  if (chosen.length < target) {
    for (const item of ranked) {
      if (chosen.length >= target) break;
      if (!chosen.some(x => timeKey(x) === timeKey(item))) chosen.push(item);
    }
  }

  return shuffle(chosen);
}

function toHalfWidthDigits(s) {
  return s.replace(/[０-９]/g, d => String(d.charCodeAt(0) - 0xFF10));
}

export function normalizeAnswer(value) {
  let s = String(value ?? "").trim().toLowerCase();
  s = toHalfWidthDigits(s);
  s = s.replace(/\s+/g, "");
  s = s.replace(/[。．.!！?？、,，]/g, "");
  s = s.replace(/です$/g, "");
  return s;
}

export function buildAcceptedAnswers(time) {
  // Keep pronunciation distinctions strict: ぷん and ふん are NOT normalized.
  const reading = normalizeAnswer(time.japaneseReading);
  return new Set([reading]);
}

export function checkTypedAnswer(value, time) {
  return buildAcceptedAnswers(time).has(normalizeAnswer(value));
}

export function hourAngle(hour, minute) {
  return ((((hour % 12) * 30) + Number(minute) * 0.5) % 360 + 360) % 360;
}

export function minuteAngle(minute) {
  return ((Number(minute) * 6) % 360 + 360) % 360;
}

function angularDistance(a, b) {
  const d = Math.abs((((a - b) % 360) + 540) % 360 - 180);
  return d;
}

export function checkClockAnswer(hourDeg, minuteDeg, time, hourTolerance = 7, minuteTolerance = 4) {
  return angularDistance(hourDeg, hourAngle(time.hour12, time.minute)) <= hourTolerance &&
         angularDistance(minuteDeg, minuteAngle(time.minute)) <= minuteTolerance;
}
