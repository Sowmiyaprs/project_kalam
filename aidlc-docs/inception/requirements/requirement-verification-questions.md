# Requirements Verification Questions

Please answer the following questions to clarify and validate the requirements for MindMirror AI. Fill in your answer using the letter choice (A, B, C, etc.) after each [Answer]: tag.

---

## Question 1: Sentiment Analysis Approach
You mentioned "lightweight AI logic using keyword-based sentiment analysis". How sophisticated should the emotion detection be?

A) Basic keyword matching (e.g., "stressed" → high stress, "happy" → positive mood)
B) Weighted keyword analysis with context (e.g., "not happy" vs "happy", intensity modifiers like "very")
C) Pattern-based analysis with multiple emotional indicators per text
D) Advanced NLP-lite approach with sentiment scoring algorithms
X) Other (please describe after [Answer]: tag below)

[Answer]: B

---

## Question 2: Mood History Storage
How much mood history should be stored and displayed?

A) Last 7 days only
B) Last 30 days
C) Last 90 days
D) Unlimited history (all entries ever made)
X) Other (please describe after [Answer]: tag below)

[Answer]: B

---

## Question 3: Chart Visualization Details
For the mood history chart, what specific data should be visualized?

A) Mood trends only (emotional state over time)
B) Stress and productivity levels over time
C) All metrics (mood, stress, motivation, productivity, focus) in one chart
D) Multiple separate charts for different metrics
X) Other (please describe after [Answer]: tag below)

[Answer]: C

---

## Question 4: AI Suggestions Logic
How should AI suggestions be generated?

A) Pre-defined suggestions based on detected emotional state categories
B) Dynamic suggestions combining multiple detected factors (stress + motivation + focus)
C) Contextual suggestions that consider previous entries and patterns
D) Simple rule-based suggestions (if stress > 70%, suggest breaks)
X) Other (please describe after [Answer]: tag below)

[Answer]: B

---

## Question 5: Local Storage Structure
What should be stored in local storage?

A) Only analysis results (mood, scores, suggestions)
B) Analysis results + original user text entries
C) Analysis results + text entries + timestamps + metadata
D) Complete session history with all interactions
X) Other (please describe after [Answer]: tag below)

[Answer]: C

---

## Question 6: Responsive Breakpoints
What screen sizes should be specifically optimized?

A) Mobile (320px-768px) and Desktop (769px+) only
B) Mobile, Tablet (768px-1024px), and Desktop (1024px+)
C) Mobile, Tablet, Desktop, and Large Desktop (1440px+)
D) Fluid responsive design without specific breakpoints
X) Other (please describe after [Answer]: tag below)

[Answer]: B

---

## Question 7: Animation Performance
How should animations be handled for performance?

A) Full animations on all devices
B) Reduced animations on mobile devices
C) User preference toggle for animations (enable/disable)
D) Automatic detection and adjustment based on device performance
X) Other (please describe after [Answer]: tag below)

[Answer]: B

---

## Question 8: Error Handling
How should the application handle errors or edge cases?

A) Silent fallbacks (if analysis fails, show generic message)
B) User-friendly error messages with retry options
C) Detailed error logging with user notifications
D) Graceful degradation (show partial results if available)
X) Other (please describe after [Answer]: tag below)

[Answer]: D

---

## Question 9: Accessibility Requirements
What level of accessibility compliance is needed?

A) Basic accessibility (semantic HTML, keyboard navigation)
B) WCAG 2.1 Level A compliance
C) WCAG 2.1 Level AA compliance
D) No specific accessibility requirements
X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 10: Security Extensions
Should security extension rules be enforced for this project?

A) Yes — enforce all SECURITY rules as blocking constraints (recommended for production-grade applications)
B) No — skip all SECURITY rules (suitable for PoCs, prototypes, and experimental projects)
X) Other (please describe after [Answer]: tag below)

[Answer]: B

---

## Question 11: Property-Based Testing Extension
Should property-based testing (PBT) rules be enforced for this project?

A) Yes — enforce all PBT rules as blocking constraints (recommended for projects with business logic, data transformations, serialization, or stateful components)
B) Partial — enforce PBT rules only for pure functions and serialization round-trips (suitable for projects with limited algorithmic complexity)
C) No — skip all PBT rules (suitable for simple CRUD applications, UI-only projects, or thin integration layers with no significant business logic)
X) Other (please describe after [Answer]: tag below)

[Answer]: C

---

## Question 12: Text Input Limits
Should there be any limits on the journal/thought input?

A) No limits (unlimited text input)
B) Character limit (e.g., 5000 characters)
C) Word limit (e.g., 1000 words)
D) Soft limit with warning (allow more but warn user)
X) Other (please describe after [Answer]: tag below)

[Answer]: D

---

## Question 13: Export/Import Functionality
Should users be able to export or import their data?

A) Yes — export to JSON format
B) Yes — export to multiple formats (JSON, CSV, PDF)
C) No export functionality needed
D) Export only (no import)
X) Other (please describe after [Answer]: tag below)

[Answer]: D

---

## Question 14: Browser Compatibility
Which browsers should be supported?

A) Modern browsers only (Chrome, Firefox, Safari, Edge - latest 2 versions)
B) Extended support (include older versions, IE11)
C) Chrome and Firefox only
D) All major browsers with graceful degradation
X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Instructions
1. Fill in your answer choice (A, B, C, D, or X) after each [Answer]: tag
2. If you choose X (Other), please describe your preference after the [Answer]: tag
3. Save this file when complete
4. Let me know when you're done answering all questions

