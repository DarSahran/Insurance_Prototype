import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, DollarSign, CreditCard, Target, RefreshCw, Brain, 
  Upload, TrendingUp, Heart, Zap, Calendar, Plus, CheckCircle,
  ArrowRight, Activity, Bell, Sun, Cloud
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { useAuth } from '../../hooks/useAuth';

const DashboardHome: React.FC = () => {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [wellnessScore, setWellnessScore] = useState(78);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Mock data for charts
  const riskTrendData = [
    { month: 'Jan', score: 45 },
    { month: 'Feb', score: 42 },
    { month: 'Mar', score: 38 },
    { month: 'Apr', score: 35 },
    { month: 'May', score: 32 },
    { month: 'Jun', score: 28 },
  ];

  const coverageData = [
    { name: 'Life Insurance', value: 500000, color: '#3B82F6' },
    { name: 'Health Insurance', value: 250000, color: '#10B981' },
    { name: 'Disability', value: 100000, color: '#F59E0B' },
    { name: 'Other', value: 50000, color: '#8B5CF6' },
  ];

  const savingsData = [
    { name: 'Traditional', value: 245, color: '#EF4444' },
    { name: 'AI-Optimized', value: 156, color: '#10B981' },
  ];

  const recentActivities = [
    {
      type: 'policy_renewal',
      icon: RefreshCw,
      title: 'Policy Renewal Reminder',
      description: 'Your life insurance policy expires in 30 days',
      timestamp: '2 hours ago',
      action: 'Review Policy',
      link: '/dashboard/policies/12345',
      color: 'text-blue-600 bg-blue-50'
    },
    {
      type: 'ai_insight',
      icon: Brain,
      title: 'New AI Insight Available',
      description: 'Your risk score improved due to recent health improvements',
      timestamp: '1 day ago',
      action: 'View Insights',
      link: '/dashboard/ai-insights',
      color: 'text-purple-600 bg-purple-50'
    },
    {
      type: 'payment',
      icon: CreditCard,
      title: 'Payment Processed',
      description: '$245 premium payment successful',
      timestamp: '3 days ago',
      action: 'View Receipt',
      link: '/dashboard/payments',
      color: 'text-green-600 bg-green-50'
    },
    {
      type: 'document',
      icon: Upload,
      title: 'Document Uploaded',
      description: 'Medical records processed successfully',
      timestamp: '1 week ago',
      action: 'View Documents',
      link: '/dashboard/documents',
      color: 'text-orange-600 bg-orange-50'
    }
  ];

  const aiRecommendations = [
    {
      type: 'coverage_optimization',
      icon: TrendingUp,
      title: 'Optimize Your Coverage',
      description: 'Based on your recent life changes, consider increasing coverage by $50K',
      confidence: '94%',
      action: 'Calculate Coverage',
      link: '/dashboard/financial',
      priority: 'high'
    },
    {
      type: 'premium_reduction',
      icon: DollarSign,
      title: 'Potential Savings Detected',
      description: 'Your improved health metrics could reduce premiums by 15%',
      confidence: '87%',
      action: 'Start Reassessment',
      link: '/dashboard/assessment/new',
      priority: 'medium'
    },
    {
      type: 'health_improvement',
      icon: Heart,
      title: 'Health Goal Achievement',
      description: 'Congratulations on reaching your fitness goals! This may impact your rates',
      confidence: '92%',
      action: 'Update Health Info',
      link: '/dashboard/health',
      priority: 'medium'
    }
  ];

  const upcomingEvents = [
    {
      type: 'policy_renewal',
      date: '2025-10-15',
      title: 'Life Insurance Renewal',
      description: 'Review and renew your policy',
      action: 'Review Now'
    },
    {
      type: 'health_checkup',
      date: '2025-10-30',
      title: 'Annual Health Assessment',
      description: 'Complete your yearly health review',
      action: 'Schedule Now'
    },
    {
      type: 'payment_due',
      date: '2025-11-01',
      title: 'Premium Payment Due',
      description: 'Monthly premium payment of $245',
      action: 'Pay Now'
    }
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
              Welcome back, {user?.user_metadata?.full_name || user?.email?.split('@')[0]}! 👋
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
                <div className="text-2xl font-bold">3</div>
                <div className="text-blue-100 text-sm">+5.2% from last month</div>
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
                <div className="text-2xl font-bold">$900K</div>
                <div className="text-green-100 text-sm">+12.1% increase</div>
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
                <div className="text-2xl font-bold">$156</div>
                <div className="text-purple-100 text-sm">-8.3% saved</div>
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
                <div className="text-2xl font-bold">28</div>
                <div className="text-orange-100 text-sm">Improved from last assessment</div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold">Risk Score</h3>
              <p className="text-orange-100 text-sm">Low Risk Category</p>
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
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className={`p-2 rounded-lg ${activity.color}`}>
                    <activity.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900">{activity.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">{activity.timestamp}</span>
                      <Link 
                        to={activity.link}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        {activity.action} →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">AI-Powered Recommendations</h2>
              <Brain className="w-5 h-5 text-purple-600" />
            </div>
            <div className="space-y-4">
              {aiRecommendations.map((rec, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${
                      rec.priority === 'high' ? 'bg-red-50 text-red-600' :
                      rec.priority === 'medium' ? 'bg-yellow-50 text-yellow-600' :
                      'bg-green-50 text-green-600'
                    }`}>
                      <rec.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900">{rec.title}</h3>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                          {rec.confidence} confidence
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                      <Link 
                        to={rec.link}
                        className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium mt-2"
                      >
                        {rec.action} <ArrowRight className="w-3 h-3 ml-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
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
              Your risk score has improved by 17 points over the last 6 months
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
                  <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
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

          {/* Upcoming Events */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Upcoming Events & Reminders</h2>
            <div className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 border border-gray-200 rounded-lg">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900">{event.title}</h3>
                    <p className="text-sm text-gray-600">{event.description}</p>
                    <p className="text-xs text-gray-500 mt-1">{event.date}</p>
                  </div>
                  <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                    {event.action}
                  </button>
                </div>
              ))}
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