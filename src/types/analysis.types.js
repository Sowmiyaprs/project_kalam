/**
 * Type definitions for sentiment analysis
 * Using JSDoc for type checking
 */

/**
 * @typedef {Object} EmotionalMetrics
 * @property {string} mood - Classified mood (e.g., "Happy", "Stressed", "Neutral")
 * @property {number} stressLevel - Stress score (0-100)
 * @property {number} motivation - Motivation score (0-100)
 * @property {number} confidence - Confidence score (0-100)
 */

/**
 * @typedef {Object} ProductivityMetrics
 * @property {string} score - Productivity level ("High", "Medium", "Low")
 * @property {string} focusLevel - Focus level ("Excellent", "Good", "Improving", "Needs Work")
 * @property {number} productivityScore - Raw productivity score (0-100)
 * @property {number} focusScore - Raw focus score (0-100)
 */

/**
 * @typedef {Object} AnalysisMetadata
 * @property {number} wordCount - Number of words in input
 * @property {number} keywordMatches - Number of keywords detected
 * @property {boolean} simplifiedMode - Whether simplified mode was used
 */

/**
 * @typedef {Object} AnalysisResult
 * @property {string} id - Unique analysis ID
 * @property {string} timestamp - ISO timestamp of analysis
 * @property {EmotionalMetrics} emotional - Emotional metrics
 * @property {ProductivityMetrics} productivity - Productivity metrics
 * @property {string[]} suggestions - Personalized suggestions (3-5 items)
 * @property {string} confidence - Overall confidence level ("high", "medium", "low", "very_low")
 * @property {number} analysisDuration - Analysis duration in milliseconds
 * @property {AnalysisMetadata} metadata - Additional metadata
 */

/**
 * @typedef {Object} KeywordMatch
 * @property {string} word - Matched keyword
 * @property {string} category - Keyword category
 * @property {number} originalWeight - Original keyword weight
 * @property {number} adjustedWeight - Weight after negation/modifier
 * @property {boolean} isNegated - Whether keyword was negated
 * @property {number} intensityModifier - Intensity modifier applied
 * @property {string} sentiment - Sentiment type ("positive", "negative", "calm")
 */

/**
 * @typedef {Object} DetectionResult
 * @property {KeywordMatch[]} keywords - Detected keywords
 * @property {number} totalMatches - Total number of matches
 * @property {Object.<string, number>} categoryCounts - Count per category
 * @property {number} wordCount - Total word count
 */

export {};
