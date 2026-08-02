/* ══════════════════════════════════════════════
   ASSIGNMENT LOADER — genuinely generic.
   Takes any assignment-definition module and produces
   the `blocks[]` array the existing renderers already
   expect — the SAME shape the old per-step bridge files
   used to produce by patching a hardcoded legacy skeleton.

   This is the piece that replaces that indirection:
   no legacy skeleton, no bridges, no per-language HTML
   file. One function, any language, any assignment that
   follows the established assignment-definition format.

   Nothing in this file branches on `language` — every
   language-specific decision is delegated to whichever
   adapter getLanguageAdapter(assignment.language) returns.
══════════════════════════════════════════════ */

const GENERIC_DISPLAY = {
  fillBlank: { title: "Complete the phrase", eyebrow: "Practice · Step 3–4", sub: "Some you'll type yourself, some you'll pick from a word bank." },
  sentenceOrder: { title: "Put it in order", eyebrow: "Practice · Step 5", sub: "Tap the pieces in the order that feels right." }
};

export async function loadAssignmentBlocks(ASSIGNMENT, deps) {
  const {
    getContent, getLanguageAdapter,
    prepareFlashcard, resolveMatchingPairs, resolveMCQQuestion,
    resolveAnswerInputQuestion, resolveSentenceOrderItem,
    resolveReadingPassage, resolveReadingQuestion
  } = deps;

  const adapter = getLanguageAdapter(ASSIGNMENT.language);
  const meta = (activityType, learningObjective) => ({
    assignmentId: ASSIGNMENT.id, activityType,
    learningObjective: learningObjective || null,
    domain: ASSIGNMENT.domain, language: ASSIGNMENT.language
  });

  const blocks = [];
  const answerInputActivities = [];
  const sentenceOrderActivities = [];
  let readingActivity = null;
  let readingQuestionsActivity = null;

  ASSIGNMENT.activities.forEach(activity => {
    if (activity.type === "answerInput") { answerInputActivities.push(activity); return; }
    if (activity.type === "sentenceOrdering") { sentenceOrderActivities.push(activity); return; }
    if (activity.type === "reading") { readingActivity = activity; return; }
    if (activity.type === "readingQuestions") { readingQuestionsActivity = activity; return; }
  });

  // 1. Flashcards
  const flashActivity = ASSIGNMENT.activities.find(a => a.type === "flashcards");
  if (flashActivity) {
    const cards = flashActivity.contentIds
      .map(id => { const item = getContent(id); return item ? prepareFlashcard(item, { adapter }) : null; })
      .filter(Boolean);
    blocks.push({ id: "b1", type: "flashcards", scored: false, ...flashActivity.display, data: { cards } });
  }

  // 2. Multiple Choice
  const mcActivity = ASSIGNMENT.activities.find(a => a.type === "multipleChoice");
  if (mcActivity) {
    const questions = mcActivity.questions.map(q => {
      const r = resolveMCQQuestion(q, { getContent, adapter });
      return {
        id: r.id, kind: "mcq", prompt: { text: r.promptText }, options: r.options,
        correctIndex: r.correctIndex, explanation: r.explanation,
        optionContentIds: r.optionContentIds, contentDomain: r.contentDomain,
        learningObjective: mcActivity.learningObjective
      };
    });
    blocks.push({ id: "b2", type: "multipleChoice", scored: true, ...mcActivity.display,
      data: { questions, meta: meta("multipleChoice", mcActivity.learningObjective) } });
  }

  // 3. Matching
  const matchActivity = ASSIGNMENT.activities.find(a => a.type === "matching");
  if (matchActivity) {
    const pairs = resolveMatchingPairs(matchActivity, { getContent, adapter });
    blocks.push({ id: "b3", type: "matching", scored: true, ...matchActivity.display,
      data: { pairs, meta: meta("matching", matchActivity.learningObjective) } });
  }

  // 4. Answer Input (grouped — the assignment-definition format lists these as
  //    separate top-level activities; the shared renderer expects one block).
  if (answerInputActivities.length) {
    const questions = answerInputActivities.map(a => {
      const r = resolveAnswerInputQuestion(a, { getContent, adapter });
      const validate = (input) => adapter.validateAnswer(input, {
        acceptedAnswers: r.kind === "fillBlankBank" ? [r.correctAnswer] : r.acceptedAnswers,
        alwaysCorrect: r.alwaysCorrect, validationMode: a.validationMode
      });
      return {
        id: r.id, kind: r.kind, promptParts: r.promptParts, alwaysCorrect: r.alwaysCorrect,
        acceptedAnswers: r.acceptedAnswers, bank: r.bank, correctAnswer: r.correctAnswer,
        explanation: r.explanation, validate, contentId: r.contentId,
        bankContentIds: r.bankContentIds, correctBankContentId: r.correctBankContentId,
        learningObjective: a.learningObjective
      };
    });
    blocks.push({ id: "b4", type: "fillBlank", scored: true, ...GENERIC_DISPLAY.fillBlank,
      data: { questions, meta: meta("answerInput", null) } });
  }

  // 5. Sentence Ordering (grouped, same reasoning as Answer Input)
  if (sentenceOrderActivities.length) {
    const items = sentenceOrderActivities.map(a => {
      const sentenceItem = getContent(a.contentId);
      const r = resolveSentenceOrderItem(sentenceItem, { getContent, adapter });
      return { id: r.id, label: r.label, chunks: r.chunks, correctOrder: r.correctOrder,
        sentenceContentId: a.contentId, contentDomain: sentenceItem ? sentenceItem.domain : null };
    });
    blocks.push({ id: "b5", type: "sentenceOrder", scored: true, ...GENERIC_DISPLAY.sentenceOrder,
      data: { items, meta: meta("sentenceOrdering", null) } });
  }

  // 6. Reading
  if (readingActivity) {
    const passage = resolveReadingPassage(getContent(readingActivity.contentId), { getContent, adapter });
    blocks.push({ id: "b6", type: "reading", scored: false, ...readingActivity.display, data: { passage: passage.lines } });
  }

  // 7. Reading Questions — passageRef points at the reading block's own id (b6),
  //    exactly matching how the "Review the Passage" toggle already looks it up.
  if (readingQuestionsActivity) {
    const questions = readingQuestionsActivity.questions.map(q => {
      const r = resolveReadingQuestion(q, { getContent, adapter });
      if (r.kind === "mcq") {
        return { id: r.id, kind: "mcq", prompt: { text: r.promptText }, options: r.options,
          correctIndex: r.correctIndex, explanation: r.explanation, optionContentIds: r.optionContentIds,
          contentDomain: r.contentDomain, learningObjective: r.learningObjective };
      }
      if (r.kind === "trueFalse") {
        return { id: r.id, kind: "trueFalse", prompt: { text: r.promptText }, correctAnswer: r.correctAnswer,
          explanation: r.explanation, contentId: r.contentId, contentDomain: r.contentDomain, learningObjective: r.learningObjective };
      }
      return { id: r.id, kind: "fillBlankTyping", promptParts: r.promptParts, acceptedAnswers: r.acceptedAnswers,
        alwaysCorrect: r.alwaysCorrect, explanation: r.explanation,
        validate: (input) => adapter.validateAnswer(input, { acceptedAnswers: r.acceptedAnswers, alwaysCorrect: r.alwaysCorrect }),
        contentId: r.contentId, contentDomain: r.contentDomain, learningObjective: r.learningObjective };
    });
    blocks.push({ id: "b7", type: "readingQuestions", scored: true, passageRef: "b6", ...readingQuestionsActivity.display,
      data: { questions, meta: meta("readingQuestions", null) } });
  }

  return blocks;
}
