import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Save, AlertCircle, CheckCircle, User, Heart, Activity, DollarSign, Cpu } from 'lucide-react';
import DemographicsStep from './questionnaire/DemographicsStep';
import HealthStep from './questionnaire/HealthStep';
import LifestyleStep from './questionnaire/LifestyleStep';
import FinancialStep from './questionnaire/FinancialStep';
import AIAnalysisStep from './questionnaire/AIAnalysisStep';

interface QuestionnaireWizardProps {
  onComplete: (data: any) => void;
  onBack: () => void;
  initialData?: any;
}

const QuestionnaireWizard: React.FC<QuestionnaireWizardProps> = ({ onComplete, onBack, initialData = {} }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    demographics: initialData.demographics || {},
    health: initialData.health || {},
    lifestyle: initialData.lifestyle || {},
    financial: initialData.financial || {},
    processing: false
  });
  const [errors, setErrors] = useState<{ general?: string }>({});

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

  const handleNext = () => {
    if (currentStep < 5 && validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    } else if (currentStep === 4) {
      // Start AI processing
      setCurrentStep(5);
      setFormData(prev => ({ ...prev, processing: true }));
      
      // Simulate AI processing
      setTimeout(() => {
        setFormData(prev => ({ ...prev, processing: false }));
        onComplete(formData);
      }, 8000);
    }
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <button 
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </button>
            
            <div className="flex items-center space-x-2">
              <Save className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-500">Auto-saved</span>
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