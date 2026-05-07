import {
  SCORING_CONFIG,
  MOOD_THRESHOLDS,
  PRODUCTIVITY_LEVELS,
  PRODUCTIVITY_THRESHOLDS,
  FOCUS_LEVELS,
  FOCUS_THRESHOLDS,
  CONFIDENCE_LEVELS,
  CONFIDENCE_THRESHOLDS,
} from './config/constants.js';

/**
 * ScoringModule
 * Calculates metric scores from detected keywords
 */
export class ScoringModule {
  /**
   * Calculate score for a specific metric category
   * @param {Array} keywords - Detected keywords
   * @param {string} category - Metric category
   * @returns {Object} Score data
   */
  calculateMetricScore(keywords, category) {
    // Filter keywords by category
    const relevantKeywords = keywords.filter((kw) => kw.category === category);

    if (relevantKeywords.length === 0) {
      return {
        score: SCORING_CONFIG.NEUTRAL_SCORE,
        matchCount: 0,
        confidence: CONFIDENCE_LEVELS.VERY_LOW,
      };
    }

    // Calculate weighted sum
    const weightedSum = relevantKeywords.reduce(
      (sum, kw) => sum + kw.adjustedWeight,
      0
    );

    // Calculate frequency bonus (logarithmic to prevent exponential growth)
    const frequencyBonus =
      Math.log(1 + relevantKeywords.length) *
      SCORING_CONFIG.FREQUENCY_BONUS_MULTIPLIER;

    // Calculate raw score
    const rawScore =
      weightedSum * SCORING_CONFIG.BASE_MULTIPLIER + frequencyBonus;

    // Normalize to 0-100
    const normalizedScore = Math.max(
      SCORING_CONFIG.MIN_SCORE,
      Math.min(SCORING_CONFIG.MAX_SCORE, rawScore + SCORING_CONFIG.NEUTRAL_SCORE)
    );

    // Determine confidence
    const confidence = this.determineConfidence(relevantKeywords.length);

    return {
      score: Math.round(normalizedScore),
      matchCount: relevantKeywords.length,
      confidence,
    };
  }

  /**
   * Determine confidence level based on match count
   * @param {number} matchCount - Number of keyword matches
   * @returns {string} Confidence level
   */
  determineConfidence(matchCount) {
    if (matchCount >= CONFIDENCE_THRESHOLDS.HIGH) {
      return CONFIDENCE_LEVELS.HIGH;
    } else if (matchCount >= CONFIDENCE_THRESHOLDS.MEDIUM) {
      return CONFIDENCE_LEVELS.MEDIUM;
    } else if (matchCount >= CONFIDENCE_THRESHOLDS.LOW) {
      return CONFIDENCE_LEVELS.LOW;
    } else {
      return CONFIDENCE_LEVELS.VERY_LOW;
    }
  }

  /**
   * Classify mood based on score patterns
   * @param {Object} scores - All metric scores
   * @returns {string} Mood classification
   */
  classifyMood(scores) {
    const { stress, motivation, confidence } = scores;

    // Calculate positive and negative mood indicators
    const positiveMood = (motivation + confidence) / 2;
    const negativeMood = stress;

    // Pattern-based classification
    if (stress > MOOD_THRESHOLDS.HIGH && motivation < MOOD_THRESHOLDS.MEDIUM) {
      return 'Overwhelmed';
    } else if (
      stress > MOOD_THRESHOLDS.HIGH &&
      confidence < MOOD_THRESHOLDS.MEDIUM
    ) {
      return 'Anxious';
    } else if (stress > MOOD_THRESHOLDS.HIGH) {
      return 'Stressed';
    } else if (positiveMood > MOOD_THRESHOLDS.MEDIUM) {
      return 'Happy';
    } else if (negativeMood > MOOD_THRESHOLDS.MEDIUM) {
      return 'Sad';
    } else if (motivation > MOOD_THRESHOLDS.HIGH) {
      return 'Motivated';
    } else if (confidence < MOOD_THRESHOLDS.LOW) {
      return 'Uncertain';
    } else {
      return 'Neutral';
    }
  }

  /**
   * Classify productivity level
   * @param {number} productivityScore - Productivity score (0-100)
   * @returns {string} Productivity level
   */
  classifyProductivity(productivityScore) {
    if (productivityScore >= PRODUCTIVITY_THRESHOLDS.HIGH) {
      return PRODUCTIVITY_LEVELS.HIGH;
    } else if (productivityScore >= PRODUCTIVITY_THRESHOLDS.MEDIUM) {
      return PRODUCTIVITY_LEVELS.MEDIUM;
    } else {
      return PRODUCTIVITY_LEVELS.LOW;
    }
  }

  /**
   * Classify focus level
   * @param {number} focusScore - Focus score (0-100)
   * @returns {string} Focus level
   */
  classifyFocus(focusScore) {
    if (focusScore >= FOCUS_THRESHOLDS.EXCELLENT) {
      return FOCUS_LEVELS.EXCELLENT;
    } else if (focusScore >= FOCUS_THRESHOLDS.GOOD) {
      return FOCUS_LEVELS.GOOD;
    } else if (focusScore >= FOCUS_THRESHOLDS.IMPROVING) {
      return FOCUS_LEVELS.IMPROVING;
    } else {
      return FOCUS_LEVELS.NEEDS_WORK;
    }
  }

  /**
   * Calculate all metric scores
   * @param {Array} keywords - Detected keywords
   * @returns {Object} All scores
   */
  calculateAllScores(keywords) {
    const stressData = this.calculateMetricScore(keywords, 'stress');
    const motivationData = this.calculateMetricScore(keywords, 'motivation');
    const confidenceData = this.calculateMetricScore(keywords, 'confidence');
    const productivityData = this.calculateMetricScore(
      keywords,
      'productivity'
    );
    const focusData = this.calculateMetricScore(keywords, 'focus');

    const scores = {
      stress: stressData.score,
      motivation: motivationData.score,
      confidence: confidenceData.score,
      productivity: productivityData.score,
      focus: focusData.score,
    };

    // Classify mood, productivity, and focus
    const mood = this.classifyMood(scores);
    const productivityLevel = this.classifyProductivity(scores.productivity);
    const focusLevel = this.classifyFocus(scores.focus);

    // Determine overall confidence (minimum of all metrics)
    const overallConfidence = [
      stressData.confidence,
      motivationData.confidence,
      confidenceData.confidence,
      productivityData.confidence,
      focusData.confidence,
    ].reduce((min, conf) => {
      const levels = [
        CONFIDENCE_LEVELS.VERY_LOW,
        CONFIDENCE_LEVELS.LOW,
        CONFIDENCE_LEVELS.MEDIUM,
        CONFIDENCE_LEVELS.HIGH,
      ];
      const minIndex = levels.indexOf(min);
      const confIndex = levels.indexOf(conf);
      return confIndex < minIndex ? conf : min;
    }, CONFIDENCE_LEVELS.HIGH);

    return {
      emotional: {
        mood,
        stressLevel: scores.stress,
        motivation: scores.motivation,
        confidence: scores.confidence,
      },
      productivity: {
        score: productivityLevel,
        focusLevel,
        productivityScore: scores.productivity,
        focusScore: scores.focus,
      },
      confidence: overallConfidence,
      matchCounts: {
        stress: stressData.matchCount,
        motivation: motivationData.matchCount,
        confidence: confidenceData.matchCount,
        productivity: productivityData.matchCount,
        focus: focusData.matchCount,
      },
    };
  }
}
