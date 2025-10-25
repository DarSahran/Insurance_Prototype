import React from 'react';
import { Heart, Scale, Cigarette, Wine, Pill as Pills, Upload, AlertTriangle } from 'lucide-react';

interface HealthStepProps {
  data: any;
  onChange: (data: any) => void;
}

const HealthStep: React.FC<HealthStepProps> = ({ data, onChange }) => {
  const handleInputChange = (field: string, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const handleConditionToggle = (condition: string) => {
    const conditions = data.medicalConditions || [];
    const updatedConditions = conditions.includes(condition)
      ? conditions.filter(c => c !== condition)
      : [...conditions, condition];
    handleInputChange('medicalConditions', updatedConditions);
  };

  const calculateBMI = () => {
    if (data.height && data.weight) {
      const heightM = data.height / 100;
      const bmi = data.weight / (heightM * heightM);
      return bmi.toFixed(1);
    }
    return '';
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: 'Underweight', color: 'text-blue-600' };
    if (bmi < 25) return { category: 'Normal', color: 'text-green-600' };
    if (bmi < 30) return { category: 'Overweight', color: 'text-yellow-600' };
    return { category: 'Obese', color: 'text-red-600' };
  };

  const medicalConditions = [
    { category: 'Cardiovascular', conditions: ['Hypertension', 'Heart Disease', 'Stroke', 'High Cholesterol'] },
    { category: 'Metabolic', conditions: ['Diabetes Type 1', 'Diabetes Type 2', 'Thyroid Disorders'] },
    { category: 'Respiratory', conditions: ['Asthma', 'COPD', 'Sleep Apnea'] },
    { category: 'Mental Health', conditions: ['Depression', 'Anxiety', 'Bipolar Disorder'] },
  ];

  const bmi = calculateBMI();
  const bmiInfo = bmi ? getBMICategory(parseFloat(bmi)) : null;

  return (
    <div className="space-y-8">
      <div className="border-b border-gray-200 pb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Health & Medical History</h2>
        <p className="text-gray-600">
          Your health information helps us provide accurate risk assessment and fair pricing.
        </p>
      </div>

      {/* Current Health Status */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-900">Current Health Status</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              <Scale className="w-4 h-4 inline mr-2" />
              Height (cm) *
            </label>
            <input
              type="number"
              value={data.height || ''}
              onChange={(e) => handleInputChange('height', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="e.g., 175"
              min="100"
              max="250"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              <Scale className="w-4 h-4 inline mr-2" />
              Weight (kg) *
            </label>
            <input
              type="number"
              value={data.weight || ''}
              onChange={(e) => handleInputChange('weight', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="e.g., 70"
              min="30"
              max="300"
            />
            {bmi && (
              <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">BMI: {bmi}</span>
                  <span className={`text-sm font-semibold ${bmiInfo?.color}`}>
                    {bmiInfo?.category}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              <Cigarette className="w-4 h-4 inline mr-2" />
              Smoking Status *
            </label>
            <div className="space-y-3">
              {['never', 'former', 'current'].map(status => (
                <label key={status} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="smokingStatus"
                    value={status}
                    checked={data.smokingStatus === status}
                    onChange={(e) => handleInputChange('smokingStatus', e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-gray-700 capitalize">
                    {status === 'never' ? 'Never smoked' : 
                     status === 'former' ? 'Former smoker' : 'Current smoker'}
                  </span>
                  {status === 'current' && (
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                  )}
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              <Wine className="w-4 h-4 inline mr-2" />
              Alcohol Consumption
            </label>
            <select
              value={data.alcoholConsumption || ''}
              onChange={(e) => handleInputChange('alcoholConsumption', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="">Select frequency</option>
              <option value="never">Never</option>
              <option value="occasionally">Occasionally (1-2 times per month)</option>
              <option value="regularly">Regularly (1-2 times per week)</option>
              <option value="daily">Daily</option>
            </select>
          </div>
        </div>
      </div>

      {/* Medical Conditions */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-900">Pre-existing Medical Conditions</h3>
        <p className="text-gray-600">Select any conditions that apply to you:</p>
        
        {medicalConditions.map((category, categoryIndex) => (
          <div key={categoryIndex} className="space-y-3">
            <h4 className="font-semibold text-gray-800 border-b border-gray-200 pb-2">
              {category.category}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {category.conditions.map((condition, conditionIndex) => (
                <label key={conditionIndex} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={(data.medicalConditions || []).includes(condition)}
                    onChange={() => handleConditionToggle(condition)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-gray-700">{condition}</span>
                  {['Heart Disease', 'Diabetes Type 1', 'COPD'].includes(condition) && 
                   (data.medicalConditions || []).includes(condition) && (
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                  )}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Current Medications */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900">Current Medications</h3>
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            <Pills className="w-4 h-4 inline mr-2" />
            List any medications you're currently taking
          </label>
          <textarea
            value={data.medications || ''}
            onChange={(e) => handleInputChange('medications', e.target.value)}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Enter medications, dosages, and frequency (e.g., Lisinopril 10mg daily for blood pressure)"
          />
        </div>
      </div>

      {/* Medical Records Upload */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900">Medical Records Upload (Optional)</h3>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-gray-700 mb-2">Upload Medical Documents</h4>
          <p className="text-gray-500 mb-4">
            Upload recent medical records, test results, or doctor's notes (PDF, JPG, PNG)
          </p>
          <button className="bg-blue-100 text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-200 transition-colors">
            Choose Files
          </button>
          <p className="text-xs text-gray-500 mt-2">
            All files are encrypted and processed securely
          </p>
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
        <h3 className="font-semibold text-green-900 mb-2">Privacy & Security</h3>
        <ul className="text-sm text-green-800 space-y-1">
          <li>• All health data is encrypted with industry-standard security</li>
          <li>• Information is used solely for risk assessment</li>
          <li>• Data is not shared with third parties without consent</li>
          <li>• You can request data deletion at any time</li>
        </ul>
      </div>
    </div>
  );
};

export default HealthStep;