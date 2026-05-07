/**
 * Achievement Service
 * Manages badges, milestones, and gamification
 */

import enhancedStorage from '../storage/EnhancedStorageService.js';

const ACHIEVEMENTS = {
  // Entry Milestones
  firstEntry: {
    id: 'first-entry',
    title: 'First Steps',
    description: 'Complete your first mood analysis',
    icon: '🌟',
    category: 'milestone',
    requirement: { type: 'entries', count: 1 },
  },
  entries10: {
    id: 'entries-10',
    title: 'Getting Started',
    description: 'Complete 10 mood analyses',
    icon: '⭐',
    category: 'milestone',
    requirement: { type: 'entries', count: 10 },
  },
  entries50: {
    id: 'entries-50',
    title: 'Dedicated',
    description: 'Complete 50 mood analyses',
    icon: '🌠',
    category: 'milestone',
    requirement: { type: 'entries', count: 50 },
  },
  entries100: {
    id: 'entries-100',
    title: 'Centurion',
    description: 'Complete 100 mood analyses',
    icon: '💯',
    category: 'milestone',
    requirement: { type: 'entries', count: 100 },
  },

  // Streak Achievements
  streak3: {
    id: 'streak-3',
    title: 'Building Habits',
    description: 'Maintain a 3-day streak',
    icon: '🔥',
    category: 'streak',
    requirement: { type: 'streak', count: 3 },
  },
  streak7: {
    id: 'streak-7',
    title: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: '✨',
    category: 'streak',
    requirement: { type: 'streak', count: 7 },
  },
  streak30: {
    id: 'streak-30',
    title: 'Monthly Master',
    description: 'Maintain a 30-day streak',
    icon: '🏆',
    category: 'streak',
    requirement: { type: 'streak', count: 30 },
  },
  streak100: {
    id: 'streak-100',
    title: 'Legendary',
    description: 'Maintain a 100-day streak',
    icon: '👑',
    category: 'streak',
    requirement: { type: 'streak', count: 100 },
  },

  // Journal Achievements
  firstJournal: {
    id: 'first-journal',
    title: 'Storyteller',
    description: 'Write your first journal entry',
    icon: '📔',
    category: 'journal',
    requirement: { type: 'journal', count: 1 },
  },
  journal20: {
    id: 'journal-20',
    title: 'Chronicler',
    description: 'Write 20 journal entries',
    icon: '📚',
    category: 'journal',
    requirement: { type: 'journal', count: 20 },
  },

  // Wellness Achievements
  balanced: {
    id: 'balanced',
    title: 'Balanced Mind',
    description: 'Achieve 80+ wellness score',
    icon: '⚖️',
    category: 'wellness',
    requirement: { type: 'wellness', score: 80 },
  },
  lowStress: {
    id: 'low-stress',
    title: 'Stress Master',
    description: 'Maintain stress below 30% for a week',
    icon: '😌',
    category: 'wellness',
    requirement: { type: 'lowStress', days: 7 },
  },
  highMotivation: {
    id: 'high-motivation',
    title: 'Motivated Mind',
    description: 'Maintain motivation above 70% for a week',
    icon: '💪',
    category: 'wellness',
    requirement: { type: 'highMotivation', days: 7 },
  },

  // Special Achievements
  earlyBird: {
    id: 'early-bird',
    title: 'Early Bird',
    description: 'Check in before 8 AM',
    icon: '🌅',
    category: 'special',
    requirement: { type: 'earlyBird' },
  },
  nightOwl: {
    id: 'night-owl',
    title: 'Night Owl',
    description: 'Check in after 10 PM',
    icon: '🦉',
    category: 'special',
    requirement: { type: 'nightOwl' },
  },
  allMoods: {
    id: 'all-moods',
    title: 'Emotional Explorer',
    description: 'Experience all mood types',
    icon: '🎭',
    category: 'special',
    requirement: { type: 'allMoods' },
  },
};

class AchievementService {
  /**
   * Check and unlock achievements based on user stats
   */
  checkAchievements(stats) {
    const newAchievements = [];

    Object.values(ACHIEVEMENTS).forEach((achievement) => {
      if (!this.isUnlocked(achievement.id)) {
        if (this.meetsRequirement(achievement, stats)) {
          this.unlockAchievement(achievement);
          newAchievements.push(achievement);
        }
      }
    });

    return newAchievements;
  }

  /**
   * Check if achievement is unlocked
   */
  isUnlocked(achievementId) {
    const achievements = enhancedStorage.getAchievements();
    return achievements.some((a) => a.id === achievementId);
  }

  /**
   * Check if requirement is met
   */
  meetsRequirement(achievement, stats) {
    const { requirement } = achievement;

    switch (requirement.type) {
      case 'entries':
        return stats.totalEntries >= requirement.count;

      case 'streak':
        return stats.currentStreak >= requirement.count;

      case 'journal':
        const journalEntries = enhancedStorage.getJournalEntries();
        return journalEntries.length >= requirement.count;

      case 'wellness':
        return stats.wellnessScore >= requirement.score;

      case 'lowStress':
        return this.checkConsecutiveDays('stress', '<', 30, requirement.days);

      case 'highMotivation':
        return this.checkConsecutiveDays('motivation', '>', 70, requirement.days);

      case 'earlyBird':
        return this.checkTimeOfDay('before', 8);

      case 'nightOwl':
        return this.checkTimeOfDay('after', 22);

      case 'allMoods':
        return this.hasExperiencedAllMoods();

      default:
        return false;
    }
  }

  /**
   * Check consecutive days for a metric
   */
  checkConsecutiveDays(metric, operator, threshold, days) {
    const analyses = enhancedStorage.getAnalyses();
    if (analyses.length < days) return false;

    const recent = analyses.slice(-days);
    return recent.every((analysis) => {
      const value = analysis.metrics?.[metric] || 0;
      if (operator === '<') return value < threshold;
      if (operator === '>') return value > threshold;
      return false;
    });
  }

  /**
   * Check time of day
   */
  checkTimeOfDay(comparison, hour) {
    const now = new Date();
    const currentHour = now.getHours();

    if (comparison === 'before') return currentHour < hour;
    if (comparison === 'after') return currentHour >= hour;
    return false;
  }

  /**
   * Check if user has experienced all moods
   */
  hasExperiencedAllMoods() {
    const analyses = enhancedStorage.getAnalyses();
    const moods = new Set(analyses.map((a) => a.primaryEmotion));
    const requiredMoods = ['Happy', 'Sad', 'Stressed', 'Anxious', 'Calm', 'Confident', 'Tired'];
    return requiredMoods.every((mood) => moods.has(mood));
  }

  /**
   * Unlock achievement
   */
  unlockAchievement(achievement) {
    enhancedStorage.unlockAchievement(
      achievement.id,
      achievement.title,
      achievement.description
    );
  }

  /**
   * Get all achievements
   */
  getAllAchievements() {
    return Object.values(ACHIEVEMENTS);
  }

  /**
   * Get unlocked achievements
   */
  getUnlockedAchievements() {
    return enhancedStorage.getAchievements();
  }

  /**
   * Get achievement progress
   */
  getProgress(stats) {
    const total = Object.keys(ACHIEVEMENTS).length;
    const unlocked = this.getUnlockedAchievements().length;
    return {
      unlocked,
      total,
      percentage: Math.round((unlocked / total) * 100),
    };
  }

  /**
   * Get achievements by category
   */
  getByCategory(category) {
    return Object.values(ACHIEVEMENTS).filter((a) => a.category === category);
  }
}

export default new AchievementService();
