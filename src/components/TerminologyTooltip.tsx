import React, { useState, useRef, useEffect } from 'react';
import { HelpCircle, Info, ExternalLink, X } from 'lucide-react';
import { InsuranceTerm, MedicalTerm, getTermByName } from '../data/terminologyData';

interface TerminologyTooltipProps {
  term: string;
  children?: React.ReactNode;
  type?: 'insurance' | 'medical' | 'auto';
  showIcon?: boolean;
  iconPosition?: 'before' | 'after';
  triggerOn?: 'hover' | 'click';
  className?: string;
}

export const TerminologyTooltip: React.FC<TerminologyTooltipProps> = ({
  term,
  children,
  type = 'auto',
  showIcon = true,
  iconPosition = 'after',
  triggerOn = 'hover',
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [useSimpleLanguage, setUseSimpleLanguage] = useState(true);
  const triggerRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const termData = getTermByName(term);

  useEffect(() => {
    const savedPreference = localStorage.getItem('terminology_preference');
    if (savedPreference) {
      setUseSimpleLanguage(savedPreference === 'simple');
    }
  }, []);

  useEffect(() => {
    if (isVisible && triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let top = triggerRect.bottom + window.scrollY + 8;
      let left = triggerRect.left + window.scrollX;

      if (left + tooltipRect.width > viewportWidth) {
        left = viewportWidth - tooltipRect.width - 20;
      }

      if (top + tooltipRect.height > viewportHeight + window.scrollY) {
        top = triggerRect.top + window.scrollY - tooltipRect.height - 8;
      }

      setPosition({ top, left });
    }
  }, [isVisible]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        triggerOn === 'click' &&
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsVisible(false);
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isVisible, triggerOn]);

  if (!termData) {
    return <span className={className}>{children || term}</span>;
  }

  const isInsuranceTerm = 'simpleDefinition' in termData;
  const definition = useSimpleLanguage
    ? isInsuranceTerm
      ? (termData as InsuranceTerm).simpleDefinition
      : (termData as MedicalTerm).laymanDefinition
    : isInsuranceTerm
    ? (termData as InsuranceTerm).technicalDefinition
    : (termData as MedicalTerm).medicalDefinition;

  const handleTrigger = () => {
    if (triggerOn === 'click') {
      setIsVisible(!isVisible);
    }
  };

  const handleMouseEnter = () => {
    if (triggerOn === 'hover') {
      setIsVisible(true);
    }
  };

  const handleMouseLeave = () => {
    if (triggerOn === 'hover') {
      setIsVisible(false);
    }
  };

  const toggleLanguage = () => {
    const newPreference = !useSimpleLanguage;
    setUseSimpleLanguage(newPreference);
    localStorage.setItem('terminology_preference', newPreference ? 'simple' : 'technical');
  };

  const getImportanceColor = (level?: string) => {
    switch (level) {
      case 'critical':
        return 'text-red-600 border-red-500';
      case 'high':
        return 'text-orange-600 border-orange-500';
      case 'medium':
        return 'text-blue-600 border-blue-500';
      case 'low':
        return 'text-gray-600 border-gray-500';
      default:
        return 'text-blue-600 border-blue-500';
    }
  };

  const getSeverityColor = (level?: string) => {
    switch (level) {
      case 'critical':
        return 'text-red-600 bg-red-50';
      case 'severe':
        return 'text-orange-600 bg-orange-50';
      case 'moderate':
        return 'text-yellow-600 bg-yellow-50';
      case 'mild':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <>
      <span
        ref={triggerRef}
        className={`inline-flex items-center gap-1 cursor-help ${className}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleTrigger}
      >
        {showIcon && iconPosition === 'before' && (
          <Info className="w-4 h-4 text-blue-500" />
        )}
        <span className="border-b border-dashed border-blue-400 hover:border-blue-600">
          {children || term}
        </span>
        {showIcon && iconPosition === 'after' && (
          <HelpCircle className="w-4 h-4 text-blue-500" />
        )}
      </span>

      {isVisible && (
        <div
          ref={tooltipRef}
          className="fixed z-50 w-96 bg-white rounded-lg shadow-2xl border border-gray-200 animate-fadeIn"
          style={{ top: `${position.top}px`, left: `${position.left}px` }}
        >
          <div className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4
                  className={`text-lg font-semibold mb-1 pb-2 border-b-2 ${
                    isInsuranceTerm
                      ? getImportanceColor((termData as InsuranceTerm).importanceLevel)
                      : 'text-gray-800 border-gray-300'
                  }`}
                >
                  {termData.term}
                </h4>
                {isInsuranceTerm && (termData as InsuranceTerm).importanceLevel && (
                  <span
                    className={`inline-block text-xs px-2 py-1 rounded-full font-medium ${
                      (termData as InsuranceTerm).importanceLevel === 'critical'
                        ? 'bg-red-100 text-red-800'
                        : (termData as InsuranceTerm).importanceLevel === 'high'
                        ? 'bg-orange-100 text-orange-800'
                        : (termData as InsuranceTerm).importanceLevel === 'medium'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {(termData as InsuranceTerm).importanceLevel.toUpperCase()}
                  </span>
                )}
                {!isInsuranceTerm && (termData as MedicalTerm).severityLevel && (
                  <span
                    className={`inline-block text-xs px-2 py-1 rounded-full font-medium ${getSeverityColor(
                      (termData as MedicalTerm).severityLevel
                    )}`}
                  >
                    {(termData as MedicalTerm).severityLevel?.toUpperCase()}
                  </span>
                )}
              </div>
              {triggerOn === 'click' && (
                <button
                  onClick={() => setIsVisible(false)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-500 font-medium">
                  {useSimpleLanguage ? 'Simple Language' : 'Technical Definition'}
                </span>
                <button
                  onClick={toggleLanguage}
                  className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                >
                  Switch to {useSimpleLanguage ? 'Technical' : 'Simple'}
                </button>
              </div>

              <p className="text-sm text-gray-700 leading-relaxed">{definition}</p>

              {isInsuranceTerm && (termData as InsuranceTerm).example && (
                <div className="bg-blue-50 p-3 rounded-md">
                  <p className="text-xs font-semibold text-blue-900 mb-1">Example:</p>
                  <p className="text-sm text-blue-800">{(termData as InsuranceTerm).example}</p>
                </div>
              )}

              {!isInsuranceTerm && (termData as MedicalTerm).commonTreatments && (termData as MedicalTerm).commonTreatments!.length > 0 && (
                <div className="bg-green-50 p-3 rounded-md">
                  <p className="text-xs font-semibold text-green-900 mb-1">Common Treatments:</p>
                  <ul className="text-sm text-green-800 list-disc list-inside space-y-1">
                    {(termData as MedicalTerm).commonTreatments!.slice(0, 3).map((treatment, idx) => (
                      <li key={idx}>{treatment}</li>
                    ))}
                  </ul>
                </div>
              )}

              {!isInsuranceTerm && (termData as MedicalTerm).preventionTips && (termData as MedicalTerm).preventionTips!.length > 0 && (
                <div className="bg-purple-50 p-3 rounded-md">
                  <p className="text-xs font-semibold text-purple-900 mb-1">Prevention Tips:</p>
                  <ul className="text-sm text-purple-800 list-disc list-inside space-y-1">
                    {(termData as MedicalTerm).preventionTips!.slice(0, 3).map((tip, idx) => (
                      <li key={idx}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}

              {isInsuranceTerm && (termData as InsuranceTerm).relatedTerms && (termData as InsuranceTerm).relatedTerms.length > 0 && (
                <div className="pt-2 border-t border-gray-200">
                  <p className="text-xs font-semibold text-gray-600 mb-1">Related Terms:</p>
                  <div className="flex flex-wrap gap-1">
                    {(termData as InsuranceTerm).relatedTerms.slice(0, 4).map((related, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 cursor-pointer"
                      >
                        {related}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {!isInsuranceTerm && (termData as MedicalTerm).relatedConditions && (termData as MedicalTerm).relatedConditions!.length > 0 && (
                <div className="pt-2 border-t border-gray-200">
                  <p className="text-xs font-semibold text-gray-600 mb-1">Related Conditions:</p>
                  <div className="flex flex-wrap gap-1">
                    {(termData as MedicalTerm).relatedConditions!.slice(0, 4).map((related, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 cursor-pointer"
                      >
                        {related}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {!isInsuranceTerm && (termData as MedicalTerm).icd10Codes && (termData as MedicalTerm).icd10Codes!.length > 0 && (
                <div className="pt-2 border-t border-gray-200">
                  <p className="text-xs font-semibold text-gray-600 mb-1">ICD-10 Codes:</p>
                  <div className="flex flex-wrap gap-1">
                    {(termData as MedicalTerm).icd10Codes!.map((code, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded font-mono"
                      >
                        {code}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {isInsuranceTerm && (termData as InsuranceTerm).learnMoreUrl && (
                <a
                  href={(termData as InsuranceTerm).learnMoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium pt-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Learn More
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TerminologyTooltip;
