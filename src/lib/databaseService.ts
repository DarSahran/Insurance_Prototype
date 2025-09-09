/**
 * Comprehensive Database Service for Insurance Prototype
 * This service handles all real database operations replacing mock data
 */

import { supabase } from './supabase';
import type { Database } from './supabase';

type Tables = Database['public']['Tables'];
type UserProfile = Tables['user_profiles']['Row'];
type InsuranceQuestionnaire = Tables['insurance_questionnaires']['Row'];
type Policy = Tables['policies']['Row'];
type Claim = Tables['claims']['Row'];
type HealthTracking = Tables['health_tracking']['Row'];
type Payment = Tables['payments']['Row'];
type PredictiveInsight = Tables['predictive_insights']['Row'];

// ====================================================================================
// USER PROFILE MANAGEMENT
// ====================================================================================

export class UserProfileService {
  static async getProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
    
    return data;
  }

  static async createProfile(profile: Tables['user_profiles']['Insert']): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('user_profiles')
      .insert(profile)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating user profile:', error);
      return null;
    }
    
    return data;
  }

  static async updateProfile(userId: string, updates: Tables['user_profiles']['Update']): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating user profile:', error);
      return null;
    }
    
    return data;
  }
}

// ====================================================================================
// QUESTIONNAIRE MANAGEMENT
// ====================================================================================

export class QuestionnaireService {
  static async getUserQuestionnaires(userId: string): Promise<InsuranceQuestionnaire[]> {
    const { data, error } = await supabase
      .from('insurance_questionnaires')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching questionnaires:', error);
      return [];
    }
    
    return data || [];
  }

  static async getQuestionnaire(questionnaireId: string): Promise<InsuranceQuestionnaire | null> {
    const { data, error } = await supabase
      .from('insurance_questionnaires')
      .select('*')
      .eq('id', questionnaireId)
      .single();
    
    if (error) {
      console.error('Error fetching questionnaire:', error);
      return null;
    }
    
    return data;
  }

  static async createQuestionnaire(questionnaire: Tables['insurance_questionnaires']['Insert']): Promise<InsuranceQuestionnaire | null> {
    const { data, error } = await supabase
      .from('insurance_questionnaires')
      .insert(questionnaire)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating questionnaire:', error);
      return null;
    }
    
    return data;
  }

  static async updateQuestionnaire(questionnaireId: string, updates: Tables['insurance_questionnaires']['Update']): Promise<InsuranceQuestionnaire | null> {
    const { data, error } = await supabase
      .from('insurance_questionnaires')
      .update(updates)
      .eq('id', questionnaireId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating questionnaire:', error);
      return null;
    }
    
    return data;
  }

  static async getQuestionnaireAnalytics(days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const { data, error } = await supabase
      .from('insurance_questionnaires')
      .select('*')
      .gte('created_at', startDate.toISOString());
    
    if (error) {
      console.error('Error fetching questionnaire analytics:', error);
      return null;
    }
    
    const analytics = {
      total: data.length,
      completed: data.filter(q => q.status === 'completed').length,
      inProgress: data.filter(q => q.status === 'draft').length,
      averageCompletionTime: data
        .filter(q => q.processing_time_seconds)
        .reduce((sum, q) => sum + (q.processing_time_seconds || 0), 0) / data.length,
      averageRiskScore: data
        .filter(q => q.risk_score)
        .reduce((sum, q) => sum + (q.risk_score || 0), 0) / data.filter(q => q.risk_score).length,
      averagePremium: data
        .filter(q => q.premium_estimate)
        .reduce((sum, q) => sum + (q.premium_estimate || 0), 0) / data.filter(q => q.premium_estimate).length
    };
    
    return analytics;
  }
}

// ====================================================================================
// POLICY MANAGEMENT
// ====================================================================================

export class PolicyService {
  static async getUserPolicies(userId: string): Promise<Policy[]> {
    const { data, error } = await supabase
      .from('policies')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching policies:', error);
      return [];
    }
    
