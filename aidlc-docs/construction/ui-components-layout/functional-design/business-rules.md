# Business Rules - UI Components & Layout

**Unit**: UI Components & Layout  
**Phase**: CONSTRUCTION - Functional Design  
**Date**: 2026-05-06

---

## Overview

This document defines all business rules, validation logic, and constraints for the UI Components & Layout unit. Rules are organized by category and numbered for reference.

**Total Rules**: 92

---

## Category 1: Input Validation Rules (10 rules)

### BR-INPUT-001: Minimum Text Length
**Rule**: Journal entry text MUST be at least 10 characters long  
**Validation**: `text.trim().length >= 10`  
**Error Message**: "Minimum 10 characters required"  
**Enforcement**: Submit button disabled until valid

### BR-INPUT-002: Maximum Text Length
**Rule**: Journal entry text MUST NOT exceed 10,000 characters  
**Validation**: `text.length <= 10000`  
**Error Message**: "Maximum 10,000 characters allowed"  
**Enforcement**: Hard limit (prevent typing beyond max)

### BR-INPUT-003: Empty Input Prevention
**Rule**: Journal entry text MUST NOT be empty or whitespace-only  
**Validation**: `text.trim().length > 0`  
**Error Message**: "Please enter some text"  
**Enforcement**: Submit button disabled

### BR-INPUT-004: Script Tag Removal
**Rule**: All `<script>` tags MUST be removed from input  
**Validation**: `text.replace(/<script[^>]*>.*?<\/script>/gi, '')`  
**Enforcement**: Automatic sanitization before save

### BR-INPUT-005: HTML Tag Removal
**Rule**: All HTML tags MUST be removed from input  
**Validation**: `text.replace(/<[^>]+>/g, '')`  
**Enforcement**: Automatic sanitization before save

### BR-INPUT-006: Character Count Display
**Rule**: Character count MUST be displayed in real-time  
**Validation**: Update on every keystroke  
**Display Format**: "{count} / 10,000 characters"

### BR-INPUT-007: Warning Threshold
**Rule**: Show yellow warning when text length >= 9,000 characters (90%)  
**Validation**: `text.length >= 9000`  
**Warning Message**: "Approaching character limit"

### BR-INPUT-008: Critical Threshold
**Rule**: Show red warning when text length >= 9,500 characters (95%)  
**Validation**: `text.length >= 9500`  
**Warning Message**: "Near maximum character limit"

### BR-INPUT-009: Maximum Reached
**Rule**: Show red error when text length = 10,000 characters  
**Validation**: `text.length === 10000`  
**Error Message**: "Maximum character limit reached"

### BR-INPUT-010: Whitespace Normalization
**Rule**: Multiple consecutive spaces MUST be normalized to single space  
**Validation**: `text.replace(/\s+/g, ' ')`  
**Enforcement**: Automatic normalization before analysis

---

## Category 2: Form Handling Rules (8 rules)

### BR-FORM-001: Debounced Input
**Rule**: Text input MUST be debounced with 300ms delay  
**Rationale**: Improve performance for large text  
**Implementation**: Use debounced onChange handler

### BR-FORM-002: Debounced Validation
**Rule**: Validation MUST be debounced with 500ms delay  
**Rationale**: Avoid excessive validation during typing  
**Implementation**: Validate after user stops typing

### BR-FORM-003: Submit Button State
**Rule**: Submit button MUST be disabled when input is invalid  
**Validation**: `isValid === false`  
**Visual Indicator**: Grayed out, cursor not-allowed

### BR-FORM-004: Submit on Enter
**Rule**: Ctrl+Enter keyboard shortcut MUST submit form  
**Implementation**: Listen for Ctrl+Enter keypress  
**Accessibility**: Announced to screen readers

### BR-FORM-005: Focus Management
**Rule**: Textarea MUST receive focus on page load (AnalysisPage)  
**Implementation**: `autoFocus` prop on textarea  
**Accessibility**: Skip navigation link available

### BR-FORM-006: Error Display
**Rule**: Validation errors MUST be displayed inline below textarea  
**Format**: Red text with error icon  
**Accessibility**: `aria-describedby` linking error to input

### BR-FORM-007: Dirty State Tracking
**Rule**: Form MUST track if user has made changes  
**Implementation**: Set `isDirty = true` on first change  
**Usage**: Warn user before navigation if dirty

