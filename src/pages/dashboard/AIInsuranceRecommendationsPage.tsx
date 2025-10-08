import React, { useState, useEffect } from 'react';
import {
  Brain, Shield, TrendingUp, DollarSign, CheckCircle, AlertCircle,
  Sparkles, MessageCircle, RefreshCw, Download, Loader, Target,
  Heart, Activity, Users, FileText
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { QuestionnaireService } from '../../lib/databaseService';
import { GeminiInsuranceService, type AIInsuranceAnalysis, type InsuranceRecommendation } from '../../lib/geminiService';
import AIInsuranceChatbot from '../../components/AIInsuranceChatbot';

const AIInsuranceRecommendationsPage: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [questionnaireData, setQuestionnaireData] = useState<any>(null);
  const [aiAnalysis, setAiAnalysis] = useState<AIInsuranceAnalysis | null>(null);
  const [showChatbot, setShowChatbot] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUserData();
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      // Fetch user's latest questionnaire
      const questionnaires = await QuestionnaireService.getUserQuestionnaires(user.id);

      if (questionnaires && questionnaires.length > 0) {
        const latest = questionnaires[0];
        setQuestionnaireData(latest);

        // If AI analysis exists, use it
        if (latest.ai_analysis && Object.keys(latest.ai_analysis).length > 0) {
          // Parse the stored AI analysis
          setAiAnalysis({
            eligiblePolicies: [],
            riskAssessment: {
              overall: latest.risk_score < 40 ? 'Low Risk' : latest.risk_score < 70 ? 'Medium Risk' : 'High Risk',
              factors: ['Age', 'Health', 'Lifestyle', 'Financial'],
              improvements: []
            },
            premiumOptimization: {
              currentEstimate: latest.premium_estimate || 0,
              potentialSavings: 0,
              recommendations: []
            },
            personalizedAdvice: '',
            confidenceScore: latest.confidence_score || 85
          });
        }
      } else {
        setError('No questionnaire data found. Please complete an insurance assessment first.');
      }
    } catch (err) {
      console.error('Error loading user data:', err);
      setError('Failed to load your insurance data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const runAIAnalysis = async () => {
    if (!questionnaireData) return;

    try {
      setAnalyzing(true);
      setError(null);

      const analysisRequest = {
        demographics: questionnaireData.demographics,
        health: questionnaireData.health,
        lifestyle: questionnaireData.lifestyle,
        financial: questionnaireData.financial,
        riskScore: questionnaireData.risk_score,
        premiumEstimate: questionnaireData.premium_estimate
      };

      const analysis = await GeminiInsuranceService.analyzeInsuranceNeeds(analysisRequest);
      setAiAnalysis(analysis);

      // Save the analysis back to database
      if (user) {
        await QuestionnaireService.updateQuestionnaire(questionnaireData.id, {
          ai_analysis: analysis as any,
          confidence_score: analysis.confidenceScore
        });
      }
    } catch (err) {
      console.error('Error running AI analysis:', err);
      setError('Failed to generate AI recommendations. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your insurance profile...</p>
        </div>
      </div>
    );
  }

  if (error && !questionnaireData) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <AlertCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Insurance Data Found</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.href = '/questionnaire'}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start Insurance Assessment
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Brain className="w-8 h-8 text-blue-600 mr-3" />
                AI Insurance Recommendations
              </h1>
              <p className="text-gray-600 mt-2">
                Personalized insurance analysis powered by advanced AI
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowChatbot(!showChatbot)}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all flex items-center space-x-2 shadow-lg"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Ask AI Advisor</span>
              </button>
              <button
                onClick={runAIAnalysis}
                disabled={analyzing}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
              >
                {analyzing ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-5 h-5" />
                    <span>Run AI Analysis</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Profile Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Risk Score</p>
                  <p className="text-2xl font-bold text-gray-900">{questionnaireData?.risk_score || 0}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {questionnaireData?.risk_score < 40 ? 'Low Risk' : questionnaireData?.risk_score < 70 ? 'Medium Risk' : 'High Risk'}
                  </p>
                </div>
                <Target className="w-10 h-10 text-blue-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Est. Premium</p>
                  <p className="text-2xl font-bold text-gray-900">${questionnaireData?.premium_estimate || 0}</p>
                  <p className="text-xs text-gray-500 mt-1">per month</p>
                </div>
                <DollarSign className="w-10 h-10 text-green-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">AI Confidence</p>
                  <p className="text-2xl font-bold text-gray-900">{aiAnalysis?.confidenceScore || questionnaireData?.confidence_score || 85}%</p>
                  <p className="text-xs text-gray-500 mt-1">accuracy score</p>
                </div>
                <Sparkles className="w-10 h-10 text-purple-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Assessment</p>
                  <p className="text-2xl font-bold text-gray-900">{questionnaireData?.completion_percentage || 0}%</p>
                  <p className="text-xs text-gray-500 mt-1">complete</p>
                </div>
                <Activity className="w-10 h-10 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* AI Analysis Results */}
        {aiAnalysis ? (
          <div className="space-y-6">
            {/* Eligible Policies */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-6">
                <Shield className="w-6 h-6 text-blue-600 mr-3" />
                <h2 className="text-xl font-bold text-gray-900">Recommended Insurance Policies</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {aiAnalysis.eligiblePolicies.map((policy, index) => (
                  <PolicyCard key={index} policy={policy} />
                ))}
              </div>
            </div>

            {/* Risk Assessment */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-6">
                <TrendingUp className="w-6 h-6 text-orange-600 mr-3" />
                <h2 className="text-xl font-bold text-gray-900">Risk Assessment</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Overall Risk Level</p>
                  <div className="flex items-center">
                    <div className="flex-1 bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full ${
                          questionnaireData?.risk_score < 40
                            ? 'bg-green-500'
                            : questionnaireData?.risk_score < 70
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                        }`}
                        style={{ width: `${questionnaireData?.risk_score || 0}%` }}
                      />
                    </div>
                    <span className="ml-3 text-sm font-semibold text-gray-900">
                      {aiAnalysis.riskAssessment.overall}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Risk Factors</p>
                  <div className="space-y-2">
                    {aiAnalysis.riskAssessment.factors.map((factor, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-700">
                        <AlertCircle className="w-4 h-4 text-orange-500 mr-2" />
                        {factor}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Improvement Opportunities</p>
                  <div className="space-y-2">
                    {aiAnalysis.riskAssessment.improvements.map((improvement, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        {improvement}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Premium Optimization */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-6">
                <DollarSign className="w-6 h-6 text-green-600 mr-3" />
                <h2 className="text-xl font-bold text-gray-900">Premium Optimization</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Current Estimate</p>
                  <p className="text-3xl font-bold text-gray-900">
                    ${aiAnalysis.premiumOptimization.currentEstimate}
                    <span className="text-lg text-gray-600">/mo</span>
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Potential Savings</p>
                  <p className="text-3xl font-bold text-green-600">
                    ${aiAnalysis.premiumOptimization.potentialSavings}
                    <span className="text-lg text-gray-600">/mo</span>
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-sm font-medium text-gray-600 mb-3">How to Save</p>
                <div className="space-y-2">
                  {aiAnalysis.premiumOptimization.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start text-sm text-gray-700 bg-green-50 p-3 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Personalized Advice */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-sm border border-blue-200 p-6">
              <div className="flex items-center mb-4">
                <Sparkles className="w-6 h-6 text-blue-600 mr-3" />
                <h2 className="text-xl font-bold text-gray-900">AI Personalized Advice</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">{aiAnalysis.personalizedAdvice}</p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Analysis Not Yet Generated</h3>
            <p className="text-gray-600 mb-6">
              Click "Run AI Analysis" to get personalized insurance recommendations based on your profile.
            </p>
            <button
              onClick={runAIAnalysis}
              disabled={analyzing}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Generate Recommendations</span>
            </button>
          </div>
        )}
      </div>

      {/* AI Chatbot */}
      {showChatbot && questionnaireData && (
        <AIInsuranceChatbot
          userData={{
            demographics: questionnaireData.demographics,
            health: questionnaireData.health,
            lifestyle: questionnaireData.lifestyle,
            financial: questionnaireData.financial,
            riskScore: questionnaireData.risk_score,
            premiumEstimate: questionnaireData.premium_estimate
          }}
          isOpen={showChatbot}
          onClose={() => setShowChatbot(false)}
        />
      )}
    </div>
  );
};

const PolicyCard: React.FC<{ policy: InsuranceRecommendation }> = ({ policy }) => {
  const priorityColors = {
    high: 'bg-green-100 text-green-800 border-green-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    low: 'bg-gray-100 text-gray-800 border-gray-200'
  };

  return (
    <div className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900">{policy.policyType}</h3>
        <span className={`px-3 py-1 text-xs font-medium rounded-full border ${priorityColors[policy.priority]}`}>
          {policy.priority} priority
        </span>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex justify-between items-baseline">
          <span className="text-sm text-gray-600">Coverage</span>
          <span className="text-lg font-bold text-gray-900">${policy.coverage.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-baseline">
          <span className="text-sm text-gray-600">Monthly Premium</span>
          <span className="text-lg font-bold text-green-600">${policy.monthlyPremium}</span>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm font-medium text-gray-700 mb-2">Key Benefits:</p>
        <ul className="space-y-1">
          {policy.benefits.slice(0, 3).map((benefit, index) => (
            <li key={index} className="text-sm text-gray-600 flex items-start">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-700 mb-2">
          <span className="font-medium">Eligibility:</span> {policy.eligibility}
        </p>
        <p className="text-xs text-gray-600 italic">{policy.reasoning}</p>
      </div>

      <button className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
        Get Quote
      </button>
    </div>
  );
};

export default AIInsuranceRecommendationsPage;
