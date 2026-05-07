# Unit of Work - MindMirror AI

**Project**: MindMirror AI  
**Phase**: INCEPTION - Units Generation  
**Date**: 2026-05-06  
**Status**: Complete

---

## Executive Summary

MindMirror AI is decomposed into **4 units of work** following a hybrid technical alignment approach. Units are organized to support multiple features while maintaining clear technical boundaries. Development follows a core-first strategy with progressive loading deployment.

**Units**:
1. **Sentiment Analysis Engine** - Core analysis logic with modular architecture
2. **Data Management** - Storage, persistence, and data operations
3. **UI Components & Layout** - Shared components, layout, and pages
4. **Visualization** - Charts, meters, and data visualization

---

## Decomposition Strategy

### Alignment Approach
**Hybrid Technical Alignment**: Units are organized by technical capability but designed to support multiple user-facing features.

**Benefits**:
- Clear technical boundaries
- Reusable across features
- Easier to maintain and test
- Supports progressive loading

### Development Order
**Core-First Approach**:
1. **Phase 1**: Sentiment Analysis Engine + Data Management (core services)
2. **Phase 2**: UI Components & Layout + Visualization (presentation layer)

**Rationale**: Build foundational services first, then layer UI on top. Enables early testing of core logic before UI integration.

### Module Boundaries
**Moderate Enforcement**: Units can import from each other with documented dependencies. Import rules are documented but not strictly enforced by tooling.

---

## Unit Definitions

### Unit 1: Sentiment Analysis Engine

**Purpose**: Analyze user journal entries to detect emotional state and generate insights

**Scope**: All sentiment analysis logic including keyword detection, scoring algorithms, and suggestion generation

**Module Structure** (within single unit):
- **KeywordDetectionModule**: Scan text for emotion keywords
- **ScoringModule**: Calculate weighted scores with contextual adjustments
- **SuggestionGenerationModule**: Generate AI-powered recommendations

**Responsibilities**:
- Detect emotion keywords in user text
- Handle negations (e.g., "not happy" vs "happy")
- Apply intensity modifiers (e.g., "very stressed")
- Calculate metric scores (mood, stress, motivation, confidence, productivity, focus)
- Generate 3-5 personalized suggestions based on analysis
- Return structured AnalysisResult object

**Components**:
- SentimentAnalysisService (main service class)
- KeywordDetectionModule
- ScoringModule
- SuggestionGenerationModule

**Services**:
- SentimentAnalysisService

**Hooks**:
- useAnalysis (wraps SentimentAnalysisService)

**Key Methods**:
- `analyze(text: string): AnalysisResult`
- `detectKeywords(text: string): DetectedKeywords`
- `calculateScores(keywords: DetectedKeywords): MetricScores`
- `generateSuggestions(scores: MetricScores): string[]`
- `handleNegations(text: string): string`
- `applyIntensityModifiers(keywords: DetectedKeywords): DetectedKeywords`

**Data Models**:
- DetectedKeywords
- MetricScores
- AnalysisResult

**Testing Strategy**:
- ✅ **Unit tests**: Test each module independently
- ✅ **Integration tests**: Test full analysis pipeline
- ✅ **Test coverage**: Keyword detection, scoring algorithms, suggestion generation, edge cases

**Dependencies**:
- None (standalone unit)

**Exports**:
- SentimentAnalysisService (via useAnalysis hook)
- AnalysisResult type

---

### Unit 2: Data Management

**Purpose**: Handle all data persistence, retrieval, and export operations

**Scope**: Local storage operations, history management, data cleanup, and export functionality

**Responsibilities**:
- Store journal entries with metadata
- Store analysis results
- Retrieve historical data (30-day retention)
- Manage storage quota and cleanup old data
- Export data to JSON format
- Transform data for visualization
- Validate data integrity

**Components**:
- None (pure service layer)

**Services**:
- StorageService (CRUD operations for localStorage)
- DataTransformationService (format data for charts)
- ExportService (generate JSON exports)

**Hooks**:
- useStorage (wraps StorageService)
- useHistory (wraps StorageService + DataTransformationService)
- useExport (wraps ExportService)

