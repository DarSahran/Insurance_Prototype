import React, { useState, useEffect } from 'react';
import {
  DollarSign, Calculator, TrendingUp, PieChart,
  Target, Calendar, Plus, Download, RefreshCw,
  AlertTriangle, CheckCircle, Users, Home, Car,
  GraduationCap, Heart, Shield, Lightbulb, TrendingDown
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';

interface UserPreferences {
  maritalStatus: 'single' | 'married';
  dependents: number;
  cityTier: 'tier1' | 'tier2' | 'tier3';
  gender: 'male' | 'female' | 'other';
  occupation: 'salaried' | 'self_employed' | 'hni' | 'nri';
}

const FinancialPlanningPage: React.FC = () => {
  const { user } = useAuth();
  const [selectedScenario, setSelectedScenario] = useState('recommended');

  // User inputs
  const [annualIncome, setAnnualIncome] = useState(7000000);
  const [monthlyExpenses, setMonthlyExpenses] = useState(350000);
  const [existingDebt, setExistingDebt] = useState(21000000);
  const [currentCoverage, setCurrentCoverage] = useState(25000000);
  const [coverageAmount, setCoverageAmount] = useState(50000000);
  const [policyTerm, setPolicyTerm] = useState(20);

  // Personalization
  const [preferences, setPreferences] = useState<UserPreferences>({
    maritalStatus: 'married',
    dependents: 2,
    cityTier: 'tier1',
    gender: 'male',
    occupation: 'salaried'
  });

  const [smartGuidance, setSmartGuidance] = useState<string[]>([]);

  useEffect(() => {
    loadUserPreferences();
  }, [user]);

  useEffect(() => {
    generateSmartGuidance();
  }, [annualIncome, monthlyExpenses, existingDebt, currentCoverage, preferences]);

  const loadUserPreferences = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('user_profiles')
      .select('metadata')
      .eq('user_id', user.id)
      .maybeSingle();

    if (data?.metadata?.financialPreferences) {
      setPreferences(data.metadata.financialPreferences);
    }
  };

  const savePreferences = async (newPreferences: UserPreferences) => {
    if (!user) return;

    setPreferences(newPreferences);

    await supabase
      .from('user_profiles')
      .update({
        metadata: { financialPreferences: newPreferences },
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.id);
  };

  const formatINR = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculatePremium = (amount: number, term: number): number => {
    // Base premium per lakh (₹1,00,000) per month
    let baseRate = preferences.gender === 'female' ? 8 : 10;

    // Adjust for occupation
    const occupationMultiplier = {
      salaried: 1.0,
      self_employed: 1.15,
      hni: 0.95,
      nri: 1.1
    }[preferences.occupation];

    // Adjust for city tier
    const cityMultiplier = {
      tier1: 1.0,
      tier2: 0.95,
      tier3: 0.9
    }[preferences.cityTier];

    // Term multiplier
    const termMultiplier = term === 10 ? 0.7 : term === 20 ? 1.0 : 1.3;

    // Calculate monthly premium
    const lakhs = amount / 100000;
    return Math.round(lakhs * baseRate * occupationMultiplier * cityMultiplier * termMultiplier);
  };

  const calculateRecommendedCoverage = () => {
    const incomeYears = preferences.maritalStatus === 'married' ? 10 : 7;
    const educationFund = preferences.dependents > 0 ? preferences.dependents * 5000000 : 0;
    const futureExpenses = preferences.maritalStatus === 'married' ? 2500000 : 1000000;

    return {
      conservative: existingDebt + (annualIncome * 5),
      recommended: existingDebt + (annualIncome * incomeYears) + educationFund,
      comprehensive: existingDebt + (annualIncome * 15) + educationFund + futureExpenses
    };
  };

  const recommendedCoverage = calculateRecommendedCoverage();

  const coverageRecommendations = [
    {
      scenario: 'Conservative',
      amount: recommendedCoverage.conservative,
      reasoning: 'Covers existing debt and 5 years of income replacement',
      monthlyPremium: calculatePremium(recommendedCoverage.conservative, policyTerm),
      components: [
        { name: 'Debt Coverage', amount: existingDebt },
        { name: 'Income Replacement (5 years)', amount: annualIncome * 5 }
      ]
    },
    {
      scenario: 'Recommended',
      amount: recommendedCoverage.recommended,
      reasoning: 'Comprehensive family protection with education planning',
      monthlyPremium: calculatePremium(recommendedCoverage.recommended, policyTerm),
      components: [
        { name: 'Debt Coverage', amount: existingDebt },
        { name: `Income Replacement (${preferences.maritalStatus === 'married' ? 10 : 7} years)`, amount: annualIncome * (preferences.maritalStatus === 'married' ? 10 : 7) },
        ...(preferences.dependents > 0 ? [{ name: 'Education Fund', amount: preferences.dependents * 5000000 }] : [])
      ]
    },
    {
      scenario: 'Comprehensive',
      amount: recommendedCoverage.comprehensive,
      reasoning: 'Maximum protection covering long-term family needs',
      monthlyPremium: calculatePremium(recommendedCoverage.comprehensive, policyTerm),
      components: [
        { name: 'Debt Coverage', amount: existingDebt },
        { name: 'Income Replacement (15 years)', amount: annualIncome * 15 },
        ...(preferences.dependents > 0 ? [{ name: 'Education Fund', amount: preferences.dependents * 5000000 }] : []),
        { name: 'Future Expenses', amount: preferences.maritalStatus === 'married' ? 2500000 : 1000000 }
      ]
    }
  ];

  const expenseBreakdown = [
    { category: 'Housing', amount: monthlyExpenses * 0.40, percentage: 40 },
    { category: 'Food & Dining', amount: monthlyExpenses * 0.20, percentage: 20 },
    { category: 'Transportation', amount: monthlyExpenses * 0.10, percentage: 10 },
    { category: 'Utilities', amount: monthlyExpenses * 0.08, percentage: 8 },
    { category: 'Insurance', amount: monthlyExpenses * 0.10, percentage: 10 },
    { category: 'Entertainment', amount: monthlyExpenses * 0.07, percentage: 7 },
    { category: 'Other', amount: monthlyExpenses * 0.05, percentage: 5 }
  ];

  const projectionData = Array.from({ length: 5 }, (_, i) => {
    const year = new Date().getFullYear() + i;
    const growthRate = 1.05; // 5% annual growth
    const inflationRate = 1.06; // 6% inflation

    return {
      year,
      income: annualIncome * Math.pow(growthRate, i),
      expenses: monthlyExpenses * 12 * Math.pow(inflationRate, i),
      recommended: recommendedCoverage.recommended * Math.pow(1.05, i)
    };
  });

  const generateSmartGuidance = () => {
    const guidance: string[] = [];

    // Debt-to-income ratio check
    const debtToIncomeRatio = (existingDebt / annualIncome) * 100;
    if (debtToIncomeRatio > 300) {
      guidance.push(`You have a high debt-to-income ratio (${Math.round(debtToIncomeRatio)}%). Consider reducing loans before increasing coverage.`);
    }

    // Coverage gap check
    const coverageGap = recommendedCoverage.recommended - currentCoverage;
    if (coverageGap > 0) {
      guidance.push(`You need to increase your coverage by ${formatINR(coverageGap)} to adequately protect your family.`);
    } else if (coverageGap < -5000000) {
      guidance.push(`You're over-insured by ${formatINR(Math.abs(coverageGap))}. You might save on premiums by reviewing your policies.`);
    }

    // Dependent-based guidance
    if (preferences.dependents > 0 && currentCoverage < 50000000) {
      guidance.push(`Since you have ${preferences.dependents} dependent${preferences.dependents > 1 ? 's' : ''}, consider increasing coverage by ₹25-30L for education and care.`);
    }

    // Expense ratio check
    const expenseRatio = (monthlyExpenses * 12 / annualIncome) * 100;
    if (expenseRatio > 60) {
      guidance.push(`Your expenses are ${Math.round(expenseRatio)}% of income. Focus on building emergency fund before adding insurance.`);
    }

    // Payment frequency suggestion
    if (annualIncome > 10000000) {
      guidance.push('You can save 5-10% on premiums by opting for annual payment instead of monthly.');
    }

    // Women-specific guidance
    if (preferences.gender === 'female') {
      guidance.push('As a woman, you qualify for 10-15% lower premiums. Consider increasing your coverage to maximize protection.');
    }

    setSmartGuidance(guidance.slice(0, 4)); // Limit to 4 suggestions
  };

  const lifeEvents = [
    {
      event: 'Marriage',
      impact: `Increase coverage by ${formatINR(8000000)}-${formatINR(16000000)}`,
      timeline: 'Immediate',
      priority: 'high',
      icon: Heart,
      shown: preferences.maritalStatus === 'single'
    },
    {
      event: 'First Child',
      impact: `Add ${formatINR(5000000)} for education and care`,
      timeline: 'Before birth',
      priority: 'high',
      icon: Users,
      shown: preferences.dependents === 0
    },
    {
      event: 'Home Purchase',
      impact: 'Cover entire mortgage amount',
      timeline: 'At closing',
      priority: 'medium',
      icon: Home,
      shown: true
    },
    {
      event: 'Career Advancement',
      impact: 'Increase based on new income',
      timeline: 'Within 6 months',
      priority: 'medium',
      icon: TrendingUp,
      shown: true
    },
    {
      event: 'Retirement Planning',
      impact: 'May reduce coverage needs',
      timeline: '5-10 years before',
      priority: 'low',
      icon: Calendar,
      shown: true
    }
  ].filter(event => event.shown);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16'];

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Financial Planning & Coverage Calculator</h1>
          <p className="text-gray-600">Dashboard &gt; Financial Planning</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
            <RefreshCw className="w-4 h-4" />
            <span>Update Data</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Download className="w-4 h-4" />
            <span>Export Plan</span>
          </button>
        </div>
      </div>

      {/* Personalization Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Personalize Your Plan</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Marital Status</label>
            <select
              value={preferences.maritalStatus}
              onChange={(e) => savePreferences({ ...preferences, maritalStatus: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="single">Single</option>
              <option value="married">Married</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Dependents</label>
            <select
              value={preferences.dependents}
              onChange={(e) => savePreferences({ ...preferences, dependents: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value={0}>None</option>
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3+</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">City Tier</label>
            <select
              value={preferences.cityTier}
              onChange={(e) => savePreferences({ ...preferences, cityTier: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="tier1">Tier 1 (Metro)</option>
              <option value="tier2">Tier 2</option>
              <option value="tier3">Tier 3</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
            <select
              value={preferences.gender}
              onChange={(e) => savePreferences({ ...preferences, gender: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Occupation</label>
            <select
              value={preferences.occupation}
              onChange={(e) => savePreferences({ ...preferences, occupation: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="salaried">Salaried</option>
              <option value="self_employed">Self-employed</option>
              <option value="hni">HNI</option>
              <option value="nri">NRI</option>
            </select>
          </div>
        </div>
      </div>

      {/* Smart Guidance */}
      {smartGuidance.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Lightbulb className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Smart Recommendations for You</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {smartGuidance.map((guidance, index) => (
              <div key={index} className="flex items-start space-x-3 bg-white rounded-lg p-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-700">{guidance}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-3 bg-green-50 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Annual Income</p>
            </div>
          </div>
          <input
            type="number"
            value={annualIncome}
            onChange={(e) => setAnnualIncome(Number(e.target.value))}
            className="w-full text-xl font-bold text-gray-900 border border-gray-200 rounded px-2 py-1 focus:ring-2 focus:ring-green-500"
          />
          <p className="text-xs text-gray-500 mt-1">{formatINR(annualIncome)}</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-3 bg-red-50 rounded-lg">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Monthly Expenses</p>
            </div>
          </div>
          <input
            type="number"
            value={monthlyExpenses}
            onChange={(e) => setMonthlyExpenses(Number(e.target.value))}
            className="w-full text-xl font-bold text-gray-900 border border-gray-200 rounded px-2 py-1 focus:ring-2 focus:ring-red-500"
          />
          <p className="text-xs text-gray-500 mt-1">{formatINR(monthlyExpenses)}</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-3 bg-orange-50 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Existing Debt</p>
            </div>
          </div>
          <input
            type="number"
            value={existingDebt}
            onChange={(e) => setExistingDebt(Number(e.target.value))}
            className="w-full text-xl font-bold text-gray-900 border border-gray-200 rounded px-2 py-1 focus:ring-2 focus:ring-orange-500"
          />
          <p className="text-xs text-gray-500 mt-1">{formatINR(existingDebt)}</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Current Coverage</p>
            </div>
          </div>
          <input
            type="number"
            value={currentCoverage}
            onChange={(e) => setCurrentCoverage(Number(e.target.value))}
            className="w-full text-xl font-bold text-gray-900 border border-gray-200 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">{formatINR(currentCoverage)}</p>
        </div>
      </div>

      {/* Coverage Calculator */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Coverage Calculator</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Desired Coverage Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">₹</span>
                <input
                  type="number"
                  value={coverageAmount}
                  onChange={(e) => setCoverageAmount(Number(e.target.value))}
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="50000000"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">{formatINR(coverageAmount)}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Policy Term (Years)
              </label>
              <select
                value={policyTerm}
                onChange={(e) => setPolicyTerm(Number(e.target.value))}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={10}>10 Years</option>
                <option value={20}>20 Years</option>
                <option value={30}>30 Years</option>
              </select>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Estimated Premium</h4>
              <div className="text-3xl font-bold text-blue-600">
                {formatINR(calculatePremium(coverageAmount, policyTerm))}/month
              </div>
              <p className="text-sm text-blue-700 mt-1">
                Based on your profile: {preferences.gender}, {preferences.occupation}, {preferences.cityTier} city
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Coverage Recommendations</h4>
            {coverageRecommendations.map((rec, index) => (
              <div
                key={index}
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  selectedScenario === rec.scenario.toLowerCase()
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => {
                  setSelectedScenario(rec.scenario.toLowerCase());
                  setCoverageAmount(rec.amount);
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-medium text-gray-900">{rec.scenario}</h5>
                  <span className="text-lg font-bold text-blue-600">
                    {formatINR(rec.monthlyPremium)}/mo
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{rec.reasoning}</p>
                <div className="space-y-1">
                  {rec.components.map((component, idx) => (
                    <div key={idx} className="flex justify-between text-xs text-gray-500">
                      <span>{component.name}</span>
                      <span>{formatINR(component.amount)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <div className="flex justify-between font-medium">
                    <span>Total Coverage</span>
                    <span>{formatINR(rec.amount)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Expense Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Monthly Expense Breakdown</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={expenseBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="amount"
                >
                  {expenseBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatINR(value as number)} />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {expenseBreakdown.map((item, index) => (
              <div key={index} className="flex items-center space-x-2 text-sm">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-gray-600">{item.category}</span>
                <span className="font-medium">{formatINR(item.amount)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Coverage Gap Analysis</h3>
          <div className="space-y-4">
            {recommendedCoverage.recommended > currentCoverage ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <h4 className="font-medium text-red-900">Coverage Gap Identified</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-red-700">Recommended Coverage:</span>
                    <span className="font-medium text-red-900">{formatINR(recommendedCoverage.recommended)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-red-700">Current Coverage:</span>
                    <span className="font-medium text-red-900">{formatINR(currentCoverage)}</span>
                  </div>
                  <div className="flex justify-between border-t border-red-200 pt-2">
                    <span className="text-red-700 font-medium">Gap:</span>
                    <span className="font-bold text-red-900">{formatINR(recommendedCoverage.recommended - currentCoverage)}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <h4 className="font-medium text-green-900">Well Protected!</h4>
                </div>
                <p className="text-sm text-green-700">
                  Your current coverage meets or exceeds the recommended amount for your profile.
                </p>
              </div>
            )}

            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Risk Factors</h4>
              <div className="space-y-2">
                {(existingDebt / annualIncome) > 3 && (
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <span className="text-sm text-red-800">High debt-to-income ratio</span>
                    <span className="text-xs bg-red-200 text-red-800 px-2 py-1 rounded-full">High Risk</span>
                  </div>
                )}
                {(monthlyExpenses * 12 / annualIncome) < 0.5 && (
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-sm text-green-800">Low expense ratio - good savings</span>
                    <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full">Low Risk</span>
                  </div>
                )}
                {annualIncome >= 5000000 && (
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-sm text-green-800">Strong income stability</span>
                    <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full">Low Risk</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Projections */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">5-Year Financial Projections</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={projectionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis tickFormatter={(value) => `₹${(value / 100000).toFixed(0)}L`} />
              <Tooltip formatter={(value) => formatINR(value as number)} />
              <Line
                type="monotone"
                dataKey="income"
                stroke="#10B981"
                strokeWidth={3}
                name="Annual Income"
                dot={{ fill: '#10B981', strokeWidth: 2, r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="expenses"
                stroke="#EF4444"
                strokeWidth={2}
                name="Annual Expenses"
                dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="recommended"
                stroke="#3B82F6"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Recommended Coverage"
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex items-center justify-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Annual Income</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Annual Expenses</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Recommended Coverage</span>
          </div>
        </div>
      </div>

      {/* Life Events Planning */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Life Events & Coverage Planning</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lifeEvents.map((event, index) => {
            const IconComponent = event.icon;
            return (
              <div key={index} className={`border-2 rounded-lg p-4 ${getPriorityColor(event.priority)}`}>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-white rounded-lg">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{event.event}</h4>
                    <span className="text-xs px-2 py-1 bg-white rounded-full">
                      {event.priority} priority
                    </span>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <p><strong>Impact:</strong> {event.impact}</p>
                  <p><strong>Timeline:</strong> {event.timeline}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Items */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Recommended Actions</h3>
        <div className="space-y-4">
          {recommendedCoverage.recommended > currentCoverage && (
            <div className="flex items-start space-x-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <CheckCircle className="w-5 h-5 text-blue-600 mt-1" />
              <div className="flex-1">
                <h4 className="font-medium text-blue-900">Increase Life Insurance Coverage</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Add {formatINR(recommendedCoverage.recommended - currentCoverage)} to reach recommended coverage of {formatINR(recommendedCoverage.recommended)}.
                  Estimated premium: {formatINR(calculatePremium(recommendedCoverage.recommended - currentCoverage, policyTerm))}/month
                </p>
                <button className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium">
                  Get Quote →
                </button>
              </div>
            </div>
          )}

          {(monthlyExpenses * 6) > (annualIncome * 0.1) && (
            <div className="flex items-start space-x-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <Target className="w-5 h-5 text-yellow-600 mt-1" />
              <div className="flex-1">
                <h4 className="font-medium text-yellow-900">Build Emergency Fund</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  Maintain an emergency fund of {formatINR(monthlyExpenses * 6)} (6 months expenses) for financial security
                </p>
                <button className="mt-2 text-sm text-yellow-600 hover:text-yellow-800 font-medium">
                  Create Savings Plan →
                </button>
              </div>
            </div>
          )}

          <div className="flex items-start space-x-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <Calculator className="w-5 h-5 text-green-600 mt-1" />
            <div className="flex-1">
              <h4 className="font-medium text-green-900">Review Coverage Annually</h4>
              <p className="text-sm text-green-700 mt-1">
                Set up annual reviews to adjust coverage based on life changes, income growth, and family needs
              </p>
              <button className="mt-2 text-sm text-green-600 hover:text-green-800 font-medium">
                Schedule Review →
              </button>
            </div>
          </div>

          {preferences.gender === 'female' && (
            <div className="flex items-start space-x-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <Heart className="w-5 h-5 text-purple-600 mt-1" />
              <div className="flex-1">
                <h4 className="font-medium text-purple-900">Women-Specific Benefits</h4>
                <p className="text-sm text-purple-700 mt-1">
                  You qualify for 10-15% lower premiums. Explore women-specific plans with additional maternity and critical illness coverage.
                </p>
                <button className="mt-2 text-sm text-purple-600 hover:text-purple-800 font-medium">
                  View Plans →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinancialPlanningPage;
