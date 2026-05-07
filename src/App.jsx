import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './contexts/ThemeContext.jsx';
import { AnalysisProvider } from './contexts/AnalysisContext.jsx';
import { ProfileProvider } from './contexts/ProfileContext.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';
import ProtectedRoute from './shared/components/ProtectedRoute.jsx';
import RootRedirect from './shared/components/RootRedirect.jsx';
import AppLayout from './shared/layout/AppLayout.jsx';
import AnalysisPage from './shared/pages/AnalysisPage.jsx';
import HistoryPage from './shared/pages/HistoryPage.jsx';
import DashboardPage from './shared/pages/DashboardPage.jsx';
import JournalPage from './shared/pages/JournalPage.jsx';
import CalendarPage from './shared/pages/CalendarPage.jsx';
import AchievementsPage from './shared/pages/AchievementsPage.jsx';
import RemindersPage from './shared/pages/RemindersPage.jsx';
import LoginPage from './shared/pages/LoginPage.jsx';
import SignupPage from './shared/pages/SignupPage.jsx';
import ForgotPasswordPage from './shared/pages/ForgotPasswordPage.jsx';
import ResetPasswordPage from './shared/pages/ResetPasswordPage.jsx';
import ProfilePage from './shared/pages/ProfilePage.jsx';

function App() {
  return (
    <ThemeProvider>
      <ProfileProvider>
        <AnalysisProvider>
          <BrowserRouter
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true,
            }}
          >
            <AuthProvider>

            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#1F2937',
                  color: '#fff',
                  border: '1px solid #374151',
                },
                success: {
                  iconTheme: {
                    primary: '#00D9FF',
                    secondary: '#fff',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#FF006E',
                    secondary: '#fff',
                  },
                },
              }}
            />
            <Routes>
              {/* Root Redirect - Redirects to login or dashboard based on auth */}
              <Route path="/" element={<RootRedirect />} />

              {/* Public Routes (No Layout) */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />

              {/* Protected Routes (With Layout) */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="analysis" element={<AnalysisPage />} />
                <Route path="journal" element={<JournalPage />} />
                <Route path="calendar" element={<CalendarPage />} />
                <Route path="achievements" element={<AchievementsPage />} />
                <Route path="reminders" element={<RemindersPage />} />
                <Route path="history" element={<HistoryPage />} />
                <Route path="profile" element={<ProfilePage />} />
              </Route>
            </Routes>
            </AuthProvider>
          </BrowserRouter>
        </AnalysisProvider>
      </ProfileProvider>
    </ThemeProvider>
  );
}

export default App;
