import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Target, TrendingDown, AlertTriangle, CheckCircle, 
  Heart, Activity, Shield, Brain, Calendar, ArrowRight,
  RefreshCw, Download
} from 'lucide-react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
         AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

const RiskDashboardPage: React.FC = () => {
  const [timeframe, setTimeframe] = useState('12months');

  // Mock data for risk tracking
  const riskTrendData = [
    { month: 'Jan', overall: 45, health: 40, lifestyle: 35, financial: 50 },
    { month: 'Feb', overall: 42, health: 38, lifestyle: 32, financial: 48 },
    { month: 'Mar', overall: 38, health: 35, lifestyle: 30, financial: 45 },
    { month: 'Apr', overall: 35, health: 32, lifestyle: 28, financial: 42 },
    { month: 'May', overall: 32, health: 30, lifestyle: 25, financial: 40 },
    { month: 'Jun', overall: 28, health: 28, lifestyle: 22, financial: 38 },
    { month: 'Jul', overall: 26, health: 26, lifestyle: 20, financial: 36 },
    { month: 'Aug', overall: 24, health: 25, lifestyle: 18, financial: 34 },
    { month: 'Sep', overall: 22, health: 23, lifestyle: 16, financial: 32 },
    { month: 'Oct', overall: 21, health: 22, lifestyle: 15, financial: 31 },
    { month: 'Nov', overall: 20, health: 21, lifestyle: 14, financial: 30 },
    { month: 'Dec', overall: 19, health: 20, lifestyle: 13, financial: 29 }
  ];

  const radarData = [
    { subject: 'Health', current: 85, benchmark: 70, maxValue: 100 },
    { subject: 'Lifestyle', current: 90, benchmark: 75, maxValue: 100 },
    { subject: 'Financial', current: 78, benchmark: 65, maxValue: 100 },
    { subject: 'Demographics', current: 82, benchmark: 80, maxValue: 100 },
    { subject: 'Environment', current: 88, benchmark: 75, maxValue: 100 },
    { subject: 'Genetics', current: 72, benchmark: 70, maxValue: 100 }
  ];

  const riskFactors = [
    {
      category: 'Health Metrics',
      icon: Heart,
      riskLevel: 'low',
      score: 85,
      trend: 'improving',
      factors: [
        { name: 'BMI', value: '24.2', status: 'good', target: '18.5-24.9' },
        { name: 'Blood Pressure', value: '118/76', status: 'excellent', target: '<120/80' },
        { name: 'Cholesterol', value: '165 mg/dL', status: 'good', target: '<200' },
        { name: 'Resting Heart Rate', value: '62 bpm', status: 'excellent', target: '60-100' }
      ],
      recommendations: [
        'Continue current exercise routine',
        'Maintain healthy diet',
        'Schedule annual check-up'
      ]
    },
    {
      category: 'Lifestyle Factors',
      icon: Activity,
      riskLevel: 'low',
      score: 92,
      trend: 'stable',
      factors: [
        { name: 'Exercise Frequency', value: '5x/week', status: 'excellent', target: '3-5x/week' },
        { name: 'Sleep Quality', value: '8.2 hrs', status: 'excellent', target: '7-9 hrs' },
        { name: 'Smoking Status', value: 'Never', status: 'excellent', target: 'Never' },
        { name: 'Alcohol Consumption', value: '2 drinks/week', status: 'good', target: '<14/week' }
      ],
      recommendations: [
        'Excellent lifestyle habits',
        'Consider stress management techniques',
        'Maintain current routine'
      ]
    },
    {
      category: 'Financial Stability',
      icon: Shield,
      riskLevel: 'medium',
      score: 76,
      trend: 'improving',
      factors: [
        { name: 'Debt-to-Income', value: '28%', status: 'good', target: '<30%' },
        { name: 'Emergency Fund', value: '4 months', status: 'good', target: '6+ months' },
        { name: 'Credit Score', value: '785', status: 'excellent', target: '>740' },
        { name: 'Insurance Coverage', value: '80%', status: 'good', target: '100%' }
      ],
      recommendations: [
        'Build emergency fund to 6 months',
        'Consider increasing life insurance coverage',
        'Maintain excellent credit habits'
      ]
    }
  ];

  const riskAlerts = [
    {
      type: 'warning',
      title: 'Family History Update Required',
      message: 'New genetic risk factors detected. Please update your family medical history.',
      action: 'Update Profile',
      priority: 'medium',
      daysAgo: 2
    },
    {
      type: 'info',
      title: 'Upcoming Health Assessment',
      message: 'Your annual health assessment is due in 15 days.',
      action: 'Schedule Now',
      priority: 'low',
      daysAgo: 1
    },
    {
      type: 'success',
      title: 'Risk Score Improvement',
      message: 'Your overall risk score improved by 3 points this month!',
      action: 'View Details',
      priority: 'low',
      daysAgo: 5
    }
  ];

  const preventiveActions = [
    {
      category: 'Health Monitoring',
      actions: [
        { task: 'Annual Physical Exam', dueDate: '2025-11-15', status: 'scheduled' },
        { task: 'Dental Cleaning', dueDate: '2025-10-30', status: 'due' },
        { task: 'Vision Check', dueDate: '2025-12-01', status: 'upcoming' },
        { task: 'Blood Work Panel', dueDate: '2026-01-15', status: 'future' }
      ]
    },
    {
      category: 'Financial Reviews',
      actions: [
        { task: 'Insurance Coverage Review', dueDate: '2025-10-01', status: 'overdue' },
        { task: 'Emergency Fund Assessment', dueDate: '2025-11-01', status: 'due' },
        { task: 'Investment Portfolio Review', dueDate: '2025-12-15', status: 'upcoming' },
        { task: 'Estate Planning Update', dueDate: '2026-03-01', status: 'future' }
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-50';
      case 'good': return 'text-blue-600 bg-blue-50';
      case 'fair': return 'text-yellow-600 bg-yellow-50';
      case 'poor': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getActionStatusColor = (status: string) => {
    switch (status) {
      case 'overdue': return 'text-red-600 bg-red-50';
      case 'due': return 'text-orange-600 bg-orange-50';
      case 'scheduled': return 'text-green-600 bg-green-50';
      case 'upcoming': return 'text-blue-600 bg-blue-50';
      case 'future': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Risk Monitoring Dashboard</h1>
          <p className="text-gray-600 mt-1">Track and manage your risk factors in real-time</p>
        </div>
        <div className="flex space-x-3">
          <select 
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="12months">Last 12 Months</option>
            <option value="24months">Last 24 Months</option>
          </select>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <RefreshCw className="w-4 h-4" />
            <span>Refresh Data</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Current Risk Score Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6 h-full">
            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-4 relative">
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#E5E7EB"
                    strokeWidth="6"
                    fill="none"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#10B981"
                    strokeWidth="6"
                    fill="none"
                    strokeDasharray={`${(19 / 100) * 251.2} 251.2`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-3xl font-bold text-gray-900">19</span>
                    <p className="text-xs text-gray-600">Risk Score</p>
                  </div>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Overall Risk</h3>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                <Target className="w-4 h-4 mr-1" />
                Low Risk
              </span>
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">vs Last Month:</span>
                  <span className="text-green-600 font-medium flex items-center">
                    <TrendingDown className="w-3 h-3 mr-1" />
                    -1 point
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">vs Peers:</span>
                  <span className="text-green-600 font-medium">Top 15%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Score Trend</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={riskTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="overall" 
                    stroke="#3B82F6" 
                    fill="#3B82F6"
                    fillOpacity={0.2}
                    strokeWidth={3}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="health" 
                    stroke="#10B981" 
                    fill="#10B981"
                    fillOpacity={0.1}
                    strokeWidth={2}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="lifestyle" 
                    stroke="#8B5CF6" 
                    fill="#8B5CF6"
                    fillOpacity={0.1}
                    strokeWidth={2}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="financial" 
                    stroke="#F59E0B" 
                    fill="#F59E0B"
                    fillOpacity={0.1}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center space-x-6 mt-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Overall</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Health</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Lifestyle</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Financial</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Factors Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Risk Categories */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900">Risk Factor Analysis</h2>
          {riskFactors.map((category, index) => (
            <div key={index} className={`border-2 rounded-xl p-6 ${getRiskColor(category.riskLevel)}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white rounded-lg">
                    <category.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{category.category}</h3>
                    <p className="text-sm text-gray-600 capitalize">{category.riskLevel} risk level</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold">{category.score}</span>
                  <p className="text-sm text-gray-600">Score</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                {category.factors.map((factor, idx) => (
                  <div key={idx} className="bg-white rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">{factor.name}</span>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(factor.status)}`}>
                        {factor.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{factor.value}</p>
                    <p className="text-xs text-gray-500 mt-1">Target: {factor.target}</p>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-lg p-3">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Recommendations:</h4>
                <ul className="space-y-1">
                  {category.recommendations.map((rec, idx) => (
                    <li key={idx} className="text-sm text-gray-600 flex items-start">
                      <CheckCircle className="w-3 h-3 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Risk Profile Radar Chart & Alerts */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Profile Comparison</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tickCount={5} />
                  <Radar 
                    name="Your Score" 
                    dataKey="current" 
                    stroke="#3B82F6" 
                    fill="#3B82F6" 
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                  <Radar 
                    name="Benchmark" 
                    dataKey="benchmark" 
                    stroke="#E5E7EB" 
                    fill="#E5E7EB" 
                    fillOpacity={0.1}
                    strokeWidth={1}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center space-x-6 mt-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Your Score</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                <span className="text-sm text-gray-600">Industry Benchmark</span>
              </div>
            </div>
          </div>

          {/* Risk Alerts */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Alerts</h3>
            <div className="space-y-4">
              {riskAlerts.map((alert, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className={`p-1 rounded-full ${
                      alert.type === 'warning' ? 'bg-yellow-100' :
                      alert.type === 'info' ? 'bg-blue-100' :
                      'bg-green-100'
                    }`}>
                      {alert.type === 'warning' && <AlertTriangle className="w-4 h-4 text-yellow-600" />}
                      {alert.type === 'info' && <Calendar className="w-4 h-4 text-blue-600" />}
                      {alert.type === 'success' && <CheckCircle className="w-4 h-4 text-green-600" />}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{alert.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">{alert.daysAgo} days ago</span>
                        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                          {alert.action} →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Preventive Actions */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Preventive Action Plan</h2>
          <Link 
            to="/dashboard/health"
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium"
          >
            <span>Manage Health Tracking</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {preventiveActions.map((category, index) => (
            <div key={index}>
              <h3 className="font-semibold text-gray-900 mb-4">{category.category}</h3>
              <div className="space-y-3">
                {category.actions.map((action, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{action.task}</h4>
                      <p className="text-sm text-gray-600">Due: {action.dueDate}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getActionStatusColor(action.status)}`}>
                      {action.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Risk Management Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/dashboard/assessment/new"
            className="flex items-center space-x-3 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="p-2 bg-blue-100 rounded-lg">
              <Brain className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">New Risk Assessment</h3>
              <p className="text-sm text-gray-600">Update your risk profile</p>
            </div>
          </Link>

          <Link
            to="/dashboard/health"
            className="flex items-center space-x-3 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="p-2 bg-green-100 rounded-lg">
              <Heart className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Health Tracking</h3>
              <p className="text-sm text-gray-600">Monitor health metrics</p>
            </div>
          </Link>

          <Link
            to="/dashboard/policies"
            className="flex items-center space-x-3 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="p-2 bg-purple-100 rounded-lg">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Review Coverage</h3>
              <p className="text-sm text-gray-600">Optimize your policies</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RiskDashboardPage;
