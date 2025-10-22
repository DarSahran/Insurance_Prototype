import { supabase } from './supabase';

export interface PolicyProvider {
  id: string;
  provider_name: string;
  provider_code: string;
  logo_url?: string;
  description: string;
  website_url?: string;
  contact_phone?: string;
  contact_email?: string;
  claim_settlement_ratio?: number;
  customer_rating?: number;
  total_reviews: number;
  years_in_business: number;
  is_active: boolean;
}

export interface PolicyCatalog {
  id: string;
  provider_id: string;
  provider?: PolicyProvider;
  policy_type: 'term_life' | 'health' | 'investment' | 'car' | 'two_wheeler' | 'family_health';
  policy_name: string;
  policy_description?: string;
  coverage_amount_min?: number;
  coverage_amount_max?: number;
  monthly_premium_base: number;
  annual_premium_base: number;
  policy_term_years?: number;
  key_features: string[];
  exclusions: string[];
  eligibility_criteria: Record<string, any>;
  region_availability: string[];
  age_min?: number;
  age_max?: number;
  waiting_period_days: number;
  claim_process_description?: string;
  policy_documents_url?: string;
  is_featured: boolean;
  is_active: boolean;
  sort_order: number;
}

export interface QuickPolicy {
  id?: string;
  policy_number: string;
  user_id: string;
  catalog_policy_id?: string;
  policy_type: string;
  provider_id?: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_dob?: Date;
  customer_gender?: string;
  coverage_amount: number;
  monthly_premium: number;
  annual_premium: number;
  policy_term_years?: number;
  effective_date: Date;
  expiry_date?: Date;
  selected_addons?: any[];
  quick_form_data?: Record<string, any>;
  purchase_source: string;
  payment_id?: string;
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
  amount_paid?: number;
  status: 'pending_activation' | 'active' | 'expired' | 'cancelled' | 'lapsed';
}

export const policyMarketplaceService = {
  async getProviders() {
    const { data, error } = await supabase
      .from('policy_providers')
      .select('*')
      .eq('is_active', true)
      .order('customer_rating', { ascending: false });

    if (error) throw error;
    return data as PolicyProvider[];
  },

  async getPoliciesByType(policyType: string) {
    const { data, error } = await supabase
      .from('policy_catalog')
      .select(`
        *,
        provider:policy_providers(*)
      `)
      .eq('policy_type', policyType)
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) throw error;
    return data as PolicyCatalog[];
  },

  async getAllActivePolicies() {
    const { data, error } = await supabase
      .from('policy_catalog')
      .select(`
        *,
        provider:policy_providers(*)
      `)
      .eq('is_active', true)
      .order('is_featured', { ascending: false })
      .order('sort_order', { ascending: true });

    if (error) throw error;
    return data as PolicyCatalog[];
  },

  async getFeaturedPolicies() {
    const { data, error } = await supabase
      .from('policy_catalog')
      .select(`
        *,
        provider:policy_providers(*)
      `)
      .eq('is_active', true)
      .eq('is_featured', true)
      .order('sort_order', { ascending: true})
      .limit(6);

    if (error) throw error;
    return data as PolicyCatalog[];
  },

  async getPolicyById(policyId: string) {
    const { data, error } = await supabase
      .from('policy_catalog')
      .select(`
        *,
        provider:policy_providers(*),
        features:policy_features(*),
        addons:policy_addons(*)
      `)
      .eq('id', policyId)
      .single();

    if (error) throw error;
    return data;
  },

  async searchPolicies(filters: {
    policyType?: string;
    minCoverage?: number;
    maxCoverage?: number;
    maxMonthlyPremium?: number;
    region?: string;
    age?: number;
  }) {
    let query = supabase
      .from('policy_catalog')
      .select(`
        *,
        provider:policy_providers(*)
      `)
      .eq('is_active', true);

    if (filters.policyType) {
      query = query.eq('policy_type', filters.policyType);
    }

    if (filters.minCoverage) {
      query = query.gte('coverage_amount_min', filters.minCoverage);
    }

    if (filters.maxCoverage) {
      query = query.lte('coverage_amount_max', filters.maxCoverage);
    }

    if (filters.maxMonthlyPremium) {
      query = query.lte('monthly_premium_base', filters.maxMonthlyPremium);
    }

    if (filters.region) {
      query = query.contains('region_availability', [filters.region]);
    }

    if (filters.age) {
      query = query.lte('age_min', filters.age).gte('age_max', filters.age);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data as PolicyCatalog[];
  },

  async createQuickPolicy(policyData: Partial<QuickPolicy>) {
    const { data, error } = await supabase
      .from('quick_policies')
      .insert([policyData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getUserPolicies(userId: string) {
    const { data, error } = await supabase
      .from('quick_policies')
      .select(`
        *,
        catalog_policy:policy_catalog(*),
        provider:policy_providers(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async savePolicyToWishlist(userId: string, policyId: string, notes?: string) {
    const { data, error} = await supabase
      .from('saved_policies')
      .insert([{
        user_id: userId,
        policy_id: policyId,
        notes
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getUserSavedPolicies(userId: string) {
    const { data, error } = await supabase
      .from('saved_policies')
      .select(`
        *,
        policy:policy_catalog(
          *,
          provider:policy_providers(*)
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async removeSavedPolicy(savedPolicyId: string) {
    const { error } = await supabase
      .from('saved_policies')
      .delete()
      .eq('id', savedPolicyId);

    if (error) throw error;
  },

  async saveComparison(userId: string | null, sessionId: string, policyIds: string[]) {
    const { data, error } = await supabase
      .from('policy_comparisons')
      .insert([{
        user_id: userId,
        session_id: sessionId,
        policy_ids: policyIds
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async trackPurchaseFlow(flowData: {
    session_id: string;
    user_id?: string;
    policy_type?: string;
    [key: string]: any;
  }) {
    const { data, error } = await supabase
      .from('quick_purchase_flows')
      .upsert([flowData], { onConflict: 'session_id' })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  generatePolicyNumber(policyType: string): string {
    const prefix = {
      'term_life': 'TL',
      'health': 'HI',
      'investment': 'INV',
      'car': 'CAR',
      'two_wheeler': 'TW',
      'family_health': 'FH'
    }[policyType] || 'POL';

    const date = new Date();
    const yearMonth = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}`;
    const random = Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');

    return `${prefix}-${yearMonth}-${random}`;
  }
};
