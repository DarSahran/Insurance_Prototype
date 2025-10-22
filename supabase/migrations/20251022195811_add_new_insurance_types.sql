/*
  # Add New Insurance Policy Types

  1. Schema Changes
    - Update policy_type enum to include travel, retirement, home, term_rop, women_term
    - Update TypeScript interfaces to match
    
  2. Security
    - No changes to RLS policies
    - All new types follow existing security model
*/

-- Drop existing check constraint
ALTER TABLE policy_catalog DROP CONSTRAINT IF EXISTS policy_catalog_policy_type_check;

-- Add new constraint with all policy types
ALTER TABLE policy_catalog ADD CONSTRAINT policy_catalog_policy_type_check 
  CHECK (policy_type IN ('term_life', 'health', 'investment', 'car', 'two_wheeler', 'family_health', 'travel', 'retirement', 'home', 'term_rop', 'women_term'));

-- Also update quick_policies table
ALTER TABLE quick_policies DROP CONSTRAINT IF EXISTS quick_policies_policy_type_check;