### BR-FORM-008: Form Reset
**Rule**: Form MUST reset after successful submission  
**Implementation**: Clear text, reset validation state  
**User Feedback**: Show success message

---

## Category 3: Navigation Rules (6 rules)

### BR-NAV-001: Active Route Indicator
**Rule**: Active navigation link MUST be visually highlighted  
**Visual**: Underline, different color, or glow effect  
**Accessibility**: `aria-current="page"` attribute

### BR-NAV-002: Navigation During Analysis
**Rule**: User MUST be allowed to navigate during analysis  
**Behavior**: Analysis continues in background  
**Implementation**: Don't block navigation, use context to maintain state

### BR-NAV-003: Page Transition Animation
**Rule**: Page transitions MUST use fade animation (400ms total)  
**Timing**: Fade out 200ms, fade in 200ms  
**Accessibility**: Respect `prefers-reduced-motion`

### BR-NAV-004: Mobile Navigation
**Rule**: Mobile devices MUST use bottom navigation bar  
**Breakpoint**: < 640px (mobile)  
**Position**: Fixed at bottom, always visible

### BR-NAV-005: Desktop Navigation
**Rule**: Desktop devices MUST use top navigation bar  
**Breakpoint**: >= 640px (tablet and desktop)  
**Position**: Fixed at top, always visible

### BR-NAV-006: Lazy Loading
**Rule**: AnalysisPage and HistoryPage MUST be lazy loaded  
**Implementation**: `React.lazy()` with Suspense  
**Fallback**: Loading spinner during load

---

## Category 4: Display Formatting Rules (12 rules)

### BR-DISPLAY-001: Metric Percentage Format
**Rule**: Metric scores MUST be displayed as percentage  
**Format**: "{value}%"  
**Example**: "75%"

### BR-DISPLAY-002: Metric Category Label
**Rule**: Metric scores MUST include category label  
**Categories**: "High" (75-100), "Medium" (50-74), "Low" (25-49), "Very Low" (0-24)  
**Format**: "{percentage} - {category}"  
**Example**: "75% - High"

### BR-DISPLAY-003: Metric Color Coding
**Rule**: Metric scores MUST be color-coded by category  
**Colors**: High=Green, Medium=Yellow, Low=Orange, Very Low=Red  
**Implementation**: Apply color to text and background

### BR-DISPLAY-004: Mood Emoji Display
**Rule**: Mood MUST be displayed with emoji  
**Format**: "{emoji} {mood}"  
**Example**: "😊 Happy"  
**Mapping**: See MOOD_EMOJI_MAP in domain-entities.md

### BR-DISPLAY-005: Mood Color Badge
**Rule**: Mood MUST be displayed in color-coded badge  
**Colors**: Positive=Green, Neutral=Gray, Negative=Red/Orange  
**Implementation**: Badge component with variant

### BR-DISPLAY-006: Relative Timestamp
**Rule**: Timestamps MUST be displayed as relative time  
**Format**: "X minutes/hours/days ago"  
**Examples**: "2 hours ago", "Yesterday", "3 days ago"

### BR-DISPLAY-007: Absolute Timestamp Tooltip
**Rule**: Relative timestamps MUST show absolute time on hover  
**Format**: "MMM DD, YYYY at HH:MM AM/PM"  
**Example**: "May 6, 2026 at 3:30 PM"  
**Implementation**: Tooltip or title attribute

### BR-DISPLAY-008: Suggestions List Limit
**Rule**: Display maximum 5 suggestions by default  
**Expandable**: Show "View More" if > 5 suggestions  
**Implementation**: Collapsible list

### BR-DISPLAY-009: Empty State Display
**Rule**: Empty states MUST show illustration + message + CTA  
**Components**: Icon/illustration, descriptive text, action button  
**Example**: "No entries yet" + "Start Your First Entry" button

### BR-DISPLAY-010: Loading State Display
**Rule**: Loading states MUST use skeleton screens  
**Rationale**: Better UX than spinners  
**Implementation**: Placeholder UI matching final layout

### BR-DISPLAY-011: Error Message Display
**Rule**: Error messages MUST be user-friendly (no technical jargon)  
**Format**: Clear description + action to resolve  
**Example**: "Analysis failed. Please try again." + Retry button

### BR-DISPLAY-012: Success Message Display
**Rule**: Success messages MUST be displayed as toast notifications  
**Duration**: 3 seconds auto-dismiss  
**Position**: Top-right corner  
**Accessibility**: `aria-live="polite"`

---

## Category 5: Responsive Design Rules (9 rules)

### BR-RESPONSIVE-001: Mobile Layout
**Rule**: Mobile devices MUST use single-column layout  
**Breakpoint**: < 640px  
**Implementation**: Stack all components vertically

### BR-RESPONSIVE-002: Tablet Layout
**Rule**: Tablet devices MUST use two-column layout where appropriate  
**Breakpoint**: 640px - 1024px  
**Implementation**: Side-by-side for some components

### BR-RESPONSIVE-003: Desktop Layout
**Rule**: Desktop devices MUST use multi-column layout  
**Breakpoint**: >= 1024px  
**Implementation**: Three-column grid for dashboard

### BR-RESPONSIVE-004: Dashboard Grid
**Rule**: Dashboard grid MUST adapt to screen size  
**Mobile**: 1 column, **Tablet**: 2 columns, **Desktop**: 3 columns  
**Implementation**: Tailwind grid classes

### BR-RESPONSIVE-005: Image Responsiveness
**Rule**: All images MUST be responsive  
**Implementation**: `srcset` for different sizes, `loading="lazy"`  
**Formats**: WebP with PNG/JPG fallback

### BR-RESPONSIVE-006: Touch Targets
**Rule**: Touch targets MUST be at least 44x44px on mobile  
**Rationale**: Accessibility and usability  
**Implementation**: Minimum button/link size

### BR-RESPONSIVE-007: Font Scaling
**Rule**: Font sizes MUST scale with viewport  
**Implementation**: Tailwind responsive text classes  
**Example**: `text-sm md:text-base lg:text-lg`

### BR-RESPONSIVE-008: Spacing Scaling
**Rule**: Spacing MUST scale with viewport  
**Implementation**: Tailwind responsive spacing classes  
**Example**: `p-4 md:p-6 lg:p-8`

### BR-RESPONSIVE-009: Chart Responsiveness
**Rule**: Charts MUST adapt to container width  
**Implementation**: Recharts ResponsiveContainer  
**Height**: Fixed on mobile, flexible on desktop

---

## Category 6: Animation Rules (7 rules)

### BR-ANIMATION-001: Stagger Effect
**Rule**: Analysis results MUST animate in with stagger effect  
**Delay**: 100ms between each metric  
**Duration**: 200ms per metric  
**Total**: ~1.2 seconds for all metrics

### BR-ANIMATION-002: Suggestions Animation
**Rule**: Suggestions MUST animate in after metrics  
**Delay**: 600ms (after all metrics)  
**Stagger**: 50ms between each suggestion  
**Duration**: 300ms per suggestion

### BR-ANIMATION-003: Reduced Motion
**Rule**: Animations MUST respect `prefers-reduced-motion`  
**Implementation**: Disable animations if user prefers reduced motion  
**Fallback**: Instant display (no animation)

### BR-ANIMATION-004: Hover Effects
**Rule**: Interactive elements MUST have hover effects  
**Buttons**: Scale 1.05, glow effect  
**Cards**: Translate up 4px, shadow increase  
**Duration**: 150-200ms

### BR-ANIMATION-005: Loading Animation
**Rule**: Loading states MUST use skeleton pulse animation  
**Duration**: 1.5 seconds per cycle  
**Implementation**: Tailwind `animate-pulse` or custom

### BR-ANIMATION-006: Page Transition
**Rule**: Page transitions MUST be smooth and quick  
**Duration**: 400ms total (200ms out, 200ms in)  
**Easing**: ease-in-out

### BR-ANIMATION-007: Framer Motion Usage
**Rule**: Use Framer Motion for complex animations, CSS for simple  
**Complex**: Stagger, orchestration, gestures  
**Simple**: Hover, focus, transitions

---

## Category 7: Accessibility Rules (15 rules)

### BR-A11Y-001: Keyboard Navigation
**Rule**: All interactive elements MUST be keyboard accessible  
**Implementation**: Proper tab order, focus management  
**Testing**: Tab through entire page

### BR-A11Y-002: Focus Indicators
**Rule**: Focused elements MUST have visible focus ring  
**Style**: 2px solid, theme color  
**High Contrast**: Increased visibility in high contrast mode

