# Application Design - MindMirror AI

**Project**: MindMirror AI  
**Phase**: INCEPTION - Application Design  
**Date**: 2026-05-06  
**Status**: Complete

---

## Executive Summary

This document consolidates the complete application design for MindMirror AI, a futuristic emotional and productivity analysis web application. The design follows a hybrid component organization approach with loose coupling, minimal service layer, and React-friendly architecture using custom hooks.

**Key Design Decisions**:
- **Component Organization**: Hybrid (feature-based + atomic design)
- **State Management**: Context API for global state + useState for local state
- **Service Architecture**: Minimal services (Analysis + Storage) accessed via custom hooks
- **Component Coupling**: Loose coupling via props and callbacks
- **Data Flow**: Unidirectional (parent → child via props, child → parent via callbacks)

---

## 1. Architecture Overview

### 1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        User Interface                        │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │  HomePage  │  │ Analysis   │  │  History   │            │
│  │            │  │    Page    │  │    Page    │            │
│  └────────────┘  └────────────┘  └────────────┘            │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                    Feature Components                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Analysis   │  │   History    │  │  Dashboard   │      │
│  │   Feature    │  │   Feature    │  │   Feature    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                   Shared Components                          │
│  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐           │
│  │ Atoms  │  │Molecules│ │Organisms│  │ Hooks  │           │
│  └────────┘  └────────┘  └────────┘  └────────┘           │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                      Services Layer                          │
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │    Sentiment     │  │     Storage      │                │
│  │ Analysis Service │  │     Service      │                │
│  └──────────────────┘  └──────────────────┘                │
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │ Data Transform   │  │     Export       │                │
│  │     Service      │  │     Service      │                │
│  └──────────────────┘  └──────────────────┘                │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                    Browser APIs                              │
│              localStorage, DOM, Recharts                     │
└─────────────────────────────────────────────────────────────┘
```

---

### 1.2 Technology Stack

**Frontend Framework**: React 18+ (JavaScript, functional components, hooks)  
**Styling**: Tailwind CSS (dark theme, glassmorphism, neon effects)  
**Animations**: Framer Motion (smooth transitions, floating effects)  
**Charts**: Recharts (mood history visualization)  
**Routing**: React Router v6 (with lazy loading)  
**State Management**: Context API + useState/useReducer  
**Storage**: Browser localStorage  
**Build Tool**: Vite (fast dev server, optimized builds)

---

## 2. Component Architecture

### 2.1 Component Hierarchy

**Total Components**: 27

**Breakdown**:
- Layout Components: 3 (AppLayout, Header, Navigation)
- Page Components: 3 (HomePage, AnalysisPage, HistoryPage)
- Feature Components: 11 (Analysis: 4, History: 3, Dashboard: 3, Shared: 1)
- Shared Components: 10 (Atoms: 5, Molecules: 3, Organisms: 2)

### 2.2 Component Organization Strategy

**Hybrid Approach**: Feature-based + Atomic Design

**Feature-based Organization**:
- Components grouped by functional domain (Analysis, History, Dashboard)
- Clear feature boundaries
- Easy to locate and maintain feature-specific code

**Atomic Design Principles**:
- **Atoms**: Basic building blocks (Button, Input, Card, Badge, Icon)
- **Molecules**: Simple combinations of atoms (MetricCard, AnimatedCard, GlowButton)
- **Organisms**: Complex components (ErrorBoundary, LoadingSpinner)

**Benefits**:
- Clear separation of concerns
- High reusability of shared components
- Easy to scale and maintain
- Consistent design system

---

### 2.3 Key Components

#### Layout Components
- **AppLayout**: Root component with routing, global contexts, error boundaries
- **Header**: Branding and navigation with futuristic styling
- **Navigation**: Route navigation with active state and mobile menu

#### Page Components
- **HomePage**: Dashboard with latest analysis summary and quick access
- **AnalysisPage**: Main analysis interface with journal input and results
- **HistoryPage**: 30-day mood history with charts and statistics

#### Feature Components - Analysis
- **JournalInput**: Large textarea with character count and soft limit warning
- **AnalysisResults**: Comprehensive display of all detected metrics
- **ProductivityMeter**: Animated gauge for productivity visualization
- **SuggestionsList**: AI-generated self-improvement tips

#### Feature Components - History
- **MoodHistoryChart**: Multi-metric line chart with Recharts
- **HistoryFilters**: Date range and metric selection controls
- **HistoryStats**: Statistical summary with trends and extremes

#### Feature Components - Dashboard
- **DashboardSummary**: Overview cards with latest emotional state
- **QuickAnalysis**: Compact journal input for quick analysis
- **RecentEntries**: List of recent journal entries

#### Shared Components
- **Atoms**: Button, Input, Card, Badge, Icon (highly reusable primitives)
- **Molecules**: MetricCard, AnimatedCard, GlowButton (composed atoms)
- **Organisms**: ErrorBoundary, LoadingSpinner (complex shared components)

---

## 3. Services Architecture

### 3.1 Service Layer Philosophy

**Approach**: Minimal Services with Custom Hooks

- Lightweight service layer with essential business logic only
- Services accessed via custom React hooks (not directly from components)
- Clean separation between business logic (services) and UI logic (components)

### 3.2 Core Services

#### SentimentAnalysisService
**Purpose**: Perform sentiment analysis on journal entries

**Architecture**: Modular (separate modules for keyword detection, scoring, suggestions)

**Modules**:
1. **KeywordDetectionModule**: Scan text for emotion keywords
2. **ScoringModule**: Calculate weighted scores with contextual adjustments
3. **SuggestionGenerationModule**: Generate actionable recommendations

**Key Methods**:
- `analyze(text)`: Main analysis method returning AnalysisResult
- `detectKeywords(text)`: Identify emotion keywords
- `calculateScores(keywords)`: Compute metric scores
- `generateSuggestions(scores)`: Create AI suggestions

---

#### StorageService
**Purpose**: Manage local storage operations

**Responsibilities**:
- Store/retrieve journal entries and analysis results
- Manage 30-day retention policy
- Handle storage quota limits
- Validate data integrity

**Key Methods**:
- `saveEntry(entry)`, `getEntry(id)`, `getAllEntries()`
- `saveAnalysis(analysis)`, `getAnalysis(id)`, `getAllAnalyses()`
- `getHistoryData(days)`, `getLatestAnalysis()`
- `cleanupOldData()`, `checkStorageQuota()`

---

### 3.3 Utility Services

#### DataTransformationService
**Purpose**: Transform data for visualization and export

**Key Methods**:
- `transformForChart(analyses)`: Format data for Recharts
- `aggregateByDate(analyses)`: Group data by date
- `calculateAverages(data)`, `calculateTrends(data)`, `findExtremes(data)`

---

#### ExportService
**Purpose**: Handle data export functionality

**Key Methods**:
- `exportHistory(data)`: Export history to JSON
- `generateJSONFile(data, filename)`: Create downloadable file

---

### 3.4 Custom Hooks (Service Wrappers)

#### useAnalysis
**Purpose**: Hook for sentiment analysis operations

**Returns**: `{ analyze, isAnalyzing, error, result }`

**Usage**: Wraps SentimentAnalysisService, manages analysis state

---

#### useStorage
**Purpose**: Hook for local storage operations

**Returns**: `{ saveEntry, saveAnalysis, getLatest, isLoading, error }`

**Usage**: Wraps StorageService, manages storage state

---

#### useHistory
**Purpose**: Hook for historical data operations

**Returns**: `{ data, stats, isLoading, error, refresh, applyFilters }`

**Usage**: Wraps StorageService + DataTransformationService, manages history state

---

#### useExport
**Purpose**: Hook for data export operations

**Returns**: `{ exportHistory, exportAnalysis, isExporting, error }`

**Usage**: Wraps ExportService, manages export state

---

## 4. Data Flow Architecture

### 4.1 Analysis Flow

```
User Input (JournalInput)
    ↓ text via onChange callback
