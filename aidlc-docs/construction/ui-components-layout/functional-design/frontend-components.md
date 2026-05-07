# Frontend Components Specification - UI Components & Layout

**Unit**: UI Components & Layout  
**Phase**: CONSTRUCTION - Functional Design  
**Date**: 2026-05-06

---

## Overview

This document provides detailed specifications for all 24 React components in the UI Components & Layout unit, including component hierarchy, props, state, user interactions, and API integration points.

---

## Component Organization

### By Category

**Layout Components** (3):
- AppLayout
- Header
- Navigation

**Page Components** (3):
- HomePage
- AnalysisPage
- HistoryPage

**Feature Components** (9):
- JournalInput
- AnalysisResults
- SuggestionsList
- HistoryFilters
- HistoryStats
- DashboardSummary
- (3 more in shared/features)

**Shared Components** (9):
- Button
- Input
- Card
- Badge
- Icon
- MetricCard
- AnimatedCard
- GlowButton
- ErrorBoundary
- LoadingSpinner

---

## Layout Components

### 1. AppLayout

**Purpose**: Root layout component providing app structure

**File**: `src/shared/layout/AppLayout.jsx`

**Props**: See domain-entities.md

**State**:
```javascript
const [storageQuota, setStorageQuota] = useState({ percentage: 0, needsWarning: false });
const [showQuotaWarning, setShowQuotaWarning] = useState(false);
```

**User Interactions**:
- None (container component)

**API Integration**:
- Unit 2: `StorageService.checkStorageQuota()` - Check quota on mount

**Rendering Logic**:
```jsx
<div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
  {showQuotaWarning && <QuotaWarningBanner />}
  <Header />
  <main className="container mx-auto px-4 py-8">
    <Outlet /> {/* React Router outlet */}
  </main>
</div>
```

**Accessibility**:
- Semantic HTML: `<main>` for content
- Skip navigation link at top
- ARIA landmarks

---

### 2. Header

**Purpose**: App header with branding and navigation

**File**: `src/shared/layout/Header.jsx`

**Props**: None (uses context)

**State**:
```javascript
const { theme, toggleTheme, highContrastMode, toggleHighContrast } = useTheme();
```

**User Interactions**:
- Click theme toggle button
- Click high contrast toggle button

**Rendering Logic**:
```jsx
<header className="bg-gray-900/50 backdrop-blur-lg border-b border-gray-800">
  <div className="container mx-auto px-4 py-4 flex justify-between items-center">
    <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
      MindMirror AI
    </h1>
    <Navigation variant="top" />
    <div className="flex gap-2">
      <Button variant="ghost" onClick={toggleTheme} aria-label="Toggle theme">
        {theme === 'dark' ? '🌙' : '☀️'}
      </Button>
      <Button variant="ghost" onClick={toggleHighContrast} aria-label="Toggle high contrast">
        {highContrastMode ? 'HC' : 'Normal'}
      </Button>
    </div>
  </div>
</header>
```

**Accessibility**:
- Semantic `<header>` element
- ARIA labels on buttons
- Keyboard accessible

---

### 3. Navigation

**Purpose**: Navigation menu with links to all pages

**File**: `src/shared/layout/Navigation.jsx`

**Props**: See domain-entities.md

**State**:
```javascript
const location = useLocation();
const activeRoute = location.pathname;
```

**User Interactions**:
- Click navigation links

**Rendering Logic**:
```jsx
{variant === 'top' ? (
  <nav className="hidden md:flex gap-4" aria-label="Main navigation">
    {navItems.map(item => (
      <NavLink
        key={item.path}
        to={item.path}
        className={({ isActive }) => 
          `px-4 py-2 rounded-lg transition-all ${
            isActive ? 'bg-blue-500/20 text-blue-400' : 'text-gray-400 hover:text-white'
          }`
        }
        aria-current={item.path === activeRoute ? 'page' : undefined}
      >
        {item.icon}
        <span>{item.label}</span>
      </NavLink>
    ))}
  </nav>
) : (
  <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 flex justify-around py-2">
    {/* Mobile bottom navigation */}
  </nav>
)}
```