### BR-A11Y-003: ARIA Labels
**Rule**: All interactive elements MUST have descriptive ARIA labels  
**Implementation**: `aria-label` or `aria-labelledby`  
**Example**: `<button aria-label="Submit journal entry">`

### BR-A11Y-004: ARIA Live Regions
**Rule**: Dynamic content MUST use ARIA live regions  
**Analysis Results**: `aria-live="polite"`  
**Error Messages**: `aria-live="assertive"`

### BR-A11Y-005: Skip Navigation
**Rule**: Page MUST include skip navigation link  
**Implementation**: "Skip to main content" link at top  
**Visibility**: Hidden visually, visible to screen readers

### BR-A11Y-006: Semantic HTML
**Rule**: Use semantic HTML elements  
**Elements**: `<nav>`, `<main>`, `<article>`, `<section>`, `<button>`  
**Rationale**: Better screen reader support

### BR-A11Y-007: Form Labels
**Rule**: All form inputs MUST have associated labels  
**Implementation**: `<label>` element or `aria-label`  
**Error Association**: `aria-describedby` for errors

### BR-A11Y-008: Color Contrast
**Rule**: Text MUST have contrast ratio >= 7:1 (WCAG AAA)  
**Implementation**: White on dark, dark on light  
**Testing**: Use contrast checker tool

### BR-A11Y-009: Text Shadows
**Rule**: Neon text MUST have shadows for readability  
**Implementation**: `text-shadow` for better visibility  
**High Contrast Mode**: Remove shadows, increase contrast

### BR-A11Y-010: High Contrast Mode
**Rule**: App MUST support high contrast mode toggle  
**Implementation**: Remove glassmorphism, increase contrast  
**Persistence**: Save preference to localStorage

### BR-A11Y-011: Alt Text
**Rule**: All images MUST have descriptive alt text  
**Implementation**: `alt` attribute on `<img>`  
**Decorative Images**: `alt=""` (empty string)

### BR-A11Y-012: Heading Hierarchy
**Rule**: Headings MUST follow proper hierarchy (h1 → h2 → h3)  
**Implementation**: Don't skip levels  
**Rationale**: Screen reader navigation

### BR-A11Y-013: Button vs Link
**Rule**: Use `<button>` for actions, `<a>` for navigation  
**Button**: Triggers action (submit, toggle)  
**Link**: Navigates to different page/section

### BR-A11Y-014: Keyboard Shortcuts
**Rule**: Keyboard shortcuts MUST be documented and accessible  
**Shortcuts**: Ctrl+Enter (submit), Escape (close modal)  
**Documentation**: Help section or tooltip

### BR-A11Y-015: Screen Reader Announcements
**Rule**: Important state changes MUST be announced  
**Implementation**: ARIA live regions, status messages  
**Examples**: "Analysis complete", "Entry saved"

---

## Category 8: Error Handling Rules (10 rules)

### BR-ERROR-001: Analysis Failure
**Rule**: If analysis fails, show error + retry button  
**Message**: "Analysis failed. Please try again."  
**Action**: Retry with same text  
**Fallback**: Suggest shorter text if retry fails

### BR-ERROR-002: Save Failure
**Rule**: If save fails, show error + manual retry  
**Message**: "Failed to save entry. Please try again."  
**Action**: Manual retry button  
**Persistence**: Keep analysis results visible

