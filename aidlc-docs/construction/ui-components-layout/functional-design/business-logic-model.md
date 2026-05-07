# Business Logic Model - UI Components & Layout

**Unit**: UI Components & Layout  
**Phase**: CONSTRUCTION - Functional Design  
**Date**: 2026-05-06

---

## Overview

The UI Components & Layout unit provides all React components for the MindMirror AI application, excluding visualization-specific components (handled by Unit 4). This unit implements the presentation layer with 24 components organized into layout, pages, features, and shared components.

**Core Responsibilities**:
1. **Layout Management**: App structure, header, navigation
2. **Page Components**: Home, Analysis, History pages
3. **Feature Components**: Analysis, history, dashboard features
4. **Shared Components**: Reusable UI atoms, molecules, organisms

---

## Component Architecture

### Component Hierarchy

```
AppLayout (Root)
├── Header
│   └── Navigation
├── HomePage
│   ├── DashboardSummary
│   │   ├── MetricCard (x6)
│   │   └── AnimatedCard
│   └── GlowButton
├── AnalysisPage
│   ├── JournalInput
│   │   ├── Input (textarea)
│   │   ├── Button (submit)
│   │   └── LoadingSpinner
│   ├── AnalysisResults
│   │   ├── Card
│   │   ├── Badge (mood)
│   │   ├── MetricCard (x6)
│   │   └── SuggestionsList
│   └── ErrorBoundary
└── HistoryPage
    ├── HistoryFilters
    │   ├── Input (date range)
    │   └── Button (filter/export)
    ├── HistoryStats
    │   └── MetricCard (x4)
    ├── MoodHistoryChart (Unit 4)
    └── ProductivityMeter (Unit 4)
```

---

## State Management Architecture

### Global State (React Context)

**ThemeContext**:
```javascript
{
  theme: 'dark' | 'light',
  highContrastMode: boolean,
  reducedMotion: boolean,
  toggleTheme: () => void,
  toggleHighContrast: () => void,
  toggleReducedMotion: () => void
}
```

**AnalysisContext**:
```javascript
{
  currentAnalysis: AnalysisResult | null,
  isAnalyzing: boolean,
  error: string | null,
  setCurrentAnalysis: (analysis: AnalysisResult) => void,
  clearAnalysis: () => void
}
```

### Local Component State

**JournalInput**:
- `text`: string (debounced controlled input)
- `charCount`: number (real-time character count)
- `isValid`: boolean (validation state)
- `validationErrors`: string[] (validation messages)

**AnalysisPage**:
- `showResults`: boolean (toggle results visibility)
- `analysisInProgress`: boolean (background analysis state)

**HistoryPage**:
- `dateRange`: { start: Date, end: Date } (filter state)
- `filteredData`: HistoryDataPoint[] (filtered history)

---

## Business Logic Flows

### Flow 1: Journal Submission & Analysis

**Trigger**: User submits journal entry on AnalysisPage

**Algorithm**:
```
1. User types in JournalInput (debounced controlled component)
   - Update text state on change (debounced 300ms)
   - Validate in real-time (debounced 500ms)
   - Show character count and warnings

2. User clicks Submit button
   - Validate input (10-10,000 characters)
   - If invalid: Keep submit button disabled
   - If valid: Proceed to step 3

3. Start analysis
   - Set isAnalyzing = true
   - Show skeleton screens (loading state)
   - Call Unit 1: SentimentAnalysisService.analyze(text)

4. Analysis completes
   - Receive AnalysisResult from Unit 1
   - Set currentAnalysis in AnalysisContext
   - Store in localStorage via Unit 2 (auto-save)
   - Set isAnalyzing = false
   - Animate results in (stagger effect)

5. Display results
   - Show AnalysisResults component
   - Display all metrics with animations
   - Show suggestions list
   - Keep journal text visible (allow editing)

6. Error handling
   - If analysis fails: Show error + retry button
   - If save fails: Show error + manual retry
   - Allow navigation during analysis (continue in background)
```

**State Transitions**:
```
Idle → Typing → Validating → Valid → Analyzing → Results Displayed
                                   ↓
                              Error → Retry
```

---

### Flow 2: Navigation & Page Transitions

**Trigger**: User navigates between pages

**Algorithm**:
```
1. User clicks navigation link (Home/Analysis/History)

2. Check if analysis in progress
   - If yes: Allow navigation, continue analysis in background
   - If no: Proceed to step 3

3. Lazy load target page (if not already loaded)
   - HistoryPage: Lazy load + load Unit 4 components
   - AnalysisPage: Lazy load
   - HomePage: Already in main bundle

4. Apply page transition
   - Fade out current page (200ms)
   - Fade in new page (200ms)
   - Total transition: 400ms

5. Update active navigation indicator

6. Scroll to top of new page
```

