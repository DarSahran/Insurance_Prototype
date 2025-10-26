/*
  # Add Subscription Tiers and ML Usage Tracking

  1. New Tables
    - `subscription_tiers`
      - Defines subscription plans (Basic, Pro, Ultra)
      - Includes pricing, ML query limits, and Stripe product IDs
    
    - `user_subscriptions`
      - Links users to their active subscription
      - Tracks subscription status and billing cycle
    
    - `ml_usage_tracking`
      - Tracks ML assessment queries per user per week
      - Enforces weekly limits based on subscription tier
  
  2. Changes
    - Add subscription tier columns to track user's plan
    - Add usage counters and reset logic
  
  3. Security
    - Enable RLS on all new tables
    - Users can only read their own subscription data
    - Only authenticated users can track ML usage
*/

-- Create subscription tiers table
CREATE TABLE IF NOT EXISTS subscription_tiers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  display_name text NOT NULL,
  price_monthly integer NOT NULL,
  price_yearly integer,
  ml_queries_per_week integer NOT NULL,
  stripe_price_id_monthly text,
  stripe_price_id_yearly text,
  stripe_product_id text,
  features jsonb DEFAULT '[]'::jsonb,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Insert default subscription tiers
INSERT INTO subscription_tiers (name, display_name, price_monthly, price_yearly, ml_queries_per_week, features)
VALUES 
  ('basic', 'Basic', 299, 2990, 3, '["3 ML assessments per week", "Basic insurance recommendations", "Email support", "Access to policy marketplace"]'::jsonb),
  ('pro', 'Pro', 499, 4990, 15, '["15 ML assessments per week", "Advanced risk analysis", "Priority support", "Family management", "Document OCR scanning", "Real-time chat support"]'::jsonb),
  ('ultra', 'Ultra', 799, 7990, 30, '["30 ML assessments per week", "Unlimited policy comparisons", "24/7 premium support", "Dedicated insurance advisor", "Custom risk models", "API access", "White-label options"]'::jsonb)
ON CONFLICT (name) DO NOTHING;

-- Create user subscriptions table
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL UNIQUE,
  subscription_tier_id uuid REFERENCES subscription_tiers(id) NOT NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'past_due', 'trialing', 'paused')),
  stripe_customer_id text,
  stripe_subscription_id text,
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add default Basic tier for existing users
DO $$
DECLARE
  basic_tier_id uuid;
BEGIN
  SELECT id INTO basic_tier_id FROM subscription_tiers WHERE name = 'basic' LIMIT 1;
  
  IF basic_tier_id IS NOT NULL THEN
    INSERT INTO user_subscriptions (user_id, subscription_tier_id, status, current_period_start, current_period_end)
    SELECT 
      id::text,
      basic_tier_id,
      'active',
      now(),
      now() + interval '30 days'
    FROM auth.users
    WHERE NOT EXISTS (
      SELECT 1 FROM user_subscriptions WHERE user_subscriptions.user_id = auth.users.id::text
    );
  END IF;
END $$;

-- Create ML usage tracking table
CREATE TABLE IF NOT EXISTS ml_usage_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  week_start_date date NOT NULL,
  queries_used integer DEFAULT 0,
  queries_limit integer NOT NULL,
  last_query_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, week_start_date)
);

-- Function to get current week start (Monday)
CREATE OR REPLACE FUNCTION get_week_start(check_date date DEFAULT CURRENT_DATE)
RETURNS date AS $$
BEGIN
  RETURN check_date - (EXTRACT(DOW FROM check_date)::int - 1);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to check and update ML usage
CREATE OR REPLACE FUNCTION check_ml_usage_limit(p_user_id text)
RETURNS jsonb AS $$
DECLARE
  v_week_start date;
  v_subscription_tier_id uuid;
  v_queries_limit integer;
  v_queries_used integer;
  v_can_use boolean;
  v_subscription_name text;
BEGIN
  -- Get current week start
  v_week_start := get_week_start();
  
  -- Get user's subscription tier and limit
  SELECT 
    us.subscription_tier_id,
    st.ml_queries_per_week,
    st.name
  INTO 
    v_subscription_tier_id,
    v_queries_limit,
    v_subscription_name
  FROM user_subscriptions us
  JOIN subscription_tiers st ON st.id = us.subscription_tier_id
  WHERE us.user_id = p_user_id AND us.status = 'active'
  LIMIT 1;
  
  -- If no subscription found, default to basic (3 queries)
  IF v_subscription_tier_id IS NULL THEN
    v_queries_limit := 3;
    v_subscription_name := 'basic';
  END IF;
  
  -- Get or create usage record for this week
  INSERT INTO ml_usage_tracking (user_id, week_start_date, queries_used, queries_limit)
  VALUES (p_user_id, v_week_start, 0, v_queries_limit)
  ON CONFLICT (user_id, week_start_date) 
  DO UPDATE SET queries_limit = EXCLUDED.queries_limit
  RETURNING queries_used INTO v_queries_used;
  
  -- Check if user can make query
  v_can_use := v_queries_used < v_queries_limit;
  
  RETURN jsonb_build_object(
    'can_use', v_can_use,
    'queries_used', v_queries_used,
    'queries_limit', v_queries_limit,
    'queries_remaining', GREATEST(0, v_queries_limit - v_queries_used),
    'subscription_tier', v_subscription_name,
    'week_start', v_week_start
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment ML usage
CREATE OR REPLACE FUNCTION increment_ml_usage(p_user_id text)
RETURNS jsonb AS $$
DECLARE
  v_week_start date;
  v_queries_used integer;
  v_queries_limit integer;
BEGIN
  v_week_start := get_week_start();
  
  -- Increment usage counter
  UPDATE ml_usage_tracking
  SET 
    queries_used = queries_used + 1,
    last_query_at = now(),
    updated_at = now()
  WHERE user_id = p_user_id AND week_start_date = v_week_start
  RETURNING queries_used, queries_limit INTO v_queries_used, v_queries_limit;
  
  RETURN jsonb_build_object(
    'queries_used', v_queries_used,
    'queries_limit', v_queries_limit,
    'queries_remaining', GREATEST(0, v_queries_limit - v_queries_used)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS
ALTER TABLE subscription_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ml_usage_tracking ENABLE ROW LEVEL SECURITY;

-- RLS Policies for subscription_tiers (read-only for all authenticated users)
CREATE POLICY "Anyone can view subscription tiers"
  ON subscription_tiers FOR SELECT
  TO authenticated
  USING (is_active = true);

-- RLS Policies for user_subscriptions
CREATE POLICY "Users can view own subscription"
  ON user_subscriptions FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own subscription"
  ON user_subscriptions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own subscription"
  ON user_subscriptions FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

-- RLS Policies for ml_usage_tracking
CREATE POLICY "Users can view own ML usage"
  ON ml_usage_tracking FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own ML usage"
  ON ml_usage_tracking FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own ML usage"
  ON ml_usage_tracking FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON user_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_ml_usage_tracking_user_week ON ml_usage_tracking(user_id, week_start_date);
CREATE INDEX IF NOT EXISTS idx_ml_usage_tracking_week ON ml_usage_tracking(week_start_date);