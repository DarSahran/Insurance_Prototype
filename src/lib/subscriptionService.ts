import { supabase } from './supabase';

export interface SubscriptionTier {
  id: string;
  name: string;
  display_name: string;
  price_monthly: number;
  price_yearly: number | null;
  ml_queries_per_week: number;
  stripe_price_id_monthly: string | null;
  stripe_price_id_yearly: string | null;
  stripe_product_id: string | null;
  features: string[];
  is_active: boolean;
}

export interface UserSubscription {
  id: string;
  user_id: string;
  subscription_tier_id: string;
  status: 'active' | 'cancelled' | 'past_due' | 'trialing' | 'paused';
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  tier?: SubscriptionTier;
}

export interface MLUsageStatus {
  can_use: boolean;
  queries_used: number;
  queries_limit: number;
  queries_remaining: number;
  subscription_tier: string;
  week_start: string;
}

export class SubscriptionService {
  static async getSubscriptionTiers(): Promise<SubscriptionTier[]> {
    const { data, error } = await supabase
      .from('subscription_tiers')
      .select('*')
      .eq('is_active', true)
      .order('price_monthly', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  static async getUserSubscription(userId: string): Promise<UserSubscription | null> {
    const { data, error } = await supabase
      .from('user_subscriptions')
      .select(`
        *,
        tier:subscription_tier_id (*)
      `)
      .eq('user_id', userId)
      .eq('status', 'active')
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  static async checkMLUsageLimit(userId: string): Promise<MLUsageStatus> {
    const { data, error } = await supabase.rpc('check_ml_usage_limit', {
      p_user_id: userId
    });

    if (error) {
      console.error('Error checking ML usage limit:', error);
      return {
        can_use: false,
        queries_used: 0,
        queries_limit: 3,
        queries_remaining: 0,
        subscription_tier: 'basic',
        week_start: new Date().toISOString()
      };
    }

    return data;
  }

  static async incrementMLUsage(userId: string): Promise<void> {
    const { error } = await supabase.rpc('increment_ml_usage', {
      p_user_id: userId
    });

    if (error) {
      console.error('Error incrementing ML usage:', error);
      throw error;
    }
  }

  static async createOrUpdateSubscription(
    userId: string,
    tierName: string,
    stripeCustomerId?: string,
    stripeSubscriptionId?: string
  ): Promise<UserSubscription> {
    const { data: tier } = await supabase
      .from('subscription_tiers')
      .select('id')
      .eq('name', tierName)
      .single();

    if (!tier) throw new Error('Subscription tier not found');

    const subscriptionData = {
      user_id: userId,
      subscription_tier_id: tier.id,
      status: 'active' as const,
      stripe_customer_id: stripeCustomerId || null,
      stripe_subscription_id: stripeSubscriptionId || null,
      current_period_start: new Date().toISOString(),
      current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    };

    const { data, error } = await supabase
      .from('user_subscriptions')
      .upsert(subscriptionData, {
        onConflict: 'user_id'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateSubscriptionStatus(
    userId: string,
    status: UserSubscription['status']
  ): Promise<void> {
    const { error } = await supabase
      .from('user_subscriptions')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('user_id', userId);

    if (error) throw error;
  }

  static async cancelSubscription(userId: string, cancelAtPeriodEnd: boolean = true): Promise<void> {
    const { error } = await supabase
      .from('user_subscriptions')
      .update({
        cancel_at_period_end: cancelAtPeriodEnd,
        status: cancelAtPeriodEnd ? 'active' : 'cancelled',
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);

    if (error) throw error;
  }

  static getTierDisplayInfo(tierName: string): {
    color: string;
    badge: string;
    icon: string;
  } {
    switch (tierName.toLowerCase()) {
      case 'basic':
        return { color: 'blue', badge: 'Basic', icon: '⭐' };
      case 'pro':
        return { color: 'purple', badge: 'Pro', icon: '✨' };
      case 'ultra':
        return { color: 'orange', badge: 'Ultra', icon: '🚀' };
      default:
        return { color: 'gray', badge: 'Free', icon: '📋' };
    }
  }
}

export default SubscriptionService;
