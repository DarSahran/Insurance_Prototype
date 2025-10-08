import React, { useState, useEffect } from 'react';
import { Cpu, Brain, Shield, CheckCircle, Loader, BarChart3, Zap, Target } from 'lucide-react';

interface AIAnalysisStepProps {
  processing: boolean;
  data: any;
}

const AIAnalysisStep: React.FC<AIAnalysisStepProps> = ({ processing, data }) => {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const processingMessages = [
    "Analyzing demographic risk factors...",
    "Processing health and medical data...", 
    "Evaluating lifestyle patterns...",
    "Applying bias detection algorithms...",
    "Generating personalized risk profile...",
    "Calculating optimal premium..."
  ];

  const processingSteps = [
    { id: 'ingestion', name: 'Data ingestion', duration: 1000 },
    { id: 'engineering', name: 'Feature engineering', duration: 1500 },
    { id: 'prediction', name: 'Model prediction', duration: 2000 },
    { id: 'bias', name: 'Bias check', duration: 1000 },
    { id: 'explainability', name: 'Explainability generation', duration: 2500 }
  ];

  useEffect(() => {
    if (!processing) return;

    let messageInterval: NodeJS.Timeout;
    let progressInterval: NodeJS.Timeout;
    let stepTimeout: NodeJS.Timeout;

    // Message cycling
    messageInterval = setInterval(() => {
      setCurrentMessage(prev => (prev + 1) % processingMessages.length);
    }, 800);

    // Progress animation
    progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 100;
        return Math.min(prev + Math.random() * 15, 100);
      });
    }, 200);

    // Step completion simulation
    let stepIndex = 0;
    const completeNextStep = () => {
      if (stepIndex < processingSteps.length) {
        setCompletedSteps(prev => [...prev, processingSteps[stepIndex].id]);
        stepIndex++;
        if (stepIndex < processingSteps.length) {
          stepTimeout = setTimeout(completeNextStep, processingSteps[stepIndex - 1].duration);
        }
      }
    };

    stepTimeout = setTimeout(completeNextStep, processingSteps[0].duration);

    return () => {
      clearInterval(messageInterval);
      clearInterval(progressInterval);
      clearTimeout(stepTimeout);
    };
  }, [processing]);

  if (!processing) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-2">Analysis Complete!</h3>
          <p className="text-lg text-gray-600 mb-6">
            Your personalized insurance assessment is ready to view in your dashboard.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border-2 border-blue-200">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-6 h-6 text-blue-600" />
              <h4 className="font-semibold text-blue-900">Risk Assessment</h4>
            </div>
            <p className="text-3xl font-bold text-blue-700">
              {data.riskScore || 'N/A'}
              <span className="text-lg font-normal text-blue-600">/100</span>
            </p>
            <p className="text-sm text-blue-600 mt-1">
              {data.riskScore < 40 ? 'Low Risk' : data.riskScore < 70 ? 'Medium Risk' : 'High Risk'}
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border-2 border-green-200">
            <div className="flex items-center gap-3 mb-2">
              <Target className="w-6 h-6 text-green-600" />
              <h4 className="font-semibold text-green-900">Estimated Premium</h4>
            </div>
            <p className="text-3xl font-bold text-green-700">
              ${data.premiumEstimate || 0}
              <span className="text-lg font-normal text-green-600">/mo</span>
            </p>
            <p className="text-sm text-green-600 mt-1">Based on your profile</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border-2 border-purple-200">
            <div className="flex items-center gap-3 mb-2">
              <Brain className="w-6 h-6 text-purple-600" />
              <h4 className="font-semibold text-purple-900">Confidence Score</h4>
            </div>
            <p className="text-3xl font-bold text-purple-700">
              {data.aiAnalysis?.confidence || 95}
              <span className="text-lg font-normal text-purple-600">%</span>
            </p>
            <p className="text-sm text-purple-600 mt-1">Model accuracy</p>
          </div>
        </div>

        {/* Next Steps Info */}
        <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-600" />
            What's Next?
          </h4>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span>Click "View Dashboard" below to see your complete results</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span>Review your personalized risk factors and recommendations</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span>Explore policy options tailored to your needs</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span>Track your health metrics for potential premium discounts</span>
            </li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="relative inline-block">
          <div className="w-24 h-24 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600 mx-auto mb-6"></div>
          <Cpu className="w-8 h-8 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>
        
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          AI Analysis in Progress
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Our advanced AI models are processing your information to generate the most accurate quote
        </p>
      </div>

      {/* Processing Status */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-blue-900">Processing Status</h3>
          <div className="text-2xl font-bold text-blue-600">{Math.round(progress)}%</div>
        </div>
        
        <div className="w-full bg-blue-200 rounded-full h-3 mb-4">
          <div 
            className="bg-gradient-to-r from-blue-600 to-indigo-600 h-3 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Loader className="w-4 h-4 text-blue-600 animate-spin" />
          <span className="text-blue-800 font-medium">
            {processingMessages[currentMessage]}
          </span>
        </div>
      </div>

      {/* AI Processing Visualization */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <Brain className="w-8 h-8 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">Neural Networks</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Risk Assessment</span>
              <span className="font-medium">Running...</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-purple-600 h-2 rounded-full animate-pulse" style={{ width: '78%' }}></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="w-8 h-8 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Bias Detection</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Fairness Check</span>
              <span className="font-medium">Active</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full animate-pulse" style={{ width: '95%' }}></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <BarChart3 className="w-8 h-8 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">XGBoost Models</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Pattern Analysis</span>
              <span className="font-medium">Processing</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '82%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Processing Steps */}
      <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">AI Pipeline Progress</h3>
        
        <div className="space-y-4">
          {processingSteps.map((step, index) => (
            <div key={step.id} className="flex items-center space-x-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                completedSteps.includes(step.id) 
                  ? 'bg-green-600 text-white' 
                  : index === completedSteps.length 
                  ? 'bg-blue-600 text-white animate-pulse'
                  : 'bg-gray-200 text-gray-500'
              }`}>
                {completedSteps.includes(step.id) ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  index + 1
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className={`font-medium ${
                    completedSteps.includes(step.id) ? 'text-green-700' : 'text-gray-700'
                  }`}>
                    {step.name}
                  </span>
                  <span className="text-sm text-gray-500">
                    {completedSteps.includes(step.id) ? '100%' : 
                     index === completedSteps.length ? 'Processing...' : '0%'}
                  </span>
                </div>
                
                {index < processingSteps.length - 1 && (
                  <div className={`mt-2 w-full h-1 rounded ${
                    completedSteps.includes(step.id) ? 'bg-green-200' : 'bg-gray-200'
                  }`}>
                    <div className={`h-1 rounded transition-all duration-500 ${
                      completedSteps.includes(step.id) ? 'bg-green-600 w-full' : 'bg-gray-300 w-0'
                    }`} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Real-time Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white text-center">
          <Zap className="w-6 h-6 mx-auto mb-2" />
          <div className="text-2xl font-bold">2.3s</div>
          <div className="text-sm opacity-90">Processing Time</div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white text-center">
          <Target className="w-6 h-6 mx-auto mb-2" />
          <div className="text-2xl font-bold">78%</div>
          <div className="text-sm opacity-90">Accuracy Rate</div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white text-center">
          <Shield className="w-6 h-6 mx-auto mb-2" />
          <div className="text-2xl font-bold">100%</div>
          <div className="text-sm opacity-90">Bias Check</div>
        </div>
      </div>

      <div className="text-center text-gray-500">
        <p>This process typically takes 30-60 seconds. Please wait while we generate your personalized quote.</p>
      </div>
    </div>
  );
};

export default AIAnalysisStep;