/* ══════════════════════════════════════════════
   Assignment Engine — reusable across languages,
   levels, and topics. Nothing in this file is
   specific to Japanese, Mandarin, or Unit 1.

   Phase 3: ASSIGNMENT is now built by the generic
   assignment loader (core/assignment-loader.js) from
   an assignment-definition module + the content
   registry — not read from a hardcoded legacy skeleton
   patched by per-activity bridge scripts. See the
   bootstrap at the bottom of this file.
══════════════════════════════════════════════ */

const LOCALE_MAP = { ja: "ja-JP", zh: "zh-CN" };

const state = {
  index: 0,
  name: "",
  log: [],          // every scored answer: {label, prompt, yourAnswer, correctAnswer, correct, explanation}
};

const app = document.getElementById("app");
let ASSIGNMENT; // populated by the bootstrap at the bottom of this file, before first render()
let getContentRef = () => null; // set during bootstrap; lets renderers resolve content ids (e.g. component characters) generically

/* ---------- text templating: {{name}} substitution ---------- */
function T(str) {
  if (typeof str !== "string") return str;
  return str.replace(/\{\{name\}\}/g, state.name || "you");
}

/* ---------- audio (placeholder: browser speech synthesis) ---------- */
function speak(text) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(T(text));
  utter.lang = LOCALE_MAP[ASSIGNMENT.language] || "en-US";
  utter.rate = 0.9;
  window.speechSynthesis.speak(utter);
}

function audioButton(text, label = "Listen") {
  const btn = document.createElement("button");
  btn.className = "audio-btn";
  btn.innerHTML = `<span>🔊</span> ${label}`;
  btn.addEventListener("click", () => speak(text));
  return btn;
}

/* ---------- build the flat runtime step list from block data ----------
   flashcards / matching / reading are single self-contained steps.
   multipleChoice / fillBlank / sentenceOrder / readingQuestions are
   flattened to one step per question, so progress + scoring stay granular. */
function buildSteps() {
  const steps = [{ kind: "intro" }];

  ASSIGNMENT.blocks.forEach(block => {
    if (["flashcards", "matching", "reading"].includes(block.type)) {
      steps.push({ kind: "block", block });
    } else if (block.type === "sentenceOrder") {
      block.data.items.forEach((item, i) => {
        steps.push({ kind: "sentenceOrderItem", block, item, i, total: block.data.items.length });
      });
    } else {
      // multipleChoice, fillBlank, readingQuestions
      block.data.questions.forEach((q, i) => {
        steps.push({ kind: "question", block, q, i, total: block.data.questions.length });
      });
    }
  });

  steps.push({ kind: "results" });
  return steps;
}
let STEPS;

