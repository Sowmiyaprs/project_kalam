# Testing Guide - Sentiment Analysis Engine

**Unit**: Sentiment Analysis Engine  
**Phase**: CONSTRUCTION - Code Generation  
**Date**: 2026-05-06

---

## Table of Contents

1. [Test Structure](#test-structure)
2. [Running Tests](#running-tests)
3. [Test Coverage](#test-coverage)
4. [Test Data Fixtures](#test-data-fixtures)
5. [Adding New Tests](#adding-new-tests)
6. [Mocking and Stubbing](#mocking-and-stubbing)

---

## Test Structure

### Test Organization

Tests are organized in a single comprehensive test suite located at:
```
src/services/sentiment/__tests__/SentimentAnalysis.test.js
```

The test suite is divided into sections:

1. **KeywordDetectionModule Tests**
   - Keyword matching (exact + variations)
   - Negation detection
   - Intensity modifiers
   - Text preprocessing
   - Edge cases

2. **ScoringModule Tests**
   - Score calculation
   - Score normalization
   - Mood classification
   - Productivity/focus classification
   - Determinism

3. **SuggestionGenerationModule Tests**
   - Pattern identification
   - Suggestion selection
   - Neutral suggestions

4. **SentimentAnalysisService Tests**
   - Full analysis pipeline
   - Empty input handling
   - Error handling
   - Performance
   - Determinism

5. **Integration Tests**
   - Various text samples
   - Different emotional patterns

6. **Performance Tests**
   - Analysis duration
   - Consecutive analyses

---

## Running Tests

### Prerequisites

Ensure you have Jest installed:

```bash
npm install --save-dev jest @jest/globals
```

### Configuration

Add to `package.json`:

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  },
  "jest": {
    "testEnvironment": "node",
    "transform": {},
    "moduleNameMapper": {
      "^(\\.{1,2}/.*)\\.js$": "$1"
    }
  }
}
```

### Run All Tests

```bash
npm test
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

### Run Tests with Coverage

```bash
npm run test:coverage
```

### Run Specific Test Suite

```bash
npm test -- --testNamePattern="KeywordDetectionModule"
```

### Run Specific Test

```bash
npm test -- --testNamePattern="should detect exact keyword matches"
```

---

## Test Coverage

### Coverage Targets

- **Overall Coverage**: > 80%
- **KeywordDetectionModule**: > 85%
- **ScoringModule**: > 85%
- **SuggestionGenerationModule**: > 80%
- **SentimentAnalysisService**: > 85%

### Viewing Coverage Report

After running `npm run test:coverage`, open:
```
coverage/lcov-report/index.html
```

### Coverage Metrics

- **Statements**: Percentage of statements executed
- **Branches**: Percentage of conditional branches executed
- **Functions**: Percentage of functions called
- **Lines**: Percentage of lines executed

---

## Test Data Fixtures

### Sample Texts

```javascript
const testFixtures = {
  // Happy path
  stressed: 'I feel very stressed and overwhelmed today',
  motivated: 'I am extremely motivated and driven to succeed',
  happy: 'I feel very happy and joyful today',
  mixed: 'I feel stressed but also motivated and confident',
  
  // Edge cases
  empty: '',
  short: 'ok',
  long: 'stressed '.repeat(1000),
  noKeywords: 'The quick brown fox jumps over the lazy dog',
  
  // Negation
  negated: 'I am not happy today',
  negatedContraction: "I don't feel stressed",
  
  // Intensity modifiers
  amplified: 'I am very stressed',
  diminished: 'I am slightly worried',
  
  // Special characters
  withHtml: 'I feel <script>stressed</script>',
  withSpecialChars: 'I feel stressed!!! @#$%',
  
  // Contractions
  withContractions: "I don't feel good, I'm stressed"
};
```

### Expected Results

```javascript
const expectedResults = {
  stressed: {
    mood: ['Stressed', 'Anxious', 'Overwhelmed'],
    stressLevel: { min: 60, max: 100 },
    suggestions: { min: 3, max: 5 }
  },
  
  happy: {
    mood: 'Happy',
    stressLevel: { min: 0, max: 50 },
    suggestions: { min: 3, max: 5 }
  },
  
  empty: {
    mood: 'Neutral',
    stressLevel: 50,
    confidence: 'low'
  }
};
```

---

## Adding New Tests

### Test Template

```javascript
describe('ModuleName', () => {
  let module;

  beforeEach(() => {
    module = new ModuleName();
  });

  describe('Feature Name', () => {
    it('should do something specific', () => {
      // Arrange
      const input = 'test input';
      const expected = 'expected output';

      // Act
      const result = module.method(input);

      // Assert
      expect(result).toBe(expected);
    });
  });
});
```

### Example: Adding Keyword Detection Test

```javascript
describe('KeywordDetectionModule', () => {
  let detector;

  beforeEach(() => {
    detector = new KeywordDetectionModule();
  });

  describe('New Feature', () => {
    it('should detect compound keywords', () => {
      // Arrange
      const text = 'I feel burned out';
      
      // Act
      const result = detector.detectKeywords(text);
      
      // Assert
      expect(result.keywords.length).toBeGreaterThan(0);
      expect(result.keywords.some(k => k.baseKeyword === 'burned out')).toBe(true);
    });
  });
});
```

### Example: Adding Scoring Test

```javascript
describe('ScoringModule', () => {
  let scorer;

  beforeEach(() => {
    scorer = new ScoringModule();
  });

  describe('New Classification', () => {
    it('should classify burnout pattern', () => {
      // Arrange
      const scores = {
        stress: { normalizedScore: 80 },
        motivation: { normalizedScore: 30 },
        confidence: { normalizedScore: 50 }
      };
      
      // Act
      const mood = scorer.classifyMood(scores);
      
      // Assert
      expect(mood).toBe('Overwhelmed');
    });
  });
});
```

### Example: Adding Integration Test

```javascript
describe('Integration Tests', () => {
  let service;

  beforeEach(() => {
    service = new SentimentAnalysisService();
  });

  describe('New Scenario', () => {
    it('should handle multilingual text', async () => {
      // Arrange
      const text = 'I feel stressed (muy estresado)';
      
      // Act
      const result = await service.analyze(text);
      
      // Assert
      expect(result.emotional.stressLevel).toBeGreaterThan(50);
      expect(result.suggestions.length).toBeGreaterThanOrEqual(3);
    });
  });
});
```

---

## Mocking and Stubbing

### Mocking KeywordDetectionModule

```javascript
const mockDetector = {
  detectKeywords: jest.fn().mockReturnValue({
    keywords: [
      {
        word: 'stressed',
        baseKeyword: 'stressed',
        category: 'stress',
        baseWeight: 1.0,
        adjustedWeight: 1.0,
        isNegated: false,
        intensityModifier: null,
        position: 2
      }
    ],
    totalMatches: 1,
    categoryCounts: { stress: 1, motivation: 0, confidence: 0, productivity: 0, focus: 0, mood: 0 }
  })
};

const service = new SentimentAnalysisService({
  keywordDetector: mockDetector
});

// Test
const result = await service.analyze('test');
expect(mockDetector.detectKeywords).toHaveBeenCalled();
```

### Mocking ScoringModule

```javascript
const mockScorer = {
  calculateScores: jest.fn().mockReturnValue({
    stress: { normalizedScore: 75, matchCount: 2, confidence: 'high' },
    motivation: { normalizedScore: 50, matchCount: 0, confidence: 'low' },
    confidence: { normalizedScore: 50, matchCount: 0, confidence: 'low' },
    productivity: { normalizedScore: 50, matchCount: 0, confidence: 'low' },
    focus: { normalizedScore: 50, matchCount: 0, confidence: 'low' },
    mood: { positiveScore: 50, negativeScore: 50, calmScore: 50, dominantEmotion: 'neutral' }
  }),
  classifyMood: jest.fn().mockReturnValue('Stressed'),
  classifyProductivity: jest.fn().mockReturnValue('Medium'),
  classifyFocus: jest.fn().mockReturnValue('Improving')
};

const service = new SentimentAnalysisService({
  scorer: mockScorer
});
```

### Mocking SuggestionGenerationModule

```javascript
const mockGenerator = {
  generateSuggestions: jest.fn().mockReturnValue([
    'Take a break',
    'Practice deep breathing',
    'Set small goals'
  ]),
  identifyPatterns: jest.fn().mockReturnValue([
    { name: 'burnout', detected: true, severity: 75 }
  ])
};

const service = new SentimentAnalysisService({
  suggestionGenerator: mockGenerator
});
```

### Stubbing Performance.now()

```javascript
describe('Performance Tests', () => {
  let originalPerformanceNow;

  beforeEach(() => {
    originalPerformanceNow = performance.now;
    let time = 0;
    performance.now = jest.fn(() => {
      time += 10; // Increment by 10ms each call
      return time;
    });
  });

  afterEach(() => {
    performance.now = originalPerformanceNow;
  });

  it('should track analysis duration', async () => {
    const service = new SentimentAnalysisService();
    const result = await service.analyze('test');
    
    expect(result.analysisDuration).toBeGreaterThan(0);
  });
});
```

---

## Best Practices

### 1. Test Naming

Use descriptive test names that explain what is being tested:

✅ **Good**:
```javascript
it('should detect negation with "not" keyword', () => { ... });
```

❌ **Bad**:
```javascript
it('test negation', () => { ... });
```

### 2. Arrange-Act-Assert Pattern

Structure tests clearly:

```javascript
it('should calculate stress score correctly', () => {
  // Arrange
  const keywords = detector.detectKeywords('I feel stressed');
  
  // Act
  const scores = scorer.calculateScores(keywords);
  
  // Assert
  expect(scores.stress.normalizedScore).toBeGreaterThan(50);
});
```

### 3. Test One Thing

Each test should verify one specific behavior:

✅ **Good**:
```javascript
it('should detect exact keyword matches', () => { ... });
it('should detect keyword variations', () => { ... });
```

❌ **Bad**:
```javascript
it('should detect keywords', () => {
  // Tests exact matches, variations, negations, modifiers...
});
```

### 4. Use beforeEach for Setup

Initialize modules in `beforeEach` to ensure clean state:

```javascript
describe('ModuleName', () => {
  let module;

  beforeEach(() => {
    module = new ModuleName();
  });

  // Tests...
});
```

### 5. Test Edge Cases

Always test edge cases:

```javascript
it('should handle empty text', () => { ... });
it('should handle very long text', () => { ... });
it('should handle text with no keywords', () => { ... });
it('should handle special characters', () => { ... });
```

### 6. Use Meaningful Assertions

Use specific assertions:

✅ **Good**:
```javascript
expect(result.keywords.length).toBeGreaterThan(0);
expect(result.keywords.some(k => k.baseKeyword === 'stressed')).toBe(true);
```

❌ **Bad**:
```javascript
expect(result).toBeTruthy();
```

### 7. Test Determinism

Verify same input produces same output:

```javascript
it('should produce same results for same input', () => {
  const text = 'I feel stressed';
  const result1 = detector.detectKeywords(text);
  const result2 = detector.detectKeywords(text);
  
  expect(result1).toEqual(result2);
});
```

---

## Debugging Tests

### Run Single Test

```bash
npm test -- --testNamePattern="should detect exact keyword matches"
```

### Enable Verbose Output

```bash
npm test -- --verbose
```

### Debug in VS Code

Add to `.vscode/launch.json`:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Jest Debug",
  "program": "${workspaceFolder}/node_modules/.bin/jest",
  "args": ["--runInBand", "--no-cache"],
  "console": "integratedTerminal",
  "internalConsoleOptions": "neverOpen"
}
```

### Add Console Logs

```javascript
it('should do something', () => {
  const result = module.method(input);
  console.log('Result:', JSON.stringify(result, null, 2));
  expect(result).toBe(expected);
});
```

---

## Continuous Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm test -- --coverage
      - uses: codecov/codecov-action@v2
        with:
          files: ./coverage/lcov.info
```

---

## Troubleshooting

### Tests Failing Randomly

**Issue**: Tests pass sometimes, fail other times

**Solution**: Check for:
- Async operations without proper awaits
- Shared state between tests
- Time-dependent logic
- Random number generation

### Coverage Not Reaching Target

**Issue**: Coverage below 80%

**Solution**:
- Identify uncovered lines with coverage report
- Add tests for edge cases
- Test error paths
- Test all conditional branches

### Tests Running Slowly

**Issue**: Test suite takes too long

**Solution**:
- Use mocks for expensive operations
- Avoid unnecessary async operations
- Run tests in parallel
- Optimize test data

---

**Status**: ✅ Testing Guide Complete

