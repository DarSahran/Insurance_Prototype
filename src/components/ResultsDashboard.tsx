import React, { useState, useEffect } from 'react';
import { ArrowLeft, Download, Share2, MessageCircle, TrendingDown, TrendingUp, Target, Shield, Eye, Lightbulb, ChevronDown, ChevronUp, Star, AlertTriangle } from 'lucide-react';

interface ResultsDashboardProps {
  userData: any;
  onBackToHome: () => void;
}

const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ userData, onBackToHome }) => {
  const [selectedTab, setSelectedTab] = useState('quote');
  const [showExplanation, setShowExplanation] = useState(false);
  const [animatedValues, setAnimatedValues] = useState({ riskScore: 0, premium: 0, savings: 0 });

  // Simulate risk assessment based on user data
  const calculateRiskProfile = () => {
    let baseRisk = 30;
    
    // Age factor
    const age = userData.demographics?.dateOfBirth ? 
      new Date().getFullYear() - new Date(userData.demographics.dateOfBirth).getFullYear() : 30;
    if (age < 25) baseRisk += 5;
    else if (age > 50) baseRisk += 10;
    else if (age > 65) baseRisk += 20;
    
    // Health factors
    const conditions = userData.health?.medicalConditions || [];
    baseRisk += conditions.length * 8;
    
    if (userData.health?.smokingStatus === 'current') baseRisk += 25;
    else if (userData.health?.smokingStatus === 'former') baseRisk += 10;
    
    // Lifestyle factors
    if (userData.lifestyle?.exerciseFrequency < 2) baseRisk += 8;
    else if (userData.lifestyle?.exerciseFrequency >= 4) baseRisk -= 5;
    
    if (userData.lifestyle?.stressLevel > 7) baseRisk += 6;
    else if (userData.lifestyle?.stressLevel < 4) baseRisk -= 3;
    
    return Math.min(Math.max(baseRisk, 5), 95);
  };

  const riskScore = calculateRiskProfile();
  const coverageAmount = userData.financial?.coverageAmount || 250000;
  const monthlyPremium = Math.round((riskScore * 0.8 + (coverageAmount / 10000)) * 1.2);
  const traditionalPremium = Math.round(monthlyPremium * 1.4);
  const savingsPercent = Math.round(((traditionalPremium - monthlyPremium) / traditionalPremium) * 100);

  useEffect(() => {
    const animateValues = () => {
      let currentRisk = 0, currentPremium = 0, currentSavings = 0;
      
      const interval = setInterval(() => {
        if (currentRisk < riskScore) currentRisk += 2;
        if (currentPremium < monthlyPremium) currentPremium += 5;
        if (currentSavings < savingsPercent) currentSavings += 2;
        
        setAnimatedValues({
          riskScore: Math.min(currentRisk, riskScore),
          premium: Math.min(currentPremium, monthlyPremium),
          savings: Math.min(currentSavings, savingsPercent)
        });
        
        if (currentRisk >= riskScore && currentPremium >= monthlyPremium && currentSavings >= savingsPercent) {
          clearInterval(interval);
        }
      }, 50);
      
      return () => clearInterval(interval);
    };
    
    const timer = setTimeout(animateValues, 500);
    return () => clearTimeout(timer);
  }, [riskScore, monthlyPremium, savingsPercent]);

  const getRiskCategory = (score: number) => {
    if (score <= 30) return { category: 'Low Risk', color: 'text-green-600', bgColor: 'bg-green-100', borderColor: 'border-green-200' };
    if (score <= 70) return { category: 'Medium Risk', color: 'text-yellow-600', bgColor: 'bg-yellow-100', borderColor: 'border-yellow-200' };
    return { category: 'High Risk', color: 'text-red-600', bgColor: 'bg-red-100', borderColor: 'border-red-200' };
  };

  const riskCategory = getRiskCategory(riskScore);

  const riskFactors = [
    { name: 'Age', impact: age < 35 ? -5 : age > 50 ? 15 : 5, description: 'Younger age reduces risk' },
    { name: 'Health Conditions', impact: (userData.health?.medicalConditions?.length || 0) * 8, description: 'Pre-existing conditions increase risk' },
    { name: 'Smoking Status', impact: userData.health?.smokingStatus === 'current' ? 25 : userData.health?.smokingStatus === 'former' ? 10 : -5, description: 'Non-smokers get lower rates' },
    { name: 'Exercise Frequency', impact: (userData.lifestyle?.exerciseFrequency || 0) >= 3 ? -8 : 5, description: 'Regular exercise reduces risk' },
    { name: 'Stress Level', impact: (userData.lifestyle?.stressLevel || 5) > 7 ? 10 : -3, description: 'Lower stress improves health outlook' },
    { name: 'Geographic Location', impact: Math.floor(Math.random() * 6) - 3, description: 'Local health and safety statistics' }
  ];

  const age = userData.demographics?.dateOfBirth ? 
    new Date().getFullYear() - new Date(userData.demographics.dateOfBirth).getFullYear() : 30;

  const improvementSuggestions = [
    ...(userData.health?.smokingStatus === 'current' ? [{ text: 'Quit smoking to reduce premiums by up to 50%', impact: 'High' }] : []),
    ...((userData.lifestyle?.exerciseFrequency || 0) < 3 ? [{ text: 'Increase exercise to 3+ times per week', impact: 'Medium' }] : []),
    ...((userData.lifestyle?.stressLevel || 5) > 7 ? [{ text: 'Consider stress management techniques', impact: 'Medium' }] : []),
    { text: 'Annual health checkups for preventive care', impact: 'Low' },
    { text: 'Connect wearable device for activity tracking discount', impact: 'Low' }
  ];

  const tabs = [
    { id: 'quote', name: 'Your Quote', icon: Target },
    { id: 'explanation', name: 'AI Explanation', icon: Eye },
    { id: 'comparison', name: 'Traditional vs AI', icon: TrendingUp }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <button 
              onClick={onBackToHome}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </button>
            
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                <Download className="w-5 h-5" />
                <span>Download Quote</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                <Share2 className="w-5 h-5" />
                <span>Share</span>
              </button>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Apply Now
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Banner */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Your Personalized Quote is Ready!</h2>
              <p className="text-gray-600">AI-powered analysis complete • Processed in 2.3 seconds • 95% confidence score</p>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-gray-600">Risk Score</div>
              <div className={`w-3 h-3 rounded-full ${riskCategory.bgColor.replace('bg-', 'bg-')}`}></div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {animatedValues.riskScore}/100
            </div>
            <div className={`text-sm font-medium ${riskCategory.color}`}>
              {riskCategory.category}
            </div>
            <div className={`mt-3 w-full ${riskCategory.bgColor} rounded-full h-2`}>
              <div 
                className={`h-2 rounded-full transition-all duration-1000 ease-out ${
                  riskScore <= 30 ? 'bg-green-500' :
                  riskScore <= 70 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${animatedValues.riskScore}%` }}
              />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-gray-600">Monthly Premium</div>
              <TrendingDown className="w-4 h-4 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              ${animatedValues.premium}
            </div>
            <div className="text-sm text-green-600 font-medium">
              {animatedValues.savings}% lower than traditional
            </div>
            <div className="mt-3 text-xs text-gray-500">
              Annual: ${animatedValues.premium * 12}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-gray-600">Coverage Amount</div>
              <Shield className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {formatCurrency(coverageAmount)}
            </div>
            <div className="text-sm text-gray-600">
              {userData.financial?.policyTerm || '20'} year term
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-gray-600">Confidence Score</div>
              <Star className="w-4 h-4 text-yellow-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              95%
            </div>
            <div className="text-sm text-gray-600">
              Model certainty
            </div>
            <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
              <div className="bg-yellow-500 h-2 rounded-full transition-all duration-1000" style={{ width: '95%' }}></div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                    selectedTab === tab.id
                      ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <tab.icon className="w-5 h-5" />
                    <span>{tab.name}</span>
                  </div>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-8">
            {selectedTab === 'quote' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Your Personalized Quote</h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className={`p-6 rounded-xl ${riskCategory.bgColor} ${riskCategory.borderColor} border-2`}>
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Risk Profile</h4>
                        
                        <div className="space-y-4">
                          {riskFactors.map((factor, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="font-medium text-gray-900">{factor.name}</div>
                                <div className="text-sm text-gray-600">{factor.description}</div>
                              </div>
                              <div className={`text-sm font-bold px-2 py-1 rounded ${
                                factor.impact > 0 ? 'text-red-600 bg-red-50' : 'text-green-600 bg-green-50'
                              }`}>
                                {factor.impact > 0 ? '+' : ''}{factor.impact}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Policy Recommendations</h4>
                        
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-700">Recommended Coverage:</span>
                            <span className="font-semibold">{formatCurrency(coverageAmount)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-700">Policy Term:</span>
                            <span className="font-semibold">{userData.financial?.policyTerm || '20'} years</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-700">Premium Type:</span>
                            <span className="font-semibold">Level term</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="bg-gradient-to-br from-green-50 to-blue-50 border border-green-200 rounded-xl p-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Your Savings</h4>
                        
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-700">AI-Optimized Premium:</span>
                            <span className="text-2xl font-bold text-green-600">${monthlyPremium}/month</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Traditional Premium:</span>
                            <span className="line-through text-gray-500">${traditionalPremium}/month</span>
                          </div>
                          <div className="flex items-center justify-between text-lg font-bold">
                            <span className="text-green-700">Monthly Savings:</span>
                            <span className="text-green-600">${traditionalPremium - monthlyPremium}</span>
                          </div>
                          <div className="text-center pt-4 border-t border-green-200">
                            <div className="text-sm text-gray-600">Annual savings:</div>
                            <div className="text-3xl font-bold text-green-600">
                              ${(traditionalPremium - monthlyPremium) * 12}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          <Lightbulb className="w-5 h-5 mr-2 text-yellow-600" />
                          Ways to Lower Your Premium
                        </h4>
                        
                        <div className="space-y-3">
                          {improvementSuggestions.map((suggestion, index) => (
                            <div key={index} className="flex items-start space-x-3">
                              <div className={`mt-1 w-2 h-2 rounded-full ${
                                suggestion.impact === 'High' ? 'bg-red-500' :
                                suggestion.impact === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                              }`}></div>
                              <div>
                                <div className="text-sm text-gray-900">{suggestion.text}</div>
                                <div className="text-xs text-gray-600">Impact: {suggestion.impact}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'explanation' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Why This Quote?</h3>
                  <p className="text-gray-600 mb-6">
                    Our AI uses explainable machine learning to provide transparent insights into your quote calculation.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                    <h4 className="text-lg font-semibold text-blue-900 mb-4">SHAP Value Analysis</h4>
                    <p className="text-blue-800 text-sm mb-4">
                      SHAP (SHapley Additive exPlanations) values show how each feature contributes to your final premium.
                    </p>
                    
                    <div className="space-y-3">
                      {riskFactors.slice(0, 4).map((factor, index) => (
                        <div key={index} className="bg-white rounded-lg p-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-gray-900">{factor.name}</span>
                            <span className={`text-sm font-bold ${factor.impact > 0 ? 'text-red-600' : 'text-green-600'}`}>
                              {factor.impact > 0 ? '+' : ''}{factor.impact}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${factor.impact > 0 ? 'bg-red-500' : 'bg-green-500'}`}
                              style={{ width: `${Math.abs(factor.impact) * 2}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
                    <h4 className="text-lg font-semibold text-green-900 mb-4">Fairness Assessment</h4>
                    <p className="text-green-800 text-sm mb-4">
                      Our bias detection algorithms ensure fair treatment across all demographic groups.
                    </p>
                    
                    <div className="space-y-4">
                      <div className="bg-white rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-900">Demographic Parity</span>
                          <span className="text-sm font-bold text-green-600">✓ Passed</span>
                        </div>
                        <div className="text-xs text-gray-600 mt-1">Similar profiles receive similar rates</div>
                      </div>
                      
                      <div className="bg-white rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-900">Equal Opportunity</span>
                          <span className="text-sm font-bold text-green-600">✓ Passed</span>
                        </div>
                        <div className="text-xs text-gray-600 mt-1">Fair treatment across protected groups</div>
                      </div>
                      
                      <div className="bg-white rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-900">Calibration</span>
                          <span className="text-sm font-bold text-green-600">✓ Passed</span>
                        </div>
                        <div className="text-xs text-gray-600 mt-1">Predictions are well-calibrated</div>
                      </div>
                    </div>
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
            )}

            {selectedTab === 'comparison' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Traditional vs AI-Powered Underwriting</h3>
                  <p className="text-gray-600">
                    See the revolutionary difference in accuracy, speed, and fairness.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <h4 className="text-xl font-semibold text-gray-900 mb-4">Traditional Underwriting</h4>
                    
                    <div className="space-y-6">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-700">Processing Time</span>
                          <span className="font-semibold text-red-600">2-4 weeks</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-red-500 h-2 rounded-full" style={{ width: '90%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-700">Prediction Accuracy</span>
                          <span className="font-semibold text-red-600">7-10%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-red-500 h-2 rounded-full" style={{ width: '10%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-700">Data Utilization</span>
                          <span className="font-semibold text-red-600">Limited</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-red-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-700">Bias Detection</span>
                          <span className="font-semibold text-red-600">Manual</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-red-500 h-2 rounded-full" style={{ width: '20%' }}></div>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-gray-300">
                        <div className="text-center">
                          <div className="text-sm text-gray-600">Your premium would be</div>
                          <div className="text-2xl font-bold text-red-600">${traditionalPremium}/month</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-xl p-6 border border-blue-200">
                    <h4 className="text-xl font-semibold text-blue-900 mb-4">AI-Powered Underwriting</h4>
                    
                    <div className="space-y-6">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-700">Processing Time</span>
                          <span className="font-semibold text-green-600">Under 5 minutes</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '95%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-700">Prediction Accuracy</span>
                          <span className="font-semibold text-green-600">78%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-700">Data Utilization</span>
                          <span className="font-semibold text-green-600">Comprehensive</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '95%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-700">Bias Detection</span>
                          <span className="font-semibold text-green-600">Automated</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-blue-300">
                        <div className="text-center">
                          <div className="text-sm text-gray-600">Your AI-optimized premium</div>
                          <div className="text-2xl font-bold text-green-600">${monthlyPremium}/month</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-xl p-8 text-white text-center">
                  <h4 className="text-2xl font-bold mb-4">Your AI Advantage</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <div className="text-3xl font-bold">{savingsPercent}%</div>
                      <div className="text-sm opacity-90">Lower Premium</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold">95%</div>
                      <div className="text-sm opacity-90">Faster Processing</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold">100%</div>
                      <div className="text-sm opacity-90">Bias-Free Assessment</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg font-semibold text-lg">
            Apply for This Policy
          </button>
          <button className="border border-gray-300 text-gray-700 px-8 py-4 rounded-xl hover:bg-gray-50 transition-colors font-semibold text-lg">
            Speak with an Agent
          </button>
          <button className="flex items-center justify-center space-x-2 border border-blue-300 text-blue-600 px-8 py-4 rounded-xl hover:bg-blue-50 transition-colors font-semibold text-lg">
            <MessageCircle className="w-5 h-5" />
            <span>Live Chat Support</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsDashboard;