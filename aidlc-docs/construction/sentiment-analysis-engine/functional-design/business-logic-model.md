# Business Logic Model - Sentiment Analysis Engine

**Unit**: Sentiment Analysis Engine  
**Phase**: CONSTRUCTION - Functional Design  
**Date**: 2026-05-06

---

## Overview

The Sentiment Analysis Engine uses a modular keyword-based approach with three core modules:
1. **KeywordDetectionModule**: Identifies emotion keywords with variations, negations, and intensity modifiers
2. **ScoringModule**: Calculates weighted metric scores with frequency bonuses
3. **SuggestionGenerationModule**: Selects personalized suggestions based on detected emotional patterns

---

## Module 1: Keyword Detection

### Algorithm

```
INPUT: preprocessed_text (string)
OUTPUT: DetectedKeywords

1. Tokenize text into words
2. For each word in text:
   a. Check against keyword dictionary (exact + variations)
   b. If match found:
      - Record keyword, category, base_weight
      - Check for negation in previous 2-3 words
      - Check for intensity modifier in previous 1-2 words
      - Apply modifiers to weight
      - Store in DetectedKeywords
3. Return DetectedKeywords
```

### Keyword Matching

**Strategy**: Exact + Common Variations

**Implementation**:
- Maintain dictionary with base keywords and predefined variations
- Example: "stress" → ["stress", "stressed", "stressing", "stressful", "stressor"]
- Case-insensitive matching with word boundaries
- Match against both base and variation forms

### Negation Handling

**Scope**: Next 2-3 words

**Negation Words**: not, no, never, don't, can't, won't, isn't, aren't, wasn't, weren't

**Algorithm**:
```
For each detected keyword:
  Look back 2-3 words
  If negation word found:
    Invert keyword polarity
    (positive → negative, negative → positive)
    Mark as negated
```

**Examples**:
- "not happy" → negate "happy"
- "not very happy" → negate "happy" (modifier applied first, then negated)
- "I am not feeling stressed today" → negate "stressed"

### Intensity Modifier Handling

**System**: Tiered adjustments

**Modifiers**:
- **Amplifiers** (increase intensity):
  - very, extremely, really, so, incredibly → +30%
  - quite, pretty, fairly → +15%
- **Diminishers** (decrease intensity):
  - slightly, somewhat, a bit, kind of → -15%
  - barely, hardly, scarcely → -30%

**Algorithm**:
```
For each detected keyword:
  Look back 1-2 words
  If intensity modifier found:
    Apply tier adjustment to keyword weight
    weight = base_weight * (1 + adjustment_percentage)
```

**Examples**:
- "very stressed" → stress weight * 1.30
- "slightly worried" → worry weight * 0.85
- "extremely motivated" → motivation weight * 1.30

---

## Module 2: Scoring

### Keyword Weight System

**Three-Tier System**:
- **Strong** (1.0): Primary emotion indicators
- **Moderate** (0.6): Secondary emotion indicators
- **Weak** (0.3): Tertiary or ambiguous indicators

**Weight Assignment** (examples):
- Stress: "overwhelmed" (1.0), "stressed" (1.0), "pressure" (0.6), "busy" (0.3)
- Motivation: "driven" (1.0), "motivated" (1.0), "determined" (0.6), "interested" (0.3)
- Mood: "happy" (1.0), "joyful" (1.0), "content" (0.6), "okay" (0.3)

### Score Calculation Algorithm

**Hybrid Approach**: Weighted sum with frequency bonus, normalized to 0-100

```
For each metric (stress, motivation, confidence, productivity, focus):
  
  1. Calculate weighted sum:
     weighted_sum = Σ(keyword_weight * modifier_adjustment)
     
  2. Calculate frequency bonus:
     match_count = number of keywords matched for this metric
     frequency_bonus = log(1 + match_count) * 10
     
  3. Calculate raw score:
     raw_score = weighted_sum * 20 + frequency_bonus
     
  4. Normalize to 0-100:
     final_score = min(100, max(0, raw_score))
     
  5. Apply negation inversions:
     If keyword was negated, invert contribution
     (positive keywords become negative, vice versa)
```

**Default Score**: If no keywords detected for a metric, score = 50 (neutral)

**Examples**:
- 1 strong keyword (1.0): 1.0 * 20 + log(2) * 10 ≈ 23
- 2 strong keywords (1.0 each): 2.0 * 20 + log(3) * 10 ≈ 51
- 1 strong + 2 moderate (1.0 + 0.6 + 0.6): 2.2 * 20 + log(4) * 10 ≈ 58

---

## Module 3: Suggestion Generation

### Suggestion Selection Logic

**Combination-Based Approach**: Select suggestions addressing multiple detected issues

**Algorithm**:
```
1. Analyze metric scores to identify issues:
   - High stress (> 70)
   - Low motivation (< 40)
   - Low confidence (< 40)
   - Low productivity (< 40)
   - Low focus (< 40)
   
2. Identify issue combinations:
   - High stress + Low motivation → "Burnout pattern"
   - High stress + Low focus → "Overwhelm pattern"
   - Low motivation + Low productivity → "Disengagement pattern"
   - Low confidence + Low motivation → "Self-doubt pattern"
   
3. Select suggestions:
   - For each identified pattern, add 1-2 relevant suggestions
   - For standalone issues, add 1 suggestion each
   - Prioritize by severity (higher scores = higher priority)
   - Limit to 3-5 total suggestions
   
4. Return selected suggestions
```

### Suggestion Categories

**Stress Management**:
- "Take short focused breaks every 90 minutes"
- "Practice deep breathing exercises"
- "Prioritize tasks and tackle one at a time"
- "Set boundaries and learn to say no"

