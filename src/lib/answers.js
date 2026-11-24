import { guideChat } from "../constants";

const normalise = (text) =>
  ` ${text
    .toLowerCase()
    .replace(/[^a-z0-9À-ɏ\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()} `;

/**
 * Picks the best answer for a visitor's question by keyword overlap with the intents in
 * portfolioData.json. Keywords match whole words or phrases; a trailing "*" makes a prefix
 * ("project*" matches "projects"). Phrases score double. Returns { id, answer, go?, cta? }.
 */
export function answer(question) {
  const q = normalise(question);
  let best = null;
  let bestScore = 0;
  for (const intent of guideChat.intents) {
    let score = 0;
    for (const kw of intent.keywords) {
      const k = kw.toLowerCase();
      // "word" and "a phrase" match whole words; "prefix*" also matches longer words.
      const hit = k.endsWith("*") ? q.includes(` ${k.slice(0, -1)}`) : q.includes(` ${k} `);
      if (hit) score += k.includes(" ") ? 2 : 1; // phrases are stronger signals
    }
    if (score > bestScore) {
      best = intent;
      bestScore = score;
    }
  }
  if (!best) return { id: "fallback", answer: guideChat.fallback, cta: "contact" };
  return { id: best.id, answer: best.answer, go: best.go, cta: best.cta };
}
