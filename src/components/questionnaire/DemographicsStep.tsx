import React from 'react';
import { Calendar, MapPin, Briefcase, GraduationCap, User, Users } from 'lucide-react';

interface DemographicsStepProps {
  data: any;
  onChange: (data: any) => void;
}

const DemographicsStep: React.FC<DemographicsStepProps> = ({ data, onChange }) => {
  const handleInputChange = (field: string, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const calculateAge = (birthDate: string) => {
    if (!birthDate) return '';
    const today = new Date();
    const birth = new Date(birthDate);
    const age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      return age - 1;
    }
    return age;
  };

  const occupations = [
    'Software Engineer', 'Doctor', 'Teacher', 'Nurse', 'Manager', 'Accountant',
    'Sales Representative', 'Consultant', 'Designer', 'Lawyer', 'Engineer',
    'Marketing Specialist', 'Student', 'Retired', 'Business Owner',
    'Construction Worker', 'Delivery Driver', 'Pilot', 'Police Officer', 'Firefighter', 'Other'
  ];

  const educationLevels = [
    'High School', "Bachelor's Degree", "Master's Degree", 'Doctorate', 'Professional Degree', 'Other'
  ];

  const maritalStatus = ['Single', 'Married', 'Divorced', 'Widowed', 'Domestic Partnership'];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
          <User className="w-6 h-6 mr-3 text-blue-600" />
          Personal Information
        </h2>
        <p className="text-gray-600">
          Provide your demographic details for accurate insurance recommendations
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              <User className="w-4 h-4 inline mr-2 text-blue-600" />
              Full Name *
            </label>
            <input
              type="text"
              value={data.fullName || ''}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm hover:border-blue-300"
              placeholder="Enter your full name"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              <Calendar className="w-4 h-4 inline mr-2 text-blue-600" />
              Date of Birth *
            </label>
            <div className="relative">
              <input
                type="date"
                value={data.dateOfBirth || ''}
                max={new Date().toISOString().split('T')[0]}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm hover:border-blue-300"
              />
              {data.dateOfBirth && (
                <div className="mt-1 text-sm text-gray-600 flex items-center">
                  <span className="px-2 py-1 bg-blue-50 rounded-md">
                    Age: {calculateAge(data.dateOfBirth)} years
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Gender *
            </label>
            <select
              value={data.gender || ''}
              onChange={(e) => handleInputChange('gender', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm hover:border-blue-300"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              <Users className="w-4 h-4 inline mr-2 text-blue-600" />
              Marital Status *
            </label>
            <select
              value={data.maritalStatus || ''}
              onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm hover:border-blue-300"
            >
              <option value="">Select marital status</option>
              {maritalStatus.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              <Users className="w-4 h-4 inline mr-2 text-blue-600" />
              Number of Dependents
            </label>
            <input
              type="number"
              min="0"
              max="20"
              value={data.dependents || ''}
              onChange={(e) => handleInputChange('dependents', parseInt(e.target.value) || 0)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm hover:border-blue-300"
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              <Briefcase className="w-4 h-4 inline mr-2 text-blue-600" />
              Occupation *
            </label>
            <select
              value={data.occupation || ''}
              onChange={(e) => handleInputChange('occupation', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm hover:border-blue-300"
            >
              <option value="">Select occupation</option>
              {occupations.map(occupation => (
                <option key={occupation} value={occupation}>{occupation}</option>
              ))}
            </select>
            {data.occupation && ['Police Officer', 'Firefighter', 'Pilot', 'Construction Worker'].includes(data.occupation) && (
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg animate-fadeIn">
                <p className="text-sm text-orange-800 font-medium">
                  ⚠️ High-risk occupation - may affect premium calculation
                </p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              <MapPin className="w-4 h-4 inline mr-2 text-blue-600" />
              Location (City) *
            </label>
            <input
              type="text"
              value={data.location || ''}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm hover:border-blue-300"
              placeholder="e.g., Mumbai, Delhi, Bangalore"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              <GraduationCap className="w-4 h-4 inline mr-2 text-blue-600" />
              Education Level
            </label>
            <select
              value={data.educationLevel || ''}
              onChange={(e) => handleInputChange('educationLevel', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm hover:border-blue-300"
            >
              <option value="">Select education level</option>
              {educationLevels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-5 shadow-sm">
        <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Why We Need This Information
        </h3>
        <ul className="text-sm text-blue-800 space-y-2">
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span><strong>Age & Demographics:</strong> Essential for life expectancy and risk factor analysis</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span><strong>Occupation:</strong> Determines workplace exposure and hazard levels</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span><strong>Location:</strong> Affects environmental, health, and regional risk factors</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span><strong>Family:</strong> Helps calculate appropriate coverage needs</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DemographicsStep;