**Key Methods**:
- **StorageService**:
  - `saveEntry(entry: JournalEntry): Promise<void>`
  - `saveAnalysis(analysis: AnalysisResult): Promise<void>`
  - `getHistoryData(days: number): Promise<HistoryDataPoint[]>`
  - `getLatestAnalysis(): Promise<AnalysisResult | null>`
  - `cleanupOldData(): Promise<void>`
  - `checkStorageQuota(): Promise<StorageQuotaInfo>`
- **DataTransformationService**:
  - `transformForChart(analyses: AnalysisResult[]): ChartDataPoint[]`
  - `aggregateByDate(analyses: AnalysisResult[]): HistoryDataPoint[]`
  - `calculateStatistics(data: HistoryDataPoint[]): HistoryStatistics`
- **ExportService**:
  - `exportHistory(data: HistoryDataPoint[]): void`
  - `generateJSONFile(data: any, filename: string): void`

**Data Models**:
- JournalEntry
- AnalysisResult (imported from Unit 1)
- HistoryDataPoint
- HistoryStatistics
- StorageQuotaInfo

**Testing Strategy**:
- ✅ **Unit tests**: Test each service method independently
- ✅ **Integration tests**: Test storage + transformation pipeline
- ✅ **Test coverage**: CRUD operations, data transformation, export, quota management, cleanup logic

**Dependencies**:
- Unit 1 (imports AnalysisResult type)

**Exports**:
- StorageService (via useStorage hook)
- DataTransformationService (via useHistory hook)
- ExportService (via useExport hook)
- Data model types

---

### Unit 3: UI Components & Layout

**Purpose**: Provide reusable UI components, layout structure, and page components

**Scope**: All React components except visualization-specific components (charts, meters)

**Responsibilities**:
- Render application layout (header, navigation, routing)
- Provide page components (HomePage, AnalysisPage, HistoryPage)
- Render feature components (journal input, analysis results, suggestions, filters, stats)
- Provide shared component library (atoms, molecules, organisms)
- Manage global state via Context API
- Handle routing and navigation
- Apply futuristic styling (glassmorphism, neon effects)
- Implement responsive design
- Manage animations (except visualization animations)

**Components**:
- **Layout**: AppLayout, Header, Navigation
- **Pages**: HomePage, AnalysisPage, HistoryPage
- **Features**:
  - Analysis: JournalInput, AnalysisResults, SuggestionsList
  - History: HistoryFilters, HistoryStats
  - Dashboard: DashboardSummary, QuickAnalysis, RecentEntries
- **Shared**:
  - Atoms: Button, Input, Card, Badge, Icon
  - Molecules: MetricCard, AnimatedCard, GlowButton
  - Organisms: ErrorBoundary, LoadingSpinner

**Services**:
- None (consumes services from Units 1 & 2 via hooks)

**Hooks**:
- Uses useAnalysis (from Unit 1)
- Uses useStorage, useHistory, useExport (from Unit 2)

**Key Methods**:
- Component render methods
- Event handlers (onClick, onChange, onSubmit)
- State management (useState, useContext)
- Lifecycle methods (useEffect)

**Data Models**:
- Uses types from Units 1 & 2

**Testing Strategy**:
- ⏭️ **Unit tests**: Skipped for UI components (per approved strategy)
- ⏭️ **Integration tests**: Handled in Build and Test stage
- **Manual testing**: Visual testing, responsive design, browser compatibility

**Dependencies**:
- Unit 1 (uses useAnalysis hook, AnalysisResult type)
- Unit 2 (uses useStorage, useHistory, useExport hooks, data types)
- Unit 4 (renders ProductivityMeter, MoodHistoryChart)

**Exports**:
- All React components
- Context providers (AnalysisContext, StorageContext)

---

### Unit 4: Visualization

**Purpose**: Provide data visualization components (charts, meters, graphs)

**Scope**: All visualization-specific components using Recharts and custom visualizations

