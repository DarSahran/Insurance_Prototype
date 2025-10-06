import React from 'react';
import { useNavigate } from 'react-router-dom';
import QuestionnaireWizard from '../../components/QuestionnaireWizard';

const NewAssessmentPage: React.FC = () => {
  const navigate = useNavigate();

  const handleComplete = (data: any) => {
    // In a real app, you would save the assessment and get an ID
    const assessmentId = 'ASS-2024-' + Math.random().toString(36).substr(2, 9);
    navigate(`/dashboard/assessments/${assessmentId}`);
  };

  const handleBack = () => {
    navigate('/dashboard/assessments');
  };

  return (
    <QuestionnaireWizard 
      onComplete={handleComplete}
      onBack={handleBack}
      initialData={{}}
    />
  );
};

export default NewAssessmentPage;