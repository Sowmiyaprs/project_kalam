# MindMirror AI 🤖✨

**Your intelligent emotional and productivity analysis companion**

MindMirror AI is a futuristic web application that analyzes your thoughts, feelings, and daily experiences to provide insights into your emotional state and productivity patterns.

![MindMirror AI](https://img.shields.io/badge/React-18.2.0-blue) ![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.3.0-38bdf8) ![Vite](https://img.shields.io/badge/Vite-4.3.0-646cff)

## ✨ Features

- 📝 **Journal Analysis** - Write your thoughts and get instant emotional insights
- 🎯 **AI-Powered Sentiment Analysis** - Keyword-based emotion detection
- 📊 **Mood Tracking** - Track 6 key metrics: Mood, Stress, Motivation, Confidence, Productivity, Focus
- 💡 **Personalized Suggestions** - Get 3-5 AI-generated tips for better well-being
- 📈 **30-Day History** - View your emotional patterns over time
- 💾 **Local Storage** - All data stays on your device (privacy-first)
- � **Data Export** - Export your history as JSON
- 🎨 **Futuristic UI** - Dark theme with glassmorphism and neon effects
- 📱 **Fully Responsive** - Works on mobile, tablet, and desktop
- ⚡ **Lightning Fast** - Optimized performance with < 500ms analysis time

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm 9+ or yarn 1.22+

### Installation

1. **Clone or navigate to the project directory**

```bash
cd mindmirror-ai
```

2. **Install dependencies**

```bash
npm install
```

3. **Start development server**

```bash
npm run dev
```

4. **Open your browser**

Navigate to `http://localhost:3000`

## 🛠️ Tech Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Charts**: Recharts (for future enhancements)
- **Routing**: React Router v6
- **Icons**: React Icons
- **Storage**: localStorage (client-side)

## 📁 Project Structure

```
mindmirror-ai/
├── src/
│   ├── services/
│   │   ├── sentiment/          # Unit 1: Sentiment Analysis Engine
│   │   │   ├── config/         # Keywords, suggestions, modifiers
│   │   │   ├── KeywordDetectionModule.js
│   │   │   ├── ScoringModule.js
│   │   │   ├── SuggestionGenerationModule.js
│   │   │   └── SentimentAnalysisService.js
│   │   └── storage/            # Unit 2: Data Management
│   │       ├── StorageService.js
│   │       ├── DataTransformationService.js
│   │       └── ExportService.js
│   ├── features/               # Feature-specific components
│   │   ├── analysis/           # Journal input & results
│   │   └── history/            # History display
│   ├── shared/                 # Shared components
│   │   ├── components/         # Reusable UI components
│   │   ├── layout/             # Layout components
│   │   └── pages/              # Page components
│   ├── contexts/               # React contexts
│   ├── hooks/                  # Custom React hooks
│   ├── utils/                  # Utility functions
│   ├── types/                  # Type definitions (JSDoc)
│   ├── styles/                 # Global styles
│   ├── App.jsx                 # Main app component
│   └── main.jsx                # Entry point
├── aidlc-docs/                 # AI-DLC documentation
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 🎮 Usage

### 1. Analyze Your Mood

1. Navigate to the **Analysis** page
2. Type your thoughts, feelings, or daily experiences (minimum 10 characters)
3. Click **"Analyze My Mood"** or press `Ctrl+Enter`
4. View your emotional metrics and personalized suggestions

### 2. View History

1. Navigate to the **History** page
2. See your statistics for the last 30 days
3. View trends and patterns
4. Export your data as JSON

### 3. Export Data

1. Go to the **History** page
2. Click **"Export Data"**
3. Your data will download as a JSON file

## 🧠 How It Works

### Sentiment Analysis Algorithm

MindMirror AI uses a sophisticated keyword-based sentiment analysis system:

1. **Keyword Detection** - Scans text for emotion keywords with O(1) hash map lookups
2. **Context Awareness** - Detects negations (e.g., "not happy") and intensity modifiers (e.g., "very stressed")
3. **Weighted Scoring** - Calculates scores using weighted sums with frequency bonuses
4. **Mood Classification** - Classifies mood based on score patterns (e.g., high stress + low motivation = "Overwhelmed")
5. **Suggestion Generation** - Identifies patterns and selects personalized suggestions

### Performance

- ⚡ Analysis time: < 500ms for 1000-word entries
- 💾 Storage: Uses localStorage with 5MB typical limit
- 🔄 Caching: In-memory cache with 5-minute expiration
- 📦 Bundle size: < 500KB (gzipped with code splitting)

## 🎨 Design Features

- **Glassmorphism** - Frosted glass effect with backdrop blur
- **Neon Glow Effects** - Blue, purple, and pink neon accents
- **Gradient Text** - Colorful gradient headings
- **Smooth Animations** - Framer Motion for fluid transitions
- **Responsive Design** - Mobile-first approach with Tailwind breakpoints
- **Dark Theme** - Easy on the eyes with high contrast support

## 📦 Build & Deploy

### Build for Production

```bash
npm run build
```

Output will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

### Deploy to Vercel

1. **Install Vercel CLI** (optional)

```bash
npm i -g vercel
```

2. **Deploy**

```bash
vercel deploy
```

Or connect your GitHub repository to Vercel for automatic deployments.

### Deploy to Netlify

1. Build the project: `npm run build`
2. Drag and drop the `dist/` folder to Netlify
3. Or connect your GitHub repository for automatic deployments

## 🔒 Privacy & Security

- ✅ **100% Client-Side** - No backend, no API calls, no data transmission
- ✅ **Local Storage Only** - All data stays on your device
- ✅ **No Tracking** - No analytics, no cookies, no third-party scripts
- ✅ **Input Sanitization** - XSS prevention with input validation
- ✅ **Content Security Policy** - CSP headers for additional security

## 🧪 Testing

Run linting:

```bash
npm run lint
```

Format code:

```bash
npm run format
```

## 🤝 Contributing

This project was built using the **AI-DLC (AI-Driven Development Life Cycle)** methodology. All design decisions and implementation details are documented in the `aidlc-docs/` directory.

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🙏 Acknowledgments

- Built with ❤️ using AI-DLC methodology
- Designed for mental health awareness and productivity improvement
- Inspired by the need for accessible emotional intelligence tools

## 📞 Support

If you encounter any issues or have questions:

1. Check the `aidlc-docs/` directory for detailed documentation
2. Review the implementation summaries in `aidlc-docs/construction/`
3. Open an issue on GitHub (if applicable)

---

**Made with 🤖 AI-DLC Workflow** | **Powered by React ⚛️** | **Styled with Tailwind 🎨**

Enjoy using MindMirror AI! 🚀✨
