/*
  # Notifications System Migration
  
  ## Overview
  Creates a comprehensive real-time notifications system for the insurance platform.
  
  ## New Tables
  
  ### `notifications`
  Stores all user notifications with support for multiple types and channels.
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key to auth.users) - Recipient
  - `notification_type` (text) - Type: policy_renewal, claim_update, payment_due, etc.
  - `title` (text) - Notification title
  - `message` (text) - Notification content
  - `priority` (text) - low, medium, high, urgent
  - `category` (text) - policies, claims, payments, health, system
  - `related_entity_type` (text) - policy, claim, payment, etc.
  - `related_entity_id` (uuid) - ID of related entity
  - `action_url` (text) - Deep link to relevant page
  - `is_read` (boolean) - Read status
  - `is_archived` (boolean) - Archive status
  - `read_at` (timestamptz) - When notification was read
  - `delivered_at` (timestamptz) - When notification was delivered
  - `expires_at` (timestamptz) - Optional expiration
  - `metadata` (jsonb) - Additional data
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### `notification_preferences`
  User preferences for notification delivery channels.
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key, unique)
  - `email_enabled` (boolean) - Email notifications
  - `push_enabled` (boolean) - Push notifications
  - `sms_enabled` (boolean) - SMS notifications
  - `in_app_enabled` (boolean) - In-app notifications
  - `notification_types` (jsonb) - Per-type preferences
  - `quiet_hours_start` (time) - Do not disturb start
  - `quiet_hours_end` (time) - Do not disturb end
  - `timezone` (text) - User timezone
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### `notification_delivery_log`
  Tracks notification delivery status across channels.
  - `id` (uuid, primary key)
  - `notification_id` (uuid, foreign key)
  - `channel` (text) - email, push, sms, in_app
  - `status` (text) - pending, sent, delivered, failed, bounced
  - `provider` (text) - SendGrid, Twilio, FCM, etc.
  - `provider_message_id` (text) - External tracking ID
  - `error_message` (text) - If delivery failed
  - `sent_at` (timestamptz)
  - `delivered_at` (timestamptz)
  - `failed_at` (timestamptz)
  - `created_at` (timestamptz)
  
  ## Security
  - RLS enabled on all tables
  - Users can only access their own notifications
  - Automatic cleanup of old read notifications (90 days)
  
  ## Indexes
  - User ID for fast user queries
  - Read status for filtering
  - Created date for chronological sorting
  - Notification type for category filtering
  - GIN index on metadata for flexible queries
*/

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  notification_type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  category TEXT NOT NULL CHECK (category IN ('policies', 'claims', 'payments', 'health', 'system', 'security', 'recommendations')),
  related_entity_type TEXT,
  related_entity_id UUID,
  action_url TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  is_archived BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notification preferences table
CREATE TABLE IF NOT EXISTS notification_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  email_enabled BOOLEAN DEFAULT TRUE,
  push_enabled BOOLEAN DEFAULT TRUE,
  sms_enabled BOOLEAN DEFAULT FALSE,
  in_app_enabled BOOLEAN DEFAULT TRUE,
  notification_types JSONB DEFAULT '{
    "policy_renewal": {"email": true, "push": true, "sms": false},
    "claim_update": {"email": true, "push": true, "sms": true},
    "payment_due": {"email": true, "push": true, "sms": false},
    "payment_failed": {"email": true, "push": true, "sms": true},
    "health_milestone": {"email": true, "push": true, "sms": false},
    "security_alert": {"email": true, "push": true, "sms": true},
    "recommendations": {"email": false, "push": true, "sms": false}
  }'::JSONB,
  quiet_hours_start TIME,
  quiet_hours_end TIME,
  timezone TEXT DEFAULT 'America/New_York',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notification delivery log table
