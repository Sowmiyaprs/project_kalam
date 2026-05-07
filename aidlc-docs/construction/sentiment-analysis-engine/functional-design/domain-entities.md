# Domain Entities - Sentiment Analysis Engine

**Unit**: Sentiment Analysis Engine  
**Phase**: CONSTRUCTION - Functional Design  
**Date**: 2026-05-06

---

## Entity: DetectedKeywords

**Purpose**: Store all keywords detected in text with their metadata

**Structure**:
```javascript
{
  keywords: [
    {
      word: string,              // Matched word from text
      baseKeyword: string,       // Base form (e.g., "stress" for "stressed")
      category: string,          // "stress", "motivation", "mood", etc.
      baseWeight: number,        // 1.0, 0.6, or 0.3
      adjustedWeight: number,    // After modifiers applied
      isNegated: boolean,        // True if negation detected
      intensityModifier: string | null,  // "very", "slightly", etc.
      position: number           // Word position in text
    }
  ],
  totalMatches: number,
  categoryCounts: {
    stress: number,
    motivation: number,
    confidence: number,
    productivity: number,
    focus: number,
    mood: number
  }
}
```

---

## Entity: MetricScores

**Purpose**: Store calculated scores for all metrics

**Structure**:
```javascript
{
  stress: {
    rawScore: number,          // Before normalization
    normalizedScore: number,   // 0-100
    matchCount: number,        // Keywords matched
    confidence: string         // "high", "medium", "low"
  },
  motivation: {
    rawScore: number,
    normalizedScore: number,
    matchCount: number,
    confidence: string
  },
  confidence: {
    rawScore: number,
    normalizedScore: number,
    matchCount: number,
    confidence: string
  },
  productivity: {
    rawScore: number,
    normalizedScore: number,
    matchCount: number,
    confidence: string
  },
  focus: {
    rawScore: number,
    normalizedScore: number,
    matchCount: number,
    confidence: string
  },
  mood: {
    positiveScore: number,
    negativeScore: number,
    stressScore: number,
    calmScore: number,
    dominantEmotion: string
  }
}
```

---

## Entity: AnalysisResult

**Purpose**: Final analysis output returned to UI

**Structure**:
```javascript
{
  id: string,                    // UUID
  entryId: string,               // Reference to journal entry
  timestamp: string,             // ISO 8601
  emotional: {
    mood: string,                // "Happy", "Stressed", etc.
    stressLevel: number,         // 0-100
    motivation: number,          // 0-100
    confidence: number           // 0-100
  },
  productivity: {
    score: string,               // "Low", "Medium", "High"
    focusLevel: string           // "Poor", "Improving", "Good", "Excellent"
  },
  suggestions: string[],         // 3-5 suggestions
  analysisDuration: number,      // Milliseconds
  confidence: string,            // "high", "medium", "low"
  metadata: {
    wordCount: number,
    keywordMatches: number,
    simplifiedMode: boolean      // True if timeout occurred
  }
}
```

---

## Keyword Dictionary Structure

**Purpose**: Define all keywords with categories and weights

