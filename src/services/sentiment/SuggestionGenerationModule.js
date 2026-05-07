import { SUGGESTIONS } from './config/suggestions.js';
import {
  PATTERN_THRESHOLDS,
  SUGGESTION_CONFIG,
} from './config/constants.js';

/**
 * SuggestionGenerationModule
 * Generates personalized suggestions based on detected patterns
 */
export class SuggestionGenerationModule {
  /**
   * Identify patterns from scores
   * @param {Object} scores - Metric scores
   * @returns {Array} Detected patterns
   */
  identifyPatterns(scores) {
    const patterns = [];
    const { stress, motivation, confidence, productivity, focus } =
      scores.emotional && scores.productivity
        ? {
            stress: scores.emotional.stressLevel,
            motivation: scores.emotional.motivation,
            confidence: scores.emotional.confidence,
            productivity: scores.productivity.productivityScore,
            focus: scores.productivity.focusScore,
          }
        : scores;

    // Check for complex patterns first
    if (
      stress > PATTERN_THRESHOLDS.BURNOUT.stress &&
      motivation < PATTERN_THRESHOLDS.BURNOUT.motivation
    ) {
      patterns.push('burnout');
    }

    if (
      stress > PATTERN_THRESHOLDS.OVERWHELM.stress &&
      focus < PATTERN_THRESHOLDS.OVERWHELM.focus
    ) {
      patterns.push('overwhelm');
    }

    if (
      motivation < PATTERN_THRESHOLDS.DISENGAGEMENT.motivation &&
      productivity < PATTERN_THRESHOLDS.DISENGAGEMENT.productivity
    ) {
      patterns.push('disengagement');
    }

    if (
      confidence < PATTERN_THRESHOLDS.SELF_DOUBT.confidence &&
      motivation < PATTERN_THRESHOLDS.SELF_DOUBT.motivation
    ) {
      patterns.push('selfDoubt');
    }

    if (
      stress > PATTERN_THRESHOLDS.ANXIETY.stress &&
      confidence < PATTERN_THRESHOLDS.ANXIETY.confidence
    ) {
      patterns.push('anxiety');
    }

    if (
      productivity < PATTERN_THRESHOLDS.DISTRACTION.productivity &&
      focus < PATTERN_THRESHOLDS.DISTRACTION.focus
    ) {
      patterns.push('distraction');
    }

    // Check for standalone issues (if no complex patterns)
    if (patterns.length === 0) {
      if (stress > PATTERN_THRESHOLDS.HIGH_STRESS.stress) {
        patterns.push('highStress');
      }
      if (motivation < PATTERN_THRESHOLDS.LOW_MOTIVATION.motivation) {
        patterns.push('lowMotivation');
      }
      if (confidence < PATTERN_THRESHOLDS.LOW_CONFIDENCE.confidence) {
        patterns.push('lowConfidence');
      }
      if (productivity < PATTERN_THRESHOLDS.LOW_PRODUCTIVITY.productivity) {
        patterns.push('lowProductivity');
      }
      if (focus < PATTERN_THRESHOLDS.LOW_FOCUS.focus) {
        patterns.push('lowFocus');
      }
    }

    return patterns;
  }

  /**
   * Select suggestions based on patterns
   * @param {Array} patterns - Detected patterns
   * @returns {Array} Selected suggestions
   */
  selectSuggestions(patterns) {
    const selectedSuggestions = [];
    const usedSuggestions = new Set();

    // Add pattern-specific suggestions
    patterns.forEach((pattern) => {
      const patternSuggestions = SUGGESTIONS[pattern] || [];
      const available = patternSuggestions.filter(
        (s) => !usedSuggestions.has(s)
      );

      // Add up to 2 suggestions per pattern
      const count = Math.min(
        available.length,
        SUGGESTION_CONFIG.PATTERN_SUGGESTIONS_PER_PATTERN
      );
      for (let i = 0; i < count; i++) {
        const suggestion = available[i];
        selectedSuggestions.push(suggestion);
        usedSuggestions.add(suggestion);
      }
    });

    // If no patterns or too few suggestions, add general suggestions
    if (selectedSuggestions.length < SUGGESTION_CONFIG.MIN_SUGGESTIONS) {
      const generalSuggestions = SUGGESTIONS.general.filter(
        (s) => !usedSuggestions.has(s)
      );
      const needed =
        SUGGESTION_CONFIG.MIN_SUGGESTIONS - selectedSuggestions.length;

      for (let i = 0; i < needed && i < generalSuggestions.length; i++) {
        selectedSuggestions.push(generalSuggestions[i]);
      }
    }

    // Limit to max suggestions
    return selectedSuggestions.slice(0, SUGGESTION_CONFIG.MAX_SUGGESTIONS);
  }

  /**
   * Generate suggestions based on analysis scores
   * @param {Object} scores - Analysis scores
   * @returns {Array} Personalized suggestions
   */
  generateSuggestions(scores) {
    try {
      const patterns = this.identifyPatterns(scores);
      const suggestions = this.selectSuggestions(patterns);

      return suggestions;
    } catch (error) {
      console.error('Error generating suggestions:', error);
      // Return fallback suggestions
      return SUGGESTIONS.general.slice(0, SUGGESTION_CONFIG.MIN_SUGGESTIONS);
    }
  }
}