function goNext() {
  if (state.index < STEPS.length - 1) {
    state.index++;
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function recordAnswer(entry) {
  entry.attempts = entry.attempts || 1;
  state.log.push(entry);
  return entry;
}

/* Assignment-level summary — derived from the attempt log, computed
   once in a named place rather than inlined in the Results renderer. */
function computeSummary(log) {
  const correct = log.filter(e => e.correct).length;
  const total = log.length;
  return {
    totalQuestions: total,
    correctAnswers: correct,
    incorrectAnswers: total - correct,
    scorePercentage: total > 0 ? Math.round((correct / total) * 100) : null,
    completionStatus: "complete"
  };
}

/* ---------- shared UI atoms ---------- */
function topbar(step) {
  const bar = document.createElement("div");
  bar.className = "topbar";
  const title = document.createElement("div");
  title.className = "topbar-title";
  title.textContent = step.block ? step.block.eyebrow || step.block.title : (step.kind === "intro" ? ASSIGNMENT.topic : "Results");
  bar.appendChild(title);

  const track = document.createElement("div");
  track.className = "progress-track";
  const fill = document.createElement("div");
  fill.className = "progress-fill";
  const pct = Math.round((state.index / (STEPS.length - 1)) * 100);
  fill.style.width = pct + "%";
  track.appendChild(fill);
  bar.appendChild(track);
  return bar;
}

function primaryButton(label, onClick, disabled = false) {
  const btn = document.createElement("button");
  btn.className = "btn-primary";
  btn.textContent = label;
  btn.disabled = disabled;
  btn.addEventListener("click", onClick);
  return btn;
}

function blockHeader(container, block) {
  if (!block) return;
  const eyebrow = document.createElement("div");
  eyebrow.className = "block-eyebrow";
  eyebrow.textContent = block.eyebrow || "";
  container.appendChild(eyebrow);
  const title = document.createElement("div");
  title.className = "block-title";
  title.textContent = block.title;
  container.appendChild(title);
  if (block.sub) {
    const sub = document.createElement("div");
    sub.className = "block-sub";
    sub.textContent = block.sub;
    container.appendChild(sub);
  }
}

/* ---------- main render dispatch ---------- */
function render() {
  const step = STEPS[state.index];
  app.innerHTML = "";
  app.appendChild(topbar(step));

  const block = document.createElement("div");
  block.className = "block";

  switch (step.kind) {
    case "intro": renderIntro(block); break;
    case "block":
      if (step.block.type === "flashcards") renderFlashcards(block, step.block);
      else if (step.block.type === "matching") renderMatching(block, step.block);
      else if (step.block.type === "reading") renderReading(block, step.block);
      break;
    case "question": renderQuestion(block, step); break;
    case "sentenceOrderItem": renderSentenceOrderItem(block, step); break;
    case "results": renderResults(block); break;
  }

  app.appendChild(block);
}

/* ---------- INTRO ---------- */
function renderIntro(block) {
  const eyebrow = document.createElement("div");
  eyebrow.className = "block-eyebrow";
  eyebrow.textContent = `${ASSIGNMENT.level} · ${ASSIGNMENT.topic}`;
  block.appendChild(eyebrow);

  const title = document.createElement("div");
  title.className = "block-title";
  title.textContent = ASSIGNMENT.intro.title;
  block.appendChild(title);

  const text = document.createElement("p");
  text.className = "block-sub";
  text.textContent = ASSIGNMENT.intro.text;
  block.appendChild(text);

  if (ASSIGNMENT.needsName) {
    const label = document.createElement("div");
    label.className = "q-prompt";
    label.textContent = "What should we call you?";
    block.appendChild(label);

    const input = document.createElement("input");
    input.className = "blank-input";
    input.placeholder = "Your name";
    input.maxLength = 24;
    block.appendChild(input);

    block.appendChild(primaryButton("Start", () => {
      state.name = input.value.trim() || "You";
      goNext();
    }));
  } else {
    block.appendChild(primaryButton("Start", goNext));
  }
}

/* ---------- FLASHCARDS (self-contained, unscored) ---------- */
function renderFlashcards(block, blockData) {
  blockHeader(block, blockData);
  const cards = blockData.data.cards;
  let i = 0;
  let flipped = false;

  const card = document.createElement("div");
  card.className = "flashcard";
  block.appendChild(card);

  const counter = document.createElement("div");
  counter.className = "flashcard-counter";
  block.appendChild(counter);

  const nav = document.createElement("div");
  nav.className = "flashcard-nav";
  const prevBtn = document.createElement("button");
  prevBtn.textContent = "← Back";
  const nextBtn = document.createElement("button");
  nextBtn.textContent = "Next →";
  nav.appendChild(prevBtn);
  nav.appendChild(nextBtn);
  block.appendChild(nav);

  const continueBtn = primaryButton("Continue", goNext);
  block.appendChild(continueBtn);

  function formatReading(r) {
    // Generic: works for {reading, type} (Japanese) or {pinyin, tone} (Mandarin)
    // by checking which fields exist — never by checking language.
    const base = r.pinyin || r.reading || "";
    if (r.tone != null) return base + (r.tone === 0 ? " (neutral)" : ` (tone ${r.tone})`);
    if (r.type) return `${base} (${r.type})`;
    return base;
  }

  function draw() {
    const c = cards[i];
    flipped = false;
    card.classList.remove("flipped");

    const readingsLine = (c.back.readings && c.back.readings.length)
      ? `<div class="flashcard-readings cjk">${c.back.readings.map(formatReading).join(" / ")}</div>` : "";
    const componentsLine = (c.back.components && c.back.components.length)
      ? `<div class="flashcard-components cjk">${c.back.components.map(comp => {
          const id = typeof comp === "string" ? comp : comp.contentId;
          const item = getContentRef(id);
          return item ? item.character : id;
        }).join(" + ")}</div>` : "";

    card.innerHTML = `
      <div class="flashcard-front cjk">${T(c.front)}</div>
      <div class="flashcard-back">
        <div class="flashcard-meaning">${T(c.back.meanings[0])}</div>
        ${readingsLine}
        ${componentsLine}
      </div>
      <div class="flashcard-hint">Tap the card to flip</div>
    `;
    counter.textContent = `Card ${i + 1} of ${cards.length}`;
    prevBtn.disabled = i === 0;
    nextBtn.textContent = i === cards.length - 1 ? "Done reviewing" : "Next →";
  }

  card.addEventListener("click", () => {
    flipped = !flipped;
    card.classList.toggle("flipped", flipped);
  });
  prevBtn.addEventListener("click", () => { if (i > 0) { i--; draw(); refreshAudioBtn(); } });
  nextBtn.addEventListener("click", () => { if (i < cards.length - 1) { i++; draw(); refreshAudioBtn(); } else { goNext(); } });

  function refreshAudioBtn() {
    const old = block.querySelector(".audio-btn");
    if (old) old.remove();
    const audioBtn = audioButton(cards[i].audio);
    card.after(audioBtn);
  }

  draw();
  refreshAudioBtn();
}

/* ---------- MULTIPLE CHOICE / FILL BLANK / READING QUESTIONS ---------- */
function renderQuestion(block, step) {
  const { q, block: parentBlock, i, total } = step;

  blockHeader(block, parentBlock);

  // If this question belongs to a readingQuestions block, offer to re-open the passage
  if (parentBlock.passageRef) {
    const refBlock = ASSIGNMENT.blocks.find(b => b.id === parentBlock.passageRef);
    const toggle = document.createElement("button");
    toggle.className = "btn-secondary";
    toggle.textContent = "Review the passage";
    toggle.addEventListener("click", () => togglePassagePreview(block, refBlock));
    block.appendChild(toggle);
  }

  const counter = document.createElement("div");
  counter.className = "block-sub";
  counter.textContent = `Question ${i + 1} of ${total}`;
  block.appendChild(counter);

  if (q.kind === "mcq" || q.kind === "trueFalse") {
    renderChoiceQuestion(block, step);
  } else if (q.kind === "fillBlankTyping") {
    renderTypingBlank(block, step);
  } else if (q.kind === "fillBlankBank") {
    renderBankBlank(block, step);
  }
}

function togglePassagePreview(block, refBlock) {
  const existing = block.querySelector(".passage-box");
  if (existing) { existing.remove(); return; }
  const box = buildPassageBox(refBlock.data.passage);
  block.insertBefore(box, block.children[block.dataset.passageAnchorIndex ? Number(block.dataset.passageAnchorIndex) : 3]);
}

function renderChoiceQuestion(block, step) {
  const { q } = step;
  const prompt = document.createElement("div");
  prompt.className = "q-prompt";
  prompt.textContent = T(q.prompt.text);
  block.appendChild(prompt);

  const options = document.createElement("div");
  options.className = "option-list";

  const choices = q.kind === "trueFalse" ? ["True", "False"] : q.options;

  choices.forEach((opt, idx) => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = opt;
    btn.addEventListener("click", () => {
      [...options.children].forEach(b => b.disabled = true);
      let correct;
      if (q.kind === "trueFalse") {
        const chosenBool = idx === 0;
        correct = chosenBool === q.correctAnswer;
        btn.classList.add(correct ? "correct" : "wrong");
        if (!correct) options.children[q.correctAnswer ? 0 : 1].classList.add("correct");
      } else {
        correct = idx === q.correctIndex;
        btn.classList.add(correct ? "correct" : "wrong");
        if (!correct) options.children[q.correctIndex].classList.add("correct");
      }
      const meta = step.block.data.meta || {};
      recordAnswer({
        label: step.block.title,
        prompt: T(q.prompt.text),
        yourAnswer: opt,
        correctAnswer: q.kind === "trueFalse" ? (q.correctAnswer ? "True" : "False") : q.options[q.correctIndex],
        correct,
        explanation: T(q.explanation),
        // Step 4 enrichment — additive only. Populated when the migration
        // bridge has run (q.optionContentIds present); undefined otherwise,
        // which the (not yet migrated) Results screen simply ignores.
        contentId: q.optionContentIds ? q.optionContentIds[idx] : q.contentId,
        assignmentId: meta.assignmentId,
        activityType: meta.activityType,
        questionId: q.id,
        learningObjective: q.learningObjective || meta.learningObjective,
        contentDomain: q.contentDomain,
        language: meta.language
      });
      showExplanationAndContinue(block, q.explanation);
    });
    options.appendChild(btn);
  });
  block.appendChild(options);
}

function showExplanationAndContinue(block, explanation) {
  const exp = document.createElement("div");
  exp.className = "explanation";
  exp.textContent = T(explanation);
  block.appendChild(exp);
  block.appendChild(primaryButton("Continue", goNext));
}

function renderTypingBlank(block, step) {
  const { q } = step;
  const promptEl = document.createElement("div");
  promptEl.className = "q-prompt cjk";
  promptEl.textContent = q.promptParts.map(p => p === "__BLANK__" ? "＿＿＿" : T(p)).join("");
  block.appendChild(promptEl);

  const input = document.createElement("input");
  input.className = "blank-input cjk";
  input.placeholder = "Type your answer";
  block.appendChild(input);

  const checkBtn = primaryButton("Check", () => {
    const val = input.value.trim();
    let correct;
    if (q.validate) {
      // Step 5: validation decision now comes from the language adapter
      // (via the migration bridge), not from logic living in this engine.
      correct = q.validate(val);
    } else if (q.alwaysCorrect) {
      correct = val.length > 0;
    } else {
      correct = q.acceptedAnswers.some(a => a === "*" || a.toLowerCase() === val.toLowerCase());
    }
    input.disabled = true;
    checkBtn.disabled = true;
    const meta = step.block.data.meta || {};
    recordAnswer({
      label: step.block.title,
      prompt: promptEl.textContent,
      yourAnswer: val || "(nothing typed)",
      correctAnswer: q.alwaysCorrect ? "(any name)" : (q.acceptedAnswers ? q.acceptedAnswers[0] : undefined),
      correct,
      explanation: T(q.explanation),
      // Step 5 enrichment — additive only.
      contentId: q.contentId,
      assignmentId: meta.assignmentId,
      activityType: meta.activityType,
      questionId: q.id,
      learningObjective: q.learningObjective,
      contentDomain: q.contentDomain,
      language: meta.language
    });
    input.style.borderColor = correct ? "var(--good)" : "var(--bad)";
    showExplanationAndContinue(block, q.explanation);
  });
  block.appendChild(checkBtn);
}

function renderBankBlank(block, step) {
  const { q } = step;
  const promptEl = document.createElement("div");
  promptEl.className = "q-prompt cjk";
  block.appendChild(promptEl);

  let chosen = null;
  function draw() {
    promptEl.innerHTML = q.promptParts.map(p => {
      if (p !== "__BLANK__") return T(p);
      return `<span class="blank-slot">${chosen || "＿＿＿"}</span>`;
    }).join("");
  }
  draw();

  const bank = document.createElement("div");
  bank.className = "word-bank";
  q.bank.forEach(word => {
    const chip = document.createElement("button");
    chip.className = "bank-chip cjk";
    chip.textContent = word;
    chip.addEventListener("click", () => {
      chosen = word;
      draw();
    });
    bank.appendChild(chip);
  });
  block.appendChild(bank);

  const checkBtn = primaryButton("Check", () => {
    if (!chosen) return;
    const correct = q.validate ? q.validate(chosen) : (chosen === q.correctAnswer);
    const meta = step.block.data.meta || {};
    const chosenIdx = q.bank ? q.bank.indexOf(chosen) : -1;
    recordAnswer({
      label: step.block.title,
      prompt: promptEl.textContent,
      yourAnswer: chosen,
      correctAnswer: q.correctAnswer,
      correct,
      explanation: T(q.explanation),
      // Step 5 enrichment — additive only.
      contentId: q.bankContentIds && chosenIdx >= 0 ? q.bankContentIds[chosenIdx] : q.contentId,
      assignmentId: meta.assignmentId,
      activityType: meta.activityType,
      questionId: q.id,
      learningObjective: q.learningObjective,
      contentDomain: q.contentDomain,
      language: meta.language
    });
    [...bank.children].forEach(b => b.disabled = true);
    checkBtn.disabled = true;
    showExplanationAndContinue(block, q.explanation);
  });
  block.appendChild(checkBtn);
}

/* ---------- MATCHING (tap-to-connect, first-attempt scoring) ---------- */
function renderMatching(block, blockData) {
  blockHeader(block, blockData);
  const pairs = blockData.data.pairs;

  const grid = document.createElement("div");
  grid.className = "match-grid";
  const leftCol = document.createElement("div");
  leftCol.className = "match-col";
  const rightCol = document.createElement("div");
  rightCol.className = "match-col";
  grid.appendChild(leftCol);
  grid.appendChild(rightCol);
  block.appendChild(grid);

  const progress = document.createElement("div");
  progress.className = "match-progress";
  block.appendChild(progress);

  const continueBtn = primaryButton("Continue", goNext, true);
  block.appendChild(continueBtn);

  const shuffledRight = [...pairs].sort(() => Math.random() - 0.5);
  const firstAttemptRecorded = new Set();
  const logEntryByPair = new Map(); // pairId -> the log entry object, so later retries can increment .attempts
  let matchedCount = 0;
  let selectedLeft = null;

  function updateProgress() {
    progress.textContent = `${matchedCount} of ${pairs.length} matched`;
    continueBtn.disabled = matchedCount < pairs.length;
  }

  pairs.forEach(pair => {
    const el = document.createElement("button");
    el.className = "match-item cjk";
    el.textContent = T(pair.left);
    el.dataset.id = pair.id;
    el.addEventListener("click", () => {
      if (el.classList.contains("matched")) return;
      [...leftCol.children].forEach(b => b.classList.remove("selected"));
      el.classList.add("selected");
      selectedLeft = pair.id;
    });
    leftCol.appendChild(el);
  });

  shuffledRight.forEach(pair => {
    const el = document.createElement("button");
    el.className = "match-item";
    el.textContent = T(pair.right);
    el.dataset.id = pair.id;
    el.addEventListener("click", () => {
      if (el.classList.contains("matched") || !selectedLeft) return;
      const leftEl = leftCol.querySelector(`[data-id="${selectedLeft}"]`);
      const isCorrect = selectedLeft === pair.id;

      if (!firstAttemptRecorded.has(selectedLeft)) {
        firstAttemptRecorded.add(selectedLeft);
        const correctPair = pairs.find(p => p.id === selectedLeft);
        const meta = blockData.data.meta || {};
        const entry = recordAnswer({
          label: blockData.title,
          prompt: `Match: ${T(correctPair.left)}`,
          yourAnswer: T(pair.right),
          correctAnswer: T(correctPair.right),
          correct: isCorrect,
          explanation: "",
          // Step 3 enrichment — additive only. Populated when the migration
          // bridge has run; undefined otherwise, which the (not yet
          // migrated) Results screen simply ignores.
          contentId: correctPair.id,
          assignmentId: meta.assignmentId,
          activityType: meta.activityType,
          learningObjective: meta.learningObjective,
          contentDomain: correctPair.contentDomain,
          language: meta.language
        });
        logEntryByPair.set(selectedLeft, entry);
      } else {
        // A retry on a pair whose first attempt is already logged — the
        // SCORED correct/incorrect result stays fixed at the first try
        // (first-attempt scoring, unchanged), but we still track how many
        // tries it actually took, for future analytics.
        const entry = logEntryByPair.get(selectedLeft);
        if (entry) entry.attempts++;
      }

      if (isCorrect) {
        leftEl.classList.add("matched");
        el.classList.add("matched");
        leftEl.classList.remove("selected");
        matchedCount++;
        updateProgress();
      } else {
        el.classList.add("shake");
        leftEl.classList.add("shake");
        setTimeout(() => { el.classList.remove("shake"); leftEl.classList.remove("shake"); leftEl.classList.remove("selected"); }, 300);
      }
      selectedLeft = null;
    });
    rightCol.appendChild(el);
  });

  updateProgress();
}

/* ---------- SENTENCE ORDERING (one item per step, first-attempt scoring) ---------- */
function renderSentenceOrderItem(block, step) {
  blockHeader(block, step.block);
  const counter = document.createElement("div");
  counter.className = "block-sub";
  counter.textContent = `Sentence ${step.i + 1} of ${step.total} — ${step.item.label}`;
  block.appendChild(counter);

  const strip = document.createElement("div");
  strip.className = "assembled-strip";
  block.appendChild(strip);

  const bank = document.createElement("div");
  bank.className = "chunk-bank";
  block.appendChild(bank);

  const feedbackHost = document.createElement("div");
  block.appendChild(feedbackHost);

  let assembled = [];
  let firstCheckDone = false;
  let sentenceLogEntry = null; // holds the entry so retries can increment .attempts
  const shuffled = [...step.item.chunks].sort(() => Math.random() - 0.5);

  function renderStrip() {
    strip.innerHTML = "";
    assembled.forEach(id => {
      const c = step.item.chunks.find(ch => ch.id === id);
      const chip = document.createElement("span");
      chip.className = "chip cjk";
      chip.textContent = T(c.jp);
      strip.appendChild(chip);
    });
  }

  function renderBank() {
    bank.innerHTML = "";
    shuffled.forEach(c => {
      const chip = document.createElement("button");
      chip.className = "chunk-option cjk";
      chip.textContent = T(c.jp);
      if (assembled.includes(c.id)) chip.classList.add("used");
      chip.addEventListener("click", () => {
        if (assembled.includes(c.id)) return;
        assembled.push(c.id);
        renderStrip();
        renderBank();
        if (assembled.length === step.item.chunks.length) checkOrder();
      });
      bank.appendChild(chip);
    });
  }

  function checkOrder() {
    const correct = JSON.stringify(assembled) === JSON.stringify(step.item.correctOrder);
    if (!firstCheckDone) {
      firstCheckDone = true;
      const meta = step.block.data.meta || {};
      sentenceLogEntry = recordAnswer({
        label: step.block.title,
        prompt: step.item.label,
        yourAnswer: assembled.map(id => T(step.item.chunks.find(c => c.id === id).jp)).join(" "),
        correctAnswer: step.item.correctOrder.map(id => T(step.item.chunks.find(c => c.id === id).jp)).join(" "),
        correct,
        explanation: "",
        // Step 6 enrichment — additive only.
        contentId: step.item.sentenceContentId,
        assignmentId: meta.assignmentId,
        activityType: meta.activityType,
        questionId: step.item.id,
        contentDomain: step.item.contentDomain,
        language: meta.language
      });
    } else if (sentenceLogEntry) {
      // A retry after "Try again" — first-attempt scoring stays fixed,
      // but we track total tries taken, same pattern as Matching.
      sentenceLogEntry.attempts++;
    }
    feedbackHost.innerHTML = "";
    const line = document.createElement("div");
    line.className = "explanation";
    if (correct) {
      line.textContent = "That's right.";
      feedbackHost.appendChild(line);
      feedbackHost.appendChild(primaryButton("Continue", goNext));
    } else {
      line.textContent = "Not quite the order yet — want to try again?";
      feedbackHost.appendChild(line);
      const retryBtn = document.createElement("button");
      retryBtn.className = "btn-secondary";
      retryBtn.textContent = "Try again";
      retryBtn.addEventListener("click", () => {
        assembled = [];
        feedbackHost.innerHTML = "";
        renderStrip();
        renderBank();
      });
      feedbackHost.appendChild(retryBtn);
      // Never blocks — a skip option is always available too
      feedbackHost.appendChild(primaryButton("Continue anyway", goNext));
    }
  }

  renderStrip();
  renderBank();
}

/* ---------- READING PASSAGE ---------- */
function buildPassageBox(passage) {
  const box = document.createElement("div");
  box.className = "passage-box";
  passage.forEach(line => {
    if (line.stage) {
      const stage = document.createElement("div");
      stage.className = "passage-stage";
      stage.textContent = `(${T(line.stage)})`;
      box.appendChild(stage);
    } else {
      const row = document.createElement("div");
      row.className = "passage-line";
      row.innerHTML = `<span class="passage-speaker">${T(line.speaker)}</span><span class="passage-jp cjk">${T(line.jp)}</span>`;
      box.appendChild(row);
    }
  });
  return box;
}

function renderReading(block, blockData) {
  blockHeader(block, blockData);
  block.appendChild(buildPassageBox(blockData.data.passage));
  block.appendChild(primaryButton("Continue", goNext));
}

/* ---------- RESULTS ---------- */
function renderResults(block) {
  const scoredLog = state.log; // matching/mcq/fillBlank/sentenceOrder all recorded here
  const summary = computeSummary(scoredLog);
  const correct = summary.correctAnswers;
  const total = summary.totalQuestions;

  const hero = document.createElement("div");
  hero.className = "score-hero";
  hero.innerHTML = `
    <div class="block-title">Assignment Complete</div>
    <div class="score-number">${correct} / ${total}</div>
    <div class="score-label">correct</div>
  `;
  block.appendChild(hero);

  const wrongOnes = scoredLog.filter(e => !e.correct);
  if (wrongOnes.length) {
    const reviewTitle = document.createElement("div");
    reviewTitle.className = "block-title";
    reviewTitle.style.fontSize = "16px";
    reviewTitle.style.marginTop = "22px";
    reviewTitle.textContent = "Worth another look";
    block.appendChild(reviewTitle);

    wrongOnes.forEach(e => {
      const item = document.createElement("div");
      item.className = "review-item wrong";
      item.innerHTML = `
        <div class="review-q">${e.label}${e.prompt ? " — " + e.prompt : ""}</div>
        <div class="review-your">Your answer: <strong>${e.yourAnswer}</strong></div>
        <div class="review-correct">Correct answer: ${e.correctAnswer}</div>
        ${e.explanation ? `<div class="review-explain">${e.explanation}</div>` : ""}
      `;
      block.appendChild(item);
    });
  } else if (total > 0) {
    const perfect = document.createElement("div");
    perfect.className = "explanation";
    perfect.textContent = "Every scored question correct — nice work.";
    block.appendChild(perfect);
  }

  const restart = document.createElement("button");
  restart.className = "btn-secondary";
  restart.style.marginTop = "20px";
  restart.textContent = "Restart assignment";
  restart.addEventListener("click", () => window.location.reload());
  block.appendChild(restart);
}

// Step 2/3: wait for any registered migration-bridge readiness promises
// before the first render. Promise.all on an array that may contain
// undefined entries still resolves fine, so this works whether zero,
// one, or both bridges are present.
/* ---------- GENERIC BOOTSTRAP ----------
   Reads ?assignment=<id> from the URL (defaulting to the
   Japanese Unit 1 for backward compatibility with existing
   links), dynamically imports the content registry, the
   language registry, every prepare module, the requested
   assignment definition, and the generic assignment loader
   — then builds ASSIGNMENT.blocks generically, exactly the
   shape buildSteps() and every render function already
   expect. No per-language file, no per-activity bridge,
   no legacy skeleton. */
(async () => {
  try {
    const params = new URLSearchParams(window.location.search);
    const assignmentId = params.get("assignment") || "ja-unit1-greetings";

    const ASSIGNMENT_MODULES = {
      "ja-unit1-greetings": "./assignments/assignment-ja-unit1-greetings.js",
      "zh-unit1-greetings": "./assignments/assignment-zh-unit1-greetings.js"
    };
    const modulePath = ASSIGNMENT_MODULES[assignmentId];
    if (!modulePath) throw new Error(`Unknown assignment id in URL: "${assignmentId}"`);

    const [
      { getContent },
      { getLanguageAdapter },
      { loadAssignmentBlocks },
      { prepareFlashcard },
      { resolveMatchingPairs },
      { resolveMCQQuestion },
      { resolveAnswerInputQuestion },
      { resolveSentenceOrderItem },
      { resolveReadingPassage },
      { resolveReadingQuestion },
      { ASSIGNMENT: assignmentDef }
    ] = await Promise.all([
      import("./core/content-registry.js"),
      import("./core/language-registry.js"),
      import("./core/assignment-loader.js"),
      import("./core/prepare/flashcard-prepare.js"),
      import("./core/prepare/matching-prepare.js"),
      import("./core/prepare/mcq-prepare.js"),
      import("./core/prepare/answerinput-prepare.js"),
      import("./core/prepare/sentenceorder-prepare.js"),
      import("./core/prepare/reading-prepare.js"),
      import("./core/prepare/readingquestions-prepare.js"),
      import(modulePath)
    ]);

    const blocks = await loadAssignmentBlocks(assignmentDef, {
      getContent, getLanguageAdapter, prepareFlashcard, resolveMatchingPairs,
      resolveMCQQuestion, resolveAnswerInputQuestion, resolveSentenceOrderItem,
      resolveReadingPassage, resolveReadingQuestion
    });

    ASSIGNMENT = {
      id: assignmentDef.id, language: assignmentDef.language, domain: assignmentDef.domain,
      level: assignmentDef.level, topic: assignmentDef.topic, intro: assignmentDef.intro,
      title: assignmentDef.title, needsName: assignmentDef.needsName, blocks
    };
    getContentRef = getContent;
    document.body.dataset.lang = ASSIGNMENT.language;

    STEPS = buildSteps();
    render();
  } catch (err) {
    console.error("[engine] Failed to load assignment.", err);
    app.innerHTML = `<div class="block"><div class="block-title">Couldn't load this assignment.</div><div class="block-sub">${err.message}</div></div>`;
  }
})();
