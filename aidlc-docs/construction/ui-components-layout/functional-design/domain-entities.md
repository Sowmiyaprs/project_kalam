# Domain Entities - UI Components & Layout

**Unit**: UI Components & Layout  
**Phase**: CONSTRUCTION - Functional Design  
**Date**: 2026-05-06

---

## Overview

This document defines all component props, state structures, and data models used in the UI Components & Layout unit.

---

## Component Props Definitions

### Layout Components

#### AppLayout

```typescript
interface AppLayoutProps {
  children: React.ReactNode;
}

interface AppLayoutState {
  storageQuota: {
    percentage: number;
    needsWarning: boolean;
  };
  showQuotaWarning: boolean;
}
```

---

#### Header

```typescript
interface HeaderProps {
  // No props (uses context for theme)
}
```

---

#### Navigation

```typescript
interface NavigationProps {
  variant: 'top' | 'bottom'; // top for desktop, bottom for mobile
  activeRoute: string;
}

interface NavigationItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  ariaLabel: string;
}
```

---

### Page Components

#### HomePage

```typescript
interface HomePageProps {
  // No props (uses context and hooks)
}

interface HomePageState {
  latestAnalysis: AnalysisResult | null;
  recentStats: {
    totalEntries: number;
    avgStress: number;
    avgMotivation: number;
    mostCommonMood: string;
  } | null;
}
```

---

#### AnalysisPage

```typescript
interface AnalysisPageProps {
  // No props (uses context and hooks)
}

interface AnalysisPageState {
  journalText: string;
  isAnalyzing: boolean;
  showResults: boolean;
  error: string | null;
  analysisInProgress: boolean; // background analysis
}
```

---

#### HistoryPage

```typescript
interface HistoryPageProps {
  // No props (uses context and hooks)
}

interface HistoryPageState {
  dateRange: {
    start: Date;
    end: Date;
  };
  filteredData: HistoryDataPoint[];
  isLoading: boolean;
}
```

---

### Feature Components

#### JournalInput

```typescript
interface JournalInputProps {
  onSubmit: (text: string) => void;
  onTextChange?: (text: string) => void;
  initialText?: string;
  maxLength?: number; // default: 10000
  minLength?: number; // default: 10
  disabled?: boolean;
  placeholder?: string;
}

interface JournalInputState {
  text: string;
  charCount: number;
  isValid: boolean;
  validationErrors: string[];
  isFocused: boolean;
}

interface ValidationState {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}
```

---

#### AnalysisResults

```typescript
interface AnalysisResultsProps {
  analysis: AnalysisResult; // from Unit 1
  onRetry?: () => void;
  showAnimation?: boolean; // default: true
}

interface AnalysisResultsState {
  animationComplete: boolean;
}
```

---

#### SuggestionsList

```typescript
interface SuggestionsListProps {
  suggestions: string[];
  maxVisible?: number; // default: 5
  showAnimation?: boolean; // default: true
}

interface SuggestionsListState {
  expandedIndex: number | null;
}
```

---

#### HistoryFilters

```typescript
interface HistoryFiltersProps {
  onFilterChange: (filters: FilterState) => void;
  onExport: () => void;
  initialFilters?: FilterState;
}

interface FilterState {
  dateRange: {
    start: Date;
    end: Date;
  };
  moodFilter?: string[]; // filter by specific moods
  sortBy: 'date' | 'stress' | 'motivation';
  sortOrder: 'asc' | 'desc';
}

interface HistoryFiltersState {
  filters: FilterState;
  isExporting: boolean;
}
```

---

#### HistoryStats

```typescript
interface HistoryStatsProps {
  data: HistoryDataPoint[];
  dateRange: {
    start: Date;
    end: Date;
  };
}

interface HistoryStatsData {
  totalEntries: number;
  avgStress: number;
  avgMotivation: number;
  avgConfidence: number;
  avgProductivity: number;
  avgFocus: number;
  mostCommonMood: string;
  longestStreak: number;
  stressTrend: 'improving' | 'declining' | 'stable';
  productivityTrend: 'improving' | 'declining' | 'stable';
}
```

---

#### DashboardSummary

