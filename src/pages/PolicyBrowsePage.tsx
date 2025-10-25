import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Shield, Heart, TrendingUp, Car, Bike, Users, Filter, Search, Star, Check, Plane, PiggyBank, Home, Sparkles } from 'lucide-react';
import { policyBrowsingService } from '../lib/policyBrowsingService';
import { getCompanyLogo, formatINR, formatPremiumINR } from '../lib/insuranceCompanyLogos';
import { useHybridAuth } from '../hooks/useHybridAuth';

const INSURANCE_TYPES = [
  { id: 'term_life', name: 'Term Life', icon: Shield, color: 'blue', description: 'Secure your family\'s future' },
  { id: 'health', name: 'Health', icon: Heart, color: 'red', description: 'Comprehensive health coverage' },
  { id: 'family_health', name: 'Family Health', icon: Users, color: 'green', description: 'Complete family protection' },
  { id: 'car', name: 'Car Insurance', icon: Car, color: 'cyan', description: 'Protect your vehicle' },
  { id: 'two_wheeler', name: 'Two Wheeler', icon: Bike, color: 'orange', description: 'Bike insurance coverage' },
  { id: 'investment', name: 'Investment', icon: TrendingUp, color: 'teal', description: 'Grow your wealth' },
  { id: 'travel', name: 'Travel', icon: Plane, color: 'sky', description: 'Safe journeys worldwide' },
  { id: 'retirement', name: 'Retirement', icon: PiggyBank, color: 'emerald', description: 'Plan your golden years' },
  { id: 'home', name: 'Home', icon: Home, color: 'amber', description: 'Protect your home' },
  { id: 'term_rop', name: 'Term with ROP', icon: Shield, color: 'rose', description: 'Term life with returns' },
];

const PolicyBrowsePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedType = searchParams.get('type');

  const { user } = useHybridAuth();
  const [policies, setPolicies] = useState<any[]>([]);
  const [filteredPolicies, setFilteredPolicies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInsuranceType, setSelectedInsuranceType] = useState<string | null>(selectedType);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'premium' | 'coverage' | 'rating'>('premium');
  const [showFilters, setShowFilters] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState<Map<string, any>>(new Map());

  useEffect(() => {
    loadPolicies();
  }, [selectedInsuranceType]);

  const loadPolicies = async () => {
    try {
      setLoading(true);
      let data;
      if (selectedInsuranceType) {
        data = await policyBrowsingService.getPoliciesByType(selectedInsuranceType, 20);
      } else {
        // Load featured from multiple types
        const healthPolicies = await policyBrowsingService.getPoliciesByType('health', 3);
        const lifePolicies = await policyBrowsingService.getPoliciesByType('term_life', 3);
        const carPolicies = await policyBrowsingService.getPoliciesByType('car', 2);
        data = [...healthPolicies, ...lifePolicies, ...carPolicies].filter(p => p.isFeatured);
      }
      setPolicies(data);
      setFilteredPolicies(data);

      // Get AI recommendations if user is logged in
      if (user && data.length > 0) {
        const userProfile = {
          age: 30, // TODO: Get from user profile
          income: 800000,
          dependents: 2,
          healthConditions: [],
          preferences: ['comprehensive coverage']
        };
        const recommendations = await policyBrowsingService.getAIRecommendations(data, userProfile);
        setAiRecommendations(recommendations);
      }
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
        p.policyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'premium':
          return a.monthlyPremium - b.monthlyPremium;
        case 'coverage':
          return b.coverageMax - a.coverageMax;
        case 'rating':
          // Sort by AI score if available
          const scoreA = aiRecommendations.get(a.id)?.score || 0;
          const scoreB = aiRecommendations.get(b.id)?.score || 0;
          return scoreB - scoreA;
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

  const handleGetQuote = (e: React.MouseEvent, insuranceType: string) => {
    e.stopPropagation();
    navigate(`/assessment/${insuranceType}`);
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {INSURANCE_TYPES.map((type) => {
            const Icon = type.icon;
            const isSelected = selectedInsuranceType === type.id;
            const colorMap: Record<string, string> = {
              'blue': 'border-blue-600 bg-blue-50',
              'red': 'border-red-600 bg-red-50',
              'green': 'border-green-600 bg-green-50',
              'cyan': 'border-cyan-600 bg-cyan-50',
              'orange': 'border-orange-600 bg-orange-50',
              'teal': 'border-teal-600 bg-teal-50',
              'sky': 'border-sky-600 bg-sky-50',
              'emerald': 'border-emerald-600 bg-emerald-50',
              'amber': 'border-amber-600 bg-amber-50',
              'rose': 'border-rose-600 bg-rose-50',
            };
            const iconColorMap: Record<string, string> = {
              'blue': 'text-blue-600',
              'red': 'text-red-600',
              'green': 'text-green-600',
              'cyan': 'text-cyan-600',
              'orange': 'text-orange-600',
              'teal': 'text-teal-600',
              'sky': 'text-sky-600',
              'emerald': 'text-emerald-600',
              'amber': 'text-amber-600',
              'rose': 'text-rose-600',
            };
            return (
              <button
                key={type.id}
                onClick={() => handleTypeSelect(type.id)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  isSelected
                    ? colorMap[type.color]
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <Icon className={`w-8 h-8 mx-auto mb-2 ${isSelected ? iconColorMap[type.color] : 'text-gray-600'}`} />
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
            {filteredPolicies.map((policy) => {
              const aiRec = aiRecommendations.get(policy.id);
              return (
                <div
                  key={policy.id}
                  onClick={() => handlePolicyClick(policy.id)}
                  className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-200 hover:border-blue-300 overflow-hidden group"
                >
                  {/* Provider Logo Header */}
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <img
                      src={policy.logo || getCompanyLogo(policy.providerName)}
                      alt={policy.providerName}
                      className="h-10 object-contain"
                      onError={(e) => {
                        e.currentTarget.src = getCompanyLogo('default');
                      }}
                    />
                    <div className="flex items-center gap-2">
                      {policy.isFeatured && (
                        <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                          <Star className="w-3 h-3 fill-current" />
                          Featured
                        </span>
                      )}
                      {aiRec && aiRec.score >= 80 && (
                        <span className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          AI Pick
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                          {policy.policyName}
                        </h3>
                        <p className="text-sm text-gray-600">{policy.providerName}</p>
                      </div>
                    </div>

                    {aiRec && aiRec.score >= 75 && (
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-3 mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles className="w-4 h-4 text-purple-600" />
                          <span className="text-xs font-bold text-purple-900">AI Recommendation Score: {aiRec.score}/100</span>
                        </div>
                        <p className="text-xs text-purple-800">{aiRec.reasoning}</p>
                      </div>
                    )}

                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{policy.description}</p>

                    {/* Coverage & Premium Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-blue-50 rounded-lg p-3">
                        <p className="text-xs text-gray-600 mb-1">Coverage</p>
                        <p className="text-sm font-bold text-blue-700">
                          {formatINR(policy.coverageMin)} - {formatINR(policy.coverageMax)}
                        </p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-3">
                        <p className="text-xs text-gray-600 mb-1">Premium</p>
                        <p className="text-sm font-bold text-green-700">
                          {formatPremiumINR(policy.annualPremium)}/yr
                        </p>
                      </div>
                    </div>

                    {/* Key Features */}
                    <div className="space-y-2 mb-4">
                      {policy.keyFeatures.slice(0, 3).map((feature: string, idx: number) => (
                        <div key={idx} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-xs text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={(e) => handleGetQuote(e, policy.policyType || selectedInsuranceType || 'health')}
                      className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all shadow-md hover:shadow-lg"
                    >
                      Get Quote
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PolicyBrowsePage;
