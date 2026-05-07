import { KEYWORD_MAP } from './config/keywords.js';
import { NEGATION_SET, MODIFIER_MAP } from './config/modifiers.js';
import {
  ANALYSIS_CONFIG,
  CONTRACTIONS,
} from './config/constants.js';

/**
 * KeywordDetectionModule
 * Detects emotion keywords in text with context awareness (negations, modifiers)
 */
export class KeywordDetectionModule {
  /**
   * Preprocess text: lowercase, expand contractions, normalize
   * @param {string} text - Raw input text
   * @returns {string} Preprocessed text
   */
  preprocessText(text) {
    if (!text || typeof text !== 'string') return '';

    let processed = text.toLowerCase().trim();

    // Expand contractions
    Object.entries(CONTRACTIONS).forEach(([contraction, expansion]) => {
      const regex = new RegExp(`\\b${contraction}\\b`, 'gi');
      processed = processed.replace(regex, expansion);
    });

    // Normalize whitespace
    processed = processed.replace(/\s+/g, ' ');

    return processed;
  }

  /**
   * Tokenize text into words
   * @param {string} text - Preprocessed text
   * @returns {string[]} Array of words
   */
  tokenize(text) {
    if (!text) return [];
    // Remove punctuation and split
    return text
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter((word) => word.length > 0);
  }

  /**
   * Check for negation in previous words
   * @param {string[]} words - All words
   * @param {number} index - Current word index
   * @returns {boolean} True if negated
   */
  isNegated(words, index) {
    const windowStart = Math.max(0, index - ANALYSIS_CONFIG.NEGATION_WINDOW);
    const previousWords = words.slice(windowStart, index);

    return previousWords.some((word) => NEGATION_SET.has(word));
  }

  /**
   * Check for intensity modifier in previous words
   * @param {string[]} words - All words
   * @param {number} index - Current word index
   * @returns {number} Modifier multiplier (1.0 if none)
   */
  getIntensityModifier(words, index) {
    const windowStart = Math.max(0, index - ANALYSIS_CONFIG.MODIFIER_WINDOW);
    const previousWords = words.slice(windowStart, index);

    for (const word of previousWords) {
      if (MODIFIER_MAP.has(word)) {
        return MODIFIER_MAP.get(word);
      }
    }

    return 1.0; // No modifier
  }

  /**
   * Detect keywords in text with context
   * @param {string} text - Input text
   * @param {boolean} simplifiedMode - Skip negations/modifiers for performance
   * @returns {Object} Detection results
   */
  detectKeywords(text, simplifiedMode = false) {
    try {
      // Preprocess and tokenize
      const processed = this.preprocessText(text);
      const words = this.tokenize(processed);

      const detectedKeywords = [];
      const categoryCounts = {};

      // Scan for keywords
      words.forEach((word, index) => {
        if (KEYWORD_MAP.has(word)) {
          const keywordData = KEYWORD_MAP.get(word);
          let adjustedWeight = keywordData.weight;

          // Apply context (unless simplified mode)
          let isNegated = false;
          let intensityModifier = 1.0;

          if (!simplifiedMode) {
            isNegated = this.isNegated(words, index);
            intensityModifier = this.getIntensityModifier(words, index);

            // Apply negation (invert weight)
            if (isNegated) {
              adjustedWeight = -adjustedWeight;
            }

            // Apply intensity modifier
            adjustedWeight = adjustedWeight * intensityModifier;
          }

          // Store detected keyword
          detectedKeywords.push({
            word,
            category: keywordData.category,
            originalWeight: keywordData.weight,
            adjustedWeight,
            isNegated,
            intensityModifier,
            sentiment: keywordData.sentiment,
          });

          // Update category counts
          const category = keywordData.category;
          categoryCounts[category] = (categoryCounts[category] || 0) + 1;
        }
      });

      return {
        keywords: detectedKeywords,
        totalMatches: detectedKeywords.length,
        categoryCounts,
        wordCount: words.length,
      };
    } catch (error) {
      console.error('Error in keyword detection:', error);
      return {
        keywords: [],
        totalMatches: 0,
        categoryCounts: {},
        wordCount: 0,
      };
    }
  }
}
