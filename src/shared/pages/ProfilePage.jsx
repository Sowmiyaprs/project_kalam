import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Bell, Shield, Trash2, Save, Camera, Upload } from 'lucide-react';
import Card from '../components/Card.jsx';
import Button from '../components/Button.jsx';
import { useProfile } from '../../contexts/ProfileContext.jsx';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { profile, updateProfile, updatePreferences, updateProfileImage, resetProfile } = useProfile();
  const [activeTab, setActiveTab] = useState('profile');
  const [localProfile, setLocalProfile] = useState({
    username: profile.username,
    email: profile.email,
    bio: profile.bio,
  });
  const fileInputRef = useRef(null);

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User className="w-5 h-5" /> },
    { id: 'security', label: 'Security', icon: <Shield className="w-5 h-5" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-5 h-5" /> },
  ];

  const handleSaveProfile = () => {
    const success = updateProfile(localProfile);
    if (success) {
      toast.success('Profile updated successfully!');
    } else {
      toast.error('Failed to update profile');
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size must be less than 2MB');
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const success = updateProfileImage(reader.result);
      if (success) {
        toast.success('Profile image updated!');
      } else {
        toast.error('Failed to update image');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    const success = updateProfileImage(null);
    if (success) {
      toast.success('Profile image removed');
    }
  };

  const handleNotificationToggle = (key) => {
    const newValue = !profile.preferences.notifications[key];
    updatePreferences('notifications', { [key]: newValue });
  };

  const handleChangePassword = () => {
    toast.success('Password changed successfully! (Demo mode)');
  };

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      resetProfile();
      toast.success('Account data cleared (Demo mode)');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-neutral-900 mb-2">
          Account Settings
        </h1>
        <p className="text-neutral-600">
          Manage your account preferences and settings
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card variant="elevated">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition font-medium ${
                    activeTab === tab.id
                      ? 'bg-lavender-100 text-lavender-700'
                      : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </Card>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card variant="elevated">
                <h2 className="text-2xl font-bold text-neutral-900 mb-6">Profile Information</h2>
                
                {/* Avatar */}
                <div className="flex items-center gap-6 mb-8">
                  <div className="relative">
                    {profile.profileImage ? (
                      <img
                        src={profile.profileImage}
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover border-2 border-lavender-600"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-lavender-600 to-lavender-700 flex items-center justify-center text-4xl font-bold text-white">
                        {localProfile.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 p-2 bg-lavender-600 rounded-full hover:bg-lavender-700 transition text-white"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Change Avatar
                    </Button>
                    {profile.profileImage && (
                      <Button
                        variant="secondary"
                        size="small"
                        onClick={handleRemoveImage}
                        className="ml-2 border-red-300 text-red-600 hover:bg-red-50"
                      >
                        Remove
                      </Button>
                    )}
                    <p className="text-sm text-neutral-500 mt-2">
                      JPG, PNG or GIF. Max size 2MB
                    </p>
                  </div>
                </div>

                {/* Form */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      value={localProfile.username}
                      onChange={(e) => setLocalProfile({ ...localProfile, username: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender-400 focus:border-transparent transition text-neutral-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={localProfile.email}
                      onChange={(e) => setLocalProfile({ ...localProfile, email: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender-400 focus:border-transparent transition text-neutral-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Bio
                    </label>
                    <textarea
                      value={localProfile.bio}
                      onChange={(e) => setLocalProfile({ ...localProfile, bio: e.target.value })}
                      rows={4}
                      placeholder="Tell us about yourself..."
                      className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender-400 focus:border-transparent transition resize-none text-neutral-900 placeholder-neutral-400"
                    />
                  </div>

                  {/* Stats Display */}
                  <div className="grid grid-cols-3 gap-4 pt-6 border-t border-neutral-200">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-lavender-600">{profile.stats.totalEntries}</div>
                      <div className="text-sm text-neutral-500">Total Entries</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{profile.stats.currentStreak}</div>
                      <div className="text-sm text-neutral-500">Current Streak</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{profile.stats.longestStreak}</div>
                      <div className="text-sm text-neutral-500">Longest Streak</div>
                    </div>
                  </div>

                  <Button variant="primary" onClick={handleSaveProfile}>
                    <Save className="w-5 h-5 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card variant="elevated">
                <h2 className="text-2xl font-bold text-neutral-900 mb-6">Security Settings</h2>
                
                {/* Change Password */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">Change Password</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Current Password
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender-400 focus:border-transparent transition text-neutral-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender-400 focus:border-transparent transition text-neutral-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender-400 focus:border-transparent transition text-neutral-900"
                      />
                    </div>
                    <Button variant="primary" onClick={handleChangePassword}>
                      <Lock className="w-5 h-5 mr-2" />
                      Update Password
                    </Button>
                  </div>
                </div>

                {/* Two-Factor Authentication */}
                <div className="mb-8 pb-8 border-b border-neutral-200">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">Two-Factor Authentication</h3>
                  <p className="text-neutral-600 mb-4">
                    Add an extra layer of security to your account
                  </p>
                  <Button variant="secondary">
                    Enable 2FA (Coming Soon)
                  </Button>
                </div>

                {/* Delete Account */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-red-600">Danger Zone</h3>
                  <p className="text-neutral-600 mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <Button variant="secondary" onClick={handleDeleteAccount} className="border-red-300 text-red-600 hover:bg-red-50">
                    <Trash2 className="w-5 h-5 mr-2" />
                    Delete Account Data
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card variant="elevated">
                <h2 className="text-2xl font-bold text-neutral-900 mb-6">Notification Preferences</h2>
                
                <div className="space-y-6">
                  {[
                    { 
                      key: 'emailNotifications',
                      label: 'Email Notifications', 
                      description: 'Receive email updates about your mood analysis' 
                    },
                    { 
                      key: 'dailyReminders',
                      label: 'Daily Reminders', 
                      description: 'Get reminded to check in with your emotions' 
                    },
                    { 
                      key: 'weeklyReports',
                      label: 'Weekly Reports', 
                      description: 'Receive weekly summaries of your emotional patterns' 
                    },
                    { 
                      key: 'wellnessTips',
                      label: 'Wellness Tips', 
                      description: 'Get personalized wellness recommendations' 
                    },
                    { 
                      key: 'productUpdates',
                      label: 'Product Updates', 
                      description: 'Stay informed about new features and improvements' 
                    }
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between py-4 border-b border-neutral-200 last:border-0">
                      <div>
                        <div className="font-medium text-neutral-900 mb-1">{item.label}</div>
                        <div className="text-sm text-neutral-600">{item.description}</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={profile.preferences.notifications[item.key]}
                          onChange={() => handleNotificationToggle(item.key)}
                        />
                        <div className="w-11 h-6 bg-neutral-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-lavender-400 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-lavender-600"></div>
                      </label>
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <Button variant="primary" onClick={() => toast.success('Preferences saved!')}>
                    <Save className="w-5 h-5 mr-2" />
                    Save Preferences
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
