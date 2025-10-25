# Stripe Products Configuration Guide

This guide provides step-by-step instructions for setting up all insurance policy products in your Stripe Dashboard.

## Important Notes

1. **Currency**: All products and prices should be configured in INR (Indian Rupees)
2. **Amount Format**: Stripe requires amounts in paise (1 INR = 100 paise)
3. **Product Naming**: Use clear, descriptive names for easy identification
4. **Metadata**: Add policy type as metadata for tracking

## Required Products

You need to create 10 products in your Stripe Dashboard, one for each insurance type:

### 1. Term Life Insurance
- **Product Name**: Term Life Insurance
- **Description**: Financial protection for your loved ones with term life coverage
- **Metadata**:
  - `policy_type`: `term-life`
  - `category`: `life_insurance`
- **Price**:
  - Base Annual Premium: ₹5,000 (500000 paise)
  - Billing: One-time or Annual subscription

### 2. Health Insurance
- **Product Name**: Health Insurance
- **Description**: Comprehensive health coverage for medical expenses
- **Metadata**:
  - `policy_type`: `health`
  - `category`: `health_insurance`
- **Price**:
  - Base Annual Premium: ₹8,000 (800000 paise)
  - Billing: Annual subscription

### 3. Family Health Insurance
- **Product Name**: Family Health Insurance
- **Description**: Complete health protection for entire family
- **Metadata**:
  - `policy_type`: `family_health`
  - `category`: `health_insurance`
- **Price**:
  - Base Annual Premium: ₹12,000 (1200000 paise)
  - Billing: Annual subscription

### 4. Car Insurance
- **Product Name**: Car Insurance
- **Description**: Comprehensive protection for your vehicle
- **Metadata**:
  - `policy_type`: `car`
  - `category`: `vehicle_insurance`
- **Price**:
  - Base Annual Premium: ₹30,000 (3000000 paise)
  - Billing: Annual subscription

### 5. Two Wheeler Insurance
- **Product Name**: Two Wheeler Insurance
- **Description**: Complete coverage for bikes and scooters
- **Metadata**:
  - `policy_type`: `two-wheeler`
  - `category`: `vehicle_insurance`
- **Price**:
  - Base Annual Premium: ₹8,000 (800000 paise)
  - Billing: Annual subscription

### 6. Investment Plans
- **Product Name**: Investment Insurance Plan
- **Description**: Grow your wealth with insurance-linked investment plans
- **Metadata**:
  - `policy_type`: `investment`
  - `category`: `investment`
- **Price**:
  - Base Annual Premium: ₹100,000 (10000000 paise)
  - Billing: Annual subscription

### 7. Travel Insurance
- **Product Name**: Travel Insurance
- **Description**: Safe journeys worldwide with comprehensive travel coverage
- **Metadata**:
  - `policy_type`: `travel`
  - `category`: `travel_insurance`
- **Price**:
  - Base Annual Premium: ₹5,000 (500000 paise)
  - Billing: One-time

### 8. Retirement Plans
- **Product Name**: Retirement Insurance Plan
- **Description**: Plan your golden years with secure retirement coverage
- **Metadata**:
  - `policy_type`: `retirement`
  - `category`: `retirement`
- **Price**:
  - Base Annual Premium: ₹150,000 (15000000 paise)
  - Billing: Annual subscription

### 9. Home Insurance
- **Product Name**: Home Insurance
- **Description**: Protect your home and belongings from damages
- **Metadata**:
  - `policy_type`: `home`
  - `category`: `property_insurance`
- **Price**:
  - Base Annual Premium: ₹20,000 (2000000 paise)
  - Billing: Annual subscription

### 10. Term Life with Return of Premium (ROP)
- **Product Name**: Term Life Insurance with ROP
- **Description**: Term life insurance with return of premium benefit
- **Metadata**:
  - `policy_type`: `term_rop`
  - `category`: `life_insurance`
- **Price**:
  - Base Annual Premium: ₹10,000 (1000000 paise)
  - Billing: Annual subscription

## Step-by-Step Setup Instructions

### Creating a Product in Stripe Dashboard

1. **Log in to Stripe Dashboard**
   - Go to [https://dashboard.stripe.com](https://dashboard.stripe.com)
   - Navigate to Products section

2. **Click "Add Product"**

3. **Fill in Product Details**
   - Name: Enter the product name from list above
   - Description: Copy description from list above
   - Upload image (optional): You can add an insurance icon or company logo

4. **Add Pricing Information**
   - Select pricing model: "Standard pricing"
   - Price: Enter amount in paise (see amounts above)
   - Currency: INR
   - Billing period: Choose "Recurring" for annual plans or "One time" for travel/term life

5. **Add Metadata**
   - Click "Add metadata"
   - Add `policy_type` with the value from the list above
   - Add `category` with the value from the list above

6. **Click "Save Product"**

7. **Copy Product ID**
   - After saving, copy the Product ID (starts with `prod_`)
   - Copy the Price ID (starts with `price_`)
   - You'll need these for your application configuration

### After Creating All Products

1. **Update Environment Variables** (if using product mapping)
   - You can optionally add product IDs to your `.env` file:
   ```
   STRIPE_PRODUCT_TERM_LIFE=prod_xxxxx
   STRIPE_PRODUCT_HEALTH=prod_xxxxx
   STRIPE_PRODUCT_FAMILY_HEALTH=prod_xxxxx
   STRIPE_PRODUCT_CAR=prod_xxxxx
   STRIPE_PRODUCT_TWO_WHEELER=prod_xxxxx
   STRIPE_PRODUCT_INVESTMENT=prod_xxxxx
   STRIPE_PRODUCT_TRAVEL=prod_xxxxx
   STRIPE_PRODUCT_RETIREMENT=prod_xxxxx
   STRIPE_PRODUCT_HOME=prod_xxxxx
   STRIPE_PRODUCT_TERM_ROP=prod_xxxxx
   ```

2. **Configure Webhooks**
   - Go to Developers > Webhooks in Stripe Dashboard
   - Add endpoint URL: `https://YOUR_SUPABASE_URL/functions/v1/stripe-webhook`
   - Select events to listen to:
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`
     - `checkout.session.completed`
   - Copy the webhook signing secret
   - Add to your environment: `STRIPE_WEBHOOK_SECRET=whsec_xxxxx`

## Testing Payments

### Test Card Numbers (Stripe Test Mode)

- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- **3D Secure Required**: 4000 0027 6000 3184

### Test UPI (India)

- Use UPI ID: `success@razorpay` for successful payments
- Use UPI ID: `failure@razorpay` for failed payments

### Testing Process

1. Complete an assessment for any policy type
2. Proceed to checkout
3. Use test card or UPI details
4. Verify payment success page loads correctly
5. Check Stripe Dashboard for payment confirmation
6. Verify policy is created in database

## Common Issues and Solutions

### Issue: Payment Intent Creation Fails
**Solution**: Check that:
- STRIPE_SECRET_KEY is correctly set in Supabase Edge Function secrets
- Amount is properly converted to paise (multiply by 100)
- Currency is set to 'inr' (lowercase)

### Issue: White Page After Payment
**Solution**:
- Ensure return_url is properly configured
- Check browser console for JavaScript errors
- Verify navigate function is working correctly
- Ensure policy creation doesn't throw errors

### Issue: Wrong Currency Displayed
**Solution**:
- Update all formatCurrency functions to use 'en-IN' locale and 'INR' currency
- Check that database stores amounts in INR
- Verify Stripe product prices are in paise

## Support

For issues with:
- **Stripe Configuration**: Contact Stripe Support or check [Stripe Docs](https://stripe.com/docs)
- **Application Integration**: Check application logs and error messages
- **Payment Processing**: Review Stripe Dashboard events and logs

## Additional Resources

- [Stripe India Documentation](https://stripe.com/docs/india)
- [Stripe Payment Methods in India](https://stripe.com/docs/payments/payment-methods/overview#india)
- [Stripe Products API](https://stripe.com/docs/api/products)
- [Stripe Prices API](https://stripe.com/docs/api/prices)
