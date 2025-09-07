import React, { useState } from 'react';
import { ChevronRight, Shield, Zap, Target, Eye, Star, Users, CheckCircle, BarChart3, Clock, TrendingUp } from 'lucide-react';
import LandingPage from './components/LandingPage';
import QuestionnaireWizard from './components/QuestionnaireWizard';
import ResultsDashboard from './components/ResultsDashboard';
import ComparisonTools from './components/ComparisonTools';

function App() {
  const [currentStep, setCurrentStep] = useState('landing');
  const [userData, setUserData] = useState({});

  const handleStartAssessment = () => {
    setCurrentStep('questionnaire');
  };

  const handleQuestionnaireComplete = (data) => {
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
        return <LandingPage onStartAssessment={handleStartAssessment} />;
      case 'questionnaire':
        return <QuestionnaireWizard onComplete={handleQuestionnaireComplete} onBack={handleBackToHome} />;
      case 'results':
        return <ResultsDashboard userData={userData} onBackToHome={handleBackToHome} />;
      default:
        return <LandingPage onStartAssessment={handleStartAssessment} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderCurrentStep()}
    </div>
  );
}

export default App;