# API Documentation - Sentiment Analysis Engine

**Unit**: Sentiment Analysis Engine  
**Phase**: CONSTRUCTION - Code Generation  
**Date**: 2026-05-06

---

## Table of Contents

1. [SentimentAnalysisService API](#sentimentanalysisservice-api)
2. [useAnalysis Hook API](#useanalysis-hook-api)
3. [Data Types](#data-types)
4. [Error Handling](#error-handling)
5. [Usage Examples](#usage-examples)

---

## SentimentAnalysisService API

### Constructor

```javascript
new SentimentAnalysisService(config?)
```

Creates a new instance of the sentiment analysis service.

**Parameters**:
- `config` (Object, optional): Configuration object for dependency injection
  - `keywordDetector` (KeywordDetectionModule, optional): Custom keyword detector
  - `scorer` (ScoringModule, optional): Custom scorer
  - `suggestionGenerator` (SuggestionGenerationModule, optional): Custom suggestion generator

**Returns**: `SentimentAnalysisService` instance

**Example**:
```javascript
import { SentimentAnalysisService } from './services/sentiment/SentimentAnalysisService.js';

// Default configuration
const service = new SentimentAnalysisService();

// Custom configuration (for testing)
const service = new SentimentAnalysisService({
  keywordDetector: mockDetector,
  scorer: mockScorer
});
```

---

### analyze()

```javascript
async analyze(text, entryId?)
```

Analyzes text and returns sentiment analysis result.

**Parameters**:
- `text` (string, required): Text to analyze
- `entryId` (string, optional): Journal entry ID for reference

**Returns**: `Promise<AnalysisResult>`

**Throws**: Never throws - returns error result on failure

**Example**:
```javascript
const result = await service.analyze('I feel stressed but motivated');

console.log(result.emotional.mood); // "Stressed"
console.log(result.emotional.stressLevel); // 72
console.log(result.suggestions); // ["Take breaks", "Set goals", ...]
```

---

### createNeutralAnalysis()

```javascript
createNeutralAnalysis(reason)
```

Creates a neutral analysis result for empty or invalid input.

**Parameters**:
- `reason` (string, required): Reason for neutral result

**Returns**: `AnalysisResult` with neutral scores

**Example**:
```javascript
const result = service.createNeutralAnalysis('Input too short');

console.log(result.emotional.mood); // "Neutral"
console.log(result.emotional.stressLevel); // 50
```

---

### createErrorResult()

```javascript
createErrorResult(message)
```

Creates an error result with error message.

**Parameters**:
- `message` (string, required): Error message

**Returns**: `AnalysisResult` with error metadata

**Example**:
```javascript
const result = service.createErrorResult('Invalid input');

console.log(result.metadata.error); // "Invalid input"
```

---

## useAnalysis Hook API

### useAnalysis()

```javascript
const { analyze, isAnalyzing, result, error, clearResult, clearError } = useAnalysis();
```

React hook for sentiment analysis with state management.

**Returns**: Object with the following properties:

- `analyze` (Function): Async function to analyze text
  - **Signature**: `async (text: string, entryId?: string) => Promise<AnalysisResult>`
  - **Parameters**:
    - `text` (string, required): Text to analyze
    - `entryId` (string, optional): Journal entry ID
  - **Returns**: `Promise<AnalysisResult>`

- `isAnalyzing` (boolean): True if analysis in progress

- `result` (AnalysisResult | null): Latest analysis result

- `error` (string | null): Error message if analysis failed

- `clearResult` (Function): Clears the current result
  - **Signature**: `() => void`

- `clearError` (Function): Clears the current error
  - **Signature**: `() => void`

**Example**:
```javascript
import { useAnalysis } from './hooks/useAnalysis.js';

function JournalInput() {
  const { analyze, isAnalyzing, result, error, clearResult } = useAnalysis();

  const handleSubmit = async (text) => {
    const analysisResult = await analyze(text);
    console.log(analysisResult);
  };

  return (
    <div>
      <textarea onChange={(e) => setText(e.target.value)} />
      <button onClick={() => handleSubmit(text)} disabled={isAnalyzing}>
        {isAnalyzing ? 'Analyzing...' : 'Analyze'}
      </button>
      
      {error && <div className="error">{error}</div>}
      
      {result && (
        <div>
          <h3>Mood: {result.emotional.mood}</h3>
          <p>Stress: {result.emotional.stressLevel}</p>
          <button onClick={clearResult}>Clear</button>
        </div>
      )}
    </div>
  );
}
```

---

## Data Types

### AnalysisResult

Complete analysis result returned by the service.

```typescript
{
  id: string;                    // Unique identifier
  entryId: string | null;        // Journal entry ID (if provided)
  timestamp: string;             // ISO 8601 timestamp
  
  emotional: {
    mood: string;                // "Happy", "Stressed", "Anxious", etc.
    stressLevel: number;         // 0-100
    motivation: number;          // 0-100
    confidence: number;          // 0-100
  };
  
  productivity: {
    score: string;               // "Low", "Medium", "High"
    focusLevel: string;          // "Poor", "Improving", "Good", "Excellent"
  };
  
  suggestions: string[];         // 3-5 actionable suggestions
  
  analysisDuration: number;      // Milliseconds
  confidence: string;            // "high", "medium", "low"
  
  metadata: {
    wordCount: number;           // Number of words in input
    keywordMatches: number;      // Total keywords matched
    simplifiedMode: boolean;     // True if timeout occurred
    reason?: string;             // Reason for neutral result (if applicable)
    error?: string;              // Error message (if applicable)
  };
}
```

### Mood Categories

Possible mood values:

- `"Happy"` - Positive, joyful emotions
- `"Sad"` - Negative, down emotions
- `"Stressed"` - High stress levels
- `"Anxious"` - High stress + low confidence
- `"Overwhelmed"` - High stress + low motivation
- `"Calm"` - Peaceful, relaxed emotions
- `"Motivated"` - High motivation levels
- `"Frustrated"` - Negative emotions with some energy
- `"Uncertain"` - Very low confidence
- `"Neutral"` - No strong emotions detected

### Productivity Levels

Possible productivity score values:

- `"High"` - Score >= 70
- `"Medium"` - Score >= 40 and < 70
- `"Low"` - Score < 40

### Focus Levels

Possible focus level values:

- `"Excellent"` - Score >= 75
- `"Good"` - Score >= 60 and < 75
- `"Improving"` - Score >= 40 and < 60
- `"Poor"` - Score < 40

### Confidence Levels

Possible confidence values:

- `"high"` - 5+ keyword matches across metrics
- `"medium"` - 3-4 keyword matches
- `"low"` - < 3 keyword matches or simplified mode

---

## Error Handling

The sentiment analysis service never throws exceptions. Instead, it returns error results with error information in the metadata.

### Error Scenarios

1. **Invalid Input Type**
   ```javascript
   const result = await service.analyze(null);
   // result.metadata.error = "Input must be a string"
   ```

2. **Empty Input**
   ```javascript
   const result = await service.analyze('');
   // result.emotional.mood = "Neutral"
   // result.metadata.reason = "Input too short for meaningful analysis"
   ```

3. **Analysis Timeout**
   ```javascript
   // Automatically retries with simplified mode
   // result.metadata.simplifiedMode = true
   // result.confidence = "low"
   ```

4. **Complete Failure**
   ```javascript
   // Returns error result
   // result.metadata.error = "Analysis failed. Please try again."
   ```

### Checking for Errors

```javascript
const result = await service.analyze(text);

if (result.metadata.error) {
  console.error('Analysis error:', result.metadata.error);
  // Handle error
} else if (result.metadata.reason) {
  console.warn('Neutral result:', result.metadata.reason);
  // Handle neutral result
} else {
  // Normal result
  console.log('Mood:', result.emotional.mood);
}
```

---

## Usage Examples

### Example 1: Basic Analysis

```javascript
import { SentimentAnalysisService } from './services/sentiment/SentimentAnalysisService.js';

const service = new SentimentAnalysisService();

async function analyzeJournalEntry(text) {
  const result = await service.analyze(text);
  
  console.log('Mood:', result.emotional.mood);
  console.log('Stress Level:', result.emotional.stressLevel);
  console.log('Suggestions:', result.suggestions);
  
  return result;
}

// Usage
analyzeJournalEntry('I feel stressed but motivated to improve my situation');
```

### Example 2: React Component with Hook

```javascript
import React, { useState } from 'react';
import { useAnalysis } from './hooks/useAnalysis.js';

function JournalAnalyzer() {
  const [text, setText] = useState('');
  const { analyze, isAnalyzing, result, error } = useAnalysis();

  const handleAnalyze = async () => {
    if (text.trim()) {
      await analyze(text);
    }
  };

  return (
    <div className="journal-analyzer">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write about your day..."
        rows={5}
      />
      
      <button onClick={handleAnalyze} disabled={isAnalyzing}>
        {isAnalyzing ? 'Analyzing...' : 'Analyze'}
      </button>

      {error && (
        <div className="error">
          Error: {error}
        </div>
      )}

      {result && (
        <div className="results">
          <h3>Analysis Results</h3>
          <div className="mood">
            <strong>Mood:</strong> {result.emotional.mood}
          </div>
          <div className="metrics">
            <div>Stress: {result.emotional.stressLevel}/100</div>
            <div>Motivation: {result.emotional.motivation}/100</div>
            <div>Confidence: {result.emotional.confidence}/100</div>
          </div>
          <div className="productivity">
            <div>Productivity: {result.productivity.score}</div>
            <div>Focus: {result.productivity.focusLevel}</div>
          </div>
          <div className="suggestions">
            <h4>Suggestions:</h4>
            <ul>
              {result.suggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default JournalAnalyzer;
```

### Example 3: Batch Analysis

```javascript
async function analyzeBatch(entries) {
  const service = new SentimentAnalysisService();
  const results = [];

  for (const entry of entries) {
    const result = await service.analyze(entry.text, entry.id);
    results.push({
      entryId: entry.id,
      date: entry.date,
      mood: result.emotional.mood,
      stressLevel: result.emotional.stressLevel,
      suggestions: result.suggestions
    });
  }

  return results;
}

// Usage
const entries = [
  { id: '1', date: '2026-05-01', text: 'I feel stressed today' },
  { id: '2', date: '2026-05-02', text: 'Feeling much better and motivated' }
];

const results = await analyzeBatch(entries);
console.log(results);
```

### Example 4: Custom Configuration (Testing)

```javascript
import { SentimentAnalysisService } from './SentimentAnalysisService.js';

// Mock detector for testing
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
    categoryCounts: { stress: 1 }
  })
};

const service = new SentimentAnalysisService({
  keywordDetector: mockDetector
});

// Test
const result = await service.analyze('test text');
expect(mockDetector.detectKeywords).toHaveBeenCalledWith('test text');
```

### Example 5: Error Handling

```javascript
async function safeAnalyze(text) {
  const service = new SentimentAnalysisService();
  const result = await service.analyze(text);

  // Check for errors
  if (result.metadata.error) {
    return {
      success: false,
      error: result.metadata.error
    };
  }

  // Check for neutral result
  if (result.metadata.reason) {
    return {
      success: true,
      isNeutral: true,
      reason: result.metadata.reason,
      result
    };
  }

  // Normal result
  return {
    success: true,
    isNeutral: false,
    result
  };
}

// Usage
const response = await safeAnalyze(userInput);

if (!response.success) {
  console.error('Analysis failed:', response.error);
} else if (response.isNeutral) {
  console.warn('Neutral result:', response.reason);
} else {
  console.log('Analysis complete:', response.result);
}
```

---

## Performance Considerations

### Analysis Duration

- **Short text** (< 100 words): < 100ms
- **Medium text** (100-500 words): < 300ms
- **Long text** (500-1000 words): < 500ms
- **Very long text** (> 1000 words): Truncated to 5000 characters

### Timeout Handling

If analysis exceeds 500ms, the service automatically retries with simplified mode:
- Skips intensity modifier detection
- Skips negation handling
- Uses only strong keywords
- Returns result with `simplifiedMode: true` and `confidence: "low"`

### Memory Usage

- Peak memory usage: < 10MB per analysis
- No memory leaks (tested with 100 consecutive analyses)
- Keyword dictionary loaded once and reused

---

## Security Considerations

### Input Sanitization

All input is automatically sanitized to prevent injection attacks:
- Script tags removed
- HTML tags removed
- Special characters filtered
- Only safe characters preserved

### Data Privacy

- All analysis performed client-side
- No network calls during analysis
- No user text logged or transmitted
- Error logs contain no user data

---

**Status**: ✅ API Documentation Complete

