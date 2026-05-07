# Unit of Work Story Mapping - MindMirror AI

**Project**: MindMirror AI  
**Phase**: INCEPTION - Units Generation  
**Date**: 2026-05-06  
**Status**: Complete (Stories Skipped)

---

## Story Mapping Status

**User Stories Stage**: ⏭️ **SKIPPED**

**Rationale**: User Stories stage was skipped during INCEPTION phase because:
- Single-user application with straightforward user interactions
- Requirements document already provides clear feature descriptions and acceptance criteria
- Simple user journey (input → analyze → view results → view history) doesn't require persona-based story mapping
- Well-defined requirements eliminate need for story-based clarification

---

## Alternative Mapping: Requirements to Units

Since user stories were not created, this document maps **functional requirements** directly to units of work.

---

## Requirements-to-Unit Mapping

### Unit 1: Sentiment Analysis Engine

**Mapped Requirements**:

#### FR-2: AI-Powered Sentiment Analysis Engine
- **FR-2.1**: Weighted keyword analysis with contextual understanding
  - Detect negations (e.g., "not happy" vs "happy")
  - Recognize intensity modifiers (e.g., "very stressed", "slightly worried")
  - Handle compound emotions in single text
- **FR-2.2**: Analyze and detect metrics:
  - Mood: Emotional state classification
  - Stress Level: Percentage score (0-100%)
  - Motivation: Percentage score (0-100%)
  - Confidence: Percentage score (0-100%)
  - Productivity Score: Categorical rating (Low/Medium/High)
  - Focus Level: Categorical rating (Poor/Improving/Good/Excellent)
- **FR-2.3**: Lightweight implementation using keyword-based pattern matching
- **FR-2.4**: Fast analysis response time (< 500ms)

#### FR-3: AI Suggestions Generator
- **FR-3.1**: Generate intelligent, personalized self-improvement tips
- **FR-3.2**: Dynamic suggestion logic combining multiple factors (stress + motivation + focus)
- **FR-3.3**: Suggestion categories (stress management, productivity, focus, motivation, work-life balance)
- **FR-3.4**: Display 3-5 relevant suggestions per analysis

#### Sentiment-6: Sentiment Analysis Logic Requirements
- **Sentiment-1**: Stress Indicators (high/low stress keywords)
- **Sentiment-2**: Motivation Indicators (high/low motivation keywords)
- **Sentiment-3**: Productivity Indicators (high/low productivity keywords)
- **Sentiment-4**: Mood Indicators (positive/negative/neutral mood keywords)
- **Sentiment-5**: Focus Indicators (high/low focus keywords)
- **Rule-1**: Negation Handling
- **Rule-2**: Intensity Modifiers
- **Rule-3**: Scoring Algorithm

**Coverage**: ✅ Complete

---

### Unit 2: Data Management

**Mapped Requirements**:

#### FR-6: Data Persistence
- **FR-6.1**: Store analysis results in browser local storage
- **FR-6.2**: Storage structure includes:
  - Analysis results (mood, scores, suggestions)
  - Original user text entries
  - Timestamps for each entry
  - Metadata (entry ID, version, analysis duration)
- **FR-6.3**: Maintain 30 days of history (auto-cleanup older entries)
- **FR-6.4**: Data export functionality (JSON format only)
- **FR-6.5**: No import functionality required

#### NFR-2: Scalability
- **NFR-2.1**: Handle local storage up to 10MB (approximately 30 days of detailed entries)
- **NFR-2.2**: Efficient data retrieval and rendering for 30-day history charts

#### NFR-8: Data Integrity
- **NFR-8.1**: Validate all data before storing in local storage
- **NFR-8.2**: Handle local storage quota exceeded scenarios
- **NFR-8.3**: Prevent data corruption with proper serialization/deserialization

#### Data-1, Data-2, Data-3: Data Models
- Journal Entry model
- Analysis Result model
- Local Storage Structure

**Coverage**: ✅ Complete

---

### Unit 3: UI Components & Layout

**Mapped Requirements**:

#### FR-1: Journal Input System
- **FR-1.1**: Large, prominent text input area
- **FR-1.2**: Soft character limit with warning notification
- **FR-1.3**: Real-time character/word count display
- **FR-1.4**: Input validation and sanitization

#### FR-4: Animated Productivity Meter
- **FR-4.1**: Visual meter/gauge displaying current productivity score
- **FR-4.2**: Smooth animations when values update
- **FR-4.3**: Color-coded visualization (red/yellow/green)
- **FR-4.4**: Interactive hover effects

#### FR-7: Home Dashboard
- **FR-7.1**: Landing page with overview of current emotional state
- **FR-7.2**: Quick access to journal input
- **FR-7.3**: Summary cards showing latest analysis results
- **FR-7.4**: Call-to-action to start new journal entry

