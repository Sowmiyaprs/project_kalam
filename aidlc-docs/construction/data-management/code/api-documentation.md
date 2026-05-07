# API Documentation - Data Management

**Unit**: Data Management  
**Phase**: CONSTRUCTION - Code Generation  
**Date**: 2026-05-06

---

## Table of Contents

1. [StorageService API](#storageservice-api)
2. [DataTransformationService API](#datatransformationservice-api)
3. [ExportService API](#exportservice-api)
4. [React Hooks API](#react-hooks-api)
5. [Utility Functions API](#utility-functions-api)
6. [Type Definitions](#type-definitions)

---

## StorageService API

### Import

```javascript
import { storageService } from './services/storage/StorageService.js';
```

### Methods

#### `saveEntry(entry)`

Save a journal entry to localStorage.

**Parameters:**
- `entry` (Object)
  - `text` (string) - Journal entry text (10-10,000 characters)
  - `timestamp` (string) - ISO 8601 timestamp

**Returns:** `Promise<SaveResult>`
- `success` (boolean) - Whether save was successful
- `entry` (JournalEntry) - Saved entry with generated ID (if successful)
- `error` (string) - Error message (if failed)

**Example:**
```javascript
const result = await storageService.saveEntry({
  text: 'Today was a productive day...',
  timestamp: new Date().toISOString()
});

if (result.success) {
  console.log('Entry saved:', result.entry.id);
}
```

---

#### `saveAnalysis(analysis)`

Save an analysis result linked to a journal entry.

**Parameters:**
- `analysis` (AnalysisResult) - Complete analysis result from Unit 1

**Returns:** `Promise<{success: boolean, error?: string}>`

**Example:**
```javascript
const result = await storageService.saveAnalysis({
  id: 'analysis_123',
  entryId: 'entry_456',
  timestamp: new Date().toISOString(),
  emotional: {
    mood: 'Happy',
    stressLevel: 30,
    motivation: 75,
    confidence: 80
  },
  productivity: {
    score: 'High',
    focusLevel: 'Excellent'
  },
  suggestions: ['...', '...', '...']
});
```

---

#### `getHistoryData(days)`

Retrieve history data for the last N days.

**Parameters:**
- `days` (number) - Number of days to retrieve (default: 30)

**Returns:** `Promise<Array<{entry, analysis}>>`

**Example:**
```javascript
const history = await storageService.getHistoryData(30);
console.log(`Retrieved ${history.length} entries`);
```

---

#### `getLatestAnalysis()`

Get the most recent analysis result.

**Returns:** `Promise<AnalysisResult|null>`

**Example:**
```javascript
const latest = await storageService.getLatestAnalysis();
if (latest) {
  console.log('Latest mood:', latest.emotional.mood);
}
```

---

#### `deleteEntry(entryId)`

Delete an entry and its linked analysis (cascade delete).

**Parameters:**
- `entryId` (string) - Entry ID to delete

**Returns:** `Promise<{success: boolean, error?: string}>`

**Example:**
```javascript
const result = await storageService.deleteEntry('entry_123');
```

---

#### `cleanupOldData()`

Delete entries older than 30 days.

**Returns:** `Promise<CleanupResult>`
- `deletedEntries` (number) - Number of entries deleted
- `deletedAnalyses` (number) - Number of analyses deleted
- `freedSpace` (number) - Bytes freed

**Example:**
```javascript
const result = await storageService.cleanupOldData();
console.log(`Deleted ${result.deletedEntries} old entries`);
```

---

#### `checkStorageQuota()`

Check current storage quota usage.

**Returns:** `Promise<StorageQuotaInfo>`
- `used` (number) - Bytes used
- `available` (number) - Bytes available
- `percentage` (number) - Usage percentage (0-100)
- `needsCleanup` (boolean) - Whether cleanup is needed

**Example:**
```javascript
const quota = await storageService.checkStorageQuota();
console.log(`Storage: ${quota.percentage}% used`);
```

---

#### `addListener(callback)`

Add a listener for storage changes (cross-tab sync).

**Parameters:**
- `callback` (Function) - Function to call when storage changes

**Example:**
```javascript
storageService.addListener(() => {
  console.log('Storage changed in another tab');
  reloadData();
});
```

---

## DataTransformationService API

### Import

```javascript
import { dataTransformationService } from './services/storage/DataTransformationService.js';
```

### Methods

#### `transformForChart(analyses)`

Transform analyses to chart data points.

**Parameters:**
- `analyses` (AnalysisResult[]) - Array of analysis results

**Returns:** `ChartDataPoint[]`

**Example:**
```javascript
const chartData = dataTransformationService.transformForChart(analyses);
// Use chartData with Recharts
```

---

#### `aggregateByDate(analyses)`

Aggregate analyses by date with averaging.

**Parameters:**
- `analyses` (AnalysisResult[]) - Array of analysis results

**Returns:** `HistoryDataPoint[]`

**Example:**
```javascript
const historyData = dataTransformationService.aggregateByDate(analyses);
```

---

#### `calculateStatistics(historyData)`

Calculate 30-day statistics from history data.

**Parameters:**
- `historyData` (HistoryDataPoint[]) - Array of history data points

**Returns:** `HistoryStatistics`

**Example:**
```javascript
const stats = dataTransformationService.calculateStatistics(historyData);
console.log('Average stress:', stats.avgStress);
console.log('Mood trend:', stats.moodTrend);
```

---

## ExportService API

### Import

```javascript
import { exportService } from './services/storage/ExportService.js';
```

### Methods

#### `exportHistory(startDate, endDate)`

Export history data to JSON file.

**Parameters:**
- `startDate` (string, optional) - Start date (ISO 8601)
- `endDate` (string, optional) - End date (ISO 8601)

**Returns:** `Promise<{success: boolean, error?: string}>`

**Example:**
```javascript
// Export all data
await exportService.exportHistory();

// Export date range
await exportService.exportHistory(
  '2026-05-01T00:00:00.000Z',
  '2026-05-31T23:59:59.999Z'
);
```

---

#### `exportLatestAnalysis()`

Export only the latest analysis to JSON file.

**Returns:** `Promise<{success: boolean, error?: string}>`

**Example:**
```javascript
await exportService.exportLatestAnalysis();
```

---

## React Hooks API

### useStorage Hook

```javascript
import { useStorage } from './hooks/useStorage.js';

function MyComponent() {
  const {
    saveEntry,
    saveAnalysis,
    deleteEntry,
    cleanup,
    getLatestAnalysis,
    checkQuota,
    quota,
    loading,
    error
  } = useStorage();

  // Use storage operations
}
```

**Returns:**
- `saveEntry(entry)` - Save journal entry
- `saveAnalysis(analysis)` - Save analysis result
- `deleteEntry(entryId)` - Delete entry
- `cleanup()` - Cleanup old data
- `getLatestAnalysis()` - Get latest analysis
- `checkQuota()` - Check storage quota
- `quota` (StorageQuotaInfo) - Current quota info
- `loading` (boolean) - Loading state
- `error` (string|null) - Error message

---

### useHistory Hook

```javascript
import { useHistory } from './hooks/useHistory.js';

function MyComponent() {
  const {
    historyData,
    chartData,
    statistics,
    loading,
    error,
    refresh
  } = useHistory(30); // Last 30 days

  // Use history data
}
```

**Parameters:**
- `days` (number) - Number of days to retrieve (default: 30)

**Returns:**
- `historyData` (HistoryDataPoint[]) - History data points
- `chartData` (ChartDataPoint[]) - Chart data points
- `statistics` (HistoryStatistics) - 30-day statistics
- `loading` (boolean) - Loading state
- `error` (string|null) - Error message
- `refresh()` - Refresh history data

---

### useExport Hook

```javascript
import { useExport } from './hooks/useExport.js';

function MyComponent() {
  const {
    exportHistory,
    exportLatestAnalysis,
    loading,
    error,
    success,
    resetSuccess
  } = useExport();

  // Use export operations
}
```

**Returns:**
- `exportHistory(startDate, endDate)` - Export history
- `exportLatestAnalysis()` - Export latest analysis
- `loading` (boolean) - Loading state
- `error` (string|null) - Error message
- `success` (boolean) - Success state
- `resetSuccess()` - Reset success state

---

## Utility Functions API

### Date Utilities

```javascript
import {
  formatDate,
  getDaysAgo,
  getTimestampDaysAgo,
  isValidISO8601,
  getStartOfDay,
  getEndOfDay,
  groupByDate,
  calculateLongestStreak,
  getDateRange,
  isDateInRange
} from './utils/dateUtils.js';
```

**Functions:**
- `formatDate(date)` - Format date to YYYY-MM-DD
- `getDaysAgo(days)` - Get date N days ago
- `getTimestampDaysAgo(days)` - Get timestamp N days ago
- `isValidISO8601(dateString)` - Validate ISO 8601 format
- `getStartOfDay(date)` - Get start of day timestamp
- `getEndOfDay(date)` - Get end of day timestamp
- `groupByDate(items)` - Group items by date
- `calculateLongestStreak(dates)` - Calculate longest consecutive streak
- `getDateRange(days)` - Get date range for last N days
- `isDateInRange(date, start, end)` - Check if date is within range

---

## Type Definitions

All types are defined in `src/types/storage.types.js` using JSDoc format.

### Key Types

- `JournalEntry` - Journal entry with metadata
- `StorageData` - Complete storage data structure
- `HistoryDataPoint` - History data point for visualization
- `ChartDataPoint` - Chart data point for Recharts
- `HistoryStatistics` - 30-day statistics
- `StorageQuotaInfo` - Storage quota information
- `CleanupResult` - Cleanup operation result
- `SaveResult` - Save operation result
- `ValidationResult` - Validation result
- `ExportData` - Export data structure

See `src/types/storage.types.js` for complete type definitions.

---

**Status**: ✅ API Documentation Complete