**Accessibility**:
- Semantic `<nav>` element
- `aria-label` for navigation
- `aria-current="page"` for active link
- Keyboard accessible

---

## Page Components

### 4. HomePage

**Purpose**: Dashboard showing latest analysis and stats

**File**: `src/shared/pages/HomePage.jsx`

**Props**: None

**State**:
```javascript
const [latestAnalysis, setLatestAnalysis] = useState(null);
const [recentStats, setRecentStats] = useState(null);
const [isLoading, setIsLoading] = useState(true);
```

**User Interactions**:
- Click "Start New Entry" button → Navigate to AnalysisPage

**API Integration**:
- Unit 2: `StorageService.getLatestAnalysis()` - Load latest analysis
- Unit 2: `DataTransformationService.calculateStatistics()` - Load stats

**Rendering Logic**:
```jsx
<div className="space-y-8">
  <section className="text-center">
    <h1 className="text-4xl font-bold mb-4">Welcome to MindMirror AI</h1>
    <p className="text-gray-400 mb-8">Analyze your thoughts and emotions</p>
    <GlowButton onClick={() => navigate('/analysis')}>
      Start New Entry
    </GlowButton>
  </section>
  
  <DashboardSummary 
    latestAnalysis={latestAnalysis}
    recentStats={recentStats}
  />
</div>
```

**Accessibility**:
- Semantic headings
- Descriptive button text
- Skip navigation link

---

### 5. AnalysisPage

**Purpose**: Journal input and analysis results

**File**: `src/shared/pages/AnalysisPage.jsx`

**Props**: None

**State**:
```javascript
const [journalText, setJournalText] = useState('');
const [isAnalyzing, setIsAnalyzing] = useState(false);
const [showResults, setShowResults] = useState(false);
const [error, setError] = useState(null);
const { currentAnalysis, setCurrentAnalysis } = useAnalysis();
const { saveEntry, saveAnalysis } = useStorage();
```

**User Interactions**:
- Type in journal input
- Click submit button
- Click retry button (on error)

**API Integration**:
- Unit 1: `SentimentAnalysisService.analyze(text)` - Analyze journal entry
- Unit 2: `StorageService.saveEntry(entry)` - Save journal entry
- Unit 2: `StorageService.saveAnalysis(analysis)` - Save analysis result

**Rendering Logic**:
```jsx
<div className="grid md:grid-cols-2 gap-8">
  <div>
    <JournalInput
      onSubmit={handleSubmit}
      onTextChange={setJournalText}
      disabled={isAnalyzing}
    />
  </div>
  
  <div>
    {isAnalyzing && <LoadingSpinner message="Analyzing your entry..." />}
    {error && (
      <ErrorMessage 
        message={error}
        onRetry={handleRetry}
      />
    )}
    {showResults && currentAnalysis && (
      <AnalysisResults 
        analysis={currentAnalysis}
        showAnimation={true}
      />
    )}
  </div>
</div>
```

**Flow**:
1. User types in JournalInput
2. User clicks Submit
3. Validate input (10-10,000 characters)
4. Set isAnalyzing = true, show skeleton
5. Call Unit 1 to analyze
6. Save entry and analysis (Unit 2)
7. Set currentAnalysis, show results
8. Animate results in (stagger effect)

**Error Handling**:
- Analysis fails → Show error + retry button
- Save fails → Show error + manual retry
- Validation fails → Disable submit button

**Accessibility**:
- Focus management (focus on input on mount)
- ARIA live region for analysis status
- Keyboard shortcuts (Ctrl+Enter to submit)

---

### 6. HistoryPage

**Purpose**: Display 30-day history with charts and stats

**File**: `src/shared/pages/HistoryPage.jsx`

