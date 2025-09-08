import React, { useState } from 'react';
import { 
  Brain, TrendingUp, Target, Lightbulb, BarChart3, 
  Calendar, Filter, Download, RefreshCw, AlertTriangle,
  CheckCircle, Eye, Zap, Shield, Heart
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

const AIInsightsPage: React.FC = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('6months');
  const [selectedInsightType, setSelectedInsightType] = useState('all');

  // Mock data for charts and insights
  const riskTrendData = [
    { month: 'Jan', riskScore: 45, prediction: 42, confidence: 89 },
    { month: 'Feb', riskScore: 42, prediction: 39, confidence: 91 },
    { month: 'Mar', riskScore: 38, prediction: 35, confidence: 93 },
    { month: 'Apr', riskScore: 35, prediction: 32, confidence: 94 },
    { month: 'May', riskScore: 32, prediction: 29, confidence: 95 },
    { month: 'Jun', riskScore: 28, prediction: 26, confidence: 96 }
  ];

  const factorImportanceData = [
    { factor: 'Age', importance: 85, trend: 'stable' },
    { factor: 'Smoking Status', importance: 92, trend: 'improving' },
    { factor: 'Exercise Frequency', importance: 78, trend: 'improving' },
    { factor: 'BMI', importance: 65, trend: 'declining' },
    { factor: 'Family History', importance: 45, trend: 'stable' },
    { factor: 'Occupation', importance: 38, trend: 'stable' }
  ];

  const healthMetricsData = [
    { metric: 'Cardiovascular', score: 85, max: 100 },
    { metric: 'Metabolic', score: 78, max: 100 },
    { metric: 'Lifestyle', score: 92, max: 100 },
    { metric: 'Mental Health', score: 88, max: 100 },
    { metric: 'Preventive Care', score: 75, max: 100 }
  ];

  const aiInsights = [
    {
      id: 1,
      type: 'risk_reduction',
      priority: 'high',
      title: 'Significant Risk Improvement Detected',
      description: 'Your risk score has improved by 17 points over the last 6 months due to consistent exercise and smoking cessation.',
      impact: 'Premium reduction potential: 15-20%',
      confidence: 94,
      actionable: true,
      actions: ['Schedule reassessment', 'Update health data', 'Contact agent'],
      timestamp: '2 hours ago',
      category: 'Health Improvement'
    },
    {
      id: 2,
      type: 'premium_optimization',
      priority: 'medium',
      title: 'Coverage Optimization Opportunity',
      description: 'Based on your recent life changes (marriage, new home), consider increasing coverage by $100K.',
      impact: 'Better protection for 12% premium increase',
      confidence: 87,
      actionable: true,
      actions: ['Calculate new premium', 'Review coverage options', 'Schedule consultation'],
      timestamp: '1 day ago',
      category: 'Coverage Planning'
    },
    {
      id: 3,
      type: 'market_trend',
      priority: 'low',
      title: 'Market Rate Trends Favor Your Profile',
      description: 'Insurance rates for your demographic and health profile have decreased by 8% industry-wide.',
      impact: 'Potential savings: $15-25/month',
      confidence: 91,
      actionable: true,
      actions: ['Compare market rates', 'Request quote update'],
      timestamp: '3 days ago',
      category: 'Market Intelligence'
    },
    {
      id: 4,
      type: 'health_prediction',
      priority: 'medium',
      title: 'Preventive Health Recommendation',
      description: 'AI models predict 23% lower risk of cardiovascular issues with current lifestyle trends.',
      impact: 'Long-term premium stability',
      confidence: 89,
      actionable: false,
      actions: [],
      timestamp: '1 week ago',
      category: 'Health Prediction'
    }
  ];

  const modelPerformance = {
    accuracy: 78.3,
    precision: 82.1,
    recall: 75.6,
    f1Score: 78.7,
    lastUpdated: '2024-10-08',
    trainingData: '2.3M records',
    modelVersion: 'v3.2.1'
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return AlertTriangle;
      case 'medium': return Eye;
      case 'low': return CheckCircle;
      default: return Brain;
    }
  };

  const filteredInsights = aiInsights.filter(insight => {
    if (selectedInsightType === 'all') return true;
    return insight.type === selectedInsightType;
  });

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI-Powered Insights</h1>
          <p className="text-gray-600">Dashboard &gt; AI Insights</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
            <RefreshCw className="w-4 h-4" />
            <span>Refresh Insights</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* AI Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-50 rounded-lg">
              <Brain className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Model Accuracy</p>
              <p className="text-2xl font-bold text-gray-900">{modelPerformance.accuracy}%</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Precision Score</p>
              <p className="text-2xl font-bold text-gray-900">{modelPerformance.precision}%</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-50 rounded-lg">
              <Zap className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Insights</p>
              <p className="text-2xl font-bold text-gray-900">{aiInsights.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-orange-50 rounded-lg">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Risk Improvement</p>
              <p className="text-2xl font-bold text-gray-900">-17pts</p>
            </div>
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
                <option value="1month">Last Month</option>
                <option value="3months">Last 3 Months</option>
                <option value="6months">Last 6 Months</option>
                <option value="1year">Last Year</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={selectedInsightType}
                onChange={(e) => setSelectedInsightType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Insights</option>
                <option value="risk_reduction">Risk Reduction</option>
                <option value="premium_optimization">Premium Optimization</option>
                <option value="market_trend">Market Trends</option>
                <option value="health_prediction">Health Predictions</option>
              </select>
            </div>
          </div>
          
          <div className="text-sm text-gray-500">
            Last updated: {modelPerformance.lastUpdated} • Model: {modelPerformance.modelVersion}
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Risk Trend Analysis */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Risk Score Trend & Predictions</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={riskTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="riskScore" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  name="Actual Risk Score"
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="prediction" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="AI Prediction"
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                <span>Actual Score</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                <span>AI Prediction</span>
              </div>
            </div>
            <span>Prediction accuracy: 94.2%</span>
          </div>
        </div>

        {/* Factor Importance */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Risk Factor Importance</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={factorImportanceData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="factor" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="importance" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mx-auto mb-1"></div>
              <span className="text-gray-600">Improving</span>
            </div>
            <div className="text-center">
              <div className="w-2 h-2 bg-gray-400 rounded-full mx-auto mb-1"></div>
              <span className="text-gray-600">Stable</span>
            </div>
            <div className="text-center">
              <div className="w-2 h-2 bg-red-500 rounded-full mx-auto mb-1"></div>
              <span className="text-gray-600">Declining</span>
            </div>
          </div>
        </div>
      </div>

      {/* Health Metrics Radar */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Health Metrics Analysis</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={healthMetricsData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="metric" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar
                  name="Health Score"
                  dataKey="score"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4">
            {healthMetricsData.map((metric, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Heart className="w-4 h-4 text-red-500" />
                  <span className="font-medium text-gray-900">{metric.metric}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${metric.score}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-8">{metric.score}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Insights Feed */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Personalized AI Insights</h3>
        <div className="space-y-6">
          {filteredInsights.map((insight) => {
            const PriorityIcon = getPriorityIcon(insight.priority);
            return (
              <div key={insight.id} className={`border-2 rounded-lg p-6 ${getPriorityColor(insight.priority)}`}>
                <div className="flex items-start space-x-4">
                  <div className="p-2 rounded-lg bg-white">
                    <PriorityIcon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">{insight.title}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs px-2 py-1 bg-white rounded-full font-medium">
                            {insight.category}
                          </span>
                          <span className="text-xs text-gray-600">{insight.timestamp}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">Confidence: {insight.confidence}%</div>
                        <div className="w-16 bg-white rounded-full h-1 mt-1">
                          <div 
                            className="bg-current h-1 rounded-full"
                            style={{ width: `${insight.confidence}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-gray-800 mb-3">{insight.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-sm font-medium">{insight.impact}</span>
                      </div>
                      
                      {insight.actionable && insight.actions.length > 0 && (
                        <div className="flex space-x-2">
                          {insight.actions.slice(0, 2).map((action, idx) => (
                            <button
                              key={idx}
                              className="text-xs px-3 py-1 bg-white text-gray-700 rounded-full hover:bg-gray-50 border"
                            >
                              {action}
                            </button>
                          ))}
                          {insight.actions.length > 2 && (
                            <button className="text-xs px-3 py-1 bg-white text-gray-700 rounded-full hover:bg-gray-50 border">
                              +{insight.actions.length - 2} more
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Model Information */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">AI Model Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <Shield className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900 mb-1">Model Version</h4>
            <p className="text-sm text-gray-600">{modelPerformance.modelVersion}</p>
            <p className="text-xs text-gray-500 mt-1">Updated {modelPerformance.lastUpdated}</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <BarChart3 className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900 mb-1">Training Data</h4>
            <p className="text-sm text-gray-600">{modelPerformance.trainingData}</p>
            <p className="text-xs text-gray-500 mt-1">Continuously updated</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <Target className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900 mb-1">F1 Score</h4>
            <p className="text-sm text-gray-600">{modelPerformance.f1Score}%</p>
            <p className="text-xs text-gray-500 mt-1">Balanced accuracy</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIInsightsPage;