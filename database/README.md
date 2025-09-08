# Database Setup Guide

This guide will help you set up the Supabase database for the Insurance Prototype application.

## Prerequisites

1. A Supabase account (sign up at [supabase.com](https://supabase.com))
2. A new Supabase project created
3. Your Supabase project URL and anon key

## Environment Setup

1. Create a `.env` file in the root directory of your project:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

2. Replace `your_supabase_project_url` and `your_supabase_anon_key` with your actual Supabase project credentials.

## Database Schema Setup

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `database/schema.sql` into the SQL Editor
4. Click "Run" to execute the SQL commands

This will create:
- `user_profiles` table for storing user information
- `insurance_questionnaires` table for storing questionnaire responses
- Proper indexes for performance
- Row Level Security (RLS) policies for data protection
- Automatic timestamp update triggers

## Database Tables

### user_profiles
Stores basic user information:
- `id`: Primary key (UUID)
- `user_id`: Foreign key to auth.users (UUID)
- `email`: User's email address
- `first_name`: User's first name
- `last_name`: User's last name
- `full_name`: User's full name
- `phone`: Phone number (optional)
- `date_of_birth`: Date of birth (optional)
- `gender`: Gender (optional)
- `address`: Address information (JSONB)
- `created_at`: Timestamp of creation
- `updated_at`: Timestamp of last update

### insurance_questionnaires
Stores questionnaire responses and analysis:
- `id`: Primary key (UUID)
- `user_id`: Foreign key to auth.users (UUID)
- `demographics`: Demographics questionnaire data (JSONB)
- `health`: Health questionnaire data (JSONB)
- `lifestyle`: Lifestyle questionnaire data (JSONB)
- `financial`: Financial questionnaire data (JSONB)
- `ai_analysis`: AI analysis results (JSONB)
- `risk_score`: Calculated risk score (Integer)
- `premium_estimate`: Estimated premium (Decimal)
- `status`: Questionnaire status (draft, completed, approved, rejected)
- `created_at`: Timestamp of creation
- `updated_at`: Timestamp of last update

## Security

The database uses Row Level Security (RLS) to ensure:
- Users can only access their own profile data
- Users can only view and modify their own questionnaires
- All operations are authenticated through Supabase Auth

## Testing the Setup

After running the schema, you can test the setup by:

1. Starting your development server: `npm run dev`
2. Navigating to the signup page
3. Creating a new account
4. Checking the Supabase dashboard to see if the user profile was created

## Troubleshooting

### Common Issues:

1. **Environment variables not loaded**: Make sure your `.env` file is in the root directory and restart your development server.

2. **RLS policies blocking access**: Check that your policies are correctly set up in the SQL Editor.

3. **CORS errors**: Ensure your site URL is added to the Supabase project settings under Authentication > Settings.

4. **Table not found errors**: Make sure you've run the schema.sql file completely in the Supabase SQL Editor.

## Next Steps

Once the database is set up, you can:
- Test user registration and login
- Implement questionnaire data saving
- Add AI analysis integration
- Set up premium calculation logic

For any issues, check the Supabase logs in your project dashboard or the browser console for error messages.
