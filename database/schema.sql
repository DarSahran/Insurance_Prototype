-- Enhanced Insurance Prototype Database Schema
-- Updated to support comprehensive questionnaire data collection

-- Create user_profiles table with enhanced fields
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    email TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    full_name TEXT,
    phone TEXT,
    date_of_birth DATE,
    gender TEXT,
    address JSONB,
    occupation TEXT,
    education_level TEXT,
    location TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced insurance_questionnaires table
CREATE TABLE IF NOT EXISTS insurance_questionnaires (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    
    -- Demographics section
    demographics JSONB DEFAULT '{}'::JSONB,
    
    -- Health section with detailed tracking
    health JSONB DEFAULT '{}'::JSONB,
    
    -- Lifestyle section with comprehensive metrics
    lifestyle JSONB DEFAULT '{}'::JSONB,
    
    -- Financial section with coverage preferences
    financial JSONB DEFAULT '{}'::JSONB,
    
    -- AI Analysis results
    ai_analysis JSONB DEFAULT '{}'::JSONB,
    
    -- Calculated values
    risk_score INTEGER,
    premium_estimate DECIMAL(10,2),
    confidence_score DECIMAL(5,2),
    
    -- Questionnaire metadata
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'completed', 'approved', 'rejected', 'pending_review')),
    completion_percentage INTEGER DEFAULT 0,
    processing_time_seconds DECIMAL(10,3),
    
    -- Version tracking for questionnaire updates
    version INTEGER DEFAULT 1,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Table for tracking questionnaire sections completion
CREATE TABLE IF NOT EXISTS questionnaire_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    questionnaire_id UUID REFERENCES insurance_questionnaires(id) ON DELETE CASCADE NOT NULL,
    section_name TEXT NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    completion_time TIMESTAMP WITH TIME ZONE,
    data_snapshot JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for storing detailed risk factor analysis
