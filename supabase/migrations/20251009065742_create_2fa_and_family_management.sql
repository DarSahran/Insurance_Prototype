/*
  # Two-Factor Authentication and Family Management Migration
  
  ## Overview
  Adds comprehensive two-factor authentication and family member management to the insurance platform.
  
  ## New Tables
  
  ### `two_factor_auth`
  Stores user 2FA settings and backup codes.
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key, unique) - User who owns the 2FA settings
  - `enabled` (boolean) - Whether 2FA is active
  - `method` (text) - totp, sms, email
  - `secret_key` (text) - TOTP secret (encrypted)
  - `backup_codes` (text[]) - Array of backup codes (hashed)
  - `phone_number` (text) - For SMS 2FA
  - `verified_at` (timestamptz) - When 2FA was verified
  - `last_used_at` (timestamptz) - Last successful 2FA verification
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### `two_factor_attempts`
  Tracks 2FA verification attempts for security monitoring.
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key)
  - `attempt_type` (text) - login, action_verification
  - `method_used` (text) - totp, sms, backup_code
  - `success` (boolean) - Whether attempt succeeded
  - `ip_address` (inet) - Source IP
  - `user_agent` (text) - Browser/device info
  - `failure_reason` (text) - If failed
  - `created_at` (timestamptz)
  
  ### `family_members`
  Manages family member profiles and relationships.
  - `id` (uuid, primary key)
  - `primary_user_id` (uuid, foreign key) - Account owner
  - `member_type` (text) - spouse, child, parent, dependent
  - `first_name` (text)
  - `last_name` (text)
  - `date_of_birth` (date)
  - `gender` (text)
  - `relationship` (text) - Relationship to primary
  - `email` (text) - Optional email
  - `phone` (text) - Optional phone
  - `health_information` (jsonb) - Medical conditions, medications
  - `is_covered` (boolean) - Whether they have insurance coverage
  - `is_beneficiary` (boolean) - Whether they're a beneficiary
  - `beneficiary_percentage` (numeric) - Share of benefits
  - `ssn_last_four` (text) - Last 4 of SSN for verification
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### `family_member_policies`
  Links family members to specific policies.
  - `id` (uuid, primary key)
  - `family_member_id` (uuid, foreign key)
  - `policy_id` (uuid, foreign key)
  - `coverage_type` (text) - primary, dependent, beneficiary
  - `coverage_start_date` (date)
  - `coverage_end_date` (date)
  - `premium_contribution` (numeric) - If they contribute to premiums
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### `wearable_devices`
  Tracks connected wearable devices for health monitoring.
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key)
  - `device_type` (text) - fitbit, apple_watch, garmin, etc.
  - `device_name` (text) - User-friendly name
  - `device_id` (text) - External device identifier
  - `is_active` (boolean) - Currently syncing
  - `last_sync_at` (timestamptz) - Last data sync
  - `sync_frequency` (text) - hourly, daily, real_time
  - `permissions_granted` (jsonb) - Which metrics are shared
  - `integration_token_encrypted` (text) - Encrypted access token
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### `wearable_data_snapshots`
  Stores aggregated health data from wearables.
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key)
  - `device_id` (uuid, foreign key)
  - `snapshot_date` (date)
  - `metrics` (jsonb) - steps, heart_rate, sleep, etc.
  - `data_quality_score` (numeric) - Completeness/reliability
  - `processed_for_premium` (boolean) - Used in premium calculation
  - `created_at` (timestamptz)
  
  ## Security
  - RLS enabled on all tables
  - Users can only access their own 2FA settings
  - Users can only manage their own family members
  - Automatic rate limiting on 2FA attempts
  - Encrypted storage of sensitive 2FA data
  
  ## Indexes
  - User ID for fast queries
  - Family relationships for quick lookups
  - Device sync status for monitoring
*/

-- Create two_factor_auth table
CREATE TABLE IF NOT EXISTS two_factor_auth (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  enabled BOOLEAN DEFAULT FALSE,
  method TEXT DEFAULT 'totp' CHECK (method IN ('totp', 'sms', 'email')),
  secret_key TEXT,
  backup_codes TEXT[],
  phone_number TEXT,
  verified_at TIMESTAMP WITH TIME ZONE,
  last_used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create two_factor_attempts table
CREATE TABLE IF NOT EXISTS two_factor_attempts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  attempt_type TEXT NOT NULL CHECK (attempt_type IN ('login', 'action_verification', 'setup')),
  method_used TEXT NOT NULL CHECK (method_used IN ('totp', 'sms', 'email', 'backup_code')),
  success BOOLEAN NOT NULL,
  ip_address INET,
  user_agent TEXT,
  failure_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create family_members table
CREATE TABLE IF NOT EXISTS family_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  primary_user_id UUID NOT NULL,
  member_type TEXT NOT NULL CHECK (member_type IN ('spouse', 'child', 'parent', 'sibling', 'dependent', 'other')),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth DATE,
  gender TEXT,
  relationship TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  health_information JSONB DEFAULT '{}'::JSONB,
  is_covered BOOLEAN DEFAULT FALSE,
  is_beneficiary BOOLEAN DEFAULT FALSE,
  beneficiary_percentage NUMERIC(5,2) CHECK (beneficiary_percentage >= 0 AND beneficiary_percentage <= 100),
  ssn_last_four TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create family_member_policies table
CREATE TABLE IF NOT EXISTS family_member_policies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  family_member_id UUID REFERENCES family_members(id) ON DELETE CASCADE NOT NULL,
  policy_id UUID REFERENCES policies(id) ON DELETE CASCADE NOT NULL,
  coverage_type TEXT NOT NULL CHECK (coverage_type IN ('primary', 'dependent', 'beneficiary')),
  coverage_start_date DATE,
  coverage_end_date DATE,
  premium_contribution NUMERIC(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(family_member_id, policy_id, coverage_type)
);

-- Create wearable_devices table
CREATE TABLE IF NOT EXISTS wearable_devices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  device_type TEXT NOT NULL CHECK (device_type IN ('fitbit', 'apple_watch', 'garmin', 'samsung_health', 'whoop', 'oura', 'other')),
  device_name TEXT NOT NULL,
  device_id TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  last_sync_at TIMESTAMP WITH TIME ZONE,
  sync_frequency TEXT DEFAULT 'daily' CHECK (sync_frequency IN ('real_time', 'hourly', 'daily', 'manual')),
  permissions_granted JSONB DEFAULT '{"steps": true, "heart_rate": true, "sleep": true, "calories": true}'::JSONB,
  integration_token_encrypted TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create wearable_data_snapshots table
CREATE TABLE IF NOT EXISTS wearable_data_snapshots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  device_id UUID REFERENCES wearable_devices(id) ON DELETE CASCADE,
  snapshot_date DATE NOT NULL,
  metrics JSONB NOT NULL,
  data_quality_score NUMERIC(5,2) DEFAULT 100,
  processed_for_premium BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, device_id, snapshot_date)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_two_factor_auth_user_id ON two_factor_auth(user_id);
CREATE INDEX IF NOT EXISTS idx_two_factor_auth_enabled ON two_factor_auth(enabled);
CREATE INDEX IF NOT EXISTS idx_two_factor_attempts_user_id ON two_factor_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_two_factor_attempts_created_at ON two_factor_attempts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_family_members_primary_user ON family_members(primary_user_id);
CREATE INDEX IF NOT EXISTS idx_family_members_is_beneficiary ON family_members(is_beneficiary);
CREATE INDEX IF NOT EXISTS idx_family_member_policies_member ON family_member_policies(family_member_id);
CREATE INDEX IF NOT EXISTS idx_family_member_policies_policy ON family_member_policies(policy_id);
CREATE INDEX IF NOT EXISTS idx_wearable_devices_user ON wearable_devices(user_id);
CREATE INDEX IF NOT EXISTS idx_wearable_devices_active ON wearable_devices(is_active);
CREATE INDEX IF NOT EXISTS idx_wearable_data_user_date ON wearable_data_snapshots(user_id, snapshot_date DESC);
CREATE INDEX IF NOT EXISTS idx_wearable_data_processed ON wearable_data_snapshots(processed_for_premium);

-- GIN indexes for JSONB fields
CREATE INDEX IF NOT EXISTS idx_family_health_info_gin ON family_members USING GIN (health_information);
CREATE INDEX IF NOT EXISTS idx_wearable_permissions_gin ON wearable_devices USING GIN (permissions_granted);
CREATE INDEX IF NOT EXISTS idx_wearable_metrics_gin ON wearable_data_snapshots USING GIN (metrics);

