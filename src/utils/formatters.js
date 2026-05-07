/**
 * Formatting utilities
 */

export { formatDate, formatRelativeTime, formatAbsoluteTime } from './dateUtils.js';

/**
 * Format number as percentage
 * @param {number} value - Value (0-100)
 * @returns {string} Formatted percentage
 */
export function formatPercentage(value) {
  return `${Math.round(value)}%`;
}

/**
 * Format metric score with category
 * @param {number} score - Score (0-100)
 * @returns {Object} Formatted score with category
 */
export function formatMetricScore(score) {
  let category, color;

  if (score >= 70) {
    category = 'High';
    color = 'green';
  } else if (score >= 40) {
    category = 'Medium';
    color = 'yellow';
  } else {
    category = 'Low';
    color = 'red';
  }

  return {
    score: Math.round(score),
    percentage: formatPercentage(score),
    category,
    color,
  };
}
