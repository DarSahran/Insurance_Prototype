import axios from 'axios';
import { supabase } from './supabase';

const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const WEATHER_API_BASE_URL = 'https://api.openweathermap.org/data/2.5';

export interface WeatherData {
  temperature: number;
  humidity: number;
  weather_condition: string;
  wind_speed: number;
  precipitation: number;
  severe_weather_alerts: any[];
  air_quality_index: number | null;
  uv_index: number | null;
}

export interface SevereWeatherAlert {
  event: string;
  severity: 'minor' | 'moderate' | 'severe' | 'extreme';
  description: string;
  start: string;
  end: string;
}

export class WeatherService {
  static async getCurrentWeather(latitude: number, longitude: number): Promise<WeatherData | null> {
    if (!OPENWEATHER_API_KEY || OPENWEATHER_API_KEY === 'YOUR_OPENWEATHER_API_KEY_HERE') {
      console.warn('Weather API key not configured, using mock data');
      return this.getMockWeather();
    }

    try {
      const response = await axios.get(`${WEATHER_API_BASE_URL}/weather`, {
        params: {
          lat: latitude,
          lon: longitude,
          appid: OPENWEATHER_API_KEY,
          units: 'metric'
        }
      });

      const uvResponse = await axios.get(`${WEATHER_API_BASE_URL}/uvi`, {
        params: {
          lat: latitude,
          lon: longitude,
          appid: OPENWEATHER_API_KEY
        }
      });

      return {
        temperature: response.data.main.temp,
        humidity: response.data.main.humidity,
        weather_condition: response.data.weather[0].description,
        wind_speed: response.data.wind.speed * 3.6,
        precipitation: response.data.rain?.['1h'] || 0,
        severe_weather_alerts: [],
        air_quality_index: null,
        uv_index: uvResponse.data.value
      };
    } catch (error) {
      console.error('Weather API error:', error);
      return this.getMockWeather();
    }
  }

  static async getSevereWeatherAlerts(latitude: number, longitude: number): Promise<SevereWeatherAlert[]> {
    if (!OPENWEATHER_API_KEY || OPENWEATHER_API_KEY === 'YOUR_OPENWEATHER_API_KEY_HERE') {
      return [];
    }

    try {
      const response = await axios.get(`${WEATHER_API_BASE_URL}/onecall`, {
        params: {
          lat: latitude,
          lon: longitude,
          appid: OPENWEATHER_API_KEY,
          exclude: 'minutely,hourly,daily'
        }
      });

      return (response.data.alerts || []).map((alert: any) => ({
        event: alert.event,
        severity: this.classifyAlertSeverity(alert.event),
        description: alert.description,
        start: alert.start,
        end: alert.end
      }));
    } catch (error) {
      console.error('Weather alerts error:', error);
      return [];
    }
  }

  static async storeWeatherData(locationId: string, userId: string, weatherData: WeatherData): Promise<void> {
    try {
      await supabase.from('weather_data').insert({
        location_id: locationId,
        user_id: userId,
        temperature: weatherData.temperature,
        humidity: weatherData.humidity,
        weather_condition: weatherData.weather_condition,
        wind_speed: weatherData.wind_speed,
        precipitation: weatherData.precipitation,
        severe_weather_alerts: weatherData.severe_weather_alerts,
        air_quality_index: weatherData.air_quality_index,
        uv_index: weatherData.uv_index,
        recorded_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error storing weather data:', error);
    }
  }

  static async getLatestWeatherForLocation(locationId: string): Promise<WeatherData | null> {
    try {
      const { data, error } = await supabase
        .from('weather_data')
        .select('*')
        .eq('location_id', locationId)
        .order('recorded_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error || !data) return null;

      return {
        temperature: data.temperature,
        humidity: data.humidity,
        weather_condition: data.weather_condition,
        wind_speed: data.wind_speed,
        precipitation: data.precipitation,
        severe_weather_alerts: data.severe_weather_alerts,
        air_quality_index: data.air_quality_index,
        uv_index: data.uv_index
      };
    } catch (error) {
      console.error('Error fetching weather data:', error);
      return null;
    }
  }

  static calculateWeatherRiskScore(weatherData: WeatherData, alerts: SevereWeatherAlert[]): number {
    let riskScore = 0;

    if (alerts.some(a => a.severity === 'extreme')) riskScore += 40;
    else if (alerts.some(a => a.severity === 'severe')) riskScore += 30;
    else if (alerts.some(a => a.severity === 'moderate')) riskScore += 20;

    if (weatherData.temperature < -10 || weatherData.temperature > 40) riskScore += 15;
    if (weatherData.wind_speed > 60) riskScore += 10;
    if (weatherData.precipitation > 50) riskScore += 10;
    if (weatherData.uv_index && weatherData.uv_index > 8) riskScore += 5;

    return Math.min(riskScore, 100);
  }

  private static classifyAlertSeverity(eventType: string): 'minor' | 'moderate' | 'severe' | 'extreme' {
    const extremeEvents = ['hurricane', 'tornado', 'tsunami', 'earthquake'];
    const severeEvents = ['flood', 'wildfire', 'blizzard', 'ice storm'];
    const moderateEvents = ['thunderstorm', 'heavy rain', 'high wind', 'heat wave'];

    const lowerEvent = eventType.toLowerCase();

    if (extremeEvents.some(e => lowerEvent.includes(e))) return 'extreme';
    if (severeEvents.some(e => lowerEvent.includes(e))) return 'severe';
    if (moderateEvents.some(e => lowerEvent.includes(e))) return 'moderate';
    return 'minor';
  }

  private static getMockWeather(): WeatherData {
    return {
      temperature: 22,
      humidity: 65,
      weather_condition: 'partly cloudy',
      wind_speed: 15,
      precipitation: 0,
      severe_weather_alerts: [],
      air_quality_index: 45,
      uv_index: 5
    };
  }
}
