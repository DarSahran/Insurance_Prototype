# Quick Setup Checklist

Use this checklist to ensure your insurance marketplace is properly configured and ready to accept payments.

## ✅ Pre-Flight Checklist

### 1. Environment Variables
- [ ] `VITE_STRIPE_PUBLISHABLE_KEY` is set in `.env`
- [ ] `STRIPE_SECRET_KEY` is set in Supabase Edge Function secrets
- [ ] `VITE_SUPABASE_URL` is configured
- [ ] `VITE_SUPABASE_ANON_KEY` is configured

### 2. Stripe Configuration
- [ ] Logged into Stripe Dashboard
- [ ] Created all 10 products (see STRIPE_PRODUCTS_SETUP.md)
- [ ] All products have prices in INR (amounts in paise)
- [ ] All products have `policy_type` metadata
- [ ] Webhook endpoint configured for payment confirmations
- [ ] Webhook secret added to environment

### 3. Database Setup
- [ ] Supabase project is active
- [ ] All migrations have been run
- [ ] `policy_catalog` table has policy data
- [ ] `policy_providers` table has provider data
- [ ] `quick_policies` table exists
- [ ] Row Level Security (RLS) policies are enabled

### 4. Edge Functions
- [ ] `create-payment-intent` function is deployed
- [ ] Function has STRIPE_SECRET_KEY in secrets
- [ ] Function is accessible (test with curl)
- [ ] CORS headers are properly configured

## 🧪 Testing Checklist

### Test Each Policy Type

Run through this flow for each of the 10 insurance types:

1. **Term Life Insurance**
   - [ ] Browse to policy page
   - [ ] Click "Get Quote"
   - [ ] Complete 7-step assessment
   - [ ] See premium in INR
   - [ ] Proceed to checkout
   - [ ] Complete payment with test card
   - [ ] Verify success page loads
   - [ ] Check policy in database

2. **Health Insurance**
   - [ ] Same flow as above

3. **Family Health Insurance**
   - [ ] Same flow as above

4. **Car Insurance**
   - [ ] Same flow as above

5. **Two Wheeler Insurance**
   - [ ] Same flow as above

6. **Investment Plans**
   - [ ] Same flow as above

7. **Travel Insurance**
   - [ ] Same flow as above

8. **Retirement Plans**
   - [ ] Same flow as above

9. **Home Insurance**
   - [ ] Same flow as above

10. **Term with ROP**
    - [ ] Same flow as above

### Test Authentication Flow

- [ ] Complete assessment without login
- [ ] Redirected to signup page
- [ ] Sign up successfully
- [ ] Redirected to checkout with assessment data
- [ ] Assessment data is preserved
- [ ] Can complete payment

### Test Payment Scenarios

- [ ] Test successful payment (4242 4242 4242 4242)
- [ ] Test declined payment (4000 0000 0000 0002)
- [ ] Test 3D Secure payment (4000 0027 6000 3184)
- [ ] Verify proper error messages
- [ ] Verify success page loads after payment
- [ ] Check policy created in database
- [ ] Verify Stripe dashboard shows payment

### Test Currency Display

- [ ] All prices show ₹ symbol
- [ ] Policy details page shows INR
- [ ] Assessment wizard shows INR premium
- [ ] Checkout page shows INR amounts
- [ ] Success page shows INR
- [ ] No USD symbols anywhere

## 🐛 Troubleshooting Quick Checks

### White Page After Payment?
- [ ] Check browser console for errors
- [ ] Verify `navigate()` is being called
- [ ] Check that success route exists in App.tsx
- [ ] Verify policy creation doesn't throw errors

### Payment Not Processing?
- [ ] Check Stripe secret key is set
- [ ] Verify amount is in paise (multiply by 100)
- [ ] Check currency is 'inr' (lowercase)
- [ ] Verify Stripe publishable key is correct
- [ ] Check browser console for Stripe errors

### Assessment Data Lost?
- [ ] Check sessionStorage has 'pendingAssessment'
- [ ] Verify localStorage has 'redirectAfterAuth'
- [ ] Check SignupPage handles redirect correctly
- [ ] Verify CheckoutPage reads from state

### Wrong Currency Showing?
- [ ] Check all formatCurrency functions use 'INR'
- [ ] Verify all formatCurrency use 'en-IN' locale
- [ ] Check database values are in INR
- [ ] Verify Stripe products are priced in paise

## 📊 Stripe Dashboard Checks

After creating products, verify in Stripe Dashboard:

- [ ] Navigate to Products
- [ ] See all 10 products listed
- [ ] Each product has correct price in INR
- [ ] Each product has `policy_type` metadata
- [ ] Product IDs start with `prod_`
- [ ] Price IDs start with `price_`

After test payment:

- [ ] Navigate to Payments
- [ ] See test payment listed
- [ ] Amount shows in INR
- [ ] Status shows "Succeeded"
- [ ] Metadata includes policy information

## 🚀 Go Live Checklist

Before production:

- [ ] Replace test Stripe keys with live keys
- [ ] Update all product prices to production values
- [ ] Configure production webhook endpoint
- [ ] Test with real payment methods
- [ ] Enable email notifications
- [ ] Set up monitoring and alerts
- [ ] Review and test all RLS policies
- [ ] Perform security audit
- [ ] Test error scenarios
- [ ] Prepare support documentation

## 📚 Documentation

Make sure you have read:

- [ ] `IMPLEMENTATION_FIXES_SUMMARY.md` - What was fixed
- [ ] `STRIPE_PRODUCTS_SETUP.md` - How to configure Stripe
- [ ] This checklist - Step-by-step verification

## 💡 Quick Commands

### Start Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Run Tests (if configured)
```bash
npm test
```

### Deploy Edge Functions
```bash
# Already deployed, no action needed
```

## ✅ Final Verification

After completing all checklists above:

- [ ] All 10 policy types are working
- [ ] All amounts display in INR
- [ ] Payment flow works end-to-end
- [ ] No white pages or errors
- [ ] Assessment data persists through signup
- [ ] Success page shows policy details
- [ ] Stripe dashboard shows payments
- [ ] Database shows created policies

## 🎉 You're Ready!

Once all checkboxes are checked, your insurance marketplace is ready for users to browse policies, complete assessments, and purchase insurance!

---

**Need Help?**

Refer to:
1. Browser console for frontend errors
2. Supabase logs for backend errors
3. Stripe dashboard for payment issues
4. `STRIPE_PRODUCTS_SETUP.md` for detailed Stripe setup
5. `IMPLEMENTATION_FIXES_SUMMARY.md` for understanding what changed
