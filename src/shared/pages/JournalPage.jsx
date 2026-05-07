import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Calendar as CalendarIcon, 
  BookOpen, 
  Edit2, 
  Trash2,
  X,
  Save,
  Tag
} from 'lucide-react';
import Card from '../components/Card.jsx';
import Button from '../components/Button.jsx';
import enhancedStorage from '../../services/storage/EnhancedStorageService.js';
import toast from 'react-hot-toast';

const MOOD_OPTIONS = [
  { value: 'happy', label: 'Happy', emoji: '😊', color: 'text-green-600' },
  { value: 'sad', label: 'Sad', emoji: '😢', color: 'text-blue-600' },
  { value: 'stressed', label: 'Stressed', emoji: '😫', color: 'text-red-600' },
  { value: 'anxious', label: 'Anxious', emoji: '😰', color: 'text-orange-600' },
  { value: 'calm', label: 'Calm', emoji: '😌', color: 'text-cyan-600' },
  { value: 'excited', label: 'Excited', emoji: '🤩', color: 'text-yellow-600' },
  { value: 'tired', label: 'Tired', emoji: '😴', color: 'text-purple-600' },
  { value: 'confident', label: 'Confident', emoji: '😎', color: 'text-blue-700' },
  { value: 'neutral', label: 'Neutral', emoji: '😐', color: 'text-neutral-600' },
];