**Responsibilities**:
- Render mood history chart (multi-metric line chart)
- Render productivity meter (animated gauge)
- Handle chart interactions (tooltips, hover, zoom)
- Apply visualization-specific animations
- Format data for visual display
- Provide responsive chart sizing

**Components**:
- MoodHistoryChart (Recharts line chart)
- ProductivityMeter (animated gauge/meter)

**Services**:
- None (consumes DataTransformationService from Unit 2 via parent components)

**Hooks**:
- None (receives data via props from parent components)

**Key Methods**:
- `prepareChartData(data: HistoryDataPoint[]): ChartDataPoint[]`
- `renderTooltip(data: ChartDataPoint): ReactElement`
- `calculateMeterFill(score: number): number`
- `getMeterColor(score: number): string`
- `animateMeter(targetScore: number): void`

**Data Models**:
- ChartDataPoint
- Uses HistoryDataPoint from Unit 2

**Testing Strategy**:
- ⏭️ **Unit tests**: Skipped for visualization components (per approved strategy)
- ⏭️ **Integration tests**: Handled in Build and Test stage
- **Manual testing**: Visual testing, chart rendering, animation performance

**Dependencies**:
- Unit 2 (uses HistoryDataPoint type, data transformation)
- Recharts library

**Exports**:
- MoodHistoryChart component
- ProductivityMeter component

---

## Code Organization

### Deployment Model
**Progressive Loading**: Core units loaded first, visualization and non-critical features lazy-loaded

**Implementation**:
- Core bundle: Sentiment Engine + Data Management + Essential UI
- Lazy-loaded: HistoryPage (with Visualization unit)
- Code splitting via React.lazy and dynamic imports

### Directory Structure
**Feature-Based Organization**:

```
src/
├── features/
│   ├── analysis/                    # Unit 3 (Analysis feature)
│   │   ├── components/
│   │   │   ├── JournalInput.jsx
│   │   │   ├── AnalysisResults.jsx
│   │   │   └── SuggestionsList.jsx
│   │   └── index.js
│   ├── history/                     # Unit 3 (History feature)
│   │   ├── components/
│   │   │   ├── HistoryFilters.jsx
│   │   │   └── HistoryStats.jsx
│   │   └── index.js
│   ├── dashboard/                   # Unit 3 (Dashboard feature)
│   │   ├── components/
│   │   │   ├── DashboardSummary.jsx
│   │   │   ├── QuickAnalysis.jsx
│   │   │   └── RecentEntries.jsx
│   │   └── index.js
│   └── visualization/               # Unit 4
│       ├── MoodHistoryChart.jsx
│       ├── ProductivityMeter.jsx
│       └── index.js
├── shared/                          # Unit 3 (Shared components)
│   ├── components/
│   │   ├── atoms/
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Badge.jsx
│   │   │   └── Icon.jsx
│   │   ├── molecules/
│   │   │   ├── MetricCard.jsx
│   │   │   ├── AnimatedCard.jsx
│   │   │   └── GlowButton.jsx
│   │   └── organisms/
│   │       ├── ErrorBoundary.jsx
│   │       └── LoadingSpinner.jsx
│   ├── layout/                      # Unit 3 (Layout)
│   │   ├── AppLayout.jsx
│   │   ├── Header.jsx
│   │   └── Navigation.jsx
│   ├── pages/                       # Unit 3 (Pages)
│   │   ├── HomePage.jsx
│   │   ├── AnalysisPage.jsx
│   │   └── HistoryPage.jsx
│   └── contexts/                    # Unit 3 (Global state)
│       ├── AnalysisContext.js
│       └── StorageContext.js
├── services/                        # Unit 1 & Unit 2
│   ├── sentiment/                   # Unit 1
│   │   ├── SentimentAnalysisService.js
│   │   ├── KeywordDetectionModule.js
│   │   ├── ScoringModule.js
│   │   └── SuggestionGenerationModule.js
│   ├── storage/                     # Unit 2
│   │   ├── StorageService.js
│   │   ├── DataTransformationService.js
│   │   └── ExportService.js
│   └── index.js
├── hooks/                           # Unit 1 & Unit 2
│   ├── useAnalysis.js               # Unit 1
│   ├── useStorage.js                # Unit 2
│   ├── useHistory.js                # Unit 2
│   └── useExport.js                 # Unit 2
├── config/                          # Shared across units
│   ├── animations.js
│   ├── keywords.js                  # Unit 1 config
│   └── constants.js
├── utils/                           # Shared across units
│   ├── validation.js
│   └── formatting.js
├── types/                           # Shared type definitions
│   ├── analysis.types.js            # Unit 1 types
│   ├── storage.types.js             # Unit 2 types
│   └── common.types.js
├── App.jsx                          # Unit 3
└── main.jsx                         # Entry point
```

