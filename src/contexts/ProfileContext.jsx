import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';

const ProfileContext = createContext(null);

const PROFILE_STORAGE_KEY = 'mindmirror_user_profile';

const DEFAULT_PROFILE = {
  username: 'User',
  email: '',
  bio: '',
  profileImage: null,
  joinedDate: new Date().toISOString(),
  preferences: {
    notifications: {
      emailNotifications: true,
      dailyReminders: true,
      weeklyReports: true,
      wellnessTips: true,
      productUpdates: false,
    },
    privacy: {
      shareAnalytics: false,
      publicProfile: false,
    },
    wellness: {
      dailyGoal: 1,
      reminderTime: '09:00',
      weeklyGoal: 5,
    },
  },
  stats: {
    totalEntries: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastCheckIn: null,
  },
};

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [isLoading, setIsLoading] = useState(true);

  // Load profile from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setProfile({ ...DEFAULT_PROFILE, ...parsed });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save profile to localStorage whenever it changes
  const saveProfile = useCallback((newProfile) => {
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(newProfile));
      setProfile(newProfile);
      return true;
    } catch (error) {
      console.error('Error saving profile:', error);
      return false;
    }
  }, []);

  // Update profile fields
  const updateProfile = useCallback(
    (updates) => {
      const newProfile = { ...profile, ...updates };
      return saveProfile(newProfile);
    },
    [profile, saveProfile]
  );

  // Update preferences
  const updatePreferences = useCallback(
    (category, updates) => {
      const newProfile = {
        ...profile,
        preferences: {
          ...profile.preferences,
          [category]: {
            ...profile.preferences[category],
            ...updates,
          },
        },
      };
      return saveProfile(newProfile);
    },
    [profile, saveProfile]
  );

  // Update profile image
  const updateProfileImage = useCallback(
    (imageData) => {
      return updateProfile({ profileImage: imageData });
    },
    [updateProfile]
  );

  // Update stats
  const updateStats = useCallback(
    (updates) => {
      const newProfile = {
        ...profile,
        stats: {
          ...profile.stats,
          ...updates,
        },
      };
      return saveProfile(newProfile);
    },
    [profile, saveProfile]
  );

  // Increment entry count and update streak
  const recordCheckIn = useCallback(() => {
    const now = new Date();
    const lastCheckIn = profile.stats.lastCheckIn
      ? new Date(profile.stats.lastCheckIn)
      : null;

    let newStreak = profile.stats.currentStreak;

    if (lastCheckIn) {
      const daysDiff = Math.floor(
        (now - lastCheckIn) / (1000 * 60 * 60 * 24)
      );

      if (daysDiff === 0) {
        // Same day, don't update streak
      } else if (daysDiff === 1) {
        // Consecutive day
        newStreak += 1;
      } else {
        // Streak broken
        newStreak = 1;
      }
    } else {
      // First check-in
      newStreak = 1;
    }

    const newStats = {
      totalEntries: profile.stats.totalEntries + 1,
      currentStreak: newStreak,
      longestStreak: Math.max(newStreak, profile.stats.longestStreak),
      lastCheckIn: now.toISOString(),
    };

    return updateStats(newStats);
  }, [profile.stats, updateStats]);

  // Reset profile to defaults
  const resetProfile = useCallback(() => {
    localStorage.removeItem(PROFILE_STORAGE_KEY);
    setProfile(DEFAULT_PROFILE);
  }, []);

  const value = useMemo(
    () => ({
      profile,
      isLoading,
      updateProfile,
      updatePreferences,
      updateProfileImage,
      updateStats,
      recordCheckIn,
      resetProfile,
    }),
    [
      profile,
      isLoading,
      updateProfile,
      updatePreferences,
      updateProfileImage,
      updateStats,
      recordCheckIn,
      resetProfile,
    ]
  );

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within ProfileProvider');
  }
  return context;
}
