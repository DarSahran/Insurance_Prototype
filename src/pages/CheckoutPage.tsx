import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Check, Shield, Lock, CreditCard, ArrowLeft } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { policyMarketplaceService } from '../lib/policyMarketplace';
import { useHybridAuth } from '../hooks/useHybridAuth';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder');

const CheckoutForm: React.FC<{ policyData: any; purchaseData: any; clientSecret: string | null }> = ({ policyData, purchaseData, clientSecret }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { user } = useHybridAuth();

  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      setError('Payment system not ready. Please try again.');
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setError(submitError.message || 'Payment validation failed');
        setProcessing(false);
        return;
      }

      const { error: paymentError, paymentIntent } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: window.location.origin + '/payment-processing',
        },
        redirect: 'if_required',
      });

      if (paymentError) {
        setError(paymentError.message || 'Payment failed. Please try again.');
        setProcessing(false);
        return;
      }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        const policyNumber = policyMarketplaceService.generatePolicyNumber(policyData.policy_type);

        const quickPolicy = await policyMarketplaceService.createQuickPolicy({
          policy_number: policyNumber,
          user_id: user?.id || 'guest',
          catalog_policy_id: policyData.id,
          policy_type: policyData.policy_type,
          provider_id: policyData.provider_id,
          customer_name: purchaseData.form_data.full_name,
          customer_email: purchaseData.form_data.email,
          customer_phone: purchaseData.form_data.phone,
          customer_dob: purchaseData.form_data.dob ? new Date(purchaseData.form_data.dob) : undefined,
          customer_gender: purchaseData.form_data.gender,
          coverage_amount: parseFloat(purchaseData.form_data.coverage_amount),
          monthly_premium: policyData.monthly_premium_base,
          annual_premium: policyData.annual_premium_base,
          policy_term_years: policyData.policy_term_years,
          effective_date: new Date(),
          expiry_date: new Date(new Date().setFullYear(new Date().getFullYear() + policyData.policy_term_years)),
          quick_form_data: purchaseData.form_data,
          purchase_source: 'quick_buy',
          payment_id: paymentIntent.id,
          payment_status: 'completed',
          amount_paid: policyData.annual_premium_base * 1.18,
          status: 'active',
        });

        localStorage.removeItem('quick_buy_data');
        navigate(`/purchase-success/${quickPolicy.id}`);
      }
    } catch (err: any) {
      console.error('Payment error:', err);
      setError(err.message || 'Payment failed. Please try again.');
      setProcessing(false);
    }
  };

  if (!clientSecret) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Preparing payment...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h3>
        <p className="text-sm text-gray-600 mb-4">
          Secure payment powered by Stripe. We support cards, UPI, and net banking.
        </p>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg">
        <PaymentElement />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={processing || !stripe}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {processing ? 'Processing...' : `Pay ₹${policyData.annual_premium_base.toLocaleString('en-IN')}`}
      </button>

      <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
        <Lock className="w-4 h-4" />
        <span>Secure payment powered by Stripe</span>
      </div>
    </form>
  );
};

const CheckoutPage: React.FC = () => {
  const { policyId } = useParams<{ policyId: string }>();
  const navigate = useNavigate();
  const { user } = useHybridAuth();

  const [policyData, setPolicyData] = useState<any>(null);
  const [purchaseData, setPurchaseData] = useState<any>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [policyId]);

  const loadData = async () => {
    try {
      const storedData = localStorage.getItem('quick_buy_data');
      if (!storedData) {
        navigate('/browse-policies');
        return;
      }

      const parsed = JSON.parse(storedData);
      setPurchaseData(parsed);

      const policy = await policyMarketplaceService.getPolicyById(policyId!);
      setPolicyData(policy);

      const totalAmount = policy.annual_premium_base * 1.18;

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-payment-intent`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            amount: totalAmount,
            currency: 'inr',
            policyData: {
              id: policy.id,
              name: policy.policy_name,
            },
            customerData: {
              name: parsed.form_data.full_name,
              email: parsed.form_data.email,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      const data = await response.json();
      setClientSecret(data.clientSecret);
    } catch (error) {
      console.error('Error loading data:', error);
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
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!policyData || !purchaseData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">No purchase data found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Secure Checkout</h1>
          <p className="text-gray-600">Complete your payment to activate your policy</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6">
              {clientSecret ? (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <CheckoutForm policyData={policyData} purchaseData={purchaseData} clientSecret={clientSecret} />
                </Elements>
              ) : (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Preparing secure payment...</p>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h3 className="font-bold text-gray-900 mb-4">Order Summary</h3>

              <div className="space-y-4 mb-6">
                <div>
                  <div className="text-sm text-gray-600">Policy</div>
                  <div className="font-semibold text-gray-900">{policyData.policy_name}</div>
                </div>

                <div>
                  <div className="text-sm text-gray-600">Provider</div>
                  <div className="font-semibold text-gray-900">{policyData.provider?.provider_name}</div>
                </div>

                <div>
                  <div className="text-sm text-gray-600">Coverage</div>
                  <div className="font-semibold text-gray-900">
                    {formatCurrency(parseFloat(purchaseData.form_data.coverage_amount))}
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-600">Policy Holder</div>
                  <div className="font-semibold text-gray-900">{purchaseData.form_data.full_name}</div>
                </div>
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Base Premium</span>
                  <span className="font-semibold">{formatCurrency(policyData.annual_premium_base)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">GST (18%)</span>
                  <span className="font-semibold">{formatCurrency(policyData.annual_premium_base * 0.18)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
                  <span>Total Amount</span>
                  <span className="text-blue-600">{formatCurrency(policyData.annual_premium_base * 1.18)}</span>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  Instant policy activation
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  Email & SMS confirmation
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  Digital policy documents
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  100% secure payment
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
