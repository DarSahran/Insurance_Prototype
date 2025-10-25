/*
  # Fix Function Search Paths - Corrected
  
  Sets secure search_path for all security-critical functions.
  This prevents potential SQL injection via search_path manipulation.
*/

-- Set secure search_path for functions without parameters
ALTER FUNCTION public.cleanup_inactive_sessions() 
  SET search_path = public, pg_temp;

ALTER FUNCTION public.update_updated_at_column() 
  SET search_path = public, pg_temp;

ALTER FUNCTION public.update_completion_percentage() 
  SET search_path = public, pg_temp;

ALTER FUNCTION public.set_notification_read_timestamp() 
  SET search_path = public, pg_temp;

ALTER FUNCTION public.create_default_notification_preferences() 
  SET search_path = public, pg_temp;

ALTER FUNCTION public.cleanup_old_notifications() 
  SET search_path = public, pg_temp;

ALTER FUNCTION public.validate_beneficiary_percentage() 
  SET search_path = public, pg_temp;

-- Functions with parameters - PostgreSQL requires full signature
-- These will be handled by searching for the exact signature
DO $$
DECLARE
  func_sig text;
BEGIN
  -- Fix get_unread_notification_count
  FOR func_sig IN 
    SELECT pg_get_functiondef(oid)::text 
    FROM pg_proc 
    WHERE proname = 'get_unread_notification_count' 
      AND pronamespace = 'public'::regnamespace
  LOOP
    IF func_sig LIKE '%user_id_param%' THEN
      ALTER FUNCTION public.get_unread_notification_count(user_id_param text) 
        SET search_path = public, pg_temp;
    ELSIF func_sig LIKE '%text%' THEN
      ALTER FUNCTION public.get_unread_notification_count(text) 
        SET search_path = public, pg_temp;
    END IF;
  END LOOP;

  -- Fix check_2fa_rate_limit
  FOR func_sig IN 
    SELECT pg_get_functiondef(oid)::text 
    FROM pg_proc 
    WHERE proname = 'check_2fa_rate_limit' 
      AND pronamespace = 'public'::regnamespace
  LOOP
    IF func_sig LIKE '%user_id_param%' THEN
      ALTER FUNCTION public.check_2fa_rate_limit(user_id_param text) 
        SET search_path = public, pg_temp;
    ELSIF func_sig LIKE '%text%' THEN
      ALTER FUNCTION public.check_2fa_rate_limit(text) 
        SET search_path = public, pg_temp;
    END IF;
  END LOOP;
END $$;