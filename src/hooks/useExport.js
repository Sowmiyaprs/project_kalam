import { useState, useCallback } from 'react';
import storageService from '../services/storage/StorageService.js';
import exportService from '../services/storage/ExportService.js';

/**
 * React hook for export operations
 * @returns {Object} Export state and methods
 */
export function useExport() {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Export history data
   * @param {Object} dateRange - Optional date range filter
   * @returns {Promise<void>}
   */
  const exportHistory = useCallback(async (dateRange = null) => {
    setIsExporting(true);
    setError(null);

    try {
      const data = storageService.getData();
      const exportData = exportService.exportHistory(
        data.entries,
        data.analyses,
        dateRange
      );

      const filename = dateRange
        ? `mindmirror-export-${dateRange.start}-to-${dateRange.end}.json`
        : 'mindmirror-export-all.json';

      exportService.downloadJSON(exportData, filename);
    } catch (err) {
      const errorMessage = err.message || 'Export failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsExporting(false);
    }
  }, []);

  /**
   * Export latest analysis
   * @returns {Promise<void>}
   */
  const exportLatest = useCallback(async () => {
    setIsExporting(true);
    setError(null);

    try {
      const analysis = storageService.getLatestAnalysis();
      if (!analysis) {
        throw new Error('No analysis to export');
      }

      const exportData = exportService.exportLatest(analysis);
      exportService.downloadJSON(exportData, 'mindmirror-latest.json');
    } catch (err) {
      const errorMessage = err.message || 'Export failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsExporting(false);
    }
  }, []);

  return {
    exportHistory,
    exportLatest,
    isExporting,
    error,
  };
}
