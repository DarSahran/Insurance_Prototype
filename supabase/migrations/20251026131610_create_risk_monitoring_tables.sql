/*
  # Real-Time Risk Monitoring System

  ## Overview
  Creates tables for tracking historical risk scores and real-time risk alerts
  to enable comprehensive risk monitoring with trend analysis and notifications.

  ## New Tables
  
  ### `risk_history`
  Stores historical risk score snapshots for trend analysis
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key to auth.users)
  - `overall_score` (integer) - Overall risk score (0-100)
  - `risk_category` (text) - Low Risk, Medium Risk, High Risk
  - `health_score` (integer) - Health-specific risk score
  - `lifestyle_score` (integer) - Lifestyle-specific risk score
  - `financial_score` (integer) - Financial-specific risk score
  - `demographic_score` (integer) - Demographic-specific risk score
  - `questionnaire_id` (uuid) - Reference to source questionnaire
  - `contributing_factors` (jsonb) - Detailed breakdown of risk factors
  - `calculated_at` (timestamptz) - When risk was calculated
  - `created_at` (timestamptz)

  ### `risk_alerts`
  Stores real-time risk alerts when thresholds are crossed
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key to auth.users)
  - `alert_type` (text) - risk_increase, risk_decrease, threshold_crossed, etc.
  - `severity` (text) - low, medium, high, critical
  - `title` (text) - Alert title
  - `message` (text) - Alert description
  - `previous_score` (integer) - Previous risk score
  - `current_score` (integer) - Current risk score
  - `threshold_value` (integer) - Threshold that was crossed
  - `is_acknowledged` (boolean) - Whether user has seen the alert
  - `acknowledged_at` (timestamptz)
  - `metadata` (jsonb) - Additional alert data
  - `created_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Users can only access their own data
  - Automatic user_id validation in policies
*/

-- Create risk_history table
CREATE TABLE IF NOT EXISTS risk_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  overall_score integer NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
  risk_category text NOT NULL,
  health_score integer NOT NULL DEFAULT 0 CHECK (health_score >= 0 AND health_score <= 100),
  lifestyle_score integer NOT NULL DEFAULT 0 CHECK (lifestyle_score >= 0 AND lifestyle_score <= 100),
  financial_score integer NOT NULL DEFAULT 0 CHECK (financial_score >= 0 AND financial_score <= 100),
  demographic_score integer NOT NULL DEFAULT 0 CHECK (demographic_score >= 0 AND demographic_score <= 100),
  questionnaire_id uuid REFERENCES insurance_questionnaires(id) ON DELETE SET NULL,
  contributing_factors jsonb DEFAULT '[]'::jsonb,
  calculated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Create risk_alerts table
CREATE TABLE IF NOT EXISTS risk_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  alert_type text NOT NULL,
  severity text NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  title text NOT NULL,
  message text NOT NULL,
  previous_score integer CHECK (previous_score >= 0 AND previous_score <= 100),
  current_score integer NOT NULL CHECK (current_score >= 0 AND current_score <= 100),
  threshold_value integer CHECK (threshold_value >= 0 AND threshold_value <= 100),
  is_acknowledged boolean NOT NULL DEFAULT false,
  acknowledged_at timestamptz,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_risk_history_user_id ON risk_history(user_id);
CREATE INDEX IF NOT EXISTS idx_risk_history_calculated_at ON risk_history(calculated_at DESC);
CREATE INDEX IF NOT EXISTS idx_risk_history_user_calculated ON risk_history(user_id, calculated_at DESC);

CREATE INDEX IF NOT EXISTS idx_risk_alerts_user_id ON risk_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_risk_alerts_created_at ON risk_alerts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_risk_alerts_user_unacknowledged ON risk_alerts(user_id, is_acknowledged) WHERE is_acknowledged = false;

-- Enable Row Level Security
ALTER TABLE risk_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE risk_alerts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for risk_history
CREATE POLICY "Users can view own risk history"
  ON risk_history FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own risk history"
  ON risk_history FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for risk_alerts
CREATE POLICY "Users can view own risk alerts"
  ON risk_alerts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own risk alerts"
  ON risk_alerts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "System can create risk alerts"
  ON risk_alerts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);