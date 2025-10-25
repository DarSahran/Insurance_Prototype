export interface AssessmentField {
  type: 'text' | 'select' | 'radio' | 'date' | 'number' | 'multiselect' | 'checkbox';
  label: string;
  name: string;
  options?: string[];
  required?: boolean;
  placeholder?: string;
}

export interface AssessmentStep {
  step: number;
  title: string;
  fields?: AssessmentField[];
  behavior?: string;
  description?: string;
}

export interface InsuranceAssessment {
  name: string;
  type: string;
  tagline: string;
  icon: string;
  basePrice: number;
  pricePerYear: { 1: number; 2: number; 3: number; 4: number };
  assessment: {
    flow: AssessmentStep[];
  };
}

export const insuranceAssessments: Record<string, InsuranceAssessment> = {
  'term-life': {
    name: 'Term Life Insurance',
    type: 'term-life',
    tagline: 'Secure your family\'s future',
    icon: 'Shield',
    basePrice: 500,
    pricePerYear: { 1: 500, 2: 950, 3: 1350, 4: 1700 },
    assessment: {
      flow: [
        {
          step: 1,
          title: 'Login Details',
          fields: [
            { type: 'radio', label: 'Gender', name: 'gender', options: ['Male', 'Female', 'Other'], required: true },
            { type: 'text', label: 'Full Name', name: 'fullName', required: true },
            { type: 'date', label: 'Date of Birth', name: 'dob', required: true },
            { type: 'text', label: 'Mobile Number', name: 'mobile', required: true, placeholder: '+91' }
          ]
        },
        {
          step: 2,
          title: 'Occupation Type',
          fields: [
            { type: 'radio', label: 'Select your occupation', name: 'occupation', options: ['Salaried', 'Self Employed', 'Housewife'], required: true }
          ]
        },
        {
          step: 3,
          title: 'Annual Income',
          fields: [
            { type: 'radio', label: 'What is your annual income?', name: 'annualIncome', options: ['Below ₹5L', '₹5L-10L', '₹10L-25L', '₹25L+'], required: true }
          ]
        },
        {
          step: 4,
          title: 'Educational Qualification',
          fields: [
            { type: 'radio', label: 'Highest educational qualification', name: 'education', options: ['College Graduate and above', '12th Pass', '10th Pass', 'Below 10th'], required: true }
          ]
        },
        {
          step: 5,
          title: 'Tobacco Usage',
          fields: [
            { type: 'radio', label: 'Do you smoke or chew tobacco?', name: 'tobacco', options: ['Yes', 'No'], required: true }
          ]
        },
        {
          step: 6,
          title: 'Location',
          behavior: 'fetchNearbyCities',
          fields: [
            { type: 'text', label: 'Please select your current city', name: 'city', required: true }
          ]
        },
        {
          step: 7,
          title: 'Policy Duration',
          fields: [
            { type: 'radio', label: 'Select policy period', name: 'policyPeriod', options: ['1 Year', '2 Years', '3 Years', '4 Years'], required: true }
          ]
        }
      ]
    }
  },

  'health': {
    name: 'Health Insurance',
    type: 'health',
    tagline: 'Comprehensive health coverage',
    icon: 'Heart',
    basePrice: 800,
    pricePerYear: { 1: 800, 2: 1500, 3: 2100, 4: 2600 },
    assessment: {
      flow: [
        {
          step: 1,
          title: 'Gender',
          fields: [
            { type: 'radio', label: 'Select gender', name: 'gender', options: ['Male', 'Female', 'Other'], required: true }
          ]
        },
        {
          step: 2,
          title: 'Family Members',
          fields: [
            { type: 'multiselect', label: 'Select members you want to insure', name: 'members', options: ['Self', 'Spouse', 'Son', 'Daughter', 'Father', 'Mother', 'Father-in-Law', 'Mother-in-Law', 'Grandfather', 'Grandmother'], required: true }
          ]
        },
        {
          step: 3,
          title: 'Age Details',
          fields: [
            { type: 'number', label: 'Your age', name: 'age', required: true }
          ]
        },
        {
          step: 4,
          title: 'Location',
          fields: [
            { type: 'text', label: 'Select your city', name: 'city', required: true }
          ]
        },
        {
          step: 5,
          title: 'Contact Details',
          fields: [
            { type: 'text', label: 'Full Name', name: 'fullName', required: true },
            { type: 'text', label: 'Phone Number', name: 'phone', required: true }
          ]
        },
        {
          step: 6,
          title: 'Medical History',
          fields: [
            { type: 'multiselect', label: 'Select any existing illnesses', name: 'existingIllness', options: ['Diabetes', 'Hypertension', 'Heart Disease', 'Asthma', 'Thyroid', 'None'], required: true }
          ]
        },
        {
          step: 7,
          title: 'Coverage Amount',
          fields: [
            { type: 'radio', label: 'Select coverage amount', name: 'coverageAmount', options: ['₹5 Lakhs', '₹10 Lakhs', '₹15 Lakhs', '₹25 Lakhs', '₹50 Lakhs'], required: true }
          ]
        },
        {
          step: 8,
          title: 'Policy Duration',
          fields: [
            { type: 'radio', label: 'Select policy period', name: 'policyPeriod', options: ['1 Year', '2 Years', '3 Years', '4 Years'], required: true }
          ]
        }
      ]
    }
  },

  'car': {
    name: 'Car Insurance',
    type: 'car',
    tagline: 'Protect your vehicle',
    icon: 'Car',
    basePrice: 3000,
    pricePerYear: { 1: 3000, 2: 5700, 3: 8100, 4: 10200 },
    assessment: {
      flow: [
        {
          step: 1,
          title: 'Vehicle Number',
          fields: [
            { type: 'text', label: 'Enter car registration number', name: 'vehicleNumber', required: true, placeholder: 'MH01AB1234' }
          ]
        },
        {
          step: 2,
          title: 'Vehicle Details',
          fields: [
            { type: 'text', label: 'Car Make', name: 'make', required: true },
            { type: 'text', label: 'Car Model', name: 'model', required: true },
            { type: 'number', label: 'Manufacturing Year', name: 'year', required: true },
            { type: 'select', label: 'Fuel Type', name: 'fuelType', options: ['Petrol', 'Diesel', 'CNG', 'Electric'], required: true }
          ]
        },
        {
          step: 3,
          title: 'Policy Details',
          fields: [
            { type: 'date', label: 'Current Policy Expiry Date', name: 'policyExpiry', required: true },
            { type: 'radio', label: 'Any claims in last year?', name: 'claimHistory', options: ['Yes', 'No'], required: true }
          ]
        },
        {
          step: 4,
          title: 'Coverage Type',
          fields: [
            { type: 'radio', label: 'Select coverage', name: 'coverageType', options: ['Comprehensive', 'Third Party Only'], required: true }
          ]
        },
        {
          step: 5,
          title: 'Policy Duration',
          fields: [
            { type: 'radio', label: 'Select policy period', name: 'policyPeriod', options: ['1 Year', '2 Years', '3 Years'], required: true }
          ]
        }
      ]
    }
  },

  'two-wheeler': {
    name: 'Two Wheeler Insurance',
    type: 'two-wheeler',
    tagline: 'Bike insurance coverage',
    icon: 'Bike',
    basePrice: 800,
    pricePerYear: { 1: 800, 2: 1500, 3: 2100, 4: 0 },
    assessment: {
      flow: [
        {
          step: 1,
          title: 'Vehicle Number',
          fields: [
            { type: 'text', label: 'Enter two-wheeler registration number', name: 'vehicleNumber', required: true, placeholder: 'MH01AB1234' }
          ]
        },
        {
          step: 2,
          title: 'Vehicle Details',
          fields: [
            { type: 'text', label: 'Bike Make', name: 'make', required: true },
            { type: 'text', label: 'Bike Model', name: 'model', required: true },
            { type: 'number', label: 'Manufacturing Year', name: 'year', required: true }
          ]
        },
        {
          step: 3,
          title: 'Policy Details',
          fields: [
            { type: 'date', label: 'Current Policy Expiry Date', name: 'policyExpiry', required: true },
            { type: 'radio', label: 'Any claims in last year?', name: 'claimHistory', options: ['Yes', 'No'], required: true }
          ]
        },
        {
          step: 4,
          title: 'Coverage Type',
          fields: [
            { type: 'radio', label: 'Select coverage', name: 'coverageType', options: ['Comprehensive', 'Third Party Only'], required: true }
          ]
        },
        {
          step: 5,
          title: 'Policy Duration',
          fields: [
            { type: 'radio', label: 'Select policy period', name: 'policyPeriod', options: ['1 Year', '2 Years', '3 Years'], required: true }
          ]
        }
      ]
    }
  },

  'investment': {
    name: 'Investment Plan',
    type: 'investment',
    tagline: 'Grow your wealth',
    icon: 'TrendingUp',
    basePrice: 10000,
    pricePerYear: { 1: 10000, 2: 19000, 3: 27000, 4: 34000 },
    assessment: {
      flow: [
        {
          step: 1,
          title: 'Personal Details',
          fields: [
            { type: 'text', label: 'Full Name', name: 'fullName', required: true },
            { type: 'text', label: 'Mobile Number', name: 'mobile', required: true }
          ]
        },
        {
          step: 2,
          title: 'Location',
          fields: [
            { type: 'text', label: 'Which city do you live in?', name: 'city', required: true }
          ]
        },
        {
          step: 3,
          title: 'Age',
          fields: [
            { type: 'number', label: 'What\'s your age?', name: 'age', required: true }
          ]
        },
        {
          step: 4,
          title: 'Income Range',
          fields: [
            { type: 'radio', label: 'Select your income range', name: 'income', options: ['Below ₹5L', '₹5L-10L', '₹10L-25L', '₹25L+'], required: true }
          ]
        },
        {
          step: 5,
          title: 'Investment Amount',
          fields: [
            { type: 'radio', label: 'Monthly investment amount', name: 'investmentAmount', options: ['₹5,000', '₹10,000', '₹25,000', '₹50,000+'], required: true }
          ]
        },
        {
          step: 6,
          title: 'Policy Duration',
          fields: [
            { type: 'radio', label: 'Select policy period', name: 'policyPeriod', options: ['1 Year', '2 Years', '3 Years', '4 Years'], required: true }
          ]
        }
      ]
    }
  },

  'travel': {
    name: 'Travel Insurance',
    type: 'travel',
    tagline: 'Safe journeys worldwide',
    icon: 'Plane',
    basePrice: 500,
    pricePerYear: { 1: 500, 2: 950, 3: 1350, 4: 1700 },
    assessment: {
      flow: [
        {
          step: 1,
          title: 'Destination',
          fields: [
            { type: 'text', label: 'Enter destination country', name: 'destination', required: true }
          ]
        },
        {
          step: 2,
          title: 'Travel Dates',
          fields: [
            { type: 'date', label: 'Start Date', name: 'startDate', required: true },
            { type: 'date', label: 'End Date', name: 'endDate', required: true }
          ]
        },
        {
          step: 3,
          title: 'Travelers',
          fields: [
            { type: 'radio', label: 'Number of travelers', name: 'travelers', options: ['1', '2', '3', '4+'], required: true }
          ]
        },
        {
          step: 4,
          title: 'Traveler Ages',
          fields: [
            { type: 'text', label: 'Enter ages (comma separated)', name: 'ages', required: true, placeholder: '25, 30' }
          ]
        },
        {
          step: 5,
          title: 'Medical Conditions',
          fields: [
            { type: 'radio', label: 'Any pre-existing medical conditions?', name: 'medicalConditions', options: ['Yes', 'No'], required: true }
          ]
        },
        {
          step: 6,
          title: 'Coverage Amount',
          fields: [
            { type: 'radio', label: 'Select coverage', name: 'coverage', options: ['₹5 Lakhs', '₹10 Lakhs', '₹25 Lakhs', '₹50 Lakhs'], required: true }
          ]
        }
      ]
    }
  },

  'retirement': {
    name: 'Retirement Plans',
    type: 'retirement',
    tagline: 'Plan your golden years',
    icon: 'Palmtree',
    basePrice: 15000,
    pricePerYear: { 1: 15000, 2: 28500, 3: 40500, 4: 51000 },
    assessment: {
      flow: [
        {
          step: 1,
          title: 'Location',
          fields: [
            { type: 'text', label: 'Provide your city', name: 'city', required: true }
          ]
        },
        {
          step: 2,
          title: 'Age',
          fields: [
            { type: 'number', label: 'Enter your age', name: 'age', required: true }
          ]
        },
        {
          step: 3,
          title: 'Income',
          fields: [
            { type: 'radio', label: 'Select annual income', name: 'income', options: ['>₹15L', '₹10L-15L', '<₹10L'], required: true }
          ]
        },
        {
          step: 4,
          title: 'Retirement Age',
          fields: [
            { type: 'number', label: 'At what age do you plan to retire?', name: 'retirementAge', required: true }
          ]
        },
        {
          step: 5,
          title: 'Policy Duration',
          fields: [
            { type: 'radio', label: 'Select policy period', name: 'policyPeriod', options: ['1 Year', '2 Years', '3 Years', '4 Years'], required: true }
          ]
        }
      ]
    }
  },

  'home': {
    name: 'Home Insurance',
    type: 'home',
    tagline: 'Protect your home',
    icon: 'Home',
    basePrice: 2000,
    pricePerYear: { 1: 2000, 2: 3800, 3: 5400, 4: 6800 },
    assessment: {
      flow: [
        {
          step: 1,
          title: 'Personal Details',
          fields: [
            { type: 'text', label: 'Full Name', name: 'fullName', required: true },
            { type: 'text', label: 'Mobile Number', name: 'mobile', required: true }
          ]
        },
        {
          step: 2,
          title: 'Coverage Selection',
          fields: [
            { type: 'multiselect', label: 'Choose what to cover', name: 'coverage', options: ['Home Structure', 'Household Items', 'Jewelry', 'Electronics'], required: true }
          ]
        },
        {
          step: 3,
          title: 'Property Value',
          fields: [
            { type: 'radio', label: 'Estimated property value', name: 'propertyValue', options: ['₹75L', '₹1Cr', '₹1.5Cr', '₹2Cr+'], required: true }
          ]
        },
        {
          step: 4,
          title: 'Location',
          fields: [
            { type: 'text', label: 'Provide city', name: 'city', required: true }
          ]
        },
        {
          step: 5,
          title: 'Policy Duration',
          fields: [
            { type: 'radio', label: 'Select policy period', name: 'policyPeriod', options: ['1 Year', '2 Years', '3 Years', '4 Years'], required: true }
          ]
        }
      ]
    }
  },

  'family_health': {
    name: 'Family Health Insurance',
    type: 'family_health',
    tagline: 'Complete family protection',
    icon: 'Users',
    basePrice: 1200,
    pricePerYear: { 1: 1200, 2: 2280, 3: 3240, 4: 4080 },
    assessment: {
      flow: [
        {
          step: 1,
          title: 'Personal Details',
          fields: [
            { type: 'text', label: 'Full Name', name: 'fullName', required: true },
            { type: 'text', label: 'Mobile Number', name: 'mobile', required: true }
          ]
        },
        {
          step: 2,
          title: 'Family Members',
          fields: [
            { type: 'multiselect', label: 'Select family members to insure', name: 'members', options: ['Self', 'Spouse', 'Son 1', 'Son 2', 'Daughter 1', 'Daughter 2', 'Father', 'Mother'], required: true }
          ]
        },
        {
          step: 3,
          title: 'Age Details',
          fields: [
            { type: 'number', label: 'Your age', name: 'selfAge', required: true },
            { type: 'number', label: 'Spouse age (if applicable)', name: 'spouseAge', required: false }
          ]
        },
        {
          step: 4,
          title: 'Location',
          fields: [
            { type: 'text', label: 'Select your city', name: 'city', required: true }
          ]
        },
        {
          step: 5,
          title: 'Medical History',
          fields: [
            { type: 'multiselect', label: 'Any existing illnesses in family?', name: 'existingIllness', options: ['Diabetes', 'Hypertension', 'Heart Disease', 'Asthma', 'Thyroid', 'None'], required: true }
          ]
        },
        {
          step: 6,
          title: 'Coverage Amount',
          fields: [
            { type: 'radio', label: 'Select sum insured', name: 'coverageAmount', options: ['₹5 Lakhs', '₹10 Lakhs', '₹15 Lakhs', '₹25 Lakhs', '₹50 Lakhs'], required: true }
          ]
        },
        {
          step: 7,
          title: 'Policy Duration',
          fields: [
            { type: 'radio', label: 'Select policy period', name: 'policyPeriod', options: ['1 Year', '2 Years', '3 Years', '4 Years'], required: true }
          ]
        }
      ]
    }
  },

  'term_rop': {
    name: 'Term Life with Return of Premium',
    type: 'term_rop',
    tagline: 'Term life with returns',
    icon: 'Shield',
    basePrice: 1000,
    pricePerYear: { 1: 1000, 2: 1900, 3: 2700, 4: 3400 },
    assessment: {
      flow: [
        {
          step: 1,
          title: 'Personal Details',
          fields: [
            { type: 'radio', label: 'Gender', name: 'gender', options: ['Male', 'Female', 'Other'], required: true },
            { type: 'text', label: 'Full Name', name: 'fullName', required: true },
            { type: 'date', label: 'Date of Birth', name: 'dob', required: true },
            { type: 'text', label: 'Mobile Number', name: 'mobile', required: true, placeholder: '+91' }
          ]
        },
        {
          step: 2,
          title: 'Occupation Type',
          fields: [
            { type: 'radio', label: 'Select your occupation', name: 'occupation', options: ['Salaried', 'Self Employed', 'Housewife', 'Professional'], required: true }
          ]
        },
        {
          step: 3,
          title: 'Annual Income',
          fields: [
            { type: 'radio', label: 'What is your annual income?', name: 'annualIncome', options: ['Below ₹5L', '₹5L-10L', '₹10L-25L', '₹25L+'], required: true }
          ]
        },
        {
          step: 4,
          title: 'Coverage Amount',
          fields: [
            { type: 'radio', label: 'Select sum assured', name: 'coverageAmount', options: ['₹25 Lakhs', '₹50 Lakhs', '₹75 Lakhs', '₹1 Crore', '₹2 Crore'], required: true }
          ]
        },
        {
          step: 5,
          title: 'Tobacco Usage',
          fields: [
            { type: 'radio', label: 'Do you smoke or chew tobacco?', name: 'tobacco', options: ['Yes', 'No'], required: true }
          ]
        },
        {
          step: 6,
          title: 'Location',
          fields: [
            { type: 'text', label: 'Please select your current city', name: 'city', required: true }
          ]
        },
        {
          step: 7,
          title: 'Policy Duration',
          fields: [
            { type: 'radio', label: 'Select policy period', name: 'policyPeriod', options: ['1 Year', '2 Years', '3 Years', '4 Years'], required: true }
          ]
        }
      ]
    }
  }
};

export const getAssessmentByType = (type: string): InsuranceAssessment | undefined => {
  return insuranceAssessments[type];
};

export const calculatePremium = (insuranceType: string, years: number, baseMultiplier: number = 1): number => {
  const assessment = insuranceAssessments[insuranceType];
  if (!assessment) return 0;

  const yearPrice = assessment.pricePerYear[years as 1 | 2 | 3 | 4] || assessment.basePrice;
  return Math.round(yearPrice * baseMultiplier);
};
