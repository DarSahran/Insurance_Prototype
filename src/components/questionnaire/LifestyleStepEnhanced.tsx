import React, { useState } from 'react';
import { Activity, Apple, Moon, Brain, Zap, Target, Clock, Smartphone, Heart, TrendingUp, Star, Watch } from 'lucide-react';

interface LifestyleStepProps {
  data: any;
  onChange: (data: any) => void;
}

const LifestyleStep: React.FC<LifestyleStepProps> = ({ data, onChange }) => {
  const [selectedFoodFrequencies, setSelectedFoodFrequencies] = useState(data.dietAssessment || {});

  const handleInputChange = (field: string, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const handleActivityTypeToggle = (activity: string) => {
    const activities = data.activityTypes || [];
    const updatedActivities = activities.includes(activity)
      ? activities.filter((a: string) => a !== activity)
      : [...activities, activity];
    handleInputChange('activityTypes', updatedActivities);
  };

  const handleStressManagementToggle = (technique: string) => {
    const techniques = data.stressManagement || [];
    const updatedTechniques = techniques.includes(technique)
      ? techniques.filter((t: string) => t !== technique)
      : [...techniques, technique];
    handleInputChange('stressManagement', updatedTechniques);
  };

  const handleFoodFrequencyChange = (category: string, frequency: string) => {
    const updated = { ...selectedFoodFrequencies, [category]: frequency };
    setSelectedFoodFrequencies(updated);
    handleInputChange('dietAssessment', updated);
  };

  const getWellnessScore = () => {
    let score = 50; // Base score
    
    // Exercise frequency
    const exerciseFreq = data.exerciseFrequency || 0;
    if (exerciseFreq >= 5) score += 20;
    else if (exerciseFreq >= 3) score += 15;
    else if (exerciseFreq >= 1) score += 10;
    else score -= 10;
    
    // Sleep hours
    const sleepHours = data.sleepHours || 7;
    if (sleepHours >= 7 && sleepHours <= 9) score += 15;
    else if (sleepHours >= 6 && sleepHours <= 10) score += 10;
    else score -= 5;
    
    // Sleep quality
    const sleepQuality = data.sleepQuality || 3;
    score += (sleepQuality - 3) * 5;
    
    // Stress level (inverted)
    const stressLevel = data.stressLevel || 5;
    score += (10 - stressLevel) * 2;

    // Diet assessment
    const dietData = data.dietAssessment || {};
    if (dietData['fruits_vegetables'] === 'daily' || dietData['fruits_vegetables'] === 'often') score += 10;
    if (dietData['processed_foods'] === 'never' || dietData['processed_foods'] === 'rarely') score += 10;
    if (dietData['sugary_drinks'] === 'never' || dietData['sugary_drinks'] === 'rarely') score += 5;
    
    return Math.min(Math.max(score, 0), 100);
  };

  const wellnessScore = getWellnessScore();

  const foodCategories = [
    { name: 'Fruits & Vegetables', key: 'fruits_vegetables', color: 'green', positive: true, icon: '🥬' },
    { name: 'Whole Grains', key: 'whole_grains', color: 'amber', positive: true, icon: '🌾' },
    { name: 'Lean Proteins', key: 'lean_proteins', color: 'blue', positive: true, icon: '🐟' },
    { name: 'Processed Foods', key: 'processed_foods', color: 'red', positive: false, icon: '🍟' },
    { name: 'Sugary Drinks', key: 'sugary_drinks', color: 'pink', positive: false, icon: '🥤' },
    { name: 'Fast Food', key: 'fast_food', color: 'orange', positive: false, icon: '🍔' }
  ];

  const frequencyOptions = ['Never', 'Rarely', 'Sometimes', 'Often', 'Daily'];

  const wearableDevices = [
    { name: 'Fitbit', icon: '⌚', color: 'bg-blue-100 text-blue-600' },
    { name: 'Apple Watch', icon: '🍎', color: 'bg-gray-100 text-gray-600' },
    { name: 'Garmin', icon: '🏃', color: 'bg-green-100 text-green-600' },
    { name: 'Samsung Health', icon: '📱', color: 'bg-purple-100 text-purple-600' }
  ];

  return (
    <div className="space-y-8">
      <div className="border-b border-gray-200 pb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Lifestyle Assessment</h2>
        <p className="text-gray-600">
          Your lifestyle choices significantly impact your health and insurance rates.
        </p>
        
        {/* Wellness Score Gamification */}
        <div className="mt-6 p-6 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl border border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Your Wellness Score</h3>
                <p className="text-sm text-gray-600">Real-time health assessment</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">{wellnessScore}</div>
              <div className="text-sm text-gray-600">out of 100</div>
            </div>
          </div>
          
          <div className="relative">
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className={`h-4 rounded-full transition-all duration-1000 ease-out ${
                  wellnessScore >= 75 ? 'bg-gradient-to-r from-green-400 to-green-600' :
                  wellnessScore >= 50 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' : 
                  'bg-gradient-to-r from-red-400 to-red-600'
                }`}
                style={{ width: `${wellnessScore}%` }}
              />
            </div>
            <div className="mt-2 flex justify-between text-xs text-gray-500">
              <span>Needs Improvement</span>
              <span>Good</span>
              <span>Excellent</span>
            </div>
          </div>

          <div className="mt-4 flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-700 font-medium">
              {wellnessScore >= 75 ? 'Excellent lifestyle! This positively impacts your premium.' :
               wellnessScore >= 50 ? 'Good habits! Small improvements can lower your premium.' :
               'Consider lifestyle improvements to reduce your premium.'}
            </span>
          </div>
        </div>
      </div>

      {/* Physical Activity Section */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center">
          <Activity className="w-5 h-5 mr-2 text-blue-600" />
          Physical Activity
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-700">
                Exercise Frequency (days per week)
              </label>
              <div className="space-y-3">
                <input
                  type="range"
                  min="0"
                  max="7"
                  value={data.exerciseFrequency || 0}
                  onChange={(e) => handleInputChange('exerciseFrequency', parseInt(e.target.value))}
                  className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${((data.exerciseFrequency || 0) / 7) * 100}%, #E5E7EB ${((data.exerciseFrequency || 0) / 7) * 100}%, #E5E7EB 100%)`
                  }}
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>0 days</span>
                  <span className="font-semibold text-blue-600 text-lg">
                    {data.exerciseFrequency || 0} days/week
                  </span>
                  <span>7 days</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 text-sm p-3 rounded-lg">
                {(data.exerciseFrequency || 0) >= 5 ? (
                  <div className="flex items-center space-x-2 text-green-700 bg-green-50 px-3 py-2 rounded-full">
                    <Zap className="w-4 h-4" />
                    <span className="font-medium">Excellent! Great for heart health</span>
                  </div>
                ) : (data.exerciseFrequency || 0) >= 3 ? (
                  <div className="flex items-center space-x-2 text-blue-700 bg-blue-50 px-3 py-2 rounded-full">
                    <Target className="w-4 h-4" />
                    <span className="font-medium">Good activity level</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 text-amber-700 bg-amber-50 px-3 py-2 rounded-full">
                    <Clock className="w-4 h-4" />
                    <span className="font-medium">Consider increasing activity</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">
                Exercise Intensity
              </label>
              <div className="space-y-2">
                {[
                  { value: 'light', label: 'Light', description: 'Walking, light yoga, stretching' },
                  { value: 'moderate', label: 'Moderate', description: 'Brisk walking, cycling, swimming' },
                  { value: 'vigorous', label: 'Vigorous', description: 'Running, competitive sports, HIIT' }
                ].map(intensity => (
                  <label key={intensity.value} className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name="exerciseIntensity"
                      value={intensity.value}
                      checked={data.exerciseIntensity === intensity.value}
                      onChange={(e) => handleInputChange('exerciseIntensity', e.target.value)}
                      className="w-4 h-4 text-blue-600 mt-1"
                    />
                    <div>
                      <div className="font-medium text-gray-900">{intensity.label}</div>
                      <div className="text-sm text-gray-600">{intensity.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-semibold text-gray-700">Activity Types</label>
            <div className="grid grid-cols-1 gap-3">
              {[
                { name: 'Cardio', icon: '❤️', description: 'Running, cycling, dancing' },
                { name: 'Strength Training', icon: '💪', description: 'Weight lifting, resistance exercises' },
                { name: 'Flexibility', icon: '🧘', description: 'Yoga, stretching, pilates' },
                { name: 'Sports', icon: '⚽', description: 'Team sports, competitive activities' },
                { name: 'Outdoor Activities', icon: '🏔️', description: 'Hiking, climbing, outdoor adventures' },
                { name: 'Swimming', icon: '🏊', description: 'Pool or open water swimming' }
              ].map(activity => (
                <label key={activity.name} className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={(data.activityTypes || []).includes(activity.name)}
                    onChange={() => handleActivityTypeToggle(activity.name)}
                    className="w-4 h-4 text-blue-600 rounded mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{activity.icon}</span>
                      <span className="font-medium text-gray-900">{activity.name}</span>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">{activity.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Nutrition Section */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center">
          <Apple className="w-5 h-5 mr-2 text-green-600" />
          Dietary Habits
        </h3>
        
        <div className="bg-gray-50 rounded-xl p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Visual Food Frequency Assessment</h4>
          <p className="text-sm text-gray-600 mb-6">How often do you consume these food categories?</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {foodCategories.map((category) => (
              <div key={category.key} className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-2xl">{category.icon}</span>
                  <h5 className="font-medium text-gray-900">{category.name}</h5>
                </div>
                
                <div className="space-y-2">
                  {frequencyOptions.map((frequency) => (
                    <label key={frequency} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name={`diet_${category.key}`}
                        value={frequency.toLowerCase()}
                        checked={selectedFoodFrequencies[category.key] === frequency.toLowerCase()}
                        onChange={(e) => handleFoodFrequencyChange(category.key, e.target.value)}
                        className="w-3 h-3 text-blue-600"
                      />
                      <span className="text-sm text-gray-700">{frequency}</span>
                    </label>
                  ))}
                </div>
                
                {selectedFoodFrequencies[category.key] && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className={`text-xs px-2 py-1 rounded-full inline-block ${
                      category.positive 
                        ? (selectedFoodFrequencies[category.key] === 'daily' || selectedFoodFrequencies[category.key] === 'often')
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                        : (selectedFoodFrequencies[category.key] === 'never' || selectedFoodFrequencies[category.key] === 'rarely')
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                    }`}>
                      {category.positive 
                        ? (selectedFoodFrequencies[category.key] === 'daily' || selectedFoodFrequencies[category.key] === 'often')
                          ? 'Great choice!' 
                          : 'Consider more'
                        : (selectedFoodFrequencies[category.key] === 'never' || selectedFoodFrequencies[category.key] === 'rarely')
                          ? 'Excellent!'
                          : 'Reduce if possible'
                      }
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Special Dietary Requirements
            </label>
            <select
              value={data.dietaryRestrictions || ''}
              onChange={(e) => handleInputChange('dietaryRestrictions', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="">None</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="vegan">Vegan</option>
              <option value="keto">Ketogenic</option>
              <option value="diabetic">Diabetic Diet</option>
              <option value="mediterranean">Mediterranean</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sleep & Stress Management Section */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center">
          <Moon className="w-5 h-5 mr-2 text-indigo-600" />
          Sleep & Stress Management
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-4">
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
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>3h</span>
                <span className="font-semibold text-indigo-600 text-lg">
                  {data.sleepHours || 7}h per night
                </span>
                <span>12h</span>
              </div>
              
              <div className="p-3 rounded-lg">
                {(data.sleepHours >= 7 && data.sleepHours <= 9) ? (
                  <div className="flex items-center space-x-2 text-green-700 bg-green-50 px-3 py-2 rounded-full">
                    <span>✓</span>
                    <span className="text-sm font-medium">Optimal sleep duration range</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 text-amber-700 bg-amber-50 px-3 py-2 rounded-full">
                    <span>⚠</span>
                    <span className="text-sm font-medium">Consider adjusting sleep schedule (7-9h recommended)</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-700">
                Sleep Quality Rating
              </label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map(rating => (
                  <button
                    key={rating}
                    onClick={() => handleInputChange('sleepQuality', rating)}
                    className={`flex-1 py-3 px-3 rounded-lg text-sm font-medium transition-all transform hover:scale-105 ${
                      (data.sleepQuality || 3) >= rating
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                  >
                    ⭐{rating}
                  </button>
                ))}
              </div>
              <div className="text-xs text-gray-500 flex justify-between">
                <span>Very Poor</span>
                <span>Poor</span>
                <span>Fair</span>
                <span>Good</span>
                <span>Excellent</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-700">
                Overall Stress Level
              </label>
              <div className="space-y-3">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={data.stressLevel || 5}
                  onChange={(e) => handleInputChange('stressLevel', parseInt(e.target.value))}
                  className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Low (1)</span>
                  <span className="font-semibold text-red-600 text-lg">
                    Stress: {data.stressLevel || 5}/10
                  </span>
                  <span>High (10)</span>
                </div>
              </div>
              
              {/* Stress thermometer visualization */}
              <div className="relative">
                <div className="flex items-center space-x-3">
                  <Brain className="w-5 h-5 text-gray-400" />
                  <div className="flex-1 bg-gray-200 rounded-full h-6 relative overflow-hidden">
                    <div 
                      className={`h-6 rounded-full transition-all duration-500 flex items-center justify-center text-white text-xs font-bold ${
                        (data.stressLevel || 5) <= 3 ? 'bg-gradient-to-r from-green-400 to-green-600' :
                        (data.stressLevel || 5) <= 6 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' : 
                        'bg-gradient-to-r from-red-400 to-red-600'
                      }`}
                      style={{ width: `${((data.stressLevel || 5) / 10) * 100}%` }}
                    >
                      {(data.stressLevel || 5) <= 3 ? 'LOW' :
                       (data.stressLevel || 5) <= 6 ? 'MODERATE' : 'HIGH'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">
                Stress Management Techniques You Use
              </label>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { name: 'Meditation', icon: '🧘', description: 'Mindfulness and meditation practices' },
                  { name: 'Yoga', icon: '🧘‍♀️', description: 'Physical and mental wellness practice' },
                  { name: 'Exercise', icon: '🏃‍♂️', description: 'Physical activity for stress relief' },
                  { name: 'Counseling', icon: '👨‍⚕️', description: 'Professional mental health support' },
                  { name: 'Hobbies', icon: '🎨', description: 'Creative and recreational activities' },
                  { name: 'Social Support', icon: '👥', description: 'Family and friends network' }
                ].map(technique => (
                  <label key={technique.name} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={(data.stressManagement || []).includes(technique.name)}
                      onChange={() => handleStressManagementToggle(technique.name)}
                      className="w-4 h-4 text-blue-600 rounded mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span>{technique.icon}</span>
                        <span className="font-medium text-gray-900">{technique.name}</span>
                      </div>
                      <div className="text-sm text-gray-600 mt-1">{technique.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wearable Device Integration */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center">
          <Smartphone className="w-5 h-5 mr-2 text-purple-600" />
          Wearable Device Data Integration (Optional)
        </h3>
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-dashed border-purple-300 rounded-xl p-8">
          <div className="text-center mb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Connect Your Fitness Tracker</h4>
            <p className="text-gray-600">
              Link your device for real-time health data and potential premium discounts
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {wearableDevices.map((device) => (
              <button
                key={device.name}
                className={`p-4 rounded-lg border-2 border-transparent hover:border-purple-300 transition-all transform hover:scale-105 ${device.color}`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">{device.icon}</div>
                  <div className="text-sm font-medium">{device.name}</div>
                </div>
              </button>
            ))}
          </div>
          
          <div className="bg-white rounded-lg p-4 mb-4">
            <h5 className="font-semibold text-gray-900 mb-2">Data Types We Can Access:</h5>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Heart className="w-4 h-4 text-red-500" />
                <span>Heart Rate</span>
              </div>
              <div className="flex items-center space-x-2">
                <Moon className="w-4 h-4 text-indigo-500" />
                <span>Sleep Patterns</span>
              </div>
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-green-500" />
                <span>Activity Levels</span>
              </div>
              <div className="flex items-center space-x-2">
                <Brain className="w-4 h-4 text-purple-500" />
                <span>Stress Indicators</span>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <button 
              onClick={() => handleInputChange('wearableConnected', !data.wearableConnected)}
              className={`px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 ${
                data.wearableConnected 
                  ? 'bg-green-600 text-white shadow-lg' 
                  : 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg'
              }`}
            >
              {data.wearableConnected ? '✓ Device Connected' : 'Connect Device'}
            </button>
            <p className="text-xs text-gray-500 mt-3">
              Granular privacy controls • Enhanced data permissions • Up to 10% discount
            </p>
          </div>
        </div>
      </div>

      {/* Lifestyle Impact Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-blue-50 border border-blue-200 rounded-xl">
          <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Lifestyle Impact on Premiums
          </h3>
          <ul className="text-sm text-blue-800 space-y-2">
            <li className="flex items-start space-x-2">
              <span className="text-green-600 font-bold">↓</span>
              <span>Regular exercise: Up to 15% reduction</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-green-600 font-bold">↓</span>
              <span>Quality sleep (7-9h): 8% reduction</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-green-600 font-bold">↓</span>
              <span>Stress management: 5% reduction</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-green-600 font-bold">↓</span>
              <span>Healthy diet: 10% reduction</span>
            </li>
          </ul>
        </div>

        <div className="p-6 bg-green-50 border border-green-200 rounded-xl">
          <h3 className="font-semibold text-green-900 mb-3 flex items-center">
            <Target className="w-5 h-5 mr-2" />
            Quick Improvement Tips
          </h3>
          <ul className="text-sm text-green-800 space-y-2">
            <li>• Add 30 minutes of daily walking</li>
            <li>• Establish a consistent sleep schedule</li>
            <li>• Try meditation apps for stress relief</li>
            <li>• Increase fruit and vegetable intake</li>
            <li>• Connect a fitness tracker for data insights</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LifestyleStep;
