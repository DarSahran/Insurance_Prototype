import React from 'react';
import { AlertTriangle, RefreshCw, ExternalLink } from 'lucide-react';

interface SupabaseErrorBoundaryProps {
  children: React.ReactNode;
}

interface SupabaseErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class SupabaseErrorBoundary extends React.Component<
  SupabaseErrorBoundaryProps,
  SupabaseErrorBoundaryState
> {
  constructor(props: SupabaseErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Supabase Error Boundary caught an error:', error, errorInfo);
  }

  handleRefresh = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const isSupabaseError =
        this.state.error?.message?.includes('supabase') ||
        this.state.error?.message?.includes('fetch') ||
        this.state.error?.message?.includes('NetworkError');

      if (isSupabaseError) {
        return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg border border-red-200 p-8">
              <div className="flex items-start space-x-4 mb-6">
                <div className="p-3 bg-red-100 rounded-lg">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Database Connection Error
                  </h1>
                  <p className="text-gray-700 mb-4">
                    We're having trouble connecting to the Supabase database. This could be due to:
                  </p>
                  <ul className="space-y-2 mb-6 text-sm text-gray-700">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Your Supabase project may be paused (free tier projects pause after inactivity)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Network connectivity issues</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Incorrect Supabase credentials in your .env file</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>CORS configuration issues in Supabase</span>
                    </li>
                  </ul>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <h3 className="font-semibold text-blue-900 mb-2">To fix this:</h3>
                    <ol className="space-y-2 text-sm text-blue-900">
                      <li className="flex items-start">
                        <span className="mr-2 font-bold">1.</span>
                        <span>Go to your <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-700">Supabase Dashboard</a></span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2 font-bold">2.</span>
                        <span>Check if your project is paused and click "Resume" if needed</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2 font-bold">3.</span>
                        <span>Verify your project URL and anon key in the .env file</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2 font-bold">4.</span>
                        <span>Check that RLS policies are properly configured</span>
                      </li>
                    </ol>
                  </div>

                  <div className="flex items-center space-x-4">
                    <button
                      onClick={this.handleRefresh}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
                    >
                      <RefreshCw className="w-5 h-5" />
                      <span>Retry Connection</span>
                    </button>
                    <a
                      href="https://supabase.com/dashboard"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors inline-flex items-center space-x-2"
                    >
                      <ExternalLink className="w-5 h-5" />
                      <span>Open Supabase</span>
                    </a>
                  </div>
                </div>
              </div>

              {this.state.error && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <details className="text-sm">
                    <summary className="cursor-pointer text-gray-600 hover:text-gray-900 font-medium">
                      Technical Details
                    </summary>
                    <pre className="mt-2 p-4 bg-gray-100 rounded-lg overflow-x-auto text-xs text-gray-800">
                      {this.state.error.message}
                    </pre>
                  </details>
                </div>
              )}
            </div>
          </div>
        );
      }
    }

    return this.props.children;
  }
}

export default SupabaseErrorBoundary;
