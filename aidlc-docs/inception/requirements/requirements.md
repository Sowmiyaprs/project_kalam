# MindMirror AI - Requirements Document

**Project**: MindMirror AI  
**Type**: Greenfield React Web Application  
**Date**: 2026-05-06  
**Status**: Approved (Pending)

---

## Intent Analysis Summary

### User Request
Build a complete futuristic AI web application for emotional and productivity analysis where users can journal their thoughts and receive intelligent feedback on their emotional state and productivity patterns.

### Request Type
**New Project** - Greenfield web application

### Scope Estimate
**Multiple Components** - Full-stack frontend application with multiple interconnected features (journal input, AI analysis engine, visualization, history management, data persistence)

### Complexity Estimate
**Moderate** - Clear implementation path with well-defined features, but requires careful integration of multiple subsystems (sentiment analysis, data visualization, local storage, responsive UI with animations)

---

## 1. Functional Requirements

### 1.1 Core Features

#### FR-1: Journal Input System
- **FR-1.1**: Large, prominent text input area for users to type thoughts, journal entries, stress updates, work updates, or daily feelings
- **FR-1.2**: Soft character limit with warning notification (allow users to continue typing but warn when approaching reasonable limits)
- **FR-1.3**: Real-time character/word count display
- **FR-1.4**: Input validation and sanitization

#### FR-2: AI-Powered Sentiment Analysis Engine
- **FR-2.1**: Weighted keyword analysis with contextual understanding
  - Detect negations (e.g., "not happy" vs "happy")
  - Recognize intensity modifiers (e.g., "very stressed", "slightly worried")
  - Handle compound emotions in single text
- **FR-2.2**: Analyze and detect the following metrics:
  - **Mood**: Emotional state classification (e.g., Happy, Anxious, Calm, Stressed, Motivated, Neutral)
  - **Stress Level**: Percentage score (0-100%)
  - **Motivation**: Percentage score (0-100%)
  - **Confidence**: Percentage score (0-100%)
  - **Productivity Score**: Percentage or categorical rating (Low/Medium/High)
  - **Focus Level**: Categorical rating (Poor/Improving/Good/Excellent)
- **FR-2.3**: Lightweight implementation using keyword-based pattern matching (no complex ML models)
- **FR-2.4**: Fast analysis response time (< 500ms for typical journal entries)

#### FR-3: AI Suggestions Generator
- **FR-3.1**: Generate intelligent, personalized self-improvement tips based on analysis
- **FR-3.2**: Dynamic suggestion logic combining multiple detected factors:
  - Consider stress + motivation + focus levels together
  - Provide actionable recommendations
  - Vary suggestions based on emotional state combinations
- **FR-3.3**: Suggestion categories:
  - Stress management techniques
  - Productivity improvement tips
  - Focus enhancement strategies
  - Motivation boosters
  - Work-life balance recommendations
- **FR-3.4**: Display 3-5 relevant suggestions per analysis

#### FR-4: Animated Productivity Meter
- **FR-4.1**: Visual meter/gauge displaying current productivity score
- **FR-4.2**: Smooth animations when values update
- **FR-4.3**: Color-coded visualization (e.g., red for low, yellow for medium, green for high)
- **FR-4.4**: Interactive hover effects

#### FR-5: Mood History Chart
- **FR-5.1**: Visualize all metrics (mood, stress, motivation, productivity, focus) in one comprehensive chart
- **FR-5.2**: Display last 30 days of mood history
- **FR-5.3**: Interactive chart with tooltips showing detailed data points
- **FR-5.4**: Time-series line chart using Recharts library
- **FR-5.5**: Legend to distinguish between different metrics
- **FR-5.6**: Zoom and pan capabilities for detailed analysis

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

### 1.2 User Interface Pages

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

---

## 2. Non-Functional Requirements

### 2.1 Performance

#### NFR-1: Response Time
- **NFR-1.1**: Sentiment analysis completes in < 500ms for entries up to 5000 characters
- **NFR-1.2**: Page load time < 2 seconds on standard broadband connection
- **NFR-1.3**: Smooth animations at 60fps on desktop devices
- **NFR-1.4**: Reduced animation complexity on mobile devices for performance

