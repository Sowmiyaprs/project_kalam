import { motion } from 'framer-motion';
import Card from '../../shared/components/Card.jsx';
import { TrendingUp, TrendingDown, Minus, Brain, Heart, Zap, Target, Sparkles } from 'lucide-react';

const MOOD_EMOJI_MAP = {
  'Happy': '😊',
  'Sad': '😢',
  'Angry': '😠',
  'Anxious': '😰',
  'Stressed': '😫',
  'Confident': '😎',
  'Motivated': '💪',
  'Tired': '😴',
  'Calm': '😌',
  'Neutral': '😐',
};

const EMOTIONAL_STATE_COLORS = {
  'Thriving': 'bg-gradient-to-br from-green-50 to-green-100 border-green-300',
  'Balanced': 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-300',
  'Calm & Stable': 'bg-gradient-to-br from-cyan-50 to-cyan-100 border-cyan-300',
  'Moderate': 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-300',
  'High Stress': 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-300',
  'Burnout Risk': 'bg-gradient-to-br from-red-50 to-red-100 border-red-300',
  'Low Energy': 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-300',
  'Emotional Distress': 'bg-gradient-to-br from-red-50 to-red-100 border-red-400',
  'Awaiting Input': 'bg-gradient-to-br from-neutral-50 to-neutral-100 border-neutral-300',
};

const EMOTIONAL_STATE_TEXT_COLORS = {
  'Thriving': 'text-green-700',
  'Balanced': 'text-blue-700',
  'Calm & Stable': 'text-cyan-700',
  'Moderate': 'text-yellow-700',
  'High Stress': 'text-orange-700',
  'Burnout Risk': 'text-red-700',
  'Low Energy': 'text-purple-700',
  'Emotional Distress': 'text-red-700',
  'Awaiting Input': 'text-neutral-700',
};

export default function AnalysisResults({ result }) {
  if (!result) return null;

  const { metrics, primaryEmotion, emotionalState, insights, suggestions } = result;

  const getMetricIcon = (value, label) => {
    if (label === 'Stress') {
      return value > 60 ? <TrendingUp className="w-5 h-5 text-red-500" /> : <TrendingDown className="w-5 h-5 text-green-500" />;
    }
    if (value > 60) return <TrendingUp className="w-5 h-5 text-green-500" />;
    if (value < 40) return <TrendingDown className="w-5 h-5 text-red-500" />;
    return <Minus className="w-5 h-5 text-yellow-500" />;
  };

  const getMetricColor = (value, isStress = false) => {
    if (isStress) {
      if (value > 70) return 'from-red-500 to-orange-500';
      if (value > 40) return 'from-yellow-500 to-orange-500';
      return 'from-green-500 to-emerald-500';
    }
    if (value > 70) return 'from-green-500 to-emerald-500';
    if (value > 40) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-orange-500';
  };

  const metricsData = [
    { 
      label: 'Stress', 
      value: metrics.stress, 
      icon: <Brain className="w-5 h-5" />,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      isStress: true 
    },
    { 
      label: 'Motivation', 
      value: metrics.motivation, 
      icon: <Zap className="w-5 h-5" />,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      isStress: false 
    },
    { 
      label: 'Confidence', 
      value: metrics.confidence, 
      icon: <Target className="w-5 h-5" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      isStress: false 
    },
    { 
      label: 'Balance', 
      value: metrics.emotionalBalance, 
      icon: <Heart className="w-5 h-5" />,
      color: 'text-lavender-600',
      bgColor: 'bg-lavender-100',
      isStress: false 
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Primary Emotion & State */}
      <Card variant="elevated" className={`${EMOTIONAL_STATE_COLORS[emotionalState] || 'bg-white'} border-2`}>
        <div className="text-center py-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="text-7xl mb-3"
          >
            {MOOD_EMOJI_MAP[primaryEmotion] || '😐'}
          </motion.div>
          <h3 className="text-3xl font-bold text-neutral-900 mb-2">
            {primaryEmotion}
          </h3>
          <p className={`text-lg font-semibold ${EMOTIONAL_STATE_TEXT_COLORS[emotionalState] || 'text-neutral-700'}`}>
            {emotionalState}
          </p>
        </div>
      </Card>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-4">
        {metricsData.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card variant="elevated" className="bg-white">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 ${metric.bgColor} rounded-lg ${metric.color}`}>
                      {metric.icon}
                    </div>
                    <span className="font-semibold text-neutral-700">{metric.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getMetricIcon(metric.value, metric.label)}
                    <span className="text-2xl font-bold text-neutral-900">
                      {metric.value}%
                    </span>
                  </div>
                </div>
                <div className="w-full bg-neutral-200 rounded-full h-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${metric.value}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className={`bg-gradient-to-r ${getMetricColor(metric.value, metric.isStress)} h-3 rounded-full shadow-md`}
                  />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Insights */}
      {insights && insights.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card variant="elevated" className="bg-white">
            <h4 className="text-xl font-bold mb-4 flex items-center gap-2 text-neutral-900">
              <div className="p-2 bg-lavender-100 rounded-lg">
                <Sparkles className="w-5 h-5 text-lavender-600" />
              </div>
              <span>AI Insights</span>
            </h4>
            <div className="space-y-3">
              {insights.map((insight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-start gap-3 p-4 bg-neutral-50 rounded-lg border border-neutral-200"
                >
                  <span className="text-lavender-600 text-xl font-bold">•</span>
                  <p className="text-neutral-700 flex-1">{insight}</p>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Suggestions */}
      {suggestions && suggestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card variant="elevated" className="bg-white">
            <h4 className="text-xl font-bold mb-4 flex items-center gap-2 text-neutral-900">
              <span className="text-2xl">💡</span>
              <span>Personalized Suggestions</span>
            </h4>
            <div className="grid gap-4">
              {suggestions.map((suggestion, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="p-4 bg-gradient-to-r from-lavender-50 to-white rounded-lg border border-lavender-200 hover:border-lavender-400 hover:shadow-md transition-all"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">{suggestion.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-lavender-600 uppercase tracking-wide">
                          {suggestion.category}
                        </span>
                      </div>
                      <h5 className="font-semibold text-neutral-900 mb-1">
                        {suggestion.title}
                      </h5>
                      <p className="text-sm text-neutral-600">
                        {suggestion.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
