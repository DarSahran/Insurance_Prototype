export interface Question {
  id: string;
  question: string;
  type: 'text' | 'number' | 'select' | 'multiselect' | 'boolean' | 'date' | 'range';
  options?: string[];
  required: boolean;
  category: string;
  mlFeature: string;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

export const COMMON_DEMOGRAPHICS: Question[] = [
  { id: 'fullName', question: 'Full Name', type: 'text', required: true, category: 'demographics', mlFeature: 'name' },
  { id: 'dateOfBirth', question: 'Date of Birth', type: 'date', required: true, category: 'demographics', mlFeature: 'age', validation: { max: new Date().getTime() } },
  { id: 'gender', question: 'Gender', type: 'select', options: ['Male', 'Female', 'Other'], required: true, category: 'demographics', mlFeature: 'gender' },
  { id: 'maritalStatus', question: 'Marital Status', type: 'select', options: ['Single', 'Married', 'Divorced', 'Widowed'], required: true, category: 'demographics', mlFeature: 'marital_status' },
  { id: 'dependents', question: 'Number of Dependents', type: 'number', required: false, category: 'demographics', mlFeature: 'num_dependents', validation: { min: 0, max: 20 } },
  { id: 'occupation', question: 'Occupation', type: 'select', options: ['Software Engineer', 'Doctor', 'Teacher', 'Business Owner', 'Student', 'Retired', 'Other'], required: true, category: 'demographics', mlFeature: 'occupation' },
  { id: 'location', question: 'City', type: 'text', required: true, category: 'demographics', mlFeature: 'location' },
  { id: 'annualIncome', question: 'Annual Income (₹)', type: 'number', required: true, category: 'demographics', mlFeature: 'annual_income', validation: { min: 0 } },
];

export const TERM_LIFE_QUESTIONS: Question[] = [
  ...COMMON_DEMOGRAPHICS,
  { id: 'coverageAmount', question: 'Desired Coverage Amount (₹)', type: 'number', required: true, category: 'coverage', mlFeature: 'coverage_amount', validation: { min: 500000 } },
  { id: 'policyTerm', question: 'Policy Term (Years)', type: 'select', options: ['10', '15', '20', '25', '30'], required: true, category: 'coverage', mlFeature: 'policy_term' },
  { id: 'height', question: 'Height (cm)', type: 'number', required: true, category: 'health', mlFeature: 'height', validation: { min: 100, max: 250 } },
  { id: 'weight', question: 'Weight (kg)', type: 'number', required: true, category: 'health', mlFeature: 'weight', validation: { min: 30, max: 200 } },
  { id: 'smokingStatus', question: 'Smoking Status', type: 'select', options: ['Never', 'Former (quit >1 year)', 'Current'], required: true, category: 'health', mlFeature: 'smoking_status' },
  { id: 'alcoholConsumption', question: 'Alcohol Consumption', type: 'select', options: ['None', 'Occasional', 'Regular'], required: true, category: 'health', mlFeature: 'alcohol_consumption' },
  { id: 'medicalConditions', question: 'Existing Medical Conditions', type: 'multiselect', options: ['None', 'Diabetes', 'Hypertension', 'Heart Disease', 'Asthma', 'Cancer', 'Other'], required: true, category: 'health', mlFeature: 'medical_conditions' },
  { id: 'familyHistory', question: 'Family History of Serious Illness', type: 'multiselect', options: ['None', 'Heart Disease', 'Cancer', 'Diabetes', 'Stroke'], required: true, category: 'health', mlFeature: 'family_history' },
  { id: 'exerciseFrequency', question: 'Exercise Frequency (days/week)', type: 'range', required: true, category: 'lifestyle', mlFeature: 'exercise_frequency', validation: { min: 0, max: 7 } },
  { id: 'hasNominee', question: 'Do you have a nominee in mind?', type: 'boolean', required: true, category: 'coverage', mlFeature: 'has_nominee' },
];

export const HEALTH_INSURANCE_QUESTIONS: Question[] = [
  ...COMMON_DEMOGRAPHICS,
  { id: 'coverageAmount', question: 'Desired Coverage Amount (₹)', type: 'select', options: ['300000', '500000', '1000000', '2000000', '5000000'], required: true, category: 'coverage', mlFeature: 'coverage_amount' },
  { id: 'height', question: 'Height (cm)', type: 'number', required: true, category: 'health', mlFeature: 'height', validation: { min: 100, max: 250 } },
  { id: 'weight', question: 'Weight (kg)', type: 'number', required: true, category: 'health', mlFeature: 'weight', validation: { min: 30, max: 200 } },
  { id: 'priorHealthInsurance', question: 'Do you have existing health insurance?', type: 'boolean', required: true, category: 'coverage', mlFeature: 'prior_insurance' },
  { id: 'medicalConditions', question: 'Existing Medical Conditions', type: 'multiselect', options: ['None', 'Diabetes', 'Hypertension', 'Heart Disease', 'Asthma', 'Thyroid', 'Arthritis', 'Other'], required: true, category: 'health', mlFeature: 'medical_conditions' },
  { id: 'hospitalizationHistory', question: 'Hospitalized in last 3 years?', type: 'boolean', required: true, category: 'health', mlFeature: 'hospitalization_history' },
  { id: 'surgeryHistory', question: 'Any surgeries in the past?', type: 'boolean', required: true, category: 'health', mlFeature: 'surgery_history' },
  { id: 'medications', question: 'Currently on any medications?', type: 'boolean', required: true, category: 'health', mlFeature: 'on_medications' },
  { id: 'smokingStatus', question: 'Smoking Status', type: 'select', options: ['Never', 'Former', 'Current'], required: true, category: 'health', mlFeature: 'smoking_status' },
  { id: 'alcoholConsumption', question: 'Alcohol Consumption', type: 'select', options: ['None', 'Occasional', 'Regular'], required: true, category: 'health', mlFeature: 'alcohol_consumption' },
  { id: 'exerciseFrequency', question: 'Exercise Frequency (days/week)', type: 'range', required: true, category: 'lifestyle', mlFeature: 'exercise_frequency', validation: { min: 0, max: 7 } },
  { id: 'preferredHospitals', question: 'Do you have preferred hospitals/network?', type: 'text', required: false, category: 'coverage', mlFeature: 'preferred_hospitals' },
];

export const FAMILY_HEALTH_QUESTIONS: Question[] = [
  ...COMMON_DEMOGRAPHICS,
  { id: 'familySize', question: 'Number of Family Members to Cover', type: 'number', required: true, category: 'coverage', mlFeature: 'family_size', validation: { min: 2, max: 10 } },
  { id: 'coverageAmount', question: 'Total Family Coverage Amount (₹)', type: 'select', options: ['500000', '1000000', '2000000', '5000000', '10000000'], required: true, category: 'coverage', mlFeature: 'coverage_amount' },
  { id: 'agesOfMembers', question: 'Ages of family members (comma separated)', type: 'text', required: true, category: 'demographics', mlFeature: 'family_ages' },
  { id: 'seniorCitizens', question: 'Number of senior citizens (60+)', type: 'number', required: true, category: 'demographics', mlFeature: 'senior_citizens', validation: { min: 0 } },
  { id: 'childrenCount', question: 'Number of children', type: 'number', required: true, category: 'demographics', mlFeature: 'children_count', validation: { min: 0 } },
  { id: 'priorHealthInsurance', question: 'Existing family health insurance?', type: 'boolean', required: true, category: 'coverage', mlFeature: 'prior_insurance' },
  { id: 'familyMedicalHistory', question: 'Any family member with chronic conditions?', type: 'multiselect', options: ['None', 'Diabetes', 'Hypertension', 'Heart Disease', 'Asthma', 'Cancer'], required: true, category: 'health', mlFeature: 'family_medical_history' },
  { id: 'maternityCoverage', question: 'Need maternity coverage?', type: 'boolean', required: true, category: 'coverage', mlFeature: 'maternity_coverage' },
];

export const CAR_INSURANCE_QUESTIONS: Question[] = [
  ...COMMON_DEMOGRAPHICS.filter(q => ['fullName', 'dateOfBirth', 'gender', 'occupation', 'location', 'annualIncome'].includes(q.id)),
  { id: 'vehicleMake', question: 'Vehicle Make', type: 'select', options: ['Maruti Suzuki', 'Hyundai', 'Tata', 'Honda', 'Toyota', 'Mahindra', 'Other'], required: true, category: 'vehicle', mlFeature: 'vehicle_make' },
  { id: 'vehicleModel', question: 'Vehicle Model', type: 'text', required: true, category: 'vehicle', mlFeature: 'vehicle_model' },
  { id: 'vehicleYear', question: 'Year of Manufacture', type: 'number', required: true, category: 'vehicle', mlFeature: 'vehicle_year', validation: { min: 2000, max: new Date().getFullYear() } },
  { id: 'vehicleValue', question: 'Current Vehicle Value (₹)', type: 'number', required: true, category: 'vehicle', mlFeature: 'vehicle_value', validation: { min: 50000 } },
  { id: 'coverageType', question: 'Coverage Type', type: 'select', options: ['Third Party', 'Comprehensive', 'Zero Depreciation'], required: true, category: 'coverage', mlFeature: 'coverage_type' },
  { id: 'drivingExperience', question: 'Years of Driving Experience', type: 'number', required: true, category: 'lifestyle', mlFeature: 'driving_experience', validation: { min: 0 } },
  { id: 'claimHistory', question: 'Filed claims in last 3 years?', type: 'boolean', required: true, category: 'history', mlFeature: 'claim_history' },
  { id: 'parkingType', question: 'Parking Type', type: 'select', options: ['Open', 'Covered', 'Garage'], required: true, category: 'lifestyle', mlFeature: 'parking_type' },
  { id: 'annualMileage', question: 'Annual Mileage (km)', type: 'number', required: true, category: 'lifestyle', mlFeature: 'annual_mileage', validation: { min: 0 } },
];

export const TWO_WHEELER_QUESTIONS: Question[] = [
  ...COMMON_DEMOGRAPHICS.filter(q => ['fullName', 'dateOfBirth', 'gender', 'occupation', 'location', 'annualIncome'].includes(q.id)),
  { id: 'vehicleMake', question: 'Bike Make', type: 'select', options: ['Hero', 'Honda', 'Bajaj', 'TVS', 'Royal Enfield', 'Yamaha', 'Other'], required: true, category: 'vehicle', mlFeature: 'vehicle_make' },
  { id: 'vehicleModel', question: 'Bike Model', type: 'text', required: true, category: 'vehicle', mlFeature: 'vehicle_model' },
  { id: 'vehicleYear', question: 'Year of Manufacture', type: 'number', required: true, category: 'vehicle', mlFeature: 'vehicle_year', validation: { min: 2000, max: new Date().getFullYear() } },
  { id: 'vehicleValue', question: 'Current Bike Value (₹)', type: 'number', required: true, category: 'vehicle', mlFeature: 'vehicle_value', validation: { min: 10000 } },
  { id: 'coverageType', question: 'Coverage Type', type: 'select', options: ['Third Party', 'Comprehensive'], required: true, category: 'coverage', mlFeature: 'coverage_type' },
  { id: 'drivingExperience', question: 'Years of Riding Experience', type: 'number', required: true, category: 'lifestyle', mlFeature: 'driving_experience', validation: { min: 0 } },
  { id: 'claimHistory', question: 'Filed claims in last 3 years?', type: 'boolean', required: true, category: 'history', mlFeature: 'claim_history' },
];

export const TRAVEL_INSURANCE_QUESTIONS: Question[] = [
  ...COMMON_DEMOGRAPHICS.filter(q => ['fullName', 'dateOfBirth', 'gender', 'location'].includes(q.id)),
  { id: 'destination', question: 'Travel Destination', type: 'text', required: true, category: 'travel', mlFeature: 'destination' },
  { id: 'travelDuration', question: 'Duration of Travel (Days)', type: 'number', required: true, category: 'travel', mlFeature: 'travel_duration', validation: { min: 1, max: 365 } },
  { id: 'numberOfTravelers', question: 'Number of Travelers', type: 'number', required: true, category: 'travel', mlFeature: 'num_travelers', validation: { min: 1, max: 10 } },
  { id: 'travelType', question: 'Type of Travel', type: 'select', options: ['Leisure', 'Business', 'Adventure', 'Medical'], required: true, category: 'travel', mlFeature: 'travel_type' },
  { id: 'coverageAmount', question: 'Coverage Amount (₹)', type: 'select', options: ['100000', '300000', '500000', '1000000'], required: true, category: 'coverage', mlFeature: 'coverage_amount' },
  { id: 'preExistingConditions', question: 'Any pre-existing medical conditions?', type: 'boolean', required: true, category: 'health', mlFeature: 'pre_existing_conditions' },
  { id: 'adventureActivities', question: 'Planning adventure activities?', type: 'boolean', required: true, category: 'travel', mlFeature: 'adventure_activities' },
];

export const INVESTMENT_QUESTIONS: Question[] = [
  ...COMMON_DEMOGRAPHICS,
  { id: 'investmentGoal', question: 'Investment Goal', type: 'select', options: ['Wealth Creation', 'Child Education', 'Retirement', 'Tax Saving', 'Other'], required: true, category: 'financial', mlFeature: 'investment_goal' },
  { id: 'investmentAmount', question: 'Investment Amount (₹)', type: 'number', required: true, category: 'financial', mlFeature: 'investment_amount', validation: { min: 50000 } },
  { id: 'investmentTenure', question: 'Investment Tenure (Years)', type: 'select', options: ['5', '10', '15', '20', '25'], required: true, category: 'financial', mlFeature: 'investment_tenure' },
  { id: 'riskAppetite', question: 'Risk Appetite', type: 'select', options: ['Conservative', 'Moderate', 'Aggressive'], required: true, category: 'financial', mlFeature: 'risk_appetite' },
  { id: 'existingInvestments', question: 'Existing Investments (₹)', type: 'number', required: false, category: 'financial', mlFeature: 'existing_investments', validation: { min: 0 } },
];

export const RETIREMENT_QUESTIONS: Question[] = [
  ...COMMON_DEMOGRAPHICS,
  { id: 'retirementAge', question: 'Planned Retirement Age', type: 'number', required: true, category: 'financial', mlFeature: 'retirement_age', validation: { min: 50, max: 75 } },
  { id: 'monthlyExpenses', question: 'Current Monthly Expenses (₹)', type: 'number', required: true, category: 'financial', mlFeature: 'monthly_expenses', validation: { min: 0 } },
  { id: 'desiredMonthlyIncome', question: 'Desired Monthly Income Post-Retirement (₹)', type: 'number', required: true, category: 'financial', mlFeature: 'desired_monthly_income', validation: { min: 0 } },
  { id: 'existingRetirementCorpus', question: 'Existing Retirement Corpus (₹)', type: 'number', required: false, category: 'financial', mlFeature: 'existing_corpus', validation: { min: 0 } },
  { id: 'investmentAmount', question: 'Monthly Investment Capacity (₹)', type: 'number', required: true, category: 'financial', mlFeature: 'investment_amount', validation: { min: 1000 } },
];

export const HOME_INSURANCE_QUESTIONS: Question[] = [
  ...COMMON_DEMOGRAPHICS.filter(q => ['fullName', 'dateOfBirth', 'gender', 'occupation', 'location', 'annualIncome'].includes(q.id)),
  { id: 'propertyType', question: 'Property Type', type: 'select', options: ['Apartment', 'Independent House', 'Villa'], required: true, category: 'property', mlFeature: 'property_type' },
  { id: 'propertyValue', question: 'Property Value (₹)', type: 'number', required: true, category: 'property', mlFeature: 'property_value', validation: { min: 500000 } },
  { id: 'constructionYear', question: 'Year of Construction', type: 'number', required: true, category: 'property', mlFeature: 'construction_year', validation: { min: 1950, max: new Date().getFullYear() } },
  { id: 'contentsValue', question: 'Contents Value (₹)', type: 'number', required: true, category: 'property', mlFeature: 'contents_value', validation: { min: 100000 } },
  { id: 'securityFeatures', question: 'Security Features', type: 'multiselect', options: ['CCTV', 'Security Guard', 'Gated Community', 'Alarm System', 'None'], required: true, category: 'property', mlFeature: 'security_features' },
  { id: 'naturalDisasterZone', question: 'Located in flood/earthquake zone?', type: 'boolean', required: true, category: 'property', mlFeature: 'disaster_zone' },
];

export const TERM_ROP_QUESTIONS: Question[] = [
  ...TERM_LIFE_QUESTIONS,
  { id: 'premiumReturnPreference', question: 'When would you like premium return?', type: 'select', options: ['At Maturity', 'Death Benefit + Return'], required: true, category: 'coverage', mlFeature: 'premium_return_preference' },
];

export const INSURANCE_QUESTIONS_MAP: Record<string, Question[]> = {
  term_life: TERM_LIFE_QUESTIONS,
  health: HEALTH_INSURANCE_QUESTIONS,
  family_health: FAMILY_HEALTH_QUESTIONS,
  car: CAR_INSURANCE_QUESTIONS,
  two_wheeler: TWO_WHEELER_QUESTIONS,
  travel: TRAVEL_INSURANCE_QUESTIONS,
  investment: INVESTMENT_QUESTIONS,
  retirement: RETIREMENT_QUESTIONS,
  home: HOME_INSURANCE_QUESTIONS,
  term_rop: TERM_ROP_QUESTIONS,
};
