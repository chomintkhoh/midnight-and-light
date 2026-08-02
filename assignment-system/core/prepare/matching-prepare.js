/* ══════════════════════════════════════════════
   PREPARE — Matching
   Turns a matching activity config into flat, renderable
   {id, left, right} pairs. Two supported activity shapes:

   A) Explicit (the general case — required so Matching
      is never assumed to mean "term ↔ meaning"):
        activity.pairs = [
          { left: { contentId, field }, right: { contentId, field } },
          ...
        ]

   B) Shorthand (a convenience for the common case where
      every pair in the set uses the same two fields):
        activity.contentIds = [...]
        activity.leftField = "term"
        activity.rightField = "meaning"
      This expands into shape (A) internally — nothing
      downstream needs to know which shape was authored.

   Pure functions — no DOM, no globals. Testable directly.
══════════════════════════════════════════════ */

export function resolveField(item, field, adapter) {
  if (!item) return null;
  if (field === "term" || field === "character") {
    // Routed through the language adapter's display-formatting seam —
    // today a no-op passthrough, but this is where furigana/pinyin
    // annotation will plug in later without changing this call site.
    const display = adapter.formatDisplay(item);
    return (display && display.text) || item[field] || null;
  }
  return item[field] != null ? item[field] : null;
}

export function resolveMatchingPairs(activity, { getContent, adapter }) {
  const explicitPairs = activity.pairs
    ? activity.pairs
    : activity.contentIds.map(id => ({
        left: { contentId: id, field: activity.leftField },
        right: { contentId: id, field: activity.rightField }
      }));

  return explicitPairs.map(p => {
    const leftItem = getContent(p.left.contentId);
    const rightItem = getContent(p.right.contentId);
    return {
      id: p.left.contentId,
      leftContentId: p.left.contentId,
      rightContentId: p.right.contentId,
      left: resolveField(leftItem, p.left.field, adapter),
      right: resolveField(rightItem, p.right.field, adapter)
    };
  });
}
