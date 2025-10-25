/*
  # Add Foreign Key Indexes and Enable RLS
  
  1. Performance Improvements
    - Add indexes on all foreign key columns for faster joins
    - Improves query performance significantly
  
  2. Security Improvements
    - Enable RLS on public tables with policies
    - Ensures Row Level Security is enforced
*/

-- ============================================
-- PART 1: ADD MISSING FOREIGN KEY INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_health_tracking_policy_id 
  ON public.health_tracking(policy_id);

CREATE INDEX IF NOT EXISTS idx_policies_questionnaire_id 
  ON public.policies(questionnaire_id);

CREATE INDEX IF NOT EXISTS idx_policy_addons_policy_id 
  ON public.policy_addons(policy_id);

CREATE INDEX IF NOT EXISTS idx_policy_catalog_provider_id 
  ON public.policy_catalog(provider_id);

CREATE INDEX IF NOT EXISTS idx_policy_features_policy_id 
  ON public.policy_features(policy_id);

CREATE INDEX IF NOT EXISTS idx_policy_selections_policy_catalog_id 
  ON public.policy_selections(policy_catalog_id);

CREATE INDEX IF NOT EXISTS idx_predictive_insights_questionnaire_id 
  ON public.predictive_insights(questionnaire_id);

CREATE INDEX IF NOT EXISTS idx_quick_policies_catalog_policy_id 
  ON public.quick_policies(catalog_policy_id);

CREATE INDEX IF NOT EXISTS idx_quick_policies_provider_id 
  ON public.quick_policies(provider_id);

CREATE INDEX IF NOT EXISTS idx_saved_policies_policy_id 
  ON public.saved_policies(policy_id);

CREATE INDEX IF NOT EXISTS idx_wearable_data_snapshots_device_id 
  ON public.wearable_data_snapshots(device_id);

-- ============================================
-- PART 2: ENABLE RLS ON PUBLIC TABLES
-- ============================================

ALTER TABLE public.policy_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.policy_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.policy_addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quick_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.policy_comparisons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quick_purchase_flows ENABLE ROW LEVEL SECURITY;

-- ============================================
-- Add documentation comments
-- ============================================

COMMENT ON INDEX idx_health_tracking_policy_id IS 'Foreign key index for faster policy lookups';
COMMENT ON INDEX idx_policies_questionnaire_id IS 'Foreign key index for faster questionnaire lookups';
COMMENT ON INDEX idx_policy_addons_policy_id IS 'Foreign key index for faster addon lookups';
COMMENT ON INDEX idx_policy_catalog_provider_id IS 'Foreign key index for faster provider lookups';
COMMENT ON INDEX idx_policy_features_policy_id IS 'Foreign key index for faster feature lookups';
COMMENT ON INDEX idx_policy_selections_policy_catalog_id IS 'Foreign key index for faster catalog lookups';
COMMENT ON INDEX idx_predictive_insights_questionnaire_id IS 'Foreign key index for faster questionnaire lookups';
COMMENT ON INDEX idx_quick_policies_catalog_policy_id IS 'Foreign key index for faster catalog lookups';
COMMENT ON INDEX idx_quick_policies_provider_id IS 'Foreign key index for faster provider lookups';
COMMENT ON INDEX idx_saved_policies_policy_id IS 'Foreign key index for faster policy lookups';
COMMENT ON INDEX idx_wearable_data_snapshots_device_id IS 'Foreign key index for faster device lookups';