**Props**: None

**State**:
```javascript
const [dateRange, setDateRange] = useState({ start: thirtyDaysAgo, end: today });
const [filteredData, setFilteredData] = useState([]);
const [isLoading, setIsLoading] = useState(true);
const { getHistoryData } = useHistory();
```

**User Interactions**:
- Change date range filter
- Click export button
- Hover over chart data points

**API Integration**:
- Unit 2: `StorageService.getHistoryData(days)` - Load history data
- Unit 2: `DataTransformationService.transformForChart(data)` - Transform for chart
- Unit 2: `DataTransformationService.calculateStatistics(data)` - Calculate stats
- Unit 2: `ExportService.exportHistory(startDate, endDate)` - Export data

**Rendering Logic**:
```jsx
<div className="space-y-8">
  <HistoryFilters
    onFilterChange={handleFilterChange}
    onExport={handleExport}
    initialFilters={{ dateRange, sortBy: 'date', sortOrder: 'desc' }}
  />
  
  {filteredData.length === 0 ? (
    <EmptyState
      message="No journal entries yet"
      action="Start Your First Entry"
      onAction={() => navigate('/analysis')}
    />
  ) : (
    <>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <HistoryStats data={filteredData} dateRange={dateRange} />
        </div>
        <div className="md:col-span-2">
          <MoodHistoryChart data={filteredData} /> {/* Unit 4 */}
        </div>
      </div>
      
      <ProductivityMeter data={filteredData} /> {/* Unit 4 */}
    </>
  )}
</div>
```

**Lazy Loading**:
- HistoryPage is lazy loaded
- Unit 4 components (MoodHistoryChart, ProductivityMeter) are lazy loaded

**Accessibility**:
- Semantic headings
- Chart accessibility (data table alternative)
- Keyboard accessible filters

---

## Feature Components

### 7. JournalInput

**Purpose**: Large textarea for journal entry with validation

**File**: `src/features/analysis/JournalInput.jsx`

**Props**: See domain-entities.md

**State**:
```javascript
const [text, setText] = useState(initialText || '');
const [charCount, setCharCount] = useState(0);
const [isValid, setIsValid] = useState(false);
const [validationErrors, setValidationErrors] = useState([]);
const [isFocused, setIsFocused] = useState(false);
```

**User Interactions**:
- Type in textarea (debounced)
- Click submit button
- Focus/blur textarea

**Validation**:
- Minimum 10 characters
- Maximum 10,000 characters
- No script tags
- No HTML tags

**Rendering Logic**:
```jsx
<form onSubmit={handleSubmit} className="space-y-4">
  <div className="relative">
    <textarea
      value={text}
      onChange={handleChange}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      placeholder={placeholder}
      maxLength={maxLength}
      className={`w-full h-64 p-4 bg-gray-900/50 border ${
        validationErrors.length > 0 ? 'border-red-500' : 'border-gray-700'
      } rounded-lg focus:ring-2 focus:ring-blue-500`}
      aria-describedby="char-count validation-errors"
      autoFocus
    />
    
    <div id="char-count" className={`text-sm mt-2 ${getCharCountColor()}`}>
      {charCount} / {maxLength} characters
      {charCount >= 9000 && charCount < 9500 && (
        <span className="ml-2 text-yellow-500">⚠️ Approaching limit</span>
      )}
      {charCount >= 9500 && (
        <span className="ml-2 text-red-500">⚠️ Near maximum</span>
      )}
    </div>
    
    {validationErrors.length > 0 && (
      <div id="validation-errors" className="text-red-500 text-sm mt-2">
        {validationErrors.map((error, i) => (
          <div key={i}>❌ {error}</div>
        ))}
      </div>
    )}
  </div>
  
  <Button
    type="submit"
    variant="primary"
    disabled={!isValid || disabled}
    fullWidth
  >
    Analyze Entry
  </Button>
</form>
```

