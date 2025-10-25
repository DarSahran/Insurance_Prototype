import { createUserProfile, getUserProfile, updateUserProfile } from './database';
import type { User } from '@supabase/supabase-js';

export interface UserProfileSyncData {
  user_id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  phone?: string;
  date_of_birth?: string;
  gender?: string;
  occupation?: string;
  location?: string;
}

/**
 * Ensures that a user profile exists in the database for the given user
 * Creates a new profile if one doesn't exist, updates if needed
 */
export const ensureUserProfile = async (user: User, provider: 'clerk' | 'supabase') => {
  try {
    // Add a timeout to prevent hanging
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Database operation timeout')), 5000)
    );

    // Check if user profile exists with timeout
    const profilePromise = getUserProfile(user.id);
    const { data: existingProfile, error: fetchError } = await Promise.race([
      profilePromise,
      timeoutPromise
    ]) as any;

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error(`Error fetching user profile for ${provider} user:`, fetchError);
      return { success: false, error: fetchError };
    }

    // Prepare profile data from user object
    const profileData: UserProfileSyncData = {
      user_id: user.id,
      email: user.email || '',
      first_name: user.user_metadata?.first_name || '',
      last_name: user.user_metadata?.last_name || '',
      full_name: user.user_metadata?.full_name ||
                 (user.user_metadata?.first_name && user.user_metadata?.last_name
                   ? `${user.user_metadata.first_name} ${user.user_metadata.last_name}`
                   : ''),
      phone: user.user_metadata?.phone || '',
      date_of_birth: user.user_metadata?.date_of_birth || undefined,
      gender: user.user_metadata?.gender || '',
      occupation: user.user_metadata?.occupation || '',
      location: user.user_metadata?.location || '',
    };

    // If profile doesn't exist, create it
    if (!existingProfile) {
      const { data, error: createError } = await createUserProfile(profileData);
      if (createError) {
        // If error is duplicate key, fetch the existing profile instead
        if (createError.code === '23505') {
          console.log(`Profile already exists for ${provider} user (race condition handled):`, user.email);
          const { data: retryData } = await getUserProfile(user.id);
          return { success: true, data: retryData, created: false };
        }
        console.error(`Error creating user profile for ${provider} user:`, createError);
        return { success: false, error: createError };
      } else {
        console.log(`User profile created successfully for ${provider} user:`, user.email);
        return { success: true, data, created: true };
      }
    } else {
      // Profile exists, check if we need to update it
      // Only update if new data is actually different AND not just empty strings
      const hasNewData = (newVal: string | undefined, existingVal: string | null) => {
        return newVal && newVal.trim() !== '' && newVal !== existingVal;
      };

      const needsUpdate =
        hasNewData(profileData.email, existingProfile.email) ||
        hasNewData(profileData.first_name, existingProfile.first_name) ||
        hasNewData(profileData.last_name, existingProfile.last_name) ||
        hasNewData(profileData.full_name, existingProfile.full_name);

      if (needsUpdate) {
        // Only update fields that have actual new data
        const updates: any = {};
        if (hasNewData(profileData.email, existingProfile.email)) updates.email = profileData.email;
        if (hasNewData(profileData.first_name, existingProfile.first_name)) updates.first_name = profileData.first_name;
        if (hasNewData(profileData.last_name, existingProfile.last_name)) updates.last_name = profileData.last_name;
        if (hasNewData(profileData.full_name, existingProfile.full_name)) updates.full_name = profileData.full_name;

        const { data, error: updateError } = await updateUserProfile(user.id, updates);
        if (updateError) {
          console.error(`Error updating user profile for ${provider} user:`, updateError);
          return { success: false, error: updateError };
        } else {
          console.log(`User profile updated successfully for ${provider} user:`, user.email);
          return { success: true, data, updated: true };
        }
      } else {
        // No update needed
        console.log(`User profile already up-to-date for ${provider} user:`, user.email);
        return { success: true, data: existingProfile, upToDate: true };
      }
    }
  } catch (error) {
    console.error(`Error in ensureUserProfile for ${provider} user:`, error);
    return { success: false, error };
  }
};

/**
 * Updates user profile with additional information (e.g., from questionnaire)
 */
export const updateUserProfileData = async (userId: string, updates: Partial<UserProfileSyncData>) => {
  try {
    const { data, error } = await updateUserProfile(userId, updates);
    if (error) {
      console.error('Error updating user profile data:', error);
      return { success: false, error };
    }
    return { success: true, data };
  } catch (error) {
    console.error('Error in updateUserProfileData:', error);
    return { success: false, error };
  }
};

/**
 * Gets enriched user profile data combining auth and database information
 */
export const getEnrichedUserProfile = async (user: User) => {
  try {
    const { data: profile, error } = await getUserProfile(user.id);
    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching enriched user profile:', error);
      return { success: false, error };
    }

    // Combine auth user data with database profile data
    const enrichedProfile = {
      // From auth
      id: user.id,
      email: user.email,
      created_at: user.created_at,
      updated_at: user.updated_at,
      // From database profile (if exists)
      first_name: profile?.first_name || user.user_metadata?.first_name,
      last_name: profile?.last_name || user.user_metadata?.last_name,
      full_name: profile?.full_name || user.user_metadata?.full_name,
      phone: profile?.phone || user.user_metadata?.phone,
      date_of_birth: profile?.date_of_birth,
      gender: profile?.gender,
      occupation: profile?.occupation,
      location: profile?.location,
      address: profile?.address,
      education_level: profile?.education_level,
    };

    return { success: true, data: enrichedProfile };
  } catch (error) {
    console.error('Error in getEnrichedUserProfile:', error);
    return { success: false, error };
  }
};
