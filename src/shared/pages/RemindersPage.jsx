import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Plus, Trash2, Clock, Save, X } from 'lucide-react';
import Card from '../components/Card.jsx';
import Button from '../components/Button.jsx';
import enhancedStorage from '../../services/storage/EnhancedStorageService.js';
import toast from 'react-hot-toast';

export default function RemindersPage() {
  const [reminders, setReminders] = useState([]);
  const [showEditor, setShowEditor] = useState(false);
  const [editingReminder, setEditingReminder] = useState(null);
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('09:00');
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    loadReminders();
    checkNotificationPermission();
  }, []);

  const loadReminders = () => {
    const savedReminders = enhancedStorage.getReminders();
    setReminders(savedReminders);
  };

  const checkNotificationPermission = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      toast('Enable notifications to receive reminders!', {
        icon: '🔔',
        duration: 5000,
      });
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        toast.success('Notifications enabled!');
      } else {
        toast.error('Notifications denied');
      }
    } else {
      toast.error('Notifications not supported in this browser');
    }
  };

  const openEditor = (reminder = null) => {
    if (reminder) {
      setEditingReminder(reminder);
      setTitle(reminder.title);
      setTime(reminder.time);
      setEnabled(reminder.enabled);
    } else {
      setEditingReminder(null);
      setTitle('');
      setTime('09:00');
      setEnabled(true);
    }
    setShowEditor(true);
  };

  const closeEditor = () => {
    setShowEditor(false);
    setEditingReminder(null);
    setTitle('');
    setTime('09:00');
    setEnabled(true);
  };

  const saveReminder = () => {
    if (!title.trim()) {
      toast.error('Please enter a reminder title');
      return;
    }

    if (editingReminder) {
      enhancedStorage.updateReminder(editingReminder.id, {
        title: title.trim(),
        time,
        enabled,
      });
      toast.success('Reminder updated!');
    } else {
      enhancedStorage.saveReminder(title.trim(), time, enabled);
      toast.success('Reminder created!');
    }

    loadReminders();
    closeEditor();
  };

  const deleteReminder = (id) => {
    if (confirm('Delete this reminder?')) {
      enhancedStorage.deleteReminder(id);
      toast.success('Reminder deleted');
      loadReminders();
    }
  };

  const toggleReminder = (reminder) => {
    enhancedStorage.updateReminder(reminder.id, {
      enabled: !reminder.enabled,
    });
    loadReminders();
    toast.success(reminder.enabled ? 'Reminder disabled' : 'Reminder enabled');
  };

  const presetReminders = [
    { title: 'Morning Check-in', time: '09:00', icon: '🌅' },
    { title: 'Midday Reflection', time: '12:00', icon: '☀️' },
    { title: 'Evening Journal', time: '20:00', icon: '🌙' },
    { title: 'Bedtime Gratitude', time: '22:00', icon: '✨' },
  ];

  const addPreset = (preset) => {
    enhancedStorage.saveReminder(preset.title, preset.time, true);
    toast.success(`Added: ${preset.title}`);
    loadReminders();
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
            <Bell className="w-8 h-8 text-lavender-600" />
            <h1 className="text-4xl font-bold text-neutral-900">
              Reminders
            </h1>
          </div>
          <Button variant="primary" onClick={() => openEditor()}>
            <Plus className="w-5 h-5 mr-2" />
            New Reminder
          </Button>
        </div>
        <p className="text-neutral-600">
          Set up reminders to maintain your wellness routine
        </p>
      </motion.div>

      {/* Notification Permission */}
      {('Notification' in window && Notification.permission !== 'granted') && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Card variant="elevated" className="border-yellow-400 bg-yellow-50">
            <div className="flex items-start gap-4">
              <Bell className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="font-bold text-neutral-900 mb-2">Enable Notifications</h3>
                <p className="text-sm text-neutral-600 mb-4">
                  Allow notifications to receive reminders even when you're not using the app.
                </p>
                <Button variant="secondary" size="small" onClick={requestNotificationPermission}>
                  Enable Notifications
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Preset Reminders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <h2 className="text-xl font-bold text-neutral-900 mb-4">Quick Add</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {presetReminders.map((preset, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + index * 0.05 }}
            >
              <Card
                variant="elevated"
                className="cursor-pointer hover:border-lavender-300 transition-all"
                onClick={() => addPreset(preset)}
              >
                <div className="text-center">
                  <div className="text-4xl mb-2">{preset.icon}</div>
                  <h3 className="font-semibold text-neutral-900 mb-1">{preset.title}</h3>
                  <p className="text-sm text-neutral-600 flex items-center justify-center gap-1">
                    <Clock className="w-3 h-3" />
                    {preset.time}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Reminders List */}
      <div>
        <h2 className="text-xl font-bold text-neutral-900 mb-4">Your Reminders</h2>
        {reminders.length === 0 ? (
          <Card variant="elevated" className="text-center py-12">
            <div className="text-6xl mb-4">🔔</div>
            <h3 className="text-2xl font-bold text-neutral-900 mb-2">No Reminders Yet</h3>
            <p className="text-neutral-600 mb-6">
              Create your first reminder to stay on track with your wellness goals!
            </p>
            <Button variant="primary" onClick={() => openEditor()}>
              <Plus className="w-5 h-5 mr-2" />
              Create Reminder
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {reminders.map((reminder, index) => (
              <motion.div
                key={reminder.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card variant="elevated">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="text-3xl">🔔</div>
                      <div className="flex-1">
                        <h3 className="font-bold text-neutral-900">{reminder.title}</h3>
                        <p className="text-sm text-neutral-600 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {reminder.time}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {/* Toggle */}
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={reminder.enabled}
                          onChange={() => toggleReminder(reminder)}
                        />
                        <div className="w-11 h-6 bg-neutral-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-lavender-400 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-lavender-600"></div>
                      </label>

                      {/* Edit */}
                      <button
                        onClick={() => openEditor(reminder)}
                        className="p-2 hover:bg-neutral-100 rounded-lg transition"
                      >
                        <Clock className="w-4 h-4 text-neutral-500 hover:text-lavender-600" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => deleteReminder(reminder.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4 text-neutral-500 hover:text-red-600" />
                      </button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Editor Modal */}
      {showEditor && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closeEditor}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md"
          >
            <Card variant="elevated" className="bg-white">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-neutral-900">
                  {editingReminder ? 'Edit Reminder' : 'New Reminder'}
                </h2>
                <button
                  onClick={closeEditor}
                  className="p-2 hover:bg-neutral-100 rounded-lg transition"
                >
                  <X className="w-6 h-6 text-neutral-600" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Morning Check-in"
                    className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender-400 focus:border-transparent transition text-neutral-900 placeholder-neutral-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Time</label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender-400 focus:border-transparent transition text-neutral-900"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                  <span className="text-sm font-medium text-neutral-700">Enabled</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={enabled}
                      onChange={(e) => setEnabled(e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-neutral-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-lavender-400 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-lavender-600"></div>
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button variant="primary" onClick={saveReminder} className="flex-1">
                    <Save className="w-5 h-5 mr-2" />
                    {editingReminder ? 'Update' : 'Create'}
                  </Button>
                  <Button variant="secondary" onClick={closeEditor}>
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      )}
    </div>
  );
}
