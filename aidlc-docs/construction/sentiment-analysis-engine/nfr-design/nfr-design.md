# NFR Design - Sentiment Analysis Engine

**Unit**: Sentiment Analysis Engine  
**Phase**: CONSTRUCTION - NFR Design  
**Date**: 2026-05-06

---

## Overview

This document specifies implementation patterns and design decisions to achieve the NFR requirements defined for the Sentiment Analysis Engine.

---

## 1. Performance Design Patterns

### Pattern 1.1: Efficient Keyword Matching

**Requirement**: Analysis < 500ms

**Design**:
- Use hash map for O(1) keyword lookups
- Pre-compile keyword dictionary at initialization
- Single-pass text scanning

**Implementation**:
```javascript
// Pre-compiled keyword map (loaded once)
const keywordMap = new Map();
// Key: lowercase keyword, Value: { category, weight, base }

// Initialization (once)
function initializeKeywordMap() {
  for (const [category, tiers] of Object.entries(keywordDictionary)) {
    for (const [tier, keywords] of Object.entries(tiers)) {
      const weight = tierWeights[tier];
      for (const keyword of keywords) {
        keywordMap.set(keyword.base.toLowerCase(), { category, weight, base: keyword.base });
        for (const variation of keyword.variations) {
          keywordMap.set(variation.toLowerCase(), { category, weight, base: keyword.base });
        }
      }
    }
  }
}

// Fast lookup during analysis
function lookupKeyword(word) {
  return keywordMap.get(word.toLowerCase());
}
```

**Benefit**: O(1) lookup vs O(n) array search, significant performance gain

---

### Pattern 1.2: Early Termination

**Requirement**: Timeout handling

**Design**:
- Wrap analysis in Promise with timeout
- Cancel analysis if exceeds 500ms
- Retry with simplified mode

**Implementation**:
```javascript
async function analyzeWithTimeout(text, timeout = 500) {
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('TIMEOUT')), timeout)
  );
  
  const analysisPromise = performAnalysis(text);
  
  try {
    return await Promise.race([analysisPromise, timeoutPromise]);
  } catch (error) {
    if (error.message === 'TIMEOUT') {
      // Retry with simplified mode
      return performSimplifiedAnalysis(text);
    }
    throw error;
  }
}
```

**Benefit**: Guarantees response within timeout, graceful degradation

---

### Pattern 1.3: Memoization for Repeated Calculations

**Requirement**: Memory efficiency

**Design**:
- Cache preprocessing results for identical texts
- Use WeakMap for automatic garbage collection
- Limit cache size to prevent memory bloat

**Implementation**:
```javascript
const preprocessCache = new Map();
const MAX_CACHE_SIZE = 100;

function preprocessWithCache(text) {
  if (preprocessCache.has(text)) {
    return preprocessCache.get(text);
  }
  
  const result = preprocess(text);
  
  if (preprocessCache.size >= MAX_CACHE_SIZE) {
    // Remove oldest entry
    const firstKey = preprocessCache.keys().next().value;
    preprocessCache.delete(firstKey);
  }
  
  preprocessCache.set(text, result);
  return result;
}
```

**Benefit**: Faster repeated analyses, controlled memory usage

---

## 2. Accuracy Design Patterns

### Pattern 2.1: Context Window for Modifiers

**Requirement**: > 90% keyword detection accuracy

**Design**:
- Maintain sliding window of 3 words
- Check for negations and modifiers in window
- Apply modifiers before storing keyword

**Implementation**:
```javascript
function detectKeywordsWithContext(words) {
  const detected = [];
  
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const keyword = lookupKeyword(word);
    
    if (keyword) {
      // Check previous 2-3 words for negation
      const isNegated = checkNegation(words, i, 3);
      
      // Check previous 1-2 words for intensity modifier
      const modifier = checkIntensityModifier(words, i, 2);
      
      // Apply adjustments
      let adjustedWeight = keyword.weight;
      if (modifier) {
        adjustedWeight *= (1 + modifier.adjustment);
      }
      
      detected.push({
        word,
        ...keyword,
        adjustedWeight,
        isNegated,
        intensityModifier: modifier?.word || null,
        position: i
      });
    }
  }
  
  return detected;
}
```

