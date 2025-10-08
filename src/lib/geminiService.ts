import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY || API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
  console.warn('⚠️ Gemini API key not configured. AI features will use mock data.');
}

let genAI: GoogleGenerativeAI | null = null;

try {
  if (API_KEY && API_KEY !== 'YOUR_GEMINI_API_KEY_HERE') {
    genAI = new GoogleGenerativeAI(API_KEY);
  }
} catch (error) {
  console.error('Failed to initialize Gemini AI:', error);
}

export interface InsuranceAnalysisRequest {
  demographics: any;
  health: any;
  lifestyle: any;
  financial: any;
  riskScore?: number;
  premiumEstimate?: number;
}

export interface InsuranceRecommendation {
  policyType: string;
  coverage: number;
  monthlyPremium: number;
  benefits: string[];
  eligibility: string;
  priority: 'high' | 'medium' | 'low';
  reasoning: string;
}

export interface AIInsuranceAnalysis {
  eligiblePolicies: InsuranceRecommendation[];
  riskAssessment: {
    overall: string;
    factors: string[];
    improvements: string[];
  };
  premiumOptimization: {
    currentEstimate: number;
    potentialSavings: number;
    recommendations: string[];
  };
  personalizedAdvice: string;
  confidenceScore: number;
}

export class GeminiInsuranceService {
  /**
   * Analyze user questionnaire data and provide comprehensive insurance recommendations
   */
  static async analyzeInsuranceNeeds(data: InsuranceAnalysisRequest): Promise<AIInsuranceAnalysis> {
    if (!genAI) {
      console.warn('Using mock AI analysis - Gemini API not configured');
      return this.getMockAnalysis(data);
    }

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

      const prompt = this.buildAnalysisPrompt(data);
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return this.parseAIResponse(text, data);
    } catch (error) {
      console.error('Gemini AI analysis error:', error);
      return this.getMockAnalysis(data);
    }
  }

  /**
   * Generate personalized chatbot response for user queries
   */
  static async getChatbotResponse(
    userMessage: string,
    userData: InsuranceAnalysisRequest,
    chatHistory: Array<{ role: string; content: string }>
  ): Promise<string> {
    if (!genAI) {
      return this.getMockChatResponse(userMessage);
    }

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

      const contextPrompt = `You are an expert insurance advisor AI. Here is the user's profile:

Demographics: ${JSON.stringify(userData.demographics, null, 2)}
Health: ${JSON.stringify(userData.health, null, 2)}
Lifestyle: ${JSON.stringify(userData.lifestyle, null, 2)}
Financial: ${JSON.stringify(userData.financial, null, 2)}
Risk Score: ${userData.riskScore}/100
Estimated Premium: $${userData.premiumEstimate}/month

Previous conversation:
${chatHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n')}

User's question: ${userMessage}

Provide a helpful, personalized response based on their profile. Keep responses concise (3-4 sentences).`;

      const result = await model.generateContent(contextPrompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini chatbot error:', error);
      return this.getMockChatResponse(userMessage);
    }
  }

  /**
   * Search for eligible insurance policies online (simulated)
   */
  static async searchEligiblePolicies(data: InsuranceAnalysisRequest): Promise<InsuranceRecommendation[]> {
    if (!genAI) {
      return this.getMockPolicies(data);
    }

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

      const prompt = `Based on this user profile, recommend 5 specific insurance policies they're eligible for:

Age: ${this.calculateAge(data.demographics?.dateOfBirth)} years
Occupation: ${data.demographics?.occupation}
Health Status: ${data.health?.medicalConditions?.length || 0} conditions
Smoking: ${data.health?.smokingStatus}
Income: $${data.financial?.annualIncome}
Desired Coverage: $${data.financial?.coverageAmount}
Risk Score: ${data.riskScore}/100

Provide recommendations in this JSON format:
{
  "policies": [
    {
      "policyType": "string",
      "coverage": number,
      "monthlyPremium": number,
      "benefits": ["string"],
      "eligibility": "string",
      "priority": "high|medium|low",
      "reasoning": "string"
    }
  ]
}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return parsed.policies || this.getMockPolicies(data);
      }

      return this.getMockPolicies(data);
    } catch (error) {
      console.error('Policy search error:', error);
      return this.getMockPolicies(data);
    }
  }

  /**
   * Build comprehensive analysis prompt
   */
  private static buildAnalysisPrompt(data: InsuranceAnalysisRequest): string {
    const age = this.calculateAge(data.demographics?.dateOfBirth);

    return `Analyze this insurance applicant's profile and provide detailed recommendations:

DEMOGRAPHICS:
- Age: ${age} years
- Gender: ${data.demographics?.gender}
- Occupation: ${data.demographics?.occupation}
- Location: ${data.demographics?.location}
- Marital Status: ${data.demographics?.maritalStatus}
- Dependents: ${data.demographics?.dependents}

HEALTH:
- Height: ${data.health?.height} cm, Weight: ${data.health?.weight} kg
- Smoking Status: ${data.health?.smokingStatus}
- Medical Conditions: ${data.health?.medicalConditions?.join(', ') || 'None'}
- Medications: ${data.health?.currentMedications?.join(', ') || 'None'}
- Alcohol: ${data.health?.alcoholConsumption}

LIFESTYLE:
- Exercise: ${data.lifestyle?.exerciseFrequency} times/week
- Sleep: ${data.lifestyle?.sleepHours} hours/night
- Stress Level: ${data.lifestyle?.stressLevel}/10
- Diet: ${JSON.stringify(data.lifestyle?.dietAssessment)}

FINANCIAL:
- Annual Income: $${data.financial?.annualIncome}
- Desired Coverage: $${data.financial?.coverageAmount}
- Budget: $${data.financial?.monthlyBudget}/month
- Existing Coverage: ${data.financial?.existingCoverage ? 'Yes' : 'No'}

CALCULATED METRICS:
- Risk Score: ${data.riskScore}/100
- Estimated Premium: $${data.premiumEstimate}/month

Provide a comprehensive JSON analysis with:
1. eligible_policies: List of 5 recommended insurance policies with details
2. risk_assessment: Overall risk profile and factors
3. premium_optimization: Ways to reduce premiums
4. personalized_advice: Custom recommendations
5. confidence_score: Your confidence in these recommendations (0-100)

Format your response as valid JSON.`;
  }

  /**
   * Parse AI response into structured format
   */
  private static parseAIResponse(text: string, data: InsuranceAnalysisRequest): AIInsuranceAnalysis {
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          eligiblePolicies: parsed.eligible_policies || this.getMockPolicies(data),
          riskAssessment: parsed.risk_assessment || {
            overall: 'Medium Risk',
            factors: ['Age', 'Health Status'],
            improvements: ['Improve lifestyle factors']
          },
          premiumOptimization: parsed.premium_optimization || {
            currentEstimate: data.premiumEstimate || 150,
            potentialSavings: 20,
            recommendations: ['Quit smoking', 'Increase exercise']
          },
          personalizedAdvice: parsed.personalized_advice || 'Consider comprehensive coverage options',
          confidenceScore: parsed.confidence_score || 85
        };
      }
    } catch (error) {
      console.error('Failed to parse AI response:', error);
    }

    return this.getMockAnalysis(data);
  }

  /**
   * Calculate age from date of birth
   */
  private static calculateAge(dateOfBirth?: string): number {
    if (!dateOfBirth) return 30;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  /**
   * Mock analysis for when API is not configured
   */
  private static getMockAnalysis(data: InsuranceAnalysisRequest): AIInsuranceAnalysis {
    return {
      eligiblePolicies: this.getMockPolicies(data),
      riskAssessment: {
        overall: data.riskScore && data.riskScore < 40 ? 'Low Risk' : data.riskScore && data.riskScore < 70 ? 'Medium Risk' : 'High Risk',
        factors: [
          'Age and demographics',
          'Health history',
          'Lifestyle choices',
          'Financial stability'
        ],
        improvements: [
          'Maintain regular exercise routine',
          'Consider preventive health checkups',
          'Optimize diet and sleep patterns',
          'Manage stress levels effectively'
        ]
      },
      premiumOptimization: {
        currentEstimate: data.premiumEstimate || 150,
        potentialSavings: 25,
        recommendations: [
          'Bundle policies for multi-policy discount',
          'Increase deductible to lower premiums',
          'Participate in wellness programs',
          'Review coverage annually for better rates'
        ]
      },
      personalizedAdvice: `Based on your profile, you're a ${data.riskScore && data.riskScore < 40 ? 'low' : data.riskScore && data.riskScore < 70 ? 'medium' : 'high'}-risk candidate. Consider term life insurance with a coverage amount of $${data.financial?.coverageAmount || 500000} for ${this.calculateAge(data.demographics?.dateOfBirth) < 40 ? '20-30' : '15-20'} years. Your estimated monthly premium of $${data.premiumEstimate || 150} is competitive for your risk profile.`,
      confidenceScore: 87
    };
  }

  /**
   * Generate mock policy recommendations
   */
  private static getMockPolicies(data: InsuranceAnalysisRequest): InsuranceRecommendation[] {
    const age = this.calculateAge(data.demographics?.dateOfBirth);
    const coverage = data.financial?.coverageAmount || 500000;
    const basePremium = data.premiumEstimate || 150;

    return [
      {
        policyType: 'Term Life Insurance',
        coverage: coverage,
        monthlyPremium: basePremium,
        benefits: [
          'Death benefit payout',
          'Affordable premiums',
          'Flexible term lengths (10-30 years)',
          'No medical exam options available'
        ],
        eligibility: 'Eligible - Meets all requirements',
        priority: 'high',
        reasoning: 'Best value for your age and coverage needs. Provides maximum protection at lowest cost.'
      },
      {
        policyType: 'Whole Life Insurance',
        coverage: coverage,
        monthlyPremium: Math.round(basePremium * 2.5),
        benefits: [
          'Lifetime coverage',
          'Cash value accumulation',
          'Fixed premiums',
          'Potential dividends'
        ],
        eligibility: 'Eligible - Premium may be higher',
        priority: 'medium',
        reasoning: 'Provides permanent coverage with investment component. Higher premiums but builds cash value over time.'
      },
      {
        policyType: 'Universal Life Insurance',
        coverage: coverage,
        monthlyPremium: Math.round(basePremium * 1.8),
        benefits: [
          'Flexible premiums',
          'Adjustable death benefit',
          'Cash value growth',
          'Tax-deferred savings'
        ],
        eligibility: 'Eligible',
        priority: 'medium',
        reasoning: 'Offers flexibility in premiums and coverage amounts. Good option if your financial needs may change.'
      },
      {
        policyType: 'Return of Premium Term Life',
        coverage: coverage,
        monthlyPremium: Math.round(basePremium * 1.4),
        benefits: [
          'Premium refund if you outlive term',
          'Traditional term life benefits',
          'No loss of investment',
          age < 45 ? 'Better rates for younger applicants' : 'Still available for your age group'
        ],
        eligibility: age < 60 ? 'Eligible' : 'May require medical exam',
        priority: age < 45 ? 'high' : 'medium',
        reasoning: 'Get your premiums back if you don\'t use the policy. Good middle ground between term and permanent insurance.'
      },
      {
        policyType: 'Guaranteed Universal Life',
        coverage: coverage,
        monthlyPremium: Math.round(basePremium * 1.6),
        benefits: [
          'Guaranteed lifetime coverage',
          'Lower premiums than whole life',
          'No medical exam options',
          'Level death benefit'
        ],
        eligibility: 'Eligible',
        priority: 'medium',
        reasoning: 'Permanent coverage at a lower cost than whole life. No cash value but guaranteed protection.'
      }
    ];
  }

  /**
   * Mock chatbot response
   */
  private static getMockChatResponse(userMessage: string): string {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('premium') || lowerMessage.includes('cost') || lowerMessage.includes('price')) {
      return 'Based on your risk profile, your estimated monthly premium is competitive for the market. You can potentially save on premiums by maintaining a healthy lifestyle, bundling policies, or opting for a higher deductible. Would you like specific recommendations for reducing costs?';
    }

    if (lowerMessage.includes('coverage') || lowerMessage.includes('how much')) {
      return 'Your recommended coverage amount should be 10-12 times your annual income to adequately protect your dependents. Based on your financial profile, a coverage amount between $500,000 to $1,000,000 would provide comprehensive protection. This ensures your family can maintain their lifestyle if something happens to you.';
    }

    if (lowerMessage.includes('eligible') || lowerMessage.includes('qualify')) {
      return 'Based on your health and lifestyle assessment, you qualify for standard to preferred risk categories with most major insurers. Your non-smoking status and regular exercise routine work in your favor. Some insurers may offer preferred rates, which could save you 15-20% on premiums.';
    }

    if (lowerMessage.includes('recommend') || lowerMessage.includes('best')) {
      return 'For your profile, I recommend starting with a 20-30 year term life policy as your foundation. It provides maximum coverage at the lowest cost during your peak earning years. You can supplement this with a smaller whole life policy for permanent coverage if desired. This hybrid approach gives you both affordability and long-term security.';
    }

    if (lowerMessage.includes('health') || lowerMessage.includes('medical')) {
      return 'Your health profile shows positive indicators including regular exercise and non-smoking status. To maintain or improve your insurability, focus on preventive care, annual checkups, and maintaining a healthy BMI. Many insurers now offer wellness discounts for healthy lifestyle choices.';
    }

    return 'I\'m here to help you understand your insurance options based on your personal profile. You can ask me about premiums, coverage amounts, policy types, eligibility, or any specific insurance concerns you have. What would you like to know more about?';
  }
}

export default GeminiInsuranceService;
