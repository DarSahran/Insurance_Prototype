import { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { LoginPage } from './components/Auth/LoginPage';
import SignupPage from './components/Auth/SignupPage';
import LandingPage from './components/LandingPage';
import QuestionnaireWizard from './components/QuestionnaireWizard';
import ResultsDashboard from './components/ResultsDashboard';
import DashboardLayout from './components/dashboard/DashboardLayout';
import DashboardHome from './pages/dashboard/DashboardHome';
import ProfilePage from './pages/dashboard/ProfilePage';
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
import ClaimDetailsPage from './pages/dashboard/ClaimDetailsPage';
import PaymentsPage from './pages/dashboard/PaymentsPage';
import MessagesPage from './pages/dashboard/MessagesPage';
import SettingsPage from './pages/dashboard/SettingsPage';
import HelpCenterPage from './pages/dashboard/HelpCenterPage';
import { useAuth } from './hooks/useAuth';
import DashboardLayout from './components/dashboard/DashboardLayout';
import DashboardHome from './pages/dashboard/DashboardHome';
import ProfilePage from './pages/dashboard/ProfilePage';
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
import ClaimDetailsPage from './pages/dashboard/ClaimDetailsPage';
import PaymentsPage from './pages/dashboard/PaymentsPage';
import MessagesPage from './pages/dashboard/MessagesPage';
import SettingsPage from './pages/dashboard/SettingsPage';
import HelpCenterPage from './pages/dashboard/HelpCenterPage';
import { useAuth } from './hooks/useAuth';
import DashboardLayout from './components/dashboard/DashboardLayout';
import DashboardHome from './pages/dashboard/DashboardHome';
import ProfilePage from './pages/dashboard/ProfilePage';
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
import ClaimDetailsPage from './pages/dashboard/ClaimDetailsPage';
import PaymentsPage from './pages/dashboard/PaymentsPage';
import MessagesPage from './pages/dashboard/MessagesPage';
import SettingsPage from './pages/dashboard/SettingsPage';
import HelpCenterPage from './pages/dashboard/HelpCenterPage';
import { useAuth } from './hooks/useAuth';

// Create wrapper components for auth pages
const LoginWrapper = () => {
  const navigate = useNavigate();

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

  return (
    <LoginPage
      onBack={handleBack}
      onSwitchToSignup={handleSwitchToSignup}
      onForgotPassword={handleForgotPassword}
    />
  );
};

function App() {
  const [currentStep, setCurrentStep] = useState('landing');
  const [userData, setUserData] = useState({});

  const handleStartAssessment = () => {
    setCurrentStep('questionnaire');
  };

  const handleLoadDemoScenario = (scenario: any) => {
    setUserData(scenario);
    setCurrentStep('questionnaire');
  };

  const handleQuestionnaireComplete = (data: any) => {
    setUserData(data);
    setCurrentStep('results');
  };

  const handleBackToHome = () => {
    setCurrentStep('landing');
    setUserData({});
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'landing':
        return <LandingPage onStartAssessment={handleStartAssessment} onLoadDemoScenario={handleLoadDemoScenario} />;
      case 'questionnaire':
        return <QuestionnaireWizard onComplete={handleQuestionnaireComplete} onBack={handleBackToHome} initialData={userData} />;
      case 'results':
        return <ResultsDashboard userData={userData} onBackToHome={handleBackToHome} />;
      default:
        return <LandingPage onStartAssessment={handleStartAssessment} onLoadDemoScenario={handleLoadDemoScenario} />;
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <div className="min-h-screen bg-gray-50">
            {renderCurrentStep()}
          </div>
        } />
        <Route path="/login" element={<LoginWrapper />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/questionnaire" element={
          <QuestionnaireWizard onComplete={handleQuestionnaireComplete} onBack={handleBackToHome} initialData={userData} />
        } />
        
        {/* Dashboard Routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="profile" element={<ProfilePage />} />
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
          <Route path="claims/:id" element={<ClaimDetailsPage />} />
          <Route path="payments" element={<PaymentsPage />} />
          <Route path="messages" element={<MessagesPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="help" element={<HelpCenterPage />} />
        </Route>
        
        {/* Dashboard Routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="profile" element={<ProfilePage />} />
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
          <Route path="claims/:id" element={<ClaimDetailsPage />} />
          <Route path="payments" element={<PaymentsPage />} />
          <Route path="messages" element={<MessagesPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="help" element={<HelpCenterPage />} />
        </Route>
        
        {/* Dashboard Routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="profile" element={<ProfilePage />} />
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
          <Route path="claims/:id" element={<ClaimDetailsPage />} />
          <Route path="payments" element={<PaymentsPage />} />
          <Route path="messages" element={<MessagesPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="help" element={<HelpCenterPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;