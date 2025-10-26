import { supabase } from './supabase'
import type { Database } from './supabase'
import { RiskAnalysisService } from './riskAnalysisService'

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
  console.log('💾 createUserProfile called with:', userData);

  // First check if profile already exists
  console.log('🔍 Checking if profile exists for user_id:', userData.user_id);
  const { data: existing, error: checkError } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', userData.user_id)
    .maybeSingle()

  if (checkError) {
    console.error('❌ Error checking for existing profile:', checkError);
  }

  // If exists, return it instead of creating duplicate
  if (existing) {
    console.log('✅ Profile already exists, returning existing:', existing.id);
    return { data: existing, error: null }
  }

  console.log('📝 No existing profile found, creating new one...');

  // Create new profile
  const { data, error } = await supabase
    .from('user_profiles')
    .insert(userData)
    .select()
    .maybeSingle()

  if (error) {
    console.error('❌ Error creating profile:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    console.error('Error details:', error.details);
  } else {
    console.log('✅✅ PROFILE CREATED IN DATABASE!');
    console.log('Profile ID:', data?.id);
    console.log('Profile data:', data);
  }

  return { data, error }
}

export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()

  return { data, error }
}

export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('user_id', userId)
    .select()
    .maybeSingle()

  return { data, error }
}

// Enhanced Insurance Questionnaire Operations
export const saveInsuranceQuestionnaire = async (questionnaireData: {
  user_id: string
  demographics: any
  health: any
  lifestyle: any
  financial: any
  ai_analysis?: any
  risk_score?: number
  premium_estimate?: number
  status?: string
  confidence_score?: number
  processing_time_seconds?: number
}) => {
  const { data, error } = await supabase
    .from('insurance_questionnaires')
    .insert(questionnaireData)
    .select()
    .single()

  if (!error && data && questionnaireData.status === 'completed') {
    try {
      console.log('Questionnaire completed - triggering risk analysis and history save');
      await RiskAnalysisService.analyzeUserRisk(questionnaireData.user_id, true);
    } catch (analysisError) {
      console.error('Error during automatic risk analysis:', analysisError);
    }
  }

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

  if (!error && data && updates.status === 'completed' && data.user_id) {
    try {
      console.log('Questionnaire updated to completed - triggering risk analysis and history save');
      await RiskAnalysisService.analyzeUserRisk(data.user_id, true);
    } catch (analysisError) {
      console.error('Error during automatic risk analysis:', analysisError);
    }
  }

  return { data, error }
}

export const getLatestQuestionnaire = async (userId: string) => {
  const { data, error } = await supabase
    .from('insurance_questionnaires')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle() // Use maybeSingle to handle case where no records exist

  return { data, error }
}

// Progress tracking functions
export const saveQuestionnaireProgress = async (progressData: {
  questionnaire_id: string
  section_name: string
  is_completed: boolean
  data_snapshot?: any
}) => {
  const { data, error } = await supabase
    .from('questionnaire_progress')
    .upsert({
      ...progressData,
      completion_time: progressData.is_completed ? new Date().toISOString() : null
    }, {
      onConflict: 'questionnaire_id,section_name'
    })
    .select()
    .single()

  return { data, error }
}

export const getQuestionnaireProgress = async (questionnaireId: string) => {
  const { data, error } = await supabase
    .from('questionnaire_progress')
    .select('*')
    .eq('questionnaire_id', questionnaireId)
    .order('created_at')

  return { data, error }
}

// Risk factors functions
export const saveRiskFactors = async (riskFactors: Array<{
  questionnaire_id: string
  factor_name: string
  factor_category: string
  impact_score: number
  confidence: number
  description?: string
  recommendation?: string
}>) => {
  const { data, error } = await supabase
    .from('risk_factors')
    .insert(riskFactors)
    .select()

  return { data, error }
}

export const getRiskFactors = async (questionnaireId: string) => {
  const { data, error } = await supabase
    .from('risk_factors')
    .select('*')
    .eq('questionnaire_id', questionnaireId)
    .order('impact_score', { ascending: false })

  return { data, error }
}

// AI predictions functions
export const saveAIPrediction = async (predictionData: {
  questionnaire_id: string
  model_name: string
  model_version?: string
  prediction_type: string
  predicted_value: number
  confidence_score: number
  shap_values?: any
  feature_importance?: any
  bias_check_results?: any
  processing_time_ms?: number
}) => {
  const { data, error } = await supabase
    .from('ai_predictions')
    .insert(predictionData)
    .select()
    .single()

  return { data, error }
}

export const getAIPredictions = async (questionnaireId: string) => {
  const { data, error } = await supabase
    .from('ai_predictions')
    .select('*')
    .eq('questionnaire_id', questionnaireId)
    .order('created_at', { ascending: false })

  return { data, error }
}

// Analytics and reporting functions
export const getQuestionnaireAnalytics = async (userId?: string) => {
  let query = supabase
    .from('questionnaire_analytics')
    .select('*')
    .order('date', { ascending: false })
    .limit(30)

  if (userId) {
    // If we want user-specific analytics, we'd need a different approach
    // since the view doesn't include user_id
    return getUserQuestionnaires(userId)
  }

  const { data, error } = await query
  return { data, error }
}

// Utility functions
export const calculateQuestionnaireCompletion = (questionnaire: any) => {
  let completedSections = 0
  const totalSections = 4 // demographics, health, lifestyle, financial

  if (questionnaire.demographics && Object.keys(questionnaire.demographics).length > 0) {
    completedSections++
  }
  if (questionnaire.health && Object.keys(questionnaire.health).length > 0) {
    completedSections++
  }
  if (questionnaire.lifestyle && Object.keys(questionnaire.lifestyle).length > 0) {
    completedSections++
  }
  if (questionnaire.financial && Object.keys(questionnaire.financial).length > 0) {
    completedSections++
  }

  return Math.round((completedSections / totalSections) * 100)
}

export const getCompletionStatus = (percentage: number) => {
  if (percentage === 0) return 'Not started'
  if (percentage < 25) return 'Just started'
  if (percentage < 50) return 'In progress'
  if (percentage < 75) return 'Nearly halfway'
  if (percentage < 100) return 'Almost complete'
  return 'Complete'
}

// Search and filter functions
export const searchQuestionnaires = async (
  userId: string, 
  filters: {
    status?: string
    dateFrom?: string
    dateTo?: string
    riskScoreMin?: number
    riskScoreMax?: number
  } = {}
) => {
  let query = supabase
    .from('insurance_questionnaires')
    .select('*')
    .eq('user_id', userId)

  if (filters.status) {
    query = query.eq('status', filters.status)
  }
  if (filters.dateFrom) {
    query = query.gte('created_at', filters.dateFrom)
  }
  if (filters.dateTo) {
    query = query.lte('created_at', filters.dateTo)
  }
  if (filters.riskScoreMin !== undefined) {
    query = query.gte('risk_score', filters.riskScoreMin)
  }
  if (filters.riskScoreMax !== undefined) {
    query = query.lte('risk_score', filters.riskScoreMax)
  }

  const { data, error } = await query.order('created_at', { ascending: false })
  return { data, error }
}
