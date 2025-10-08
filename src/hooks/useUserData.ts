import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { UserDataService, ComprehensiveUserData } from '../lib/userDataService';

export function useUserData() {
  const { user } = useAuth();
  const [userData, setUserData] = useState<ComprehensiveUserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadUserData();
    } else {
      setUserData(null);
      setLoading(false);
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      const data = await UserDataService.getComprehensiveUserData(user.id);
      setUserData(data);
    } catch (err) {
      console.error('Error loading user data:', err);
      setError('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    await loadUserData();
  };

  const refreshWeather = async () => {
    if (!user) return;
    await UserDataService.refreshUserWeather(user.id);
    await loadUserData();
  };

  const initializeLocation = async () => {
    if (!user) return;
    await UserDataService.initializeUserLocation(user.id);
    await loadUserData();
  };

  return {
    userData,
    loading,
    error,
    refreshData,
    refreshWeather,
    initializeLocation,
    profile: userData?.profile,
    questionnaires: userData?.questionnaires || [],
    policies: userData?.policies || [],
    claims: userData?.claims || [],
    payments: userData?.payments || [],
    healthTracking: userData?.healthTracking || [],
    location: userData?.location,
    weather: userData?.weather,
    documents: userData?.documents || [],
    insights: userData?.insights || [],
    hasQuestionnaire: (userData?.questionnaires.length || 0) > 0,
    hasLocation: userData?.location !== null,
    hasPolicies: (userData?.policies.length || 0) > 0,
    firstName: userData?.profile?.first_name || userData?.profile?.email?.split('@')[0] || 'User'
  };
}