**Lazy Loading Strategy**:
- HomePage: Main bundle (no lazy loading)
- AnalysisPage: Lazy loaded
- HistoryPage: Lazy loaded (includes Unit 4 components)

---

### Flow 3: Form Validation & Input Handling

**Trigger**: User types in JournalInput

**Algorithm**:
```
1. User types in textarea
   - Update text state (debounced 300ms)
   - Calculate character count (real-time)
   - Update character count display

2. Debounced validation (500ms after user stops typing)
   - Check minimum length (10 characters)
   - Check maximum length (10,000 characters)
   - Sanitize input (remove script tags, HTML)
   - Update validation state

3. Character limit warnings
   - < 10 characters: Show "Minimum 10 characters" (red)
   - 10-9000 characters: Show count (white)
   - 9000-9500 characters: Show count (yellow) + "Approaching limit"
   - 9500-10000 characters: Show count (red) + "Near maximum"
   - 10000 characters: Show count (red) + "Maximum reached"

4. Submit button state
   - Disabled if: text.length < 10 OR text.length > 10000
   - Enabled if: 10 <= text.length <= 10000

5. Validation errors
   - Show inline below textarea
   - Update in real-time (debounced)
```

**Validation Rules**:
- Minimum: 10 characters
- Maximum: 10,000 characters
- No script tags allowed
- No HTML tags allowed
- Preserve meaningful punctuation

---

### Flow 4: Data Display & Formatting

**Trigger**: Display analysis results or history data

**Algorithm for Metric Display**:
```
INPUT: MetricScore { name, value, category }
OUTPUT: Formatted display

1. Format percentage
   percentage = value + "%"

2. Determine category label
   if (value >= 75) label = "High"
   else if (value >= 50) label = "Medium"
   else if (value >= 25) label = "Low"
   else label = "Very Low"

3. Display format
   "{percentage} - {label}"
   Example: "75% - High"

4. Apply color coding
   High (75-100): Green (#10b981)
   Medium (50-74): Yellow (#f59e0b)
   Low (25-49): Orange (#f97316)
   Very Low (0-24): Red (#ef4444)
```

**Algorithm for Mood Display**:
```
INPUT: Mood string (e.g., "Happy", "Stressed")
OUTPUT: Formatted display with emoji

1. Map mood to emoji
   Happy → 😊
   Sad → 😢
   Stressed → 😰
   Anxious → 😟
   Overwhelmed → 😵
   Calm → 😌
   Motivated → 💪
   Frustrated → 😤
   Uncertain → 🤔
   Neutral → 😐

2. Display format
   "{emoji} {mood}"
   Example: "😊 Happy"

3. Apply color-coded badge
   Positive moods (Happy, Calm, Motivated): Green
   Neutral moods (Neutral, Uncertain): Gray
   Negative moods (Sad, Stressed, Anxious, etc.): Red/Orange
```

**Algorithm for Timestamp Display**:
```
INPUT: ISO 8601 timestamp
OUTPUT: Relative time with absolute tooltip

1. Calculate time difference
   diff = now - timestamp

2. Format relative time
   if (diff < 60 seconds) return "Just now"
   if (diff < 60 minutes) return "{minutes} minutes ago"
   if (diff < 24 hours) return "{hours} hours ago"
   if (diff < 7 days) return "{days} days ago"
   if (diff < 30 days) return "{weeks} weeks ago"
   else return "Over a month ago"

3. Format absolute time (for tooltip)
   format = "MMM DD, YYYY at HH:MM AM/PM"
   Example: "May 6, 2026 at 3:30 PM"

4. Display
   <span title="{absolute}">{relative}</span>
```

---

### Flow 5: Responsive Design & Breakpoints

**Breakpoints** (Tailwind defaults):
- Mobile: < 640px (sm)
- Tablet: 640px - 1024px (md, lg)
- Desktop: >= 1024px (xl, 2xl)

**Layout Adjustments**:

**Mobile (< 640px)**:
```
- AppLayout: Single column, full width
- Header: Compact, hamburger menu hidden
- Navigation: Bottom navigation bar (always visible)
- AnalysisPage: Stack all components vertically
  - JournalInput: Full width
  - AnalysisResults: Full width, single column metrics
- HistoryPage: Stack all components vertically
  - HistoryFilters: Full width, stacked inputs
  - MoodHistoryChart: Full width, reduced height
- DashboardSummary: 1 column grid (1 card per row)
```

**Tablet (640px - 1024px)**:
```
- AppLayout: Two column where appropriate
- Header: Full navigation visible
- Navigation: Top navigation bar
- AnalysisPage: Side-by-side where space allows
  - JournalInput: 60% width
  - AnalysisResults: 40% width (or below on smaller tablets)
- HistoryPage: Two column layout
  - HistoryFilters: Top row, full width
  - HistoryStats + Chart: Side by side
- DashboardSummary: 2 column grid (2 cards per row)
```

**Desktop (>= 1024px)**:
```
- AppLayout: Multi-column layout
- Header: Full navigation with all links
- Navigation: Top navigation bar with hover effects
- AnalysisPage: Side-by-side layout
  - JournalInput: 50% width (left)
  - AnalysisResults: 50% width (right)
- HistoryPage: Three column layout
  - HistoryFilters: Top row, full width
  - HistoryStats: Left column (30%)
  - MoodHistoryChart: Right column (70%)
- DashboardSummary: 3 column grid (3 cards per row)
```

---

### Flow 6: Animations & Visual Effects

**Animation Strategy**:
- Complex animations: Framer Motion
- Simple animations: CSS transitions
- Respect user preferences (prefers-reduced-motion)

**Analysis Results Animation**:
```
1. Results container fades in (300ms)

2. Metrics animate in with stagger effect
   - Delay between each metric: 100ms
   - Animation: Slide up + fade in (200ms)
   - Order: Mood → Stress → Motivation → Confidence → Productivity → Focus

3. Suggestions list animates in
   - Delay: 600ms (after all metrics)
   - Animation: Slide up + fade in (300ms)
   - Each suggestion item: Stagger 50ms

Total animation time: ~1.2 seconds
```

**Page Transition Animation**:
```
1. Current page fades out (200ms)
2. New page fades in (200ms)
Total: 400ms
```

**Button Hover Animation**:
```
- Scale: 1.0 → 1.05 (150ms)
- Glow effect: Opacity 0 → 1 (150ms)
- Transition: ease-in-out
```

**Card Hover Animation**:
```
- Transform: translateY(0) → translateY(-4px) (200ms)
- Shadow: Increase blur and spread (200ms)
- Border glow: Opacity 0 → 1 (200ms)
```

---

### Flow 7: Error Handling & Edge Cases

**Error Scenario 1: Analysis Fails**
```
1. Unit 1 throws error during analysis

2. Catch error in AnalysisPage
   - Set error state
   - Set isAnalyzing = false
   - Clear loading state

3. Display error message
   - Show error banner above results area
   - Message: "Analysis failed. Please try again."
   - Include retry button

4. User clicks retry
   - Clear error state
   - Retry analysis with same text
   - If fails again: Show error + suggest shorter text
```

**Error Scenario 2: Save Operation Fails**
```
1. Unit 2 throws error during save

2. Catch error in AnalysisPage
   - Keep analysis results visible
   - Show error toast notification

3. Display error message
   - Toast: "Failed to save entry. Please try again."
   - Include manual retry button in toast

4. User clicks retry
   - Attempt save again
   - If succeeds: Show success toast
   - If fails: Show persistent error banner
```

**Error Scenario 3: Empty State (No History)**
```
1. User navigates to HistoryPage

2. Load history data from Unit 2
   - If empty: Show empty state

3. Display empty state
   - Illustration: Empty journal icon
   - Message: "No journal entries yet"
   - Call-to-action button: "Start Your First Entry"

4. User clicks CTA
   - Navigate to AnalysisPage
   - Focus on JournalInput textarea
```

**Error Scenario 4: Storage Quota Warning**
```
1. Unit 2 detects quota > 80%

2. Trigger warning in AppLayout
   - Show warning banner at top
   - Message: "Storage is {percentage}% full. Old entries will be automatically removed."
   - Include "Learn More" link

3. User clicks "Learn More"
   - Show modal with explanation
   - Explain 30-day retention policy
   - Offer manual export option

4. Auto-cleanup triggers (Unit 2)
   - Remove entries older than 30 days
   - Update warning banner
   - If quota still high: Show critical warning
```

---

### Flow 8: Accessibility Features

**Keyboard Navigation**:
```
1. Tab order
   - Header navigation links
   - Page content (top to bottom, left to right)
   - Form inputs
   - Buttons
   - Interactive elements

2. Keyboard shortcuts
   - Ctrl+Enter: Submit journal entry (on AnalysisPage)
   - Escape: Close modals/dialogs
   - Tab: Next element
   - Shift+Tab: Previous element

3. Focus indicators
   - Visible focus ring (2px solid, theme color)
   - High contrast in high contrast mode
```

**Screen Reader Support**:
```
1. ARIA labels
   - All interactive elements have aria-label
   - Form inputs have aria-describedby for errors
   - Buttons have descriptive labels

2. ARIA live regions
   - Analysis results: aria-live="polite"
   - Error messages: aria-live="assertive"
   - Loading states: aria-busy="true"

3. Skip navigation links
   - "Skip to main content" link at top
   - Hidden visually, visible to screen readers

4. Semantic HTML
   - Use <nav>, <main>, <article>, <section>
   - Use <button> for buttons (not <div>)
   - Use <label> for form labels
```

**Color Contrast**:
```
1. High contrast text
   - White text on dark backgrounds (contrast ratio >= 7:1)
   - Dark text on light backgrounds (contrast ratio >= 7:1)

2. Text shadows for neon effects
   - Add text-shadow for better visibility
   - Ensure readability on all backgrounds

3. High contrast mode toggle
   - User can enable high contrast mode
   - Removes glassmorphism effects
   - Increases contrast ratios
   - Simplifies color palette
```

---

### Flow 9: Performance Optimization

**Component Memoization**:
```
1. Memoize expensive components
   - AnalysisResults: React.memo (re-renders only when analysis changes)
   - MoodHistoryChart: React.memo (re-renders only when data changes)
   - MetricCard: React.memo (re-renders only when metric changes)

2. Memoize expensive computations
   - useMemo for filtered history data
   - useMemo for aggregated statistics
   - useCallback for event handlers passed to children
```

**Image Optimization**:
```
1. Lazy loading
   - All images: loading="lazy"
   - Load images only when in viewport

2. Responsive images
   - Use srcset for different screen sizes
   - Serve appropriate image size based on device

3. Image formats
   - Use WebP with fallback to PNG/JPG
   - Compress images for web
```

**Code Splitting**:
```
1. Lazy load pages
   - AnalysisPage: React.lazy()
   - HistoryPage: React.lazy()
   - HomePage: Main bundle (no lazy loading)

2. Lazy load Unit 4 components
   - MoodHistoryChart: React.lazy()
   - ProductivityMeter: React.lazy()
   - Load only when HistoryPage is accessed
```

---

## Component Interaction Patterns

### Pattern 1: Parent-Child Communication

**Props Down, Events Up**:
```javascript
// Parent: AnalysisPage
<JournalInput
  onSubmit={handleSubmit}
  onTextChange={handleTextChange}
  maxLength={10000}
/>

// Child: JournalInput
const JournalInput = ({ onSubmit, onTextChange, maxLength }) => {
  const handleChange = (e) => {
    onTextChange(e.target.value);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(text);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <textarea onChange={handleChange} />
      <button type="submit">Analyze</button>
    </form>
  );
};
```

### Pattern 2: Context-Based Communication

**Global State Access**:
```javascript
// Provider: App.jsx
<AnalysisProvider>
  <AppLayout />
</AnalysisProvider>

// Consumer: AnalysisResults
const AnalysisResults = () => {
  const { currentAnalysis, isAnalyzing } = useAnalysis();
  
  if (isAnalyzing) return <LoadingSpinner />;
  if (!currentAnalysis) return null;
  
  return <div>{/* Render results */}</div>;
};
```

### Pattern 3: Custom Hook Communication

**Service Integration**:
```javascript
// Custom hook: useJournalSubmit
const useJournalSubmit = () => {
  const { setCurrentAnalysis } = useAnalysis();
  const { saveEntry, saveAnalysis } = useStorage();
  
  const submitJournal = async (text) => {
    // 1. Analyze (Unit 1)
    const analysis = await SentimentAnalysisService.analyze(text);
    
    // 2. Save entry (Unit 2)
    const entry = await saveEntry({ text, timestamp: new Date() });
    
    // 3. Save analysis (Unit 2)
    await saveAnalysis({ ...analysis, entryId: entry.id });
    
    // 4. Update context
    setCurrentAnalysis(analysis);
  };
  
  return { submitJournal };
};

// Usage in component
const AnalysisPage = () => {
  const { submitJournal } = useJournalSubmit();
  
  const handleSubmit = async (text) => {
    await submitJournal(text);
  };
  
  return <JournalInput onSubmit={handleSubmit} />;
};
```

---

## Business Rules Summary

All detailed business rules are documented in `business-rules.md`. Key rule categories:

1. **Input Validation Rules** (10 rules)
2. **Form Handling Rules** (8 rules)
3. **Navigation Rules** (6 rules)
4. **Display Formatting Rules** (12 rules)
5. **Responsive Design Rules** (9 rules)
6. **Animation Rules** (7 rules)
7. **Accessibility Rules** (15 rules)
8. **Error Handling Rules** (10 rules)
9. **Performance Rules** (8 rules)
10. **State Management Rules** (7 rules)

**Total**: 92 business rules

---

**Status**: ✅ Business Logic Model Complete
