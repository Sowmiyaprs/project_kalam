# Domain Entities - Data Management

**Unit**: Data Management  
**Phase**: CONSTRUCTION - Functional Design  
**Date**: 2026-05-06

---

## Entity: JournalEntry

**Purpose**: Represents a user's journal entry with metadata

**Structure**:
```javascript
{
  id: string,              // Unique identifier: "entry_<timestamp>_<random>"
  text: string,            // Journal entry text (10-10000 characters)
  timestamp: string,       // ISO 8601 timestamp: "2026-05-06T10:00:00.000Z"
  wordCount: number,       // Number of words in text
  characterCount: number,  // Number of characters in text
  analysisId: string       // Reference to linked AnalysisResult
}
```

**Validation Rules**:
- `id`: Required, unique, format "entry_<timestamp>_<random>"
- `text`: Required, 10-10000 characters, sanitized
- `timestamp`: Required, valid ISO 8601 format
- `wordCount`: Required, positive integer
- `characterCount`: Required, positive integer
- `analysisId`: Optional initially, required after analysis

**Example**:
```javascript
{
  id: "entry_1714992000000_abc123",
  text: "Today was a productive day. I completed all my tasks and feel motivated.",
  timestamp: "2026-05-06T10:00:00.000Z",
  wordCount: 13,
  characterCount: 75,
  analysisId: "analysis_1714992005000_xyz789"
}
```

---

## Entity: AnalysisResult (Imported from Unit 1)

**Purpose**: Complete sentiment analysis result linked to journal entry

**Structure**:
```javascript
{
  id: string,                    // Unique identifier
  entryId: string,               // Reference to JournalEntry
  timestamp: string,             // ISO 8601 timestamp
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
    simplifiedMode: boolean
  }
}
```

**Validation Rules**:
- `id`: Required, unique
- `entryId`: Required, must reference valid JournalEntry
- `timestamp`: Required, valid ISO 8601
- `emotional.mood`: Required, valid mood category
- `emotional.stressLevel`: Required, 0-100
- `emotional.motivation`: Required, 0-100
- `emotional.confidence`: Required, 0-100
- `productivity.score`: Required, "Low" | "Medium" | "High"
- `productivity.focusLevel`: Required, "Poor" | "Improving" | "Good" | "Excellent"
- `suggestions`: Required, array of 3-5 strings
- `confidence`: Required, "high" | "medium" | "low"

---

## Entity: HistoryDataPoint

**Purpose**: Aggregated data point for a single date (for visualization)

**Structure**:
```javascript
{
  date: string,            // Date in YYYY-MM-DD format
  stress: number,          // Average stress (0-100)
  motivation: number,      // Average motivation (0-100)
  confidence: number,      // Average confidence (0-100)
  productivity: number,    // Average productivity score (0-100)
  focus: number,           // Average focus score (0-100)
  mood: string,            // Most common mood for the day
  entryCount: number       // Number of entries for this date
}
```

**Calculation**:
- If multiple entries exist for one date, all scores are averaged
- Mood is determined by most frequent mood across entries
- entryCount tracks how many entries contributed to this data point

**Example**:
```javascript
{
  date: "2026-05-06",
  stress: 45,
  motivation: 72,
  confidence: 68,
  productivity: 65,
  focus: 70,
  mood: "Motivated",
  entryCount: 3
}
```

---

## Entity: HistoryStatistics

**Purpose**: Calculated statistics from historical data

**Structure**:
```javascript
{
  avgStress: number,           // Average stress (30-day)
  avgMotivation: number,       // Average motivation (30-day)
  avgConfidence: number,       // Average confidence (30-day)
  avgProductivity: number,     // Average productivity (30-day)
  avgFocus: number,            // Average focus (30-day)
  mostCommonMood: string,      // Most frequent mood
  moodTrend: string,           // "Improving", "Declining", "Stable"
  productivityTrend: string,   // "Improving", "Declining", "Stable"
  totalEntries: number,        // Total number of entries
  longestStreak: number        // Consecutive days with entries
}
```

**Example**:
```javascript
{
  avgStress: 42,
  avgMotivation: 68,
  avgConfidence: 65,
  avgProductivity: 62,
  avgFocus: 67,
  mostCommonMood: "Motivated",
  moodTrend: "Improving",
  productivityTrend: "Stable",
  totalEntries: 45,
  longestStreak: 12
}
```

---

## Entity: StorageQuotaInfo

**Purpose**: Information about localStorage quota usage

**Structure**:
```javascript
{
  used: number,            // Bytes used
  available: number,       // Total bytes available
  percentage: number,      // Percentage used (0-100)
  needsCleanup: boolean    // True if > 80% used
}
```

**Example**:
```javascript
{
  used: 8388608,           // 8 MB
  available: 10485760,     // 10 MB
  percentage: 80,
  needsCleanup: true
}
```

---

## Entity: CleanupResult

**Purpose**: Result of cleanup operation

**Structure**:
```javascript
{
  deletedEntries: number,      // Number of entries deleted
  deletedAnalyses: number,     // Number of analyses deleted
  freedSpace: number,          // Bytes freed
  oldestRemainingDate: string  // Date of oldest remaining entry
}
```