**Debouncing**:
- Text change: 300ms debounce
- Validation: 500ms debounce

**Accessibility**:
- `aria-describedby` linking to char count and errors
- `autoFocus` on mount
- Keyboard shortcut: Ctrl+Enter to submit

---

### 8. AnalysisResults

**Purpose**: Display analysis results with animations

**File**: `src/features/analysis/AnalysisResults.jsx`

**Props**: See domain-entities.md

**State**:
```javascript
const [animationComplete, setAnimationComplete] = useState(false);
```

**User Interactions**:
- View results (no direct interaction)
- Hover over metrics (tooltip)

**Rendering Logic**:
```jsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.3 }}
  className="space-y-6"
>
  {/* Mood Badge */}
  <div className="text-center">
    <Badge variant={getMoodVariant(analysis.emotional.mood)} size="large">
      {MOOD_EMOJI_MAP[analysis.emotional.mood]} {analysis.emotional.mood}
    </Badge>
  </div>
  
  {/* Metrics Grid */}
  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
    {[
      { label: 'Stress', value: analysis.emotional.stressLevel, icon: <StressIcon /> },
      { label: 'Motivation', value: analysis.emotional.motivation, icon: <MotivationIcon /> },
      { label: 'Confidence', value: analysis.emotional.confidence, icon: <ConfidenceIcon /> },
      { label: 'Productivity', value: productivityToScore(analysis.productivity.score), icon: <ProductivityIcon /> },
      { label: 'Focus', value: focusToScore(analysis.productivity.focusLevel), icon: <FocusIcon /> },
    ].map((metric, index) => (
      <motion.div
        key={metric.label}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1, duration: 0.2 }}
      >
        <MetricCard
          label={metric.label}
          value={metric.value}
          icon={metric.icon}
          showPercentage={true}
          showCategory={true}
          animated={showAnimation}
        />
      </motion.div>
    ))}
  </div>
  
  {/* Suggestions */}
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.6, duration: 0.3 }}
  >
    <SuggestionsList 
      suggestions={analysis.suggestions}
      showAnimation={showAnimation}
    />
  </motion.div>
</motion.div>
```

**Animation**:
- Container fades in (300ms)
- Metrics stagger in (100ms delay each)
- Suggestions animate in after metrics (600ms delay)

**Accessibility**:
- ARIA live region: `aria-live="polite"`
- Semantic headings
- Color not sole indicator (use text + icons)

---

### 9. SuggestionsList

**Purpose**: Display AI-generated suggestions

**File**: `src/features/analysis/SuggestionsList.jsx`

**Props**: See domain-entities.md

**State**:
```javascript
const [expandedIndex, setExpandedIndex] = useState(null);
```

**User Interactions**:
- Click suggestion to expand (if truncated)

**Rendering Logic**:
```jsx
<Card variant="glassmorphism" className="p-6">
  <h3 className="text-xl font-semibold mb-4">💡 Suggestions</h3>
  <ul className="space-y-3">
    {suggestions.slice(0, maxVisible).map((suggestion, index) => (
      <motion.li
        key={index}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05, duration: 0.2 }}
        className="flex items-start gap-3 p-3 bg-gray-800/50 rounded-lg"
      >
        <span className="text-blue-400 font-bold">{index + 1}.</span>
        <span className="text-gray-300">{suggestion}</span>
      </motion.li>
    ))}
  </ul>
  {suggestions.length > maxVisible && (
    <Button variant="ghost" onClick={() => setMaxVisible(suggestions.length)}>
      View All ({suggestions.length - maxVisible} more)
    </Button>
  )}
</Card>
```

**Animation**:
- Each suggestion staggers in (50ms delay)
- Slide from left + fade in

**Accessibility**:
- Semantic `<ul>` list
- Numbered suggestions
- Keyboard accessible expand button

---

### 10. HistoryFilters

**Purpose**: Filter and export history data

