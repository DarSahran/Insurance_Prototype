import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          user_id: string
          email: string
          first_name: string | null
          last_name: string | null
          full_name: string | null
          phone: string | null
          date_of_birth: string | null
          gender: string | null
          address: any | null
          occupation: string | null
          education_level: string | null
          location: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          email: string
          first_name?: string | null
          last_name?: string | null
          full_name?: string | null
          phone?: string | null
          date_of_birth?: string | null
          gender?: string | null
          address?: any | null
          occupation?: string | null
          education_level?: string | null
          location?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          email?: string
          first_name?: string | null
          last_name?: string | null
          full_name?: string | null
          phone?: string | null
          date_of_birth?: string | null
          gender?: string | null
          address?: any | null
          occupation?: string | null
          education_level?: string | null
          location?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      insurance_questionnaires: {
        Row: {
          id: string
          user_id: string
          demographics: any
          health: any
          lifestyle: any
          financial: any
          ai_analysis: any
          risk_score: number | null
          premium_estimate: number | null
          confidence_score: number | null
          status: string
          completion_percentage: number
          processing_time_seconds: number | null
          version: number
          created_at: string
          updated_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          demographics?: any
          health?: any
          lifestyle?: any
          financial?: any
          ai_analysis?: any
          risk_score?: number | null
          premium_estimate?: number | null
          confidence_score?: number | null
          status?: string
          completion_percentage?: number
          processing_time_seconds?: number | null
          version?: number
          created_at?: string
          updated_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          demographics?: any
          health?: any
          lifestyle?: any
          financial?: any
          ai_analysis?: any
          risk_score?: number | null
          premium_estimate?: number | null
          confidence_score?: number | null
          status?: string
          completion_percentage?: number
          processing_time_seconds?: number | null
          version?: number
          created_at?: string
          updated_at?: string
          completed_at?: string | null
        }
      }
      policies: {
        Row: {
          id: string
          policy_number: string
          user_id: string
          questionnaire_id: string | null
          policy_type: string
          coverage_amount: number
          premium_amount: number
          premium_frequency: string
          policy_term_years: number | null
          effective_date: string
          expiry_date: string | null
          status: string
          beneficiaries: any | null
          underwriter_id: string | null
          underwriting_notes: string | null
          risk_rating: string | null
          deductible_amount: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          policy_number: string
          user_id: string
          questionnaire_id?: string | null
          policy_type: string
          coverage_amount: number
          premium_amount: number
          premium_frequency?: string
          policy_term_years?: number | null
          effective_date: string
          expiry_date?: string | null
          status?: string
          beneficiaries?: any | null
          underwriter_id?: string | null
          underwriting_notes?: string | null
          risk_rating?: string | null
          deductible_amount?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          policy_number?: string
          user_id?: string
          questionnaire_id?: string | null
          policy_type?: string
          coverage_amount?: number
          premium_amount?: number
          premium_frequency?: string
          policy_term_years?: number | null
          effective_date?: string
          expiry_date?: string | null
          status?: string
          beneficiaries?: any | null
          underwriter_id?: string | null
          underwriting_notes?: string | null
          risk_rating?: string | null
          deductible_amount?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      claims: {
        Row: {
          id: string
          claim_number: string
          policy_id: string
          user_id: string
          claim_type: string
          claim_amount: number
          submitted_amount: number | null
          approved_amount: number | null
          claim_date: string
          incident_date: string
          description: string
          status: string
          adjuster_id: string | null
          adjuster_notes: string | null
          supporting_documents: any | null
          fraud_score: number | null
          processing_time_days: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          claim_number: string
          policy_id: string
          user_id: string
          claim_type: string
          claim_amount: number
          submitted_amount?: number | null
          approved_amount?: number | null
          claim_date: string
          incident_date: string
          description: string
          status?: string
          adjuster_id?: string | null
          adjuster_notes?: string | null
          supporting_documents?: any | null
          fraud_score?: number | null
          processing_time_days?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          claim_number?: string
          policy_id?: string
          user_id?: string
          claim_type?: string
          claim_amount?: number
          submitted_amount?: number | null
          approved_amount?: number | null
          claim_date?: string
          incident_date?: string
          description?: string
          status?: string
          adjuster_id?: string | null
          adjuster_notes?: string | null
          supporting_documents?: any | null
          fraud_score?: number | null
          processing_time_days?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      health_tracking: {
        Row: {
          id: string
          user_id: string
          policy_id: string | null
          tracking_date: string
          data_source: string
          health_metrics: any
          improvement_score: number | null
          premium_adjustment_eligible: boolean
          adjustment_percentage: number | null
          verified: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          policy_id?: string | null
          tracking_date?: string
          data_source: string
          health_metrics: any
          improvement_score?: number | null
          premium_adjustment_eligible?: boolean
          adjustment_percentage?: number | null
          verified?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          policy_id?: string | null
          tracking_date?: string
          data_source?: string
          health_metrics?: any
          improvement_score?: number | null
          premium_adjustment_eligible?: boolean
          adjustment_percentage?: number | null
          verified?: boolean
          created_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          payment_id: string
          policy_id: string
          user_id: string
          amount: number
          payment_method: string
          payment_status: string
          stripe_payment_intent_id: string | null
          due_date: string | null
          paid_date: string | null
          late_fee: number
          failure_reason: string | null
          receipt_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          payment_id: string
          policy_id: string
          user_id: string
          amount: number
          payment_method: string
          payment_status?: string
          stripe_payment_intent_id?: string | null
          due_date?: string | null
          paid_date?: string | null
          late_fee?: number
          failure_reason?: string | null
          receipt_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          payment_id?: string
          policy_id?: string
          user_id?: string
          amount?: number
          payment_method?: string
          payment_status?: string
          stripe_payment_intent_id?: string | null
          due_date?: string | null
          paid_date?: string | null
          late_fee?: number
          failure_reason?: string | null
          receipt_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      underwriting_metrics: {
        Row: {
          id: string
          metric_name: string
          metric_value: number
          metric_date: string
          benchmark_value: number | null
          variance_percentage: number | null
          trend_direction: string
          business_unit: string
          metric_category: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          metric_name: string
          metric_value: number
          metric_date?: string
          benchmark_value?: number | null
          variance_percentage?: number | null
          trend_direction?: string
          business_unit?: string
          metric_category: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          metric_name?: string
          metric_value?: number
          metric_date?: string
          benchmark_value?: number | null
          variance_percentage?: number | null
          trend_direction?: string
          business_unit?: string
          metric_category?: string
          created_at?: string
          updated_at?: string
        }
      }
      predictive_insights: {
        Row: {
          id: string
          insight_id: string
          user_id: string | null
          questionnaire_id: string | null
          insight_type: string
          prediction_data: any
          confidence_score: number
          recommended_action: string | null
          business_impact: any | null
          status: string
          expires_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          insight_id: string
          user_id?: string | null
          questionnaire_id?: string | null
          insight_type: string
          prediction_data: any
          confidence_score: number
          recommended_action?: string | null
          business_impact?: any | null
          status?: string
          expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          insight_id?: string
          user_id?: string | null
          questionnaire_id?: string | null
          insight_type?: string
          prediction_data?: any
          confidence_score?: number
          recommended_action?: string | null
          business_impact?: any | null
          status?: string
          expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      kpi_dashboard: {
        Row: {
          category: string
          metric_name: string
          current_value: number
          target_value: number
          status: string
        }
      }
      policy_analytics: {
        Row: {
          month: string
          policy_type: string
          policies_issued: number
          total_coverage: number
          avg_premium: number
          active_policies: number
          retention_rate: number
        }
      }
      claims_analytics: {
        Row: {
          month: string
          claim_type: string
          total_claims: number
          total_claimed: number
          total_approved: number
          avg_processing_days: number
          approval_rate_percent: number
          avg_fraud_score: number
        }
      }
    }
  }
}