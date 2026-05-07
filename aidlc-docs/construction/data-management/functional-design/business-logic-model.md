# Business Logic Model - Data Management

**Unit**: Data Management  
**Phase**: CONSTRUCTION - Functional Design  
**Date**: 2026-05-06

---

## Overview

The Data Management unit handles all data persistence, retrieval, and export operations using browser localStorage. The system uses a single-key storage structure with automatic cleanup, proactive quota management, and cross-tab synchronization.

**Core Services**:
1. **StorageService**: CRUD operations for localStorage
2. **DataTransformationService**: Format data for charts and statistics
3. **ExportService**: Generate JSON exports with date range filtering

---

## Service 1: StorageService

### Purpose
Manage all localStorage operations for journal entries and analysis results.

### Storage Structure

**Single Key Strategy**:
```javascript
localStorage.setItem('mindmirror_data', JSON.stringify({
  entries: [
    {
      id: "entry_1234567890",
      text: "Journal entry text",
      timestamp: "2026-05-06T10:00:00.000Z",
      wordCount: 25,
      characterCount: 150,
      analysisId: "analysis_1234567890"
    }
  ],
  analyses: [
    {
      id: "analysis_1234567890",
      entryId: "entry_1234567890",
      timestamp: "2026-05-06T10:00:05.000Z",
      emotional: { mood: "Happy", stressLevel: 30, motivation: 75, confidence: 80 },
      productivity: { score: "High", focusLevel: "Excellent" },
      suggestions: ["...", "...", "..."],
      analysisDuration: 45,
      confidence: "high",
      metadata: { wordCount: 25, keywordMatches: 5, simplifiedMode: false }
    }
  ],
  metadata: {
    version: "1.0",
    lastCleanup: "2026-05-06T00:00:00.000Z",
    totalEntries: 1,
    oldestEntry: "2026-05-06T10:00:00.000Z",
    newestEntry: "2026-05-06T10:00:00.000Z"
  }
}));
```

**Benefits**:
- Single read/write operation for all data
- Easy to backup/restore entire dataset
- Simpler quota management
- Atomic updates (all or nothing)

---

### Core Operations

#### 1. Save Entry

**Algorithm**:
```
INPUT: JournalEntry (text, timestamp)
OUTPUT: SavedEntry with id

1. Validate entry:
   - Text is not empty
   - Text length within limits (10-10000 characters)
   - Timestamp is valid ISO 8601
   - Sanitize text (remove harmful content)

2. Check storage quota:
   - If quota > 80%, trigger cleanup
   - If cleanup fails and quota still > 95%, auto-delete oldest entries

3. Generate unique ID:
   id = "entry_" + timestamp + "_" + random()

4. Calculate metadata:
   - wordCount = text.split(/\s+/).length
   - characterCount = text.length

5. Load existing data from localStorage

6. Add new entry to entries array

7. Update metadata:
   - totalEntries++
   - Update oldestEntry/newestEntry

8. Save to localStorage

9. Trigger storage event for cross-tab sync

10. Return saved entry with id
```

**Error Handling**:
- localStorage not available → Use in-memory fallback, warn user
- Quota exceeded → Auto-delete oldest entries, retry
- Save fails → Retry up to 3 times, then show error

---

#### 2. Save Analysis

**Algorithm**:
```
INPUT: AnalysisResult (complete result from Unit 1)
OUTPUT: Success/failure

1. Validate analysis:
   - All required fields present
   - Scores within valid range (0-100)
   - Mood is valid category
   - Suggestions array has 3-5 items
   - Linked to valid journal entry (entryId exists)

2. Load existing data from localStorage

3. Find corresponding entry and link:
   - Set entry.analysisId = analysis.id
   - Set analysis.entryId = entry.id

4. Add analysis to analyses array

5. Save to localStorage

6. Trigger storage event for cross-tab sync

7. Return success
```

---

#### 3. Get History Data

**Algorithm**:
```
INPUT: days (number of days to retrieve, default 30)
OUTPUT: HistoryDataPoint[]

1. Load data from localStorage

2. Calculate cutoff date:
   cutoffDate = now - (days * 24 * 60 * 60 * 1000)

3. Filter entries:
   recentEntries = entries.filter(e => e.timestamp >= cutoffDate)

4. For each entry, find linked analysis

5. Group by date (YYYY-MM-DD)

6. For each date with multiple entries:
   - Average all metric scores
   - Use most common mood
   - Combine all suggestions (deduplicate)

7. Sort by date (oldest first)

8. Cache result in memory

9. Return HistoryDataPoint[]
```

**Caching Strategy**:
- Cache retrieved data in memory (WeakMap)
- Invalidate cache on new save
- Cache expires after 5 minutes

---

#### 4. Get Latest Analysis

