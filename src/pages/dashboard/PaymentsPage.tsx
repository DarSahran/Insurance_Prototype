import React, { useState, useEffect, useCallback } from 'react';
import {
  CreditCard, Calendar, IndianRupee, Clock, CheckCircle, AlertTriangle,
  Plus, Download, Settings, Building, Shield, Car, Smartphone,
  Bell, ArrowUpRight, ArrowDownRight, Filter, Search, RefreshCw, Loader
} from 'lucide-react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useAuth } from '../../hooks/useAuth';
import { PaymentService, type PaymentMethod, type PremiumPayment, type PaymentTransaction } from '../../lib/paymentService';
import { supabase } from '../../lib/supabase';

const PaymentsPage: React.FC = () => {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('12months');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showAddMethodModal, setShowAddMethodModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [premiumPayments, setPremiumPayments] = useState<PremiumPayment[]>([]);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const loadData = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const [methods, payments, txns, statistics] = await Promise.all([
        PaymentService.getUserPaymentMethods(user.id),
        PaymentService.getUserPremiumPayments(user.id),
        PaymentService.getPaymentTransactions(user.id),
        PaymentService.getPaymentStats(user.id)
      ]);

      setPaymentMethods(methods);
      setPremiumPayments(payments);
      setTransactions(txns);
      setStats(statistics);

      await PaymentService.checkOverduePayments(user.id);
    } catch (error) {
      console.error('Error loading payment data:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('payment-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'premium_payments',
          filter: `user_id=eq.${user.id}`
        },
        () => loadData()
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'payment_transactions',
          filter: `user_id=eq.${user.id}`
        },
        () => loadData()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, loadData]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleToggleAutoPay = async (methodId: string, enabled: boolean) => {
    try {
      await PaymentService.toggleAutoPayMethod(methodId, enabled);
      await loadData();
    } catch (error) {
      console.error('Error toggling auto-pay:', error);
    }
  };

  const handleSetPrimary = async (methodId: string) => {
    if (!user) return;
    try {
      await PaymentService.setPrimaryPaymentMethod(user.id, methodId);
      await loadData();
    } catch (error) {
      console.error('Error setting primary method:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return CheckCircle;
      case 'pending': return Clock;
      case 'scheduled': return Calendar;
      case 'overdue': return AlertTriangle;
      case 'failed': return AlertTriangle;
      default: return Clock;
    }
  };

  const getMethodIcon = (type: string) => {
    switch (type) {
      case 'upi': return Smartphone;
      case 'credit_card':
      case 'debit_card': return CreditCard;
      case 'net_banking': return Building;
      default: return CreditCard;
    }
  };

  const getMonthlyPaymentHistory = () => {
    const months = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;

      const monthTransactions = transactions.filter(t => {
        const txDate = new Date(t.created_at);
        return txDate.getMonth() === date.getMonth() &&
               txDate.getFullYear() === date.getFullYear() &&
               t.transaction_type === 'payment' &&
               t.status === 'completed';
      });

      const amount = monthTransactions.reduce((sum, t) => sum + t.amount_inr, 0);

      months.push({
        month: monthYear,
        amount: amount,
        count: monthTransactions.length
      });
    }
    return months;
  };

  const filteredTransactions = transactions.filter(t =>
    t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.gateway_transaction_id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading payment data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payments & Billing</h1>
          <p className="text-gray-600 mt-1">Manage your insurance premiums and payment methods</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => setShowPaymentModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            <span>Make Payment</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Monthly Premium</p>
              <p className="text-2xl font-bold text-gray-900">
                {PaymentService.formatINR(stats?.totalMonthlyPremium || 0)}
              </p>
            </div>
            <IndianRupee className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Payments</p>
              <p className="text-2xl font-bold text-yellow-600">{stats?.pendingCount || 0}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Auto-Pay Enabled</p>
              <p className="text-2xl font-bold text-green-600">{stats?.autoPayCount || 0}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Next Payment</p>
              <p className="text-xl font-bold text-purple-600">
                {stats?.nextPayment ? PaymentService.formatDate(stats.nextPayment.due_date) : 'None'}
              </p>
            </div>
            <Calendar className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Current Period Payments</h2>

          {premiumPayments.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>No payments found</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              {premiumPayments.slice(0, 10).map(payment => {
                const StatusIcon = getStatusIcon(payment.status);

                return (
                  <div key={payment.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Shield className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{payment.policy_name}</h3>
                          <p className="text-sm text-gray-600">{payment.policy_type}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <StatusIcon className="w-4 h-4 text-gray-500" />
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(payment.status)}`}>
                              {payment.status.toUpperCase()}
                            </span>
                            {payment.auto_pay && (
                              <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                                Auto-Pay
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">
                          {PaymentService.formatINR(payment.final_amount_inr)}
                        </p>
                        {payment.discount_percent > 0 && (
                          <p className="text-xs text-green-600">
                            -{payment.discount_percent}% discount
                          </p>
                        )}
                        <p className="text-sm text-gray-600">
                          Due: {PaymentService.formatDate(payment.due_date)}
                        </p>
                        {payment.payment_method_type && (
                          <p className="text-xs text-gray-500 capitalize">{payment.payment_method_type.replace('_', ' ')}</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Payment History</h2>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="6months">Last 6 Months</option>
              <option value="12months">Last 12 Months</option>
            </select>
          </div>

          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={getMonthlyPaymentHistory().slice(-12)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" angle={-45} textAnchor="end" height={80} />
              <YAxis tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`} />
              <Tooltip
                formatter={(value: any) => [PaymentService.formatINR(value), 'Amount Paid']}
                labelStyle={{ color: '#374151' }}
              />
              <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Recent Transactions</h2>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="flex items-center space-x-2 px-3 py-2 text-blue-600 hover:text-blue-800">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <ArrowUpRight className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>No transactions found</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {filteredTransactions.map(transaction => (
              <div key={transaction.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg ${
                    transaction.transaction_type === 'refund' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {transaction.transaction_type === 'refund' ? (
                      <ArrowDownRight className="w-5 h-5 text-green-600" />
                    ) : (
                      <ArrowUpRight className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{transaction.description}</h3>
                    <p className="text-sm text-gray-600">
                      {PaymentService.formatDate(transaction.created_at)} • {transaction.payment_method}
                    </p>
                    {transaction.gateway_transaction_id && (
                      <p className="text-xs text-gray-500">TXN: {transaction.gateway_transaction_id}</p>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <p className={`text-lg font-semibold ${
                    transaction.transaction_type === 'refund' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.transaction_type === 'refund' ? '+' : '-'}
                    {PaymentService.formatINR(Math.abs(transaction.amount_inr))}
                  </p>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                    transaction.status === 'failed' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {transaction.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Payment Methods</h2>
          <button
            onClick={() => setShowAddMethodModal(true)}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            <Plus className="w-4 h-4" />
            <span>Add Method</span>
          </button>
        </div>

        {paymentMethods.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <CreditCard className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="mb-4">No payment methods added</p>
            <button
              onClick={() => setShowAddMethodModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Your First Payment Method
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paymentMethods.map(method => {
              const MethodIcon = getMethodIcon(method.method_type);
              return (
                <div key={method.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <MethodIcon className="w-8 h-8 text-blue-600" />
                      <div>
                        <h3 className="font-medium text-gray-900 capitalize">
                          {method.method_type.replace('_', ' ')} {method.last_four && `•••• ${method.last_four}`}
                        </h3>
                        {method.upi_id && <p className="text-sm text-gray-600">{method.upi_id}</p>}
                        {method.card_brand && <p className="text-sm text-gray-600">{method.card_brand}</p>}
                        <p className="text-sm text-gray-600">{method.provider_name}</p>
                        {method.expiry_month && method.expiry_year && (
                          <p className="text-xs text-gray-500">Expires {method.expiry_month}/{method.expiry_year}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      {method.is_primary && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                          Primary
                        </span>
                      )}
                      {!method.is_primary && (
                        <button
                          onClick={() => handleSetPrimary(method.id)}
                          className="text-xs text-blue-600 hover:text-blue-800"
                        >
                          Set as Primary
                        </button>
                      )}
                      <label className="flex items-center space-x-2 text-xs">
                        <input
                          type="checkbox"
                          checked={method.auto_pay_enabled}
                          onChange={(e) => handleToggleAutoPay(method.id, e.target.checked)}
                          className="rounded border-gray-300"
                        />
                        <span className="text-gray-600">Auto-Pay</span>
                      </label>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {stats?.autoPayCount < stats?.totalPayments && (
        <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <Bell className="w-6 h-6 text-blue-600 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-blue-900">Enable Auto-Pay & Save!</h3>
              <p className="text-blue-800 mt-1">
                Set up auto-pay for all your policies to never miss a payment and get 5% discount on premiums.
              </p>
              <div className="flex items-center space-x-4 mt-4">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Enable Auto-Pay for All
                </button>
                <button className="text-blue-600 hover:text-blue-800 font-medium">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddMethodModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add Payment Method</h3>
              <button
                onClick={() => setShowAddMethodModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <Plus className="w-5 h-5 transform rotate-45" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Method Type</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option value="">Select type</option>
                  <option value="upi">UPI</option>
                  <option value="credit_card">Credit Card</option>
                  <option value="debit_card">Debit Card</option>
                  <option value="net_banking">Net Banking</option>
                  <option value="emi">EMI</option>
                </select>
              </div>

              <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
                Payment method integration with Razorpay/PayU/PhonePe will be configured based on your gateway selection.
              </p>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowAddMethodModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Add Method
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentsPage;
