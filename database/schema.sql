-- Create user_profiles table
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create insurance_questionnaires table
CREATE TABLE IF NOT EXISTS insurance_questionnaires (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    demographics JSONB,
    health JSONB,
    lifestyle JSONB,
    financial JSONB,
    ai_analysis JSONB,
    risk_score INTEGER,
    premium_estimate DECIMAL(10,2),
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'completed', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_insurance_questionnaires_user_id ON insurance_questionnaires(user_id);
CREATE INDEX IF NOT EXISTS idx_insurance_questionnaires_status ON insurance_questionnaires(status);
CREATE INDEX IF NOT EXISTS idx_insurance_questionnaires_created_at ON insurance_questionnaires(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE insurance_questionnaires ENABLE ROW LEVEL SECURITY;

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

-- Insert sample data (optional - remove in production)
-- Note: This is just for testing purposes
/*
INSERT INTO user_profiles (user_id, email, first_name, last_name, full_name) 
VALUES 
    ('00000000-0000-0000-0000-000000000001'::UUID, 'test@example.com', 'John', 'Doe', 'John Doe'),
    ('00000000-0000-0000-0000-000000000002'::UUID, 'jane@example.com', 'Jane', 'Smith', 'Jane Smith');
*/
