/*
  # Add ML Parameters and Predictions Columns
  
  ## Purpose
  This migration adds support for storing ML model parameters and predictions
  in the insurance_questionnaires table.
  
  ## Changes
  1. Add `ml_parameters` column to store the 38 input parameters
  2. Add `ml_predictions` column to store ML model predictions
  
  ## Details
  - ml_parameters: Stores all 38 parameters required by the HuggingFace ML API
  - ml_predictions: Stores the complete ML model response including risk category, CLV, and derived features
*/

-- Add ml_parameters column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'insurance_questionnaires' AND column_name = 'ml_parameters'
  ) THEN
    ALTER TABLE insurance_questionnaires ADD COLUMN ml_parameters jsonb DEFAULT '{}'::jsonb;
  END IF;
END $$;

-- Add ml_predictions column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'insurance_questionnaires' AND column_name = 'ml_predictions'
  ) THEN
    ALTER TABLE insurance_questionnaires ADD COLUMN ml_predictions jsonb DEFAULT '{}'::jsonb;
  END IF;
END $$;

-- Add comment for documentation
COMMENT ON COLUMN insurance_questionnaires.ml_parameters IS 'Stores 38 ML model input parameters including demographics, health vitals, lifestyle, financial info, etc.';
COMMENT ON COLUMN insurance_questionnaires.ml_predictions IS 'Stores ML model predictions including risk category, CLV, risk probabilities, and derived features';
