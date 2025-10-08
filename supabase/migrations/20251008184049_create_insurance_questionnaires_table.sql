/*
  # Insurance Questionnaires Table

  ## Overview
  This migration creates the insurance_questionnaires table to store user insurance assessment data
  with AI-generated analysis, risk scores, and premium estimates.

  ## Tables Created
  
  ### `insurance_questionnaires`
  Stores comprehensive insurance questionnaire responses and AI analysis results.
  
  **Columns:**
  - `id` (uuid, primary key) - Unique identifier for each questionnaire
  - `user_id` (uuid, foreign key) - References auth.users, links questionnaire to user
  - `demographics` (jsonb) - User demographic information (age, occupation, location, etc.)
  - `health` (jsonb) - Health-related data (conditions, medications, lifestyle)
  - `lifestyle` (jsonb) - Lifestyle information (exercise, smoking, hobbies)
  - `financial` (jsonb) - Financial information (income, assets, coverage needs)
  - `ai_analysis` (jsonb) - AI-generated analysis results and recommendations
  - `risk_score` (integer) - Calculated risk score (0-100)
  - `premium_estimate` (numeric) - Estimated monthly premium in USD
  - `confidence_score` (numeric) - AI confidence score (0-100)
  - `status` (text) - Questionnaire status (draft/completed/approved/rejected/pending_review)
  - `completion_percentage` (integer) - Progress percentage (0-100)
  - `processing_time_seconds` (numeric) - Time taken to process AI analysis
  - `version` (integer) - Version number for tracking updates
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp
  - `completed_at` (timestamptz) - Completion timestamp

  ## Indexes
  - `idx_insurance_questionnaires_user_id` - Fast lookups by user
  - `idx_insurance_questionnaires_status` - Filter by status
  - `idx_insurance_questionnaires_created_at` - Sort by creation date
  - GIN indexes on JSONB columns for efficient querying

  ## Security
  - Row Level Security (RLS) enabled
  - Users can only view/edit their own questionnaires
  - Automated timestamps via triggers

  ## Triggers
  - `update_updated_at_column` - Automatically updates updated_at timestamp
  - `update_completion_percentage` - Calculates completion percentage
*/

-- Create the insurance_questionnaires table
CREATE TABLE IF NOT EXISTS public.insurance_questionnaires (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  demographics jsonb NULL DEFAULT '{}'::jsonb,
  health jsonb NULL DEFAULT '{}'::jsonb,
  lifestyle jsonb NULL DEFAULT '{}'::jsonb,
  financial jsonb NULL DEFAULT '{}'::jsonb,
  ai_analysis jsonb NULL DEFAULT '{}'::jsonb,
  risk_score integer NULL,
  premium_estimate numeric(10, 2) NULL,
  confidence_score numeric(5, 2) NULL,
  status text NULL DEFAULT 'draft'::text,
  completion_percentage integer NULL DEFAULT 0,
  processing_time_seconds numeric(10, 3) NULL,
  version integer NULL DEFAULT 1,
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now(),
  completed_at timestamp with time zone NULL,
  CONSTRAINT insurance_questionnaires_pkey PRIMARY KEY (id),
  CONSTRAINT insurance_questionnaires_user_id_fkey FOREIGN KEY (user_id) 
    REFERENCES auth.users (id) ON DELETE CASCADE,
  CONSTRAINT insurance_questionnaires_status_check CHECK (
    status = ANY (ARRAY[
      'draft'::text,
      'completed'::text,
      'approved'::text,
      'rejected'::text,
      'pending_review'::text
    ])
  )
) TABLESPACE pg_default;

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_insurance_questionnaires_user_id 
  ON public.insurance_questionnaires USING btree (user_id) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_insurance_questionnaires_status 
  ON public.insurance_questionnaires USING btree (status) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_insurance_questionnaires_created_at 
  ON public.insurance_questionnaires USING btree (created_at) TABLESPACE pg_default;

-- GIN indexes for JSONB columns to enable efficient querying
CREATE INDEX IF NOT EXISTS idx_questionnaires_demographics_gin 
  ON public.insurance_questionnaires USING gin (demographics) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_questionnaires_health_gin 
  ON public.insurance_questionnaires USING gin (health) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_questionnaires_lifestyle_gin 
  ON public.insurance_questionnaires USING gin (lifestyle) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_questionnaires_financial_gin 
  ON public.insurance_questionnaires USING gin (financial) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_questionnaires_ai_analysis_gin 
  ON public.insurance_questionnaires USING gin (ai_analysis) TABLESPACE pg_default;

-- Create trigger function for updating updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger function for updating completion percentage
CREATE OR REPLACE FUNCTION update_completion_percentage()
RETURNS TRIGGER AS $$
BEGIN
  -- Calculate completion percentage based on filled sections
  DECLARE
    total_sections INTEGER := 4; -- demographics, health, lifestyle, financial
    completed_sections INTEGER := 0;
  BEGIN
    -- Check if each section has data
    IF NEW.demographics IS NOT NULL AND NEW.demographics != '{}'::jsonb THEN
      completed_sections := completed_sections + 1;
    END IF;
    
    IF NEW.health IS NOT NULL AND NEW.health != '{}'::jsonb THEN
      completed_sections := completed_sections + 1;
    END IF;
    
    IF NEW.lifestyle IS NOT NULL AND NEW.lifestyle != '{}'::jsonb THEN
      completed_sections := completed_sections + 1;
    END IF;
    
    IF NEW.financial IS NOT NULL AND NEW.financial != '{}'::jsonb THEN
      completed_sections := completed_sections + 1;
    END IF;
    
    -- Calculate percentage
    NEW.completion_percentage := (completed_sections * 100) / total_sections;
    
    -- Update completed_at if status changes to completed
    IF NEW.status = 'completed' AND OLD.completed_at IS NULL THEN
      NEW.completed_at := now();
    END IF;
    
    RETURN NEW;
  END;
END;
$$ LANGUAGE plpgsql;

-- Attach triggers
DROP TRIGGER IF EXISTS update_insurance_questionnaires_updated_at ON insurance_questionnaires;
CREATE TRIGGER update_insurance_questionnaires_updated_at 
  BEFORE UPDATE ON insurance_questionnaires 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_questionnaire_completion ON insurance_questionnaires;
CREATE TRIGGER update_questionnaire_completion 
  BEFORE INSERT OR UPDATE ON insurance_questionnaires 
  FOR EACH ROW EXECUTE FUNCTION update_completion_percentage();

-- Enable Row Level Security
ALTER TABLE insurance_questionnaires ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Policy: Users can view their own questionnaires
CREATE POLICY "Users can view own questionnaires"
  ON insurance_questionnaires
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own questionnaires
CREATE POLICY "Users can create own questionnaires"
  ON insurance_questionnaires
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own questionnaires
CREATE POLICY "Users can update own questionnaires"
  ON insurance_questionnaires
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own questionnaires
CREATE POLICY "Users can delete own questionnaires"
  ON insurance_questionnaires
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
