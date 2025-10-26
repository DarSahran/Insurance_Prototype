import { supabase } from './supabase';

export interface PaymentMethod {
  id: string;
  user_id: string;
  method_type: 'upi' | 'credit_card' | 'debit_card' | 'net_banking' | 'emi';
  provider_name: string;
  last_four?: string;
  upi_id?: string;
  card_brand?: string;
  expiry_month?: number;
  expiry_year?: number;
  is_primary: boolean;
  auto_pay_enabled: boolean;
  is_active: boolean;
  metadata?: any;
  created_at: string;
  updated_at: string;
}

export interface PremiumPayment {
  id: string;
  user_id: string;
  policy_id?: string;
  policy_name: string;
  policy_type: string;
  amount_inr: number;
  due_date: string;
  payment_date?: string;
  status: 'pending' | 'scheduled' | 'paid' | 'failed' | 'overdue' | 'cancelled';
  payment_method_id?: string;
  payment_method_type?: string;
  transaction_id?: string;
  gateway_reference?: string;
  discount_percent: number;
  discount_amount_inr: number;
  final_amount_inr: number;
  auto_pay: boolean;
  failure_reason?: string;
  payment_gateway?: string;
  metadata?: any;
  created_at: string;
  updated_at: string;
}

export interface PaymentTransaction {
  id: string;
  user_id: string;
  premium_payment_id?: string;
  transaction_type: 'payment' | 'refund' | 'reversal' | 'adjustment';
  amount_inr: number;
  currency: string;
  status: string;
  gateway: string;
  gateway_transaction_id?: string;
  gateway_order_id?: string;
  payment_method: string;
  description: string;
  gateway_response?: any;
  failure_code?: string;
  failure_message?: string;
  processed_at?: string;
  created_at: string;
}

export class PaymentService {
  static formatINR(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  static formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  static async getUserPaymentMethods(userId: string): Promise<PaymentMethod[]> {
    const { data, error } = await supabase
      .from('payment_methods')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('is_primary', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async addPaymentMethod(userId: string, methodData: Partial<PaymentMethod>): Promise<PaymentMethod> {
    const { data, error } = await supabase
      .from('payment_methods')
      .insert({ ...methodData, user_id: userId })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async setPrimaryPaymentMethod(userId: string, methodId: string): Promise<void> {
    await supabase
      .from('payment_methods')
      .update({ is_primary: false })
      .eq('user_id', userId);

    const { error } = await supabase
      .from('payment_methods')
      .update({ is_primary: true })
      .eq('id', methodId)
      .eq('user_id', userId);

    if (error) throw error;
  }

  static async toggleAutoPayMethod(methodId: string, enabled: boolean): Promise<void> {
    const { error } = await supabase
      .from('payment_methods')
      .update({ auto_pay_enabled: enabled })
      .eq('id', methodId);

    if (error) throw error;
  }

  static async getUserPremiumPayments(userId: string): Promise<PremiumPayment[]> {
    const { data, error } = await supabase
      .from('premium_payments')
      .select('*')
      .eq('user_id', userId)
      .order('due_date', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  static async getPendingPayments(userId: string): Promise<PremiumPayment[]> {
    const { data, error } = await supabase
      .from('premium_payments')
      .select('*')
      .eq('user_id', userId)
      .in('status', ['pending', 'scheduled', 'overdue'])
      .order('due_date', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  static async createPremiumPayment(paymentData: Partial<PremiumPayment>): Promise<PremiumPayment> {
    const discountAmount = (paymentData.amount_inr || 0) * ((paymentData.discount_percent || 0) / 100);
    const finalAmount = (paymentData.amount_inr || 0) - discountAmount;

    const { data, error } = await supabase
      .from('premium_payments')
      .insert({
        ...paymentData,
        discount_amount_inr: discountAmount,
        final_amount_inr: finalAmount
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updatePaymentStatus(
    paymentId: string,
    status: PremiumPayment['status'],
    transactionId?: string,
    gatewayRef?: string,
    failureReason?: string
  ): Promise<void> {
    const updates: any = { status };
    if (status === 'paid') updates.payment_date = new Date().toISOString().split('T')[0];
    if (transactionId) updates.transaction_id = transactionId;
    if (gatewayRef) updates.gateway_reference = gatewayRef;
    if (failureReason) updates.failure_reason = failureReason;

    const { error } = await supabase
      .from('premium_payments')
      .update(updates)
      .eq('id', paymentId);

    if (error) throw error;
  }

  static async getPaymentTransactions(userId: string, limit: number = 50): Promise<PaymentTransaction[]> {
    const { data, error } = await supabase
      .from('payment_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  static async createTransaction(transactionData: Partial<PaymentTransaction>): Promise<PaymentTransaction> {
    const { data, error } = await supabase
      .from('payment_transactions')
      .insert(transactionData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateTransactionStatus(
    transactionId: string,
    status: string,
    gatewayResponse?: any,
    failureCode?: string,
    failureMessage?: string
  ): Promise<void> {
    const updates: any = { status };
    if (status === 'completed') updates.processed_at = new Date().toISOString();
    if (gatewayResponse) updates.gateway_response = gatewayResponse;
    if (failureCode) updates.failure_code = failureCode;
    if (failureMessage) updates.failure_message = failureMessage;

    const { error } = await supabase
      .from('payment_transactions')
      .update(updates)
      .eq('id', transactionId);

    if (error) throw error;
  }

  static async getPaymentStats(userId: string) {
    const [payments, transactions] = await Promise.all([
      this.getUserPremiumPayments(userId),
      this.getPaymentTransactions(userId, 100)
    ]);

    const totalMonthlyPremium = payments
      .filter(p => p.status !== 'cancelled')
      .reduce((sum, p) => sum + p.final_amount_inr, 0);

    const pendingCount = payments.filter(p =>
      p.status === 'pending' || p.status === 'scheduled' || p.status === 'overdue'
    ).length;

    const autoPayCount = payments.filter(p => p.auto_pay).length;

    const nextPayment = payments.find(p =>
      p.status !== 'paid' && p.status !== 'cancelled' && new Date(p.due_date) >= new Date()
    );

    const yearToDatePaid = transactions
      .filter(t =>
        t.transaction_type === 'payment' &&
        t.status === 'completed' &&
        new Date(t.created_at).getFullYear() === new Date().getFullYear()
      )
      .reduce((sum, t) => sum + t.amount_inr, 0);

    return {
      totalMonthlyPremium,
      pendingCount,
      autoPayCount,
      nextPayment,
      yearToDatePaid,
      totalPayments: payments.length,
      totalTransactions: transactions.length
    };
  }

  static async checkOverduePayments(userId: string): Promise<PremiumPayment[]> {
    const { data, error } = await supabase
      .from('premium_payments')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'pending')
      .lt('due_date', new Date().toISOString().split('T')[0]);

    if (error) throw error;

    if (data && data.length > 0) {
      await Promise.all(
        data.map(payment =>
          supabase
            .from('premium_payments')
            .update({ status: 'overdue' })
            .eq('id', payment.id)
        )
      );
    }

    return data || [];
  }
}
