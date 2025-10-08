import { supabase } from './supabase';
import { GeolocationService } from './geolocationService';
import { WeatherService } from './weatherService';

export interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  full_name: string | null;
  phone: string | null;
  date_of_birth: string | null;
  gender: string | null;
  address: any | null;
  occupation: string | null;
  education_level: string | null;
  location: string | null;
  created_at: string;
  updated_at: string;
}

export interface ComprehensiveUserData {
  profile: UserProfile | null;
  questionnaires: any[];
  policies: any[];
  claims: any[];
  payments: any[];
  healthTracking: any[];
  location: any | null;
  weather: any | null;
  documents: any[];
  insights: any[];
}

export class UserDataService {
  static async getComprehensiveUserData(userId: string): Promise<ComprehensiveUserData> {
    const [
      profile,
      questionnaires,
      policies,
      claims,
      payments,
      healthTracking,
      location,
      documents,
      insights
    ] = await Promise.all([
      this.getUserProfile(userId),
      this.getUserQuestionnaires(userId),
      this.getUserPolicies(userId),
      this.getUserClaims(userId),
      this.getUserPayments(userId),
      this.getUserHealthTracking(userId),
      this.getUserLocation(userId),
      this.getUserDocuments(userId),
      this.getUserInsights(userId)
    ]);

    let weather = null;
    if (location) {
      weather = await this.getUserWeather(location.id);
    }

    return {
      profile,
      questionnaires,
      policies,
      claims,
      payments,
      healthTracking,
      location,
      weather,
      documents,
      insights
    };
  }

  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }

    return data;
  }

  static async createOrUpdateProfile(userId: string, email: string, profileData: Partial<UserProfile>): Promise<UserProfile | null> {
    const existingProfile = await this.getUserProfile(userId);

    if (existingProfile) {
      const { data, error } = await supabase
        .from('user_profiles')
        .update({
          ...profileData,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        console.error('Error updating profile:', error);
        return null;
      }

      return data;
    } else {
      const { data, error } = await supabase
        .from('user_profiles')
        .insert({
          user_id: userId,
          email,
          ...profileData
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating profile:', error);
        return null;
      }

      return data;
    }
  }

  static async getUserQuestionnaires(userId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('insurance_questionnaires')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching questionnaires:', error);
      return [];
    }

    return data || [];
  }

  static async getUserPolicies(userId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('policies')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching policies:', error);
      return [];
    }

    return data || [];
  }

  static async getUserClaims(userId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('claims')
      .select('*, policies(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false});

    if (error) {
      console.error('Error fetching claims:', error);
      return [];
    }

    return data || [];
  }

  static async getUserPayments(userId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('payments')
      .select('*, policies(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching payments:', error);
      return [];
    }

    return data || [];
  }

  static async getUserHealthTracking(userId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('health_tracking')
      .select('*')
      .eq('user_id', userId)
      .order('tracking_date', { ascending: false })
      .limit(30);

    if (error) {
      console.error('Error fetching health tracking:', error);
      return [];
    }

    return data || [];
  }

  static async getUserLocation(userId: string): Promise<any | null> {
    const { data, error } = await supabase
      .from('user_locations')
      .select('*')
      .eq('user_id', userId)
      .eq('is_primary', true)
      .maybeSingle();

    if (error) {
      console.error('Error fetching user location:', error);
      return null;
    }

    return data;
  }

  static async getUserWeather(locationId: string): Promise<any | null> {
    const { data, error } = await supabase
      .from('weather_data')
      .select('*')
      .eq('location_id', locationId)
      .order('recorded_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Error fetching weather:', error);
      return null;
    }

    return data;
  }

  static async getUserDocuments(userId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('ocr_documents')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching documents:', error);
      return [];
    }

    return data || [];
  }

  static async getUserInsights(userId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('predictive_insights')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching insights:', error);
      return [];
    }

    return data || [];
  }

  static async initializeUserLocation(userId: string): Promise<void> {
    const existingLocation = await this.getUserLocation(userId);
    if (existingLocation) return;

    const position = await GeolocationService.getCurrentPosition();

    if (position) {
      const { latitude, longitude, accuracy } = position.coords;
      const addressData = await GeolocationService.reverseGeocode(latitude, longitude);

      if (addressData) {
        const locationId = await GeolocationService.saveUserLocation(
          userId,
          {
            latitude,
            longitude,
            city: addressData.city,
            state: addressData.state,
            country: addressData.country,
            postal_code: addressData.postal_code,
            address_formatted: addressData.formatted_address,
            accuracy_meters: accuracy
          },
          'gps'
        );

        if (locationId) {
          const weatherData = await WeatherService.getCurrentWeather(latitude, longitude);
          if (weatherData) {
            await WeatherService.storeWeatherData(locationId, userId, weatherData);
          }
        }
      }
    } else {
      const ipLocation = await GeolocationService.getIPBasedLocation();
      if (ipLocation) {
        await GeolocationService.saveUserLocation(userId, ipLocation, 'ip-based');
      }
    }
  }

  static async refreshUserWeather(userId: string): Promise<void> {
    const location = await this.getUserLocation(userId);
    if (!location) return;

    const weatherData = await WeatherService.getCurrentWeather(
      location.latitude,
      location.longitude
    );

    if (weatherData) {
      await WeatherService.storeWeatherData(location.id, userId, weatherData);
    }
  }

  static async getLatestQuestionnaire(userId: string): Promise<any | null> {
    const questionnaires = await this.getUserQuestionnaires(userId);
    return questionnaires[0] || null;
  }

  static async hasCompletedQuestionnaire(userId: string): Promise<boolean> {
    const questionnaires = await this.getUserQuestionnaires(userId);
    return questionnaires.some(q => q.status === 'completed');
  }

  static async getUserStats(userId: string): Promise<any> {
    const data = await this.getComprehensiveUserData(userId);

    return {
      totalPolicies: data.policies.length,
      activePolicies: data.policies.filter(p => p.status === 'active').length,
      totalClaims: data.claims.length,
      pendingClaims: data.claims.filter(c => c.status === 'pending').length,
      totalCoverage: data.policies.reduce((sum, p) => sum + (p.coverage_amount || 0), 0),
      monthlyPremium: data.policies
        .filter(p => p.status === 'active')
        .reduce((sum, p) => sum + (p.premium_frequency === 'monthly' ? p.premium_amount : p.premium_amount / 12), 0),
      hasQuestionnaire: data.questionnaires.length > 0,
      hasLocation: data.location !== null,
      healthTrackingDays: data.healthTracking.length,
      documentCount: data.documents.length,
      activeInsights: data.insights.length
    };
  }

  static async deleteUserData(userId: string): Promise<boolean> {
    try {
      await Promise.all([
        supabase.from('user_profiles').delete().eq('user_id', userId),
        supabase.from('insurance_questionnaires').delete().eq('user_id', userId),
        supabase.from('policies').delete().eq('user_id', userId),
        supabase.from('claims').delete().eq('user_id', userId),
        supabase.from('payments').delete().eq('user_id', userId),
        supabase.from('health_tracking').delete().eq('user_id', userId),
        supabase.from('user_locations').delete().eq('user_id', userId),
        supabase.from('ocr_documents').delete().eq('user_id', userId),
        supabase.from('predictive_insights').delete().eq('user_id', userId)
      ]);

      return true;
    } catch (error) {
      console.error('Error deleting user data:', error);
      return false;
    }
  }
}