    return data || [];
  }

  static async getPolicy(policyId: string): Promise<Policy | null> {
    const { data, error } = await supabase
      .from('policies')
      .select('*')
      .eq('id', policyId)
      .single();
    
    if (error) {
      console.error('Error fetching policy:', error);
      return null;
    }
    
    return data;
  }

  static async createPolicy(policy: Tables['policies']['Insert']): Promise<Policy | null> {
    const { data, error } = await supabase
      .from('policies')
      .insert(policy)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating policy:', error);
      return null;
    }
    
    return data;
  }

  static async updatePolicy(policyId: string, updates: Tables['policies']['Update']): Promise<Policy | null> {
    const { data, error } = await supabase
      .from('policies')
      .update(updates)
      .eq('id', policyId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating policy:', error);
      return null;
    }
    
    return data;
  }

  static async getPolicyAnalytics() {
    const { data, error } = await supabase
      .from('policy_analytics')
      .select('*');
    
    if (error) {
      console.error('Error fetching policy analytics:', error);
      return [];
    }
    
    return data || [];
  }
}

// ====================================================================================
// CLAIMS MANAGEMENT
// ====================================================================================

export class ClaimsService {
  static async getUserClaims(userId: string): Promise<Claim[]> {
    const { data, error } = await supabase
      .from('claims')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching claims:', error);
      return [];
    }
    
    return data || [];
  }

  static async getClaim(claimId: string): Promise<Claim | null> {
    const { data, error } = await supabase
      .from('claims')
      .select('*')
      .eq('id', claimId)
      .single();
    
    if (error) {
      console.error('Error fetching claim:', error);
      return null;
    }
    
    return data;
  }

  static async createClaim(claim: Tables['claims']['Insert']): Promise<Claim | null> {
    const { data, error } = await supabase
      .from('claims')
      .insert(claim)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating claim:', error);
      return null;
    }
    
    return data;
  }

  static async updateClaim(claimId: string, updates: Tables['claims']['Update']): Promise<Claim | null> {
    const { data, error } = await supabase
      .from('claims')
      .update(updates)
      .eq('id', claimId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating claim:', error);
      return null;
    }
    
    return data;
  }

  static async getClaimsAnalytics() {
    const { data, error } = await supabase
      .from('claims_analytics')
      .select('*');
    
    if (error) {
      console.error('Error fetching claims analytics:', error);
      return [];
    }
    
    return data || [];
  }
}

// ====================================================================================
// HEALTH TRACKING
// ====================================================================================

export class HealthTrackingService {
  static async getUserHealthData(userId: string, days: number = 30): Promise<HealthTracking[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const { data, error } = await supabase
      .from('health_tracking')
      .select('*')
      .eq('user_id', userId)
      .gte('tracking_date', startDate.toISOString().split('T')[0])
      .order('tracking_date', { ascending: false });
    
    if (error) {
      console.error('Error fetching health data:', error);
      return [];
    }
    
    return data || [];
  }

  static async addHealthData(healthData: Tables['health_tracking']['Insert']): Promise<HealthTracking | null> {
    const { data, error } = await supabase
      .from('health_tracking')
      .insert(healthData)
      .select()
      .single();
    
    if (error) {
      console.error('Error adding health data:', error);
      return null;
    }
    
    return data;
  }

  static async getHealthInsights(userId: string) {
    const healthData = await this.getUserHealthData(userId, 90);
    
    if (healthData.length === 0) return null;
    
    // Calculate trends and insights
    const recentData = healthData.slice(0, 30);
    const olderData = healthData.slice(30, 60);
    
    const insights = {
      improvementScore: recentData.reduce((sum, d) => sum + (d.improvement_score || 0), 0) / recentData.length,
      premiumEligible: recentData.some(d => d.premium_adjustment_eligible),
      trends: {
        activity: this.calculateTrend(recentData, olderData, 'steps'),
        heartRate: this.calculateTrend(recentData, olderData, 'heart_rate'),
        sleep: this.calculateTrend(recentData, olderData, 'sleep_hours')
      }
    };
    
    return insights;
  }

