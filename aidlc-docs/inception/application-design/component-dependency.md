# Component Dependencies - MindMirror AI

**Project**: MindMirror AI  
**Phase**: INCEPTION - Application Design  
**Date**: 2026-05-06

---

## Dependency Strategy

**Coupling Approach**: Loose Coupling

- **Communication**: Components communicate via props and callbacks only
- **State Management**: Context API for global state, props for local communication
- **Benefits**: High reusability, easy testing, clear data flow, minimal side effects

---

## Dependency Matrix

### Legend
- ✅ **Direct Dependency**: Component directly uses/renders another component
- 🔄 **Context Dependency**: Component consumes global context
- 📦 **Service Dependency**: Component uses service via custom hook
- ➡️ **Data Flow**: Direction of data/callback flow

---

## 1. Layout Components Dependencies

### AppLayout
**Dependencies**:
- ✅ Header (renders)
- ✅ Navigation (renders)
- ✅ HomePage (renders via route)
- ✅ AnalysisPage (renders via route)
- ✅ HistoryPage (renders via route)
- ✅ ErrorBoundary (wraps routes)
- 🔄 Provides AnalysisContext
- 🔄 Provides StorageContext

**Data Flow**: Provides global state → Child components

---

### Header
**Dependencies**:
- ✅ Navigation (renders)
- ✅ Icon (renders logo)

**Data Flow**: Receives currentRoute prop ← AppLayout

---

### Navigation
**Dependencies**:
- ✅ Button (renders nav links)
- ✅ Icon (renders menu icons)

**Data Flow**: 
- Receives isOpen, onToggle props ← Header
- Sends route changes → AppLayout (via React Router)

---

## 2. Page Components Dependencies

### HomePage
**Dependencies**:
- ✅ DashboardSummary (renders)
- ✅ QuickAnalysis (renders)
- ✅ RecentEntries (renders)
- ✅ Button (renders CTA)
- 📦 useStorage (loads latest analysis)

**Data Flow**:
- Loads data from StorageService
- Passes latestAnalysis → DashboardSummary
- Passes entries → RecentEntries

---

### AnalysisPage
**Dependencies**:
- ✅ JournalInput (renders)
- ✅ AnalysisResults (renders)
- ✅ ProductivityMeter (renders)
- ✅ SuggestionsList (renders)
- ✅ LoadingSpinner (renders during analysis)
- ✅ ErrorBoundary (wraps content)
- 📦 useAnalysis (performs analysis)
- 📦 useStorage (saves results)

**Data Flow**:
- Receives text input ← JournalInput (via callback)
- Sends text → SentimentAnalysisService (via useAnalysis)
- Receives analysis results ← SentimentAnalysisService
- Passes results → AnalysisResults, ProductivityMeter, SuggestionsList
- Saves results → StorageService (via useStorage)

---

### HistoryPage
**Dependencies**:
- ✅ MoodHistoryChart (renders)
- ✅ HistoryFilters (renders)
- ✅ HistoryStats (renders)
- ✅ Button (renders export button)
- ✅ LoadingSpinner (renders during load)
- 📦 useHistory (loads historical data)
- 📦 useExport (exports data)

**Data Flow**:
- Loads history data from StorageService (via useHistory)
- Receives filter changes ← HistoryFilters (via callback)
- Passes filtered data → MoodHistoryChart, HistoryStats
- Sends export request → ExportService (via useExport)

---

## 3. Feature Components Dependencies

### Analysis Feature

#### JournalInput
**Dependencies**:
- ✅ Input (renders textarea - styled)
- ✅ Button (renders submit button)
- ✅ Badge (renders character count warning)

**Data Flow**:
- Receives value, onChange, onSubmit, isLoading props ← AnalysisPage
- Sends text changes → AnalysisPage (via onChange callback)
- Sends submit event → AnalysisPage (via onSubmit callback)

---

#### AnalysisResults
**Dependencies**:
- ✅ MetricCard (renders each metric)
- ✅ AnimatedCard (wraps sections)
- ✅ Badge (renders mood badge)

**Data Flow**:
- Receives results prop ← AnalysisPage
- Passes individual metrics → MetricCard components

---

#### ProductivityMeter
**Dependencies**:
- ✅ Card (wraps meter)
- ✅ Badge (renders score label)

**Data Flow**:
- Receives score, label props ← AnalysisPage
- No outgoing data flow (presentational)

---

#### SuggestionsList
**Dependencies**:
- ✅ AnimatedCard (wraps list)
- ✅ Icon (renders suggestion icons)

**Data Flow**:
- Receives suggestions prop ← AnalysisPage
- No outgoing data flow (presentational)

---

### History Feature

#### MoodHistoryChart
**Dependencies**:
- ✅ Card (wraps chart)
- ✅ Recharts library components
- 📦 DataTransformationService (via useHistory hook in parent)

**Data Flow**:
- Receives data, metrics props ← HistoryPage
- No outgoing data flow (presentational)

---

#### HistoryFilters
**Dependencies**:
- ✅ Input (renders date inputs)
- ✅ Button (renders preset buttons)
- ✅ Badge (renders selected metrics)

