// Insurance type-specific questionnaires

export interface Question {
  id: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'multiselect' | 'date' | 'radio' | 'textarea';
  options?: string[];
  required: boolean;
  placeholder?: string;
  helpText?: string;
  min?: number;
  max?: number;
  unit?: string;
}

export interface QuestionSection {
  id: string;
  title: string;
  description: string;
  icon: string;
  questions: Question[];
}

// Term Life Insurance Questions
export const termLifeQuestions: QuestionSection[] = [
  {
    id: 'coverage_needs',
    title: 'Coverage Requirements',
    description: 'Help us understand your life insurance needs',
    icon: 'Shield',
    questions: [
      {
        id: 'desired_coverage',
        label: 'Desired coverage amount',
        type: 'number',
        required: true,
        min: 100000,
        unit: '₹',
        placeholder: '10,00,000',
        helpText: 'Typically 10-15x your annual income'
      },
      {
        id: 'policy_term',
        label: 'Policy term (years)',
        type: 'select',
        required: true,
        options: ['10', '15', '20', '25', '30', '35', '40'],
        helpText: 'How long do you need coverage?'
      },
      {
        id: 'beneficiaries_count',
        label: 'Number of dependents/beneficiaries',
        type: 'number',
        required: true,
        min: 0,
        max: 10
      },
      {
        id: 'current_liabilities',
        label: 'Total outstanding loans/debts',
        type: 'number',
        required: false,
        unit: '₹',
        placeholder: '0',
        helpText: 'Home loan, car loan, personal loans, etc.'
      }
    ]
  },
  {
    id: 'health_lifestyle',
    title: 'Health & Lifestyle',
    description: 'Your health information for accurate premium calculation',
    icon: 'Heart',
    questions: [
      {
        id: 'height',
        label: 'Height (cm)',
        type: 'number',
        required: true,
        min: 100,
        max: 250
      },
      {
        id: 'weight',
        label: 'Weight (kg)',
        type: 'number',
        required: true,
        min: 30,
        max: 200
      },
      {
        id: 'smoking_status',
        label: 'Smoking status',
        type: 'radio',
        required: true,
        options: ['Non-smoker', 'Former smoker (quit >12 months)', 'Current smoker']
      },
      {
        id: 'alcohol_consumption',
        label: 'Alcohol consumption',
        type: 'radio',
        required: true,
        options: ['Never', 'Occasionally', 'Regularly']
      },
      {
        id: 'medical_conditions',
        label: 'Pre-existing medical conditions',
        type: 'multiselect',
        required: false,
        options: ['None', 'Diabetes', 'Hypertension', 'Heart disease', 'Cancer history', 'Asthma', 'Thyroid', 'Other']
      }
    ]
  }
];

// Health Insurance Questions
export const healthInsuranceQuestions: QuestionSection[] = [
  {
    id: 'coverage_details',
    title: 'Coverage Details',
    description: 'Tell us about your health insurance needs',
    icon: 'Heart',
    questions: [
      {
        id: 'sum_insured',
        label: 'Desired sum insured',
        type: 'select',
        required: true,
        options: ['3,00,000', '5,00,000', '7,50,000', '10,00,000', '15,00,000', '20,00,000', '25,00,000', '50,00,000'],
        unit: '₹'
      },
      {
        id: 'room_type',
        label: 'Preferred room type',
        type: 'radio',
        required: true,
        options: ['Shared room', 'Twin sharing', 'Single private room', 'Deluxe/Suite']
      },
      {
        id: 'existing_health_insurance',
        label: 'Do you have existing health insurance?',
        type: 'radio',
        required: true,
        options: ['Yes', 'No']
      },
      {
        id: 'city_tier',
        label: 'City tier (for hospital network)',
        type: 'select',
        required: true,
        options: ['Tier 1 (Metro)', 'Tier 2 (Major cities)', 'Tier 3 (Small cities)']
      }
    ]
  },
  {
    id: 'medical_history',
    title: 'Medical History',
    description: 'Your current health status',
    icon: 'Activity',
    questions: [
      {
        id: 'pre_existing_conditions',
        label: 'Pre-existing medical conditions',
        type: 'multiselect',
        required: true,
        options: ['None', 'Diabetes', 'Hypertension', 'Heart disease', 'Asthma', 'Thyroid', 'Kidney disease', 'Arthritis', 'Other']
      },
      {
        id: 'current_medications',
        label: 'Are you currently on any medications?',
        type: 'radio',
        required: true,
        options: ['Yes', 'No']
      },
      {
        id: 'hospitalizations',
        label: 'Hospitalizations in last 3 years',
        type: 'number',
        required: true,
        min: 0,
        max: 10
      },
      {
        id: 'surgeries',
        label: 'Any surgeries in the past?',
        type: 'radio',
        required: true,
        options: ['Yes', 'No']
      }
    ]
  }
];

// Car Insurance Questions
export const carInsuranceQuestions: QuestionSection[] = [
  {
    id: 'vehicle_details',
    title: 'Vehicle Information',
    description: 'Tell us about your car',
    icon: 'Car',
    questions: [
      {
        id: 'registration_number',
        label: 'Vehicle registration number',
        type: 'text',
        required: true,
        placeholder: 'MH01AB1234'
      },
      {
        id: 'make',
        label: 'Car make',
        type: 'text',
        required: true,
        placeholder: 'Maruti Suzuki, Hyundai, etc.'
      },
      {
        id: 'model',
        label: 'Car model',
        type: 'text',
        required: true,
        placeholder: 'Swift, i20, etc.'
      },
      {
        id: 'year',
        label: 'Year of manufacture',
        type: 'select',
        required: true,
        options: Array.from({ length: 15 }, (_, i) => (new Date().getFullYear() - i).toString())
      },
      {
        id: 'fuel_type',
        label: 'Fuel type',
        type: 'radio',
        required: true,
        options: ['Petrol', 'Diesel', 'CNG', 'Electric']
      },
      {
        id: 'idv',
        label: 'Insured Declared Value (IDV)',
        type: 'number',
        required: true,
        unit: '₹',
        helpText: 'Current market value of your car'
      }
    ]
  },
  {
    id: 'coverage_type',
    title: 'Coverage Preferences',
    description: 'Choose your insurance coverage',
    icon: 'Shield',
    questions: [
      {
        id: 'policy_type',
        label: 'Policy type',
        type: 'radio',
        required: true,
        options: ['Third Party Only', 'Comprehensive', 'Own Damage Only']
      },
      {
        id: 'no_claim_bonus',
        label: 'Current No Claim Bonus (NCB)',
        type: 'select',
        required: true,
        options: ['0%', '20%', '25%', '35%', '45%', '50%']
      },
      {
        id: 'add_ons',
        label: 'Add-on covers needed',
        type: 'multiselect',
        required: false,
        options: ['Zero Depreciation', 'Engine Protection', 'Road Side Assistance', 'Return to Invoice', 'Passenger Cover', 'Key Replacement']
      }
    ]
  }
];

// Two Wheeler Insurance Questions
export const twoWheelerQuestions: QuestionSection[] = [
  {
    id: 'vehicle_details',
    title: 'Two Wheeler Details',
    description: 'Information about your bike',
    icon: 'Bike',
    questions: [
      {
        id: 'registration_number',
        label: 'Registration number',
        type: 'text',
        required: true,
        placeholder: 'MH01AB1234'
      },
      {
        id: 'make',
        label: 'Make',
        type: 'text',
        required: true,
        placeholder: 'Honda, Hero, Bajaj, etc.'
      },
      {
        id: 'model',
        label: 'Model',
        type: 'text',
        required: true,
        placeholder: 'Activa, Splendor, Pulsar, etc.'
      },
      {
        id: 'year',
        label: 'Year of manufacture',
        type: 'select',
        required: true,
        options: Array.from({ length: 15 }, (_, i) => (new Date().getFullYear() - i).toString())
      },
      {
        id: 'cc',
        label: 'Engine capacity (CC)',
        type: 'select',
        required: true,
        options: ['Below 75cc', '75-150cc', '150-350cc', 'Above 350cc']
      }
    ]
  }
];

// Travel Insurance Questions
export const travelInsuranceQuestions: QuestionSection[] = [
  {
    id: 'trip_details',
    title: 'Trip Information',
    description: 'Tell us about your travel plans',
    icon: 'Plane',
    questions: [
      {
        id: 'destination',
        label: 'Travel destination',
        type: 'text',
        required: true,
        placeholder: 'Country/Region'
      },
      {
        id: 'trip_duration',
        label: 'Trip duration (days)',
        type: 'number',
        required: true,
        min: 1,
        max: 365
      },
      {
        id: 'trip_type',
        label: 'Trip type',
        type: 'radio',
        required: true,
        options: ['Leisure', 'Business', 'Student', 'Adventure sports']
      },
      {
        id: 'travelers_count',
        label: 'Number of travelers',
        type: 'number',
        required: true,
        min: 1,
        max: 10
      },
      {
        id: 'sum_insured',
        label: 'Desired sum insured',
        type: 'select',
        required: true,
        options: ['$50,000', '$100,000', '$250,000', '$500,000', '$1,000,000']
      }
    ]
  }
];

// Map insurance types to their question sets
export const insuranceQuestionMap: Record<string, QuestionSection[]> = {
  'term_life': termLifeQuestions,
  'health': healthInsuranceQuestions,
  'family_health': healthInsuranceQuestions, // Same as health but for family
  'car': carInsuranceQuestions,
  'two_wheeler': twoWheelerQuestions,
  'travel': travelInsuranceQuestions,
  'investment': termLifeQuestions, // Can reuse or create specific ones
  'retirement': termLifeQuestions,
  'home': carInsuranceQuestions, // Similar structure
  'term_rop': termLifeQuestions
};

export const getQuestionsForInsuranceType = (insuranceType: string): QuestionSection[] => {
  return insuranceQuestionMap[insuranceType] || termLifeQuestions;
};
