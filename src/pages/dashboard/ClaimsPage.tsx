import React from 'react';
import { Link } from 'react-router-dom';
import {
  FileText, Clock, CheckCircle, XCircle, AlertTriangle, Plus,
  DollarSign, Loader, Calendar
} from 'lucide-react';
import { useUserData } from '../../hooks/useUserData';
import { format } from 'date-fns';

const ClaimsPage: React.FC = () => {
  const { claims, loading, firstName } = useUserData();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      approved: 'bg-green-100 text-green-800',
      completed: 'bg-green-100 text-green-800',
      denied: 'bg-red-100 text-red-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return statusMap[status.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower === 'approved' || statusLower === 'completed') return <CheckCircle className="w-4 h-4" />;
    if (statusLower === 'denied' || statusLower === 'rejected') return <XCircle className="w-4 h-4" />;
    if (statusLower === 'processing') return <Clock className="w-4 h-4" />;
    return <AlertTriangle className="w-4 h-4" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your claims...</p>
        </div>
      </div>
    );
  }

  if (claims.length === 0) {
    return (
      <div className="p-6 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Insurance Claims</h1>
            <p className="text-gray-600 mt-1">Track and manage your insurance claims</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Claims Yet</h3>
          <p className="text-gray-600 mb-6">
            You haven't submitted any insurance claims. When you do, they'll appear here for tracking.
          </p>
          <Link
            to="/dashboard/policies"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
          >
            <FileText className="w-5 h-5" />
            <span>View Your Policies</span>
          </Link>
        </div>
      </div>
    );
  }

  const totalClaimed = claims.reduce((sum, c) => sum + c.claim_amount, 0);
  const totalApproved = claims.reduce((sum, c) => sum + (c.approved_amount || 0), 0);
  const pendingClaims = claims.filter(c => c.status === 'pending' || c.status === 'processing').length;

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Insurance Claims</h1>
          <p className="text-gray-600 mt-1">Welcome back, {firstName}! Track your claims</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>New Claim</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Total Claims</p>
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{claims.length}</p>
          <p className="text-xs text-gray-500 mt-1">submitted</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Pending</p>
            <Clock className="w-5 h-5 text-yellow-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{pendingClaims}</p>
          <p className="text-xs text-gray-500 mt-1">in progress</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Total Claimed</p>
            <DollarSign className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalClaimed)}</p>
          <p className="text-xs text-gray-500 mt-1">requested</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Total Approved</p>
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalApproved)}</p>
          <p className="text-xs text-gray-500 mt-1">paid out</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Claims</h2>

        <div className="space-y-4">
          {claims.map((claim) => (
            <div key={claim.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{claim.claim_number}</h3>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium space-x-1 ${getStatusColor(claim.status)}`}>
                      {getStatusIcon(claim.status)}
                      <span>{claim.status}</span>
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{claim.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Filed: {format(new Date(claim.claim_date), 'MMM d, yyyy')}
                    </span>
                    {claim.policies && (
                      <span className="flex items-center">
                        <FileText className="w-4 h-4 mr-1" />
                        {claim.policies.policy_type}
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm text-gray-600 mb-1">Claimed Amount</p>
                  <p className="text-xl font-bold text-gray-900">{formatCurrency(claim.claim_amount)}</p>
                  {claim.approved_amount && (
                    <p className="text-sm text-green-600 mt-1">
                      Approved: {formatCurrency(claim.approved_amount)}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  {claim.fraud_score !== null && (
                    <span className="inline-flex items-center">
                      Fraud Score: <span className={`ml-1 font-medium ${claim.fraud_score > 50 ? 'text-red-600' : 'text-green-600'}`}>
                        {claim.fraud_score}/100
                      </span>
                    </span>
                  )}
                </div>
                <Link
                  to={`/dashboard/claims/${claim.id}`}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClaimsPage;
