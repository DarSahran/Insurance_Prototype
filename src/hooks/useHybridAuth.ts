import { useState, useEffect } from 'react'
import { useUser, useAuth as useClerkAuth } from '@clerk/clerk-react'
import { useAuth as useSupabaseAuth } from './useAuth'
import { ensureUserProfile } from '../lib/userProfileSync'
import type { User } from '@supabase/supabase-js'

export const useHybridAuth = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [authProvider, setAuthProvider] = useState<'supabase' | 'clerk' | null>(null)

  // Clerk hooks
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser()
  const { signOut: clerkSignOut } = useClerkAuth()

  // Supabase hooks
  const { user: supabaseUser, loading: supabaseLoading, signOut: supabaseSignOut } = useSupabaseAuth()

  useEffect(() => {
    const setupUserProfile = async (user: User, provider: 'clerk' | 'supabase') => {
      try {
        const result = await ensureUserProfile(user, provider);
        if (!result.success) {
          console.error(`Failed to ensure user profile for ${provider} user:`, result.error);
        } else if (result.created) {
          console.log(`New user profile created for ${provider} user`);
        } else if (result.updated) {
          console.log(`User profile updated for ${provider} user`);
        }
      } catch (error) {
        console.error(`Error setting up user profile for ${provider} user:`, error);
      }
    };

    // Determine which auth provider is active
    if (clerkLoaded && !supabaseLoading) {
      if (clerkUser) {
        setAuthProvider('clerk')
        // Convert Clerk user to Supabase-like user object for consistency
        const convertedUser = {
          id: clerkUser.id,
          email: clerkUser.primaryEmailAddress?.emailAddress || '',
          created_at: clerkUser.createdAt?.toISOString() || '',
          updated_at: clerkUser.updatedAt?.toISOString() || '',
          aud: 'authenticated',
          role: 'authenticated',
          user_metadata: {
            full_name: clerkUser.fullName,
            first_name: clerkUser.firstName,
            last_name: clerkUser.lastName,
          },
          app_metadata: {},
        } as User;

        setCurrentUser(convertedUser);
        setLoading(false); // Set loading false BEFORE profile sync
        // Ensure user profile exists in database (async, don't block)
        setupUserProfile(convertedUser, 'clerk');

      } else if (supabaseUser) {
        setAuthProvider('supabase')
        setCurrentUser(supabaseUser)
        setLoading(false); // Set loading false BEFORE profile sync
        // Ensure user profile exists in database (async, don't block)
        setupUserProfile(supabaseUser, 'supabase');

      } else {
        setAuthProvider(null)
        setCurrentUser(null)
        setLoading(false)
      }
    }
  }, [clerkUser, clerkLoaded, supabaseUser, supabaseLoading])

  const signOut = async () => {
    try {
      // Clear all browser storage first
      localStorage.clear();
      sessionStorage.clear();
      
      // Clear IndexedDB if it exists
      if (window.indexedDB) {
        try {
          const databases = await window.indexedDB.databases();
          databases.forEach(db => {
            if (db.name) window.indexedDB.deleteDatabase(db.name);
          });
        } catch (e) {
          // Ignore IndexedDB errors
        }
      }
      
      // Sign out from the appropriate provider
      if (authProvider === 'clerk') {
        await clerkSignOut();
      } else if (authProvider === 'supabase') {
        await supabaseSignOut();
      }
      
      // Clear local state
      setCurrentUser(null);
      setAuthProvider(null);
      
    } catch (error) {
      console.error('Sign out error:', error);
      // Clear local state even if sign out fails
      setCurrentUser(null);
      setAuthProvider(null);
      throw error;
    }
  };

  const isAuthenticated = !!currentUser
  const isClerkUser = authProvider === 'clerk'
  const isSupabaseUser = authProvider === 'supabase'

  return {
    user: currentUser,
    loading,
    isAuthenticated,
    authProvider,
    isClerkUser,
    isSupabaseUser,
    signOut,
  }
}