**Benefit**: Accurate context-aware keyword detection

---

### Pattern 2.2: Weighted Scoring with Frequency Bonus

**Requirement**: Score variance < 10%

**Design**:
- Use logarithmic frequency bonus to prevent over-weighting
- Normalize scores consistently
- Apply floor and ceiling to prevent extreme values

**Implementation**:
```javascript
function calculateMetricScore(keywords, metric) {
  const relevantKeywords = keywords.filter(k => k.category === metric);
  
  if (relevantKeywords.length === 0) {
    return 50; // Neutral default
  }
  
  // Weighted sum
  const weightedSum = relevantKeywords.reduce((sum, k) => {
    const weight = k.isNegated ? -k.adjustedWeight : k.adjustedWeight;
    return sum + weight;
  }, 0);
  
  // Frequency bonus (logarithmic to prevent over-weighting)
  const frequencyBonus = Math.log(1 + relevantKeywords.length) * 10;
  
  // Calculate raw score
  const rawScore = weightedSum * 20 + frequencyBonus;
  
  // Normalize to 0-100
  return Math.max(0, Math.min(100, rawScore));
}
```

**Benefit**: Consistent, predictable scoring

---

## 3. Reliability Design Patterns

### Pattern 3.1: Defensive Programming

**Requirement**: 100% error handling coverage

**Design**:
- Validate inputs at entry points
- Use try-catch for all external operations
- Provide fallback values for all failures

**Implementation**:
```javascript
function analyze(text) {
  try {
    // Validate input
    if (!text || typeof text !== 'string') {
      return createNeutralAnalysis('Invalid input');
    }
    
    if (text.trim().length === 0) {
      return createNeutralAnalysis('Empty input');
    }
    
    // Preprocess with error handling
    let preprocessed;
    try {
      preprocessed = preprocess(text);
    } catch (error) {
      console.warn('Preprocessing failed, using raw text', error);
      preprocessed = text.toLowerCase().trim();
    }
    
    // Continue with analysis...
    const keywords = detectKeywords(preprocessed);
    const scores = calculateScores(keywords);
    const suggestions = generateSuggestions(scores);
    
    return createAnalysisResult(scores, suggestions);
    
  } catch (error) {
    console.error('Analysis failed', error);
    return createErrorResult('Analysis failed. Please try again.');
  }
}
```

**Benefit**: No unhandled exceptions, graceful degradation

---

### Pattern 3.2: Immutable Data Structures

**Requirement**: 100% determinism

**Design**:
- Use immutable data structures
- No global state mutations
- Pure functions where possible

**Implementation**:
```javascript
// Immutable keyword detection
function detectKeywords(text) {
  const words = text.split(/\s+/);
  const detected = [];
  
  // Create new objects, don't mutate
  for (const word of words) {
    const keyword = lookupKeyword(word);
    if (keyword) {
      detected.push({ ...keyword, word }); // Spread to create new object
    }
  }
  
  return detected; // Return new array
}

// Pure scoring function
function calculateScores(keywords) {
  return {
    stress: calculateMetricScore(keywords, 'stress'),
    motivation: calculateMetricScore(keywords, 'motivation'),
    confidence: calculateMetricScore(keywords, 'confidence'),
    productivity: calculateMetricScore(keywords, 'productivity'),
    focus: calculateMetricScore(keywords, 'focus')
  };
}
```

**Benefit**: Predictable, testable, deterministic

---

## 4. Maintainability Design Patterns

### Pattern 4.1: Modular Architecture

**Requirement**: Testability > 80%

**Design**:
- Separate concerns into modules
- Each module has single responsibility
- Clear interfaces between modules

**Module Structure**:
```
SentimentAnalysisService
├── KeywordDetectionModule
│   ├── initializeKeywordMap()
│   ├── detectKeywords(text)
│   ├── checkNegation(words, index, window)
│   └── checkIntensityModifier(words, index, window)
├── ScoringModule
│   ├── calculateScores(keywords)
│   ├── calculateMetricScore(keywords, metric)
│   └── normalizeScore(rawScore)
└── SuggestionGenerationModule
    ├── generateSuggestions(scores)
    ├── identifyPatterns(scores)
    └── selectSuggestions(patterns)
```

