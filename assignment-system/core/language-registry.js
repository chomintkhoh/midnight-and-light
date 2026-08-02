/* ══════════════════════════════════════════════
   LANGUAGE REGISTRY — the one lookup interface
   for language-specific adapters. Shared engines
   call getLanguageAdapter(language) instead of ever
   branching on a language string themselves.
══════════════════════════════════════════════ */

import { adapter as jaAdapter } from "../languages/ja/adapter.js";
import { adapter as zhAdapter } from "../languages/zh/adapter.js";

const ADAPTERS = { ja: jaAdapter, zh: zhAdapter };

export function getLanguageAdapter(language) {
  const adapter = ADAPTERS[language];
  if (!adapter) {
    console.warn(`[language-registry] No adapter registered for language: "${language}"`);
    return null;
  }
  return adapter;
}