#### NFR-2: Scalability
- **NFR-2.1**: Handle local storage up to 10MB (approximately 30 days of detailed entries)
- **NFR-2.2**: Efficient data retrieval and rendering for 30-day history charts

### 2.2 Usability

#### NFR-3: User Experience
- **NFR-3.1**: Intuitive, self-explanatory interface requiring no user manual
- **NFR-3.2**: Clear visual feedback for all user actions
- **NFR-3.3**: Consistent design language across all pages
- **NFR-3.4**: Smooth transitions between pages and states

#### NFR-4: Accessibility
- **NFR-4.1**: Basic accessibility compliance:
  - Semantic HTML5 elements
  - Keyboard navigation support for all interactive elements
  - Sufficient color contrast for text readability
  - Focus indicators for keyboard users
  - Alt text for any decorative images
- **NFR-4.2**: Screen reader friendly structure

### 2.3 Compatibility

#### NFR-5: Browser Support
- **NFR-5.1**: Support modern browsers (latest 2 versions):
  - Google Chrome
  - Mozilla Firefox
  - Safari
  - Microsoft Edge
- **NFR-5.2**: No support required for Internet Explorer or older browser versions

#### NFR-6: Device Support
- **NFR-6.1**: Fully responsive design with optimized layouts for:
  - **Mobile**: 320px - 768px
  - **Tablet**: 768px - 1024px
  - **Desktop**: 1024px and above
- **NFR-6.2**: Touch-friendly interface for mobile and tablet devices
- **NFR-6.3**: Optimized animations for mobile (reduced complexity)

### 2.4 Reliability

#### NFR-7: Error Handling
- **NFR-7.1**: Graceful degradation approach:
  - If analysis fails, show partial results if available
  - If chart rendering fails, show tabular data as fallback
  - If local storage is full, notify user and offer to clear old data
- **NFR-7.2**: No application crashes - all errors handled gracefully
- **NFR-7.3**: User-friendly error messages (no technical jargon)

#### NFR-8: Data Integrity
- **NFR-8.1**: Validate all data before storing in local storage
- **NFR-8.2**: Handle local storage quota exceeded scenarios
- **NFR-8.3**: Prevent data corruption with proper serialization/deserialization

### 2.5 Maintainability

#### NFR-9: Code Quality
- **NFR-9.1**: Clean, well-organized folder structure
- **NFR-9.2**: Reusable React components following single responsibility principle
- **NFR-9.3**: Proper code comments explaining complex logic
- **NFR-9.4**: Beginner-friendly code structure
- **NFR-9.5**: Consistent naming conventions
- **NFR-9.6**: No complex dependencies or over-engineering

#### NFR-10: Documentation
- **NFR-10.1**: Comprehensive README with:
  - Project overview
  - Installation instructions
  - How to run locally
  - Project structure explanation
  - Technology stack details
- **NFR-10.2**: Deployment guide for Vercel
- **NFR-10.3**: Inline code comments for sentiment analysis logic

---

## 3. Technical Requirements

### 3.1 Technology Stack

#### Tech-1: Frontend Framework
- **React** (latest stable version)
- JavaScript only (no TypeScript)
- Functional components with React Hooks

#### Tech-2: Styling
- **Tailwind CSS** for utility-first styling
- Custom CSS for complex animations if needed
- Dark theme as default
- Glassmorphism effects
- Neon glow effects for futuristic appearance

#### Tech-3: Animation Library
- **Framer Motion** for smooth animations and transitions
- Animated cards, buttons, and page transitions
- Floating effects and hover animations

#### Tech-4: Data Visualization
- **Recharts** for mood history charts
- Responsive charts that adapt to screen size

#### Tech-5: State Management
- React Context API or useState/useReducer (no Redux required)
- Local storage for persistence

#### Tech-6: Build Tool
- Vite or Create React App
- Fast development server
- Optimized production builds

### 3.2 Architecture Constraints

#### Arch-1: No Backend Required
- Pure frontend application
- No server-side logic
- No authentication system
- No external database