**Benefit**: Easy to test, maintain, extend

---

### Pattern 4.2: Configuration Externalization

**Requirement**: Extensibility

**Design**:
- Store keywords in separate config file
- Store suggestions in separate config file
- Easy to modify without code changes

**File Structure**:
```
src/services/sentiment/
├── SentimentAnalysisService.js
├── KeywordDetectionModule.js
├── ScoringModule.js
├── SuggestionGenerationModule.js
└── config/
    ├── keywords.js          // Keyword dictionary
    ├── suggestions.js       // Suggestion bank
    ├── modifiers.js         // Negations, intensity modifiers
    └── constants.js         // Weights, thresholds
```

**Benefit**: Easy to add keywords/suggestions without code changes

---

### Pattern 4.3: Dependency Injection

**Requirement**: Testability

**Design**:
- Inject dependencies rather than hard-coding
- Allows mocking in tests

**Implementation**:
```javascript
class SentimentAnalysisService {
  constructor(config = {}) {
    this.keywordDetector = config.keywordDetector || new KeywordDetectionModule();
    this.scorer = config.scorer || new ScoringModule();
    this.suggestionGenerator = config.suggestionGenerator || new SuggestionGenerationModule();
  }
  
  analyze(text) {
    const keywords = this.keywordDetector.detect(text);
    const scores = this.scorer.calculate(keywords);
    const suggestions = this.suggestionGenerator.generate(scores);
    return this.createResult(scores, suggestions);
  }
}

// Easy to mock in tests
const mockDetector = { detect: jest.fn() };
const service = new SentimentAnalysisService({ keywordDetector: mockDetector });
```

**Benefit**: Easy to test with mocks

---

## 5. Security Design Patterns

### Pattern 5.1: Input Sanitization

**Requirement**: Prevent injection attacks

**Design**:
- Remove potentially harmful characters
- No eval() or dynamic code execution
- Validate input types

**Implementation**:
```javascript
function sanitizeInput(text) {
  if (typeof text !== 'string') {
    throw new Error('Input must be string');
  }
  
  // Remove potentially harmful characters
  const sanitized = text
    .replace(/<script[^>]*>.*?<\/script>/gi, '') // Remove script tags
    .replace(/<[^>]+>/g, '') // Remove HTML tags
    .replace(/[^\w\s.,!?'-]/g, ''); // Keep only safe characters
  
  return sanitized;
}
```

**Benefit**: Prevents XSS and injection attacks

---

### Pattern 5.2: No External Dependencies

**Requirement**: Client-side only

**Design**:
- All logic implemented locally
- No fetch() or XMLHttpRequest calls
- No third-party API dependencies

**Implementation**:
```javascript
// All analysis happens locally
function analyze(text) {
  // No network calls
  // No external API calls
  // Pure client-side logic
  
  const preprocessed = preprocess(text);
  const keywords = detectKeywords(preprocessed);
  const scores = calculateScores(keywords);
  const suggestions = generateSuggestions(scores);
  
  return createResult(scores, suggestions);
}
```

**Benefit**: Complete data privacy, no network dependency

---

## 6. Monitoring Design Patterns

### Pattern 6.1: Performance Instrumentation

**Requirement**: Track performance metrics

**Design**:
- Measure duration of each phase
- Include metrics in result metadata
- No user data in metrics

