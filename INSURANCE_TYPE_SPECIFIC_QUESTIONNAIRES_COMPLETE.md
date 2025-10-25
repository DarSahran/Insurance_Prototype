# Insurance Type-Specific Questionnaires Implementation

## ✅ COMPLETE - All Insurance Types Have Unique Questionnaires

### What Was Fixed

1. **Created Type-Specific Questions** (`src/data/insuranceQuestions.ts`)
   - 10 different insurance types, each with unique questions
   - Each question tagged with ML feature name and category
   - Questions optimized for ML model training

2. **Updated Database Schema**
   - Added `insurance_type` column (term_life, health, car, etc.)
   - Added `type_specific_data` JSONB column for storing answers
   - Created indexes for fast queries
   - Applied proper RLS policies

3. **Rebuilt Questionnaire Wizard**
   - Now accepts `insuranceType` prop
   - Dynamically loads questions based on insurance type
   - Auto-saves with correct insurance type
   - 2-step process: Questionnaire → AI Analysis

4. **Created Dynamic Form Component** (`src/components/DynamicQuestionnaireForm.tsx`)
   - Renders any question type dynamically
   - Supports: text, number, date, select, multiselect, boolean, range
   - Beautiful UI with gradients and hover effects
   - Groups questions by category

5. **Proper Data Persistence**
   - Each insurance type saves separately
   - Data stored in `type_specific_data` column
   - Includes insurance_type for filtering
   - Auto-save every 2 seconds

## Insurance Types & Their Questions

### 1. **Term Life Insurance** (18 questions)
- Demographics: name, DOB, gender, marital status, dependents, occupation, location, income
- Coverage: coverage amount, policy term, nominee
- Health: height, weight, smoking, alcohol, medical conditions, family history
- Lifestyle: exercise frequency

### 2. **Health Insurance** (19 questions)
- Demographics: standard fields
- Coverage: coverage amount, prior insurance, preferred hospitals
- Health: BMI, medical conditions, hospitalizations, surgeries, medications, smoking, alcohol, exercise

### 3. **Family Health Insurance** (13 questions)
- Demographics: standard + family size
- Coverage: family coverage amount, ages of members, senior citizens, children
- Health: family medical history, maternity coverage needs

### 4. **Car Insurance** (15 questions)
- Demographics: basic fields
- Vehicle: make, model, year, value
- Coverage: type (third party/comprehensive/zero depreciation)
- History: driving experience, claim history, parking, mileage

### 5. **Two Wheeler Insurance** (12 questions)
- Similar to car but simplified
- Bike-specific makes and models

### 6. **Travel Insurance** (9 questions)
- Demographics: basic fields
- Travel: destination, duration, number of travelers, type
- Coverage: amount
- Health: pre-existing conditions, adventure activities

### 7. **Investment Plans** (10 questions)
- Demographics: standard fields
- Financial: investment goal, amount, tenure, risk appetite, existing investments

### 8. **Retirement Plans** (10 questions)
- Demographics: standard fields
- Financial: retirement age, current expenses, desired income, existing corpus, investment capacity

### 9. **Home Insurance** (12 questions)
- Demographics: basic fields
- Property: type, value, construction year, contents value
- Security: features, disaster zone location

### 10. **Term with Return of Premium** (19 questions)
- Same as Term Life + premium return preference

## Database Structure

```sql
CREATE TABLE insurance_questionnaires (
  id uuid PRIMARY KEY,
  user_id uuid NOT NULL,
  insurance_type text NOT NULL,  -- NEW
  type_specific_data jsonb,       -- NEW: stores all answers
  ai_analysis jsonb,
  risk_score integer,
  premium_estimate numeric,
  status text,
  completion_percentage integer,
  created_at timestamptz,
  updated_at timestamptz
);
```

## ML Training Data Structure

Check `ML_TRAINING_QUESTIONS.json` for complete structure including:

### Features by Category
- **Demographics**: age, gender, marital status, occupation, location, income, dependents
- **Health**: height, weight, BMI, medical conditions, smoking, alcohol, exercise, hospitalizations
- **Vehicle**: make, model, year, value, coverage type, mileage
- **Financial**: income, coverage amount, investment goals, risk appetite
- **Lifestyle**: exercise, driving experience, parking type
- **History**: claims, surgeries, hospitalizations

### ML Feature Types
- **Categorical**: gender, occupation, smoking status, coverage type
- **Numeric**: age, income, height, weight, coverage amount, exercise frequency
- **Multi-categorical**: medical conditions, family history
- **Boolean**: has nominee, prior insurance, claim history
- **Derived**: BMI, age group, coverage-to-income ratio, vehicle age

### Target Variables for ML
1. **risk_score** (0-100) - Regression
2. **premium_estimate** (INR) - Regression
3. **coverage_recommendation** (Basic/Standard/Comprehensive/Premium) - Classification
4. **policy_suitability_score** (0-1) - Regression

### Recommended ML Models
- XGBoost Regressor/Classifier
- Random Forest
- Gradient Boosting Machines
- Neural Networks (MLP)
- Ensemble methods

### Data Preprocessing
1. Handle missing values (median/mode imputation)
2. Encode categorical variables (LabelEncoder/OneHotEncoder)
3. Normalize numerical features (StandardScaler/MinMaxScaler)
4. Create derived features (BMI, age groups, ratios)
5. Handle multi-categorical with MultiLabelBinarizer
6. Feature engineering for interaction terms
7. Remove outliers (IQR/Z-score)
8. Balance dataset with SMOTE if needed

## How It Works Now

1. User clicks "Start Assessment" for any insurance type
2. System loads type-specific questions from `INSURANCE_QUESTIONS_MAP`
3. Dynamic form renders all questions grouped by category
4. User fills in all required fields (validated in real-time)
5. Data auto-saves every 2 seconds to Supabase
6. Click Next → AI processes data
7. Risk score & premium calculated based on answers
8. Final data saved with:
   - `insurance_type`: which insurance
   - `type_specific_data`: all answers
   - `risk_score`: calculated score
   - `premium_estimate`: calculated premium
   - `ai_analysis`: recommendations

## Files Created/Modified

### New Files
- `src/data/insuranceQuestions.ts` - All questions for all types
- `src/components/DynamicQuestionnaireForm.tsx` - Dynamic form renderer
- `ML_TRAINING_QUESTIONS.json` - ML training structure

### Modified Files
- `src/components/QuestionnaireWizard.tsx` - Now type-aware
- `src/pages/dashboard/NewAssessmentPage.tsx` - Passes insurance type
- Database schema - Added columns and indexes

### Migration Applied
- `supabase/migrations/20251025135037_add_insurance_type_specific_questionnaires.sql`

## Next Steps for ML Training

1. **Export Data**: Query database to get all questionnaires with answers
```sql
SELECT
  insurance_type,
  type_specific_data,
  risk_score,
  premium_estimate,
  ai_analysis,
  created_at
FROM insurance_questionnaires
WHERE status = 'completed';
```

2. **Feature Engineering**: Use derived features from JSON structure

3. **Train Models**:
   - Split data by insurance type or train one model for all
   - Use features from `ML_TRAINING_QUESTIONS.json`
   - Target variables: risk_score, premium_estimate

4. **Deploy Model**: Replace calculation functions with ML predictions

5. **Continuous Learning**: Retrain models as more data collected

## Summary

✅ Each insurance type has unique, relevant questions
✅ Data stored properly with insurance type
✅ Questions optimized for ML training
✅ Complete ML feature structure documented
✅ Dynamic form handles all question types
✅ Auto-save works correctly
✅ Build successful

All 10 insurance types now have proper, type-specific questionnaires!
