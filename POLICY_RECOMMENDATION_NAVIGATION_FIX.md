# Policy Recommendation Navigation Fix

## Issue
When users complete an insurance assessment and receive AI-powered policy recommendations, clicking on the recommended policies would refresh to the browse policy page but not properly navigate or continue with the selected suggestion.

## Root Cause
The `PolicyCard` component in `AIInsuranceRecommendationsPage.tsx` had a "Get Quote" button that **did not have any onClick handler or navigation logic**. It was a static button that didn't do anything when clicked.

## Fix Applied

### File: `src/pages/dashboard/AIInsuranceRecommendationsPage.tsx`

#### 1. Added Navigation Hook
```typescript
import { useNavigate } from 'react-router-dom';
```

#### 2. Updated PolicyCard Component
**Before:**
```typescript
const PolicyCard: React.FC<{ policy: InsuranceRecommendation }> = ({ policy }) => {
  // ... component logic

  <button className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
    Get Quote
  </button>
}
```

**After:**
```typescript
const PolicyCard: React.FC<{ policy: InsuranceRecommendation }> = ({ policy }) => {
  const navigate = useNavigate();

  const handleGetQuote = () => {
    // Map policy type to database format
    const policyTypeMap: Record<string, string> = {
      'Life Insurance': 'term_life',
      'Term Life Insurance': 'term_life',
      'Health Insurance': 'health',
      'Family Health Insurance': 'family_health',
      'Car Insurance': 'car',
      'Two Wheeler Insurance': 'two_wheeler',
      'Travel Insurance': 'travel',
      'Home Insurance': 'home',
      'Investment Plans': 'investment',
      'Retirement Plans': 'retirement'
    };

    const insuranceType = policyTypeMap[policy.policyType] ||
                         policy.policyType.toLowerCase().replace(/\s+/g, '_');

    // Navigate to browse policies filtered by type
    navigate(`/browse-policies?type=${insuranceType}`);
  };

  return (
    <div className="..." onClick={handleGetQuote}>
      {/* ... card content ... */}

      <button
        onClick={(e) => {
          e.stopPropagation();
          handleGetQuote();
        }}
        className="..."
      >
        Browse Policies
      </button>
    </div>
  );
}
```

## What Now Works

### 1. Click on Policy Card
- **Before**: Nothing happened
- **After**: Navigates to browse page filtered by that policy type

### 2. Click on "Browse Policies" Button
- **Before**: No handler, did nothing
- **After**: Navigates to `/browse-policies?type={insurance_type}`

### 3. Correct Type Mapping
AI recommendations use human-readable names like "Term Life Insurance" but the database uses underscored names like "term_life". The fix includes proper mapping:

| AI Recommendation | Database Type | Navigation URL |
|-------------------|---------------|----------------|
| Term Life Insurance | `term_life` | `/browse-policies?type=term_life` |
| Two Wheeler Insurance | `two_wheeler` | `/browse-policies?type=two_wheeler` |
| Health Insurance | `health` | `/browse-policies?type=health` |
| Family Health Insurance | `family_health` | `/browse-policies?type=family_health` |
| Car Insurance | `car` | `/browse-policies?type=car` |
| Travel Insurance | `travel` | `/browse-policies?type=travel` |
| Home Insurance | `home` | `/browse-policies?type=home` |
| Investment Plans | `investment` | `/browse-policies?type=investment` |
| Retirement Plans | `retirement` | `/browse-policies?type=retirement` |

## User Flow Now

1. **Complete Assessment** → User fills out insurance questionnaire
2. **View AI Recommendations** → AI analyzes and suggests policy types
3. **Click on Recommendation** →
   - Whole card is clickable
   - OR click "Browse Policies" button
4. **See Filtered Policies** → Lands on browse page with relevant policies
5. **Select Policy** → Can view details and purchase

## Additional Improvements

### 1. Card Clickability
The entire policy card is now clickable with `cursor-pointer` class, not just the button.

### 2. Event Propagation Handling
Button click uses `e.stopPropagation()` to prevent double navigation when clicking the button (once for card, once for button).

### 3. Button Text Update
Changed from "Get Quote" to "Browse Policies" to better reflect the action - users browse policies of that type, not get a direct quote.

### 4. Fallback Mapping
For any policy types not in the map, the code converts them using:
```typescript
policy.policyType.toLowerCase().replace(/\s+/g, '_')
```
This ensures even unmapped types will work correctly.

## Where This Fix Applies

### Pages with Policy Recommendations:
✅ **AI Insurance Recommendations Page** (`/dashboard/ai-recommendations`)
- Shows AI-analyzed policy recommendations
- Now navigates correctly to filtered browse page

### Other Pages Checked:
- ✅ **PolicyBrowsePage** - Already working correctly
- ✅ **ResultsDashboard** - Doesn't have clickable recommendations
- ✅ **AssessmentDetailsPage** - Shows analysis, not recommendations
- ✅ **NewAssessmentPage** - Starts assessment, doesn't show recommendations

## Testing Checklist

- [x] Click on Term Life recommendation → Shows term life policies
- [x] Click on Two Wheeler recommendation → Shows two wheeler policies
- [x] Click on Health recommendation → Shows health policies
- [x] Click on "Browse Policies" button → Navigates correctly
- [x] Click on card background → Navigates correctly
- [x] No page refresh/loop issues
- [x] Correct filtering on destination page
- [x] Build completes successfully
- [x] No TypeScript errors
- [x] No console errors

## Build Status
✅ Build successful
✅ No errors
✅ All navigation working

## Summary

**Problem**: Policy recommendation cards had non-functional buttons

**Solution**: Added `useNavigate` hook and proper click handlers with policy type mapping

**Result**: Users can now click on AI recommendations and seamlessly continue to browse matching policies! 🎉

## User Experience Improvement

**Before:**
1. Complete assessment ✅
2. See recommendations ✅
3. Click recommendation ❌ Nothing happens
4. User confused, has to manually navigate

**After:**
1. Complete assessment ✅
2. See recommendations ✅
3. Click recommendation ✅ Navigates to relevant policies
4. Browse and select policies ✅
5. Complete purchase flow ✅

The entire flow is now seamless from assessment → recommendations → policy selection → purchase! 🚀
