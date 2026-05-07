/**
 * EnhancedStorageService
 * Comprehensive data persistence for the entire app
 */

const STORAGE_KEYS = {
  ENTRIES: 'mindmirror_entries',
  ANALYSES: 'mindmirror_analyses',
  JOURNAL: 'mindmirror_journal',
  ACHIEVEMENTS: 'mindmirror_achievements',
  REMINDERS: 'mindmirror_reminders',
  CHAT_HISTORY: 'mindmirror_chat_history',
};

class EnhancedStorageService {
  /**
   * Generic get method with error handling
   */
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading ${key}:`, error);
      return defaultValue;
    }
  }

  /**
   * Generic set method with error handling
   */
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error saving ${key}:`, error);
      if (error.name === 'QuotaExceededError') {
        this.handleQuotaExceeded();
      }
      return false;
    }
  }

  /**
   * Handle storage quota exceeded
   */
  handleQuotaExceeded() {
    console.warn('Storage quota exceeded. Cleaning up old data...');
    // Clean up old entries (keep last 100)
    const entries = this.getEntries();
    if (entries.length > 100) {
      const recent = entries.slice(-100);
      this.set(STORAGE_KEYS.ENTRIES, recent);
    }

    // Clean up old analyses (keep last 100)
    const analyses = this.getAnalyses();
    if (analyses.length > 100) {
      const recent = analyses.slice(-100);
      this.set(STORAGE_KEYS.ANALYSES, recent);
    }
  }

  // ==================== ENTRIES ====================

  getEntries() {
    return this.get(STORAGE_KEYS.ENTRIES, []);
  }

  saveEntry(text) {
    const entries = this.getEntries();
    const entry = {
      id: `entry_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      text,
      timestamp: new Date().toISOString(),
      wordCount: text.split(/\s+/).filter(Boolean).length,
    };
    entries.push(entry);
    this.set(STORAGE_KEYS.ENTRIES, entries);
    return entry;
  }

  deleteEntry(entryId) {
    const entries = this.getEntries();
    const filtered = entries.filter((e) => e.id !== entryId);
    this.set(STORAGE_KEYS.ENTRIES, filtered);

    // Also delete associated analysis
    const analyses = this.getAnalyses();
    const filteredAnalyses = analyses.filter((a) => a.entryId !== entryId);
    this.set(STORAGE_KEYS.ANALYSES, filteredAnalyses);

    return true;
  }

  // ==================== ANALYSES ====================

  getAnalyses() {
    return this.get(STORAGE_KEYS.ANALYSES, []);
  }

  saveAnalysis(entryId, analysisResult) {
    const analyses = this.getAnalyses();
    const analysis = {
      id: `analysis_${Date.now()}`,
      entryId,
      timestamp: new Date().toISOString(),
      ...analysisResult,
    };
    analyses.push(analysis);
    this.set(STORAGE_KEYS.ANALYSES, analyses);
    return analysis;
  }

  getLatestAnalysis() {
    const analyses = this.getAnalyses();
    return analyses.length > 0 ? analyses[analyses.length - 1] : null;
  }

  getAnalysesByDateRange(startDate, endDate) {
    const analyses = this.getAnalyses();
    return analyses.filter((a) => {
      const date = new Date(a.timestamp);
      return date >= startDate && date <= endDate;
    });
  }

  getAnalysisStats(days = 30) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);

    const analyses = this.getAnalyses().filter(
      (a) => new Date(a.timestamp) >= cutoff
    );

    if (analyses.length === 0) {
      return {
        avgStress: 0,
        avgMotivation: 0,
        avgConfidence: 0,
        moodDistribution: {},
        totalEntries: 0,
      };
    }

    const sum = analyses.reduce(
      (acc, a) => ({
        stress: acc.stress + (a.metrics?.stress || 0),
        motivation: acc.motivation + (a.metrics?.motivation || 0),
        confidence: acc.confidence + (a.metrics?.confidence || 0),
      }),
      { stress: 0, motivation: 0, confidence: 0 }
    );

    const moodDistribution = analyses.reduce((acc, a) => {
      const mood = a.primaryEmotion || 'neutral';
      acc[mood] = (acc[mood] || 0) + 1;
      return acc;
    }, {});

    return {
      avgStress: Math.round(sum.stress / analyses.length),
      avgMotivation: Math.round(sum.motivation / analyses.length),
      avgConfidence: Math.round(sum.confidence / analyses.length),
      moodDistribution,
      totalEntries: analyses.length,
    };
  }

  // ==================== JOURNAL ====================

  getJournalEntries() {
    return this.get(STORAGE_KEYS.JOURNAL, []);
  }

  saveJournalEntry(title, content, mood, tags = []) {
    const entries = this.getJournalEntries();
    const entry = {
      id: `journal_${Date.now()}`,
      title,
      content,
      mood,
      tags,
      timestamp: new Date().toISOString(),
      lastModified: new Date().toISOString(),
    };
    entries.push(entry);
    this.set(STORAGE_KEYS.JOURNAL, entries);
    return entry;
  }

  updateJournalEntry(id, updates) {
    const entries = this.getJournalEntries();
    const index = entries.findIndex((e) => e.id === id);
    if (index !== -1) {
      entries[index] = {
        ...entries[index],
        ...updates,
        lastModified: new Date().toISOString(),
      };
      this.set(STORAGE_KEYS.JOURNAL, entries);
      return entries[index];
    }
    return null;
  }

  deleteJournalEntry(id) {
    const entries = this.getJournalEntries();
    const filtered = entries.filter((e) => e.id !== id);
    this.set(STORAGE_KEYS.JOURNAL, filtered);
    return true;
  }

  searchJournalEntries(query) {
    const entries = this.getJournalEntries();
    const lowerQuery = query.toLowerCase();
    return entries.filter(
      (e) =>
        e.title.toLowerCase().includes(lowerQuery) ||
        e.content.toLowerCase().includes(lowerQuery) ||
        e.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
    );
  }

  // ==================== ACHIEVEMENTS ====================

  getAchievements() {
    return this.get(STORAGE_KEYS.ACHIEVEMENTS, []);
  }

  unlockAchievement(achievementId, title, description) {
    const achievements = this.getAchievements();
    if (!achievements.find((a) => a.id === achievementId)) {
      const achievement = {
        id: achievementId,
        title,
        description,
        unlockedAt: new Date().toISOString(),
      };
      achievements.push(achievement);
      this.set(STORAGE_KEYS.ACHIEVEMENTS, achievements);
      return achievement;
    }
    return null;
  }

  // ==================== CHAT HISTORY ====================

  getChatHistory() {
    return this.get(STORAGE_KEYS.CHAT_HISTORY, []);
  }

  saveChatMessage(role, content) {
    const history = this.getChatHistory();
    const message = {
      id: `msg_${Date.now()}`,
      role, // 'user' or 'assistant'
      content,
      timestamp: new Date().toISOString(),
    };
    history.push(message);
    // Keep only last 100 messages
    if (history.length > 100) {
      history.shift();
    }
    this.set(STORAGE_KEYS.CHAT_HISTORY, history);
    return message;
  }

  clearChatHistory() {
    this.set(STORAGE_KEYS.CHAT_HISTORY, []);
  }

  // ==================== REMINDERS ====================

  getReminders() {
    return this.get(STORAGE_KEYS.REMINDERS, []);
  }

  saveReminder(title, time, enabled = true) {
    const reminders = this.getReminders();
    const reminder = {
      id: `reminder_${Date.now()}`,
      title,
      time,
      enabled,
      createdAt: new Date().toISOString(),
    };
    reminders.push(reminder);
    this.set(STORAGE_KEYS.REMINDERS, reminders);
    return reminder;
  }

  updateReminder(id, updates) {
    const reminders = this.getReminders();
    const index = reminders.findIndex((r) => r.id === id);
    if (index !== -1) {
      reminders[index] = { ...reminders[index], ...updates };
      this.set(STORAGE_KEYS.REMINDERS, reminders);
      return reminders[index];
    }
    return null;
  }

  deleteReminder(id) {
    const reminders = this.getReminders();
    const filtered = reminders.filter((r) => r.id !== id);
    this.set(STORAGE_KEYS.REMINDERS, filtered);
    return true;
  }

  // ==================== UTILITIES ====================

  exportAllData() {
    return {
      entries: this.getEntries(),
      analyses: this.getAnalyses(),
      journal: this.getJournalEntries(),
      achievements: this.getAchievements(),
      chatHistory: this.getChatHistory(),
      reminders: this.getReminders(),
      exportedAt: new Date().toISOString(),
    };
  }

  clearAllData() {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
    return true;
  }

  getStorageSize() {
    let total = 0;
    Object.values(STORAGE_KEYS).forEach((key) => {
      const item = localStorage.getItem(key);
      if (item) {
        total += new Blob([item]).size;
      }
    });
    return {
      bytes: total,
      kb: (total / 1024).toFixed(2),
      mb: (total / (1024 * 1024)).toFixed(2),
    };
  }
}

export default new EnhancedStorageService();
