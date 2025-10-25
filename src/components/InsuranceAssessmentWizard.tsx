import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, IndianRupee } from 'lucide-react';
import { getAssessmentByType, calculatePremium, AssessmentField, AssessmentStep } from '../data/insuranceAssessments';
import { useHybridAuth } from '../hooks/useHybridAuth';

const InsuranceAssessmentWizard: React.FC = () => {
  const { insuranceType } = useParams<{ insuranceType: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useHybridAuth();

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [selectedPolicyPeriod, setSelectedPolicyPeriod] = useState<number>(1);
  const [calculatedPremium, setCalculatedPremium] = useState<number>(0);

  const assessment = insuranceType ? getAssessmentByType(insuranceType) : null;

  useEffect(() => {
    if (!assessment) {
      navigate('/browse-policies');
    }
  }, [assessment, navigate]);

  useEffect(() => {
    if (assessment && insuranceType) {
      const baseMultiplier = calculateRiskMultiplier();
      const premium = calculatePremium(insuranceType, selectedPolicyPeriod, baseMultiplier);
      setCalculatedPremium(premium);
    }
  }, [formData, selectedPolicyPeriod, insuranceType, assessment]);

  if (!assessment) {
    return null;
  }

  const steps = assessment.assessment.flow;
  const totalSteps = steps.length;

  const calculateRiskMultiplier = (): number => {
    let multiplier = 1.0;

    if (formData.tobacco === 'Yes') multiplier += 0.3;
    if (formData.age && parseInt(formData.age) > 45) multiplier += 0.2;
    if (formData.existingIllness && formData.existingIllness.length > 0 && !formData.existingIllness.includes('None')) {
      multiplier += 0.15 * formData.existingIllness.filter((i: string) => i !== 'None').length;
    }
    if (formData.claimHistory === 'Yes') multiplier += 0.15;

    return multiplier;
  };

  const handleInputChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'policyPeriod') {
      const yearMatch = value.match(/(\d+)/);
      if (yearMatch) {
        setSelectedPolicyPeriod(parseInt(yearMatch[1]));
      }
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      sessionStorage.setItem('pendingAssessment', JSON.stringify({
        insuranceType,
        formData,
        selectedPolicyPeriod,
        calculatedPremium,
        policyName: assessment.name
      }));
      localStorage.setItem('redirectAfterAuth', '/checkout');
      navigate('/signup');
      return;
    }

    navigate('/checkout', {
      state: {
        insuranceType,
        assessmentData: formData,
        policyPeriod: selectedPolicyPeriod,
        premium: calculatedPremium,
        policyName: assessment.name
      }
    });
  };

  const isStepValid = (): boolean => {
    const step = steps[currentStep];
    if (!step.fields) return true;

    return step.fields.every(field => {
      if (!field.required) return true;
      const value = formData[field.name];
      if (Array.isArray(value)) return value.length > 0;
      return value !== undefined && value !== '' && value !== null;
    });
  };

  const renderField = (field: AssessmentField) => {
    const value = formData[field.name] || '';

    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required={field.required}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required={field.required}
          />
        );

      case 'date':
        return (
          <input
            type="date"
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required={field.required}
          />
        );

      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required={field.required}
          >
            <option value="">Select an option</option>
            {field.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case 'radio':
        return (
          <div className="space-y-3">
            {field.options?.map((option) => (
              <label
                key={option}
                className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  value === option
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name={field.name}
                  value={option}
                  checked={value === option}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  required={field.required}
                />
                <span className="ml-3 text-gray-900">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'multiselect':
        return (
          <div className="space-y-3">
            {field.options?.map((option) => {
              const isSelected = Array.isArray(value) && value.includes(option);
              return (
                <label
                  key={option}
                  className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => {
                      const currentValues = Array.isArray(value) ? value : [];
                      if (e.target.checked) {
                        handleInputChange(field.name, [...currentValues, option]);
                      } else {
                        handleInputChange(field.name, currentValues.filter((v: string) => v !== option));
                      }
                    }}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded"
                  />
                  <span className="ml-3 text-gray-900">{option}</span>
                </label>
              );
            })}
          </div>
        );

      case 'checkbox':
        return (
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={value === true}
              onChange={(e) => handleInputChange(field.name, e.target.checked)}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded"
              required={field.required}
            />
            <span className="ml-3 text-gray-900">{field.label}</span>
          </label>
        );

      default:
        return null;
    }
  };

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="mb-6">
          <button
            onClick={() => navigate('/browse-policies')}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Policies
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{assessment.name}</h1>
              <span className="text-sm text-gray-500">
                Step {currentStep + 1} of {totalSteps}
              </span>
            </div>
            <p className="text-gray-600">{assessment.tagline}</p>

            <div className="mt-4 bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">{currentStepData.title}</h2>
            {currentStepData.description && (
              <p className="text-gray-600 mb-4">{currentStepData.description}</p>
            )}

            <div className="space-y-4">
              {currentStepData.fields?.map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  {renderField(field)}
                </div>
              ))}
            </div>
          </div>

          {calculatedPremium > 0 && currentStep >= totalSteps - 2 && (
            <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Estimated Premium</p>
                  <div className="flex items-center gap-2">
                    <IndianRupee className="w-6 h-6 text-green-600" />
                    <span className="text-3xl font-bold text-green-700">
                      {calculatedPremium.toLocaleString('en-IN')}
                    </span>
                    <span className="text-lg text-gray-600">
                      / {selectedPolicyPeriod} {selectedPolicyPeriod === 1 ? 'year' : 'years'}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Monthly</p>
                  <p className="text-xl font-semibold text-gray-900">
                    ₹{Math.round(calculatedPremium / (selectedPolicyPeriod * 12)).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between gap-4">
            {currentStep > 0 && (
              <button
                onClick={handlePrevious}
                className="flex items-center px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition-all"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Previous
              </button>
            )}

            <button
              onClick={handleNext}
              disabled={!isStepValid()}
              className={`flex items-center ml-auto px-6 py-3 rounded-lg font-semibold transition-all ${
                isStepValid()
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700 shadow-lg hover:shadow-xl'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {currentStep === totalSteps - 1 ? (
                <>
                  <Check className="w-5 h-5 mr-2" />
                  {user ? 'Proceed to Checkout' : 'Sign Up & Continue'}
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsuranceAssessmentWizard;
