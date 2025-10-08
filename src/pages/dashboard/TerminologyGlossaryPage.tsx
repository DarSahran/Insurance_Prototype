import React, { useState, useMemo } from 'react';
import { Search, BookOpen, Heart, DollarSign, Filter, X, ArrowRight, HelpCircle } from 'lucide-react';
import {
  insuranceTerminology,
  medicalTerminology,
  icd10Codes,
  cptCodes,
  medications,
  searchTerminology,
  type InsuranceTerm,
  type MedicalTerm,
} from '../../data/terminologyData';
import { TerminologyTooltip } from '../../components/TerminologyTooltip';

const TerminologyGlossaryPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'insurance' | 'medical' | 'codes' | 'medications'>('insurance');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [useSimpleLanguage, setUseSimpleLanguage] = useState(true);
  const [selectedTerm, setSelectedTerm] = useState<InsuranceTerm | MedicalTerm | null>(null);

  const filteredInsuranceTerms = useMemo(() => {
    let terms = insuranceTerminology;

    if (selectedCategory !== 'all') {
      terms = terms.filter(t => t.category === selectedCategory);
    }

    if (searchQuery) {
      const results = searchTerminology(searchQuery);
      return results.insurance;
    }

    return terms;
  }, [searchQuery, selectedCategory]);

  const filteredMedicalTerms = useMemo(() => {
    let terms = medicalTerminology;

    if (selectedCategory !== 'all') {
      terms = terms.filter(t => t.category === selectedCategory);
    }

    if (searchQuery) {
      const results = searchTerminology(searchQuery);
      return results.medical;
    }

    return terms;
  }, [searchQuery, selectedCategory]);

  const filteredICD10 = useMemo(() => {
    if (!searchQuery) return icd10Codes;
    const query = searchQuery.toLowerCase();
    return icd10Codes.filter(
      code =>
        code.code.toLowerCase().includes(query) ||
        code.shortDescription.toLowerCase().includes(query) ||
        code.longDescription.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const filteredCPT = useMemo(() => {
    if (!searchQuery) return cptCodes;
    const query = searchQuery.toLowerCase();
    return cptCodes.filter(
      code =>
        code.code.includes(query) ||
        code.description.toLowerCase().includes(query) ||
        code.category.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const filteredMedications = useMemo(() => {
    if (!searchQuery) return medications;
    const query = searchQuery.toLowerCase();
    return medications.filter(
      med =>
        med.genericName.toLowerCase().includes(query) ||
        med.brandNames.some(name => name.toLowerCase().includes(query)) ||
        med.drugClass.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const insuranceCategories = [
    { value: 'all', label: 'All Terms' },
    { value: 'premium', label: 'Premium & Payments' },
    { value: 'deductible', label: 'Deductibles' },
    { value: 'copay', label: 'Copays' },
    { value: 'coinsurance', label: 'Coinsurance' },
    { value: 'coverage', label: 'Coverage' },
    { value: 'claims', label: 'Claims' },
    { value: 'benefits', label: 'Benefits' },
    { value: 'network', label: 'Network' },
    { value: 'authorization', label: 'Authorization' },
  ];

  const medicalCategories = [
    { value: 'all', label: 'All Terms' },
    { value: 'condition', label: 'Conditions' },
    { value: 'symptom', label: 'Symptoms' },
    { value: 'treatment', label: 'Treatments' },
    { value: 'test', label: 'Tests' },
    { value: 'medication', label: 'Medications' },
  ];

  const categories = activeTab === 'insurance' ? insuranceCategories : medicalCategories;

  const getImportanceBadge = (level: string) => {
    const styles = {
      critical: 'bg-red-100 text-red-800 border-red-300',
      high: 'bg-orange-100 text-orange-800 border-orange-300',
      medium: 'bg-blue-100 text-blue-800 border-blue-300',
      low: 'bg-gray-100 text-gray-800 border-gray-300',
    };
    return styles[level as keyof typeof styles] || styles.medium;
  };

  const getSeverityBadge = (level?: string) => {
    if (!level) return 'bg-gray-100 text-gray-800';
    const styles = {
      critical: 'bg-red-100 text-red-800',
      severe: 'bg-orange-100 text-orange-800',
      moderate: 'bg-yellow-100 text-yellow-800',
      mild: 'bg-green-100 text-green-800',
    };
    return styles[level as keyof typeof styles] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Medical & Insurance Terminology</h1>
        </div>
        <p className="text-gray-600">
          Understanding insurance and medical terms helps you make informed decisions about your coverage and healthcare.
        </p>
      </div>

      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search for any term..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <button
          onClick={() => setUseSimpleLanguage(!useSimpleLanguage)}
          className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <HelpCircle className="w-5 h-5" />
          <span className="font-medium">
            {useSimpleLanguage ? 'Simple Language' : 'Technical Terms'}
          </span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => {
              setActiveTab('insurance');
              setSelectedCategory('all');
              setSelectedTerm(null);
            }}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium transition-colors ${
              activeTab === 'insurance'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <DollarSign className="w-5 h-5" />
            Insurance Terms ({insuranceTerminology.length})
          </button>
          <button
            onClick={() => {
              setActiveTab('medical');
              setSelectedCategory('all');
              setSelectedTerm(null);
            }}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium transition-colors ${
              activeTab === 'medical'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <Heart className="w-5 h-5" />
            Medical Terms ({medicalTerminology.length})
          </button>
          <button
            onClick={() => {
              setActiveTab('codes');
              setSelectedCategory('all');
              setSelectedTerm(null);
            }}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium transition-colors ${
              activeTab === 'codes'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            Medical Codes
          </button>
          <button
            onClick={() => {
              setActiveTab('medications');
              setSelectedCategory('all');
              setSelectedTerm(null);
            }}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium transition-colors ${
              activeTab === 'medications'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <Filter className="w-5 h-5" />
            Medications ({medications.length})
          </button>
        </div>
      </div>

      {(activeTab === 'insurance' || activeTab === 'medical') && (
        <div className="mb-6">
          <div className="flex items-center gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === cat.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {activeTab === 'insurance' && (
            <div className="space-y-4">
              {filteredInsuranceTerms.length === 0 ? (
                <div className="bg-white rounded-lg p-8 text-center">
                  <p className="text-gray-500">No terms found matching your search.</p>
                </div>
              ) : (
                filteredInsuranceTerms.map((term) => (
                  <div
                    key={term.id}
                    className="bg-white rounded-lg p-6 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                    onClick={() => setSelectedTerm(term)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold text-gray-900">{term.term}</h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold border ${getImportanceBadge(
                          term.importanceLevel
                        )}`}
                      >
                        {term.importanceLevel.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-3">
                      {useSimpleLanguage ? term.simpleDefinition : term.technicalDefinition}
                    </p>
                    {term.example && (
                      <div className="bg-blue-50 p-3 rounded-md mb-3">
                        <p className="text-sm text-blue-900">
                          <span className="font-semibold">Example: </span>
                          {term.example}
                        </p>
                      </div>
                    )}
                    {term.relatedTerms.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {term.relatedTerms.slice(0, 5).map((related, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                          >
                            {related}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'medical' && (
            <div className="space-y-4">
              {filteredMedicalTerms.length === 0 ? (
                <div className="bg-white rounded-lg p-8 text-center">
                  <p className="text-gray-500">No terms found matching your search.</p>
                </div>
              ) : (
                filteredMedicalTerms.map((term) => (
                  <div
                    key={term.id}
                    className="bg-white rounded-lg p-6 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                    onClick={() => setSelectedTerm(term)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold text-gray-900">{term.term}</h3>
                      {term.severityLevel && (
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getSeverityBadge(
                            term.severityLevel
                          )}`}
                        >
                          {term.severityLevel.toUpperCase()}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-700 mb-3">
                      {useSimpleLanguage ? term.laymanDefinition : term.medicalDefinition}
                    </p>
                    {term.commonTreatments && term.commonTreatments.length > 0 && (
                      <div className="bg-green-50 p-3 rounded-md mb-3">
                        <p className="text-sm font-semibold text-green-900 mb-1">Common Treatments:</p>
                        <ul className="text-sm text-green-800 list-disc list-inside">
                          {term.commonTreatments.slice(0, 3).map((treatment, idx) => (
                            <li key={idx}>{treatment}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {term.icd10Codes && term.icd10Codes.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {term.icd10Codes.map((code, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded font-mono"
                          >
                            {code}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'codes' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">ICD-10 Diagnostic Codes</h3>
                <div className="space-y-3">
                  {filteredICD10.slice(0, 10).map((code) => (
                    <div key={code.code} className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-lg font-mono font-bold text-indigo-600">{code.code}</span>
                        {code.severityLevel && (
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${getSeverityBadge(
                              code.severityLevel
                            )}`}
                          >
                            {code.severityLevel}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-900 font-medium mb-1">{code.shortDescription}</p>
                      <p className="text-sm text-gray-600 mb-2">{code.longDescription}</p>
                      <div className="flex gap-2 flex-wrap">
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                          {code.category}
                        </span>
                        {code.chronicCondition && (
                          <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded">
                            Chronic Condition
                          </span>
                        )}
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                          Risk Score: {code.riskImpactScore}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">CPT Procedure Codes</h3>
                <div className="space-y-3">
                  {filteredCPT.map((code) => (
                    <div key={code.code} className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-lg font-mono font-bold text-green-600">{code.code}</span>
                        {code.requiresPreauth && (
                          <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-semibold">
                            Prior Auth Required
                          </span>
                        )}
                      </div>
                      <p className="text-gray-900 font-medium mb-2">{code.description}</p>
                      <div className="flex gap-2 flex-wrap mb-2">
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                          {code.category}
                        </span>
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                          {code.typicalSetting}
                        </span>
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
                          Coverage: {code.typicalCoveragePercentage}%
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Typical Cost: ${code.averageCostRange.min} - ${code.averageCostRange.max}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'medications' && (
            <div className="space-y-4">
              {filteredMedications.map((med) => (
                <div
                  key={med.id}
                  className="bg-white rounded-lg p-6 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{med.genericName}</h3>
                      {med.brandNames.length > 0 && (
                        <p className="text-sm text-gray-600">
                          Brand names: {med.brandNames.join(', ')}
                        </p>
                      )}
                    </div>
                    {med.requiresPrescription && (
                      <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-semibold">
                        Prescription Required
                      </span>
                    )}
                  </div>

                  <div className="mb-3">
                    <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                      {med.drugClass}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {med.uses.length > 0 && (
                      <div>
                        <p className="text-sm font-semibold text-gray-700 mb-1">Uses:</p>
                        <ul className="text-sm text-gray-600 list-disc list-inside">
                          {med.uses.map((use, idx) => (
                            <li key={idx}>{use}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {med.commonDosages.length > 0 && (
                      <div>
                        <p className="text-sm font-semibold text-gray-700 mb-1">Common Dosages:</p>
                        <div className="flex flex-wrap gap-2">
                          {med.commonDosages.map((dosage, idx) => (
                            <span key={idx} className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                              {dosage}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {med.sideEffects.length > 0 && (
                      <div className="bg-yellow-50 p-3 rounded-md">
                        <p className="text-sm font-semibold text-yellow-900 mb-1">Common Side Effects:</p>
                        <p className="text-sm text-yellow-800">{med.sideEffects.slice(0, 4).join(', ')}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200 sticky top-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Tips</h3>
            <div className="space-y-4 text-sm text-gray-700">
              <div className="flex gap-3">
                <ArrowRight className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p>
                  Use the <span className="font-semibold">Simple Language</span> toggle to switch between technical
                  and easy-to-understand definitions.
                </p>
              </div>
              <div className="flex gap-3">
                <ArrowRight className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p>
                  Click on any term to see detailed information including examples, related terms, and treatment
                  options.
                </p>
              </div>
              <div className="flex gap-3">
                <ArrowRight className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p>
                  <span className="font-semibold">Critical</span> and <span className="font-semibold">High</span>{' '}
                  importance terms are essential for understanding your insurance coverage.
                </p>
              </div>
              <div className="flex gap-3">
                <ArrowRight className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p>
                  Look for underlined terms throughout the app - hover over them for instant definitions using our{' '}
                  <TerminologyTooltip term="Premium">tooltip feature</TerminologyTooltip>.
                </p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-blue-200">
              <h4 className="font-semibold text-gray-900 mb-2">Need More Help?</h4>
              <p className="text-sm text-gray-700 mb-3">
                Our support team is available to answer any questions about insurance or medical terminology.
              </p>
              <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TerminologyGlossaryPage;