  private static calculateTrend(recent: HealthTracking[], older: HealthTracking[], metric: string) {
    const recentAvg = recent.reduce((sum, d) => {
      const value = d.health_metrics?.[metric] || 0;
      return sum + value;
    }, 0) / recent.length;
    
    const olderAvg = older.reduce((sum, d) => {
      const value = d.health_metrics?.[metric] || 0;
      return sum + value;
    }, 0) / older.length;
    
    const change = recentAvg - olderAvg;
    const percentChange = olderAvg > 0 ? (change / olderAvg) * 100 : 0;
    
    return {
      current: recentAvg,
      previous: olderAvg,
      change: change,
      percentChange: percentChange,
      trend: change > 0 ? 'up' : change < 0 ? 'down' : 'stable'
    };
  }
}

// ====================================================================================
// PAYMENTS SERVICE
// ====================================================================================

export class PaymentsService {
  static async getUserPayments(userId: string): Promise<Payment[]> {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching payments:', error);
      return [];
    }
    
    return data || [];
  }

  static async createPayment(payment: Tables['payments']['Insert']): Promise<Payment | null> {
    const { data, error } = await supabase
      .from('payments')
      .insert(payment)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating payment:', error);
      return null;
    }
    
    return data;
  }

  static async updatePaymentStatus(paymentId: string, status: string, paidDate?: string): Promise<Payment | null> {
    const updates: Tables['payments']['Update'] = { payment_status: status };
    if (paidDate) updates.paid_date = paidDate;
    
    const { data, error } = await supabase
      .from('payments')
      .update(updates)
      .eq('payment_id', paymentId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating payment status:', error);
      return null;
    }
    
    return data;
  }
}

// ====================================================================================
// BUSINESS INTELLIGENCE AND KPI SERVICE
// ====================================================================================

export class BusinessIntelligenceService {
  static async getKPIDashboard() {
    const { data, error } = await supabase
      .from('kpi_dashboard')
      .select('*');
    
    if (error) {
      console.error('Error fetching KPI dashboard:', error);
      return [];
    }
    
    return data || [];
  }

  static async recordMetric(metric: Tables['underwriting_metrics']['Insert']) {
    const { data, error } = await supabase
      .from('underwriting_metrics')
      .insert(metric)
      .select()
      .single();
    
    if (error) {
      console.error('Error recording metric:', error);
      return null;
    }
    
    return data;
  }

  static async getMetricHistory(metricName: string, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const { data, error } = await supabase
      .from('underwriting_metrics')
      .select('*')
      .eq('metric_name', metricName)
      .gte('metric_date', startDate.toISOString().split('T')[0])
      .order('metric_date', { ascending: true });
    
    if (error) {
      console.error('Error fetching metric history:', error);
      return [];
    }
    
    return data || [];
  }

  static async getPredictiveInsights(userId?: string): Promise<PredictiveInsight[]> {
    let query = supabase
      .from('predictive_insights')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });
    
    if (userId) {
      query = query.eq('user_id', userId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching predictive insights:', error);
      return [];
    }
    
    return data || [];
  }

  static async createPredictiveInsight(insight: Tables['predictive_insights']['Insert']): Promise<PredictiveInsight | null> {
    const { data, error } = await supabase
      .from('predictive_insights')
      .insert(insight)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating predictive insight:', error);
      return null;
    }
    
    return data;
  }
}

// ====================================================================================
// REAL-TIME AI RISK ASSESSMENT (Foundation for ML Integration)
// ====================================================================================

