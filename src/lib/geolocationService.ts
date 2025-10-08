import axios from 'axios';
import { supabase } from './supabase';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const GEOCODING_API_URL = 'https://maps.googleapis.com/maps/api/geocode/json';

export interface LocationData {
  latitude: number;
  longitude: number;
  city: string | null;
  state: string | null;
  country: string | null;
  postal_code: string | null;
  address_formatted: string | null;
  accuracy_meters: number | null;
}

export interface AddressComponents {
  city: string | null;
  state: string | null;
  country: string | null;
  postal_code: string | null;
  street: string | null;
  formatted_address: string;
}

export class GeolocationService {
  static async getCurrentPosition(): Promise<GeolocationPosition | null> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        console.warn('Geolocation not supported');
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => resolve(position),
        (error) => {
          console.error('Geolocation error:', error);
          resolve(null);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    });
  }

  static async reverseGeocode(latitude: number, longitude: number): Promise<AddressComponents | null> {
    const cachedResult = await this.getCachedGeocode(latitude, longitude);
    if (cachedResult) {
      await this.incrementCacheHit(latitude, longitude);
      return cachedResult;
    }

    if (!GOOGLE_MAPS_API_KEY || GOOGLE_MAPS_API_KEY === 'YOUR_GOOGLE_MAPS_API_KEY_HERE') {
      console.warn('Google Maps API key not configured, using mock data');
      return this.getMockAddress(latitude, longitude);
    }

    try {
      const response = await axios.get(GEOCODING_API_URL, {
        params: {
          latlng: `${latitude},${longitude}`,
          key: GOOGLE_MAPS_API_KEY
        }
      });

      if (response.data.status !== 'OK' || !response.data.results[0]) {
        return null;
      }

      const result = response.data.results[0];
      const components = this.parseAddressComponents(result.address_components);

      const addressData = {
        city: components.city,
        state: components.state,
        country: components.country,
        postal_code: components.postal_code,
        street: components.street,
        formatted_address: result.formatted_address
      };

      await this.cacheGeocode(latitude, longitude, result.address_components, result.formatted_address, result.place_id);

      return addressData;
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return this.getMockAddress(latitude, longitude);
    }
  }

  static async forwardGeocode(address: string): Promise<LocationData | null> {
    if (!GOOGLE_MAPS_API_KEY || GOOGLE_MAPS_API_KEY === 'YOUR_GOOGLE_MAPS_API_KEY_HERE') {
      console.warn('Google Maps API key not configured');
      return null;
    }

    try {
      const response = await axios.get(GEOCODING_API_URL, {
        params: {
          address: address,
          key: GOOGLE_MAPS_API_KEY
        }
      });

      if (response.data.status !== 'OK' || !response.data.results[0]) {
        return null;
      }

      const result = response.data.results[0];
      const location = result.geometry.location;
      const components = this.parseAddressComponents(result.address_components);

      return {
        latitude: location.lat,
        longitude: location.lng,
        city: components.city,
        state: components.state,
        country: components.country,
        postal_code: components.postal_code,
        address_formatted: result.formatted_address,
        accuracy_meters: null
      };
    } catch (error) {
      console.error('Forward geocoding error:', error);
      return null;
    }
  }

  static async saveUserLocation(userId: string, locationData: LocationData, locationType: 'gps' | 'manual' | 'ip-based' = 'manual'): Promise<string | null> {
    try {
      await supabase
        .from('user_locations')
        .update({ is_primary: false })
        .eq('user_id', userId);

      const { data, error } = await supabase
        .from('user_locations')
        .insert({
          user_id: userId,
          latitude: locationData.latitude,
          longitude: locationData.longitude,
          city: locationData.city,
          state: locationData.state,
          country: locationData.country,
          postal_code: locationData.postal_code,
          address_formatted: locationData.address_formatted,
          location_type: locationType,
          accuracy_meters: locationData.accuracy_meters,
          is_primary: true
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving location:', error);
        return null;
      }

      return data.id;
    } catch (error) {
      console.error('Error saving user location:', error);
      return null;
    }
  }

  static async getPrimaryLocation(userId: string): Promise<LocationData | null> {
    try {
      const { data, error } = await supabase
        .from('user_locations')
        .select('*')
        .eq('user_id', userId)
        .eq('is_primary', true)
        .maybeSingle();

      if (error || !data) return null;

      return {
        latitude: data.latitude,
        longitude: data.longitude,
        city: data.city,
        state: data.state,
        country: data.country,
        postal_code: data.postal_code,
        address_formatted: data.address_formatted,
        accuracy_meters: data.accuracy_meters
      };
    } catch (error) {
      console.error('Error fetching primary location:', error);
      return null;
    }
  }

  static async getIPBasedLocation(): Promise<LocationData | null> {
    try {
      const response = await axios.get('https://ipapi.co/json/');
      return {
        latitude: response.data.latitude,
        longitude: response.data.longitude,
        city: response.data.city,
        state: response.data.region,
        country: response.data.country_name,
        postal_code: response.data.postal,
        address_formatted: `${response.data.city}, ${response.data.region}, ${response.data.country_name}`,
        accuracy_meters: 10000
      };
    } catch (error) {
      console.error('IP geolocation error:', error);
      return null;
    }
  }

  private static async getCachedGeocode(latitude: number, longitude: number): Promise<AddressComponents | null> {
    try {
      const { data, error } = await supabase
        .from('geolocation_cache')
        .select('*')
        .eq('latitude', latitude)
        .eq('longitude', longitude)
        .gt('expires_at', new Date().toISOString())
        .maybeSingle();

      if (error || !data) return null;

      const components = this.parseAddressComponents(data.address_components);
      return {
        city: components.city,
        state: components.state,
        country: components.country,
        postal_code: components.postal_code,
        street: components.street,
        formatted_address: data.formatted_address
      };
    } catch (error) {
      console.error('Error fetching cached geocode:', error);
      return null;
    }
  }

  private static async cacheGeocode(latitude: number, longitude: number, addressComponents: any, formattedAddress: string, placeId: string): Promise<void> {
    try {
      await supabase.from('geolocation_cache').upsert({
        latitude,
        longitude,
        address_components: addressComponents,
        formatted_address: formattedAddress,
        place_id: placeId,
        cache_hits: 0,
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      });
    } catch (error) {
      console.error('Error caching geocode:', error);
    }
  }

  private static async incrementCacheHit(latitude: number, longitude: number): Promise<void> {
    try {
      await supabase.rpc('increment_cache_hits', { lat: latitude, lng: longitude });
    } catch (error) {
      console.error('Error incrementing cache hits:', error);
    }
  }

  private static parseAddressComponents(components: any[]): { city: string | null; state: string | null; country: string | null; postal_code: string | null; street: string | null } {
    let city = null;
    let state = null;
    let country = null;
    let postal_code = null;
    let street = null;

    for (const component of components) {
      if (component.types.includes('locality')) {
        city = component.long_name;
      } else if (component.types.includes('administrative_area_level_1')) {
        state = component.long_name;
      } else if (component.types.includes('country')) {
        country = component.long_name;
      } else if (component.types.includes('postal_code')) {
        postal_code = component.long_name;
      } else if (component.types.includes('route')) {
        street = component.long_name;
      }
    }

    return { city, state, country, postal_code, street };
  }

  private static getMockAddress(latitude: number, longitude: number): AddressComponents {
    return {
      city: 'San Francisco',
      state: 'California',
      country: 'United States',
      postal_code: '94102',
      street: null,
      formatted_address: `San Francisco, CA 94102, USA`
    };
  }

  static calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private static deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}
