# Component Methods - MindMirror AI

**Project**: MindMirror AI  
**Phase**: INCEPTION - Application Design  
**Date**: 2026-05-06

**Note**: This document defines method signatures and high-level purposes. Detailed business rules and algorithms will be specified in Functional Design (CONSTRUCTION phase).

---

## 1. Layout Components

### 1.1 AppLayout

#### Methods

**`initializeApp()`**
- **Purpose**: Initialize application on mount
- **Returns**: `void`
- **Description**: Set up global contexts, load persisted data, initialize routing

**`handleRouteChange(route: string)`**
- **Purpose**: Handle navigation between pages
- **Parameters**: `route` - Target route path
- **Returns**: `void`
- **Description**: Update current route state, trigger page transitions

---

### 1.2 Header

#### Methods

**`renderBranding()`**
- **Purpose**: Render application logo and title
- **Returns**: `ReactElement`
- **Description**: Display MindMirror AI branding with futuristic styling

**`renderNavigation()`**
- **Purpose**: Render navigation menu
- **Returns**: `ReactElement`
- **Description**: Display navigation links with active state highlighting

---

### 1.3 Navigation

#### Methods

**`handleLinkClick(route: string)`**
- **Purpose**: Handle navigation link clicks
- **Parameters**: `route` - Target route
- **Returns**: `void`
- **Description**: Navigate to route with animation

**`toggleMobileMenu()`**
- **Purpose**: Toggle mobile menu open/closed
- **Returns**: `void`
- **Description**: Update mobile menu state

---

## 2. Page Components

### 2.1 HomePage

#### Methods

**`loadLatestAnalysis()`**
- **Purpose**: Load most recent analysis from storage
- **Returns**: `Promise<AnalysisResult | null>`
- **Description**: Retrieve and display latest emotional state summary

**`handleStartNewEntry()`**
- **Purpose**: Navigate to analysis page for new entry
- **Returns**: `void`
- **Description**: Redirect user to analysis page

---

### 2.2 AnalysisPage

#### Methods

**`handleJournalSubmit(text: string)`**
- **Purpose**: Process journal entry submission
- **Parameters**: `text` - User's journal entry text
- **Returns**: `Promise<void>`
- **Description**: Trigger sentiment analysis, update state with results

**`analyzeText(text: string)`**
- **Purpose**: Perform sentiment analysis on text
- **Parameters**: `text` - Journal entry text
- **Returns**: `Promise<AnalysisResult>`
- **Description**: Call sentiment analysis service, return results

**`saveAnalysis(result: AnalysisResult)`**
- **Purpose**: Persist analysis result to storage
- **Parameters**: `result` - Analysis result object
- **Returns**: `Promise<void>`
- **Description**: Save result to local storage with timestamp

**`handleAnalysisError(error: Error)`**
- **Purpose**: Handle analysis errors gracefully
- **Parameters**: `error` - Error object
- **Returns**: `void`
- **Description**: Display user-friendly error message, enable retry

---

### 2.3 HistoryPage

#### Methods

**`loadHistoryData()`**
- **Purpose**: Load historical analysis data
- **Returns**: `Promise<HistoryDataPoint[]>`
- **Description**: Retrieve 30-day history from storage

**`applyFilters(filters: FilterOptions)`**
- **Purpose**: Filter history data based on user selection
- **Parameters**: `filters` - Filter criteria (date range, metrics)
- **Returns**: `HistoryDataPoint[]`
- **Description**: Filter and return matching data points

**`calculateStatistics(data: HistoryDataPoint[])`**
- **Purpose**: Calculate statistical summary
- **Parameters**: `data` - History data points
- **Returns**: `HistoryStatistics`
- **Description**: Compute averages, trends, highs/lows

**`exportHistory()`**
- **Purpose**: Export history data to JSON
- **Returns**: `void`
- **Description**: Generate JSON file, trigger download

---

## 3. Feature Components - Analysis

### 3.1 JournalInput

#### Methods