**Data Flow**:
- Receives dateRange, selectedMetrics props ← HistoryPage
- Sends filter changes → HistoryPage (via onFilterChange callback)

---

#### HistoryStats
**Dependencies**:
- ✅ MetricCard (renders stat cards)
- ✅ AnimatedCard (wraps stats)
- ✅ Badge (renders trend indicators)

**Data Flow**:
- Receives stats prop ← HistoryPage
- No outgoing data flow (presentational)

---

### Dashboard Feature

#### DashboardSummary
**Dependencies**:
- ✅ MetricCard (renders summary cards)
- ✅ AnimatedCard (wraps summary)
- ✅ Badge (renders status badges)

**Data Flow**:
- Receives latestAnalysis prop ← HomePage
- No outgoing data flow (presentational)

---

#### QuickAnalysis
**Dependencies**:
- ✅ Input (renders compact textarea)
- ✅ Button (renders submit button)
- ✅ LoadingSpinner (renders during analysis)
- 📦 useAnalysis (performs quick analysis)

**Data Flow**:
- Manages own local state for quick analysis
- Sends navigation → AnalysisPage (via React Router)

---

#### RecentEntries
**Dependencies**:
- ✅ AnimatedCard (renders entry cards)
- ✅ Badge (renders mood badges)

**Data Flow**:
- Receives entries prop ← HomePage
- Sends entry click → HomePage (via onEntryClick callback)

---

## 4. Shared Components Dependencies

### Atoms

**Button**: No dependencies (pure presentational)

**Input**: No dependencies (pure presentational)

**Card**: No dependencies (pure presentational)

**Badge**: No dependencies (pure presentational)

**Icon**: No dependencies (pure presentational)

---

### Molecules

**MetricCard**:
- ✅ Card (wraps content)
- ✅ Icon (renders metric icon)
- ✅ Badge (renders value badge)

**AnimatedCard**:
- ✅ Card (extends base card)
- Uses Framer Motion for animations

**GlowButton**:
- ✅ Button (extends base button)
- Uses Framer Motion for glow effects

---

### Organisms

**ErrorBoundary**: No component dependencies (React error boundary)

**LoadingSpinner**:
- ✅ Icon (renders spinner icon)

---

## Component Dependency Graph

```
AppLayout
├── Header
│   ├── Navigation
│   │   ├── Button
│   │   └── Icon
│   └── Icon
├── HomePage
│   ├── DashboardSummary
│   │   ├── MetricCard
│   │   │   ├── Card
│   │   │   ├── Icon
│   │   │   └── Badge
│   │   ├── AnimatedCard
│   │   │   └── Card
│   │   └── Badge
│   ├── QuickAnalysis
│   │   ├── Input
│   │   ├── Button
│   │   └── LoadingSpinner
│   │       └── Icon
│   └── RecentEntries
│       ├── AnimatedCard
│       │   └── Card
│       └── Badge
├── AnalysisPage
│   ├── JournalInput
│   │   ├── Input
│   │   ├── Button
│   │   └── Badge
│   ├── AnalysisResults
│   │   ├── MetricCard
│   │   │   ├── Card
│   │   │   ├── Icon
│   │   │   └── Badge
│   │   ├── AnimatedCard
│   │   │   └── Card
│   │   └── Badge
│   ├── ProductivityMeter
│   │   ├── Card
│   │   └── Badge
│   ├── SuggestionsList
│   │   ├── AnimatedCard
│   │   │   └── Card
│   │   └── Icon
│   ├── LoadingSpinner
│   │   └── Icon
│   └── ErrorBoundary
└── HistoryPage
    ├── MoodHistoryChart
    │   └── Card
    ├── HistoryFilters
    │   ├── Input
    │   ├── Button
    │   └── Badge
    ├── HistoryStats
    │   ├── MetricCard
    │   │   ├── Card
    │   │   ├── Icon
    │   │   └── Badge
    │   ├── AnimatedCard
    │   │   └── Card
    │   └── Badge
    ├── Button
    └── LoadingSpinner
        └── Icon
```

---

## Data Flow Diagram

### Analysis Flow

```
User Input (JournalInput)
    ↓ (text via onChange callback)
AnalysisPage (state: journalText)
    ↓ (onSubmit)
useAnalysis Hook
    ↓ (calls service)
SentimentAnalysisService
    ↓ (returns AnalysisResult)
useAnalysis Hook (state: result)
    ↓ (returns to component)
AnalysisPage (state: analysisResult)
    ↓ (passes as props)
├── AnalysisResults (displays metrics)
├── ProductivityMeter (displays score)
└── SuggestionsList (displays suggestions)
    ↓ (parallel save)
useStorage Hook
    ↓ (calls service)
StorageService (persists to localStorage)
```

---

### History Flow

```
HistoryPage (mounts)
    ↓ (useEffect)
useHistory Hook
    ↓ (calls service)
StorageService (loads data)
    ↓ (returns raw data)
DataTransformationService (transforms data)
    ↓ (returns formatted data)
useHistory Hook (state: data, stats)
    ↓ (returns to component)
HistoryPage (state: historyData, stats)
    ↓ (passes as props)
├── MoodHistoryChart (displays chart)
├── HistoryStats (displays statistics)
└── HistoryFilters (controls filters)
    ↓ (filter changes via callback)
HistoryPage (applies filters)
    ↓ (updates filtered data)
MoodHistoryChart (re-renders with filtered data)
```

