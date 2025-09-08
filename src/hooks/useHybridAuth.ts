import { useState, useEffect } from 'react'
import { useUser, useAuth as useClerkAuth } from '@clerk/clerk-react'
import { useAuth as useSupabaseAuth } from './useAuth'
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
    // Determine which auth provider is active
    if (clerkLoaded && !supabaseLoading) {
      if (clerkUser) {
        setAuthProvider('clerk')
        // Convert Clerk user to Supabase-like user object for consistency
        setCurrentUser({
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
        } as User)
      } else if (supabaseUser) {
        setAuthProvider('supabase')
        setCurrentUser(supabaseUser)
      } else {
        setAuthProvider(null)
        setCurrentUser(null)
      }
      setLoading(false)
    }
  }, [clerkUser, clerkLoaded, supabaseUser, supabaseLoading])

  const signOut = async () => {
    try {
      if (authProvider === 'clerk') {
        await clerkSignOut()
      } else if (authProvider === 'supabase') {
        await supabaseSignOut()
      }
      setCurrentUser(null)
      setAuthProvider(null)
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

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
