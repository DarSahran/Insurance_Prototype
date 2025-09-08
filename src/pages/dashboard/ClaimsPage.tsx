import React, { useState } from 'react';
import { 
  FileText, Clock, CheckCircle, XCircle, AlertTriangle, Plus,
  Phone, MessageSquare, Upload, Download, Eye,
  DollarSign, User, Building, Car, Heart, Home
} from 'lucide-react';

const ClaimsPage: React.FC = () => {
  const [selectedClaim, setSelectedClaim] = useState<number | null>(null);
  const [showNewClaimModal, setShowNewClaimModal] = useState(false);

  // Mock claims data
  const claims = [
    {
      id: 1,
      claimNumber: 'CL-2024-001234',
      type: 'health',
      description: 'Emergency Room Visit - Chest Pain',
      submissionDate: '2024-09-15',
      status: 'processing',
      amount: 2850.00,
      approvedAmount: null,
      estimatedResolution: '2024-09-25',
      policy: 'HealthSecure Premium',
      documents: ['Medical Report.pdf', 'Bills Receipt.pdf']
    },
    {
      id: 2,
      claimNumber: 'CL-2024-001189',
      type: 'auto',
      description: 'Vehicle Collision - Rear End',
      submissionDate: '2024-09-08',
      status: 'approved',
      amount: 4200.00,
      approvedAmount: 3800.00,
      estimatedResolution: '2024-09-12',
      policy: 'AutoProtect Comprehensive',
      documents: ['Accident Report.pdf', 'Repair Estimate.pdf', 'Photos.zip']
    },
    {
      id: 3,
      claimNumber: 'CL-2024-001156',
      type: 'home',
      description: 'Water Damage - Burst Pipe',
      submissionDate: '2024-08-28',
      status: 'completed',
      amount: 1500.00,
      approvedAmount: 1350.00,
      estimatedResolution: '2024-09-05',
      policy: 'HomeGuard Standard',
      documents: ['Damage Photos.pdf', 'Repair Invoice.pdf']
    },
    {
      id: 4,
      claimNumber: 'CL-2024-001098',
      type: 'life',
      description: 'Disability Benefits Claim',
      submissionDate: '2024-08-15',
      status: 'denied',
      amount: 5000.00,
      approvedAmount: 0,
      estimatedResolution: '2024-08-22',
      policy: 'LifeSecure Term',
      documents: ['Medical Assessment.pdf', 'Employment Records.pdf']
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'denied': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing': return Clock;
      case 'approved': return CheckCircle;
      case 'completed': return CheckCircle;
      case 'denied': return XCircle;
      case 'pending': return AlertTriangle;
      default: return Clock;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'health': return Heart;
      case 'auto': return Car;
      case 'home': return Home;
      case 'life': return User;
      default: return FileText;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'health': return 'bg-red-100 text-red-800';
      case 'auto': return 'bg-blue-100 text-blue-800';
      case 'home': return 'bg-green-100 text-green-800';
      case 'life': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const claimStats = {
    total: claims.length,
    processing: claims.filter(c => c.status === 'processing').length,
    approved: claims.filter(c => c.status === 'approved' || c.status === 'completed').length,
    totalAmount: claims.reduce((sum, claim) => sum + claim.amount, 0),
    approvedAmount: claims.reduce((sum, claim) => sum + (claim.approvedAmount || 0), 0)
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Claims Management</h1>
          <p className="text-gray-600 mt-1">Track and manage your insurance claims</p>
        </div>
        <button 
          onClick={() => setShowNewClaimModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          <span>New Claim</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Claims</p>
              <p className="text-2xl font-bold text-gray-900">{claimStats.total}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Processing</p>
              <p className="text-2xl font-bold text-yellow-600">{claimStats.processing}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-green-600">{claimStats.approved}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-purple-600">
                ${claimStats.totalAmount.toLocaleString()}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Claims List */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Claims</h2>
        
        <div className="space-y-4">
          {claims.map(claim => {
            const StatusIcon = getStatusIcon(claim.status);
            const TypeIcon = getTypeIcon(claim.type);
            
            return (
              <div 
                key={claim.id} 
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer"
                onClick={() => setSelectedClaim(selectedClaim === claim.id ? null : claim.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <TypeIcon className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-3">
                        <h3 className="font-medium text-gray-900">{claim.claimNumber}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(claim.type)}`}>
                          {claim.type}
                        </span>
                        <div className="flex items-center space-x-1">
                          <StatusIcon className="w-4 h-4" />
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(claim.status)}`}>
                            {claim.status}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-600 mt-1">{claim.description}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <span>Submitted: {claim.submissionDate}</span>
                        <span>Amount: ${claim.amount.toLocaleString()}</span>
                        {claim.approvedAmount && (
                          <span>Approved: ${claim.approvedAmount.toLocaleString()}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-blue-600">
                      <Phone className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-green-600">
                      <MessageSquare className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-purple-600">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {selectedClaim === claim.id && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Claim Details</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Policy:</span>
                            <span className="text-gray-900">{claim.policy}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Submission Date:</span>
                            <span className="text-gray-900">{claim.submissionDate}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Expected Resolution:</span>
                            <span className="text-gray-900">{claim.estimatedResolution}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Claim Amount:</span>
                            <span className="text-gray-900">${claim.amount.toLocaleString()}</span>
                          </div>
                          {claim.approvedAmount !== null && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Approved Amount:</span>
                              <span className="text-gray-900">${claim.approvedAmount.toLocaleString()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Documents</h4>
                        <div className="space-y-2">
                          {claim.documents.map((doc, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <div className="flex items-center space-x-2">
                                <FileText className="w-4 h-4 text-gray-500" />
                                <span className="text-sm text-gray-900">{doc}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <button className="p-1 text-gray-400 hover:text-blue-600">
                                  <Eye className="w-3 h-3" />
                                </button>
                                <button className="p-1 text-gray-400 hover:text-green-600">
                                  <Download className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          ))}
                          <button className="flex items-center space-x-2 w-full p-2 border-2 border-dashed border-gray-300 rounded text-gray-500 hover:border-blue-400 hover:text-blue-600">
                            <Upload className="w-4 h-4" />
                            <span className="text-sm">Upload additional document</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-3 mt-6">
                      <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                        <Phone className="w-4 h-4" />
                        <span>Contact Adjuster</span>
                      </button>
                      <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                        <MessageSquare className="w-4 h-4" />
                        <span>Send Message</span>
                      </button>
                      <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        <Upload className="w-4 h-4" />
                        <span>Upload Documents</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-blue-900 mb-4">Need Help?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3">
            <Phone className="w-5 h-5 text-blue-600" />
            <div>
              <p className="font-medium text-blue-800">Claims Hotline</p>
              <p className="text-sm text-blue-700">1-800-CLAIMS (24/7)</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            <div>
              <p className="font-medium text-blue-800">Live Chat</p>
              <p className="text-sm text-blue-700">Available 9 AM - 6 PM EST</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Building className="w-5 h-5 text-blue-600" />
            <div>
              <p className="font-medium text-blue-800">Find Service Centers</p>
              <p className="text-sm text-blue-700">Locate nearby repair shops</p>
            </div>
          </div>
        </div>
      </div>

      {/* New Claim Modal */}
      {showNewClaimModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg max-h-screen overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">File New Claim</h3>
              <button 
                onClick={() => setShowNewClaimModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <Plus className="w-5 h-5 transform rotate-45" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Claim Type</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option value="">Select claim type</option>
                  <option value="health">Health/Medical</option>
                  <option value="auto">Auto/Vehicle</option>
                  <option value="home">Home/Property</option>
                  <option value="life">Life/Disability</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Policy Number</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option value="">Select policy</option>
                  <option value="health-001">HealthSecure Premium - HSP001</option>
                  <option value="auto-001">AutoProtect Comprehensive - APC001</option>
                  <option value="home-001">HomeGuard Standard - HGS001</option>
                  <option value="life-001">LifeSecure Term - LST001</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Incident Date</label>
                <input 
                  type="date" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea 
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe what happened..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Amount</label>
                <input 
                  type="number" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Supporting Documents</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Drag and drop files here, or click to browse</p>
                  <p className="text-xs text-gray-500 mt-1">Receipts, photos, reports, etc.</p>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button 
                  onClick={() => setShowNewClaimModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Submit Claim
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClaimsPage;
