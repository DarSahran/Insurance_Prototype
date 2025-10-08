-- ============================================
-- SUPABASE STORAGE BUCKET SECURITY SETUP
-- Bucket Name: medical_records
-- ============================================

/*
  This SQL sets up Row Level Security (RLS) policies for the 'medical_records' storage bucket.

  IMPORTANT:
  1. The bucket 'medical_records' must already be created in Supabase Dashboard
  2. Make sure the bucket is set to PRIVATE (not public)
  3. Run this SQL in the Supabase SQL Editor
*/

-- Enable RLS on storage.objects table (should already be enabled by default)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLICY 1: Users can upload their own files
-- ============================================
-- Allows authenticated users to INSERT files into their own folder (user_id/*)
CREATE POLICY "Users can upload own documents"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'medical_records' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- ============================================
-- POLICY 2: Users can view their own files
-- ============================================
-- Allows authenticated users to SELECT/view files from their own folder
CREATE POLICY "Users can view own documents"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'medical_records' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- ============================================
-- POLICY 3: Users can update their own files
-- ============================================
-- Allows authenticated users to UPDATE files in their own folder
CREATE POLICY "Users can update own documents"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'medical_records' AND
  (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'medical_records' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- ============================================
-- POLICY 4: Users can delete their own files
-- ============================================
-- Allows authenticated users to DELETE files from their own folder
CREATE POLICY "Users can delete own documents"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'medical_records' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- ============================================
-- VERIFY POLICIES
-- ============================================
-- Run this query to verify all policies are created:
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'objects'
AND schemaname = 'storage'
AND policyname LIKE '%own documents%';

-- ============================================
-- CORS CONFIGURATION
-- ============================================
/*
  CORS is configured at the Supabase project level, not via SQL.

  To configure CORS for your storage bucket:

  1. Go to Supabase Dashboard
  2. Navigate to: Storage > Configuration
  3. Add your frontend URL to allowed origins

  OR use the Supabase API to set CORS headers (recommended for production):

  The following headers should be set:
  - Access-Control-Allow-Origin: * (or your specific domain)
  - Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
  - Access-Control-Allow-Headers: authorization, x-client-info, apikey, content-type

  Note: Supabase automatically handles CORS for storage API requests when properly configured.
*/

-- ============================================
-- TESTING YOUR SETUP
-- ============================================
/*
  After running this SQL, test your setup:

  1. Try uploading a file from your app
  2. The file should be stored at: medical_records/{user_id}/{timestamp}_{filename}
  3. Users should only see their own files
  4. Users should not be able to access other users' files

  Example file path structure:
  medical_records/
    ├── user-uuid-1/
    │   ├── 1696789012345_medical_report.pdf
    │   └── 1696789023456_prescription.jpg
    └── user-uuid-2/
        ├── 1696789034567_lab_results.pdf
        └── 1696789045678_insurance_card.png
*/

-- ============================================
-- CLEANUP (if needed)
-- ============================================
/*
  If you need to remove and recreate the policies, uncomment and run:

  DROP POLICY IF EXISTS "Users can upload own documents" ON storage.objects;
  DROP POLICY IF EXISTS "Users can view own documents" ON storage.objects;
  DROP POLICY IF EXISTS "Users can update own documents" ON storage.objects;
  DROP POLICY IF EXISTS "Users can delete own documents" ON storage.objects;
*/
