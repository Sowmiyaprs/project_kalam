/**
 * Keyword dictionary for sentiment analysis
 * Each keyword has a category, weight, and optional variations
 */

export const KEYWORDS = {
  // Positive Mood Keywords
  happy: { category: 'mood', weight: 5, sentiment: 'positive' },
  joyful: { category: 'mood', weight: 5, sentiment: 'positive' },
  excited: { category: 'mood', weight: 4, sentiment: 'positive' },
  content: { category: 'mood', weight: 3, sentiment: 'positive' },
  pleased: { category: 'mood', weight: 3, sentiment: 'positive' },
  cheerful: { category: 'mood', weight: 4, sentiment: 'positive' },
  delighted: { category: 'mood', weight: 5, sentiment: 'positive' },
  grateful: { category: 'mood', weight: 4, sentiment: 'positive' },
  optimistic: { category: 'mood', weight: 4, sentiment: 'positive' },
  hopeful: { category: 'mood', weight: 3, sentiment: 'positive' },

  // Negative Mood Keywords
  sad: { category: 'mood', weight: -5, sentiment: 'negative' },
  unhappy: { category: 'mood', weight: -4, sentiment: 'negative' },
  depressed: { category: 'mood', weight: -5, sentiment: 'negative' },
  miserable: { category: 'mood', weight: -5, sentiment: 'negative' },
  disappointed: { category: 'mood', weight: -3, sentiment: 'negative' },
  upset: { category: 'mood', weight: -4, sentiment: 'negative' },
  down: { category: 'mood', weight: -3, sentiment: 'negative' },
  gloomy: { category: 'mood', weight: -4, sentiment: 'negative' },
  lonely: { category: 'mood', weight: -4, sentiment: 'negative' },
  hopeless: { category: 'mood', weight: -5, sentiment: 'negative' },

  // Calm Mood Keywords
  calm: { category: 'mood', weight: 4, sentiment: 'calm' },
  peaceful: { category: 'mood', weight: 4, sentiment: 'calm' },
  relaxed: { category: 'mood', weight: 4, sentiment: 'calm' },
  serene: { category: 'mood', weight: 5, sentiment: 'calm' },
  tranquil: { category: 'mood', weight: 4, sentiment: 'calm' },
  composed: { category: 'mood', weight: 3, sentiment: 'calm' },

  // Stress Keywords
  stressed: { category: 'stress', weight: 5, sentiment: 'negative' },
  anxious: { category: 'stress', weight: 5, sentiment: 'negative' },
  worried: { category: 'stress', weight: 4, sentiment: 'negative' },
  overwhelmed: { category: 'stress', weight: 5, sentiment: 'negative' },
  tense: { category: 'stress', weight: 4, sentiment: 'negative' },
  nervous: { category: 'stress', weight: 4, sentiment: 'negative' },
  panicked: { category: 'stress', weight: 5, sentiment: 'negative' },
  frantic: { category: 'stress', weight: 5, sentiment: 'negative' },
  pressure: { category: 'stress', weight: 3, sentiment: 'negative' },
  burden: { category: 'stress', weight: 4, sentiment: 'negative' },

  // Motivation Keywords
  motivated: { category: 'motivation', weight: 5, sentiment: 'positive' },
  driven: { category: 'motivation', weight: 5, sentiment: 'positive' },
  determined: { category: 'motivation', weight: 4, sentiment: 'positive' },
  ambitious: { category: 'motivation', weight: 4, sentiment: 'positive' },
  inspired: { category: 'motivation', weight: 5, sentiment: 'positive' },
  energized: { category: 'motivation', weight: 4, sentiment: 'positive' },
  enthusiastic: { category: 'motivation', weight: 5, sentiment: 'positive' },
  passionate: { category: 'motivation', weight: 5, sentiment: 'positive' },
  unmotivated: { category: 'motivation', weight: -5, sentiment: 'negative' },
  lazy: { category: 'motivation', weight: -4, sentiment: 'negative' },
  apathetic: { category: 'motivation', weight: -5, sentiment: 'negative' },
  indifferent: { category: 'motivation', weight: -3, sentiment: 'negative' },

  // Confidence Keywords
  confident: { category: 'confidence', weight: 5, sentiment: 'positive' },
  assured: { category: 'confidence', weight: 4, sentiment: 'positive' },
  capable: { category: 'confidence', weight: 4, sentiment: 'positive' },
  strong: { category: 'confidence', weight: 4, sentiment: 'positive' },
  empowered: { category: 'confidence', weight: 5, sentiment: 'positive' },
  insecure: { category: 'confidence', weight: -5, sentiment: 'negative' },
  doubtful: { category: 'confidence', weight: -4, sentiment: 'negative' },
  uncertain: { category: 'confidence', weight: -3, sentiment: 'negative' },
  inadequate: { category: 'confidence', weight: -5, sentiment: 'negative' },
  weak: { category: 'confidence', weight: -4, sentiment: 'negative' },

  // Productivity Keywords
  productive: { category: 'productivity', weight: 5, sentiment: 'positive' },
  accomplished: { category: 'productivity', weight: 5, sentiment: 'positive' },
  efficient: { category: 'productivity', weight: 4, sentiment: 'positive' },
  focused: { category: 'productivity', weight: 4, sentiment: 'positive' },
  organized: { category: 'productivity', weight: 3, sentiment: 'positive' },
  completed: { category: 'productivity', weight: 4, sentiment: 'positive' },
  achieved: { category: 'productivity', weight: 5, sentiment: 'positive' },
  unproductive: { category: 'productivity', weight: -5, sentiment: 'negative' },
  procrastinating: { category: 'productivity', weight: -5, sentiment: 'negative' },
  distracted: { category: 'productivity', weight: -4, sentiment: 'negative' },
  stuck: { category: 'productivity', weight: -4, sentiment: 'negative' },

  // Focus Keywords
  concentrated: { category: 'focus', weight: 5, sentiment: 'positive' },
  attentive: { category: 'focus', weight: 4, sentiment: 'positive' },
  alert: { category: 'focus', weight: 4, sentiment: 'positive' },
  engaged: { category: 'focus', weight: 4, sentiment: 'positive' },
  scattered: { category: 'focus', weight: -4, sentiment: 'negative' },
  unfocused: { category: 'focus', weight: -5, sentiment: 'negative' },
  confused: { category: 'focus', weight: -4, sentiment: 'negative' },
  foggy: { category: 'focus', weight: -3, sentiment: 'negative' },
};

// Create hash map for O(1) lookups
export const KEYWORD_MAP = new Map(Object.entries(KEYWORDS));

// Category mappings
export const CATEGORY_METRICS = {
  mood: ['mood', 'stress'],
  stress: ['stress'],
  motivation: ['motivation'],
  confidence: ['confidence'],
  productivity: ['productivity'],
  focus: ['focus'],
};
