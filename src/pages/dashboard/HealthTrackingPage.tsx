import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, Activity, Brain, Target, TrendingUp, Plus, 
  Calendar, AlertTriangle, CheckCircle,
  Smartphone, Watch, Upload, Download
} from 'lucide-react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
         BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

const HealthTrackingPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30days');

  // Mock health data
  const healthMetrics = {
    overview: {
      score: 85,
      trend: '+5 points this month',
      status: 'Excellent'
    },
    vitals: [
      { name: 'Heart Rate', value: '68 bpm', status: 'good', target: '60-100 bpm', trend: 'stable' },
      { name: 'Blood Pressure', value: '118/76', status: 'excellent', target: '<120/80', trend: 'improving' },
      { name: 'BMI', value: '23.8', status: 'good', target: '18.5-24.9', trend: 'stable' },
      { name: 'Body Fat %', value: '15.2%', status: 'excellent', target: '10-20%', trend: 'improving' }
    ]
  };

  const heartRateData = [
    { time: '6:00', rate: 62 },
    { time: '8:00', rate: 75 },
    { time: '10:00', rate: 68 },
    { time: '12:00', rate: 72 },
    { time: '14:00', rate: 85 },
    { time: '16:00', rate: 90 },
    { time: '18:00', rate: 78 },
    { time: '20:00', rate: 65 },
    { time: '22:00', rate: 60 }
  ];

  const sleepData = [
    { date: 'Mon', deep: 2.5, light: 4.2, rem: 1.8, total: 8.5 },
    { date: 'Tue', deep: 2.8, light: 4.0, rem: 2.0, total: 8.8 },
    { date: 'Wed', deep: 2.2, light: 4.5, rem: 1.5, total: 8.2 },
    { date: 'Thu', deep: 2.6, light: 4.1, rem: 1.9, total: 8.6 },
    { date: 'Fri', deep: 2.4, light: 4.3, rem: 1.7, total: 8.4 },
    { date: 'Sat', deep: 3.0, light: 4.8, rem: 2.2, total: 10.0 },
    { date: 'Sun', deep: 2.9, light: 4.6, rem: 2.1, total: 9.6 }
  ];

  const activityData = [
    { name: 'Walking', value: 45, color: '#3B82F6' },
    { name: 'Running', value: 25, color: '#10B981' },
    { name: 'Cycling', value: 15, color: '#F59E0B' },
    { name: 'Strength', value: 15, color: '#8B5CF6' }
  ];

  const goals = [
    {
      id: 1,
      title: 'Daily Steps Goal',
      target: 10000,
      current: 8542,
      unit: 'steps',
      progress: 85,
      status: 'in_progress',
      dueDate: 'Daily'
    },
    {
      id: 2,
      title: 'Weekly Exercise',
      target: 5,
      current: 3,
      unit: 'workouts',
      progress: 60,
      status: 'in_progress',
      dueDate: 'This week'
    },
    {
      id: 3,
      title: 'Sleep Quality',
      target: 8,
      current: 8.5,
      unit: 'hours',
      progress: 106,
      status: 'achieved',
      dueDate: 'Daily'
    },
    {
      id: 4,
      title: 'Weight Goal',
      target: 175,
      current: 180,
      unit: 'lbs',
      progress: 83,
      status: 'in_progress',
      dueDate: 'End of month'
    }
  ];

  const connectedDevices = [
    {
      name: 'Apple Watch Series 8',
      type: 'smartwatch',
      status: 'connected',
      lastSync: '2 minutes ago',
      battery: 85,
      metrics: ['Heart Rate', 'Activity', 'Sleep']
    },
    {
      name: 'iPhone Health App',
      type: 'smartphone',
      status: 'connected',
      lastSync: '5 minutes ago',
      battery: null,
      metrics: ['Steps', 'Distance', 'Flights']
    },
    {
      name: 'MyFitnessPal',
      type: 'app',
      status: 'connected',
      lastSync: '1 hour ago',
      battery: null,
      metrics: ['Nutrition', 'Calories', 'Weight']
    },
    {
      name: 'Withings Scale',
      type: 'scale',
      status: 'pending',
      lastSync: 'Not connected',
      battery: null,
      metrics: ['Weight', 'Body Fat', 'BMI']
    }
  ];

  const healthInsights = [
    {
      type: 'positive',
      title: 'Sleep Quality Improved',
      description: 'Your average sleep duration increased by 30 minutes this week',
      action: 'View Sleep Trends',
      confidence: '92%'
    },
    {
      type: 'warning',
      title: 'Exercise Intensity Low',
      description: 'Consider adding 2 high-intensity workouts to your routine',
      action: 'Get Workout Plan',
      confidence: '87%'
    },
    {
      type: 'info',
      title: 'Heart Rate Variability',
      description: 'Your HRV indicates good recovery. Maintain current routine',
      action: 'Learn More',
      confidence: '95%'
    }
  ];

  const upcomingCheckups = [
    {
      type: 'Annual Physical',
      date: '2025-11-15',
      provider: 'Dr. Smith',
      status: 'scheduled'
    },
    {
      type: 'Dental Cleaning',
      date: '2025-10-30',
      provider: 'Dr. Johnson',
      status: 'due'
    },
    {
      type: 'Eye Exam',
      date: '2025-12-01',
      provider: 'Vision Center',
      status: 'upcoming'
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

  const getGoalStatusColor = (status: string) => {
    switch (status) {
      case 'achieved': return 'text-green-600 bg-green-50';
      case 'in_progress': return 'text-blue-600 bg-blue-50';
      case 'at_risk': return 'text-yellow-600 bg-yellow-50';
      case 'missed': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getDeviceStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-600 bg-green-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'disconnected': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Health Tracking</h1>
          <p className="text-gray-600 mt-1">Monitor your wellness metrics and achieve your health goals</p>
        </div>
        <div className="flex space-x-3">
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="1year">Last Year</option>
          </select>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus className="w-4 h-4" />
            <span>Add Metric</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Health Score Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-4 relative">
              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#E5E7EB"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#10B981"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${(healthMetrics.overview.score / 100) * 251.2} 251.2`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-900">{healthMetrics.overview.score}</span>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Health Score</h3>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              <Heart className="w-4 h-4 mr-1" />
              {healthMetrics.overview.status}
            </span>
            <p className="text-sm text-gray-600 mt-2">{healthMetrics.overview.trend}</p>
          </div>
        </div>

        {/* Vital Signs */}
        {healthMetrics.vitals.map((vital, index) => (
          <div key={index} className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{vital.name}</h3>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(vital.status)}`}>
                {vital.status}
              </span>
            </div>
            <p className="text-2xl font-bold text-blue-600 mb-2">{vital.value}</p>
            <p className="text-sm text-gray-600 mb-2">Target: {vital.target}</p>
            <div className="flex items-center space-x-1">
              <TrendingUp className="w-3 h-3 text-green-500" />
              <span className="text-xs text-green-600 capitalize">{vital.trend}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Health Metrics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Heart Rate Trend */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Heart Rate Today</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={heartRateData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="rate" 
                  stroke="#EF4444" 
                  fill="#EF4444"
                  fillOpacity={0.2}
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
            <span>Resting: 62 bpm</span>
            <span>Average: 71 bpm</span>
            <span>Peak: 90 bpm</span>
          </div>
        </div>

        {/* Sleep Quality */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sleep Quality This Week</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sleepData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="deep" stackId="a" fill="#1E40AF" />
                <Bar dataKey="light" stackId="a" fill="#3B82F6" />
                <Bar dataKey="rem" stackId="a" fill="#60A5FA" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center space-x-6 mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-800 rounded-full"></div>
              <span className="text-sm text-gray-600">Deep Sleep</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
              <span className="text-sm text-gray-600">Light Sleep</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
              <span className="text-sm text-gray-600">REM Sleep</span>
            </div>
          </div>
        </div>
      </div>

      {/* Activity & Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Activity Distribution */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={activityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {activityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {activityData.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-gray-600">{item.name} ({item.value}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Health Goals */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Health Goals</h3>
            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              Manage Goals
            </button>
          </div>
          <div className="space-y-4">
            {goals.map((goal) => (
              <div key={goal.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{goal.title}</h4>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getGoalStatusColor(goal.status)}`}>
                    {goal.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">
                    {goal.current} / {goal.target} {goal.unit}
                  </span>
                  <span className="text-sm font-medium text-gray-900">{goal.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      goal.progress >= 100 ? 'bg-green-500' :
                      goal.progress >= 75 ? 'bg-blue-500' :
                      goal.progress >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(goal.progress, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">{goal.dueDate}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Connected Devices */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Connected Devices</h2>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus className="w-4 h-4" />
            <span>Add Device</span>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {connectedDevices.map((device, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  {device.type === 'smartwatch' && <Watch className="w-5 h-5 text-gray-600" />}
                  {device.type === 'smartphone' && <Smartphone className="w-5 h-5 text-gray-600" />}
                  {device.type === 'app' && <Activity className="w-5 h-5 text-gray-600" />}
                  {device.type === 'scale' && <Target className="w-5 h-5 text-gray-600" />}
                  <h4 className="font-medium text-gray-900 text-sm">{device.name}</h4>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDeviceStatusColor(device.status)}`}>
                  {device.status}
                </span>
              </div>
              <p className="text-xs text-gray-600 mb-2">Last sync: {device.lastSync}</p>
              {device.battery && (
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-full bg-gray-200 rounded-full h-1">
                    <div 
                      className="h-1 bg-green-500 rounded-full" 
                      style={{ width: `${device.battery}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-600">{device.battery}%</span>
                </div>
              )}
              <div className="flex flex-wrap gap-1 mt-2">
                {device.metrics.map((metric, idx) => (
                  <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    {metric}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Health Insights & Checkups */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* AI Health Insights */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">AI Health Insights</h3>
            <Brain className="w-5 h-5 text-purple-600" />
          </div>
          <div className="space-y-4">
            {healthInsights.map((insight, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className={`p-1 rounded-full ${
                    insight.type === 'positive' ? 'bg-green-100' :
                    insight.type === 'warning' ? 'bg-yellow-100' :
                    'bg-blue-100'
                  }`}>
                    {insight.type === 'positive' && <CheckCircle className="w-4 h-4 text-green-600" />}
                    {insight.type === 'warning' && <AlertTriangle className="w-4 h-4 text-yellow-600" />}
                    {insight.type === 'info' && <Brain className="w-4 h-4 text-blue-600" />}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{insight.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">{insight.confidence} confidence</span>
                      <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                        {insight.action} →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Health Checkups */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Checkups</h3>
            <Calendar className="w-5 h-5 text-blue-600" />
          </div>
          <div className="space-y-4">
            {upcomingCheckups.map((checkup, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">{checkup.type}</h4>
                  <p className="text-sm text-gray-600">{checkup.provider}</p>
                  <p className="text-sm text-gray-500">{checkup.date}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  checkup.status === 'scheduled' ? 'bg-green-100 text-green-800' :
                  checkup.status === 'due' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {checkup.status}
                </span>
              </div>
            ))}
            <button className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-300 hover:text-blue-600 transition-colors">
              <Plus className="w-5 h-5 mx-auto mb-2" />
              Schedule New Checkup
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Health Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/dashboard/assessment/new"
            className="flex items-center space-x-3 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="p-2 bg-green-100 rounded-lg">
              <Heart className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Health Assessment</h3>
              <p className="text-sm text-gray-600">Update your health profile</p>
            </div>
          </Link>

          <button className="flex items-center space-x-3 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Upload className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Upload Records</h3>
              <p className="text-sm text-gray-600">Add medical documents</p>
            </div>
          </button>

          <Link
            to="/dashboard/risk"
            className="flex items-center space-x-3 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="p-2 bg-purple-100 rounded-lg">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Risk Analysis</h3>
              <p className="text-sm text-gray-600">View detailed risk factors</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HealthTrackingPage;
