import { supabase } from './supabase';

export interface HealthcareProvider {
  id: string;
  name: string;
  qualification: string;
  specialty: string;
  sub_specialties: string[];
  registration_number: string | null;
  hospital_affiliation: string | null;
  clinic_name: string | null;
  address: string;
  city: string;
  state: string;
  pincode: string | null;
  phone: string;
  email: string | null;
  website: string | null;
  consultation_fee: number | null;
  experience_years: number;
  rating: number;
  total_reviews: number;
  languages: string[];
  accepting_new_patients: boolean;
  telemedicine_available: boolean;
  emergency_services: boolean;
  insurance_accepted: boolean;
  available_days: string[];
  available_hours: string | null;
  latitude: number | null;
  longitude: number | null;
  verified: boolean;
  verification_date: string | null;
  profile_image_url: string | null;
  awards: any[];
  education: any[];
  created_at: string;
  updated_at: string;
}

export interface ProviderReview {
  id: string;
  provider_id: string;
  user_id: string;
  rating: number;
  review_text: string | null;
  visit_date: string | null;
  created_at: string;
}

export interface ProviderFilters {
  specialty?: string;
  city?: string;
  state?: string;
  accepting_new_patients?: boolean;
  telemedicine_available?: boolean;
  insurance_accepted?: boolean;
  min_rating?: number;
  search_query?: string;
}

export async function getProviders(filters?: ProviderFilters): Promise<HealthcareProvider[]> {
  let query = supabase
    .from('healthcare_providers')
    .select('*')
    .eq('verified', true)
    .order('rating', { ascending: false });

  if (filters?.specialty && filters.specialty !== 'All Specialties') {
    query = query.eq('specialty', filters.specialty);
  }

  if (filters?.city) {
    query = query.eq('city', filters.city);
  }

  if (filters?.state) {
    query = query.eq('state', filters.state);
  }

  if (filters?.accepting_new_patients !== undefined) {
    query = query.eq('accepting_new_patients', filters.accepting_new_patients);
  }

  if (filters?.telemedicine_available !== undefined) {
    query = query.eq('telemedicine_available', filters.telemedicine_available);
  }

  if (filters?.insurance_accepted !== undefined) {
    query = query.eq('insurance_accepted', filters.insurance_accepted);
  }

  if (filters?.min_rating) {
    query = query.gte('rating', filters.min_rating);
  }

  if (filters?.search_query) {
    query = query.or(
      `name.ilike.%${filters.search_query}%,specialty.ilike.%${filters.search_query}%,city.ilike.%${filters.search_query}%`
    );
  }

  const { data, error } = await query;

  if (error) throw error;
  return data || [];
}

export async function getProviderById(id: string): Promise<HealthcareProvider | null> {
  const { data, error } = await supabase
    .from('healthcare_providers')
    .select('*')
    .eq('id', id)
    .eq('verified', true)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getProviderReviews(providerId: string): Promise<ProviderReview[]> {
  const { data, error } = await supabase
    .from('provider_reviews')
    .select('*')
    .eq('provider_id', providerId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function addProviderReview(
  providerId: string,
  userId: string,
  rating: number,
  reviewText?: string,
  visitDate?: string
): Promise<ProviderReview> {
  const { data, error } = await supabase
    .from('provider_reviews')
    .insert([
      {
        provider_id: providerId,
        user_id: userId,
        rating,
        review_text: reviewText,
        visit_date: visitDate
      }
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateProviderReview(
  reviewId: string,
  rating: number,
  reviewText?: string
): Promise<ProviderReview> {
  const { data, error } = await supabase
    .from('provider_reviews')
    .update({
      rating,
      review_text: reviewText
    })
    .eq('id', reviewId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteProviderReview(reviewId: string): Promise<void> {
  const { error } = await supabase
    .from('provider_reviews')
    .delete()
    .eq('id', reviewId);

  if (error) throw error;
}

export async function getUniqueSpecialties(): Promise<string[]> {
  const { data, error } = await supabase
    .from('healthcare_providers')
    .select('specialty')
    .eq('verified', true);

  if (error) throw error;

  const specialties = [...new Set(data?.map(p => p.specialty) || [])];
  return specialties.sort();
}

export async function getUniqueCities(): Promise<string[]> {
  const { data, error } = await supabase
    .from('healthcare_providers')
    .select('city')
    .eq('verified', true);

  if (error) throw error;

  const cities = [...new Set(data?.map(p => p.city) || [])];
  return cities.sort();
}

export async function getUniqueStates(): Promise<string[]> {
  const { data, error } = await supabase
    .from('healthcare_providers')
    .select('state')
    .eq('verified', true);

  if (error) throw error;

  const states = [...new Set(data?.map(p => p.state) || [])];
  return states.sort();
}
