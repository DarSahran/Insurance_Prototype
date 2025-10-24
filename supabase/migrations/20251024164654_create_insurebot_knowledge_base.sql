/*
  # InsureBot Knowledge Base and Chat System

  1. New Tables
    - `knowledge_base`
      - `id` (uuid, primary key)
      - `content` (text) - Knowledge content
      - `title` (text) - Title/topic
      - `category` (text) - Category (policies, claims, health, etc.)
      - `metadata` (jsonb) - Additional metadata
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `chat_conversations`
      - `id` (uuid, primary key)
      - `user_id` (uuid, nullable) - For authenticated users
      - `session_id` (text) - For anonymous users
      - `title` (text) - Conversation title
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `chat_messages`
      - `id` (uuid, primary key)
      - `conversation_id` (uuid, foreign key)
      - `role` (text) - user/assistant
      - `content` (text) - Message content
      - `metadata` (jsonb) - Additional data (sources, etc.)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Allow public read access to knowledge base
    - Allow users to manage their own conversations
*/

-- Knowledge Base Table
CREATE TABLE IF NOT EXISTS knowledge_base (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text NOT NULL,
  title text NOT NULL,
  category text NOT NULL DEFAULT 'general',
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Chat Conversations Table
CREATE TABLE IF NOT EXISTS chat_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id text,
  title text DEFAULT 'New Conversation',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Chat Messages Table
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES chat_conversations(id) ON DELETE CASCADE NOT NULL,
  role text NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Knowledge Base Policies (Public Read)
CREATE POLICY "Anyone can view knowledge base"
  ON knowledge_base
  FOR SELECT
  TO public
  USING (true);

-- Chat Conversations Policies
CREATE POLICY "Users can view own conversations"
  ON chat_conversations
  FOR SELECT
  TO public
  USING (
    (auth.uid() IS NOT NULL AND user_id = auth.uid())
    OR (auth.uid() IS NULL AND session_id IS NOT NULL)
  );

CREATE POLICY "Users can insert own conversations"
  ON chat_conversations
  FOR INSERT
  TO public
  WITH CHECK (
    (auth.uid() IS NOT NULL AND user_id = auth.uid())
    OR (auth.uid() IS NULL AND session_id IS NOT NULL)
  );

CREATE POLICY "Users can update own conversations"
  ON chat_conversations
  FOR UPDATE
  TO public
  USING (
    (auth.uid() IS NOT NULL AND user_id = auth.uid())
    OR (auth.uid() IS NULL AND session_id IS NOT NULL)
  )
  WITH CHECK (
    (auth.uid() IS NOT NULL AND user_id = auth.uid())
    OR (auth.uid() IS NULL AND session_id IS NOT NULL)
  );

-- Chat Messages Policies
CREATE POLICY "Users can view messages from own conversations"
  ON chat_messages
  FOR SELECT
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM chat_conversations
      WHERE chat_conversations.id = chat_messages.conversation_id
      AND (
        (auth.uid() IS NOT NULL AND chat_conversations.user_id = auth.uid())
        OR (auth.uid() IS NULL AND chat_conversations.session_id IS NOT NULL)
      )
    )
  );

CREATE POLICY "Users can insert messages in own conversations"
  ON chat_messages
  FOR INSERT
  TO public
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM chat_conversations
      WHERE chat_conversations.id = chat_messages.conversation_id
      AND (
        (auth.uid() IS NOT NULL AND chat_conversations.user_id = auth.uid())
        OR (auth.uid() IS NULL AND chat_conversations.session_id IS NOT NULL)
      )
    )
  );

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_knowledge_base_category ON knowledge_base(category);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_user_id ON chat_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_session_id ON chat_conversations(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation_id ON chat_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at DESC);

-- Insert initial knowledge base content
INSERT INTO knowledge_base (title, content, category) VALUES
('About SmartCover AI', 'SmartCover AI is an innovative insurance platform that uses artificial intelligence to provide personalized insurance recommendations. We achieve 78% accuracy in risk assessment, which is 11x better than traditional methods. Our platform processes applications 90% faster, reducing weeks to minutes.', 'company'),
('Health Insurance Coverage', 'Our health insurance policies cover hospitalization, surgery, critical illness, maternity, pre and post-hospitalization expenses, ambulance charges, and preventive health checkups. We partner with 5000+ hospitals across India for cashless treatment.', 'health_insurance'),
('Life Insurance Benefits', 'Life insurance provides financial protection to your family in case of unfortunate events. Our policies include term insurance, whole life insurance, endowment plans, and ULIPs. Coverage ranges from ₹25 lakhs to ₹2 crores with affordable premiums.', 'life_insurance'),
('Motor Insurance Coverage', 'Motor insurance covers damage to your vehicle, third-party liability, theft, natural disasters, and personal accident. We offer both comprehensive and third-party policies with instant claim settlement and cashless repairs at 10,000+ garages.', 'motor_insurance'),
('Travel Insurance Benefits', 'Travel insurance covers medical emergencies abroad, trip cancellation, lost baggage, flight delays, passport loss, and emergency evacuation. Coverage available for domestic and international travel with 24/7 assistance.', 'travel_insurance'),
('Claims Process', 'Filing a claim is easy: 1) Login to your dashboard 2) Go to Claims section 3) Upload required documents 4) Track claim status in real-time. Our AI verifies documents instantly and settles valid claims within 24-48 hours. Average claim settlement time is 36 hours.', 'claims'),
('Premium Calculation', 'Insurance premiums are calculated based on age, health condition, lifestyle, occupation, sum assured, and policy term. Our AI analyzes 50+ factors to provide accurate, unbiased pricing. You can get instant quotes without providing personal information.', 'pricing'),
('Policy Renewal', 'Policies can be renewed online through your dashboard. We send reminders 30 days before expiry. Auto-renewal option available. No medical check-up required for renewal if claim-free. Grace period of 30 days provided.', 'renewal'),
('Customer Support', 'We provide 24/7 customer support via chat, email (darsahran12@gmail.com), and phone (+91 9797974779). Response time is under 2 hours for queries. Our AI chatbot can answer common questions instantly.', 'support'),
('Document Requirements', 'Required documents: ID proof (Aadhaar/PAN), address proof, age proof, income proof (for high coverage), medical records (for health insurance above 50L), vehicle RC (for motor insurance). All documents can be uploaded digitally.', 'documents'),
('Cashless Treatment', 'Cashless treatment available at 5000+ network hospitals. Process: 1) Inform hospital about insurance 2) Hospital sends pre-authorization to us 3) We approve within 2 hours 4) Treatment proceeds without payment 5) Bill settled directly with hospital.', 'cashless'),
('Tax Benefits', 'Tax deductions available under Section 80C (up to ₹1.5L for life insurance), Section 80D (up to ₹25K for health insurance, ₹50K for senior citizens). Premium paid is deductible. Death benefit is tax-free under Section 10(10D).', 'tax'),
('Family Floater Plans', 'Family floater plans cover entire family under single policy. Sum insured is shared among members. More economical than individual policies. Covers spouse, children, and parents. Recommended for young families.', 'family'),
('Critical Illness Coverage', 'Critical illness rider covers cancer, heart attack, stroke, kidney failure, major organ transplant, paralysis, and 30+ other conditions. Lump sum payout on diagnosis. No questions asked about fund usage. Coverage from ₹10L to ₹1Cr.', 'critical_illness'),
('Maternity Coverage', 'Maternity coverage includes normal and C-section delivery, pre and post-natal care, newborn baby coverage for 90 days. Waiting period of 9-24 months applies. Coverage from ₹50K to ₹2L per delivery.', 'maternity');
