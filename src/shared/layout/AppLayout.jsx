import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, Brain, BarChart3, BookOpen, Calendar, Trophy, Bell, History, User, LogOut } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import ChatbotButton from '../../features/chatbot/ChatbotButton.jsx';

export default function AppLayout() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <BarChart3 className="w-5 h-5" /> },
    { path: '/analysis', label: 'Analysis', icon: <Brain className="w-5 h-5" /> },
    { path: '/journal', label: 'Journal', icon: <BookOpen className="w-5 h-5" /> },
    { path: '/calendar', label: 'Calendar', icon: <Calendar className="w-5 h-5" /> },
    { path: '/achievements', label: 'Achievements', icon: <Trophy className="w-5 h-5" /> },
    { path: '/reminders', label: 'Reminders', icon: <Bell className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      {/* Header */}
      <header className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/dashboard" className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2 hover:opacity-80 transition">
              <span className="text-3xl">🧠</span>
              <span className="hidden sm:inline">MindMirror AI</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-medium
                    ${location.pathname === item.path
                      ? 'bg-lavender-100 dark:bg-lavender-900/30 text-lavender-700 dark:text-lavender-300'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                    }
                  `}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors text-neutral-600 dark:text-neutral-300"
                aria-label="Toggle theme"
                title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {theme === 'dark' ? (
                  <span className="text-xl">☀️</span>
                ) : (
                  <span className="text-xl">🌙</span>
                )}
              </button>

              {/* Profile Dropdown (Desktop) */}
              <div className="hidden md:flex items-center gap-2">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
                >
                  <User className="w-5 h-5" />
                  <span className="text-sm font-medium">Profile</span>
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors text-neutral-600 dark:text-neutral-400"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800">
            <nav className="px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium
                    ${location.pathname === item.path
                      ? 'bg-lavender-100 dark:bg-lavender-900/30 text-lavender-700 dark:text-lavender-300'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                    }
                  `}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-all font-medium"
              >
                <User className="w-5 h-5" />
                <span>Profile</span>
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all font-medium"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="pb-20 md:pb-8">
        <Outlet />
      </main>

      {/* AI Chatbot */}
      <ChatbotButton />

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 z-40 shadow-lg">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all
                ${location.pathname === item.path
                  ? 'text-lavender-600'
                  : 'text-neutral-500'
                }
              `}
            >
              {item.icon}
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
