/**
 * Type definitions for storage and data management
 * Using JSDoc for type checking
 */

/**
 * @typedef {Object} JournalEntry
 * @property {string} id - Unique entry ID
 * @property {string} text - Journal entry text
 * @property {string} timestamp - ISO timestamp
 * @property {number} wordCount - Number of words
 */

/**
 * @typedef {Object} StoredAnalysis
 * @property {string} id - Analysis ID (matches entry ID)
 * @property {string} entryId - Reference to journal entry
 * @property {string} timestamp - ISO timestamp
 * @property {Object} emotional - Emotional metrics
 * @property {Object} productivity - Productivity metrics
 * @property {string[]} suggestions - Suggestions list
 * @property {string} confidence - Confidence level
 * @property {number} analysisDuration - Duration in ms
 * @property {Object} metadata - Additional metadata
 */

/**
 * @typedef {Object} MindMirrorData
 * @property {JournalEntry[]} entries - All journal entries
 * @property {StoredAnalysis[]} analyses - All analyses
 * @property {string} lastModified - ISO timestamp of last modification
 * @property {number} version - Data schema version
 */

/**
 * @typedef {Object} ChartDataPoint
 * @property {string} date - Date string (YYYY-MM-DD)
 * @property {number} stress - Stress score (0-100)
 * @property {number} motivation - Motivation score (0-100)
 * @property {number} confidence - Confidence score (0-100)
 * @property {number} productivity - Productivity score (0-100)
 * @property {number} focus - Focus score (0-100)
 * @property {string} mood - Mood classification
 */

/**
 * @typedef {Object} HistoryStats
 * @property {number} totalEntries - Total number of entries
 * @property {number} avgStress - Average stress level
 * @property {number} avgMotivation - Average motivation
 * @property {number} avgConfidence - Average confidence
 * @property {number} avgProductivity - Average productivity
 * @property {number} avgFocus - Average focus
 * @property {string} mostCommonMood - Most frequent mood
 * @property {number} longestStreak - Longest consecutive days
 * @property {string} trend - Trend direction ("improving", "declining", "stable")
 */

/**
 * @typedef {Object} StorageQuota
 * @property {number} used - Used storage in bytes
 * @property {number} total - Total storage in bytes
 * @property {number} percentage - Usage percentage (0-100)
 * @property {boolean} needsWarning - Whether to show warning
 */

/**
 * @typedef {Object} ExportData
 * @property {JournalEntry[]} entries - Exported entries
 * @property {StoredAnalysis[]} analyses - Exported analyses
 * @property {string} exportDate - ISO timestamp of export
 * @property {Object} metadata - Export metadata
 */

export {};