### Module Boundary Rules

**Moderate Enforcement**: Units can import from each other with documented dependencies

**Import Rules**:
1. **Unit 1 (Sentiment Engine)**: Standalone, no imports from other units
2. **Unit 2 (Data Management)**: Can import types from Unit 1
3. **Unit 3 (UI Components)**: Can import hooks from Units 1 & 2, components from Unit 4
4. **Unit 4 (Visualization)**: Can import types from Unit 2

**Shared Code**:
- `config/`, `utils/`, `types/` directories contain shared code
- All units can import from shared directories
- Shared code locations documented in each unit

**Documentation**: Import dependencies documented in unit-of-work-dependency.md

---

## Unit Summary

| Unit | Components | Services | Hooks | Testing | Dependencies |
|------|-----------|----------|-------|---------|--------------|
| **1. Sentiment Engine** | 0 | 1 | 1 | ✅ Full | None |
| **2. Data Management** | 0 | 3 | 3 | ✅ Full | Unit 1 (types) |
| **3. UI Components** | 24 | 0 | 0 | ⏭️ Skip | Units 1, 2, 4 |
| **4. Visualization** | 2 | 0 | 0 | ⏭️ Skip | Unit 2 (types) |
| **Total** | **26** | **4** | **4** | **2 units** | - |

---

## Development Workflow

### Phase 1: Core Services (Units 1 & 2)
**Duration**: ~8-10 interactions

**Order**:
1. Unit 1: Sentiment Analysis Engine
   - Functional Design
   - NFR Requirements
   - NFR Design
   - Code Generation (with tests)
2. Unit 2: Data Management
   - Functional Design
   - NFR Requirements
   - NFR Design
   - Code Generation (with tests)

**Milestone**: Core services complete and tested

---

### Phase 2: Presentation Layer (Units 3 & 4)
**Duration**: ~6-8 interactions

**Order**:
1. Unit 3: UI Components & Layout
   - Functional Design
   - NFR Requirements
   - NFR Design
   - Code Generation (no per-unit tests)
2. Unit 4: Visualization
   - Functional Design
   - NFR Requirements
   - NFR Design
   - Code Generation (no per-unit tests)

**Milestone**: Full application UI complete

---

### Phase 3: Integration & Testing
**Duration**: ~2 interactions

**Activities**:
- Build and Test stage
- Integration testing across all units
- End-to-end testing
- Browser compatibility testing
- Performance testing
- Deployment preparation

**Milestone**: Application ready for deployment

---

## Success Criteria

**Per Unit**:
- ✅ All components/services implemented
- ✅ Unit tests passing (Units 1 & 2 only)
- ✅ Code follows design specifications
- ✅ Dependencies properly documented

**Overall**:
- ✅ All 4 units complete
- ✅ Integration tests passing
- ✅ No circular dependencies
- ✅ Progressive loading working
- ✅ Application deployable

---

## Next Steps

This unit decomposition will guide the CONSTRUCTION phase, where each unit will go through:
1. Functional Design (detailed business logic)
2. NFR Requirements (performance, security, quality attributes)
3. NFR Design (implementation patterns for NFRs)
4. Infrastructure Design (skipped - no infrastructure for frontend app)
5. Code Generation (implementation)

After all units are complete, the Build and Test stage will integrate and verify the complete application.

---

**Status**: ✅ Complete and Ready for CONSTRUCTION Phase
