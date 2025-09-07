import React from 'react';
import { DollarSign, TrendingUp, Users, PieChart, Calculator, Shield } from 'lucide-react';

interface FinancialStepProps {
  data: any;
  onChange: (data: any) => void;
}

const FinancialStep: React.FC<FinancialStepProps> = ({ data, onChange }) => {
  const handleInputChange = (field: string, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const handleBeneficiaryChange = (index: number, field: string, value: string) => {
    const beneficiaries = data.beneficiaries || [{ name: '', relationship: '', percentage: 100 }];
    const updated = [...beneficiaries];
    updated[index] = { ...updated[index], [field]: value };
    handleInputChange('beneficiaries', updated);
  };

  const addBeneficiary = () => {
    const beneficiaries = data.beneficiaries || [];
    const totalPercentage = beneficiaries.reduce((sum, b) => sum + (parseInt(b.percentage) || 0), 0);
    const remainingPercentage = Math.max(100 - totalPercentage, 0);
    
    handleInputChange('beneficiaries', [
      ...beneficiaries,
      { name: '', relationship: '', percentage: remainingPercentage }
    ]);
  };

  const removeBeneficiary = (index: number) => {
    const beneficiaries = data.beneficiaries || [];
    const updated = beneficiaries.filter((_, i) => i !== index);
    handleInputChange('beneficiaries', updated);
  };

  const calculateRecommendedCoverage = () => {
    const income = parseInt(data.annualIncome || '0');
    const dependents = parseInt(data.dependents || '0');
    let multiplier = 10; // Base multiplier
    
    if (dependents > 2) multiplier += 2;
    if (data.hasDebt) multiplier += 3;
    if (data.hasChildren) multiplier += 2;
    
    return income * multiplier;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const incomeRanges = [
    { value: '30000', label: 'Under $30,000' },
    { value: '50000', label: '$30,000 - $50,000' },
    { value: '75000', label: '$50,000 - $75,000' },
    { value: '100000', label: '$75,000 - $100,000' },
    { value: '150000', label: '$100,000 - $150,000' },
    { value: '200000', label: 'Over $150,000' }
  ];

  const policyTerms = [
    { value: '10', label: '10 years', description: 'Lower premiums, shorter coverage' },
    { value: '20', label: '20 years', description: 'Balanced option, most popular' },
    { value: '30', label: '30 years', description: 'Long-term protection' },
    { value: 'whole', label: 'Whole life', description: 'Permanent coverage with cash value' }
  ];

  const relationships = [
    'Spouse', 'Child', 'Parent', 'Sibling', 'Partner', 'Friend', 'Trust', 'Estate', 'Other'
  ];

  const recommendedCoverage = calculateRecommendedCoverage();
  const beneficiaries = data.beneficiaries || [{ name: '', relationship: '', percentage: 100 }];
  const totalPercentage = beneficiaries.reduce((sum, b) => sum + (parseInt(b.percentage) || 0), 0);

  return (
    <div className="space-y-8">
      <div className="border-b border-gray-200 pb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Coverage Preferences & Financial Information</h2>
        <p className="text-gray-600">
          Help us determine the right coverage amount and policy structure for your needs.
        </p>
      </div>

      {/* Coverage Requirements */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center">
          <Shield className="w-5 h-5 mr-2 text-blue-600" />
          Coverage Requirements
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                <Calculator className="w-4 h-4 inline mr-2" />
                Desired Coverage Amount
              </label>
              <input
                type="range"
                min="50000"
                max="2000000"
                step="25000"
                value={data.coverageAmount || 250000}
                onChange={(e) => handleInputChange('coverageAmount', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>$50K</span>
                <span className="font-semibold text-blue-600">
                  {formatCurrency(data.coverageAmount || 250000)}
                </span>
                <span>$2M</span>
              </div>
              
              {recommendedCoverage > 0 && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    💡 Recommended coverage based on your profile: <strong>{formatCurrency(recommendedCoverage)}</strong>
                  </p>
                  <button
                    onClick={() => handleInputChange('coverageAmount', recommendedCoverage)}
                    className="text-xs text-blue-600 hover:text-blue-800 underline mt-1"
                  >
                    Use recommended amount
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Policy Term
              </label>
              <div className="space-y-3">
                {policyTerms.map((term) => (
                  <label key={term.value} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name="policyTerm"
                      value={term.value}
                      checked={data.policyTerm === term.value}
                      onChange={(e) => handleInputChange('policyTerm', e.target.value)}
                      className="w-4 h-4 text-blue-600 mt-1"
                    />
                    <div>
                      <div className="font-medium text-gray-900">{term.label}</div>
                      <div className="text-sm text-gray-600">{term.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Deductible Preference
              </label>
              <select
                value={data.deductiblePreference || ''}
                onChange={(e) => handleInputChange('deductiblePreference', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">Select deductible preference</option>
                <option value="low">Low deductible (higher premium)</option>
                <option value="medium">Medium deductible</option>
                <option value="high">High deductible (lower premium)</option>
              </select>
            </div>

            {/* Coverage Calculator */}
            <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-3">Coverage Calculator</h4>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="hasChildren"
                    checked={data.hasChildren || false}
                    onChange={(e) => handleInputChange('hasChildren', e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <label htmlFor="hasChildren" className="text-sm text-gray-700">I have children</label>
                </div>
                
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="hasDebt"
                    checked={data.hasDebt || false}
                    onChange={(e) => handleInputChange('hasDebt', e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <label htmlFor="hasDebt" className="text-sm text-gray-700">I have significant debt (mortgage, loans)</label>
                </div>
                
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="soleProvider"
                    checked={data.soleProvider || false}
                    onChange={(e) => handleInputChange('soleProvider', e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <label htmlFor="soleProvider" className="text-sm text-gray-700">I'm the primary income provider</label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Information */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center">
          <DollarSign className="w-5 h-5 mr-2 text-green-600" />
          Financial Profile
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Annual Income Range
            </label>
            <select
              value={data.annualIncome || ''}
              onChange={(e) => handleInputChange('annualIncome', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="">Select income range</option>
              {incomeRanges.map((range) => (
                <option key={range.value} value={range.value}>{range.label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Monthly Premium Budget
            </label>
            <input
              type="range"
              min="50"
              max="1000"
              step="25"
              value={data.monthlyBudget || 200}
              onChange={(e) => handleInputChange('monthlyBudget', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>$50</span>
              <span className="font-semibold text-green-600">
                ${data.monthlyBudget || 200}/month
              </span>
              <span>$1000</span>
            </div>
          </div>
        </div>
      </div>

      {/* Beneficiaries */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center">
          <Users className="w-5 h-5 mr-2 text-purple-600" />
          Beneficiary Information
        </h3>
        
        <div className="space-y-4">
          {beneficiaries.map((beneficiary, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={beneficiary.name || ''}
                    onChange={(e) => handleBeneficiaryChange(index, 'name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter beneficiary name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Relationship
                  </label>
                  <select
                    value={beneficiary.relationship || ''}
                    onChange={(e) => handleBeneficiaryChange(index, 'relationship', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select</option>
                    {relationships.map(rel => (
                      <option key={rel} value={rel}>{rel}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Percentage
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={beneficiary.percentage || ''}
                      onChange={(e) => handleBeneficiaryChange(index, 'percentage', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="0"
                    />
                    <span className="text-gray-500">%</span>
                    {beneficiaries.length > 1 && (
                      <button
                        onClick={() => removeBeneficiary(index)}
                        className="text-red-600 hover:text-red-800 p-1"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          <div className="flex items-center justify-between">
            <button
              onClick={addBeneficiary}
              className="text-blue-600 hover:text-blue-800 font-medium text-sm"
            >
              + Add Another Beneficiary
            </button>
            
            <div className="flex items-center space-x-2">
              <PieChart className="w-4 h-4 text-gray-500" />
              <span className={`text-sm font-medium ${
                totalPercentage === 100 ? 'text-green-600' : 'text-red-600'
              }`}>
                Total: {totalPercentage}%
              </span>
            </div>
          </div>
          
          {totalPercentage !== 100 && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800">
                ⚠️ Beneficiary percentages must total 100%. Current total: {totalPercentage}%
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border">
        <h4 className="font-semibold text-gray-900 mb-4">Coverage Summary</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Coverage Amount:</span>
            <span className="font-medium">{formatCurrency(data.coverageAmount || 250000)}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Policy Term:</span>
            <span className="font-medium">
              {policyTerms.find(t => t.value === data.policyTerm)?.label || 'Not selected'}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Monthly Budget:</span>
            <span className="font-medium">${data.monthlyBudget || 200}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialStep;