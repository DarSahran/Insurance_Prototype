import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, Plus, Edit, Trash2, Heart, User, Baby, 
  Crown, Shield, Phone, Mail, Calendar, X
} from 'lucide-react';

const FamilyManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('family');
  const [showAddModal, setShowAddModal] = useState(false);

  // Mock family data
  const familyMembers = [
    {
      id: 1,
      name: 'Sarah Johnson',
      relationship: 'Spouse',
      dateOfBirth: '1992-05-15',
      phone: '(555) 123-4567',
      email: 'sarah.johnson@email.com',
      coverageStatus: 'covered',
      dependentStatus: 'primary'
    },
    {
      id: 2,
      name: 'Emily Johnson',
      relationship: 'Daughter',
      dateOfBirth: '2020-08-22',
      phone: '',
      email: '',
      coverageStatus: 'covered',
      dependentStatus: 'dependent'
    }
  ];

  const beneficiaries = [
    {
      id: 1,
      name: 'Sarah Johnson',
      relationship: 'Spouse',
      percentage: 60,
      type: 'primary',
      contactInfo: '(555) 123-4567'
    },
    {
      id: 2,
      name: 'Emily Johnson',
      relationship: 'Daughter',
      percentage: 40,
      type: 'primary',
      contactInfo: 'Minor - Guardian: Sarah Johnson'
    }
  ];

  const getRelationshipIcon = (relationship: string) => {
    switch (relationship.toLowerCase()) {
      case 'spouse': return Heart;
      case 'daughter':
      case 'son':
      case 'child': return Baby;
      case 'parent':
      case 'father':
      case 'mother': return Crown;
      default: return User;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'covered': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'not_covered': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Family Management</h1>
          <p className="text-gray-600 mt-1">Manage your family members and beneficiaries</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          <span>Add Family Member</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('family')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'family'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Users className="w-4 h-4 inline mr-2" />
            Family Members
          </button>
          <button
            onClick={() => setActiveTab('beneficiaries')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'beneficiaries'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Shield className="w-4 h-4 inline mr-2" />
            Beneficiaries
          </button>
        </nav>
      </div>

      {/* Family Members Tab */}
      {activeTab === 'family' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Family Members</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {familyMembers.map((member) => {
                const RelationIcon = getRelationshipIcon(member.relationship);
                return (
                  <div key={member.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <RelationIcon className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{member.name}</h3>
                          <p className="text-sm text-gray-600">{member.relationship}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="p-1 text-gray-400 hover:text-gray-600">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">Born: {member.dateOfBirth}</span>
                      </div>
                      {member.phone && (
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">{member.phone}</span>
                        </div>
                      )}
                      {member.email && (
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">{member.email}</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(member.coverageStatus)}`}>
                        {member.coverageStatus === 'covered' ? 'Covered' : 
                         member.coverageStatus === 'pending' ? 'Pending' : 'Not Covered'}
                      </span>
                      <span className="text-xs text-gray-500 capitalize">{member.dependentStatus}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Coverage Summary */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Family Coverage Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-600">2</p>
                <p className="text-sm text-gray-600">Covered Members</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-600">2</p>
                <p className="text-sm text-gray-600">Total Family Members</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Heart className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-purple-600">$850K</p>
                <p className="text-sm text-gray-600">Total Family Coverage</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Beneficiaries Tab */}
      {activeTab === 'beneficiaries' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Policy Beneficiaries</h2>
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                <Plus className="w-4 h-4" />
                <span>Add Beneficiary</span>
              </button>
            </div>

            <div className="space-y-4">
              {beneficiaries.map((beneficiary) => {
                const RelationIcon = getRelationshipIcon(beneficiary.relationship);
                return (
                  <div key={beneficiary.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <RelationIcon className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{beneficiary.name}</h3>
                          <p className="text-sm text-gray-600">{beneficiary.relationship}</p>
                          <p className="text-xs text-gray-500">{beneficiary.contactInfo}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-purple-600">{beneficiary.percentage}%</p>
                        <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                          {beneficiary.type}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Beneficiary Distribution</h4>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div className="bg-purple-500 h-4 rounded-l-full" style={{ width: '60%' }}></div>
                <div className="bg-purple-300 h-4 rounded-r-full" style={{ width: '40%', marginTop: '-16px', marginLeft: '60%' }}></div>
              </div>
              <div className="flex justify-between text-sm text-gray-600 mt-2">
                <span>Sarah Johnson (60%)</span>
                <span>Emily Johnson (40%)</span>
              </div>
            </div>
          </div>

          {/* Important Notes */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <h3 className="font-semibold text-yellow-800 mb-3">Important Beneficiary Information</h3>
            <ul className="space-y-2 text-sm text-yellow-700">
              <li>• Beneficiary percentages must total 100%</li>
              <li>• Minors require a guardian or trustee designation</li>
              <li>• Consider contingent beneficiaries for comprehensive planning</li>
              <li>• Review and update beneficiaries after major life events</li>
            </ul>
          </div>
        </div>
      )}

      {/* Add Family Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add Family Member</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter first name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter last name"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option value="">Select relationship</option>
                  <option value="spouse">Spouse</option>
                  <option value="child">Child</option>
                  <option value="parent">Parent</option>
                  <option value="sibling">Sibling</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <input 
                  type="date" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Family Protection Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/dashboard/financial"
            className="flex items-center space-x-3 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="p-2 bg-purple-100 rounded-lg">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Coverage Calculator</h3>
              <p className="text-sm text-gray-600">Calculate family coverage needs</p>
            </div>
          </Link>

          <Link
            to="/dashboard/policies"
            className="flex items-center space-x-3 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Review Policies</h3>
              <p className="text-sm text-gray-600">Check family coverage status</p>
            </div>
          </Link>

          <button className="flex items-center space-x-3 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Heart className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Estate Planning</h3>
              <p className="text-sm text-gray-600">Plan your family's future</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FamilyManagementPage;
