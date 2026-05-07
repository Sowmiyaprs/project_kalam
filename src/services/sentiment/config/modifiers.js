/**
 * Negations and intensity modifiers for context-aware analysis
 */

export const NEGATIONS = [
  'not',
  'no',
  'never',
  'neither',
  'nobody',
  'nothing',
  'nowhere',
  'none',
  "don't",
  "doesn't",
  "didn't",
  "won't",
  "wouldn't",
  "shouldn't",
  "couldn't",
  "can't",
  "cannot",
  "isn't",
  "aren't",
  "wasn't",
  "weren't",
  "haven't",
  "hasn't",
  "hadn't",
];

export const INTENSITY_MODIFIERS = {
  // Amplifiers (increase weight)
  very: 1.5,
  extremely: 2.0,
  incredibly: 2.0,
  really: 1.5,
  absolutely: 2.0,
  completely: 1.8,
  totally: 1.8,
  utterly: 2.0,
  highly: 1.5,
  deeply: 1.5,
  intensely: 1.8,
  severely: 1.8,
  profoundly: 2.0,

  // Diminishers (decrease weight)
  slightly: 0.5,
  somewhat: 0.6,
  fairly: 0.7,
  rather: 0.7,
  quite: 0.8,
  pretty: 0.7,
  kind: 0.6,
  sort: 0.6,
  little: 0.5,
  bit: 0.5,
  barely: 0.3,
  hardly: 0.3,
  scarcely: 0.3,
};

// Create sets for faster lookups
export const NEGATION_SET = new Set(NEGATIONS);
export const MODIFIER_MAP = new Map(Object.entries(INTENSITY_MODIFIERS));