**`handleTextChange(text: string)`**
- **Purpose**: Handle textarea input changes
- **Parameters**: `text` - Current textarea value
- **Returns**: `void`
- **Description**: Update parent state, validate input

**`calculateCharacterCount(text: string)`**
- **Purpose**: Count characters in text
- **Parameters**: `text` - Input text
- **Returns**: `number`
- **Description**: Return character count

**`calculateWordCount(text: string)`**
- **Purpose**: Count words in text
- **Parameters**: `text` - Input text
- **Returns**: `number`
- **Description**: Return word count

**`checkSoftLimit(count: number, limit: number)`**
- **Purpose**: Check if approaching character limit
- **Parameters**: `count` - Current count, `limit` - Soft limit threshold
- **Returns**: `boolean`
- **Description**: Return true if warning should be shown

**`handleSubmit()`**
- **Purpose**: Handle form submission
- **Returns**: `void`
- **Description**: Validate input, call parent onSubmit callback

---

### 3.2 AnalysisResults

#### Methods

**`renderEmotionalMetrics(results: AnalysisResult)`**
- **Purpose**: Render emotional state metrics
- **Parameters**: `results` - Analysis result object
- **Returns**: `ReactElement`
- **Description**: Display mood, stress, motivation, confidence

**`renderProductivityMetrics(results: AnalysisResult)`**
- **Purpose**: Render productivity metrics
- **Parameters**: `results` - Analysis result object
- **Returns**: `ReactElement`
- **Description**: Display productivity score and focus level

**`getMetricColor(metricName: string, value: number)`**
- **Purpose**: Determine color for metric visualization
- **Parameters**: `metricName` - Metric identifier, `value` - Metric value
- **Returns**: `string` (color code)
- **Description**: Return color based on metric type and value

---

### 3.3 ProductivityMeter

#### Methods

**`calculateMeterFill(score: number)`**
- **Purpose**: Calculate meter fill percentage
- **Parameters**: `score` - Productivity score (0-100)
- **Returns**: `number`
- **Description**: Return fill percentage for animation

**`getMeterColor(score: number)`**
- **Purpose**: Determine meter color based on score
- **Parameters**: `score` - Productivity score
- **Returns**: `string` (color code)
- **Description**: Return red/yellow/green based on score ranges

**`animateMeter(targetScore: number)`**
- **Purpose**: Animate meter to target score
- **Parameters**: `targetScore` - Target productivity score
- **Returns**: `void`
- **Description**: Trigger smooth animation to target value

---

### 3.4 SuggestionsList

#### Methods

**`renderSuggestion(suggestion: string, index: number)`**
- **Purpose**: Render individual suggestion
- **Parameters**: `suggestion` - Suggestion text, `index` - List index
- **Returns**: `ReactElement`
- **Description**: Display suggestion with icon and animation

**`getStaggerDelay(index: number)`**
- **Purpose**: Calculate stagger animation delay
- **Parameters**: `index` - Item index
- **Returns**: `number` (delay in ms)
- **Description**: Return delay for staggered entrance animation

---

## 4. Feature Components - History

### 4.1 MoodHistoryChart

#### Methods

**`prepareChartData(data: HistoryDataPoint[])`**
- **Purpose**: Transform data for Recharts
- **Parameters**: `data` - Raw history data
- **Returns**: `ChartDataPoint[]`
- **Description**: Format data for chart consumption

**`renderTooltip(data: ChartDataPoint)`**
- **Purpose**: Render custom tooltip
- **Parameters**: `data` - Data point for tooltip
- **Returns**: `ReactElement`
- **Description**: Display detailed metrics in tooltip

**`handleChartInteraction(event: ChartEvent)`**
- **Purpose**: Handle chart interactions (hover, click)
- **Parameters**: `event` - Chart interaction event
- **Returns**: `void`
- **Description**: Update UI based on user interaction

---

### 4.2 HistoryFilters

#### Methods

