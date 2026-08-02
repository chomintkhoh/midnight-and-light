/* ══════════════════════════════════════════════
   PREPARE — Reading Questions
   Deliberately thin: reuses resolveMCQQuestion and
   resolveAnswerInputQuestion rather than duplicating
   question-generation logic (your requirement #6 —
   "reuse shared activity engines where appropriate").

   A reading question is NOT assumed to always be a
   vocabulary question — contentDomain is resolved from
   whatever content item the question actually anchors to
   (a vocabulary item, or the reading passage itself for a
   sequence/comprehension question), never assumed.
══════════════════════════════════════════════ */

import { resolveMCQQuestion } from "./mcq-prepare.js";
import { resolveAnswerInputQuestion } from "./answerinput-prepare.js";

function resolveContentDomain(contentId, getContent) {
  if (!contentId) return null;
  const item = getContent(contentId);
  return item ? item.domain : null;
}

export function resolveReadingQuestion(q, { getContent, adapter }) {
  if (q.kind === "mcq") {
    const r = resolveMCQQuestion(q, { getContent, adapter });
    return {
      ...r,
      kind: "mcq",
      learningObjective: q.learningObjective || null,
      contentDomain: resolveContentDomain(r.correctContentId, getContent)
    };
  }

  if (q.kind === "trueFalse") {
    return {
      id: q.id,
      kind: "trueFalse",
      promptText: q.promptText,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      learningObjective: q.learningObjective || null,
      contentId: q.contentId || null,
      contentDomain: resolveContentDomain(q.contentId, getContent)
    };
  }

  if (q.kind === "answerInput") {
    const r = resolveAnswerInputQuestion({ ...q, questionId: q.id, mode: q.mode || "typing" }, { getContent, adapter });
    return {
      ...r,
      kind: "fillBlankTyping",
      learningObjective: q.learningObjective || null,
      contentDomain: resolveContentDomain(q.contentId, getContent)
    };
  }

  console.warn(`[readingquestions-prepare] Unknown question kind: "${q.kind}"`);
  return null;
}
