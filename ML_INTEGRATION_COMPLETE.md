# ML Model Integration - Complete Implementation Guide

## 🎉 Integration Complete!

Your Hugging Face ML model (XGBoost with 38 inputs, 80 features, 94.2% accuracy) has been successfully integrated into the SmartCover Insurance platform, creating a powerful hybrid AI system backed by Google Gemini.

---

## 📋 What Was Implemented

### 1. **Hugging Face ML Service** (`src/lib/huggingFaceService.ts`)
- ✅ Complete API client for your deployed model
- ✅ 38-parameter validation with type checking and constraints
- ✅ Request caching (1-hour TTL) to reduce redundant API calls
- ✅ Retry logic with exponential backoff (3 attempts)
- ✅ Response parsing for risk category, CLV, confidence, probabilities
- ✅ Utility functions for risk scoring and premium calculation
- ✅ Comprehensive error handling with detailed validation messages

### 2. **Intelligent Data Mapping** (`src/lib/mlDataMapper.ts`)
- ✅ Automatic transformation from questionnaire format to 38 ML inputs
- ✅ Smart field mapping (demographics → ML parameters)
- ✅ Health data normalization (blood pressure parsing, BMI calculation)
- ✅ Occupation and insurance type categorization
- ✅ Income range bucketing (Below 5L, 5L-10L, 10L-25L)
- ✅ City to region type mapping (Metro, Tier-1, Tier-2)
- ✅ Completion tracking (percentage + missing fields list)
- ✅ Handles partial data gracefully with intelligent defaults

### 3. **Hybrid Prediction Service** (`src/lib/hybridInsuranceService.ts`)
- ✅ Orchestrates ML model + Gemini AI collaboration
- ✅ ML predictions for quantitative analysis (risk, CLV, premium)
- ✅ Gemini enhancements for qualitative insights (advice, recommendations)
- ✅ Progressive prediction capability (real-time assessment at 60%+ completion)
- ✅ Combined insights generation with model agreement metrics
- ✅ Fallback to rule-based calculations when ML unavailable
- ✅ Confidence scoring and recommendation synthesis

### 4. **Enhanced Database Schema** (`supabase/migrations/20251026100000_add_ml_predictions_and_enhanced_security.sql`)
- ✅ Extended `insurance_questionnaires` table with ML fields:
  - `ml_risk_category`, `ml_risk_confidence`, `ml_risk_probabilities`
  - `ml_customer_lifetime_value`, `ml_monthly_premium`
  - `ml_derived_features` (BMI, health scores, diabetes/hypertension flags)
  - `data_completion_percentage`, `missing_fields`
  - `ml_prediction_timestamp`
- ✅ New `ml_predictions` table for complete audit trail
- ✅ Row-Level Security (RLS) policies - users only access their data
- ✅ Automated triggers for completion percentage calculation
- ✅ Helper function `get_user_ml_prediction_history()`
- ✅ Performance indexes on foreign keys and common queries

### 5. **ML-Powered Recommendations Dashboard** (`src/pages/dashboard/MLEnhancedRecommendationsPage.tsx`)
- ✅ Real-time risk score display (0-100 scale)
- ✅ ML-optimized premium estimates
- ✅ AI confidence score visualization
- ✅ Assessment completion tracking
- ✅ Risk probability distribution (Low/Medium/High percentages)
- ✅ Health insights panel (BMI, diabetes risk, hypertension detection)
- ✅ Derived features transparency (health risk score, financial risk score)
- ✅ Combined AI recommendations (ML + Gemini synthesis)
- ✅ Policy recommendations carousel
- ✅ Integrated AI chatbot for questions
- ✅ "Run ML Analysis" button with loading states
- ✅ Automatic database persistence of predictions

### 6. **Environment Configuration**
- ✅ Added `VITE_HF_API_URL` for your Hugging Face Space endpoint
- ✅ Added `VITE_HF_API_KEY` (optional) for authenticated requests
- ✅ Updated `.env.example` with documentation

---

## 🚀 Setup Instructions

### Step 1: Configure Environment Variables

Update your `.env` file:

```env
# Hugging Face ML Model API
VITE_HF_API_URL=https://huggingface.co/spaces/darsahran/insurance-ml-api
VITE_HF_API_KEY=your_optional_api_key_here
```

### Step 2: Run Database Migration

Apply the ML predictions schema:

```bash
# The migration will be auto-applied by Supabase
# Or manually run it in Supabase SQL Editor:
# supabase/migrations/20251026100000_add_ml_predictions_and_enhanced_security.sql
```

### Step 3: Verify Database Tables

In Supabase Dashboard:
1. Check `insurance_questionnaires` table has new ML columns
2. Confirm `ml_predictions` table exists
3. Verify RLS policies are enabled

### Step 4: Install Dependencies (if needed)

```bash
npm install axios
```

### Step 5: Test the Integration

1. Start the development server
2. Log in to the dashboard
3. Complete an insurance questionnaire
4. Navigate to "AI Recommendations" (dashboard/ai-recommendations)
5. Click "Run ML Analysis"
6. Observe ML predictions populate the dashboard

---

## 🔄 How the Hybrid System Works

### User Journey

```
1. User completes questionnaire
   ↓
2. Data auto-mapped to 38 ML parameters
   ↓
3. Completion validation (85%+ required for ML)
   ↓
4. ML model predicts:
   - Risk category (Low/Medium/High)
   - Risk confidence & probabilities
   - Customer Lifetime Value
   - Derived features (BMI, health scores)
   ↓
5. Gemini AI enhances with:
   - Personalized advice
   - Policy recommendations
   - Premium optimization tips
   ↓
6. Combined insights displayed:
   - Final risk assessment
   - Optimized premium
   - Confidence scores
   - Actionable recommendations
   ↓
7. Results saved to Supabase (encrypted, RLS-protected)
   ↓
8. User can chat with AI advisor for clarifications
```

### Data Flow Diagram

```
Questionnaire Data (demographics, health, lifestyle, financial)
        ↓
[MLDataMapper] → 38 Parameters
        ↓
[HuggingFaceMLService] → API Request → Your ML Model
        ↓
ML Response (risk, CLV, probabilities, derived features)
        ↓
[GeminiInsuranceService] → Enhanced Analysis
        ↓
[HybridInsuranceService] → Combined Insights
        ↓
[MLEnhancedRecommendationsPage] → User Interface
        ↓
[Supabase] → Secure Storage
```

---

## 📊 ML Model Integration Details

### Input Parameters (38 Required)

**Demographics (10):**
- age, gender, marital_status, education_level, city, region_type, annual_income_range, dependent_children_count, dependent_parents_count, occupation_type

**Health (12):**
- height_cm, weight_kg, blood_pressure_systolic, blood_pressure_diastolic, resting_heart_rate, blood_sugar_fasting, condition_heart_disease, condition_asthma, condition_thyroid, condition_cancer_history, condition_kidney_disease, smoking_status, years_smoking

**Lifestyle (5):**
- alcohol_consumption, exercise_frequency_weekly, sleep_hours_avg, stress_level

**Financial (7):**
- has_debt, is_sole_provider, has_savings, investment_capacity, coverage_amount_requested, policy_period_years, monthly_premium_budget, has_existing_policies

**Meta (4):**
- insurance_type_requested, num_assessments_started, num_assessments_completed

### Output Structure

```typescript
{
  risk_category: "Low" | "Medium" | "High",
  risk_confidence: 0.94,  // 0-1 scale
  risk_probabilities: {
    Low: 0.75,
    Medium: 0.20,
    High: 0.05
  },
  customer_lifetime_value: 125000,  // in rupees
  derived_features: {
    bmi: 24.2,
    bmi_category: "Normal",
    has_diabetes: false,
    has_hypertension: false,
    overall_health_risk_score: 0.32,
    financial_risk_score: 0.15,
    annual_income_midpoint: 750000
  }
}
```

---

## 🎯 Key Features

### 1. **Real-Time Progress Tracking**
- Shows completion percentage as user fills questionnaire
- Identifies missing critical fields
- Progressive prediction available at 60%+ completion

### 2. **Data Security**
- All predictions encrypted at rest in Supabase
- RLS policies ensure users only access their own data
- ML predictions logged with complete audit trail
- Request/response payloads stored for debugging

### 3. **Error Handling**
- Graceful fallback to rule-based calculation if ML fails
- Retry logic for transient API failures
- Detailed validation messages for missing/invalid fields
- User-friendly error messages in UI

### 4. **Performance Optimization**
- Request caching (1-hour TTL) prevents duplicate API calls
- Lazy loading of ML results section
- Optimized database queries with indexes
- Progressive data loading

### 5. **User Engagement**
- Animated progress bars and transitions
- Real-time risk probability visualization
- Interactive AI chatbot for clarifications
- "Ask AI Advisor" for personalized guidance
- One-click "Run ML Analysis" button

---

## 🧪 Testing Checklist

### Functional Testing
- [ ] Complete questionnaire with all 38 fields
- [ ] Click "Run ML Analysis" and verify API call succeeds
- [ ] Confirm risk category, score, and premium display correctly
- [ ] Check derived features (BMI, diabetes, hypertension) are accurate
- [ ] Verify probabilities sum to ~100%
- [ ] Test with partial data (< 85% completion) - should use fallback
- [ ] Open AI chatbot and ask questions
- [ ] Verify predictions save to Supabase correctly
- [ ] Check RLS - users cannot see each other's predictions

### Edge Cases
- [ ] Test with missing optional fields (should use defaults)
- [ ] Test with invalid values (should show validation errors)
- [ ] Test with network timeout (should retry then fallback)
- [ ] Test with Gemini API disabled (should still show ML results)
- [ ] Test with ML API disabled (should use rule-based calculation)

### Performance
- [ ] Verify caching works (repeated identical requests return instantly)
- [ ] Check database queries use indexes (explain analyze in Supabase)
- [ ] Measure API response time (should be < 5 seconds)
- [ ] Test with 10+ concurrent users (load testing)

---

## 📈 Monitoring & Analytics

### Database Queries

**Get user's prediction history:**
```sql
SELECT * FROM get_user_ml_prediction_history('user-id', 10);
```

**Check ML prediction success rate:**
```sql
SELECT
  COUNT(*) FILTER (WHERE is_successful = true) as successful,
  COUNT(*) FILTER (WHERE is_successful = false) as failed,
  ROUND(100.0 * COUNT(*) FILTER (WHERE is_successful = true) / COUNT(*), 2) as success_rate
FROM ml_predictions
WHERE created_at > NOW() - INTERVAL '7 days';
```

**Average processing time:**
```sql
SELECT AVG(processing_time_ms) as avg_ms
FROM ml_predictions
WHERE created_at > NOW() - INTERVAL '24 hours';
```

---

## 🐛 Troubleshooting

### Issue: "No questionnaire data found"
**Solution:** User must complete questionnaire first. Redirect to `/dashboard/assessment/new`

### Issue: ML API returns 400 validation error
**Solution:** Check browser console for specific missing/invalid fields. Update `mlDataMapper.ts` mapping logic.

### Issue: "Failed to generate ML recommendations"
**Solution:**
1. Verify `VITE_HF_API_URL` is correct
2. Check Hugging Face Space is running (not sleeping)
3. Review browser network tab for detailed error
4. System will automatically fall back to rule-based calculation

### Issue: Predictions not saving to database
**Solution:**
1. Check RLS policies in Supabase
2. Verify user is authenticated
3. Check Supabase logs for INSERT errors
4. Confirm migration was applied successfully

---

## 🔮 Future Enhancements

- [ ] Real-time prediction during questionnaire (progressive updates)
- [ ] A/B testing between ML and rule-based predictions
- [ ] Model versioning and rollback capability
- [ ] Explainability dashboard (SHAP values, feature importance)
- [ ] Batch prediction API for multiple users
- [ ] Mobile-optimized ML dashboard
- [ ] Export predictions to PDF report
- [ ] Integration with policy purchase flow
- [ ] Personalized improvement plan generator
- [ ] Predictive alerts for risk changes over time

---

## 📞 Support

If you encounter any issues:
1. Check browser console for errors
2. Review Supabase logs in dashboard
3. Verify environment variables are set correctly
4. Test with mock data first (no API key)
5. Check Hugging Face Space logs for API errors

---

## ✅ Success Criteria

Your integration is working correctly if:
- ✅ ML predictions populate dashboard after "Run ML Analysis"
- ✅ Risk category, score, and premium are reasonable
- ✅ Derived features (BMI, health scores) match user inputs
- ✅ Predictions persist in Supabase
- ✅ System gracefully handles API failures with fallback
- ✅ Users can only access their own predictions (RLS working)
- ✅ AI chatbot provides personalized advice based on ML results

---

**Integration Date:** October 26, 2025
**ML Model Version:** v1.0
**Model Accuracy:** 94.2%
**Training Data:** 10,000+ validated cases
**Technologies:** XGBoost, Google Gemini AI, Supabase, React + TypeScript

---

🎊 **Congratulations!** Your SmartCover Insurance platform now features a state-of-the-art hybrid AI system combining the predictive power of machine learning with the intelligence of generative AI!