CREATE TABLE IF NOT EXISTS risk_factors (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    questionnaire_id UUID REFERENCES insurance_questionnaires(id) ON DELETE CASCADE NOT NULL,
    factor_name TEXT NOT NULL,
    factor_category TEXT NOT NULL, -- 'demographics', 'health', 'lifestyle', 'financial'
    impact_score INTEGER, -- Can be positive or negative
    confidence DECIMAL(5,2),
    description TEXT,
    recommendation TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for AI model predictions and explanations
CREATE TABLE IF NOT EXISTS ai_predictions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    questionnaire_id UUID REFERENCES insurance_questionnaires(id) ON DELETE CASCADE NOT NULL,
    model_name TEXT NOT NULL,
    model_version TEXT,
    prediction_type TEXT NOT NULL, -- 'risk_score', 'premium_estimate', 'classification'
    predicted_value DECIMAL(15,6),
    confidence_score DECIMAL(5,2),
    shap_values JSONB, -- Store SHAP explanations
    feature_importance JSONB,
    bias_check_results JSONB,
    processing_time_ms INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for storing user document uploads
CREATE TABLE IF NOT EXISTS user_documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    questionnaire_id UUID REFERENCES insurance_questionnaires(id) ON DELETE CASCADE,
    document_type TEXT NOT NULL, -- 'medical_record', 'id_verification', 'income_proof', etc.
    file_name TEXT NOT NULL,
    file_size INTEGER,
    file_path TEXT,
    upload_status TEXT DEFAULT 'pending' CHECK (upload_status IN ('pending', 'uploaded', 'processed', 'failed')),
    processed_data JSONB, -- Extracted information from documents
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_insurance_questionnaires_user_id ON insurance_questionnaires(user_id);
CREATE INDEX IF NOT EXISTS idx_insurance_questionnaires_status ON insurance_questionnaires(status);
CREATE INDEX IF NOT EXISTS idx_insurance_questionnaires_created_at ON insurance_questionnaires(created_at);
CREATE INDEX IF NOT EXISTS idx_questionnaire_progress_questionnaire_id ON questionnaire_progress(questionnaire_id);
CREATE INDEX IF NOT EXISTS idx_questionnaire_progress_section ON questionnaire_progress(section_name);
CREATE INDEX IF NOT EXISTS idx_risk_factors_questionnaire_id ON risk_factors(questionnaire_id);
CREATE INDEX IF NOT EXISTS idx_risk_factors_category ON risk_factors(factor_category);
CREATE INDEX IF NOT EXISTS idx_ai_predictions_questionnaire_id ON ai_predictions(questionnaire_id);
CREATE INDEX IF NOT EXISTS idx_ai_predictions_model ON ai_predictions(model_name);
CREATE INDEX IF NOT EXISTS idx_user_documents_user_id ON user_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_user_documents_questionnaire_id ON user_documents(questionnaire_id);

-- GIN indexes for JSONB fields for efficient JSON queries
CREATE INDEX IF NOT EXISTS idx_questionnaires_demographics_gin ON insurance_questionnaires USING GIN (demographics);
CREATE INDEX IF NOT EXISTS idx_questionnaires_health_gin ON insurance_questionnaires USING GIN (health);
CREATE INDEX IF NOT EXISTS idx_questionnaires_lifestyle_gin ON insurance_questionnaires USING GIN (lifestyle);
CREATE INDEX IF NOT EXISTS idx_questionnaires_financial_gin ON insurance_questionnaires USING GIN (financial);
CREATE INDEX IF NOT EXISTS idx_questionnaires_ai_analysis_gin ON insurance_questionnaires USING GIN (ai_analysis);

-- Enable Row Level Security (RLS)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE insurance_questionnaires ENABLE ROW LEVEL SECURITY;
ALTER TABLE questionnaire_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE risk_factors ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_documents ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_profiles
CREATE POLICY "Users can view their own profile" 
    ON user_profiles FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
    ON user_profiles FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
    ON user_profiles FOR UPDATE 
    USING (auth.uid() = user_id);

-- Create RLS policies for insurance_questionnaires
CREATE POLICY "Users can view their own questionnaires" 
    ON insurance_questionnaires FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own questionnaires" 
    ON insurance_questionnaires FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own questionnaires" 
    ON insurance_questionnaires FOR UPDATE 
    USING (auth.uid() = user_id);

-- Create RLS policies for questionnaire_progress
CREATE POLICY "Users can view their own questionnaire progress" 
    ON questionnaire_progress FOR SELECT 
    USING (auth.uid() = (SELECT user_id FROM insurance_questionnaires WHERE id = questionnaire_id));

CREATE POLICY "Users can insert their own questionnaire progress" 
    ON questionnaire_progress FOR INSERT 
    WITH CHECK (auth.uid() = (SELECT user_id FROM insurance_questionnaires WHERE id = questionnaire_id));

CREATE POLICY "Users can update their own questionnaire progress" 
    ON questionnaire_progress FOR UPDATE 
    USING (auth.uid() = (SELECT user_id FROM insurance_questionnaires WHERE id = questionnaire_id));

-- Create RLS policies for risk_factors
CREATE POLICY "Users can view their own risk factors" 
    ON risk_factors FOR SELECT 
    USING (auth.uid() = (SELECT user_id FROM insurance_questionnaires WHERE id = questionnaire_id));

CREATE POLICY "System can insert risk factors" 
    ON risk_factors FOR INSERT 
    WITH CHECK (true); -- Allow system to insert, but RLS will restrict viewing

-- Create RLS policies for ai_predictions
CREATE POLICY "Users can view their own AI predictions" 
    ON ai_predictions FOR SELECT 
    USING (auth.uid() = (SELECT user_id FROM insurance_questionnaires WHERE id = questionnaire_id));

CREATE POLICY "System can insert AI predictions" 
    ON ai_predictions FOR INSERT 
    WITH CHECK (true); -- Allow system to insert, but RLS will restrict viewing

-- Create RLS policies for user_documents
CREATE POLICY "Users can view their own documents" 
    ON user_documents FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own documents" 
    ON user_documents FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own documents" 
    ON user_documents FOR UPDATE 
    USING (auth.uid() = user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON user_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_insurance_questionnaires_updated_at 
    BEFORE UPDATE ON insurance_questionnaires 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_questionnaire_progress_updated_at 
    BEFORE UPDATE ON questionnaire_progress 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_documents_updated_at 
    BEFORE UPDATE ON user_documents 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate completion percentage
CREATE OR REPLACE FUNCTION calculate_completion_percentage(questionnaire_data JSONB)
RETURNS INTEGER AS $$
DECLARE
    total_fields INTEGER := 0;
    completed_fields INTEGER := 0;
    completion_percentage INTEGER;
BEGIN
    -- Count demographics fields
    IF questionnaire_data ? 'demographics' THEN
        total_fields := total_fields + 6; -- fullName, dateOfBirth, gender, occupation, location, educationLevel
        IF (questionnaire_data->'demographics') ? 'fullName' AND 
           (questionnaire_data->'demographics'->>'fullName') != '' THEN 
            completed_fields := completed_fields + 1; 
        END IF;
        IF (questionnaire_data->'demographics') ? 'dateOfBirth' AND 
           (questionnaire_data->'demographics'->>'dateOfBirth') != '' THEN 
            completed_fields := completed_fields + 1; 
        END IF;
        IF (questionnaire_data->'demographics') ? 'gender' AND 
           (questionnaire_data->'demographics'->>'gender') != '' THEN 
            completed_fields := completed_fields + 1; 
        END IF;
        IF (questionnaire_data->'demographics') ? 'occupation' AND 
           (questionnaire_data->'demographics'->>'occupation') != '' THEN 
            completed_fields := completed_fields + 1; 
        END IF;
        IF (questionnaire_data->'demographics') ? 'location' AND 
           (questionnaire_data->'demographics'->>'location') != '' THEN 
            completed_fields := completed_fields + 1; 
        END IF;
        IF (questionnaire_data->'demographics') ? 'educationLevel' AND 
           (questionnaire_data->'demographics'->>'educationLevel') != '' THEN 
            completed_fields := completed_fields + 1; 
        END IF;
    END IF;
    
    -- Count health fields
    IF questionnaire_data ? 'health' THEN
        total_fields := total_fields + 5; -- height, weight, smokingStatus, alcoholConsumption, medicalConditions
        IF (questionnaire_data->'health') ? 'height' AND 
           (questionnaire_data->'health'->>'height') != '' THEN 
            completed_fields := completed_fields + 1; 
        END IF;
        IF (questionnaire_data->'health') ? 'weight' AND 
           (questionnaire_data->'health'->>'weight') != '' THEN 
            completed_fields := completed_fields + 1; 
        END IF;
        IF (questionnaire_data->'health') ? 'smokingStatus' AND 
           (questionnaire_data->'health'->>'smokingStatus') != '' THEN 
            completed_fields := completed_fields + 1; 
        END IF;
        IF (questionnaire_data->'health') ? 'alcoholConsumption' AND 
           (questionnaire_data->'health'->>'alcoholConsumption') != '' THEN 
            completed_fields := completed_fields + 1; 
        END IF;
        IF (questionnaire_data->'health') ? 'medicalConditions' THEN 
            completed_fields := completed_fields + 1; 
        END IF;
    END IF;
    
    -- Count lifestyle fields
    IF questionnaire_data ? 'lifestyle' THEN
        total_fields := total_fields + 4; -- exerciseFrequency, sleepHours, stressLevel, dietAssessment
        IF (questionnaire_data->'lifestyle') ? 'exerciseFrequency' THEN 
            completed_fields := completed_fields + 1; 
        END IF;
        IF (questionnaire_data->'lifestyle') ? 'sleepHours' THEN 
            completed_fields := completed_fields + 1; 
        END IF;
        IF (questionnaire_data->'lifestyle') ? 'stressLevel' THEN 
            completed_fields := completed_fields + 1; 
        END IF;
        IF (questionnaire_data->'lifestyle') ? 'dietAssessment' THEN 
            completed_fields := completed_fields + 1; 
        END IF;
    END IF;
    
    -- Count financial fields
    IF questionnaire_data ? 'financial' THEN
        total_fields := total_fields + 4; -- coverageAmount, policyTerm, annualIncome, monthlyBudget
        IF (questionnaire_data->'financial') ? 'coverageAmount' THEN 
            completed_fields := completed_fields + 1; 
        END IF;
        IF (questionnaire_data->'financial') ? 'policyTerm' AND 
           (questionnaire_data->'financial'->>'policyTerm') != '' THEN 
            completed_fields := completed_fields + 1; 
        END IF;
        IF (questionnaire_data->'financial') ? 'annualIncome' AND 
           (questionnaire_data->'financial'->>'annualIncome') != '' THEN 
            completed_fields := completed_fields + 1; 
        END IF;
        IF (questionnaire_data->'financial') ? 'monthlyBudget' THEN 
            completed_fields := completed_fields + 1; 
        END IF;
    END IF;
    
    -- Calculate percentage
    IF total_fields > 0 THEN
        completion_percentage := (completed_fields * 100) / total_fields;
    ELSE
        completion_percentage := 0;
    END IF;
    
    RETURN completion_percentage;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update completion percentage
CREATE OR REPLACE FUNCTION update_completion_percentage()
RETURNS TRIGGER AS $$
DECLARE
    questionnaire_data JSONB;
    completion_pct INTEGER;
BEGIN
    -- Combine all questionnaire sections into one JSONB
    questionnaire_data := jsonb_build_object(
        'demographics', COALESCE(NEW.demographics, '{}'::JSONB),
        'health', COALESCE(NEW.health, '{}'::JSONB),
        'lifestyle', COALESCE(NEW.lifestyle, '{}'::JSONB),
        'financial', COALESCE(NEW.financial, '{}'::JSONB)
    );
    
    -- Calculate completion percentage
    completion_pct := calculate_completion_percentage(questionnaire_data);
    
    -- Update the completion percentage
    NEW.completion_percentage := completion_pct;
    
    -- Set completed_at if 100% complete and not already set
    IF completion_pct = 100 AND NEW.completed_at IS NULL THEN
        NEW.completed_at := NOW();
        NEW.status := 'completed';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_questionnaire_completion 
    BEFORE INSERT OR UPDATE ON insurance_questionnaires 
    FOR EACH ROW EXECUTE FUNCTION update_completion_percentage();

-- Sample views for analytics (optional)
CREATE OR REPLACE VIEW questionnaire_analytics AS
SELECT 
    DATE_TRUNC('day', created_at) as date,
    COUNT(*) as total_questionnaires,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_questionnaires,
    AVG(completion_percentage) as avg_completion_percentage,
    AVG(risk_score) as avg_risk_score,
    AVG(premium_estimate) as avg_premium_estimate
FROM insurance_questionnaires 
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY date DESC;

-- Insert sample data for testing (commented out for production)
/*
-- Sample user profile
INSERT INTO user_profiles (user_id, email, first_name, last_name, full_name) 
VALUES 
    ('00000000-0000-0000-0000-000000000001'::UUID, 'test@example.com', 'John', 'Doe', 'John Doe'),
    ('00000000-0000-0000-0000-000000000002'::UUID, 'jane@example.com', 'Jane', 'Smith', 'Jane Smith');

-- Sample questionnaire data
INSERT INTO insurance_questionnaires (
    user_id, 
    demographics, 
    health, 
    lifestyle, 
    financial,
    status
) VALUES (
    '00000000-0000-0000-0000-000000000001'::UUID,
    '{"fullName": "John Doe", "dateOfBirth": "1990-05-15", "gender": "male", "occupation": "Software Engineer", "location": "San Francisco, CA", "educationLevel": "Bachelor''s Degree"}',
    '{"height": "175", "weight": "70", "smokingStatus": "never", "alcoholConsumption": "occasionally", "medicalConditions": []}',
    '{"exerciseFrequency": 4, "sleepHours": 7.5, "stressLevel": 4, "dietAssessment": {"fruits_vegetables": "daily", "processed_foods": "rarely"}}',
    '{"coverageAmount": 500000, "policyTerm": "20", "annualIncome": "100000", "monthlyBudget": 200}',
    'draft'
);
*/
