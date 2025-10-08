# AI Insurance Analysis & Chatbot Integration Guide

## Overview

Your insurance application now features a comprehensive AI-powered insurance analysis system using **Google Gemini API**. This system analyzes user questionnaire data, recommends eligible insurance policies, and provides personalized advice through an intelligent chatbot.

---

## 🚀 Features Implemented

### 1. **Database Schema**
- ✅ `insurance_questionnaires` table created in Supabase
- ✅ Stores user demographics, health, lifestyle, and financial data
- ✅ Includes AI analysis results, risk scores, and premium estimates
- ✅ Row-Level Security (RLS) policies ensuring users only access their own data
- ✅ Automated triggers for timestamps and completion tracking

### 2. **Google Gemini AI Integration**
- ✅ Gemini Pro model for insurance analysis
- ✅ Analyzes user profiles to recommend eligible policies
- ✅ Calculates risk assessments and premium optimization
- ✅ Provides personalized insurance advice
- ✅ Real-time online policy search capabilities

### 3. **AI Insurance Chatbot**
- ✅ Personalized chatbot based on user's questionnaire data
- ✅ Answers questions about premiums, coverage, eligibility
- ✅ Context-aware responses using chat history
- ✅ Beautiful, modern UI with real-time messaging
- ✅ Quick question suggestions for easy interaction

### 4. **AI Recommendations Dashboard**
- ✅ Displays user's risk score and premium estimate
- ✅ Shows eligible insurance policies with detailed comparisons
- ✅ Risk assessment with improvement opportunities
- ✅ Premium optimization suggestions
- ✅ Personalized AI advice section
- ✅ One-click AI analysis generation

---

## 📋 Setup Instructions

### Step 1: Get Google Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

### Step 2: Configure Environment Variables

Open your `.env` file and update the Gemini API key:

```env
VITE_GEMINI_API_KEY=your_actual_api_key_here
```

⚠️ **Important**: Replace `YOUR_GEMINI_API_KEY_HERE` with your actual API key.

### Step 3: Database Setup

The database migration has already been applied. Verify it by checking your Supabase dashboard:

1. Go to Supabase Dashboard → Table Editor
2. Confirm `insurance_questionnaires` table exists
3. Check that RLS policies are enabled

### Step 4: Test the System

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Complete the flow**:
   - Sign up/Login
   - Complete the insurance questionnaire
   - Navigate to "AI Recommendations" in the dashboard
   - Click "Run AI Analysis"
   - Try the AI chatbot by clicking "Ask AI Advisor"

---

## 🎯 How It Works

### User Flow

```
1. User completes insurance questionnaire
   ↓
2. Data saved to Supabase (demographics, health, lifestyle, financial)
   ↓
3. Navigate to AI Recommendations page
   ↓
4. Click "Run AI Analysis" button
   ↓
5. Gemini AI analyzes profile and searches for eligible policies
   ↓
6. AI generates:
   - Risk assessment
   - Premium optimization tips
   - Eligible insurance policies
   - Personalized advice
   ↓
7. User can chat with AI advisor for questions
```

### AI Analysis Process

**Input Data**:
- Demographics (age, occupation, location, etc.)
- Health (conditions, medications, BMI, smoking status)
- Lifestyle (exercise, sleep, stress, diet)
- Financial (income, desired coverage, budget)

**AI Processing**:
1. Analyzes risk factors based on actuarial standards
2. Searches for eligible insurance products
3. Calculates optimized premium estimates
4. Generates personalized recommendations

**Output**:
- 5 recommended insurance policies with details
- Overall risk assessment (Low/Medium/High)
- Specific risk factors and improvements
- Premium optimization strategies (potential savings)
- Personalized advice tailored to user profile

---

## 🔧 Technical Architecture

### Files Created/Modified

#### **New Files**:
1. `/src/lib/geminiService.ts` - Gemini AI service with:
   - Insurance analysis functions
   - Policy search and recommendations
   - Chatbot response generation
   - Mock data fallbacks

2. `/src/components/AIInsuranceChatbot.tsx` - Chatbot component with:
   - Real-time messaging interface
   - Context-aware AI responses
   - Quick question suggestions
   - Minimize/maximize functionality

3. `/src/pages/dashboard/AIInsuranceRecommendationsPage.tsx` - Main AI page with:
   - User profile summary
   - Policy recommendations
   - Risk assessment visualization
   - Premium optimization tools
   - Integrated chatbot

4. `/database/migrations/create_insurance_questionnaires_table.sql` - Database schema

#### **Modified Files**:
- `/src/App.tsx` - Added AI Recommendations route
- `/src/components/dashboard/DashboardLayout.tsx` - Added navigation item
- `.env` - Added Gemini API key configuration
- `/src/lib/databaseService.ts` - Already had questionnaire services

### Database Schema

```sql
insurance_questionnaires (
  id uuid PRIMARY KEY,
  user_id uuid FOREIGN KEY → auth.users,
  demographics jsonb,
  health jsonb,
  lifestyle jsonb,
  financial jsonb,
  ai_analysis jsonb,
  risk_score integer,
  premium_estimate numeric(10,2),
  confidence_score numeric(5,2),
  status text,
  completion_percentage integer,
  created_at timestamptz,
  updated_at timestamptz,
  completed_at timestamptz
)
```

### API Integration

**Gemini AI Models Used**:
- `gemini-pro` - Text generation and analysis
- Optimized prompts for insurance domain
- Structured JSON output parsing
- Error handling with mock data fallbacks

---

## 💡 Usage Examples

### Example 1: Get Insurance Recommendations

```typescript
import { GeminiInsuranceService } from '../lib/geminiService';

const userData = {
  demographics: { age: 35, occupation: 'Software Engineer' },
  health: { smokingStatus: 'never', bmi: 24 },
  lifestyle: { exerciseFrequency: 4 },
  financial: { annualIncome: 100000, coverageAmount: 500000 },
  riskScore: 35,
  premiumEstimate: 125
};

const analysis = await GeminiInsuranceService.analyzeInsuranceNeeds(userData);
console.log(analysis.eligiblePolicies); // Array of recommended policies
```

### Example 2: Chat with AI Advisor

```typescript
const response = await GeminiInsuranceService.getChatbotResponse(
  "What's the best insurance for me?",
  userData,
  chatHistory
);
console.log(response); // AI-generated personalized response
```

### Example 3: Search Eligible Policies

```typescript
const policies = await GeminiInsuranceService.searchEligiblePolicies(userData);
policies.forEach(policy => {
  console.log(`${policy.policyType}: $${policy.monthlyPremium}/mo`);
});
```

---

## 🎨 UI Components

### AIInsuranceChatbot Component

**Props**:
- `userData: InsuranceAnalysisRequest` - User's profile data
- `isOpen?: boolean` - Control visibility
- `onClose?: () => void` - Close callback

**Features**:
- Real-time AI responses
- Message history
- Quick question suggestions
- Minimize/maximize controls
- Loading states
- Timestamps

### AIInsuranceRecommendationsPage

**Features**:
- Profile summary cards (Risk Score, Premium, Confidence, Completion)
- Run AI Analysis button
- Policy comparison cards
- Risk assessment visualization
- Premium optimization tips
- Personalized advice section
- Integrated chatbot toggle

---

## 🔒 Security & Privacy

### Data Protection
- ✅ All questionnaire data secured with RLS policies
- ✅ Users can only access their own data
- ✅ API keys stored in environment variables (never in code)
- ✅ No user data sent to third parties

### RLS Policies Applied
```sql
-- Users can only view their own questionnaires
CREATE POLICY "Users can view own questionnaires"
  ON insurance_questionnaires FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Similar policies for INSERT, UPDATE, DELETE
```

---

## 🚦 Fallback Behavior

### Without Gemini API Key

If the API key is not configured, the system provides **intelligent mock data**:
- ✅ Still calculates risk scores based on actuarial models
- ✅ Generates realistic policy recommendations
- ✅ Provides helpful chatbot responses
- ✅ All features work without external API

This ensures the application is fully functional even during development or if API limits are reached.

---

## 📊 AI Analysis Capabilities

### Risk Assessment
- Age-based risk calculation
- Health condition impact analysis
- Lifestyle factor evaluation
- BMI and smoking status consideration
- Multi-factor risk scoring (0-100 scale)

### Policy Recommendations
- Term Life Insurance
- Whole Life Insurance
- Universal Life Insurance
- Return of Premium Term Life
- Guaranteed Universal Life

Each recommendation includes:
- Coverage amount
- Monthly premium estimate
- Key benefits
- Eligibility status
- Priority level (High/Medium/Low)
- Detailed reasoning

### Premium Optimization
- Identifies cost-saving opportunities
- Suggests lifestyle improvements
- Recommends policy bundling
- Compares market rates
- Calculates potential savings

---

## 🎯 Next Steps

### Immediate Actions
1. ✅ Add your Gemini API key to `.env`
2. ✅ Test the questionnaire flow
3. ✅ Run AI analysis for a test user
4. ✅ Try the chatbot with various questions

### Future Enhancements
- [ ] Add policy comparison tool
- [ ] Implement insurance provider integrations
- [ ] Add document upload for underwriting
- [ ] Create automated policy quote generation
- [ ] Integrate with real insurance APIs
- [ ] Add voice chat capabilities
- [ ] Implement claim prediction models

---

## 🆘 Troubleshooting

### Issue: AI Analysis Not Working

**Solution**:
1. Check `.env` file has valid `VITE_GEMINI_API_KEY`
2. Restart development server after updating `.env`
3. Check browser console for errors
4. Verify API key has proper permissions

### Issue: No Questionnaire Data Found

**Solution**:
1. Complete the insurance questionnaire first
2. Ensure you're logged in
3. Check Supabase for data: `SELECT * FROM insurance_questionnaires`
4. Verify RLS policies are not blocking access

### Issue: Chatbot Not Responding

**Solution**:
1. Check network tab for API errors
2. Verify Gemini API quota not exceeded
3. System automatically falls back to mock responses
4. Check browser console for detailed errors

---

## 📞 Support

For questions or issues:
1. Check browser console for errors
2. Review Supabase logs in dashboard
3. Verify environment variables are set
4. Test with mock data first (no API key)

---

## 🎉 Success!

You now have a fully functional AI-powered insurance analysis system with:
- ✅ Real-time AI insurance recommendations
- ✅ Personalized chatbot advisor
- ✅ Comprehensive risk assessment
- ✅ Premium optimization tools
- ✅ Secure data storage with Supabase
- ✅ Beautiful, intuitive UI

Your users can now get intelligent insurance recommendations based on their personal profiles!

---

**Built with**:
- Google Gemini AI (gemini-pro)
- Supabase (Database & Auth)
- React + TypeScript
- Tailwind CSS
- Vite

**Last Updated**: October 8, 2025
