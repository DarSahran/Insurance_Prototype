import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          user_id: string
          name: string
          age: number
          retirement_age: number
          annual_income: number
          total_savings: number
          current_super: number
          monthly_contribution: number
          employer_contribution: number
          risk_tolerance: 'conservative' | 'balanced' | 'growth' | 'aggressive'
          investment_experience: 'beginner' | 'intermediate' | 'advanced'
          financial_goals: string[]
          preferred_sectors: string[]
          esg_preferences: boolean
          tax_considerations: string[]
          employment_status: string
          relationship_status: string
          dependents: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          age: number
          retirement_age: number
          annual_income: number
          total_savings: number
          current_super: number
          monthly_contribution: number
          employer_contribution: number
          risk_tolerance: 'conservative' | 'balanced' | 'growth' | 'aggressive'
          investment_experience: 'beginner' | 'intermediate' | 'advanced'
          financial_goals: string[]
          preferred_sectors: string[]
          esg_preferences: boolean
          tax_considerations: string[]
          employment_status: string
          relationship_status: string
          dependents: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          age?: number
          retirement_age?: number
          annual_income?: number
          total_savings?: number
          current_super?: number
          monthly_contribution?: number
          employer_contribution?: number
          risk_tolerance?: 'conservative' | 'balanced' | 'growth' | 'aggressive'
          investment_experience?: 'beginner' | 'intermediate' | 'advanced'
          financial_goals?: string[]
          preferred_sectors?: string[]
          esg_preferences?: boolean
          tax_considerations?: string[]
          employment_status?: string
          relationship_status?: string
          dependents?: number
          created_at?: string
          updated_at?: string
        }
      }
      chat_sessions: {
        Row: {
          id: string
          user_id: string
          messages: any[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          messages: any[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          messages?: any[]
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}