export class AIRiskAssessmentService {
  static async calculateRiskScore(questionnaireData: any): Promise<{
    riskScore: number;
    confidenceScore: number;
    riskFactors: any[];
    recommendations: string[];
  }> {
    // This is a foundational implementation that will be replaced with real ML models
    // For now, it provides realistic risk calculation based on questionnaire data
    
    const factors = {
      age: this.calculateAgeFactor(questionnaireData.demographics?.dateOfBirth),
      health: this.calculateHealthFactor(questionnaireData.health),
      lifestyle: this.calculateLifestyleFactor(questionnaireData.lifestyle),
      financial: this.calculateFinancialFactor(questionnaireData.financial)
    };
    
    const riskScore = this.combineRiskFactors(factors);
    const confidenceScore = this.calculateConfidence(questionnaireData);
    const riskFactors = this.identifyRiskFactors(factors, questionnaireData);
    const recommendations = this.generateRecommendations(factors, riskFactors);
    
    return {
      riskScore,
      confidenceScore,
      riskFactors,
      recommendations
    };
  }

  private static calculateAgeFactor(dateOfBirth?: string): number {
    if (!dateOfBirth) return 50; // Default neutral risk
    
    const age = new Date().getFullYear() - new Date(dateOfBirth).getFullYear();
    
    if (age < 25) return 20;      // Low risk
    if (age < 35) return 25;      // Very low risk
    if (age < 45) return 35;      // Low-medium risk
    if (age < 55) return 50;      // Medium risk
    if (age < 65) return 65;      // Medium-high risk
    return 80;                    // High risk
  }

  private static calculateHealthFactor(health?: any): number {
    if (!health) return 50;
    
    let healthScore = 30; // Base healthy score
    
    // BMI calculation
    if (health.height && health.weight) {
      const heightM = parseInt(health.height) / 100;
      const bmi = parseInt(health.weight) / (heightM * heightM);
      
      if (bmi < 18.5 || bmi > 30) healthScore += 20;
      else if (bmi > 25) healthScore += 10;
    }
    
    // Smoking status
    if (health.smokingStatus === 'current') healthScore += 25;
    else if (health.smokingStatus === 'former') healthScore += 10;
    
    // Medical conditions
    if (health.medicalConditions && health.medicalConditions.length > 0) {
      healthScore += health.medicalConditions.length * 15;
    }
    
    // Alcohol consumption
    if (health.alcoholConsumption === 'heavily') healthScore += 15;
    else if (health.alcoholConsumption === 'regularly') healthScore += 5;
    
    return Math.min(healthScore, 100);
  }

  private static calculateLifestyleFactor(lifestyle?: any): number {
    if (!lifestyle) return 50;
    
    let lifestyleScore = 40; // Base score
    
    // Exercise frequency (beneficial)
    if (lifestyle.exerciseFrequency >= 5) lifestyleScore -= 15;
    else if (lifestyle.exerciseFrequency >= 3) lifestyleScore -= 10;
    else if (lifestyle.exerciseFrequency >= 1) lifestyleScore -= 5;
    else lifestyleScore += 10;
    
    // Sleep quality
    if (lifestyle.sleepHours < 6 || lifestyle.sleepHours > 9) lifestyleScore += 10;
    
    // Stress level
    if (lifestyle.stressLevel >= 8) lifestyleScore += 20;
    else if (lifestyle.stressLevel >= 6) lifestyleScore += 10;
    else if (lifestyle.stressLevel <= 3) lifestyleScore -= 5;
    
    // Diet assessment
    if (lifestyle.dietAssessment) {
      const diet = lifestyle.dietAssessment;
      if (diet.fruits_vegetables === 'daily') lifestyleScore -= 5;
      if (diet.processed_foods === 'often' || diet.processed_foods === 'daily') lifestyleScore += 10;
      if (diet.fast_food === 'often' || diet.fast_food === 'daily') lifestyleScore += 10;
    }
    
    return Math.max(Math.min(lifestyleScore, 100), 0);
  }

  private static calculateFinancialFactor(financial?: any): number {
    if (!financial) return 50;
    
    let financialScore = 30; // Base score
    
    // Coverage amount vs income ratio
    if (financial.annualIncome && financial.coverageAmount) {
      const ratio = financial.coverageAmount / parseFloat(financial.annualIncome);
      if (ratio > 20) financialScore += 15; // Very high coverage
      else if (ratio > 10) financialScore += 5; // High coverage
    }
    
    // Debt factor
    if (financial.hasDebt) financialScore += 5;
    
    // Sole provider status
    if (financial.soleProvider) financialScore += 10;
    
    return Math.min(financialScore, 100);
  }