AnalysisPage (state: journalText)
    ↓ onSubmit
useAnalysis Hook
    ↓ calls service
SentimentAnalysisService
    ↓ returns AnalysisResult
useAnalysis Hook (state: result)
    ↓ returns to component
AnalysisPage (state: analysisResult)
    ↓ passes as props
├── AnalysisResults (displays metrics)
├── ProductivityMeter (displays score)
└── SuggestionsList (displays suggestions)
    ↓ parallel save
useStorage Hook → StorageService → localStorage
```

---

### 4.2 History Flow

```
HistoryPage (mounts)
    ↓ useEffect
useHistory Hook
    ↓ calls service
StorageService (loads data)
    ↓ returns raw data
DataTransformationService (transforms data)
    ↓ returns formatted data
useHistory Hook (state: data, stats)
    ↓ returns to component
HistoryPage (state: historyData, stats)
    ↓ passes as props
├── MoodHistoryChart (displays chart)
├── HistoryStats (displays statistics)
└── HistoryFilters (controls filters)
    ↓ filter changes via callback
HistoryPage (applies filters)
    ↓ updates filtered data
MoodHistoryChart (re-renders with filtered data)
```

---

### 4.3 State Management

**Global State** (Context API):
- **AnalysisContext**: Current analysis state, analysis history
- **StorageContext**: Storage operations, quota info

**Local State** (useState/useReducer):
- Component-specific UI state
- Form inputs
- Loading/error states

**Persistent State** (localStorage):
- Journal entries
- Analysis results
- User settings

---

## 5. Component Dependencies

### 5.1 Coupling Strategy

**Approach**: Loose Coupling

- Components communicate via props and callbacks only
- No direct component-to-component imports (except parent-child)
- Services accessed via custom hooks (not directly)
- Context used sparingly for truly global state

**Benefits**:
- High reusability
- Easy testing
- Clear data flow
- Minimal side effects

---

### 5.2 Dependency Rules

**✅ Allowed**:
- Page → Feature Components
- Feature → Shared Components
- Component → Custom Hooks
- Custom Hooks → Services
- Shared → Shared (molecules use atoms)

**❌ Prohibited**:
- Feature → Feature (no cross-feature dependencies)
- Shared → Feature (shared components stay generic)
- Component → Service (must use hooks)
- Circular dependencies
- Upward dependencies (child importing parent)

---

### 5.3 Communication Patterns

**Pattern 1: Parent-Child Props**
- Parent passes data down via props
- Child sends events up via callbacks
- Used by most components

**Pattern 2: Context for Global State**
- Provider at AppLayout level
- Consumers access via useContext
- Used for analysis state and storage operations

**Pattern 3: Custom Hooks for Services**
- Component calls hook
- Hook manages service interaction and state
- Used for all service access

---

## 6. Data Models

### 6.1 Journal Entry
```javascript
{
  id: string (UUID),
  text: string,
  timestamp: string (ISO 8601),
  characterCount: number,
  wordCount: number
}
```

---

### 6.2 Analysis Result
```javascript
{
  id: string (UUID),
  entryId: string (reference to Journal Entry),
  timestamp: string (ISO 8601),
  emotional: {
    mood: string,
    stressLevel: number (0-100),
    motivation: number (0-100),
    confidence: number (0-100)
  },
  productivity: {
    score: string ('Low' | 'Medium' | 'High'),
    focusLevel: string ('Poor' | 'Improving' | 'Good' | 'Excellent')
  },
  suggestions: string[],
  analysisDuration: number (milliseconds)
}
```

---

### 6.3 History Data Point
```javascript
{
  date: string (ISO 8601),
  mood: string,
  stressLevel: number,
  motivation: number,
  confidence: number,
  productivityScore: number,
  focusLevel: number
}
```

---

### 6.4 Local Storage Structure
```javascript
{
  entries: JournalEntry[],
  analyses: AnalysisResult[],
  settings: {
    animationsEnabled: boolean,
    lastCleanupDate: string (ISO 8601),
    dataVersion: string
  }
}
```

---

## 7. Design Patterns

### 7.1 Error Handling

**Strategy**: Combination of error boundaries and local try-catch

**Implementation**:
- **ErrorBoundary** components at strategic levels (AppLayout, AnalysisPage)
- **Try-catch** blocks in async operations (analysis, storage)
- **Graceful degradation**: Show partial results if available
- **User-friendly messages**: No technical jargon in error displays

---

### 7.2 Animation Management

**Strategy**: Centralized animation configuration with reusable variants

**Implementation**:
- Centralized animation variants in `animations.js` config file
- Reusable Framer Motion variants for common animations
- Consistent animation timing and easing across app
- Reduced animations on mobile for performance

**Common Animations**:
- Card entrance (fade + slide)
- Button hover (scale + glow)
- Meter fill (smooth progress)
- List stagger (sequential entrance)
- Page transitions (fade)

---

### 7.3 Responsive Design

**Strategy**: Tailwind responsive classes directly in components

**Breakpoints**:
- Mobile: 320px - 768px
- Tablet: 768px - 1024px
- Desktop: 1024px+

**Implementation**:
- Tailwind responsive prefixes (sm:, md:, lg:)
- Mobile-first approach
- Touch-friendly targets on mobile
- Reduced animation complexity on mobile

---

### 7.4 Route Management

**Strategy**: React Router with lazy loading for code splitting

**Implementation**:
- React Router v6 for routing
- Lazy loading of page components with React.lazy
- Suspense boundaries with LoadingSpinner fallback
- Code splitting for optimal bundle size

**Routes**:
- `/` → HomePage
- `/analysis` → AnalysisPage
- `/history` → HistoryPage

---

## 8. Performance Considerations

### 8.1 Target Metrics

- **Analysis Response**: < 500ms for typical entries
- **Page Load**: < 2 seconds on standard broadband
- **Animations**: 60fps on desktop, reduced on mobile
- **Storage Operations**: < 100ms for read/write
- **Chart Rendering**: < 200ms for 30-day data

---

### 8.2 Optimization Strategies

**Code Splitting**:
- Lazy load page components
- Split Recharts library (only load on HistoryPage)
- Separate bundles for feature components

**React Optimization**:
- React.memo for expensive presentational components
- useCallback for memoized callbacks
- useMemo for computed values
- Avoid unnecessary re-renders

**Data Optimization**:
- Efficient keyword matching algorithms
- Memoization of expensive calculations
- Lazy loading of historical data
- Automatic cleanup of old data (> 30 days)

---

## 9. Testing Strategy

### 9.1 Unit Testing

**Components**:
- Test atoms in isolation (no dependencies)
- Mock dependencies for molecules and organisms
- Test props, callbacks, and rendering

**Services**:
- Test each service method independently
- Mock dependencies for isolation
- Test error scenarios
- Validate data transformations

**Hooks**:
- Test custom hooks with React Testing Library
- Mock service calls
- Test state management and side effects

---

### 9.2 Integration Testing

**Component Integration**:
- Test data flow between parent and child components
- Test context provider and consumer interactions
- Test hook and service integration

**Feature Integration**:
- Test complete user flows (input → analysis → results)
- Test history loading and filtering
- Test export functionality

---

## 10. Folder Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── AppLayout.jsx
│   │   ├── Header.jsx
│   │   └── Navigation.jsx
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── AnalysisPage.jsx
│   │   └── HistoryPage.jsx
│   ├── features/
│   │   ├── analysis/
│   │   │   ├── JournalInput.jsx
│   │   │   ├── AnalysisResults.jsx
│   │   │   ├── ProductivityMeter.jsx
│   │   │   └── SuggestionsList.jsx
│   │   ├── history/
│   │   │   ├── MoodHistoryChart.jsx
│   │   │   ├── HistoryFilters.jsx
│   │   │   └── HistoryStats.jsx
│   │   └── dashboard/
│   │       ├── DashboardSummary.jsx
│   │       ├── QuickAnalysis.jsx
│   │       └── RecentEntries.jsx
│   └── shared/
│       ├── atoms/
│       │   ├── Button.jsx
│       │   ├── Input.jsx
│       │   ├── Card.jsx
│       │   ├── Badge.jsx
│       │   └── Icon.jsx
│       ├── molecules/
│       │   ├── MetricCard.jsx
│       │   ├── AnimatedCard.jsx
│       │   └── GlowButton.jsx
│       └── organisms/
│           ├── ErrorBoundary.jsx
│           └── LoadingSpinner.jsx
├── services/
│   ├── SentimentAnalysisService.js
│   ├── StorageService.js
│   ├── DataTransformationService.js
│   └── ExportService.js
├── hooks/
│   ├── useAnalysis.js
│   ├── useStorage.js
│   ├── useHistory.js
│   └── useExport.js
├── contexts/
│   ├── AnalysisContext.js
│   └── StorageContext.js
├── config/
│   ├── animations.js
│   ├── keywords.js
│   └── constants.js
├── utils/
│   ├── validation.js
│   └── formatting.js
├── App.jsx
└── main.jsx
```

---

## 11. Summary

### Design Highlights

✅ **27 components** organized in hybrid structure (feature-based + atomic)  
✅ **4 services** with minimal, focused responsibilities  
✅ **4 custom hooks** providing React-friendly service access  
✅ **Loose coupling** via props and callbacks  
✅ **Modular sentiment analysis** with keyword detection, scoring, and suggestions  
✅ **Context API** for global state management  
✅ **Centralized animations** with Framer Motion  
✅ **Responsive design** with Tailwind CSS  
✅ **Code splitting** with React Router lazy loading  
✅ **Local storage** for data persistence  

### Architecture Benefits

- **Maintainable**: Clear separation of concerns, easy to locate and modify code
- **Testable**: Loose coupling enables isolated unit testing
- **Scalable**: Modular architecture supports future enhancements
- **Performant**: Code splitting, memoization, and optimization strategies
- **Reusable**: Atomic design system with highly reusable components
- **React-friendly**: Hooks-based architecture following React best practices

---

## Next Steps

This application design will guide the **Units Generation** phase, where the system will be decomposed into development units. Following that, detailed business logic and algorithms will be designed in the **Functional Design** phase (CONSTRUCTION).

---

**Design Status**: ✅ Complete and Ready for Approval
