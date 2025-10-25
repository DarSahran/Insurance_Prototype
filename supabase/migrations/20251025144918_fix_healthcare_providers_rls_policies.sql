/*
  # Fix Healthcare Providers RLS Policies

  1. Changes
    - Drop the problematic admin policy that references auth.users metadata
    - Simplify to allow public read access for verified providers
    - Remove complex admin checks
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view verified providers" ON healthcare_providers;
DROP POLICY IF EXISTS "Admins can manage providers" ON healthcare_providers;

-- Create simplified public read policy
CREATE POLICY "Public can view verified providers"
  ON healthcare_providers FOR SELECT
  TO anon, authenticated
  USING (verified = true);

-- Allow authenticated users to insert reviews (existing policy should work)
-- No changes needed for provider_reviews table