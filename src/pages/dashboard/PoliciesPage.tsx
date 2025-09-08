import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, DollarSign, Calendar, Search, Filter, Grid, List, 
  Download, Phone, Plus, Eye, CreditCard, FileText, 
  CheckCircle, Clock, AlertTriangle, Heart, Activity, Home, Car
} from 'lucide-react';

const PoliciesPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    type: 'All',
    status: 'All',
    premiumRange: [0, 1000],
    renewalDate: ''
  });
  const [selectedPolicies, setSelectedPolicies] = useState<string[]>([]);
  const [comparisonMode, setComparisonMode] = useState(false);

  const policies = [
    {
      id: 'LI-2024-001',
      type: 'Life Insurance',
      icon: Heart,
      status: 'Active',
      statusColor: 'green',
      coverageAmount: 500000,
      monthlyPremium: 89.99,
      deductible: null,
      insurer: 'LifeSecure Insurance',
      insurerLogo: '/logos/lifesecure.png',
      effectiveDate: '2024-01-15',
      renewalDate: '2025-01-15',
      daysToRenewal: 129,
      paymentMethod: 'Auto Pay - Credit Card',
      nextPayment: '2024-12-15',
      beneficiaries: ['Jane Doe (Spouse)', 'John Doe Jr. (Child)'],
      policyNumber: 'LI-2024-001'
    },
    {
      id: 'HI-2024-002',
      type: 'Health Insurance',
      icon: Activity,
      status: 'Active',
      statusColor: 'green',
      coverageAmount: null,
      monthlyPremium: 456.78,
      deductible: 2500,
      insurer: 'HealthFirst Insurance',
      insurerLogo: '/logos/healthfirst.png',
      effectiveDate: '2024-03-01',
      renewalDate: '2025-03-01',
      daysToRenewal: 174,
      paymentMethod: 'Auto Pay - Bank Account',
      nextPayment: '2024-12-01',
      network: 'PPO Network',
      policyNumber: 'HI-2024-002'
    },
    {
      id: 'DI-2024-003',
      type: 'Disability Insurance',
      icon: Shield,
      status: 'Pending',
      statusColor: 'yellow',
      coverageAmount: 60000,
      monthlyPremium: 125.50,
      deductible: null,
      insurer: 'DisabilityCare Plus',
      insurerLogo: '/logos/disabilitycare.png',
      effectiveDate: '2024-11-01',
      renewalDate: '2025-11-01',
      daysToRenewal: 365,
      paymentMethod: 'Manual Payment',
      nextPayment: '2024-11-01',
      policyNumber: 'DI-2024-003'
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: string, color: string) => {
    const colors = {
      green: 'bg-green-100 text-green-800',
      yellow: 'bg-yellow-100 text-yellow-800',
      red: 'bg-red-100 text-red-800',
      gray: 'bg-gray-100 text-gray-800'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[color as keyof typeof colors]}`}>
        {status === 'Active' && <CheckCircle className="w-3 h-3 mr-1" />}
        {status === 'Pending' && <Clock className="w-3 h-3 mr-1" />}
        {status === 'Expired' && <AlertTriangle className="w-3 h-3 mr-1" />}
        {status}
      </span>
    );
  };

  const handlePolicySelection = (policyId: string) => {
    if (comparisonMode) {
      setSelectedPolicies(prev => 
        prev.includes(policyId) 
          ? prev.filter(id => id !== policyId)
          : prev.length < 3 ? [...prev, policyId] : prev
      );
    }
  };

  const filteredPolicies = policies.filter(policy => {
    const matchesSearch = policy.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         policy.policyNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         policy.insurer.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedFilters.type === 'All' || policy.type === selectedFilters.type;
    const matchesStatus = selectedFilters.status === 'All' || policy.status === selectedFilters.status;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const totalCoverage = policies.reduce((sum, policy) => sum + (policy.coverageAmount || 0), 0);
  const totalMonthlyPremium = policies.reduce((sum, policy) => sum + policy.monthlyPremium, 0);

  const renderCardView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredPolicies.map((policy) => (
        <div
          key={policy.id}
          className={`bg-white rounded-xl shadow-lg border-2 transition-all duration-200 hover:shadow-xl ${
            comparisonMode && selectedPolicies.includes(policy.id) 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => handlePolicySelection(policy.id)}
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <policy.icon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{policy.type}</h3>
                  <p className="text-sm text-gray-500">{policy.policyNumber}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusBadge(policy.status, policy.statusColor)}
                {comparisonMode && (
                  <input
                    type="checkbox"
                    checked={selectedPolicies.includes(policy.id)}
                    onChange={() => handlePolicySelection(policy.id)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Main Info */}
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Coverage Amount</p>
                <p className="text-2xl font-bold text-gray-900">
                  {policy.coverageAmount ? formatCurrency(policy.coverageAmount) : 'Comprehensive'}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Monthly Premium</p>
                  <p className="text-lg font-semibold text-gray-900">${policy.monthlyPremium}</p>
                </div>
                {policy.deductible && (
                  <div>
                    <p className="text-sm text-gray-600">Deductible</p>
                    <p className="text-lg font-semibold text-gray-900">${policy.deductible}</p>
                  </div>
                )}
              </div>

              <div>
                <p className="text-sm text-gray-600">Insurance Company</p>
                <p className="font-medium text-gray-900">{policy.insurer}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Renewal Date</p>
                <div className="flex items-center space-x-2">
                  <p className="font-medium text-gray-900">{policy.renewalDate}</p>
                  <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                    {policy.daysToRenewal} days
                  </span>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600">Payment Method</p>
                <p className="font-medium text-gray-900">{policy.paymentMethod}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="grid grid-cols-2 gap-3">
              <Link
                to={`/dashboard/policies/${policy.id}`}
                className="flex items-center justify-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
              >
                <Eye className="w-4 h-4" />
                <span>View Details</span>
              </Link>
              <Link
                to="/dashboard/payments"
                className="flex items-center justify-center space-x-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
              >
                <CreditCard className="w-4 h-4" />
                <span>Make Payment</span>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <button className="flex items-center justify-center space-x-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm">
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>
              <Link
                to="/dashboard/messages"
                className="flex items-center justify-center space-x-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
              >
                <Phone className="w-4 h-4" />
                <span>Support</span>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderTableView = () => (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {comparisonMode && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Select
              </th>
            )}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Policy #
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Coverage
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Premium
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Renewal
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredPolicies.map((policy) => (
            <tr key={policy.id} className="hover:bg-gray-50">
              {comparisonMode && (
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedPolicies.includes(policy.id)}
                    onChange={() => handlePolicySelection(policy.id)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                </td>
              )}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center space-x-3">
                  <policy.icon className="w-5 h-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900">{policy.type}</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {policy.policyNumber}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {policy.coverageAmount ? formatCurrency(policy.coverageAmount) : 'Comprehensive'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ${policy.monthlyPremium}/mo
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {policy.renewalDate}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getStatusBadge(policy.status, policy.statusColor)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-2">
                  <Link
                    to={`/dashboard/policies/${policy.id}`}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    View
                  </Link>
                  <Link
                    to="/dashboard/payments"
                    className="text-green-600 hover:text-green-900"
                  >
                    Pay
                  </Link>
                  <button className="text-gray-600 hover:text-gray-900">
                    Download
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Insurance Policies</h1>
          <p className="text-gray-600">Dashboard &gt; Policies</p>
        </div>
        <div className="flex space-x-3">
          <Link
            to="/dashboard/assessment/new"
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            <span>Get New Quote</span>
          </Link>
          <button
            onClick={() => setComparisonMode(!comparisonMode)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${
              comparisonMode 
                ? 'bg-blue-50 border-blue-300 text-blue-700' 
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>{comparisonMode ? 'Exit Comparison' : 'Compare Policies'}</span>
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Policies</p>
              <p className="text-2xl font-bold text-gray-900">{policies.filter(p => p.status === 'Active').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-50 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Coverage</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalCoverage)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-50 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Monthly Premium</p>
              <p className="text-2xl font-bold text-gray-900">${totalMonthlyPremium.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search policies by type, number, or status"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={selectedFilters.type}
              onChange={(e) => setSelectedFilters(prev => ({ ...prev, type: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="All">All Types</option>
              <option value="Life Insurance">Life Insurance</option>
              <option value="Health Insurance">Health Insurance</option>
              <option value="Disability Insurance">Disability Insurance</option>
            </select>
            
            <select
              value={selectedFilters.status}
              onChange={(e) => setSelectedFilters(prev => ({ ...prev, status: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Expired">Expired</option>
            </select>

            <div className="flex items-center space-x-2 border border-gray-300 rounded-lg p-1">
              <button
                onClick={() => setViewMode('card')}
                className={`p-2 rounded ${viewMode === 'card' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded ${viewMode === 'table' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Mode Info */}
      {comparisonMode && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <span className="text-blue-800 font-medium">
                Comparison Mode: {selectedPolicies.length}/3 policies selected
              </span>
            </div>
            {selectedPolicies.length > 1 && (
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Compare Selected
              </button>
            )}
          </div>
        </div>
      )}

      {/* Policies Display */}
      {viewMode === 'card' ? renderCardView() : renderTableView()}

      {filteredPolicies.length === 0 && (
        <div className="text-center py-12">
          <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No policies found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || selectedFilters.type !== 'All' || selectedFilters.status !== 'All'
              ? 'Try adjusting your search or filters'
              : 'Get started by requesting a new insurance quote'
            }
          </p>
          <Link
            to="/dashboard/assessment/new"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            <span>Get New Quote</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default PoliciesPage;