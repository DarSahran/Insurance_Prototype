import { supabase } from './supabase';

export interface HealthMetrics {
  heartRate?: number;
  steps?: number;
  sleep?: number;
  weight?: number;
  bloodPressure?: string;
  hydration?: number;
  exerciseMinutes?: number;
  calories?: number;
  distance?: number;
  activeMinutes?: number;
  [key: string]: any;
}

export interface HealthTracking {
  id: string;
  user_id: string;
  policy_id?: string;
  tracking_date: string;
  data_source: string;
  health_metrics: HealthMetrics;
  improvement_score?: number;
  premium_adjustment_eligible: boolean;
  adjustment_percentage?: number;
  verified: boolean;
  created_at: string;
}

export interface CreateHealthTrackingInput {
  tracking_date?: string;
  data_source: string;
  health_metrics: HealthMetrics;
  policy_id?: string;
}

export class HealthTrackingService {
  static async getUserHealthTracking(userId: string, limit: number = 30): Promise<HealthTracking[]> {
    const { data, error } = await supabase
      .from('health_tracking')
      .select('*')
      .eq('user_id', userId)
      .order('tracking_date', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching health tracking:', error);
      throw error;
    }

    return data || [];
  }

  static async getHealthTrackingByDate(userId: string, startDate: string, endDate: string): Promise<HealthTracking[]> {
    const { data, error } = await supabase
      .from('health_tracking')
      .select('*')
      .eq('user_id', userId)
      .gte('tracking_date', startDate)
      .lte('tracking_date', endDate)
      .order('tracking_date', { ascending: true });

    if (error) {
      console.error('Error fetching health tracking by date:', error);
      throw error;
    }

    return data || [];
  }

  static async createHealthTracking(userId: string, trackingData: CreateHealthTrackingInput): Promise<HealthTracking> {
    const improvementScore = this.calculateImprovementScore(trackingData.health_metrics);
    const eligibleForAdjustment = improvementScore >= 75;

    const { data, error } = await supabase
      .from('health_tracking')
      .insert({
        user_id: userId,
        tracking_date: trackingData.tracking_date || new Date().toISOString().split('T')[0],
        data_source: trackingData.data_source,
        health_metrics: trackingData.health_metrics,
        policy_id: trackingData.policy_id,
        improvement_score: improvementScore,
        premium_adjustment_eligible: eligibleForAdjustment,
        adjustment_percentage: eligibleForAdjustment ? this.calculateAdjustmentPercentage(improvementScore) : null,
        verified: trackingData.data_source === 'manual' ? false : true
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating health tracking:', error);
      throw error;
    }

    return data;
  }

  static async updateHealthTracking(trackingId: string, updates: Partial<HealthTracking>): Promise<HealthTracking> {
    const { data, error } = await supabase
      .from('health_tracking')
      .update(updates)
      .eq('id', trackingId)
      .select()
      .single();

    if (error) {
      console.error('Error updating health tracking:', error);
      throw error;
    }

    return data;
  }

  static async deleteHealthTracking(trackingId: string): Promise<boolean> {
    const { error } = await supabase
      .from('health_tracking')
      .delete()
      .eq('id', trackingId);

    if (error) {
      console.error('Error deleting health tracking:', error);
      throw error;
    }

    return true;
  }

  static async getHealthSummary(userId: string, days: number = 30) {
    const tracking = await this.getUserHealthTracking(userId, days);

    if (tracking.length === 0) {
      return null;
    }

    const avgHeartRate = this.calculateAverage(tracking, 'health_metrics.heartRate');
    const avgSteps = this.calculateAverage(tracking, 'health_metrics.steps');
    const avgSleep = this.calculateAverage(tracking, 'health_metrics.sleep');
    const avgWeight = this.calculateAverage(tracking, 'health_metrics.weight');

    const latestEntry = tracking[0]?.health_metrics || {};

    return {
      period: `Last ${days} days`,
      entryCount: tracking.length,
      averages: {
        heartRate: avgHeartRate,
        steps: avgSteps,
        sleep: avgSleep,
        weight: avgWeight
      },
      latest: latestEntry,
      improvementScore: tracking[0]?.improvement_score || 0,
      premiumEligible: tracking.some(t => t.premium_adjustment_eligible)
    };
  }

  static async getHealthTrends(userId: string): Promise<any> {
    const tracking = await this.getUserHealthTracking(userId, 90);

    if (tracking.length < 7) {
      return null;
    }

    const firstWeek = tracking.slice(-7);
    const lastWeek = tracking.slice(0, 7);

    const firstWeekAvg = {
      heartRate: this.calculateAverage(firstWeek, 'health_metrics.heartRate'),
      steps: this.calculateAverage(firstWeek, 'health_metrics.steps'),
      sleep: this.calculateAverage(firstWeek, 'health_metrics.sleep'),
      weight: this.calculateAverage(firstWeek, 'health_metrics.weight')
    };

    const lastWeekAvg = {
      heartRate: this.calculateAverage(lastWeek, 'health_metrics.heartRate'),
      steps: this.calculateAverage(lastWeek, 'health_metrics.steps'),
      sleep: this.calculateAverage(lastWeek, 'health_metrics.sleep'),
      weight: this.calculateAverage(lastWeek, 'health_metrics.weight')
    };

    return {
      heartRateTrend: this.getTrendDirection(firstWeekAvg.heartRate, lastWeekAvg.heartRate, 'lower'),
      stepsTrend: this.getTrendDirection(firstWeekAvg.steps, lastWeekAvg.steps, 'higher'),
      sleepTrend: this.getTrendDirection(firstWeekAvg.sleep, lastWeekAvg.sleep, 'higher'),
      weightTrend: this.getTrendDirection(firstWeekAvg.weight, lastWeekAvg.weight, 'lower'),
      overallImprovement: tracking[0]?.improvement_score > (tracking[tracking.length - 1]?.improvement_score || 0)
    };
  }

  private static calculateAverage(data: HealthTracking[], path: string): number {
    const values = data
      .map(entry => {
        const keys = path.split('.');
        let value: any = entry;
        for (const key of keys) {
          value = value?.[key];
        }
        return typeof value === 'number' ? value : null;
      })
      .filter((v): v is number => v !== null);

    if (values.length === 0) return 0;
    return values.reduce((sum, v) => sum + v, 0) / values.length;
  }

  private static getTrendDirection(oldValue: number, newValue: number, desiredDirection: 'higher' | 'lower'): string {
    if (oldValue === 0 || newValue === 0) return 'stable';

    const percentChange = ((newValue - oldValue) / oldValue) * 100;

    if (Math.abs(percentChange) < 2) return 'stable';

    if (desiredDirection === 'higher') {
      return percentChange > 0 ? 'improving' : 'declining';
    } else {
      return percentChange < 0 ? 'improving' : 'declining';
    }
  }

  private static calculateImprovementScore(metrics: HealthMetrics): number {
    let score = 50;

    if (metrics.heartRate) {
      if (metrics.heartRate >= 60 && metrics.heartRate <= 75) score += 15;
      else if (metrics.heartRate >= 76 && metrics.heartRate <= 80) score += 10;
      else score += 5;
    }

    if (metrics.steps) {
      if (metrics.steps >= 10000) score += 15;
      else if (metrics.steps >= 7500) score += 10;
      else if (metrics.steps >= 5000) score += 5;
    }

    if (metrics.sleep) {
      if (metrics.sleep >= 7 && metrics.sleep <= 9) score += 15;
      else if (metrics.sleep >= 6) score += 8;
    }

    if (metrics.exerciseMinutes) {
      if (metrics.exerciseMinutes >= 30) score += 10;
      else if (metrics.exerciseMinutes >= 20) score += 5;
    }

    return Math.min(score, 100);
  }

  private static calculateAdjustmentPercentage(improvementScore: number): number {
    if (improvementScore >= 90) return 10;
    if (improvementScore >= 80) return 7;
    if (improvementScore >= 75) return 5;
    return 0;
  }

  static async syncFromWearable(userId: string, source: string, metrics: HealthMetrics): Promise<HealthTracking> {
    return this.createHealthTracking(userId, {
      data_source: source,
      health_metrics: metrics,
      tracking_date: new Date().toISOString().split('T')[0]
    });
  }
}
