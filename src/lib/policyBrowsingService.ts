import { supabase } from './supabase';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getCompanyLogo, formatINR, formatPremiumINR } from './insuranceCompanyLogos';

export interface PolicyType {
  id: string;
  name: string;
  description: string;
  icon: string;
  count: number;
}

export interface Policy {
  id: string;
  providerName: string;
  policyName: string;
  policyType: string;
  description: string;
  coverageMin: number;
  coverageMax: number;
  monthlyPremium: number;
  annualPremium: number;
  policyTermYears: number;
  keyFeatures: string[];
  exclusions: string[];
  logo: string;
  isFeatured: boolean;
  aiScore?: number;
  aiRecommendation?: string;
}

export interface AIRecommendation {
  policyId: string;
  score: number;
  reasoning: string;
  matchFactors: string[];
}

class PolicyBrowsingService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: any = null;

  constructor() {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
    }
  }

  async getPolicyTypes(): Promise<PolicyType[]> {
    try {
      const { data, error } = await supabase
        .from('policy_catalog')
        .select('policy_type');

      if (error) throw error;

      // Group by policy type and count
      const typeCounts = (data || []).reduce((acc, item) => {
        acc[item.policy_type] = (acc[item.policy_type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const policyTypes: PolicyType[] = [
        {
          id: 'health',
          name: 'Health Insurance',
          description: 'Comprehensive medical coverage for you and your family',
          icon: '🏥',
          count: typeCounts['health'] || 0
        },
        {
          id: 'term_life',
          name: 'Term Life Insurance',
          description: 'Financial protection for your loved ones',
          icon: '👨‍👩‍👧‍👦',
          count: typeCounts['term_life'] || 0
        },
        {
          id: 'car',
          name: 'Car Insurance',
          description: 'Complete protection for your vehicle',
          icon: '🚗',
          count: typeCounts['car'] || 0
        },
        {
          id: 'two_wheeler',
          name: 'Two Wheeler Insurance',
          description: 'Secure your bike or scooter',
          icon: '🏍️',
          count: typeCounts['two_wheeler'] || 0
        },
        {
          id: 'travel',
          name: 'Travel Insurance',
          description: 'Travel with peace of mind',
          icon: '✈️',
          count: typeCounts['travel'] || 0
        },
        {
          id: 'home',
          name: 'Home Insurance',
          description: 'Protect your home and belongings',
          icon: '🏠',
          count: typeCounts['home'] || 0
        },
        {
          id: 'family_health',
          name: 'Family Floater',
          description: 'Single plan for entire family',
          icon: '👪',
          count: typeCounts['family_health'] || 0
        },
        {
          id: 'investment',
          name: 'Investment Plans',
          description: 'Grow wealth with insurance',
          icon: '💰',
          count: typeCounts['investment'] || 0
        }
      ];

      return policyTypes.filter(type => type.count > 0);
    } catch (error) {
      console.error('Error fetching policy types:', error);
      return [];
    }
  }

  async getPoliciesByType(policyType: string, limit: number = 20): Promise<Policy[]> {
    try {
      const { data, error } = await supabase
        .from('policy_catalog')
        .select('*')
        .eq('policy_type', policyType)
        .eq('is_active', true)
        .order('is_featured', { ascending: false })
        .order('sort_order', { ascending: true })
        .limit(limit);

      if (error) throw error;

      // Get provider names by joining with provider IDs
      const policies: Policy[] = await Promise.all((data || []).map(async (item) => {
        // Extract provider name from policy name (simplified approach)
        const providerName = this.extractProviderName(item.policy_name);

        return {
          id: item.id,
          providerName,
          policyName: item.policy_name,
          policyType: item.policy_type,
          description: item.policy_description || '',
          coverageMin: parseFloat(item.coverage_amount_min || '0'),
          coverageMax: parseFloat(item.coverage_amount_max || '0'),
          monthlyPremium: parseFloat(item.monthly_premium_base || '0'),
          annualPremium: parseFloat(item.annual_premium_base || '0'),
          policyTermYears: item.policy_term_years || 0,
          keyFeatures: item.key_features || [],
          exclusions: item.exclusions || [],
          logo: getCompanyLogo(providerName),
          isFeatured: item.is_featured || false
        };
      }));

      return policies;
    } catch (error) {
      console.error('Error fetching policies:', error);
      return [];
    }
  }

  private extractProviderName(policyName: string): string {
    // Extract provider name from policy name
    const knownProviders = [
      'LIC', 'HDFC', 'ICICI', 'SBI', 'Max Life', 'Bajaj Allianz',
      'Tata AIA', 'Kotak', 'Aditya Birla', 'Star Health', 'Care Health',
      'Niva Bupa', 'Digit', 'Acko', 'IFFCO Tokio', 'Royal Sundaram'
    ];

    for (const provider of knownProviders) {
      if (policyName.includes(provider)) {
        return provider;
      }
    }

    // Fallback: take first word(s)
    const parts = policyName.split(' ');
    return parts.slice(0, Math.min(2, parts.length)).join(' ');
  }

  async getAIRecommendations(
    policies: Policy[],
    userProfile?: {
      age?: number;
      income?: number;
      dependents?: number;
      healthConditions?: string[];
      preferences?: string[];
    }
  ): Promise<Map<string, AIRecommendation>> {
    if (!this.model || !userProfile) {
      return new Map();
    }

    try {
      const policySummaries = policies.map(p => ({
        id: p.id,
        name: p.policyName,
        provider: p.providerName,
        coverage: `${formatINR(p.coverageMin)} - ${formatINR(p.coverageMax)}`,
        premium: formatPremiumINR(p.annualPremium),
        features: p.keyFeatures.slice(0, 3).join(', ')
      }));

      const prompt = `You are an expert insurance advisor. Analyze these insurance policies and recommend the best ones for the user based on their profile.

User Profile:
- Age: ${userProfile.age || 'Not specified'}
- Annual Income: ${userProfile.income ? formatPremiumINR(userProfile.income) : 'Not specified'}
- Dependents: ${userProfile.dependents || 0}
- Health Conditions: ${userProfile.healthConditions?.join(', ') || 'None'}
- Preferences: ${userProfile.preferences?.join(', ') || 'Standard coverage'}

Available Policies:
${JSON.stringify(policySummaries, null, 2)}

For each policy, provide:
1. A score from 0-100 indicating suitability
2. Brief reasoning (max 100 words)
3. Key match factors (3-5 points)

Format response as JSON array:
[
  {
    "policyId": "policy-id",
    "score": 85,
    "reasoning": "Brief explanation",
    "matchFactors": ["Factor 1", "Factor 2", "Factor 3"]
  }
]

Return only the JSON array, no other text.`;

      const result = await this.model.generateContent(prompt);
      const response = result.response.text();

      // Extract JSON from response
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        console.error('Could not parse AI recommendations');
        return new Map();
      }

      const recommendations: AIRecommendation[] = JSON.parse(jsonMatch[0]);
      const recommendationMap = new Map<string, AIRecommendation>();

      recommendations.forEach(rec => {
        recommendationMap.set(rec.policyId, rec);
      });

      return recommendationMap;
    } catch (error) {
      console.error('Error getting AI recommendations:', error);
      return new Map();
    }
  }
}

export const policyBrowsingService = new PolicyBrowsingService();
