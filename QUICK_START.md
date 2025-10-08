# Quick Start Guide - 5 Minutes to Production

## Step 1: Create Storage Bucket (2 minutes)
1. Open Supabase Dashboard
2. Go to **Storage** → Click **New bucket**
3. Name: `medical_records`
4. ⚠️ **UNCHECK "Public bucket"** (keep it private!)
5. Click **Create**

## Step 2: Run SQL (2 minutes)
1. Go to **SQL Editor**
2. Click **New query**
3. Open file: `COMPLETE_SUPABASE_SETUP.sql`
4. Copy entire contents
5. Paste into SQL editor
6. Click **Run**
7. Wait for "Success" message

## Step 3: Verify (1 minute)
1. Go to **Database** → Tables
2. You should see 7 new tables:
   - user_locations
   - weather_data
   - regional_insurance_rates
   - ocr_documents
   - insurance_recommendations_cache
   - weather_history
   - geolocation_cache

3. Go to **Storage** → medical_records
4. Bucket should exist and be **Private**

## Done! 🎉

Your setup is complete. The app will now:
- ✅ Save uploaded documents to Supabase Storage
- ✅ Auto-create user profiles from auth data
- ✅ Isolate each user's files (security enforced)
- ✅ Fetch user details from Supabase Auth
- ✅ Track location and weather data
- ✅ Process documents with OCR

## Test It
1. Login to your app
2. Go to **Document Center**
3. Click **Upload Document**
4. Select a file
5. Click **Upload & Process**
6. Check Supabase Storage → You'll see: `medical_records/{your_user_id}/{timestamp}_filename`

## Troubleshooting

### "Storage object not found"
→ Did you create the bucket? Check Step 1

### "Permission denied"
→ Did you run the SQL? Check Step 2
→ Is bucket set to **Private**? (not public)

### "User profile missing"
→ Normal! It auto-creates on first access

### "OCR not working"
→ Add `VITE_GOOGLE_CLOUD_VISION_API_KEY` to `.env`
→ Or ignore - system uses mock data as fallback

## What's Next?

Optional API keys for full features:
```env
VITE_OPENWEATHER_API_KEY=your-key        # Weather widget
VITE_GOOGLE_MAPS_API_KEY=your-key        # Location services
VITE_GOOGLE_CLOUD_VISION_API_KEY=your-key # OCR processing
```

Without these keys, the app still works with mock/fallback data!

## Support Files
- `COMPLETE_SUPABASE_SETUP.sql` - All SQL in one file
- `STORAGE_AND_AUTH_SETUP_GUIDE.md` - Detailed guide
- `COMPLETE_SETUP_SUMMARY.md` - Full feature list

---

**That's it!** You're ready to go. 🚀
