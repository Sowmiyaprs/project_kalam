import { formatDate, groupByDate } from '../../utils/dateUtils.js';

/**
 * DataTransformationService
 * Transforms data for charts and statistics
 */
export class DataTransformationService {
  /**
   * Transform analyses to chart data points
   * @param {Array} analyses - Analysis results
   * @returns {Array} Chart data points
   */
  transformForChart(analyses) {
    if (!analyses || analyses.length === 0) return [];

    // Group by date
    const grouped = groupByDate(analyses);

    // Transform each date group
    return Object.entries(grouped).map(([date, items]) => {
      // Average scores for the day
      const avgStress =
        items.reduce((sum, item) => sum + item.emotional.stressLevel, 0) /
        items.length;
      const avgMotivation =
        items.reduce((sum, item) => sum + item.emotional.motivation, 0) /
        items.length;
      const avgConfidence =
        items.reduce((sum, item) => sum + item.emotional.confidence, 0) /
        items.length;
      const avgProductivity =
        items.reduce((sum, item) => sum + item.productivity.productivityScore, 0) /
        items.length;
      const avgFocus =
        items.reduce((sum, item) => sum + item.productivity.focusScore, 0) /
        items.length;

      // Most common mood
      const moodCounts = {};
      items.forEach((item) => {
        const mood = item.emotional.mood;
        moodCounts[mood] = (moodCounts[mood] || 0) + 1;
      });
      const mostCommonMood = Object.entries(moodCounts).reduce((a, b) =>
        a[1] > b[1] ? a : b
      )[0];

      return {
        date,
        stress: Math.round(avgStress),
        motivation: Math.round(avgMotivation),
        confidence: Math.round(avgConfidence),
        productivity: Math.round(avgProductivity),
        focus: Math.round(avgFocus),
        mood: mostCommonMood,
      };
    }).sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  /**
   * Calculate statistics from analyses
   * @param {Array} analyses - Analysis results
   * @returns {Object} Statistics
   */
  calculateStatistics(analyses) {
    if (!analyses || analyses.length === 0) {
      return {
        totalEntries: 0,
        avgStress: 0,
        avgMotivation: 0,
        avgConfidence: 0,
        avgProductivity: 0,
        avgFocus: 0,
        mostCommonMood: 'Neutral',
        longestStreak: 0,
        trend: 'stable',
      };
    }

    // Calculate averages
    const avgStress =
      analyses.reduce((sum, a) => sum + a.emotional.stressLevel, 0) /
      analyses.length;
    const avgMotivation =
      analyses.reduce((sum, a) => sum + a.emotional.motivation, 0) /
      analyses.length;
    const avgConfidence =
      analyses.reduce((sum, a) => sum + a.emotional.confidence, 0) /
      analyses.length;
    const avgProductivity =
      analyses.reduce((sum, a) => sum + a.productivity.productivityScore, 0) /
      analyses.length;
    const avgFocus =
      analyses.reduce((sum, a) => sum + a.productivity.focusScore, 0) /
      analyses.length;

    // Most common mood
    const moodCounts = {};
    analyses.forEach((a) => {
      const mood = a.emotional.mood;
      moodCounts[mood] = (moodCounts[mood] || 0) + 1;
    });
    const mostCommonMood =
      Object.keys(moodCounts).length > 0
        ? Object.entries(moodCounts).reduce((a, b) => (a[1] > b[1] ? a : b))[0]
        : 'Neutral';

    // Calculate longest streak
    const dates = analyses
      .map((a) => formatDate(a.timestamp))
      .sort()
      .filter((date, index, arr) => arr.indexOf(date) === index);

    let longestStreak = 0;
    let currentStreak = 1;

    for (let i = 1; i < dates.length; i++) {
      const prevDate = new Date(dates[i - 1]);
      const currDate = new Date(dates[i]);
      const diffDays = (currDate - prevDate) / (1000 * 60 * 60 * 24);

      if (diffDays === 1) {
        currentStreak++;
        longestStreak = Math.max(longestStreak, currentStreak);
      } else {
        currentStreak = 1;
      }
    }

    longestStreak = Math.max(longestStreak, currentStreak);

    // Calculate trend (compare first half vs second half)
    const midpoint = Math.floor(analyses.length / 2);
    const firstHalf = analyses.slice(0, midpoint);
    const secondHalf = analyses.slice(midpoint);

    const firstAvgMotivation =
      firstHalf.reduce((sum, a) => sum + a.emotional.motivation, 0) /
      firstHalf.length;
    const secondAvgMotivation =
      secondHalf.reduce((sum, a) => sum + a.emotional.motivation, 0) /
      secondHalf.length;

    let trend = 'stable';
    if (secondAvgMotivation > firstAvgMotivation + 10) {
      trend = 'improving';
    } else if (secondAvgMotivation < firstAvgMotivation - 10) {
      trend = 'declining';
    }

    return {
      totalEntries: analyses.length,
      avgStress: Math.round(avgStress),
      avgMotivation: Math.round(avgMotivation),
      avgConfidence: Math.round(avgConfidence),
      avgProductivity: Math.round(avgProductivity),
      avgFocus: Math.round(avgFocus),
      mostCommonMood,
      longestStreak,
      trend,
    };
  }
}

// Export singleton instance
export default new DataTransformationService();
