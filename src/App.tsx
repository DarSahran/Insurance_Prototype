import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LoginPage } from './components/Auth/LoginPage';
import { SignupPage } from './components/Auth/SignupPage';
import LandingPage from './components/LandingPage';
import QuestionnaireWizard from './components/QuestionnaireWizard';
import ResultsDashboard from './components/ResultsDashboard';

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
        <Route path="/login" element={
          <LoginPage
            onBack={() => window.history.back()}
            onSwitchToSignup={() => {}}
            onForgotPassword={() => {}}
          />
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;