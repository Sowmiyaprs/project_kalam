/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Premium Neutral Base (Main UI Colors)
        neutral: {
          50: '#fafafa',   // Ultra-light backgrounds
          100: '#f5f5f5',  // Card backgrounds
          200: '#e5e5e5',  // Borders, dividers
          300: '#d4d4d4',  // Subtle borders
          400: '#a3a3a3',  // Disabled states
          500: '#737373',  // Secondary text
          600: '#525252',  // Body text
          700: '#404040',  // Headings
          800: '#262626',  // Dark headings
          900: '#171717',  // Darkest text
        },
        
        // Lavender Accent (ONLY for highlights, CTAs, active states)
        lavender: {
          50: '#faf8ff',   // Hover backgrounds
          100: '#f4f1ff',  // Light hover states
          200: '#e9e3ff',  // Subtle accents
          300: '#d4c5ff',  // Light accents
          400: '#b8a0ff',  // Medium accents
          500: '#9b7ebd',  // Primary CTA
          600: '#8b6fb0',  // Primary CTA hover
          700: '#7a5fa3',  // Active states
          800: '#6a4f96',  // Deep accents
          900: '#5a3f89',  // Darkest accent
        },
        
        // Soft Purple (Secondary accent - charts, badges)
        purple: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
        },
        
        // Periwinkle (Tertiary accent - success, info)
        periwinkle: {
          50: '#f8f9ff',
          100: '#eef1ff',
          200: '#dde3ff',
          300: '#c7d2fe',
          400: '#a5b4fc',
          500: '#8b93ff',
          600: '#7c84f5',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Cal Sans', 'Inter', 'sans-serif'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        'soft': '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.03)',
        'soft-lg': '0 4px 6px rgba(0, 0, 0, 0.05), 0 2px 4px rgba(0, 0, 0, 0.03)',
        'premium': '0 10px 25px rgba(0, 0, 0, 0.08), 0 4px 10px rgba(0, 0, 0, 0.04)',
        'premium-lg': '0 20px 40px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.06)',
        'inner-soft': 'inset 0 2px 4px rgba(0, 0, 0, 0.04)',
      },
      backgroundImage: {
        'gradient-subtle': 'linear-gradient(135deg, #fafafa 0%, #ffffff 100%)',
        'gradient-lavender-subtle': 'linear-gradient(135deg, #faf8ff 0%, #ffffff 100%)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease-out',
        'slide-up': 'slide-up 0.4s ease-out',
        'slide-down': 'slide-down 0.4s ease-out',
        'scale-in': 'scale-in 0.3s ease-out',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-down': {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
    },
  },
  plugins: [],
};
