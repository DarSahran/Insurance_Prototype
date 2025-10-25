/*
  # Add Insurance Type-Specific Questionnaire Support

  1. Changes to insurance_questionnaires table
    - Add insurance_type column to store which insurance type this questionnaire is for
    - Add type_specific_data jsonb column for insurance-type-specific answers
    - Add indexes for better query performance

  2. Security
    - Update RLS policies to ensure users can only access their own questionnaires
    - Maintain existing security structure

  3. Data Structure
    - insurance_type: term_life, health, family_health, car, two_wheeler, travel, investment, retirement, home, term_rop
    - type_specific_data: stores all the answers specific to each insurance type
    - demographics, health, lifestyle, financial: common data across all types
*/

-- Add new columns if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'insurance_questionnaires' AND column_name = 'insurance_type'
  ) THEN
    ALTER TABLE insurance_questionnaires
    ADD COLUMN insurance_type text NOT NULL DEFAULT 'health';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'insurance_questionnaires' AND column_name = 'type_specific_data'
  ) THEN
    ALTER TABLE insurance_questionnaires
    ADD COLUMN type_specific_data jsonb DEFAULT '{}'::jsonb;
  END IF;
END $$;

-- Add check constraint for valid insurance types
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.constraint_column_usage
    WHERE constraint_name = 'valid_insurance_type'
  ) THEN
    ALTER TABLE insurance_questionnaires
    ADD CONSTRAINT valid_insurance_type
    CHECK (insurance_type IN (
      'term_life', 'health', 'family_health', 'car', 'two_wheeler',
      'travel', 'investment', 'retirement', 'home', 'term_rop'
    ));
  END IF;
END $$;

-- Create index for faster queries by insurance type
CREATE INDEX IF NOT EXISTS idx_questionnaires_insurance_type
ON insurance_questionnaires(insurance_type);

-- Create index for faster queries by user and type
CREATE INDEX IF NOT EXISTS idx_questionnaires_user_type
ON insurance_questionnaires(user_id, insurance_type);

-- Update RLS policies to be more specific
DROP POLICY IF EXISTS "Users can insert own questionnaires" ON insurance_questionnaires;
CREATE POLICY "Users can insert own questionnaires"
  ON insurance_questionnaires FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view own questionnaires" ON insurance_questionnaires;
CREATE POLICY "Users can view own questionnaires"
  ON insurance_questionnaires FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own questionnaires" ON insurance_questionnaires;
CREATE POLICY "Users can update own questionnaires"
  ON insurance_questionnaires FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own questionnaires" ON insurance_questionnaires;
CREATE POLICY "Users can delete own questionnaires"
  ON insurance_questionnaires FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
