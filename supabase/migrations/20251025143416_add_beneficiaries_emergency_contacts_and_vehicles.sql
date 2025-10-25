/*
  # Add Beneficiaries, Emergency Contacts, and Vehicle Management

  1. New Tables
    - `beneficiaries` - Separate beneficiary tracking
    - `emergency_contacts` - Emergency contact information
    - `user_vehicles` - User vehicle information
    - `vehicle_policies` - Link vehicles to policies
    - `family_member_policies` - Link family members to policies

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data

  Note: family_members table already exists with primary_user_id column
*/

-- Create beneficiaries table
CREATE TABLE IF NOT EXISTS beneficiaries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  primary_user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  family_member_id uuid REFERENCES family_members(id) ON DELETE SET NULL,
  name text NOT NULL,
  relationship text NOT NULL,
  percentage integer DEFAULT 0 CHECK (percentage >= 0 AND percentage <= 100),
  policy_selection_id uuid REFERENCES policy_selections(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create emergency_contacts table
CREATE TABLE IF NOT EXISTS emergency_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  primary_user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  family_member_id uuid REFERENCES family_members(id) ON DELETE SET NULL,
  name text NOT NULL,
  relationship text NOT NULL,
  phone text NOT NULL,
  email text,
  is_primary boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user_vehicles table
CREATE TABLE IF NOT EXISTS user_vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  vehicle_type text NOT NULL,
  make text NOT NULL,
  model text NOT NULL,
  year integer,
  registration_number text NOT NULL,
  chassis_number text,
  engine_number text,
  purchase_date date,
  current_value decimal(12, 2),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Drop the old family_member_policies table if it exists
DROP TABLE IF EXISTS family_member_policies CASCADE;

-- Create new family_member_policies junction table
CREATE TABLE IF NOT EXISTS family_member_policies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  family_member_id uuid REFERENCES family_members(id) ON DELETE CASCADE NOT NULL,
  policy_selection_id uuid REFERENCES policy_selections(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(family_member_id, policy_selection_id)
);

-- Create vehicle_policies junction table
CREATE TABLE IF NOT EXISTS vehicle_policies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id uuid REFERENCES user_vehicles(id) ON DELETE CASCADE NOT NULL,
  policy_selection_id uuid REFERENCES policy_selections(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(vehicle_id, policy_selection_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_beneficiaries_primary_user_id ON beneficiaries(primary_user_id);
CREATE INDEX IF NOT EXISTS idx_emergency_contacts_primary_user_id ON emergency_contacts(primary_user_id);
CREATE INDEX IF NOT EXISTS idx_user_vehicles_user_id ON user_vehicles(user_id);
CREATE INDEX IF NOT EXISTS idx_family_member_policies_family_member_id ON family_member_policies(family_member_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_policies_vehicle_id ON vehicle_policies(vehicle_id);

-- Enable Row Level Security
ALTER TABLE beneficiaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_member_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_policies ENABLE ROW LEVEL SECURITY;

-- RLS Policies for beneficiaries
CREATE POLICY "Users can view own beneficiaries"
  ON beneficiaries FOR SELECT
  TO authenticated
  USING (auth.uid() = primary_user_id);

CREATE POLICY "Users can insert own beneficiaries"
  ON beneficiaries FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = primary_user_id);

CREATE POLICY "Users can update own beneficiaries"
  ON beneficiaries FOR UPDATE
  TO authenticated
  USING (auth.uid() = primary_user_id)
  WITH CHECK (auth.uid() = primary_user_id);

CREATE POLICY "Users can delete own beneficiaries"
  ON beneficiaries FOR DELETE
  TO authenticated
  USING (auth.uid() = primary_user_id);

-- RLS Policies for emergency_contacts
CREATE POLICY "Users can view own emergency contacts"
  ON emergency_contacts FOR SELECT
  TO authenticated
  USING (auth.uid() = primary_user_id);

CREATE POLICY "Users can insert own emergency contacts"
  ON emergency_contacts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = primary_user_id);

CREATE POLICY "Users can update own emergency contacts"
  ON emergency_contacts FOR UPDATE
  TO authenticated
  USING (auth.uid() = primary_user_id)
  WITH CHECK (auth.uid() = primary_user_id);

CREATE POLICY "Users can delete own emergency contacts"
  ON emergency_contacts FOR DELETE
  TO authenticated
  USING (auth.uid() = primary_user_id);

-- RLS Policies for user_vehicles
CREATE POLICY "Users can view own vehicles"
  ON user_vehicles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own vehicles"
  ON user_vehicles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own vehicles"
  ON user_vehicles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own vehicles"
  ON user_vehicles FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for family_member_policies
CREATE POLICY "Users can view own family member policies"
  ON family_member_policies FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM family_members
      WHERE family_members.id = family_member_policies.family_member_id
      AND family_members.primary_user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own family member policies"
  ON family_member_policies FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM family_members
      WHERE family_members.id = family_member_policies.family_member_id
      AND family_members.primary_user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own family member policies"
  ON family_member_policies FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM family_members
      WHERE family_members.id = family_member_policies.family_member_id
      AND family_members.primary_user_id = auth.uid()
    )
  );

-- RLS Policies for vehicle_policies
CREATE POLICY "Users can view own vehicle policies"
  ON vehicle_policies FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_vehicles
      WHERE user_vehicles.id = vehicle_policies.vehicle_id
      AND user_vehicles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own vehicle policies"
  ON vehicle_policies FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_vehicles
      WHERE user_vehicles.id = vehicle_policies.vehicle_id
      AND user_vehicles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own vehicle policies"
  ON vehicle_policies FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_vehicles
      WHERE user_vehicles.id = vehicle_policies.vehicle_id
      AND user_vehicles.user_id = auth.uid()
    )
  );

-- Add triggers for updated_at columns
DROP TRIGGER IF EXISTS update_beneficiaries_updated_at ON beneficiaries;
CREATE TRIGGER update_beneficiaries_updated_at
  BEFORE UPDATE ON beneficiaries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_emergency_contacts_updated_at ON emergency_contacts;
CREATE TRIGGER update_emergency_contacts_updated_at
  BEFORE UPDATE ON emergency_contacts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_vehicles_updated_at ON user_vehicles;
CREATE TRIGGER update_user_vehicles_updated_at
  BEFORE UPDATE ON user_vehicles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();