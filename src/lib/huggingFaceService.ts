import axios from 'axios';

const HF_API_URL = import.meta.env.VITE_HF_API_URL || 'https://huggingface.co/spaces/darsahran/insurance-ml-api';
const HF_API_KEY = import.meta.env.VITE_HF_API_KEY;

interface MLModelRequest {
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

interface MLModelResponse {
  risk_category: string;
  risk_confidence: number;
  risk_probabilities: {
    Low?: number;
    Medium?: number;
    High?: number;
  };
  customer_lifetime_value: number;
  derived_features: {
    bmi: number;
    bmi_category: string;
    has_diabetes: boolean;
    has_hypertension: boolean;
    overall_health_risk_score: number;
    financial_risk_score: number;
    annual_income_midpoint: number;
  };
}

interface ValidationResult {
  isValid: boolean;
  missingFields: string[];
  invalidFields: Array<{ field: string; reason: string }>;
  completionPercentage: number;
}

export class HuggingFaceMLService {
  private static readonly REQUIRED_FIELDS = 38;
  private static readonly REQUEST_TIMEOUT = 10000;
  private static readonly MAX_RETRIES = 3;
  private static requestCache = new Map<string, { response: MLModelResponse; timestamp: number }>();
  private static readonly CACHE_TTL = 3600000;

  static async predictInsuranceRisk(request: Partial<MLModelRequest>): Promise<MLModelResponse> {
    const validation = this.validateRequest(request);

    if (!validation.isValid) {
      throw new Error(`Invalid request: ${validation.missingFields.join(', ')} are required`);
    }

    const cacheKey = this.generateCacheKey(request as MLModelRequest);
    const cached = this.getCachedResponse(cacheKey);
    if (cached) {
      console.log('Using cached ML prediction');
      return cached;
    }

    try {
      const response = await this.makeAPIRequest(request as MLModelRequest);
      this.cacheResponse(cacheKey, response);
      return response;
    } catch (error) {
      console.error('Hugging Face ML API error:', error);
      throw error;
    }
  }

  private static async makeAPIRequest(
    request: MLModelRequest,
    retryCount = 0
  ): Promise<MLModelResponse> {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (HF_API_KEY) {
        headers['Authorization'] = `Bearer ${HF_API_KEY}`;
      }

      const response = await axios.post<MLModelResponse>(
        `${HF_API_URL}/api/predict`,
        request,
        {
          headers,
          timeout: this.REQUEST_TIMEOUT,
        }
      );

      return response.data;
    } catch (error) {
      if (retryCount < this.MAX_RETRIES) {
        console.log(`Retrying request (attempt ${retryCount + 1}/${this.MAX_RETRIES})`);
        await this.delay(Math.pow(2, retryCount) * 1000);
        return this.makeAPIRequest(request, retryCount + 1);
      }
      throw error;
    }
  }