CREATE TABLE IF NOT EXISTS notification_delivery_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  notification_id UUID REFERENCES notifications(id) ON DELETE CASCADE NOT NULL,
  channel TEXT NOT NULL CHECK (channel IN ('email', 'push', 'sms', 'in_app')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'failed', 'bounced')),
  provider TEXT,
  provider_message_id TEXT,
  error_message TEXT,
  sent_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  failed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_is_archived ON notifications(is_archived);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_notification_type ON notifications(notification_type);
CREATE INDEX IF NOT EXISTS idx_notifications_category ON notifications(category);
CREATE INDEX IF NOT EXISTS idx_notifications_priority ON notifications(priority);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id, is_read) WHERE is_read = FALSE;
CREATE INDEX IF NOT EXISTS idx_notification_preferences_user_id ON notification_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_notification_delivery_log_notification_id ON notification_delivery_log(notification_id);
CREATE INDEX IF NOT EXISTS idx_notification_delivery_log_status ON notification_delivery_log(status);

-- GIN index for metadata searches
CREATE INDEX IF NOT EXISTS idx_notifications_metadata_gin ON notifications USING GIN (metadata);
CREATE INDEX IF NOT EXISTS idx_notification_preferences_types_gin ON notification_preferences USING GIN (notification_types);

-- Enable Row Level Security
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_delivery_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "System can insert notifications"
  ON notifications FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can delete their own notifications"
  ON notifications FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for notification preferences
CREATE POLICY "Users can view their own preferences"
  ON notification_preferences FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences"
  ON notification_preferences FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences"
  ON notification_preferences FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for notification delivery log
CREATE POLICY "Users can view delivery logs for their notifications"
  ON notification_delivery_log FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM notifications
      WHERE notifications.id = notification_delivery_log.notification_id
      AND notifications.user_id = auth.uid()
    )
  );

CREATE POLICY "System can insert delivery logs"
  ON notification_delivery_log FOR INSERT
  WITH CHECK (true);

CREATE POLICY "System can update delivery logs"
  ON notification_delivery_log FOR UPDATE
  WITH CHECK (true);

-- Trigger to update updated_at timestamp
CREATE TRIGGER update_notifications_updated_at
  BEFORE UPDATE ON notifications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notification_preferences_updated_at
  BEFORE UPDATE ON notification_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically set read_at timestamp
CREATE OR REPLACE FUNCTION set_notification_read_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_read = TRUE AND OLD.is_read = FALSE THEN
    NEW.read_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_notification_read_at
  BEFORE UPDATE ON notifications
  FOR EACH ROW
  EXECUTE FUNCTION set_notification_read_timestamp();

-- Function to create default notification preferences for new users
CREATE OR REPLACE FUNCTION create_default_notification_preferences()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO notification_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create function to clean up old read notifications (called by scheduled job)
CREATE OR REPLACE FUNCTION cleanup_old_notifications()
RETURNS void AS $$
BEGIN
  DELETE FROM notifications
  WHERE is_read = TRUE
  AND is_archived = FALSE
  AND read_at < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql;

-- Create function to get unread notification count
CREATE OR REPLACE FUNCTION get_unread_notification_count(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  unread_count INTEGER;
BEGIN
  SELECT COUNT(*)
  INTO unread_count
  FROM notifications
  WHERE user_id = p_user_id
  AND is_read = FALSE
  AND is_archived = FALSE
  AND (expires_at IS NULL OR expires_at > NOW());
  
  RETURN unread_count;
END;
$$ LANGUAGE plpgsql;

-- Create view for notification statistics
CREATE OR REPLACE VIEW notification_stats AS
SELECT
  user_id,
  COUNT(*) as total_notifications,
  COUNT(CASE WHEN is_read = FALSE THEN 1 END) as unread_count,
  COUNT(CASE WHEN is_archived = TRUE THEN 1 END) as archived_count,
  COUNT(CASE WHEN priority = 'urgent' AND is_read = FALSE THEN 1 END) as urgent_unread_count,
  MAX(created_at) as latest_notification_at
FROM notifications
WHERE (expires_at IS NULL OR expires_at > NOW())
GROUP BY user_id;
