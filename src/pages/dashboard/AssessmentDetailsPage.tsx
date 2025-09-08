import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, Download, Share2, FileText, Target, Brain, 
  TrendingUp, BarChart3, CheckCircle, AlertTriangle, 
  ChevronDown, ChevronUp, Zap, Shield, Eye
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const AssessmentDetailsPage: React.FC = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('risk_factors');
  const [showExplanation, setShowExplanation] = useState(false);

  // Mock assessment data - in real app, fetch based on ID
  const assessment = {
    id: 'ASS-2024-001',
    type: 'Comprehensive Life Insurance',
    status: 'Completed',
    dateCompleted: 'September 15, 2024',
    timeTaken: '7 minutes 23 seconds',
    assessmentType: 'Comprehensive Life Insurance',
    riskScore: 28,
    riskCategory: 'Low Risk',
    premiumEstimate: 89.99,
    coverageAmount: 500000,
    confidence: 94.2,
    aiModel: 'XGBoost Ensemble v2.1',
    processingTime: '2.1 seconds',
    biasCheck: 'Passed all fairness tests',
    comparison: {
      industryAverage: 40,
      improvement: 12,
      traditionalEstimate: 145,
      aiEstimate: 89.99,
      savings: 38
    }
  };

  const riskFactors = [
    {
      name: 'Demographics',
      impactScore: 12,
      impactType: 'positive',
      factors: ['Age: 28 years', 'Gender: Male', 'Location: Low-risk area'],
      explanation: 'Your demographic profile places you in a favorable risk category'
    },
    {
      name: 'Health Status',
      impactScore: -8,
      impactType: 'negative',
      factors: ['BMI: 27.2 (slightly overweight)', 'Blood pressure: Normal', 'No chronic conditions'],
      explanation: 'Overall excellent health with minor weight considerations'
    },
    {
      name: 'Lifestyle',
      impactScore: 15,
      impactType: 'positive',
      factors: ['Non-smoker', 'Moderate alcohol use', 'Regular exercise'],
      explanation: 'Healthy lifestyle choices significantly reduce your risk'
    },
    {
      name: 'Family History',
      impactScore: -3,
      impactType: 'negative',
      factors: ['Parent with diabetes', 'No heart disease history'],
      explanation: 'Minor genetic risk factors that are well-managed'
    }
  ];

  const featureContributions = [
    { feature: 'Age (28)', contribution: -12, explanation: 'Young age reduces risk significantly' },
    { feature: 'Non-smoker', contribution: -15, explanation: 'Not smoking is the largest positive factor' },
    { feature: 'Regular exercise', contribution: -8, explanation: 'Active lifestyle reduces health risks' },
    { feature: 'BMI (27.2)', contribution: 5, explanation: 'Slightly elevated BMI increases risk' },
    { feature: 'Family diabetes', contribution: 2, explanation: 'Minor genetic risk factor' }
  ];

  const modelComparison = [
    { name: 'Random Forest', prediction: 26, confidence: 92 },
    { name: 'XGBoost', prediction: 29, confidence: 96 },
    { name: 'Neural Network', prediction: 30, confidence: 91 },
    { name: 'Ensemble Average', prediction: 28, confidence: 94 }
  ];

  const questionnaireResponses = {
    demographics: [
      { question: 'Age', answer: '28 years old' },
      { question: 'Gender', answer: 'Male' },
      { question: 'Occupation', answer: 'Software Engineer' },
      { question: 'Location', answer: 'Austin, TX' },
      { question: 'Education', answer: "Bachelor's Degree" }
    ],
    health: [
      { question: 'Height', answer: '5\'10" (178 cm)' },
      { question: 'Weight', answer: '180 lbs (82 kg)' },
      { question: 'BMI', answer: '27.2 (Calculated)', flag: 'slightly_high' },
      { question: 'Smoking Status', answer: 'Never smoked' },
      { question: 'Alcohol Consumption', answer: 'Occasional (1-2 drinks/week)' },
      { question: 'Medical Conditions', answer: 'None reported' },
      { question: 'Current Medications', answer: 'None' }
    ],
    lifestyle: [
      { question: 'Exercise Frequency', answer: '3-4 times per week' },
      { question: 'Exercise Type', answer: 'Cardio, Weight training' },
      { question: 'Sleep Hours', answer: '7-8 hours per night' },
      { question: 'Stress Level', answer: 'Moderate (5/10)' },
      { question: 'Diet Quality', answer: 'Good - Balanced diet' },
      { question: 'Wearable Device', answer: 'Apple Watch (connected)' }
    ],
    financial: [
      { question: 'Desired Coverage', answer: '$500,000' },
      { question: 'Policy Term', answer: '30 years' },
      { question: 'Annual Income', answer: '$75,000-$100,000' },
      { question: 'Existing Debt', answer: 'Mortgage: $200,000' },
      { question: 'Dependents', answer: 'Spouse, 1 child' },
      { question: 'Budget Preference', answer: '$50-100/month' }
    ]
  };

  const improvementSuggestions = [
    {
      category: 'Health',
      suggestion: 'Reduce BMI to normal range (18.5-24.9)',
      potentialImpact: 'Could reduce premium by 8-12%',
      timeline: '6-12 months',
      resources: ['Diet planning tools', 'Exercise tracker integration']
    },
    {
      category: 'Lifestyle',
      suggestion: 'Increase exercise frequency to 5 days/week',
      potentialImpact: 'Could reduce premium by 3-5%',
      timeline: '3-6 months',
      resources: ['Fitness goal tracker', 'Workout recommendations']
    }
  ];

  const fairnessMetrics = [
    {
      metric: 'Demographic Parity',
      value: 0.02,
      threshold: 0.05,
      status: 'PASS',
      explanation: 'Risk predictions are consistent across demographic groups'
    },
    {
      metric: 'Equalized Odds',
      value: 0.03,
      threshold: 0.05,
      status: 'PASS',
      explanation: 'Prediction accuracy is equal across protected groups'
    },
    {
      metric: 'Calibration',
      value: 0.98,
      threshold: 0.95,
      status: 'PASS',
      explanation: 'Predicted probabilities match actual outcomes'
    }
  ];

  const tabs = [
    { id: 'risk_factors', name: 'Risk Factor Analysis', icon: Target },
    { id: 'ai_explanations', name: 'AI Model Explanations', icon: Brain },
    { id: 'responses', name: 'Questionnaire Responses', icon: FileText },
    { id: 'bias_check', name: 'Bias & Fairness Check', icon: Shield }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const renderRiskFactorsTab = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Risk Breakdown</h4>
          <div className="space-y-4">
            {riskFactors.map((factor, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-medium text-gray-900">{factor.name}</h5>
                  <span className={`text-sm font-bold px-2 py-1 rounded ${
                    factor.impactType === 'positive' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'
                  }`}>
                    {factor.impactScore > 0 ? '+' : ''}{factor.impactScore}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{factor.explanation}</p>
                <div className="space-y-1">
                  {factor.factors.map((item, idx) => (
                    <div key={idx} className="text-xs text-gray-500 flex items-center">
                      <div className="w-1 h-1 bg-gray-400 rounded-full mr-2"></div>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Risk Reduction Opportunities</h4>
          <div className="space-y-4">
            {improvementSuggestions.map((suggestion, index) => (
              <div key={index} className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <TrendingUp className="w-5 h-5 text-yellow-600 mt-1" />
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-900">{suggestion.category}</h5>
                    <p className="text-sm text-gray-700 mt-1">{suggestion.suggestion}</p>
                    <div className="mt-2 space-y-1">
                      <p className="text-xs text-green-700 font-medium">{suggestion.potentialImpact}</p>
                      <p className="text-xs text-gray-600">Timeline: {suggestion.timeline}</p>
                    </div>
                    <div className="mt-2">
                      <p className="text-xs text-gray-600 mb-1">Resources:</p>
                      <div className="flex flex-wrap gap-1">
                        {suggestion.resources.map((resource, idx) => (
                          <span key={idx} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            {resource}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderAIExplanationsTab = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
          <h4 className="text-lg font-semibold text-blue-900 mb-4">SHAP Value Analysis</h4>
          <p className="text-blue-800 text-sm mb-4">
            SHAP (SHapley Additive exPlanations) values show how each feature contributes to your final premium.
          </p>
          
          <div className="space-y-3">
            {featureContributions.map((feature, index) => (
              <div key={index} className="bg-white rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900">{feature.feature}</span>
                  <span className={`text-sm font-bold ${feature.contribution > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {feature.contribution > 0 ? '+' : ''}{feature.contribution}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                  <div 
                    className={`h-2 rounded-full ${feature.contribution > 0 ? 'bg-red-500' : 'bg-green-500'}`}
                    style={{ width: `${Math.abs(feature.contribution) * 2}%` }}
                  />
                </div>
                <p className="text-xs text-gray-600">{feature.explanation}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
          <h4 className="text-lg font-semibold text-green-900 mb-4">Model Performance Metrics</h4>
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">Prediction Accuracy</span>
                <span className="text-sm font-bold text-green-600">78.3%</span>
              </div>
              <div className="text-xs text-gray-600 mt-1">Industry: 65%</div>
            </div>
            
            <div className="bg-white rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">Confidence Score</span>
                <span className="text-sm font-bold text-green-600">94.2%</span>
              </div>
              <div className="text-xs text-gray-600 mt-1">Threshold: 85%</div>
            </div>
            
            <div className="bg-white rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">Processing Time</span>
                <span className="text-sm font-bold text-green-600">2.1 seconds</span>
              </div>
              <div className="text-xs text-gray-600 mt-1">Target: &lt;3 seconds</div>
            </div>
            
            <div className="bg-white rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">Bias Score</span>
                <span className="text-sm font-bold text-green-600">0.02</span>
              </div>
              <div className="text-xs text-gray-600 mt-1">Threshold: &lt;0.05</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Model Consensus</h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {modelComparison.map((model, index) => (
            <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
              <h5 className="font-medium text-gray-900 mb-2">{model.name}</h5>
              <p className="text-2xl font-bold text-blue-600">{model.prediction}</p>
              <p className="text-sm text-gray-600">{model.confidence}% confidence</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <button 
          onClick={() => setShowExplanation(!showExplanation)}
          className="flex items-center justify-between w-full text-left"
        >
          <h4 className="text-lg font-semibold text-gray-900">Detailed Model Explanation</h4>
          {showExplanation ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
        
        {showExplanation && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h5 className="font-semibold text-gray-900 mb-2">Models Used</h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Random Forest (baseline)</li>
                  <li>• XGBoost (primary)</li>
                  <li>• Neural Network (complex patterns)</li>
                  <li>• Ensemble voting</li>
                </ul>
              </div>
              
              <div>
                <h5 className="font-semibold text-gray-900 mb-2">Data Sources</h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Personal information</li>
                  <li>• Health records</li>
                  <li>• Lifestyle factors</li>
                  <li>• Actuarial tables</li>
                </ul>
              </div>
              
              <div>
                <h5 className="font-semibold text-gray-900 mb-2">Confidence Metrics</h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Prediction certainty: 95%</li>
                  <li>• Cross-validation score: 0.89</li>
                  <li>• Feature importance: High</li>
                  <li>• Model agreement: 92%</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderResponsesTab = () => (
    <div className="space-y-8">
      {Object.entries(questionnaireResponses).map(([section, responses]) => (
        <div key={section} className="bg-white border border-gray-200 rounded-xl p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 capitalize">
            {section.replace(/([A-Z])/g, ' $1').trim()} Assessment
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {responses.map((response, index) => (
              <div key={index} className="flex justify-between items-start p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{response.question}</p>
                  <p className="text-sm text-gray-600 mt-1">{response.answer}</p>
                </div>
                {response.flag && (
                  <span className="ml-2 px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                    {response.flag.replace('_', ' ')}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const renderBiasCheckTab = () => (
    <div className="space-y-8">
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-green-100 rounded-lg">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Algorithmic Fairness Assessment</h3>
            <p className="text-sm text-green-600 font-medium">PASSED - All fairness tests completed successfully</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {fairnessMetrics.map((metric, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{metric.metric}</h4>
                <span className={`px-2 py-1 text-xs font-bold rounded ${
                  metric.status === 'PASS' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {metric.status}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Value:</span>
                  <span className="font-medium">{metric.value}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Threshold:</span>
                  <span className="font-medium">{metric.threshold}</span>
                </div>
                <p className="text-xs text-gray-600 mt-2">{metric.explanation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Protected Attribute Analysis</h4>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h5 className="font-medium text-gray-900 mb-2">Age</h5>
              <p className="text-sm text-gray-600 mb-2">Value: 28</p>
              <p className="text-xs text-gray-600">Considered fairly within actuarial standards</p>
              <span className="inline-block mt-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded">PASS</span>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h5 className="font-medium text-gray-900 mb-2">Gender</h5>
              <p className="text-sm text-gray-600 mb-2">Value: Male</p>
              <p className="text-xs text-gray-600">Biological risk factors considered, not discriminatory</p>
              <span className="inline-block mt-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded">PASS</span>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h5 className="font-medium text-gray-900 mb-2">Location</h5>
              <p className="text-sm text-gray-600 mb-2">Value: Austin, TX</p>
              <p className="text-xs text-gray-600">Geographic risk factors based on objective data</p>
              <span className="inline-block mt-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded">PASS</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Bias Mitigation Techniques Applied</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm text-gray-700">Adversarial debiasing during model training</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm text-gray-700">Fairness constraints in optimization</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm text-gray-700">Post-processing calibration adjustments</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm text-gray-700">Regular audit with diverse test data</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/dashboard/assessments"
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Assessments</span>
          </Link>
          <div className="h-6 border-l border-gray-300"></div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Assessment Details</h1>
            <p className="text-gray-600">Dashboard &gt; Assessments &gt; Assessment #{assessment.id}</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Download className="w-4 h-4" />
            <span>Download Report</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
            <Share2 className="w-4 h-4" />
            <span>Share Results</span>
          </button>
          <Link
            to="/dashboard/assessment/new"
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            <FileText className="w-4 h-4" />
            <span>Start New Assessment</span>
          </Link>
        </div>
      </div>

      {/* Assessment Info */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Date Completed</p>
            <p className="font-semibold text-gray-900">{assessment.dateCompleted}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Time Taken</p>
            <p className="font-semibold text-gray-900">{assessment.timeTaken}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Assessment Type</p>
            <p className="font-semibold text-gray-900">{assessment.assessmentType}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Status</p>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <CheckCircle className="w-3 h-3 mr-1" />
              {assessment.status}
            </span>
          </div>
        </div>
      </div>

      {/* Results Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                  strokeDasharray={`${(assessment.riskScore / 100) * 251.2} 251.2`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-900">{assessment.riskScore}</span>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Overall Risk Score</h3>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              <Target className="w-4 h-4 mr-1" />
              {assessment.riskCategory}
            </span>
            <p className="text-sm text-gray-600 mt-2">
              {assessment.comparison.improvement} points better than industry average
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Recommended Premium</h3>
            <p className="text-3xl font-bold text-blue-600 mb-1">{formatCurrency(assessment.premiumEstimate)}</p>
            <p className="text-sm text-gray-600">monthly</p>
            <p className="text-sm text-green-600 font-medium mt-2">
              {assessment.comparison.savings}% below market average
            </p>
            <p className="text-xs text-gray-500 mt-1">{assessment.confidence}% accuracy</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Model Confidence</h3>
            <p className="text-3xl font-bold text-purple-600 mb-1">{assessment.confidence}%</p>
            <div className="text-sm text-gray-600 space-y-1">
              <p>Models: Random Forest, XGBoost, Neural Network</p>
              <p>Processing: {assessment.processingTime}</p>
              <p className="text-green-600 font-medium">{assessment.biasCheck}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Analysis Tabs */}
      <div className="bg-white rounded-xl shadow-lg">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'risk_factors' && renderRiskFactorsTab()}
          {activeTab === 'ai_explanations' && renderAIExplanationsTab()}
          {activeTab === 'responses' && renderResponsesTab()}
          {activeTab === 'bias_check' && renderBiasCheckTab()}
        </div>
      </div>

      {/* Comparison Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">How You Compare</h3>
          <div className="text-center mb-4">
            <p className="text-sm text-gray-600">Users with similar age, health, and lifestyle</p>
            <div className="flex items-center justify-center space-x-4 mt-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{assessment.riskScore}</p>
                <p className="text-sm text-gray-600">Your Score</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-400">{assessment.comparison.industryAverage}</p>
                <p className="text-sm text-gray-600">Peer Average</p>
              </div>
            </div>
            <p className="text-sm text-green-600 font-medium mt-2">Top 25% of similar profiles</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Traditional vs AI Comparison</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Traditional Estimate:</span>
              <span className="text-lg font-semibold text-red-600">{formatCurrency(assessment.comparison.traditionalEstimate)}/month</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">AI Estimate:</span>
              <span className="text-lg font-semibold text-green-600">{formatCurrency(assessment.comparison.aiEstimate)}/month</span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-gray-200">
              <span className="text-gray-700 font-medium">Your Savings:</span>
              <span className="text-xl font-bold text-green-600">{assessment.comparison.savings}% lower</span>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              AI considers 200+ factors vs traditional 15-20 factors, resulting in 11x more accurate pricing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentDetailsPage;