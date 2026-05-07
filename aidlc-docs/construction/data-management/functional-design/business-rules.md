# Business Rules - Data Management

**Unit**: Data Management  
**Phase**: CONSTRUCTION - Functional Design  
**Date**: 2026-05-06

---

## Rule Category 1: Data Validation Rules

### BR-DM-001: Journal Entry Text Validation
**Rule**: Journal entry text must not be empty and must be within character limits

**Conditions**:
- Text is not empty (after trimming whitespace)
- Text length >= 10 characters
- Text length <= 10,000 characters

**Action if violated**: Reject save operation, show error: "Entry must be between 10 and 10,000 characters"

**Priority**: Critical

---

### BR-DM-002: Timestamp Validation
**Rule**: All timestamps must be valid ISO 8601 format

**Conditions**:
- Timestamp matches ISO 8601 format: YYYY-MM-DDTHH:MM:SS.sssZ
- Timestamp is not in the future (> current time)
- Timestamp is not before 2020-01-01 (reasonable minimum)

**Action if violated**: Reject save operation, show error: "Invalid timestamp"

**Priority**: Critical

---

### BR-DM-003: Text Sanitization
**Rule**: Journal entry text must be sanitized before saving

**Conditions**:
- Remove script tags: `<script>...</script>`
- Remove HTML tags: `<...>`
- Remove potentially harmful characters
- Preserve letters, numbers, spaces, basic punctuation

**Action**: Automatically sanitize text before validation

**Priority**: Critical (Security)

---

### BR-DM-004: Analysis Result Validation
**Rule**: Analysis results must have all required fields with valid values

**Conditions**:
- All required fields present (id, entryId, timestamp, emotional, productivity, suggestions, confidence)
- Scores within range: 0-100
- Mood is valid category: "Happy", "Sad", "Stressed", "Anxious", "Overwhelmed", "Calm", "Motivated", "Frustrated", "Uncertain", "Neutral"
- Productivity score is valid: "Low", "Medium", "High"
- Focus level is valid: "Poor", "Improving", "Good", "Excellent"
- Suggestions array has 3-5 items
- Confidence is valid: "high", "medium", "low"

**Action if violated**: Reject save operation, log error

**Priority**: Critical

---

### BR-DM-005: Entry-Analysis Linking
**Rule**: Analysis results must be linked to valid journal entries

**Conditions**:
- AnalysisResult.entryId must reference existing JournalEntry.id
- JournalEntry.analysisId must match AnalysisResult.id
- Bidirectional linking must be consistent

**Action if violated**: Reject save operation, show error: "Invalid entry reference"

**Priority**: Critical

---

## Rule Category 2: Data Retention Rules

### BR-DM-006: 30-Day Retention Policy
**Rule**: Journal entries and analyses older than 30 days must be deleted

**Conditions**:
- Entry timestamp < (current date - 30 days)

**Action**: 
- Hard delete entry and linked analysis
- Update metadata (totalEntries, oldestEntry)
- Free storage space

**Trigger**:
- On app startup (if lastCleanup > 24 hours ago)
- When storage quota > 80%
- Manual trigger by user (future feature)

**Priority**: High

---

### BR-DM-007: Cleanup Execution
**Rule**: Cleanup must be atomic (all or nothing)

**Conditions**:
- All entries older than 30 days identified
- All linked analyses identified
- Metadata updated
- Data saved to localStorage

**Action if fails**: Rollback to previous state, log error

**Priority**: High

---

## Rule Category 3: Storage Quota Rules

### BR-DM-008: Quota Threshold Warning
**Rule**: Warn user when storage quota exceeds 80%

**Conditions**:
- Storage usage > 80% of available quota

**Action**:
- Show warning notification: "Storage is 80% full. Older entries may be automatically removed."
- Trigger automatic cleanup

**Priority**: Medium

---

### BR-DM-009: Automatic Cleanup on Quota Exceeded
**Rule**: Automatically delete oldest entries when storage quota is exceeded

**Conditions**:
- Storage quota > 95%
- Save operation fails due to quota

**Action**:
1. Delete oldest entries (oldest first) until quota < 80%
2. Retry save operation
3. Show notification: "Storage limit reached. Oldest entries were removed."

**Priority**: High

---

### BR-DM-010: Quota Check Before Save
**Rule**: Check storage quota before saving large data

**Conditions**:
- Before saving new entry or analysis
- If quota > 80%, trigger cleanup

**Action**:
- Check quota
- If > 80%, run cleanup
- Proceed with save

**Priority**: Medium

---

## Rule Category 4: Data Aggregation Rules

### BR-DM-011: Daily Aggregation for Charts
**Rule**: Multiple entries on same date must be aggregated for visualization

**Conditions**:
- Multiple entries exist for same date (YYYY-MM-DD)

**Action**:
- Average all metric scores (stress, motivation, confidence, productivity, focus)
- Use most common mood
- Count total entries for that date
- Create single HistoryDataPoint

**Priority**: High

---

### BR-DM-012: Score Averaging
**Rule**: When aggregating scores, use arithmetic mean

**Conditions**:
- Multiple scores for same metric on same date

**Action**:
- Calculate: sum(scores) / count(scores)
- Round to nearest integer

**Priority**: Medium

---

### BR-DM-013: Mood Determination
**Rule**: When aggregating moods, use most frequent mood

**Conditions**:
- Multiple moods for same date

**Action**:
- Count occurrences of each mood
- Return mood with highest count
- If tie, use latest entry's mood

**Priority**: Medium

---

## Rule Category 5: Export Rules

### BR-DM-014: Export Date Range Filtering
**Rule**: Export must support date range filtering

**Conditions**:
- User provides startDate and endDate (optional)

**Action**:
- If dates provided, filter entries and analyses by timestamp
- If no dates, export all data
- Include date range in export metadata

**Priority**: High

---

### BR-DM-015: Export Content Completeness
**Rule**: Export must include all requested content

**Conditions**:
- Export includes: entries, analyses, statistics, raw data

**Action**:
- Include filtered journal entries
- Include filtered analysis results
- Calculate statistics for filtered data
- Include complete raw data dump

**Priority**: High

---

### BR-DM-016: Export File Naming
**Rule**: Export filename must include date range

**Conditions**:
- Export triggered by user

**Action**:
- Generate filename: "mindmirror_export_<startDate>_to_<endDate>.json"
- If no date range: "mindmirror_export_all_<timestamp>.json"

**Priority**: Low

---

## Rule Category 6: Error Handling Rules

### BR-DM-017: localStorage Unavailable Fallback
**Rule**: If localStorage is unavailable, use in-memory storage

**Conditions**:
- localStorage not supported by browser
- localStorage disabled by user
- localStorage throws error

**Action**:
1. Detect localStorage unavailability
2. Switch to in-memory storage (Map/Object)
3. Show warning: "Data will not persist between sessions"
4. Continue with degraded functionality

**Priority**: Critical

---

### BR-DM-018: Data Corruption Recovery
**Rule**: If data is corrupted, attempt recovery or reset

**Conditions**:
- JSON.parse throws error
- Data structure is invalid

**Action**:
1. Log error (no user data)
2. Attempt to recover partial data
3. If recovery fails, reset to empty state
4. Show error: "Data corruption detected. Storage has been reset."

**Priority**: High

---

### BR-DM-019: Save Retry Logic
**Rule**: Retry failed save operations up to 3 times

**Conditions**:
- localStorage.setItem throws error

**Action**:
1. Retry with exponential backoff (100ms, 200ms, 400ms)
2. If all retries fail, use in-memory storage
3. Show error: "Failed to save data. Changes may not persist."

**Priority**: High

---

## Rule Category 7: Performance Rules

### BR-DM-020: In-Memory Caching
**Rule**: Cache retrieved data in memory to avoid repeated localStorage reads

**Conditions**:
- Data retrieved from localStorage

