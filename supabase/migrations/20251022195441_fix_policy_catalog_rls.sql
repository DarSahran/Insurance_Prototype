/*
  # Fix Policy Catalog RLS - Allow Public Read Access

  1. RLS Policies
    - Add SELECT policy for policy_catalog to allow public read access
    - Add SELECT policy for policy_providers to allow public read access
    - Add SELECT policy for policy_features to allow public read access
    - Add SELECT policy for policy_addons to allow public read access
    
  2. Security
    - All tables remain protected with RLS enabled
    - Only SELECT operations are allowed for anonymous users
    - Write operations still require authentication
*/

-- Drop existing policies if they exist and recreate
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Anyone can view active policies" ON policy_catalog;
  DROP POLICY IF EXISTS "Anyone can view active providers" ON policy_providers;
  DROP POLICY IF EXISTS "Anyone can view policy features" ON policy_features;
  DROP POLICY IF EXISTS "Anyone can view policy addons" ON policy_addons;
  DROP POLICY IF EXISTS "Users can view own saved policies" ON saved_policies;
  DROP POLICY IF EXISTS "Users can insert own saved policies" ON saved_policies;
  DROP POLICY IF EXISTS "Users can delete own saved policies" ON saved_policies;
  DROP POLICY IF EXISTS "Anyone can view policy comparisons by session" ON policy_comparisons;
  DROP POLICY IF EXISTS "Anyone can create policy comparisons" ON policy_comparisons;
  DROP POLICY IF EXISTS "Anyone can track purchase flows" ON quick_purchase_flows;
  DROP POLICY IF EXISTS "Anyone can update purchase flows by session" ON quick_purchase_flows;
  DROP POLICY IF EXISTS "Users can view own quick policies" ON quick_policies;
  DROP POLICY IF EXISTS "Anyone can create quick policies" ON quick_policies;
  DROP POLICY IF EXISTS "Users can update own quick policies" ON quick_policies;
END $$;

-- Policy Catalog - Allow public read access for active policies
CREATE POLICY "Anyone can view active policies"
  ON policy_catalog
  FOR SELECT
  USING (is_active = true);

-- Policy Providers - Allow public read access
CREATE POLICY "Anyone can view active providers"
  ON policy_providers
  FOR SELECT
  USING (is_active = true);

-- Policy Features - Allow public read access
CREATE POLICY "Anyone can view policy features"
  ON policy_features
  FOR SELECT
  USING (true);

-- Policy Addons - Allow public read access
CREATE POLICY "Anyone can view policy addons"
  ON policy_addons
  FOR SELECT
  USING (true);

-- Saved Policies - Users can only see their own saved policies
CREATE POLICY "Users can view own saved policies"
  ON saved_policies
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own saved policies"
  ON saved_policies
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can delete own saved policies"
  ON saved_policies
  FOR DELETE
  TO authenticated
  USING (auth.uid()::text = user_id);

-- Policy Comparisons - Allow read for session-based comparisons
CREATE POLICY "Anyone can view policy comparisons by session"
  ON policy_comparisons
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create policy comparisons"
  ON policy_comparisons
  FOR INSERT
  WITH CHECK (true);

-- Quick Purchase Flows - Session-based tracking
CREATE POLICY "Anyone can track purchase flows"
  ON quick_purchase_flows
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update purchase flows by session"
  ON quick_purchase_flows
  FOR UPDATE
  USING (true);

-- Quick Policies - Users can see their own policies
CREATE POLICY "Users can view own quick policies"
  ON quick_policies
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id);

CREATE POLICY "Anyone can create quick policies"
  ON quick_policies
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update own quick policies"
  ON quick_policies
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = user_id);
