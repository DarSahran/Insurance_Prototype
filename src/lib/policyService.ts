import { supabase } from './supabase';

export interface Policy {
  id: string;
  policy_number: string;
  user_id: string;
  questionnaire_id?: string;
  policy_type: string;
  coverage_amount?: number;
  premium_amount: number;
  premium_frequency: 'monthly' | 'quarterly' | 'semi_annual' | 'annual';
  policy_term_years?: number;
  effective_date: string;
  expiry_date?: string;
  status: 'pending' | 'active' | 'suspended' | 'cancelled' | 'expired' | 'lapsed';
  beneficiaries?: any;
  underwriter_id?: string;
  underwriting_notes?: string;
  risk_rating?: string;
  deductible_amount?: number;
  created_at: string;
  updated_at: string;
}

export interface CreatePolicyInput {
  policy_type: string;
  coverage_amount?: number;
  premium_amount: number;
  premium_frequency?: 'monthly' | 'quarterly' | 'semi_annual' | 'annual';
  policy_term_years?: number;
  effective_date: string;
  expiry_date?: string;
  beneficiaries?: any;
  questionnaire_id?: string;
}

export class PolicyService {
  static async getUserPolicies(userId: string): Promise<Policy[]> {
    const { data, error } = await supabase
      .from('policies')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching policies:', error);
      throw error;
    }

    return data || [];
  }

  static async getPolicyById(policyId: string): Promise<Policy | null> {
    const { data, error } = await supabase
      .from('policies')
      .select('*')
      .eq('id', policyId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching policy:', error);
      throw error;
    }

    return data;
  }

  static async createPolicy(userId: string, policyData: CreatePolicyInput): Promise<Policy> {
    const policyNumber = this.generatePolicyNumber();

    const { data, error} = await supabase
      .from('policies')
      .insert({
        user_id: userId,
        policy_number: policyNumber,
        ...policyData,
        status: 'pending'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating policy:', error);
      throw error;
    }

    return data;
  }

  static async updatePolicy(policyId: string, updates: Partial<Policy>): Promise<Policy> {
    const { data, error } = await supabase
      .from('policies')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', policyId)
      .select()
      .single();

    if (error) {
      console.error('Error updating policy:', error);
      throw error;
    }

    return data;
  }

  static async deletePolicy(policyId: string): Promise<boolean> {
    const { error } = await supabase
      .from('policies')
      .delete()
      .eq('id', policyId);

    if (error) {
      console.error('Error deleting policy:', error);
      throw error;
    }

    return true;
  }

  static async getPolicyStats(userId: string) {
    const policies = await this.getUserPolicies(userId);

    const activePolicies = policies.filter(p => p.status === 'active');
    const totalCoverage = policies.reduce((sum, p) => sum + (p.coverage_amount || 0), 0);

    const monthlyPremium = policies
      .filter(p => p.status === 'active')
      .reduce((sum, p) => {
        if (p.premium_frequency === 'monthly') return sum + p.premium_amount;
        if (p.premium_frequency === 'annual') return sum + (p.premium_amount / 12);
        if (p.premium_frequency === 'quarterly') return sum + (p.premium_amount / 3);
        if (p.premium_frequency === 'semi_annual') return sum + (p.premium_amount / 6);
        return sum;
      }, 0);

    const nextRenewal = policies
      .filter(p => p.expiry_date && p.status === 'active')
      .map(p => {
        const expiry = new Date(p.expiry_date!);
        const today = new Date();
        const diffTime = expiry.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return { policyId: p.id, days: diffDays };
      })
      .filter(r => r.days > 0)
      .sort((a, b) => a.days - b.days)[0];

    return {
      totalPolicies: policies.length,
      activePolicies: activePolicies.length,
      totalCoverage,
      monthlyPremium,
      nextRenewalDays: nextRenewal?.days || null
    };
  }

  private static generatePolicyNumber(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `POL-${timestamp}-${random}`;
  }

  static async checkPolicyRenewals(userId: string): Promise<Policy[]> {
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const { data, error } = await supabase
      .from('policies')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .lte('expiry_date', thirtyDaysFromNow.toISOString())
      .order('expiry_date', { ascending: true });

    if (error) {
      console.error('Error checking renewals:', error);
      return [];
    }

    return data || [];
  }

  static async updatePolicyStatus(policyId: string, status: Policy['status']): Promise<Policy> {
    return this.updatePolicy(policyId, { status });
  }
}
