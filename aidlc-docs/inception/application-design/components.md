# Component Catalog - MindMirror AI

**Project**: MindMirror AI  
**Phase**: INCEPTION - Application Design  
**Date**: 2026-05-06

---

## Component Organization Strategy

**Approach**: Hybrid (Feature-based + Atomic Design)

- **Feature-based**: Components grouped by functional domain (Analysis, History, Dashboard)
- **Atomic Design**: Reusable UI primitives organized by complexity level
- **Benefits**: Clear feature boundaries with reusable design system

---

## Component Hierarchy

```
App (Root)
├── Layout Components
│   ├── AppLayout
│   ├── Header
│   └── Navigation
├── Page Components
│   ├── HomePage
│   ├── AnalysisPage
│   └── HistoryPage
├── Feature Components
│   ├── Analysis Feature
│   │   ├── JournalInput
│   │   ├── AnalysisResults
│   │   ├── ProductivityMeter
│   │   └── SuggestionsList
│   ├── History Feature
│   │   ├── MoodHistoryChart
│   │   ├── HistoryFilters
│   │   └── HistoryStats
│   └── Dashboard Feature
│       ├── DashboardSummary
│       ├── QuickAnalysis
│       └── RecentEntries
└── Shared Components (Atomic)
    ├── Atoms
    │   ├── Button
    │   ├── Input
    │   ├── Card
    │   ├── Badge
    │   └── Icon
    ├── Molecules
    │   ├── MetricCard
    │   ├── AnimatedCard
    │   └── GlowButton
    └── Organisms
        ├── ErrorBoundary
        └── LoadingSpinner
```

---

## Component Definitions

### 1. Layout Components

#### 1.1 AppLayout
**Purpose**: Main application layout wrapper with routing and global state

**Responsibilities**:
- Render React Router routes with lazy loading
- Provide global Context providers (AnalysisContext, StorageContext)
- Handle top-level error boundaries
- Manage application-wide theme and styling

**Type**: Container Component

**State**: Global application state (current route, theme preferences)

---

#### 1.2 Header
**Purpose**: Application header with branding and navigation

**Responsibilities**:
- Display MindMirror AI branding with futuristic styling
- Show navigation links (Home, Analysis, History)
- Provide visual feedback for active route
- Responsive mobile menu toggle

**Type**: Presentational Component

**Props**: `currentRoute: string`

---

#### 1.3 Navigation
**Purpose**: Navigation menu for page switching

**Responsibilities**:
- Render navigation links with React Router
- Highlight active page
- Animate transitions between pages
- Collapse to hamburger menu on mobile

**Type**: Presentational Component

**Props**: `isOpen: boolean, onToggle: () => void`

---

### 2. Page Components

#### 2.1 HomePage
**Purpose**: Landing page with dashboard overview

**Responsibilities**:
- Display welcome message and app introduction
- Show summary of latest emotional state
- Provide quick access to start new journal entry
- Display recent analysis highlights
- Render call-to-action buttons with glow effects

**Type**: Container Component

**State**: Latest analysis summary, loading state

---

#### 2.2 AnalysisPage
**Purpose**: Main analysis page for journal input and results

**Responsibilities**:
- Render journal input component
- Trigger sentiment analysis on user submission
- Display analysis results with animated transitions
- Show productivity meter and suggestions
- Handle analysis errors gracefully

**Type**: Container Component

**State**: Current journal text, analysis results, loading state, error state

---

#### 2.3 HistoryPage
**Purpose**: Historical mood tracking and visualization page

**Responsibilities**:
- Display 30-day mood history chart
- Show historical statistics and trends
- Provide date range filters
- Enable data export functionality
- Handle empty state (no history yet)

**Type**: Container Component

**State**: History data, filter settings, loading state

---

### 3. Feature Components - Analysis

#### 3.1 JournalInput
**Purpose**: Large text input area for user journal entries

**Responsibilities**:
- Render textarea with character/word count
- Show soft limit warning when approaching threshold
- Provide submit button with loading state
- Display input validation errors
- Auto-resize textarea based on content
- Apply futuristic styling with glassmorphism

**Type**: Controlled Component

