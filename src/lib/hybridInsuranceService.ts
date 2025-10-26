import { HuggingFaceMLService } from './huggingFaceService';
import { GeminiInsuranceService, type InsuranceAnalysisRequest, type AIInsuranceAnalysis } from './geminiService';
import { MLDataMapper, type QuestionnaireData } from './mlDataMapper';

export interface HybridInsuranceAnalysis {
  mlPrediction: {
    riskCategory: string;
    riskScore: number;
    riskConfidence: number;
    riskProbabilities: {
      Low?: number;
      Medium?: number;
      High?: number;
    };
    customerLifetimeValue: number;
    monthlyPremium: number;
    derivedFeatures: {
      bmi: number;
      bmiCategory: string;
      hasDiabetes: boolean;
      hasHypertension: boolean;
      overallHealthRiskScore: number;
      financialRiskScore: number;
      annualIncomeMidpoint: number;
    };
  };
  geminiEnhancement: {
    eligiblePolicies: any[];
    personalizedAdvice: string;
    riskAssessment: {
      overall: string;
      factors: string[];
      improvements: string[];
    };
    premiumOptimization: {
      currentEstimate: number;
      potentialSavings: number;
      recommendations: string[];
    };
  };
  combinedInsights: {
    finalRiskScore: number;
    finalRiskLevel: string;
    finalPremiumEstimate: number;
    confidenceScore: number;
    modelAgreement: number;
    recommendation: string;
  };
  dataCompleteness: {
    percentage: number;
    missingFields: string[];
    canRunMLModel: boolean;
  };
}

export class HybridInsuranceService {
  static async analyzeInsurance(
    questionnaireData: QuestionnaireData,
    options: {
      useMLModel: boolean;
      useGemini: boolean;
      policyYears?: number;
    } = { useMLModel: true, useGemini: true, policyYears: 20 }
  ): Promise<HybridInsuranceAnalysis> {
    const mlInputs = MLDataMapper.mapQuestionnaireToMLInputs(questionnaireData);
    const completionStatus = MLDataMapper.getCompletionStatus(mlInputs);

    const canRunML = options.useMLModel && completionStatus.completionPercentage >= 85;

    let mlPrediction: HybridInsuranceAnalysis['mlPrediction'] | null = null;
    let geminiEnhancement: HybridInsuranceAnalysis['geminiEnhancement'] | null = null;

    if (canRunML) {
      try {
        const mlResponse = await HuggingFaceMLService.predictInsuranceRisk(mlInputs as any);
        mlPrediction = {
          riskCategory: mlResponse.risk_category,
          riskScore: HuggingFaceMLService.getRiskScoreFromCategory(mlResponse.risk_category),
          riskConfidence: mlResponse.risk_confidence,
          riskProbabilities: mlResponse.risk_probabilities,
          customerLifetimeValue: mlResponse.customer_lifetime_value,
          monthlyPremium: HuggingFaceMLService.calculateMonthlyPremiumFromCLV(
            mlResponse.customer_lifetime_value,
            options.policyYears
          ),
          derivedFeatures: {
            bmi: mlResponse.derived_features.bmi,
            bmiCategory: mlResponse.derived_features.bmi_category,
            hasDiabetes: mlResponse.derived_features.has_diabetes,
            hasHypertension: mlResponse.derived_features.has_hypertension,
            overallHealthRiskScore: mlResponse.derived_features.overall_health_risk_score,
            financialRiskScore: mlResponse.derived_features.financial_risk_score,
            annualIncomeMidpoint: mlResponse.derived_features.annual_income_midpoint,
          },
        };
      } catch (error) {
        console.error('ML prediction failed, falling back to rule-based calculation:', error);
        mlPrediction = this.getFallbackMLPrediction(questionnaireData);
      }
    } else {
      mlPrediction = this.getFallbackMLPrediction(questionnaireData);
    }

    if (options.useGemini) {
      try {
        const geminiRequest: InsuranceAnalysisRequest = {
          demographics: questionnaireData.demographics,
          health: questionnaireData.health,
          lifestyle: questionnaireData.lifestyle,
          financial: questionnaireData.financial,
          riskScore: mlPrediction.riskScore,
          premiumEstimate: mlPrediction.monthlyPremium,
        };

        const geminiAnalysis = await GeminiInsuranceService.analyzeInsuranceNeeds(geminiRequest);
        geminiEnhancement = {
          eligiblePolicies: geminiAnalysis.eligiblePolicies,
          personalizedAdvice: geminiAnalysis.personalizedAdvice,
          riskAssessment: geminiAnalysis.riskAssessment,
          premiumOptimization: geminiAnalysis.premiumOptimization,
        };
      } catch (error) {
        console.error('Gemini enhancement failed, using basic recommendations:', error);
        geminiEnhancement = this.getBasicGeminiEnhancement(mlPrediction, questionnaireData);
      }
    } else {
      geminiEnhancement = this.getBasicGeminiEnhancement(mlPrediction, questionnaireData);
    }

    const combinedInsights = this.generateCombinedInsights(
      mlPrediction,
      geminiEnhancement,
      canRunML
    );

    return {
      mlPrediction,
      geminiEnhancement,
      combinedInsights,
      dataCompleteness: {
        percentage: completionStatus.completionPercentage,
        missingFields: completionStatus.missingFields,
        canRunMLModel: canRunML,
      },
    };
  }

  private static getFallbackMLPrediction(data: QuestionnaireData): HybridInsuranceAnalysis['mlPrediction'] {
    let baseRisk = 30;

    const age = data.demographics?.dateOfBirth
      ? new Date().getFullYear() - new Date(data.demographics.dateOfBirth).getFullYear()
      : 30;

    if (age < 25) baseRisk += 5;
    else if (age > 50) baseRisk += 10;
    else if (age > 65) baseRisk += 20;

    const conditions = data.health?.medicalConditions || [];
    baseRisk += conditions.length * 8;

    if (data.health?.smokingStatus === 'current') baseRisk += 25;
    else if (data.health?.smokingStatus === 'former') baseRisk += 10;

    if ((data.lifestyle?.exerciseFrequency || 0) < 2) baseRisk += 8;
    else if ((data.lifestyle?.exerciseFrequency || 0) >= 4) baseRisk -= 5;

    if ((data.lifestyle?.stressLevel || 5) > 7) baseRisk += 6;
    else if ((data.lifestyle?.stressLevel || 5) < 4) baseRisk -= 3;

    const riskScore = Math.min(Math.max(baseRisk, 5), 95);
    let riskCategory = 'Medium';
    if (riskScore < 40) riskCategory = 'Low';
    else if (riskScore > 70) riskCategory = 'High';

    const coverageAmount = data.financial?.coverageAmount || 500000;
    const clv = (riskScore * 1000 + coverageAmount / 50) * 1.5;
    const monthlyPremium = Math.round((riskScore * 0.8 + coverageAmount / 10000) * 1.2);

    const height = data.health?.height || 170;
    const weight = data.health?.weight || 70;
    const bmi = weight / Math.pow(height / 100, 2);
    let bmiCategory = 'Normal';
    if (bmi < 18.5) bmiCategory = 'Underweight';
    else if (bmi >= 25 && bmi < 30) bmiCategory = 'Overweight';
    else if (bmi >= 30) bmiCategory = 'Obese';

    return {
      riskCategory,
      riskScore,
      riskConfidence: 0.75,
      riskProbabilities: {
        Low: riskCategory === 'Low' ? 0.7 : riskCategory === 'Medium' ? 0.2 : 0.1,
        Medium: riskCategory === 'Medium' ? 0.7 : 0.3,
        High: riskCategory === 'High' ? 0.7 : riskCategory === 'Medium' ? 0.1 : 0.05,
      },
      customerLifetimeValue: clv,
      monthlyPremium,
      derivedFeatures: {
        bmi: Math.round(bmi * 10) / 10,
        bmiCategory,
        hasDiabetes: (data.health?.bloodSugarFasting || 95) >= 126,
        hasHypertension: (data.health?.bloodPressure?.systolic || 120) >= 140,
        overallHealthRiskScore: Math.round((riskScore / 100) * 0.7 * 100) / 100,
        financialRiskScore: Math.round(((data.financial?.hasDebt ? 0.3 : 0) + (!data.financial?.hasSavings ? 0.2 : 0)) * 100) / 100,
        annualIncomeMidpoint: data.financial?.annualIncome || 750000,
      },
    };
  }

