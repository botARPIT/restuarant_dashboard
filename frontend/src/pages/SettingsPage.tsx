import React, { useState } from 'react';
import { Settings, User, Bell, Shield, Palette, Database, Globe, CreditCard, Save, X } from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('restaurant');
  const [saving, setSaving] = useState(false);

  // Restaurant Settings
  const [restaurantSettings, setRestaurantSettings] = useState({
    name: 'Restaurant Dashboard',
    address: '123 Main Street, City, State 12345',
    phone: '+91 98765 43210',
    email: 'info@restaurant.com',
    cuisine: 'Indian',
    openingHours: '10:00 AM - 11:00 PM',
    deliveryRadius: '5',
    minOrderAmount: '100'
  });

  // User Preferences
  const [userPreferences, setUserPreferences] = useState({
    language: 'en',
    timezone: 'Asia/Kolkata',
    currency: 'INR',
    dateFormat: 'DD/MM/YYYY',
    notifications: {
      email: true,
      push: true,
      sms: false
    }
  });

  // System Settings
  const [systemSettings, setSystemSettings] = useState({
    autoBackup: true,
    backupFrequency: 'daily',
    dataRetention: '90',
    analytics: true,
    debugMode: false
  });

  const handleSave = async (section: string) => {
    setSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    // Show success message
    alert(`${section} settings saved successfully!`);
  };

  const tabs = [
    { id: 'restaurant', name: 'Restaurant', icon: Settings },
    { id: 'user', name: 'User Preferences', icon: User },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'appearance', name: 'Appearance', icon: Palette },
    { id: 'system', name: 'System', icon: Database }
  ];

  return (
    <div className="content-container">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Configure your restaurant dashboard and preferences</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="card-minimal">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-all duration-200 ${
                      isActive 
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                    <span className="font-medium">{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Restaurant Settings */}
          {activeTab === 'restaurant' && (
            <div className="card-minimal">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-900">Restaurant Information</h2>
                <button
                  onClick={() => handleSave('Restaurant')}
                  disabled={saving}
                  className="btn-primary flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Restaurant Name</label>
                  <input
                    type="text"
                    value={restaurantSettings.name}
                    onChange={(e) => setRestaurantSettings({ ...restaurantSettings, name: e.target.value })}
                    className="input-clean"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Cuisine Type</label>
                  <input
                    type="text"
                    value={restaurantSettings.cuisine}
                    onChange={(e) => setRestaurantSettings({ ...restaurantSettings, cuisine: e.target.value })}
                    className="input-clean"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Address</label>
                  <input
                    type="text"
                    value={restaurantSettings.address}
                    onChange={(e) => setRestaurantSettings({ ...restaurantSettings, address: e.target.value })}
                    className="input-clean"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={restaurantSettings.phone}
                    onChange={(e) => setRestaurantSettings({ ...restaurantSettings, phone: e.target.value })}
                    className="input-clean"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={restaurantSettings.email}
                    onChange={(e) => setRestaurantSettings({ ...restaurantSettings, email: e.target.value })}
                    className="input-clean"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Opening Hours</label>
                  <input
                    type="text"
                    value={restaurantSettings.openingHours}
                    onChange={(e) => setRestaurantSettings({ ...restaurantSettings, openingHours: e.target.value })}
                    className="input-clean"
                    placeholder="10:00 AM - 11:00 PM"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Delivery Radius (km)</label>
                  <input
                    type="number"
                    value={restaurantSettings.deliveryRadius}
                    onChange={(e) => setRestaurantSettings({ ...restaurantSettings, deliveryRadius: e.target.value })}
                    className="input-clean"
                    min="1"
                    max="50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Minimum Order Amount (₹)</label>
                  <input
                    type="number"
                    value={restaurantSettings.minOrderAmount}
                    onChange={(e) => setRestaurantSettings({ ...restaurantSettings, minOrderAmount: e.target.value })}
                    className="input-clean"
                    min="0"
                  />
                </div>
              </div>
            </div>
          )}

          {/* User Preferences */}
          {activeTab === 'user' && (
            <div className="card-minimal">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-900">User Preferences</h2>
                <button
                  onClick={() => handleSave('User')}
                  disabled={saving}
                  className="btn-primary flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Language</label>
                  <select
                    value={userPreferences.language}
                    onChange={(e) => setUserPreferences({ ...userPreferences, language: e.target.value })}
                    className="input-clean"
                  >
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                    <option value="ta">Tamil</option>
                    <option value="te">Telugu</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Timezone</label>
                  <select
                    value={userPreferences.timezone}
                    onChange={(e) => setUserPreferences({ ...userPreferences, timezone: e.target.value })}
                    className="input-clean"
                  >
                    <option value="Asia/Kolkata">India (IST)</option>
                    <option value="Asia/Dubai">Dubai (GST)</option>
                    <option value="America/New_York">New York (EST)</option>
                    <option value="Europe/London">London (GMT)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Currency</label>
                  <select
                    value={userPreferences.currency}
                    onChange={(e) => setUserPreferences({ ...userPreferences, currency: e.target.value })}
                    className="input-clean"
                  >
                    <option value="INR">Indian Rupee (₹)</option>
                    <option value="USD">US Dollar ($)</option>
                    <option value="EUR">Euro (€)</option>
                    <option value="GBP">British Pound (£)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Date Format</label>
                  <select
                    value={userPreferences.dateFormat}
                    onChange={(e) => setUserPreferences({ ...userPreferences, dateFormat: e.target.value })}
                    className="input-clean"
                  >
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Settings */}
          {activeTab === 'notifications' && (
            <div className="card-minimal">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-900">Notification Preferences</h2>
                <button
                  onClick={() => handleSave('Notifications')}
                  disabled={saving}
                  className="btn-primary flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-slate-900">Email Notifications</h3>
                    <p className="text-sm text-slate-600">Receive notifications via email</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={userPreferences.notifications.email}
                      onChange={(e) => setUserPreferences({
                        ...userPreferences,
                        notifications: { ...userPreferences.notifications, email: e.target.checked }
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-slate-900">Push Notifications</h3>
                    <p className="text-sm text-slate-600">Receive push notifications in browser</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={userPreferences.notifications.push}
                      onChange={(e) => setUserPreferences({
                        ...userPreferences,
                        notifications: { ...userPreferences.notifications, push: e.target.checked }
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-slate-900">SMS Notifications</h3>
                    <p className="text-sm text-slate-600">Receive notifications via SMS</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={userPreferences.notifications.sms}
                      onChange={(e) => setUserPreferences({
                        ...userPreferences,
                        notifications: { ...userPreferences.notifications, sms: e.target.checked }
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <div className="card-minimal">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-900">Security Settings</h2>
                <button
                  onClick={() => handleSave('Security')}
                  disabled={saving}
                  className="btn-primary flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <h3 className="font-medium text-amber-900 mb-2">Change Password</h3>
                  <p className="text-sm text-amber-700 mb-4">Update your account password for enhanced security</p>
                  <button className="btn-secondary">Change Password</button>
                </div>
                
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-medium text-blue-900 mb-2">Two-Factor Authentication</h3>
                  <p className="text-sm text-blue-700 mb-4">Add an extra layer of security to your account</p>
                  <button className="btn-secondary">Enable 2FA</button>
                </div>
                
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                  <h3 className="font-medium text-slate-900 mb-2">Session Management</h3>
                  <p className="text-sm text-slate-700 mb-4">View and manage your active sessions</p>
                  <button className="btn-secondary">View Sessions</button>
                </div>
              </div>
            </div>
          )}

          {/* Appearance Settings */}
          {activeTab === 'appearance' && (
            <div className="card-minimal">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-900">Appearance Settings</h2>
                <button
                  onClick={() => handleSave('Appearance')}
                  disabled={saving}
                  className="btn-primary flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Theme</label>
                  <select className="input-clean">
                    <option value="light">Light Theme</option>
                    <option value="dark">Dark Theme</option>
                    <option value="auto">Auto (System)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Font Size</label>
                  <select className="input-clean">
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Color Scheme</label>
                  <select className="input-clean">
                    <option value="default">Default</option>
                    <option value="blue">Blue</option>
                    <option value="green">Green</option>
                    <option value="purple">Purple</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Sidebar Position</label>
                  <select className="input-clean">
                    <option value="left">Left</option>
                    <option value="right">Right</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* System Settings */}
          {activeTab === 'system' && (
            <div className="card-minimal">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-900">System Settings</h2>
                <button
                  onClick={() => handleSave('System')}
                  disabled={saving}
                  className="btn-primary flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-slate-900">Auto Backup</h3>
                    <p className="text-sm text-slate-600">Automatically backup your data</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={systemSettings.autoBackup}
                      onChange={(e) => setSystemSettings({ ...systemSettings, autoBackup: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Backup Frequency</label>
                    <select
                      value={systemSettings.backupFrequency}
                      onChange={(e) => setSystemSettings({ ...systemSettings, backupFrequency: e.target.value })}
                      className="input-clean"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Data Retention (days)</label>
                    <input
                      type="number"
                      value={systemSettings.dataRetention}
                      onChange={(e) => setSystemSettings({ ...systemSettings, dataRetention: e.target.value })}
                      className="input-clean"
                      min="30"
                      max="365"
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-slate-900">Analytics</h3>
                    <p className="text-sm text-slate-600">Collect usage analytics to improve the platform</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={systemSettings.analytics}
                      onChange={(e) => setSystemSettings({ ...systemSettings, analytics: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-slate-900">Debug Mode</h3>
                    <p className="text-sm text-slate-600">Enable debug mode for development purposes</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={systemSettings.debugMode}
                      onChange={(e) => setSystemSettings({ ...systemSettings, debugMode: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
