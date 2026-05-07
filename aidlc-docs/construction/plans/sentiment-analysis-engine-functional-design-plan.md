# Functional Design Plan - Unit 1: Sentiment Analysis Engine

**Unit**: Sentiment Analysis Engine  
**Phase**: CONSTRUCTION - Functional Design  
**Date**: 2026-05-06  
**Status**: Planning

---

## Unit Context

**Purpose**: Analyze user journal entries to detect emotional state and generate insights

**Modules**:
1. KeywordDetectionModule - Scan text for emotion keywords
2. ScoringModule - Calculate weighted scores with contextual adjustments
3. SuggestionGenerationModule - Generate AI-powered recommendations

**Key Requirements**:
- Weighted keyword analysis with context (negations, intensity modifiers)
- Detect 6 metrics: mood, stress, motivation, confidence, productivity, focus
- Generate 3-5 personalized suggestions
- Analysis < 500ms for typical entries

---

## Functional Design Questions

### Business Logic Modeling

#### Question 1: Keyword Matching Strategy
How should keywords be matched in the text?

A) Exact word matching only (e.g., "stressed" matches "stressed" but not "stressing")
B) Stem matching (e.g., "stress" matches "stressed", "stressing", "stressful")
C) Exact + common variations (predefined list of variations per keyword)
D) Case-insensitive exact matching with word boundaries
X) Other (please describe after [Answer]: tag below)

[Answer]: C

---

#### Question 2: Negation Detection Scope
How far should negation words affect subsequent keywords?

A) Next word only (e.g., "not happy" → negate "happy" only)
B) Next 2-3 words (e.g., "not very happy" → negate "happy")
C) Until punctuation (e.g., "not happy or excited" → negate both)
D) Configurable window (e.g., 3 words by default)
X) Other (please describe after [Answer]: tag below)

[Answer]: B

---

#### Question 3: Intensity Modifier Application
How should intensity modifiers affect scores?

A) Fixed adjustment (e.g., "very" always adds +20%, "slightly" always adds -20%)
B) Proportional adjustment (e.g., "very" multiplies by 1.5, "slightly" multiplies by 0.5)
C) Context-dependent (different adjustments for different emotions)
D) Tiered system (very = +30%, quite = +15%, slightly = -15%, barely = -30%)
X) Other (please describe after [Answer]: tag below)

[Answer]: D

---

### Domain Model

#### Question 4: Keyword Weight System
How should keywords be weighted for scoring?

A) All keywords equal weight (1.0)
B) Three tiers (strong = 1.0, moderate = 0.6, weak = 0.3)
C) Five tiers (very strong = 1.0, strong = 0.75, moderate = 0.5, weak = 0.25, very weak = 0.1)
D) Continuous weights (each keyword has specific weight between 0-1)
X) Other (please describe after [Answer]: tag below)

[Answer]: B

---

#### Question 5: Metric Score Calculation
How should final metric scores be calculated from keyword matches?

A) Simple average of matched keyword weights
B) Weighted sum normalized to 0-100 range
C) Frequency-based (more matches = higher score, with diminishing returns)
D) Hybrid (weighted sum with frequency bonus, normalized to 0-100)
X) Other (please describe after [Answer]: tag below)

[Answer]: D

---

### Business Rules

#### Question 6: Mood Classification Logic
How should mood be determined from emotional keywords?

A) Highest scoring emotion category wins (e.g., if happiness score > all others, mood = "Happy")
B) Threshold-based (e.g., if positive > 60%, mood = "Happy"; if negative > 60%, mood = "Sad")
C) Combination logic (e.g., high stress + low motivation = "Overwhelmed")
D) Predefined mood profiles matching keyword patterns
X) Other (please describe after [Answer]: tag below)

[Answer]: C

---

#### Question 7: Suggestion Selection Logic
How should suggestions be selected for the user?

A) Rule-based (if stress > 70%, include stress management suggestions)
B) Priority-based (rank all suggestions, pick top 3-5)
C) Combination-based (select suggestions addressing multiple detected issues)
D) Template-based (predefined suggestion sets for common emotional states)
X) Other (please describe after [Answer]: tag below)

[Answer]: C

---

### Data Flow

#### Question 8: Text Preprocessing
What preprocessing should be applied to input text?

A) None (analyze raw text as-is)
B) Basic (lowercase, trim whitespace)
C) Standard (lowercase, remove special characters, normalize whitespace)
D) Advanced (lowercase, remove special chars, expand contractions, normalize whitespace)
X) Other (please describe after [Answer]: tag below)

[Answer]: D

---

#### Question 9: Empty/Invalid Input Handling
How should the system handle empty or very short input?

A) Return error (require minimum 10 words)
B) Return neutral analysis (all scores = 50, mood = "Neutral")
C) Return partial analysis with confidence indicator
D) Analyze anyway (even single words can have sentiment)
X) Other (please describe after [Answer]: tag below)

[Answer]: B

---

### Error Handling

#### Question 10: Analysis Timeout Handling
What should happen if analysis takes longer than 500ms?

A) Return error immediately
B) Continue analysis, return when complete (no timeout)
C) Return partial results after timeout
D) Retry with simplified analysis (skip advanced features)
X) Other (please describe after [Answer]: tag below)

[Answer]: D

---

## Generation Plan

Once all questions are answered, the following artifacts will be generated:

### Phase 1: Business Logic Model
- [x] Define keyword detection algorithm
- [x] Define scoring algorithm with formulas
- [x] Define suggestion generation logic
- [x] Document negation and modifier handling
- [x] Create `business-logic-model.md`

### Phase 2: Domain Entities
- [x] Define DetectedKeywords structure
- [x] Define MetricScores structure
- [x] Define AnalysisResult structure
- [x] Define keyword categories and weights
- [x] Create `domain-entities.md`

### Phase 3: Business Rules
- [x] Define mood classification rules
- [x] Define score normalization rules
- [x] Define suggestion selection rules
- [x] Define validation rules
- [x] Create `business-rules.md`

### Phase 4: Validation
- [x] Verify all business logic is complete
- [x] Ensure algorithms are well-defined
- [x] Validate business rules cover all scenarios

---

## Instructions

1. Answer all 10 questions above by filling in the letter choice (A, B, C, D, or X) after each [Answer]: tag
2. If you choose X (Other), please describe your preference after the [Answer]: tag
3. Save this file when complete
4. Let me know when you're done answering all questions

I will then analyze your answers and generate the complete functional design artifacts for Unit 1.
