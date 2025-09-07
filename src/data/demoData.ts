// Demo scenarios data for the AI-driven insurance platform
export const demoScenarios = [
  {
    id: 'young-professional',
    name: 'Young Professional',
    description: 'Tech worker, age 28, excellent health, active lifestyle',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    demographics: {
      fullName: 'Alex Johnson',
      dateOfBirth: '1995-06-15',
      gender: 'other',
      occupation: 'Software Engineer',
      location: 'San Francisco, CA, USA',
      educationLevel: "Bachelor's Degree"
    },
    health: {
      height: 175,
      weight: 70,
      smokingStatus: 'never',
      alcoholConsumption: 'occasionally',
      medicalConditions: [],
      medications: ''
    },
    lifestyle: {
      exerciseFrequency: 5,
      exerciseIntensity: 'moderate',
      activityTypes: ['Cardio', 'Strength Training', 'Sports'],
      dietAssessment: {
        fruits_vegetables: 'daily',
        whole_grains: 'often',
        lean_proteins: 'daily',
        processed_foods: 'rarely',
        sugary_drinks: 'never',
        fast_food: 'rarely'
      },
      dietaryRestrictions: '',
      sleepHours: 7.5,
      sleepQuality: 4,
      stressLevel: 3,
      stressManagement: ['Exercise', 'Hobbies'],
      wearableConnected: true
    },
    financial: {
      coverageAmount: 400000,
      policyTerm: '20',
      deductiblePreference: 'medium',
      annualIncome: '100000',
      monthlyBudget: 150,
      hasChildren: false,
      hasDebt: true,
      soleProvider: false,
      beneficiaries: [
        { name: 'Jordan Smith', relationship: 'Partner', percentage: 100 }
      ]
    },
    expectedOutcome: {
      riskScore: 25,
      monthlyPremium: 89,
      confidenceLevel: 96,
      category: 'Low Risk',
      savings: 38
    }
  },
  {
    id: 'middle-aged-conditions',
    name: 'Middle-Aged with Conditions',
    description: 'Manager, age 45, pre-diabetic and hypertension, sedentary lifestyle',
    avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    demographics: {
      fullName: 'Michael Chen',
      dateOfBirth: '1978-09-22',
      gender: 'male',
      occupation: 'Manager',
      location: 'Chicago, IL, USA',
      educationLevel: "Master's Degree"
    },
    health: {
      height: 180,
      weight: 95,
      smokingStatus: 'former',
      alcoholConsumption: 'regularly',
      medicalConditions: ['Hypertension', 'Diabetes Type 2'],
      medications: 'Lisinopril 10mg daily, Metformin 500mg twice daily'
    },
    lifestyle: {
      exerciseFrequency: 1,
      exerciseIntensity: 'light',
      activityTypes: ['Cardio'],
      dietAssessment: {
        fruits_vegetables: 'sometimes',
        whole_grains: 'sometimes',
        lean_proteins: 'often',
        processed_foods: 'often',
        sugary_drinks: 'sometimes',
        fast_food: 'sometimes'
      },
      dietaryRestrictions: 'diabetic',
      sleepHours: 6,
      sleepQuality: 2,
      stressLevel: 7,
      stressManagement: ['Social Support'],
      wearableConnected: false
    },
    financial: {
      coverageAmount: 600000,
      policyTerm: '20',
      deductiblePreference: 'low',
      annualIncome: '150000',
      monthlyBudget: 300,
      hasChildren: true,
      hasDebt: true,
      soleProvider: true,
      beneficiaries: [
        { name: 'Lisa Chen', relationship: 'Spouse', percentage: 60 },
        { name: 'Emma Chen', relationship: 'Child', percentage: 20 },
        { name: 'Lucas Chen', relationship: 'Child', percentage: 20 }
      ]
    },
    expectedOutcome: {
      riskScore: 58,
      monthlyPremium: 245,
      confidenceLevel: 92,
      category: 'Medium Risk',
      savings: 22
    }
  },
  {
    id: 'senior-citizen',
    name: 'Senior Citizen',
    description: 'Retired, age 65, multiple conditions, limited activity',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    demographics: {
      fullName: 'Dr. Emily Davis',
      dateOfBirth: '1958-03-10',
      gender: 'female',
      occupation: 'Retired',
      location: 'Miami, FL, USA',
      educationLevel: 'Doctorate'
    },
    health: {
      height: 165,
      weight: 75,
      smokingStatus: 'never',
      alcoholConsumption: 'never',
      medicalConditions: ['Hypertension', 'High Cholesterol', 'Arthritis'],
      medications: 'Amlodipine 5mg daily, Atorvastatin 20mg daily, Ibuprofen as needed'
    },
    lifestyle: {
      exerciseFrequency: 2,
      exerciseIntensity: 'light',
      activityTypes: ['Flexibility', 'Outdoor Activities'],
      dietAssessment: {
        fruits_vegetables: 'daily',
        whole_grains: 'often',
        lean_proteins: 'daily',
        processed_foods: 'rarely',
        sugary_drinks: 'never',
        fast_food: 'never'
      },
      dietaryRestrictions: '',
      sleepHours: 8,
      sleepQuality: 3,
      stressLevel: 4,
      stressManagement: ['Meditation', 'Hobbies', 'Social Support'],
      wearableConnected: false
    },
    financial: {
      coverageAmount: 200000,
      policyTerm: '10',
      deductiblePreference: 'low',
      annualIncome: '50000',
      monthlyBudget: 400,
      hasChildren: false,
      hasDebt: false,
      soleProvider: false,
      beneficiaries: [
        { name: 'American Cancer Society', relationship: 'Trust', percentage: 50 },
        { name: 'Sarah Davis', relationship: 'Child', percentage: 50 }
      ]
    },
    expectedOutcome: {
      riskScore: 72,
      monthlyPremium: 385,
      confidenceLevel: 89,
      category: 'High Risk',
      savings: 15
    }
  }
];

export const aiMetrics = {
  processingTime: '2.3 seconds',
  accuracyRate: '78%',
  biasDetection: '100%',
  dataPoints: '200+',
  modelsUsed: ['Random Forest', 'XGBoost', 'Neural Networks', 'Ensemble'],
  confidenceRange: '89-96%',
  traditionalAccuracy: '7-10%',
  speedImprovement: '95%',
  customerSatisfaction: '4.5/5'
};

export const complianceFeatures = {
  gdprCompliant: true,
  soc2Certified: true,
  aiEthicsVerified: true,
  wcagCompliant: 'AA',
  dataEncryption: 'AES-256',
  auditTrail: 'Complete',
  biasMonitoring: 'Real-time',
  explainability: 'SHAP + LIME'
};

export const industryBenchmarks = {
  traditionalProcessingTime: '2-4 weeks',
  traditionalAccuracy: '7-10%',
  traditionalDataPoints: '10-20',
  traditionalBiasDetection: 'Manual',
  traditionalCustomerSatisfaction: '2.8/5'
};
