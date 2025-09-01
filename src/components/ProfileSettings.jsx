import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

const ProfileSettings = ({ onClose }) => {
  const { user, profile, updateProfile, updatePassword, updateEmail } = useAuth();
  
  // Profile form state
  const [profileForm, setProfileForm] = useState({
    first_name: '',
    last_name: '',
    display_name: '',
    favorite_player: '',
    favorite_position: 'Spurs Fan'
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Email form state
  const [emailForm, setEmailForm] = useState({
    newEmail: '',
    confirmEmail: ''
  });

  // UI state
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Initialize form with current profile data
  useEffect(() => {
    if (profile) {
      setProfileForm({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        display_name: profile.display_name || '',
        favorite_player: profile.favorite_player || '',
        favorite_position: profile.favorite_position || 'Spurs Fan'
      });
    }
    if (user) {
      setEmailForm(prev => ({
        ...prev,
        newEmail: user.email || ''
      }));
    }
  }, [profile, user]);

  // Show message helper
  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  // Handle profile form changes
  const handleProfileChange = (e) => {
    setProfileForm({
      ...profileForm,
      [e.target.name]: e.target.value
    });
  };

  // Handle password form changes
  const handlePasswordChange = (e) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value
    });
  };

  // Handle email form changes
  const handleEmailChange = (e) => {
    setEmailForm({
      ...emailForm,
      [e.target.name]: e.target.value
    });
  };

  // Update profile
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await updateProfile(profileForm);
      
      if (error) {
        showMessage('error', error.message);
      } else {
        showMessage('success', 'Profile updated successfully!');
      }
    } catch (error) {
      showMessage('error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  // Update password
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validation
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showMessage('error', 'New passwords do not match');
      setLoading(false);
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      showMessage('error', 'Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const { error } = await updatePassword(passwordForm.newPassword);
      
      if (error) {
        showMessage('error', error.message);
      } else {
        showMessage('success', 'Password updated successfully!');
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (error) {
      showMessage('error', 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  // Update email
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validation
    if (emailForm.newEmail !== emailForm.confirmEmail) {
      showMessage('error', 'Email addresses do not match');
      setLoading(false);
      return;
    }

    if (emailForm.newEmail === user?.email) {
      showMessage('error', 'New email must be different from current email');
      setLoading(false);
      return;
    }

    try {
      const { error } = await updateEmail(emailForm.newEmail);
      
      if (error) {
        showMessage('error', error.message);
      } else {
        showMessage('success', 'Email update confirmation sent! Check your inbox.');
      }
    } catch (error) {
      showMessage('error', 'Failed to update email');
    } finally {
      setLoading(false);
    }
  };

  // Delete account (placeholder - would need backend implementation)
  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      // This would require a backend endpoint to properly delete user data
      showMessage('error', 'Account deletion is not yet implemented. Please contact support.');
    } catch (error) {
      showMessage('error', 'Failed to delete account');
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: '👤' },
    { id: 'account', name: 'Account', icon: '⚙️' },
    { id: 'security', name: 'Security', icon: '🔒' },
    { id: 'preferences', name: 'Preferences', icon: '🎯' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="absolute inset-0 bg-gradient-to-br from-spurs-navy/90 via-spurs-blue/90 to-spurs-navy/90" />
      
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-spurs-navy text-white p-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-spurs-gold rounded-full p-3">
              <img
                src="/spurs-logo.png"
                alt="Tottenham Logo"
                className="w-8 h-8 object-contain filter brightness-0"
                loading="lazy"
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Profile Settings</h2>
              <p className="text-spurs-white opacity-80">Manage your account preferences</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-spurs-gold transition-colors p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex">
          {/* Sidebar */}
          <div className="w-1/4 bg-gray-50 p-6">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
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

            {/* User Info */}
            <div className="mt-8 p-4 bg-white rounded-lg border border-gray-200">
              <div className="text-center">
                <div className="bg-spurs-navy text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <span className="font-bold">
                    {profile?.display_name?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
                  </span>
                </div>
                <h3 className="font-medium text-gray-900">
                  {profile?.display_name || 'Spurs Fan'}
                </h3>
                <p className="text-sm text-gray-500">{user?.email}</p>
                <p className="text-xs text-gray-400 mt-1">
                  Member since {new Date(profile?.created_at || user?.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            {/* Message Display */}
            {message.text && (
              <div className={`mb-6 p-4 rounded-lg border ${
                message.type === 'success'
                  ? 'bg-green-50 border-green-200 text-green-800'
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}>
                <div className="flex items-center space-x-2">
                  <span>{message.type === 'success' ? '✅' : '❌'}</span>
                  <span>{message.text}</span>
                </div>
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Personal Information</h3>
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="first_name"
                        value={profileForm.first_name}
                        onChange={handleProfileChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-spurs-navy focus:border-spurs-navy"
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="last_name"
                        value={profileForm.last_name}
                        onChange={handleProfileChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-spurs-navy focus:border-spurs-navy"
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Display Name
                    </label>
                    <input
                      type="text"
                      name="display_name"
                      value={profileForm.display_name}
                      onChange={handleProfileChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-spurs-navy focus:border-spurs-navy"
                      placeholder="How you'd like to be shown in the app"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Favorite Spurs Player
                    </label>
                    <input
                      type="text"
                      name="favorite_player"
                      value={profileForm.favorite_player}
                      onChange={handleProfileChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-spurs-navy focus:border-spurs-navy"
                      placeholder="e.g., Son Heung-min, James Maddison, Dejan Kulusevski"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fan Status
                    </label>
                    <select
                      name="favorite_position"
                      value={profileForm.favorite_position}
                      onChange={handleProfileChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-spurs-navy focus:border-spurs-navy"
                    >
                      <option value="Spurs Fan">Spurs Fan</option>
                      <option value="Season Ticket Holder">Season Ticket Holder</option>
                      <option value="Member">Member</option>
                      <option value="Casual Supporter">Casual Supporter</option>
                      <option value="International Fan">International Fan</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-spurs-gold hover:bg-yellow-500 disabled:bg-gray-300 text-spurs-navy font-bold py-3 px-6 rounded-lg transition-colors disabled:cursor-not-allowed"
                  >
                    {loading ? 'Updating...' : 'Update Profile'}
                  </button>
                </form>
              </div>
            )}

            {/* Account Tab */}
            {activeTab === 'account' && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Account Settings</h3>
                
                {/* Email Update */}
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Update Email Address</h4>
                  <form onSubmit={handleEmailSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Email
                      </label>
                      <input
                        type="email"
                        value={user?.email || ''}
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Email Address
                      </label>
                      <input
                        type="email"
                        name="newEmail"
                        value={emailForm.newEmail}
                        onChange={handleEmailChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-spurs-navy focus:border-spurs-navy"
                        placeholder="Enter new email address"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Email
                      </label>
                      <input
                        type="email"
                        name="confirmEmail"
                        value={emailForm.confirmEmail}
                        onChange={handleEmailChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-spurs-navy focus:border-spurs-navy"
                        placeholder="Confirm new email address"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-spurs-navy hover:bg-spurs-blue disabled:bg-gray-300 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:cursor-not-allowed"
                    >
                      {loading ? 'Updating...' : 'Update Email'}
                    </button>
                  </form>
                </div>

                {/* Delete Account */}
                <div className="border-t pt-8">
                  <h4 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h4>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h5 className="font-medium text-red-800 mb-2">Delete Account</h5>
                    <p className="text-sm text-red-600 mb-4">
                      This action cannot be undone. All your quiz history and profile data will be permanently deleted.
                    </p>
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Security Settings</h3>
                
                {/* Password Update */}
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Change Password</h4>
                  <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password
                      </label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={passwordForm.currentPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-spurs-navy focus:border-spurs-navy"
                        placeholder="Enter current password"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        value={passwordForm.newPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-spurs-navy focus:border-spurs-navy"
                        placeholder="Enter new password (min 6 characters)"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={passwordForm.confirmPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-spurs-navy focus:border-spurs-navy"
                        placeholder="Confirm new password"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-spurs-navy hover:bg-spurs-blue disabled:bg-gray-300 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:cursor-not-allowed"
                    >
                      {loading ? 'Updating...' : 'Change Password'}
                    </button>
                  </form>
                </div>

                {/* Security Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h5 className="font-medium text-blue-800 mb-2">Account Security</h5>
                  <ul className="text-sm text-blue-600 space-y-1">
                    <li>• Use a strong, unique password</li>
                    <li>• Keep your email address up to date</li>
                    <li>• Sign out from shared devices</li>
                    <li>• Report suspicious activity immediately</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">App Preferences</h3>
                
                <div className="space-y-6">
                  {/* Quiz Preferences */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Quiz Settings</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="font-medium text-gray-700">Difficulty Preference</h5>
                          <p className="text-sm text-gray-500">Default quiz difficulty level</p>
                        </div>
                        <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-spurs-navy focus:border-spurs-navy">
                          <option value="Easy">Easy</option>
                          <option value="Medium">Medium</option>
                          <option value="Hard">Hard</option>
                          <option value="Mixed">Mixed</option>
                        </select>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="font-medium text-gray-700">Show Hints</h5>
                          <p className="text-sm text-gray-500">Display helpful hints during quizzes</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-spurs-navy"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Notifications */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Notifications</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="font-medium text-gray-700">New Quiz Alerts</h5>
                          <p className="text-sm text-gray-500">Get notified when new quizzes are added</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-spurs-navy"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="font-medium text-gray-700">Weekly Summary</h5>
                          <p className="text-sm text-gray-500">Receive weekly quiz performance summaries</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-spurs-navy"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Theme (placeholder) */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Appearance</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="font-medium text-gray-700">Theme</h5>
                          <p className="text-sm text-gray-500">Choose your preferred app theme</p>
                        </div>
                        <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-spurs-navy focus:border-spurs-navy">
                          <option value="spurs">Spurs Classic</option>
                          <option value="light">Light Mode</option>
                          <option value="dark">Dark Mode</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <h3 className="text-lg font-bold text-red-600 mb-4">Confirm Account Deletion</h3>
            <p className="text-gray-700 mb-6">
              Are you absolutely sure? This action cannot be undone and all your data will be permanently deleted.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={loading}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:cursor-not-allowed"
              >
                {loading ? 'Deleting...' : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSettings;
