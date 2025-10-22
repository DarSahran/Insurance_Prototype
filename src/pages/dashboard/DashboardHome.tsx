import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield, DollarSign, Target, Brain, TrendingUp, Heart, Calendar,
  Plus, CheckCircle, ArrowRight, Activity, Bell, Cloud, MapPin,
  Loader, AlertTriangle, Droplets, Wind, Sun
} from 'lucide-react';
import { useUserData } from '../../hooks/useUserData';
import { UserDataService } from '../../lib/userDataService';

const DashboardHome: React.FC = () => {
  const { userData, loading, firstName, policies, claims, questionnaires, location, weather, refreshWeather, initializeLocation } = useUserData();
  const [stats, setStats] = useState<any>(null);

  const latestQuestionnaire = questionnaires && questionnaires.length > 0
    ? questionnaires.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]
    : null;

  useEffect(() => {
    loadStats();
  }, [userData]);

  useEffect(() => {
    if (!location) {
      initializeLocation();
    }
  }, [location]);

  const loadStats = async () => {
    if (!userData?.profile) return;
    const userStats = await UserDataService.getUserStats(userData.profile.user_id);
    setStats(userStats);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const hasCompletedProfile = userData?.profile && userData.profile.first_name;

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {getGreeting()}, {firstName}!
          </h1>
          <p className="text-gray-600 mt-1">Here's your insurance overview</p>
        </div>
        <div className="flex items-center space-x-3">
          {!hasCompletedProfile && (
            <Link
              to="/dashboard/profile"
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors inline-flex items-center space-x-2"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Complete Profile</span>
            </Link>
          )}
          {policies.length === 0 && (
            <Link
              to="/browse-policies"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Browse Policies</span>
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Total Coverage</p>
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {stats ? formatCurrency(stats.totalCoverage) : '$0'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {stats?.activePolicies || 0} active {stats?.activePolicies === 1 ? 'policy' : 'policies'}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Monthly Premium</p>
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {stats ? formatCurrency(stats.monthlyPremium) : '$0'}
              </p>
              <p className="text-xs text-gray-500 mt-1">per month</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Risk Score</p>
                <Target className="w-5 h-5 text-orange-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {latestQuestionnaire?.risk_score || 'N/A'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {latestQuestionnaire ? (
                  latestQuestionnaire.risk_score < 40 ? 'Low Risk' :
                  latestQuestionnaire.risk_score < 70 ? 'Medium Risk' : 'High Risk'
                ) : 'Not assessed'}
              </p>
            </div>
          </div>

          {!hasCompletedProfile && (
            <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-6">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-orange-600 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Complete Your Profile
                  </h3>
                  <p className="text-gray-700 mb-4">
                    Add your personal information to get accurate insurance recommendations and risk assessments.
                  </p>
                  <Link
                    to="/dashboard/profile"
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    <span>Complete Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {!latestQuestionnaire && hasCompletedProfile && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-blue-600 rounded-lg">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Get Your Insurance Assessment
                  </h3>
                  <p className="text-gray-700 mb-4">
                    Take our comprehensive assessment to receive personalized insurance recommendations powered by AI.
                  </p>
                  <Link
                    to="/dashboard/assessment/new"
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <span>Start Assessment</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {policies.length === 0 && latestQuestionnaire && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-green-600 rounded-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Get Insurance Recommendations
                  </h3>
                  <p className="text-gray-700 mb-4">
                    Based on your assessment, we can recommend the best insurance policies for you.
                  </p>
                  <Link
                    to="/dashboard/ai-recommendations"
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <span>View Recommendations</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {policies.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Your Policies</h2>
                <Link to="/dashboard/policies" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  View All
                </Link>
              </div>

              <div className="space-y-3">
                {policies.slice(0, 3).map((policy) => (
                  <div key={policy.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-3">
                      <Heart className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">{policy.policy_type}</p>
                        <p className="text-sm text-gray-600">{policy.policy_number}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {formatCurrency(policy.coverage_amount)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {formatCurrency(policy.premium_amount)}/{policy.premium_frequency}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {claims.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Recent Claims</h2>
                <Link to="/dashboard/claims" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  View All
                </Link>
              </div>

              <div className="space-y-3">
                {claims.slice(0, 3).map((claim) => (
                  <div key={claim.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{claim.claim_number}</p>
                      <p className="text-sm text-gray-600">{claim.description}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        claim.status === 'approved' ? 'bg-green-100 text-green-800' :
                        claim.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {claim.status}
                      </span>
                      <p className="text-sm text-gray-900 mt-1">
                        {formatCurrency(claim.claim_amount)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {location && weather && (
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5" />
                  <h3 className="font-semibold">Your Location</h3>
                </div>
                <button
                  onClick={refreshWeather}
                  className="p-2 hover:bg-blue-400 rounded-lg transition-colors"
                >
                  <Activity className="w-4 h-4" />
                </button>
              </div>

              <p className="text-sm opacity-90 mb-4">
                {location.city}, {location.state}
              </p>

              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-2">
                  {weather.weather_condition?.includes('cloud') ? (
                    <Cloud className="w-12 h-12" />
                  ) : (
                    <Sun className="w-12 h-12" />
                  )}
                  <div>
                    <p className="text-4xl font-bold">{Math.round(weather.temperature)}°C</p>
                    <p className="text-sm opacity-90 capitalize">{weather.weather_condition}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-blue-400">
                <div className="flex items-center space-x-2">
                  <Droplets className="w-4 h-4 opacity-75" />
                  <div>
                    <p className="text-xs opacity-75">Humidity</p>
                    <p className="font-semibold">{Math.round(weather.humidity)}%</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Wind className="w-4 h-4 opacity-75" />
                  <div>
                    <p className="text-xs opacity-75">Wind</p>
                    <p className="font-semibold">{Math.round(weather.wind_speed)} km/h</p>
                  </div>
                </div>
              </div>

              {weather.severe_weather_alerts && weather.severe_weather_alerts.length > 0 && (
                <div className="mt-4 p-3 bg-orange-500 rounded-lg">
                  <p className="text-sm font-semibold flex items-center">
                    <Bell className="w-4 h-4 mr-2" />
                    Weather Alert
                  </p>
                  <p className="text-xs mt-1 opacity-90">
                    Check local advisories for safety
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>

            <div className="space-y-3">
              <Link
                to="/dashboard/ai-recommendations"
                className="flex items-center justify-between p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <Brain className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-900 font-medium">AI Recommendations</span>
                </div>
                <ArrowRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/dashboard/documents"
                className="flex items-center justify-between p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-green-600" />
                  <span className="text-gray-900 font-medium">Upload Documents</span>
                </div>
                <ArrowRight className="w-4 h-4 text-green-600 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/dashboard/health"
                className="flex items-center justify-between p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <Activity className="w-5 h-5 text-purple-600" />
                  <span className="text-gray-900 font-medium">Health Tracking</span>
                </div>
                <ArrowRight className="w-4 h-4 text-purple-600 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {latestQuestionnaire && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Latest Assessment</h3>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Risk Score</p>
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          latestQuestionnaire.risk_score < 40 ? 'bg-green-500' :
                          latestQuestionnaire.risk_score < 70 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${latestQuestionnaire.risk_score}%` }}
                      />
                    </div>
                    <span className="text-lg font-bold text-gray-900">
                      {latestQuestionnaire.risk_score}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Premium Estimate</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(latestQuestionnaire.premium_estimate || 0)}
                    <span className="text-sm text-gray-600">/month</span>
                  </p>
                </div>

                <Link
                  to="/dashboard/assessments"
                  className="block w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center"
                >
                  View Full Assessment
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
