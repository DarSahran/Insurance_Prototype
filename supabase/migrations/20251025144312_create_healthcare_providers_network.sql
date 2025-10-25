/*
  # Healthcare Providers Network

  1. New Tables
    - `healthcare_providers`
      - `id` (uuid, primary key)
      - `name` (text) - Doctor/Provider name
      - `qualification` (text) - MD, MBBS, etc.
      - `specialty` (text) - Cardiology, Orthopedics, etc.
      - `sub_specialties` (text[]) - Array of sub-specialties
      - `registration_number` (text) - Medical Council registration
      - `hospital_affiliation` (text)
      - `clinic_name` (text)
      - `address` (text)
      - `city` (text)
      - `state` (text)
      - `pincode` (text)
      - `phone` (text)
      - `email` (text)
      - `website` (text)
      - `consultation_fee` (decimal)
      - `experience_years` (integer)
      - `rating` (decimal) - Average rating
      - `total_reviews` (integer)
      - `languages` (text[]) - Languages spoken
      - `accepting_new_patients` (boolean)
      - `telemedicine_available` (boolean)
      - `emergency_services` (boolean)
      - `insurance_accepted` (boolean)
      - `available_days` (text[])
      - `available_hours` (text)
      - `latitude` (decimal)
      - `longitude` (decimal)
      - `verified` (boolean)
      - `verification_date` (date)
      - `profile_image_url` (text)
      - `awards` (jsonb)
      - `education` (jsonb)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `provider_reviews`
      - `id` (uuid, primary key)
      - `provider_id` (uuid, references healthcare_providers)
      - `user_id` (uuid, references auth.users)
      - `rating` (integer, 1-5)
      - `review_text` (text)
      - `visit_date` (date)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Public read access for providers
    - Authenticated users can add reviews
*/

-- Create healthcare_providers table
CREATE TABLE IF NOT EXISTS healthcare_providers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  qualification text NOT NULL,
  specialty text NOT NULL,
  sub_specialties text[] DEFAULT '{}',
  registration_number text,
  hospital_affiliation text,
  clinic_name text,
  address text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  pincode text,
  phone text NOT NULL,
  email text,
  website text,
  consultation_fee decimal(10, 2),
  experience_years integer NOT NULL,
  rating decimal(3, 2) DEFAULT 0,
  total_reviews integer DEFAULT 0,
  languages text[] DEFAULT '{}',
  accepting_new_patients boolean DEFAULT true,
  telemedicine_available boolean DEFAULT false,
  emergency_services boolean DEFAULT false,
  insurance_accepted boolean DEFAULT true,
  available_days text[] DEFAULT '{}',
  available_hours text,
  latitude decimal(10, 7),
  longitude decimal(10, 7),
  verified boolean DEFAULT false,
  verification_date date,
  profile_image_url text,
  awards jsonb DEFAULT '[]',
  education jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create provider_reviews table
CREATE TABLE IF NOT EXISTS provider_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid REFERENCES healthcare_providers(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text text,
  visit_date date,
  created_at timestamptz DEFAULT now(),
  UNIQUE(provider_id, user_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_providers_specialty ON healthcare_providers(specialty);
CREATE INDEX IF NOT EXISTS idx_providers_city ON healthcare_providers(city);
CREATE INDEX IF NOT EXISTS idx_providers_state ON healthcare_providers(state);
CREATE INDEX IF NOT EXISTS idx_providers_verified ON healthcare_providers(verified);
CREATE INDEX IF NOT EXISTS idx_providers_rating ON healthcare_providers(rating DESC);
CREATE INDEX IF NOT EXISTS idx_provider_reviews_provider_id ON provider_reviews(provider_id);

-- Enable Row Level Security
ALTER TABLE healthcare_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies for healthcare_providers (public read)
CREATE POLICY "Anyone can view verified providers"
  ON healthcare_providers FOR SELECT
  USING (verified = true);

CREATE POLICY "Admins can manage providers"
  ON healthcare_providers FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- RLS Policies for provider_reviews
CREATE POLICY "Anyone can view reviews"
  ON provider_reviews FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can add reviews"
  ON provider_reviews FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews"
  ON provider_reviews FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews"
  ON provider_reviews FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Add trigger for updated_at
DROP TRIGGER IF EXISTS update_healthcare_providers_updated_at ON healthcare_providers;
CREATE TRIGGER update_healthcare_providers_updated_at
  BEFORE UPDATE ON healthcare_providers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to update provider rating when reviews are added/updated
CREATE OR REPLACE FUNCTION update_provider_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE healthcare_providers
  SET 
    rating = (
      SELECT COALESCE(AVG(rating), 0)
      FROM provider_reviews
      WHERE provider_id = COALESCE(NEW.provider_id, OLD.provider_id)
    ),
    total_reviews = (
      SELECT COUNT(*)
      FROM provider_reviews
      WHERE provider_id = COALESCE(NEW.provider_id, OLD.provider_id)
    )
  WHERE id = COALESCE(NEW.provider_id, OLD.provider_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_provider_rating_trigger ON provider_reviews;
CREATE TRIGGER update_provider_rating_trigger
  AFTER INSERT OR UPDATE OR DELETE ON provider_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_provider_rating();