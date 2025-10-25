/*
  # Add Comprehensive Term Life and Two Wheeler Policies
  
  Adds a wide variety of term life and two wheeler insurance policies
  to provide users with extensive choices.
  
  1. Term Life Insurance
    - Budget plans (₹50L coverage)
    - Mid-range plans (₹1Cr coverage)
    - Premium plans (₹2Cr+ coverage)
    
  2. Two Wheeler Insurance
    - Comprehensive coverage plans
    - Third-party only plans
    - Premium plans with add-ons
*/

DO $$
DECLARE
  hdfc_id uuid;
  icici_id uuid;
  sbi_id uuid;
  bajaj_id uuid;
  lic_id uuid;
  max_id uuid;
  tata_id uuid;
  kotak_id uuid;
  digit_id uuid;
  acko_id uuid;
BEGIN
  -- Get provider IDs
  SELECT id INTO hdfc_id FROM policy_providers WHERE provider_name = 'HDFC Life Insurance';
  SELECT id INTO icici_id FROM policy_providers WHERE provider_name = 'ICICI Prudential Life Insurance';
  SELECT id INTO sbi_id FROM policy_providers WHERE provider_name = 'SBI Life Insurance';
  SELECT id INTO bajaj_id FROM policy_providers WHERE provider_name = 'Bajaj Allianz Life Insurance';
  SELECT id INTO lic_id FROM policy_providers WHERE provider_name = 'Life Insurance Corporation of India';
  SELECT id INTO max_id FROM policy_providers WHERE provider_name = 'Max Life Insurance';
  SELECT id INTO tata_id FROM policy_providers WHERE provider_name = 'Tata AIA Life Insurance';
  SELECT id INTO kotak_id FROM policy_providers WHERE provider_name = 'Kotak Mahindra Life Insurance';
  SELECT id INTO digit_id FROM policy_providers WHERE provider_name = 'Go Digit General Insurance';
  SELECT id INTO acko_id FROM policy_providers WHERE provider_name = 'Acko General Insurance';

  -- ============================================
  -- TERM LIFE INSURANCE POLICIES
  -- ============================================

  -- Budget Term Life Plans (₹50L coverage)
  INSERT INTO policy_catalog (
    policy_name, policy_type, provider_id, policy_description,
    coverage_amount_min, coverage_amount_max,
    monthly_premium_base, annual_premium_base,
    policy_term_years, key_features, exclusions,
    eligibility_criteria, age_min, age_max,
    is_active, is_featured, sort_order
  ) VALUES
  (
    'HDFC Life Click 2 Protect Life',
    'term_life',
    hdfc_id,
    'Affordable online term life insurance with comprehensive coverage and flexible payout options',
    5000000, 10000000,
    358, 4296,
    30,
    '["Death benefit", "Accidental death benefit", "Terminal illness benefit", "Multiple payout options", "Tax benefits u/s 80C & 10(10D)", "Life cover till age 85", "Online purchase discount"]'::jsonb,
    '["Suicide within 1st year", "Pre-existing conditions not disclosed", "Substance abuse", "Criminal activities", "War and terrorism"]'::jsonb,
    '{"min_income": 0, "citizenship": "Indian", "medical_checkup": false}'::jsonb,
    18, 65,
    true, false, 10
  ),
  (
    'SBI Life eShield Next',
    'term_life',
    sbi_id,
    'Pure protection term plan with life stage-based coverage and optional riders',
    5000000, 20000000,
    375, 4500,
    30,
    '["Death benefit", "Life stage benefit increaser", "Accidental death benefit", "Critical illness rider", "Tax benefits", "Coverage increases at life stages", "Multiple premium payment options"]'::jsonb,
    '["Suicide within 1st year", "Self-inflicted injuries", "Pre-existing conditions", "War participation", "Aviation accidents"]'::jsonb,
    '{"min_income": 300000, "citizenship": "Indian", "medical_checkup": true}'::jsonb,
    18, 65,
    true, true, 5
  ),
  (
    'ICICI Pru iProtect Smart Plus',
    'term_life',
    icici_id,
    'Smart term insurance with increasing life cover and return of premium option',
    5000000, 15000000,
    392, 4704,
    35,
    '["Death benefit", "Increasing cover option", "Return of premium", "Waiver of premium on disability", "Tax benefits", "Cover increases by 10% every 5 years", "Affordable rates"]'::jsonb,
    '["Suicide in first year", "Undisclosed health conditions", "Drug abuse", "Military operations", "Self-inflicted harm"]'::jsonb,
    '{"min_income": 250000, "citizenship": "Indian", "medical_checkup": true}'::jsonb,
    18, 60,
    true, false, 12
  ),
  (
    'Kotak Protect India',
    'term_life',
    kotak_id,
    'Simple and affordable term plan with high life cover',
    5000000, 12000000,
    348, 4176,
    30,
    '["Death benefit", "Accidental death benefit", "Tax benefits u/s 80C", "Flexible policy terms", "Optional critical illness rider", "Quick online processing"]'::jsonb,
    '["Suicide within 1 year", "Pre-existing conditions", "Hazardous activities", "War risks", "Aviation other than passenger"]'::jsonb,
    '{"min_income": 200000, "citizenship": "Indian", "medical_checkup": false}'::jsonb,
    18, 65,
    true, false, 15
  );

  -- Mid-Range Term Life Plans (₹1Cr coverage)
  INSERT INTO policy_catalog (
    policy_name, policy_type, provider_id, policy_description,
    coverage_amount_min, coverage_amount_max,
    monthly_premium_base, annual_premium_base,
    policy_term_years, key_features, exclusions,
    eligibility_criteria, age_min, age_max,
    is_active, is_featured, sort_order
  ) VALUES
  (
    'Max Life Smart Term Advantage',
    'term_life',
    max_id,
    'Feature-rich term plan with critical illness and accidental death coverage',
    10000000, 50000000,
    625, 7500,
    30,
    '["Death benefit", "50 critical illness cover", "Accidental death benefit", "Terminal illness benefit", "Flexible payout options", "Online discount up to 10%", "Quick claim settlement"]'::jsonb,
    '["Suicide in first year", "Undisclosed health issues", "Substance abuse", "Intentional self-injury", "War and invasion"]'::jsonb,
    '{"min_income": 500000, "citizenship": "Indian", "medical_checkup": true}'::jsonb,
    18, 65,
    true, true, 3
  ),
  (
    'Bajaj Allianz Life eTouch',
    'term_life',
    bajaj_id,
    'Flexible term insurance with customizable cover and optional riders',
    10000000, 25000000,
    658, 7896,
    30,
    '["Death benefit", "Accidental death benefit", "Critical illness rider", "Income benefit option", "Tax benefits", "Flexible sum assured", "Multiple payout options"]'::jsonb,
    '["Suicide within 1 year", "Pre-existing conditions not disclosed", "Alcohol/drug abuse", "Criminal acts", "Aviation risks"]'::jsonb,
    '{"min_income": 400000, "citizenship": "Indian", "medical_checkup": true}'::jsonb,
    18, 60,
    true, false, 8
  ),
  (
    'Tata AIA Sampoorna Raksha Plus',
    'term_life',
    tata_id,
    'Complete protection with life and health cover in one plan',
    10000000, 30000000,
    675, 8100,
    35,
    '["Death benefit", "36 critical illness cover", "Accidental death benefit", "Waiver of premium", "Tax benefits", "Increasing life cover option", "Premium discount for women"]'::jsonb,
    '["Suicide in first year", "Undisclosed medical conditions", "Self-inflicted injuries", "War and terrorism", "Hazardous sports"]'::jsonb,
    '{"min_income": 450000, "citizenship": "Indian", "medical_checkup": true}'::jsonb,
    18, 65,
    true, true, 6
  );

  -- Premium Term Life Plans (₹2Cr+ coverage)
  INSERT INTO policy_catalog (
    policy_name, policy_type, provider_id, policy_description,
    coverage_amount_min, coverage_amount_max,
    monthly_premium_base, annual_premium_base,
    policy_term_years, key_features, exclusions,
    eligibility_criteria, age_min, age_max,
    is_active, is_featured, sort_order
  ) VALUES
  (
    'LIC Jeevan Lakshya',
    'term_life',
    lic_id,
    'Premium term plan with guaranteed maturity benefit and life coverage',
    20000000, 100000000,
    1458, 17496,
    30,
    '["Death benefit + maturity benefit", "Accidental death benefit", "Loan facility", "Bonus additions", "Tax benefits", "Money back if you survive", "Government backed"]'::jsonb,
    '["Suicide within 1 year", "Pre-existing conditions", "Non-disclosure of facts", "War participation", "Aviation other than fare-paying passenger"]'::jsonb,
    '{"min_income": 1000000, "citizenship": "Indian", "medical_checkup": true}'::jsonb,
    18, 50,
    true, true, 1
  ),
  (
    'Kotak e-Term Supreme',
    'term_life',
    kotak_id,
    'High-value term insurance with extensive coverage and flexible options',
    20000000, 50000000,
    1375, 16500,
    35,
    '["Death benefit", "Accidental death benefit", "Critical illness rider", "Terminal illness benefit", "Multiple payout modes", "Online discount", "Flexible policy terms"]'::jsonb,
    '["Suicide in first year", "Undisclosed health conditions", "Substance abuse", "Criminal activities", "War and civil unrest"]'::jsonb,
    '{"min_income": 800000, "citizenship": "Indian", "medical_checkup": true}'::jsonb,
    18, 65,
    true, false, 4
  );

  -- ============================================
  -- TWO WHEELER INSURANCE POLICIES
  -- ============================================

  -- Comprehensive Two Wheeler Insurance
  INSERT INTO policy_catalog (
    policy_name, policy_type, provider_id, policy_description,
    coverage_amount_min, coverage_amount_max,
    monthly_premium_base, annual_premium_base,
    policy_term_years, key_features, exclusions,
    eligibility_criteria, age_min, age_max,
    is_active, is_featured, sort_order
  ) VALUES
  (
    'HDFC ERGO Two Wheeler Comprehensive',
    'two_wheeler',
    hdfc_id,
    'Complete protection for your bike with own damage and third-party liability coverage',
    50000, 500000,
    208, 2500,
    1,
    '["Own damage cover", "Third-party liability", "Personal accident cover ₹15L", "Zero depreciation add-on", "24x7 roadside assistance", "Cashless claims at 10000+ garages", "Engine protection cover"]'::jsonb,
    '["Consequential loss", "Wear and tear", "Mechanical breakdown", "Drunk driving", "Without valid license", "War and nuclear risks"]'::jsonb,
    '{"vehicle_age_max": 15, "valid_license": true, "rc_book": true}'::jsonb,
    18, 70,
    true, true, 2
  ),
  (
    'ICICI Lombard Two Wheeler Package',
    'two_wheeler',
    icici_id,
    'Comprehensive bike insurance with extensive add-on covers',
    30000, 300000,
    192, 2300,
    1,
    '["Own damage + third-party", "Personal accident ₹15 lakh", "Zero depreciation", "Return to invoice", "Key replacement", "Engine & gearbox protect", "NCB protection"]'::jsonb,
    '["Normal wear and tear", "Consequential damages", "Contractual liability", "Driving under influence", "Outside geographical limits"]'::jsonb,
    '{"vehicle_age_max": 12, "valid_license": true, "rc_book": true}'::jsonb,
    18, 75,
    true, false, 5
  ),
  (
    'Bajaj Allianz Two Wheeler Protect',
    'two_wheeler',
    bajaj_id,
    'Affordable comprehensive coverage for scooters and motorcycles',
    25000, 400000,
    183, 2200,
    1,
    '["Own damage cover", "Third-party liability unlimited", "Personal accident ₹15L", "Roadside assistance", "Towing facility", "NCB up to 50%", "Anti-theft device discount"]'::jsonb,
    '["Mechanical/electrical breakdown", "Wear and tear", "Consequential loss", "Driving without license", "War risks"]'::jsonb,
    '{"vehicle_age_max": 15, "valid_license": true, "rc_book": true}'::jsonb,
    18, 70,
    true, false, 8
  ),
  (
    'SBI General Two Wheeler Insurance',
    'two_wheeler',
    sbi_id,
    'Reliable two-wheeler protection with competitive premiums',
    20000, 350000,
    175, 2100,
    1,
    '["Comprehensive coverage", "Third-party liability", "Personal accident ₹15L", "NCB benefits", "Add-on covers available", "Wide network", "Optional zero depreciation"]'::jsonb,
    '["Normal wear and tear", "Consequential damages", "Mechanical failure", "Drunk driving", "Invalid documents"]'::jsonb,
    '{"vehicle_age_max": 10, "valid_license": true, "rc_book": true}'::jsonb,
    18, 75,
    true, false, 10
  );

  -- Third-Party Only Two Wheeler Insurance
  INSERT INTO policy_catalog (
    policy_name, policy_type, provider_id, policy_description,
    coverage_amount_min, coverage_amount_max,
    monthly_premium_base, annual_premium_base,
    policy_term_years, key_features, exclusions,
    eligibility_criteria, age_min, age_max,
    is_active, is_featured, sort_order
  ) VALUES
  (
    'Digit Third-Party Two Wheeler',
    'two_wheeler',
    digit_id,
    'Budget-friendly third-party liability insurance for bikes',
    0, 0,
    75, 900,
    1,
    '["Third-party liability cover", "Personal accident ₹15 lakh", "Legal liability coverage", "Instant policy", "Mandatory as per law", "100% online process"]'::jsonb,
    '["Own damage not covered", "Theft not covered", "Fire damage not covered", "Natural calamities not covered"]'::jsonb,
    '{"valid_license": true, "rc_book": true, "no_own_damage": true}'::jsonb,
    18, 75,
    true, false, 20
  ),
  (
    'Acko Third-Party Bike Insurance',
    'two_wheeler',
    acko_id,
    'Essential third-party coverage at the lowest price',
    0, 0,
    71, 850,
    1,
    '["Third-party liability", "Personal accident cover ₹15L", "Instant policy document", "No paperwork", "100% online", "Zero commission"]'::jsonb,
    '["Own damage not covered", "Theft not covered", "Accessories not covered", "No comprehensive benefits"]'::jsonb,
    '{"valid_license": true, "rc_book": true, "no_own_damage": true}'::jsonb,
    18, 75,
    true, false, 22
  );

  -- Premium Two Wheeler Insurance with Add-ons
  INSERT INTO policy_catalog (
    policy_name, policy_type, provider_id, policy_description,
    coverage_amount_min, coverage_amount_max,
    monthly_premium_base, annual_premium_base,
    policy_term_years, key_features, exclusions,
    eligibility_criteria, age_min, age_max,
    is_active, is_featured, sort_order
  ) VALUES
  (
    'Digit Super Saver Two Wheeler',
    'two_wheeler',
    digit_id,
    'Premium bike insurance with zero depreciation and complete protection',
    50000, 500000,
    250, 3000,
    1,
    '["Zero depreciation", "Own damage + TP", "Engine protection", "Return to invoice", "NCB protection", "Consumables cover", "24x7 assistance", "Paperless process"]'::jsonb,
    '["Wear and tear", "Consequential damages", "Contractual liability", "Driving under influence", "War and terrorism"]'::jsonb,
    '{"vehicle_age_max": 5, "valid_license": true, "rc_book": true, "good_condition": true}'::jsonb,
    18, 70,
    true, true, 1
  ),
  (
    'Acko Platinum Two Wheeler',
    'two_wheeler',
    acko_id,
    'All-inclusive bike insurance with maximum coverage',
    60000, 600000,
    267, 3200,
    1,
    '["Zero depreciation", "Return to invoice", "Engine protector", "Consumables", "Key replacement", "Emergency assistance", "Zero paperwork", "Instant claim approval"]'::jsonb,
    '["Normal wear and tear", "Mechanical breakdown", "Consequential loss", "Invalid driving license", "Outside India"]'::jsonb,
    '{"vehicle_age_max": 5, "valid_license": true, "rc_book": true, "good_condition": true}'::jsonb,
    18, 70,
    true, true, 3
  );

END $$;