**`handleDateRangeChange(start: Date, end: Date)`**
- **Purpose**: Handle date range selection
- **Parameters**: `start` - Start date, `end` - End date
- **Returns**: `void`
- **Description**: Update filter state, notify parent

**`handleMetricToggle(metric: string)`**
- **Purpose**: Toggle metric visibility
- **Parameters**: `metric` - Metric identifier
- **Returns**: `void`
- **Description**: Add/remove metric from selected list

**`applyPresetFilter(preset: string)`**
- **Purpose**: Apply preset filter (7/14/30 days)
- **Parameters**: `preset` - Preset identifier
- **Returns**: `void`
- **Description**: Set date range based on preset

---

### 4.3 HistoryStats

#### Methods

**`calculateAverage(data: HistoryDataPoint[], metric: string)`**
- **Purpose**: Calculate average for metric
- **Parameters**: `data` - History data, `metric` - Metric name
- **Returns**: `number`
- **Description**: Compute average value

**`detectTrend(data: HistoryDataPoint[], metric: string)`**
- **Purpose**: Detect trend direction
- **Parameters**: `data` - History data, `metric` - Metric name
- **Returns**: `'improving' | 'declining' | 'stable'`
- **Description**: Analyze trend over time

**`findExtremes(data: HistoryDataPoint[], metric: string)`**
- **Purpose**: Find highest and lowest values
- **Parameters**: `data` - History data, `metric` - Metric name
- **Returns**: `{ high: number, low: number }`
- **Description**: Return extreme values

---

## 5. Feature Components - Dashboard

### 5.1 DashboardSummary

#### Methods

**`renderSummaryCard(metric: string, value: any)`**
- **Purpose**: Render individual summary card
- **Parameters**: `metric` - Metric name, `value` - Metric value
- **Returns**: `ReactElement`
- **Description**: Display metric in animated card

**`getInsightText(analysis: AnalysisResult)`**
- **Purpose**: Generate insight text from analysis
- **Parameters**: `analysis` - Latest analysis result
- **Returns**: `string`
- **Description**: Create human-readable insight summary

---

### 5.2 QuickAnalysis

#### Methods

**`handleQuickSubmit(text: string)`**
- **Purpose**: Process quick analysis submission
- **Parameters**: `text` - Journal text
- **Returns**: `Promise<void>`
- **Description**: Perform quick analysis, show condensed results

**`redirectToFullAnalysis()`**
- **Purpose**: Navigate to full analysis page
- **Returns**: `void`
- **Description**: Redirect with current analysis data

---

### 5.3 RecentEntries

#### Methods

**`loadRecentEntries(limit: number)`**
- **Purpose**: Load recent journal entries
- **Parameters**: `limit` - Number of entries to load
- **Returns**: `Promise<JournalEntry[]>`
- **Description**: Retrieve recent entries from storage

**`handleEntryClick(entryId: string)`**
- **Purpose**: Handle entry click
- **Parameters**: `entryId` - Entry identifier
- **Returns**: `void`
- **Description**: Navigate to entry details or analysis

---

## 6. Shared Components - Atoms

### 6.1 Button

#### Methods

**`handleClick(event: MouseEvent)`**
- **Purpose**: Handle button click
- **Parameters**: `event` - Click event
- **Returns**: `void`
- **Description**: Call onClick callback if not disabled/loading

**`renderLoadingSpinner()`**
- **Purpose**: Render loading spinner
- **Returns**: `ReactElement`
- **Description**: Display spinner when isLoading is true

---

### 6.2 Input

#### Methods

**`handleChange(event: ChangeEvent)`**
- **Purpose**: Handle input change
- **Parameters**: `event` - Change event
- **Returns**: `void`
- **Description**: Update value, call onChange callback

**`handleFocus()`**
- **Purpose**: Handle input focus
- **Returns**: `void`
- **Description**: Apply focus styling

**`handleBlur()`**
- **Purpose**: Handle input blur
- **Returns**: `void`
- **Description**: Remove focus styling, validate input