**Implementation**:
```javascript
function analyzeWithMetrics(text) {
  const startTime = performance.now();
  const metrics = {};
  
  // Preprocessing
  const preprocessStart = performance.now();
  const preprocessed = preprocess(text);
  metrics.preprocessDuration = performance.now() - preprocessStart;
  
  // Keyword detection
  const detectionStart = performance.now();
  const keywords = detectKeywords(preprocessed);
  metrics.detectionDuration = performance.now() - detectionStart;
  metrics.keywordCount = keywords.length;
  
  // Scoring
  const scoringStart = performance.now();
  const scores = calculateScores(keywords);
  metrics.scoringDuration = performance.now() - scoringStart;
  
  // Suggestions
  const suggestionStart = performance.now();
  const suggestions = generateSuggestions(scores);
  metrics.suggestionDuration = performance.now() - suggestionStart;
  
  metrics.totalDuration = performance.now() - startTime;
  
  return {
    ...createResult(scores, suggestions),
    metadata: {
      ...metrics,
      wordCount: preprocessed.split(/\s+/).length,
      simplifiedMode: false
    }
  };
}
```

**Benefit**: Performance visibility, debugging aid

---

### Pattern 6.2: Error Logging

**Requirement**: Log errors without exposing user data

**Design**:
- Log error type and stack trace
- Do NOT log user text
- Include context (text length, keyword count)

**Implementation**:
```javascript
function logError(error, context) {
  console.error('Sentiment Analysis Error', {
    errorType: error.name,
    errorMessage: error.message,
    stack: error.stack,
    context: {
      textLength: context.textLength,
      wordCount: context.wordCount,
      timestamp: new Date().toISOString()
    }
    // NO user text logged
  });
}
```

**Benefit**: Debugging without privacy concerns

---

## 7. Testing Design Patterns

### Pattern 7.1: Test Data Fixtures

**Requirement**: > 80% test coverage

**Design**:
- Create comprehensive test fixtures
- Cover happy path, edge cases, error cases

**Test Fixtures**:
```javascript
const testFixtures = {
  happyPath: {
    input: "I feel very stressed but motivated to improve",
    expected: {
      stress: { range: [60, 80] },
      motivation: { range: [60, 80] },
      mood: "Stressed"
    }
  },
  emptyInput: {
    input: "",
    expected: {
      mood: "Neutral",
      stress: 50,
      motivation: 50
    }
  },
  negation: {
    input: "I am not happy today",
    expected: {
      mood: "Sad",
      positiveScore: { range: [0, 40] }
    }
  },
  intensityModifier: {
    input: "I am extremely stressed",
    expected: {
      stress: { range: [70, 100] }
    }
  }
};
```

**Benefit**: Comprehensive test coverage

---

### Pattern 7.2: Mock Dependencies

**Requirement**: Unit testability

**Design**:
- Mock external dependencies
- Test modules in isolation

**Example**:
```javascript
describe('ScoringModule', () => {
  it('should calculate stress score correctly', () => {
    const mockKeywords = [
      { category: 'stress', adjustedWeight: 1.0, isNegated: false },
      { category: 'stress', adjustedWeight: 0.6, isNegated: false }
    ];
    
    const scorer = new ScoringModule();
    const score = scorer.calculateMetricScore(mockKeywords, 'stress');
    
    expect(score).toBeGreaterThan(50);
    expect(score).toBeLessThanOrEqual(100);
  });
});
```

**Benefit**: Fast, isolated unit tests

---

## 8. Implementation Summary

### Module Responsibilities

**KeywordDetectionModule**:
- Initialize keyword map (once)
- Detect keywords with context
- Handle negations and modifiers
- Return DetectedKeywords

**ScoringModule**:
- Calculate metric scores
- Apply frequency bonus
- Normalize to 0-100
- Return MetricScores

**SuggestionGenerationModule**:
- Identify patterns
- Select relevant suggestions
- Limit to 3-5 suggestions
- Return suggestion array

**SentimentAnalysisService**:
- Orchestrate modules
- Handle errors
- Manage timeout
- Return AnalysisResult

---

### Performance Optimizations

1. **Hash map for O(1) keyword lookup**
2. **Single-pass text scanning**
3. **Memoization for repeated texts**
4. **Early termination on timeout**
5. **Logarithmic frequency bonus** (prevents exponential growth)

---

### Quality Assurance

1. **Defensive programming** (validate all inputs)
2. **Immutable data structures** (deterministic results)
3. **Modular architecture** (easy to test)
4. **Configuration externalization** (easy to extend)
5. **Comprehensive error handling** (no crashes)

---

**Status**: ✅ NFR Design Complete
