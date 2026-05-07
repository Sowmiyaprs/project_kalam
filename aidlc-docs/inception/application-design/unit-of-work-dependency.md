# Unit of Work Dependencies - MindMirror AI

**Project**: MindMirror AI  
**Phase**: INCEPTION - Units Generation  
**Date**: 2026-05-06  
**Status**: Complete

---

## Dependency Overview

This document maps dependencies between the 4 units of work, defines integration points, and documents data flow patterns.

**Dependency Strategy**: Moderate enforcement with documented dependencies. Units can import from each other following documented rules.

---

## Dependency Matrix

| Unit | Depends On | Provides To | Shared Dependencies |
|------|-----------|-------------|---------------------|
| **1. Sentiment Engine** | None | Units 2, 3 | config/, utils/, types/ |
| **2. Data Management** | Unit 1 (types) | Units 3, 4 | config/, utils/, types/ |
| **3. UI Components** | Units 1, 2, 4 | None | config/, utils/, types/ |
| **4. Visualization** | Unit 2 (types) | Unit 3 | config/, utils/, types/ |

---

## Dependency Graph

```
┌─────────────────────────────────────────────────────────────┐
│                    Shared Dependencies                       │
│         config/, utils/, types/ (all units access)          │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   Unit 1: Sentiment Engine                   │
│                      (No dependencies)                       │
└─────────────────────────────────────────────────────────────┘
        │                                    │
        │ (AnalysisResult type)              │ (useAnalysis hook)
        ↓                                    ↓
┌──────────────────────────┐      ┌──────────────────────────┐
│  Unit 2: Data Management │      │  Unit 3: UI Components   │
│  (imports Unit 1 types)  │      │  (uses Unit 1 hooks)     │
└──────────────────────────┘      └──────────────────────────┘
        │                                    │
        │ (HistoryDataPoint type)            │ (uses Unit 2 hooks)
        │ (useStorage, useHistory hooks)     │ (renders Unit 4)
        ↓                                    ↓
┌──────────────────────────┐                │
│  Unit 4: Visualization   │◄───────────────┘
│  (imports Unit 2 types)  │
└──────────────────────────┘
```

---

## Unit 1: Sentiment Analysis Engine

### Dependencies
**None** - Standalone unit with no dependencies on other units

### Provides
- **To Unit 2**:
  - `AnalysisResult` type (for storage operations)
- **To Unit 3**:
  - `useAnalysis` hook (for triggering analysis from UI)
  - `AnalysisResult` type (for displaying results)

### Integration Points
- **Hook Interface**: `useAnalysis()` returns `{ analyze, isAnalyzing, error, result }`
- **Service Interface**: `SentimentAnalysisService.analyze(text: string): AnalysisResult`

### Data Flow
```
Unit 3 (AnalysisPage)
    ↓ calls useAnalysis hook
Unit 1 (SentimentAnalysisService)
    ↓ returns AnalysisResult
Unit 3 (displays results)
    ↓ passes result to
Unit 2 (StorageService via useStorage)
```

---

## Unit 2: Data Management

### Dependencies
- **Unit 1**: Imports `AnalysisResult` type for storage operations

### Provides
- **To Unit 3**:
  - `useStorage` hook (save/retrieve entries and analyses)
  - `useHistory` hook (load historical data)
  - `useExport` hook (export data)
  - Data types: `JournalEntry`, `HistoryDataPoint`, `HistoryStatistics`
- **To Unit 4**:
  - `HistoryDataPoint` type (for chart data)
  - Transformed chart data (via parent components in Unit 3)

### Integration Points
- **Storage Hook**: `useStorage()` returns `{ saveEntry, saveAnalysis, getLatest, isLoading, error }`
- **History Hook**: `useHistory(days)` returns `{ data, stats, isLoading, error, refresh, applyFilters }`
- **Export Hook**: `useExport()` returns `{ exportHistory, exportAnalysis, isExporting, error }`

### Data Flow
```
Unit 3 (AnalysisPage)
    ↓ calls useStorage.saveAnalysis
Unit 2 (StorageService)
    ↓ stores in localStorage
    
Unit 3 (HistoryPage)
    ↓ calls useHistory
Unit 2 (StorageService + DataTransformationService)
    ↓ returns formatted data
Unit 3 (passes to Unit 4)
    ↓
Unit 4 (MoodHistoryChart renders)
```

---

## Unit 3: UI Components & Layout

### Dependencies
- **Unit 1**: Uses `useAnalysis` hook, imports `AnalysisResult` type
- **Unit 2**: Uses `useStorage`, `useHistory`, `useExport` hooks, imports data types
- **Unit 4**: Renders `MoodHistoryChart` and `ProductivityMeter` components

### Provides
**None** - Terminal unit that consumes services and renders UI

