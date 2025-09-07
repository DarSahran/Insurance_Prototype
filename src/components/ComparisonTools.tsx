import React from 'react';
import { Clock, Target, Shield, Brain, TrendingUp, AlertTriangle } from 'lucide-react';

interface ComparisonToolsProps {
  // Add props as needed
}

const ComparisonTools: React.FC<ComparisonToolsProps> = () => {
  const comparisonData = [
    {
      metric: 'Processing Time',
      traditional: '2-4 weeks',
      ai: 'Under 5 minutes',
      improvement: '95% faster',
      icon: Clock,
      traditionalColor: 'text-red-600',
      aiColor: 'text-green-600'
    },
    {
      metric: 'Prediction Accuracy',
      traditional: '7-10%',
      ai: '78%',
      improvement: '680% more accurate',
      icon: Target,
      traditionalColor: 'text-red-600',
      aiColor: 'text-green-600'
    },
    {
      metric: 'Data Points Analyzed',
      traditional: '10-20',
      ai: '200+',
      improvement: '10x more data',
      icon: Brain,
      traditionalColor: 'text-red-600',
      aiColor: 'text-green-600'
    },
    {
      metric: 'Bias Detection',
      traditional: 'Manual review',
      ai: 'Automated algorithms',
      improvement: 'Real-time monitoring',
      icon: Shield,
      traditionalColor: 'text-red-600',
      aiColor: 'text-green-600'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Traditional vs AI-Powered Underwriting
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Experience the revolutionary difference in accuracy, speed, and fairness with AI-driven insurance assessment
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Traditional Underwriting */}
        <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
          <div className="text-center mb-8">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900">Traditional Underwriting</h3>
            <p className="text-gray-600 mt-2">Manual, time-consuming, limited accuracy</p>
          </div>

          <div className="space-y-6">
            {comparisonData.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                <div className="flex items-center space-x-3">
                  <item.icon className="w-5 h-5 text-gray-500" />
                  <span className="font-medium text-gray-900">{item.metric}</span>
                </div>
                <span className={`font-semibold ${item.traditionalColor}`}>
                  {item.traditional}
                </span>
              </div>
            ))}

            <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="font-semibold text-red-900 mb-2">Limitations</h4>
              <ul className="text-sm text-red-800 space-y-1">
                <li>• Limited data sources and analysis</li>
                <li>• Potential for human bias</li>
                <li>• Inconsistent decision-making</li>
                <li>• High operational costs</li>
                <li>• Poor customer experience</li>
              </ul>
            </div>
          </div>
        </div>

        {/* AI-Powered Underwriting */}
        <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-8 border border-blue-200">
          <div className="text-center mb-8">
            <Brain className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900">AI-Powered Underwriting</h3>
            <p className="text-gray-600 mt-2">Intelligent, fast, highly accurate</p>
          </div>

          <div className="space-y-6">
            {comparisonData.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-white rounded-lg border border-blue-200">
                <div className="flex items-center space-x-3">
                  <item.icon className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-gray-900">{item.metric}</span>
                </div>
                <span className={`font-semibold ${item.aiColor}`}>
                  {item.ai}
                </span>
              </div>
            ))}

            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Advantages</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Comprehensive data analysis</li>
                <li>• Automated bias detection</li>
                <li>• Consistent, explainable decisions</li>
                <li>• Reduced operational costs</li>
                <li>• Exceptional customer experience</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Improvement Metrics */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
        <h3 className="text-2xl font-bold text-center mb-8">The AI Advantage</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {comparisonData.map((item, index) => (
            <div key={index} className="text-center">
              <item.icon className="w-8 h-8 mx-auto mb-3 opacity-90" />
              <div className="text-sm opacity-90 mb-1">{item.metric}</div>
              <div className="text-xl font-bold">{item.improvement}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Comparison Table */}
      <div className="mt-12 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="px-8 py-6 bg-gray-50 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">Detailed Feature Comparison</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Feature</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-red-600">Traditional</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-blue-600">AI-Powered</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Impact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 font-medium text-gray-900">Application Processing</td>
                <td className="px-6 py-4 text-center text-red-600">Manual review required</td>
                <td className="px-6 py-4 text-center text-green-600">Instant automated processing</td>
                <td className="px-6 py-4 text-center text-sm text-gray-600">95% faster</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">Risk Assessment</td>
                <td className="px-6 py-4 text-center text-red-600">Basic actuarial tables</td>
                <td className="px-6 py-4 text-center text-green-600">ML models + comprehensive data</td>
                <td className="px-6 py-4 text-center text-sm text-gray-600">680% more accurate</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-medium text-gray-900">Transparency</td>
                <td className="px-6 py-4 text-center text-red-600">Black box decisions</td>
                <td className="px-6 py-4 text-center text-green-600">Explainable AI with SHAP</td>
                <td className="px-6 py-4 text-center text-sm text-gray-600">Full transparency</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">Bias Detection</td>
                <td className="px-6 py-4 text-center text-red-600">Periodic manual audits</td>
                <td className="px-6 py-4 text-center text-green-600">Real-time automated monitoring</td>
                <td className="px-6 py-4 text-center text-sm text-gray-600">Continuous fairness</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-medium text-gray-900">Customer Experience</td>
                <td className="px-6 py-4 text-center text-red-600">Lengthy, frustrating</td>
                <td className="px-6 py-4 text-center text-green-600">Fast, engaging, transparent</td>
                <td className="px-6 py-4 text-center text-sm text-gray-600">4.5/5 satisfaction</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ComparisonTools;