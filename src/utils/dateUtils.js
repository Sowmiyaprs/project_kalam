/**
 * Date manipulation utilities
 */

/**
 * Format date to YYYY-MM-DD
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date
 */
export function formatDate(date) {
  const d = typeof date === 'string' ? new Date(date) : date;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Format relative time (e.g., "2 hours ago")
 * @param {string} timestamp - ISO timestamp
 * @returns {string} Relative time string
 */
export function formatRelativeTime(timestamp) {
  const now = new Date();
  const then = new Date(timestamp);
  const diffMs = now - then;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return 'Just now';
  if (diffMin < 60) return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
  if (diffHour < 24) return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
  if (diffDay === 1) return 'Yesterday';
  if (diffDay < 7) return `${diffDay} days ago`;
  if (diffDay < 30) {
    const weeks = Math.floor(diffDay / 7);
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  }
  return formatDate(then);
}

/**
 * Format absolute time (e.g., "May 6, 2026 at 3:30 PM")
 * @param {string} timestamp - ISO timestamp
 * @returns {string} Formatted date and time
 */
export function formatAbsoluteTime(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Get date range for last N days
 * @param {number} days - Number of days
 * @returns {Object} Start and end dates
 */
export function getDateRange(days = 30) {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - days);

  return {
    start: formatDate(start),
    end: formatDate(end),
  };
}

/**
 * Check if date is within range
 * @param {string} date - Date to check (YYYY-MM-DD)
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD)
 * @returns {boolean} True if within range
 */
export function isDateInRange(date, startDate, endDate) {
  const d = new Date(date);
  const start = new Date(startDate);
  const end = new Date(endDate);
  return d >= start && d <= end;
}

/**
 * Get days between two dates
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD)
 * @returns {number} Number of days
 */
export function getDaysBetween(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffMs = end - start;
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Group data by date
 * @param {Array} data - Data with timestamp property
 * @returns {Object} Data grouped by date
 */
export function groupByDate(data) {
  return data.reduce((groups, item) => {
    const date = formatDate(item.timestamp);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(item);
    return groups;
  }, {});
}
