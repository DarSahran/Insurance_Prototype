import { supabase } from './supabase'
import type { Database } from './supabase'

type UserProfile = Database['public']['Tables']['user_profiles']['Row']
type InsuranceQuestionnaire = Database['public']['Tables']['insurance_questionnaires']['Row']

// User Profile Operations
export const createUserProfile = async (userData: {
  user_id: string
  email: string
  first_name?: string
  last_name?: string
  full_name?: string
}) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .insert(userData)
    .select()
    .single()

  return { data, error }
}

export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .single()

  return { data, error }
}

export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('user_id', userId)
    .select()
    .single()

  return { data, error }
}

// Insurance Questionnaire Operations
export const saveInsuranceQuestionnaire = async (questionnaireData: {
  user_id: string
  demographics: any
  health: any
  lifestyle: any
  financial: any
  ai_analysis?: any
  risk_score?: number
  premium_estimate?: number
}) => {
  const { data, error } = await supabase
    .from('insurance_questionnaires')
    .insert(questionnaireData)
    .select()
    .single()

  return { data, error }
}

export const getUserQuestionnaires = async (userId: string) => {
  const { data, error } = await supabase
    .from('insurance_questionnaires')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  return { data, error }
}

export const updateQuestionnaire = async (questionnaireId: string, updates: Partial<InsuranceQuestionnaire>) => {
  const { data, error } = await supabase
    .from('insurance_questionnaires')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', questionnaireId)
    .select()
    .single()

  return { data, error }
}

export const getLatestQuestionnaire = async (userId: string) => {
  const { data, error } = await supabase
    .from('insurance_questionnaires')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  return { data, error }
}