```typescript
interface DashboardSummaryProps {
  latestAnalysis: AnalysisResult | null;
  recentStats: HistoryStatsData | null;
}

interface DashboardSummaryState {
  isLoading: boolean;
}
```

---

### Shared Components

#### Button

```typescript
interface ButtonProps {
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  ariaLabel?: string;
  className?: string;
}

interface ButtonVariantStyles {
  primary: string; // Neon blue glow
  secondary: string; // Neon purple glow
  outline: string; // Transparent with border
  ghost: string; // Transparent, no border
  danger: string; // Red glow
}

interface ButtonSizeStyles {
  small: string; // px-3 py-1.5 text-sm
  medium: string; // px-4 py-2 text-base
  large: string; // px-6 py-3 text-lg
}
```

---

#### Input

```typescript
interface InputProps {
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email' | 'password' | 'number' | 'date' | 'textarea';
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  maxLength?: number;
  minLength?: number;
  rows?: number; // for textarea
  autoFocus?: boolean;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  className?: string;
}

interface InputState {
  isFocused: boolean;
  isDirty: boolean;
}
```

---

#### Card

```typescript
interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'glassmorphism' | 'neon' | 'elevated';
  size?: 'small' | 'medium' | 'large';
  padding?: 'none' | 'small' | 'medium' | 'large';
  hoverable?: boolean; // enable hover effects
  clickable?: boolean; // enable click effects
  onClick?: () => void;
  className?: string;
  ariaLabel?: string;
}

interface CardVariantStyles {
  default: string; // Solid background
  glassmorphism: string; // Transparent with blur
  neon: string; // Neon border glow
  elevated: string; // Shadow elevation
}

interface CardSizeStyles {
  small: string; // max-w-sm
  medium: string; // max-w-md
  large: string; // max-w-lg
}
```

---

#### Badge

```typescript
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'small' | 'medium' | 'large';
  icon?: React.ReactNode;
  removable?: boolean;
  onRemove?: () => void;
  className?: string;
}

interface BadgeVariantStyles {
  default: string; // Gray
  success: string; // Green
  warning: string; // Yellow
  danger: string; // Red
  info: string; // Blue
}
```

---

#### Icon

```typescript
interface IconProps {
  name: string; // icon name from library or custom
  size?: 'small' | 'medium' | 'large' | number;
  color?: string;
  className?: string;
  ariaLabel?: string;
}

interface IconSizeMap {
  small: 16;
  medium: 24;
  large: 32;
}

// Icon library mapping
interface IconLibrary {
  // From React Icons (Heroicons)
  home: HiHome;
  analysis: HiDocumentText;
  history: HiChartBar;
  export: HiDownload;
  settings: HiCog;
  close: HiX;
  check: HiCheck;
  warning: HiExclamation;
  error: HiXCircle;
  info: HiInformationCircle;
  
  // Custom SVG icons
  mood: CustomMoodIcon;
  stress: CustomStressIcon;
  motivation: CustomMotivationIcon;
  confidence: CustomConfidenceIcon;
  productivity: CustomProductivityIcon;
  focus: CustomFocusIcon;
}
```

---

#### MetricCard

```typescript
interface MetricCardProps {
  label: string;
  value: number; // 0-100
  category?: string; // "High", "Medium", "Low"
  icon?: React.ReactNode;
  color?: string;
  showPercentage?: boolean; // default: true
  showCategory?: boolean; // default: true
  size?: 'small' | 'medium' | 'large';
  animated?: boolean; // default: true
}

interface MetricCardState {
  displayValue: number; // for animation
}
```

---

#### AnimatedCard

```typescript
interface AnimatedCardProps {
  children: React.ReactNode;
  animation?: 'fade' | 'slide' | 'scale' | 'bounce';
  delay?: number; // animation delay in ms
  duration?: number; // animation duration in ms
  hoverable?: boolean;
  className?: string;
}
```

---

#### GlowButton

```typescript
interface GlowButtonProps extends ButtonProps {
  glowColor?: string; // hex color for glow
  glowIntensity?: 'low' | 'medium' | 'high';
  pulseAnimation?: boolean; // enable pulse effect
}
```

---

#### ErrorBoundary

```typescript
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}
```

---

#### LoadingSpinner

```typescript
interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  message?: string;
  fullScreen?: boolean; // center in viewport
  className?: string;
}

interface LoadingSpinnerSizeMap {
  small: 24;
  medium: 48;
  large: 72;
}
```

---

## Context Definitions

### ThemeContext

```typescript
interface ThemeContextValue {
  theme: 'dark' | 'light';
  highContrastMode: boolean;
  reducedMotion: boolean;
  toggleTheme: () => void;
  toggleHighContrast: () => void;
  toggleReducedMotion: () => void;
}

interface ThemeState {
  theme: 'dark' | 'light';
  highContrastMode: boolean;
  reducedMotion: boolean;
}
```

---

### AnalysisContext

```typescript
interface AnalysisContextValue {
  currentAnalysis: AnalysisResult | null;
  isAnalyzing: boolean;
  error: string | null;
  setCurrentAnalysis: (analysis: AnalysisResult) => void;
  clearAnalysis: () => void;
  retryAnalysis: () => void;
}

interface AnalysisState {
  currentAnalysis: AnalysisResult | null;
  isAnalyzing: boolean;
  error: string | null;
}
```

---

## Data Models (from Unit 1 & Unit 2)

### AnalysisResult (Unit 1)

```typescript
interface AnalysisResult {
  id: string;
  entryId: string;
  timestamp: string; // ISO 8601
  emotional: {
    mood: string;
    stressLevel: number; // 0-100
    motivation: number; // 0-100
    confidence: number; // 0-100
  };
  productivity: {
    score: string; // "High", "Medium", "Low"
    focusLevel: string; // "Excellent", "Good", "Improving", "Poor"
  };
  suggestions: string[];
  analysisDuration: number; // milliseconds
  confidence: string; // "high", "medium", "low"
  metadata: {
    wordCount: number;
    keywordMatches: number;
    simplifiedMode: boolean;
  };
}
```

---

### JournalEntry (Unit 2)

```typescript
interface JournalEntry {
  id: string;
  text: string;
  timestamp: string; // ISO 8601
  wordCount: number;
  characterCount: number;
  analysisId?: string; // linked analysis
}
```

---

### HistoryDataPoint (Unit 2)

```typescript
interface HistoryDataPoint {
  date: string; // YYYY-MM-DD
  stress: number; // 0-100 (average for day)
  motivation: number; // 0-100
  confidence: number; // 0-100
  productivity: number; // 0-100
  focus: number; // 0-100
  mood: string; // most common mood for day
  entryCount: number; // number of entries for day
}
```

---

### ChartDataPoint (Unit 2)

```typescript
interface ChartDataPoint {
  date: string; // YYYY-MM-DD
  stress: number;
  motivation: number;
  confidence: number;
  productivity: number;
  focus: number;
  mood: string;
}
```

---

## Form State Models

### JournalFormState

```typescript
interface JournalFormState {
  text: string;
  charCount: number;
  isValid: boolean;
  validationErrors: string[];
  validationWarnings: string[];
  isDirty: boolean;
  isTouched: boolean;
  isSubmitting: boolean;
}

interface JournalFormValidation {
  minLength: number; // 10
  maxLength: number; // 10000
  warningThreshold: number; // 9000 (90%)
  criticalThreshold: number; // 9500 (95%)
}
```

---

### HistoryFilterFormState

```typescript
interface HistoryFilterFormState {
  startDate: Date;
  endDate: Date;
  moodFilter: string[];
  sortBy: 'date' | 'stress' | 'motivation';
  sortOrder: 'asc' | 'desc';
  isValid: boolean;
  errors: string[];
}
```

---

## Animation State Models

### AnimationState

```typescript
interface AnimationState {
  isAnimating: boolean;
  animationPhase: 'idle' | 'enter' | 'active' | 'exit';
  progress: number; // 0-1
}

interface StaggerAnimationState {
  items: AnimationState[];
  currentIndex: number;
  delay: number; // ms between items
}
```

---

## Responsive State Models

### ResponsiveState

```typescript
interface ResponsiveState {
  breakpoint: 'mobile' | 'tablet' | 'desktop';
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

interface BreakpointConfig {
  mobile: { max: 640 };
  tablet: { min: 640, max: 1024 };
  desktop: { min: 1024 };
}
```

---

## Accessibility State Models

### AccessibilityState

