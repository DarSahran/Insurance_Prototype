import React from 'react';
import { CheckCircle, Loader, TrendingUp, DollarSign, Shield, Sparkles } from 'lucide-react';

interface AIAnalysisStepProps {
  processing: boolean;
  data: any;
}

const AIAnalysisStep: React.FC<AIAnalysisStepProps> = ({ processing, data }) => {
  if (processing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] space-y-6">
        <div className="relative">
          <div className="w-24 h-24 border-4 border-blue-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-24 h-24 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
        </div>

        <div className="text-center space-y-2">
          <h3 className="text-2xl font-bold text-gray-900">Analyzing Your Profile</h3>
          <p className="text-gray-600">Our AI is processing your information...</p>
        </div>

        <div className="space-y-3 max-w-md">
          <div className="flex items-center space-x-3 text-gray-700">
            <Loader className="w-5 h-5 animate-spin text-blue-600" />
            <span>Calculating risk factors</span>
          </div>
          <div className="flex items-center space-x-3 text-gray-700">
            <Loader className="w-5 h-5 animate-spin text-blue-600" />
            <span>Estimating premium rates</span>
          </div>
          <div className="flex items-center space-x-3 text-gray-700">
            <Loader className="w-5 h-5 animate-spin text-blue-600" />
            <span>Generating personalized recommendations</span>
          </div>
        </div>
      </div>
    );
  }

  const { aiAnalysis, riskScore, premiumEstimate } = data;

  return (
    <div className="space-y-6">
      {/* Success Header */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Analysis Complete!</h2>
            <p className="text-gray-600 mt-1">
              Your personalized insurance profile is ready
            </p>
          </div>
        </div>
      </div>

      {/* Results Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8 text-blue-600" />
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
              riskScore < 40
                ? 'bg-green-100 text-green-800'
                : riskScore < 70
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {riskScore < 40 ? 'Low Risk' : riskScore < 70 ? 'Medium Risk' : 'High Risk'}
            </span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-2">{riskScore}/100</h3>
          <p className="text-sm text-gray-600">Risk Score</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="w-8 h-8 text-green-600" />
            <Sparkles className="w-6 h-6 text-yellow-500" />
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-2">₹{premiumEstimate}</h3>
          <p className="text-sm text-gray-600">Estimated Monthly Premium</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <Shield className="w-8 h-8 text-indigo-600" />
            <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-semibold">
              {aiAnalysis?.confidence || 95}%
            </span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-2">High</h3>
          <p className="text-sm text-gray-600">AI Confidence Score</p>
        </div>
      </div>

      {/* Recommendations */}
      {aiAnalysis?.recommendations && aiAnalysis.recommendations.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Recommendations</h3>
          <div className="space-y-3">
            {aiAnalysis.recommendations.map((rec: any, index: number) => (
              <div
                key={index}
                className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg border border-blue-100"
              >
                <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-gray-900 font-medium">{rec.text}</p>
                  <span className={`inline-block mt-1 px-2 py-1 rounded text-xs font-semibold ${
                    rec.impact === 'High'
                      ? 'bg-red-100 text-red-800'
                      : rec.impact === 'Medium'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {rec.impact} Impact
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Next Steps */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
        <h3 className="text-lg font-bold text-gray-900 mb-3">What's Next?</h3>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start space-x-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>Review your personalized insurance recommendations</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>Compare policies from top providers</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>Get instant quotes and apply online</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AIAnalysisStep;
