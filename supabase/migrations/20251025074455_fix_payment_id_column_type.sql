/*
  # Fix Payment ID Column Type
  
  1. Changes
    - Change payment_id column from uuid to text in quick_policies table
    - Stripe payment intent IDs are strings like "pi_xxx", not UUIDs
  
  2. Security
    - No changes to RLS policies
*/

-- Change payment_id column type from uuid to text
ALTER TABLE quick_policies 
  ALTER COLUMN payment_id TYPE text USING payment_id::text;

-- Add comment explaining the column stores Stripe payment intent IDs
COMMENT ON COLUMN quick_policies.payment_id IS 'Stripe payment intent ID (e.g., pi_xxx)';