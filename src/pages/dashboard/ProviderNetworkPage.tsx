import React, { useState, useEffect } from 'react';
import {
  Search, MapPin, Phone, Star, Filter, X, Globe,
  CheckCircle, Award, Calendar, ChevronRight, Building2,
  Clock, Mail, Shield, BookOpen, Briefcase, GraduationCap,
  Trophy, DollarSign, Languages, Users
} from 'lucide-react';
import {
  getProviders,
  getProviderById,
  getUniqueSpecialties,
  getUniqueCities,
  HealthcareProvider
} from '../../lib/providerService';

const ProviderNetworkPage: React.FC = () => {
  const [providers, setProviders] = useState<HealthcareProvider[]>([]);
  const [filteredProviders, setFilteredProviders] = useState<HealthcareProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All Specialties');
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [acceptingNewOnly, setAcceptingNewOnly] = useState(false);
  const [telehealthOnly, setTelehealthOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'rating' | 'experience' | 'name'>('rating');

  const [specialties, setSpecialties] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  const [selectedProvider, setSelectedProvider] = useState<HealthcareProvider | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [providers, searchQuery, selectedSpecialty, selectedCity, acceptingNewOnly, telehealthOnly, sortBy]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [providersData, specialtiesData, citiesData] = await Promise.all([
        getProviders(),
        getUniqueSpecialties(),
        getUniqueCities()
      ]);

      setProviders(providersData);
      setSpecialties(specialtiesData);
      setCities(citiesData);
    } catch (err: any) {
      console.error('Error loading providers:', err);
      setError(err.message || 'Failed to load providers');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...providers];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        p =>
          p.name.toLowerCase().includes(query) ||
          p.specialty.toLowerCase().includes(query) ||
          p.city.toLowerCase().includes(query) ||
          (p.hospital_affiliation && p.hospital_affiliation.toLowerCase().includes(query))
      );
    }

    if (selectedSpecialty && selectedSpecialty !== 'All Specialties') {
      filtered = filtered.filter(p => p.specialty === selectedSpecialty);
    }

    if (selectedCity && selectedCity !== 'All Cities') {
      filtered = filtered.filter(p => p.city === selectedCity);
    }

    if (acceptingNewOnly) {
      filtered = filtered.filter(p => p.accepting_new_patients);
    }

    if (telehealthOnly) {
      filtered = filtered.filter(p => p.telemedicine_available);
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'experience':
          return b.experience_years - a.experience_years;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    setFilteredProviders(filtered);
  };

  const formatCurrency = (amount: number | null) => {
    if (!amount) return 'Contact for pricing';
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const openProviderDetails = (provider: HealthcareProvider) => {
    setSelectedProvider(provider);
    setShowDetailModal(true);
  };

  const renderProviderDetailModal = () => {
    if (!showDetailModal || !selectedProvider) return null;

    return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Provider Details</h2>
            <button
              onClick={() => setShowDetailModal(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-3xl flex-shrink-0">
                {selectedProvider.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900">{selectedProvider.name}</h3>
                <p className="text-lg text-blue-600 font-medium">{selectedProvider.qualification}</p>
                <p className="text-gray-600">{selectedProvider.hospital_affiliation || selectedProvider.clinic_name}</p>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    <span className="font-bold text-lg">{selectedProvider.rating.toFixed(1)}</span>
                    <span className="text-gray-500">({selectedProvider.total_reviews} reviews)</span>
                  </div>
                  {selectedProvider.verified && (
                    <div className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                      <Shield className="w-4 h-4" />
                      Verified
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                  Professional Information
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Specialty:</span>
                    <span className="font-medium text-gray-900">{selectedProvider.specialty}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Experience:</span>
                    <span className="font-medium text-gray-900">{selectedProvider.experience_years} years</span>
                  </div>
                  {selectedProvider.registration_number && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Reg. Number:</span>
                      <span className="font-medium text-gray-900">{selectedProvider.registration_number}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Consultation Fee:</span>
                    <span className="font-medium text-gray-900">{formatCurrency(selectedProvider.consultation_fee)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  Contact & Location
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <Building2 className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">{selectedProvider.address}</p>
                      <p className="text-gray-600">{selectedProvider.city}, {selectedProvider.state} {selectedProvider.pincode}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <a href={`tel:${selectedProvider.phone}`} className="text-blue-600 hover:underline">
                      {selectedProvider.phone}
                    </a>
                  </div>
                  {selectedProvider.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <a href={`mailto:${selectedProvider.email}`} className="text-blue-600 hover:underline truncate">
                        {selectedProvider.email}
                      </a>
                    </div>
                  )}
                  {selectedProvider.website && (
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-gray-400" />
                      <a href={selectedProvider.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        Visit Website
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {selectedProvider.sub_specialties && selectedProvider.sub_specialties.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Sub-Specialties</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProvider.sub_specialties.map((sub, idx) => (
                    <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {sub}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {selectedProvider.languages && selectedProvider.languages.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Languages className="w-5 h-5 text-blue-600" />
                  Languages Spoken
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProvider.languages.map((lang, idx) => (
                    <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {selectedProvider.education && selectedProvider.education.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-blue-600" />
                  Education
                </h4>
                <div className="space-y-3">
                  {selectedProvider.education.map((edu: any, idx: number) => (
                    <div key={idx} className="border-l-2 border-blue-500 pl-4">
                      <p className="font-semibold text-gray-900">{edu.degree}</p>
                      <p className="text-sm text-gray-600">{edu.institution}</p>
                      <p className="text-sm text-gray-500">{edu.year}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedProvider.awards && selectedProvider.awards.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-blue-600" />
                  Awards & Recognition
                </h4>
                <div className="space-y-2">
                  {selectedProvider.awards.map((award: any, idx: number) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                      <Award className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">{award.title}</p>
                        <p className="text-sm text-gray-600">{award.organization}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedProvider.available_days && selectedProvider.available_days.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  Availability
                </h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-2">Available Days:</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {selectedProvider.available_days.map((day, idx) => (
                      <span key={idx} className="px-3 py-1 bg-green-100 text-green-800 rounded text-sm font-medium">
                        {day}
                      </span>
                    ))}
                  </div>
                  {selectedProvider.available_hours && (
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">Hours:</span> {selectedProvider.available_hours}
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
              {selectedProvider.accepting_new_patients && (
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-1" />
                  <p className="text-xs font-medium text-green-800">Accepting New Patients</p>
                </div>
              )}
              {selectedProvider.telemedicine_available && (
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <Globe className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                  <p className="text-xs font-medium text-blue-800">Telemedicine Available</p>
                </div>
              )}
              {selectedProvider.insurance_accepted && (
                <div className="text-center p-3 bg-teal-50 rounded-lg">
                  <Shield className="w-6 h-6 text-teal-600 mx-auto mb-1" />
                  <p className="text-xs font-medium text-teal-800">Insurance Accepted</p>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2">
                <Calendar className="w-5 h-5" />
                Schedule Appointment
              </button>
              <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                Get Directions
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading healthcare providers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Building2 className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Provider Network Directory</h1>
        </div>
        <p className="text-gray-600">
          Find verified healthcare providers across India with detailed credentials and patient reviews.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, specialty, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Specialty</label>
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option>All Specialties</option>
              {specialties.map(specialty => (
                <option key={specialty} value={specialty}>{specialty}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option>All Cities</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="rating">Rating</option>
              <option value="experience">Experience</option>
              <option value="name">Name</option>
            </select>
          </div>

          <div className="flex flex-col justify-end space-y-2">
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={acceptingNewOnly}
                onChange={(e) => setAcceptingNewOnly(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Accepting new patients
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={telehealthOnly}
                onChange={(e) => setTelehealthOnly(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Telemedicine available
            </label>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Found <span className="font-semibold">{filteredProviders.length}</span> providers
          </p>
          {(searchQuery || selectedSpecialty !== 'All Specialties' || selectedCity !== 'All Cities' || acceptingNewOnly || telehealthOnly) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedSpecialty('All Specialties');
                setSelectedCity('All Cities');
                setAcceptingNewOnly(false);
                setTelehealthOnly(false);
              }}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear all filters
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {filteredProviders.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center border border-gray-200">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No providers found</h3>
            <p className="text-gray-600">Try adjusting your filters or search criteria</p>
          </div>
        ) : (
          filteredProviders.map((provider) => (
            <div
              key={provider.id}
              className="bg-white rounded-lg p-6 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex gap-4 flex-1">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                    {provider.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900">{provider.name}</h3>
                    <p className="text-sm text-gray-600">{provider.qualification}</p>
                    <p className="text-sm font-medium text-blue-600">{provider.hospital_affiliation || provider.clinic_name}</p>
                  </div>
                </div>
                {provider.verified && (
                  <div className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                    <Shield className="w-4 h-4" />
                    Verified
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {provider.specialty}
                </span>
                {provider.sub_specialties && provider.sub_specialties.slice(0, 2).map((sub, idx) => (
                  <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                    {sub}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>{provider.city}, {provider.state}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>{provider.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="font-semibold">{provider.rating.toFixed(1)}</span>
                  <span className="text-gray-500">({provider.total_reviews})</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span>{provider.experience_years} years exp.</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center gap-4">
                  {provider.accepting_new_patients && (
                    <div className="flex items-center gap-1 text-sm text-green-700">
                      <CheckCircle className="w-4 h-4" />
                      <span>Accepting patients</span>
                    </div>
                  )}
                  {provider.telemedicine_available && (
                    <div className="flex items-center gap-1 text-sm text-blue-700">
                      <Globe className="w-4 h-4" />
                      <span>Telemedicine</span>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => openProviderDetails(provider)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View Details
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {renderProviderDetailModal()}
    </div>
  );
};

export default ProviderNetworkPage;
