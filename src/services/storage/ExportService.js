import { isDateInRange } from '../../utils/dateUtils.js';

/**
 * ExportService
 * Handles data export functionality
 */
export class ExportService {
  /**
   * Export history data to JSON
   * @param {Array} entries - Journal entries
   * @param {Array} analyses - Analysis results
   * @param {Object} dateRange - Optional date range filter
   * @returns {Object} Export data
   */
  exportHistory(entries, analyses, dateRange = null) {
    let filteredEntries = entries;
    let filteredAnalyses = analyses;

    // Apply date range filter if provided
    if (dateRange && dateRange.start && dateRange.end) {
      filteredEntries = entries.filter((entry) =>
        isDateInRange(entry.timestamp, dateRange.start, dateRange.end)
      );

      const entryIds = new Set(filteredEntries.map((e) => e.id));
      filteredAnalyses = analyses.filter((a) => entryIds.has(a.entryId));
    }

    return {
      entries: filteredEntries,
      analyses: filteredAnalyses,
      exportDate: new Date().toISOString(),
      metadata: {
        totalEntries: filteredEntries.length,
        totalAnalyses: filteredAnalyses.length,
        dateRange: dateRange || 'all',
      },
    };
  }

  /**
   * Export latest analysis only
   * @param {Object} analysis - Latest analysis
   * @returns {Object} Export data
   */
  exportLatest(analysis) {
    return {
      analysis,
      exportDate: new Date().toISOString(),
      metadata: {
        type: 'latest',
      },
    };
  }

  /**
   * Download export data as JSON file
   * @param {Object} data - Data to export
   * @param {string} filename - Filename
   */
  downloadJSON(data, filename = 'mindmirror-export.json') {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }
}

// Export singleton instance
export default new ExportService();
