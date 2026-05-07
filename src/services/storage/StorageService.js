import { STORAGE_CONFIG, STORAGE_ERRORS } from './config/constants.js';
import { sanitizeInput } from '../../utils/validation.js';

/**
 * StorageService
 * Handles data persistence using localStorage
 */
export class StorageService {
  constructor() {
    this.cache = null;
    this.cacheTimestamp = null;
  }

  /**
   * Get data from localStorage with caching
   * @returns {Object} Stored data
   */
  getData() {
    // Check cache
    if (
      this.cache &&
      this.cacheTimestamp &&
      Date.now() - this.cacheTimestamp < STORAGE_CONFIG.CACHE_EXPIRATION_MS
    ) {
      return this.cache;
    }

    // Load from localStorage
    try {
      const stored = localStorage.getItem(STORAGE_CONFIG.STORAGE_KEY);
      if (!stored) {
        const emptyData = this.createEmptyData();
        this.cache = emptyData;
        this.cacheTimestamp = Date.now();
        return emptyData;
      }

      const data = JSON.parse(stored);
      this.cache = data;
      this.cacheTimestamp = Date.now();
      return data;
    } catch (error) {
      console.error('Error loading data:', error);
      return this.createEmptyData();
    }
  }

  /**
   * Save data to localStorage with retry logic
   * @param {Object} data - Data to save
   * @returns {Promise<boolean>} Success status
   */
  async saveData(data) {
    for (let attempt = 0; attempt < STORAGE_CONFIG.RETRY_ATTEMPTS; attempt++) {
      try {
        const dataToSave = {
          ...data,
          lastModified: new Date().toISOString(),
          version: 1,
        };

        localStorage.setItem(
          STORAGE_CONFIG.STORAGE_KEY,
          JSON.stringify(dataToSave)
        );

        // Update cache
        this.cache = dataToSave;
        this.cacheTimestamp = Date.now();

        return true;
      } catch (error) {
        console.error(`Save attempt ${attempt + 1} failed:`, error);

        if (error.name === 'QuotaExceededError') {
          // Try cleanup and retry
          await this.cleanup();
        } else if (attempt < STORAGE_CONFIG.RETRY_ATTEMPTS - 1) {
          // Wait before retry
          await new Promise((resolve) =>
            setTimeout(resolve, STORAGE_CONFIG.RETRY_DELAY_MS * (attempt + 1))
          );
        }
      }
    }

    throw new Error(STORAGE_ERRORS.SAVE_FAILED);
  }

  /**
   * Create empty data structure
   * @returns {Object} Empty data
   */
  createEmptyData() {
    return {
      entries: [],
      analyses: [],
      lastModified: new Date().toISOString(),
      version: 1,
    };
  }

  /**
   * Save journal entry
   * @param {string} text - Entry text
   * @returns {Promise<Object>} Saved entry
   */
  async saveEntry(text) {
    const sanitized = sanitizeInput(text);
    const data = this.getData();

    const entry = {
      id: `entry_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      text: sanitized,
      timestamp: new Date().toISOString(),
      wordCount: sanitized.split(/\s+/).length,
    };

    data.entries.push(entry);
    await this.saveData(data);

    return entry;
  }

  /**
   * Save analysis result
   * @param {string} entryId - Entry ID
   * @param {Object} analysisResult - Analysis result
   * @returns {Promise<Object>} Saved analysis
   */
  async saveAnalysis(entryId, analysisResult) {
    const data = this.getData();

    const analysis = {
      ...analysisResult,
      entryId,
    };

    data.analyses.push(analysis);
    await this.saveData(data);

    return analysis;
  }

  /**
   * Get latest analysis
   * @returns {Object|null} Latest analysis or null
   */
  getLatestAnalysis() {
    const data = this.getData();
    if (data.analyses.length === 0) return null;

    return data.analyses[data.analyses.length - 1];
  }

  /**
   * Get history data
   * @param {number} days - Number of days
   * @returns {Array} History data
   */
  getHistoryData(days = 30) {
    const data = this.getData();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return data.analyses.filter(
      (analysis) => new Date(analysis.timestamp) >= cutoffDate
    );
  }

  /**
   * Delete entry and associated analysis
   * @param {string} entryId - Entry ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteEntry(entryId) {
    const data = this.getData();

    data.entries = data.entries.filter((e) => e.id !== entryId);
    data.analyses = data.analyses.filter((a) => a.entryId !== entryId);

    await this.saveData(data);
    return true;
  }

  /**
   * Cleanup old entries
   * @returns {Promise<number>} Number of entries removed
   */
  async cleanup() {
    const data = this.getData();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - STORAGE_CONFIG.RETENTION_DAYS);

    const initialCount = data.entries.length;

    data.entries = data.entries.filter(
      (entry) => new Date(entry.timestamp) >= cutoffDate
    );

    const entryIds = new Set(data.entries.map((e) => e.id));
    data.analyses = data.analyses.filter((a) => entryIds.has(a.entryId));

    await this.saveData(data);

    return initialCount - data.entries.length;
  }

  /**
   * Check storage quota
   * @returns {Object} Quota information
   */
  checkStorageQuota() {
    try {
      const data = JSON.stringify(this.getData());
      const used = new Blob([data]).size;
      const total = 5 * 1024 * 1024; // 5MB typical localStorage limit
      const percentage = (used / total) * 100;

      return {
        used,
        total,
        percentage,
        needsWarning: percentage >= STORAGE_CONFIG.QUOTA_WARNING_THRESHOLD * 100,
      };
    } catch (error) {
      console.error('Error checking quota:', error);
      return {
        used: 0,
        total: 0,
        percentage: 0,
        needsWarning: false,
      };
    }
  }

  /**
   * Clear all data
   * @returns {Promise<boolean>} Success status
   */
  async clearAll() {
    try {
      localStorage.removeItem(STORAGE_CONFIG.STORAGE_KEY);
      this.cache = null;
      this.cacheTimestamp = null;
      return true;
    } catch (error) {
      console.error('Error clearing data:', error);
      return false;
    }
  }
}

// Export singleton instance
export default new StorageService();
