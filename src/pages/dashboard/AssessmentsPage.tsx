import React from 'react';
import { Link } from 'react-router-dom';
import {
  FileText, Plus, Eye, Clock, CheckCircle, Brain,
  Target, DollarSign, Loader, TrendingUp
} from 'lucide-react';
import { useUserData } from '../../hooks/useUserData';
import { format } from 'date-fns';

const AssessmentsPage: React.FC = () => {
  const { questionnaires, loading, firstName } = useUserData();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getRiskCategory = (score: number) => {
    if (score < 40) return { label: 'Low Risk', color: 'text-green-600' };
    if (score < 70) return { label: 'Medium Risk', color: 'text-yellow-600' };
    return { label: 'High Risk', color: 'text-red-600' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your assessments...</p>
        </div>
      </div>
    );
  }

  if (questionnaires.length === 0) {
    return (
      <div className="p-6 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Insurance Assessments</h1>
            <p className="text-gray-600 mt-1">Track your insurance risk assessments</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Assessments Yet</h3>
          <p className="text-gray-600 mb-6">
            Start your first insurance assessment to get personalized recommendations and risk analysis.
          </p>
          <Link
            to="/dashboard/assessment/new"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Start Your First Assessment</span>
          </Link>
        </div>
      </div>
    );
  }

  const completedAssessments = questionnaires.filter(q => q.status === 'completed');
  const latestAssessment = completedAssessments[0];
  const avgRiskScore = completedAssessments.length > 0
    ? completedAssessments.reduce((sum, q) => sum + (q.risk_score || 0), 0) / completedAssessments.length
    : 0;

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Insurance Assessments</h1>
          <p className="text-gray-600 mt-1">Welcome back, {firstName}! Track your assessments</p>
        </div>
        <Link
          to="/dashboard/assessment/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Assessment</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Total Assessments</p>
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{questionnaires.length}</p>
          <p className="text-xs text-gray-500 mt-1">{completedAssessments.length} completed</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Latest Risk Score</p>
            <Target className="w-5 h-5 text-orange-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {latestAssessment?.risk_score || 'N/A'}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {latestAssessment ? getRiskCategory(latestAssessment.risk_score).label : 'Not assessed'}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Premium Estimate</p>
            <DollarSign className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {latestAssessment?.premium_estimate ? formatCurrency(latestAssessment.premium_estimate) : 'N/A'}
          </p>
          <p className="text-xs text-gray-500 mt-1">per month</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">AI Confidence</p>
            <Brain className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {latestAssessment?.confidence_score || 'N/A'}%
          </p>
          <p className="text-xs text-gray-500 mt-1">accuracy score</p>
        </div>
      </div>

      {completedAssessments.length > 1 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Risk Score Trend</h2>
          </div>

          <div className="flex items-end space-x-2 h-40">
            {completedAssessments.slice(0, 6).reverse().map((assessment, index) => {
              const height = (assessment.risk_score / 100) * 100;
              const color = assessment.risk_score < 40 ? 'bg-green-500' :
                           assessment.risk_score < 70 ? 'bg-yellow-500' : 'bg-red-500';

              return (
                <div key={assessment.id} className="flex-1 flex flex-col items-center">
                  <div className="w-full flex items-end justify-center" style={{ height: '140px' }}>
                    <div
                      className={`w-full ${color} rounded-t-lg transition-all hover:opacity-80`}
                      style={{ height: `${height}%` }}
                      title={`${assessment.risk_score}`}
                    />
                  </div>
                  <p className="text-xs text-gray-600 mt-2">{assessment.risk_score}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Assessments</h2>

        <div className="space-y-4">
          {questionnaires.map((assessment) => {
            const riskCategory = assessment.risk_score ? getRiskCategory(assessment.risk_score) : null;

            return (
              <div key={assessment.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <h3 className="text-lg font-semibold text-gray-900">
                        Insurance Risk Assessment #{questionnaires.indexOf(assessment) + 1}
                      </h3>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        assessment.status === 'completed' ? 'bg-green-100 text-green-800' :
                        assessment.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {assessment.status === 'completed' ? <CheckCircle className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />}
                        {assessment.status}
                      </span>
                    </div>

                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                      <span>Completed: {format(new Date(assessment.created_at), 'MMM d, yyyy')}</span>
                      {assessment.processing_time_seconds && (
                        <span>Duration: {Math.floor(assessment.processing_time_seconds / 60)}m {assessment.processing_time_seconds % 60}s</span>
                      )}
                      <span>Version: {assessment.version}</span>
                    </div>
                  </div>

                  {assessment.status === 'completed' && (
                    <Link
                      to={`/dashboard/assessments/${assessment.id}`}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View Details</span>
                    </Link>
                  )}
                </div>

                {assessment.status === 'completed' && (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Risk Score</p>
                      <p className={`text-2xl font-bold ${riskCategory?.color}`}>
                        {assessment.risk_score}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{riskCategory?.label}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 mb-1">Premium Estimate</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {formatCurrency(assessment.premium_estimate || 0)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">per month</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 mb-1">AI Confidence</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {assessment.confidence_score || 0}%
                      </p>
                      <p className="text-xs text-gray-500 mt-1">accuracy</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 mb-1">Completion</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {assessment.completion_percentage}%
                      </p>
                      <p className="text-xs text-gray-500 mt-1">of data provided</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AssessmentsPage;
