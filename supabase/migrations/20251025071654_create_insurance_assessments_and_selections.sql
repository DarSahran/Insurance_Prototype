/*
  # Insurance Assessments and Policy Selections

  ## Overview
  This migration creates tables for storing insurance assessment data and policy selections
  with proper pricing based on policy period (1-4 years) in INR.

  ## New Tables

  ### `insurance_assessments`
  Stores completed insurance assessment data from users
  - `id` (uuid, primary key)
  - `user_id` (uuid, references auth.users)
  - `insurance_type` (text) - Type of insurance (term-life, health, car, etc.)
  - `assessment_data` (jsonb) - Complete assessment form data
  - `policy_period` (integer) - Policy duration in years (1-4)
  - `calculated_premium` (numeric) - Calculated premium in INR
  - `risk_multiplier` (numeric) - Risk adjustment multiplier
  - `status` (text) - Status: draft, completed, purchased
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `policy_selections`
  Tracks user policy selections and purchases
  - `id` (uuid, primary key)
  - `user_id` (uuid, references auth.users)
  - `assessment_id` (uuid, references insurance_assessments)
  - `policy_catalog_id` (uuid, references policy_catalog, nullable)
  - `insurance_type` (text)
  - `policy_name` (text)
  - `provider_name` (text)
  - `policy_period_years` (integer)
  - `premium_amount` (numeric) - Total premium for the period in INR
  - `monthly_premium` (numeric) - Monthly premium in INR
  - `coverage_amount` (numeric) - Coverage amount in INR
  - `start_date` (date)
  - `end_date` (date)
  - `payment_status` (text) - Status: pending, paid, failed
  - `payment_id` (text, nullable)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ## Security
  - Enable RLS on both tables
  - Users can only access their own assessments and selections
  - Authenticated users required for all operations

  ## Important Notes
  1. All pricing is in Indian Rupees (INR)
  2. Policy periods support 1, 2, 3, or 4 years
  3. Premium calculations include risk multipliers
  4. Assessment data stored as JSONB for flexibility
*/

-- Create insurance_assessments table
CREATE TABLE IF NOT EXISTS insurance_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  insurance_type text NOT NULL,
  assessment_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  policy_period integer NOT NULL CHECK (policy_period BETWEEN 1 AND 4),
  calculated_premium numeric(10, 2) NOT NULL DEFAULT 0,
  risk_multiplier numeric(4, 2) NOT NULL DEFAULT 1.0,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'completed', 'purchased')),
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_insurance_assessments_user_id ON insurance_assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_insurance_assessments_insurance_type ON insurance_assessments(insurance_type);
CREATE INDEX IF NOT EXISTS idx_insurance_assessments_status ON insurance_assessments(status);

-- Create policy_selections table
CREATE TABLE IF NOT EXISTS policy_selections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  assessment_id uuid REFERENCES insurance_assessments(id) ON DELETE SET NULL,
  policy_catalog_id uuid REFERENCES policy_catalog(id) ON DELETE SET NULL,
  insurance_type text NOT NULL,
  policy_name text NOT NULL,
  provider_name text NOT NULL,
  policy_period_years integer NOT NULL CHECK (policy_period_years BETWEEN 1 AND 4),
  premium_amount numeric(10, 2) NOT NULL,
  monthly_premium numeric(10, 2) NOT NULL,
  coverage_amount numeric(12, 2) NOT NULL DEFAULT 0,
  start_date date NOT NULL DEFAULT CURRENT_DATE,
  end_date date NOT NULL,
  payment_status text NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  payment_id text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_policy_selections_user_id ON policy_selections(user_id);
CREATE INDEX IF NOT EXISTS idx_policy_selections_assessment_id ON policy_selections(assessment_id);
CREATE INDEX IF NOT EXISTS idx_policy_selections_insurance_type ON policy_selections(insurance_type);
CREATE INDEX IF NOT EXISTS idx_policy_selections_payment_status ON policy_selections(payment_status);

-- Enable Row Level Security
ALTER TABLE insurance_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE policy_selections ENABLE ROW LEVEL SECURITY;

-- RLS Policies for insurance_assessments

CREATE POLICY "Users can view own assessments"
  ON insurance_assessments FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own assessments"
  ON insurance_assessments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own assessments"
  ON insurance_assessments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own assessments"
  ON insurance_assessments FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for policy_selections

CREATE POLICY "Users can view own policy selections"
  ON policy_selections FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own policy selections"
  ON policy_selections FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own policy selections"
  ON policy_selections FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_insurance_assessments_updated_at
  BEFORE UPDATE ON insurance_assessments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_policy_selections_updated_at
  BEFORE UPDATE ON policy_selections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
