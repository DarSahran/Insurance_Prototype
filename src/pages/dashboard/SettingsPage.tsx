import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Settings, User, Bell, Shield, CreditCard, Eye,
  Smartphone, Download, Trash2, Save, AlertTriangle,
  Camera, Key, Database, Sparkles, Zap, Crown
} from 'lucide-react';
import { useHybridAuth } from '../../hooks/useHybridAuth';
import SubscriptionService, { type SubscriptionTier, type UserSubscription, type MLUsageStatus } from '../../lib/subscriptionService';
import { loadStripe } from '@stripe/stripe-js';
import { supabase } from '../../lib/supabase';

const SettingsPage: React.FC = () => {
  const { user } = useHybridAuth();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'profile');
  const [notifications, setNotifications] = useState({
    email: {
      policyUpdates: true,
      claimsStatus: true,
      paymentReminders: true,
      promotions: false
    },
    push: {
      policyUpdates: true,
      claimsStatus: true,
      paymentReminders: true,
      emergencyAlerts: true
    },
    sms: {
      claimsStatus: true,
      paymentReminders: false,
      emergencyAlerts: true
    }
  });

  const [privacy, setPrivacy] = useState({
    dataSharing: false,
    analyticsTracking: true,
    marketingCommunication: false,
    thirdPartySharing: false
  });

  const [subscriptionTiers, setSubscriptionTiers] = useState<SubscriptionTier[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState<UserSubscription | null>(null);
  const [usageStatus, setUsageStatus] = useState<MLUsageStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  useEffect(() => {
    if (user) {
      if (activeTab === 'subscription') {
        loadSubscriptionData();
      } else if (activeTab === 'profile') {
        loadUserProfile();
      }
    }
  }, [user, activeTab]);

  const loadUserProfile = async () => {
    if (!user) return;

    try {
      setProfileLoading(true);

      // Fetch user profile data from user_profiles table
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading user profile:', error);
        return;
      }

      setUserProfile(profile || {
        user_id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || '',
        phone: user.user_metadata?.phone || '',
        date_of_birth: null,
        address: null
      });
    } catch (error) {
      console.error('Error loading user profile:', error);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleSaveProfile = async (formData: any) => {
    if (!user) return;

    try {
      setProfileLoading(true);

      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: user.id,
          full_name: formData.fullName,
          phone: formData.phone,
          date_of_birth: formData.dateOfBirth,
          address: formData.address,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (error) {
        console.error('Error saving profile:', error);
        alert('Failed to save profile. Please try again.');
        return;
      }

      alert('Profile saved successfully!');
      await loadUserProfile();
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
    } finally {
      setProfileLoading(false);
    }
  };

  const loadSubscriptionData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const [tiers, subscription, usage] = await Promise.all([
        SubscriptionService.getSubscriptionTiers(),
        SubscriptionService.getUserSubscription(user.id),
        SubscriptionService.checkMLUsageLimit(user.id)
      ]);

      setSubscriptionTiers(tiers);
      setCurrentSubscription(subscription);
      setUsageStatus(usage);
    } catch (error) {
      console.error('Error loading subscription data:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'subscription', name: 'Subscription', icon: Crown },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'privacy', name: 'Privacy & Security', icon: Shield },
    { id: 'data', name: 'Data & Storage', icon: Database }
  ];

  const handleNotificationChange = (category: string, setting: string, value: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [setting]: value
      }
    }));
  };

  const handlePrivacyChange = (setting: string, value: boolean) => {
    setPrivacy(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const renderProfileTab = () => {
    if (profileLoading && !userProfile) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    const fullName = userProfile?.full_name || user?.user_metadata?.full_name || '';
    const [firstName, ...lastNameParts] = fullName.split(' ');
    const lastName = lastNameParts.join(' ');

    return (
      <div className="space-y-6">
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const firstName = formData.get('firstName') as string;
          const lastName = formData.get('lastName') as string;
          handleSaveProfile({
            fullName: `${firstName} ${lastName}`.trim(),
            phone: formData.get('phone') as string,
            dateOfBirth: formData.get('dateOfBirth') as string || null,
            address: formData.get('address') as string
          });
        }}>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h2>

            <div className="flex items-center space-x-6 mb-6">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-3xl font-semibold">
                    {user?.email?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <button type="button" className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Profile Photo</h3>
                <p className="text-sm text-gray-600">Upload a new profile picture</p>
                <button type="button" className="mt-2 text-blue-600 hover:text-blue-800 font-medium">
                  Change Photo
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  defaultValue={firstName}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  defaultValue={lastName}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  defaultValue={userProfile?.phone || ''}
                  placeholder="+1 (555) 123-4567"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  defaultValue={userProfile?.date_of_birth || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  name="address"
                  defaultValue={userProfile?.address || ''}
                  placeholder="123 Main St, City, State 12345"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                type="submit"
                disabled={profileLoading}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                <span>{profileLoading ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        </form>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Security Settings</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <Key className="w-5 h-5 text-gray-600" />
              <div>
                <h3 className="font-medium text-gray-900">Change Password</h3>
                <p className="text-sm text-gray-600">Last changed 30 days ago</p>
              </div>
            </div>
            <button className="text-blue-600 hover:text-blue-800 font-medium">
              Update
            </button>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <Smartphone className="w-5 h-5 text-gray-600" />
              <div>
                <h3 className="font-medium text-gray-900">Two-Factor Authentication</h3>
                <p className="text-sm text-green-600">Enabled</p>
              </div>
            </div>
            <button className="text-blue-600 hover:text-blue-800 font-medium">
              Configure
            </button>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <Eye className="w-5 h-5 text-gray-600" />
              <div>
                <h3 className="font-medium text-gray-900">Login Activity</h3>
                <p className="text-sm text-gray-600">Monitor account access</p>
              </div>
            </div>
            <button className="text-blue-600 hover:text-blue-800 font-medium">
              View
            </button>
          </div>
        </div>
      </div>
    </div>
  );
  };

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Email Notifications</h2>
        
        <div className="space-y-4">
          {Object.entries(notifications.email).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </h3>
                <p className="text-sm text-gray-600">
                  {key === 'policyUpdates' && 'Receive updates about your insurance policies'}
                  {key === 'claimsStatus' && 'Get notified about claim processing updates'}
                  {key === 'paymentReminders' && 'Reminders for upcoming premium payments'}
                  {key === 'promotions' && 'Special offers and promotional content'}
                </p>
              </div>
              <button
                onClick={() => handleNotificationChange('email', key, !value)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  value ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    value ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Push Notifications</h2>
        
        <div className="space-y-4">
          {Object.entries(notifications.push).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </h3>
              </div>
              <button
                onClick={() => handleNotificationChange('push', key, !value)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  value ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    value ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">SMS Notifications</h2>
        
        <div className="space-y-4">
          {Object.entries(notifications.sms).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </h3>
              </div>
              <button
                onClick={() => handleNotificationChange('sms', key, !value)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  value ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    value ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPrivacyTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Privacy Settings</h2>
        
        <div className="space-y-6">
          {Object.entries(privacy).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </h3>
                <p className="text-sm text-gray-600">
                  {key === 'dataSharing' && 'Allow sharing of anonymized data for research purposes'}
                  {key === 'analyticsTracking' && 'Help improve our services through usage analytics'}
                  {key === 'marketingCommunication' && 'Receive marketing communications from partners'}
                  {key === 'thirdPartySharing' && 'Share data with trusted third-party services'}
                </p>
              </div>
              <button
                onClick={() => handlePrivacyChange(key, !value)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  value ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    value ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-6 h-6 text-red-600 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-red-900">Account Deletion</h3>
            <p className="text-red-800 mt-1 mb-4">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
            <button className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
              <Trash2 className="w-4 h-4" />
              <span>Delete Account</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDataTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Data Management</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">Storage Usage</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Documents</span>
                <span>2.4 GB</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Images</span>
                <span>1.2 GB</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Data</span>
                <span>0.8 GB</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>4.4 GB / 10 GB</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">Data Export</h3>
            <p className="text-sm text-gray-600 mb-4">
              Download a copy of all your data including policies, claims, and documents.
            </p>
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
              <Download className="w-4 h-4" />
              <span>Export Data</span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Data Retention</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">Policy Documents</h3>
              <p className="text-sm text-gray-600">Keep for 7 years after policy expiration</p>
            </div>
            <span className="text-green-600 font-medium">Active</span>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">Claim Records</h3>
              <p className="text-sm text-gray-600">Keep for 10 years after claim closure</p>
            </div>
            <span className="text-green-600 font-medium">Active</span>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">Assessment Data</h3>
              <p className="text-sm text-gray-600">Keep for 5 years after last update</p>
            </div>
            <span className="text-green-600 font-medium">Active</span>
          </div>
        </div>
      </div>
    </div>
  );

  const handleUpgrade = async (tier: SubscriptionTier) => {
    if (!user) return;

    try {
      setLoading(true);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert('Please log in to upgrade your subscription');
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            price_id: tier.stripe_price_id_monthly,
            mode: 'subscription',
            success_url: `${window.location.origin}/dashboard/settings?tab=subscription&success=true`,
            cancel_url: `${window.location.origin}/dashboard/settings?tab=subscription&cancelled=true`
          }),
        }
      );

      const { sessionId, error } = await response.json();

      if (error) {
        alert(`Error: ${error}`);
        return;
      }

      const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!);
      if (stripe) {
        await stripe.redirectToCheckout({ sessionId });
      }
    } catch (error) {
      console.error('Error upgrading subscription:', error);
      alert('Failed to start checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!user || !currentSubscription) return;

    if (!confirm('Are you sure you want to cancel your subscription? It will remain active until the end of your billing period.')) {
      return;
    }

    try {
      setLoading(true);
      await SubscriptionService.cancelSubscription(user.id, true);
      await loadSubscriptionData();
      alert('Subscription cancelled successfully. It will remain active until the end of your billing period.');
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      alert('Failed to cancel subscription. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderSubscriptionTab = () => {
    const currentTierName = currentSubscription?.tier?.name || 'basic';

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Subscription Plan</h2>
          <p className="text-gray-600 mb-6">Choose the plan that fits your insurance needs</p>

          {usageStatus && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">ML Assessments This Week</span>
                <span className="text-sm font-semibold text-blue-600">
                  {usageStatus.queries_used} / {usageStatus.queries_limit}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${(usageStatus.queries_used / usageStatus.queries_limit) * 100}%` }}
                />
              </div>
              <p className="text-xs text-gray-600 mt-2">
                Resets weekly on {new Date(usageStatus.week_start).toLocaleDateString()}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {subscriptionTiers.map((tier) => {
              const isCurrentTier = tier.name === currentTierName;
              const isBetterTier = tier.price_monthly > (currentSubscription?.tier?.price_monthly || 0);

              return (
                <div
                  key={tier.id}
                  className={`relative border-2 rounded-xl p-6 ${
                    isCurrentTier
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  {isCurrentTier && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        Current Plan
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <div className="text-4xl mb-2">
                      {tier.name === 'basic' && '⭐'}
                      {tier.name === 'pro' && '✨'}
                      {tier.name === 'ultra' && '🚀'}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{tier.display_name}</h3>
                    <div className="text-3xl font-bold text-gray-900 mb-1">
                      ₹{tier.price_monthly}
                      <span className="text-lg text-gray-600">/mo</span>
                    </div>
                    {tier.price_yearly && (
                      <p className="text-sm text-gray-600">
                        or ₹{tier.price_yearly}/year (save 17%)
                      </p>
                    )}
                  </div>

                  <ul className="space-y-3 mb-6">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start space-x-2 text-sm">
                        <Zap className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => !isCurrentTier && isBetterTier && handleUpgrade(tier)}
                    disabled={isCurrentTier || loading || !isBetterTier}
                    className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                      isCurrentTier
                        ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                        : isBetterTier
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-200 text-gray-600 cursor-not-allowed'
                    }`}
                  >
                    {isCurrentTier ? 'Current Plan' : isBetterTier ? 'Upgrade' : 'Downgrade'}
                  </button>
                </div>
              );
            })}
          </div>

          {currentSubscription && currentSubscription.status === 'active' && (
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Manage Subscription</h4>
                  <p className="text-sm text-gray-600">
                    {currentSubscription.cancel_at_period_end
                      ? `Your subscription will be cancelled on ${new Date(currentSubscription.current_period_end!).toLocaleDateString()}`
                      : `Next billing date: ${new Date(currentSubscription.current_period_end!).toLocaleDateString()}`
                    }
                  </p>
                </div>
                {!currentSubscription.cancel_at_period_end && (
                  <button
                    onClick={handleCancelSubscription}
                    disabled={loading}
                    className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Cancel Subscription
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'profile': return renderProfileTab();
      case 'subscription': return renderSubscriptionTab();
      case 'notifications': return renderNotificationsTab();
      case 'privacy': return renderPrivacyTab();
      case 'data': return renderDataTab();
      default: return renderProfileTab();
    }
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account preferences and privacy settings</p>
      </div>

      <div className="flex space-x-8">
        {/* Sidebar */}
        <div className="w-64 space-y-2">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-900'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{tab.name}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
