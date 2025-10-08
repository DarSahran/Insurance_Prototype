import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, User, Phone, Mail } from 'lucide-react';

const ClaimDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Mock claim data - in a real app, this would be fetched based on the ID
  const claim = {
    id: id || '1',
    claimNumber: `CLM-${id || '2024'}-001`,
    status: 'Under Review',
    dateSubmitted: '2024-10-01',
    estimatedAmount: '$2,500',
    description: 'Water damage to basement due to pipe burst',
    policyNumber: 'POL-2024-HOME-001',
    type: 'Property Damage',
    adjuster: {
      name: 'Sarah Johnson',
      phone: '(555) 123-4567',
      email: 'sarah.johnson@insurance.com'
    },
    documents: [
      { name: 'Initial Claim Report', date: '2024-10-01' },
      { name: 'Property Assessment Photos', date: '2024-10-02' },
      { name: 'Repair Estimate', date: '2024-10-03' }
    ],
    timeline: [
      { date: '2024-10-01', event: 'Claim submitted online' },
      { date: '2024-10-02', event: 'Initial review completed' },
      { date: '2024-10-03', event: 'Adjuster assigned' },
      { date: '2024-10-04', event: 'Property inspection scheduled' }
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'denied': return 'bg-red-100 text-red-800';
      case 'under review': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('/dashboard/claims')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Claim Details</h1>
            <p className="text-gray-600">{claim.claimNumber}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(claim.status)}`}>
          {claim.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Claim Overview */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Claim Overview</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Policy Number</p>
                <p className="font-medium">{claim.policyNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Claim Type</p>
                <p className="font-medium">{claim.type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Date Submitted</p>
                <p className="font-medium">{claim.dateSubmitted}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Estimated Amount</p>
                <p className="font-medium text-green-600">{claim.estimatedAmount}</p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600">Description</p>
              <p className="mt-1">{claim.description}</p>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Claim Timeline</h2>
            <div className="space-y-4">
              {claim.timeline.map((event, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">{event.event}</p>
                    <p className="text-sm text-gray-600">{event.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Documents */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Documents</h2>
            <div className="space-y-3">
              {claim.documents.map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-medium">{doc.name}</p>
                      <p className="text-sm text-gray-600">{doc.date}</p>
                    </div>
                  </div>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Download
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Adjuster Contact */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Adjuster</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-gray-600" />
                <span className="font-medium">{claim.adjuster.name}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-600" />
                <a href={`tel:${claim.adjuster.phone}`} className="text-blue-600 hover:text-blue-700">
                  {claim.adjuster.phone}
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-600" />
                <a href={`mailto:${claim.adjuster.email}`} className="text-blue-600 hover:text-blue-700">
                  {claim.adjuster.email}
                </a>
              </div>
            </div>
            <button className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
              Contact Adjuster
            </button>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors">
                Upload Additional Documents
              </button>
              <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors">
                Request Status Update
              </button>
              <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors">
                Schedule Inspection
              </button>
              <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors text-red-600">
                Cancel Claim
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClaimDetailsPage;
