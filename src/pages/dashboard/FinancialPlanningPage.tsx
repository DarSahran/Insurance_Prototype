import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  DollarSign, TrendingUp, Calculator, PieChart, Target, 
  Download, CreditCard, Home, GraduationCap, Baby, Heart
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
         PieChart as RechartsPieChart, Pie, Cell, AreaChart, Area, Line } from 'recharts';

const FinancialPlanningPage: React.FC = () => {
  const [lifeEvent, setLifeEvent] = useState('');

  // Mock financial data
  const currentFinancials = {
    income: 85000,
    monthlyExpenses: 4200,
    debt: 150000,
    savings: 25000,
    currentCoverage: 300000,
    recommendedCoverage: 850000
  };

  const lifeEvents = [
    { id: 'marriage', name: 'Getting Married', icon: Heart, impact: '+$200K coverage' },
    { id: 'home', name: 'Buying a Home', icon: Home, impact: '+$400K coverage' },
    { id: 'baby', name: 'Having a Baby', icon: Baby, impact: '+$300K coverage' },
    { id: 'education', name: 'Child\'s Education', icon: GraduationCap, impact: '+$250K coverage' },
    { id: 'business', name: 'Starting a Business', icon: TrendingUp, impact: '+$500K coverage' },
    { id: 'retirement', name: 'Planning Retirement', icon: Target, impact: 'Adjust term length' }
  ];

  const coverageBreakdown = [
    { category: 'Income Replacement', amount: 510000, percentage: 60, color: '#3B82F6' },
    { category: 'Debt Coverage', amount: 150000, percentage: 18, color: '#10B981' },
    { category: 'Emergency Fund', amount: 50000, percentage: 6, color: '#F59E0B' },
    { category: 'Child Education', amount: 100000, percentage: 12, color: '#8B5CF6' },
    { category: 'Final Expenses', amount: 40000, percentage: 4, color: '#EF4444' }
  ];

  const premiumComparison = [
    { age: 25, term20: 25, term30: 35, whole: 180 },
    { age: 30, term20: 30, term30: 42, whole: 220 },
    { age: 35, term20: 45, term30: 62, whole: 280 },
    { age: 40, term20: 75, term30: 98, whole: 360 },
    { age: 45, term20: 125, term30: 155, whole: 480 },
    { age: 50, term20: 200, term30: 245, whole: 620 }
  ];

  const savingsProjection = [
    { year: 2025, traditional: 89, ai: 89, savings: 0 },
    { year: 2026, traditional: 95, ai: 85, savings: 120 },
    { year: 2027, traditional: 102, ai: 82, savings: 360 },
    { year: 2028, traditional: 109, ai: 78, savings: 732 },
    { year: 2029, traditional: 117, ai: 75, savings: 1236 },
    { year: 2030, traditional: 125, ai: 72, savings: 1884 }
  ];

  const riskFactors = [
    {
      factor: 'Income Stability',
      score: 85,
      status: 'good',
      description: 'Stable employment in growing industry'
    },
    {
      factor: 'Debt-to-Income Ratio',
      score: 72,
      status: 'fair',
      description: '28% DTI - within acceptable range'
    },
    {
      factor: 'Emergency Savings',
      score: 60,
      status: 'needs_improvement',
      description: '3 months expenses - recommend 6 months'
    },
    {
      factor: 'Health & Lifestyle',
      score: 92,
      status: 'excellent',
      description: 'Excellent health profile reduces risk'
    }
  ];

  const calculatorInputs = {
    income: 85000,
    spouse_income: 45000,
    monthly_expenses: 4200,
    mortgage: 150000,
    other_debt: 25000,
    children: 1,
    education_cost: 50000,
    funeral_costs: 15000,
    years_to_cover: 20
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const calculateCoverage = () => {
    const incomeReplacement = calculatorInputs.income * calculatorInputs.years_to_cover * 0.7;
    const debtCoverage = calculatorInputs.mortgage + calculatorInputs.other_debt;
    const educationCosts = calculatorInputs.children * calculatorInputs.education_cost;
    const finalExpenses = calculatorInputs.funeral_costs;
    
    return incomeReplacement + debtCoverage + educationCosts + finalExpenses;
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Financial Planning & Coverage Calculator</h1>
          <p className="text-gray-600 mt-1">Plan your financial future and optimize your insurance coverage</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Calculator className="w-4 h-4" />
            <span>New Calculation</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4" />
            <span>Export Plan</span>
          </button>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="w-8 h-8 text-green-600" />
            <span className="text-2xl font-bold text-green-600">
              ${(currentFinancials.income / 1000).toFixed(0)}K
            </span>
          </div>
          <h3 className="font-semibold text-gray-900">Annual Income</h3>
          <p className="text-sm text-gray-600">Primary income source</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <CreditCard className="w-8 h-8 text-red-600" />
            <span className="text-2xl font-bold text-red-600">
              ${(currentFinancials.debt / 1000).toFixed(0)}K
            </span>
          </div>
          <h3 className="font-semibold text-gray-900">Total Debt</h3>
          <p className="text-sm text-gray-600">Mortgage + other debt</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <Target className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-blue-600">
              ${(currentFinancials.currentCoverage / 1000).toFixed(0)}K
            </span>
          </div>
          <h3 className="font-semibold text-gray-900">Current Coverage</h3>
          <p className="text-sm text-gray-600">Existing life insurance</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8 text-purple-600" />
            <span className="text-2xl font-bold text-purple-600">
              ${(currentFinancials.recommendedCoverage / 1000).toFixed(0)}K
            </span>
          </div>
          <h3 className="font-semibold text-gray-900">Recommended Coverage</h3>
          <p className="text-sm text-gray-600">AI-calculated optimal amount</p>
        </div>
      </div>

      {/* Coverage Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Calculator Inputs */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Coverage Calculator</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Annual Income</label>
                <input
                  type="number"
                  value={calculatorInputs.income}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => console.log('Income changed:', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Spouse Income</label>
                <input
                  type="number"
                  value={calculatorInputs.spouse_income}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => console.log('Spouse income changed:', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Expenses</label>
                <input
                  type="number"
                  value={calculatorInputs.monthly_expenses}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => console.log('Expenses changed:', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Number of Children</label>
                <input
                  type="number"
                  value={calculatorInputs.children}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => console.log('Children changed:', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mortgage Balance</label>
                <input
                  type="number"
                  value={calculatorInputs.mortgage}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => console.log('Mortgage changed:', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Other Debt</label>
                <input
                  type="number"
                  value={calculatorInputs.other_debt}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => console.log('Other debt changed:', e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Years to Cover</label>
              <select 
                value={calculatorInputs.years_to_cover}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                onChange={(e) => console.log('Years changed:', e.target.value)}
              >
                <option value={10}>10 years</option>
                <option value={15}>15 years</option>
                <option value={20}>20 years</option>
                <option value={25}>25 years</option>
                <option value={30}>30 years</option>
              </select>
            </div>

            <button className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
              Calculate Recommended Coverage
            </button>
          </div>
        </div>

        {/* Coverage Breakdown */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Recommended Coverage Breakdown</h2>
          <div className="text-center mb-6">
            <p className="text-3xl font-bold text-blue-600">${calculateCoverage().toLocaleString()}</p>
            <p className="text-gray-600">Total Recommended Coverage</p>
          </div>
          
          <div className="h-64 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={coverageBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="amount"
                >
                  {coverageBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-3">
            {coverageBreakdown.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm font-medium text-gray-900">{item.category}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">${item.amount.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">{item.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Life Events Impact */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Life Events Impact Calculator</h2>
        <p className="text-gray-600 mb-6">See how major life events affect your insurance needs</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {lifeEvents.map((event) => (
            <button
              key={event.id}
              onClick={() => setLifeEvent(event.id)}
              className={`p-4 rounded-lg border-2 transition-all ${
                lifeEvent === event.id 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <event.icon className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium text-gray-900">{event.name}</h3>
                  <p className="text-sm text-gray-600">{event.impact}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {lifeEvent && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Impact Analysis</h4>
            <p className="text-blue-800 text-sm">
              Based on your selection, we recommend adjusting your coverage. 
              This change would affect your premium by approximately $15-25/month.
            </p>
            <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
              Get Updated Quote
            </button>
          </div>
        )}
      </div>

      {/* Premium Comparison & Savings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Premium by Age */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Premium Comparison by Age</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={premiumComparison}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="age" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="term20" fill="#3B82F6" name="20-Year Term" />
                <Bar dataKey="term30" fill="#10B981" name="30-Year Term" />
                <Bar dataKey="whole" fill="#EF4444" name="Whole Life" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center space-x-6 mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">20-Year Term</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">30-Year Term</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Whole Life</span>
            </div>
          </div>
        </div>

        {/* Savings Projection */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">AI vs Traditional Savings</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={savingsProjection}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="savings" 
                  stroke="#10B981" 
                  fill="#10B981"
                  fillOpacity={0.3}
                  strokeWidth={3}
                />
                <Line 
                  type="monotone" 
                  dataKey="traditional" 
                  stroke="#EF4444" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
                <Line 
                  type="monotone" 
                  dataKey="ai" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center mt-4">
            <p className="text-2xl font-bold text-green-600">$1,884</p>
            <p className="text-sm text-gray-600">Projected 5-year savings with AI optimization</p>
          </div>
        </div>
      </div>

      {/* Risk Assessment */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Financial Risk Assessment</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {riskFactors.map((factor, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">{factor.factor}</h4>
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl font-bold text-gray-900">{factor.score}</span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getScoreColor(factor.score)}`}>
                  {factor.status.replace('_', ' ')}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                <div 
                  className={`h-2 rounded-full ${
                    factor.score >= 80 ? 'bg-green-500' :
                    factor.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${factor.score}%` }}
                />
              </div>
              <p className="text-sm text-gray-600">{factor.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Financial Planning Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/dashboard/assessment/new"
            className="flex items-center space-x-3 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calculator className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Get New Quote</h3>
              <p className="text-sm text-gray-600">Calculate updated premiums</p>
            </div>
          </Link>

          <Link
            to="/dashboard/policies"
            className="flex items-center space-x-3 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="p-2 bg-green-100 rounded-lg">
              <PieChart className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Review Policies</h3>
              <p className="text-sm text-gray-600">Optimize existing coverage</p>
            </div>
          </Link>

          <button className="flex items-center space-x-3 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Schedule Consultation</h3>
              <p className="text-sm text-gray-600">Speak with a financial advisor</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinancialPlanningPage;