```typescript
interface AccessibilityState {
  highContrastMode: boolean;
  reducedMotion: boolean;
  screenReaderActive: boolean;
  keyboardNavigationActive: boolean;
  focusVisible: boolean;
}

interface FocusState {
  focusedElement: HTMLElement | null;
  focusHistory: HTMLElement[];
  trapFocus: boolean; // for modals
}
```

---

## Error State Models

### ErrorState

```typescript
interface ErrorState {
  hasError: boolean;
  error: Error | null;
  errorMessage: string;
  errorType: 'validation' | 'network' | 'analysis' | 'storage' | 'unknown';
  canRetry: boolean;
  retryCount: number;
}

interface ValidationError {
  field: string;
  message: string;
  type: 'required' | 'minLength' | 'maxLength' | 'format' | 'custom';
}
```

---

## Loading State Models

### LoadingState

```typescript
interface LoadingState {
  isLoading: boolean;
  loadingMessage?: string;
  progress?: number; // 0-100 for progress bar
  loadingType: 'spinner' | 'skeleton' | 'progress' | 'none';
}

interface SkeletonState {
  count: number; // number of skeleton items
  variant: 'text' | 'circular' | 'rectangular';
  animation: 'pulse' | 'wave' | 'none';
}
```

---

## Storage State Models

### StorageQuotaState

```typescript
interface StorageQuotaState {
  used: number; // bytes
  available: number; // bytes
  percentage: number; // 0-100
  needsCleanup: boolean;
  needsWarning: boolean;
}
```

---

## Mood Emoji Mapping

```typescript
const MOOD_EMOJI_MAP: Record<string, string> = {
  'Happy': '😊',
  'Sad': '😢',
  'Stressed': '😰',
  'Anxious': '😟',
  'Overwhelmed': '😵',
  'Calm': '😌',
  'Motivated': '💪',
  'Frustrated': '😤',
  'Uncertain': '🤔',
  'Neutral': '😐'
};
```

---

## Color Mapping

```typescript
const METRIC_COLOR_MAP: Record<string, string> = {
  'High': '#10b981', // Green
  'Medium': '#f59e0b', // Yellow
  'Low': '#f97316', // Orange
  'Very Low': '#ef4444' // Red
};

const MOOD_COLOR_MAP: Record<string, string> = {
  'Happy': '#10b981',
  'Calm': '#10b981',
  'Motivated': '#10b981',
  'Neutral': '#6b7280',
  'Uncertain': '#6b7280',
  'Sad': '#ef4444',
  'Stressed': '#f97316',
  'Anxious': '#f97316',
  'Overwhelmed': '#ef4444',
  'Frustrated': '#f97316'
};
```

---

## Validation Constants

```typescript
const VALIDATION_CONSTANTS = {
  JOURNAL_MIN_LENGTH: 10,
  JOURNAL_MAX_LENGTH: 10000,
  JOURNAL_WARNING_THRESHOLD: 9000, // 90%
  JOURNAL_CRITICAL_THRESHOLD: 9500, // 95%
  DEBOUNCE_DELAY: 300, // ms
  VALIDATION_DELAY: 500, // ms
  MAX_SUGGESTIONS: 5,
  MAX_HISTORY_DAYS: 30
};
```

---

## Animation Constants

```typescript
const ANIMATION_CONSTANTS = {
  PAGE_TRANSITION_DURATION: 400, // ms
  FADE_DURATION: 200, // ms
  STAGGER_DELAY: 100, // ms
  SUGGESTION_STAGGER_DELAY: 50, // ms
  HOVER_DURATION: 150, // ms
  CARD_HOVER_DURATION: 200, // ms
  SKELETON_DURATION: 1500, // ms
  PULSE_DURATION: 2000 // ms
};
```

---

## Responsive Constants

```typescript
const RESPONSIVE_CONSTANTS = {
  MOBILE_MAX: 640, // px
  TABLET_MIN: 640, // px
  TABLET_MAX: 1024, // px
  DESKTOP_MIN: 1024, // px
  GRID_COLUMNS_MOBILE: 1,
  GRID_COLUMNS_TABLET: 2,
  GRID_COLUMNS_DESKTOP: 3
};
```

---

**Status**: ✅ Domain Entities Complete
