# Tech Stack Decisions - UI Components & Layout

**Unit**: UI Components & Layout  
**Phase**: CONSTRUCTION - NFR Requirements  
**Date**: 2026-05-06

---

## Overview

This document details technology stack decisions for the UI Components & Layout unit, including rationale, alternatives considered, and implementation guidelines.

---

## 1. React 18+

**Decision**: Use React 18+ as the component library

**Rationale**:
- Component-based architecture (matches design)
- Large ecosystem and community
- Excellent performance with Virtual DOM
- Built-in hooks for state management
- Concurrent features for better UX
- Strong TypeScript support (via JSDoc)

**Alternatives Considered**:
- Vue.js: Good, but React has larger ecosystem
- Svelte: Excellent performance, but smaller ecosystem
- Vanilla JavaScript: Too complex for this scale

**Version**: React 18.2.0 or later

**Key Features Used**:
- Functional components with hooks
- Context API for global state
- React.memo for performance
- React.lazy for code splitting
- Suspense for loading states
- Error boundaries for error handling

**Implementation Guidelines**:
- Use functional components only (no class components)
- Use hooks for state and side effects
- Follow React best practices
- Use JSDoc for prop types

---

## 2. Tailwind CSS

**Decision**: Use Tailwind CSS for styling

**Rationale**:
- Utility-first approach (rapid development)
- Responsive design built-in
- Consistent design system
- Small bundle size (purged unused styles)
- No CSS naming conflicts
- Easy to customize

**Alternatives Considered**:
- CSS Modules: Good, but more verbose
- Styled Components: Good, but runtime overhead
- Plain CSS: Too much boilerplate

**Version**: Tailwind CSS 3.3.0 or later

**Key Features Used**:
- Responsive utilities (sm, md, lg, xl)
- Dark mode support
- Custom color palette (neon effects)
- Glassmorphism utilities
- Animation utilities
- Accessibility utilities

**Configuration**:
```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        neon: {
          blue: '#00d4ff',
          purple: '#b300ff',
          pink: '#ff00ff',
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
```

**Implementation Guidelines**:
- Use Tailwind utilities for all styling
- Create custom utilities for repeated patterns
- Use @apply sparingly (prefer utilities)
- Purge unused styles in production

---

## 3. Framer Motion

**Decision**: Use Framer Motion for complex animations

**Rationale**:
- Declarative animation API
- Excellent performance (GPU-accelerated)
- Gesture support (drag, hover, tap)
- Orchestration (stagger, sequence)
- Variants for animation states
- Accessibility support (respects prefers-reduced-motion)

**Alternatives Considered**:
- React Spring: Good, but more complex API
- CSS animations: Good for simple, not for complex
- GSAP: Powerful, but overkill for this project

**Version**: Framer Motion 10.0.0 or later

**Key Features Used**:
- motion components (motion.div, motion.button)
- Variants for animation states
- Stagger animations
- Gesture animations (hover, tap)
- Layout animations
- AnimatePresence for exit animations

**Implementation Guidelines**:
- Use Framer Motion for complex animations (stagger, orchestration)
- Use CSS transitions for simple animations (hover, focus)
- Always respect prefers-reduced-motion
- Keep animations under 1 second

**Example**:
```javascript
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  Content
</motion.div>
```

---

## 4. React Router

**Decision**: Use React Router for client-side routing

**Rationale**:
- Standard routing library for React
- Declarative routing
- Nested routes support
- Lazy loading support
- History management
- URL parameters and query strings

**Alternatives Considered**:
- Reach Router: Deprecated, merged into React Router
- Next.js: Overkill for client-only app
- Manual routing: Too complex

**Version**: React Router 6.10.0 or later

**Key Features Used**:
- BrowserRouter for HTML5 history
- Routes and Route components
- NavLink for navigation
- Outlet for nested routes
- useNavigate for programmatic navigation
- useLocation for current route

**Implementation Guidelines**:
- Use BrowserRouter at root
- Define routes in App.jsx
- Use NavLink for navigation links
- Lazy load pages with React.lazy

**Example**:
```javascript
<BrowserRouter>
  <Routes>
    <Route path="/" element={<AppLayout />}>
      <Route index element={<HomePage />} />
      <Route path="analysis" element={<AnalysisPage />} />
      <Route path="history" element={<HistoryPage />} />
    </Route>
  </Routes>
</BrowserRouter>
```

---

## 5. Context API

**Decision**: Use React Context API for global state management

**Rationale**:
- Built into React (no extra dependency)
- Simple API for global state
- Sufficient for this app's complexity
- Good performance with proper optimization
- Easy to test

**Alternatives Considered**:
- Redux: Overkill for this app
- Zustand: Good, but Context API sufficient
- Recoil: Good, but Context API sufficient

**Contexts Used**:
- ThemeContext (theme, high contrast, reduced motion)
- AnalysisContext (current analysis, loading state)

**Implementation Guidelines**:
- Create separate contexts for different concerns
- Use useMemo to prevent unnecessary re-renders
- Split contexts to minimize re-renders
- Use local state when possible

**Example**:
```javascript
const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark');
  
  const value = useMemo(() => ({
    theme,
    toggleTheme: () => setTheme(t => t === 'dark' ? 'light' : 'dark'),
  }), [theme]);
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
```

---

## 6. Vite

**Decision**: Use Vite as the build tool

**Rationale**:
- Extremely fast dev server (ESM-based)
- Fast production builds (Rollup)
- Built-in HMR (Hot Module Replacement)
- Modern by default (ES modules)
- Simple configuration
- Excellent React support

**Alternatives Considered**:
- Create React App: Slower, more complex
- Webpack: More complex configuration
- Parcel: Good, but Vite faster