**Example**:
```javascript
{
  deletedEntries: 15,
  deletedAnalyses: 15,
  freedSpace: 524288,          // 512 KB
  oldestRemainingDate: "2026-04-06"
}
```

---

## Entity: StorageData (Root Storage Object)

**Purpose**: Root object stored in localStorage under key 'mindmirror_data'

**Structure**:
```javascript
{
  entries: JournalEntry[],     // Array of all journal entries
  analyses: AnalysisResult[],  // Array of all analysis results
  metadata: {
    version: string,           // Data schema version: "1.0"
    lastCleanup: string,       // ISO 8601 timestamp of last cleanup
    totalEntries: number,      // Total number of entries
    oldestEntry: string,       // ISO 8601 timestamp of oldest entry
    newestEntry: string        // ISO 8601 timestamp of newest entry
  }
}
```

**Example**:
```javascript
{
  entries: [
    { id: "entry_1", text: "...", timestamp: "2026-05-06T10:00:00.000Z", ... },
    { id: "entry_2", text: "...", timestamp: "2026-05-06T15:00:00.000Z", ... }
  ],
  analyses: [
    { id: "analysis_1", entryId: "entry_1", emotional: {...}, ... },
    { id: "analysis_2", entryId: "entry_2", emotional: {...}, ... }
  ],
  metadata: {
    version: "1.0",
    lastCleanup: "2026-05-06T00:00:00.000Z",
    totalEntries: 2,
    oldestEntry: "2026-05-06T10:00:00.000Z",
    newestEntry: "2026-05-06T15:00:00.000Z"
  }
}
```

---

## Entity: ExportData

**Purpose**: Data structure for JSON export

**Structure**:
```javascript
{
  exportDate: string,          // ISO 8601 timestamp of export
  dateRange: {
    start: string,             // Start date (YYYY-MM-DD) or null
    end: string                // End date (YYYY-MM-DD) or null
  },
  entries: JournalEntry[],     // Filtered entries
  analyses: AnalysisResult[],  // Filtered analyses
  statistics: HistoryStatistics, // Calculated statistics
  rawData: {
    entries: JournalEntry[],   // Complete raw entries
    analyses: AnalysisResult[] // Complete raw analyses
  }
}
```

**Example**:
```javascript
{
  exportDate: "2026-05-06T20:00:00.000Z",
  dateRange: {
    start: "2026-04-01",
    end: "2026-05-06"
  },
  entries: [...],
  analyses: [...],
  statistics: {
    avgStress: 42,
    avgMotivation: 68,
    ...
  },
  rawData: {
    entries: [...],
    analyses: [...]
  }
}
```

---

## Entity Relationships

### One-to-One: JournalEntry ↔ AnalysisResult

```
JournalEntry.analysisId → AnalysisResult.id
AnalysisResult.entryId → JournalEntry.id
```

**Relationship Type**: Bidirectional one-to-one

**Constraints**:
- Each JournalEntry has exactly one AnalysisResult
- Each AnalysisResult belongs to exactly one JournalEntry
- analysisId is set after analysis completes
- Deleting JournalEntry also deletes linked AnalysisResult

### One-to-Many: Date → HistoryDataPoint

```
Multiple JournalEntries with same date → Single HistoryDataPoint
```

**Relationship Type**: Aggregation

**Constraints**:
- Multiple entries on same date are aggregated into one data point
- Scores are averaged
- Mood is most common

---

## Entity Lifecycle

### JournalEntry Lifecycle

```
1. Created → User writes journal entry
2. Validated → Text, timestamp validated
3. Saved → Stored in localStorage
4. Analyzed → Sentiment analysis performed (Unit 1)
5. Linked → analysisId set to link to AnalysisResult
6. Retrieved → Loaded for history view
7. Exported → Included in JSON export
8. Deleted → Removed after 30 days or manually
```

### AnalysisResult Lifecycle

```
1. Created → Generated by Unit 1 after analyzing entry
2. Validated → Scores, mood, suggestions validated
3. Saved → Stored in localStorage
4. Linked → entryId set to link to JournalEntry
5. Retrieved → Loaded for history view
6. Aggregated → Combined with other analyses for charts
7. Exported → Included in JSON export
8. Deleted → Removed when linked entry is deleted
```

---

## Data Integrity Rules

1. **Referential Integrity**: Every AnalysisResult.entryId must reference a valid JournalEntry.id
2. **Bidirectional Linking**: JournalEntry.analysisId and AnalysisResult.entryId must match
3. **Timestamp Consistency**: AnalysisResult.timestamp must be >= JournalEntry.timestamp
4. **No Orphans**: Deleting JournalEntry must also delete linked AnalysisResult
5. **Unique IDs**: All IDs must be unique within their entity type
6. **Valid Dates**: All timestamps must be valid ISO 8601 format
7. **Score Ranges**: All scores must be within valid ranges (0-100)

---

**Status**: ✅ Domain Entities Complete

