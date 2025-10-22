import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Shield, Heart, TrendingUp, Car, Bike, Users, Filter, Search, Star, Check } from 'lucide-react';
import { policyMarketplaceService, PolicyCatalog } from '../lib/policyMarketplace';

const INSURANCE_TYPES = [
  { id: 'term_life', name: 'Term Life', icon: Shield, color: 'blue', description: 'Secure your family\'s future' },
  { id: 'health', name: 'Health', icon: Heart, color: 'red', description: 'Comprehensive health coverage' },
  { id: 'family_health', name: 'Family Health', icon: Users, color: 'green', description: 'Complete family protection' },
  { id: 'car', name: 'Car Insurance', icon: Car, color: 'indigo', description: 'Protect your vehicle' },
  { id: 'two_wheeler', name: 'Two Wheeler', icon: Bike, color: 'orange', description: 'Bike insurance coverage' },
  { id: 'investment', name: 'Investment', icon: TrendingUp, color: 'purple', description: 'Grow your wealth' },
];

const PolicyBrowsePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedType = searchParams.get('type');

  const [policies, setPolicies] = useState<PolicyCatalog[]>([]);
  const [filteredPolicies, setFilteredPolicies] = useState<PolicyCatalog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInsuranceType, setSelectedInsuranceType] = useState<string | null>(selectedType);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'premium' | 'coverage' | 'rating'>('premium');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadPolicies();
  }, [selectedInsuranceType]);

  const loadPolicies = async () => {
    try {
      setLoading(true);
      let data;
      if (selectedInsuranceType) {
        data = await policyMarketplaceService.getPoliciesByType(selectedInsuranceType);
      } else {
        data = await policyMarketplaceService.getFeaturedPolicies();
      }
      setPolicies(data);
      setFilteredPolicies(data);
    } catch (error) {
      console.error('Error loading policies:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = [...policies];

    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.policy_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.policy_description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'premium':
          return a.monthly_premium_base - b.monthly_premium_base;
        case 'coverage':
          return (b.coverage_amount_max || 0) - (a.coverage_amount_max || 0);
        case 'rating':
          return (b.provider?.customer_rating || 0) - (a.provider?.customer_rating || 0);
        default:
          return 0;
      }
    });

    setFilteredPolicies(filtered);
  }, [searchQuery, sortBy, policies]);

  const handleTypeSelect = (typeId: string) => {
    setSelectedInsuranceType(typeId === selectedInsuranceType ? null : typeId);
    navigate(`/browse-policies?type=${typeId}`);
  };

  const handlePolicyClick = (policyId: string) => {
    navigate(`/policy/${policyId}`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Browse Insurance Policies</h1>
          <p className="text-xl text-blue-100">Find the perfect coverage for your needs in minutes</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {INSURANCE_TYPES.map((type) => {
            const Icon = type.icon;
            const isSelected = selectedInsuranceType === type.id;
            return (
              <button
                key={type.id}
                onClick={() => handleTypeSelect(type.id)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  isSelected
                    ? `border-${type.color}-600 bg-${type.color}-50`
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <Icon className={`w-8 h-8 mx-auto mb-2 text-${type.color}-600`} />
                <div className="text-sm font-semibold text-gray-900">{type.name}</div>
                <div className="text-xs text-gray-500 mt-1">{type.description}</div>
              </button>
            );
          })}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search policies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="premium">Sort by Premium</option>
                <option value="coverage">Sort by Coverage</option>
                <option value="rating">Sort by Rating</option>
              </select>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
              >
                <Filter className="w-5 h-5" />
                Filters
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading policies...</p>
          </div>
        ) : filteredPolicies.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-600">No policies found. Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPolicies.map((policy) => (
              <div
                key={policy.id}
                onClick={() => handlePolicyClick(policy.id)}
                className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-200 hover:border-blue-300 overflow-hidden"
              >
                {policy.is_featured && (
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold py-1 px-3 text-center">
                    FEATURED
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{policy.policy_name}</h3>
                      <p className="text-sm text-gray-600">{policy.provider?.provider_name}</p>
                    </div>
                    {policy.provider?.customer_rating && (
                      <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-semibold text-gray-900">
                          {policy.provider.customer_rating.toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{policy.policy_description}</p>

                  <div className="space-y-2 mb-4">
                    {policy.key_features.slice(0, 3).map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Coverage</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {formatCurrency(policy.coverage_amount_min || 0)} - {formatCurrency(policy.coverage_amount_max || 0)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Premium</span>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">
                          {formatCurrency(policy.monthly_premium_base)}
                        </div>
                        <div className="text-xs text-gray-500">per month</div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePolicyClick(policy.id);
                    }}
                    className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PolicyBrowsePage;
