import React from 'react';
import { Activity, Apple, Moon, Brain, Watch, Star } from 'lucide-react';

interface LifestyleStepProps {
  data: any;
  onChange: (data: any) => void;
}

const LifestyleStep: React.FC<LifestyleStepProps> = ({ data, onChange }) => {
  const handleInputChange = (field: string, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const handleActivityToggle = (activity: string) => {
    const activities = data.activityTypes || [];
    const updatedActivities = activities.includes(activity)
      ? activities.filter(a => a !== activity)
      : [...activities, activity];
    handleInputChange('activityTypes', updatedActivities);
  };

  const handleStressManagementToggle = (technique: string) => {
    const techniques = data.stressManagement || [];
    const updatedTechniques = techniques.includes(technique)
      ? techniques.filter(t => t !== technique)
      : [...techniques, technique];
    handleInputChange('stressManagement', updatedTechniques);
  };

  const getWellnessScore = () => {
    let score = 50; // Base score
    
    // Exercise frequency bonus
    if (data.exerciseFrequency >= 5) score += 20;
    else if (data.exerciseFrequency >= 3) score += 15;
    else if (data.exerciseFrequency >= 1) score += 10;
    
    // Sleep hours bonus
    if (data.sleepHours >= 7 && data.sleepHours <= 9) score += 15;
    else if (data.sleepHours >= 6 && data.sleepHours <= 10) score += 10;
    
    // Sleep quality bonus
    if (data.sleepQuality >= 4) score += 10;
    else if (data.sleepQuality >= 3) score += 5;
    
    // Stress level adjustment
    if (data.stressLevel <= 3) score += 15;
    else if (data.stressLevel <= 5) score += 10;
    else if (data.stressLevel >= 8) score -= 10;
    
    // Activity variety bonus
    const activityCount = (data.activityTypes || []).length;
    score += Math.min(activityCount * 3, 15);
    
    return Math.min(Math.max(score, 0), 100);
  };

  const wellnessScore = getWellnessScore();
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const activityTypes = ['Cardio', 'Strength Training', 'Flexibility', 'Sports', 'Outdoor Activities'];
  const stressManagementTechniques = ['Meditation', 'Yoga', 'Exercise', 'Counseling', 'Hobbies', 'Social Support'];

  return (
    <div className="space-y-8">
      <div className="border-b border-gray-200 pb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Lifestyle Assessment</h2>
        <p className="text-gray-600">
          Your lifestyle choices significantly impact your health risks and insurance rates.
        </p>
        
        {/* Wellness Score */}
        <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-blue-900">Your Wellness Score</span>
            </div>
            <div className="text-right">
              <div className={`text-3xl font-bold ${getScoreColor(wellnessScore)}`}>
                {wellnessScore}/100
              </div>
              <div className="text-xs text-gray-600">Updates in real-time</div>
            </div>
          </div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                wellnessScore >= 80 ? 'bg-green-500' :
                wellnessScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${wellnessScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* Physical Activity */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center">
          <Activity className="w-5 h-5 mr-2 text-blue-600" />
          Physical Activity
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Exercise Frequency (days per week)
              </label>
              <input
                type="range"
                min="0"
                max="7"
                step="1"
                value={data.exerciseFrequency || 0}
                onChange={(e) => handleInputChange('exerciseFrequency', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Never</span>
                <span className="font-semibold text-blue-600">
                  {data.exerciseFrequency || 0} days/week
                </span>
                <span>Daily</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Exercise Intensity
              </label>
              <select
                value={data.exerciseIntensity || ''}
                onChange={(e) => handleInputChange('exerciseIntensity', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">Select intensity</option>
                <option value="light">Light (Walking, light yoga)</option>
                <option value="moderate">Moderate (Brisk walking, cycling)</option>
                <option value="vigorous">Vigorous (Running, competitive sports)</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Activity Types (select all that apply)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {activityTypes.map((activity) => (
                <label key={activity} className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={(data.activityTypes || []).includes(activity)}
                    onChange={() => handleActivityToggle(activity)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700">{activity}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Nutrition */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center">
          <Apple className="w-5 h-5 mr-2 text-green-600" />
          Dietary Habits
        </h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: 'Fruits & Vegetables', key: 'fruitsVeggies', color: 'green' },
              { name: 'Whole Grains', key: 'wholeGrains', color: 'yellow' },
              { name: 'Lean Proteins', key: 'leanProteins', color: 'blue' },
              { name: 'Processed Foods', key: 'processedFoods', color: 'red' },
              { name: 'Sugary Drinks', key: 'sugaryDrinks', color: 'red' },
              { name: 'Fast Food', key: 'fastFood', color: 'red' }
            ].map((food) => (
              <div key={food.key} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {food.name}
                </label>
                <select
                  value={data[food.key] || ''}
                  onChange={(e) => handleInputChange(food.key, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">Select frequency</option>
                  <option value="never">Never</option>
                  <option value="rarely">Rarely</option>
                  <option value="sometimes">Sometimes</option>
                  <option value="often">Often</option>
                  <option value="daily">Daily</option>
                </select>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Special Dietary Requirements
            </label>
            <select
              value={data.dietaryRestrictions || ''}
              onChange={(e) => handleInputChange('dietaryRestrictions', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="">No special requirements</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="vegan">Vegan</option>
              <option value="keto">Ketogenic</option>
              <option value="diabetic">Diabetic Diet</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sleep & Stress */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center">
          <Moon className="w-5 h-5 mr-2 text-indigo-600" />
          Sleep & Stress Management
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Average Sleep Hours per Night
              </label>
              <input
                type="range"
                min="3"
                max="12"
                step="0.5"
                value={data.sleepHours || 7}
                onChange={(e) => handleInputChange('sleepHours', parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>3h</span>
                <span className="font-semibold text-indigo-600">
                  {data.sleepHours || 7}h
                </span>
                <span>12h</span>
              </div>
              {data.sleepHours >= 7 && data.sleepHours <= 9 && (
                <p className="text-xs text-green-600">✓ Optimal sleep range</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Sleep Quality (1-5 scale)
              </label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => handleInputChange('sleepQuality', rating)}
                    className={`w-8 h-8 rounded-full border-2 transition-colors ${
                      data.sleepQuality >= rating
                        ? 'bg-indigo-600 border-indigo-600 text-white'
                        : 'border-gray-300 hover:border-indigo-300'
                    }`}
                  >
                    {rating}
                  </button>
                ))}
              </div>
              <div className="text-xs text-gray-500">
                1 = Very Poor, 5 = Excellent
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Overall Stress Level (1-10)
              </label>
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={data.stressLevel || 5}
                onChange={(e) => handleInputChange('stressLevel', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Low</span>
                <span className={`font-semibold ${
                  data.stressLevel <= 3 ? 'text-green-600' :
                  data.stressLevel <= 7 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {data.stressLevel || 5}/10
                </span>
                <span>High</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Stress Management Techniques
              </label>
              <div className="grid grid-cols-2 gap-2">
                {stressManagementTechniques.map((technique) => (
                  <label key={technique} className="flex items-center space-x-2 p-2 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={(data.stressManagement || []).includes(technique)}
                      onChange={() => handleStressManagementToggle(technique)}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="text-xs text-gray-700">{technique}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wearable Integration */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center">
          <Watch className="w-5 h-5 mr-2 text-purple-600" />
          Wearable Device Integration (Optional)
        </h3>
        
        <div className="p-6 border border-gray-200 rounded-lg">
          <p className="text-gray-600 mb-4">
            Connect your fitness tracker for more accurate health assessment and potential premium discounts.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {['Fitbit', 'Apple Watch', 'Garmin', 'Samsung Health'].map((device) => (
              <button
                key={device}
                className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                Connect {device}
              </button>
            ))}
          </div>
          
          <p className="text-xs text-gray-500">
            Data types: Heart rate, sleep patterns, activity levels, stress indicators
          </p>
        </div>
      </div>
    </div>
  );
};

export default LifestyleStep;