#### FR-8: Analysis Page
- **FR-8.1**: Display detailed analysis results after user submits journal entry
- **FR-8.2**: Show all detected metrics with visual indicators
- **FR-8.3**: Display AI-generated suggestions prominently
- **FR-8.4**: Show animated productivity meter
- **FR-8.5**: Option to save analysis or start new entry

#### FR-9: Mood History Section
- **FR-9.1**: Dedicated page/section for historical data visualization
- **FR-9.2**: Display mood history chart
- **FR-9.3**: Show statistics and trends over time
- **FR-9.4**: Filter options by date range
- **FR-9.5**: Export history data functionality

#### Design-1 through Design-4: Visual Design Requirements
- Futuristic AI dashboard aesthetic
- Dark theme with glassmorphism
- Neon glow effects
- Typography and interactive elements
- Layout and spacing

#### NFR-3: User Experience
- **NFR-3.1**: Intuitive, self-explanatory interface
- **NFR-3.2**: Clear visual feedback for all user actions
- **NFR-3.3**: Consistent design language across all pages
- **NFR-3.4**: Smooth transitions between pages and states

#### NFR-4: Accessibility
- **NFR-4.1**: Basic accessibility compliance (semantic HTML, keyboard navigation, color contrast, focus indicators, alt text)
- **NFR-4.2**: Screen reader friendly structure

#### NFR-6: Device Support
- **NFR-6.1**: Fully responsive design (Mobile: 320px-768px, Tablet: 768px-1024px, Desktop: 1024px+)
- **NFR-6.2**: Touch-friendly interface for mobile and tablet
- **NFR-6.3**: Optimized animations for mobile (reduced complexity)

**Coverage**: ✅ Complete

---

### Unit 4: Visualization

**Mapped Requirements**:

#### FR-5: Mood History Chart
- **FR-5.1**: Visualize all metrics (mood, stress, motivation, productivity, focus) in one comprehensive chart
- **FR-5.2**: Display last 30 days of mood history
- **FR-5.3**: Interactive chart with tooltips showing detailed data points
- **FR-5.4**: Time-series line chart using Recharts library
- **FR-5.5**: Legend to distinguish between different metrics
- **FR-5.6**: Zoom and pan capabilities for detailed analysis

#### FR-4: Animated Productivity Meter (shared with Unit 3)
- **FR-4.1**: Visual meter/gauge displaying current productivity score
- **FR-4.2**: Smooth animations when values update
- **FR-4.3**: Color-coded visualization
- **FR-4.4**: Interactive hover effects

#### NFR-1: Response Time
- **NFR-1.3**: Smooth animations at 60fps on desktop devices
- **NFR-1.4**: Reduced animation complexity on mobile devices for performance

**Coverage**: ✅ Complete

---

## Coverage Analysis

### Requirements Coverage by Unit

| Unit | Requirements Covered | Percentage |
|------|---------------------|------------|
| **Unit 1: Sentiment Engine** | FR-2, FR-3, Sentiment-1 to 5, Rule-1 to 3 | ~20% |
| **Unit 2: Data Management** | FR-6, NFR-2, NFR-8, Data-1 to 3 | ~15% |
| **Unit 3: UI Components** | FR-1, FR-7, FR-8, FR-9, Design-1 to 4, NFR-3, NFR-4, NFR-6 | ~50% |
| **Unit 4: Visualization** | FR-5, FR-4 (shared), NFR-1 (animations) | ~15% |

**Total Coverage**: ✅ 100% of functional requirements mapped to units

---

## Cross-Unit Requirements

Some requirements span multiple units and require coordination:

### FR-8: Analysis Page (Cross-Unit)
**Involved Units**:
- **Unit 1**: Performs sentiment analysis
- **Unit 2**: Saves analysis results
- **Unit 3**: Renders page, input, and results display
- **Unit 4**: Renders productivity meter

**Integration**: Unit 3 orchestrates the flow, calling Unit 1 for analysis, Unit 2 for storage, and Unit 4 for visualization

---

### FR-9: Mood History Section (Cross-Unit)
**Involved Units**:
- **Unit 2**: Loads historical data, transforms for charts, handles export
- **Unit 3**: Renders page, filters, and statistics
- **Unit 4**: Renders mood history chart

**Integration**: Unit 3 loads data via Unit 2, passes to Unit 4 for visualization

---

### NFR-1: Performance (Cross-Unit)
**Involved Units**:
- **Unit 1**: Analysis < 500ms
- **Unit 2**: Storage operations < 100ms
- **Unit 3**: Page load < 2s
- **Unit 4**: Chart rendering < 200ms, animations 60fps

**Integration**: Each unit responsible for its own performance targets

---

## Feature-to-Unit Mapping

### Feature: Journal Analysis
**User Flow**: User enters journal text → AI analyzes → Results displayed

