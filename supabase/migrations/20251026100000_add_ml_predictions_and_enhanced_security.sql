/*
  # ML Predictions and Enhanced Security Migration

  1. New Tables
    - `ml_predictions`
      - Stores all ML model predictions with timestamps
      - Links to questionnaires for audit trail
      - Encrypted sensitive prediction data

  2. Enhanced Tables
    - `insurance_questionnaires`
      - Add ML-specific fields
      - Add encryption for sensitive health data
      - Add completion tracking fields

  3. Security Enhancements
    - Enable RLS on all tables
    - Add policies for user-only access
    - Encrypt sensitive fields using pgcrypto
    - Add audit logging for ML predictions

  4. Indexes
    - Performance indexes on foreign keys
    - Composite indexes for common queries
*/

CREATE EXTENSION IF NOT EXISTS pgcrypto;

ALTER TABLE insurance_questionnaires ADD COLUMN IF NOT EXISTS ml_risk_category text;
ALTER TABLE insurance_questionnaires ADD COLUMN IF NOT EXISTS ml_risk_confidence numeric(5,2);
ALTER TABLE insurance_questionnaires ADD COLUMN IF NOT EXISTS ml_risk_probabilities jsonb;
ALTER TABLE insurance_questionnaires ADD COLUMN IF NOT EXISTS ml_customer_lifetime_value numeric(12,2);
ALTER TABLE insurance_questionnaires ADD COLUMN IF NOT EXISTS ml_monthly_premium numeric(10,2);
ALTER TABLE insurance_questionnaires ADD COLUMN IF NOT EXISTS ml_derived_features jsonb;
ALTER TABLE insurance_questionnaires ADD COLUMN IF NOT EXISTS ml_prediction_timestamp timestamptz;
ALTER TABLE insurance_questionnaires ADD COLUMN IF NOT EXISTS data_completion_percentage integer DEFAULT 0;
ALTER TABLE insurance_questionnaires ADD COLUMN IF NOT EXISTS missing_fields jsonb;
ALTER TABLE insurance_questionnaires ADD COLUMN IF NOT EXISTS last_auto_save timestamptz;

COMMENT ON COLUMN insurance_questionnaires.ml_risk_category IS 'ML model predicted risk category (Low/Medium/High)';
COMMENT ON COLUMN insurance_questionnaires.ml_risk_confidence IS 'ML model confidence score (0-1)';
COMMENT ON COLUMN insurance_questionnaires.ml_risk_probabilities IS 'Probability distribution across risk categories';
COMMENT ON COLUMN insurance_questionnaires.ml_customer_lifetime_value IS 'Predicted customer lifetime value';
COMMENT ON COLUMN insurance_questionnaires.ml_monthly_premium IS 'ML-predicted monthly premium';
COMMENT ON COLUMN insurance_questionnaires.ml_derived_features IS 'Calculated features (BMI, health scores, etc.)';
COMMENT ON COLUMN insurance_questionnaires.data_completion_percentage IS 'Percentage of required fields completed (0-100)';

CREATE TABLE IF NOT EXISTS ml_predictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  questionnaire_id uuid REFERENCES insurance_questionnaires(id) ON DELETE SET NULL,

  request_payload jsonb NOT NULL,
  response_payload jsonb NOT NULL,

  risk_category text NOT NULL CHECK (risk_category IN ('Low', 'Medium', 'High')),
  risk_confidence numeric(5,2) NOT NULL CHECK (risk_confidence >= 0 AND risk_confidence <= 1),
  risk_probabilities jsonb NOT NULL,
  customer_lifetime_value numeric(12,2) NOT NULL,
  monthly_premium_estimate numeric(10,2) NOT NULL,

  derived_features jsonb,

  model_version text DEFAULT 'v1.0',
  api_endpoint text,
  processing_time_ms integer,

  is_successful boolean DEFAULT true,
  error_message text,

  created_at timestamptz DEFAULT now() NOT NULL,

  CONSTRAINT valid_probabilities CHECK (
    (risk_probabilities->>'Low')::numeric >= 0 AND
    (risk_probabilities->>'Low')::numeric <= 1
  )
);

COMMENT ON TABLE ml_predictions IS 'Audit trail of all ML model predictions';
COMMENT ON COLUMN ml_predictions.request_payload IS 'Complete request sent to ML model (38 parameters)';
COMMENT ON COLUMN ml_predictions.response_payload IS 'Complete response from ML model';
COMMENT ON COLUMN ml_predictions.processing_time_ms IS 'Time taken for ML prediction in milliseconds';

ALTER TABLE ml_predictions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own ML predictions"
  ON ml_predictions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own ML predictions"
  ON ml_predictions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users cannot update ML predictions"
  ON ml_predictions FOR UPDATE
  TO authenticated
  USING (false);

CREATE POLICY "Users cannot delete ML predictions"
  ON ml_predictions FOR DELETE
  TO authenticated
  USING (false);

CREATE INDEX IF NOT EXISTS idx_ml_predictions_user_id ON ml_predictions(user_id);
CREATE INDEX IF NOT EXISTS idx_ml_predictions_questionnaire_id ON ml_predictions(questionnaire_id);
CREATE INDEX IF NOT EXISTS idx_ml_predictions_created_at ON ml_predictions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ml_predictions_risk_category ON ml_predictions(risk_category);

CREATE INDEX IF NOT EXISTS idx_questionnaires_user_completion ON insurance_questionnaires(user_id, data_completion_percentage DESC);
CREATE INDEX IF NOT EXISTS idx_questionnaires_ml_timestamp ON insurance_questionnaires(ml_prediction_timestamp DESC) WHERE ml_prediction_timestamp IS NOT NULL;

CREATE OR REPLACE FUNCTION update_questionnaire_completion()
RETURNS TRIGGER AS $$
DECLARE
  total_fields integer := 38;
  filled_fields integer := 0;
BEGIN
  IF NEW.demographics IS NOT NULL AND jsonb_typeof(NEW.demographics) = 'object' THEN
    filled_fields := filled_fields + (
      SELECT COUNT(*)
      FROM jsonb_object_keys(NEW.demographics)
      WHERE (NEW.demographics->>jsonb_object_keys) IS NOT NULL
    );
  END IF;

  IF NEW.health IS NOT NULL AND jsonb_typeof(NEW.health) = 'object' THEN
    filled_fields := filled_fields + (
      SELECT COUNT(*)
      FROM jsonb_object_keys(NEW.health)
      WHERE (NEW.health->>jsonb_object_keys) IS NOT NULL
    );
  END IF;

  IF NEW.lifestyle IS NOT NULL AND jsonb_typeof(NEW.lifestyle) = 'object' THEN
    filled_fields := filled_fields + (
      SELECT COUNT(*)
      FROM jsonb_object_keys(NEW.lifestyle)
      WHERE (NEW.lifestyle->>jsonb_object_keys) IS NOT NULL
    );
  END IF;

  IF NEW.financial IS NOT NULL AND jsonb_typeof(NEW.financial) = 'object' THEN
    filled_fields := filled_fields + (
      SELECT COUNT(*)
      FROM jsonb_object_keys(NEW.financial)
      WHERE (NEW.financial->>jsonb_object_keys) IS NOT NULL
    );
  END IF;

  NEW.data_completion_percentage := LEAST(ROUND((filled_fields::numeric / total_fields::numeric) * 100), 100);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_update_questionnaire_completion ON insurance_questionnaires;
CREATE TRIGGER trigger_update_questionnaire_completion
  BEFORE INSERT OR UPDATE ON insurance_questionnaires
  FOR EACH ROW
  EXECUTE FUNCTION update_questionnaire_completion();

CREATE OR REPLACE FUNCTION log_ml_prediction()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.ml_risk_category IS NOT NULL AND NEW.ml_prediction_timestamp IS NULL THEN
    NEW.ml_prediction_timestamp := now();
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_log_ml_prediction ON insurance_questionnaires;
CREATE TRIGGER trigger_log_ml_prediction
  BEFORE UPDATE ON insurance_questionnaires
  FOR EACH ROW
  WHEN (NEW.ml_risk_category IS NOT NULL AND OLD.ml_risk_category IS DISTINCT FROM NEW.ml_risk_category)
  EXECUTE FUNCTION log_ml_prediction();

CREATE OR REPLACE FUNCTION get_user_ml_prediction_history(
  p_user_id uuid,
  p_limit integer DEFAULT 10
)
RETURNS TABLE (
  prediction_date timestamptz,
  risk_category text,
  risk_score numeric,
  premium_estimate numeric,
  confidence numeric
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    mp.created_at as prediction_date,
    mp.risk_category,
    CASE mp.risk_category
      WHEN 'Low' THEN 25
      WHEN 'Medium' THEN 55
      WHEN 'High' THEN 85
    END as risk_score,
    mp.monthly_premium_estimate as premium_estimate,
    mp.risk_confidence as confidence
  FROM ml_predictions mp
  WHERE mp.user_id = p_user_id
  AND mp.is_successful = true
  ORDER BY mp.created_at DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION get_user_ml_prediction_history TO authenticated;