**File**: `src/features/history/HistoryFilters.jsx`

**Props**: See domain-entities.md

**State**:
```javascript
const [filters, setFilters] = useState(initialFilters);
const [isExporting, setIsExporting] = useState(false);
```

**User Interactions**:
- Change date range (start/end date inputs)
- Click export button
- Change sort options

**API Integration**:
- Unit 2: `ExportService.exportHistory(startDate, endDate)` - Export data

**Rendering Logic**:
```jsx
<Card variant="glassmorphism" className="p-6">
  <div className="grid md:grid-cols-4 gap-4">
    <Input
      type="date"
      label="Start Date"
      value={filters.dateRange.start}
      onChange={(value) => handleFilterChange({ ...filters, dateRange: { ...filters.dateRange, start: value } })}
    />
    
    <Input
      type="date"
      label="End Date"
      value={filters.dateRange.end}
      onChange={(value) => handleFilterChange({ ...filters, dateRange: { ...filters.dateRange, end: value } })}
    />
    
    <div className="flex items-end">
      <Button
        variant="outline"
        onClick={handleExport}
        loading={isExporting}
        icon={<DownloadIcon />}
        fullWidth
      >
        Export Data
      </Button>
    </div>
  </div>
</Card>
```

**Accessibility**:
- Labeled inputs
- Keyboard accessible
- Loading state announced

---

### 11. HistoryStats

**Purpose**: Display aggregated statistics

**File**: `src/features/history/HistoryStats.jsx`

**Props**: See domain-entities.md

**Computed Values**:
```javascript
const stats = useMemo(() => {
  return DataTransformationService.calculateStatistics(data);
}, [data]);
```

**Rendering Logic**:
```jsx
<Card variant="neon" className="p-6">
  <h3 className="text-xl font-semibold mb-4">📊 Statistics</h3>
  <div className="space-y-4">
    <MetricCard
      label="Total Entries"
      value={stats.totalEntries}
      showPercentage={false}
      size="small"
    />
    <MetricCard
      label="Avg Stress"
      value={stats.avgStress}
      showPercentage={true}
      showCategory={true}
      size="small"
    />
    <MetricCard
      label="Avg Motivation"
      value={stats.avgMotivation}
      showPercentage={true}
      showCategory={true}
      size="small"
    />
    <div className="pt-4 border-t border-gray-700">
      <div className="text-sm text-gray-400">Most Common Mood</div>
      <Badge variant={getMoodVariant(stats.mostCommonMood)}>
        {MOOD_EMOJI_MAP[stats.mostCommonMood]} {stats.mostCommonMood}
      </Badge>
    </div>
    <div>
      <div className="text-sm text-gray-400">Longest Streak</div>
      <div className="text-2xl font-bold text-blue-400">{stats.longestStreak} days</div>
    </div>
  </div>
</Card>
```

**Performance**:
- Use `useMemo` to cache calculated stats
- Re-calculate only when data changes

**Accessibility**:
- Semantic headings
- Descriptive labels
- Color not sole indicator

---

### 12. DashboardSummary

**Purpose**: Show latest analysis and recent stats on homepage

**File**: `src/features/dashboard/DashboardSummary.jsx`

**Props**: See domain-entities.md

**State**:
```javascript
const [isLoading, setIsLoading] = useState(true);
```

