import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';

const ProfileSettings = ({ onClose }) => {
  const { user, profile, updateProfile, updatePassword, signOut } = useAuth();
  
  // Form states
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Personal info form
  const [personalInfo, setPersonalInfo] = useState({
    firstName: '',
    lastName: '',
    displayName: '',
    favoritePlayer: '',
    favoritePosition: '',
    bio: ''
  });

  // Password form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Preferences form
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    quizReminders: false,
    leaderboardNotifications: true,
    theme: 'light',
    difficulty: 'medium'
  });

  // Account stats (read-only)
  const [accountStats, setAccountStats] = useState({
    memberSince: '',
    totalQuizzes: 0,
    averageScore: 0,
    bestScore: 0,
    currentStreak: 0,
    totalPoints: 0
  });

  // Initialize form data
  useEffect(() => {
    if (profile) {
      setPersonalInfo({
        firstName: profile.first_name || '',
        lastName: profile.last_name || '',
        displayName: profile.display_name || '',
        favoritePlayer: profile.favorite_player || '',
        favoritePosition: profile.favorite_position || 'Spurs Fan',
        bio: profile.bio || ''
      });

      setPreferences({
        emailNotifications: profile.preferences?.email_notifications ?? true,
        quizReminders: profile.preferences?.quiz_reminders ?? false,
        leaderboardNotifications: profile.preferences?.leaderboard_notifications ?? true,
        theme: profile.preferences?.theme || 'light',
        difficulty: profile.preferences?.default_difficulty || 'medium'
      });
    }

    if (user) {
      setAccountStats({
        memberSince: new Date(user.created_at).toLocaleDateString(),
        // These would come from the database in a real app
        totalQuizzes: profile?.quiz_stats?.total_quizzes || 0,
        averageScore: profile?.quiz_stats?.average_score || 0,
        bestScore: profile?.quiz_stats?.best_score || 0,
        currentStreak: profile?.quiz_stats?.current_streak || 0,
        totalPoints: profile?.quiz_stats?.total_points || 0
      });
    }
  }, [user, profile]);

  // Handle personal info update
  const handlePersonalInfoSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const { error } = await updateProfile({
        first_name: personalInfo.firstName,
        last_name: personalInfo.lastName,
        display_name: personalInfo.displayName || `${personalInfo.firstName} ${personalInfo.lastName}`.trim(),
        favorite_player: personalInfo.favoritePlayer,
        favorite_position: personalInfo.favoritePosition,
        bio: personalInfo.bio
      });

      if (error) {
        setError(error.message);
      } else {
        setMessage('Profile updated successfully!');
      }
    } catch (err) {
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle password change
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    // Validate passwords
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('New passwords do not match');
      setLoading(false);
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const { error } = await updatePassword(passwordForm.newPassword);

      if (error) {
        setError(error.message);
      } else {
        setMessage('Password updated successfully!');
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (err) {
      setError('Failed to update password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle preferences update
  const handlePreferencesSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const { error } = await updateProfile({
        preferences: {
          email_notifications: preferences.emailNotifications,
          quiz_reminders: preferences.quizReminders,
          leaderboard_notifications: preferences.leaderboardNotifications,
          theme: preferences.theme,
          default_difficulty: preferences.difficulty
        }
      });

      if (error) {
        setError(error.message);
      } else {
        setMessage('Preferences updated successfully!');
      }
    } catch (err) {
      setError('Failed to update preferences. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone and all your quiz data will be lost.'
    );

    if (!confirmed) return;

    const doubleConfirm = window.confirm(
      'This is your final warning. Deleting your account will permanently remove all your data. Type "DELETE" in the prompt that follows to confirm.'
    );

    if (!doubleConfirm) return;

    const confirmText = window.prompt('Type "DELETE" to confirm account deletion:');
    
    if (confirmText !== 'DELETE') {
      alert('Account deletion cancelled.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // In a real app, you'd call a server function to delete the account
      // For now, we'll just sign out and show a message
      await signOut();
      alert('Account deletion requested. Please contact support to complete the process.');
      onClose();
    } catch (err) {
      setError('Failed to delete account. Please contact support.');
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'personal', name: 'Personal Info', icon: '👤' },
    { id: 'security', name: 'Password', icon: '🔒' },
    { id: 'preferences', name: 'Preferences', icon: '⚙️' },
    { id: 'stats', name: 'Statistics', icon: '📊' },
    { id: 'account', name: 'Account', icon: '🗂️' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-spurs-navy text-white p-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-spurs-gold rounded-full p-2">
              <img 
                src="/spurs-logo.png" 
                alt="Tottenham Hotspur Logo" 
                className="w-8 h-8 object-contain filter brightness-0"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Profile Settings</h1>
              <p className="text-spurs-gold">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-spurs-gold transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col md:flex-row h-[600px]">
          {/* Sidebar */}
          <div className="md:w-64 bg-gray-50 border-r border-gray-200">
            <div className="p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setError('');
                      setMessage('');
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-spurs-navy text-white'
                        : 'text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span className="text-lg">{tab.icon}</span>
                    <span className="font-medium">{tab.name}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              {/* Messages */}
              {message && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-600 font-medium">{message}</p>
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 font-medium">{error}</p>
                </div>
              )}

              {/* Personal Info Tab */}
              {activeTab === 'personal' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h2>
                  <form onSubmit={handlePersonalInfoSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          value={personalInfo.firstName}
                          onChange={(e) => setPersonalInfo(prev => ({ ...prev, firstName: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-spurs-navy focus:border-spurs-navy"
                          placeholder="Harry"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          value={personalInfo.lastName}
                          onChange={(e) => setPersonalInfo(prev => ({ ...prev, lastName: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-spurs-navy focus:border-spurs-navy"
                          placeholder="Kane"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Display Name
                      </label>
                      <input
                        type="text"
                        value={personalInfo.displayName}
                        onChange={(e) => setPersonalInfo(prev => ({ ...prev, displayName: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-spurs-navy focus:border-spurs-navy"
                        placeholder="How you'd like to be known"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Favorite Spurs Player
                        </label>
                        <input
                          type="text"
                          value={personalInfo.favoritePlayer}
                          onChange={(e) => setPersonalInfo(prev => ({ ...prev, favoritePlayer: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-spurs-navy focus:border-spurs-navy"
                          placeholder="e.g., Son Heung-min"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Fan Status
                        </label>
                        <select
                          value={personalInfo.favoritePosition}
                          onChange={(e) => setPersonalInfo(prev => ({ ...prev, favoritePosition: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-spurs-navy focus:border-spurs-navy"
                        >
                          <option value="Spurs Fan">Spurs Fan</option>
                          <option value="Die-hard Supporter">Die-hard Supporter</option>
                          <option value="Season Ticket Holder">Season Ticket Holder</option>
                          <option value="Casual Supporter">Casual Supporter</option>
                          <option value="New to Spurs">New to Spurs</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bio
                      </label>
                      <textarea
                        value={personalInfo.bio}
                        onChange={(e) => setPersonalInfo(prev => ({ ...prev, bio: e.target.value }))}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-spurs-navy focus:border-spurs-navy"
                        placeholder="Tell us about your love for Spurs..."
                        maxLength={500}
                      />
                      <p className="text-sm text-gray-500 mt-1">{personalInfo.bio.length}/500 characters</p>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-spurs-navy hover:bg-spurs-blue disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                      {loading ? 'Updating...' : 'Update Profile'}
                    </button>
                  </form>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Password & Security</h2>
                  <form onSubmit={handlePasswordSubmit} className="space-y-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                      <div className="flex items-start">
                        <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <div>
                          <h3 className="text-sm font-medium text-blue-900">Security Tips</h3>
                          <ul className="text-sm text-blue-800 mt-1 list-disc list-inside space-y-1">
                            <li>Use a strong password with at least 8 characters</li>
                            <li>Include uppercase, lowercase, numbers, and symbols</li>
                            <li>Don't reuse passwords from other accounts</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-spurs-navy focus:border-spurs-navy"
                        placeholder="Enter your current password"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-spurs-navy focus:border-spurs-navy"
                        placeholder="Enter your new password"
                        minLength={6}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-spurs-navy focus:border-spurs-navy"
                        placeholder="Confirm your new password"
                        minLength={6}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading || !passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
                      className="bg-spurs-navy hover:bg-spurs-blue disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                      {loading ? 'Updating...' : 'Update Password'}
                    </button>
                  </form>
                </div>
              )}

              {/* Preferences Tab */}
              {activeTab === 'preferences' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Preferences</h2>
                  <form onSubmit={handlePreferencesSubmit} className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
                      
                      <div className="space-y-4">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={preferences.emailNotifications}
                            onChange={(e) => setPreferences(prev => ({ ...prev, emailNotifications: e.target.checked }))}
                            className="h-4 w-4 text-spurs-navy focus:ring-spurs-navy border-gray-300 rounded"
                          />
                          <span className="ml-3 text-sm text-gray-700">Email notifications for quiz results</span>
                        </label>

                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={preferences.quizReminders}
                            onChange={(e) => setPreferences(prev => ({ ...prev, quizReminders: e.target.checked }))}
                            className="h-4 w-4 text-spurs-navy focus:ring-spurs-navy border-gray-300 rounded"
                          />
                          <span className="ml-3 text-sm text-gray-700">Daily quiz reminders</span>
                        </label>

                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={preferences.leaderboardNotifications}
                            onChange={(e) => setPreferences(prev => ({ ...prev, leaderboardNotifications: e.target.checked }))}
                            className="h-4 w-4 text-spurs-navy focus:ring-spurs-navy border-gray-300 rounded"
                          />
                          <span className="ml-3 text-sm text-gray-700">Leaderboard position updates</span>
                        </label>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900">Quiz Settings</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Default Difficulty
                          </label>
                          <select
                            value={preferences.difficulty}
                            onChange={(e) => setPreferences(prev => ({ ...prev, difficulty: e.target.value }))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-spurs-navy focus:border-spurs-navy"
                          >
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Theme
                          </label>
                          <select
                            value={preferences.theme}
                            onChange={(e) => setPreferences(prev => ({ ...prev, theme: e.target.value }))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-spurs-navy focus:border-spurs-navy"
                          >
                            <option value="light">Light</option>
                            <option value="dark">Dark</option>
                            <option value="auto">Auto</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-spurs-navy hover:bg-spurs-blue disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                      {loading ? 'Updating...' : 'Save Preferences'}
                    </button>
                  </form>
                </div>
              )}

              {/* Statistics Tab */}
              {activeTab === 'stats' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Statistics</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg p-6">
                      <div className="flex items-center">
                        <div className="text-3xl text-green-600 mr-4">🏆</div>
                        <div>
                          <p className="text-2xl font-bold text-green-900">{accountStats.bestScore}%</p>
                          <p className="text-sm text-green-700">Best Score</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6">
                      <div className="flex items-center">
                        <div className="text-3xl text-blue-600 mr-4">📊</div>
                        <div>
                          <p className="text-2xl font-bold text-blue-900">{accountStats.averageScore}%</p>
                          <p className="text-sm text-blue-700">Average Score</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-6">
                      <div className="flex items-center">
                        <div className="text-3xl text-purple-600 mr-4">🎯</div>
                        <div>
                          <p className="text-2xl font-bold text-purple-900">{accountStats.totalQuizzes}</p>
                          <p className="text-sm text-purple-700">Quizzes Completed</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-6">
                      <div className="flex items-center">
                        <div className="text-3xl text-orange-600 mr-4">🔥</div>
                        <div>
                          <p className="text-2xl font-bold text-orange-900">{accountStats.currentStreak}</p>
                          <p className="text-sm text-orange-700">Current Streak</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 rounded-lg p-6">
                      <div className="flex items-center">
                        <div className="text-3xl text-yellow-600 mr-4">⭐</div>
                        <div>
                          <p className="text-2xl font-bold text-yellow-900">{accountStats.totalPoints}</p>
                          <p className="text-sm text-yellow-700">Total Points</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center">
                        <div className="text-3xl text-gray-600 mr-4">📅</div>
                        <div>
                          <p className="text-2xl font-bold text-gray-900">{accountStats.memberSince}</p>
                          <p className="text-sm text-gray-700">Member Since</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-blue-900 mb-2">🎉 Your Spurs Knowledge Journey</h3>
                    <p className="text-blue-800">
                      You've been testing your Spurs knowledge since {accountStats.memberSince}! 
                      {accountStats.totalQuizzes > 0 ? (
                        ` With ${accountStats.totalQuizzes} quiz${accountStats.totalQuizzes === 1 ? '' : 's'} completed and an average score of ${accountStats.averageScore}%, you're proving to be a true Spurs fan. Come On You Spurs! 🐓⚽`
                      ) : (
                        ' Ready to start your trivia journey? Take your first quiz and show your Spurs knowledge!'
                      )}
                    </p>
                  </div>
                </div>
              )}

              {/* Account Tab */}
              {activeTab === 'account' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Management</h2>
                  
                  <div className="space-y-8">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Account Information</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Email:</span>
                          <span className="font-medium">{user?.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Account Created:</span>
                          <span className="font-medium">{accountStats.memberSince}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Account Status:</span>
                          <span className="font-medium text-green-600">Active</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                      <h3 className="text-lg font-medium text-red-900 mb-4">Danger Zone</h3>
                      <p className="text-red-700 mb-4">
                        Deleting your account will permanently remove all your quiz data, statistics, and progress. This action cannot be undone.
                      </p>
                      <button
                        onClick={handleDeleteAccount}
                        disabled={loading}
                        className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                      >
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
