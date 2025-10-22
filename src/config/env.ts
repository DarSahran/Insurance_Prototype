interface EnvConfig {
  clerk: {
    publishableKey: string;
  };
  supabase: {
    url: string;
    anonKey: string;
  };
  apis: {
    gemini: string;
    openWeather: string;
    googleMaps: string;
    googleCloudVision: string;
    stripePublishable: string;
  };
}

interface EnvValidation {
  isValid: boolean;
  missing: string[];
  invalid: string[];
  warnings: string[];
}

const requiredEnvVars = {
  VITE_CLERK_PUBLISHABLE_KEY: 'Clerk Publishable Key',
  VITE_SUPABASE_URL: 'Supabase URL',
  VITE_SUPABASE_ANON_KEY: 'Supabase Anonymous Key',
  VITE_GEMINI_API_KEY: 'Google Gemini API Key',
  VITE_OPENWEATHER_API_KEY: 'OpenWeather API Key',
  VITE_GOOGLE_MAPS_API_KEY: 'Google Maps API Key',
  VITE_GOOGLE_CLOUD_VISION_API_KEY: 'Google Cloud Vision API Key',
  VITE_STRIPE_PUBLISHABLE_KEY: 'Stripe Publishable Key',
} as const;

export function validateEnvironment(): EnvValidation {
  const missing: string[] = [];
  const invalid: string[] = [];
  const warnings: string[] = [];

  Object.entries(requiredEnvVars).forEach(([key, name]) => {
    const value = import.meta.env[key];

    if (!value) {
      missing.push(name);
      return;
    }

    if (value.includes('placeholder') || value.includes('YOUR_')) {
      invalid.push(name);
    }

    if (value.length < 10) {
      warnings.push(`${name} seems too short - might be invalid`);
    }
  });

  const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  if (clerkKey && !clerkKey.startsWith('pk_')) {
    invalid.push('Clerk Publishable Key (should start with pk_)');
  }

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  if (supabaseUrl && !supabaseUrl.includes('supabase.co')) {
    warnings.push('Supabase URL format might be incorrect');
  }

  return {
    isValid: missing.length === 0 && invalid.length === 0,
    missing,
    invalid,
    warnings,
  };
}

export function getEnvConfig(): EnvConfig {
  return {
    clerk: {
      publishableKey: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || '',
    },
    supabase: {
      url: import.meta.env.VITE_SUPABASE_URL || '',
      anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
    },
    apis: {
      gemini: import.meta.env.VITE_GEMINI_API_KEY || '',
      openWeather: import.meta.env.VITE_OPENWEATHER_API_KEY || '',
      googleMaps: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
      googleCloudVision: import.meta.env.VITE_GOOGLE_CLOUD_VISION_API_KEY || '',
      stripePublishable: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '',
    },
  };
}

export function logEnvironmentStatus(): void {
  console.group('🔧 Environment Configuration Status');

  const validation = validateEnvironment();
  const config = getEnvConfig();

  if (validation.isValid) {
    console.log('✅ All environment variables are configured');
  } else {
    console.error('❌ Environment configuration issues detected');
  }

  if (validation.missing.length > 0) {
    console.error('Missing variables:', validation.missing);
  }

  if (validation.invalid.length > 0) {
    console.error('Invalid variables:', validation.invalid);
  }

  if (validation.warnings.length > 0) {
    console.warn('Warnings:', validation.warnings);
  }

  console.log('Clerk:', config.clerk.publishableKey ? '✓ Configured' : '✗ Missing');
  console.log('Supabase:', config.supabase.url && config.supabase.anonKey ? '✓ Configured' : '✗ Missing');
  console.log('Gemini AI:', config.apis.gemini ? '✓ Configured' : '✗ Missing');
  console.log('OpenWeather:', config.apis.openWeather ? '✓ Configured' : '✗ Missing');
  console.log('Google Maps:', config.apis.googleMaps ? '✓ Configured' : '✗ Missing');
  console.log('Cloud Vision:', config.apis.googleCloudVision ? '✓ Configured' : '✗ Missing');
  console.log('Stripe:', config.apis.stripePublishable ? '✓ Configured' : '✗ Missing');

  console.groupEnd();
}

export { requiredEnvVars };
