import { useState, useCallback } from 'react';
import advancedSentimentEngine from '../services/sentiment/AdvancedSentimentEngine.js';
import enhancedStorage from '../services/storage/EnhancedStorageService.js';
import { useProfile } from '../contexts/ProfileContext.jsx';

/**
 * React hook for sentiment analysis with persistence
 * @returns {Object} Analysis state and methods
 */
export function useAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const { recordCheckIn } = useProfile();

  /**
   * Analyze text with advanced sentiment engine
   * @param {string} text - Input text
   * @param {boolean} saveToHistory - Whether to save to history
   * @returns {Promise<Object>} Analysis result
   */
  const analyze = useCallback(async (text, saveToHistory = true) => {
    setIsAnalyzing(true);
    setError(null);

    try {
      // Perform analysis
      const analysisResult = advancedSentimentEngine.analyze(text);
      setResult(analysisResult);

      // Save to storage if requested
      if (saveToHistory && text.trim().length > 0) {
        const entry = enhancedStorage.saveEntry(text);
        enhancedStorage.saveAnalysis(entry.id, analysisResult);
        
        // Update user stats
        recordCheckIn();
      }

      return analysisResult;
    } catch (err) {
      const errorMessage = err.message || 'Analysis failed';
      setError(errorMessage);
      console.error('Analysis error:', err);
      throw err;
    } finally {
      setIsAnalyzing(false);
    }
  }, [recordCheckIn]);

  /**
   * Get analysis history
   * @param {number} days - Number of days to retrieve
   * @returns {Array} Analysis history
   */
  const getHistory = useCallback((days = 30) => {
    return enhancedStorage.getAnalysesByDateRange(
      new Date(Date.now() - days * 24 * 60 * 60 * 1000),
      new Date()
    );
  }, []);

  /**
   * Get latest analysis from storage
   * @returns {Object|null} Latest analysis
   */
  const getLatest = useCallback(() => {
    return enhancedStorage.getLatestAnalysis();
  }, []);

  /**
   * Get analysis statistics
   * @param {number} days - Number of days
   * @returns {Object} Statistics
   */
  const getStats = useCallback((days = 30) => {
    return enhancedStorage.getAnalysisStats(days);
  }, []);

  /**
   * Clear current analysis result
   */
  const clearResult = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  /**
   * Delete an analysis entry
   * @param {string} entryId - Entry ID to delete
   */
  const deleteEntry = useCallback((entryId) => {
    try {
      enhancedStorage.deleteEntry(entryId);
      return true;
    } catch (err) {
      console.error('Delete error:', err);
      return false;
    }
  }, []);

  return {
    analyze,
    isAnalyzing,
    result,
    error,
    clearResult,
    getHistory,
    getLatest,
    getStats,
    deleteEntry,
  };
}
