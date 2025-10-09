import { supabase } from './supabase';
import type { RealtimeChannel } from '@supabase/supabase-js';

export interface Notification {
  id: string;
  user_id: string;
  notification_type: string;
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'policies' | 'claims' | 'payments' | 'health' | 'system' | 'security' | 'recommendations';
  related_entity_type?: string;
  related_entity_id?: string;
  action_url?: string;
  is_read: boolean;
  is_archived: boolean;
  read_at?: string;
  delivered_at?: string;
  expires_at?: string;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface NotificationPreferences {
  id: string;
  user_id: string;
  email_enabled: boolean;
  push_enabled: boolean;
  sms_enabled: boolean;
  in_app_enabled: boolean;
  notification_types: Record<string, any>;
  quiet_hours_start?: string;
  quiet_hours_end?: string;
  timezone: string;
  created_at: string;
  updated_at: string;
}

export interface CreateNotificationInput {
  user_id: string;
  notification_type: string;
  title: string;
  message: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  category: 'policies' | 'claims' | 'payments' | 'health' | 'system' | 'security' | 'recommendations';
  related_entity_type?: string;
  related_entity_id?: string;
  action_url?: string;
  expires_at?: string;
  metadata?: Record<string, any>;
}

class NotificationService {
  private realtimeChannel: RealtimeChannel | null = null;

  async getUserNotifications(
    userId: string,
    filters?: {
      isRead?: boolean;
      isArchived?: boolean;
      category?: string;
      limit?: number;
    }
  ): Promise<Notification[]> {
    try {
      let query = supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (filters?.isRead !== undefined) {
        query = query.eq('is_read', filters.isRead);
      }

      if (filters?.isArchived !== undefined) {
        query = query.eq('is_archived', filters.isArchived);
      }

      if (filters?.category) {
        query = query.eq('category', filters.category);
      }

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  }

  async getUnreadCount(userId: string): Promise<number> {
    try {
      const { data, error } = await supabase.rpc('get_unread_notification_count', {
        p_user_id: userId
      });

      if (error) throw error;
      return data || 0;
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  }

  async markAsRead(notificationId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  }

  async markAllAsRead(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return false;
    }
  }

  async archiveNotification(notificationId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_archived: true })
        .eq('id', notificationId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error archiving notification:', error);
      return false;
    }
  }

  async deleteNotification(notificationId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting notification:', error);
      return false;
    }
  }

  async createNotification(input: CreateNotificationInput): Promise<Notification | null> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          user_id: input.user_id,
          notification_type: input.notification_type,
          title: input.title,
          message: input.message,
          priority: input.priority || 'medium',
          category: input.category,
          related_entity_type: input.related_entity_type,
          related_entity_id: input.related_entity_id,
          action_url: input.action_url,
          expires_at: input.expires_at,
          metadata: input.metadata || {},
          delivered_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating notification:', error);
      return null;
    }
  }

  async getUserPreferences(userId: string): Promise<NotificationPreferences | null> {
    try {
      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        const { data: newPrefs, error: insertError } = await supabase
          .from('notification_preferences')
          .insert({ user_id: userId })
          .select()
          .single();

        if (insertError) throw insertError;
        return newPrefs;
      }

      return data;
    } catch (error) {
      console.error('Error fetching notification preferences:', error);
      return null;
    }
  }

  async updateUserPreferences(
    userId: string,
    preferences: Partial<NotificationPreferences>
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notification_preferences')
        .update(preferences)
        .eq('user_id', userId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      return false;
    }
  }

  subscribeToNotifications(
    userId: string,
    onNotification: (notification: Notification) => void
  ): RealtimeChannel {
    if (this.realtimeChannel) {
      this.realtimeChannel.unsubscribe();
    }

    this.realtimeChannel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          onNotification(payload.new as Notification);
        }
      )
      .subscribe();

    return this.realtimeChannel;
  }

  unsubscribeFromNotifications(): void {
    if (this.realtimeChannel) {
      this.realtimeChannel.unsubscribe();
      this.realtimeChannel = null;
    }
  }

  async createPolicyRenewalNotification(userId: string, policyNumber: string, daysUntilExpiry: number): Promise<void> {
    const priority = daysUntilExpiry <= 7 ? 'urgent' : daysUntilExpiry <= 30 ? 'high' : 'medium';

    await this.createNotification({
      user_id: userId,
      notification_type: 'policy_renewal',
      title: 'Policy Renewal Reminder',
      message: `Your policy ${policyNumber} expires in ${daysUntilExpiry} days. Renew now to maintain coverage.`,
      priority,
      category: 'policies',
      action_url: `/dashboard/policies`,
      metadata: { policy_number: policyNumber, days_until_expiry: daysUntilExpiry }
    });
  }

  async createClaimUpdateNotification(
    userId: string,
    claimNumber: string,
    status: string,
    claimId: string
  ): Promise<void> {
    await this.createNotification({
      user_id: userId,
      notification_type: 'claim_update',
      title: 'Claim Status Update',
      message: `Your claim ${claimNumber} status has been updated to: ${status}`,
      priority: status === 'approved' || status === 'denied' ? 'high' : 'medium',
      category: 'claims',
      related_entity_type: 'claim',
      related_entity_id: claimId,
      action_url: `/dashboard/claims/${claimId}`,
      metadata: { claim_number: claimNumber, status }
    });
  }

  async createPaymentDueNotification(
    userId: string,
    policyNumber: string,
    amount: number,
    dueDate: string
  ): Promise<void> {
    const daysUntilDue = Math.ceil(
      (new Date(dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );

    await this.createNotification({
      user_id: userId,
      notification_type: 'payment_due',
      title: 'Payment Due',
      message: `Payment of $${amount.toFixed(2)} for policy ${policyNumber} is due in ${daysUntilDue} days.`,
      priority: daysUntilDue <= 3 ? 'high' : 'medium',
      category: 'payments',
      action_url: `/dashboard/payments`,
      metadata: { policy_number: policyNumber, amount, due_date: dueDate, days_until_due: daysUntilDue }
    });
  }

  async createHealthMilestoneNotification(
    userId: string,
    milestone: string,
    reward?: string
  ): Promise<void> {
    await this.createNotification({
      user_id: userId,
      notification_type: 'health_milestone',
      title: 'Health Milestone Achieved!',
      message: `Congratulations! ${milestone}${reward ? ` You've earned: ${reward}` : ''}`,
      priority: 'medium',
      category: 'health',
      action_url: `/dashboard/health-tracking`,
      metadata: { milestone, reward }
    });
  }

  async createSecurityAlertNotification(
    userId: string,
    alertType: string,
    message: string
  ): Promise<void> {
    await this.createNotification({
      user_id: userId,
      notification_type: 'security_alert',
      title: 'Security Alert',
      message,
      priority: 'urgent',
      category: 'security',
      action_url: `/dashboard/settings`,
      metadata: { alert_type: alertType }
    });
  }
}

export const notificationService = new NotificationService();
