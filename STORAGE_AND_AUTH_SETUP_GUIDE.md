# Supabase Storage & Authentication Setup Guide

## Overview
This guide covers the complete setup for Supabase Storage integration with proper Row Level Security (RLS) and authentication-based user profile management.

---

## Part 1: Create Storage Bucket

### Step 1: Create the Bucket
1. Go to your Supabase Dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **Create a new bucket**
4. Configure the bucket:
   - **Name**: `medical_records`
   - **Public bucket**: ❌ **UNCHECKED** (Keep it private)
   - **File size limit**: 10 MB (or as needed)
   - **Allowed MIME types**: Leave empty to allow all types (or specify: `image/*, application/pdf`)
5. Click **Create bucket**

### Step 2: Configure CORS (if needed)
CORS is handled automatically by Supabase for authenticated requests. However, if you encounter CORS issues:

1. Go to **Storage** > **Configuration**
2. Ensure your frontend domain is whitelisted
3. Common settings:
   ```
   Allowed origins: * (development) or https://yourdomain.com (production)
   Allowed methods: GET, POST, PUT, DELETE, OPTIONS
   Allowed headers: authorization, x-client-info, apikey, content-type
   ```

---

## Part 2: Set Up Row Level Security Policies

### Run the Following SQL

Go to **SQL Editor** in your Supabase Dashboard and run this SQL:

```sql
-- Enable RLS on storage.objects (should already be enabled)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy 1: Users can upload their own files
CREATE POLICY "Users can upload own documents"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'medical_records' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy 2: Users can view their own files
CREATE POLICY "Users can view own documents"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'medical_records' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy 3: Users can update their own files
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

-- Policy 4: Users can delete their own files
CREATE POLICY "Users can delete own documents"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'medical_records' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

### Verify Policies Were Created

Run this verification query:

```sql
SELECT
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename = 'objects'
AND schemaname = 'storage'
AND policyname LIKE '%own documents%';
```

You should see 4 policies listed:
- Users can upload own documents
- Users can view own documents
- Users can update own documents
- Users can delete own documents

---

## Part 3: How File Storage Works

### File Path Structure
Files are automatically organized by user ID:
```
medical_records/
  ├── {user_id_1}/
  │   ├── 1696789012345_medical_report.pdf
  │   ├── 1696789023456_prescription.jpg
  │   └── 1696789034567_lab_results.pdf
  └── {user_id_2}/
      ├── 1696789045678_insurance_card.png
      └── 1696789056789_tax_documents.pdf
```

### Security Features
✅ **Automatic User Isolation**: Each user can only access files in their own folder
✅ **No Cross-User Access**: User A cannot see or access User B's files
✅ **Timestamp Prefixing**: Prevents filename collisions
✅ **Sanitized Filenames**: Special characters are replaced with underscores

---

## Part 4: User Profile Management

### Automatic Profile Creation
The system automatically creates user profiles when users first log in:

1. **On First Login/Access**:
   - System checks if user profile exists in `user_profiles` table
   - If not found, fetches user data from Supabase Auth
   - Creates profile with auth data (email, name, phone)

2. **Data Sources**:
   - **Email**: From `auth.users.email`
   - **Name**: From `auth.users.user_metadata.full_name`
   - **First Name**: From `auth.users.user_metadata.first_name` or `name`
   - **Last Name**: From `auth.users.user_metadata.last_name`
   - **Phone**: From `auth.users.phone`

### Clerk Integration
If you're using Clerk for authentication, user metadata is synced automatically:
- Clerk webhook updates Supabase `user_profiles` table
- Profile data flows from Clerk → Supabase Auth → user_profiles table

---

## Part 5: Testing Your Setup

### Test File Upload
1. **Login to your application**
2. **Navigate to Document Center**
3. **Click "Upload Document"**
4. **Select a file and document type**
5. **Click "Upload & Process"**

### Verify in Supabase Dashboard
1. Go to **Storage** > **medical_records** bucket
2. You should see a folder with your user ID
3. Inside that folder, your uploaded files
4. File name format: `{timestamp}_{original_filename}`

### Test Security
1. Open browser DevTools > Console
2. Try to access another user's file (you should get a 403 error):
```javascript
const { data, error } = await supabase.storage
  .from('medical_records')
  .download('some-other-user-id/their-file.pdf');

console.log(error); // Should show permission denied
```

---

## Part 6: Database Tables

### Tables That Need to Exist

Run the main migration SQL first (creates these tables):
1. `user_profiles` - User profile data
2. `user_locations` - Location tracking
3. `weather_data` - Weather information
4. `ocr_documents` - Document metadata and OCR results
5. `insurance_recommendations_cache` - Cached insurance data
6. `regional_insurance_rates` - Location-based rates
7. `weather_history` - Historical weather data
8. `geolocation_cache` - Geocoding cache

---

## Part 7: Application Features

### Document Upload Flow
1. **User selects file** → Frontend validates size/type
2. **File uploads** → Supabase Storage (`medical_records/{user_id}/{timestamp}_{filename}`)
3. **Record created** → Database row in `ocr_documents` table
4. **OCR processing** → Google Cloud Vision API extracts text
5. **Data parsing** → Structured data extracted (medical vitals, financial info, etc.)
6. **Status updated** → Processing status set to 'completed'

### Document Access
- **View**: Users can see list of their documents in Document Center
- **Download**: Click download icon to retrieve original file
- **Delete**: Removes both database record and storage file
- **OCR Results**: View extracted text and structured data

### User Profile Auto-Creation
- Happens automatically on first app access
- Uses Supabase Auth data as source
- Updates existing profiles if auth data changes
- Falls back to email username if no name provided

---

## Part 8: Troubleshooting

### Issue: "Storage object not found"
**Cause**: RLS policies not set up correctly
**Solution**:
1. Verify bucket is private (not public)
2. Re-run the RLS policy SQL
3. Check user is authenticated before upload

### Issue: "Permission denied"
**Cause**: Trying to access files in different user's folder
**Solution**: This is expected behavior - each user can only access their own files

### Issue: "CORS error"
**Cause**: Frontend domain not whitelisted
**Solution**:
1. Add your domain to Supabase Storage configuration
2. For local development, ensure `localhost` is allowed

### Issue: "User profile not created"
**Cause**: Supabase Auth metadata missing
**Solution**:
1. Check if user exists in Supabase Auth Users table
2. Verify user has email address
3. Check user_metadata contains name fields

### Issue: "OCR not working"
**Cause**: Google Cloud Vision API key not configured
**Solution**:
1. Add `VITE_GOOGLE_CLOUD_VISION_API_KEY` to `.env` file
2. System will use mock OCR data as fallback

---

## Part 9: Environment Variables

Required environment variables in `.env`:

```env
# Supabase (Required)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Clerk (if using Clerk auth)
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your-clerk-key

# AI Services
VITE_GEMINI_API_KEY=your-gemini-key-here

# External APIs (Optional - system uses fallbacks)
VITE_OPENWEATHER_API_KEY=your-openweather-key
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-key
VITE_GOOGLE_CLOUD_VISION_API_KEY=your-cloud-vision-key
```

---

## Part 10: Security Best Practices

### ✅ Implemented Security Features
- Row Level Security on all database tables
- Storage bucket policies restrict access to user's own files
- File paths include user ID for isolation
- OCR confidence scoring with manual verification flag
- Automatic file cleanup on document deletion
- User can only delete their own documents
- No direct file URL exposure (authenticated downloads only)

### 🔒 Additional Recommendations
- Regular security audits of RLS policies
- Monitor storage usage per user
- Implement file size quotas per user
- Add virus scanning for uploaded files
- Log all file access attempts
- Implement file retention policies
- Regular backup of storage bucket

---

## Summary Checklist

Before deploying to production, ensure:

- [ ] Storage bucket `medical_records` created and set to PRIVATE
- [ ] All 4 RLS policies created and verified
- [ ] All 7 database tables created with proper RLS
- [ ] Environment variables configured
- [ ] CORS settings configured (if needed)
- [ ] Clerk webhook configured (if using Clerk)
- [ ] Test file upload works
- [ ] Test file download works
- [ ] Test file deletion works
- [ ] Verify users cannot access other users' files
- [ ] User profiles auto-create on first login
- [ ] OCR processing works (or fallback to mock data)

---

## Quick Reference

### Upload File
```typescript
const { data, error } = await supabase.storage
  .from('medical_records')
  .upload(`${userId}/${Date.now()}_${filename}`, file);
```

### Download File
```typescript
const { data, error } = await supabase.storage
  .from('medical_records')
  .download(filePath);
```

### Delete File
```typescript
const { error } = await supabase.storage
  .from('medical_records')
  .remove([filePath]);
```

### Get Public URL (won't work for private buckets without auth)
```typescript
const { data } = supabase.storage
  .from('medical_records')
  .getPublicUrl(filePath);
```

---

## Support

If you encounter issues:
1. Check Supabase Dashboard logs
2. Verify RLS policies with the verification query
3. Test with Supabase SQL editor
4. Check browser console for error messages
5. Review this guide's troubleshooting section
