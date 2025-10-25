import { supabase } from './supabase';

export interface AssessmentData {
  id?: string;
  user_id: string;
  insurance_type: string;
  assessment_data: Record<string, any>;
  policy_period: number;
  calculated_premium: number;
  risk_multiplier: number;
  status: 'draft' | 'completed' | 'purchased';
  created_at?: string;
  updated_at?: string;
}

export interface PolicySelection {
  id?: string;
  user_id: string;
  assessment_id?: string;
  policy_catalog_id?: string;
  insurance_type: string;
  policy_name: string;
  provider_name: string;
  policy_period_years: number;
  premium_amount: number;
  monthly_premium: number;
  coverage_amount: number;
  start_date: Date;
  end_date: Date;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_id?: string;
  metadata?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

class AssessmentService {
  async saveAssessment(data: Omit<AssessmentData, 'id' | 'created_at' | 'updated_at'>): Promise<AssessmentData | null> {
    try {
      const { data: assessment, error } = await supabase
        .from('insurance_assessments')
        .insert(data)
        .select()
        .single();

      if (error) {
        console.error('Error saving assessment:', error);
        return null;
      }

      return assessment;
    } catch (error) {
      console.error('Error in saveAssessment:', error);
      return null;
    }
  }

  async updateAssessment(id: string, updates: Partial<AssessmentData>): Promise<AssessmentData | null> {
    try {
      const { data: assessment, error } = await supabase
        .from('insurance_assessments')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating assessment:', error);
        return null;
      }

      return assessment;
    } catch (error) {
      console.error('Error in updateAssessment:', error);
      return null;
    }
  }

  async getAssessmentById(id: string): Promise<AssessmentData | null> {
    try {
      const { data: assessment, error } = await supabase
        .from('insurance_assessments')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching assessment:', error);
        return null;
      }

      return assessment;
    } catch (error) {
      console.error('Error in getAssessmentById:', error);
      return null;
    }
  }

  async getUserAssessments(userId: string, status?: string): Promise<AssessmentData[]> {
    try {
      let query = supabase
        .from('insurance_assessments')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      const { data: assessments, error } = await query;

      if (error) {
        console.error('Error fetching user assessments:', error);
        return [];
      }

      return assessments || [];
    } catch (error) {
      console.error('Error in getUserAssessments:', error);
      return [];
    }
  }

  async createPolicySelection(data: Omit<PolicySelection, 'id' | 'created_at' | 'updated_at'>): Promise<PolicySelection | null> {
    try {
      const { data: selection, error } = await supabase
        .from('policy_selections')
        .insert(data)
        .select()
        .single();

      if (error) {
        console.error('Error creating policy selection:', error);
        return null;
      }

      return selection;
    } catch (error) {
      console.error('Error in createPolicySelection:', error);
      return null;
    }
  }

  async updatePolicySelection(id: string, updates: Partial<PolicySelection>): Promise<PolicySelection | null> {
    try {
      const { data: selection, error } = await supabase
        .from('policy_selections')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating policy selection:', error);
        return null;
      }

      return selection;
    } catch (error) {
      console.error('Error in updatePolicySelection:', error);
      return null;
    }
  }

  async getUserPolicySelections(userId: string): Promise<PolicySelection[]> {
    try {
      const { data: selections, error } = await supabase
        .from('policy_selections')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching policy selections:', error);
        return [];
      }

      return selections || [];
    } catch (error) {
      console.error('Error in getUserPolicySelections:', error);
      return [];
    }
  }

  async getPaidPolicies(userId: string): Promise<PolicySelection[]> {
    try {
      const { data: selections, error } = await supabase
        .from('policy_selections')
        .select('*')
        .eq('user_id', userId)
        .eq('payment_status', 'paid')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching paid policies:', error);
        return [];
      }

      return selections || [];
    } catch (error) {
      console.error('Error in getPaidPolicies:', error);
      return [];
    }
  }

  calculateEndDate(startDate: Date, years: number): Date {
    const endDate = new Date(startDate);
    endDate.setFullYear(endDate.getFullYear() + years);
    return endDate;
  }

  formatINR(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  calculateMonthlyPremium(annualPremium: number, years: number): number {
    return Math.round(annualPremium / (years * 12));
  }
}

export const assessmentService = new AssessmentService();
