import React, { useState, useEffect } from 'react';
import {
  Users, Plus, Edit, Trash2, User, Heart, Baby,
  UserCheck, Phone, Mail, Calendar,
  Shield, AlertTriangle, Download, Save, X
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import {
  getFamilyMembers,
  createFamilyMember,
  updateFamilyMember,
  deleteFamilyMember,
  getBeneficiaries,
  createBeneficiary,
  updateBeneficiary,
  deleteBeneficiary,
  getEmergencyContacts,
  createEmergencyContact,
  updateEmergencyContact,
  deleteEmergencyContact,
  FamilyMember,
  Beneficiary,
  EmergencyContact
} from '../../lib/familyManagementService';

const FamilyManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('family');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [modalType, setModalType] = useState<'family' | 'beneficiary' | 'emergency'>('family');

  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();

  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (user?.id) {
      loadAllData();
    }
  }, [user]);

  const loadAllData = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);
      const [members, bens, contacts] = await Promise.all([
        getFamilyMembers(user.id),
        getBeneficiaries(user.id),
        getEmergencyContacts(user.id)
      ]);
      setFamilyMembers(members);
      setBeneficiaries(bens);
      setEmergencyContacts(contacts);
    } catch (err: any) {
      console.error('Error loading family data:', err);
      setError(err.message || 'Failed to load family data');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'family', name: 'Family Members', icon: Users },
    { id: 'beneficiaries', name: 'Beneficiaries', icon: Heart },
    { id: 'emergency', name: 'Emergency Contacts', icon: Phone }
  ];

  const relationshipOptions = [
    'Self', 'Spouse', 'Child', 'Parent', 'Sibling', 'Grandparent',
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

  const calculateAge = (dateOfBirth: string) => {
    if (!dateOfBirth) return '';
    const today = new Date();
    const birth = new Date(dateOfBirth);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const openAddModal = (type: 'family' | 'beneficiary' | 'emergency') => {
    setModalType(type);
    setEditingItem(null);
    setFormData({});
    setShowAddModal(true);
  };

  const openEditModal = (item: any, type: 'family' | 'beneficiary' | 'emergency') => {
    setModalType(type);
    setEditingItem(item);
    setFormData(item);
    setShowAddModal(true);
  };

  const handleSubmit = async () => {
    if (!user?.id) return;

    try {
      setError(null);

      if (modalType === 'family') {
        const memberData = {
          ...formData,
          primary_user_id: user.id,
          first_name: formData.first_name || formData.name?.split(' ')[0] || '',
          last_name: formData.last_name || formData.name?.split(' ').slice(1).join(' ') || '',
          is_covered: formData.is_covered || false,
          is_beneficiary: formData.is_beneficiary || false,
          member_type: formData.member_type || 'dependent'
        };

        if (editingItem) {
          await updateFamilyMember(editingItem.id, memberData);
        } else {
          await createFamilyMember(memberData);
        }
      } else if (modalType === 'beneficiary') {
        const beneficiaryData = {
          ...formData,
          primary_user_id: user.id,
          percentage: parseInt(formData.percentage) || 0
        };

        if (editingItem) {
          await updateBeneficiary(editingItem.id, beneficiaryData);
        } else {
          await createBeneficiary(beneficiaryData);
        }
      } else if (modalType === 'emergency') {
        const contactData = {
          ...formData,
          primary_user_id: user.id,
          is_primary: formData.is_primary || false
        };

        if (editingItem) {
          await updateEmergencyContact(editingItem.id, contactData);
        } else {
          await createEmergencyContact(contactData);
        }
      }

      setShowAddModal(false);
      setFormData({});
      setEditingItem(null);
      await loadAllData();
    } catch (err: any) {
      console.error('Error saving data:', err);
      setError(err.message || 'Failed to save data');
    }
  };

  const handleDelete = async (id: string, type: 'family' | 'beneficiary' | 'emergency') => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      setError(null);
      if (type === 'family') {
        await deleteFamilyMember(id);
      } else if (type === 'beneficiary') {
        await deleteBeneficiary(id);
      } else if (type === 'emergency') {
        await deleteEmergencyContact(id);
      }
      await loadAllData();
    } catch (err: any) {
      console.error('Error deleting data:', err);
      setError(err.message || 'Failed to delete data');
    }
  };

  const renderFamilyTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Family Members</h3>
        <button
          onClick={() => openAddModal('family')}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          <span>Add Family Member</span>
        </button>
      </div>

      {familyMembers.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No family members yet</h3>
          <p className="text-gray-600 mb-4">Start by adding your family members to manage their insurance coverage</p>
          <button
            onClick={() => openAddModal('family')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add Your First Family Member
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {familyMembers.map((member) => {
            const RelationshipIcon = getRelationshipIcon(member.relationship);
            const age = member.date_of_birth ? calculateAge(member.date_of_birth) : '';
            const fullName = `${member.first_name} ${member.last_name}`.trim();

            return (
              <div key={member.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-xl font-bold">
                        {member.first_name[0]}{member.last_name[0]}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">{fullName}</h4>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <RelationshipIcon className="w-4 h-4" />
                        <span>{member.relationship}</span>
                        {age && (
                          <>
                            <span>•</span>
                            <span>Age {age}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openEditModal(member, 'family')}
                      className="p-2 text-gray-400 hover:text-gray-600"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(member.id, 'family')}
                      className="p-2 text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Insurance Status</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      member.is_covered
                        ? 'text-green-600 bg-green-50'
                        : 'text-red-600 bg-red-50'
                    }`}>
                      {member.is_covered ? 'Covered' : 'Not Covered'}
                    </span>
                  </div>

                  {(member.email || member.phone) && (
                    <div className="flex flex-col space-y-2 text-sm text-gray-600">
                      {member.email && (
                        <div className="flex items-center space-x-2">
                          <Mail className="w-3 h-3" />
                          <span className="truncate">{member.email}</span>
                        </div>
                      )}
                      {member.phone && (
                        <div className="flex items-center space-x-2">
                          <Phone className="w-3 h-3" />
                          <span>{member.phone}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {(member.is_beneficiary) && (
                    <div className="flex items-center space-x-4 pt-3 border-t border-gray-200">
                      <div className="flex items-center space-x-1 text-xs text-green-600">
                        <Heart className="w-3 h-3" />
                        <span>Beneficiary {member.beneficiary_percentage ? `(${member.beneficiary_percentage}%)` : ''}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  const renderBeneficiariesTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Beneficiaries</h3>
        <button
          onClick={() => openAddModal('beneficiary')}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          <span>Add Beneficiary</span>
        </button>
      </div>

      {beneficiaries.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No beneficiaries yet</h3>
          <p className="text-gray-600 mb-4">Add beneficiaries to your insurance policies</p>
          <button
            onClick={() => openAddModal('beneficiary')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add Your First Beneficiary
          </button>
        </div>
      ) : (
        <>
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
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">{beneficiary.percentage}%</p>
                      <p className="text-sm text-gray-600">of benefits</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openEditModal(beneficiary, 'beneficiary')}
                        className="p-2 text-gray-400 hover:text-gray-600"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(beneficiary.id, 'beneficiary')}
                        className="p-2 text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <span className="font-medium text-gray-900">Total Allocation:</span>
                <span className="text-lg font-bold text-gray-900">
                  {beneficiaries.reduce((sum, b) => sum + (b.percentage || 0), 0)}%
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );

  const renderEmergencyTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Emergency Contacts</h3>
        <button
          onClick={() => openAddModal('emergency')}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          <span>Add Emergency Contact</span>
        </button>
      </div>

      {emergencyContacts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <Phone className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No emergency contacts yet</h3>
          <p className="text-gray-600 mb-4">Add emergency contacts who can be reached in case of emergency</p>
          <button
            onClick={() => openAddModal('emergency')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add Your First Emergency Contact
          </button>
        </div>
      ) : (
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
                      {contact.is_primary && (
                        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                          Primary Contact
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => openEditModal(contact, 'emergency')}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(contact.id, 'emergency')}
                    className="p-2 text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Phone</label>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">{contact.phone}</span>
                    </div>
                  </div>
                  {contact.email && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Email</label>
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900">{contact.email}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

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

  const renderModal = () => {
    if (!showAddModal) return null;

    let title = '';
    let fields: any[] = [];

    if (modalType === 'family') {
      title = editingItem ? 'Edit Family Member' : 'Add Family Member';
      fields = [
        { name: 'first_name', label: 'First Name', type: 'text', required: true },
        { name: 'last_name', label: 'Last Name', type: 'text', required: true },
        { name: 'relationship', label: 'Relationship', type: 'select', options: relationshipOptions, required: true },
        { name: 'date_of_birth', label: 'Date of Birth', type: 'date' },
        { name: 'email', label: 'Email', type: 'email' },
        { name: 'phone', label: 'Phone', type: 'tel' },
        { name: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female', 'Other'] },
        { name: 'is_covered', label: 'Has Insurance Coverage', type: 'checkbox' },
        { name: 'is_beneficiary', label: 'Is Beneficiary', type: 'checkbox' },
      ];
    } else if (modalType === 'beneficiary') {
      title = editingItem ? 'Edit Beneficiary' : 'Add Beneficiary';
      fields = [
        { name: 'name', label: 'Full Name', type: 'text', required: true },
        { name: 'relationship', label: 'Relationship', type: 'select', options: relationshipOptions, required: true },
        { name: 'percentage', label: 'Percentage (%)', type: 'number', required: true, min: 0, max: 100 },
      ];
    } else if (modalType === 'emergency') {
      title = editingItem ? 'Edit Emergency Contact' : 'Add Emergency Contact';
      fields = [
        { name: 'name', label: 'Full Name', type: 'text', required: true },
        { name: 'relationship', label: 'Relationship', type: 'select', options: relationshipOptions, required: true },
        { name: 'phone', label: 'Phone', type: 'tel', required: true },
        { name: 'email', label: 'Email', type: 'email' },
        { name: 'is_primary', label: 'Primary Contact', type: 'checkbox' },
      ];
    }

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <button
              onClick={() => {
                setShowAddModal(false);
                setFormData({});
                setEditingItem(null);
              }}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {fields.map((field) => (
              <div key={field.name} className={field.type === 'checkbox' ? 'col-span-2' : ''}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {field.type === 'select' ? (
                  <select
                    value={formData[field.name] || ''}
                    onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required={field.required}
                  >
                    <option value="">Select {field.label}</option>
                    {field.options.map((opt: string) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : field.type === 'checkbox' ? (
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData[field.name] || false}
                      onChange={(e) => setFormData({ ...formData, [field.name]: e.target.checked })}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">{field.label}</span>
                  </div>
                ) : (
                  <input
                    type={field.type}
                    value={formData[field.name] || ''}
                    onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required={field.required}
                    min={field.min}
                    max={field.max}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => {
                setShowAddModal(false);
                setFormData({});
                setEditingItem(null);
              }}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Save className="w-4 h-4" />
              <span>{editingItem ? 'Update' : 'Add'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading family data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Family & Beneficiary Management</h1>
          <p className="text-gray-600">Dashboard &gt; Family Management</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

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
            <div className="p-3 bg-teal-50 rounded-lg">
              <Shield className="w-6 h-6 text-teal-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Covered Members</p>
              <p className="text-2xl font-bold text-gray-900">
                {familyMembers.filter(m => m.is_covered).length}
              </p>
            </div>
          </div>
        </div>
      </div>

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

      {renderModal()}
    </div>
  );
};

export default FamilyManagementPage;
