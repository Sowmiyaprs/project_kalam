/**
 * UI constants and mappings
 */

export const MOOD_EMOJI_MAP = {
  Happy: '😊',
  Energized: '⚡',
  Sad: '😢',
  Stressed: '😰',
  Anxious: '😟',
  Overwhelmed: '😵',
  Motivated: '💪',
  Calm: '😌',
  Neutral: '😐',
  Uncertain: '🤔',
};

export const METRIC_COLOR_MAP = {
  High: 'text-green-400',
  Medium: 'text-yellow-400',
  Low: 'text-red-400',
};

export const MOOD_COLOR_MAP = {
  Happy: 'text-green-400',
  Energized: 'text-yellow-300',
  Sad: 'text-blue-400',
  Stressed: 'text-red-400',
  Anxious: 'text-orange-400',
  Overwhelmed: 'text-red-500',
  Motivated: 'text-purple-400',
  Calm: 'text-blue-300',
  Neutral: 'text-gray-400',
  Uncertain: 'text-yellow-400',
};

export const VALIDATION_CONSTANTS = {
  MIN_TEXT_LENGTH: 10,
  MAX_TEXT_LENGTH: 10000,
  WARNING_THRESHOLD_90: 0.9,
  WARNING_THRESHOLD_95: 0.95,
};

export const ANIMATION_CONSTANTS = {
  FADE_DURATION: 300,
  SLIDE_DURATION: 300,
  STAGGER_DELAY: 100,
  DEBOUNCE_INPUT: 300,
  DEBOUNCE_VALIDATION: 500,
};

export const RESPONSIVE_CONSTANTS = {
  MOBILE_BREAKPOINT: 640,
  TABLET_BREAKPOINT: 1024,
  DESKTOP_BREAKPOINT: 1280,
};
