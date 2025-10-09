import { supabase } from './supabase';

export interface Claim {
  id: string;
  claim_number: string;
  policy_id: string;
  user_id: string;
  claim_type: string;
  claim_amount: number;
  submitted_amount?: number;
  approved_amount?: number;
  claim_date: string;
  incident_date: string;
  description: string;
  status: 'submitted' | 'under_review' | 'investigating' | 'approved' | 'denied' | 'paid' | 'closed';
  adjuster_id?: string;
  adjuster_notes?: string;
  supporting_documents?: any;
  fraud_score?: number;
  processing_time_days?: number;
  created_at: string;
  updated_at: string;
  policies?: any;
}

export interface CreateClaimInput {
  policy_id: string;
  claim_type: string;
  claim_amount: number;
  incident_date: string;
  description: string;
  supporting_documents?: any;
}

export class ClaimsService {
  static async getUserClaims(userId: string): Promise<Claim[]> {
    const { data, error } = await supabase
      .from('claims')
      .select('*, policies(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching claims:', error);
      throw error;
    }

    return data || [];
  }

  static async getClaimById(claimId: string): Promise<Claim | null> {
    const { data, error } = await supabase
      .from('claims')
      .select('*, policies(*)')
      .eq('id', claimId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching claim:', error);
      throw error;
    }

    return data;
  }

  static async createClaim(userId: string, claimData: CreateClaimInput): Promise<Claim> {
    const claimNumber = this.generateClaimNumber();
    const fraudScore = this.calculateFraudScore(claimData);

    const { data, error } = await supabase
      .from('claims')
      .insert({
        user_id: userId,
        claim_number: claimNumber,
        ...claimData,
        claim_date: new Date().toISOString().split('T')[0],
        submitted_amount: claimData.claim_amount,
        status: 'submitted',
        fraud_score: fraudScore
      })
      .select('*, policies(*)')
      .single();

    if (error) {
      console.error('Error creating claim:', error);
      throw error;
    }

    return data;
  }

  static async updateClaim(claimId: string, updates: Partial<Claim>): Promise<Claim> {
    const { data, error } = await supabase
      .from('claims')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', claimId)
      .select('*, policies(*)')
      .single();

    if (error) {
      console.error('Error updating claim:', error);
      throw error;
    }

    return data;
  }

  static async updateClaimStatus(claimId: string, status: Claim['status']): Promise<Claim> {
    return this.updateClaim(claimId, { status });
  }

  static async approveClaim(claimId: string, approvedAmount: number, adjusterNotes?: string): Promise<Claim> {
    const today = new Date();
    const claim = await this.getClaimById(claimId);

    if (!claim) {
      throw new Error('Claim not found');
    }

    const claimDate = new Date(claim.claim_date);
    const processingDays = Math.floor((today.getTime() - claimDate.getTime()) / (1000 * 60 * 60 * 24));

    return this.updateClaim(claimId, {
      status: 'approved',
      approved_amount: approvedAmount,
      adjuster_notes,
      processing_time_days: processingDays
    });
  }

  static async denyClaim(claimId: string, reason: string): Promise<Claim> {
    const today = new Date();
    const claim = await this.getClaimById(claimId);

    if (!claim) {
      throw new Error('Claim not found');
    }

    const claimDate = new Date(claim.claim_date);
    const processingDays = Math.floor((today.getTime() - claimDate.getTime()) / (1000 * 60 * 60 * 24));

    return this.updateClaim(claimId, {
      status: 'denied',
      adjuster_notes: reason,
      processing_time_days: processingDays
    });
  }

  static async getClaimStats(userId: string) {
    const claims = await this.getUserClaims(userId);

    const totalClaimed = claims.reduce((sum, c) => sum + c.claim_amount, 0);
    const totalApproved = claims.reduce((sum, c) => sum + (c.approved_amount || 0), 0);
    const pendingClaims = claims.filter(c => ['submitted', 'under_review', 'investigating'].includes(c.status)).length;
    const approvedClaims = claims.filter(c => c.status === 'approved' || c.status === 'paid').length;
    const deniedClaims = claims.filter(c => c.status === 'denied').length;

    const avgProcessingTime = claims
      .filter(c => c.processing_time_days !== null)
      .reduce((sum, c) => sum + (c.processing_time_days || 0), 0) / Math.max(claims.filter(c => c.processing_time_days !== null).length, 1);

    return {
      totalClaims: claims.length,
      pendingClaims,
      approvedClaims,
      deniedClaims,
      totalClaimed,
      totalApproved,
      approvalRate: claims.length > 0 ? (approvedClaims / claims.length) * 100 : 0,
      avgProcessingTime: Math.round(avgProcessingTime)
    };
  }

  private static generateClaimNumber(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `CLM-${timestamp}-${random}`;
  }

  private static calculateFraudScore(claimData: CreateClaimInput): number {
    let score = 0;

    const claimDate = new Date(claimData.incident_date);
    const today = new Date();
    const daysSinceIncident = Math.floor((today.getTime() - claimDate.getTime()) / (1000 * 60 * 60 * 24));

    if (daysSinceIncident > 180) {
      score += 20;
    } else if (daysSinceIncident > 90) {
      score += 10;
    }

    if (claimData.claim_amount > 50000) {
      score += 15;
    } else if (claimData.claim_amount > 25000) {
      score += 8;
    }

    if (!claimData.supporting_documents || Object.keys(claimData.supporting_documents).length === 0) {
      score += 25;
    }

    if (claimData.description.length < 50) {
      score += 15;
    }

    return Math.min(score, 100);
  }

  static async estimateClaim(policyId: string, claimType: string, estimatedAmount: number): Promise<any> {
    const { data: historicalClaims } = await supabase
      .from('claims')
      .select('*')
      .eq('policy_id', policyId)
      .eq('claim_type', claimType);

    const approvalRate = historicalClaims
      ? (historicalClaims.filter(c => c.status === 'approved').length / historicalClaims.length) * 100
      : 85;

    const avgApprovedAmount = historicalClaims && historicalClaims.length > 0
      ? historicalClaims.reduce((sum, c) => sum + (c.approved_amount || 0), 0) / historicalClaims.length
      : estimatedAmount * 0.85;

    return {
      estimatedApprovalRate: Math.round(approvalRate),
      estimatedPayoutAmount: Math.round(avgApprovedAmount),
      estimatedProcessingDays: 14,
      recommendation: approvalRate > 70 ? 'High likelihood of approval' : 'Additional documentation recommended'
    };
  }
}