**Algorithm**:
```
INPUT: None
OUTPUT: AnalysisResult | null

1. Load data from localStorage

2. Sort analyses by timestamp (descending)

3. Return first analysis (most recent)

4. If no analyses, return null
```

---

#### 5. Cleanup Old Data

**Algorithm**:
```
INPUT: None (uses 30-day retention policy)
OUTPUT: CleanupResult { deletedEntries, deletedAnalyses, freedSpace }

1. Calculate cutoff date:
   cutoffDate = now - (30 * 24 * 60 * 60 * 1000)

2. Load data from localStorage

3. Filter entries to keep:
   entriesToKeep = entries.filter(e => e.timestamp >= cutoffDate)
   entriesToDelete = entries.filter(e => e.timestamp < cutoffDate)

4. Get IDs of deleted entries

5. Filter analyses to keep:
   analysesToKeep = analyses.filter(a => !deletedEntryIds.includes(a.entryId))

6. Calculate freed space:
   freedSpace = (oldDataSize - newDataSize) bytes

7. Update metadata:
   - lastCleanup = now
   - totalEntries = entriesToKeep.length
   - Update oldestEntry/newestEntry

8. Save cleaned data to localStorage

9. Trigger storage event for cross-tab sync

10. Return cleanup result
```

**Trigger Conditions**:
- On app startup (if lastCleanup > 24 hours ago)
- When storage quota > 80%
- Manual trigger by user (future feature)

---

#### 6. Check Storage Quota

**Algorithm**:
```
INPUT: None
OUTPUT: StorageQuotaInfo { used, available, percentage, needsCleanup }

1. Check if StorageManager API available:
   if (navigator.storage && navigator.storage.estimate) {
     quota = await navigator.storage.estimate()
     used = quota.usage
     available = quota.quota
   } else {
     // Fallback: estimate from data size
     dataSize = JSON.stringify(data).length
     used = dataSize
     available = 10 * 1024 * 1024 // Assume 10MB limit
   }

2. Calculate percentage:
   percentage = (used / available) * 100

3. Determine if cleanup needed:
   needsCleanup = percentage > 80

4. Return quota info
```

---

#### 7. Delete Entry

**Algorithm**:
```
INPUT: entryId
OUTPUT: Success/failure

1. Load data from localStorage

2. Find entry by ID

3. Find linked analysis

4. Remove entry from entries array

5. Remove linked analysis from analyses array

6. Update metadata:
   - totalEntries--
   - Update oldestEntry/newestEntry

7. Save to localStorage

8. Trigger storage event for cross-tab sync

9. Return success
```

---

### Cross-Tab Synchronization

**Algorithm**:
```
1. Listen for storage events:
   window.addEventListener('storage', handleStorageChange)

2. When storage event detected:
   a. Check if key is 'mindmirror_data'
   b. If yes, reload data from localStorage
   c. Update in-memory cache
   d. Notify UI components to refresh

3. When saving data:
   a. Save to localStorage
   b. Storage event automatically fires
   c. Other tabs receive event and reload
```

**Benefits**:
- Real-time sync across tabs
- No data loss from concurrent edits
- Last write wins (simple conflict resolution)

---

## Service 2: DataTransformationService

### Purpose
Transform raw storage data into formats suitable for visualization and statistics.

### Core Operations

#### 1. Transform for Chart

**Algorithm**:
```
INPUT: AnalysisResult[]
OUTPUT: ChartDataPoint[]

1. Group analyses by date (YYYY-MM-DD)

2. For each date:
   a. Get all analyses for that date
   b. Calculate average scores:
      - stress = average(analyses.map(a => a.emotional.stressLevel))
      - motivation = average(analyses.map(a => a.emotional.motivation))
      - confidence = average(analyses.map(a => a.emotional.confidence))
      - productivity = average(analyses.map(a => productivityToScore(a.productivity.score)))
      - focus = average(analyses.map(a => focusToScore(a.productivity.focusLevel)))
   c. Determine most common mood
   d. Create ChartDataPoint

3. Sort by date (oldest first)

4. Return ChartDataPoint[]
```

**Helper Functions**:
```javascript
productivityToScore(level) {
  if (level === "High") return 75;
  if (level === "Medium") return 50;
  if (level === "Low") return 25;
}

focusToScore(level) {
  if (level === "Excellent") return 85;
  if (level === "Good") return 65;
  if (level === "Improving") return 45;
  if (level === "Poor") return 25;
}
```

---

#### 2. Aggregate by Date

**Algorithm**:
```
INPUT: AnalysisResult[]
OUTPUT: HistoryDataPoint[]

1. Group analyses by date (YYYY-MM-DD)

2. For each date:
   a. Get all analyses for that date
   b. Calculate aggregated metrics (same as Transform for Chart)
   c. Count entries for that date
   d. Create HistoryDataPoint with:
      - date
      - aggregated scores
      - mood
      - entryCount

3. Sort by date (oldest first)

4. Return HistoryDataPoint[]
```

