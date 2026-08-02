/* ══════════════════════════════════════════════
   PREPARE — Answer Input (typing + word bank)
   Pure data resolution only. Deliberately does NOT
   decide how an answer gets validated — that stays
   a separate concern, routed through the language
   adapter at the point of checking (see the Step 5
   migration bridge), never hardcoded here or in the
   shared core engine.

   Distinguishes, per your requirement:
     - the content item        (getContent(contentId))
     - the displayed prompt    (promptParts)
     - the expected answer     (bank's correct entry, or acceptedAnswers[0])
     - acceptable answers      (acceptedAnswers[] — plural, not one string)
     - alwaysCorrect           (self-expression items — no real "expected" answer)
══════════════════════════════════════════════ */

import { resolveField } from "./matching-prepare.js";

export function resolveAnswerInputQuestion(activity, { getContent, adapter }) {
  const kind = activity.mode === "wordBank" ? "fillBlankBank" : "fillBlankTyping";

  const base = {
    id: activity.questionId,
    kind,
    promptParts: activity.promptParts,
    explanation: activity.explanation,
    alwaysCorrect: !!activity.alwaysCorrect,
    contentId: activity.contentId || null
  };

  if (kind === "fillBlankTyping") {
    // Literal acceptedAnswers today (fragments like "しゃい" aren't a content
    // item's full term) — acceptedAnswerRefs (content-resolved) supported
    // for future cases where the accepted answer IS a whole content item.
    let acceptedAnswers = activity.acceptedAnswers || null;
    if (!acceptedAnswers && activity.acceptedAnswerRefs) {
      acceptedAnswers = activity.acceptedAnswerRefs.map(ref => {
        const item = getContent(ref.contentId);
        return resolveField(item, ref.field, adapter);
      });
    }
    return { ...base, acceptedAnswers };
  }

  // fillBlankBank
  const bankTexts = activity.bank.map(b =>
    b.text != null ? b.text : (b.bankText || resolveField(getContent(b.contentId), b.field || "term", adapter))
  );
  const bankContentIds = activity.bank.map(b => b.contentId || null);
  const correctIdx = activity.correctBankIndex || 0;

  return {
    ...base,
    bank: bankTexts,
    bankContentIds,
    correctAnswer: bankTexts[correctIdx],
    correctBankContentId: bankContentIds[correctIdx]
  };
}
