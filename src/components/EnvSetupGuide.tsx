import { validateEnvironment, requiredEnvVars } from '../config/env';

export function EnvSetupGuide() {
  const validation = validateEnvironment();

  if (validation.isValid) {
    return null;
  }

  const envVarsList = Object.entries(requiredEnvVars);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold">Environment Setup Required</h1>
              <p className="text-indigo-100 mt-1">Configure your API keys to get started</p>
            </div>
          </div>
        </div>

        <div className="p-8">
          {validation.missing.length > 0 && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div>
                  <h3 className="font-semibold text-red-900 mb-1">Missing Environment Variables</h3>
                  <ul className="text-sm text-red-700 space-y-1">
                    {validation.missing.map((name) => (
                      <li key={name}>• {name}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {validation.invalid.length > 0 && (
            <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div>
                  <h3 className="font-semibold text-yellow-900 mb-1">Invalid Environment Variables</h3>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    {validation.invalid.map((name) => (
                      <li key={name}>• {name}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {validation.warnings.length > 0 && (
            <div className="mb-6 bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div>
                  <h3 className="font-semibold text-orange-900 mb-1">Warnings</h3>
                  <ul className="text-sm text-orange-700 space-y-1">
                    {validation.warnings.map((warning, index) => (
                      <li key={index}>• {warning}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Setup Instructions</h2>
            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 font-semibold text-sm">
                  1
                </div>
                <div className="flex-1">
                  <p className="text-gray-700">
                    Create a <code className="bg-gray-200 px-2 py-1 rounded text-sm font-mono">.env</code> file in the project root directory
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 font-semibold text-sm">
                  2
                </div>
                <div className="flex-1">
                  <p className="text-gray-700 mb-2">Add the following environment variables:</p>
                  <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-sm text-green-400 font-mono">
{envVarsList.map(([key]) => `${key}=your_${key.toLowerCase()}_here`).join('\n')}
                    </pre>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 font-semibold text-sm">
                  3
                </div>
                <div className="flex-1">
                  <p className="text-gray-700">Obtain API keys from the following services:</p>
                  <ul className="mt-2 space-y-2 text-sm text-gray-600">
                    <li>• <strong>Clerk:</strong> <a href="https://dashboard.clerk.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">dashboard.clerk.com</a></li>
                    <li>• <strong>Supabase:</strong> <a href="https://app.supabase.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">app.supabase.com</a></li>
                    <li>• <strong>Google Gemini:</strong> <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">makersuite.google.com/app/apikey</a></li>
                    <li>• <strong>OpenWeather:</strong> <a href="https://openweathermap.org/api" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">openweathermap.org/api</a></li>
                    <li>• <strong>Google Maps:</strong> <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">console.cloud.google.com/apis/credentials</a></li>
                    <li>• <strong>Google Cloud Vision:</strong> <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">console.cloud.google.com/apis/credentials</a></li>
                    <li>• <strong>Stripe:</strong> <a href="https://dashboard.stripe.com/apikeys" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">dashboard.stripe.com/apikeys</a></li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 font-semibold text-sm">
                  4
                </div>
                <div className="flex-1">
                  <p className="text-gray-700">Restart the development server</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">Important:</p>
                <p>Never commit your <code className="bg-blue-100 px-1.5 py-0.5 rounded font-mono">.env</code> file to version control. It should be listed in <code className="bg-blue-100 px-1.5 py-0.5 rounded font-mono">.gitignore</code></p>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => window.location.reload()}
              className="bg-indigo-600 text-white py-3 px-8 rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-lg hover:shadow-xl"
            >
              Reload After Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
