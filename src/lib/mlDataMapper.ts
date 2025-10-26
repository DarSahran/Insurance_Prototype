export interface QuestionnaireData {
  demographics: any;
  health: any;
  lifestyle: any;
  financial: any;
}

export interface MLModelInputs {
  age: number;
  gender: string;
  marital_status: string;
  education_level: string;
  city: string;
  region_type: string;
  annual_income_range: string;
  has_debt: boolean;
  is_sole_provider: boolean;
  has_savings: boolean;
  investment_capacity: string;
  height_cm: number;
  weight_kg: number;
  blood_pressure_systolic: number;
  blood_pressure_diastolic: number;
  resting_heart_rate: number;
  blood_sugar_fasting: number;
  condition_heart_disease: boolean;
  condition_asthma: boolean;
  condition_thyroid: boolean;
  condition_cancer_history: boolean;
  condition_kidney_disease: boolean;
  smoking_status: string;
  years_smoking: number;
  alcohol_consumption: string;
  exercise_frequency_weekly: number;
  sleep_hours_avg: number;
  stress_level: number;
  dependent_children_count: number;
  dependent_parents_count: number;
  occupation_type: string;
  insurance_type_requested: string;
  coverage_amount_requested: number;
  policy_period_years: number;
  monthly_premium_budget: number;
  has_existing_policies: boolean;
  num_assessments_started: number;
  num_assessments_completed: number;
}

export class MLDataMapper {
  static mapQuestionnaireToMLInputs(data: QuestionnaireData): Partial<MLModelInputs> {
    const mapped: Partial<MLModelInputs> = {};

    if (data.demographics?.dateOfBirth) {
      mapped.age = this.calculateAge(data.demographics.dateOfBirth);
    }

    if (data.demographics?.gender) {
      mapped.gender = this.mapGender(data.demographics.gender);
    }

    if (data.demographics?.maritalStatus) {
      mapped.marital_status = this.mapMaritalStatus(data.demographics.maritalStatus);
    }

    if (data.demographics?.education) {
      mapped.education_level = this.mapEducationLevel(data.demographics.education);
    }

    if (data.demographics?.city) {
      mapped.city = this.mapCity(data.demographics.city);
    }

    if (data.demographics?.location || data.demographics?.city) {
      mapped.region_type = this.mapRegionType(data.demographics.location || data.demographics.city);
    }

    if (data.financial?.annualIncome) {
      mapped.annual_income_range = this.mapIncomeRange(data.financial.annualIncome);
    }

    mapped.has_debt = data.financial?.hasDebt ?? false;
    mapped.is_sole_provider = data.demographics?.isSoleProvider ?? data.demographics?.dependents > 0;
    mapped.has_savings = data.financial?.hasSavings ?? data.financial?.monthlySavings > 0;

    if (data.financial?.investmentCapacity || data.financial?.riskTolerance) {
      mapped.investment_capacity = this.mapInvestmentCapacity(
        data.financial.investmentCapacity || data.financial.riskTolerance
      );
    }

    if (data.health?.height) {
      mapped.height_cm = this.convertHeightToCm(data.health.height);
    }

    if (data.health?.weight) {
      mapped.weight_kg = this.convertWeightToKg(data.health.weight);
    }

    if (data.health?.bloodPressure) {
      const bp = this.parseBloodPressure(data.health.bloodPressure);
      mapped.blood_pressure_systolic = bp.systolic;
      mapped.blood_pressure_diastolic = bp.diastolic;
    }

    mapped.resting_heart_rate = data.health?.restingHeartRate ?? 72;
    mapped.blood_sugar_fasting = data.health?.bloodSugarFasting ?? 95;

    const conditions = data.health?.medicalConditions || [];
    mapped.condition_heart_disease = this.hasCondition(conditions, ['heart disease', 'cardiac', 'cardiovascular']);
    mapped.condition_asthma = this.hasCondition(conditions, ['asthma', 'respiratory']);
    mapped.condition_thyroid = this.hasCondition(conditions, ['thyroid', 'hypothyroid', 'hyperthyroid']);
    mapped.condition_cancer_history = this.hasCondition(conditions, ['cancer', 'tumor', 'malignancy']);
    mapped.condition_kidney_disease = this.hasCondition(conditions, ['kidney', 'renal']);

    if (data.health?.smokingStatus) {
      mapped.smoking_status = this.mapSmokingStatus(data.health.smokingStatus);
    }

    mapped.years_smoking = data.health?.yearsSmoking ?? 0;

    if (data.lifestyle?.alcoholConsumption) {
      mapped.alcohol_consumption = this.mapAlcoholConsumption(data.lifestyle.alcoholConsumption);
    }

    mapped.exercise_frequency_weekly = data.lifestyle?.exerciseFrequency ?? 0;
    mapped.sleep_hours_avg = data.lifestyle?.sleepHours ?? 7;
    mapped.stress_level = data.lifestyle?.stressLevel ?? 5;

    mapped.dependent_children_count = data.demographics?.dependentChildren ?? 0;
    mapped.dependent_parents_count = data.demographics?.dependentParents ?? 0;

    if (data.demographics?.occupation) {
      mapped.occupation_type = this.mapOccupationType(data.demographics.occupation);
    }

    if (data.financial?.insuranceType) {
      mapped.insurance_type_requested = this.mapInsuranceType(data.financial.insuranceType);
    }

    mapped.coverage_amount_requested = data.financial?.coverageAmount ?? 500000;
    mapped.policy_period_years = data.financial?.policyTerm ?? 20;
    mapped.monthly_premium_budget = data.financial?.monthlyBudget ?? 5000;
    mapped.has_existing_policies = data.financial?.existingCoverage ?? false;
    mapped.num_assessments_started = 1;
    mapped.num_assessments_completed = 0;

    return mapped;
  }

  private static calculateAge(dateOfBirth: string | Date): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return Math.min(Math.max(age, 18), 70);
  }

  private static mapGender(gender: string): string {
    const genderMap: Record<string, string> = {
      'male': 'Male',
      'female': 'Female',
      'other': 'Other',
      'm': 'Male',
      'f': 'Female',
    };
    return genderMap[gender.toLowerCase()] || 'Other';
  }

  private static mapMaritalStatus(status: string): string {
    const statusMap: Record<string, string> = {
      'single': 'Single',
      'married': 'Married',
      'divorced': 'Divorced',
      'widowed': 'Widowed',
      'separated': 'Divorced',
    };
    return statusMap[status.toLowerCase()] || 'Single';
  }

  private static mapEducationLevel(education: string): string {
    const lowerEducation = education.toLowerCase();
    if (lowerEducation.includes('college') || lowerEducation.includes('university') || lowerEducation.includes('graduate') || lowerEducation.includes('degree')) {
      return 'College Graduate and above';
    } else if (lowerEducation.includes('12') || lowerEducation.includes('high school')) {
      return '12th Pass';
    } else {
      return '10th Pass';
    }
  }

  private static mapCity(city: string): string {
    const validCities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Patna'];
    const cityLower = city.toLowerCase();

    const cityMatch = validCities.find(validCity =>
      cityLower.includes(validCity.toLowerCase()) || validCity.toLowerCase().includes(cityLower)
    );

    return cityMatch || 'Mumbai';
  }

  private static mapRegionType(location: string): string {
    const metros = ['mumbai', 'delhi', 'bangalore', 'chennai', 'kolkata', 'hyderabad'];
    const tier1 = ['pune', 'ahmedabad', 'surat', 'jaipur', 'lucknow', 'kanpur', 'nagpur', 'indore'];

    const locationLower = location.toLowerCase();

    if (metros.some(metro => locationLower.includes(metro))) {
      return 'Metro';
    } else if (tier1.some(city => locationLower.includes(city))) {
      return 'Tier-1';
    } else {
      return 'Tier-2';
    }
  }

  private static mapIncomeRange(income: number): string {
    if (income < 500000) {
      return 'Below 5L';
    } else if (income <= 1000000) {
      return '5L-10L';
    } else {
      return '10L-25L';
    }
  }

  private static mapInvestmentCapacity(capacity: string): string {
    const capacityLower = capacity.toLowerCase();
    if (capacityLower.includes('high') || capacityLower.includes('aggressive')) {
      return 'RARE';
    } else if (capacityLower.includes('medium') || capacityLower.includes('moderate')) {
      return 'Medium';
    } else {
      return 'Low';
    }
  }

  private static convertHeightToCm(height: number | string): number {
    if (typeof height === 'string' && height.includes('ft')) {
      const feet = parseFloat(height);
      return Math.round(feet * 30.48);
    }
    return Math.min(Math.max(Number(height), 140), 220);
  }

  private static convertWeightToKg(weight: number | string): number {
    if (typeof weight === 'string' && weight.toLowerCase().includes('lb')) {
      const pounds = parseFloat(weight);
      return Math.round(pounds * 0.453592);
    }
    return Math.min(Math.max(Number(weight), 40), 150);
  }

  private static parseBloodPressure(bp: string | { systolic: number; diastolic: number }): { systolic: number; diastolic: number } {
    if (typeof bp === 'object') {
      return bp;
    }

    const match = bp.match(/(\d+)\/(\d+)/);
    if (match) {
      return {
        systolic: Math.min(Math.max(parseInt(match[1]), 80), 220),
        diastolic: Math.min(Math.max(parseInt(match[2]), 50), 130),
      };
    }

    return { systolic: 120, diastolic: 80 };
  }

  private static hasCondition(conditions: string[], keywords: string[]): boolean {
    if (!Array.isArray(conditions)) return false;
    return conditions.some(condition =>
      keywords.some(keyword => condition.toLowerCase().includes(keyword))
    );
  }

  private static mapSmokingStatus(status: string): string {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('never') || statusLower.includes('non')) {
      return 'Never';
    } else if (statusLower.includes('former') || statusLower.includes('quit') || statusLower.includes('ex')) {
      return 'Former';
    } else {
      return 'Current';
    }
  }

  private static mapAlcoholConsumption(consumption: string): string {
    const consumptionLower = consumption.toLowerCase();
    if (consumptionLower.includes('never') || consumptionLower.includes('none')) {
      return 'None';
    } else if (consumptionLower.includes('occasional') || consumptionLower.includes('social')) {
      return 'Occasionally';
    } else if (consumptionLower.includes('regular') || consumptionLower.includes('moderate')) {
      return 'Regularly';
    } else {
      return 'Heavily';
    }
  }

  private static mapOccupationType(occupation: string): string {
    const occupationLower = occupation.toLowerCase();

    if (occupationLower.includes('housewife') || occupationLower.includes('homemaker')) {
      return 'Housewife';
    } else if (occupationLower.includes('professional') || occupationLower.includes('doctor') || occupationLower.includes('engineer') || occupationLower.includes('lawyer')) {
      return 'Professional';
    } else if (occupationLower.includes('retired')) {
      return 'Retired';
    } else if (occupationLower.includes('salaried') || occupationLower.includes('employee')) {
      return 'Salaried';
    } else {
      return 'Self Employed';
    }
  }

  private static mapInsuranceType(insuranceType: string): string {
    const typeLower = insuranceType.toLowerCase();

    if (typeLower.includes('car') || typeLower.includes('auto')) {
      return 'car';
    } else if (typeLower.includes('family') && typeLower.includes('health')) {
      return 'family_health';
    } else if (typeLower.includes('health')) {
      return 'health';
    } else if (typeLower.includes('investment')) {
      return 'investment';
    } else if (typeLower.includes('retirement') || typeLower.includes('pension')) {
      return 'retirement';
    } else if (typeLower.includes('term') || typeLower.includes('life')) {
      return 'term-life';
    } else if (typeLower.includes('two') || typeLower.includes('bike') || typeLower.includes('motorcycle')) {
      return 'two-wheeler';
    } else {
      return 'term-life';
    }
  }

  static getCompletionStatus(mlInputs: Partial<MLModelInputs>): {
    completionPercentage: number;
    filledFields: string[];
    missingFields: string[];
  } {
    const allFields = [
      'age', 'gender', 'marital_status', 'education_level', 'city', 'region_type',
      'annual_income_range', 'has_debt', 'is_sole_provider', 'has_savings',
      'investment_capacity', 'height_cm', 'weight_kg', 'blood_pressure_systolic',
      'blood_pressure_diastolic', 'resting_heart_rate', 'blood_sugar_fasting',
      'condition_heart_disease', 'condition_asthma', 'condition_thyroid',
      'condition_cancer_history', 'condition_kidney_disease', 'smoking_status',
      'years_smoking', 'alcohol_consumption', 'exercise_frequency_weekly',
      'sleep_hours_avg', 'stress_level', 'dependent_children_count',
      'dependent_parents_count', 'occupation_type', 'insurance_type_requested',
      'coverage_amount_requested', 'policy_period_years', 'monthly_premium_budget',
      'has_existing_policies', 'num_assessments_started', 'num_assessments_completed'
    ];

    const filledFields = allFields.filter(field => {
      const value = (mlInputs as any)[field];
      return value !== undefined && value !== null;
    });

    const missingFields = allFields.filter(field => {
      const value = (mlInputs as any)[field];
      return value === undefined || value === null;
    });

    const completionPercentage = Math.round((filledFields.length / allFields.length) * 100);

    return {
      completionPercentage,
      filledFields,
      missingFields,
    };
  }
}

export default MLDataMapper;