  static validateRequest(request: Partial<MLModelRequest>): ValidationResult {
    const missingFields: string[] = [];
    const invalidFields: Array<{ field: string; reason: string }> = [];
    let filledFields = 0;

    const validations = [
      { field: 'age', check: (v: any) => v >= 18 && v <= 70, message: 'Age must be between 18-70' },
      { field: 'gender', check: (v: any) => ['Male', 'Female', 'Other'].includes(v), message: 'Invalid gender' },
      { field: 'marital_status', check: (v: any) => ['Single', 'Married', 'Divorced', 'Widowed'].includes(v), message: 'Invalid marital status' },
      { field: 'education_level', check: (v: any) => ['10th Pass', '12th Pass', 'College Graduate and above'].includes(v), message: 'Invalid education level' },
      { field: 'city', check: (v: any) => ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Patna'].includes(v), message: 'Invalid city' },
      { field: 'region_type', check: (v: any) => ['Metro', 'Tier-1', 'Tier-2'].includes(v), message: 'Invalid region type' },
      { field: 'annual_income_range', check: (v: any) => ['Below 5L', '5L-10L', '10L-25L'].includes(v), message: 'Invalid income range' },
      { field: 'has_debt', check: (v: any) => typeof v === 'boolean', message: 'Must be boolean' },
      { field: 'is_sole_provider', check: (v: any) => typeof v === 'boolean', message: 'Must be boolean' },
      { field: 'has_savings', check: (v: any) => typeof v === 'boolean', message: 'Must be boolean' },
      { field: 'investment_capacity', check: (v: any) => ['Low', 'Medium', 'RARE'].includes(v), message: 'Invalid investment capacity' },
      { field: 'height_cm', check: (v: any) => v >= 140 && v <= 220, message: 'Height must be between 140-220 cm' },
      { field: 'weight_kg', check: (v: any) => v >= 40 && v <= 150, message: 'Weight must be between 40-150 kg' },
      { field: 'blood_pressure_systolic', check: (v: any) => v >= 80 && v <= 220, message: 'Systolic BP must be between 80-220' },
      { field: 'blood_pressure_diastolic', check: (v: any) => v >= 50 && v <= 130, message: 'Diastolic BP must be between 50-130' },
      { field: 'resting_heart_rate', check: (v: any) => v >= 40 && v <= 120, message: 'Heart rate must be between 40-120' },
      { field: 'blood_sugar_fasting', check: (v: any) => v >= 60 && v <= 300, message: 'Blood sugar must be between 60-300' },
      { field: 'condition_heart_disease', check: (v: any) => typeof v === 'boolean', message: 'Must be boolean' },
      { field: 'condition_asthma', check: (v: any) => typeof v === 'boolean', message: 'Must be boolean' },
      { field: 'condition_thyroid', check: (v: any) => typeof v === 'boolean', message: 'Must be boolean' },
      { field: 'condition_cancer_history', check: (v: any) => typeof v === 'boolean', message: 'Must be boolean' },
      { field: 'condition_kidney_disease', check: (v: any) => typeof v === 'boolean', message: 'Must be boolean' },
      { field: 'smoking_status', check: (v: any) => ['Never', 'Former', 'Current'].includes(v), message: 'Invalid smoking status' },
      { field: 'years_smoking', check: (v: any) => v >= 0 && v <= 50, message: 'Years smoking must be between 0-50' },
      { field: 'alcohol_consumption', check: (v: any) => ['None', 'Occasionally', 'Regularly', 'Heavily'].includes(v), message: 'Invalid alcohol consumption' },
      { field: 'exercise_frequency_weekly', check: (v: any) => v >= 0 && v <= 7, message: 'Exercise frequency must be between 0-7' },
      { field: 'sleep_hours_avg', check: (v: any) => v >= 3 && v <= 12, message: 'Sleep hours must be between 3-12' },
      { field: 'stress_level', check: (v: any) => v >= 1 && v <= 10, message: 'Stress level must be between 1-10' },
      { field: 'dependent_children_count', check: (v: any) => v >= 0 && v <= 5, message: 'Children count must be between 0-5' },
      { field: 'dependent_parents_count', check: (v: any) => v >= 0 && v <= 4, message: 'Parents count must be between 0-4' },
      { field: 'occupation_type', check: (v: any) => ['Housewife', 'Professional', 'Retired', 'Salaried', 'Self Employed'].includes(v), message: 'Invalid occupation type' },
      { field: 'insurance_type_requested', check: (v: any) => ['car', 'family_health', 'health', 'investment', 'retirement', 'term-life', 'two-wheeler'].includes(v), message: 'Invalid insurance type' },
      { field: 'coverage_amount_requested', check: (v: any) => v >= 100000 && v <= 10000000, message: 'Coverage must be between 100K-10M' },
      { field: 'policy_period_years', check: (v: any) => v >= 1 && v <= 30, message: 'Policy period must be between 1-30 years' },
      { field: 'monthly_premium_budget', check: (v: any) => v >= 500 && v <= 50000, message: 'Budget must be between 500-50000' },
      { field: 'has_existing_policies', check: (v: any) => typeof v === 'boolean', message: 'Must be boolean' },
      { field: 'num_assessments_started', check: (v: any) => v >= 1 && v <= 20, message: 'Assessments started must be between 1-20' },
      { field: 'num_assessments_completed', check: (v: any) => v >= 0 && v <= 20, message: 'Assessments completed must be between 0-20' },
    ];

    validations.forEach(({ field, check, message }) => {
      const value = (request as any)[field];

      if (value === undefined || value === null) {
        missingFields.push(field);
      } else {
        filledFields++;
        if (!check(value)) {
          invalidFields.push({ field, reason: message });
        }
      }
    });

    const completionPercentage = Math.round((filledFields / this.REQUIRED_FIELDS) * 100);

    return {
      isValid: missingFields.length === 0 && invalidFields.length === 0,
      missingFields,
      invalidFields,
      completionPercentage,
    };
  }

  private static generateCacheKey(request: MLModelRequest): string {
    return JSON.stringify(request);
  }

  private static getCachedResponse(key: string): MLModelResponse | null {
    const cached = this.requestCache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.response;
    }
    if (cached) {
      this.requestCache.delete(key);
    }
    return null;
  }

  private static cacheResponse(key: string, response: MLModelResponse): void {
    this.requestCache.set(key, { response, timestamp: Date.now() });
  }

  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static clearCache(): void {
    this.requestCache.clear();
  }

  static getRiskScoreFromCategory(category: string): number {
    switch (category.toLowerCase()) {
      case 'low': return 25;
      case 'medium': return 55;
      case 'high': return 85;
      default: return 50;
    }
  }

  static calculateMonthlyPremiumFromCLV(clv: number, policyYears: number = 20): number {
    return Math.round(clv / (policyYears * 12));
  }
}

export default HuggingFaceMLService;
