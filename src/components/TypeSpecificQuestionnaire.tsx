import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle, AlertCircle } from 'lucide-react';
import { getQuestionsForInsuranceType, QuestionSection, Question } from '../data/insuranceQuestions';
import { useHybridAuth } from '../hooks/useHybridAuth';
import { saveInsuranceQuestionnaire } from '../lib/database';
import { useNavigate } from 'react-router-dom';

interface TypeSpecificQuestionnaireProps {
  insuranceType: string;
  onComplete: () => void;
}

const TypeSpecificQuestionnaire: React.FC<TypeSpecificQuestionnaireProps> = ({
  insuranceType,
  onComplete
}) => {
  const navigate = useNavigate();
  const { user } = useHybridAuth();
  const sections = getQuestionsForInsuranceType(insuranceType);

  const [currentSection, setCurrentSection] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAnswer = (questionId: string, value: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    setErrors(prev => ({ ...prev, [questionId]: '' }));
  };

  const validateSection = (): boolean => {
    const section = sections[currentSection];
    const newErrors: Record<string, string> = {};

    section.questions.forEach(question => {
      if (question.required && !answers[question.id]) {
        newErrors[question.id] = 'This field is required';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateSection()) {
      if (currentSection < sections.length - 1) {
        setCurrentSection(prev => prev + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        handleSubmit();
      }
    }
  };

  const handleBack = () => {
    if (currentSection > 0) {
      setCurrentSection(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      alert('Please sign in to save your assessment');
      navigate('/login');
      return;
    }

    setIsSubmitting(true);
    try {
      const questionnaireData = {
        user_id: user.id,
        insurance_type: insuranceType,
        type_specific_data: answers,
        demographics: {},
        health: {},
        lifestyle: {},
        financial: {},
        status: 'completed' as const
      };

      const { error } = await saveInsuranceQuestionnaire(questionnaireData);

      if (error) {
        throw error;
      }

      onComplete();
    } catch (error) {
      console.error('Error saving questionnaire:', error);
      alert('Failed to save questionnaire. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderQuestion = (question: Question) => {
    const value = answers[question.id] || '';
    const error = errors[question.id];

    switch (question.type) {
      case 'text':
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleAnswer(question.id, e.target.value)}
            placeholder={question.placeholder}
            className={`w-full px-4 py-3 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          />
        );

      case 'number':
        return (
          <div className="flex items-center gap-2">
            {question.unit && <span className="text-gray-600 font-medium">{question.unit}</span>}
            <input
              type="number"
              value={value}
              onChange={(e) => handleAnswer(question.id, e.target.value)}
              placeholder={question.placeholder}
              min={question.min}
              max={question.max}
              className={`flex-1 px-4 py-3 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            />
          </div>
        );

      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handleAnswer(question.id, e.target.value)}
            className={`w-full px-4 py-3 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          >
            <option value="">Select an option</option>
            {question.options?.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );

      case 'radio':
        return (
          <div className="space-y-2">
            {question.options?.map(option => (
              <label key={option} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={value === option}
                  onChange={(e) => handleAnswer(question.id, e.target.value)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'multiselect':
        return (
          <div className="space-y-2">
            {question.options?.map(option => (
              <label key={option} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  value={option}
                  checked={Array.isArray(value) && value.includes(option)}
                  onChange={(e) => {
                    const currentValues = Array.isArray(value) ? value : [];
                    const newValues = e.target.checked
                      ? [...currentValues, option]
                      : currentValues.filter(v => v !== option);
                    handleAnswer(question.id, newValues);
                  }}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => handleAnswer(question.id, e.target.value)}
            placeholder={question.placeholder}
            rows={4}
            className={`w-full px-4 py-3 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          />
        );

      default:
        return null;
    }
  };

  const section = sections[currentSection];
  const progress = ((currentSection + 1) / sections.length) * 100;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600">
            Section {currentSection + 1} of {sections.length}
          </span>
          <span className="text-sm font-medium text-gray-600">
            {Math.round(progress)}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Section Content */}
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-6">
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            {section.title}
          </h2>
          <p className="text-gray-600">{section.description}</p>
        </div>

        <div className="space-y-6">
          {section.questions.map(question => (
            <div key={question.id} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {question.label}
                {question.required && <span className="text-red-500 ml-1">*</span>}
              </label>

              {renderQuestion(question)}

              {question.helpText && !errors[question.id] && (
                <p className="text-sm text-gray-500">{question.helpText}</p>
              )}

              {errors[question.id] && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors[question.id]}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center">
        <button
          onClick={handleBack}
          disabled={currentSection === 0}
          className="flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-5 h-5" />
          Previous
        </button>

        <button
          onClick={handleNext}
          disabled={isSubmitting}
          className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {isSubmitting ? (
            'Saving...'
          ) : currentSection === sections.length - 1 ? (
            <>
              <CheckCircle className="w-5 h-5" />
              Complete Assessment
            </>
          ) : (
            <>
              Next
              <ChevronRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default TypeSpecificQuestionnaire;
