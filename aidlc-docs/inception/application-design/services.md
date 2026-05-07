# Services Layer - MindMirror AI

**Project**: MindMirror AI  
**Phase**: INCEPTION - Application Design  
**Date**: 2026-05-06

---

## Service Layer Strategy

**Approach**: Minimal Services with Custom Hooks

- **Philosophy**: Lightweight service layer with essential business logic
- **Communication**: Services accessed via custom React hooks
- **Benefits**: Clean separation of concerns, testable business logic, React-friendly API

---

## Service Architecture

```
Services Layer
├── Core Services
│   ├── SentimentAnalysisService
│   └── StorageService
├── Utility Services
│   ├── DataTransformationService
│   └── ExportService
└── Custom Hooks (Service Wrappers)
    ├── useAnalysis
    ├── useStorage
    ├── useHistory
    └── useExport
```

---

## 1. Core Services

### 1.1 SentimentAnalysisService

**Purpose**: Perform sentiment analysis on user journal entries

**Responsibilities**:
- Analyze text for emotional indicators
- Calculate metric scores (mood, stress, motivation, confidence, productivity, focus)
- Generate AI suggestions based on analysis
- Handle negations and intensity modifiers
- Return structured analysis results

**Architecture**: Modular analyzers (separate modules for keyword detection, scoring, suggestions)

#### Service Interface

```javascript
class SentimentAnalysisService {
  // Main analysis method
  analyze(text: string): AnalysisResult
  
  // Module: Keyword Detection
  detectKeywords(text: string): DetectedKeywords
  
  // Module: Scoring
  calculateScores(keywords: DetectedKeywords): MetricScores
  
  // Module: Suggestions
  generateSuggestions(scores: MetricScores): string[]
  
  // Helper: Negation handling
  handleNegations(text: string): string
  
  // Helper: Intensity modifiers
  applyIntensityModifiers(keywords: DetectedKeywords): DetectedKeywords
}
```

#### Modules

**KeywordDetectionModule**
- Scan text for emotion keywords
- Identify stress, motivation, productivity, mood, focus indicators
- Return keyword matches with positions

**ScoringModule**
- Calculate weighted scores for each metric
- Apply contextual adjustments (negations, modifiers)
- Normalize scores to 0-100 range
- Determine categorical values (mood, focus level, productivity)

**SuggestionGenerationModule**
- Analyze metric combinations
- Select relevant suggestions from suggestion bank
- Prioritize suggestions based on scores
- Return 3-5 actionable recommendations

#### Data Flow

```
User Text Input
    ↓
KeywordDetectionModule → DetectedKeywords
    ↓
ScoringModule → MetricScores
    ↓
SuggestionGenerationModule → Suggestions
    ↓
AnalysisResult (combined output)
```

---

### 1.2 StorageService

**Purpose**: Manage local storage operations for journal entries and analysis results

**Responsibilities**:
- Store journal entries with metadata
- Store analysis results
- Retrieve historical data
- Manage 30-day retention policy
- Handle storage quota limits
- Validate data integrity

#### Service Interface

```javascript
class StorageService {
  // Journal Entry Operations
  saveEntry(entry: JournalEntry): Promise<void>
  getEntry(entryId: string): Promise<JournalEntry | null>
  getAllEntries(): Promise<JournalEntry[]>
  deleteEntry(entryId: string): Promise<void>
  
  // Analysis Result Operations
  saveAnalysis(analysis: AnalysisResult): Promise<void>
  getAnalysis(analysisId: string): Promise<AnalysisResult | null>
  getAllAnalyses(): Promise<AnalysisResult[]>
  getAnalysesByDateRange(start: Date, end: Date): Promise<AnalysisResult[]>
  
  // History Operations
  getHistoryData(days: number): Promise<HistoryDataPoint[]>
  getLatestAnalysis(): Promise<AnalysisResult | null>
  
  // Maintenance Operations
  cleanupOldData(): Promise<void>
  checkStorageQuota(): Promise<StorageQuotaInfo>
  clearAllData(): Promise<void>
  
  // Validation
  validateData(data: any): boolean
}
```

#### Storage Schema

**LocalStorage Keys**:
- `mindmirror_entries`: Array of journal entries
- `mindmirror_analyses`: Array of analysis results
- `mindmirror_settings`: Application settings
- `mindmirror_version`: Data schema version

**Data Structure**:
```javascript
{
  entries: JournalEntry[],
  analyses: AnalysisResult[],
  settings: {
    animationsEnabled: boolean,
    lastCleanupDate: string,
    dataVersion: string
  }
}
```

---

## 2. Utility Services

### 2.1 DataTransformationService

**Purpose**: Transform data between different formats for visualization and export

**Responsibilities**:
- Transform analysis results for chart consumption
- Aggregate historical data
- Format data for export
- Calculate derived metrics

#### Service Interface

```javascript
class DataTransformationService {
  // Chart Data Transformation
  transformForChart(analyses: AnalysisResult[]): ChartDataPoint[]
  aggregateByDate(analyses: AnalysisResult[]): HistoryDataPoint[]
  
  // Statistical Calculations
  calculateAverages(data: HistoryDataPoint[]): AverageMetrics
  calculateTrends(data: HistoryDataPoint[]): TrendData
  findExtremes(data: HistoryDataPoint[]): ExtremeValues
  
  // Export Formatting
  formatForExport(data: any, format: 'json'): string
}
```

---

### 2.2 ExportService

**Purpose**: Handle data export functionality

**Responsibilities**:
- Export history data to JSON
- Generate downloadable files
- Format export data

#### Service Interface

```javascript
class ExportService {
  // Export Operations
  exportHistory(data: HistoryDataPoint[]): void
  exportAnalysis(analysis: AnalysisResult): void
  
  // File Generation
  generateJSONFile(data: any, filename: string): void
  triggerDownload(content: string, filename: string): void
}
```

---

## 3. Custom Hooks (Service Wrappers)

### 3.1 useAnalysis

**Purpose**: Hook for sentiment analysis operations

**Interface**:
```javascript
function useAnalysis() {
  return {
    analyze: (text: string) => Promise<AnalysisResult>,
    isAnalyzing: boolean,
    error: Error | null,
    result: AnalysisResult | null
  }
}
```

**Usage**:
```javascript
const { analyze, isAnalyzing, error, result } = useAnalysis();

const handleSubmit = async (text) => {
  await analyze(text);
};
```

---

### 3.2 useStorage

**Purpose**: Hook for local storage operations

**Interface**:
```javascript
function useStorage() {
  return {
    saveEntry: (entry: JournalEntry) => Promise<void>,
    saveAnalysis: (analysis: AnalysisResult) => Promise<void>,
    getLatest: () => Promise<AnalysisResult | null>,
    isLoading: boolean,
    error: Error | null
  }
}
```

**Usage**:
```javascript
const { saveAnalysis, getLatest, isLoading } = useStorage();

useEffect(() => {
  const loadLatest = async () => {
    const latest = await getLatest();
    setLatestAnalysis(latest);
  };
  loadLatest();
}, []);
```

---

### 3.3 useHistory

**Purpose**: Hook for historical data operations

**Interface**:
```javascript
function useHistory(days: number = 30) {
  return {
    data: HistoryDataPoint[],
    stats: HistoryStatistics,
    isLoading: boolean,
    error: Error | null,
    refresh: () => Promise<void>,
    applyFilters: (filters: FilterOptions) => void
  }
}
```

**Usage**:
```javascript
const { data, stats, isLoading, applyFilters } = useHistory(30);

const handleFilterChange = (filters) => {
  applyFilters(filters);
};
```

---

### 3.4 useExport

**Purpose**: Hook for data export operations

