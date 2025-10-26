import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield, DollarSign, Target, Brain, TrendingUp, Heart, Calendar,
  Plus, CheckCircle, ArrowRight, Activity, Bell,
  Loader, AlertTriangle, Search, Filter, Grid, List,
  Download, Phone, Eye, FileText, Clock
} from 'lucide-react';
import { useUserData } from '../../hooks/useUserData';
import { UserDataService } from '../../lib/userDataService';
import { supabase } from '../../lib/supabase';
import { useHybridAuth } from '../../hooks/useHybridAuth';

const DashboardHome: React.FC = () => {
  const { user } = useHybridAuth();
  const { userData, loading, firstName, policies, claims, questionnaires } = useUserData();
  const [stats, setStats] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [mlPrediction, setMlPrediction] = useState<any>(null);
  const [mlLoading, setMlLoading] = useState(true);

  const latestQuestionnaire = questionnaires && questionnaires.length > 0
    ? questionnaires.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]
    : null;

  useEffect(() => {
    loadStats();
    loadMLPrediction();
  }, [userData, user]);

  const loadStats = async () => {
    if (!userData?.profile) return;
    const userStats = await UserDataService.getUserStats(userData.profile.user_id);
    setStats(userStats);
  };

  const loadMLPrediction = async () => {
    if (!user?.id) return;

    setMlLoading(true);
    try {
      const { data, error } = await supabase
        .from('ml_predictions')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_successful', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error loading ML prediction:', error);
      } else {
        setMlPrediction(data);
      }
    } catch (err) {
      console.error('Error loading ML prediction:', err);
    } finally {
      setMlLoading(false);
    }
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
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
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

  // Check if profile has essential information filled out
  const hasCompletedProfile = userData?.profile && (
    userData.profile.first_name ||
    userData.profile.date_of_birth ||
    userData.profile.gender ||
    userData.profile.occupation ||
    userData.profile.education_level
  );

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { color: string; icon: React.ReactNode }> = {
      active: { color: 'bg-green-100 text-green-800', icon: <CheckCircle className="w-3 h-3 mr-1" /> },
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: <Clock className="w-3 h-3 mr-1" /> },
      expired: { color: 'bg-red-100 text-red-800', icon: <AlertTriangle className="w-3 h-3 mr-1" /> },
      cancelled: { color: 'bg-gray-100 text-gray-800', icon: <AlertTriangle className="w-3 h-3 mr-1" /> }
    };

    const statusInfo = statusMap[status.toLowerCase()] || statusMap.active;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
        {statusInfo.icon}
        {status}
      </span>
    );
  };

  const getPolicyIcon = (policyType: string) => {
    const lowerType = policyType.toLowerCase();
    if (lowerType.includes('life')) return Heart;
    if (lowerType.includes('health')) return Activity;
    return Shield;
  };

  const calculateDaysToRenewal = (expiryDate: string | null) => {
    if (!expiryDate) return null;
    const expiry = new Date(expiryDate);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const filteredPolicies = policies.filter(policy => {
    const matchesSearch = policy.policy_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         policy.policy_number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || policy.policy_type === filterType;
    const matchesStatus = filterStatus === 'All' || policy.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const totalCoverage = policies.reduce((sum, p) => sum + (p.coverage_amount || 0), 0);
  const activePolicies = policies.filter(p => p.status === 'active').length;
  const totalMonthlyPremium = policies
    .filter(p => p.status === 'active')
    .reduce((sum, p) => {
      return sum + (p.monthly_premium || 0);
    }, 0);

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
          {policies.length > 0 && (
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors inline-flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          )}
          <Link
            to="/browse-policies"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Browse Policies</span>
          </Link>
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
                {formatCurrency(totalCoverage)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {activePolicies} active {activePolicies === 1 ? 'policy' : 'policies'}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Monthly Premium</p>
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(totalMonthlyPremium)}
              </p>
              <p className="text-xs text-gray-500 mt-1">per month</p>
            </div>

            {!mlLoading && mlPrediction && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600">Risk Score</p>
                  <Target className="w-5 h-5 text-orange-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {mlPrediction.risk_category}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {Math.round(mlPrediction.risk_confidence * 100)}% confidence
                </p>
              </div>
            )}
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
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-6">
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
                    to="/dashboard/ml-recommendations"
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <span>View Recommendations</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {policies.length === 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Policies Yet</h3>
              <p className="text-gray-600 mb-6">
                You haven't added any insurance policies yet. Get personalized recommendations based on your profile.
              </p>
              <div className="flex items-center justify-center space-x-4">
                <Link
                  to="/browse-policies"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
                >
                  <Shield className="w-5 h-5" />
                  <span>Browse Policies</span>
                </Link>
             
              </div>
            </div>
          )}

          {policies.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Your Policies</h2>
                <div className="flex items-center space-x-3">
                  <div className="flex-1 max-w-md">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Search policies..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="All">All Types</option>
                    <option value="Life Insurance">Life Insurance</option>
                    <option value="Health Insurance">Health Insurance</option>
                    <option value="Disability Insurance">Disability</option>
                  </select>

                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="All">All Status</option>
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="expired">Expired</option>
                  </select>

                  <div className="flex items-center space-x-1 border border-gray-300 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('card')}
                      className={`p-2 rounded ${viewMode === 'card' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('table')}
                      className={`p-2 rounded ${viewMode === 'table' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {filteredPolicies.length === 0 ? (
                <div className="text-center py-12">
                  <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No policies found</h3>
                  <p className="text-gray-600">Try adjusting your search or filters</p>
                </div>
              ) : viewMode === 'card' ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredPolicies.map((policy) => {
                    const Icon = getPolicyIcon(policy.policy_type);
                    const daysToRenewal = calculateDaysToRenewal(policy.expiry_date);

                    return (
                      <div key={policy.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <Icon className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{policy.policy_type}</h3>
                              <p className="text-sm text-gray-500">{policy.policy_number}</p>
                            </div>
                          </div>
                          {getStatusBadge(policy.status)}
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Coverage</p>
                            <p className="text-lg font-semibold text-gray-900">
                              {policy.coverage_amount ? formatCurrency(policy.coverage_amount) : 'N/A'}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Premium</p>
                            <p className="text-lg font-semibold text-gray-900">
                              {formatCurrency(policy.annual_premium || 0)}
                              <span className="text-sm text-gray-500">/year</span>
                            </p>
                          </div>
                        </div>

                        {daysToRenewal !== null && daysToRenewal > 0 && (
                          <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                            <p className="text-sm text-orange-800">
                              <Calendar className="w-4 h-4 inline mr-1" />
                              Renews in {daysToRenewal} days
                            </p>
                          </div>
                        )}

                        <div className="flex items-center space-x-2 pt-4 border-t border-gray-200">
                          <Link
                            to={`/dashboard/policies/${policy.id}`}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center inline-flex items-center justify-center space-x-2"
                          >
                            <Eye className="w-4 h-4" />
                            <span>View Details</span>
                          </Link>
                          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                            <Phone className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Policy</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coverage</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Premium</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Renewal</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredPolicies.map((policy) => {
                        const Icon = getPolicyIcon(policy.policy_type);
                        const daysToRenewal = calculateDaysToRenewal(policy.expiry_date);

                        return (
                          <tr key={policy.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <Icon className="w-5 h-5 text-blue-600 mr-3" />
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{policy.policy_type}</div>
                                  <div className="text-sm text-gray-500">{policy.policy_number}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {getStatusBadge(policy.status)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {policy.coverage_amount ? formatCurrency(policy.coverage_amount) : 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatCurrency(policy.annual_premium || 0)}
                              <span className="text-gray-500">/year</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {daysToRenewal !== null && daysToRenewal > 0 ? `${daysToRenewal} days` : 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <Link
                                to={`/dashboard/policies/${policy.id}`}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                View
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
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
          {/* AI-Powered Product Recommendations */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Brain className="w-5 h-5" />
                <h3 className="font-semibold">Recommended For You</h3>
              </div>
              <Link
                to="/browse-policies"
                className="p-2 hover:bg-blue-400 rounded-lg transition-colors"
              >
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <p className="text-sm opacity-90 mb-4">
              {mlPrediction ?
                `Based on your ${mlPrediction.risk_category.toLowerCase()} risk profile`
                : 'Popular insurance products'}
            </p>

            {/* Product Carousel */}
            <div className="space-y-3">
              {(() => {
                const riskCategory = mlPrediction?.risk_category || 'Medium';
                const recommendations = [];

                if (riskCategory === 'High') {
                  // High risk - comprehensive coverage
                  recommendations.push(
                    { icon: Heart, name: 'Critical Illness Insurance', desc: 'Comprehensive health protection', color: 'bg-red-500' },
                    { icon: Shield, name: 'Life Insurance', desc: 'Secure your family\'s future', color: 'bg-blue-500' },
                    { icon: Activity, name: 'Accident Cover', desc: 'Protection against unforeseen events', color: 'bg-orange-500' }
                  );
                } else if (riskCategory === 'Medium') {
                  // Medium risk - balanced coverage
                  recommendations.push(
                    { icon: Heart, name: 'Health Insurance', desc: 'Medical coverage for peace of mind', color: 'bg-green-500' },
                    { icon: Shield, name: 'Term Life Insurance', desc: 'Affordable family protection', color: 'bg-blue-500' },
                    { icon: Activity, name: 'Personal Accident', desc: 'Extra safety net for daily life', color: 'bg-orange-500' }
                  );
                } else {
                  // Low risk - essential coverage
                  recommendations.push(
                    { icon: Shield, name: 'Term Life Insurance', desc: 'Essential family protection', color: 'bg-blue-500' },
                    { icon: Heart, name: 'Basic Health Cover', desc: 'Affordable medical insurance', color: 'bg-green-500' },
                    { icon: DollarSign, name: 'Investment Plans', desc: 'Grow your wealth safely', color: 'bg-teal-500' }
                  );
                }

                return recommendations.map((product, index) => {
                  const Icon = product.icon;
                  return (
                    <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-all cursor-pointer group">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 ${product.color} rounded-lg`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-sm">{product.name}</p>
                          <p className="text-xs opacity-75">{product.desc}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  );
                });
              })()}
            </div>

            <Link
              to="/browse-policies"
              className="mt-4 w-full inline-flex items-center justify-center px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium text-sm"
            >
              <span>View All Products</span>
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>

            <div className="space-y-3">
              <Link
                to="/dashboard/ml-recommendations"
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
                to="/browse-policies"
                className="flex items-center justify-between p-3 bg-teal-50 rounded-lg hover:bg-teal-100 transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <Target className="w-5 h-5 text-teal-600" />
                  <span className="text-gray-900 font-medium">Browse Policies</span>
                </div>
                <ArrowRight className="w-4 h-4 text-teal-600 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {!mlLoading && mlPrediction && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">ML Risk Assessment</h3>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Risk Category</p>
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          mlPrediction.risk_category === 'Low' ? 'bg-green-500' :
                          mlPrediction.risk_category === 'Medium' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${mlPrediction.risk_category === 'Low' ? 33 : mlPrediction.risk_category === 'Medium' ? 66 : 100}%` }}
                      />
                    </div>
                    <span className="text-lg font-bold text-gray-900">
                      {mlPrediction.risk_category}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Premium Estimate</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(mlPrediction.monthly_premium_estimate || 0)}
                    <span className="text-sm text-gray-600">/month</span>
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Confidence</p>
                  <p className="text-lg font-bold text-gray-900">
                    {Math.round(mlPrediction.risk_confidence * 100)}%
                  </p>
                </div>

                <Link
                  to="/dashboard/ml-recommendations"
                  className="block w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center"
                >
                  View ML Recommendations
                </Link>
              </div>
            </div>
          )}

          {policies.length > 0 && (
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-sm border border-green-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Coverage Protection</h3>
                <Shield className="w-5 h-5 text-green-600" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Insurance Score</span>
                  <span className="text-lg font-bold text-green-700">
                    {Math.min(100, Math.round((activePolicies / 3) * 100))}%
                  </span>
                </div>
                <div className="w-full bg-green-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full"
                    style={{ width: `${Math.min(100, Math.round((activePolicies / 3) * 100))}%` }}
                  />
                </div>
                <p className="text-xs text-gray-600">
                  You have {activePolicies} active {activePolicies === 1 ? 'policy' : 'policies'}.
                  {activePolicies < 3 && ' Consider adding more coverage for complete protection.'}
                </p>
              </div>
            </div>
          )}

          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl shadow-sm border border-blue-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-600 rounded-lg">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900">Financial Wellness</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Total Premiums</span>
                <span className="text-lg font-bold text-blue-900">
                  {formatCurrency(totalMonthlyPremium * 12)}/year
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Total Coverage</span>
                <span className="text-lg font-bold text-blue-900">
                  {formatCurrency(totalCoverage)}
                </span>
              </div>
              <div className="pt-3 border-t border-blue-200">
                <p className="text-xs text-gray-600">
                  Your insurance investment protects {formatCurrency(totalCoverage)} in assets
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
