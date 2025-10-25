import React, { useState, useEffect } from 'react';
import {
  Car, Plus, Edit, Trash2, Shield, Calendar,
  DollarSign, Save, X, FileText, AlertCircle
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import {
  getVehiclesWithPolicies,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  Vehicle,
  VehicleWithPolicies
} from '../../lib/vehicleManagementService';

const VehicleManagementPage: React.FC = () => {
  const [vehicles, setVehicles] = useState<VehicleWithPolicies[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [formData, setFormData] = useState<any>({});

  const { user } = useAuth();

  useEffect(() => {
    if (user?.id) {
      loadVehicles();
    }
  }, [user]);

  const loadVehicles = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);
      const data = await getVehiclesWithPolicies(user.id);
      setVehicles(data);
    } catch (err: any) {
      console.error('Error loading vehicles:', err);
      setError(err.message || 'Failed to load vehicles');
    } finally {
      setLoading(false);
    }
  };

  const vehicleTypes = [
    'Car',
    'Bike/Two-Wheeler',
    'Commercial Vehicle',
    'Electric Vehicle',
    'Luxury Vehicle',
    'Other'
  ];

  const openAddModal = () => {
    setEditingVehicle(null);
    setFormData({
      vehicle_type: 'Car',
      make: '',
      model: '',
      year: new Date().getFullYear(),
      registration_number: '',
      chassis_number: '',
      engine_number: '',
      purchase_date: '',
      current_value: ''
    });
    setShowModal(true);
  };

  const openEditModal = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setFormData({
      ...vehicle,
      purchase_date: vehicle.purchase_date || '',
      current_value: vehicle.current_value || ''
    });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!user?.id) return;

    try {
      setError(null);

      const vehicleData = {
        ...formData,
        user_id: user.id,
        year: parseInt(formData.year) || null,
        current_value: formData.current_value ? parseFloat(formData.current_value) : null
      };

      if (editingVehicle) {
        await updateVehicle(editingVehicle.id, vehicleData);
      } else {
        await createVehicle(vehicleData);
      }

      setShowModal(false);
      setFormData({});
      setEditingVehicle(null);
      await loadVehicles();
    } catch (err: any) {
      console.error('Error saving vehicle:', err);
      setError(err.message || 'Failed to save vehicle');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this vehicle? All associated policies will be unlinked.')) return;

    try {
      setError(null);
      await deleteVehicle(id);
      await loadVehicles();
    } catch (err: any) {
      console.error('Error deleting vehicle:', err);
      setError(err.message || 'Failed to delete vehicle');
    }
  };

  const getVehicleIcon = (type: string) => {
    return Car;
  };

  const formatCurrency = (amount: number | null | undefined) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderModal = () => {
    if (!showModal) return null;

    const fields = [
      { name: 'vehicle_type', label: 'Vehicle Type', type: 'select', options: vehicleTypes, required: true },
      { name: 'make', label: 'Make/Brand', type: 'text', required: true, placeholder: 'e.g., Maruti Suzuki, Honda' },
      { name: 'model', label: 'Model', type: 'text', required: true, placeholder: 'e.g., Swift, Activa' },
      { name: 'year', label: 'Year', type: 'number', required: true, min: 1900, max: new Date().getFullYear() + 1 },
      { name: 'registration_number', label: 'Registration Number', type: 'text', required: true, placeholder: 'e.g., MH12AB1234' },
      { name: 'chassis_number', label: 'Chassis Number', type: 'text', placeholder: 'Optional' },
      { name: 'engine_number', label: 'Engine Number', type: 'text', placeholder: 'Optional' },
      { name: 'purchase_date', label: 'Purchase Date', type: 'date' },
      { name: 'current_value', label: 'Current Value (₹)', type: 'number', min: 0, placeholder: 'e.g., 500000' }
    ];

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              {editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
            </h3>
            <button
              onClick={() => {
                setShowModal(false);
                setFormData({});
                setEditingVehicle(null);
              }}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {fields.map((field) => (
              <div key={field.name} className={field.name === 'registration_number' ? 'col-span-2' : ''}>
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
                    {field.options?.map((opt: string) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    value={formData[field.name] || ''}
                    onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required={field.required}
                    min={field.min}
                    max={field.max}
                    placeholder={field.placeholder}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => {
                setShowModal(false);
                setFormData({});
                setEditingVehicle(null);
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
              <span>{editingVehicle ? 'Update' : 'Add'} Vehicle</span>
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
          <p className="mt-4 text-gray-600">Loading vehicles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vehicle Management</h1>
          <p className="text-gray-600">Dashboard &gt; Vehicle Management</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          <span>Add Vehicle</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Car className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Vehicles</p>
              <p className="text-2xl font-bold text-gray-900">{vehicles.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-50 rounded-lg">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Insured Vehicles</p>
              <p className="text-2xl font-bold text-gray-900">
                {vehicles.filter(v => v.policies && v.policies.length > 0).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-orange-50 rounded-lg">
              <AlertCircle className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Uninsured Vehicles</p>
              <p className="text-2xl font-bold text-gray-900">
                {vehicles.filter(v => !v.policies || v.policies.length === 0).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {vehicles.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <Car className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No vehicles yet</h3>
          <p className="text-gray-600 mb-6">
            Add your vehicles to track insurance policies and manage coverage
          </p>
          <button
            onClick={openAddModal}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-lg font-medium"
          >
            Add Your First Vehicle
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {vehicles.map((vehicle) => {
            const VehicleIcon = getVehicleIcon(vehicle.vehicle_type);
            const hasInsurance = vehicle.policies && vehicle.policies.length > 0;

            return (
              <div key={vehicle.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                      hasInsurance ? 'bg-green-100' : 'bg-orange-100'
                    }`}>
                      <VehicleIcon className={`w-8 h-8 ${
                        hasInsurance ? 'text-green-600' : 'text-orange-600'
                      }`} />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">
                        {vehicle.make} {vehicle.model}
                      </h4>
                      <p className="text-sm text-gray-600">{vehicle.vehicle_type} • {vehicle.year}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          hasInsurance
                            ? 'bg-green-100 text-green-700'
                            : 'bg-orange-100 text-orange-700'
                        }`}>
                          {hasInsurance ? 'Insured' : 'Not Insured'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openEditModal(vehicle)}
                      className="p-2 text-gray-400 hover:text-gray-600"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(vehicle.id)}
                      className="p-2 text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-gray-500">Registration</label>
                      <p className="text-sm font-medium text-gray-900">{vehicle.registration_number}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500">Current Value</label>
                      <p className="text-sm font-medium text-gray-900">{formatCurrency(vehicle.current_value)}</p>
                    </div>
                  </div>

                  {vehicle.purchase_date && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>Purchased: {formatDate(vehicle.purchase_date)}</span>
                    </div>
                  )}

                  {vehicle.chassis_number && (
                    <div className="text-xs text-gray-500">
                      <span className="font-medium">Chassis:</span> {vehicle.chassis_number}
                    </div>
                  )}

                  {vehicle.engine_number && (
                    <div className="text-xs text-gray-500">
                      <span className="font-medium">Engine:</span> {vehicle.engine_number}
                    </div>
                  )}

                  {hasInsurance && (
                    <div className="pt-3 border-t border-gray-200">
                      <label className="text-xs font-medium text-gray-500 mb-2 block">Active Policies</label>
                      <div className="space-y-2">
                        {vehicle.policies.map((policy: any) => (
                          <div key={policy.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{policy.policy_name}</p>
                              <p className="text-xs text-gray-600">{policy.provider_name}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-bold text-gray-900">
                                {formatCurrency(policy.premium_amount)}
                              </p>
                              <p className="text-xs text-gray-600">
                                {policy.payment_status === 'completed' ? 'Active' : 'Pending'}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {!hasInsurance && (
                    <div className="pt-3 border-t border-gray-200">
                      <div className="flex items-center space-x-2 text-sm text-orange-600">
                        <AlertCircle className="w-4 h-4" />
                        <span>No active insurance policy</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        Consider purchasing insurance for this vehicle
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <FileText className="w-5 h-5 text-blue-600 mt-1" />
          <div>
            <h4 className="font-medium text-blue-900 mb-2">Vehicle Insurance Tips</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Keep all vehicle documents up to date</li>
              <li>• Renew insurance before expiry to avoid coverage gaps</li>
              <li>• Consider comprehensive coverage for newer vehicles</li>
              <li>• Third-party insurance is mandatory for all vehicles</li>
              <li>• Update vehicle value annually for accurate coverage</li>
            </ul>
          </div>
        </div>
      </div>

      {renderModal()}
    </div>
  );
};

export default VehicleManagementPage;
