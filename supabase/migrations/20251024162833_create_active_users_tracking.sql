/*
  # Active Users Tracking System

  1. New Tables
    - `active_users`
      - `id` (uuid, primary key)
      - `session_id` (text, unique) - Browser session identifier
      - `user_id` (uuid, nullable) - For authenticated users
      - `last_seen` (timestamptz) - Last activity timestamp
      - `page_url` (text) - Current page URL
      - `user_agent` (text) - Browser information
      - `created_at` (timestamptz)

  2. Functions
    - Auto-cleanup function to remove inactive sessions (>5 minutes)

  3. Security
    - Enable RLS
    - Allow anyone to insert/update their own session
    - Allow anyone to read active user counts
*/

-- Create active_users table
CREATE TABLE IF NOT EXISTS active_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text UNIQUE NOT NULL,
  user_id uuid,
  last_seen timestamptz DEFAULT now() NOT NULL,
  page_url text,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE active_users ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert/update their session
CREATE POLICY "Anyone can upsert their session"
  ON active_users
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can update their session"
  ON active_users
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Allow anyone to read for counting active users
CREATE POLICY "Anyone can view active users"
  ON active_users
  FOR SELECT
  TO public
  USING (true);

-- Function to cleanup inactive sessions (older than 5 minutes)
CREATE OR REPLACE FUNCTION cleanup_inactive_sessions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM active_users
  WHERE last_seen < now() - interval '5 minutes';
END;
$$;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_active_users_last_seen ON active_users(last_seen DESC);
CREATE INDEX IF NOT EXISTS idx_active_users_session_id ON active_users(session_id);