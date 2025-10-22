/*
  # Add Comprehensive Policy Catalog - All New Insurance Types

  1. New Policy Types Added
    - Travel Insurance (3 policies)
    - Retirement/Pension Plans (3 policies)
    - Home Insurance (3 policies)
    - Term Insurance with ROP (3 policies)
    - Additional Health, Car, Two-Wheeler policies
    
  2. Coverage
    - 71 insurance providers
    - Comprehensive policy catalog across all types
    
  3. Security
    - All policies follow existing RLS
    - Public read access maintained
*/

DO $$
DECLARE
  hdfc_life_id uuid;
  icici_life_id uuid;
  sbi_life_id uuid;
  lic_id uuid;
  max_life_id uuid;
  bajaj_gen_id uuid;
  icici_lombard_id uuid;
  hdfc_ergo_id uuid;
  star_health_id uuid;
  care_health_id uuid;
  niva_bupa_id uuid;
  digit_id uuid;
  acko_id uuid;
  
BEGIN
  -- Get provider IDs
  SELECT id INTO hdfc_life_id FROM policy_providers WHERE provider_name = 'HDFC Life Insurance' LIMIT 1;
  SELECT id INTO icici_life_id FROM policy_providers WHERE provider_name = 'ICICI Prudential Life Insurance' LIMIT 1;
  SELECT id INTO sbi_life_id FROM policy_providers WHERE provider_name = 'SBI Life Insurance' LIMIT 1;
  SELECT id INTO lic_id FROM policy_providers WHERE provider_name = 'Life Insurance Corporation of India' LIMIT 1;
  SELECT id INTO max_life_id FROM policy_providers WHERE provider_name = 'Max Life Insurance' LIMIT 1;
  SELECT id INTO bajaj_gen_id FROM policy_providers WHERE provider_name = 'Bajaj Allianz General Insurance' LIMIT 1;
  SELECT id INTO icici_lombard_id FROM policy_providers WHERE provider_name = 'ICICI Lombard General Insurance' LIMIT 1;
  SELECT id INTO hdfc_ergo_id FROM policy_providers WHERE provider_name = 'HDFC ERGO General Insurance' LIMIT 1;
  SELECT id INTO star_health_id FROM policy_providers WHERE provider_name = 'Star Health and Allied Insurance' LIMIT 1;
  SELECT id INTO care_health_id FROM policy_providers WHERE provider_name = 'Care Health Insurance' LIMIT 1;
  SELECT id INTO niva_bupa_id FROM policy_providers WHERE provider_name = 'Niva Bupa Health Insurance' LIMIT 1;
  SELECT id INTO digit_id FROM policy_providers WHERE provider_name = 'Go Digit General Insurance' LIMIT 1;
  SELECT id INTO acko_id FROM policy_providers WHERE provider_name = 'Acko General Insurance' LIMIT 1;

  -- Travel Insurance
  IF hdfc_ergo_id IS NOT NULL THEN
    INSERT INTO policy_catalog (
      provider_id, policy_type, policy_name, policy_description,
      coverage_amount_min, coverage_amount_max, monthly_premium_base, annual_premium_base,
      policy_term_years, key_features, exclusions, eligibility_criteria,
      region_availability, age_min, age_max, waiting_period_days,
      is_featured, is_active, sort_order
    ) VALUES
      (hdfc_ergo_id, 'travel', 'HDFC ERGO Travel Shield', 
       'Comprehensive travel insurance for domestic and international trips',
       100000, 50000000, 250, 3000, 1,
       '["Medical emergency coverage", "Trip cancellation", "Lost baggage protection", "Personal accident cover", "24/7 travel assistance"]'::jsonb,
       '["Pre-existing conditions", "War and nuclear risks", "Adventure sports without rider"]'::jsonb,
       '{"min_trip_duration": 1, "max_trip_duration": 180}'::jsonb,
       ARRAY['Worldwide'], 6, 70, 0, true, true, 1);
  END IF;

  IF icici_lombard_id IS NOT NULL THEN
    INSERT INTO policy_catalog (
      provider_id, policy_type, policy_name, policy_description,
      coverage_amount_min, coverage_amount_max, monthly_premium_base, annual_premium_base,
      policy_term_years, key_features, exclusions, eligibility_criteria,
      region_availability, age_min, age_max, waiting_period_days,
      is_featured, is_active, sort_order
    ) VALUES
      (icici_lombard_id, 'travel', 'ICICI Lombard Travel Insurance', 
       'Complete protection for international and domestic travel',
       50000, 100000000, 200, 2400, 1,
       '["Medical expenses abroad", "Flight delay compensation", "Passport loss cover", "Emergency evacuation"]'::jsonb,
       '["Travel against medical advice", "High-risk destinations"]'::jsonb,
       '{"min_trip_duration": 1, "max_trip_duration": 365}'::jsonb,
       ARRAY['Worldwide'], 6, 75, 0, true, true, 2);
  END IF;

  IF bajaj_gen_id IS NOT NULL THEN
    INSERT INTO policy_catalog (
      provider_id, policy_type, policy_name, policy_description,
      coverage_amount_min, coverage_amount_max, monthly_premium_base, annual_premium_base,
      policy_term_years, key_features, exclusions, eligibility_criteria,
      region_availability, age_min, age_max, waiting_period_days,
      is_featured, is_active, sort_order
    ) VALUES
      (bajaj_gen_id, 'travel', 'Bajaj Allianz Travel Guard', 
       'Affordable travel insurance with comprehensive coverage',
       75000, 25000000, 180, 2160, 1,
       '["Trip cancellation", "Medical emergency", "Baggage delay", "Personal liability cover"]'::jsonb,
       '["Intentional self-injury", "Unlawful activities"]'::jsonb,
       '{"min_trip_duration": 1, "max_trip_duration": 180}'::jsonb,
       ARRAY['Worldwide'], 3, 70, 0, false, true, 3);
  END IF;

  -- Retirement Plans
  IF hdfc_life_id IS NOT NULL THEN
    INSERT INTO policy_catalog (
      provider_id, policy_type, policy_name, policy_description,
      coverage_amount_min, coverage_amount_max, monthly_premium_base, annual_premium_base,
      policy_term_years, key_features, exclusions, eligibility_criteria,
      region_availability, age_min, age_max, waiting_period_days,
      is_featured, is_active, sort_order
    ) VALUES
      (hdfc_life_id, 'retirement', 'HDFC Life Click 2 Retire', 
       'Comprehensive retirement solution with guaranteed income',
       500000, 10000000, 4167, 50000, 30,
       '["Flexible premium payment", "Guaranteed lifetime income", "Lump sum at retirement", "Spouse pension option"]'::jsonb,
       '["Pre-retirement withdrawals limited", "Lock-in period applicable"]'::jsonb,
       '{"min_annual_income": 500000, "min_retirement_age": 45}'::jsonb,
       ARRAY['All India'], 25, 60, 0, true, true, 1);
  END IF;

  IF sbi_life_id IS NOT NULL THEN
    INSERT INTO policy_catalog (
      provider_id, policy_type, policy_name, policy_description,
      coverage_amount_min, coverage_amount_max, monthly_premium_base, annual_premium_base,
      policy_term_years, key_features, exclusions, eligibility_criteria,
      region_availability, age_min, age_max, waiting_period_days,
      is_featured, is_active, sort_order
    ) VALUES
      (sbi_life_id, 'retirement', 'SBI Life Retire Smart', 
       'Pension plan with market-linked returns',
       300000, 50000000, 2500, 30000, 35,
       '["Choice of investment funds", "Flexible annuity options", "Tax benefits under 80C", "Death benefit"]'::jsonb,
       '["Early withdrawal penalties", "Market risks applicable"]'::jsonb,
       '{"min_annual_income": 400000}'::jsonb,
       ARRAY['All India'], 18, 65, 0, true, true, 2);
  END IF;

  IF lic_id IS NOT NULL THEN
    INSERT INTO policy_catalog (
      provider_id, policy_type, policy_name, policy_description,
      coverage_amount_min, coverage_amount_max, monthly_premium_base, annual_premium_base,
      policy_term_years, key_features, exclusions, eligibility_criteria,
      region_availability, age_min, age_max, waiting_period_days,
      is_featured, is_active, sort_order
    ) VALUES
      (lic_id, 'retirement', 'LIC Jeevan Akshay VII', 
       'Immediate annuity plan with guaranteed income',
       100000, 10000000, 833, 10000, 99,
       '["Immediate pension payout", "Multiple annuity options", "No medical examination", "Loan facility available"]'::jsonb,
       '["No surrender value", "Single premium payment only"]'::jsonb,
       '{"min_purchase_price": 100000}'::jsonb,
       ARRAY['All India'], 30, 85, 0, false, true, 3);
  END IF;

  -- Home Insurance
  IF hdfc_ergo_id IS NOT NULL THEN
    INSERT INTO policy_catalog (
      provider_id, policy_type, policy_name, policy_description,
      coverage_amount_min, coverage_amount_max, monthly_premium_base, annual_premium_base,
      policy_term_years, key_features, exclusions, eligibility_criteria,
      region_availability, age_min, age_max, waiting_period_days,
      is_featured, is_active, sort_order
    ) VALUES
      (hdfc_ergo_id, 'home', 'HDFC ERGO Home Shield', 
       'Complete home insurance covering structure and contents',
       500000, 50000000, 833, 10000, 1,
       '["Fire and allied perils", "Burglary coverage", "Natural disasters", "Public liability", "Temporary accommodation"]'::jsonb,
       '["War and nuclear risks", "Wear and tear", "Consequential losses"]'::jsonb,
       '{"property_type": "residential", "construction_type": "pucca"}'::jsonb,
       ARRAY['All India'], 18, 99, 0, true, true, 1);
  END IF;

  IF icici_lombard_id IS NOT NULL THEN
    INSERT INTO policy_catalog (
      provider_id, policy_type, policy_name, policy_description,
      coverage_amount_min, coverage_amount_max, monthly_premium_base, annual_premium_base,
      policy_term_years, key_features, exclusions, eligibility_criteria,
      region_availability, age_min, age_max, waiting_period_days,
      is_featured, is_active, sort_order
    ) VALUES
      (icici_lombard_id, 'home', 'ICICI Lombard Complete Home Insurance', 
       'Comprehensive protection for your home and belongings',
       300000, 100000000, 625, 7500, 1,
       '["Structure damage cover", "Content protection", "Natural calamities", "Theft and burglary", "Personal accident"]'::jsonb,
       '["Intentional damage", "Gradual deterioration"]'::jsonb,
       '{"property_age_max": 50}'::jsonb,
       ARRAY['All India'], 18, 99, 0, true, true, 2);
  END IF;

  IF bajaj_gen_id IS NOT NULL THEN
    INSERT INTO policy_catalog (
      provider_id, policy_type, policy_name, policy_description,
      coverage_amount_min, coverage_amount_max, monthly_premium_base, annual_premium_base,
      policy_term_years, key_features, exclusions, eligibility_criteria,
      region_availability, age_min, age_max, waiting_period_days,
      is_featured, is_active, sort_order
    ) VALUES
      (bajaj_gen_id, 'home', 'Bajaj Allianz Home Advantage', 
       'Flexible home insurance with multiple add-ons',
       200000, 25000000, 500, 6000, 1,
       '["Building and contents", "Alternate accommodation", "Loss of rent", "Valuables cover"]'::jsonb,
       '["Terrorism without rider", "Electronic equipment without add-on"]'::jsonb,
       '{"property_type": "owned"}'::jsonb,
       ARRAY['All India'], 18, 99, 0, false, true, 3);
  END IF;

  -- Term Insurance with Return of Premium
  IF hdfc_life_id IS NOT NULL THEN
    INSERT INTO policy_catalog (
      provider_id, policy_type, policy_name, policy_description,
      coverage_amount_min, coverage_amount_max, monthly_premium_base, annual_premium_base,
      policy_term_years, key_features, exclusions, eligibility_criteria,
      region_availability, age_min, age_max, waiting_period_days,
      is_featured, is_active, sort_order
    ) VALUES
      (hdfc_life_id, 'term_rop', 'HDFC Life Click 2 Protect Super', 
       'Term insurance with return of all premiums paid',
       2500000, 100000000, 1250, 15000, 30,
       '["Return of all premiums on maturity", "Life cover with savings", "Tax benefits", "Critical illness rider available"]'::jsonb,
       '["Suicide within 1 year", "Non-disclosure penalties"]'::jsonb,
       '{"min_annual_income": 400000}'::jsonb,
       ARRAY['All India'], 18, 65, 0, true, true, 1);
  END IF;

  IF max_life_id IS NOT NULL THEN
    INSERT INTO policy_catalog (
      provider_id, policy_type, policy_name, policy_description,
      coverage_amount_min, coverage_amount_max, monthly_premium_base, annual_premium_base,
      policy_term_years, key_features, exclusions, eligibility_criteria,
      region_availability, age_min, age_max, waiting_period_days,
      is_featured, is_active, sort_order
    ) VALUES
      (max_life_id, 'term_rop', 'Max Life Smart Secure Plus', 
       'Term plan with premium return and additional benefits',
       5000000, 200000000, 2083, 25000, 35,
       '["100% premium refund", "Increasing cover option", "Flexible payout options", "Serious illness benefit"]'::jsonb,
       '["Death due to criminal activity", "Pre-existing conditions not disclosed"]'::jsonb,
       '{"min_annual_income": 600000}'::jsonb,
       ARRAY['All India'], 18, 60, 0, true, true, 2);
  END IF;

  IF icici_life_id IS NOT NULL THEN
    INSERT INTO policy_catalog (
      provider_id, policy_type, policy_name, policy_description,
      coverage_amount_min, coverage_amount_max, monthly_premium_base, annual_premium_base,
      policy_term_years, key_features, exclusions, eligibility_criteria,
      region_availability, age_min, age_max, waiting_period_days,
      is_featured, is_active, sort_order
    ) VALUES
      (icici_life_id, 'term_rop', 'ICICI Pru iProtect Smart TROP', 
       'Smart term insurance with return of premium',
       2500000, 150000000, 1042, 12500, 30,
       '["Premium back guarantee", "Lump sum + monthly income option", "Whole life option", "Terminal illness benefit"]'::jsonb,
       '["Self-inflicted injuries", "Aviation except as passenger"]'::jsonb,
       '{"min_annual_income": 500000}'::jsonb,
       ARRAY['All India'], 18, 65, 0, false, true, 3);
  END IF;

  -- Additional Health Insurance
  IF star_health_id IS NOT NULL THEN
    INSERT INTO policy_catalog (
      provider_id, policy_type, policy_name, policy_description,
      coverage_amount_min, coverage_amount_max, monthly_premium_base, annual_premium_base,
      policy_term_years, key_features, exclusions, eligibility_criteria,
      region_availability, age_min, age_max, waiting_period_days,
      is_featured, is_active, sort_order
    ) VALUES
      (star_health_id, 'health', 'Star Comprehensive Insurance', 
       'Complete health coverage with no sub-limits',
       300000, 25000000, 625, 7500, 1,
       '["No room rent capping", "Pre and post hospitalization", "Day care procedures", "Unlimited restoration", "Annual health checkup"]'::jsonb,
       '["Pre-existing conditions - 4 year wait", "Cosmetic procedures", "Obesity treatment"]'::jsonb,
       '{"min_age": 18, "max_age": 65}'::jsonb,
       ARRAY['All India'], 18, 65, 30, true, true, 7);
  END IF;

  IF care_health_id IS NOT NULL THEN
    INSERT INTO policy_catalog (
      provider_id, policy_type, policy_name, policy_description,
      coverage_amount_min, coverage_amount_max, monthly_premium_base, annual_premium_base,
      policy_term_years, key_features, exclusions, eligibility_criteria,
      region_availability, age_min, age_max, waiting_period_days,
      is_featured, is_active, sort_order
    ) VALUES
      (care_health_id, 'health', 'Care Supreme Health Plan', 
       'Premium health insurance with modern treatments',
       500000, 100000000, 833, 10000, 1,
       '["Unlimited automatic restoration", "Modern treatments covered", "Wellness benefits", "International coverage"]'::jsonb,
       '["War and nuclear risks", "Intentional self-injury"]'::jsonb,
       '{"min_age": 18}'::jsonb,
       ARRAY['All India'], 18, 75, 30, true, true, 8);
  END IF;

  IF niva_bupa_id IS NOT NULL THEN
    INSERT INTO policy_catalog (
      provider_id, policy_type, policy_name, policy_description,
      coverage_amount_min, coverage_amount_max, monthly_premium_base, annual_premium_base,
      policy_term_years, key_features, exclusions, eligibility_criteria,
      region_availability, age_min, age_max, waiting_period_days,
      is_featured, is_active, sort_order
    ) VALUES
      (niva_bupa_id, 'health', 'Niva Bupa ReAssure 2.0', 
       'Next-gen health insurance with no waiting period',
       500000, 100000000, 917, 11000, 1,
       '["No waiting period for pre-existing", "Unlimited sum insured restoration", "Global coverage", "Mental wellness cover"]'::jsonb,
       '["Self-inflicted injuries", "Drug abuse"]'::jsonb,
       '{"min_age": 18}'::jsonb,
       ARRAY['All India'], 18, 75, 0, true, true, 9);
  END IF;

  -- Additional Car Insurance
  IF digit_id IS NOT NULL THEN
    INSERT INTO policy_catalog (
      provider_id, policy_type, policy_name, policy_description,
      coverage_amount_min, coverage_amount_max, monthly_premium_base, annual_premium_base,
      policy_term_years, key_features, exclusions, eligibility_criteria,
      region_availability, age_min, age_max, waiting_period_days,
      is_featured, is_active, sort_order
    ) VALUES
      (digit_id, 'car', 'Digit Car Insurance', 
       'Flexible car insurance with instant claims',
       100000, 10000000, 417, 5000, 1,
       '["Instant claim settlement", "Zero paperwork", "Depreciation cover", "24x7 roadside assistance"]'::jsonb,
       '["Consequential loss", "Wear and tear", "Drunk driving"]'::jsonb,
       '{"vehicle_age_max": 15}'::jsonb,
       ARRAY['All India'], 18, 75, 0, true, true, 4);
  END IF;

  IF acko_id IS NOT NULL THEN
    INSERT INTO policy_catalog (
      provider_id, policy_type, policy_name, policy_description,
      coverage_amount_min, coverage_amount_max, monthly_premium_base, annual_premium_base,
      policy_term_years, key_features, exclusions, eligibility_criteria,
      region_availability, age_min, age_max, waiting_period_days,
      is_featured, is_active, sort_order
    ) VALUES
      (acko_id, 'car', 'Acko Comprehensive Car Insurance', 
       'Digital-first car insurance with quick claims',
       150000, 15000000, 375, 4500, 1,
       '["No inspection needed", "Cashless claims", "Engine protection", "Consumables cover"]'::jsonb,
       '["Driving without license", "Vehicle used for racing"]'::jsonb,
       '{"vehicle_age_max": 12}'::jsonb,
       ARRAY['All India'], 18, 75, 0, true, true, 5);
  END IF;

  -- Additional Two-Wheeler Insurance
  IF digit_id IS NOT NULL THEN
    INSERT INTO policy_catalog (
      provider_id, policy_type, policy_name, policy_description,
      coverage_amount_min, coverage_amount_max, monthly_premium_base, annual_premium_base,
      policy_term_years, key_features, exclusions, eligibility_criteria,
      region_availability, age_min, age_max, waiting_period_days,
      is_featured, is_active, sort_order
    ) VALUES
      (digit_id, 'two_wheeler', 'Digit Two Wheeler Insurance', 
       'Comprehensive bike insurance with instant policy',
       50000, 3000000, 167, 2000, 1,
       '["Instant policy issuance", "Zero depreciation cover", "Roadside assistance", "Personal accident cover"]'::jsonb,
       '["Drunk driving", "Racing", "Wear and tear"]'::jsonb,
       '{"vehicle_age_max": 10}'::jsonb,
       ARRAY['All India'], 18, 70, 0, true, true, 3);
  END IF;

  IF acko_id IS NOT NULL THEN
    INSERT INTO policy_catalog (
      provider_id, policy_type, policy_name, policy_description,
      coverage_amount_min, coverage_amount_max, monthly_premium_base, annual_premium_base,
      policy_term_years, key_features, exclusions, eligibility_criteria,
      region_availability, age_min, age_max, waiting_period_days,
      is_featured, is_active, sort_order
    ) VALUES
      (acko_id, 'two_wheeler', 'Acko Bike Insurance', 
       'Smart bike insurance with digital claims',
       30000, 2500000, 125, 1500, 1,
       '["Digital policy", "Quick claim settlement", "Third party unlimited", "Own damage cover"]'::jsonb,
       '["Unlicensed driving", "Unauthorized use"]'::jsonb,
       '{"vehicle_age_max": 12}'::jsonb,
       ARRAY['All India'], 18, 70, 0, false, true, 4);
  END IF;

END $$;