**Motivation Boosters**:
- "Set small, achievable goals for today"
- "Reward yourself for completing tasks"
- "Connect your work to your larger purpose"
- "Break large tasks into smaller steps"

**Focus Enhancement**:
- "Eliminate distractions in your workspace"
- "Use the Pomodoro technique (25 min focus, 5 min break)"
- "Practice single-tasking instead of multitasking"
- "Get adequate sleep and stay hydrated"

**Confidence Building**:
- "Reflect on past successes and achievements"
- "Practice positive self-talk"
- "Seek feedback and learn from it"
- "Celebrate small wins"

**Productivity Improvement**:
- "Plan your day the night before"
- "Tackle your most important task first"
- "Batch similar tasks together"
- "Use time-blocking to structure your day"

**Work-Life Balance**:
- "Schedule time for hobbies and relaxation"
- "Maintain regular sleep schedule"
- "Exercise regularly to reduce stress"
- "Connect with friends and family"

### Pattern-Based Selection

**Burnout Pattern** (High stress + Low motivation):
- Stress management suggestion
- Work-life balance suggestion
- Motivation booster

**Overwhelm Pattern** (High stress + Low focus):
- Stress management suggestion
- Focus enhancement suggestion
- Productivity improvement

**Disengagement Pattern** (Low motivation + Low productivity):
- Motivation booster
- Productivity improvement
- Confidence building

**Self-Doubt Pattern** (Low confidence + Low motivation):
- Confidence building
- Motivation booster
- Positive reinforcement

---

## Text Preprocessing

### Advanced Preprocessing Pipeline

```
INPUT: raw_text (string)
OUTPUT: preprocessed_text (string)

1. Lowercase conversion
2. Expand contractions:
   - "don't" → "do not"
   - "can't" → "cannot"
   - "I'm" → "I am"
   - "won't" → "will not"
3. Remove special characters (keep letters, numbers, spaces)
4. Normalize whitespace (multiple spaces → single space)
5. Trim leading/trailing whitespace
6. Return preprocessed_text
```

**Contraction Expansion Map**:
```javascript
{
  "don't": "do not",
  "can't": "cannot",
  "won't": "will not",
  "isn't": "is not",
  "aren't": "are not",
  "wasn't": "was not",
  "weren't": "were not",
  "I'm": "I am",
  "you're": "you are",
  "he's": "he is",
  "she's": "she is",
  "it's": "it is",
  "we're": "we are",
  "they're": "they are",
  "I've": "I have",
  "you've": "you have",
  "we've": "we have",
  "they've": "they have",
  "I'll": "I will",
  "you'll": "you will",
  "he'll": "he will",
  "she'll": "she will",
  "we'll": "we will",
  "they'll": "they will"
}
```

---

## Mood Classification

### Combination Logic

**Algorithm**:
```
1. Calculate emotion category scores:
   - Positive emotions: happy, joyful, content, excited, grateful
   - Negative emotions: sad, angry, frustrated, disappointed
   - Stress emotions: stressed, anxious, overwhelmed, tense
   - Calm emotions: calm, relaxed, peaceful, content
   
2. Identify dominant patterns:
   IF stress_score > 70 AND motivation_score < 40:
     mood = "Overwhelmed"
   ELSE IF stress_score > 70 AND focus_score < 40:
     mood = "Anxious"
   ELSE IF positive_score > 60:
     mood = "Happy"
   ELSE IF negative_score > 60:
     mood = "Sad"
   ELSE IF stress_score > 60:
     mood = "Stressed"
   ELSE IF calm_score > 60:
     mood = "Calm"
   ELSE IF motivation_score > 70:
     mood = "Motivated"
   ELSE IF confidence_score < 30:
     mood = "Uncertain"
   ELSE:
     mood = "Neutral"
     
3. Return mood
```

**Mood Categories**:
- Happy, Sad, Stressed, Anxious, Overwhelmed, Calm, Motivated, Frustrated, Uncertain, Neutral

---

## Productivity & Focus Classification

### Productivity Score

**Categorical Mapping**:
```
IF productivity_score >= 70: "High"
ELSE IF productivity_score >= 40: "Medium"
ELSE: "Low"
```

### Focus Level

**Categorical Mapping**:
```
IF focus_score >= 75: "Excellent"
ELSE IF focus_score >= 60: "Good"
ELSE IF focus_score >= 40: "Improving"
ELSE: "Poor"
```

---

## Empty/Invalid Input Handling

**Rule**: Return neutral analysis for empty or very short input (< 10 words)

**Neutral Analysis**:
```javascript
{
  mood: "Neutral",
  stressLevel: 50,
  motivation: 50,
  confidence: 50,
  productivityScore: "Medium",
  focusLevel: "Improving",
  suggestions: [
    "Share more details about your thoughts for better insights",
    "Describe your current feelings and challenges",
    "Write about your goals and what's on your mind"
  ]
}
```

---

## Timeout Handling

**Rule**: If analysis exceeds 500ms, retry with simplified analysis

**Simplified Analysis**:
- Skip intensity modifier detection
- Skip negation handling
- Use only strong keywords (weight = 1.0)
- Simplified scoring (weighted sum only, no frequency bonus)
- Return results with confidence indicator: "low"

**Timeout Algorithm**:
```
1. Start analysis with timer
2. If timer exceeds 500ms:
   a. Cancel current analysis
   b. Retry with simplified mode
   c. Add confidence: "low" to result
3. Return result
```

---

## Performance Targets

- **Normal Analysis**: < 500ms for entries up to 5000 characters
- **Simplified Analysis**: < 200ms
- **Keyword Detection**: < 100ms
- **Scoring**: < 50ms
- **Suggestion Generation**: < 50ms

---

**Status**: ✅ Business Logic Model Complete
