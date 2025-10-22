import { BrowserRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { useHybridAuth } from './hooks/useHybridAuth';
import { useEffect } from 'react';
import { LoginPage } from './components/Auth/LoginPage';
import SignupPage from './components/Auth/SignupPage';
import LandingPage from './components/LandingPage';
import DashboardLayout from './components/dashboard/DashboardLayout';
import DashboardHome from './pages/dashboard/DashboardHome';
import ProfilePage from './pages/dashboard/ProfilePage';
import PoliciesPage from './pages/dashboard/PoliciesPage';
import PolicyDetailsPage from './pages/dashboard/PolicyDetailsPage';
import AssessmentsPage from './pages/dashboard/AssessmentsPage';
import AssessmentDetailsPage from './pages/dashboard/AssessmentDetailsPage';
import NewAssessmentPage from './pages/dashboard/NewAssessmentPage';
import AIInsuranceRecommendationsPage from './pages/dashboard/AIInsuranceRecommendationsPage';
import RiskDashboardPage from './pages/dashboard/RiskDashboardPage';
import HealthTrackingPage from './pages/dashboard/HealthTrackingPage';
import FinancialPlanningPage from './pages/dashboard/FinancialPlanningPage';
import FamilyManagementPage from './pages/dashboard/FamilyManagementPage';
import DocumentCenterPage from './pages/dashboard/DocumentCenterPage';
import ClaimsPage from './pages/dashboard/ClaimsPage';
import PaymentsPage from './pages/dashboard/PaymentsPage';
import HelpCenterPage from './pages/dashboard/HelpCenterPage';
import { useAuth } from './hooks/useAuth';
import ClaimDetailsPage from './pages/dashboard/ClaimDetailsPage';
import TerminologyGlossaryPage from './pages/dashboard/TerminologyGlossaryPage';
import ProviderNetworkPage from './pages/dashboard/ProviderNetworkPage';
import PolicyBrowsePage from './pages/PolicyBrowsePage';
import PolicyDetailsPagePublic from './pages/PolicyDetailsPage';
import QuickBuyPage from './pages/QuickBuyPage';
import CheckoutPage from './pages/CheckoutPage';
import PurchaseSuccessPage from './pages/PurchaseSuccessPage';

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
    navigate('/browse-policies');
  };

  const handleLoadDemoScenario = (_scenario: any) => {
    navigate('/browse-policies');
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

          {/* Public Policy Marketplace Routes */}
          <Route path="/browse-policies" element={<PolicyBrowsePage />} />
          <Route path="/policy/:policyId" element={<PolicyDetailsPagePublic />} />
          <Route path="/policy/:policyId/buy" element={<QuickBuyPage />} />
          <Route path="/checkout/:policyId" element={<CheckoutPage />} />
          <Route path="/purchase-success/:policyId" element={<PurchaseSuccessPage />} />

          {/* Dashboard Routes */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="policies" element={<PoliciesPage />} />
            <Route path="policies/:id" element={<PolicyDetailsPage />} />
            <Route path="assessments" element={<AssessmentsPage />} />
            <Route path="assessments/:id" element={<AssessmentDetailsPage />} />
            <Route path="assessment/new" element={<NewAssessmentPage />} />
            <Route path="ai-recommendations" element={<AIInsuranceRecommendationsPage />} />
            <Route path="risk" element={<RiskDashboardPage />} />
            <Route path="health" element={<HealthTrackingPage />} />
            <Route path="financial" element={<FinancialPlanningPage />} />
            <Route path="family" element={<FamilyManagementPage />} />
            <Route path="documents" element={<DocumentCenterPage />} />
            <Route path="claims" element={<ClaimsPage />} />
            <Route path="claims/:id" element={<ClaimDetailsPage />} />
            <Route path="payments" element={<PaymentsPage />} />
            <Route path="help" element={<HelpCenterPage />} />
            <Route path="glossary" element={<TerminologyGlossaryPage />} />
            <Route path="providers" element={<ProviderNetworkPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthWrapper>
  );
}

export default App;