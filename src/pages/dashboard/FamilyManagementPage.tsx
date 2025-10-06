import React, { useState } from 'react';
import { 
  Users, Plus, Edit, Trash2, User, Heart, Baby, 
  UserCheck, Phone, Mail, MapPin, Calendar, 
  Shield, AlertTriangle, CheckCircle, Download
} from 'lucide-react';

const FamilyManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('family');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMember, setEditingMember] = useState<any>(null);

  // Mock family data
  const familyMembers = [
    {
      id: 1,
      name: 'John Doe',
      relationship: 'Self',
      dateOfBirth: '1985-03-20',
      age: 39,
      email: 'john.doe@email.com',
      phone: '(555) 123-4567',
      address: '123 Main St, Anytown, ST 12345',
      insuranceStatus: 'Covered',
      policies: ['Life Insurance', 'Health Insurance'],
      emergencyContact: false,
      beneficiary: false,
      avatar: null
    },
    {
      id: 2,
      name: 'Jane Doe',
      relationship: 'Spouse',
      dateOfBirth: '1987-07-15',
      age: 37,
      email: 'jane.doe@email.com',
      phone: '(555) 123-4568',
      address: '123 Main St, Anytown, ST 12345',
      insuranceStatus: 'Covered',
      policies: ['Health Insurance'],
      emergencyContact: true,
      beneficiary: true,
      beneficiaryPercentage: 60,
      avatar: null
    },
    {
      id: 3,
      name: 'Emma Doe',
      relationship: 'Child',
      dateOfBirth: '2015-12-10',
      age: 8,
      email: null,
      phone: null,
      address: '123 Main St, Anytown, ST 12345',
      insuranceStatus: 'Covered',
      policies: ['Health Insurance'],
      emergencyContact: false,
      beneficiary: true,
      beneficiaryPercentage: 40,
      avatar: null
    },
    {
      id: 4,
      name: 'Robert Smith',
      relationship: 'Father',
      dateOfBirth: '1955-11-03',
      age: 68,
      email: 'robert.smith@email.com',
      phone: '(555) 987-6543',
      address: '456 Oak Ave, Otherville, ST 67890',
      insuranceStatus: 'Not Covered',
      policies: [],
      emergencyContact: true,
      beneficiary: false,
      avatar: null
    }
  ];

  const beneficiaries = familyMembers.filter(member => member.beneficiary);
  const emergencyContacts = familyMembers.filter(member => member.emergencyContact);

  const tabs = [
    { id: 'family', name: 'Family Members', icon: Users },
    { id: 'beneficiaries', name: 'Beneficiaries', icon: Heart },
    { id: 'emergency', name: 'Emergency Contacts', icon: Phone }
  ];

  const relationshipOptions = [
    'Spouse', 'Child', 'Parent', 'Sibling', 'Grandparent', 
    'Grandchild', 'Uncle/Aunt', 'Cousin', 'Friend', 'Other'
  ];

  const getRelationshipIcon = (relationship: string) => {
    switch (relationship.toLowerCase()) {
      case 'self': return User;
      case 'spouse': return Heart;
      case 'child': return Baby;
      case 'parent': return UserCheck;
      default: return Users;
    }
  };

  const getInsuranceStatusColor = (status: string) => {
    switch (status) {
      case 'Covered': return 'text-green-600 bg-green-50';
      case 'Partial': return 'text-yellow-600 bg-yellow-50';
      case 'Not Covered': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birth = new Date(dateOfBirth);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const renderFamilyTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Family Members</h3>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          <span>Add Family Member</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {familyMembers.map((member) => {
          const RelationshipIcon = getRelationshipIcon(member.relationship);
          return (
            <div key={member.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    {member.avatar ? (
                      <img src={member.avatar} alt={member.name} className="w-16 h-16 rounded-full object-cover" />
                    ) : (
                      <span className="text-blue-600 text-xl font-bold">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{member.name}</h4>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <RelationshipIcon className="w-4 h-4" />
                      <span>{member.relationship}</span>
                      <span>•</span>
                      <span>Age {member.age}</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditingMember(member)}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  {member.relationship !== 'Self' && (
                    <button className="p-2 text-gray-400 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Insurance Status</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${getInsuranceStatusColor(member.insuranceStatus)}`}>
                    {member.insuranceStatus}
                  </span>
                </div>

                {member.policies.length > 0 && (
                  <div>
                    <span className="text-sm text-gray-600">Covered Policies:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {member.policies.map((policy, index) => (
                        <span key={index} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          {policy}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  {member.email && (
                    <div className="flex items-center space-x-1">
                      <Mail className="w-3 h-3" />
                      <span>{member.email}</span>
                    </div>
                  )}
                  {member.phone && (
                    <div className="flex items-center space-x-1">
                      <Phone className="w-3 h-3" />
                      <span>{member.phone}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-4 pt-3 border-t border-gray-200">
                  {member.emergencyContact && (
                    <div className="flex items-center space-x-1 text-xs text-orange-600">
                      <Phone className="w-3 h-3" />
                      <span>Emergency Contact</span>
                    </div>
                  )}
                  {member.beneficiary && (
                    <div className="flex items-center space-x-1 text-xs text-green-600">
                      <Heart className="w-3 h-3" />
                      <span>Beneficiary ({member.beneficiaryPercentage}%)</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderBeneficiariesTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Beneficiaries</h3>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4" />
            <span>Export Forms</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus className="w-4 h-4" />
            <span>Add Beneficiary</span>
          </button>
        </div>
      </div>

      {/* Beneficiary Allocation Summary */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h4 className="font-semibold text-gray-900 mb-4">Beneficiary Allocation</h4>
        <div className="space-y-4">
          {beneficiaries.map((beneficiary) => (
            <div key={beneficiary.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold">
                    {beneficiary.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h5 className="font-medium text-gray-900">{beneficiary.name}</h5>
                  <p className="text-sm text-gray-600">{beneficiary.relationship}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">{beneficiary.beneficiaryPercentage}%</p>
                <p className="text-sm text-gray-600">of benefits</p>
              </div>
            </div>
          ))}
          
          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <span className="font-medium text-gray-900">Total Allocation:</span>
            <span className="text-lg font-bold text-gray-900">
              {beneficiaries.reduce((sum, b) => sum + (b.beneficiaryPercentage || 0), 0)}%
            </span>
          </div>
        </div>
      </div>

      {/* Beneficiary Details */}
      <div className="space-y-4">
        {beneficiaries.map((beneficiary) => (
          <div key={beneficiary.id} className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-lg font-semibold text-gray-900">{beneficiary.name}</h4>
                <p className="text-gray-600">{beneficiary.relationship}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-blue-600">{beneficiary.beneficiaryPercentage}%</span>
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <Edit className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Date of Birth</label>
                  <p className="text-gray-900">{beneficiary.dateOfBirth} (Age {beneficiary.age})</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Contact Information</label>
                  <div className="space-y-1">
                    {beneficiary.email && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Mail className="w-3 h-3" />
                        <span>{beneficiary.email}</span>
                      </div>
                    )}
                    {beneficiary.phone && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Phone className="w-3 h-3" />
                        <span>{beneficiary.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Address</label>
                  <div className="flex items-start space-x-2 text-sm text-gray-600">
                    <MapPin className="w-3 h-3 mt-1" />
                    <span>{beneficiary.address}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Contingent Beneficiary</label>
                  <p className="text-sm text-gray-600">Not specified</p>
                  <button className="text-sm text-blue-600 hover:text-blue-800">Add contingent beneficiary</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderEmergencyTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Emergency Contacts</h3>
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus className="w-4 h-4" />
          <span>Add Emergency Contact</span>
        </button>
      </div>

      <div className="space-y-4">
        {emergencyContacts.map((contact, index) => (
          <div key={contact.id} className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Phone className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">{contact.name}</h4>
                  <p className="text-gray-600">{contact.relationship}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                      Priority {index + 1}
                    </span>
                  </div>
                </div>
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Edit className="w-4 h-4" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Primary Phone</label>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900">{contact.phone}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900">{contact.email}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Address</label>
                  <div className="flex items-start space-x-2">
                    <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                    <span className="text-gray-900">{contact.address}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Best Time to Contact</label>
                  <p className="text-gray-900">Anytime</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Emergency Contact Guidelines */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-blue-600 mt-1" />
          <div>
            <h4 className="font-medium text-blue-900 mb-2">Emergency Contact Guidelines</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Choose contacts who are easily reachable and reliable</li>
              <li>• Inform your emergency contacts about their designation</li>
              <li>• Keep contact information up to date</li>
              <li>• Consider having contacts in different locations</li>
              <li>• Review and update emergency contacts annually</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Family & Beneficiary Management</h1>
          <p className="text-gray-600">Dashboard &gt; Family Management</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4" />
            <span>Export All</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Family Members</p>
              <p className="text-2xl font-bold text-gray-900">{familyMembers.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-50 rounded-lg">
              <Heart className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Beneficiaries</p>
              <p className="text-2xl font-bold text-gray-900">{beneficiaries.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-orange-50 rounded-lg">
              <Phone className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Emergency Contacts</p>
              <p className="text-2xl font-bold text-gray-900">{emergencyContacts.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-50 rounded-lg">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Covered Members</p>
              <p className="text-2xl font-bold text-gray-900">
                {familyMembers.filter(m => m.insuranceStatus === 'Covered').length}
              </p>
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
          {activeTab === 'family' && renderFamilyTab()}
          {activeTab === 'beneficiaries' && renderBeneficiariesTab()}
          {activeTab === 'emergency' && renderEmergencyTab()}
        </div>
      </div>

      {/* Add/Edit Modal would go here */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Family Member</h3>
            {/* Form fields would go here */}
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Add Member
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FamilyManagementPage;