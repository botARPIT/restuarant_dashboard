import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Phone, Shield, Eye, EyeOff, Save, Camera, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { 
  sanitizeInput, 
  validateEmail, 
  validatePhone, 
  validatePassword, 
  validateLength 
} from '../utils/security';

interface ProfileFormData {
  name: string;
  email: string;
  phone: string;
  bio: string;
  avatar: string;
}

interface SecurityFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  enable2FA: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
}

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Profile form state
  const [profileForm, setProfileForm] = useState<ProfileFormData>({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    bio: '',
    avatar: user?.avatar || ''
  });

  // Security form state
  const [securityForm, setSecurityForm] = useState<SecurityFormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    enable2FA: false,
    emailNotifications: true,
    pushNotifications: true
  });

  // Password visibility
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      setProfileForm(prev => ({
        ...prev,
        name: user.name,
        email: user.email,
        avatar: user.avatar
      }));
    }
  }, [user]);

  // Validation functions using security utilities
  const validateProfileForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Name validation
    const nameValidation = validateLength(profileForm.name, 2, 50);
    if (!nameValidation.isValid) {
      newErrors.name = nameValidation.error || 'Name validation failed';
    }

    // Email validation
    if (!validateEmail(profileForm.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation
    if (profileForm.phone && !validatePhone(profileForm.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    // Bio validation
    const bioValidation = validateLength(profileForm.bio, 0, 200);
    if (!bioValidation.isValid) {
      newErrors.bio = bioValidation.error || 'Bio validation failed';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSecurityForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Current password validation
    if (!securityForm.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    // New password validation
    if (securityForm.newPassword) {
      const passwordValidation = validatePassword(securityForm.newPassword);
      if (!passwordValidation.isValid) {
        newErrors.newPassword = passwordValidation.errors[0] || 'Password validation failed';
      }
    }

    // Confirm password validation
    if (securityForm.newPassword && securityForm.newPassword !== securityForm.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateProfileForm()) return;

    setIsSubmitting(true);
    setMessage(null);

    try {
      // Sanitize inputs before submission using security utilities
      const sanitizedData = {
        name: sanitizeInput(profileForm.name),
        email: sanitizeInput(profileForm.email),
        phone: sanitizeInput(profileForm.phone),
        bio: sanitizeInput(profileForm.bio),
        avatar: sanitizeInput(profileForm.avatar)
      };

      const success = await updateProfile(sanitizedData);
      
      if (success) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        // Clear form errors
        setErrors({});
      } else {
        setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSecuritySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateSecurityForm()) return;

    setIsSubmitting(true);
    setMessage(null);

    try {
      // Simulate API call for password change
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessage({ type: 'success', text: 'Security settings updated successfully!' });
      
      // Clear form
      setSecurityForm(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      
      setErrors({});
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update security settings. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('profile')) {
      const fieldName = name.replace('profile', '').toLowerCase();
      setProfileForm(prev => ({ ...prev, [fieldName]: value }));
    } else if (name.startsWith('security')) {
      const fieldName = name.replace('security', '').toLowerCase();
      setSecurityForm(prev => ({ ...prev, [fieldName]: value }));
    }
    
    // Clear error when user starts typing
    if (errors[fieldName]) {
      setErrors(prev => ({ ...prev, [fieldName]: '' }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setSecurityForm(prev => ({ ...prev, [name]: checked }));
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const getPasswordStrength = (password: string) => {
    if (!password) return { score: 0, label: '', color: '' };
    
    const validation = validatePassword(password);
    return {
      score: validation.score,
      label: validation.label,
      color: validation.color
    };
  };

  if (!user) {
    return (
      <div className="content-container">
        <div className="empty-state">
          <User className="empty-state-icon" />
          <p className="empty-state-text">User not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="content-container">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Profile & Security</h1>
          <p className="page-subtitle">Manage your account settings and security preferences</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="card-minimal">
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-all duration-200 cursor-pointer ${
                  activeTab === 'profile' 
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <User className={`w-5 h-5 ${activeTab === 'profile' ? 'text-blue-600' : 'text-slate-400'}`} />
                <span className="font-medium">Profile</span>
              </button>
              
              <button
                onClick={() => setActiveTab('security')}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-all duration-200 cursor-pointer ${
                  activeTab === 'security' 
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Shield className={`w-5 h-5 ${activeTab === 'security' ? 'text-blue-600' : 'text-slate-400'}`} />
                <span className="font-medium">Security</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="card-minimal">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-900">Profile Information</h2>
                <button
                  onClick={handleProfileSubmit}
                  disabled={isSubmitting}
                  className="btn-primary flex items-center gap-2 hover:bg-slate-700 transition-colors duration-200 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
              
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                {/* Avatar Section */}
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="w-20 h-20 bg-slate-800 rounded-2xl flex items-center justify-center">
                      <span className="text-white text-2xl font-bold">{profileForm.avatar}</span>
                    </div>
                    <button
                      type="button"
                      className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors duration-200 cursor-pointer"
                    >
                      <Camera className="w-4 h-4 text-white" />
                    </button>
                  </div>
                  
                  <div className="flex-1">
                    <label htmlFor="profileAvatar" className="block text-sm font-medium text-slate-700 mb-2">
                      Avatar Initial
                    </label>
                    <input
                      type="text"
                      id="profileAvatar"
                      name="profileAvatar"
                      value={profileForm.avatar}
                      onChange={handleInputChange}
                      className="input-clean w-20 text-center text-lg font-bold cursor-text"
                      maxLength={1}
                      placeholder="A"
                    />
                  </div>
                </div>

                {/* Name and Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="profileName" className="block text-sm font-medium text-slate-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="profileName"
                      name="profileName"
                      value={profileForm.name}
                      onChange={handleInputChange}
                      className={`input-clean cursor-text ${errors.name ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500' : ''}`}
                      placeholder="Enter your full name"
                      maxLength={50}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-rose-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.name}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="profileEmail" className="block text-sm font-medium text-slate-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="profileEmail"
                      name="profileEmail"
                      value={profileForm.email}
                      onChange={handleInputChange}
                      className={`input-clean cursor-text ${errors.email ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500' : ''}`}
                      placeholder="Enter your email"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-rose-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Phone and Bio */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="profilePhone" className="block text-sm font-medium text-slate-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="profilePhone"
                      name="profilePhone"
                      value={profileForm.phone}
                      onChange={handleInputChange}
                      className={`input-clean cursor-text ${errors.phone ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500' : ''}`}
                      placeholder="+91 98765 43210"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-rose-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.phone}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="profileBio" className="block text-sm font-medium text-slate-700 mb-2">
                      Bio
                    </label>
                    <textarea
                      id="profileBio"
                      name="profileBio"
                      value={profileForm.bio}
                      onChange={handleInputChange}
                      rows={3}
                      className={`input-clean resize-none cursor-text ${errors.bio ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500' : ''}`}
                      placeholder="Tell us about yourself..."
                      maxLength={200}
                    />
                    <div className="flex items-center justify-between mt-1">
                      {errors.bio && (
                        <p className="text-sm text-rose-600 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.bio}
                        </p>
                      )}
                      <span className="text-xs text-slate-500 ml-auto">
                        {profileForm.bio.length}/200
                      </span>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="card-minimal">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-900">Security Settings</h2>
                <button
                  onClick={handleSecuritySubmit}
                  disabled={isSubmitting}
                  className="btn-primary flex items-center gap-2 hover:bg-slate-700 transition-colors duration-200 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Update Security
                    </>
                  )}
                </button>
              </div>
              
              <form onSubmit={handleSecuritySubmit} className="space-y-6">
                {/* Password Change Section */}
                <div className="p-6 bg-slate-50 rounded-lg border border-slate-200">
                  <h3 className="text-lg font-medium text-slate-900 mb-4">Change Password</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="securityCurrentPassword" className="block text-sm font-medium text-slate-700 mb-2">
                        Current Password *
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.current ? 'text' : 'password'}
                          id="securityCurrentPassword"
                          name="securityCurrentPassword"
                          value={securityForm.currentPassword}
                          onChange={handleInputChange}
                          className={`input-clean pr-10 cursor-text ${errors.currentPassword ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500' : ''}`}
                          placeholder="Enter current password"
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('current')}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {errors.currentPassword && (
                        <p className="mt-1 text-sm text-rose-600 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.currentPassword}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="securityNewPassword" className="block text-sm font-medium text-slate-700 mb-2">
                          New Password
                        </label>
                        <div className="relative">
                          <input
                            type={showPasswords.new ? 'text' : 'password'}
                            id="securityNewPassword"
                            name="securityNewPassword"
                            value={securityForm.newPassword}
                            onChange={handleInputChange}
                            className={`input-clean pr-10 cursor-text ${errors.newPassword ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500' : ''}`}
                            placeholder="Enter new password"
                          />
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility('new')}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                          >
                            {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        {errors.newPassword && (
                          <p className="mt-1 text-sm text-rose-600 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.newPassword}
                          </p>
                        )}
                        
                        {/* Password Strength Indicator */}
                        {securityForm.newPassword && (
                          <div className="mt-2">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs text-slate-600">Password strength:</span>
                              <span className={`text-xs font-medium ${getPasswordStrength(securityForm.newPassword).color}`}>
                                {getPasswordStrength(securityForm.newPassword).label}
                              </span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full transition-all duration-300 ${
                                  getPasswordStrength(securityForm.newPassword).score === 0 ? 'w-0' :
                                  getPasswordStrength(securityForm.newPassword).score === 1 ? 'w-1/5' :
                                  getPasswordStrength(securityForm.newPassword).score === 2 ? 'w-2/5' :
                                  getPasswordStrength(securityForm.newPassword).score === 3 ? 'w-3/5' :
                                  getPasswordStrength(securityForm.newPassword).score === 4 ? 'w-4/5' : 'w-full'
                                } ${
                                  getPasswordStrength(securityForm.newPassword).score <= 1 ? 'bg-rose-500' :
                                  getPasswordStrength(securityForm.newPassword).score <= 2 ? 'bg-orange-500' :
                                  getPasswordStrength(securityForm.newPassword).score <= 3 ? 'bg-yellow-500' :
                                  getPasswordStrength(securityForm.newPassword).score <= 4 ? 'bg-blue-500' : 'bg-emerald-500'
                                }`}
                              ></div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div>
                        <label htmlFor="securityConfirmPassword" className="block text-sm font-medium text-slate-700 mb-2">
                          Confirm Password
                        </label>
                        <div className="relative">
                          <input
                            type={showPasswords.confirm ? 'text' : 'password'}
                            id="securityConfirmPassword"
                            name="securityConfirmPassword"
                            value={securityForm.confirmPassword}
                            onChange={handleInputChange}
                            className={`input-clean pr-10 cursor-text ${errors.confirmPassword ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500' : ''}`}
                            placeholder="Confirm new password"
                          />
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility('confirm')}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                          >
                            {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        {errors.confirmPassword && (
                          <p className="mt-1 text-sm text-rose-600 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.confirmPassword}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Security Preferences */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-slate-900">Two-Factor Authentication</h3>
                      <p className="text-sm text-slate-600">Add an extra layer of security to your account</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="enable2FA"
                        checked={securityForm.enable2FA}
                        onChange={handleCheckboxChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-slate-900">Email Notifications</h3>
                      <p className="text-sm text-slate-600">Receive security alerts via email</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="emailNotifications"
                        checked={securityForm.emailNotifications}
                        onChange={handleCheckboxChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-slate-900">Push Notifications</h3>
                      <p className="text-sm text-slate-600">Receive security alerts in browser</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="pushNotifications"
                        checked={securityForm.pushNotifications}
                        onChange={handleCheckboxChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Success/Error Messages */}
      {message && (
        <div className={`fixed bottom-6 right-6 p-4 rounded-lg shadow-lg border ${
          message.type === 'success' 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
            : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          <div className="flex items-center gap-2">
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600" />
            )}
            <span className="font-medium">{message.text}</span>
          </div>
        </div>
      )}
    </div>
  );
}