import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App.tsx';
import './index.css';
import { ErrorBoundary } from './components/ErrorBoundary';
import { EnvSetupGuide } from './components/EnvSetupGuide';
import { validateEnvironment, logEnvironmentStatus } from './config/env';

logEnvironmentStatus();

const validation = validateEnvironment();
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!validation.isValid) {
  console.error('Environment validation failed. Displaying setup guide.');
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <EnvSetupGuide />
    </StrictMode>
  );
} else if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key");
} else {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <ErrorBoundary>
        <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
          <App />
        </ClerkProvider>
      </ErrorBoundary>
    </StrictMode>
  );
}
