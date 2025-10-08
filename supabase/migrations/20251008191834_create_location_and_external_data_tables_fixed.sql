/*
  # Location Tracking and External Data Integration Schema

  ## New Tables Created:
  
  ### 1. `user_locations`
  Stores user location data for insurance risk assessment
  
  ### 2. `weather_data`
  Stores weather information for location-based risk assessment
  
  ### 3. `regional_insurance_rates`
  Stores location-based insurance rate multipliers and factors
  
  ### 4. `ocr_documents`
  Stores OCR-processed documents and extracted data
  
  ### 5. `insurance_recommendations_cache`
  Caches web-scraped insurance data for performance
  
  ### 6. `weather_history`
  Historical weather patterns for risk analysis
  
  ### 7. `geolocation_cache`
  Caches reverse geocoding results to reduce API calls

  ## Security:
  - Row Level Security enabled on all tables
  - Users can only access their own data
  - Geolocation cache is shared across users for efficiency
  - Regional rates are publicly readable
*/

-- user_locations table
CREATE TABLE IF NOT EXISTS user_locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  latitude decimal(10, 8) NOT NULL,
  longitude decimal(11, 8) NOT NULL,
  city text,
  state text,
  country text,
  postal_code text,
  address_formatted text,
  location_type text DEFAULT 'manual' CHECK (location_type IN ('gps', 'manual', 'ip-based')),
  accuracy_meters decimal(10, 2),
  is_primary boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own locations"
  ON user_locations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own locations"
  ON user_locations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own locations"
  ON user_locations FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own locations"
  ON user_locations FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- weather_data table
CREATE TABLE IF NOT EXISTS weather_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id uuid REFERENCES user_locations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  temperature decimal(5, 2),
  humidity decimal(5, 2),
  weather_condition text,
  wind_speed decimal(6, 2),
  precipitation decimal(6, 2),
  severe_weather_alerts jsonb DEFAULT '[]'::jsonb,
  air_quality_index integer,
  uv_index integer,
  recorded_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE weather_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own weather data"
  ON weather_data FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own weather data"
  ON weather_data FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- regional_insurance_rates table (publicly readable)
CREATE TABLE IF NOT EXISTS regional_insurance_rates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  region_type text NOT NULL CHECK (region_type IN ('city', 'state', 'country', 'postal')),
  region_name text NOT NULL,
  region_code text,
  policy_type text NOT NULL,
  base_rate_multiplier decimal(5, 4) DEFAULT 1.0,
  risk_factors jsonb DEFAULT '{}'::jsonb,
  crime_rate_index decimal(5, 2),
  natural_disaster_risk decimal(3, 2),
  healthcare_access_score decimal(3, 2),
  cost_of_living_index decimal(6, 2),
  updated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE regional_insurance_rates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view regional rates"
  ON regional_insurance_rates FOR SELECT
  TO authenticated
  USING (true);

-- ocr_documents table
CREATE TABLE IF NOT EXISTS ocr_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  document_type text NOT NULL CHECK (document_type IN ('medical', 'financial', 'identification', 'insurance', 'other')),
  file_name text NOT NULL,
  file_path text,
  file_size bigint,
  mime_type text,
  ocr_text text,
  ocr_confidence decimal(3, 2),
  structured_data jsonb DEFAULT '{}'::jsonb,
  processing_status text DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed')),
  error_message text,
  google_vision_response jsonb,
  manual_verification_required boolean DEFAULT false,
  verified_at timestamptz,
  verified_by uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE ocr_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own documents"
  ON ocr_documents FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own documents"
  ON ocr_documents FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own documents"
  ON ocr_documents FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own documents"
  ON ocr_documents FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- insurance_recommendations_cache table (publicly readable)
CREATE TABLE IF NOT EXISTS insurance_recommendations_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_name text NOT NULL,
  provider_rating decimal(2, 1),
  policy_type text NOT NULL,
  coverage_amount bigint NOT NULL,
  monthly_premium decimal(10, 2) NOT NULL,
  annual_premium decimal(10, 2),
  policy_features jsonb DEFAULT '[]'::jsonb,
  eligibility_criteria jsonb DEFAULT '{}'::jsonb,
  region_restrictions text[] DEFAULT ARRAY[]::text[],
  source_url text,
  scrape_timestamp timestamptz DEFAULT now(),
  data_freshness_hours integer DEFAULT 168,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE insurance_recommendations_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view insurance recommendations"
  ON insurance_recommendations_cache FOR SELECT
  TO authenticated
  USING (true);

-- weather_history table
CREATE TABLE IF NOT EXISTS weather_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id uuid REFERENCES user_locations(id) ON DELETE CASCADE,
  year integer NOT NULL,
  month integer NOT NULL CHECK (month >= 1 AND month <= 12),
  avg_temperature decimal(5, 2),
  total_precipitation decimal(6, 2),
  severe_events_count integer DEFAULT 0,
  severe_events jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  UNIQUE(location_id, year, month)
);

ALTER TABLE weather_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view weather history for their locations"
  ON weather_history FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_locations
      WHERE user_locations.id = weather_history.location_id
      AND user_locations.user_id = auth.uid()
    )
  );

-- geolocation_cache table (shared cache)
CREATE TABLE IF NOT EXISTS geolocation_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  latitude decimal(10, 8) NOT NULL,
  longitude decimal(11, 8) NOT NULL,
  address_components jsonb,
  formatted_address text,
  place_id text,
  api_response jsonb,
  cache_hits integer DEFAULT 0,
  expires_at timestamptz DEFAULT (now() + interval '30 days'),
  created_at timestamptz DEFAULT now(),
  UNIQUE(latitude, longitude)
);

ALTER TABLE geolocation_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view geolocation cache"
  ON geolocation_cache FOR SELECT
  TO authenticated
  USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_locations_user_id ON user_locations(user_id);
CREATE INDEX IF NOT EXISTS idx_weather_data_location_id ON weather_data(location_id);
CREATE INDEX IF NOT EXISTS idx_weather_data_recorded_at ON weather_data(recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_regional_rates_region ON regional_insurance_rates(region_type, region_code);
CREATE INDEX IF NOT EXISTS idx_regional_rates_policy_type ON regional_insurance_rates(policy_type);
CREATE INDEX IF NOT EXISTS idx_ocr_documents_user_id ON ocr_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_ocr_documents_status ON ocr_documents(processing_status);
CREATE INDEX IF NOT EXISTS idx_insurance_cache_policy_type ON insurance_recommendations_cache(policy_type);
CREATE INDEX IF NOT EXISTS idx_weather_history_location ON weather_history(location_id, year, month);
CREATE INDEX IF NOT EXISTS idx_geolocation_cache_coords ON geolocation_cache(latitude, longitude);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_user_locations_updated_at') THEN
    CREATE TRIGGER update_user_locations_updated_at BEFORE UPDATE ON user_locations
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_regional_rates_updated_at') THEN
    CREATE TRIGGER update_regional_rates_updated_at BEFORE UPDATE ON regional_insurance_rates
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_ocr_documents_updated_at') THEN
    CREATE TRIGGER update_ocr_documents_updated_at BEFORE UPDATE ON ocr_documents
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_insurance_cache_updated_at') THEN
    CREATE TRIGGER update_insurance_cache_updated_at BEFORE UPDATE ON insurance_recommendations_cache
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;
