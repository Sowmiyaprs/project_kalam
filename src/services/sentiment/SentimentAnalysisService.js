import { KeywordDetectionModule } from './KeywordDetectionModule.js';
import { ScoringModule } from './ScoringModule.js';
import { SuggestionGenerationModule } from './SuggestionGenerationModule.js';
import { ANALYSIS_CONFIG } from './config/constants.js';
import { validateInput, sanitizeInput } from '../../utils/validation.js';

/**
 * SentimentAnalysisService
 * Main orchestration service for sentiment analysis
 */
export class SentimentAnalysisService {
  constructor(dependencies = {}) {
    this.keywordDetector =
      dependencies.keywordDetector || new KeywordDetectionModule();
    this.scoringModule = dependencies.scoringModule || new ScoringModule();
    this.suggestionGenerator =
      dependencies.suggestionGenerator || new SuggestionGenerationModule();
  }

  /**
   * Generate unique analysis ID
   * @returns {string} Unique ID
   */
  generateAnalysisId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 9);
    return `analysis_${timestamp}_${random}`;
  }

  /**
   * Perform analysis with timeout
   * @param {string} text - Input text
   * @param {number} timeout - Timeout in ms
   * @returns {Promise<Object>} Analysis result
   */
  async analyzeWithTimeout(text, timeout = ANALYSIS_CONFIG.TIMEOUT_MS) {
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Analysis timeout')), timeout)
    );

    const analysisPromise = this.performAnalysis(text, false);

    try {
      return await Promise.race([analysisPromise, timeoutPromise]);
    } catch (error) {
      if (error.message === 'Analysis timeout') {
        // Retry with simplified mode (no negations/modifiers)
        console.warn('Analysis timeout, retrying with simplified mode');
        return await this.performAnalysis(text, true);
      }
      throw error;
    }
  }

  /**
   * Perform the actual analysis
   * @param {string} text - Input text
   * @param {boolean} simplifiedMode - Skip negations/modifiers
   * @returns {Object} Analysis result
   */
  performAnalysis(text, simplifiedMode = false) {
    const startTime = Date.now();

    // Step 1: Keyword detection
    const detectionResult = this.keywordDetector.detectKeywords(
      text,
      simplifiedMode
    );

    // Step 2: Scoring
    const scores = this.scoringModule.calculateAllScores(
      detectionResult.keywords
    );

    // Step 3: Suggestion generation
    const suggestions = this.suggestionGenerator.generateSuggestions(scores);

    const analysisDuration = Date.now() - startTime;

    return {
      ...scores,
      suggestions,
      analysisDuration,
      metadata: {
        wordCount: detectionResult.wordCount,
        keywordMatches: detectionResult.totalMatches,
        simplifiedMode,
      },
    };
  }

  /**
   * Main analysis method
   * @param {string} text - Input text
   * @returns {Promise<Object>} Analysis result
   */
  async analyze(text) {
    try {
      // Validate input
      const validation = validateInput(text);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      // Sanitize input
      const sanitized = sanitizeInput(text);

      // Check if empty or too short
      if (
        !sanitized ||
        sanitized.length < ANALYSIS_CONFIG.MIN_TEXT_LENGTH
      ) {
        return this.createNeutralAnalysis(sanitized);
      }

      // Truncate if too long
      const truncated =
        sanitized.length > ANALYSIS_CONFIG.MAX_TEXT_LENGTH
          ? sanitized.substring(0, ANALYSIS_CONFIG.MAX_TEXT_LENGTH)
          : sanitized;

      // Perform analysis with timeout
      const analysisResult = await this.analyzeWithTimeout(truncated);

      // Create final result
      return {
        id: this.generateAnalysisId(),
        timestamp: new Date().toISOString(),
        ...analysisResult,
      };
    } catch (error) {
      console.error('Error in sentiment analysis:', error);
      throw error;
    }
  }

  /**
   * Create neutral analysis for empty/short text
   * @param {string} text - Input text
   * @returns {Object} Neutral analysis result
   */
  createNeutralAnalysis(text) {
    return {
      id: this.generateAnalysisId(),
      timestamp: new Date().toISOString(),
      emotional: {
        mood: 'Neutral',
        stressLevel: 50,
        motivation: 50,
        confidence: 50,
      },
      productivity: {
        score: 'Medium',
        focusLevel: 'Good',
        productivityScore: 50,
        focusScore: 50,
      },
      suggestions: [
        'Write more to get personalized insights',
        'Share your thoughts and feelings in detail',
        'Describe your current state and goals',
      ],
      confidence: 'very_low',
      analysisDuration: 0,
      metadata: {
        wordCount: text ? text.split(/\s+/).length : 0,
        keywordMatches: 0,
        simplifiedMode: false,
      },
    };
  }
}

// Export singleton instance
export default new SentimentAnalysisService();