#### Arch-2: Lightweight Implementation
- Minimal dependencies
- Fast load times
- Small bundle size
- No heavy ML libraries

#### Arch-3: Deployment Ready
- Static site deployment compatible
- Vercel deployment optimized
- Environment-agnostic (no server configuration needed)

---

## 4. Design Requirements

### 4.1 Visual Design

#### Design-1: Futuristic AI Dashboard Aesthetic
- **Design-1.1**: Dark theme with deep blacks and dark grays
- **Design-1.2**: Glassmorphism effects (frosted glass appearance with backdrop blur)
- **Design-1.3**: Neon glow effects on interactive elements (cyan, purple, pink accents)
- **Design-1.4**: Premium, modern appearance with high-end feel
- **Design-1.5**: Sci-fi inspired UI elements

#### Design-2: Typography
- **Design-2.1**: Elegant, modern font families (e.g., Inter, Poppins, or similar)
- **Design-2.2**: Clear hierarchy with varied font weights
- **Design-2.3**: Readable font sizes across all devices

#### Design-3: Interactive Elements
- **Design-3.1**: Glowing buttons with hover effects
- **Design-3.2**: Animated cards with subtle floating animations
- **Design-3.3**: Smooth hover transitions (scale, glow, color shifts)
- **Design-3.4**: Micro-interactions for user feedback

#### Design-4: Layout
- **Design-4.1**: Spacious, uncluttered layouts
- **Design-4.2**: Card-based design system
- **Design-4.3**: Consistent spacing and padding
- **Design-4.4**: Visual hierarchy guiding user attention

---

## 5. Data Requirements

### 5.1 Data Models

#### Data-1: Journal Entry
```javascript
{
  id: string (UUID),
  text: string,
  timestamp: ISO 8601 datetime,
  characterCount: number,
  wordCount: number
}
```

#### Data-2: Analysis Result
```javascript
{
  id: string (UUID),
  entryId: string (reference to Journal Entry),
  timestamp: ISO 8601 datetime,
  mood: string (e.g., "Happy", "Anxious", "Calm"),
  stressLevel: number (0-100),
  motivation: number (0-100),
  confidence: number (0-100),
  productivityScore: string ("Low" | "Medium" | "High"),
  focusLevel: string ("Poor" | "Improving" | "Good" | "Excellent"),
  suggestions: array of strings,
  analysisDuration: number (milliseconds)
}
```

#### Data-3: Local Storage Structure
```javascript
{
  entries: [Journal Entry objects],
  analyses: [Analysis Result objects],
  settings: {
    animationsEnabled: boolean,
    lastCleanupDate: ISO 8601 datetime
  },
  version: string
}
```

---

## 6. Sentiment Analysis Logic Requirements

### 6.1 Keyword Categories

#### Sentiment-1: Stress Indicators
- **High Stress Keywords**: stressed, overwhelmed, anxious, pressure, deadline, panic, worried, tense
- **Low Stress Keywords**: calm, relaxed, peaceful, easy, comfortable, chill

#### Sentiment-2: Motivation Indicators
- **High Motivation Keywords**: motivated, driven, determined, goal, achieve, improve, excited, ambitious
- **Low Motivation Keywords**: unmotivated, lazy, tired, exhausted, drained, apathetic

#### Sentiment-3: Productivity Indicators
- **High Productivity Keywords**: productive, accomplished, completed, finished, efficient, focused, progress
- **Low Productivity Keywords**: unproductive, distracted, procrastinating, stuck, blocked

#### Sentiment-4: Mood Indicators
- **Positive Mood**: happy, joyful, content, satisfied, pleased, grateful, optimistic
- **Negative Mood**: sad, depressed, frustrated, angry, disappointed, upset
- **Neutral Mood**: okay, fine, normal, average

#### Sentiment-5: Focus Indicators
- **High Focus**: focused, concentrated, attentive, engaged, absorbed
- **Low Focus**: distracted, scattered, unfocused, wandering

### 6.2 Analysis Rules

