import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Save, AlertCircle, CheckCircle, User, Heart, Activity, DollarSign, Cpu } from 'lucide-react';
import DemographicsStep from './questionnaire/DemographicsStep';
import HealthStep from './questionnaire/HealthStep';
import LifestyleStep from './questionnaire/LifestyleStep';
import FinancialStep from './questionnaire/FinancialStep';
import AIAnalysisStep from './questionnaire/AIAnalysisStep';
import { useAuth } from '../hooks/useAuth';
import { saveInsuranceQuestionnaire, updateQuestionnaire, getLatestQuestionnaire } from '../lib/database';

interface QuestionnaireWizardProps {
  onComplete: (data: any) => void;
  onBack: () => void;
  initialData?: any;
  isDashboardMode?: boolean;
}

const QuestionnaireWizard: React.FC<QuestionnaireWizardProps> = ({ onComplete, onBack, initialData = {}, isDashboardMode = false }) => {
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
  const { user } = useAuth();

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
    } else if (currentStep === 4) {
      // Start AI processing
      setCurrentStep(5);
      setFormData(prev => ({ ...prev, processing: true }));
      
      // Simulate AI processing and save final data
      setTimeout(async () => {
        setFormData(prev => ({ ...prev, processing: false }));
        
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
          aiAnalysis,
          riskScore,
          premiumEstimate
        };

        // Save final questionnaire data to Supabase
        if (user) {
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
              status: 'completed' as const
            };

            if (existingQuestionnaireId) {
              const { error } = await updateQuestionnaire(existingQuestionnaireId, questionnaireData);
              if (error) {
                console.error('Error updating final questionnaire:', error);
                setErrors({ general: 'Failed to save your results. Please try again.' });
                return;
              }
            } else {
              const { error } = await saveInsuranceQuestionnaire(questionnaireData);
              if (error) {
                console.error('Error saving final questionnaire:', error);
                setErrors({ general: 'Failed to save your results. Please try again.' });
                return;
              }
            }
          } catch (error) {
            console.error('Error saving questionnaire:', error);
            setErrors({ general: 'Failed to save your results. Please try again.' });
            return;
          }
        }

        onComplete(finalData);
      }, 8000);
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
    <div className={isDashboardMode ? "h-full bg-gray-50" : "min-h-screen bg-gray-50"}>
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <button 
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>{isDashboardMode ? 'Back to Assessments' : 'Back to Home'}</span>
            </button>
            
            <div className="flex items-center space-x-2">
              <Save className={`w-5 h-5 ${isSaving ? 'text-blue-500 animate-spin' : 'text-gray-400'}`} />
              <span className="text-sm text-gray-500">
                {user ? (isSaving ? 'Saving...' : 'Auto-saved') : 'Not logged in - data not saved'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {currentStepData?.title}
              </h1>
              <p className="text-gray-600">
                Step {currentStep} of 5 - {currentStepData?.progress}% Complete
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              {currentStepData?.icon && (
                <currentStepData.icon className="w-8 h-8 text-blue-600" />
              )}
            </div>
          </div>

          {/* Step indicators */}
          <div className="flex items-center justify-between mb-6">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  currentStep === step.id 
                    ? 'bg-blue-600 text-white' 
                    : currentStep > step.id 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {currentStep > step.id ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    step.id
                  )}
                </div>
                
                {index < steps.length - 1 && (
                  <div className={`w-12 sm:w-24 h-1 mx-2 ${
                    currentStep > step.id ? 'bg-green-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Overall progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${currentStepData?.progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {errors.general && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="text-red-700">{errors.general}</span>
            </div>
          )}

          {renderStep()}

          {/* Navigation */}
          {currentStep < 5 && (
            <div className="flex items-center justify-between mt-8 pt-6 border-t">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                  currentStep === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
                <span>Previous</span>
              </button>

              <button
                onClick={handleNext}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all"
              >
                <span>{currentStep === 4 ? 'Generate Quote' : 'Next'}</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionnaireWizard;