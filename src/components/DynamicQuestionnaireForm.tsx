import React from 'react';
import { INSURANCE_QUESTIONS_MAP, Question } from '../data/insuranceQuestions';
import { Calendar, Check } from 'lucide-react';

interface DynamicQuestionnaireFormProps {
  insuranceType: string;
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
}

const DynamicQuestionnaireForm: React.FC<DynamicQuestionnaireFormProps> = ({
  insuranceType,
  data,
  onChange,
}) => {
  const questions = INSURANCE_QUESTIONS_MAP[insuranceType] || [];

  const handleInputChange = (questionId: string, value: any) => {
    onChange({ ...data, [questionId]: value });
  };

  const handleMultiSelectToggle = (questionId: string, option: string) => {
    const currentValues = data[questionId] || [];
    const newValues = currentValues.includes(option)
      ? currentValues.filter((v: string) => v !== option)
      : [...currentValues, option];
    handleInputChange(questionId, newValues);
  };

  const renderQuestion = (question: Question) => {
    const value = data[question.id];

    switch (question.type) {
      case 'text':
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm hover:border-blue-300"
            placeholder={`Enter ${question.question.toLowerCase()}`}
            required={question.required}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={value || ''}
            onChange={(e) => handleInputChange(question.id, parseFloat(e.target.value) || '')}
            min={question.validation?.min}
            max={question.validation?.max}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm hover:border-blue-300"
            placeholder={`Enter ${question.question.toLowerCase()}`}
            required={question.required}
          />
        );

      case 'date':
        return (
          <div className="relative">
            <input
              type="date"
              value={value || ''}
              max={new Date().toISOString().split('T')[0]}
              onChange={(e) => handleInputChange(question.id, e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm hover:border-blue-300"
              required={question.required}
            />
            <Calendar className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        );

      case 'select':
        return (
          <select
            value={value || ''}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm hover:border-blue-300"
            required={question.required}
          >
            <option value="">Select {question.question.toLowerCase()}</option>
            {question.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case 'multiselect':
        return (
          <div className="space-y-2">
            {question.options?.map((option) => {
              const isSelected = (data[question.id] || []).includes(option);
              return (
                <label
                  key={option}
                  className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300 bg-white'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleMultiSelectToggle(question.id, option)}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center transition-colors ${
                      isSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <span className="text-gray-900 font-medium">{option}</span>
                </label>
              );
            })}
          </div>
        );

      case 'boolean':
        return (
          <div className="flex space-x-4">
            <label
              className={`flex-1 flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                value === true
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-green-300 bg-white'
              }`}
            >
              <input
                type="radio"
                checked={value === true}
                onChange={() => handleInputChange(question.id, true)}
                className="sr-only"
              />
              <span className="text-gray-900 font-semibold">Yes</span>
            </label>
            <label
              className={`flex-1 flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                value === false
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-200 hover:border-red-300 bg-white'
              }`}
            >
              <input
                type="radio"
                checked={value === false}
                onChange={() => handleInputChange(question.id, false)}
                className="sr-only"
              />
              <span className="text-gray-900 font-semibold">No</span>
            </label>
          </div>
        );

      case 'range':
        return (
          <div className="space-y-2">
            <input
              type="range"
              value={value || 0}
              min={question.validation?.min || 0}
              max={question.validation?.max || 10}
              onChange={(e) => handleInputChange(question.id, parseInt(e.target.value))}
              className="w-full"
              required={question.required}
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>{question.validation?.min || 0}</span>
              <span className="font-semibold text-blue-600">{value || 0}</span>
              <span>{question.validation?.max || 10}</span>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const groupedQuestions = questions.reduce((acc, question) => {
    if (!acc[question.category]) {
      acc[question.category] = [];
    }
    acc[question.category].push(question);
    return acc;
  }, {} as Record<string, Question[]>);

  const categoryTitles: Record<string, string> = {
    demographics: 'Personal Information',
    health: 'Health Information',
    lifestyle: 'Lifestyle & Habits',
    financial: 'Financial Details',
    coverage: 'Coverage Preferences',
    vehicle: 'Vehicle Details',
    property: 'Property Details',
    travel: 'Travel Details',
    history: 'Claims & History',
  };

  return (
    <div className="space-y-8">
      {Object.entries(groupedQuestions).map(([category, categoryQuestions]) => (
        <div key={category} className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
            <h3 className="text-xl font-bold text-gray-900">
              {categoryTitles[category] || category}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {categoryQuestions.length} questions in this section
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {categoryQuestions.map((question) => (
                <div
                  key={question.id}
                  className={question.type === 'multiselect' ? 'md:col-span-2' : ''}
                >
                  <label className="block mb-2">
                    <span className="text-sm font-semibold text-gray-700">
                      {question.question}
                      {question.required && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </span>
                  </label>
                  {renderQuestion(question)}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DynamicQuestionnaireForm;
