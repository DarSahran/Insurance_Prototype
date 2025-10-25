import React, { useState, useEffect } from 'react';
import {
  User, Mail, Phone, MapPin, Calendar, Camera, Save, Loader,
  AlertTriangle, CheckCircle, MapPinned
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useUserData } from '../../hooks/useUserData';
import { UserDataService } from '../../lib/userDataService';
import { supabase } from '../../lib/supabase';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { profile, loading: userDataLoading, refreshData, location, initializeLocation } = useUserData();
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    occupation: '',
    educationLevel: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });

  useEffect(() => {
    if (profile) {
      setProfileData({
        firstName: profile.first_name || '',
        lastName: profile.last_name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        dateOfBirth: profile.date_of_birth || '',
        gender: profile.gender || '',
        occupation: profile.occupation || '',
        educationLevel: profile.education_level || '',
        street: profile.address?.street || '',
        city: profile.address?.city || '',
        state: profile.address?.state || '',
        zipCode: profile.address?.zipCode || '',
        country: profile.address?.country || 'USA'
      });
    } else if (user && !userDataLoading) {
      setProfileData(prev => ({
        ...prev,
        firstName: user.user_metadata?.first_name || user.user_metadata?.name || '',
        lastName: user.user_metadata?.last_name || '',
        email: user.email || '',
        phone: user.phone || ''
      }));
    }
  }, [profile, user, userDataLoading]);

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!user) {
      console.error('No user found');
      return;
    }

    try {
      setLoading(true);
      setSaveStatus('saving');
      setErrorMessage('');

      console.log('Saving profile for user:', user.id);

      const address = {
        street: profileData.street,
        city: profileData.city,
        state: profileData.state,
        zipCode: profileData.zipCode,
        country: profileData.country
      };

      const dataToSave = {
        first_name: profileData.firstName,
        last_name: profileData.lastName,
        full_name: `${profileData.firstName} ${profileData.lastName}`.trim(),
        phone: profileData.phone,
        date_of_birth: profileData.dateOfBirth || null,
        gender: profileData.gender || null,
        occupation: profileData.occupation || null,
        education_level: profileData.educationLevel || null,
        address: address,
        location: profileData.city && profileData.state ? `${profileData.city}, ${profileData.state}` : null
      };

      console.log('Data to save:', dataToSave);

      const updatedProfile = await UserDataService.createOrUpdateProfile(
        user.id,
        profileData.email,
        dataToSave
      );

      console.log('Updated profile:', updatedProfile);

      if (updatedProfile) {
        setSaveStatus('success');
        console.log('Profile saved successfully, refreshing data...');
        await refreshData();
        setTimeout(() => setSaveStatus('idle'), 3000);
      } else {
        throw new Error('Failed to save profile - no data returned');
      }
    } catch (error: any) {
      console.error('Error saving profile:', error);
      setSaveStatus('error');
      setErrorMessage(error.message || 'Failed to save profile. Please try again.');
      setTimeout(() => setSaveStatus('idle'), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleEnableLocation = async () => {
    try {
      setLoading(true);
      await initializeLocation();
      setTimeout(() => {
        refreshData();
      }, 2000);
    } catch (error) {
      console.error('Error enabling location:', error);
    } finally {
      setLoading(false);
    }
  };

  if (userDataLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  const isProfileComplete = profileData.firstName &&
                           profileData.lastName &&
                           profileData.phone &&
                           profileData.dateOfBirth;

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-1">Manage your personal information and settings</p>
        </div>
        {saveStatus === 'success' && (
          <div className="flex items-center space-x-2 text-green-600">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Saved successfully!</span>
          </div>
        )}
        {saveStatus === 'error' && (
          <div className="flex items-center space-x-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-medium">{errorMessage}</span>
          </div>
        )}
      </div>

      {!isProfileComplete && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
          <div className="flex items-start space-x-4">
            <AlertTriangle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-orange-900 mb-2">
                Complete Your Profile
              </h3>
              <p className="text-orange-800 mb-4">
                Fill out all required fields to unlock personalized insurance recommendations and AI-powered insights.
              </p>
              <ul className="text-sm text-orange-700 space-y-1">
                {!profileData.firstName && <li>• First Name is required</li>}
                {!profileData.lastName && <li>• Last Name is required</li>}
                {!profileData.phone && <li>• Phone Number is required</li>}
                {!profileData.dateOfBirth && <li>• Date of Birth is required</li>}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="space-y-8">
          <div className="flex items-center space-x-6 pb-6 border-b border-gray-200">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                {profileData.firstName?.charAt(0)?.toUpperCase() || profileData.email?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border-2 border-gray-200 hover:bg-gray-50 transition-colors">
                <Camera className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                {profileData.firstName && profileData.lastName
                  ? `${profileData.firstName} ${profileData.lastName}`
                  : 'Complete your profile'
                }
              </h3>
              <p className="text-sm text-gray-600 mt-1">{profileData.email}</p>
              {profile && (
                <p className="text-xs text-gray-500 mt-1">
                  Member since {new Date(profile.created_at).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-blue-600" />
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={profileData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter your first name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={profileData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter your last name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    value={profileData.email}
                    readOnly
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="date"
                    value={profileData.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <select
                  value={profileData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="non-binary">Non-binary</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Occupation
                </label>
                <input
                  type="text"
                  value={profileData.occupation}
                  onChange={(e) => handleInputChange('occupation', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="e.g. Software Engineer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Education Level
                </label>
                <select
                  value={profileData.educationLevel}
                  onChange={(e) => handleInputChange('educationLevel', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">Select education level</option>
                  <option value="high-school">High School</option>
                  <option value="associate">Associate Degree</option>
                  <option value="bachelor">Bachelor's Degree</option>
                  <option value="master">Master's Degree</option>
                  <option value="doctorate">Doctorate</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-blue-600" />
              Address Information
            </h3>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address
                </label>
                <input
                  type="text"
                  value={profileData.street}
                  onChange={(e) => handleInputChange('street', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="123 Main Street"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={profileData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="City"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    value={profileData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="State"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    value={profileData.zipCode}
                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="12345"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <MapPinned className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">
                    Location Services
                  </h3>
                  {location ? (
                    <div>
                      <p className="text-blue-800 mb-2">
                        Your location is enabled and being used for weather updates and regional insurance rates.
                      </p>
                      <p className="text-sm text-blue-700">
                        <strong>Current Location:</strong> {location.city}, {location.state}
                      </p>
                    </div>
                  ) : (
                    <p className="text-blue-800 mb-4">
                      Enable location services to get real-time weather updates and location-based insurance recommendations.
                    </p>
                  )}
                </div>
              </div>
              {!location && (
                <button
                  onClick={handleEnableLocation}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
                >
                  {loading ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      <span>Enabling...</span>
                    </>
                  ) : (
                    <span>Enable Location</span>
                  )}
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              {profile ? `Last updated: ${new Date(profile.updated_at).toLocaleDateString()}` : 'Profile not saved yet'}
            </p>
            <button
              onClick={handleSave}
              disabled={loading || saveStatus === 'saving'}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 font-medium"
            >
              {saveStatus === 'saving' ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Save Profile</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
