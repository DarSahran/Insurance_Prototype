import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Heart, TrendingUp, Car, Bike, Users, Plane, PiggyBank, Home, ArrowLeft } from 'lucide-react';
import QuestionnaireWizard from '../../components/QuestionnaireWizard';

const INSURANCE_TYPES = [
  { id: 'term_life', name: 'Term Life Insurance', icon: Shield, color: 'blue', description: 'Secure your family\'s future with comprehensive life coverage' },
  { id: 'health', name: 'Health Insurance', icon: Heart, color: 'red', description: 'Complete health protection for you and your family' },
  { id: 'family_health', name: 'Family Health Insurance', icon: Users, color: 'green', description: 'Comprehensive coverage for entire family' },
  { id: 'car', name: 'Car Insurance', icon: Car, color: 'cyan', description: 'Complete protection for your vehicle' },
  { id: 'two_wheeler', name: 'Two Wheeler Insurance', icon: Bike, color: 'orange', description: 'Bike insurance with comprehensive coverage' },
  { id: 'investment', name: 'Investment Plans', icon: TrendingUp, color: 'teal', description: 'Grow your wealth with insurance-linked investments' },
  { id: 'travel', name: 'Travel Insurance', icon: Plane, color: 'sky', description: 'Safe journeys with comprehensive travel coverage' },
  { id: 'retirement', name: 'Retirement Plans', icon: PiggyBank, color: 'emerald', description: 'Plan your golden years with pension plans' },
  { id: 'home', name: 'Home Insurance', icon: Home, color: 'amber', description: 'Protect your home and belongings' },
  { id: 'term_rop', name: 'Term with Return of Premium', icon: Shield, color: 'rose', description: 'Term insurance with premium return benefit' },
];

const NewAssessmentPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const handleSelectType = (typeId: string) => {
    setSelectedType(typeId);
  };

  const handleBack = () => {
    if (selectedType) {
      setSelectedType(null);
    } else {
      navigate('/dashboard');
    }
  };

  const handleComplete = () => {
    navigate('/dashboard/assessments');
  };

  if (selectedType) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Insurance Types
          </button>
          <QuestionnaireWizard insuranceType={selectedType} onComplete={handleComplete} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Start New Assessment</h1>
          <p className="text-gray-600">Choose the type of insurance you're interested in to begin a personalized assessment</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {INSURANCE_TYPES.map((type) => {
            const Icon = type.icon;
            const colorMap: Record<string, string> = {
              'blue': 'from-blue-500 to-blue-600',
              'red': 'from-red-500 to-red-600',
              'green': 'from-green-500 to-green-600',
              'cyan': 'from-cyan-500 to-cyan-600',
              'orange': 'from-orange-500 to-orange-600',
              'teal': 'from-teal-500 to-teal-600',
              'sky': 'from-sky-500 to-sky-600',
              'emerald': 'from-emerald-500 to-emerald-600',
              'amber': 'from-amber-500 to-amber-600',
              'rose': 'from-rose-500 to-rose-600',
            };

            return (
              <button
                key={type.id}
                onClick={() => handleSelectType(type.id)}
                className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 text-left border-2 border-transparent hover:border-blue-300 group"
              >
                <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${colorMap[type.color]} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{type.name}</h3>
                <p className="text-gray-600 text-sm">{type.description}</p>
                <div className="mt-4 text-blue-600 font-semibold flex items-center gap-2">
                  Start Assessment
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Why take an assessment?</h3>
          <ul className="space-y-2 text-blue-800">
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Get personalized policy recommendations based on your specific needs</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Ensure you get the right coverage amount and features</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Compare policies that match your requirements and budget</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Takes only 5-10 minutes to complete</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NewAssessmentPage;