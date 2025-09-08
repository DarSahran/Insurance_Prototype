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
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          demographics: any
          health: any
          lifestyle: any
          financial: any
          ai_analysis?: any
          risk_score?: number | null
          premium_estimate?: number | null
          created_at?: string
          updated_at?: string
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
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}