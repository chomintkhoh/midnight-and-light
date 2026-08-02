import { VOCAB } from "../content/ja/vocabulary/unit1-greetings.js";
import { SENTENCES } from "../content/ja/sentences/unit1-greetings.js";
import { READING } from "../content/ja/reading/unit1-day1.js";
import { JA_VOCAB_PILOT } from "../content/ja/vocabulary/pilot.js";
import { JA_KANJI_PILOT } from "../content/ja/kanji/pilot.js";
import { ZH_RADICAL_PILOT } from "../content/zh/radicals/pilot.js";
import { ZH_CHARACTER_PILOT } from "../content/zh/characters/pilot.js";
import { ZH_VOCAB_PILOT } from "../content/zh/vocabulary/pilot.js";
import { ZH_RADICAL_UNIT1 } from "../content/zh/radicals/unit1-greetings.js";
import { ZH_CHARACTER_UNIT1 } from "../content/zh/characters/unit1-greetings.js";
import { ZH_VOCAB_UNIT1 } from "../content/zh/vocabulary/unit1-greetings.js";
import { ZH_SENTENCES_UNIT1 } from "../content/zh/sentences/unit1-greetings.js";
import { ZH_READING_UNIT1 } from "../content/zh/reading/unit1-greeting.js";

const REGISTRY = {
  ...VOCAB, ...SENTENCES, ...READING,
  ...JA_VOCAB_PILOT, ...JA_KANJI_PILOT,
  ...ZH_RADICAL_PILOT, ...ZH_CHARACTER_PILOT, ...ZH_VOCAB_PILOT,
  ...ZH_RADICAL_UNIT1, ...ZH_CHARACTER_UNIT1, ...ZH_VOCAB_UNIT1, ...ZH_SENTENCES_UNIT1, ...ZH_READING_UNIT1
};

export function getContent(id) {
  const item = REGISTRY[id];
  if (!item) {
    console.warn(`[content-registry] Unknown content id: "${id}"`);
    return null;
  }
  return item;
}

export function getAllContent() {
  return REGISTRY;
}

export function listContentIds() {
  return Object.keys(REGISTRY);
}
