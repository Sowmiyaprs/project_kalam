import { useState, useCallback, useEffect } from 'react';
import storageService from '../services/storage/StorageService.js';

/**
 * React hook for storage operations
 * @returns {Object} Storage state and methods
 */
export function useStorage() {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [quota, setQuota] = useState(null);

  /**
   * Save entry and analysis
   * @param {string} text - Entry text
   * @param {Object} analysisResult - Analysis result
   * @returns {Promise<Object>} Saved data
   */
  const saveEntryAndAnalysis = useCallback(async (text, analysisResult) => {
    setIsSaving(true);
    setError(null);

    try {
      const entry = await storageService.saveEntry(text);
      const analysis = await storageService.saveAnalysis(entry.id, analysisResult);

      // Update quota
      const quotaInfo = storageService.checkStorageQuota();
      setQuota(quotaInfo);

      return { entry, analysis };
    } catch (err) {
      const errorMessage = err.message || 'Failed to save';
      setError(errorMessage);
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, []);

  /**
   * Delete entry
   * @param {string} entryId - Entry ID
   * @returns {Promise<boolean>} Success status
   */
  const deleteEntry = useCallback(async (entryId) => {
    setError(null);

    try {
      await storageService.deleteEntry(entryId);

      // Update quota
      const quotaInfo = storageService.checkStorageQuota();
      setQuota(quotaInfo);

      return true;
    } catch (err) {
      const errorMessage = err.message || 'Failed to delete';
      setError(errorMessage);
      throw err;
    }
  }, []);

  /**
   * Check storage quota
   */
  const checkQuota = useCallback(() => {
    const quotaInfo = storageService.checkStorageQuota();
    setQuota(quotaInfo);
  }, []);

  /**
   * Clear all data
   * @returns {Promise<boolean>} Success status
   */
  const clearAll = useCallback(async () => {
    setError(null);

    try {
      await storageService.clearAll();
      setQuota(null);
      return true;
    } catch (err) {
      const errorMessage = err.message || 'Failed to clear data';
      setError(errorMessage);
      throw err;
    }
  }, []);

  // Check quota on mount
  useEffect(() => {
    checkQuota();
  }, [checkQuota]);

  // Listen for storage events (cross-tab sync)
  useEffect(() => {
    const handleStorageChange = () => {
      checkQuota();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [checkQuota]);

  return {
    saveEntryAndAnalysis,
    deleteEntry,
    clearAll,
    checkQuota,
    isSaving,
    error,
    quota,
  };
}
