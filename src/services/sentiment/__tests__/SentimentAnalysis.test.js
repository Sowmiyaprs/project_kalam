/**
 * Comprehensive Test Suite for Sentiment Analysis Engine
 * 
 * Covers:
 * - KeywordDetectionModule tests
 * - ScoringModule tests
 * - SuggestionGenerationModule tests
 * - SentimentAnalysisService tests
 * - Integration tests
 * - Performance tests
 */

import { describe, it, expect, beforeEach } from '@jest/globals';
import { KeywordDetectionModule } from '../KeywordDetectionModule.js';
import { ScoringModule } from '../ScoringModule.js';
import { SuggestionGenerationModule } from '../SuggestionGenerationModule.js';
import { SentimentAnalysisService } from '../SentimentAnalysisService.js';

// ============================================================================
// KEYWORD DETECTION MODULE TESTS
// ============================================================================

describe('KeywordDetectionModule', () => {
  let detector;

  beforeEach(() => {
    detector = new KeywordDetectionModule();
  });

  describe('Keyword Matching', () => {
    it('should detect exact keyword matches', () => {
      const result = detector.detectKeywords('I feel stressed today');
      expect(result.keywords.length).toBeGreaterThan(0);
      expect(result.keywords.some(k => k.baseKeyword === 'stressed')).toBe(true);
    });

    it('should detect keyword variations', () => {
      const result = detector.detectKeywords('I am stressing about work');
      expect(result.keywords.some(k => k.baseKeyword === 'stressed')).toBe(true);
    });

    it('should be case-insensitive', () => {
      const result1 = detector.detectKeywords('STRESSED');
      const result2 = detector.detectKeywords('stressed');
      expect(result1.keywords.length).toBe(result2.keywords.length);
    });

    it('should match multiple keywords', () => {
      const result = detector.detectKeywords('I feel stressed and anxious but motivated');
      expect(result.keywords.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('Negation Detection', () => {
    it('should detect negation with "not"', () => {
      const result = detector.detectKeywords('I am not happy today');
      const happyKeyword = result.keywords.find(k => k.baseKeyword === 'happy');
      expect(happyKeyword?.isNegated).toBe(true);
    });

    it('should detect negation with contractions', () => {
      const result = detector.detectKeywords("I don't feel stressed");
      const stressKeyword = result.keywords.find(k => k.baseKeyword === 'stressed');
      expect(stressKeyword?.isNegated).toBe(true);
    });

    it('should handle negation window correctly', () => {
      const result = detector.detectKeywords('I am not very happy today');
      const happyKeyword = result.keywords.find(k => k.baseKeyword === 'happy');
      expect(happyKeyword?.isNegated).toBe(true);
    });
  });

  describe('Intensity Modifiers', () => {
    it('should detect strong amplifiers', () => {
      const result = detector.detectKeywords('I am very stressed');
      const stressKeyword = result.keywords.find(k => k.baseKeyword === 'stressed');
      expect(stressKeyword?.intensityModifier).toBe('very');
      expect(stressKeyword?.adjustedWeight).toBeGreaterThan(stressKeyword?.baseWeight);
    });

    it('should detect diminishers', () => {
      const result = detector.detectKeywords('I am slightly worried');
      const worryKeyword = result.keywords.find(k => k.baseKeyword === 'worried');
      expect(stressKeyword?.intensityModifier).toBe('slightly');
      expect(worryKeyword?.adjustedWeight).toBeLessThan(worryKeyword?.baseWeight);
    });
  });

  describe('Text Preprocessing', () => {
    it('should expand contractions', () => {
      const processed = detector.preprocessText("I don't feel good");
      expect(processed).toContain('do not');
    });

    it('should convert to lowercase', () => {
      const processed = detector.preprocessText('STRESSED');
      expect(processed).toBe('stressed');
    });

    it('should normalize whitespace', () => {
      const processed = detector.preprocessText('I   feel    stressed');
      expect(processed).toBe('i feel stressed');
    });

    it('should remove special characters', () => {
      const processed = detector.preprocessText('I feel <script>stressed</script>!');
      expect(processed).not.toContain('<script>');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty text', () => {
      const result = detector.detectKeywords('');
      expect(result.keywords.length).toBe(0);
    });

    it('should handle text with no keywords', () => {
      const result = detector.detectKeywords('The quick brown fox jumps');
      expect(result.keywords.length).toBe(0);
    });

    it('should handle very long text', () => {
      const longText = 'stressed '.repeat(1000);
      const result = detector.detectKeywords(longText);
      expect(result.keywords.length).toBeGreaterThan(0);
    });
  });
});

// ============================================================================
// SCORING MODULE TESTS
// ============================================================================

describe('ScoringModule', () => {
  let scorer;
  let detector;

  beforeEach(() => {
    scorer = new ScoringModule();
    detector = new KeywordDetectionModule();
  });

  describe('Score Calculation', () => {
    it('should calculate stress score correctly', () => {
      const keywords = detector.detectKeywords('I feel very stressed and overwhelmed');
      const scores = scorer.calculateScores(keywords);
      expect(scores.stress.normalizedScore).toBeGreaterThan(50);
    });

    it('should return neutral score for no matches', () => {
      const keywords = { keywords: [], totalMatches: 0, categoryCounts: {} };
      const score = scorer.calculateMetricScore([], 'stress');
      expect(score.normalizedScore).toBe(50);
    });

    it('should apply frequency bonus', () => {
      const keywords1 = detector.detectKeywords('stressed');
      const keywords2 = detector.detectKeywords('stressed anxious overwhelmed');
      const scores1 = scorer.calculateScores(keywords1);
      const scores2 = scorer.calculateScores(keywords2);
      expect(scores2.stress.normalizedScore).toBeGreaterThan(scores1.stress.normalizedScore);
    });
  });

  describe('Score Normalization', () => {
    it('should clamp scores to 0-100 range', () => {
      expect(scorer.normalizeScore(-50)).toBe(0);
      expect(scorer.normalizeScore(150)).toBe(100);
      expect(scorer.normalizeScore(50)).toBe(50);
    });
  });

  describe('Mood Classification', () => {
    it('should classify stressed mood', () => {
      const keywords = detector.detectKeywords('I feel extremely stressed and anxious');
      const scores = scorer.calculateScores(keywords);
      const mood = scorer.classifyMood(scores);
      expect(['Stressed', 'Anxious', 'Overwhelmed']).toContain(mood);
    });

    it('should classify happy mood', () => {
      const keywords = detector.detectKeywords('I feel very happy and joyful');
      const scores = scorer.calculateScores(keywords);
      const mood = scorer.classifyMood(scores);
      expect(mood).toBe('Happy');
    });

    it('should classify neutral mood for no keywords', () => {
      const keywords = { keywords: [], totalMatches: 0, categoryCounts: {} };
      const scores = scorer.calculateScores(keywords);
      const mood = scorer.classifyMood(scores);
      expect(mood).toBe('Neutral');
    });
  });

  describe('Productivity Classification', () => {
    it('should classify high productivity', () => {
      const level = scorer.classifyProductivity(75);
      expect(level).toBe('High');
    });

    it('should classify medium productivity', () => {
      const level = scorer.classifyProductivity(50);
      expect(level).toBe('Medium');
    });

    it('should classify low productivity', () => {
      const level = scorer.classifyProductivity(30);
      expect(level).toBe('Low');
    });
  });

  describe('Focus Classification', () => {
    it('should classify excellent focus', () => {
      const level = scorer.classifyFocus(80);
      expect(level).toBe('Excellent');
    });

    it('should classify good focus', () => {
      const level = scorer.classifyFocus(65);
      expect(level).toBe('Good');
    });

    it('should classify improving focus', () => {
      const level = scorer.classifyFocus(50);
      expect(level).toBe('Improving');
    });

    it('should classify poor focus', () => {
      const level = scorer.classifyFocus(30);
      expect(level).toBe('Poor');
    });
  });

  describe('Determinism', () => {
    it('should produce same results for same input', () => {
      const text = 'I feel stressed and motivated';
      const keywords1 = detector.detectKeywords(text);
      const keywords2 = detector.detectKeywords(text);
      const scores1 = scorer.calculateScores(keywords1);
      const scores2 = scorer.calculateScores(keywords2);
      
      expect(scores1.stress.normalizedScore).toBe(scores2.stress.normalizedScore);
      expect(scores1.motivation.normalizedScore).toBe(scores2.motivation.normalizedScore);
    });
  });
});

// ============================================================================
// SUGGESTION GENERATION MODULE TESTS
// ============================================================================

describe('SuggestionGenerationModule', () => {
  let generator;
  let scorer;
  let detector;

  beforeEach(() => {
    generator = new SuggestionGenerationModule();
    scorer = new ScoringModule();
    detector = new KeywordDetectionModule();
  });

  describe('Pattern Identification', () => {
    it('should identify burnout pattern', () => {
      const keywords = detector.detectKeywords('I feel extremely stressed and not motivated at all');
      const scores = scorer.calculateScores(keywords);
      const patterns = generator.identifyPatterns(scores);
      expect(patterns.some(p => p.name === 'burnout')).toBe(true);
    });

    it('should identify overwhelm pattern', () => {
      const keywords = detector.detectKeywords('I feel stressed and cannot focus');
      const scores = scorer.calculateScores(keywords);
      const patterns = generator.identifyPatterns(scores);
      expect(patterns.some(p => p.name === 'overwhelm')).toBe(true);
    });
  });

  describe('Suggestion Selection', () => {
    it('should generate 3-5 suggestions', () => {
      const keywords = detector.detectKeywords('I feel stressed and unmotivated');
      const scores = scorer.calculateScores(keywords);
      const suggestions = generator.generateSuggestions(scores);
      expect(suggestions.length).toBeGreaterThanOrEqual(3);
      expect(suggestions.length).toBeLessThanOrEqual(5);
    });

    it('should generate relevant suggestions for stress', () => {
      const keywords = detector.detectKeywords('I feel very stressed');
      const scores = scorer.calculateScores(keywords);
      const suggestions = generator.generateSuggestions(scores);
      expect(suggestions.some(s => s.toLowerCase().includes('stress') || s.toLowerCase().includes('break'))).toBe(true);
    });

    it('should generate neutral suggestions for no issues', () => {
      const keywords = { keywords: [], totalMatches: 0, categoryCounts: {} };
      const scores = scorer.calculateScores(keywords);
      const suggestions = generator.generateSuggestions(scores);
      expect(suggestions.length).toBeGreaterThan(0);
    });
  });

  describe('Neutral Suggestions', () => {
    it('should generate neutral suggestions', () => {
      const suggestions = generator.generateNeutralSuggestions();
      expect(suggestions.length).toBeGreaterThan(0);
    });
  });
});

// ============================================================================
// SENTIMENT ANALYSIS SERVICE TESTS
// ============================================================================

describe('SentimentAnalysisService', () => {
  let service;

  beforeEach(() => {
    service = new SentimentAnalysisService();
  });

  describe('Full Analysis Pipeline', () => {
    it('should analyze text and return complete result', async () => {
      const result = await service.analyze('I feel stressed but motivated to improve');
      
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('timestamp');
      expect(result).toHaveProperty('emotional');
      expect(result).toHaveProperty('productivity');
      expect(result).toHaveProperty('suggestions');
      expect(result).toHaveProperty('confidence');
      expect(result).toHaveProperty('metadata');
    });

    it('should include emotional metrics', async () => {
      const result = await service.analyze('I feel happy and confident');
      
      expect(result.emotional).toHaveProperty('mood');
      expect(result.emotional).toHaveProperty('stressLevel');
      expect(result.emotional).toHaveProperty('motivation');
      expect(result.emotional).toHaveProperty('confidence');
    });

    it('should include productivity metrics', async () => {
      const result = await service.analyze('I am very productive today');
      
      expect(result.productivity).toHaveProperty('score');
      expect(result.productivity).toHaveProperty('focusLevel');
    });

    it('should include suggestions', async () => {
      const result = await service.analyze('I feel stressed');
      
      expect(Array.isArray(result.suggestions)).toBe(true);
      expect(result.suggestions.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('Empty Input Handling', () => {
    it('should return neutral analysis for empty input', async () => {
      const result = await service.analyze('');
      
      expect(result.emotional.mood).toBe('Neutral');
      expect(result.confidence).toBe('low');
    });

    it('should return neutral analysis for very short input', async () => {
      const result = await service.analyze('ok');
      
      expect(result.emotional.mood).toBe('Neutral');
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid input gracefully', async () => {
      const result = await service.analyze(null);
      
      expect(result).toHaveProperty('metadata');
      expect(result.metadata).toHaveProperty('error');
    });

    it('should handle non-string input', async () => {
      const result = await service.analyze(12345);
      
      expect(result.metadata).toHaveProperty('error');
    });
  });

  describe('Performance', () => {
    it('should complete analysis within timeout', async () => {
      const startTime = performance.now();
      await service.analyze('I feel stressed and anxious but motivated to improve my situation');
      const duration = performance.now() - startTime;
      
      expect(duration).toBeLessThan(500);
    });
  });

  describe('Determinism', () => {
    it('should produce same results for same input', async () => {
      const text = 'I feel stressed and motivated';
      const result1 = await service.analyze(text);
      const result2 = await service.analyze(text);
      
      expect(result1.emotional.stressLevel).toBe(result2.emotional.stressLevel);
      expect(result1.emotional.motivation).toBe(result2.emotional.motivation);
      expect(result1.emotional.mood).toBe(result2.emotional.mood);
    });
  });
});

// ============================================================================
// INTEGRATION TESTS
// ============================================================================

describe('Integration Tests', () => {
  let service;

  beforeEach(() => {
    service = new SentimentAnalysisService();
  });

  describe('Various Text Samples', () => {
    it('should analyze short text', async () => {
      const result = await service.analyze('I feel stressed today and need a break');
      expect(result.emotional.stressLevel).toBeGreaterThan(50);
    });

    it('should analyze medium text', async () => {
      const text = 'Today has been challenging. I feel stressed about the upcoming deadline, but I am motivated to complete the project. I need to focus better and manage my time more effectively.';
      const result = await service.analyze(text);
      
      expect(result.emotional.stressLevel).toBeGreaterThan(0);
      expect(result.emotional.motivation).toBeGreaterThan(0);
    });

    it('should analyze long text', async () => {
      const text = 'I have been feeling overwhelmed lately with all the work piling up. The stress is getting to me, and I find it hard to stay motivated. However, I know I am capable of handling this if I just take it one step at a time. I need to focus on what is important and let go of the rest. Taking breaks and practicing self-care will help me get through this difficult period.';
      const result = await service.analyze(text);
      
      expect(result).toHaveProperty('emotional');
      expect(result).toHaveProperty('suggestions');
      expect(result.suggestions.length).toBeGreaterThan(0);
    });
  });

  describe('Different Emotional Patterns', () => {
    it('should detect stressed pattern', async () => {
      const result = await service.analyze('I feel extremely stressed, anxious, and overwhelmed');
      expect(['Stressed', 'Anxious', 'Overwhelmed']).toContain(result.emotional.mood);
    });

    it('should detect happy pattern', async () => {
      const result = await service.analyze('I feel very happy, joyful, and grateful today');
      expect(result.emotional.mood).toBe('Happy');
    });

    it('should detect motivated pattern', async () => {
      const result = await service.analyze('I feel extremely motivated, driven, and determined to succeed');
      expect(result.emotional.mood).toBe('Motivated');
    });

    it('should detect mixed emotions', async () => {
      const result = await service.analyze('I feel stressed but also motivated and confident');
      expect(result.emotional.stressLevel).toBeGreaterThan(50);
      expect(result.emotional.motivation).toBeGreaterThan(50);
    });
  });
});

// ============================================================================
// PERFORMANCE TESTS
// ============================================================================

describe('Performance Tests', () => {
  let service;

  beforeEach(() => {
    service = new SentimentAnalysisService();
  });

  describe('Analysis Duration', () => {
    it('should complete short text analysis quickly', async () => {
      const result = await service.analyze('I feel stressed');
      expect(result.analysisDuration).toBeLessThan(100);
    });

    it('should complete medium text analysis within target', async () => {
      const text = 'I feel stressed and anxious about work but motivated to improve'.repeat(10);
      const result = await service.analyze(text);
      expect(result.analysisDuration).toBeLessThan(500);
    });
  });

  describe('Consecutive Analyses', () => {
    it('should handle multiple analyses without slowdown', async () => {
      const durations = [];
      
      for (let i = 0; i < 10; i++) {
        const result = await service.analyze('I feel stressed and motivated');
        durations.push(result.analysisDuration);
      }
      
      const firstDuration = durations[0];
      const lastDuration = durations[durations.length - 1];
      
      // Last analysis should not be significantly slower than first
      expect(lastDuration).toBeLessThan(firstDuration * 2);
    });
  });
});

export default {};
