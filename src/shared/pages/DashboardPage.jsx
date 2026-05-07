import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAnalysis } from '../../hooks/useAnalysis.js';
import { useProfile } from '../../contexts/ProfileContext.jsx';
import Card from '../components/Card.jsx';
import MetricCard from '../components/MetricCard.jsx';
import MoodTrendChart from '../../features/visualization/MoodTrendChart.jsx';
import EmotionDistributionChart from '../../features/visualization/EmotionDistributionChart.jsx';
import WeeklyAnalyticsChart from '../../features/visualization/WeeklyAnalyticsChart.jsx';
import { 
  TrendingUp, 
  Brain, 
  Heart, 
  Zap, 
  Target, 
  Calendar,
  Award,
  Activity,
  Flame
} from 'lucide-react';

export default function DashboardPage() {
  const { getStats, getHistory, getLatest } = useAnalysis();
  const { profile } = useProfile();
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [latestAnalysis, setLatestAnalysis] = useState(null);
  const [timeRange, setTimeRange] = useState(7); // days

  useEffect(() => {
    loadDashboardData();
  }, [timeRange]);

  const loadDashboardData = () => {
    const analysisStats = getStats(timeRange);
    const analysisHistory = getHistory(timeRange);
    const latest = getLatest();
    
    setStats(analysisStats);
    setHistory(analysisHistory);
    setLatestAnalysis(latest);
  };

  const getWellnessScore = () => {
    if (!stats || stats.totalEntries === 0) return 0;
    
    // Calculate wellness score based on metrics
    const stressScore = 100 - stats.avgStress;
    const motivationScore = stats.avgMotivation;
    const confidenceScore = stats.avgConfidence;
    
    return Math.round((stressScore + motivationScore + confidenceScore) / 3);
  };

  const getStreakEmoji = (streak) => {
    if (streak >= 30) return '🔥';
    if (streak >= 14) return '⭐';
    if (streak >= 7) return '✨';
    if (streak >= 3) return '💫';
    return '🌟';
  };

  const wellnessScore = getWellnessScore();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-neutral-900 mb-2">
          Welcome back, {profile.username}! 👋
        </h1>
        <p className="text-neutral-600">
          Here's your emotional wellness overview
        </p>
      </motion.div>

      {/* Time Range Selector */}
      <div className="flex gap-2 mb-6">
        {[7, 14, 30].map((days) => (
          <button
            key={days}
            onClick={() => setTimeRange(days)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              timeRange === days
                ? 'bg-lavender-600 text-white shadow-md'
                : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200'
            }`}
          >
            {days} Days
          </button>
        ))}
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <MetricCard
            title="Wellness Score"
            value={wellnessScore}
            unit="%"
            icon={<Heart className="w-6 h-6" />}
            trend={wellnessScore > 60 ? 'up' : wellnessScore < 40 ? 'down' : 'neutral'}
            color="lavender"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <MetricCard
            title="Current Streak"
            value={profile.stats.currentStreak}
            unit="days"
            icon={<Flame className="w-6 h-6" />}
            trend="neutral"
            color="orange"
            badge={getStreakEmoji(profile.stats.currentStreak)}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <MetricCard
            title="Total Entries"
            value={profile.stats.totalEntries}
            unit=""
            icon={<Calendar className="w-6 h-6" />}
            trend="neutral"
            color="blue"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <MetricCard
            title="Avg Motivation"
            value={stats?.avgMotivation || 0}
            unit="%"
            icon={<Zap className="w-6 h-6" />}
            trend={stats?.avgMotivation > 60 ? 'up' : stats?.avgMotivation < 40 ? 'down' : 'neutral'}
            color="yellow"
          />
        </motion.div>
      </div>

      {/* Current State */}
      {latestAnalysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <Card variant="elevated" className="bg-gradient-to-br from-lavender-50 to-white border-lavender-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-neutral-500 mb-1">Current Emotional State</h3>
                <p className="text-2xl font-bold text-lavender-700">{latestAnalysis.emotionalState}</p>
                <p className="text-neutral-600 mt-1">Primary emotion: {latestAnalysis.primaryEmotion}</p>
              </div>
              <div className="text-6xl">
                {latestAnalysis.primaryEmotion === 'Happy' && '😊'}
                {latestAnalysis.primaryEmotion === 'Sad' && '😢'}
                {latestAnalysis.primaryEmotion === 'Stressed' && '😫'}
                {latestAnalysis.primaryEmotion === 'Confident' && '😎'}
                {latestAnalysis.primaryEmotion === 'Motivated' && '💪'}
                {latestAnalysis.primaryEmotion === 'Calm' && '😌'}
                {latestAnalysis.primaryEmotion === 'Anxious' && '😰'}
                {latestAnalysis.primaryEmotion === 'Tired' && '😴'}
                {!['Happy', 'Sad', 'Stressed', 'Confident', 'Motivated', 'Calm', 'Anxious', 'Tired'].includes(latestAnalysis.primaryEmotion) && '😐'}
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Mood Trend */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card variant="elevated">
            <h3 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-lavender-600" />
              Mood Trends
            </h3>
            <MoodTrendChart data={history} />
          </Card>
        </motion.div>

        {/* Emotion Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card variant="elevated">
            <h3 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-lavender-600" />
              Emotion Distribution
            </h3>
            <EmotionDistributionChart data={stats?.moodDistribution || {}} />
          </Card>
        </motion.div>
      </div>

      {/* Weekly Analytics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mb-8"
      >
        <Card variant="elevated">
          <h3 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
            <Brain className="w-5 h-5 text-lavender-600" />
            Weekly Analytics
          </h3>
          <WeeklyAnalyticsChart data={history} />
        </Card>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <Card variant="elevated">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <Brain className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-neutral-500 font-medium">Avg Stress</p>
                <p className="text-2xl font-bold text-neutral-900">{stats?.avgStress || 0}%</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
        >
          <Card variant="elevated">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-neutral-500 font-medium">Avg Confidence</p>
                <p className="text-2xl font-bold text-neutral-900">{stats?.avgConfidence || 0}%</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
        >
          <Card variant="elevated">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-lavender-100 rounded-lg">
                <Award className="w-6 h-6 text-lavender-600" />
              </div>
              <div>
                <p className="text-sm text-neutral-500 font-medium">Longest Streak</p>
                <p className="text-2xl font-bold text-neutral-900">{profile.stats.longestStreak} days</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Empty State */}
      {stats && stats.totalEntries === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Card variant="elevated" className="text-center py-12">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-2xl font-bold text-neutral-900 mb-2">No Data Yet</h3>
            <p className="text-neutral-600 mb-6">
              Start analyzing your mood to see your wellness dashboard come to life!
            </p>
            <a
              href="/analysis"
              className="inline-block px-6 py-3 bg-gradient-to-r from-lavender-600 to-lavender-700 text-white rounded-lg font-semibold hover:from-lavender-700 hover:to-lavender-800 transition shadow-md"
            >
              Start Your First Analysis
            </a>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
