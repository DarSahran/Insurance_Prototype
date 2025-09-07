import React from 'react';
import { Calendar, MapPin, Briefcase, GraduationCap, User } from 'lucide-react';

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
    'Marketing Specialist', 'Student', 'Retired', 'Other'
  ];

  const educationLevels = [
    'High School', "Bachelor's Degree", "Master's Degree", 'Doctorate', 'Professional Degree', 'Other'
  ];

  return (
    <div className="space-y-8">
      <div className="border-b border-gray-200 pb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Personal Information</h2>
        <p className="text-gray-600">
          Help us understand your basic demographic information for accurate risk assessment.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            <User className="w-4 h-4 inline mr-2" />
            Full Name *
          </label>
          <input
            type="text"
            value={data.fullName || ''}
            onChange={(e) => handleInputChange('fullName', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Enter your full name"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            <Calendar className="w-4 h-4 inline mr-2" />
            Date of Birth *
          </label>
          <div className="relative">
            <input
              type="date"
              value={data.dateOfBirth || ''}
              onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            {data.dateOfBirth && (
              <div className="absolute right-12 top-3 text-sm text-gray-500">
                Age: {calculateAge(data.dateOfBirth)}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Gender
          </label>
          <select
            value={data.gender || ''}
            onChange={(e) => handleInputChange('gender', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="prefer-not-to-say">Prefer not to say</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            <Briefcase className="w-4 h-4 inline mr-2" />
            Occupation *
          </label>
          <select
            value={data.occupation || ''}
            onChange={(e) => handleInputChange('occupation', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="">Select occupation</option>
            {occupations.map(occupation => (
              <option key={occupation} value={occupation}>{occupation}</option>
            ))}
          </select>
          {data.occupation && ['Police Officer', 'Firefighter', 'Pilot'].includes(data.occupation) && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800">
                High-risk occupation detected. This may affect your premium calculation.
              </p>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            <MapPin className="w-4 h-4 inline mr-2" />
            Location *
          </label>
          <input
            type="text"
            value={data.location || ''}
            onChange={(e) => handleInputChange('location', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="City, State/Province, Country"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            <GraduationCap className="w-4 h-4 inline mr-2" />
            Education Level
          </label>
          <select
            value={data.educationLevel || ''}
            onChange={(e) => handleInputChange('educationLevel', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="">Select education level</option>
            {educationLevels.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">Why We Need This Information</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Age helps determine life expectancy and risk factors</li>
          <li>• Occupation affects exposure to workplace hazards</li>
          <li>• Location impacts environmental and health risks</li>
          <li>• All data is encrypted and used only for risk assessment</li>
        </ul>
      </div>
    </div>
  );
};

export default DemographicsStep;