**Interface**:
```javascript
function useExport() {
  return {
    exportHistory: (data: HistoryDataPoint[]) => void,
    exportAnalysis: (analysis: AnalysisResult) => void,
    isExporting: boolean,
    error: Error | null
  }
}
```

**Usage**:
```javascript
const { exportHistory, isExporting } = useExport();

const handleExport = () => {
  exportHistory(historyData);
};
```

---

## Service Communication Patterns

### Pattern: Custom Hooks Wrapping Services

**Flow**:
```
Component
    ↓ (calls hook)
Custom Hook (useAnalysis, useStorage, etc.)
    ↓ (calls service)
Service (SentimentAnalysisService, StorageService)
    ↓ (returns data)
Custom Hook (manages state, errors)
    ↓ (returns to component)
Component (renders data)
```

**Benefits**:
- React-friendly API with hooks
- Automatic state management (loading, error, data)
- Reusable across components
- Easy to test and mock
- Clean separation of concerns

---

## Service Dependencies

```
SentimentAnalysisService (no dependencies)
    ↑
StorageService (no dependencies)
    ↑
DataTransformationService → depends on → StorageService
    ↑
ExportService → depends on → DataTransformationService
```

**Dependency Rules**:
- Core services have no dependencies (SentimentAnalysisService, StorageService)
- Utility services may depend on core services
- Custom hooks wrap services and manage React state
- Components only interact with custom hooks (not services directly)

---

## Error Handling Strategy

### Service-Level Error Handling

**All services implement**:
- Try-catch blocks for error capture
- Structured error objects with codes and messages
- Graceful degradation where possible
- Error logging for debugging

**Error Types**:
```javascript
class AnalysisError extends Error {
  code: 'INVALID_INPUT' | 'ANALYSIS_FAILED' | 'TIMEOUT'
}

class StorageError extends Error {
  code: 'QUOTA_EXCEEDED' | 'INVALID_DATA' | 'READ_FAILED' | 'WRITE_FAILED'
}
```

### Hook-Level Error Handling

**Custom hooks**:
- Catch service errors
- Update error state
- Provide error to component
- Enable retry mechanisms

---

## Performance Considerations

### SentimentAnalysisService
- Target: < 500ms for typical entries (up to 5000 characters)
- Optimization: Efficient keyword matching algorithms
- Caching: Consider caching analysis results for identical text

### StorageService
- Target: < 100ms for read/write operations
- Optimization: Batch operations where possible
- Cleanup: Automatic cleanup of old data (> 30 days)

### DataTransformationService
- Target: < 200ms for chart data transformation
- Optimization: Memoization of expensive calculations
- Lazy loading: Transform data only when needed

---

## Testing Strategy

### Unit Testing
- Test each service method independently
- Mock dependencies for isolation
- Test error scenarios
- Validate data transformations

### Integration Testing
- Test service interactions
- Test custom hooks with services
- Validate data flow through layers

---

## Future Extensibility

**Potential Enhancements**:
- Add ValidationService for input validation
- Add NotificationService for user notifications
- Add AnalyticsService for usage tracking
- Add SyncService for cloud backup (if backend added)

**Design Principles**:
- Keep services focused and single-purpose
- Maintain loose coupling between services
- Use dependency injection for testability
- Document service contracts clearly

---

## Summary

**Service Count**: 4 services + 4 custom hooks

**Core Services**:
1. SentimentAnalysisService (modular: keyword detection, scoring, suggestions)
2. StorageService (local storage CRUD operations)

**Utility Services**:
3. DataTransformationService (data formatting and aggregation)
4. ExportService (file export functionality)

**Custom Hooks**:
1. useAnalysis (wraps SentimentAnalysisService)
2. useStorage (wraps StorageService)
3. useHistory (wraps StorageService + DataTransformationService)
4. useExport (wraps ExportService)

**Communication**: Components → Custom Hooks → Services → Data

**Benefits**: Clean architecture, testable, React-friendly, maintainable