**Props**: 
- `value: string`
- `onChange: (text: string) => void`
- `onSubmit: () => void`
- `isLoading: boolean`
- `characterLimit: number`

---

#### 3.2 AnalysisResults
**Purpose**: Display comprehensive analysis results

**Responsibilities**:
- Render all detected metrics (mood, stress, motivation, confidence, productivity, focus)
- Show metrics with visual indicators (progress bars, badges, colors)
- Animate metric appearance with Framer Motion
- Display results in categorized sections (emotional, productivity)
- Handle partial results gracefully

**Type**: Presentational Component

**Props**: 
- `results: AnalysisResult`
- `isLoading: boolean`

---

#### 3.3 ProductivityMeter
**Purpose**: Animated gauge/meter for productivity visualization

**Responsibilities**:
- Render circular or linear productivity meter
- Animate meter fill based on productivity score
- Color-code meter (red/yellow/green based on score)
- Display percentage or categorical label
- Smooth animation transitions

**Type**: Presentational Component

**Props**: 
- `score: number` (0-100)
- `label: string`

---

#### 3.4 SuggestionsList
**Purpose**: Display AI-generated self-improvement suggestions

**Responsibilities**:
- Render list of suggestions with icons
- Animate suggestion appearance (stagger effect)
- Apply card styling with glassmorphism
- Handle empty suggestions gracefully
- Make suggestions dismissible (optional)

**Type**: Presentational Component

**Props**: 
- `suggestions: string[]`

---

### 4. Feature Components - History

#### 4.1 MoodHistoryChart
**Purpose**: Interactive chart showing mood trends over time

**Responsibilities**:
- Render multi-metric line chart using Recharts
- Display all metrics (mood, stress, motivation, productivity, focus) in one chart
- Show 30-day time series data
- Provide interactive tooltips with detailed data points
- Include legend for metric identification
- Handle responsive sizing
- Show empty state if no data

**Type**: Presentational Component

**Props**: 
- `data: HistoryDataPoint[]`
- `metrics: string[]`

---

#### 4.2 HistoryFilters
**Purpose**: Filter controls for history data

**Responsibilities**:
- Provide date range selector
- Offer metric selection (show/hide specific metrics)
- Include preset filters (last 7 days, 14 days, 30 days)
- Apply filters with smooth transitions

**Type**: Controlled Component

**Props**: 
- `dateRange: { start: Date, end: Date }`
- `selectedMetrics: string[]`
- `onFilterChange: (filters: FilterOptions) => void`

---

#### 4.3 HistoryStats
**Purpose**: Statistical summary of historical data

**Responsibilities**:
- Calculate and display average metrics
- Show trends (improving, declining, stable)
- Highlight highest/lowest points
- Display total entries count
- Render stats in animated cards

**Type**: Presentational Component

**Props**: 
- `stats: HistoryStatistics`

---

### 5. Feature Components - Dashboard

#### 5.1 DashboardSummary
**Purpose**: Overview summary cards on home page

**Responsibilities**:
- Display latest emotional state summary
- Show key metrics at a glance
- Render animated summary cards
- Provide quick insights
- Link to detailed analysis page

**Type**: Presentational Component

**Props**: 
- `latestAnalysis: AnalysisResult | null`

---

#### 5.2 QuickAnalysis
**Purpose**: Simplified journal input on home page

**Responsibilities**:
- Render compact journal input
- Trigger quick analysis
- Show condensed results
- Redirect to full analysis page for details

**Type**: Container Component

**State**: Quick journal text, quick analysis results

---

#### 5.3 RecentEntries
**Purpose**: List of recent journal entries

**Responsibilities**:
- Display last 5-10 journal entries
- Show entry date and mood summary
- Enable click to view full analysis
- Animate entry list with stagger effect

**Type**: Presentational Component

**Props**: 
- `entries: JournalEntry[]`
- `onEntryClick: (entryId: string) => void`

---

### 6. Shared Components - Atoms

#### 6.1 Button
**Purpose**: Reusable button component with variants

**Responsibilities**:
- Render button with consistent styling
- Support variants (primary, secondary, ghost)
- Apply glow effects on hover
- Handle loading state with spinner
- Support disabled state

**Type**: Presentational Component

