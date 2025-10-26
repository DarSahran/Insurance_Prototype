import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield, DollarSign, Calendar, Search, Filter, Grid, List,
  Download, Phone, Plus, Eye, CreditCard, FileText,
  CheckCircle, Clock, AlertTriangle, Heart, Activity, Loader
} from 'lucide-react';
import { useUserData } from '../../hooks/useUserData';

const PoliciesPage: React.FC = () => {
  const { policies, loading, firstName } = useUserData();
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { color: string; icon: React.ReactNode }> = {
      active: { color: 'bg-green-100 text-green-800', icon: <CheckCircle className="w-3 h-3 mr-1" /> },
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: <Clock className="w-3 h-3 mr-1" /> },
      expired: { color: 'bg-red-100 text-red-800', icon: <AlertTriangle className="w-3 h-3 mr-1" /> },
      cancelled: { color: 'bg-gray-100 text-gray-800', icon: <AlertTriangle className="w-3 h-3 mr-1" /> }
    };

    const statusInfo = statusMap[status.toLowerCase()] || statusMap.active;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
        {statusInfo.icon}
        {status}
      </span>
    );
  };

  const getPolicyIcon = (policyType: string) => {
    const lowerType = policyType.toLowerCase();
    if (lowerType.includes('life')) return Heart;
    if (lowerType.includes('health')) return Activity;
    return Shield;
  };

  const calculateDaysToRenewal = (expiryDate: string | null) => {
    if (!expiryDate) return null;
    const expiry = new Date(expiryDate);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const filteredPolicies = policies.filter(policy => {
    const matchesSearch = policy.policy_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         policy.policy_number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || policy.policy_type === filterType;
    const matchesStatus = filterStatus === 'All' || policy.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const totalCoverage = policies.reduce((sum, p) => sum + (p.coverage_amount || 0), 0);
  const activePolicies = policies.filter(p => p.status === 'active').length;
  const totalMonthlyPremium = policies
    .filter(p => p.status === 'active')
    .reduce((sum, p) => {
      return sum + (p.monthly_premium || 0);
    }, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your policies...</p>
        </div>
      </div>
    );
  }

  if (policies.length === 0) {
    return (
      <div className="p-6 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Insurance Policies</h1>
            <p className="text-gray-600 mt-1">Manage and track your insurance coverage</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Policies Yet</h3>
          <p className="text-gray-600 mb-6">
            You haven't added any insurance policies yet. Get personalized recommendations based on your profile.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Link
              to="/dashboard/ml-recommendations"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
            >
              <Shield className="w-5 h-5" />
              <span>Get Recommendations</span>
            </Link>
            <Link
              to="/dashboard/assessment/new"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors inline-flex items-center space-x-2"
            >
              <FileText className="w-5 h-5" />
              <span>Complete Assessment</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Insurance Policies</h1>
          <p className="text-gray-600 mt-1">Welcome back, {firstName}! Manage your coverage</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors inline-flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <Link
            to="/dashboard/ml-recommendations"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Policy</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Total Coverage</p>
            <Shield className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalCoverage)}</p>
          <p className="text-xs text-gray-500 mt-1">{policies.length} policies</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Active Policies</p>
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{activePolicies}</p>
          <p className="text-xs text-gray-500 mt-1">out of {policies.length} total</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Monthly Premium</p>
            <DollarSign className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalMonthlyPremium)}</p>
          <p className="text-xs text-gray-500 mt-1">per month</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Next Renewal</p>
            <Calendar className="w-5 h-5 text-orange-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {(() => {
              const nextRenewal = policies
                .filter(p => p.expiry_date)
                .map(p => calculateDaysToRenewal(p.expiry_date))
                .filter(d => d !== null && d > 0)
                .sort((a, b) => a - b)[0];
              return nextRenewal ? `${nextRenewal} days` : 'N/A';
            })()}
          </p>
          <p className="text-xs text-gray-500 mt-1">upcoming renewal</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search policies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Types</option>
              <option value="Life Insurance">Life Insurance</option>
              <option value="Health Insurance">Health Insurance</option>
              <option value="Disability Insurance">Disability</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="expired">Expired</option>
            </select>

            <div className="flex items-center space-x-1 border border-gray-300 rounded-lg p-1">
              <button
                onClick={() => setViewMode('card')}
                className={`p-2 rounded ${viewMode === 'card' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded ${viewMode === 'table' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {filteredPolicies.length === 0 ? (
          <div className="text-center py-12">
            <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No policies found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        ) : viewMode === 'card' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredPolicies.map((policy) => {
              const Icon = getPolicyIcon(policy.policy_type);
              const daysToRenewal = calculateDaysToRenewal(policy.expiry_date);

              return (
                <div key={policy.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Icon className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{policy.policy_type}</h3>
                        <p className="text-sm text-gray-500">{policy.policy_number}</p>
                      </div>
                    </div>
                    {getStatusBadge(policy.status)}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Coverage</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {policy.coverage_amount ? formatCurrency(policy.coverage_amount) : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Premium</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {formatCurrency(policy.annual_premium || 0)}
                        <span className="text-sm text-gray-500">/year</span>
                      </p>
                    </div>
                  </div>

                  {daysToRenewal !== null && daysToRenewal > 0 && (
                    <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <p className="text-sm text-orange-800">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        Renews in {daysToRenewal} days
                      </p>
                    </div>
                  )}

                  <div className="flex items-center space-x-2 pt-4 border-t border-gray-200">
                    <Link
                      to={`/dashboard/policies/${policy.id}`}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center inline-flex items-center justify-center space-x-2"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View Details</span>
                    </Link>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      <Phone className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Policy</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coverage</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Premium</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Renewal</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPolicies.map((policy) => {
                  const Icon = getPolicyIcon(policy.policy_type);
                  const daysToRenewal = calculateDaysToRenewal(policy.expiry_date);

                  return (
                    <tr key={policy.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Icon className="w-5 h-5 text-blue-600 mr-3" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{policy.policy_type}</div>
                            <div className="text-sm text-gray-500">{policy.policy_number}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(policy.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {policy.coverage_amount ? formatCurrency(policy.coverage_amount) : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(policy.annual_premium || 0)}
                        <span className="text-gray-500">/year</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {daysToRenewal !== null && daysToRenewal > 0 ? `${daysToRenewal} days` : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Link
                          to={`/dashboard/policies/${policy.id}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PoliciesPage;
