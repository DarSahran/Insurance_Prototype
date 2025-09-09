import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { useHybridAuth } from './hooks/useHybridAuth';
import { useEffect } from 'react';
import { LoginPage } from './components/Auth/LoginPage';
import SignupPage from './components/Auth/SignupPage';
import LandingPage from './components/LandingPage';
import QuestionnaireWizard from './components/QuestionnaireWizard';
import DashboardLayout from './components/dashboard/DashboardLayout';
import DashboardHome from './pages/dashboard/DashboardHome';
import PoliciesPage from './pages/dashboard/PoliciesPage';
import PolicyDetailsPage from './pages/dashboard/PolicyDetailsPage';
import AssessmentsPage from './pages/dashboard/AssessmentsPage';
import AssessmentDetailsPage from './pages/dashboard/AssessmentDetailsPage';
import NewAssessmentPage from './pages/dashboard/NewAssessmentPage';
import AIInsightsPage from './pages/dashboard/AIInsightsPage';
import RiskDashboardPage from './pages/dashboard/RiskDashboardPage';
import HealthTrackingPage from './pages/dashboard/HealthTrackingPage';
import FinancialPlanningPage from './pages/dashboard/FinancialPlanningPage';
import FamilyManagementPage from './pages/dashboard/FamilyManagementPage';
import DocumentCenterPage from './pages/dashboard/DocumentCenterPage';
import ClaimsPage from './pages/dashboard/ClaimsPage';
import PaymentsPage from './pages/dashboard/PaymentsPage';
import MessagesPage from './pages/dashboard/MessagesPage';
import SettingsPage from './pages/dashboard/SettingsPage';
import HelpCenterPage from './pages/dashboard/HelpCenterPage';

// Authentication wrapper component
const AuthWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { loading } = useHybridAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  return <>{children}</>;
};

// Create wrapper components for auth pages
const LoginWrapper = () => {
  const navigate = useNavigate();
  const { user, loading } = useHybridAuth();

  // If user is already authenticated, redirect to dashboard
  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, loading, navigate]);

  // Show loading while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is authenticated, don't render login page (redirect will happen)
  if (user) {
    return null;
  }

  const handleBack = () => {
    navigate('/');
  };

  const handleSwitchToSignup = () => {
    navigate('/signup');
  };

  const handleForgotPassword = () => {
    // TODO: Implement forgot password functionality
    console.log('Forgot password clicked');
  };

  const handleLoginSuccess = () => {
    navigate('/dashboard');
  };

  return (
    <LoginPage
      onBack={handleBack}
      onSwitchToSignup={handleSwitchToSignup}
      onForgotPassword={handleForgotPassword}
      onLoginSuccess={handleLoginSuccess}
    />
  );
};

// Create wrapper for signup page
const SignupWrapper = () => {
  const { user, loading } = useHybridAuth();
  const navigate = useNavigate();

  // If user is already authenticated, redirect to dashboard
  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, loading, navigate]);

  // Show loading while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is authenticated, don't render signup page (redirect will happen)
  if (user) {
    return null;
  }

  return <SignupPage />;
};

// Create wrapper for questionnaire
const QuestionnaireWrapper = () => {
  const navigate = useNavigate();
  const { user, loading } = useHybridAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login', { replace: true });
    }
  }, [user, loading, navigate]);

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if user is not authenticated (redirect will happen)
  if (!user) {
    return null;
  }

  const handleQuestionnaireComplete = (data: any) => {
    // Save the data if needed, then redirect to dashboard
    console.log('Questionnaire completed:', data);
    // Force navigation to dashboard
    window.location.href = '/dashboard';
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <QuestionnaireWizard 
      onComplete={handleQuestionnaireComplete} 
      onBack={handleBack} 
      initialData={{}} 
    />
  );
};

// Create wrapper for landing page
const LandingPageWrapper = () => {
  const navigate = useNavigate();
  const { user, loading } = useHybridAuth();

  // Only redirect authenticated users to dashboard if they're not in the process of logging out
  useEffect(() => {
    if (!loading && user) {
      // Check if we're coming from a logout action (no redirect if so)
      const isLoggingOut = sessionStorage.getItem('logging_out');
      if (!isLoggingOut) {
        navigate('/dashboard', { replace: true });
      } else {
        // Clear the logout flag
        sessionStorage.removeItem('logging_out');
      }
    }
  }, [user, loading, navigate]);

  // Show loading while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is authenticated and not logging out, don't render landing page (redirect will happen)
  if (user && !sessionStorage.getItem('logging_out')) {
    return null;
  }

  const handleStartAssessment = () => {
    navigate('/questionnaire');
  };

  const handleLoadDemoScenario = (_scenario: any) => {
    // You could store the scenario in localStorage or pass it through state
    navigate('/questionnaire');
  };

  return (
    <LandingPage 
      onStartAssessment={handleStartAssessment} 
      onLoadDemoScenario={handleLoadDemoScenario} 
    />
  );
};

function App() {
  return (
    <AuthWrapper>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <div className="min-h-screen bg-gray-50">
              <LandingPageWrapper />
            </div>
          } />
        <Route path="/login" element={<LoginWrapper />} />
        <Route path="/signup" element={<SignupWrapper />} />
        <Route path="/questionnaire" element={<QuestionnaireWrapper />} />          {/* Dashboard Routes */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="policies" element={<PoliciesPage />} />
            <Route path="policies/:id" element={<PolicyDetailsPage />} />
            <Route path="assessments" element={<AssessmentsPage />} />
            <Route path="assessments/:id" element={<AssessmentDetailsPage />} />
            <Route path="assessment/new" element={<NewAssessmentPage />} />
            <Route path="ai-insights" element={<AIInsightsPage />} />
            <Route path="risk" element={<RiskDashboardPage />} />
            <Route path="health" element={<HealthTrackingPage />} />
            <Route path="financial" element={<FinancialPlanningPage />} />
            <Route path="family" element={<FamilyManagementPage />} />
            <Route path="documents" element={<DocumentCenterPage />} />
            <Route path="claims" element={<ClaimsPage />} />
            <Route path="payments" element={<PaymentsPage />} />
            <Route path="messages" element={<MessagesPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="help" element={<HelpCenterPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthWrapper>
  );
}

export default App;