**Props**: 
- `variant: 'primary' | 'secondary' | 'ghost'`
- `onClick: () => void`
- `isLoading: boolean`
- `disabled: boolean`
- `children: ReactNode`

---

#### 6.2 Input
**Purpose**: Reusable text input component

**Responsibilities**:
- Render input with futuristic styling
- Support different input types
- Show validation errors
- Apply focus glow effects
- Handle disabled state

**Type**: Controlled Component

**Props**: 
- `type: string`
- `value: string`
- `onChange: (value: string) => void`
- `placeholder: string`
- `error: string | null`

---

#### 6.3 Card
**Purpose**: Reusable card container with glassmorphism

**Responsibilities**:
- Render card with backdrop blur and transparency
- Support hover animations (float, glow)
- Apply consistent padding and spacing
- Support different sizes

**Type**: Presentational Component

**Props**: 
- `children: ReactNode`
- `size: 'small' | 'medium' | 'large'`
- `animated: boolean`

---

#### 6.4 Badge
**Purpose**: Small label for status or categories

**Responsibilities**:
- Render badge with color coding
- Support different variants (success, warning, error, info)
- Apply neon glow effects
- Compact size for inline use

**Type**: Presentational Component

**Props**: 
- `variant: 'success' | 'warning' | 'error' | 'info'`
- `children: ReactNode`

---

#### 6.5 Icon
**Purpose**: Icon wrapper component

**Responsibilities**:
- Render icons consistently
- Support different sizes
- Apply color theming
- Handle icon library integration

**Type**: Presentational Component

**Props**: 
- `name: string`
- `size: number`
- `color: string`

---

### 7. Shared Components - Molecules

#### 7.1 MetricCard
**Purpose**: Card displaying a single metric with visualization

**Responsibilities**:
- Render metric name and value
- Show visual indicator (progress bar, icon, color)
- Apply animated entrance
- Support different metric types

**Type**: Presentational Component

**Props**: 
- `metricName: string`
- `value: number | string`
- `icon: string`
- `color: string`

---

#### 7.2 AnimatedCard
**Purpose**: Card with advanced animations

**Responsibilities**:
- Extend base Card component
- Add floating animation
- Apply hover scale effect
- Include entrance animations

**Type**: Presentational Component

**Props**: 
- `children: ReactNode`
- `animationVariant: string`

---

#### 7.3 GlowButton
**Purpose**: Button with enhanced glow effects

**Responsibilities**:
- Extend base Button component
- Add pulsing glow animation
- Apply neon border effects
- Enhanced hover animations

**Type**: Presentational Component

**Props**: 
- `glowColor: string`
- `onClick: () => void`
- `children: ReactNode`

---

### 8. Shared Components - Organisms

#### 8.1 ErrorBoundary
**Purpose**: React error boundary for graceful error handling

**Responsibilities**:
- Catch React component errors
- Display user-friendly error message
- Provide retry mechanism
- Log errors for debugging
- Prevent full app crashes

**Type**: Error Boundary Component

**Props**: 
- `children: ReactNode`
- `fallback: ReactNode`

---

#### 8.2 LoadingSpinner
**Purpose**: Loading indicator with futuristic animation

**Responsibilities**:
- Display animated loading spinner
- Support different sizes
- Apply neon glow effects
- Show optional loading message

**Type**: Presentational Component

**Props**: 
- `size: 'small' | 'medium' | 'large'`
- `message: string | null`

---

## Component Count Summary

- **Layout Components**: 3
- **Page Components**: 3
- **Feature Components**: 11 (Analysis: 4, History: 3, Dashboard: 3, Shared: 1)
- **Shared Components**: 10 (Atoms: 5, Molecules: 3, Organisms: 2)

**Total Components**: 27

---

## Component Reusability Strategy

**Highly Reusable** (used in 3+ places):
- Button, Card, Badge, Icon, LoadingSpinner

**Moderately Reusable** (used in 2 places):
- MetricCard, AnimatedCard, Input

**Feature-Specific** (used in 1 place):
- JournalInput, AnalysisResults, ProductivityMeter, MoodHistoryChart

---

## Next Steps

Detailed component methods and interfaces will be defined in `component-methods.md`.