#### Rule-1: Negation Handling
- Detect negation words: not, no, never, don't, can't, won't
- Invert sentiment when negation precedes keyword (e.g., "not happy" → negative)

#### Rule-2: Intensity Modifiers
- **Amplifiers**: very, extremely, really, so, incredibly, absolutely
- **Diminishers**: slightly, somewhat, a bit, kind of, fairly
- Adjust scores by ±20% based on modifiers

#### Rule-3: Scoring Algorithm
- Base score calculation from keyword frequency and weights
- Apply contextual adjustments (negations, modifiers)
- Normalize scores to 0-100 range
- Default to neutral (50) if insufficient keywords detected

---

## 7. Deployment Requirements

### 7.1 Deployment Platform
- **Primary**: Vercel (optimized for React applications)
- **Alternative**: Netlify, GitHub Pages, or any static hosting

### 7.2 Deployment Artifacts
- Production-optimized build
- Minified JavaScript and CSS
- Compressed assets
- Service worker for offline capability (optional enhancement)

---

## 8. Project Deliverables

### Deliverable-1: Source Code
- Complete React application with all features implemented
- Clean folder structure
- Well-commented code

### Deliverable-2: Documentation
- README.md with setup and deployment instructions
- Code comments explaining sentiment analysis logic
- Deployment guide for Vercel

### Deliverable-3: Build Configuration
- Optimized build setup
- Environment configuration (if needed)
- Deployment scripts

---

## 9. Out of Scope

The following are explicitly **NOT** required for this project:

- User authentication or login system
- Backend server or API
- External database (PostgreSQL, MongoDB, etc.)
- User accounts or multi-user support
- Real-time collaboration features
- Mobile native applications (iOS/Android)
- Complex machine learning models
- Natural language processing libraries
- Data import functionality
- PDF or CSV export formats
- Email notifications
- Social sharing features
- Payment or subscription features
- Admin dashboard
- Analytics tracking
- A/B testing
- Internationalization (i18n)
- Server-side rendering (SSR)

---

## 10. Success Criteria

The project will be considered successful when:

1. ✅ All functional requirements (FR-1 through FR-9) are implemented and working
2. ✅ Sentiment analysis accurately detects emotions with weighted keyword logic
3. ✅ UI matches the futuristic AI dashboard aesthetic with glassmorphism and neon effects
4. ✅ Application is fully responsive across mobile, tablet, and desktop
5. ✅ Animations are smooth and performant
6. ✅ Local storage persists data correctly for 30 days
7. ✅ Mood history chart displays all metrics accurately
8. ✅ Application can be deployed to Vercel successfully
9. ✅ README and deployment documentation are complete
10. ✅ Code is clean, well-structured, and beginner-friendly

---

## 11. Assumptions

- Users have modern browsers with JavaScript enabled
- Users have local storage available (not disabled)
- Users have stable internet connection for initial load
- Users understand English (no multi-language support)
- Users are accessing from devices with minimum 320px screen width

---

## 12. Dependencies

### External Libraries
- React (^18.0.0)
- Tailwind CSS (^3.0.0)
- Framer Motion (^10.0.0 or latest)
- Recharts (^2.0.0 or latest)
- UUID library for generating unique IDs

### Development Tools
- Node.js and npm/yarn
- Vite or Create React App
- ESLint (optional, for code quality)
- Prettier (optional, for code formatting)

---

## 13. Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Local storage quota exceeded | High | Implement auto-cleanup of entries older than 30 days; notify user when approaching limit |
| Sentiment analysis inaccuracy | Medium | Use weighted keywords with context; provide disclaimer that analysis is for self-reflection, not medical advice |
| Performance issues on low-end devices | Medium | Reduce animation complexity on mobile; lazy load chart components |
| Browser compatibility issues | Low | Test on all target browsers; use polyfills if needed |
| Large bundle size | Medium | Code splitting; lazy loading; optimize dependencies |

---

## Approval

**Status**: Pending Review

**Prepared By**: AI-DLC System  
**Date**: 2026-05-06

---

**Next Steps**: 
1. Review this requirements document
2. Request changes if needed
3. Approve to proceed to Workflow Planning phase