---

### 6.3 Card

#### Methods

**`applyHoverAnimation()`**
- **Purpose**: Apply hover animation
- **Returns**: `void`
- **Description**: Trigger float/glow effect on hover

**`renderContent()`**
- **Purpose**: Render card content
- **Returns**: `ReactElement`
- **Description**: Display children with proper styling

---

### 6.4 Badge

#### Methods

**`getVariantStyles(variant: string)`**
- **Purpose**: Get styles for variant
- **Parameters**: `variant` - Badge variant
- **Returns**: `CSSProperties`
- **Description**: Return color and styling for variant

---

### 6.5 Icon

#### Methods

**`renderIcon(name: string)`**
- **Purpose**: Render icon by name
- **Parameters**: `name` - Icon identifier
- **Returns**: `ReactElement`
- **Description**: Display icon from icon library

---

## 7. Shared Components - Molecules

### 7.1 MetricCard

#### Methods

**`formatMetricValue(value: number | string)`**
- **Purpose**: Format metric value for display
- **Parameters**: `value` - Raw metric value
- **Returns**: `string`
- **Description**: Format with units, decimals, etc.

**`renderProgressBar(value: number)`**
- **Purpose**: Render progress bar for metric
- **Parameters**: `value` - Metric value (0-100)
- **Returns**: `ReactElement`
- **Description**: Display animated progress bar

---

### 7.2 AnimatedCard

#### Methods

**`getAnimationVariant(variant: string)`**
- **Purpose**: Get Framer Motion animation variant
- **Parameters**: `variant` - Animation variant name
- **Returns**: `MotionVariant`
- **Description**: Return animation configuration

---

### 7.3 GlowButton

#### Methods

**`applyGlowEffect(color: string)`**
- **Purpose**: Apply glow effect with color
- **Parameters**: `color` - Glow color
- **Returns**: `void`
- **Description**: Add pulsing glow animation

---

## 8. Shared Components - Organisms

### 8.1 ErrorBoundary

#### Methods

**`componentDidCatch(error: Error, errorInfo: ErrorInfo)`**
- **Purpose**: Catch component errors
- **Parameters**: `error` - Error object, `errorInfo` - Error details
- **Returns**: `void`
- **Description**: Log error, update state to show fallback

**`handleRetry()`**
- **Purpose**: Retry after error
- **Returns**: `void`
- **Description**: Reset error state, attempt re-render

---

### 8.2 LoadingSpinner

#### Methods

**`renderSpinner(size: string)`**
- **Purpose**: Render spinner with size
- **Parameters**: `size` - Spinner size
- **Returns**: `ReactElement`
- **Description**: Display animated spinner

---

## Type Definitions

### AnalysisResult
```typescript
{
  id: string;
  entryId: string;
  timestamp: string;
  emotional: {
    mood: string;
    stressLevel: number;
    motivation: number;
    confidence: number;
  };
  productivity: {
    score: string;
    focusLevel: string;
  };
  suggestions: string[];
  analysisDuration: number;
}
```

### HistoryDataPoint
```typescript
{
  date: string;
  mood: string;
  stressLevel: number;
  motivation: number;
  confidence: number;
  productivityScore: number;
  focusLevel: number;
}
```

### FilterOptions
```typescript
{
  dateRange: {
    start: Date;
    end: Date;
  };
  selectedMetrics: string[];
}
```

### HistoryStatistics
```typescript
{
  averages: {
    stress: number;
    motivation: number;
    confidence: number;
    productivity: number;
  };
  trends: {
    [metric: string]: 'improving' | 'declining' | 'stable';
  };
  extremes: {
    [metric: string]: { high: number; low: number };
  };
  totalEntries: number;
}
```

---

## Notes

- All async methods return Promises
- Error handling will be implemented in each method
- Detailed business logic (sentiment analysis algorithms, scoring formulas) will be defined in Functional Design phase
- Animation configurations will be centralized in animation service
- Data transformation logic will be in separate utility service
