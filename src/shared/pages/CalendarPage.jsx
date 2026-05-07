import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, TrendingUp, Smile } from 'lucide-react';
import MoodCalendar from '../../features/calendar/MoodCalendar.jsx';
import Card from '../components/Card.jsx';

const STORAGE_KEY = 'mindmirror_journal';

export default function CalendarPage() {
  const [journalEntries, setJournalEntries] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEntry, setSelectedEntry] = useState(null);

  useEffect(() => {
    loadJournalEntries();
  }, []);

  const loadJournalEntries = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const entries = JSON.parse(stored);
        setJournalEntries(entries);
      }
    } catch (error) {
      console.error('Error loading journal entries:', error);
    }
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    
    // Find entry for this date
    const entry = journalEntries.find(e => {
      const entryDate = new Date(e.timestamp);
      return (
        entryDate.getDate() === date.getDate() &&
        entryDate.getMonth() === date.getMonth() &&
        entryDate.getFullYear() === date.getFullYear()
      );
    });
    
    setSelectedEntry(entry || null);
  };

  // Calculate mood statistics
  const moodStats = journalEntries.reduce((acc, entry) => {
    if (entry.mood) {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
    }
    return acc;
  }, {});

  const totalEntries = journalEntries.length;
  const mostCommonMood = Object.entries(moodStats).sort((a, b) => b[1] - a[1])[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Mood Calendar</h1>
          <p className="text-neutral-600">Track your emotional journey over time</p>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-lavender-100 rounded-lg">
              <CalendarIcon className="w-6 h-6 text-lavender-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-600">Total Entries</p>
              <p className="text-2xl font-bold text-neutral-900">{totalEntries}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <Smile className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-600">Most Common Mood</p>
              <p className="text-2xl font-bold text-neutral-900">
                {mostCommonMood ? mostCommonMood[0] : 'N/A'}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-600">This Month</p>
              <p className="text-2xl font-bold text-neutral-900">
                {journalEntries.filter(e => {
                  const date = new Date(e.timestamp);
                  const now = new Date();
                  return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
                }).length}
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Calendar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <MoodCalendar journalEntries={journalEntries} onDateClick={handleDateClick} />
      </motion.div>

      {/* Selected Entry Details */}
      {selectedDate && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">
              {selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h3>

            {selectedEntry ? (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-neutral-600 mb-1">Mood</p>
                  <p className="text-lg font-medium text-neutral-900">{selectedEntry.mood}</p>
                </div>

                {selectedEntry.title && (
                  <div>
                    <p className="text-sm text-neutral-600 mb-1">Title</p>
                    <p className="text-lg font-medium text-neutral-900">{selectedEntry.title}</p>
                  </div>
                )}

                {selectedEntry.content && (
                  <div>
                    <p className="text-sm text-neutral-600 mb-1">Entry</p>
                    <p className="text-neutral-700 whitespace-pre-wrap">{selectedEntry.content}</p>
                  </div>
                )}

                {selectedEntry.tags && selectedEntry.tags.length > 0 && (
                  <div>
                    <p className="text-sm text-neutral-600 mb-2">Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedEntry.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-lavender-100 text-lavender-700 rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-neutral-500">No journal entry for this date</p>
                <p className="text-sm text-neutral-400 mt-2">
                  Visit the Journal page to create an entry
                </p>
              </div>
            )}
          </Card>
        </motion.div>
      )}
    </div>
  );
}
