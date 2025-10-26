import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Target, TrendingUp, TrendingDown, AlertTriangle,
  Shield, Heart, Activity, Brain, Calendar, Filter,
  Eye, Download, RefreshCw, CheckCircle, Clock, Loader, Wifi, WifiOff
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useAuth } from '../../hooks/useAuth';
import { RiskAnalysisService, type RiskAnalysis } from '../../lib/riskAnalysisService';
import { supabase } from '../../lib/supabase';

const RiskDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [selectedTimeframe, setSelectedTimeframe] = useState('6months');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [riskAnalysis, setRiskAnalysis] = useState<RiskAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRealTimeConnected, setIsRealTimeConnected] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [unacknowledgedAlerts, setUnacknowledgedAlerts] = useState<number>(0);
  const subscriptionRef = useRef<any>(null);
  const autoRefreshRef = useRef<NodeJS.Timeout | null>(null);

  const loadRiskData = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      const analysis = await RiskAnalysisService.analyzeUserRisk(user.id);
      setRiskAnalysis(analysis);
      setLastUpdated(new Date());

      await loadUnacknowledgedAlerts();
    } catch (err) {
      console.error('Error loading risk data:', err);
      setError('Failed to load risk analysis. Please complete an insurance assessment first.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const loadUnacknowledgedAlerts = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('risk_alerts')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('is_acknowledged', false);

    if (!error && data) {
      setUnacknowledgedAlerts(data.length || 0);
    }
  };

  useEffect(() => {
    loadRiskData();
  }, [loadRiskData]);

  useEffect(() => {
    if (!user) return;

    const setupRealtimeSubscriptions = async () => {
      const healthChannel = supabase
        .channel('health-tracking-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'health_tracking',
            filter: `user_id=eq.${user.id}`
          },
          () => {
            console.log('Health tracking updated - refreshing risk data');
            loadRiskData();
          }
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'insurance_questionnaires',
            filter: `user_id=eq.${user.id}`
          },
          () => {
            console.log('Questionnaire updated - refreshing risk data');
            loadRiskData();
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'risk_alerts',
            filter: `user_id=eq.${user.id}`
          },
          () => {
            console.log('New risk alert received');
            loadUnacknowledgedAlerts();
            loadRiskData();
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            setIsRealTimeConnected(true);
            console.log('Real-time subscriptions active');
          } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
            setIsRealTimeConnected(false);
            console.log('Real-time connection lost');
          }
        });

      subscriptionRef.current = healthChannel;
    };

    setupRealtimeSubscriptions();

    autoRefreshRef.current = setInterval(() => {
      console.log('Auto-refresh triggered');
      loadRiskData();
    }, 5 * 60 * 1000);

    return () => {
      if (subscriptionRef.current) {
        supabase.removeChannel(subscriptionRef.current);
      }
      if (autoRefreshRef.current) {
        clearInterval(autoRefreshRef.current);
      }
    };
  }, [user, loadRiskData]);


  const handleRefresh = async () => {
    setRefreshing(true);
    await loadRiskData();
    setRefreshing(false);
  };

  const acknowledgeAlerts = async () => {
    if (!user) return;

    const { error } = await supabase
      .from('risk_alerts')
      .update({ is_acknowledged: true, acknowledged_at: new Date().toISOString() })
      .eq('user_id', user.id)
      .eq('is_acknowledged', false);

    if (!error) {
      setUnacknowledgedAlerts(0);
    }
  };

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

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading risk analysis...</p>
        </div>
      </div>
    );
  }

  if (error || !riskAnalysis) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
          <AlertTriangle className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Risk Data Available</h3>
          <p className="text-gray-600 mb-4">
            {error || 'Please complete an insurance assessment to generate your risk analysis.'}
          </p>
          <a
            href="/dashboard/assessment/new"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Start Assessment
          </a>
        </div>
      </div>
    );
  }

  const currentRiskScore = riskAnalysis.overallScore;
  const riskCategory = riskAnalysis.category;

  const healthFactor = riskAnalysis.riskFactors.find(f => f.category === 'Health');
  const lifestyleFactor = riskAnalysis.riskFactors.find(f => f.category === 'Lifestyle');

  const filteredFactors = selectedCategory === 'all'
    ? riskAnalysis.riskFactors
    : riskAnalysis.riskFactors.filter(factor => factor.category.toLowerCase() === selectedCategory);

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Risk Monitoring Dashboard</h1>
          <p className="text-gray-600 flex items-center space-x-2">
            <span>Dashboard &gt; Risk Monitoring</span>
            <span className="flex items-center space-x-1">
              {isRealTimeConnected ? (
                <>
                  <Wifi className="w-3 h-3 text-green-600" />
                  <span className="text-xs text-green-600">Live</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-400">Offline</span>
                </>
              )}
            </span>
          </p>
        </div>
        <div className="flex space-x-3">
          {unacknowledgedAlerts > 0 && (
            <button
              onClick={acknowledgeAlerts}
              className="flex items-center space-x-2 px-4 py-2 border border-orange-300 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>{unacknowledgedAlerts} Alert{unacknowledgedAlerts > 1 ? 's' : ''}</span>
            </button>
          )}
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh Data</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <Target className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">{currentRiskScore}</div>
              <div className="text-sm text-gray-600">
                Score
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Overall Risk Score</h3>
            <p className={`text-sm font-medium ${
              currentRiskScore < 30 ? 'text-green-600' :
              currentRiskScore < 60 ? 'text-yellow-600' :
              'text-red-600'
            }`}>
              {riskCategory}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Heart className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">{healthFactor?.currentScore || 'N/A'}</div>
              <div className="text-sm text-gray-600 flex items-center">
                {healthFactor && getTrendIcon(healthFactor.trend)}
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Health Risk</h3>
            <p className="text-sm text-blue-600">{healthFactor?.impact || 'N/A'}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-50 rounded-lg">
              <Activity className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">{lifestyleFactor?.currentScore || 'N/A'}</div>
              <div className="text-sm text-gray-600 flex items-center">
                {lifestyleFactor && getTrendIcon(lifestyleFactor.trend)}
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Lifestyle Risk</h3>
            <p className="text-sm text-purple-600">{lifestyleFactor?.impact || 'N/A'}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-50 rounded-lg">
              <Brain className="w-6 h-6 text-orange-600" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">
                {riskAnalysis.predictions[0]?.confidence || 'N/A'}%
              </div>
              <div className="text-sm text-gray-600">Confidence</div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">AI Prediction</h3>
            <p className="text-sm text-gray-600">High Accuracy</p>
          </div>
        </div>
      </div>

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

          <div className="text-sm text-gray-500 flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>Last updated: {lastUpdated.toLocaleString()}</span>
          </div>
        </div>
      </div>

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
                    {category.previousScore && (
                      <>
                        {category.trend === 'improving' ? '↓' : category.trend === 'declining' ? '↑' : '→'}
                        {Math.abs(category.currentScore - category.previousScore)} pts
                      </>
                    )}
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
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Recommendations</h3>
            <div className="space-y-4">
              {riskAnalysis.recommendations.map((rec, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-700">{rec}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Risk Score Predictions</h3>
            <div className="space-y-4">
              {riskAnalysis.predictions.map((prediction, index) => (
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
