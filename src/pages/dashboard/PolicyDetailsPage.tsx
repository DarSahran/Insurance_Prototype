import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, Shield, DollarSign, Calendar, Download, Phone, 
  CreditCard, Edit, FileText, Users, AlertTriangle, CheckCircle,
  Clock, Heart, Activity, User, MapPin, Mail
} from 'lucide-react';

const PolicyDetailsPage: React.FC = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock policy data - in real app, fetch based on ID
  const policy = {
    id: 'LI-2024-001',
    type: 'Life Insurance',
    icon: Heart,
    status: 'Active',
    statusColor: 'green',
    policyNumber: 'LI-2024-001',
    coverageAmount: 500000,
    monthlyPremium: 89.99,
    annualPremium: 1079.88,
    deductible: null,
    insurer: 'LifeSecure Insurance',
    insurerLogo: '/logos/lifesecure.png',
    effectiveDate: '2024-01-15',
    renewalDate: '2025-01-15',
    daysToRenewal: 129,
    paymentMethod: 'Auto Pay - Credit Card ending in 4532',
    nextPayment: '2024-12-15',
    nextPaymentAmount: 89.99,
    beneficiaries: [
      { name: 'Jane Doe', relationship: 'Spouse', percentage: 60 },
      { name: 'John Doe Jr.', relationship: 'Child', percentage: 40 }
    ],
    policyHolder: {
      name: 'John Doe',
      email: 'john.doe@email.com',
      phone: '(555) 123-4567',
      address: '123 Main St, Anytown, ST 12345',
      dateOfBirth: '1985-03-20',
      ssn: '***-**-1234'
    },
    coverage: {
      deathBenefit: 500000,
      accidentalDeath: 1000000,
      terminalIllness: 250000,
      waiversOfPremium: true
    },
    exclusions: [
      'Suicide within first 2 years',
      'Death due to war or military action',
      'Death while committing a felony',
      'Death due to aviation (non-commercial)'
    ],
    documents: [
      { name: 'Policy Certificate', date: '2024-01-15', type: 'PDF' },
      { name: 'Beneficiary Forms', date: '2024-01-15', type: 'PDF' },
      { name: 'Medical Exam Results', date: '2023-12-10', type: 'PDF' },
      { name: 'Payment History', date: '2024-10-01', type: 'PDF' }
    ],
    paymentHistory: [
      { date: '2024-10-15', amount: 89.99, status: 'Paid', method: 'Auto Pay' },
      { date: '2024-09-15', amount: 89.99, status: 'Paid', method: 'Auto Pay' },
      { date: '2024-08-15', amount: 89.99, status: 'Paid', method: 'Auto Pay' },
      { date: '2024-07-15', amount: 89.99, status: 'Paid', method: 'Auto Pay' },
      { date: '2024-06-15', amount: 89.99, status: 'Paid', method: 'Auto Pay' }
    ],
    claims: []
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: Shield },
    { id: 'coverage', name: 'Coverage Details', icon: FileText },
    { id: 'beneficiaries', name: 'Beneficiaries', icon: Users },
    { id: 'payments', name: 'Payment History', icon: CreditCard },
    { id: 'documents', name: 'Documents', icon: Download },
    { id: 'claims', name: 'Claims', icon: AlertTriangle }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getStatusBadge = (status: string, color: string) => {
    const colors = {
      green: 'bg-green-100 text-green-800',
      yellow: 'bg-yellow-100 text-yellow-800',
      red: 'bg-red-100 text-red-800'
    };

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${colors[color as keyof typeof colors]}`}>
        {status === 'Active' && <CheckCircle className="w-4 h-4 mr-1" />}
        {status === 'Pending' && <Clock className="w-4 h-4 mr-1" />}
        {status === 'Expired' && <AlertTriangle className="w-4 h-4 mr-1" />}
        {status}
      </span>
    );
  };

  const renderOverviewTab = () => (
    <div className="space-y-8">
      {/* Policy Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Policy Information</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Policy Number:</span>
                <span className="font-medium">{policy.policyNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Policy Type:</span>
                <span className="font-medium">{policy.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Insurance Company:</span>
                <span className="font-medium">{policy.insurer}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Effective Date:</span>
                <span className="font-medium">{policy.effectiveDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Renewal Date:</span>
                <span className="font-medium">{policy.renewalDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                {getStatusBadge(policy.status, policy.statusColor)}
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Coverage Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Death Benefit:</span>
                <span className="font-medium text-lg">{formatCurrency(policy.coverage.deathBenefit)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Accidental Death:</span>
                <span className="font-medium">{formatCurrency(policy.coverage.accidentalDeath)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Terminal Illness:</span>
                <span className="font-medium">{formatCurrency(policy.coverage.terminalIllness)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Waiver of Premium:</span>
                <span className="font-medium">{policy.coverage.waiversOfPremium ? 'Included' : 'Not Included'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Premium Information</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Monthly Premium:</span>
                <span className="font-medium text-lg">{formatCurrency(policy.monthlyPremium)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Annual Premium:</span>
                <span className="font-medium">{formatCurrency(policy.annualPremium)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method:</span>
                <span className="font-medium">{policy.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Next Payment:</span>
                <span className="font-medium">{policy.nextPayment}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Next Amount:</span>
                <span className="font-medium">{formatCurrency(policy.nextPaymentAmount)}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Policy Holder</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-gray-400" />
                <span className="font-medium">{policy.policyHolder.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{policy.policyHolder.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{policy.policyHolder.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{policy.policyHolder.address}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link
            to="/dashboard/payments"
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <CreditCard className="w-4 h-4" />
            <span>Make Payment</span>
          </Link>
          <button className="flex items-center justify-center space-x-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4" />
            <span>Download Policy</span>
          </button>
          <button className="flex items-center justify-center space-x-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
            <Edit className="w-4 h-4" />
            <span>Update Info</span>
          </button>
          <Link
            to="/dashboard/messages"
            className="flex items-center justify-center space-x-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            <Phone className="w-4 h-4" />
            <span>Contact Support</span>
          </Link>
        </div>
      </div>
    </div>
  );

  const renderCoverageTab = () => (
    <div className="space-y-8">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Coverage Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Benefits Included</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-gray-700">Death Benefit</span>
                <span className="font-semibold text-green-700">{formatCurrency(policy.coverage.deathBenefit)}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-gray-700">Accidental Death & Dismemberment</span>
                <span className="font-semibold text-green-700">{formatCurrency(policy.coverage.accidentalDeath)}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-gray-700">Terminal Illness Benefit</span>
                <span className="font-semibold text-green-700">{formatCurrency(policy.coverage.terminalIllness)}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-gray-700">Waiver of Premium</span>
                <span className="font-semibold text-green-700">Included</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Exclusions</h4>
            <div className="space-y-2">
              {policy.exclusions.map((exclusion, index) => (
                <div key={index} className="flex items-start space-x-2 p-3 bg-red-50 rounded-lg">
                  <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <span className="text-red-700 text-sm">{exclusion}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBeneficiariesTab = () => (
    <div className="space-y-8">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Beneficiaries</h3>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Edit className="w-4 h-4" />
            <span>Update Beneficiaries</span>
          </button>
        </div>
        
        <div className="space-y-4">
          {policy.beneficiaries.map((beneficiary, index) => (
            <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{beneficiary.name}</h4>
                  <p className="text-sm text-gray-600">{beneficiary.relationship}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">{beneficiary.percentage}%</p>
                <p className="text-sm text-gray-600">
                  {formatCurrency(policy.coverageAmount * (beneficiary.percentage / 100))}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-900">Total Allocation:</span>
            <span className="font-semibold text-gray-900">
              {policy.beneficiaries.reduce((sum, b) => sum + b.percentage, 0)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPaymentsTab = () => (
    <div className="space-y-8">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Payment History</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Method
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
              {policy.paymentHistory.map((payment, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payment.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(payment.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {payment.method}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900">
                      Download Receipt
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderDocumentsTab = () => (
    <div className="space-y-8">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Policy Documents</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {policy.documents.map((doc, index) => (
            <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <FileText className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{doc.name}</h4>
                  <p className="text-sm text-gray-600">{doc.date} • {doc.type}</p>
                </div>
              </div>
              <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-800">
                <Download className="w-4 h-4" />
                <span className="text-sm">Download</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderClaimsTab = () => (
    <div className="space-y-8">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Claims History</h3>
          <Link
            to="/dashboard/claims"
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <FileText className="w-4 h-4" />
            <span>File New Claim</span>
          </Link>
        </div>
        
        {policy.claims.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircle className="w-16 h-16 text-green-300 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No Claims Filed</h4>
            <p className="text-gray-600">You haven't filed any claims for this policy.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Claims would be rendered here */}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/dashboard/policies"
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Policies</span>
          </Link>
          <div className="h-6 border-l border-gray-300"></div>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <policy.icon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{policy.type}</h1>
              <p className="text-gray-600">Policy #{policy.policyNumber}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {getStatusBadge(policy.status, policy.statusColor)}
          <span className="text-sm text-gray-500">
            Renews in {policy.daysToRenewal} days
          </span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-50 rounded-lg">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Coverage Amount</p>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(policy.coverageAmount)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Monthly Premium</p>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(policy.monthlyPremium)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-50 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Next Payment</p>
              <p className="text-xl font-bold text-gray-900">{policy.nextPayment}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-orange-50 rounded-lg">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Beneficiaries</p>
              <p className="text-xl font-bold text-gray-900">{policy.beneficiaries.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-lg">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && renderOverviewTab()}
          {activeTab === 'coverage' && renderCoverageTab()}
          {activeTab === 'beneficiaries' && renderBeneficiariesTab()}
          {activeTab === 'payments' && renderPaymentsTab()}
          {activeTab === 'documents' && renderDocumentsTab()}
          {activeTab === 'claims' && renderClaimsTab()}
        </div>
      </div>
    </div>
  );
};

export default PolicyDetailsPage;