---

### Storage Flow

```
Component (any)
    ↓ (calls hook)
useStorage Hook
    ↓ (calls service method)
StorageService
    ↓ (reads/writes)
localStorage (browser API)
    ↓ (returns data)
StorageService (validates, transforms)
    ↓ (returns to hook)
useStorage Hook (manages state)
    ↓ (returns to component)
Component (renders data)
```

---

## Context Providers

### AnalysisContext
**Provided by**: AppLayout  
**Consumed by**: AnalysisPage, QuickAnalysis  
**Data**: Current analysis state, analysis history

**Interface**:
```javascript
{
  currentAnalysis: AnalysisResult | null,
  analysisHistory: AnalysisResult[],
  setCurrentAnalysis: (result: AnalysisResult) => void
}
```

---

### StorageContext
**Provided by**: AppLayout  
**Consumed by**: HomePage, AnalysisPage, HistoryPage  
**Data**: Storage operations, quota info

**Interface**:
```javascript
{
  quotaInfo: StorageQuotaInfo,
  refreshQuota: () => Promise<void>,
  clearData: () => Promise<void>
}
```

---

## Communication Patterns

### Pattern 1: Parent-Child Props
**Used by**: Most components  
**Flow**: Parent passes data down via props, child sends events up via callbacks

**Example**:
```javascript
// Parent (AnalysisPage)
<JournalInput 
  value={text}
  onChange={setText}
  onSubmit={handleAnalyze}
/>

// Child (JournalInput)
const handleChange = (e) => {
  onChange(e.target.value); // Call parent callback
};
```

---

### Pattern 2: Context for Global State
**Used by**: AppLayout, Page components  
**Flow**: Provider at top level, consumers access via useContext

**Example**:
```javascript
// Provider (AppLayout)
<AnalysisContext.Provider value={{ currentAnalysis, setCurrentAnalysis }}>
  {children}
</AnalysisContext.Provider>

// Consumer (AnalysisPage)
const { currentAnalysis, setCurrentAnalysis } = useContext(AnalysisContext);
```

---

### Pattern 3: Custom Hooks for Services
**Used by**: All components needing service access  
**Flow**: Component calls hook, hook manages service interaction and state

**Example**:
```javascript
// Component
const { analyze, isAnalyzing, result } = useAnalysis();

const handleSubmit = async () => {
  await analyze(journalText);
  // result is automatically updated by hook
};
```

---

## Dependency Rules

### ✅ Allowed Dependencies

1. **Page → Feature Components**: Pages can render feature components
2. **Feature → Shared Components**: Feature components can use shared components
3. **Component → Custom Hooks**: Any component can use custom hooks
4. **Custom Hooks → Services**: Hooks wrap service calls
5. **Shared → Shared**: Molecules can use atoms, organisms can use molecules/atoms

---

### ❌ Prohibited Dependencies

1. **Feature → Feature**: Feature components should not depend on other feature components
2. **Shared → Feature**: Shared components should not depend on feature-specific components
3. **Component → Service (direct)**: Components should not call services directly (use hooks)
4. **Circular Dependencies**: No component should create circular dependency chains
5. **Upward Dependencies**: Child components should not import parent components

---

## Reusability Analysis

### Highly Reusable (0 external dependencies)
- Button, Input, Card, Badge, Icon
- Can be used anywhere without restrictions

### Moderately Reusable (depends only on atoms)
- MetricCard, AnimatedCard, GlowButton, LoadingSpinner
- Can be used in any feature with minimal coupling

### Feature-Specific (depends on feature context)
- JournalInput, AnalysisResults, ProductivityMeter, MoodHistoryChart
- Designed for specific features, limited reusability

---

## Testing Implications

### Unit Testing
- **Atoms**: Test in isolation (no dependencies)
- **Molecules**: Mock atom dependencies
- **Feature Components**: Mock shared components and hooks
- **Page Components**: Mock feature components and hooks

### Integration Testing
- Test data flow between parent and child components
- Test context provider and consumer interactions
- Test hook and service integration

---

## Performance Considerations

### Minimize Re-renders
- Use React.memo for expensive presentational components
- Memoize callbacks with useCallback
- Memoize computed values with useMemo

### Code Splitting
- Lazy load page components with React.lazy
- Split feature components into separate bundles
- Load Recharts library only when needed (HistoryPage)

### Prop Drilling Prevention
- Use Context for deeply nested shared state
- Keep component tree shallow where possible
- Use composition over deep nesting

---

## Summary

**Coupling Strategy**: Loose coupling via props and callbacks  
**State Management**: Context API for global state, local state for component-specific data  
**Service Access**: Custom hooks wrapping services  
**Communication**: Unidirectional data flow (parent → child via props, child → parent via callbacks)

**Benefits**:
- High component reusability
- Easy to test in isolation
- Clear data flow
- Minimal side effects
- Maintainable architecture
