import { useState } from 'react';
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
    <div className="min-h-screen bg-gray-50">
      {renderCurrentStep()}
    </div>
  );
}

export default App;