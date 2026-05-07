/**
 * Constants for sentiment analysis configuration
 */

// Analysis Configuration
export const ANALYSIS_CONFIG = {
  MAX_TEXT_LENGTH: 10000,
  MIN_TEXT_LENGTH: 10,
  TIMEOUT_MS: 500,
  NEGATION_WINDOW: 3, // Check 3 words before keyword
  MODIFIER_WINDOW: 2, // Check 2 words before keyword
};

// Scoring Configuration
export const SCORING_CONFIG = {
  BASE_MULTIPLIER: 20, // Multiply weighted sum by this
  FREQUENCY_BONUS_MULTIPLIER: 10,
  MIN_SCORE: 0,
  MAX_SCORE: 100,
  NEUTRAL_SCORE: 50,
};

// Confidence Levels
export const CONFIDENCE_LEVELS = {
  HIGH: 'high', // 5+ keyword matches
  MEDIUM: 'medium', // 2-4 keyword matches
  LOW: 'low', // 1 keyword match
  VERY_LOW: 'very_low', // 0 keyword matches
};

export const CONFIDENCE_THRESHOLDS = {
  HIGH: 5,
  MEDIUM: 2,
  LOW: 1,
};

// Mood Classification Thresholds
export const MOOD_THRESHOLDS = {
  HIGH: 70,
  MEDIUM: 40,
  LOW: 30,
};

// Productivity Classification
export const PRODUCTIVITY_LEVELS = {
  HIGH: 'High',
  MEDIUM: 'Medium',
  LOW: 'Low',
};

export const PRODUCTIVITY_THRESHOLDS = {
  HIGH: 70,
  MEDIUM: 40,
};

// Focus Classification
export const FOCUS_LEVELS = {
  EXCELLENT: 'Excellent',
  GOOD: 'Good',
  IMPROVING: 'Improving',
  NEEDS_WORK: 'Needs Work',
};

export const FOCUS_THRESHOLDS = {
  EXCELLENT: 80,
  GOOD: 60,
  IMPROVING: 40,
};

// Pattern Detection Thresholds
export const PATTERN_THRESHOLDS = {
  BURNOUT: { stress: 70, motivation: 40 },
  OVERWHELM: { stress: 70, focus: 40 },
  DISENGAGEMENT: { motivation: 40, productivity: 40 },
  SELF_DOUBT: { confidence: 40, motivation: 40 },
  ANXIETY: { stress: 70, confidence: 40 },
  DISTRACTION: { productivity: 40, focus: 40 },
  HIGH_STRESS: { stress: 70 },
  LOW_MOTIVATION: { motivation: 40 },
  LOW_CONFIDENCE: { confidence: 40 },
  LOW_PRODUCTIVITY: { productivity: 40 },
  LOW_FOCUS: { focus: 40 },
};

// Suggestion Limits
export const SUGGESTION_CONFIG = {
  MIN_SUGGESTIONS: 3,
  MAX_SUGGESTIONS: 5,
  PATTERN_SUGGESTIONS_PER_PATTERN: 2,
  STANDALONE_SUGGESTIONS: 1,
};

// Text Preprocessing
export const CONTRACTIONS = {
  "i'm": 'i am',
  "i've": 'i have',
  "i'll": 'i will',
  "i'd": 'i would',
  "you're": 'you are',
  "you've": 'you have',
  "you'll": 'you will',
  "you'd": 'you would',
  "he's": 'he is',
  "she's": 'she is',
  "it's": 'it is',
  "we're": 'we are',
  "we've": 'we have',
  "we'll": 'we will',
  "we'd": 'we would',
  "they're": 'they are',
  "they've": 'they have',
  "they'll": 'they will',
  "they'd": 'they would',
  "that's": 'that is',
  "what's": 'what is',
  "who's": 'who is',
  "where's": 'where is',
  "when's": 'when is',
  "why's": 'why is',
  "how's": 'how is',
  "can't": 'cannot',
  "won't": 'will not',
  "don't": 'do not',
  "doesn't": 'does not',
  "didn't": 'did not',
  "isn't": 'is not',
  "aren't": 'are not',
  "wasn't": 'was not',
  "weren't": 'were not',
  "haven't": 'have not',
  "hasn't": 'has not',
  "hadn't": 'had not',
  "wouldn't": 'would not',
  "shouldn't": 'should not',
  "couldn't": 'could not',
};
