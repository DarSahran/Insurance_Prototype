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

-- ====================================================================================
-- BUSINESS INTELLIGENCE AND OPERATIONAL EXCELLENCE TABLES (Phase 1 Implementation)
-- ====================================================================================

-- Table for tracking business KPIs and performance metrics
CREATE TABLE IF NOT EXISTS underwriting_metrics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    metric_name TEXT NOT NULL,
    metric_value DECIMAL(15,6) NOT NULL,
    metric_date DATE NOT NULL DEFAULT CURRENT_DATE,
    benchmark_value DECIMAL(15,6),
    variance_percentage DECIMAL(8,3),
    trend_direction TEXT CHECK (trend_direction IN ('up', 'down', 'stable', 'unknown')) DEFAULT 'unknown',
    business_unit TEXT DEFAULT 'underwriting',
    metric_category TEXT NOT NULL, -- 'efficiency', 'financial', 'customer', 'risk'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for storing and versioning ML model configurations
CREATE TABLE IF NOT EXISTS risk_models (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    model_name TEXT NOT NULL,
    model_version TEXT NOT NULL,
    model_type TEXT NOT NULL, -- 'risk_assessment', 'premium_calculation', 'fraud_detection'
    training_date TIMESTAMP WITH TIME ZONE NOT NULL,
    accuracy_score DECIMAL(5,4),
    precision_score DECIMAL(5,4),
    recall_score DECIMAL(5,4),
    f1_score DECIMAL(5,4),
    feature_weights JSONB,
    bias_metrics JSONB,
    deployment_status TEXT DEFAULT 'development' CHECK (deployment_status IN ('development', 'testing', 'production', 'deprecated')),
    performance_threshold DECIMAL(5,4) DEFAULT 0.75,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(model_name, model_version)
);

-- Table for tracking market rates and competitor analysis
CREATE TABLE IF NOT EXISTS competitive_analysis (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    competitor_id TEXT NOT NULL,
    competitor_name TEXT NOT NULL,
    product_type TEXT NOT NULL, -- 'life', 'health', 'disability', 'term_life'
    premium_range_min DECIMAL(10,2),
    premium_range_max DECIMAL(10,2),
    coverage_amount DECIMAL(15,2),
    coverage_details JSONB,
    market_share DECIMAL(5,2),
    customer_rating DECIMAL(3,2),
    analysis_date DATE NOT NULL DEFAULT CURRENT_DATE,
    data_source TEXT, -- 'web_scraping', 'api', 'manual', 'third_party'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comprehensive audit trail for all system operations
CREATE TABLE IF NOT EXISTS audit_trail (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id),
    action_type TEXT NOT NULL, -- 'create', 'update', 'delete', 'view', 'login', 'logout'
    table_affected TEXT,
    record_id TEXT,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    session_id TEXT,
    compliance_flags JSONB, -- GDPR, HIPAA, SOX flags
    risk_level TEXT DEFAULT 'low' CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- System performance monitoring
CREATE TABLE IF NOT EXISTS system_performance (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    endpoint TEXT,
    http_method TEXT,
    response_time_ms INTEGER,
    status_code INTEGER,
    error_count INTEGER DEFAULT 0,
    user_count INTEGER DEFAULT 0,
    memory_usage_mb DECIMAL(10,2),
    cpu_usage_percent DECIMAL(5,2),
    database_connections INTEGER,
    alert_triggered BOOLEAN DEFAULT FALSE,
    alert_details JSONB
);

-- Dynamic business rules management
CREATE TABLE IF NOT EXISTS business_rules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    rule_id TEXT UNIQUE NOT NULL,
    rule_name TEXT NOT NULL,
    rule_category TEXT NOT NULL, -- 'underwriting', 'pricing', 'compliance', 'fraud'
    condition_logic JSONB NOT NULL, -- JSON representation of rule conditions
    action_logic JSONB NOT NULL, -- JSON representation of actions to take
    priority INTEGER DEFAULT 1,
    active_status BOOLEAN DEFAULT TRUE,
    effective_date DATE NOT NULL DEFAULT CURRENT_DATE,
    expiry_date DATE,
    created_by UUID REFERENCES auth.users(id),
    approved_by UUID REFERENCES auth.users(id),
    version INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Store AI predictions and recommendations
CREATE TABLE IF NOT EXISTS predictive_insights (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    insight_id TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES auth.users(id),
    questionnaire_id UUID REFERENCES insurance_questionnaires(id),
    insight_type TEXT NOT NULL, -- 'churn_risk', 'upsell_opportunity', 'health_trend', 'fraud_alert'
    prediction_data JSONB NOT NULL,
    confidence_score DECIMAL(5,4) NOT NULL,
    recommended_action TEXT,
    business_impact JSONB, -- Expected revenue, cost savings, risk reduction
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'acted_upon', 'dismissed', 'expired')),
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- External market and demographic data integration
CREATE TABLE IF NOT EXISTS market_data (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    data_source TEXT NOT NULL, -- 'census', 'economic_indicators', 'health_trends', 'insurance_industry'
    data_type TEXT NOT NULL,
    data_value JSONB NOT NULL,
    geography TEXT, -- 'US', 'CA', 'NY', 'county_12345', etc.
    time_period TEXT, -- 'Q1_2024', '2024', 'monthly_2024_01'
    reliability_score DECIMAL(3,2) DEFAULT 1.0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    next_update_due TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ====================================================================================
-- INSURANCE BUSINESS LOGIC TABLES (Production Requirements)
-- ====================================================================================

-- Insurance policies management
CREATE TABLE IF NOT EXISTS policies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    policy_number TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    questionnaire_id UUID REFERENCES insurance_questionnaires(id),
    policy_type TEXT NOT NULL, -- 'term_life', 'whole_life', 'disability', 'health'
    coverage_amount DECIMAL(15,2) NOT NULL,
    premium_amount DECIMAL(10,2) NOT NULL,
    premium_frequency TEXT DEFAULT 'monthly' CHECK (premium_frequency IN ('monthly', 'quarterly', 'semi_annual', 'annual')),
    policy_term_years INTEGER,
    effective_date DATE NOT NULL,
    expiry_date DATE,
    status TEXT DEFAULT 'active' CHECK (status IN ('pending', 'active', 'suspended', 'cancelled', 'expired', 'lapsed')),
    beneficiaries JSONB,
    underwriter_id UUID REFERENCES auth.users(id),
    underwriting_notes TEXT,
    risk_rating TEXT,
    deductible_amount DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Claims management
CREATE TABLE IF NOT EXISTS claims (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    claim_number TEXT UNIQUE NOT NULL,
    policy_id UUID REFERENCES policies(id) NOT NULL,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    claim_type TEXT NOT NULL, -- 'death_benefit', 'disability', 'medical', 'accident'
    claim_amount DECIMAL(15,2) NOT NULL,
    submitted_amount DECIMAL(15,2),
    approved_amount DECIMAL(15,2),
    claim_date DATE NOT NULL,
    incident_date DATE NOT NULL,
    description TEXT NOT NULL,
    status TEXT DEFAULT 'submitted' CHECK (status IN ('submitted', 'under_review', 'investigating', 'approved', 'denied', 'paid', 'closed')),
    adjuster_id UUID REFERENCES auth.users(id),
    adjuster_notes TEXT,
    supporting_documents JSONB,
    fraud_score DECIMAL(5,4),
    processing_time_days INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Health tracking for dynamic premium adjustments
CREATE TABLE IF NOT EXISTS health_tracking (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    policy_id UUID REFERENCES policies(id),
    tracking_date DATE NOT NULL DEFAULT CURRENT_DATE,
    data_source TEXT NOT NULL, -- 'wearable', 'manual', 'medical_exam', 'lab_results'
    health_metrics JSONB NOT NULL, -- steps, heart_rate, sleep, weight, blood_pressure, etc.
    improvement_score DECIMAL(5,2), -- Calculated improvement from baseline
    premium_adjustment_eligible BOOLEAN DEFAULT FALSE,
    adjustment_percentage DECIMAL(5,2), -- Positive for discounts, negative for increases
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment processing and billing
CREATE TABLE IF NOT EXISTS payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    payment_id TEXT UNIQUE NOT NULL,
    policy_id UUID REFERENCES policies(id) NOT NULL,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_method TEXT NOT NULL, -- 'card', 'bank_transfer', 'check', 'auto_debit'
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled')),
    stripe_payment_intent_id TEXT,
    due_date DATE,
    paid_date DATE,
    late_fee DECIMAL(10,2) DEFAULT 0,
    failure_reason TEXT,
    receipt_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ====================================================================================
-- ENHANCED INDEXES FOR PERFORMANCE
-- ====================================================================================

-- Business Intelligence indexes
CREATE INDEX IF NOT EXISTS idx_underwriting_metrics_date ON underwriting_metrics(metric_date);
CREATE INDEX IF NOT EXISTS idx_underwriting_metrics_category ON underwriting_metrics(metric_category);
CREATE INDEX IF NOT EXISTS idx_risk_models_deployment ON risk_models(deployment_status);
CREATE INDEX IF NOT EXISTS idx_risk_models_type ON risk_models(model_type);
CREATE INDEX IF NOT EXISTS idx_competitive_analysis_date ON competitive_analysis(analysis_date);
CREATE INDEX IF NOT EXISTS idx_audit_trail_user ON audit_trail(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_trail_date ON audit_trail(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_trail_action ON audit_trail(action_type);
CREATE INDEX IF NOT EXISTS idx_system_performance_timestamp ON system_performance(timestamp);
CREATE INDEX IF NOT EXISTS idx_system_performance_endpoint ON system_performance(endpoint);
CREATE INDEX IF NOT EXISTS idx_business_rules_category ON business_rules(rule_category);
CREATE INDEX IF NOT EXISTS idx_business_rules_active ON business_rules(active_status);
CREATE INDEX IF NOT EXISTS idx_predictive_insights_user ON predictive_insights(user_id);
CREATE INDEX IF NOT EXISTS idx_predictive_insights_type ON predictive_insights(insight_type);
CREATE INDEX IF NOT EXISTS idx_market_data_source ON market_data(data_source);
CREATE INDEX IF NOT EXISTS idx_market_data_geography ON market_data(geography);

-- Insurance business logic indexes
CREATE INDEX IF NOT EXISTS idx_policies_user ON policies(user_id);
CREATE INDEX IF NOT EXISTS idx_policies_status ON policies(status);
CREATE INDEX IF NOT EXISTS idx_policies_number ON policies(policy_number);
CREATE INDEX IF NOT EXISTS idx_claims_policy ON claims(policy_id);
CREATE INDEX IF NOT EXISTS idx_claims_user ON claims(user_id);
CREATE INDEX IF NOT EXISTS idx_claims_status ON claims(status);
CREATE INDEX IF NOT EXISTS idx_claims_date ON claims(claim_date);
CREATE INDEX IF NOT EXISTS idx_health_tracking_user ON health_tracking(user_id);
CREATE INDEX IF NOT EXISTS idx_health_tracking_date ON health_tracking(tracking_date);
CREATE INDEX IF NOT EXISTS idx_payments_policy ON payments(policy_id);
CREATE INDEX IF NOT EXISTS idx_payments_user ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(payment_status);
CREATE INDEX IF NOT EXISTS idx_payments_due_date ON payments(due_date);

-- GIN indexes for JSONB fields
CREATE INDEX IF NOT EXISTS idx_risk_models_features_gin ON risk_models USING GIN (feature_weights);
CREATE INDEX IF NOT EXISTS idx_risk_models_bias_gin ON risk_models USING GIN (bias_metrics);
CREATE INDEX IF NOT EXISTS idx_competitive_analysis_coverage_gin ON competitive_analysis USING GIN (coverage_details);
CREATE INDEX IF NOT EXISTS idx_audit_trail_old_values_gin ON audit_trail USING GIN (old_values);
CREATE INDEX IF NOT EXISTS idx_audit_trail_new_values_gin ON audit_trail USING GIN (new_values);
CREATE INDEX IF NOT EXISTS idx_business_rules_conditions_gin ON business_rules USING GIN (condition_logic);
CREATE INDEX IF NOT EXISTS idx_business_rules_actions_gin ON business_rules USING GIN (action_logic);
CREATE INDEX IF NOT EXISTS idx_predictive_insights_data_gin ON predictive_insights USING GIN (prediction_data);
CREATE INDEX IF NOT EXISTS idx_market_data_value_gin ON market_data USING GIN (data_value);
CREATE INDEX IF NOT EXISTS idx_health_tracking_metrics_gin ON health_tracking USING GIN (health_metrics);

-- ====================================================================================
-- ROW LEVEL SECURITY POLICIES FOR NEW TABLES
-- ====================================================================================

-- Enable RLS on new tables
ALTER TABLE underwriting_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE risk_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitive_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_trail ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE predictive_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- RLS policies for business intelligence tables (admin/system access)
CREATE POLICY "Admin can view all metrics" ON underwriting_metrics FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "System can insert metrics" ON underwriting_metrics FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin can view all models" ON risk_models FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "System can manage models" ON risk_models FOR ALL WITH CHECK (true);

CREATE POLICY "Admin can view competitive analysis" ON competitive_analysis FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admin can view audit trail" ON audit_trail FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "System can insert audit records" ON audit_trail FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin can view system performance" ON system_performance FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "System can insert performance data" ON system_performance FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin can manage business rules" ON business_rules FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Users can view their predictive insights" ON predictive_insights FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can manage predictive insights" ON predictive_insights FOR ALL WITH CHECK (true);

CREATE POLICY "Public market data access" ON market_data FOR SELECT USING (true);
CREATE POLICY "System can manage market data" ON market_data FOR ALL WITH CHECK (true);

-- RLS policies for insurance business logic
CREATE POLICY "Users can view their own policies" ON policies FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own policies" ON policies FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Underwriters can manage policies" ON policies FOR ALL USING (auth.jwt() ->> 'role' IN ('admin', 'underwriter'));

CREATE POLICY "Users can view their own claims" ON claims FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own claims" ON claims FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Claims adjusters can manage claims" ON claims FOR ALL USING (auth.jwt() ->> 'role' IN ('admin', 'adjuster'));

CREATE POLICY "Users can view their own health tracking" ON health_tracking FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own payments" ON payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can manage payments" ON payments FOR ALL WITH CHECK (true);

-- ====================================================================================
-- TRIGGERS FOR AUTOMATIC TIMESTAMP UPDATES
-- ====================================================================================

CREATE TRIGGER update_underwriting_metrics_updated_at 
    BEFORE UPDATE ON underwriting_metrics 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_risk_models_updated_at 
    BEFORE UPDATE ON risk_models 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_business_rules_updated_at 
    BEFORE UPDATE ON business_rules 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_predictive_insights_updated_at 
    BEFORE UPDATE ON predictive_insights 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_policies_updated_at 
    BEFORE UPDATE ON policies 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_claims_updated_at 
    BEFORE UPDATE ON claims 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at 
    BEFORE UPDATE ON payments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ====================================================================================
-- BUSINESS INTELLIGENCE VIEWS AND ANALYTICS
-- ====================================================================================

-- Real-time KPI dashboard view
CREATE OR REPLACE VIEW kpi_dashboard AS
SELECT 
    'operational_efficiency' as category,
    'applications_processed_today' as metric_name,
    COUNT(CASE WHEN DATE(created_at) = CURRENT_DATE THEN 1 END) as current_value,
    100 as target_value,
    CASE 
        WHEN COUNT(CASE WHEN DATE(created_at) = CURRENT_DATE THEN 1 END) >= 100 THEN 'green'
        WHEN COUNT(CASE WHEN DATE(created_at) = CURRENT_DATE THEN 1 END) >= 75 THEN 'yellow'
        ELSE 'red'
    END as status
FROM insurance_questionnaires

UNION ALL

SELECT 
    'operational_efficiency' as category,
    'average_processing_time' as metric_name,
    AVG(processing_time_seconds) as current_value,
    7200 as target_value, -- 2 hours in seconds
    CASE 
        WHEN AVG(processing_time_seconds) <= 7200 THEN 'green'
        WHEN AVG(processing_time_seconds) <= 14400 THEN 'yellow'
        ELSE 'red'
    END as status
FROM insurance_questionnaires 
WHERE status = 'completed' AND DATE(created_at) = CURRENT_DATE

UNION ALL

SELECT 
    'customer_experience' as category,
    'completion_rate' as metric_name,
    (COUNT(CASE WHEN status = 'completed' THEN 1 END) * 100.0 / NULLIF(COUNT(*), 0)) as current_value,
    85 as target_value,
    CASE 
        WHEN (COUNT(CASE WHEN status = 'completed' THEN 1 END) * 100.0 / NULLIF(COUNT(*), 0)) >= 85 THEN 'green'
        WHEN (COUNT(CASE WHEN status = 'completed' THEN 1 END) * 100.0 / NULLIF(COUNT(*), 0)) >= 70 THEN 'yellow'
        ELSE 'red'
    END as status
FROM insurance_questionnaires
WHERE DATE(created_at) = CURRENT_DATE;

-- Policy performance analytics view
CREATE OR REPLACE VIEW policy_analytics AS
SELECT 
    DATE_TRUNC('month', created_at) as month,
    policy_type,
    COUNT(*) as policies_issued,
    SUM(coverage_amount) as total_coverage,
    AVG(premium_amount) as avg_premium,
    COUNT(CASE WHEN status = 'active' THEN 1 END) as active_policies,
    (COUNT(CASE WHEN status = 'active' THEN 1 END) * 100.0 / NULLIF(COUNT(*), 0)) as retention_rate
FROM policies
GROUP BY DATE_TRUNC('month', created_at), policy_type
ORDER BY month DESC, policy_type;

-- Claims analytics view
CREATE OR REPLACE VIEW claims_analytics AS
SELECT 
    DATE_TRUNC('month', claim_date) as month,
    claim_type,
    COUNT(*) as total_claims,
    SUM(claim_amount) as total_claimed,
    SUM(approved_amount) as total_approved,
    AVG(processing_time_days) as avg_processing_days,
    (SUM(approved_amount) / NULLIF(SUM(claim_amount), 0) * 100) as approval_rate_percent,
    AVG(fraud_score) as avg_fraud_score
FROM claims
GROUP BY DATE_TRUNC('month', claim_date), claim_type
ORDER BY month DESC, claim_type;

-- ====================================================================================
-- SAMPLE DATA FOR TESTING AND DEMONSTRATION
-- ====================================================================================

-- Insert sample KPI metrics
INSERT INTO underwriting_metrics (metric_name, metric_value, benchmark_value, variance_percentage, trend_direction, metric_category) VALUES
('applications_processed_today', 87, 100, -13.0, 'down', 'efficiency'),
('average_processing_time_hours', 1.8, 2.0, -10.0, 'up', 'efficiency'),
('stp_rate_percent', 82, 85, -3.5, 'stable', 'efficiency'),
('daily_premium_written', 48500, 50000, -3.0, 'down', 'financial'),
('customer_satisfaction_score', 4.6, 4.5, 2.2, 'up', 'customer'),
('policy_renewal_rate_percent', 89, 85, 4.7, 'up', 'customer');

-- Insert sample risk model
INSERT INTO risk_models (model_name, model_version, model_type, training_date, accuracy_score, precision_score, recall_score, f1_score, deployment_status) VALUES
('ensemble_risk_v1', '1.0.0', 'risk_assessment', NOW() - INTERVAL '30 days', 0.7825, 0.7654, 0.7891, 0.7771, 'production'),
('xgboost_premium_v2', '2.1.0', 'premium_calculation', NOW() - INTERVAL '15 days', 0.8234, 0.8012, 0.8456, 0.8229, 'testing'),
('fraud_detector_v1', '1.2.1', 'fraud_detection', NOW() - INTERVAL '7 days', 0.9156, 0.8934, 0.9378, 0.9152, 'production');

-- Insert sample competitive analysis
INSERT INTO competitive_analysis (competitor_id, competitor_name, product_type, premium_range_min, premium_range_max, coverage_amount, market_share, customer_rating, data_source) VALUES
('lemonade_001', 'Lemonade', 'term_life', 15.00, 45.00, 500000, 8.5, 4.2, 'web_scraping'),
('root_001', 'Root Insurance', 'term_life', 18.00, 52.00, 500000, 3.2, 4.1, 'api'),
('oscar_001', 'Oscar Health', 'health', 120.00, 380.00, 0, 2.8, 3.9, 'manual');

-- Insert sample business rules
INSERT INTO business_rules (rule_id, rule_name, rule_category, condition_logic, action_logic, priority) VALUES
('UW_001', 'High Risk BMI Check', 'underwriting', 
 '{"conditions": [{"field": "health.bmi", "operator": ">", "value": 35}]}',
 '{"actions": [{"type": "flag_review", "message": "High BMI requires medical review"}, {"type": "adjust_premium", "multiplier": 1.25}]}',
 1),
('FRAUD_001', 'Multiple Applications Detection', 'fraud',
 '{"conditions": [{"field": "applications_count_30days", "operator": ">", "value": 3}]}',
 '{"actions": [{"type": "fraud_alert", "severity": "high"}, {"type": "hold_application"}]}',
 1);

-- Insert sample market data
INSERT INTO market_data (data_source, data_type, data_value, geography, time_period, reliability_score) VALUES
('census', 'population_demographics', 
 '{"median_age": 38.2, "median_income": 62450, "health_conscious_percent": 67}', 
 'US', '2024', 0.95),
('economic_indicators', 'inflation_rate', 
 '{"annual_rate": 2.8, "health_insurance_inflation": 3.2}', 
 'US', 'Q1_2024', 0.98),
('health_trends', 'chronic_disease_prevalence', 
 '{"diabetes": 11.3, "hypertension": 24.1, "obesity": 36.2}', 
 'US', '2024', 0.92);