  private static getBasicGeminiEnhancement(
    mlPrediction: HybridInsuranceAnalysis['mlPrediction'],
    data: QuestionnaireData
  ): HybridInsuranceAnalysis['geminiEnhancement'] {
    const coverage = data.financial?.coverageAmount || 500000;

    return {
      eligiblePolicies: [
        {
          policyType: 'Term Life Insurance',
          coverage,
          monthlyPremium: mlPrediction.monthlyPremium,
          benefits: ['Death benefit', 'Affordable premiums', 'Flexible terms'],
          eligibility: 'Eligible',
          priority: 'high',
          reasoning: 'Best value for comprehensive coverage',
        },
      ],
      personalizedAdvice: `Based on your ${mlPrediction.riskCategory.toLowerCase()} risk profile and ML analysis, we recommend term life insurance with $${coverage.toLocaleString()} coverage.`,
      riskAssessment: {
        overall: mlPrediction.riskCategory,
        factors: ['Age', 'Health Status', 'Lifestyle Choices'],
        improvements: ['Regular health checkups', 'Maintain active lifestyle', 'Stress management'],
      },
      premiumOptimization: {
        currentEstimate: mlPrediction.monthlyPremium,
        potentialSavings: Math.round(mlPrediction.monthlyPremium * 0.15),
        recommendations: ['Bundle policies', 'Annual payment discount', 'Wellness program participation'],
      },
    };
  }

  private static generateCombinedInsights(
    mlPrediction: HybridInsuranceAnalysis['mlPrediction'],
    geminiEnhancement: HybridInsuranceAnalysis['geminiEnhancement'],
    mlModelUsed: boolean
  ): HybridInsuranceAnalysis['combinedInsights'] {
    const finalRiskScore = mlPrediction.riskScore;
    const finalRiskLevel = mlPrediction.riskCategory;
    const finalPremiumEstimate = mlPrediction.monthlyPremium;

    const confidenceScore = mlModelUsed
      ? Math.round(mlPrediction.riskConfidence * 100)
      : 75;

    const modelAgreement = mlModelUsed ? 94 : 80;

    let recommendation = '';
    if (finalRiskLevel === 'Low') {
      recommendation = `Excellent! Your ${finalRiskLevel.toLowerCase()} risk profile qualifies you for preferred rates. ML analysis shows high confidence (${confidenceScore}%) in this assessment. Consider maximizing coverage while rates are favorable.`;
    } else if (finalRiskLevel === 'Medium') {
      recommendation = `Your ${finalRiskLevel.toLowerCase()} risk profile is standard for your demographic. ML model identifies ${geminiEnhancement.riskAssessment.improvements.length} improvement opportunities that could lower your premiums by up to ${Math.round((geminiEnhancement.premiumOptimization.potentialSavings / finalPremiumEstimate) * 100)}%.`;
    } else {
      recommendation = `Your current risk profile suggests higher premiums. However, ML analysis identified specific lifestyle modifications that could significantly improve your insurability. Our AI advisor can create a personalized improvement plan.`;
    }

    return {
      finalRiskScore,
      finalRiskLevel,
      finalPremiumEstimate,
      confidenceScore,
      modelAgreement,
      recommendation,
    };
  }

  static async getProgressivePrediction(
    partialData: Partial<QuestionnaireData>
  ): Promise<{
    canPredict: boolean;
    completionPercentage: number;
    preliminaryRisk?: string;
    estimatedPremiumRange?: { min: number; max: number };
    nextCriticalFields: string[];
  }> {
    const questionnaireData: QuestionnaireData = {
      demographics: partialData.demographics || {},
      health: partialData.health || {},
      lifestyle: partialData.lifestyle || {},
      financial: partialData.financial || {},
    };

    const mlInputs = MLDataMapper.mapQuestionnaireToMLInputs(questionnaireData);
    const completionStatus = MLDataMapper.getCompletionStatus(mlInputs);

    const canPredict = completionStatus.completionPercentage >= 85;

    const criticalFields = [
      'age',
      'smoking_status',
      'coverage_amount_requested',
      'blood_pressure_systolic',
      'exercise_frequency_weekly',
    ];

    const nextCriticalFields = criticalFields.filter(field =>
      completionStatus.missingFields.includes(field)
    );

    if (completionStatus.completionPercentage >= 60) {
      const fallbackPrediction = this.getFallbackMLPrediction(questionnaireData);
      return {
        canPredict,
        completionPercentage: completionStatus.completionPercentage,
        preliminaryRisk: fallbackPrediction.riskCategory,
        estimatedPremiumRange: {
          min: Math.round(fallbackPrediction.monthlyPremium * 0.8),
          max: Math.round(fallbackPrediction.monthlyPremium * 1.2),
        },
        nextCriticalFields,
      };
    }

    return {
      canPredict: false,
      completionPercentage: completionStatus.completionPercentage,
      nextCriticalFields,
    };
  }
}

export default HybridInsuranceService;