**Units Involved**:
1. **Unit 3**: JournalInput component (text entry)
2. **Unit 1**: SentimentAnalysisService (analysis)
3. **Unit 2**: StorageService (save result)
4. **Unit 3**: AnalysisResults component (display metrics)
5. **Unit 4**: ProductivityMeter component (display meter)
6. **Unit 3**: SuggestionsList component (display suggestions)

**Primary Unit**: Unit 3 (orchestrates flow)

---

### Feature: Mood History Tracking
**User Flow**: User views history → Filters data → Exports data

**Units Involved**:
1. **Unit 2**: StorageService + DataTransformationService (load and transform data)
2. **Unit 3**: HistoryPage, HistoryFilters, HistoryStats (UI and controls)
3. **Unit 4**: MoodHistoryChart (visualization)
4. **Unit 2**: ExportService (export functionality)

**Primary Unit**: Unit 3 (orchestrates flow)

---

### Feature: Dashboard Overview
**User Flow**: User lands on home page → Views summary → Starts quick analysis

**Units Involved**:
1. **Unit 2**: StorageService (load latest analysis)
2. **Unit 3**: HomePage, DashboardSummary, QuickAnalysis, RecentEntries (UI)
3. **Unit 1**: SentimentAnalysisService (quick analysis)

**Primary Unit**: Unit 3 (orchestrates flow)

---

## Acceptance Criteria Mapping

Since user stories were skipped, acceptance criteria are derived from requirements:

### Unit 1: Sentiment Analysis Engine

**Acceptance Criteria**:
- ✅ Analyzes text in < 500ms for entries up to 5000 characters
- ✅ Detects all 6 metrics (mood, stress, motivation, confidence, productivity, focus)
- ✅ Handles negations correctly ("not happy" → negative sentiment)
- ✅ Applies intensity modifiers ("very stressed" → higher stress score)
- ✅ Generates 3-5 relevant suggestions based on analysis
- ✅ Returns structured AnalysisResult object

---

### Unit 2: Data Management

**Acceptance Criteria**:
- ✅ Stores journal entries with complete metadata
- ✅ Stores analysis results with timestamps
- ✅ Retrieves 30-day history efficiently
- ✅ Auto-cleans data older than 30 days
- ✅ Handles storage quota exceeded gracefully
- ✅ Exports history to JSON format
- ✅ Validates data before storage

---

### Unit 3: UI Components & Layout

**Acceptance Criteria**:
- ✅ Renders responsive layout on mobile, tablet, desktop
- ✅ Displays journal input with character count
- ✅ Shows soft limit warning when approaching threshold
- ✅ Displays all analysis metrics with visual indicators
- ✅ Renders futuristic UI with glassmorphism and neon effects
- ✅ Provides smooth page transitions
- ✅ Supports keyboard navigation
- ✅ Handles errors gracefully with user-friendly messages

---

### Unit 4: Visualization

**Acceptance Criteria**:
- ✅ Renders multi-metric line chart with 30-day data
- ✅ Displays interactive tooltips on hover
- ✅ Shows legend for metric identification
- ✅ Animates productivity meter smoothly
- ✅ Color-codes meter based on score (red/yellow/green)
- ✅ Renders at 60fps on desktop
- ✅ Reduces animation complexity on mobile

---

## Development Priorities

### High Priority (Must Have)
- **Unit 1**: Core sentiment analysis logic
- **Unit 2**: Data persistence and retrieval
- **Unit 3**: Essential UI (journal input, analysis display, basic layout)

### Medium Priority (Should Have)
- **Unit 3**: Advanced UI (dashboard, history page, filters)
- **Unit 4**: Visualization components

### Low Priority (Nice to Have)
- **Unit 3**: Advanced animations and micro-interactions
- **Unit 2**: Export functionality
- **Unit 4**: Advanced chart interactions (zoom, pan)

---

## Testing Priorities

### Critical (Must Test)
- **Unit 1**: Sentiment analysis accuracy, scoring algorithms
- **Unit 2**: Data persistence, retrieval, cleanup logic

### Important (Should Test)
- **Integration**: Analysis → Storage → Display flow
- **Integration**: History loading → Chart rendering

### Optional (Can Skip)
- **Unit 3**: Individual UI component tests (manual testing sufficient)
- **Unit 4**: Visualization component tests (manual testing sufficient)

---

## Summary

**Mapping Approach**: Requirements → Units (since stories were skipped)

**Coverage**: ✅ 100% of functional requirements mapped to units

**Cross-Unit Features**: 3 major features spanning multiple units

**Acceptance Criteria**: Derived from requirements document

**Development Priorities**: Core services first, then UI, then enhancements

**Testing Priorities**: Critical units (1 & 2) get full test coverage, UI units rely on integration and manual testing

---

**Status**: ✅ Requirements Mapped to Units - Ready for CONSTRUCTION Phase

**Note**: If user stories are added in the future, this document can be updated to include story-to-unit mappings.