**Action**:
- Store in WeakMap cache
- Invalidate cache on new save
- Cache expires after 5 minutes

**Priority**: Medium

---

### BR-DM-021: Lazy Loading
**Rule**: Load historical data on-demand, not on app startup

**Conditions**:
- User navigates to history page

**Action**:
- Load data from localStorage only when needed
- Cache in memory after first load

**Priority**: Medium

---

### BR-DM-022: Debounced Saves
**Rule**: Batch multiple saves within short time window

**Conditions**:
- Multiple save operations triggered within 1 second

**Action**:
- Debounce saves with 500ms delay
- Batch updates into single localStorage write

**Priority**: Low

---

## Rule Category 8: Cross-Tab Synchronization Rules

### BR-DM-023: Storage Event Listening
**Rule**: Listen for storage events to sync data across tabs

**Conditions**:
- Multiple tabs open with MindMirror AI

**Action**:
1. Listen for 'storage' events
2. When event detected for 'mindmirror_data' key:
   - Reload data from localStorage
   - Update in-memory cache
   - Notify UI components to refresh

**Priority**: Medium

---

### BR-DM-024: Last Write Wins
**Rule**: In case of concurrent writes, last write wins

**Conditions**:
- Multiple tabs save data simultaneously

**Action**:
- No conflict resolution
- Last write overwrites previous writes
- Storage event notifies other tabs to reload

**Priority**: Low

---

## Rule Category 9: Data Integrity Rules

### BR-DM-025: Referential Integrity
**Rule**: All AnalysisResult.entryId must reference valid JournalEntry.id

**Conditions**:
- Analysis result is saved

**Action**:
- Validate entryId exists in entries array
- If not found, reject save

**Priority**: Critical

---

### BR-DM-026: Cascade Delete
**Rule**: Deleting journal entry must also delete linked analysis

**Conditions**:
- Journal entry is deleted

**Action**:
1. Find linked analysis by analysisId
2. Delete analysis from analyses array
3. Update metadata

**Priority**: Critical

---

### BR-DM-027: No Orphan Analyses
**Rule**: Analysis results cannot exist without linked journal entry

**Conditions**:
- Cleanup or delete operation

**Action**:
- When deleting entries, also delete linked analyses
- Prevent saving analysis without valid entryId

**Priority**: High

---

## Rule Category 10: Statistics Calculation Rules

### BR-DM-028: 30-Day Statistics Window
**Rule**: Statistics are calculated for last 30 days only

**Conditions**:
- Statistics calculation triggered

**Action**:
- Filter data to last 30 days
- Calculate averages, trends, counts
- Ignore data older than 30 days

**Priority**: Medium

---

### BR-DM-029: Trend Calculation
**Rule**: Trends are determined by comparing first half vs second half of data

**Conditions**:
- Sufficient data points (>= 10)

**Action**:
1. Split data into first half and second half
2. Calculate average for each half
3. Compare: if second half < first half → "Improving"
4. If second half > first half → "Declining"
5. Otherwise → "Stable"

**Priority**: Medium

---

### BR-DM-030: Longest Streak Calculation
**Rule**: Longest streak counts consecutive days with at least one entry

**Conditions**:
- Statistics calculation triggered

**Action**:
1. Sort entries by date
2. Iterate through dates
3. Count consecutive days with entries
4. Track maximum streak
5. Reset counter on gap

**Priority**: Low

---

## Rule Summary

**Total Rules**: 30

**By Priority**:
- Critical: 8 rules
- High: 9 rules
- Medium: 11 rules
- Low: 2 rules

**By Category**:
- Data Validation: 5 rules
- Data Retention: 2 rules
- Storage Quota: 3 rules
- Data Aggregation: 3 rules
- Export: 3 rules
- Error Handling: 3 rules
- Performance: 3 rules
- Cross-Tab Sync: 2 rules
- Data Integrity: 3 rules
- Statistics: 3 rules

---

**Status**: ✅ Business Rules Complete

