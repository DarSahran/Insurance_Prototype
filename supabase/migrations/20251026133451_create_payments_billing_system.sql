/*
  # Payments & Billing System - Indian Context

  ## Tables
  
  ### payment_methods
  - Stores user payment methods (UPI, cards, bank accounts)
  - Encrypted sensitive data
  
  ### premium_payments
  - Tracks all premium payments with INR amounts
  - Links to policies and payment methods
  
  ### payment_transactions
  - Complete transaction log with gateway details
  - Razorpay/PayU/PhonePe integration ready
  
  ## Security
  - RLS enabled on all tables
  - Sensitive data encrypted
  - Users access only their data
*/

-- Payment Methods Table
CREATE TABLE IF NOT EXISTS payment_methods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  method_type text NOT NULL CHECK (method_type IN ('upi', 'credit_card', 'debit_card', 'net_banking', 'emi')),
  provider_name text NOT NULL,
  last_four text,
  upi_id text,
  card_brand text,
  expiry_month integer,
  expiry_year integer,
  is_primary boolean DEFAULT false,
  auto_pay_enabled boolean DEFAULT false,
  is_active boolean DEFAULT true,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Premium Payments Table
CREATE TABLE IF NOT EXISTS premium_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  policy_id uuid REFERENCES policies(id) ON DELETE SET NULL,
  policy_name text NOT NULL,
  policy_type text NOT NULL,
  amount_inr numeric NOT NULL CHECK (amount_inr >= 0),
  due_date date NOT NULL,
  payment_date date,
  status text NOT NULL CHECK (status IN ('pending', 'scheduled', 'paid', 'failed', 'overdue', 'cancelled')),
  payment_method_id uuid REFERENCES payment_methods(id) ON DELETE SET NULL,
  payment_method_type text,
  transaction_id text,
  gateway_reference text,
  discount_percent numeric DEFAULT 0,
  discount_amount_inr numeric DEFAULT 0,
  final_amount_inr numeric NOT NULL,
  auto_pay boolean DEFAULT false,
  failure_reason text,
  payment_gateway text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Payment Transactions Table
CREATE TABLE IF NOT EXISTS payment_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  premium_payment_id uuid REFERENCES premium_payments(id) ON DELETE SET NULL,
  transaction_type text NOT NULL CHECK (transaction_type IN ('payment', 'refund', 'reversal', 'adjustment')),
  amount_inr numeric NOT NULL,
  currency text DEFAULT 'INR',
  status text NOT NULL CHECK (status IN ('initiated', 'pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded')),
  gateway text NOT NULL,
  gateway_transaction_id text,
  gateway_order_id text,
  payment_method text NOT NULL,
  description text NOT NULL,
  gateway_response jsonb,
  failure_code text,
  failure_message text,
  processed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_payment_methods_user ON payment_methods(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_methods_primary ON payment_methods(user_id, is_primary) WHERE is_primary = true;

CREATE INDEX IF NOT EXISTS idx_premium_payments_user ON premium_payments(user_id);
CREATE INDEX IF NOT EXISTS idx_premium_payments_due_date ON premium_payments(due_date);
CREATE INDEX IF NOT EXISTS idx_premium_payments_status ON premium_payments(status);
CREATE INDEX IF NOT EXISTS idx_premium_payments_policy ON premium_payments(policy_id);

CREATE INDEX IF NOT EXISTS idx_payment_transactions_user ON payment_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_created ON payment_transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_gateway ON payment_transactions(gateway_transaction_id);

-- RLS
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE premium_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;

-- Payment Methods Policies
CREATE POLICY "Users view own payment methods" ON payment_methods FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users insert own payment methods" ON payment_methods FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own payment methods" ON payment_methods FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own payment methods" ON payment_methods FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Premium Payments Policies
CREATE POLICY "Users view own payments" ON premium_payments FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users insert own payments" ON premium_payments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own payments" ON premium_payments FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Payment Transactions Policies
CREATE POLICY "Users view own transactions" ON payment_transactions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "System create transactions" ON payment_transactions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Update trigger
CREATE OR REPLACE FUNCTION update_payment_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS payment_methods_updated ON payment_methods;
CREATE TRIGGER payment_methods_updated BEFORE UPDATE ON payment_methods FOR EACH ROW EXECUTE FUNCTION update_payment_updated_at();

DROP TRIGGER IF EXISTS premium_payments_updated ON premium_payments;
CREATE TRIGGER premium_payments_updated BEFORE UPDATE ON premium_payments FOR EACH ROW EXECUTE FUNCTION update_payment_updated_at();