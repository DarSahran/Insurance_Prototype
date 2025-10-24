import { supabase } from './supabase';

class ActiveUsersService {
  private sessionId: string;
  private updateInterval: number | null = null;
  private cleanupInterval: number | null = null;

  constructor() {
    this.sessionId = this.getOrCreateSessionId();
  }

  private getOrCreateSessionId(): string {
    let sessionId = sessionStorage.getItem('session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('session_id', sessionId);
    }
    return sessionId;
  }

  async startTracking(userId?: string) {
    await this.updatePresence(userId);

    this.updateInterval = window.setInterval(async () => {
      await this.updatePresence(userId);
    }, 30000);

    this.cleanupInterval = window.setInterval(async () => {
      await this.cleanupInactiveSessions();
    }, 60000);

    window.addEventListener('beforeunload', () => {
      this.stopTracking();
    });
  }

  private async updatePresence(userId?: string) {
    try {
      const { error } = await supabase
        .from('active_users')
        .upsert({
          session_id: this.sessionId,
          user_id: userId || null,
          last_seen: new Date().toISOString(),
          page_url: window.location.pathname,
          user_agent: navigator.userAgent,
        }, {
          onConflict: 'session_id'
        });

      if (error) {
        console.error('Error updating presence:', error);
      }
    } catch (error) {
      console.error('Error in updatePresence:', error);
    }
  }

  private async cleanupInactiveSessions() {
    try {
      const { error } = await supabase.rpc('cleanup_inactive_sessions');
      if (error) {
        console.error('Error cleaning up sessions:', error);
      }
    } catch (error) {
      console.error('Error in cleanupInactiveSessions:', error);
    }
  }

  async getActiveUserCount(): Promise<number> {
    try {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();

      const { count, error } = await supabase
        .from('active_users')
        .select('*', { count: 'exact', head: true })
        .gte('last_seen', fiveMinutesAgo);

      if (error) {
        console.error('Error getting active user count:', error);
        return 0;
      }

      return count || 0;
    } catch (error) {
      console.error('Error in getActiveUserCount:', error);
      return 0;
    }
  }

  subscribeToActiveUsers(callback: (count: number) => void) {
    const channel = supabase
      .channel('active_users_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'active_users'
        },
        async () => {
          const count = await this.getActiveUserCount();
          callback(count);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }

  stopTracking() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }
}

export const activeUsersService = new ActiveUsersService();
