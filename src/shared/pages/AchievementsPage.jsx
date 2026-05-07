import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Lock, Award, TrendingUp } from 'lucide-react';
import Card from '../components/Card.jsx';
import achievementService from '../../services/gamification/AchievementService.js';
import { useProfile } from '../../contexts/ProfileContext.jsx';

export default function AchievementsPage() {
  const { profile } = useProfile();
  const [achievements, setAchievements] = useState([]);
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const [progress, setProgress] = useState({ unlocked: 0, total: 0, percentage: 0 });
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    loadAchievements();
  }, [profile]);

  const loadAchievements = () => {
    const all = achievementService.getAllAchievements();
    const unlocked = achievementService.getUnlockedAchievements();
    const prog = achievementService.getProgress(profile.stats);

    setAchievements(all);
    setUnlockedAchievements(unlocked);
    setProgress(prog);
  };

  const isUnlocked = (achievementId) => {
    return unlockedAchievements.some((a) => a.id === achievementId);
  };

  const getUnlockedDate = (achievementId) => {
    const achievement = unlockedAchievements.find((a) => a.id === achievementId);
    return achievement ? new Date(achievement.unlockedAt).toLocaleDateString() : null;
  };

  const filteredAchievements = filterCategory === 'all'
    ? achievements
    : achievements.filter((a) => a.category === filterCategory);

  const categories = [
    { value: 'all', label: 'All', icon: '🏆' },
    { value: 'milestone', label: 'Milestones', icon: '🌟' },
    { value: 'streak', label: 'Streaks', icon: '🔥' },
    { value: 'journal', label: 'Journal', icon: '📔' },
    { value: 'wellness', label: 'Wellness', icon: '💚' },
    { value: 'special', label: 'Special', icon: '✨' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-4">
          <Trophy className="w-8 h-8 text-yellow-600" />
          <h1 className="text-4xl font-bold text-neutral-900">
            Achievements
          </h1>
        </div>
        <p className="text-neutral-600">
          Track your progress and unlock badges as you continue your wellness journey
        </p>
      </motion.div>

      {/* Progress Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <Card variant="elevated" className="bg-gradient-to-br from-lavender-50 to-white border-lavender-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-2">
                {progress.unlocked} / {progress.total} Unlocked
              </h3>
              <p className="text-neutral-600">
                You've unlocked {progress.percentage}% of all achievements!
              </p>
            </div>
            <div className="text-6xl">
              {progress.percentage === 100 ? '👑' : progress.percentage >= 75 ? '🏆' : progress.percentage >= 50 ? '🥇' : progress.percentage >= 25 ? '🥈' : '🥉'}
            </div>
          </div>
          <div className="mt-4 w-full bg-neutral-200 rounded-full h-4 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress.percentage}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-full bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400"
            />
          </div>
        </Card>
      </motion.div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((category) => (
          <button
            key={category.value}
            onClick={() => setFilterCategory(category.value)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filterCategory === category.value
                ? 'bg-lavender-600 text-white shadow-md'
                : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200'
            }`}
          >
            <span className="mr-2">{category.icon}</span>
            {category.label}
          </button>
        ))}
      </div>

      {/* Achievements Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAchievements.map((achievement, index) => {
          const unlocked = isUnlocked(achievement.id);
          const unlockedDate = getUnlockedDate(achievement.id);

          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                variant="elevated"
                className={`relative overflow-hidden ${
                  unlocked ? 'border-yellow-400' : 'opacity-60'
                }`}
              >
                {/* Locked Overlay */}
                {!unlocked && (
                  <div className="absolute top-4 right-4">
                    <Lock className="w-6 h-6 text-neutral-400" />
                  </div>
                )}

                {/* Achievement Content */}
                <div className="text-center">
                  <motion.div
                    animate={unlocked ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.5 }}
                    className="text-6xl mb-4"
                  >
                    {achievement.icon}
                  </motion.div>

                  <h3 className={`text-xl font-bold mb-2 ${
                    unlocked ? 'text-yellow-600' : 'text-neutral-400'
                  }`}>
                    {achievement.title}
                  </h3>

                  <p className="text-sm text-neutral-600 mb-4">
                    {achievement.description}
                  </p>

                  {unlocked && unlockedDate && (
                    <div className="flex items-center justify-center gap-2 text-xs text-green-600">
                      <Award className="w-4 h-4" />
                      <span>Unlocked on {unlockedDate}</span>
                    </div>
                  )}

                  {!unlocked && (
                    <div className="text-xs text-neutral-500">
                      🔒 Locked
                    </div>
                  )}
                </div>

                {/* Shine Effect for Unlocked */}
                {unlocked && (
                  <motion.div
                    initial={{ x: '-100%' }}
                    animate={{ x: '200%' }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                    style={{ transform: 'skewX(-20deg)' }}
                  />
                )}
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredAchievements.length === 0 && (
        <Card variant="elevated" className="text-center py-12">
          <div className="text-6xl mb-4">🏆</div>
          <h3 className="text-2xl font-bold text-neutral-900 mb-2">No Achievements in This Category</h3>
          <p className="text-neutral-600">
            Try selecting a different category to see more achievements!
          </p>
        </Card>
      )}

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8"
      >
        <Card variant="elevated" className="bg-lavender-50 border-lavender-200">
          <div className="flex items-start gap-4">
            <TrendingUp className="w-6 h-6 text-lavender-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-neutral-900 mb-2">Tips for Unlocking Achievements</h3>
              <ul className="space-y-2 text-sm text-neutral-600">
                <li>• Check in daily to build your streak and unlock streak achievements</li>
                <li>• Write journal entries regularly to earn journal badges</li>
                <li>• Maintain consistent wellness metrics for wellness achievements</li>
                <li>• Try checking in at different times to unlock special time-based badges</li>
                <li>• Experience different moods to unlock the Emotional Explorer badge</li>
              </ul>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
