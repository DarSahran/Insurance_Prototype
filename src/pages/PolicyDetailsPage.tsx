import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Shield, Check, X, ArrowLeft, ShoppingCart, Heart, Share2, FileText, Phone, Mail } from 'lucide-react';
import { policyMarketplaceService } from '../lib/policyMarketplace';
import { useHybridAuth } from '../hooks/useHybridAuth';

const PolicyDetailsPage: React.FC = () => {
  const { policyId } = useParams<{ policyId: string }>();
  const navigate = useNavigate();
  const { user } = useHybridAuth();

  const [policy, setPolicy] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'features' | 'exclusions' | 'documents'>('features');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (policyId) {
      loadPolicyDetails();
    }
  }, [policyId]);

  const loadPolicyDetails = async () => {
    try {
      setLoading(true);
      const data = await policyMarketplaceService.getPolicyById(policyId!);
      setPolicy(data);
    } catch (error) {
      console.error('Error loading policy details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = () => {
    // Navigate to assessment for the policy's insurance type
    const insuranceType = policy?.policy_type || policy?.policyType || 'health';
    navigate(`/assessment/${insuranceType}`);
  };

  const handleSavePolicy = async () => {
    if (!user) {
      navigate('/signup');
      return;
    }

    try {
      await policyMarketplaceService.savePolicyToWishlist(user.id, policyId!);
      setSaved(true);
    } catch (error) {
      console.error('Error saving policy:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading policy details...</p>
        </div>
      </div>
    );
  }

  if (!policy) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Policy not found</p>
          <button
            onClick={() => navigate('/browse-policies')}
            className="mt-4 text-blue-600 hover:text-blue-700"
          >
            Browse other policies
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{policy.policy_name}</h1>
              <p className="text-lg text-gray-600">{policy.provider?.provider_name}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSavePolicy}
                className={`p-3 rounded-lg border ${
                  saved ? 'bg-red-50 border-red-200 text-red-600' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Heart className={`w-5 h-5 ${saved ? 'fill-current' : ''}`} />
              </button>
              <button className="p-3 rounded-lg border border-gray-300 bg-white text-gray-600 hover:bg-gray-50">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">About This Policy</h2>
              <p className="text-gray-600">{policy.policy_description}</p>

              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Min Coverage</div>
                  <div className="text-lg font-bold text-gray-900">
                    {formatCurrency(policy.coverage_amount_min || 0)}
                  </div>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Max Coverage</div>
                  <div className="text-lg font-bold text-gray-900">
                    {formatCurrency(policy.coverage_amount_max || 0)}
                  </div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Policy Term</div>
                  <div className="text-lg font-bold text-gray-900">{policy.policy_term_years || 1} years</div>
                </div>
                <div className="bg-orange-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Waiting Period</div>
                  <div className="text-lg font-bold text-gray-900">{policy.waiting_period_days} days</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex gap-4 border-b mb-6">
                <button
                  onClick={() => setActiveTab('features')}
                  className={`pb-4 px-2 font-semibold ${
                    activeTab === 'features'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600'
                  }`}
                >
                  Key Features
                </button>
                <button
                  onClick={() => setActiveTab('exclusions')}
                  className={`pb-4 px-2 font-semibold ${
                    activeTab === 'exclusions'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600'
                  }`}
                >
                  Exclusions
                </button>
                <button
                  onClick={() => setActiveTab('documents')}
                  className={`pb-4 px-2 font-semibold ${
                    activeTab === 'documents'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600'
                  }`}
                >
                  Documents
                </button>
              </div>

              {activeTab === 'features' && (
                <div className="space-y-3">
                  {policy.key_features?.map((feature: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'exclusions' && (
                <div className="space-y-3">
                  {policy.exclusions?.map((exclusion: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-3">
                      <X className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{exclusion}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'documents' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                    <FileText className="w-8 h-8 text-blue-600" />
                    <div>
                      <div className="font-semibold text-gray-900">Policy Brochure</div>
                      <div className="text-sm text-gray-600">PDF, 2.5 MB</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                    <FileText className="w-8 h-8 text-blue-600" />
                    <div>
                      <div className="font-semibold text-gray-900">Terms & Conditions</div>
                      <div className="text-sm text-gray-600">PDF, 1.2 MB</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">About {policy.provider?.provider_name}</h3>
              <p className="text-gray-600 mb-4">{policy.provider?.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Claim Settlement</div>
                  <div className="text-xl font-bold text-green-600">
                    {policy.provider?.claim_settlement_ratio}%
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Experience</div>
                  <div className="text-xl font-bold text-blue-600">
                    {policy.provider?.years_in_business}+ years
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <a
                  href={`tel:${policy.provider?.contact_phone}`}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                >
                  <Phone className="w-4 h-4" />
                  {policy.provider?.contact_phone}
                </a>
                <a
                  href={`mailto:${policy.provider?.contact_email}`}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                >
                  <Mail className="w-4 h-4" />
                  {policy.provider?.contact_email}
                </a>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <div className="text-center mb-6">
                <div className="text-sm text-gray-600 mb-2">Starting from</div>
                <div className="text-4xl font-bold text-blue-600 mb-1">
                  {formatCurrency(policy.monthly_premium_base)}
                </div>
                <div className="text-sm text-gray-500">per month</div>
                <div className="text-xs text-gray-500 mt-1">
                  or {formatCurrency(policy.annual_premium_base)} / year
                </div>
              </div>

              <button
                onClick={handleBuyNow}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl mb-3"
              >
                <ShoppingCart className="w-5 h-5 inline mr-2" />
                Get Quote
              </button>

              <div className="mt-6 pt-6 border-t space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-600" />
                  Instant policy issuance
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-600" />
                  24/7 customer support
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-600" />
                  Easy claim process
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-600" />
                  Secure payment gateway
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolicyDetailsPage;
