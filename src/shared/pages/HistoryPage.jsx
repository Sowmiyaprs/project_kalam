import { useHistory } from '../../hooks/useHistory.js';
import { useExport } from '../../hooks/useExport.js';
import Card from '../components/Card.jsx';
import Button from '../components/Button.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { MOOD_EMOJI_MAP } from '../../utils/constants.js';

export default function HistoryPage() {
  const { chartData, statistics, isLoading } = useHistory(30);
  const { exportHistory, isExporting } = useExport();

  const handleExport = async () => {
    try {
      await exportHistory();
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="large" message="Loading history..." />
      </div>
    );
  }

  if (!statistics || statistics.totalEntries === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Card variant="glassmorphism">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📊</div>
            <h2 className="text-2xl font-bold mb-2">No History Yet</h2>
            <p className="text-gray-400 mb-6">
              Start analyzing your mood to see your history here
            </p>
            <Button variant="primary" onClick={() => window.location.href = '/analysis'}>
              Start First Analysis
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold gradient-text mb-2">
            Mood History
          </h1>
          <p className="text-gray-400">
            Last 30 days of emotional tracking
          </p>
        </div>
        <Button
          variant="secondary"
          onClick={handleExport}
          loading={isExporting}
        >
          📥 Export Data
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <Card variant="glassmorphism">
          <div className="text-center">
            <div className="text-3xl mb-2">📝</div>
            <div className="text-2xl font-bold">{statistics.totalEntries}</div>
            <div className="text-sm text-gray-400">Total Entries</div>
          </div>
        </Card>

        <Card variant="glassmorphism">
          <div className="text-center">
            <div className="text-3xl mb-2">
              {MOOD_EMOJI_MAP[statistics.mostCommonMood] || '😐'}
            </div>
            <div className="text-lg font-bold">{statistics.mostCommonMood}</div>
            <div className="text-sm text-gray-400">Most Common Mood</div>
          </div>
        </Card>

        <Card variant="glassmorphism">
          <div className="text-center">
            <div className="text-3xl mb-2">🔥</div>
            <div className="text-2xl font-bold">{statistics.longestStreak}</div>
            <div className="text-sm text-gray-400">Day Streak</div>
          </div>
        </Card>

        <Card variant="glassmorphism">
          <div className="text-center">
            <div className="text-3xl mb-2">
              {statistics.trend === 'improving' ? '📈' : statistics.trend === 'declining' ? '📉' : '➡️'}
            </div>
            <div className="text-lg font-bold capitalize">{statistics.trend}</div>
            <div className="text-sm text-gray-400">Trend</div>
          </div>
        </Card>
      </div>

      {/* Average Metrics */}
      <Card variant="glassmorphism">
        <h3 className="text-xl font-bold mb-4 gradient-text">
          Average Metrics (30 Days)
        </h3>
        <div className="grid md:grid-cols-5 gap-4">
          {[
            { label: 'Stress', value: statistics.avgStress },
            { label: 'Motivation', value: statistics.avgMotivation },
            { label: 'Confidence', value: statistics.avgConfidence },
            { label: 'Productivity', value: statistics.avgProductivity },
            { label: 'Focus', value: statistics.avgFocus },
          ].map((metric) => (
            <div key={metric.label}>
              <div className="text-sm text-gray-400 mb-2">{metric.label}</div>
              <div className="w-full bg-gray-700 rounded-full h-2 mb-1">
                <div
                  className="bg-gradient-to-r from-neon-blue to-neon-purple h-2 rounded-full"
                  style={{ width: `${metric.value}%` }}
                />
              </div>
              <div className="text-right text-sm font-bold">{metric.value}%</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Chart Data Preview */}
      {chartData.length > 0 && (
        <Card variant="glassmorphism" className="mt-8">
          <h3 className="text-xl font-bold mb-4 gradient-text">
            Recent Entries
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
            {chartData.slice(-10).reverse().map((data, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{MOOD_EMOJI_MAP[data.mood] || '😐'}</span>
                  <div>
                    <div className="font-semibold">{data.mood}</div>
                    <div className="text-sm text-gray-400">{data.date}</div>
                  </div>
                </div>
                <div className="text-sm text-gray-400">
                  Motivation: {data.motivation}%
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
