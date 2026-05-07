import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

const AUTH_STORAGE_KEY = 'mindmirror_auth';
const USERS_STORAGE_KEY = 'mindmirror_users';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Load auth state on mount
  useEffect(() => {
    loadAuthState();
  }, []);

  const loadAuthState = () => {
    try {
      const authData = localStorage.getItem(AUTH_STORAGE_KEY);
      if (authData) {
        const { user: savedUser, rememberMe, timestamp } = JSON.parse(authData);
        
        // Check if session is still valid (7 days for remember me, 24 hours otherwise)
        const maxAge = rememberMe ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
        const isValid = Date.now() - timestamp < maxAge;

        if (isValid) {
          setUser(savedUser);
          setIsAuthenticated(true);
        } else {
          // Session expired
          logout();
        }
      }
    } catch (error) {
      console.error('Error loading auth state:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveAuthState = (userData, rememberMe = false) => {
    const authData = {
      user: userData,
      rememberMe,
      timestamp: Date.now(),
    };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
  };

  const getUsers = () => {
    try {
      const users = localStorage.getItem(USERS_STORAGE_KEY);
      return users ? JSON.parse(users) : [];
    } catch (error) {
      console.error('Error getting users:', error);
      return [];
    }
  };

  const saveUser = (userData) => {
    const users = getUsers();
    users.push(userData);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  };

  const findUserByEmail = (email) => {
    const users = getUsers();
    return users.find(u => u.email.toLowerCase() === email.toLowerCase());
  };

  const signup = useCallback(async (fullName, email, password) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if user already exists
    if (findUserByEmail(email)) {
      throw new Error('An account with this email already exists');
    }

    // Create new user
    const newUser = {
      id: `user_${Date.now()}`,
      fullName,
      email,
      password, // In production, this would be hashed on backend
      createdAt: new Date().toISOString(),
    };

    saveUser(newUser);

    // Auto login after signup
    const userData = {
      id: newUser.id,
      fullName: newUser.fullName,
      email: newUser.email,
    };

    setUser(userData);
    setIsAuthenticated(true);
    saveAuthState(userData, false);

    return userData;
  }, []);

  const login = useCallback(async (email, password, rememberMe = false) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Find user
    const foundUser = findUserByEmail(email);

    if (!foundUser) {
      throw new Error('No account found with this email');
    }

    if (foundUser.password !== password) {
      throw new Error('Incorrect password');
    }

    // Login successful
    const userData = {
      id: foundUser.id,
      fullName: foundUser.fullName,
      email: foundUser.email,
    };

    setUser(userData);
    setIsAuthenticated(true);
    saveAuthState(userData, rememberMe);

    return userData;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    navigate('/login');
  }, [navigate]);

  const updatePassword = useCallback(async (email, newPassword) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const users = getUsers();
    const userIndex = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());

    if (userIndex === -1) {
      throw new Error('User not found');
    }

    users[userIndex].password = newPassword;
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

    return true;
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      isLoading,
      signup,
      login,
      logout,
      updatePassword,
    }),
    [user, isAuthenticated, isLoading, signup, login, logout, updatePassword]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