-- Enable Row Level Security
ALTER TABLE two_factor_auth ENABLE ROW LEVEL SECURITY;
ALTER TABLE two_factor_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_member_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE wearable_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE wearable_data_snapshots ENABLE ROW LEVEL SECURITY;

-- RLS Policies for two_factor_auth
CREATE POLICY "Users can view their own 2FA settings"
  ON two_factor_auth FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own 2FA settings"
  ON two_factor_auth FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own 2FA settings"
  ON two_factor_auth FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for two_factor_attempts
CREATE POLICY "Users can view their own 2FA attempts"
  ON two_factor_attempts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert 2FA attempts"
  ON two_factor_attempts FOR INSERT
  WITH CHECK (true);

-- RLS Policies for family_members
CREATE POLICY "Users can view their family members"
  ON family_members FOR SELECT
  TO authenticated
  USING (auth.uid() = primary_user_id);

CREATE POLICY "Users can insert their family members"
  ON family_members FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = primary_user_id);

CREATE POLICY "Users can update their family members"
  ON family_members FOR UPDATE
  TO authenticated
  USING (auth.uid() = primary_user_id)
  WITH CHECK (auth.uid() = primary_user_id);

CREATE POLICY "Users can delete their family members"
  ON family_members FOR DELETE
  TO authenticated
  USING (auth.uid() = primary_user_id);

-- RLS Policies for family_member_policies
CREATE POLICY "Users can view policies for their family members"
  ON family_member_policies FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM family_members
      WHERE family_members.id = family_member_policies.family_member_id
      AND family_members.primary_user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage policies for their family members"
  ON family_member_policies FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM family_members
      WHERE family_members.id = family_member_policies.family_member_id
      AND family_members.primary_user_id = auth.uid()
    )
  );

-- RLS Policies for wearable_devices
CREATE POLICY "Users can manage their wearable devices"
  ON wearable_devices FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for wearable_data_snapshots
CREATE POLICY "Users can view their wearable data"
  ON wearable_data_snapshots FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert wearable data"
  ON wearable_data_snapshots FOR INSERT
  WITH CHECK (true);

CREATE POLICY "System can update wearable data"
  ON wearable_data_snapshots FOR UPDATE
  WITH CHECK (true);

-- Triggers for automatic timestamp updates
CREATE TRIGGER update_two_factor_auth_updated_at
  BEFORE UPDATE ON two_factor_auth
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_family_members_updated_at
  BEFORE UPDATE ON family_members
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_family_member_policies_updated_at
  BEFORE UPDATE ON family_member_policies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wearable_devices_updated_at
  BEFORE UPDATE ON wearable_devices
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to validate total beneficiary percentage
CREATE OR REPLACE FUNCTION validate_beneficiary_percentage()
RETURNS TRIGGER AS $$
DECLARE
  total_percentage NUMERIC;
BEGIN
  SELECT COALESCE(SUM(beneficiary_percentage), 0)
  INTO total_percentage
  FROM family_members
  WHERE primary_user_id = NEW.primary_user_id
  AND is_beneficiary = TRUE
  AND id != NEW.id;
  
  IF (total_percentage + COALESCE(NEW.beneficiary_percentage, 0)) > 100 THEN
    RAISE EXCEPTION 'Total beneficiary percentage cannot exceed 100%%';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_beneficiary_percentage
  BEFORE INSERT OR UPDATE ON family_members
  FOR EACH ROW
  WHEN (NEW.is_beneficiary = TRUE)
  EXECUTE FUNCTION validate_beneficiary_percentage();

-- Function to rate limit 2FA attempts
CREATE OR REPLACE FUNCTION check_2fa_rate_limit()
RETURNS TRIGGER AS $$
DECLARE
  recent_failures INTEGER;
BEGIN
  SELECT COUNT(*)
  INTO recent_failures
  FROM two_factor_attempts
  WHERE user_id = NEW.user_id
  AND success = FALSE
  AND created_at > NOW() - INTERVAL '15 minutes';
  
  IF recent_failures >= 5 THEN
    RAISE EXCEPTION 'Too many failed 2FA attempts. Please wait 15 minutes before trying again.';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_2fa_rate_limit
  BEFORE INSERT ON two_factor_attempts
  FOR EACH ROW
  WHEN (NEW.success = FALSE)
  EXECUTE FUNCTION check_2fa_rate_limit();
