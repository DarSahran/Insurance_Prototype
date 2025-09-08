import React, { useState } from 'react';
import { 
  CreditCard, Calendar, DollarSign, Clock, CheckCircle, AlertTriangle,
  Plus, Download, Settings, Building, Shield, Car,
  Bell, ArrowUpRight, ArrowDownRight, Filter, Search
} from 'lucide-react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const PaymentsPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('12months');
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Mock payment data
  const payments = [
    {
      id: 1,
      policy: 'HealthSecure Premium',
      type: 'Health Insurance',
      amount: 285.50,
      dueDate: '2024-10-01',
      status: 'paid',
      paymentDate: '2024-09-28',
      method: 'Auto-Pay (Credit Card)',
      icon: Shield
    },
    {
      id: 2,
      policy: 'AutoProtect Comprehensive',
      type: 'Auto Insurance',
      amount: 156.75,
      dueDate: '2024-10-05',
      status: 'pending',
      paymentDate: null,
      method: 'Bank Transfer',
      icon: Car
    },
    {
      id: 3,
      policy: 'HomeGuard Standard',
      type: 'Home Insurance',
      amount: 98.25,
      dueDate: '2024-10-10',
      status: 'scheduled',
      paymentDate: null,
      method: 'Auto-Pay (Bank Account)',
      icon: Building
    },
    {
      id: 4,
      policy: 'LifeSecure Term',
      type: 'Life Insurance',
      amount: 67.50,
      dueDate: '2024-10-15',
      status: 'upcoming',
      paymentDate: null,
      method: 'Credit Card',
      icon: Shield
    }
  ];

  const paymentHistory = [
    { month: 'Jan', amount: 608, policies: 4 },
    { month: 'Feb', amount: 608, policies: 4 },
    { month: 'Mar', amount: 608, policies: 4 },
    { month: 'Apr', amount: 608, policies: 4 },
    { month: 'May', amount: 608, policies: 4 },
    { month: 'Jun', amount: 608, policies: 4 },
    { month: 'Jul', amount: 608, policies: 4 },
    { month: 'Aug', amount: 608, policies: 4 },
    { month: 'Sep', amount: 608, policies: 4 },
    { month: 'Oct', amount: 540, policies: 3 },
    { month: 'Nov', amount: 0, policies: 0 },
    { month: 'Dec', amount: 0, policies: 0 }
  ];

  const recentTransactions = [
    {
      id: 1,
      type: 'payment',
      description: 'HealthSecure Premium - Monthly Premium',
      amount: -285.50,
      date: '2024-09-28',
      status: 'completed'
    },
    {
      id: 2,
      type: 'refund',
      description: 'AutoProtect - Overpayment Refund',
      amount: 45.25,
      date: '2024-09-25',
      status: 'completed'
    },
    {
      id: 3,
      type: 'payment',
      description: 'HomeGuard Standard - Monthly Premium',
      amount: -98.25,
      date: '2024-09-10',
      status: 'completed'
    },
    {
      id: 4,
      type: 'payment',
      description: 'LifeSecure Term - Monthly Premium',
      amount: -67.50,
      date: '2024-09-15',
      status: 'completed'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'upcoming': return 'bg-purple-100 text-purple-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return CheckCircle;
      case 'pending': return Clock;
      case 'scheduled': return Calendar;
      case 'upcoming': return Calendar;
      case 'overdue': return AlertTriangle;
      default: return Clock;
    }
  };

  const totalMonthlyPremium = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const upcomingPayments = payments.filter(p => p.status === 'pending' || p.status === 'upcoming').length;
  const autoPayEnabled = payments.filter(p => p.method.includes('Auto-Pay')).length;

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payments & Billing</h1>
          <p className="text-gray-600 mt-1">Manage your insurance premiums and payment methods</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
            <Settings className="w-4 h-4" />
            <span>Payment Settings</span>
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Monthly Premium</p>
              <p className="text-2xl font-bold text-gray-900">${totalMonthlyPremium.toFixed(2)}</p>
            </div>
            <DollarSign className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Upcoming Payments</p>
              <p className="text-2xl font-bold text-yellow-600">{upcomingPayments}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Auto-Pay Enabled</p>
              <p className="text-2xl font-bold text-green-600">{autoPayEnabled}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Next Payment</p>
              <p className="text-2xl font-bold text-purple-600">Oct 1</p>
            </div>
            <Calendar className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Current Payments */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Current Period Payments</h2>
          
          <div className="space-y-4">
            {payments.map(payment => {
              const StatusIcon = getStatusIcon(payment.status);
              const PolicyIcon = payment.icon;
              
              return (
                <div key={payment.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <PolicyIcon className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{payment.policy}</h3>
                        <p className="text-sm text-gray-600">{payment.type}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <StatusIcon className="w-4 h-4 text-gray-500" />
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(payment.status)}`}>
                            {payment.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">${payment.amount}</p>
                      <p className="text-sm text-gray-600">Due: {payment.dueDate}</p>
                      <p className="text-xs text-gray-500">{payment.method}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Payment History Chart */}
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
              <option value="24months">Last 24 Months</option>
            </select>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={paymentHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value) => [`$${value}`, 'Amount Paid']}
                labelStyle={{ color: '#374151' }}
              />
              <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Recent Transactions</h2>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search transactions..."
                className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>
            <button className="flex items-center space-x-2 px-3 py-2 text-blue-600 hover:text-blue-800">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
        
        <div className="space-y-3">
          {recentTransactions.map(transaction => (
            <div key={transaction.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-lg ${transaction.amount > 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                  {transaction.amount > 0 ? (
                    <ArrowDownRight className="w-5 h-5 text-green-600" />
                  ) : (
                    <ArrowUpRight className="w-5 h-5 text-red-600" />
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{transaction.description}</h3>
                  <p className="text-sm text-gray-600">{transaction.date}</p>
                </div>
              </div>
              
              <div className="text-right">
                <p className={`text-lg font-semibold ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                </p>
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                  {transaction.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Payment Methods</h2>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
            <Plus className="w-4 h-4" />
            <span>Add Method</span>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CreditCard className="w-8 h-8 text-blue-600" />
                <div>
                  <h3 className="font-medium text-gray-900">Visa •••• 4567</h3>
                  <p className="text-sm text-gray-600">Expires 12/26</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                  Primary
                </span>
                <button className="text-gray-400 hover:text-gray-600">
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Building className="w-8 h-8 text-green-600" />
                <div>
                  <h3 className="font-medium text-gray-900">Bank Account •••• 8901</h3>
                  <p className="text-sm text-gray-600">Chase Checking</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                  Auto-Pay
                </span>
                <button className="text-gray-400 hover:text-gray-600">
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Auto-Pay Settings */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <Bell className="w-6 h-6 text-blue-600 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-blue-900">Auto-Pay Recommendations</h3>
            <p className="text-blue-800 mt-1">
              Enable auto-pay for all your policies to never miss a payment and get a 5% discount on your premiums.
            </p>
            <div className="flex items-center space-x-4 mt-4">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Enable Auto-Pay
              </button>
              <button className="text-blue-600 hover:text-blue-800 font-medium">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Make a Payment</h3>
              <button 
                onClick={() => setShowPaymentModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <Plus className="w-5 h-5 transform rotate-45" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Policy</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option value="">Choose policy to pay</option>
                  {payments.map(payment => (
                    <option key={payment.id} value={payment.id}>
                      {payment.policy} - ${payment.amount}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Amount</label>
                <input 
                  type="number" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option value="">Select payment method</option>
                  <option value="card-4567">Visa •••• 4567</option>
                  <option value="bank-8901">Bank Account •••• 8901</option>
                  <option value="new">Add New Payment Method</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Date</label>
                <input 
                  type="date" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input type="checkbox" id="autopay" className="rounded border-gray-300" />
                <label htmlFor="autopay" className="text-sm text-gray-700">
                  Set up auto-pay for this policy
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button 
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Make Payment
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