---

#### 3. Calculate Statistics

**Algorithm**:
```
INPUT: HistoryDataPoint[]
OUTPUT: HistoryStatistics

1. Calculate averages (30-day):
   - avgStress = average(data.map(d => d.stress))
   - avgMotivation = average(data.map(d => d.motivation))
   - avgConfidence = average(data.map(d => d.confidence))
   - avgProductivity = average(data.map(d => d.productivity))
   - avgFocus = average(data.map(d => d.focus))

2. Find most common mood:
   - Count occurrences of each mood
   - Return mood with highest count

3. Calculate mood trends:
   - Split data into first half and second half
   - Compare average stress (first half vs second half)
   - If second half stress < first half: "Improving"
   - If second half stress > first half: "Declining"
   - Otherwise: "Stable"

4. Calculate productivity trends (same logic as mood trends)

5. Count total entries:
   - totalEntries = sum(data.map(d => d.entryCount))

6. Calculate longest streak:
   - Iterate through dates
   - Count consecutive days with entries
   - Track maximum streak

7. Return HistoryStatistics
```

---

## Service 3: ExportService

### Purpose
Generate JSON exports of user data with date range filtering.

### Core Operations

#### 1. Export History

**Algorithm**:
```
INPUT: startDate, endDate (optional, defaults to all data)
OUTPUT: JSON file download

1. Load data from localStorage

2. Filter by date range:
   if (startDate && endDate) {
     filteredEntries = entries.filter(e => e.timestamp >= startDate && e.timestamp <= endDate)
     filteredAnalyses = analyses.filter(a => a.timestamp >= startDate && a.timestamp <= endDate)
   } else {
     filteredEntries = entries
     filteredAnalyses = analyses
   }

3. Calculate statistics for filtered data

4. Create export object:
   {
     exportDate: now,
     dateRange: { start: startDate, end: endDate },
     entries: filteredEntries,
     analyses: filteredAnalyses,
     statistics: {
       totalEntries: filteredEntries.length,
       avgStress: ...,
       avgMotivation: ...,
       mostCommonMood: ...,
       // ... other statistics
     },
     rawData: {
       entries: filteredEntries,
       analyses: filteredAnalyses
     }
   }

5. Convert to JSON string

6. Generate filename:
   filename = "mindmirror_export_" + startDate + "_to_" + endDate + ".json"

7. Trigger browser download

8. Return success
```

---

#### 2. Generate JSON File

**Algorithm**:
```
INPUT: data (object), filename (string)
OUTPUT: Browser download triggered

1. Convert data to JSON string:
   jsonString = JSON.stringify(data, null, 2) // Pretty print

2. Create Blob:
   blob = new Blob([jsonString], { type: 'application/json' })

3. Create download URL:
   url = URL.createObjectURL(blob)

4. Create temporary anchor element:
   a = document.createElement('a')
   a.href = url
   a.download = filename

5. Trigger click:
   a.click()

6. Cleanup:
   URL.revokeObjectURL(url)

7. Return success
```

---

## Error Handling Strategy

### localStorage Not Available

**Scenario**: Browser doesn't support localStorage or it's disabled

**Handling**:
1. Detect on app startup
2. Use in-memory storage as fallback
3. Show warning to user: "Data will not persist between sessions"
4. Continue with degraded functionality

---

### Storage Quota Exceeded

**Scenario**: localStorage quota limit reached

**Handling**:
1. Trigger automatic cleanup (delete entries older than 30 days)
2. If still exceeds quota, auto-delete oldest entries until under 80%
3. Show notification: "Storage limit reached. Oldest entries were removed."
4. Retry save operation

---

### Data Corruption

**Scenario**: Invalid JSON in localStorage

**Handling**:
1. Catch JSON.parse error
2. Log error (no user data in log)
3. Attempt to recover partial data
4. If recovery fails, reset to empty state
5. Show error: "Data corruption detected. Storage has been reset."

---

### Save Operation Fails

**Scenario**: localStorage.setItem throws error

**Handling**:
1. Retry up to 3 times with exponential backoff
2. If all retries fail, use in-memory storage
3. Show error: "Failed to save data. Changes may not persist."
4. Log error for debugging

---

## Performance Optimizations

1. **In-Memory Caching**: Cache retrieved data to avoid repeated localStorage reads
2. **Lazy Loading**: Load data on-demand when user navigates to history page
3. **Debounced Saves**: Batch multiple saves within short time window
4. **Efficient Filtering**: Use array methods optimized for performance
5. **Minimal Serialization**: Only serialize when saving, keep objects in memory

---

**Status**: ✅ Business Logic Model Complete

