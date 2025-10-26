import { supabase } from './supabase';

export interface PolicyRecommendation {
  id: string;
  policy_name: string;
  insurance_type: string;
  provider_name: string;
  monthly_premium: number;
  coverage_amount: number;
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
      .from('user_policies')
      .select('insurance_type')
      .eq('user_id', userId)
      .eq('status', 'active');

    const policies = userPolicies || [];
    return {
      hasHealthInsurance: policies.some(p => p.insurance_type === 'health'),
      hasLifeInsurance: policies.some(p => p.insurance_type === 'life' || p.insurance_type === 'term_life'),
      hasCarInsurance: policies.some(p => p.insurance_type === 'car'),
      hasTwoWheelerInsurance: policies.some(p => p.insurance_type === 'two_wheeler'),
      hasHomeInsurance: policies.some(p => p.insurance_type === 'home'),
      hasTravelInsurance: policies.some(p => p.insurance_type === 'travel'),
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

    const { riskCategory, age, maritalStatus, hasChildren, annualIncome, occupation } = mlData;

    if (!userPolicies.hasHealthInsurance) {
      const { data: healthPolicies } = await supabase
        .from('policy_catalog')
        .select('*')
        .eq('insurance_type', 'health')
        .eq('is_active', true)
        .order('monthly_premium', { ascending: true })
        .limit(1);

      if (healthPolicies && healthPolicies.length > 0) {
        const policy = healthPolicies[0];
        recommendations.push({
          id: policy.id,
          policy_name: policy.policy_name,
          insurance_type: 'Health Insurance',
          provider_name: policy.provider_name,
          monthly_premium: policy.monthly_premium,
          coverage_amount: policy.coverage_amount,
          key_features: policy.key_features || ['Cashless hospitalization', 'Pre & post hospitalization', 'No claim bonus'],
          priority: 'high',
          match_score: 95,
        });
      }
    }

    if (!userPolicies.hasLifeInsurance && (maritalStatus === 'Married' || hasChildren)) {
      const { data: lifePolicies } = await supabase
        .from('policy_catalog')
        .select('*')
        .eq('insurance_type', 'term_life')
        .eq('is_active', true)
        .order('monthly_premium', { ascending: true })
        .limit(1);

      if (lifePolicies && lifePolicies.length > 0) {
        const policy = lifePolicies[0];
        recommendations.push({
          id: policy.id,
          policy_name: policy.policy_name,
          insurance_type: 'Term Life Insurance',
          provider_name: policy.provider_name,
          monthly_premium: policy.monthly_premium,
          coverage_amount: policy.coverage_amount,
          key_features: policy.key_features || ['Death benefit payout', 'Affordable premiums', 'Flexible term lengths (10-30 years)'],
          priority: 'high',
          match_score: 92,
        });
      }
    }

    if (!userPolicies.hasCarInsurance) {
      const { data: carPolicies } = await supabase
        .from('policy_catalog')
        .select('*')
        .eq('insurance_type', 'car')
        .eq('is_active', true)
        .order('monthly_premium', { ascending: true })
        .limit(1);

      if (carPolicies && carPolicies.length > 0) {
        const policy = carPolicies[0];
        recommendations.push({
          id: policy.id,
          policy_name: policy.policy_name,
          insurance_type: 'Car Insurance',
          provider_name: policy.provider_name,
          monthly_premium: policy.monthly_premium,
          coverage_amount: policy.coverage_amount,
          key_features: policy.key_features || ['Third party liability', 'Own damage cover', 'No claim bonus'],
          priority: 'medium',
          match_score: 85,
        });
      }
    }

    if (!userPolicies.hasTwoWheelerInsurance) {
      const { data: twoWheelerPolicies } = await supabase
        .from('policy_catalog')
        .select('*')
        .eq('insurance_type', 'two_wheeler')
        .eq('is_active', true)
        .order('monthly_premium', { ascending: true })
        .limit(1);

      if (twoWheelerPolicies && twoWheelerPolicies.length > 0) {
        const policy = twoWheelerPolicies[0];
        recommendations.push({
          id: policy.id,
          policy_name: policy.policy_name,
          insurance_type: 'Two Wheeler Insurance',
          provider_name: policy.provider_name,
          monthly_premium: policy.monthly_premium,
          coverage_amount: policy.coverage_amount,
          key_features: policy.key_features || ['Third party cover', 'Personal accident cover', 'Theft protection'],
          priority: 'medium',
          match_score: 80,
        });
      }
    }

    if (recommendations.length < 3) {
      const { data: additionalPolicies } = await supabase
        .from('policy_catalog')
        .select('*')
        .eq('is_active', true)
        .order('monthly_premium', { ascending: true })
        .limit(3 - recommendations.length);

      if (additionalPolicies) {
        additionalPolicies.forEach(policy => {
          recommendations.push({
            id: policy.id,
            policy_name: policy.policy_name,
            insurance_type: this.formatInsuranceType(policy.insurance_type),
            provider_name: policy.provider_name,
            monthly_premium: policy.monthly_premium,
            coverage_amount: policy.coverage_amount,
            key_features: policy.key_features || ['Comprehensive coverage', 'Affordable premiums', 'Easy claims process'],
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
