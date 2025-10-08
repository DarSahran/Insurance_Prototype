import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, Plus, Search, Filter, Calendar, TrendingUp, 
  Eye, Download, BarChart3, Clock, CheckCircle, AlertTriangle,
  Brain, Target, DollarSign
} from 'lucide-react';

const AssessmentsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date_desc');

  const assessments = [
    {
      id: 'ASS-2024-001',
      type: 'Comprehensive Life Insurance',
      status: 'Completed',
      statusColor: 'green',
      dateCompleted: '2024-09-15',
      timeTaken: '7 minutes 23 seconds',
      riskScore: 28,
      riskCategory: 'Low Risk',
      premiumEstimate: 89.99,
      coverageAmount: 500000,
      confidence: 94.2,
      aiModel: 'XGBoost Ensemble v2.1',
      improvements: [
        'Risk score improved by 12 points',
        'Premium reduced by 15% from previous assessment'
      ]
    },
    {
      id: 'ASS-2024-002',
      type: 'Health Insurance Assessment',
      status: 'Completed',
      statusColor: 'green',
      dateCompleted: '2024-08-22',
      timeTaken: '5 minutes 45 seconds',
      riskScore: 35,
      riskCategory: 'Low Risk',
      premiumEstimate: 456.78,
      coverageAmount: null,
      confidence: 91.8,
      aiModel: 'Random Forest v1.8',
      improvements: [
        'Health metrics improved significantly',
        'Lifestyle factors show positive trends'
      ]
    },
    {
      id: 'ASS-2024-003',
      type: 'Disability Insurance',
      status: 'In Progress',
      statusColor: 'yellow',
      dateCompleted: null,
      timeTaken: null,
      riskScore: null,
      riskCategory: null,
      premiumEstimate: null,
      coverageAmount: 60000,
      confidence: null,
      aiModel: null,
      improvements: []
    },
    {
      id: 'ASS-2024-004',
      type: 'Life Insurance Reassessment',
      status: 'Completed',
      statusColor: 'green',
      dateCompleted: '2024-07-10',
      timeTaken: '6 minutes 12 seconds',
      riskScore: 40,
      riskCategory: 'Medium Risk',
      premiumEstimate: 125.50,
      coverageAmount: 500000,
      confidence: 89.5,
      aiModel: 'Neural Network v3.0',
      improvements: [
        'Age factor impact increased',
        'Overall health profile stable'
      ]
    }
  ];

  const getStatusBadge = (status: string, color: string) => {
    const colors = {
      green: 'bg-green-100 text-green-800',
      yellow: 'bg-yellow-100 text-yellow-800',
      red: 'bg-red-100 text-red-800'
    };

    const icons = {
      'Completed': CheckCircle,
      'In Progress': Clock,
      'Failed': AlertTriangle
    };

    const Icon = icons[status as keyof typeof icons] || FileText;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[color as keyof typeof colors]}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </span>
    );
  };

  const getRiskBadge = (category: string) => {
    const colors = {
      'Low Risk': 'bg-green-100 text-green-800',
      'Medium Risk': 'bg-yellow-100 text-yellow-800',
      'High Risk': 'bg-red-100 text-red-800'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[category as keyof typeof colors]}`}>
        <Target className="w-3 h-3 mr-1" />
        {category}
      </span>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const filteredAssessments = assessments.filter(assessment => {
    const matchesSearch = assessment.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assessment.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' || 
                         (selectedFilter === 'completed' && assessment.status === 'Completed') ||
                         (selectedFilter === 'in-progress' && assessment.status === 'In Progress');
    
    return matchesSearch && matchesFilter;
  });

  const completedAssessments = assessments.filter(a => a.status === 'Completed');
  const averageRiskScore = completedAssessments.reduce((sum, a) => sum + (a.riskScore || 0), 0) / completedAssessments.length;
  const averagePremium = completedAssessments.reduce((sum, a) => sum + (a.premiumEstimate || 0), 0) / completedAssessments.length;

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Risk Assessments</h1>
          <p className="text-gray-600">Dashboard &gt; Assessments</p>
        </div>
        <Link
          to="/dashboard/assessment/new"
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          <span>New Assessment</span>
        </Link>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Assessments</p>
              <p className="text-2xl font-bold text-gray-900">{assessments.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-50 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{completedAssessments.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-orange-50 rounded-lg">
              <Target className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg Risk Score</p>
              <p className="text-2xl font-bold text-gray-900">{Math.round(averageRiskScore)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-50 rounded-lg">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg Premium</p>
              <p className="text-2xl font-bold text-gray-900">${Math.round(averagePremium)}</p>
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
                placeholder="Search assessments by type or ID"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Assessments</option>
              <option value="completed">Completed</option>
              <option value="in-progress">In Progress</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="date_desc">Newest First</option>
              <option value="date_asc">Oldest First</option>
              <option value="risk_asc">Risk Score (Low to High)</option>
              <option value="risk_desc">Risk Score (High to Low)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Assessments List */}
      <div className="space-y-6">
        {filteredAssessments.map((assessment) => (
          <div key={assessment.id} className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{assessment.type}</h3>
                    <p className="text-sm text-gray-600">Assessment ID: {assessment.id}</p>
                    {assessment.dateCompleted && (
                      <p className="text-sm text-gray-500 mt-1">
                        Completed on {assessment.dateCompleted} • {assessment.timeTaken}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusBadge(assessment.status, assessment.statusColor)}
                </div>
              </div>

              {assessment.status === 'Completed' && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      <Target className="w-5 h-5 text-orange-600" />
                    </div>
                    <p className="text-sm text-gray-600">Risk Score</p>
                    <p className="text-xl font-bold text-gray-900">{assessment.riskScore}</p>
                    {assessment.riskCategory && getRiskBadge(assessment.riskCategory)}
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      <DollarSign className="w-5 h-5 text-green-600" />
                    </div>
                    <p className="text-sm text-gray-600">Premium Estimate</p>
                    <p className="text-xl font-bold text-gray-900">
                      {assessment.premiumEstimate ? formatCurrency(assessment.premiumEstimate) : 'N/A'}
                    </p>
                    <p className="text-xs text-gray-500">per month</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      <Brain className="w-5 h-5 text-purple-600" />
                    </div>
                    <p className="text-sm text-gray-600">AI Confidence</p>
                    <p className="text-xl font-bold text-gray-900">{assessment.confidence}%</p>
                    <p className="text-xs text-gray-500">{assessment.aiModel}</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      <BarChart3 className="w-5 h-5 text-blue-600" />
                    </div>
                    <p className="text-sm text-gray-600">Coverage</p>
                    <p className="text-xl font-bold text-gray-900">
                      {assessment.coverageAmount ? formatCurrency(assessment.coverageAmount) : 'Comprehensive'}
                    </p>
                  </div>
                </div>
              )}

              {assessment.improvements.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Key Improvements</h4>
                  <div className="space-y-1">
                    {assessment.improvements.map((improvement, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm text-green-700">
                        <TrendingUp className="w-4 h-4" />
                        <span>{improvement}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex space-x-4">
                  {assessment.status === 'Completed' && (
                    <>
                      <Link
                        to={`/dashboard/assessments/${assessment.id}`}
                        className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View Details</span>
                      </Link>
                      <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-800">
                        <Download className="w-4 h-4" />
                        <span>Download Report</span>
                      </button>
                    </>
                  )}
                  {assessment.status === 'In Progress' && (
                    <Link
                      to={`/dashboard/assessment/new?continue=${assessment.id}`}
                      className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
                    >
                      <Clock className="w-4 h-4" />
                      <span>Continue Assessment</span>
                    </Link>
                  )}
                </div>
                <div className="text-sm text-gray-500">
                  {assessment.dateCompleted ? `Completed ${assessment.dateCompleted}` : 'In progress'}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAssessments.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No assessments found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || selectedFilter !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Get started by creating your first risk assessment'
            }
          </p>
          <Link
            to="/dashboard/assessment/new"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            <span>Start New Assessment</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default AssessmentsPage;