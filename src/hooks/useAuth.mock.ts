import { useState, useEffect } from 'react';

// Simple mock user type for development
interface MockUser {
  id: string;
  email: string;
  user_metadata?: {
    full_name?: string;
    first_name?: string;
    last_name?: string;
  };
}

export const useAuth = () => {
  const [user, setUser] = useState<MockUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate auth check delay
    const timer = setTimeout(() => {
      // Set a mock user for development
      setUser({
        id: 'demo-user-123',
        email: 'demo@example.com',
        user_metadata: {
          full_name: 'Demo User',
          first_name: 'Demo',
          last_name: 'User'
        }
      });
      setLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const signIn = async (email: string, _password: string) => {
    // Mock sign in
    const mockUser = {
      id: 'demo-user-123',
      email,
      user_metadata: {
        full_name: 'Demo User',
        first_name: 'Demo',
        last_name: 'User'
      }
    };
    setUser(mockUser);
    return { data: { user: mockUser }, error: null };
  };

  const signUp = async (email: string, _password: string, userData: any) => {
    // Mock sign up
    const mockUser = {
      id: 'demo-user-123',
      email,
      user_metadata: userData
    };
    setUser(mockUser);
    return { data: { user: mockUser }, error: null };
  };

  const signOut = async () => {
    setUser(null);
    return { error: null };
  };

  const resetPassword = async (_email: string) => {
    return { data: {}, error: null };
  };

  return {
    user,
    session: user ? { user } : null,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
  };
};