### BR-ERROR-003: Network Error
**Rule**: If network error (shouldn't happen in offline app), show error  
**Message**: "Connection error. Please check your internet."  
**Action**: Retry button  
**Note**: Should not occur in this app (no network calls)

### BR-ERROR-004: Storage Quota Error
**Rule**: If storage quota exceeded, show error + cleanup option  
**Message**: "Storage full. Old entries will be removed."  
**Action**: Automatic cleanup (Unit 2)  
**User Control**: Manual export before cleanup

### BR-ERROR-005: Validation Error
**Rule**: Validation errors MUST be displayed inline  
**Position**: Below input field  
**Style**: Red text with error icon  
**Accessibility**: `aria-describedby`

### BR-ERROR-006: Error Boundary
**Rule**: Unexpected errors MUST be caught by ErrorBoundary  
**Fallback**: User-friendly error page  
**Action**: "Reload Page" button  
**Logging**: Log error to console (no user data)

### BR-ERROR-007: Retry Logic
**Rule**: Failed operations MUST support retry  
**Max Retries**: 3 attempts  
**Backoff**: Exponential (100ms, 200ms, 400ms)  
**User Feedback**: Show retry count

### BR-ERROR-008: Error Recovery
**Rule**: App MUST recover gracefully from errors  
**Implementation**: Don't crash, show error, allow retry  
**State**: Preserve user data when possible

### BR-ERROR-009: Error Messages
**Rule**: Error messages MUST be user-friendly  
**Avoid**: Technical jargon, stack traces  
**Include**: Clear description, action to resolve

### BR-ERROR-010: Error Logging
**Rule**: Errors MUST be logged to console (development only)  
**Production**: No logging (privacy)  
**Content**: Error type, message (no user data)

---

## Category 9: Performance Rules (8 rules)

### BR-PERF-001: Component Memoization
**Rule**: Expensive components MUST be memoized  
**Components**: AnalysisResults, MoodHistoryChart, MetricCard  
**Implementation**: `React.memo()`

### BR-PERF-002: Computation Memoization
**Rule**: Expensive computations MUST be memoized  
**Implementation**: `useMemo` for filtered data, aggregated stats  
**Dependency**: Re-compute only when dependencies change

### BR-PERF-003: Callback Memoization
**Rule**: Event handlers passed to children MUST be memoized  
**Implementation**: `useCallback`  
**Rationale**: Prevent unnecessary re-renders

### BR-PERF-004: Lazy Loading
**Rule**: Non-critical pages MUST be lazy loaded  
**Pages**: AnalysisPage, HistoryPage  
**Implementation**: `React.lazy()` with Suspense

### BR-PERF-005: Image Lazy Loading
**Rule**: All images MUST use lazy loading  
**Implementation**: `loading="lazy"` attribute  
**Rationale**: Improve initial page load

### BR-PERF-006: Debounced Input
**Rule**: Text input MUST be debounced  
**Delay**: 300ms  
**Rationale**: Reduce re-renders during typing

### BR-PERF-007: Virtual Scrolling
**Rule**: Long lists (> 100 items) SHOULD use virtual scrolling  
**Implementation**: React Virtualized or similar  
**Note**: May not be needed for 30-day history

### BR-PERF-008: Bundle Size
**Rule**: Main bundle MUST be < 500KB (gzipped)  
**Implementation**: Code splitting, tree shaking  
**Monitoring**: Check bundle size in build

---

## Category 10: State Management Rules (7 rules)

### BR-STATE-001: Context for Global State
**Rule**: Use Context API for theme and current analysis  
**Contexts**: ThemeContext, AnalysisContext  
**Rationale**: Avoid prop drilling

### BR-STATE-002: Local State for Features
**Rule**: Use local state (useState) for component-specific state  
**Examples**: Form state, UI toggles, local loading states  
**Rationale**: Keep state close to where it's used

### BR-STATE-003: Persistent State
**Rule**: Analysis results MUST persist in localStorage  
**Implementation**: Save to localStorage via Unit 2  
**Rationale**: Persist across sessions

### BR-STATE-004: State Initialization
**Rule**: State MUST be initialized with sensible defaults  
**Examples**: Empty strings, null for optional data, false for booleans  
**Rationale**: Avoid undefined errors

### BR-STATE-005: State Updates
**Rule**: State updates MUST be immutable  
**Implementation**: Use spread operator, don't mutate directly  
**Example**: `setState({ ...state, newProp: value })`

### BR-STATE-006: Derived State
**Rule**: Avoid storing derived state  
**Implementation**: Calculate derived values in render  
**Example**: `charCount = text.length` (don't store separately)

### BR-STATE-007: State Cleanup
**Rule**: Clean up state on component unmount  
**Implementation**: Return cleanup function from useEffect  
**Example**: Clear timers, cancel subscriptions

---

## Category 11: Testing Rules (7 rules)

### BR-TEST-001: Manual Testing Checklist
**Rule**: Each component MUST have manual testing checklist  
**Documentation**: In Build and Test stage  
**Coverage**: All user interactions, edge cases

### BR-TEST-002: Visual Regression Testing
**Rule**: Visual changes MUST be tested  
**Method**: Screenshot comparison  
**Tools**: Manual or automated (Percy, Chromatic)

### BR-TEST-003: Accessibility Testing
**Rule**: Accessibility MUST be tested  
**Checklist**: WCAG 2.1 AAA compliance  
**Tools**: axe DevTools, Lighthouse

### BR-TEST-004: Responsive Testing
**Rule**: All breakpoints MUST be tested  
**Devices**: Mobile (< 640px), Tablet (640-1024px), Desktop (>= 1024px)  
**Method**: Browser DevTools, real devices

### BR-TEST-005: Browser Testing
**Rule**: App MUST be tested on all target browsers  
**Browsers**: Chrome, Firefox, Safari, Edge (latest 2 versions)  
**Method**: Manual testing or BrowserStack

### BR-TEST-006: Keyboard Testing
**Rule**: Keyboard navigation MUST be tested  
**Method**: Tab through entire app, test shortcuts  
**Coverage**: All interactive elements

### BR-TEST-007: Screen Reader Testing
**Rule**: Screen reader support MUST be tested  
**Tools**: NVDA (Windows), VoiceOver (Mac), JAWS  
**Coverage**: All pages, dynamic content

---

## Category 12: Security Rules (5 rules)

### BR-SECURITY-001: Input Sanitization
**Rule**: All user input MUST be sanitized  
**Implementation**: Remove script tags, HTML tags  
**Enforcement**: Before save and display

### BR-SECURITY-002: XSS Prevention
**Rule**: Prevent cross-site scripting attacks  
**Implementation**: React's built-in escaping, sanitization  
**Testing**: Try injecting script tags

### BR-SECURITY-003: No Inline Scripts
**Rule**: No inline JavaScript in HTML  
**Implementation**: Use external scripts only  
**Rationale**: Content Security Policy

### BR-SECURITY-004: No Eval
**Rule**: Never use `eval()` or `Function()` constructor  
**Rationale**: Security risk  
**Alternative**: Use safe parsing methods

### BR-SECURITY-005: Data Privacy
**Rule**: All data MUST stay client-side  
**Implementation**: No network calls, localStorage only  
**Rationale**: User privacy

---

## Category 13: UI/UX Rules (8 rules)

### BR-UX-001: Loading Feedback
**Rule**: All async operations MUST show loading feedback  
**Implementation**: Skeleton screens, spinners, progress bars  
**Duration**: Show immediately, no delay

### BR-UX-002: Success Feedback
**Rule**: Successful operations MUST show confirmation  
**Implementation**: Toast notification, success message  
**Duration**: 3 seconds auto-dismiss

### BR-UX-003: Error Feedback
**Rule**: Failed operations MUST show error message  
**Implementation**: Error banner, toast, inline message  
**Action**: Include retry or resolution action

### BR-UX-004: Disabled State
**Rule**: Disabled elements MUST be visually distinct  
**Style**: Grayed out, reduced opacity, cursor not-allowed  
**Accessibility**: `aria-disabled="true"`

### BR-UX-005: Hover Feedback
**Rule**: Interactive elements MUST have hover feedback  
**Implementation**: Color change, scale, glow effect  
**Duration**: 150-200ms transition

### BR-UX-006: Active State
**Rule**: Clicked elements MUST show active state  
**Implementation**: Scale down, color change  
**Duration**: Instant (no transition)

### BR-UX-007: Empty States
**Rule**: Empty states MUST be informative and actionable  
**Components**: Illustration, message, CTA button  
**Tone**: Encouraging, not negative

### BR-UX-008: Consistency
**Rule**: UI patterns MUST be consistent across app  
**Examples**: Button styles, spacing, colors, animations  
**Rationale**: Predictability, learnability

---

## Rule Enforcement Summary

**Critical Rules** (must be enforced):
- All input validation rules (BR-INPUT-001 to BR-INPUT-010)
- All security rules (BR-SECURITY-001 to BR-SECURITY-005)
- All accessibility rules (BR-A11Y-001 to BR-A11Y-015)

**High Priority Rules** (should be enforced):
- Form handling rules
- Error handling rules
- Responsive design rules

**Medium Priority Rules** (recommended):
- Animation rules
- Performance rules
- UX rules

**Low Priority Rules** (nice to have):
- Testing rules (documented for Build and Test stage)

---

**Status**: ✅ Business Rules Complete
