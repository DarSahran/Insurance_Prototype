import { supabase } from './supabase';
import { getUserQuestionnaires, getUserProfile } from './database';

export interface DashboardStats {
  totalPolicies: number;
  activePolicies: number;
  totalClaims: number;
  pendingClaims: number;
  totalPremium: number;
  monthlyPremium: number;
  claimsRatio: number;
  riskScore: number;
  lastAssessment: string | null;
  healthScore: number;
  recentActivity: ActivityItem[];
  upcomingPayments: PaymentItem[];
  insights: InsightItem[];
  userProfile?: {
    id: string;
    email: string;
    first_name?: string;
    last_name?: string;
    full_name?: string;
    phone?: string;
    date_of_birth?: string;
    gender?: string;
    occupation?: string;
    location?: string;
  };
}

export interface ActivityItem {
  id: string;
  type: 'policy' | 'claim' | 'payment' | 'assessment' | 'health';
  title: string;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed' | 'in_progress';
  amount?: number;
}

export interface PaymentItem {
  id: string;
  policyNumber: string;
  amount: number;
  dueDate: string;
  status: 'due' | 'overdue' | 'paid';
  method: string;
}

export interface InsightItem {
  id: string;
  type: 'savings_opportunity' | 'risk_alert' | 'policy_recommendation' | 'health_improvement';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  action: string;
  estimatedImpact?: number;
}

class DashboardService {
  
  static async getUserDashboardData(userId: string): Promise<DashboardStats> {
    try {
      // Get user profile first
      const { data: userProfile, error: profileError } = await getUserProfile(userId);
      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error fetching user profile:', profileError);
      }
      // Get user policies
      const { data: policies, error: policiesError } = await supabase
        .from('policies')
        .select('*')
        .eq('user_id', userId);

      if (policiesError) {
        console.error('Error fetching policies:', policiesError);
      }

      // Get user claims
      const { data: claims, error: claimsError } = await supabase
        .from('claims')
        .select('*')
        .eq('user_id', userId);

      if (claimsError) {
        console.error('Error fetching claims:', claimsError);
      }

      // Get user payments
      const { data: payments, error: paymentsError } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', userId)
        .order('due_date', { ascending: true });

      if (paymentsError) {
        console.error('Error fetching payments:', paymentsError);
      }

      // Get user questionnaires
      const { data: questionnaires, error: questionnairesError } = await getUserQuestionnaires(userId);

      if (questionnairesError) {
        console.error('Error fetching questionnaires:', questionnairesError);
      }

      // Get health tracking data
      const { data: healthData, error: healthError } = await supabase
        .from('health_tracking')
        .select('*')
        .eq('user_id', userId)
        .order('tracking_date', { ascending: false })
        .limit(1);

      if (healthError) {
        console.error('Error fetching health data:', healthError);
      }

      // Calculate statistics
      const totalPolicies = policies?.length || 0;
      const activePolicies = policies?.filter(p => p.status === 'active').length || 0;
      const totalClaims = claims?.length || 0;
      const pendingClaims = claims?.filter(c => c.status === 'pending' || c.status === 'under_review').length || 0;
      
      const totalPremium = policies?.reduce((sum, p) => sum + p.coverage_amount, 0) || 0;
      const monthlyPremium = policies?.reduce((sum, p) => {
        if (p.premium_frequency === 'monthly') return sum + p.premium_amount;
        if (p.premium_frequency === 'quarterly') return sum + (p.premium_amount / 3);
        if (p.premium_frequency === 'annually') return sum + (p.premium_amount / 12);
        return sum;
      }, 0) || 0;

      const totalClaimsAmount = claims?.reduce((sum, c) => sum + c.claim_amount, 0) || 0;
      const claimsRatio = totalPremium > 0 ? Math.round((totalClaimsAmount / totalPremium) * 100) : 0;

      // Get latest questionnaire data
      const latestQuestionnaire = questionnaires?.[0];
      const riskScore = latestQuestionnaire?.risk_score || 50;
      const lastAssessment = latestQuestionnaire?.completed_at || latestQuestionnaire?.created_at || null;

      // Calculate health score
      const latestHealthData = healthData?.[0];
      const healthScore = latestHealthData?.improvement_score || 75;

      // Build recent activity
      const recentActivity: ActivityItem[] = [];

      // Add policy activities
      policies?.slice(0, 2).forEach(policy => {
        recentActivity.push({
          id: `policy-${policy.id}`,
          type: 'policy',
          title: 'Policy Updated',
          description: `${policy.policy_type} policy (${policy.policy_number})`,
          date: policy.updated_at,
          status: 'completed'
        });
      });

      // Add claim activities
      claims?.slice(0, 2).forEach(claim => {
        recentActivity.push({
          id: `claim-${claim.id}`,
          type: 'claim',
          title: 'Claim Submitted',
          description: `${claim.claim_type} claim submitted`,
          date: claim.created_at,
          status: claim.status === 'approved' ? 'completed' : claim.status === 'pending' ? 'pending' : 'in_progress',
          amount: claim.claim_amount
        });
      });

      // Add payment activities
      payments?.slice(0, 2).forEach(payment => {
        recentActivity.push({
          id: `payment-${payment.id}`,
          type: 'payment',
          title: 'Premium Payment',
          description: payment.payment_status === 'succeeded' ? 'Payment processed successfully' : 'Payment pending',
          date: payment.paid_date || payment.created_at,
          status: payment.payment_status === 'succeeded' ? 'completed' : 'pending',
          amount: payment.amount
        });
      });

      // Add assessment activities
      if (latestQuestionnaire) {
        recentActivity.push({
          id: `assessment-${latestQuestionnaire.id}`,
          type: 'assessment',
          title: 'Risk Assessment',
          description: `Assessment completed with ${latestQuestionnaire.completion_percentage}% completion`,
          date: latestQuestionnaire.created_at,
          status: latestQuestionnaire.status === 'completed' ? 'completed' : 'in_progress'
        });
      }

      // Sort by date
      recentActivity.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      // Build upcoming payments
      const upcomingPayments: PaymentItem[] = [];
      payments?.filter(p => p.payment_status === 'pending').slice(0, 3).forEach(payment => {
        const policy = policies?.find(pol => pol.id === payment.policy_id);
        upcomingPayments.push({
          id: payment.id,
          policyNumber: policy?.policy_number || 'Unknown',
          amount: payment.amount,
          dueDate: payment.due_date || new Date().toISOString(),
          status: new Date(payment.due_date || '') < new Date() ? 'overdue' : 'due',
          method: payment.payment_method
        });
      });

      // Generate insights
      const insights: InsightItem[] = [];

      if (riskScore > 70) {
        insights.push({
          id: 'high-risk',
          type: 'risk_alert',
          title: 'High Risk Score Detected',
          description: 'Your current risk score is above average. Consider health improvements.',
          priority: 'high',
          action: 'Schedule Health Assessment',
          estimatedImpact: Math.round(monthlyPremium * 0.15)
        });
      }

      if (healthScore > 85) {
        insights.push({
          id: 'health-improvement',
          type: 'health_improvement',
          title: 'Excellent Health Progress',
          description: 'Your health metrics qualify you for premium discounts.',
          priority: 'medium',
          action: 'Apply for Discount',
          estimatedImpact: Math.round(monthlyPremium * 0.1 * 12)
        });
      }

      if (totalPolicies > 1) {
        insights.push({
          id: 'bundle-savings',
          type: 'savings_opportunity',
          title: 'Policy Bundle Opportunity',
          description: 'Bundling your policies could provide additional savings.',
          priority: 'low',
          action: 'Review Bundle Options',
          estimatedImpact: Math.round(monthlyPremium * 0.05 * 12)
        });
      }

      return {
        totalPolicies,
        activePolicies,
        totalClaims,
        pendingClaims,
        totalPremium,
        monthlyPremium: Math.round(monthlyPremium),
        claimsRatio,
        riskScore,
        lastAssessment,
        healthScore,
        recentActivity: recentActivity.slice(0, 5),
        upcomingPayments,
        insights,
        userProfile: userProfile ? {
          id: userProfile.id,
          email: userProfile.email,
          first_name: userProfile.first_name,
          last_name: userProfile.last_name,
          full_name: userProfile.full_name,
          phone: userProfile.phone,
          date_of_birth: userProfile.date_of_birth,
          gender: userProfile.gender,
          occupation: userProfile.occupation,
          location: userProfile.location,
        } : undefined
      };

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      
      // Return fallback data on error
      return {
        totalPolicies: 0,
        activePolicies: 0,
        totalClaims: 0,
        pendingClaims: 0,
        totalPremium: 0,
        monthlyPremium: 0,
        claimsRatio: 0,
        riskScore: 50,
        lastAssessment: null,
        healthScore: 75,
        recentActivity: [
          {
            id: 'fallback-1',
            type: 'assessment',
            title: 'Complete Your Profile',
            description: 'Start by completing your risk assessment',
            date: new Date().toISOString(),
            status: 'pending'
          }
        ],
        upcomingPayments: [],
        insights: [
          {
            id: 'welcome',
            type: 'policy_recommendation',
            title: 'Welcome to Your Dashboard',
            description: 'Complete your profile to get personalized insights.',
            priority: 'medium',
            action: 'Complete Assessment'
          }
        ],
        userProfile: undefined
      };
    }
  }
}

export default DashboardService;
