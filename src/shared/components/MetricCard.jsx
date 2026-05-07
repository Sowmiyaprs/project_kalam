import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import Card from './Card.jsx';

/**
 * MetricCard Component
 * Displays a metric with icon, value, and optional trend
 */
export default function MetricCard({ 
  title,
  icon, 
  label, 
  value, 
  unit = '', 
  trend, 
  color = 'lavender',
  badge,
  className = '' 
}) {
  const colorClasses = {
    lavender: 'bg-lavender-100 text-lavender-600',
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600',
    pink: 'bg-pink-100 text-pink-600',
    green: 'bg-green-100 text-green-600',
    orange: 'bg-orange-100 text-orange-600',
    yellow: 'bg-yellow-100 text-yellow-600',
  };

  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-red-600" />;
    if (trend === 'neutral') return <Minus className="w-4 h-4 text-neutral-400" />;
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      <Card variant="elevated" hoverable>
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
            {icon}
          </div>
          {badge && (
            <span className="text-2xl">{badge}</span>
          )}
          {trend && !badge && (
            <div className="flex items-center gap-1">
              {getTrendIcon()}
            </div>
          )}
        </div>
        <div className="text-sm text-neutral-500 font-medium mb-1">{title || label}</div>
        <div className="text-3xl font-bold text-neutral-900">
          {value}{unit}
        </div>
      </Card>
    </motion.div>
  );
}