export default function JournalPage() {
  const [entries, setEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [showEditor, setShowEditor] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMood, setFilterMood] = useState('all');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'
  
  // Editor state
  const [editingEntry, setEditingEntry] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedMood, setSelectedMood] = useState('neutral');
  const [tags, setTags] = useState('');

  useEffect(() => {
    loadEntries();
  }, []);

  useEffect(() => {
    filterEntries();
  }, [entries, searchQuery, filterMood]);

  const loadEntries = () => {
    const journalEntries = enhancedStorage.getJournalEntries();
    setEntries(journalEntries.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
  };

  const filterEntries = () => {
    let filtered = [...entries];

    // Filter by search query
    if (searchQuery) {
      filtered = enhancedStorage.searchJournalEntries(searchQuery);
    }

    // Filter by mood
    if (filterMood !== 'all') {
      filtered = filtered.filter(entry => entry.mood === filterMood);
    }

    setFilteredEntries(filtered);
  };

  const openEditor = (entry = null) => {
    if (entry) {
      setEditingEntry(entry);
      setTitle(entry.title);
      setContent(entry.content);
      setSelectedMood(entry.mood);
      setTags(entry.tags.join(', '));
    } else {
      setEditingEntry(null);
      setTitle('');
      setContent('');
      setSelectedMood('neutral');
      setTags('');
    }
    setShowEditor(true);
  };

  const closeEditor = () => {
    setShowEditor(false);
    setEditingEntry(null);
    setTitle('');
    setContent('');
    setSelectedMood('neutral');
    setTags('');
  };

  const saveEntry = () => {
    if (!title.trim() || !content.trim()) {
      toast.error('Please fill in title and content');
      return;
    }

    const tagArray = tags.split(',').map(t => t.trim()).filter(Boolean);

    if (editingEntry) {
      // Update existing entry
      enhancedStorage.updateJournalEntry(editingEntry.id, {
        title: title.trim(),
        content: content.trim(),
        mood: selectedMood,
        tags: tagArray,
      });
      toast.success('Journal entry updated!');
    } else {
      // Create new entry
      enhancedStorage.saveJournalEntry(
        title.trim(),
        content.trim(),
        selectedMood,
        tagArray
      );
      toast.success('Journal entry saved!');
    }

    loadEntries();
    closeEditor();
  };

  const deleteEntry = (id) => {
    if (confirm('Are you sure you want to delete this journal entry?')) {
      enhancedStorage.deleteJournalEntry(id);
      toast.success('Journal entry deleted');
      loadEntries();
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMoodEmoji = (mood) => {
    const moodOption = MOOD_OPTIONS.find(m => m.value === mood);
    return moodOption ? moodOption.emoji : '😐';
  };

  const getMoodColor = (mood) => {
    const moodOption = MOOD_OPTIONS.find(m => m.value === mood);
    return moodOption ? moodOption.color : 'text-gray-400';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-lavender-600" />
            <h1 className="text-4xl font-bold text-neutral-900">
              My Journal
            </h1>
          </div>
          <Button
            variant="primary"
            onClick={() => openEditor()}
          >
            <Plus className="w-5 h-5 mr-2" />
            New Entry
          </Button>
        </div>
        <p className="text-neutral-600">
          Document your thoughts, feelings, and daily reflections
        </p>
      </motion.div>

      {/* Filters & Search */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        {/* Search */}
        <div className="md:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              placeholder="Search journal entries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender-400 focus:border-transparent transition text-neutral-900 placeholder-neutral-400"
            />
          </div>
        </div>

        {/* Mood Filter */}
        <div>
          <select
            value={filterMood}
            onChange={(e) => setFilterMood(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender-400 focus:border-transparent transition text-neutral-900"
          >
            <option value="all">All Moods</option>
            {MOOD_OPTIONS.map(mood => (
              <option key={mood.value} value={mood.value}>
                {mood.emoji} {mood.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setViewMode('list')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            viewMode === 'list'
              ? 'bg-lavender-600 text-white shadow-md'
              : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200'
          }`}
        >
          <BookOpen className="w-4 h-4 inline mr-2" />
          List View
        </button>
        <button
          onClick={() => setViewMode('calendar')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            viewMode === 'calendar'
              ? 'bg-lavender-600 text-white shadow-md'
              : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200'
          }`}
        >
          <CalendarIcon className="w-4 h-4 inline mr-2" />
          Calendar View
        </button>
      </div>

      {/* Entries List */}
      {viewMode === 'list' && (
        <div className="space-y-4">
          {filteredEntries.length === 0 ? (
            <Card variant="elevated" className="text-center py-12">
              <div className="text-6xl mb-4">📔</div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-2">No Journal Entries Yet</h3>
              <p className="text-neutral-600 mb-6">
                {searchQuery || filterMood !== 'all'
                  ? 'No entries match your filters. Try adjusting your search.'
                  : 'Start documenting your journey by creating your first entry!'}
              </p>
              {!searchQuery && filterMood === 'all' && (
                <Button variant="primary" onClick={() => openEditor()}>
                  <Plus className="w-5 h-5 mr-2" />
                  Create First Entry
                </Button>
              )}
            </Card>
          ) : (
            filteredEntries.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card variant="elevated" className="hover:border-lavender-300 transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-3xl">{getMoodEmoji(entry.mood)}</span>
                        <div>
                          <h3 className="text-xl font-bold text-neutral-900">{entry.title}</h3>
                          <p className="text-sm text-neutral-500">{formatDate(entry.timestamp)}</p>
                        </div>
                      </div>
                      <p className="text-neutral-700 mb-3 line-clamp-3">{entry.content}</p>
                      {entry.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {entry.tags.map((tag, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 bg-lavender-100 text-lavender-700 text-xs rounded-full font-medium"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => openEditor(entry)}
                        className="p-2 hover:bg-neutral-100 rounded-lg transition"
                      >
                        <Edit2 className="w-4 h-4 text-neutral-500 hover:text-lavender-600" />
                      </button>
                      <button
                        onClick={() => deleteEntry(entry.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4 text-neutral-500 hover:text-red-600" />
                      </button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      )}

      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <Card variant="elevated" className="text-center py-12">
          <CalendarIcon className="w-16 h-16 mx-auto mb-4 text-neutral-400" />
          <h3 className="text-xl font-bold text-neutral-900 mb-2">Calendar View Coming Soon</h3>
          <p className="text-neutral-600">
            We're working on a beautiful calendar view for your journal entries!
          </p>
        </Card>
      )}

      {/* Editor Modal */}
      <AnimatePresence>
        {showEditor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeEditor}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-3xl max-h-[90vh] overflow-y-auto"
            >
              <Card variant="elevated" className="bg-white">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-neutral-900">
                    {editingEntry ? 'Edit Entry' : 'New Journal Entry'}
                  </h2>
                  <button
                    onClick={closeEditor}
                    className="p-2 hover:bg-neutral-100 rounded-lg transition"
                  >
                    <X className="w-6 h-6 text-neutral-600" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Title</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Give your entry a title..."
                      className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender-400 focus:border-transparent transition text-neutral-900 placeholder-neutral-400"
                    />
                  </div>

                  {/* Mood Selector */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">How are you feeling?</label>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                      {MOOD_OPTIONS.map((mood) => (
                        <button
                          key={mood.value}
                          onClick={() => setSelectedMood(mood.value)}
                          className={`p-3 rounded-lg border-2 transition ${
                            selectedMood === mood.value
                              ? 'border-lavender-600 bg-lavender-50'
                              : 'border-neutral-200 hover:border-neutral-300'
                          }`}
                        >
                          <div className="text-2xl mb-1">{mood.emoji}</div>
                          <div className={`text-xs ${mood.color}`}>{mood.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Content */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Your Thoughts</label>
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Write about your day, your feelings, your thoughts..."
                      rows={10}
                      className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender-400 focus:border-transparent transition resize-none text-neutral-900 placeholder-neutral-400"
                    />
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      <Tag className="w-4 h-4 inline mr-1" />
                      Tags (comma separated)
                    </label>
                    <input
                      type="text"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      placeholder="work, family, health, goals..."
                      className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender-400 focus:border-transparent transition text-neutral-900 placeholder-neutral-400"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4">
                    <Button variant="primary" onClick={saveEntry} className="flex-1">
                      <Save className="w-5 h-5 mr-2" />
                      {editingEntry ? 'Update Entry' : 'Save Entry'}
                    </Button>
                    <Button variant="secondary" onClick={closeEditor}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
