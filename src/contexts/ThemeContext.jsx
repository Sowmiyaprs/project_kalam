import { createContext, useContext, useState, useEffect, useMemo } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const [highContrastMode, setHighContrastMode] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Load preferences from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const savedHighContrast = localStorage.getItem('highContrast') === 'true';
    const savedReducedMotion = localStorage.getItem('reducedMotion') === 'true';

    setTheme(savedTheme);
    setHighContrastMode(savedHighContrast);
    setReducedMotion(savedReducedMotion);

    // Detect system preferences
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReducedMotion && !savedReducedMotion) {
      setReducedMotion(true);
    }
  }, []);

  // Apply theme class to document
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.classList.toggle(
      'high-contrast',
      highContrastMode
    );
  }, [theme, highContrastMode]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const toggleHighContrast = () => {
    const newValue = !highContrastMode;
    setHighContrastMode(newValue);
    localStorage.setItem('highContrast', String(newValue));
  };

  const toggleReducedMotion = () => {
    const newValue = !reducedMotion;
    setReducedMotion(newValue);
    localStorage.setItem('reducedMotion', String(newValue));
  };

  const value = useMemo(
    () => ({
      theme,
      highContrastMode,
      reducedMotion,
      toggleTheme,
      toggleHighContrast,
      toggleReducedMotion,
    }),
    [theme, highContrastMode, reducedMotion]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
