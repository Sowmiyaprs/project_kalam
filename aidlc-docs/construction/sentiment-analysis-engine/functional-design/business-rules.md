# Business Rules - Sentiment Analysis Engine

**Unit**: Sentiment Analysis Engine  
**Phase**: CONSTRUCTION - Functional Design  
**Date**: 2026-05-06

---

## Input Validation Rules

### Rule 1: Minimum Input Length
- **IF** input is empty OR word count < 10
- **THEN** return neutral analysis with default suggestions
- **RATIONALE**: Insufficient data for meaningful analysis

### Rule 2: Maximum Input Length
- **IF** character count > 10,000
- **THEN** truncate to first 10,000 characters, proceed with analysis
- **RATIONALE**: Performance optimization, typical entries are much shorter

### Rule 3: Invalid Characters
- **IF** input contains only special characters or numbers
- **THEN** return neutral analysis
- **RATIONALE**: No meaningful text to analyze

---

## Keyword Detection Rules

### Rule 4: Keyword Matching
- Match keywords case-insensitively with word boundaries
- Match both base form and predefined variations
- Record position for context analysis

### Rule 5: Negation Application
- Look back 2-3 words from keyword
- IF negation word found, invert keyword polarity
- Negated positive keywords contribute to negative scores
- Negated negative keywords contribute to positive scores

### Rule 6: Intensity Modifier Application
- Look back 1-2 words from keyword
- Apply tiered adjustment based on modifier type
- Modifiers stack with negations (modifier applied first, then negation)

---

## Scoring Rules

### Rule 7: Weight Assignment
- Strong keywords: weight = 1.0
- Moderate keywords: weight = 0.6
- Weak keywords: weight = 0.3

### Rule 8: Score Calculation
- Calculate weighted sum of matched keywords
- Add frequency bonus: log(1 + match_count) * 10
- Normalize to 0-100 range
- Default score = 50 if no keywords matched

### Rule 9: Score Boundaries
- Minimum score: 0
- Maximum score: 100
- Scores outside range are clamped

---

## Mood Classification Rules

### Rule 10: Overwhelmed Mood
- **IF** stress_score > 70 AND motivation_score < 40
- **THEN** mood = "Overwhelmed"

### Rule 11: Anxious Mood
- **IF** stress_score > 70 AND focus_score < 40
- **THEN** mood = "Anxious"

### Rule 12: Happy Mood
- **IF** positive_emotion_score > 60
- **THEN** mood = "Happy"

### Rule 13: Sad Mood
- **IF** negative_emotion_score > 60
- **THEN** mood = "Sad"

### Rule 14: Stressed Mood
- **IF** stress_score > 60
- **THEN** mood = "Stressed"

### Rule 15: Calm Mood
- **IF** calm_emotion_score > 60
- **THEN** mood = "Calm"

### Rule 16: Motivated Mood
- **IF** motivation_score > 70
- **THEN** mood = "Motivated"

### Rule 17: Uncertain Mood
- **IF** confidence_score < 30
- **THEN** mood = "Uncertain"

### Rule 18: Neutral Mood (Default)
- **IF** no other mood rules match
- **THEN** mood = "Neutral"

**Priority**: Rules evaluated in order (10-18), first match wins

---

## Productivity Classification Rules

### Rule 19: High Productivity
- **IF** productivity_score >= 70
- **THEN** productivityScore = "High"

### Rule 20: Medium Productivity
- **IF** productivity_score >= 40 AND productivity_score < 70
- **THEN** productivityScore = "Medium"

### Rule 21: Low Productivity
- **IF** productivity_score < 40
- **THEN** productivityScore = "Low"

---

## Focus Classification Rules

### Rule 22: Excellent Focus
- **IF** focus_score >= 75
- **THEN** focusLevel = "Excellent"

### Rule 23: Good Focus
- **IF** focus_score >= 60 AND focus_score < 75
- **THEN** focusLevel = "Good"

### Rule 24: Improving Focus
- **IF** focus_score >= 40 AND focus_score < 60
- **THEN** focusLevel = "Improving"

### Rule 25: Poor Focus
- **IF** focus_score < 40
- **THEN** focusLevel = "Poor"

---

## Suggestion Selection Rules

### Rule 26: Burnout Pattern
- **IF** stress_score > 70 AND motivation_score < 40
- **THEN** select: 1 stress management + 1 work-life balance + 1 motivation booster

### Rule 27: Overwhelm Pattern
- **IF** stress_score > 70 AND focus_score < 40
- **THEN** select: 1 stress management + 1 focus enhancement + 1 productivity improvement

### Rule 28: Disengagement Pattern
- **IF** motivation_score < 40 AND productivity_score < 40
- **THEN** select: 1 motivation booster + 1 productivity improvement + 1 confidence building

### Rule 29: Self-Doubt Pattern
- **IF** confidence_score < 40 AND motivation_score < 40
- **THEN** select: 1 confidence building + 1 motivation booster + 1 positive reinforcement

### Rule 30: High Stress (Standalone)
- **IF** stress_score > 70 AND no pattern matched
- **THEN** select: 2 stress management suggestions

### Rule 31: Low Motivation (Standalone)
- **IF** motivation_score < 40 AND no pattern matched
- **THEN** select: 2 motivation booster suggestions

### Rule 32: Low Focus (Standalone)
- **IF** focus_score < 40 AND no pattern matched
- **THEN** select: 2 focus enhancement suggestions

### Rule 33: Suggestion Count Limit
- **ALWAYS** return 3-5 suggestions
- **IF** < 3 suggestions selected, add general wellness suggestions
- **IF** > 5 suggestions selected, prioritize by severity and limit to 5

---

## Performance Rules

### Rule 34: Analysis Timeout
- **IF** analysis duration > 500ms
- **THEN** cancel current analysis, retry with simplified mode
- **SIMPLIFIED MODE**: Skip modifiers, use only strong keywords, simplified scoring

### Rule 35: Confidence Indicator
- **IF** simplified mode used
- **THEN** set confidence = "low"
- **ELSE IF** match_count < 3
- **THEN** set confidence = "medium"
- **ELSE** set confidence = "high"

---

## Data Integrity Rules

### Rule 36: Result Completeness
- **ALWAYS** return all required fields in AnalysisResult
- **NEVER** return null or undefined for required fields
- Use defaults if calculation fails

### Rule 37: Score Consistency
- All percentage scores must be 0-100
- All categorical scores must be from predefined lists
- Mood must be from predefined mood list

### Rule 38: Suggestion Quality
- Suggestions must be actionable and specific
- No duplicate suggestions in result
- Suggestions must be relevant to detected issues

---

## Error Handling Rules

### Rule 39: Preprocessing Failure
- **IF** preprocessing fails
- **THEN** use raw text, log warning, continue analysis

### Rule 40: Keyword Detection Failure
- **IF** keyword detection fails
- **THEN** return neutral analysis, log error

### Rule 41: Scoring Failure
- **IF** scoring calculation fails for a metric
- **THEN** use default score (50), log error, continue with other metrics

### Rule 42: Suggestion Generation Failure
- **IF** suggestion generation fails
- **THEN** return default suggestions, log error

### Rule 43: Complete Analysis Failure
- **IF** entire analysis fails
- **THEN** return error with user-friendly message
- **MESSAGE**: "Unable to analyze your entry. Please try again."

---

## Validation Rules

### Rule 44: Keyword Dictionary Validation
- All keywords must have base form
- Variations list can be empty but not null
- All keywords must have category and weight tier

### Rule 45: Modifier List Validation
- Negation words list must not be empty
- Intensity modifier lists must not be empty
- No duplicate words across lists

### Rule 46: Suggestion Bank Validation
- Each category must have at least 3 suggestions
- Suggestions must be unique within category
- Suggestions must be non-empty strings

---

## Business Constraints

### Rule 47: Analysis Frequency
- No rate limiting (analyze as many times as user wants)
- Each analysis is independent

### Rule 48: Data Privacy
- No text is sent to external services
- All analysis happens client-side
- No logging of user text content

### Rule 49: Accuracy Disclaimer
- Analysis is for self-reflection, not medical advice
- Results are based on keyword patterns, not clinical assessment
- Users should seek professional help for serious concerns

---

**Status**: ✅ Business Rules Complete