### Integration Points
- **Context Providers**: Provides `AnalysisContext` and `StorageContext` to child components
- **Component Composition**: Renders Unit 4 components as children
- **Hook Consumption**: Calls hooks from Units 1 & 2 in page components

### Data Flow
```
Unit 3 (AnalysisPage)
    ↓ user input
    ↓ calls useAnalysis.analyze
Unit 1 (performs analysis)
    ↓ returns result
Unit 3 (displays in AnalysisResults, ProductivityMeter, SuggestionsList)
    ↓ calls useStorage.saveAnalysis
Unit 2 (stores result)

Unit 3 (HistoryPage)
    ↓ calls useHistory
Unit 2 (loads and transforms data)
    ↓ returns HistoryDataPoint[]
Unit 3 (passes to MoodHistoryChart)
    ↓
Unit 4 (renders chart)
```

---

## Unit 4: Visualization

### Dependencies
- **Unit 2**: Imports `HistoryDataPoint` type for chart data

### Provides
- **To Unit 3**:
  - `MoodHistoryChart` component
  - `ProductivityMeter` component

### Integration Points
- **Component Props**: Receives data via props from parent components in Unit 3
- **Chart Interface**: `<MoodHistoryChart data={historyData} metrics={selectedMetrics} />`
- **Meter Interface**: `<ProductivityMeter score={productivityScore} label="Productivity" />`

### Data Flow
```
Unit 3 (HistoryPage)
    ↓ loads data via useHistory
Unit 2 (returns HistoryDataPoint[])
    ↓ passes as props
Unit 4 (MoodHistoryChart)
    ↓ transforms for Recharts
    ↓ renders chart

Unit 3 (AnalysisPage)
    ↓ receives analysis result
    ↓ extracts productivity score
    ↓ passes as props
Unit 4 (ProductivityMeter)
    ↓ animates meter
    ↓ renders gauge
```

---

## Shared Dependencies

### config/ Directory
**Accessed by**: All units

**Contents**:
- `animations.js` - Framer Motion animation variants (Unit 3, Unit 4)
- `keywords.js` - Sentiment analysis keyword definitions (Unit 1)
- `constants.js` - Application-wide constants (all units)

**Usage**:
- Unit 1: Imports keyword definitions for sentiment analysis
- Unit 3: Imports animation variants for component animations
- Unit 4: Imports animation variants for visualization animations
- All units: Import constants as needed

---

### utils/ Directory
**Accessed by**: All units

**Contents**:
- `validation.js` - Input validation utilities
- `formatting.js` - Data formatting utilities

**Usage**:
- Unit 1: Validates text input before analysis
- Unit 2: Validates data before storage, formats dates
- Unit 3: Validates form inputs, formats display values
- Unit 4: Formats chart labels and tooltips

---

### types/ Directory
**Accessed by**: All units

**Contents**:
- `analysis.types.js` - Unit 1 type definitions (AnalysisResult, DetectedKeywords, MetricScores)
- `storage.types.js` - Unit 2 type definitions (JournalEntry, HistoryDataPoint, HistoryStatistics)
- `common.types.js` - Shared type definitions

**Usage**:
- Unit 1: Exports analysis types
- Unit 2: Imports Unit 1 types, exports storage types
- Unit 3: Imports types from Units 1 & 2
- Unit 4: Imports types from Unit 2

---

## Integration Patterns

### Pattern 1: Service Hook Integration
**Used by**: Units 1 & 2 → Unit 3

**Flow**:
```
Service (Unit 1 or 2)
    ↓ wrapped by
Custom Hook (Unit 1 or 2)
    ↓ called by
Component (Unit 3)
    ↓ receives data
    ↓ renders UI
```

**Example**:
```javascript
// Unit 1: SentimentAnalysisService
class SentimentAnalysisService {
  analyze(text) { /* ... */ }
}

// Unit 1: useAnalysis hook
function useAnalysis() {
  const [result, setResult] = useState(null);
  const analyze = async (text) => {
    const service = new SentimentAnalysisService();
    const analysisResult = await service.analyze(text);
    setResult(analysisResult);
  };
  return { analyze, result };
}

// Unit 3: AnalysisPage component
function AnalysisPage() {
  const { analyze, result } = useAnalysis();
  // Use analyze and result
}
```

---

### Pattern 2: Component Composition
**Used by**: Unit 4 → Unit 3

**Flow**:
```
Parent Component (Unit 3)
    ↓ loads data
    ↓ passes as props
Child Component (Unit 4)
    ↓ renders visualization
```

**Example**:
```javascript
// Unit 3: HistoryPage
function HistoryPage() {
  const { data } = useHistory(30);
  return <MoodHistoryChart data={data} />;
}

// Unit 4: MoodHistoryChart
function MoodHistoryChart({ data }) {
  // Render chart with data
}
```

---

### Pattern 3: Type Sharing
**Used by**: All units

