import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import Card from '../../shared/components/Card.jsx';

const MOOD_COLORS = {
  Happy: { bg: 'bg-green-100', border: 'border-green-400', text: 'text-green-700', emoji: '😊' },
  Sad: { bg: 'bg-blue-100', border: 'border-blue-400', text: 'text-blue-700', emoji: '😢' },
  Stressed: { bg: 'bg-red-100', border: 'border-red-400', text: 'text-red-700', emoji: '😰' },
  Anxious: { bg: 'bg-orange-100', border: 'border-orange-400', text: 'text-orange-700', emoji: '😟' },
  Calm: { bg: 'bg-teal-100', border: 'border-teal-400', text: 'text-teal-700', emoji: '😌' },
  Excited: { bg: 'bg-yellow-100', border: 'border-yellow-400', text: 'text-yellow-700', emoji: '🤩' },
  Tired: { bg: 'bg-gray-100', border: 'border-gray-400', text: 'text-gray-700', emoji: '😴' },
  Confident: { bg: 'bg-purple-100', border: 'border-purple-400', text: 'text-purple-700', emoji: '😎' },
  Neutral: { bg: 'bg-neutral-100', border: 'border-neutral-400', text: 'text-neutral-700', emoji: '😐' },
};

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function MoodCalendar({ journalEntries = [], onDateClick }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const { year, month } = useMemo(() => ({
    year: currentDate.getFullYear(),
    month: currentDate.getMonth(),
  }), [currentDate]);

  // Get calendar days
  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Previous month's days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: prevMonthLastDay - i,
        isCurrentMonth: false,
        fullDate: new Date(year, month - 1, prevMonthLastDay - i),
      });
    }

    // Current month's days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: i,
        isCurrentMonth: true,
        fullDate: new Date(year, month, i),
      });
    }

    // Next month's days
    const remainingDays = 42 - days.length; // 6 rows * 7 days
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: i,
        isCurrentMonth: false,
        fullDate: new Date(year, month + 1, i),
      });
    }

    return days;
  }, [year, month]);

  // Map journal entries to dates
  const moodByDate = useMemo(() => {
    const map = {};
    journalEntries.forEach(entry => {
      const date = new Date(entry.timestamp);
      const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      map[dateKey] = entry.mood;
    });
    return map;
  }, [journalEntries]);

  const getMoodForDay = (day) => {
    const dateKey = `${day.fullDate.getFullYear()}-${day.fullDate.getMonth()}-${day.fullDate.getDate()}`;
    return moodByDate[dateKey];
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const isToday = (day) => {
    const today = new Date();
    return (
      day.fullDate.getDate() === today.getDate() &&
      day.fullDate.getMonth() === today.getMonth() &&
      day.fullDate.getFullYear() === today.getFullYear()
    );
  };

  const handleDayClick = (day) => {
    if (onDateClick) {
      onDateClick(day.fullDate);
    }
  };

  return (
    <Card className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-lavender-100 rounded-lg">
            <CalendarIcon className="w-5 h-5 text-lavender-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-neutral-900">
              {MONTHS[month]} {year}
            </h2>
            <p className="text-sm text-neutral-500">Your mood calendar</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={goToPreviousMonth}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-5 h-5 text-neutral-600" />
          </button>
          <button
            onClick={goToToday}
            className="px-3 py-1.5 text-sm font-medium text-lavender-600 hover:bg-lavender-50 rounded-lg transition-colors"
          >
            Today
          </button>
          <button
            onClick={goToNextMonth}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            aria-label="Next month"
          >
            <ChevronRight className="w-5 h-5 text-neutral-600" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="space-y-2">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {DAYS_OF_WEEK.map(day => (
            <div
              key={day}
              className="text-center text-xs font-medium text-neutral-500 py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-2">
          <AnimatePresence mode="wait">
            {calendarDays.map((day, index) => {
              const mood = getMoodForDay(day);
              const moodStyle = mood ? MOOD_COLORS[mood] : null;
              const today = isToday(day);

              return (
                <motion.button
                  key={`${day.fullDate.toISOString()}-${index}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: index * 0.01 }}
                  onClick={() => handleDayClick(day)}
                  className={`
                    aspect-square rounded-lg flex flex-col items-center justify-center gap-1 transition-all duration-200
                    ${day.isCurrentMonth ? 'text-neutral-900' : 'text-neutral-400'}
                    ${today ? 'ring-2 ring-lavender-500 ring-offset-2' : ''}
                    ${moodStyle ? `${moodStyle.bg} ${moodStyle.border} border-2` : 'bg-white border border-neutral-200 hover:border-neutral-300'}
                    ${day.isCurrentMonth ? 'hover:shadow-md' : ''}
                  `}
                >
                  <span className={`text-sm font-medium ${moodStyle ? moodStyle.text : ''}`}>
                    {day.date}
                  </span>
                  {mood && (
                    <span className="text-lg leading-none">
                      {MOOD_COLORS[mood].emoji}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 pt-6 border-t border-neutral-200">
        <p className="text-sm font-medium text-neutral-700 mb-3">Mood Legend</p>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {Object.entries(MOOD_COLORS).map(([mood, style]) => (
            <div key={mood} className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded ${style.bg} ${style.border} border-2 flex items-center justify-center text-sm`}>
                {style.emoji}
              </div>
              <span className="text-xs text-neutral-600">{mood}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