**Structure**:
```javascript
{
  stress: {
    strong: [
      { base: "overwhelmed", variations: ["overwhelm", "overwhelming"] },
      { base: "stressed", variations: ["stress", "stressing", "stressful", "stressor"] },
      { base: "anxious", variations: ["anxiety", "anxiously"] },
      { base: "panic", variations: ["panicking", "panicked"] }
    ],
    moderate: [
      { base: "worried", variations: ["worry", "worrying", "worries"] },
      { base: "tense", variations: ["tension", "tensed"] },
      { base: "pressure", variations: ["pressured", "pressuring"] }
    ],
    weak: [
      { base: "busy", variations: ["busier", "busiest"] },
      { base: "hectic", variations: [] },
      { base: "rushed", variations: ["rush", "rushing"] }
    ]
  },
  motivation: {
    strong: [
      { base: "motivated", variations: ["motivate", "motivating", "motivation"] },
      { base: "driven", variations: ["drive", "driving"] },
      { base: "determined", variations: ["determine", "determination"] },
      { base: "ambitious", variations: ["ambition"] }
    ],
    moderate: [
      { base: "interested", variations: ["interest", "interesting"] },
      { base: "engaged", variations: ["engage", "engaging", "engagement"] },
      { base: "focused", variations: ["focus", "focusing"] }
    ],
    weak: [
      { base: "willing", variations: [] },
      { base: "ready", variations: [] }
    ]
  },
  confidence: {
    strong: [
      { base: "confident", variations: ["confidence"] },
      { base: "capable", variations: ["capability"] },
      { base: "competent", variations: ["competence"] }
    ],
    moderate: [
      { base: "sure", variations: [] },
      { base: "able", variations: ["ability"] }
    ],
    weak: [
      { base: "hopeful", variations: ["hope", "hoping"] }
    ]
  },
  productivity: {
    strong: [
      { base: "productive", variations: ["productivity", "produce", "producing"] },
      { base: "accomplished", variations: ["accomplish", "accomplishing", "accomplishment"] },
      { base: "efficient", variations: ["efficiency", "efficiently"] },
      { base: "completed", variations: ["complete", "completing", "completion"] }
    ],
    moderate: [
      { base: "progress", variations: ["progressing", "progressed"] },
      { base: "working", variations: ["work", "worked"] },
      { base: "doing", variations: ["do", "done", "did"] }
    ],
    weak: [
      { base: "trying", variations: ["try", "tried"] },
      { base: "attempting", variations: ["attempt", "attempted"] }
    ]
  },
  focus: {
    strong: [
      { base: "focused", variations: ["focus", "focusing"] },
      { base: "concentrated", variations: ["concentrate", "concentrating", "concentration"] },
      { base: "attentive", variations: ["attention"] }
    ],
    moderate: [
      { base: "engaged", variations: ["engage", "engaging"] },
      { base: "absorbed", variations: ["absorb", "absorbing"] }
    ],
    weak: [
      { base: "aware", variations: ["awareness"] }
    ]
  },
  mood: {
    positive: {
      strong: [
        { base: "happy", variations: ["happiness", "happier", "happiest"] },
        { base: "joyful", variations: ["joy", "joyfully"] },
        { base: "excited", variations: ["excitement", "exciting"] },
        { base: "grateful", variations: ["gratitude", "thankful"] }
      ],
      moderate: [
        { base: "content", variations: ["contentment"] },
        { base: "pleased", variations: ["pleasure", "pleasant"] },
        { base: "satisfied", variations: ["satisfaction", "satisfy"] }
      ],
      weak: [
        { base: "okay", variations: ["ok"] },
        { base: "fine", variations: [] },
        { base: "alright", variations: ["all right"] }
      ]
    },
    negative: {
      strong: [
        { base: "sad", variations: ["sadness", "sadly"] },
        { base: "depressed", variations: ["depression", "depressing"] },
        { base: "angry", variations: ["anger", "angrily"] },
        { base: "frustrated", variations: ["frustration", "frustrating"] }
      ],
      moderate: [
        { base: "disappointed", variations: ["disappointment", "disappointing"] },
        { base: "upset", variations: ["upsetting"] },
        { base: "unhappy", variations: ["unhappiness"] }
      ],
      weak: [
        { base: "down", variations: [] },
        { base: "off", variations: [] },
        { base: "meh", variations: [] }
      ]
    },
    calm: {
      strong: [
        { base: "calm", variations: ["calmly", "calmness"] },
        { base: "relaxed", variations: ["relax", "relaxing", "relaxation"] },
        { base: "peaceful", variations: ["peace", "peacefully"] }
      ],
      moderate: [
        { base: "comfortable", variations: ["comfort", "comfortably"] },
        { base: "easy", variations: ["easier", "easiest", "easily"] }
      ],
      weak: [
        { base: "chill", variations: ["chilled", "chilling"] }
      ]
    }
  }
}
```

---

## Negation Words List

```javascript
[
  "not", "no", "never",
  "don't", "dont", "do not",
  "can't", "cant", "cannot",
  "won't", "wont", "will not",
  "isn't", "isnt", "is not",
  "aren't", "arent", "are not",
  "wasn't", "wasnt", "was not",
  "weren't", "werent", "were not",
  "haven't", "havent", "have not",
  "hasn't", "hasnt", "has not",
  "hadn't", "hadnt", "had not",
  "doesn't", "doesnt", "does not",
  "didn't", "didnt", "did not",
  "wouldn't", "wouldnt", "would not",
  "shouldn't", "shouldnt", "should not",
  "couldn't", "couldnt", "could not"
]
```

---

## Intensity Modifiers List

**Amplifiers (+30%)**:
```javascript
["very", "extremely", "really", "so", "incredibly", "absolutely", "totally", "completely"]
```

**Moderate Amplifiers (+15%)**:
```javascript
["quite", "pretty", "fairly", "rather", "somewhat"]
```

**Diminishers (-15%)**:
```javascript
["slightly", "a bit", "kind of", "sort of", "a little"]
```

**Strong Diminishers (-30%)**:
```javascript
["barely", "hardly", "scarcely", "rarely"]
```

---

**Status**: ✅ Domain Entities Complete