**Flow**:
```
Unit 1 (defines AnalysisResult)
    ↓ exports type
types/analysis.types.js
    ↓ imported by
Unit 2 (uses AnalysisResult for storage)
Unit 3 (uses AnalysisResult for display)
```

**Example**:
```javascript
// Unit 1: types/analysis.types.js
export interface AnalysisResult {
  id: string;
  emotional: { mood: string; stressLevel: number; /* ... */ };
  productivity: { score: string; focusLevel: string; };
  suggestions: string[];
}

// Unit 2: StorageService
import { AnalysisResult } from '../types/analysis.types.js';
saveAnalysis(analysis: AnalysisResult) { /* ... */ }

// Unit 3: AnalysisResults component
import { AnalysisResult } from '../types/analysis.types.js';
function AnalysisResults({ results }: { results: AnalysisResult }) { /* ... */ }
```

---

## Dependency Validation

### Acyclic Dependency Check
✅ **No circular dependencies detected**

**Dependency Chain**:
1. Unit 1 → (no dependencies)
2. Unit 2 → Unit 1 (types only)
3. Unit 4 → Unit 2 (types only)
4. Unit 3 → Units 1, 2, 4 (terminal consumer)

**Result**: Acyclic dependency graph ✅

---

### Import Rule Compliance

**Rule 1**: Unit 1 has no dependencies ✅
- Verified: Unit 1 imports only from shared directories

**Rule 2**: Unit 2 imports only types from Unit 1 ✅
- Verified: Unit 2 imports `AnalysisResult` type, not service implementations

**Rule 3**: Unit 4 imports only types from Unit 2 ✅
- Verified: Unit 4 imports `HistoryDataPoint` type, not service implementations

**Rule 4**: Unit 3 can import from Units 1, 2, 4 ✅
- Verified: Unit 3 imports hooks from Units 1 & 2, components from Unit 4

**Rule 5**: All units can import from shared directories ✅
- Verified: config/, utils/, types/ accessible to all units

---

## Development Order Rationale

### Phase 1: Core Services (Units 1 & 2)
**Order**: Unit 1 → Unit 2

**Rationale**:
- Unit 1 has no dependencies, can be developed first
- Unit 2 depends on Unit 1 types, must come after
- Both units have comprehensive test suites
- Core logic validated before UI development

**Benefits**:
- Early validation of sentiment analysis accuracy
- Storage operations tested independently
- Stable foundation for UI development

---

### Phase 2: Presentation Layer (Units 3 & 4)
**Order**: Unit 3 → Unit 4 (or parallel)

**Rationale**:
- Both units depend on completed core services
- Unit 4 is small and can be developed quickly
- Unit 3 can use mocked Unit 4 components initially
- Can be developed in parallel if needed

**Benefits**:
- UI development starts with stable backend
- Visualization can be refined independently
- Integration testing validates complete flow

---

## Integration Testing Strategy

### Unit Integration Tests

**Test 1: Analysis → Storage Integration**
- Trigger analysis via useAnalysis
- Verify result saved via useStorage
- Confirm data retrievable from localStorage

**Test 2: Storage → Visualization Integration**
- Load history via useHistory
- Pass data to MoodHistoryChart
- Verify chart renders correctly

**Test 3: End-to-End Flow**
- User inputs journal text (Unit 3)
- Analysis performed (Unit 1)
- Result saved (Unit 2)
- Result displayed (Unit 3 + Unit 4)
- History updated (Unit 2)
- Chart reflects new data (Unit 4)

---

## Dependency Management Best Practices

### Import Guidelines

**DO**:
- ✅ Import hooks from Units 1 & 2 in Unit 3 components
- ✅ Import types from any unit as needed
- ✅ Import from shared directories (config/, utils/, types/)
- ✅ Document all cross-unit imports

**DON'T**:
- ❌ Import service classes directly in components (use hooks)
- ❌ Create circular dependencies between units
- ❌ Import implementation details across unit boundaries
- ❌ Bypass hook interfaces to access services directly

---

### Refactoring Safety

**Safe Changes**:
- Modify internal implementation within a unit
- Add new methods to services (extend hooks accordingly)
- Add new components within a unit
- Refactor shared utilities

**Breaking Changes** (require coordination):
- Change hook interfaces (affects Unit 3)
- Modify type definitions (affects dependent units)
- Rename exported functions/components
- Change data structures passed between units

---

## Summary

**Dependency Characteristics**:
- ✅ Acyclic dependency graph
- ✅ Clear integration points via hooks
- ✅ Type safety across unit boundaries
- ✅ Moderate coupling with documented dependencies
- ✅ Shared code properly organized
- ✅ Development order supports incremental delivery

**Integration Points**: 4 hooks, 2 components, 3 type definitions

**Shared Dependencies**: config/, utils/, types/ directories

**Testing Strategy**: Unit tests for Units 1 & 2, integration tests in Build and Test stage

---

**Status**: ✅ Dependencies Validated and Ready for CONSTRUCTION Phase
