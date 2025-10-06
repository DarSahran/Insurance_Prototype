import React, { useState } from 'react';
import { 
  Target, TrendingUp, TrendingDown, AlertTriangle, 
  Shield, Heart, Activity, Brain, Calendar, Filter,
  Eye, Download, RefreshCw, CheckCircle, Clock
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, RadialBarChart, RadialBar } from 'recharts';

const RiskDashboardPage: React.FC = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('6months');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock data for risk monitoring
  const riskHistoryData = [
    { month: 'Jan', overall: 45, health: 40, lifestyle: 35, financial: 50, demographic: 45 },
    { month: 'Feb', overall: 42, health: 38, lifestyle: 32, financial: 48, demographic: 45 },
    { month: 'Mar', overall: 38, health: 35, lifestyle: 28, financial: 45, demographic: 44 },
    { month: 'Apr', overall: 35, health: 32, lifestyle: 25, financial: 42, demographic: 44 },
    { month: 'May', overall: 32, health: 30, lifestyle: 22, financial: 40, demographic: 43 },
    { month: 'Jun', overall: 28, health: 28, lifestyle: 20, financial: 38, demographic: 43 }
  ];

  const riskFactors = [
    {
      category: 'Health',
      currentScore: 28,
      previousScore: 35,
      trend: 'improving',
      impact: 'high',
      factors: [
        { name: 'BMI', value: 27.2, status: 'caution', target: 24.9 },
        { name: 'Blood Pressure', value: '120/80', status: 'good', target: '<120/80' },
        { name: 'Cholesterol', value: 180, status: 'good', target: '<200' },
        { name: 'Exercise Frequency', value: '4x/week', status: 'excellent', target: '3x/week' }
      ]
    },
    {
      category: 'Lifestyle',
      currentScore: 20,
      previousScore: 25,
      trend: 'improving',
      impact: 'medium',
      factors: [
        { name: 'Smoking Status', value: 'Never', status: 'excellent', target: 'Never' },
        { name: 'Alcohol Consumption', value: 'Moderate', status: 'good', target: 'Moderate' },
        { name: 'Sleep Quality', value: '7.5 hrs', status: 'good', target: '7-9 hrs' },
        { name: 'Stress Level', value: '4/10', status: 'good', target: '<5/10' }
      ]
    },
    {
      category: 'Financial',
      currentScore: 38,
      previousScore: 40,
      trend: 'stable',
      impact: 'medium',
      factors: [
        { name: 'Income Stability', value: 'Stable', status: 'good', target: 'Stable' },
        { name: 'Debt-to-Income', value: '25%', status: 'good', target: '<30%' },
        { name: 'Emergency Fund', value: '6 months', status: 'excellent', target: '3-6 months' },
        { name: 'Credit Score', value: 750, status: 'excellent', target: '>700' }
      ]
    },
    {
      category: 'Demographic',
      currentScore: 43,
      previousScore: 45,
      trend: 'stable',
      impact: 'low',
      factors: [
        { name: 'Age', value: 28, status: 'good', target: 'N/A' },
        { name: 'Location Risk', value: 'Low', status: 'good', target: 'Low' },
        { name: 'Occupation Risk', value: 'Low', status: 'good', target: 'Low' },
        { name: 'Gender Risk', value: 'Average', status: 'neutral', target: 'N/A' }
      ]
    }
  ];

  const riskAlerts = [
    {
      id: 1,
      type: 'warning',
      category: 'Health',
      title: 'BMI Trending Upward',
      description: 'Your BMI has increased from 26.8 to 27.2 over the last 3 months.',
      impact: 'Could increase premium by 3-5%',
      recommendation: 'Consider increasing exercise frequency or consulting a nutritionist.',
      timestamp: '2 days ago',
      actionable: true
    },
    {
      id: 2,
      type: 'info',
      category: 'Lifestyle',
      title: 'Exercise Consistency Excellent',
      description: 'You\'ve maintained 4+ exercise sessions per week for 6 months.',
      impact: 'Maintaining low lifestyle risk score',
      recommendation: 'Keep up the great work!',
      timestamp: '1 week ago',
      actionable: false
    },
    {
      id: 3,
      type: 'success',
      category: 'Financial',
      title: 'Emergency Fund Goal Achieved',
      description: 'You\'ve successfully built a 6-month emergency fund.',
      impact: 'Reduced financial risk score by 5 points',
      recommendation: 'Consider investing excess savings for long-term growth.',
      timestamp: '2 weeks ago',
      actionable: true
    }
  ];

  const riskPredictions = [
    {
      timeframe: '3 months',
      predictedScore: 25,
      confidence: 92,
      factors: ['Continued exercise routine', 'Stable health metrics']
    },
    {
      timeframe: '6 months',
      predictedScore: 22,
      confidence: 87,
      factors: ['Expected BMI improvement', 'Age factor remains stable']
    },
    {
      timeframe: '1 year',
      predictedScore: 20,
      confidence: 78,
      factors: ['Long-term lifestyle benefits', 'Potential life changes']
    }
  ];

  const currentRiskScore = 28;
  const riskCategory = 'Low Risk';
  const riskImprovement = -17; // Negative means improvement

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingDown className="w-4 h-4 text-green-600" />;
      case 'declining': return <TrendingUp className="w-4 h-4 text-red-600" />;
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

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'success': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'info': return <Eye className="w-5 h-5 text-blue-600" />;
      default: return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const filteredFactors = selectedCategory === 'all' 
    ? riskFactors 
    : riskFactors.filter(factor => factor.category.toLowerCase() === selectedCategory);

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Risk Monitoring Dashboard</h1>
          <p className="text-gray-600">Dashboard &gt; Risk Monitoring</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
            <RefreshCw className="w-4 h-4" />
            <span>Refresh Data</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Risk Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <Target className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">{currentRiskScore}</div>
              <div className="text-sm text-green-600 flex items-center">
                <TrendingDown className="w-3 h-3 mr-1" />
                {Math.abs(riskImprovement)} points
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Overall Risk Score</h3>
            <p className="text-sm text-green-600">{riskCategory}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Heart className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">28</div>
              <div className="text-sm text-green-600 flex items-center">
                <TrendingDown className="w-3 h-3 mr-1" />
                7 points
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Health Risk</h3>
            <p className="text-sm text-green-600">Excellent</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-50 rounded-lg">
              <Activity className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">20</div>
              <div className="text-sm text-green-600 flex items-center">
                <TrendingDown className="w-3 h-3 mr-1" />
                5 points
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Lifestyle Risk</h3>
            <p className="text-sm text-green-600">Excellent</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-50 rounded-lg">
              <Brain className="w-6 h-6 text-orange-600" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">92%</div>
              <div className="text-sm text-gray-600">Confidence</div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">AI Prediction</h3>
            <p className="text-sm text-gray-600">High Accuracy</p>
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
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                <option value="health">Health</option>
                <option value="lifestyle">Lifestyle</option>
                <option value="financial">Financial</option>
                <option value="demographic">Demographic</option>
              </select>
            </div>
          </div>
          
          <div className="text-sm text-gray-500">
            Last updated: 2 hours ago
          </div>
        </div>
      </div>

      {/* Risk Trend Chart */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Risk Score Trends</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={riskHistoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="overall" 
                stackId="1"
                stroke="#3B82F6" 
                fill="#3B82F6"
                fillOpacity={0.3}
                name="Overall Risk"
              />
              <Area 
                type="monotone" 
                dataKey="health" 
                stackId="2"
                stroke="#10B981" 
                fill="#10B981"
                fillOpacity={0.3}
                name="Health Risk"
              />
              <Area 
                type="monotone" 
                dataKey="lifestyle" 
                stackId="3"
                stroke="#8B5CF6" 
                fill="#8B5CF6"
                fillOpacity={0.3}
                name="Lifestyle Risk"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex items-center justify-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
            <span>Overall Risk</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-600 rounded-full"></div>
            <span>Health Risk</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
            <span>Lifestyle Risk</span>
          </div>
        </div>
      </div>

      {/* Risk Factors Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Risk Factor Analysis</h3>
          {filteredFactors.map((category, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <h4 className="text-lg font-semibold text-gray-900">{category.category}</h4>
                  {getTrendIcon(category.trend)}
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{category.currentScore}</div>
                  <div className="text-sm text-gray-600">
                    {category.trend === 'improving' ? '↓' : category.trend === 'declining' ? '↑' : '→'} 
                    {Math.abs(category.currentScore - category.previousScore)} pts
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                {category.factors.map((factor, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{factor.name}</p>
                      <p className="text-sm text-gray-600">Target: {factor.target}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{factor.value}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(factor.status)}`}>
                        {factor.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          {/* Risk Alerts */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Risk Alerts & Notifications</h3>
            <div className="space-y-4">
              {riskAlerts.map((alert) => (
                <div key={alert.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{alert.title}</h4>
                        <span className="text-xs text-gray-500">{alert.timestamp}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{alert.description}</p>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-blue-600">{alert.impact}</p>
                        <p className="text-sm text-gray-700">{alert.recommendation}</p>
                      </div>
                      {alert.actionable && (
                        <button className="mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium">
                          Take Action →
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Risk Predictions */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Risk Score Predictions</h3>
            <div className="space-y-4">
              {riskPredictions.map((prediction, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{prediction.timeframe}</h4>
                    <div className="text-right">
                      <div className="text-lg font-bold text-blue-600">{prediction.predictedScore}</div>
                      <div className="text-xs text-gray-500">{prediction.confidence}% confidence</div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">Key factors:</p>
                    {prediction.factors.map((factor, idx) => (
                      <div key={idx} className="text-xs text-gray-500 flex items-center">
                        <div className="w-1 h-1 bg-gray-400 rounded-full mr-2"></div>
                        {factor}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskDashboardPage;