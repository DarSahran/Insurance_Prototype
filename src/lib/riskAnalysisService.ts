import { supabase } from './supabase';
import { HealthTrackingService } from './healthTrackingService';

export interface RiskFactor {
  category: string;
  currentScore: number;
  previousScore?: number;
  trend: 'improving' | 'declining' | 'stable';
  impact: 'high' | 'medium' | 'low';
  factors: Array<{
    name: string;
    value: any;
    status: string;
    target: any;
  }>;
}

export interface RiskAnalysis {
  overallScore: number;
  category: string;
  riskFactors: RiskFactor[];
  predictions: Array<{
    timeframe: string;
    predictedScore: number;
    confidence: number;
    factors: string[];
  }>;
  recommendations: string[];
}

export class RiskAnalysisService {
  static async analyzeUserRisk(userId: string): Promise<RiskAnalysis> {
    const [questionnaires, healthTracking] = await Promise.all([
      this.getLatestQuestionnaire(userId),
      HealthTrackingService.getUserHealthTracking(userId, 30)
    ]);

    const latestQuestionnaire = questionnaires[0];

    if (!latestQuestionnaire) {
      return this.getDefaultRiskAnalysis();
    }

    const healthScore = await this.calculateHealthScore(userId, healthTracking);
    const lifestyleScore = this.calculateLifestyleScore(latestQuestionnaire.lifestyle || {});
    const financialScore = this.calculateFinancialScore(latestQuestionnaire.financial || {});
    const demographicScore = this.calculateDemographicScore(latestQuestionnaire.demographics || {});

    const overallScore = Math.round(
      (healthScore * 0.35) +
      (lifestyleScore * 0.30) +
      (financialScore * 0.20) +
      (demographicScore * 0.15)
    );

    const riskFactors = [
      this.buildHealthRiskFactor(healthScore, latestQuestionnaire.health, healthTracking),
      this.buildLifestyleRiskFactor(lifestyleScore, latestQuestionnaire.lifestyle),
      this.buildFinancialRiskFactor(financialScore, latestQuestionnaire.financial),
      this.buildDemographicRiskFactor(demographicScore, latestQuestionnaire.demographics)
    ];

    const predictions = this.generateRiskPredictions(overallScore, riskFactors);
    const recommendations = this.generateRecommendations(riskFactors);

    return {
      overallScore,
      category: this.getRiskCategory(overallScore),
      riskFactors,
      predictions,
      recommendations
    };
  }

  private static async getLatestQuestionnaire(userId: string) {
    const { data } = await supabase
      .from('insurance_questionnaires')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(2);

    return data || [];
  }

  private static async calculateHealthScore(userId: string, healthTracking: any[]): Promise<number> {
    if (healthTracking.length === 0) {
      return 50;
    }

    const healthSummary = await HealthTrackingService.getHealthSummary(userId, 30);

    if (!healthSummary) {
      return 50;
    }

    let score = 100;

    const avgHeartRate = healthSummary.averages.heartRate;
    if (avgHeartRate > 80 || avgHeartRate < 60) {
      score -= 15;
    } else if (avgHeartRate > 75 || avgHeartRate < 65) {
      score -= 8;
    }

    const avgSteps = healthSummary.averages.steps;
    if (avgSteps < 5000) {
      score -= 20;
    } else if (avgSteps < 7500) {
      score -= 10;
    }

    const avgSleep = healthSummary.averages.sleep;
    if (avgSleep < 6 || avgSleep > 9) {
      score -= 15;
    } else if (avgSleep < 7 || avgSleep > 8.5) {
      score -= 8;
    }

    return Math.max(score, 0);
  }

  private static calculateLifestyleScore(lifestyle: any): number {
    let score = 100;

    if (lifestyle.smokingStatus === 'current_smoker') {
      score -= 30;
    } else if (lifestyle.smokingStatus === 'former_smoker') {
      score -= 10;
    }

    if (lifestyle.alcoholConsumption === 'heavy') {
      score -= 20;
    } else if (lifestyle.alcoholConsumption === 'moderate') {
      score -= 5;
    }

    const exerciseFreq = lifestyle.exerciseFrequency || 0;
    if (exerciseFreq < 2) {
      score -= 15;
    } else if (exerciseFreq >= 4) {
      score += 5;
    }

    const stressLevel = lifestyle.stressLevel || 5;
    if (stressLevel >= 8) {
      score -= 15;
    } else if (stressLevel >= 6) {
      score -= 8;
    }

    return Math.max(Math.min(score, 100), 0);
  }

  private static calculateFinancialScore(financial: any): number {
    let score = 100;

    const income = financial.annualIncome || 0;
    if (income < 30000) {
      score -= 20;
    } else if (income < 50000) {
      score -= 10;
    }

    const hasEmergencyFund = financial.emergencyFund || false;
    if (!hasEmergencyFund) {
      score -= 15;
    }

    const hasExistingCoverage = financial.existingCoverage || false;
    if (hasExistingCoverage) {
      score += 10;
    }

    return Math.max(Math.min(score, 100), 0);
  }

  private static calculateDemographicScore(demographics: any): number {
    let score = 100;

    const age = this.calculateAge(demographics.dateOfBirth);
    if (age < 25) {
      score -= 10;
    } else if (age > 65) {
      score -= 20;
    } else if (age > 55) {
      score -= 10;
    }

    const hasHazardousOccupation = demographics.occupation?.toLowerCase().includes('pilot') ||
      demographics.occupation?.toLowerCase().includes('construction') ||
      demographics.occupation?.toLowerCase().includes('mining');

    if (hasHazardousOccupation) {
      score -= 15;
    }

    return Math.max(Math.min(score, 100), 0);
  }

  private static buildHealthRiskFactor(score: number, health: any, tracking: any[]): RiskFactor {
    const latestMetrics = tracking[0]?.health_metrics || {};

    return {
      category: 'Health',
      currentScore: 100 - score,
      trend: 'stable',
      impact: 'high',
      factors: [
        { name: 'Heart Rate', value: latestMetrics.heartRate || 'N/A', status: 'good', target: '60-75 bpm' },
        { name: 'Daily Steps', value: latestMetrics.steps || 'N/A', status: 'good', target: '10,000 steps' },
        { name: 'Sleep Quality', value: latestMetrics.sleep || 'N/A', status: 'good', target: '7-9 hours' },
        { name: 'BMI', value: health?.bmi || 'N/A', status: 'good', target: '<25' }
      ]
    };
  }

  private static buildLifestyleRiskFactor(score: number, lifestyle: any): RiskFactor {
    return {
      category: 'Lifestyle',
      currentScore: 100 - score,
      trend: 'stable',
      impact: 'medium',
      factors: [
        { name: 'Smoking Status', value: lifestyle.smokingStatus || 'Never', status: 'excellent', target: 'Never' },
        { name: 'Alcohol', value: lifestyle.alcoholConsumption || 'None', status: 'good', target: 'Moderate' },
        { name: 'Exercise', value: `${lifestyle.exerciseFrequency || 0}x/week`, status: 'good', target: '3x/week' },
        { name: 'Stress Level', value: `${lifestyle.stressLevel || 5}/10`, status: 'good', target: '<5/10' }
      ]
    };
  }

  private static buildFinancialRiskFactor(score: number, financial: any): RiskFactor {
    return {
      category: 'Financial',
      currentScore: 100 - score,
      trend: 'stable',
      impact: 'medium',
      factors: [
        { name: 'Income Stability', value: 'Stable', status: 'good', target: 'Stable' },
        { name: 'Emergency Fund', value: financial.emergencyFund ? '6 months' : 'None', status: 'good', target: '3-6 months' },
        { name: 'Existing Coverage', value: financial.existingCoverage ? 'Yes' : 'No', status: 'neutral', target: 'Yes' }
      ]
    };
  }

  private static buildDemographicRiskFactor(score: number, demographics: any): RiskFactor {
    const age = this.calculateAge(demographics.dateOfBirth);

    return {
      category: 'Demographic',
      currentScore: 100 - score,
      trend: 'stable',
      impact: 'low',
      factors: [
        { name: 'Age', value: age, status: 'good', target: 'N/A' },
        { name: 'Occupation', value: demographics.occupation || 'Unknown', status: 'good', target: 'Low risk' },
        { name: 'Location', value: demographics.location || 'Unknown', status: 'good', target: 'N/A' }
      ]
    };
  }

  private static generateRiskPredictions(currentScore: number, factors: RiskFactor[]) {
    const improvingFactors = factors.filter(f => f.trend === 'improving').length;
    const decliningFactors = factors.filter(f => f.trend === 'declining').length;

    let threeMonthScore = currentScore;
    let sixMonthScore = currentScore;
    let oneYearScore = currentScore;

    if (improvingFactors > decliningFactors) {
      threeMonthScore -= 3;
      sixMonthScore -= 6;
      oneYearScore -= 10;
    } else if (decliningFactors > improvingFactors) {
      threeMonthScore += 2;
      sixMonthScore += 4;
      oneYearScore += 8;
    }

    return [
      {
        timeframe: '3 months',
        predictedScore: Math.max(Math.min(threeMonthScore, 100), 0),
        confidence: 92,
        factors: ['Current health trends', 'Lifestyle consistency']
      },
      {
        timeframe: '6 months',
        predictedScore: Math.max(Math.min(sixMonthScore, 100), 0),
        confidence: 87,
        factors: ['Projected health improvements', 'Age factor stable']
      },
      {
        timeframe: '1 year',
        predictedScore: Math.max(Math.min(oneYearScore, 100), 0),
        confidence: 78,
        factors: ['Long-term lifestyle benefits', 'Potential life changes']
      }
    ];
  }

  private static generateRecommendations(factors: RiskFactor[]): string[] {
    const recommendations: string[] = [];

    factors.forEach(factor => {
      if (factor.currentScore > 40) {
        recommendations.push(`Improve ${factor.category} factors to reduce risk score by ${Math.round(factor.currentScore * 0.3)} points`);
      }

      factor.factors.forEach(f => {
        if (f.status === 'caution' || f.status === 'poor') {
          recommendations.push(`Address ${f.name}: Current ${f.value}, Target ${f.target}`);
        }
      });
    });

    if (recommendations.length === 0) {
      recommendations.push('Maintain your current healthy lifestyle habits');
      recommendations.push('Consider annual health checkups to track progress');
    }

    return recommendations.slice(0, 5);
  }

  private static getRiskCategory(score: number): string {
    if (score < 30) return 'Low Risk';
    if (score < 60) return 'Medium Risk';
    return 'High Risk';
  }

  private static calculateAge(dateOfBirth?: string): number {
    if (!dateOfBirth) return 30;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  private static getDefaultRiskAnalysis(): RiskAnalysis {
    return {
      overallScore: 50,
      category: 'Medium Risk',
      riskFactors: [],
      predictions: [],
      recommendations: ['Complete an insurance assessment to get personalized risk analysis']
    };
  }
}
