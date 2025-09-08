import { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { LoginPage } from './components/Auth/LoginPage';
import SignupPage from './components/Auth/SignupPage';
import LandingPage from './components/LandingPage';
import QuestionnaireWizard from './components/QuestionnaireWizard';
import ResultsDashboard from './components/ResultsDashboard';

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;