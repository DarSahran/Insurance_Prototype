import React, { useState } from 'react';
import { 
  Heart, Activity, Moon, Brain, Scale, Droplets, 
  TrendingUp, TrendingDown, Calendar, Plus, Target,
  Watch, Smartphone, RefreshCw, Download, AlertTriangle,
  CheckCircle, Zap, Award
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, RadialBarChart, RadialBar, Cell } from 'recharts';

const HealthTrackingPage: React.FC = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('30days');
  const [selectedMetric, setSelectedMetric] = useState('all');

  // Mock health data
  const healthMetricsData = [
    { date: '2024-10-01', heartRate: 72, steps: 8500, sleep: 7.2, weight: 180, bloodPressure: 120 },
    { date: '2024-10-02', heartRate: 75, steps: 9200, sleep: 7.8, weight: 179.8, bloodPressure: 118 },
    { date: '2024-10-03', heartRate: 73, steps: 10500, sleep: 6.9, weight: 179.5, bloodPressure: 122 },
    { date: '2024-10-04', heartRate: 71, steps: 7800, sleep: 8.1, weight: 179.2, bloodPressure: 119 },
    { date: '2024-10-05', heartRate: 74, steps: 11200, sleep: 7.5, weight: 179.0, bloodPressure: 121 },
    { date: '2024-10-06', heartRate: 70, steps: 9800, sleep: 7.3, weight: 178.8, bloodPressure: 117 },
    { date: '2024-10-07', heartRate: 72, steps: 8900, sleep: 7.7, weight: 178.5, bloodPressure: 120 }
  ];

  const currentMetrics = {
    heartRate: { current: 72, target: 70, trend: 'stable', status: 'good' },
    steps: { current: 9500, target: 10000, trend: 'improving', status: 'good' },
    sleep: { current: 7.5, target: 8.0, trend: 'stable', status: 'good' },
    weight: { current: 178.5, target: 175, trend: 'improving', status: 'good' },
    bloodPressure: { current: '120/80', target: '<120/80', trend: 'stable', status: 'excellent' },
    hydration: { current: 6, target: 8, trend: 'declining', status: 'caution' }
  };

  const healthGoals = [
    {
      id: 1,
      title: 'Reach Target Weight',
      current: 178.5,
      target: 175,
      unit: 'lbs',
      progress: 70,
      deadline: '2024-12-31',
      category: 'Weight Management',
      status: 'on_track'
    },
    {
      id: 2,
      title: 'Daily Step Goal',
      current: 9500,
      target: 10000,
      unit: 'steps',
      progress: 95,
      deadline: 'Daily',
      category: 'Activity',
      status: 'on_track'
    },
    {
      id: 3,
      title: 'Improve Sleep Quality',
      current: 7.5,
      target: 8.0,
      unit: 'hours',
      progress: 94,
      deadline: '2024-11-30',
      category: 'Sleep',
      status: 'on_track'
    },
    {
      id: 4,
      title: 'Lower Resting Heart Rate',
      current: 72,
      target: 65,
      unit: 'bpm',
      progress: 43,
      deadline: '2025-03-31',
      category: 'Cardiovascular',
      status: 'behind'
    }
  ];

  const healthInsights = [
    {
      type: 'positive',
      title: 'Excellent Sleep Consistency',
      description: 'You\'ve maintained 7+ hours of sleep for 28 consecutive days.',
      impact: 'Reduced stress-related risk factors by 12%',
      recommendation: 'Keep maintaining your current sleep schedule.'
    },
    {
      type: 'warning',
      title: 'Hydration Below Target',
      description: 'Your daily water intake has been below 8 glasses for the past week.',
      impact: 'May affect energy levels and recovery',
      recommendation: 'Set hourly reminders to drink water throughout the day.'
    },
    {
      type: 'info',
      title: 'Heart Rate Variability Improving',
      description: 'Your HRV has increased by 15% over the last month.',
      impact: 'Indicates better cardiovascular fitness',
      recommendation: 'Continue current exercise routine for optimal results.'
    }
  ];

  const wearableDevices = [
    { name: 'Apple Watch Series 9', status: 'connected', lastSync: '2 minutes ago', battery: 85 },
    { name: 'iPhone Health App', status: 'connected', lastSync: '5 minutes ago', battery: null },
    { name: 'Fitbit Charge 5', status: 'disconnected', lastSync: '2 days ago', battery: null }
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'declining': return <TrendingDown className="w-4 h-4 text-red-600" />;
      default: return <div className="w-4 h-4 bg-gray-400 rounded-full" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-50';
      case 'good': return 'text-blue-600 bg-blue-50';
      case 'caution': return 'text-yellow-600 bg-yellow-50';
      case 'poor': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getGoalStatusColor = (status: string) => {
    switch (status) {
      case 'on_track': return 'text-green-600 bg-green-50 border-green-200';
      case 'behind': return 'text-red-600 bg-red-50 border-red-200';
      case 'completed': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'positive': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'info': return <Zap className="w-5 h-5 text-blue-600" />;
      default: return <Heart className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Health Tracking</h1>
          <p className="text-gray-600">Dashboard &gt; Health Tracking</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
            <RefreshCw className="w-4 h-4" />
            <span>Sync Data</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
            <Plus className="w-4 h-4" />
            <span>Add Metric</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Download className="w-4 h-4" />
            <span>Export Data</span>
          </button>
        </div>
      </div>

      {/* Current Health Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-red-50 rounded-lg">
              <Heart className="w-6 h-6 text-red-600" />
            </div>
            {getTrendIcon(currentMetrics.heartRate.trend)}
          </div>
          <div>
            <p className="text-sm text-gray-600">Heart Rate</p>
            <p className="text-2xl font-bold text-gray-900">{currentMetrics.heartRate.current}</p>
            <p className="text-xs text-gray-500">Target: {currentMetrics.heartRate.target} bpm</p>
            <span className={`text-xs px-2 py-1 rounded-full mt-2 inline-block ${getStatusColor(currentMetrics.heartRate.status)}`}>
              {currentMetrics.heartRate.status}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
            {getTrendIcon(currentMetrics.steps.trend)}
          </div>
          <div>
            <p className="text-sm text-gray-600">Daily Steps</p>
            <p className="text-2xl font-bold text-gray-900">{currentMetrics.steps.current.toLocaleString()}</p>
            <p className="text-xs text-gray-500">Target: {currentMetrics.steps.target.toLocaleString()}</p>
            <span className={`text-xs px-2 py-1 rounded-full mt-2 inline-block ${getStatusColor(currentMetrics.steps.status)}`}>
              {currentMetrics.steps.status}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-indigo-50 rounded-lg">
              <Moon className="w-6 h-6 text-indigo-600" />
            </div>
            {getTrendIcon(currentMetrics.sleep.trend)}
          </div>
          <div>
            <p className="text-sm text-gray-600">Sleep</p>
            <p className="text-2xl font-bold text-gray-900">{currentMetrics.sleep.current}h</p>
            <p className="text-xs text-gray-500">Target: {currentMetrics.sleep.target}h</p>
            <span className={`text-xs px-2 py-1 rounded-full mt-2 inline-block ${getStatusColor(currentMetrics.sleep.status)}`}>
              {currentMetrics.sleep.status}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-50 rounded-lg">
              <Scale className="w-6 h-6 text-purple-600" />
            </div>
            {getTrendIcon(currentMetrics.weight.trend)}
          </div>
          <div>
            <p className="text-sm text-gray-600">Weight</p>
            <p className="text-2xl font-bold text-gray-900">{currentMetrics.weight.current}</p>
            <p className="text-xs text-gray-500">Target: {currentMetrics.weight.target} lbs</p>
            <span className={`text-xs px-2 py-1 rounded-full mt-2 inline-block ${getStatusColor(currentMetrics.weight.status)}`}>
              {currentMetrics.weight.status}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-50 rounded-lg">
              <Heart className="w-6 h-6 text-orange-600" />
            </div>
            {getTrendIcon(currentMetrics.bloodPressure.trend)}
          </div>
          <div>
            <p className="text-sm text-gray-600">Blood Pressure</p>
            <p className="text-2xl font-bold text-gray-900">{currentMetrics.bloodPressure.current}</p>
            <p className="text-xs text-gray-500">Target: {currentMetrics.bloodPressure.target}</p>
            <span className={`text-xs px-2 py-1 rounded-full mt-2 inline-block ${getStatusColor(currentMetrics.bloodPressure.status)}`}>
              {currentMetrics.bloodPressure.status}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Droplets className="w-6 h-6 text-blue-600" />
            </div>
            {getTrendIcon(currentMetrics.hydration.trend)}
          </div>
          <div>
            <p className="text-sm text-gray-600">Hydration</p>
            <p className="text-2xl font-bold text-gray-900">{currentMetrics.hydration.current}</p>
            <p className="text-xs text-gray-500">Target: {currentMetrics.hydration.target} glasses</p>
            <span className={`text-xs px-2 py-1 rounded-full mt-2 inline-block ${getStatusColor(currentMetrics.hydration.status)}`}>
              {currentMetrics.hydration.status}
            </span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="90days">Last 90 Days</option>
                <option value="1year">Last Year</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4 text-gray-400" />
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Metrics</option>
                <option value="heartRate">Heart Rate</option>
                <option value="steps">Steps</option>
                <option value="sleep">Sleep</option>
                <option value="weight">Weight</option>
              </select>
            </div>
          </div>
          
          <div className="text-sm text-gray-500">
            Last sync: 2 minutes ago
          </div>
        </div>
      </div>

      {/* Health Trends Chart */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Health Metrics Trends</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={healthMetricsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="heartRate" 
                stroke="#EF4444" 
                strokeWidth={2}
                name="Heart Rate (bpm)"
                dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="steps" 
                stroke="#10B981" 
                strokeWidth={2}
                name="Steps (thousands)"
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                yAxisId="steps"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex items-center justify-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Heart Rate</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Daily Steps</span>
          </div>
        </div>
      
      </div>

      {/* Health Goals and Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Health Goals */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Health Goals</h3>
            <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-800">
              <Plus className="w-4 h-4" />
              <span className="text-sm">Add Goal</span>
            </button>
          </div>
          <div className="space-y-4">
            {healthGoals.map((goal) => (
              <div key={goal.id} className={`border-2 rounded-lg p-4 ${getGoalStatusColor(goal.status)}`}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{goal.title}</h4>
                  <span className="text-xs px-2 py-1 bg-white rounded-full">
                    {goal.category}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">
                    {goal.current} / {goal.target} {goal.unit}
                  </span>
                  <span className="text-sm font-medium">
                    {goal.progress}%
                  </span>
                </div>
                <div className="w-full bg-white rounded-full h-2 mb-2">
                  <div 
                    className="bg-current h-2 rounded-full transition-all duration-500"
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>Deadline: {goal.deadline}</span>
                  {goal.status === 'on_track' && <Award className="w-4 h-4 text-yellow-500" />}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Health Insights */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Health Insights</h3>
          <div className="space-y-4">
            {healthInsights.map((insight, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  {getInsightIcon(insight.type)}
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">{insight.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-blue-600">{insight.impact}</p>
                      <p className="text-sm text-gray-700">{insight.recommendation}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Connected Devices */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Connected Devices</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {wearableDevices.map((device, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  {device.name.includes('Apple') ? <Watch className="w-5 h-5 text-gray-600" /> : <Smartphone className="w-5 h-5 text-gray-600" />}
                  <span className="font-medium text-gray-900">{device.name}</span>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  device.status === 'connected' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {device.status}
                </span>
              </div>
              <div className="space-y-1 text-sm text-gray-600">
                <p>Last sync: {device.lastSync}</p>
                {device.battery && (
                  <div className="flex items-center space-x-2">
                    <span>Battery:</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${device.battery > 20 ? 'bg-green-500' : 'bg-red-500'}`}
                        style={{ width: `${device.battery}%` }}
                      />
                    </div>
                    <span>{device.battery}%</span>
                  </div>
                )}
              </div>
              {device.status === 'disconnected' && (
                <button className="mt-3 w-full text-sm text-blue-600 hover:text-blue-800 font-medium">
                  Reconnect Device
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HealthTrackingPage;