import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, DollarSign, CreditCard, Target, Brain, 
  Upload, Heart, Calendar, Plus,
  ArrowRight, Bell, Sun, AlertCircle, Loader
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAuth } from '../../hooks/useAuth.mock';
import DashboardService, { type DashboardStats } from '../../lib/dashboardService';

const DashboardHome: React.FC = () => {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [dashboardData, setDashboardData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await DashboardService.getUserDashboardData(user?.id || 'demo-user');
        setDashboardData(data);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user?.id]);

  // Loading state
  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load Dashboard</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData) return null;

  // Generate risk trend data from recent activity
  const riskTrendData = [
    { month: 'Jan', score: dashboardData.riskScore + 15 },
    { month: 'Feb', score: dashboardData.riskScore + 12 },
    { month: 'Mar', score: dashboardData.riskScore + 8 },
    { month: 'Apr', score: dashboardData.riskScore + 5 },
    { month: 'May', score: dashboardData.riskScore + 2 },
    { month: 'Jun', score: dashboardData.riskScore },
  ];

  // Generate coverage data based on real policies
  const coverageData = [
    { name: 'Life Insurance', value: dashboardData.totalPremium * 0.6, color: '#3B82F6' },
    { name: 'Health Insurance', value: dashboardData.totalPremium * 0.25, color: '#10B981' },
    { name: 'Disability', value: dashboardData.totalPremium * 0.1, color: '#F59E0B' },
    { name: 'Other', value: dashboardData.totalPremium * 0.05, color: '#8B5CF6' },
  ];

  const quickActions = [
    {
      title: 'Start New Assessment',
      description: 'Get updated risk analysis and quotes',
      icon: Plus,
      background: 'bg-blue-500',
      link: '/dashboard/assessment/new',
      estimatedTime: '5-10 minutes'
    },
    {
      title: 'Upload Documents',
      description: 'Add medical records or financial documents',
      icon: Upload,
      background: 'bg-green-500',
      link: '/dashboard/documents',
      estimatedTime: '2-5 minutes'
    },
    {
      title: 'Schedule Consultation',
      description: 'Book a call with an insurance expert',
      icon: Calendar,
      background: 'bg-purple-500',
      link: '/dashboard/messages',
      estimatedTime: '30-60 minutes'
    },
    {
      title: 'Make Payment',
      description: 'Pay premiums or manage billing',
      icon: CreditCard,
      background: 'bg-orange-500',
      link: '/dashboard/payments',
      estimatedTime: '1-2 minutes'
    }
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}! 👋
            </h1>
            <p className="text-blue-100 text-lg">Here's your insurance overview for today</p>
            <div className="flex items-center space-x-4 mt-4 text-blue-100">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>{currentTime.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Sun className="w-4 h-4" />
                <span>72°F, Sunny</span>
              </div>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="w-32 h-32 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Shield className="w-16 h-16 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link to="/dashboard/policies" className="group">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white transform transition-all duration-200 hover:scale-105 hover:shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <Shield className="w-8 h-8" />
              <div className="text-right">
                <div className="text-2xl font-bold">{dashboardData.activePolicies}</div>
                <div className="text-blue-100 text-sm">
                  {dashboardData.totalPolicies} total policies
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold">Active Policies</h3>
              <p className="text-blue-100 text-sm">View all policies</p>
            </div>
          </div>
        </Link>

        <Link to="/dashboard/financial" className="group">
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white transform transition-all duration-200 hover:scale-105 hover:shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="w-8 h-8" />
              <div className="text-right">
                <div className="text-2xl font-bold">
                  ${(dashboardData.totalPremium / 1000).toFixed(0)}K
                </div>
                <div className="text-green-100 text-sm">Total coverage</div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold">Total Coverage</h3>
              <p className="text-green-100 text-sm">Manage coverage</p>
            </div>
          </div>
        </Link>

        <Link to="/dashboard/payments" className="group">
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white transform transition-all duration-200 hover:scale-105 hover:shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <CreditCard className="w-8 h-8" />
              <div className="text-right">
                <div className="text-2xl font-bold">
                  ${dashboardData.monthlyPremium.toFixed(0)}
                </div>
                <div className="text-purple-100 text-sm">Monthly premium</div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold">Monthly Premium</h3>
              <p className="text-purple-100 text-sm">View payments</p>
            </div>
          </div>
        </Link>

        <Link to="/dashboard/risk" className="group">
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white transform transition-all duration-200 hover:scale-105 hover:shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <Target className="w-8 h-8" />
              <div className="text-right">
                <div className="text-2xl font-bold">{dashboardData.riskScore}</div>
                <div className="text-orange-100 text-sm">
                  {dashboardData.riskScore < 30 ? 'Low Risk' : 
                   dashboardData.riskScore < 60 ? 'Medium Risk' : 'High Risk'}
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold">Risk Score</h3>
              <p className="text-orange-100 text-sm">View details</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-8">
          {/* Recent Activity Feed */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
              <Bell className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {dashboardData.recentActivity.length > 0 ? (
                dashboardData.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className={`p-2 rounded-lg ${
                      activity.type === 'policy' ? 'text-blue-600 bg-blue-50' :
                      activity.type === 'claim' ? 'text-green-600 bg-green-50' :
                      activity.type === 'payment' ? 'text-purple-600 bg-purple-50' :
                      activity.type === 'assessment' ? 'text-orange-600 bg-orange-50' :
                      'text-gray-600 bg-gray-50'
                    }`}>
                      {activity.type === 'policy' && <Shield className="w-5 h-5" />}
                      {activity.type === 'claim' && <DollarSign className="w-5 h-5" />}
                      {activity.type === 'payment' && <CreditCard className="w-5 h-5" />}
                      {activity.type === 'assessment' && <Target className="w-5 h-5" />}
                      {activity.type === 'health' && <Heart className="w-5 h-5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900">{activity.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">
                          {new Date(activity.date).toLocaleDateString()}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          activity.status === 'completed' ? 'bg-green-100 text-green-800' :
                          activity.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          activity.status === 'failed' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {activity.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-4">
                    <Bell className="w-12 h-12 mx-auto" />
                  </div>
                  <p className="text-gray-500">No recent activity to display</p>
                  <Link 
                    to="/dashboard/assessment/new" 
                    className="inline-block mt-2 text-blue-600 hover:text-blue-800"
                  >
                    Start your first assessment →
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">AI-Powered Recommendations</h2>
              <Brain className="w-5 h-5 text-purple-600" />
            </div>
            <div className="space-y-4">
              {dashboardData.insights.length > 0 ? (
                dashboardData.insights.map((insight, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg ${
                        insight.priority === 'high' ? 'bg-red-50 text-red-600' :
                        insight.priority === 'medium' ? 'bg-yellow-50 text-yellow-600' :
                        'bg-green-50 text-green-600'
                      }`}>
                        {insight.type === 'risk_alert' && <Target className="w-5 h-5" />}
                        {insight.type === 'savings_opportunity' && <DollarSign className="w-5 h-5" />}
                        {insight.type === 'health_improvement' && <Heart className="w-5 h-5" />}
                        {insight.type === 'policy_recommendation' && <Shield className="w-5 h-5" />}
                        {!['risk_alert', 'savings_opportunity', 'health_improvement', 'policy_recommendation'].includes(insight.type) && <Brain className="w-5 h-5" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-gray-900">{insight.title}</h3>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            insight.priority === 'high' ? 'bg-red-100 text-red-600' :
                            insight.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                            'bg-green-100 text-green-600'
                          }`}>
                            {insight.priority} priority
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm text-blue-600 hover:text-blue-800 font-medium cursor-pointer">
                            {insight.action} <ArrowRight className="w-3 h-3 inline ml-1" />
                          </span>
                          {insight.estimatedImpact && (
                            <span className="text-xs text-gray-500">
                              Est. savings: ${insight.estimatedImpact.toFixed(0)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-4">
                    <Brain className="w-12 h-12 mx-auto" />
                  </div>
                  <p className="text-gray-500">No AI insights available yet</p>
                  <p className="text-sm text-gray-400 mt-1">Complete an assessment to get personalized recommendations</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Interactive Charts */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Risk Score Trend</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={riskTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              Your risk score has improved by {riskTrendData[0].score - dashboardData.riskScore} points over the last 6 months
            </p>
          </div>

          {/* Coverage Distribution */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Coverage Distribution</h2>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={coverageData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {coverageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {coverageData.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Payments */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Upcoming Payments</h2>
            <div className="space-y-4">
              {dashboardData.upcomingPayments.length > 0 ? (
                dashboardData.upcomingPayments.map((payment, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 border border-gray-200 rounded-lg">
                    <div className="flex-shrink-0">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        payment.status === 'overdue' ? 'bg-red-50' : 'bg-blue-50'
                      }`}>
                        <CreditCard className={`w-6 h-6 ${
                          payment.status === 'overdue' ? 'text-red-600' : 'text-blue-600'
                        }`} />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900">
                        Payment Due - Policy {payment.policyNumber}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Premium payment of ${payment.amount.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Due: {new Date(payment.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                    <Link
                      to="/dashboard/payments"
                      className={`text-sm font-medium px-3 py-1 rounded ${
                        payment.status === 'overdue' 
                          ? 'text-red-600 bg-red-50 hover:bg-red-100' 
                          : 'text-blue-600 bg-blue-50 hover:bg-blue-100'
                      }`}
                    >
                      Pay Now
                    </Link>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-4">
                    <Calendar className="w-12 h-12 mx-auto" />
                  </div>
                  <p className="text-gray-500">No upcoming payments</p>
                  <p className="text-sm text-gray-400 mt-1">All payments are up to date</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.link}
              className="group p-6 border border-gray-200 rounded-xl hover:shadow-lg transition-all duration-200 hover:border-blue-300"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className={`p-3 rounded-lg ${action.background} text-white group-hover:scale-110 transition-transform`}>
                  <action.icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                  <p className="text-xs text-gray-500 mt-2">⏱️ {action.estimatedTime}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