  private static combineRiskFactors(factors: any): number {
    // Weighted combination of risk factors
    const weights = {
      age: 0.25,
      health: 0.40,
      lifestyle: 0.25,
      financial: 0.10
    };
    
    return Math.round(
      factors.age * weights.age +
      factors.health * weights.health +
      factors.lifestyle * weights.lifestyle +
      factors.financial * weights.financial
    );
  }

  private static calculateConfidence(questionnaireData: any): number {
    let confidence = 0.5; // Base confidence
    
    // Increase confidence based on data completeness
    const sections = ['demographics', 'health', 'lifestyle', 'financial'];
    const completedSections = sections.filter(section => 
      questionnaireData[section] && Object.keys(questionnaireData[section]).length > 0
    );
    
    confidence += (completedSections.length / sections.length) * 0.3;
    
    // Additional confidence from specific high-value fields
    if (questionnaireData.health?.height && questionnaireData.health?.weight) confidence += 0.05;
    if (questionnaireData.health?.medicalConditions) confidence += 0.05;
    if (questionnaireData.lifestyle?.exerciseFrequency !== undefined) confidence += 0.05;
    if (questionnaireData.demographics?.dateOfBirth) confidence += 0.05;
    
    return Math.min(confidence, 1.0);
  }

  private static identifyRiskFactors(factors: any, _questionnaireData: any): any[] {
    const riskFactors = [];
    
    if (factors.health > 60) {
      riskFactors.push({
        category: 'health',
        factor: 'High health risk score',
        impact: factors.health - 30,
        description: 'Health indicators suggest elevated risk'
      });
    }
    
    if (factors.lifestyle > 60) {
      riskFactors.push({
        category: 'lifestyle',
        factor: 'Lifestyle risk factors',
        impact: factors.lifestyle - 30,
        description: 'Lifestyle patterns indicate increased risk'
      });
    }
    
    if (factors.age > 65) {
      riskFactors.push({
        category: 'demographics',
        factor: 'Age-related risk',
        impact: factors.age - 30,
        description: 'Age category associated with higher risk'
      });
    }
    
    return riskFactors;
  }

  private static generateRecommendations(factors: any, riskFactors: any[]): string[] {
    const recommendations = [];
    
    if (factors.health > 60) {
      recommendations.push('Consider a comprehensive health screening');
      recommendations.push('Consult with healthcare provider about risk factors');
    }
    
    if (factors.lifestyle > 60) {
      recommendations.push('Increase physical activity for better health outcomes');
      recommendations.push('Consider stress management techniques');
    }
    
    if (riskFactors.length === 0) {
      recommendations.push('Maintain your healthy lifestyle for continued low risk');
      recommendations.push('Consider additional coverage options');
    }
    
    return recommendations;
  }

  static async calculatePremiumEstimate(riskScore: number, coverage: number, term: number): Promise<number> {
    // Base premium calculation - will be replaced with ML model
    const basePremiumPer1000 = 0.5; // $0.50 per $1000 coverage base rate
    const riskMultiplier = 1 + (riskScore / 100); // Risk adjustment
    const termMultiplier = term > 20 ? 1.2 : 1.0; // Term adjustment
    
    const annualPremium = (coverage / 1000) * basePremiumPer1000 * riskMultiplier * termMultiplier;
    const monthlyPremium = annualPremium / 12;
    
    return Math.round(monthlyPremium * 100) / 100; // Round to 2 decimal places
  }
}

// Export all services
export default {
  UserProfileService,
  QuestionnaireService,
  PolicyService,
  ClaimsService,
  HealthTrackingService,
  PaymentsService,
  BusinessIntelligenceService,
  AIRiskAssessmentService
};
