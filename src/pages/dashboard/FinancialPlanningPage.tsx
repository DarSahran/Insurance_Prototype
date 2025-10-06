import React, { useState } from 'react';
import { 
  DollarSign, Calculator, TrendingUp, PieChart, 
  Target, Calendar, Plus, Download, RefreshCw,
  AlertTriangle, CheckCircle, Users, Home, Car,
  GraduationCap, Heart, Shield
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, LineChart, Line } from 'recharts';

const FinancialPlanningPage: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState('current');
  const [coverageAmount, setCoverageAmount] = useState(500000);
  const [policyTerm, setPolicyTerm] = useState(30);

  // Mock financial data
  const currentFinancials = {
    annualIncome: 85000,
    monthlyExpenses: 4200,
    existingDebt: 250000,
    emergencyFund: 25000,
    currentInsurance: 300000,
    dependents: 2,
    retirementSavings: 45000
  };

  const coverageRecommendations = [
    {
      scenario: 'Conservative',
      amount: 400000,
      reasoning: 'Covers existing debt and 5 years of expenses',
      monthlyPremium: 67.50,
      components: [
        { name: 'Debt Coverage', amount: 250000 },
        { name: 'Income Replacement (5 years)', amount: 150000 }
      ]
    },
    {
      scenario: 'Recommended',
      amount: 650000,
      reasoning: 'Comprehensive protection for family needs',
      monthlyPremium: 89.99,
      components: [
        { name: 'Debt Coverage', amount: 250000 },
        { name: 'Income Replacement (7 years)', amount: 300000 },
        { name: 'Education Fund', amount: 100000 }
      ]
    },
    {
      scenario: 'Comprehensive',
      amount: 850000,
      reasoning: 'Maximum protection with future growth',
      monthlyPremium: 125.75,
      components: [
        { name: 'Debt Coverage', amount: 250000 },
        { name: 'Income Replacement (10 years)', amount: 400000 },
        { name: 'Education Fund', amount: 150000 },
        { name: 'Future Expenses', amount: 50000 }
      ]
    }
  ];

  const expenseBreakdown = [
    { category: 'Housing', amount: 1800, percentage: 43 },
    { category: 'Transportation', amount: 650, percentage: 15 },
    { category: 'Food & Dining', amount: 550, percentage: 13 },
    { category: 'Utilities', amount: 300, percentage: 7 },
    { category: 'Insurance', amount: 400, percentage: 10 },
    { category: 'Entertainment', amount: 250, percentage: 6 },
    { category: 'Other', amount: 250, percentage: 6 }
  ];

  const projectionData = [
    { year: 2024, income: 85000, expenses: 50400, insurance: 300000, recommended: 650000 },
    { year: 2025, income: 89250, expenses: 52920, insurance: 300000, recommended: 682500 },
    { year: 2026, income: 93713, expenses: 55566, insurance: 300000, recommended: 716625 },
    { year: 2027, income: 98398, expenses: 58344, insurance: 300000, recommended: 752456 },
    { year: 2028, income: 103318, expenses: 61261, insurance: 300000, recommended: 790079 }
  ];

  const lifeEvents = [
    {
      event: 'Marriage',
      impact: 'Increase coverage by $100K-200K',
      timeline: 'Immediate',
      priority: 'high',
      icon: Heart
    },
    {
      event: 'First Child',
      impact: 'Add $250K for education and care',
      timeline: 'Before birth',
      priority: 'high',
      icon: Users
    },
    {
      event: 'Home Purchase',
      impact: 'Cover mortgage amount',
      timeline: 'At closing',
      priority: 'medium',
      icon: Home
    },
    {
      event: 'Career Advancement',
      impact: 'Increase based on new income',
      timeline: 'Within 6 months',
      priority: 'medium',
      icon: TrendingUp
    },
    {
      event: 'Retirement Planning',
      impact: 'May reduce coverage needs',
      timeline: '5-10 years before',
      priority: 'low',
      icon: Calendar
    }
  ];

  const calculatePremium = (amount: number, term: number) => {
    // Simplified premium calculation based on age, amount, and term
    const baseRate = 0.12; // per $1000 per month
    const termMultiplier = term === 20 ? 0.8 : term === 30 ? 1.0 : 1.2;
    return (amount / 1000) * baseRate * termMultiplier;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

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

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-50 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Annual Income</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(currentFinancials.annualIncome)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-red-50 rounded-lg">
              <TrendingUp className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Monthly Expenses</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(currentFinancials.monthlyExpenses)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-orange-50 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Existing Debt</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(currentFinancials.existingDebt)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Current Coverage</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(currentFinancials.currentInsurance)}</p>
            </div>
          </div>
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
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="number"
                  value={coverageAmount}
                  onChange={(e) => setCoverageAmount(Number(e.target.value))}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="500000"
                />
              </div>
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
                {formatCurrency(calculatePremium(coverageAmount, policyTerm))}/month
              </div>
              <p className="text-sm text-blue-700 mt-1">
                Based on your current risk profile and selected coverage
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
                    {formatCurrency(rec.monthlyPremium)}/mo
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{rec.reasoning}</p>
                <div className="space-y-1">
                  {rec.components.map((component, idx) => (
                    <div key={idx} className="flex justify-between text-xs text-gray-500">
                      <span>{component.name}</span>
                      <span>{formatCurrency(component.amount)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <div className="flex justify-between font-medium">
                    <span>Total Coverage</span>
                    <span>{formatCurrency(rec.amount)}</span>
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
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
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
                <span className="font-medium">{formatCurrency(item.amount)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Coverage Gap Analysis</h3>
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <h4 className="font-medium text-red-900">Coverage Gap Identified</h4>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-red-700">Recommended Coverage:</span>
                  <span className="font-medium text-red-900">{formatCurrency(650000)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-red-700">Current Coverage:</span>
                  <span className="font-medium text-red-900">{formatCurrency(currentFinancials.currentInsurance)}</span>
                </div>
                <div className="flex justify-between border-t border-red-200 pt-2">
                  <span className="text-red-700 font-medium">Gap:</span>
                  <span className="font-bold text-red-900">{formatCurrency(650000 - currentFinancials.currentInsurance)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Risk Factors</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <span className="text-sm text-yellow-800">Insufficient emergency fund</span>
                  <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full">Medium Risk</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <span className="text-sm text-red-800">High debt-to-income ratio</span>
                  <span className="text-xs bg-red-200 text-red-800 px-2 py-1 rounded-full">High Risk</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-sm text-green-800">Stable income source</span>
                  <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full">Low Risk</span>
                </div>
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
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value as number)} />
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
          <div className="flex items-start space-x-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <CheckCircle className="w-5 h-5 text-blue-600 mt-1" />
            <div className="flex-1">
              <h4 className="font-medium text-blue-900">Increase Life Insurance Coverage</h4>
              <p className="text-sm text-blue-700 mt-1">
                Add {formatCurrency(350000)} to reach recommended coverage of {formatCurrency(650000)}
              </p>
              <button className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium">
                Get Quote →
              </button>
            </div>
          </div>
          
          <div className="flex items-start space-x-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <Target className="w-5 h-5 text-yellow-600 mt-1" />
            <div className="flex-1">
              <h4 className="font-medium text-yellow-900">Build Emergency Fund</h4>
              <p className="text-sm text-yellow-700 mt-1">
                Increase emergency fund from {formatCurrency(currentFinancials.emergencyFund)} to {formatCurrency(currentFinancials.monthlyExpenses * 6)}
              </p>
              <button className="mt-2 text-sm text-yellow-600 hover:text-yellow-800 font-medium">
                Create Savings Plan →
              </button>
            </div>
          </div>
          
          <div className="flex items-start space-x-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <Calculator className="w-5 h-5 text-green-600 mt-1" />
            <div className="flex-1">
              <h4 className="font-medium text-green-900">Review Coverage Annually</h4>
              <p className="text-sm text-green-700 mt-1">
                Set up annual reviews to adjust coverage based on life changes and income growth
              </p>
              <button className="mt-2 text-sm text-green-600 hover:text-green-800 font-medium">
                Schedule Review →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialPlanningPage;