import React, { useState, useMemo } from 'react';
import {
  Search, MapPin, Phone, Star, Filter, X, Navigation, Clock,
  CheckCircle, Globe, Users, Award, Calendar, ChevronRight, Building2
} from 'lucide-react';

interface Provider {
  id: string;
  npiNumber: string;
  providerType: string;
  name: string;
  specialty: string[];
  credentials: string[];
  practiceName: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  phone: string;
  email?: string;
  website?: string;
  acceptingNewPatients: boolean;
  languagesSpoken: string[];
  averageRating: number;
  totalReviews: number;
  insuranceAccepted: string[];
  telehealthAvailable: boolean;
  boardCertified: boolean;
  yearsInPractice: number;
  distance?: number;
}

const mockProviders: Provider[] = [
  {
    id: '1',
    npiNumber: '1234567890',
    providerType: 'physician',
    name: 'Dr. Sarah Johnson',
    specialty: ['Family Medicine', 'Primary Care'],
    credentials: ['MD', 'FAAFP'],
    practiceName: 'Johnson Family Practice',
    address: {
      street: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      zip: '94102',
    },
    phone: '(555) 123-4567',
    email: 'contact@johnsonfp.com',
    website: 'https://johnsonfp.com',
    acceptingNewPatients: true,
    languagesSpoken: ['English', 'Spanish'],
    averageRating: 4.8,
    totalReviews: 245,
    insuranceAccepted: ['Blue Cross', 'Aetna', 'United Healthcare', 'Medicare'],
    telehealthAvailable: true,
    boardCertified: true,
    yearsInPractice: 15,
    distance: 2.3,
  },
  {
    id: '2',
    npiNumber: '2345678901',
    providerType: 'specialist',
    name: 'Dr. Michael Chen',
    specialty: ['Cardiology'],
    credentials: ['MD', 'FACC'],
    practiceName: 'Heart Health Specialists',
    address: {
      street: '456 Medical Plaza',
      city: 'San Francisco',
      state: 'CA',
      zip: '94103',
    },
    phone: '(555) 234-5678',
    email: 'info@hearthealth.com',
    website: 'https://hearthealth.com',
    acceptingNewPatients: true,
    languagesSpoken: ['English', 'Mandarin', 'Cantonese'],
    averageRating: 4.9,
    totalReviews: 189,
    insuranceAccepted: ['Blue Cross', 'Cigna', 'United Healthcare'],
    telehealthAvailable: false,
    boardCertified: true,
    yearsInPractice: 20,
    distance: 3.7,
  },
  {
    id: '3',
    npiNumber: '3456789012',
    providerType: 'specialist',
    name: 'Dr. Emily Rodriguez',
    specialty: ['Endocrinology', 'Diabetes Care'],
    credentials: ['MD', 'FACE'],
    practiceName: 'Diabetes & Hormone Center',
    address: {
      street: '789 Health Blvd',
      city: 'Oakland',
      state: 'CA',
      zip: '94601',
    },
    phone: '(555) 345-6789',
    email: 'care@diabeteshormone.com',
    website: 'https://diabeteshormone.com',
    acceptingNewPatients: true,
    languagesSpoken: ['English', 'Spanish', 'Portuguese'],
    averageRating: 4.7,
    totalReviews: 167,
    insuranceAccepted: ['Aetna', 'Kaiser', 'United Healthcare'],
    telehealthAvailable: true,
    boardCertified: true,
    yearsInPractice: 12,
    distance: 8.2,
  },
  {
    id: '4',
    npiNumber: '4567890123',
    providerType: 'mental_health',
    name: 'Dr. David Kim',
    specialty: ['Psychiatry', 'Therapy'],
    credentials: ['MD', 'Psychiatrist'],
    practiceName: 'Mind & Wellness Clinic',
    address: {
      street: '321 Wellness Way',
      city: 'Berkeley',
      state: 'CA',
      zip: '94704',
    },
    phone: '(555) 456-7890',
    email: 'support@mindwellness.com',
    website: 'https://mindwellness.com',
    acceptingNewPatients: true,
    languagesSpoken: ['English', 'Korean'],
    averageRating: 4.6,
    totalReviews: 134,
    insuranceAccepted: ['Blue Cross', 'Aetna', 'Cigna'],
    telehealthAvailable: true,
    boardCertified: true,
    yearsInPractice: 10,
    distance: 5.1,
  },
  {
    id: '5',
    npiNumber: '5678901234',
    providerType: 'urgent_care',
    name: 'QuickCare Urgent Care',
    specialty: ['Urgent Care', 'Primary Care'],
    credentials: ['Multi-Specialty'],
    practiceName: 'QuickCare Medical',
    address: {
      street: '555 Emergency Dr',
      city: 'San Jose',
      state: 'CA',
      zip: '95110',
    },
    phone: '(555) 567-8901',
    website: 'https://quickcare.com',
    acceptingNewPatients: true,
    languagesSpoken: ['English', 'Spanish', 'Vietnamese'],
    averageRating: 4.5,
    totalReviews: 892,
    insuranceAccepted: ['Blue Cross', 'Aetna', 'United Healthcare', 'Self-Pay'],
    telehealthAvailable: false,
    boardCertified: false,
    yearsInPractice: 8,
    distance: 12.5,
  },
];

const ProviderNetworkPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [selectedProviderType, setSelectedProviderType] = useState('all');
  const [acceptingNewOnly, setAcceptingNewOnly] = useState(false);
  const [telehealthOnly, setTelehealthOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'distance' | 'rating' | 'name'>('distance');
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);

  const specialties = [
    'all',
    ...Array.from(new Set(mockProviders.flatMap(p => p.specialty))),
  ];

  const providerTypes = [
    { value: 'all', label: 'All Providers' },
    { value: 'physician', label: 'Primary Care' },
    { value: 'specialist', label: 'Specialist' },
    { value: 'mental_health', label: 'Mental Health' },
    { value: 'urgent_care', label: 'Urgent Care' },
  ];

  const filteredAndSortedProviders = useMemo(() => {
    let filtered = mockProviders;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        p =>
          p.name.toLowerCase().includes(query) ||
          p.specialty.some(s => s.toLowerCase().includes(query)) ||
          p.practiceName.toLowerCase().includes(query) ||
          p.address.city.toLowerCase().includes(query)
      );
    }

    if (selectedSpecialty !== 'all') {
      filtered = filtered.filter(p => p.specialty.includes(selectedSpecialty));
    }

    if (selectedProviderType !== 'all') {
      filtered = filtered.filter(p => p.providerType === selectedProviderType);
    }

    if (acceptingNewOnly) {
      filtered = filtered.filter(p => p.acceptingNewPatients);
    }

    if (telehealthOnly) {
      filtered = filtered.filter(p => p.telehealthAvailable);
    }

    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'distance':
          return (a.distance || 0) - (b.distance || 0);
        case 'rating':
          return b.averageRating - a.averageRating;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return sorted;
  }, [searchQuery, selectedSpecialty, selectedProviderType, acceptingNewOnly, telehealthOnly, sortBy]);

  const getProviderTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      physician: 'Primary Care Physician',
      specialist: 'Specialist',
      mental_health: 'Mental Health Provider',
      urgent_care: 'Urgent Care Facility',
    };
    return types[type] || type;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Building2 className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Provider Network Directory</h1>
        </div>
        <p className="text-gray-600">
          Find in-network healthcare providers near you with verified credentials and patient reviews.
        </p>
      </div>

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
            <label className="block text-sm font-medium text-gray-700 mb-2">Provider Type</label>
            <select
              value={selectedProviderType}
              onChange={(e) => setSelectedProviderType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {providerTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Specialty</label>
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {specialties.map(specialty => (
                <option key={specialty} value={specialty}>
                  {specialty === 'all' ? 'All Specialties' : specialty}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="distance">Distance</option>
              <option value="rating">Rating</option>
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
              Telehealth available
            </label>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Found <span className="font-semibold">{filteredAndSortedProviders.length}</span> providers
          </p>
          {(searchQuery || selectedSpecialty !== 'all' || selectedProviderType !== 'all' || acceptingNewOnly || telehealthOnly) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedSpecialty('all');
                setSelectedProviderType('all');
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {filteredAndSortedProviders.length === 0 ? (
            <div className="bg-white rounded-lg p-12 text-center border border-gray-200">
              <Filter className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No providers found</h3>
              <p className="text-gray-600">Try adjusting your filters or search criteria</p>
            </div>
          ) : (
            filteredAndSortedProviders.map((provider) => (
              <div
                key={provider.id}
                className="bg-white rounded-lg p-6 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer"
                onClick={() => setSelectedProvider(provider)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-2">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                        {provider.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900">{provider.name}</h3>
                        <p className="text-sm text-gray-600">{provider.credentials.join(', ')}</p>
                        <p className="text-sm font-medium text-blue-600">{provider.practiceName}</p>
                      </div>
                    </div>
                  </div>
                  {provider.boardCertified && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-semibold">
                      <Award className="w-4 h-4" />
                      Board Certified
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {provider.specialty.map((spec, idx) => (
                    <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {spec}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>
                      {provider.address.city}, {provider.address.state} ({provider.distance} mi)
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{provider.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-semibold">{provider.averageRating}</span>
                    <span className="text-gray-500">({provider.totalReviews} reviews)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>{provider.yearsInPractice} years experience</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                  {provider.acceptingNewPatients && (
                    <div className="flex items-center gap-1 text-sm text-green-700">
                      <CheckCircle className="w-4 h-4" />
                      <span>Accepting new patients</span>
                    </div>
                  )}
                  {provider.telehealthAvailable && (
                    <div className="flex items-center gap-1 text-sm text-blue-700">
                      <Globe className="w-4 h-4" />
                      <span>Telehealth</span>
                    </div>
                  )}
                  <button className="ml-auto flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    View Details
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="lg:col-span-1">
          {selectedProvider ? (
            <div className="bg-white rounded-lg p-6 border border-gray-200 sticky top-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Provider Details</h3>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Contact Information</h4>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-600">{selectedProvider.address.street}</p>
                    <p className="text-gray-600">
                      {selectedProvider.address.city}, {selectedProvider.address.state} {selectedProvider.address.zip}
                    </p>
                    <p className="text-gray-600">{selectedProvider.phone}</p>
                    {selectedProvider.website && (
                      <a
                        href={selectedProvider.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        <Globe className="w-4 h-4" />
                        Visit Website
                      </a>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Languages</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProvider.languagesSpoken.map((lang, idx) => (
                      <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Insurance Accepted</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProvider.insuranceAccepted.map((insurance, idx) => (
                      <span key={idx} className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                        {insurance}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <button className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Schedule Appointment
                  </button>
                  <button className="w-full mt-2 bg-white border border-gray-300 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-2">
                    <Navigation className="w-5 h-5" />
                    Get Directions
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200 sticky top-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">How to Choose a Provider</h3>
              <div className="space-y-3 text-sm text-gray-700">
                <p>
                  <strong>Check In-Network Status:</strong> Verify the provider accepts your insurance to minimize
                  out-of-pocket costs.
                </p>
                <p>
                  <strong>Consider Location:</strong> Choose providers convenient to your home or work for easier access
                  to care.
                </p>
                <p>
                  <strong>Read Reviews:</strong> Patient ratings and reviews provide insights into quality of care and
                  office experience.
                </p>
                <p>
                  <strong>Verify Credentials:</strong> Board-certified providers have met rigorous training and
                  examination standards.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProviderNetworkPage;