**Version**: Vite 4.3.0 or later

**Key Features Used**:
- Fast dev server
- HMR for instant updates
- Code splitting
- Asset optimization
- Environment variables
- Build optimization

**Configuration**:
```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          motion: ['framer-motion'],
        },
      },
    },
  },
});
```

**Implementation Guidelines**:
- Use Vite for development and production
- Configure code splitting for optimal bundles
- Use environment variables for configuration
- Optimize assets (images, fonts)

---

## 7. ESLint + Prettier

**Decision**: Use ESLint for linting and Prettier for formatting

**Rationale**:
- Enforce code quality standards
- Catch bugs early
- Consistent code formatting
- Team collaboration
- Industry standard

**Alternatives Considered**:
- No linting: Bad practice
- TSLint: Deprecated
- StandardJS: Less flexible

**Version**: 
- ESLint 8.40.0 or later
- Prettier 2.8.0 or later

**Configuration**:
```javascript
// .eslintrc.js
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'prettier',
  ],
  plugins: ['react', 'react-hooks'],
  rules: {
    'react/prop-types': 'off', // Using JSDoc instead
    'react/react-in-jsx-scope': 'off', // React 17+
  },
};

// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

**Implementation Guidelines**:
- Run ESLint on save
- Run Prettier on save
- Fix all linting errors before commit
- Use pre-commit hooks (optional)

---

## 8. React Icons

**Decision**: Use React Icons for icon library

**Rationale**:
- Large collection of icons
- Tree-shakeable (only import what you use)
- Consistent API
- SVG-based (scalable)
- No external dependencies

**Alternatives Considered**:
- Font Awesome: Larger bundle size
- Material Icons: Limited to Material Design
- Custom SVGs: More work

**Version**: React Icons 4.8.0 or later

**Icon Sets Used**:
- Heroicons (primary)
- Custom SVGs for mood/metric icons

**Implementation Guidelines**:
- Import only icons you use
- Use consistent size prop
- Add aria-label for accessibility
- Create custom icon components for repeated use

**Example**:
```javascript
import { HiHome, HiDocumentText, HiChartBar } from 'react-icons/hi2';

<HiHome size={24} aria-label="Home" />
```

---

## 9. No Backend Framework

**Decision**: No backend framework (pure frontend app)

**Rationale**:
- All data stored client-side (localStorage)
- No server required
- Simpler deployment (static hosting)
- Better privacy (no data sent to server)
- Lower cost (no server costs)

**Implications**:
- No authentication system
- No database
- No API calls (except CDN)
- All logic client-side

**Deployment**:
- Static hosting (Vercel, Netlify, GitHub Pages)
- No server configuration needed
- Fast global CDN

---

## 10. No State Management Library

**Decision**: No external state management library (use Context API + hooks)

**Rationale**:
- App complexity doesn't justify Redux/Zustand
- Context API sufficient for global state
- Local state (useState) for component state
- Custom hooks for shared logic
- Simpler codebase

**State Management Strategy**:
- Context API: Theme, current analysis
- Local state: Form state, UI toggles
- Custom hooks: Storage, history, export
- No prop drilling (use context)

---

## 11. No Testing Framework (Per Unit Strategy)

**Decision**: No automated testing for Unit 3 (per approved strategy)

**Rationale**:
- Unit 3 is UI-focused (manual testing more effective)
- Units 1 & 2 have comprehensive tests (core logic covered)
- Manual testing checklist provided
- Visual regression testing approach documented
- Accessibility testing with tools

**Testing Approach**:
- Manual testing checklist (Build and Test stage)
- Visual regression testing (screenshots)
- Accessibility testing (axe, Lighthouse)
- Browser compatibility testing
- Responsive design testing

---

## Tech Stack Summary

| Category | Technology | Version | Rationale |
|----------|-----------|---------|-----------|
| Component Library | React | 18.2.0+ | Industry standard, excellent ecosystem |
| Styling | Tailwind CSS | 3.3.0+ | Utility-first, rapid development |
| Animations | Framer Motion | 10.0.0+ | Declarative, performant |
| Routing | React Router | 6.10.0+ | Standard React routing |
| State Management | Context API | Built-in | Sufficient for app complexity |
| Build Tool | Vite | 4.3.0+ | Fast dev server, modern |
| Code Quality | ESLint + Prettier | 8.40.0+ / 2.8.0+ | Code quality, consistency |
| Icons | React Icons | 4.8.0+ | Large collection, tree-shakeable |
| Backend | None | N/A | Client-only app |
| Testing | Manual | N/A | UI-focused, manual more effective |

---

## Dependencies

### Production Dependencies
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.10.0",
  "framer-motion": "^10.0.0",
  "react-icons": "^4.8.0"
}
```

### Development Dependencies
```json
{
  "vite": "^4.3.0",
  "@vitejs/plugin-react": "^4.0.0",
  "tailwindcss": "^3.3.0",
  "postcss": "^8.4.23",
  "autoprefixer": "^10.4.14",
  "eslint": "^8.40.0",
  "eslint-plugin-react": "^7.32.2",
  "eslint-plugin-react-hooks": "^4.6.0",
  "prettier": "^2.8.0"
}
```

---

## Implementation Checklist

- [ ] Initialize Vite project with React template
- [ ] Install and configure Tailwind CSS
- [ ] Install and configure Framer Motion
- [ ] Install and configure React Router
- [ ] Set up Context providers (Theme, Analysis)
- [ ] Configure ESLint and Prettier
- [ ] Install React Icons
- [ ] Create directory structure (see functional design)
- [ ] Set up build configuration
- [ ] Configure deployment (Vercel)

---

**Status**: ✅ Tech Stack Decisions Complete
