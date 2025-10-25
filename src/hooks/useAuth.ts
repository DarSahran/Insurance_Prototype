import { useState, useEffect } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { createUserProfile } from '../lib/database'

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, userData: any) => {
    console.log('🔧 useAuth.signUp called');
    console.log('📧 Email:', email);
    console.log('📝 User data:', userData);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })

    console.log('📬 Supabase auth.signUp response:', { data, error });

    if (error) {
      console.error('❌ Supabase signup error:', error);
      return { data, error };
    }

    // If signup is successful, create user profile
    if (data.user) {
      console.log('✅ User created in Supabase Auth:', data.user.id);
      console.log('📝 Creating user profile in database...');

      const profileData = {
        user_id: data.user.id,
        email: email,
        first_name: userData.first_name || '',
        last_name: userData.last_name || '',
        full_name: userData.full_name || '',
      }

      console.log('📤 Profile data to create:', profileData);

      const { data: profileResult, error: profileError } = await createUserProfile(profileData)

      if (profileError) {
        console.error('❌ Error creating user profile:', profileError);
        console.error('Profile error code:', profileError.code);
        console.error('Profile error details:', profileError.details);
      } else {
        console.log('✅✅ USER PROFILE CREATED SUCCESSFULLY!');
        console.log('Profile data:', profileResult);
      }
    } else {
      console.log('⚠️ No user object in signup response');
    }

    return { data, error }
  }

  const signIn = async (email: string, password: string) => {
    console.log('🔧 useAuth.signIn called');
    console.log('📧 Email:', email);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    console.log('📬 Supabase signIn response:', { data, error });

    if (error) {
      console.error('❌ Login error:', error);
    } else if (data.user) {
      console.log('✅ Login successful, user:', data.user.id);
    }

    return { data, error }
  }

  // Sign out and clear browser cache (localStorage, sessionStorage)
  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    // Clear localStorage and sessionStorage for security after sign out
    try {
      localStorage.clear()
      sessionStorage.clear()
      // Optionally, clear indexedDB if your app uses it for caching
      if (window.indexedDB) {
        window.indexedDB.databases && window.indexedDB.databases().then(dbs => {
          dbs.forEach(db => {
            if (db.name) window.indexedDB.deleteDatabase(db.name)
          })
        })
      }
    } catch (e) {
      // Ignore errors in cache clearing
    }
    return { error }
  }

  const resetPassword = async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email)
    return { data, error }
  }

  return {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
  }
}