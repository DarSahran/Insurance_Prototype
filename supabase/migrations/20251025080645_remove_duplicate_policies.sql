/*
  # Remove Duplicate RLS Policies
  
  Removes duplicate permissive policies that cause confusion and potential security issues.
  
  Fixes:
  - family_member_policies: 2 SELECT policies → keep only 1
  - geolocation_cache: 2 SELECT policies → keep only 1
*/

-- Family Member Policies - Remove "view" policy, keep "manage" policy
DROP POLICY IF EXISTS "Users can view policies for their family members" 
  ON public.family_member_policies;

-- Geolocation Cache - Remove duplicate, keep "Anyone can view" policy
DROP POLICY IF EXISTS "Allow geolocation cache reads" 
  ON public.geolocation_cache;

-- Add comment to document the cleanup
COMMENT ON TABLE public.family_member_policies IS 'RLS: Users can manage policies for their family members (duplicate policy removed)';
COMMENT ON TABLE public.geolocation_cache IS 'RLS: Anyone can view geolocation cache (duplicate policy removed)';