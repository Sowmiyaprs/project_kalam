/**
 * Storage configuration constants
 */

export const STORAGE_CONFIG = {
  STORAGE_KEY: 'mindmirror_data',
  MAX_ENTRIES: 100,
  RETENTION_DAYS: 30,
  CACHE_EXPIRATION_MS: 5 * 60 * 1000, // 5 minutes
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY_MS: 100,
  QUOTA_WARNING_THRESHOLD: 0.8, // 80%
};

export const STORAGE_ERRORS = {
  QUOTA_EXCEEDED: 'Storage quota exceeded',
  SAVE_FAILED: 'Failed to save data',
  LOAD_FAILED: 'Failed to load data',
  DELETE_FAILED: 'Failed to delete data',
  CORRUPTION: 'Data corruption detected',
  NOT_FOUND: 'Entry not found',
};
