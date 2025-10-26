import { supabase } from './supabase';

export interface PolicyRecommendation {
  id: string;
  policy_name: string;
  insurance_type: string;
  provider_name: string;
  monthly_premium_base: number;
  coverage_amount_min: number;
  coverage_amount_max: number;
  key_features: string[];
  priority: 'high' | 'medium' | 'low';
  match_score: number;
}

export interface UserPolicyStatus {
  hasHealthInsurance: boolean;
  hasLifeInsurance: boolean;
  hasCarInsurance: boolean;
  hasTwoWheelerInsurance: boolean;
  hasHomeInsurance: boolean;
  hasTravelInsurance: boolean;
}

export class PolicyRecommendationService {
  static async getUserPolicies(userId: string): Promise<UserPolicyStatus> {
    const { data: userPolicies } = await supabase
      .from('policies')
      .select('policy_type')
      .eq('user_id', userId)
      .eq('status', 'active');

    const policies = userPolicies || [];
    return {
      hasHealthInsurance: policies.some(p => p.policy_type === 'health'),
      hasLifeInsurance: policies.some(p => p.policy_type === 'life' || p.policy_type === 'term_life'),
      hasCarInsurance: policies.some(p => p.policy_type === 'car'),
      hasTwoWheelerInsurance: policies.some(p => p.policy_type === 'two_wheeler'),
      hasHomeInsurance: policies.some(p => p.policy_type === 'home'),
      hasTravelInsurance: policies.some(p => p.policy_type === 'travel'),
    };
  }

  static async getRecommendedPolicies(
    userId: string,
    mlData: {
      riskCategory: string;
      age: number;
      maritalStatus: string;
      hasChildren: boolean;
      annualIncome: string;
      occupation: string;
      city: string;
    }
  ): Promise<PolicyRecommendation[]> {
    const userPolicies = await this.getUserPolicies(userId);
    const recommendations: PolicyRecommendation[] = [];

    const { riskCategory, age, maritalStatus, hasChildren } = mlData;

    // Helper function to fetch policies with provider info
    const fetchPolicies = async (policyType: string, limit: number = 1) => {
      const { data } = await supabase
        .from('policy_catalog')
        .select(`
          *,
          provider:policy_providers!provider_id(provider_name)
        `)
        .eq('policy_type', policyType)
        .eq('is_active', true)
        .order('monthly_premium_base', { ascending: true })
        .limit(limit);
      return data || [];
    };

    // Health Insurance - High Priority
    if (!userPolicies.hasHealthInsurance) {
      const policies = await fetchPolicies('health');
      if (policies.length > 0) {
        const policy = policies[0];
        recommendations.push({
          id: policy.id,
          policy_name: policy.policy_name,
          insurance_type: 'Health Insurance',
          provider_name: policy.provider?.provider_name || 'Insurance Provider',
          monthly_premium_base: policy.monthly_premium_base,
          coverage_amount_min: policy.coverage_amount_min,
          coverage_amount_max: policy.coverage_amount_max,
          key_features: Array.isArray(policy.key_features) ? policy.key_features : ['Cashless hospitalization', 'Pre & post hospitalization', 'No claim bonus'],
          priority: 'high',
          match_score: 95,
        });
      }
    }

    // Life Insurance - High Priority (if married or has children)
    if (!userPolicies.hasLifeInsurance && (maritalStatus === 'Married' || hasChildren)) {
      const policies = await fetchPolicies('term_life');
      if (policies.length > 0) {
        const policy = policies[0];
        recommendations.push({
          id: policy.id,
          policy_name: policy.policy_name,
          insurance_type: 'Term Life Insurance',
          provider_name: policy.provider?.provider_name || 'Insurance Provider',
          monthly_premium_base: policy.monthly_premium_base,
          coverage_amount_min: policy.coverage_amount_min,
          coverage_amount_max: policy.coverage_amount_max,
          key_features: Array.isArray(policy.key_features) ? policy.key_features : ['Death benefit payout', 'Affordable premiums', 'Flexible term lengths'],
          priority: 'high',
          match_score: 92,
        });
      }
    }

    // Car Insurance - Medium Priority
    if (!userPolicies.hasCarInsurance && recommendations.length < 3) {
      const policies = await fetchPolicies('car');
      if (policies.length > 0) {
        const policy = policies[0];
        recommendations.push({
          id: policy.id,
          policy_name: policy.policy_name,
          insurance_type: 'Car Insurance',
          provider_name: policy.provider?.provider_name || 'Insurance Provider',
          monthly_premium_base: policy.monthly_premium_base,
          coverage_amount_min: policy.coverage_amount_min,
          coverage_amount_max: policy.coverage_amount_max,
          key_features: Array.isArray(policy.key_features) ? policy.key_features : ['Third party liability', 'Own damage cover', 'No claim bonus'],
          priority: 'medium',
          match_score: 85,
        });
      }
    }

    // Two Wheeler Insurance - Medium Priority
    if (!userPolicies.hasTwoWheelerInsurance && recommendations.length < 3) {
      const policies = await fetchPolicies('two_wheeler');
      if (policies.length > 0) {
        const policy = policies[0];
        recommendations.push({
          id: policy.id,
          policy_name: policy.policy_name,
          insurance_type: 'Two Wheeler Insurance',
          provider_name: policy.provider?.provider_name || 'Insurance Provider',
          monthly_premium_base: policy.monthly_premium_base,
          coverage_amount_min: policy.coverage_amount_min,
          coverage_amount_max: policy.coverage_amount_max,
          key_features: Array.isArray(policy.key_features) ? policy.key_features : ['Third party cover', 'Personal accident cover', 'Theft protection'],
          priority: 'medium',
          match_score: 80,
        });
      }
    }

    // Fill remaining slots with general recommendations
    if (recommendations.length < 3) {
      const { data: additionalPolicies } = await supabase
        .from('policy_catalog')
        .select(`
          *,
          provider:policy_providers!provider_id(provider_name)
        `)
        .eq('is_active', true)
        .order('monthly_premium_base', { ascending: true })
        .limit(3 - recommendations.length);

      if (additionalPolicies) {
        additionalPolicies.forEach(policy => {
          recommendations.push({
            id: policy.id,
            policy_name: policy.policy_name,
            insurance_type: this.formatInsuranceType(policy.policy_type),
            provider_name: policy.provider?.provider_name || 'Insurance Provider',
            monthly_premium_base: policy.monthly_premium_base,
            coverage_amount_min: policy.coverage_amount_min,
            coverage_amount_max: policy.coverage_amount_max,
            key_features: Array.isArray(policy.key_features) ? policy.key_features : ['Comprehensive coverage', 'Affordable premiums', 'Easy claims'],
            priority: 'low',
            match_score: 70,
          });
        });
      }
    }

    return recommendations.slice(0, 3);
  }

  private static formatInsuranceType(type: string): string {
    const typeMap: Record<string, string> = {
      health: 'Health Insurance',
      life: 'Life Insurance',
      term_life: 'Term Life Insurance',
      car: 'Car Insurance',
      two_wheeler: 'Two Wheeler Insurance',
      home: 'Home Insurance',
      travel: 'Travel Insurance',
    };
    return typeMap[type] || type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }
}

export default PolicyRecommendationService;