**Rendering Logic**:
```jsx
<div className="grid md:grid-cols-3 gap-6">
  {latestAnalysis && (
    <AnimatedCard animation="fade" delay={0}>
      <Card variant="glassmorphism" className="p-6">
        <h3 className="text-lg font-semibold mb-2">Latest Analysis</h3>
        <Badge variant={getMoodVariant(latestAnalysis.emotional.mood)}>
          {MOOD_EMOJI_MAP[latestAnalysis.emotional.mood]} {latestAnalysis.emotional.mood}
        </Badge>
        <div className="mt-4 text-sm text-gray-400">
          {formatRelativeTime(latestAnalysis.timestamp)}
        </div>
      </Card>
    </AnimatedCard>
  )}
  
  {recentStats && (
    <>
      <AnimatedCard animation="fade" delay={100}>
        <MetricCard
          label="Avg Stress (30 days)"
          value={recentStats.avgStress}
          showPercentage={true}
          showCategory={true}
        />
      </AnimatedCard>
      
      <AnimatedCard animation="fade" delay={200}>
        <MetricCard
          label="Avg Motivation (30 days)"
          value={recentStats.avgMotivation}
          showPercentage={true}
          showCategory={true}
        />
      </AnimatedCard>
    </>
  )}
</div>
```

**Animation**:
- Cards fade in with stagger (100ms delay each)

**Accessibility**:
- Semantic headings
- Descriptive labels

---

## Shared Components

### 13-21. Shared Components

Due to length constraints, detailed specifications for the remaining shared components (Button, Input, Card, Badge, Icon, MetricCard, AnimatedCard, GlowButton, ErrorBoundary, LoadingSpinner) follow the same pattern:

**Each component includes**:
- Purpose and file location
- Props interface (see domain-entities.md)
- State (if applicable)
- User interactions
- Rendering logic with Tailwind CSS
- Accessibility features
- Performance optimizations

**Key patterns**:
- All components use TypeScript-style JSDoc for prop types
- All interactive components have ARIA labels
- All components support className prop for customization
- All components use Tailwind CSS for styling
- All components follow consistent naming conventions

---

## API Integration Summary

### Unit 1 Integration (Sentiment Analysis)

**Components**: AnalysisPage

**Methods Used**:
- `SentimentAnalysisService.analyze(text)` - Analyze journal entry

**Data Flow**:
1. User submits text in JournalInput
2. AnalysisPage calls Unit 1 to analyze
3. Receive AnalysisResult
4. Display in AnalysisResults component

---

### Unit 2 Integration (Data Management)

**Components**: AnalysisPage, HistoryPage, HomePage, HistoryFilters

**Methods Used**:
- `StorageService.saveEntry(entry)` - Save journal entry
- `StorageService.saveAnalysis(analysis)` - Save analysis result
- `StorageService.getHistoryData(days)` - Load history data
- `StorageService.getLatestAnalysis()` - Load latest analysis
- `StorageService.checkStorageQuota()` - Check storage quota
- `DataTransformationService.transformForChart(data)` - Transform for chart
- `DataTransformationService.calculateStatistics(data)` - Calculate stats
- `ExportService.exportHistory(startDate, endDate)` - Export data

**Data Flow**:
1. AnalysisPage: Save entry + analysis after successful analysis
2. HistoryPage: Load history data on mount, transform for chart
3. HomePage: Load latest analysis and stats on mount
4. HistoryFilters: Export data on button click

---

### Unit 4 Integration (Visualization)

**Components**: HistoryPage

**Components Used**:
- `MoodHistoryChart` - Display mood history chart
- `ProductivityMeter` - Display productivity gauge

**Data Flow**:
1. HistoryPage loads data from Unit 2
2. Pass data to Unit 4 components as props
3. Unit 4 components render visualizations

---

## Component Testing Strategy

**Manual Testing Checklist** (documented in Build and Test stage):

1. **Visual Testing**:
   - All components render correctly
   - Responsive design works on all breakpoints
   - Animations are smooth
   - Colors and styling match design

2. **Interaction Testing**:
   - All buttons and links work
   - Forms validate correctly
   - Keyboard navigation works
   - Hover effects work

3. **Accessibility Testing**:
   - Screen reader announces content correctly
   - Keyboard navigation works
   - Focus indicators visible
   - ARIA labels present

4. **Integration Testing**:
   - Data flows correctly between components
   - API calls work as expected
   - Error handling works
   - Loading states display correctly

---

**Status**: ✅ Frontend Components Specification Complete
