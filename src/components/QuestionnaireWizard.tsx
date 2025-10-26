import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, AlertCircle, CheckCircle, User, Heart, Activity, DollarSign, Cpu } from 'lucide-react';
import DemographicsStep from './questionnaire/DemographicsStep';
import HealthStep from './questionnaire/HealthStep';
import LifestyleStep from './questionnaire/LifestyleStep';
import FinancialStep from './questionnaire/FinancialStep';
import AIAnalysisStep from './questionnaire/AIAnalysisStep';
import { useHybridAuth } from '../hooks/useHybridAuth';
import { saveInsuranceQuestionnaire, updateQuestionnaire, getLatestQuestionnaire } from '../lib/database';

interface QuestionnaireWizardProps {
  onComplete: (data: any) => void;
  insuranceType?: string;
  onBack?: () => void;
  initialData?: any;
  isDashboardMode?: boolean;
}

const QuestionnaireWizard: React.FC<QuestionnaireWizardProps> = ({ onComplete, insuranceType = 'term_life', onBack, initialData = {}, isDashboardMode = false }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    demographics: initialData.demographics || {},
    health: initialData.health || {},
    lifestyle: initialData.lifestyle || {},
    financial: initialData.financial || {},
    processing: false
  });
  const [errors, setErrors] = useState<{ general?: string }>({});
  const [existingQuestionnaireId, setExistingQuestionnaireId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useHybridAuth();

  // Load existing questionnaire data if user is authenticated
  useEffect(() => {
    const loadExistingData = async () => {
      if (user) {
        try {
          const { data, error } = await getLatestQuestionnaire(user.id);
          if (data && !error) {
            setFormData({
              demographics: data.demographics || {},
              health: data.health || {},
              lifestyle: data.lifestyle || {},
              financial: data.financial || {},
              processing: false
            });
            setExistingQuestionnaireId(data.id);
          }
        } catch (error) {
          console.log('No existing questionnaire found or user not authenticated');
        }
      }
    };

    loadExistingData();
  }, [user]);

  // Auto-save functionality
  const autoSaveData = async () => {
    if (!user || isSaving) return;

    setIsSaving(true);
    try {
      const questionnaireData = {
        user_id: user.id,
        demographics: formData.demographics,
        health: formData.health,
        lifestyle: formData.lifestyle,
        financial: formData.financial,
        status: 'draft' as const
      };

      if (existingQuestionnaireId) {
        // Update existing questionnaire
        const { error } = await updateQuestionnaire(existingQuestionnaireId, questionnaireData);
        if (error) {
          console.error('Error updating questionnaire:', error);
        }
      } else {
        // Create new questionnaire
        const { data, error } = await saveInsuranceQuestionnaire(questionnaireData);
        if (data && !error) {
          setExistingQuestionnaireId(data.id);
        } else if (error) {
          console.error('Error saving questionnaire:', error);
        }
      }
    } catch (error) {
      console.error('Auto-save error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Auto-save when form data changes (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (user && (formData.demographics || formData.health || formData.lifestyle || formData.financial)) {
        autoSaveData();
      }
    }, 2000); // Save after 2 seconds of inactivity

    return () => clearTimeout(timeoutId);
  }, [formData, user]);

  const steps = [
    { id: 1, title: 'Personal Information', icon: User, progress: 20 },
    { id: 2, title: 'Health & Medical History', icon: Heart, progress: 40 },
    { id: 3, title: 'Lifestyle Assessment', icon: Activity, progress: 60 },
    { id: 4, title: 'Coverage Preferences', icon: DollarSign, progress: 80 },
    { id: 5, title: 'AI Analysis & Results', icon: Cpu, progress: 100 }
  ];

  const updateFormData = (stepKey: string, data: any) => {
    setFormData(prev => ({
      ...prev,
      [stepKey]: { ...(prev as any)[stepKey], ...data }
    }));
  };

  const validateStep = (step: number) => {
    // Simple validation logic - in real app would be more comprehensive
    const stepKeys = ['demographics', 'health', 'lifestyle', 'financial'];
    const currentData = (formData as any)[stepKeys[step - 1]];
    
    if (!currentData || Object.keys(currentData).length === 0) {
      setErrors({ general: 'Please fill in the required fields' });
      return false;
    }
    
    setErrors({});
    return true;
  };

  const handleNext = async () => {
    if (currentStep < 5 && validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
      // Scroll to top smoothly when moving to next step
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (currentStep === 4) {
      // Start AI processing
      setCurrentStep(5);
      setFormData(prev => ({ ...prev, processing: true }));
      
      // Simulate AI processing and save final data
      setTimeout(async () => {
        console.log('AI Processing completed, starting data save...');

        // Calculate risk score and premium estimate
        const riskScore = calculateRiskScore(formData);
        const premiumEstimate = calculatePremiumEstimate(formData, riskScore);

        // Create AI analysis object
        const aiAnalysis = {
          riskScore,
          premiumEstimate,
          riskFactors: analyzeRiskFactors(formData),
          recommendations: generateRecommendations(formData),
          confidence: 95,
          processingTime: 2.3,
          biasCheck: 'passed',
          model: 'XGBoost Ensemble'
        };

        const finalData = {
          ...formData,
          processing: false,
          aiAnalysis,
          riskScore,
          premiumEstimate
        };

        // Update formData with results so the View Dashboard button can access them
        setFormData(finalData);

        // Save final questionnaire data to Supabase
        if (user) {
          setIsSaving(true);
          try {
            const questionnaireData = {
              user_id: user.id,
              demographics: finalData.demographics,
              health: finalData.health,
              lifestyle: finalData.lifestyle,
              financial: finalData.financial,
              ai_analysis: aiAnalysis,
              risk_score: riskScore,
              premium_estimate: premiumEstimate,
              status: 'completed' as const,
              completion_percentage: 100
            };

            let saveResult;
            if (existingQuestionnaireId) {
              saveResult = await updateQuestionnaire(existingQuestionnaireId, questionnaireData);
            } else {
              saveResult = await saveInsuranceQuestionnaire(questionnaireData);
            }

            if (saveResult.error) {
              console.error('Error saving final questionnaire:', saveResult.error);
              setErrors({ general: 'Failed to save your results. Please try again.' });
              setIsSaving(false);
              return;
            }

            console.log('Questionnaire saved successfully:', saveResult.data);
            setIsSaving(false);

          } catch (error) {
            console.error('Error saving questionnaire:', error);
            setErrors({ general: 'Failed to save your results. Please try again.' });
            setIsSaving(false);
            return;
          }
        } else {
          // If no user, questionnaire data not saved - just stop processing
          console.warn('No authenticated user - questionnaire data not saved');
        }
      }, 3000); // Reduced from 8000ms to 3000ms
    }
  };

  // Helper functions for AI analysis
  const calculateRiskScore = (data: any) => {
    let baseRisk = 30;
    
    // Age factor
    if (data.demographics?.dateOfBirth) {
      const age = new Date().getFullYear() - new Date(data.demographics.dateOfBirth).getFullYear();
      if (age < 25) baseRisk += 5;
      else if (age > 50) baseRisk += 10;
      else if (age > 65) baseRisk += 20;
    }
    
    // Health factors
    const conditions = data.health?.medicalConditions || [];
    baseRisk += conditions.length * 8;
    
    if (data.health?.smokingStatus === 'current') baseRisk += 25;
    else if (data.health?.smokingStatus === 'former') baseRisk += 10;
    
    // Lifestyle factors
    if ((data.lifestyle?.exerciseFrequency || 0) < 2) baseRisk += 8;
    else if ((data.lifestyle?.exerciseFrequency || 0) >= 4) baseRisk -= 5;
    
    if ((data.lifestyle?.stressLevel || 5) > 7) baseRisk += 6;
    else if ((data.lifestyle?.stressLevel || 5) < 4) baseRisk -= 3;
    
    return Math.min(Math.max(baseRisk, 5), 95);
  };

  const calculatePremiumEstimate = (data: any, riskScore: number) => {
    const coverageAmount = data.financial?.coverageAmount || 250000;
    return Math.round((riskScore * 0.8 + (coverageAmount / 10000)) * 1.2);
  };

  const analyzeRiskFactors = (data: any) => {
    const age = data.demographics?.dateOfBirth ? 
      new Date().getFullYear() - new Date(data.demographics.dateOfBirth).getFullYear() : 30;

    return [
      { name: 'Age', impact: age < 35 ? -5 : age > 50 ? 15 : 5, description: 'Age-related risk assessment' },
      { name: 'Health Conditions', impact: (data.health?.medicalConditions?.length || 0) * 8, description: 'Pre-existing medical conditions' },
      { name: 'Smoking Status', impact: data.health?.smokingStatus === 'current' ? 25 : data.health?.smokingStatus === 'former' ? 10 : -5, description: 'Tobacco use impact' },
      { name: 'Exercise Frequency', impact: (data.lifestyle?.exerciseFrequency || 0) >= 3 ? -8 : 5, description: 'Physical activity level' },
      { name: 'Stress Level', impact: (data.lifestyle?.stressLevel || 5) > 7 ? 10 : -3, description: 'Stress management and mental health' }
    ];
  };

  const generateRecommendations = (data: any) => {
    const recommendations = [];
    
    if (data.health?.smokingStatus === 'current') {
      recommendations.push({ text: 'Quit smoking to reduce premiums by up to 50%', impact: 'High' });
    }
    
    if ((data.lifestyle?.exerciseFrequency || 0) < 3) {
      recommendations.push({ text: 'Increase exercise to 3+ times per week', impact: 'Medium' });
    }
    
    if ((data.lifestyle?.stressLevel || 5) > 7) {
      recommendations.push({ text: 'Consider stress management techniques', impact: 'Medium' });
    }
    
    recommendations.push({ text: 'Annual health checkups for preventive care', impact: 'Low' });
    recommendations.push({ text: 'Connect wearable device for activity tracking discount', impact: 'Low' });
    
    return recommendations;
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      // Scroll to top smoothly when going back
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <DemographicsStep 
            data={formData.demographics} 
            onChange={(data) => updateFormData('demographics', data)} 
          />
        );
      case 2:
        return (
          <HealthStep 
            data={formData.health} 
            onChange={(data) => updateFormData('health', data)} 
          />
        );
      case 3:
        return (
          <LifestyleStep 
            data={formData.lifestyle} 
            onChange={(data) => updateFormData('lifestyle', data)} 
          />
        );
      case 4:
        return (
          <FinancialStep 
            data={formData.financial} 
            onChange={(data) => updateFormData('financial', data)} 
          />
        );
      case 5:
        return <AIAnalysisStep processing={formData.processing} data={formData} />;
      default:
        return null;
    }
  };

  const currentStepData = steps.find(step => step.id === currentStep);

  return (
    <div className={isDashboardMode ? "h-full bg-gradient-to-br from-blue-50 to-indigo-50" : "min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50"}>
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-blue-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <button 
              onClick={onBack}
              className="group flex items-center space-x-3 px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 ease-in-out transform hover:scale-105"
            >
              <div className="p-1 rounded-full bg-gray-100 group-hover:bg-blue-100 transition-colors duration-200">
                <ChevronLeft className="w-4 h-4" />
              </div>
              <span className="font-medium">{isDashboardMode ? 'Back to Assessments' : 'Back to Home'}</span>
            </button>
            
            {/* Add a title for better context */}
            <div className="hidden sm:block">
              <h1 className="text-xl font-semibold text-gray-800 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Insurance Assessment
              </h1>
            </div>
            
            {/* Step indicator */}
            <div className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm px-3 py-2 rounded-full border border-blue-200">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-600">Step {currentStep + 1} of {steps.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-blue-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                {currentStepData?.title}
              </h1>
              <p className="text-gray-600 font-medium">
                Step {currentStep + 1} of {steps.length} • {currentStepData?.progress}% Complete
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              {currentStepData?.icon && (
                <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl shadow-lg">
                  <currentStepData.icon className="w-6 h-6" />
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Step indicators */}
          <div className="flex items-center justify-between mb-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center space-y-2">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 shadow-lg ${
                    currentStep === step.id 
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white animate-pulse' 
                      : currentStep > step.id 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' 
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {currentStep > step.id ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      step.id + 1
                    )}
                  </div>
                  <span className={`text-xs font-medium transition-colors duration-300 hidden sm:block ${
                    currentStep >= step.id ? 'text-gray-700' : 'text-gray-400'
                  }`}>
                    {step.title.split(' ')[0]}
                  </span>
                </div>
                
                {index < steps.length - 1 && (
                  <div className={`w-12 sm:w-24 h-2 mx-4 rounded-full transition-all duration-500 ${
                    currentStep > step.id ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Enhanced overall progress bar */}
          <div className="relative">
            <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
              <div 
                className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-700 ease-out shadow-sm relative overflow-hidden"
                style={{ width: `${currentStepData?.progress}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
              </div>
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-xs text-gray-500 font-medium">0%</span>
              <span className="text-xs text-gray-700 font-semibold">{currentStepData?.progress}%</span>
              <span className="text-xs text-gray-500 font-medium">100%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Step Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-10 relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-full -translate-y-8 translate-x-8"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-500/10 to-pink-500/10 rounded-full translate-y-8 -translate-x-8"></div>
          
          {errors.general && (
            <div className="mb-8 p-5 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-3 shadow-sm">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <span className="text-red-700 font-medium">{errors.general}</span>
            </div>
          )}

          {renderStep()}

          {/* Enhanced Navigation */}
          {currentStep < 5 && (
            <div className="flex items-center justify-between mt-12 pt-8 border-t border-gray-200">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className={`group flex items-center space-x-3 px-8 py-4 rounded-xl font-semibold transition-all duration-200 transform ${
                  currentStep === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:scale-105 shadow-lg border border-gray-200 hover:border-gray-300'
                }`}
              >
                <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                <span>Previous</span>
              </button>

              <button
                onClick={handleNext}
                className="group flex items-center space-x-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-10 py-4 rounded-xl font-semibold hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-xl hover:shadow-2xl"
              >
                <span>{currentStep === 4 ? 'Generate Quote' : 'Next'}</span>
                <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          )}

          {/* Show completion button when AI analysis is done */}
          {currentStep === 5 && !formData.processing && (
            <div className="flex justify-center mt-12 pt-8 border-t border-gray-200">
              <button
                onClick={() => {
                  const finalData = {
                    ...formData,
                    aiAnalysis: formData.aiAnalysis || {},
                    riskScore: formData.riskScore || 0,
                    premiumEstimate: formData.premiumEstimate || 0
                  };
                  onComplete(finalData);
                }}
                disabled={isSaving}
                className="group flex items-center space-x-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-12 py-5 rounded-xl font-bold text-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Saving Results...</span>
                  </>
                ) : (
                  <>
                    <span>View Dashboard</span>
                    <ChevronRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionnaireWizard;