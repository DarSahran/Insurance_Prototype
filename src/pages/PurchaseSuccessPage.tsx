import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Download, Mail, Phone, Home, FileText, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';

const PurchaseSuccessPage: React.FC = () => {
  const { policyId } = useParams<{ policyId: string }>();
  const navigate = useNavigate();
  const [policyData, setPolicyData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPolicyData();
  }, [policyId]);

  const loadPolicyData = async () => {
    try {
      const { data, error } = await supabase
        .from('quick_policies')
        .select(`
          *,
          provider:policy_providers(*),
          catalog_policy:policy_catalog(*)
        `)
        .eq('id', policyId)
        .single();

      if (error) throw error;
      setPolicyData(data);
    } catch (error) {
      console.error('Error loading policy:', error);
    } finally {
      setLoading(false);
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!policyData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Policy not found</p>
          <button onClick={() => navigate('/browse-policies')} className="mt-4 text-blue-600">
            Browse Policies
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 py-12 overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{
              top: '-10%',
              left: `${Math.random() * 100}%`,
              opacity: 0.8
            }}
            animate={{
              top: '110%',
              opacity: 0
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              delay: Math.random() * 2,
              repeat: Infinity,
              repeatDelay: Math.random() * 3
            }}
          >
            <Sparkles className="w-6 h-6 text-yellow-400" style={{ transform: `rotate(${Math.random() * 360}deg)` }} />
          </motion.div>
        ))}
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-2xl p-8 mb-8"
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.2
              }}
              className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full mb-4 shadow-lg"
            >
              <CheckCircle className="w-16 h-16 text-white" strokeWidth={2.5} />
            </motion.div>

            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2"
            >
              Payment Successful! 🎉
            </motion.h1>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-gray-600"
            >
              Your policy is now active and protecting you
            </motion.p>
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl p-6 mb-8"
          >
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="text-sm text-gray-600 mb-1">Policy Number</div>
                <div className="text-xl font-bold text-gray-900">{policyData.policy_number}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Status</div>
                <div className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                  Active
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Policy Holder</div>
                <div className="font-semibold text-gray-900">{policyData.customer_name}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Coverage</div>
                <div className="font-semibold text-gray-900">{formatCurrency(policyData.coverage_amount)}</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="space-y-4 mb-8"
          >
            <h3 className="font-bold text-gray-900">Policy Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Policy Name</div>
                <div className="font-semibold">{policyData.catalog_policy?.policy_name}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Provider</div>
                <div className="font-semibold">{policyData.provider?.provider_name}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Premium</div>
                <div className="font-semibold">{formatCurrency(policyData.annual_premium)} / year</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Term</div>
                <div className="font-semibold">{policyData.policy_term_years} years</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8"
          >
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <div className="font-semibold text-gray-900 mb-1">Policy documents sent!</div>
                <p className="text-sm text-gray-600">
                  We've sent your policy documents to <strong>{policyData.customer_email}</strong>.
                  Please check your email for the complete policy wording and terms.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
          >
            <button className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-all">
              <Download className="w-5 h-5" />
              Download Policy
            </button>
            <button className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all">
              <FileText className="w-5 h-5" />
              View Details
            </button>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="border-t pt-6"
          >
            <h4 className="font-semibold text-gray-900 mb-4">What's Next?</h4>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs">
                  1
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Check Your Email</div>
                  <div>Your policy documents and welcome email have been sent</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs">
                  2
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Save Your Policy Number</div>
                  <div>Keep your policy number handy for future reference</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs">
                  3
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Download the Mobile App</div>
                  <div>Manage your policy, file claims, and track renewals on the go</div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all"
          >
            <Home className="w-5 h-5" />
            Go to Dashboard
          </button>
          <button
            onClick={() => navigate('/browse-policies')}
            className="flex items-center justify-center gap-2 px-6 py-4 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-all"
          >
            Browse More Policies
          </button>
          <a
            href={`mailto:${policyData.provider?.contact_email}`}
            className="flex items-center justify-center gap-2 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
          >
            <Phone className="w-5 h-5" />
            Contact Support
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default PurchaseSuccessPage;
