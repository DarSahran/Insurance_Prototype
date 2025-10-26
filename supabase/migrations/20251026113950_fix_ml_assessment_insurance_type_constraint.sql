/*
  # Fix insurance_type constraint for ML assessments

  1. Changes
    - Drop the existing valid_insurance_type constraint
    - Add new constraint that accepts both underscore and hyphen formats
    - Supports: term_life, term-life, health, family_health, family-health, etc.

  2. Security
    - Maintains data validation while allowing flexible format
*/

-- Drop the existing constraint
ALTER TABLE insurance_questionnaires DROP CONSTRAINT IF EXISTS valid_insurance_type;

-- Add new constraint that accepts both formats
ALTER TABLE insurance_questionnaires ADD CONSTRAINT valid_insurance_type 
CHECK (insurance_type = ANY (ARRAY[
  'term_life'::text, 
  'term-life'::text,
  'health'::text, 
  'family_health'::text, 
  'family-health'::text,
  'car'::text, 
  'two_wheeler'::text, 
  'two-wheeler'::text,
  'travel'::text, 
  'investment'::text, 
  'retirement'::text, 
  'home'::text, 
  'term_rop'::text,
  'term-rop'::text
]));