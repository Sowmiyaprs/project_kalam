import { useState, useCallback, useEffect } from 'react';
import storageService from '../services/storage/StorageService.js';
import dataTransformationService from '../services/storage/DataTransformationService.js';

/**
 * React hook for history data
 * @param {number} days - Number of days to retrieve
 * @returns {Object} History state and methods
 */
export function useHistory(days = 30) {
  const [historyData, setHistoryData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Load history data
   */
  const loadHistory = useCallback(() => {
    setIsLoading(true);
    setError(null);

    try {
      const analyses = storageService.getHistoryData(days);
      setHistoryData(analyses);

      // Transform for chart
      const transformed = dataTransformationService.transformForChart(analyses);
      setChartData(transformed);

      // Calculate statistics
      const stats = dataTransformationService.calculateStatistics(analyses);
      setStatistics(stats);
    } catch (err) {
      const errorMessage = err.message || 'Failed to load history';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [days]);

  /**
   * Refresh history data
   */
  const refresh = useCallback(() => {
    loadHistory();
  }, [loadHistory]);

  // Load on mount and when days change
  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  // Listen for storage events (cross-tab sync)
  useEffect(() => {
    const handleStorageChange = () => {
      loadHistory();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [loadHistory]);

  return {
    historyData,
    chartData,
    statistics,
    isLoading,
    error,
    refresh,
  };
}
