export interface InsuranceTerm {
  id: string;
  term: string;
  category: 'premium' | 'deductible' | 'copay' | 'coinsurance' | 'coverage' | 'claims' | 'benefits' | 'network' | 'authorization' | 'general';
  technicalDefinition: string;
  simpleDefinition: string;
  example: string;
  relatedTerms: string[];
  importanceLevel: 'critical' | 'high' | 'medium' | 'low';
  iconName?: string;
  learnMoreUrl?: string;
}

export interface MedicalTerm {
  id: string;
  term: string;
  medicalDefinition: string;
  laymanDefinition: string;
  category: 'diagnosis' | 'symptom' | 'treatment' | 'anatomy' | 'test' | 'medication' | 'condition' | 'general';
  icd10Codes?: string[];
  severityLevel?: 'mild' | 'moderate' | 'severe' | 'critical';
  riskImpactScore?: number;
  commonTreatments?: string[];
  relatedConditions?: string[];
  preventionTips?: string[];
}

export interface ICD10Code {
  code: string;
  shortDescription: string;
  longDescription: string;
  category: string;
  severityLevel?: 'mild' | 'moderate' | 'severe' | 'critical';
  chronicCondition: boolean;
  riskImpactScore: number;
}

export interface CPTCode {
  code: string;
  description: string;
  category: string;
  procedureType: string;
  typicalSetting: 'office' | 'outpatient' | 'inpatient' | 'emergency' | 'ambulatory' | 'telehealth';
  averageCostRange: { min: number; max: number };
  typicalCoveragePercentage: number;
  requiresPreauth: boolean;
}

export interface Medication {
  id: string;
  genericName: string;
  brandNames: string[];
  drugClass: string;
  dosageForms: string[];
  commonDosages: string[];
  uses: string[];
  sideEffects: string[];
  interactions?: string[];
  requiresPrescription: boolean;
}

export const insuranceTerminology: InsuranceTerm[] = [
  {
    id: 'premium',
    term: 'Premium',
    category: 'premium',
    technicalDefinition: 'The amount paid for an insurance policy, typically on a monthly, quarterly, or annual basis, representing the cost of coverage for the specified period.',
    simpleDefinition: 'The amount you pay every month to keep your insurance active, like a subscription fee for your coverage.',
    example: 'If your premium is $150/month, you pay this amount whether you use your insurance or not.',
    relatedTerms: ['Deductible', 'Coverage', 'Policy'],
    importanceLevel: 'critical',
    iconName: 'DollarSign',
  },
  {
    id: 'deductible',
    term: 'Deductible',
    category: 'deductible',
    technicalDefinition: 'The amount of covered expenses that must be paid out-of-pocket before an insurance company begins to pay benefits under a policy. Deductibles are typically annual.',
    simpleDefinition: 'The amount you must pay yourself before your insurance starts helping with costs. It resets every year.',
    example: 'With a $2,000 deductible, you pay the first $2,000 of covered medical costs each year.',
    relatedTerms: ['Copayment', 'Coinsurance', 'Out-of-Pocket Maximum'],
    importanceLevel: 'critical',
    iconName: 'Receipt',
  },
  {
    id: 'copayment',
    term: 'Copayment (Copay)',
    category: 'copay',
    technicalDefinition: 'A fixed amount paid by the insured for a covered service, typically at the time of service. The insurance company pays the remainder of the cost.',
    simpleDefinition: 'A flat fee you pay when you visit a doctor or get a service, like $30 per office visit.',
    example: 'You pay a $20 copay when you see your primary doctor, even if the actual visit costs $200.',
    relatedTerms: ['Coinsurance', 'Cost Sharing', 'Deductible'],
    importanceLevel: 'high',
    iconName: 'CreditCard',
  },
  {
    id: 'coinsurance',
    term: 'Coinsurance',
    category: 'coinsurance',
    technicalDefinition: 'The percentage of covered medical expenses that the insured is responsible for paying after the deductible has been met. Expressed as a ratio such as 80/20.',
    simpleDefinition: 'After you meet your deductible, you and your insurance split the costs by percentage. You might pay 20% while insurance pays 80%.',
    example: 'After meeting your deductible, if a procedure costs $1,000, you pay $200 (20%) and insurance pays $800 (80%).',
    relatedTerms: ['Deductible', 'Copayment', 'Cost Sharing'],
    importanceLevel: 'critical',
    iconName: 'PieChart',
  },
  {
    id: 'out-of-pocket-maximum',
    term: 'Out-of-Pocket Maximum',
    category: 'coverage',
    technicalDefinition: 'The maximum amount an insured individual must pay for covered services in a policy period before the insurance company pays 100% of covered expenses.',
    simpleDefinition: 'The most money you will have to pay in one year. After reaching this limit, insurance covers 100% of costs.',
    example: 'With a $6,000 out-of-pocket max, once you spend $6,000 on deductibles and coinsurance, insurance covers everything else that year.',
    relatedTerms: ['Deductible', 'Coinsurance', 'Maximum Benefit'],
    importanceLevel: 'critical',
    iconName: 'Shield',
  },
  {
    id: 'explanation-of-benefits',
    term: 'Explanation of Benefits (EOB)',
    category: 'claims',
    technicalDefinition: 'A statement from the insurance company explaining what medical treatments and services were paid on behalf of the insured, what portion was covered, and what the insured owes.',
    simpleDefinition: 'A document that shows what your insurance paid, what you owe, and why. It is not a bill.',
    example: 'Your EOB shows the doctor charged $500, insurance paid $400, and you owe $100 as your coinsurance.',
    relatedTerms: ['Claim', 'Adjudication', 'Allowed Amount'],
    importanceLevel: 'high',
    iconName: 'FileText',
  },
  {
    id: 'in-network-provider',
    term: 'In-Network Provider',
    category: 'network',
    technicalDefinition: 'Healthcare providers who have contracted with an insurance company to provide services at pre-negotiated rates, resulting in lower out-of-pocket costs for insured individuals.',
    simpleDefinition: 'Doctors and hospitals that have agreements with your insurance to charge lower prices. You pay less when you use them.',
    example: 'Visiting an in-network doctor costs you a $30 copay vs. $100 out-of-network.',
    relatedTerms: ['Out-of-Network', 'PPO', 'HMO', 'Provider Network'],
    importanceLevel: 'high',
    iconName: 'Building',
  },
  {
    id: 'out-of-network-provider',
    term: 'Out-of-Network Provider',
    category: 'network',
    technicalDefinition: 'Healthcare providers who do not have a contract with an insurance plan. Services are typically covered at a lower percentage or may not be covered at all.',
    simpleDefinition: 'Doctors or hospitals that do not have agreements with your insurance. You will pay much more to see them.',
    example: 'An out-of-network specialist might cost you 50% instead of 20% after your deductible.',
    relatedTerms: ['In-Network', 'Balance Billing', 'Allowed Amount'],
    importanceLevel: 'high',
    iconName: 'AlertTriangle',
  },
  {
    id: 'prior-authorization',
    term: 'Prior Authorization',
    category: 'authorization',
    technicalDefinition: 'Approval required from an insurance company before receiving certain medical services or medications to ensure they are medically necessary and covered.',
    simpleDefinition: 'Getting permission from your insurance before certain treatments, procedures, or medications. Without it, insurance may not pay.',
    example: 'Before surgery, your doctor must get prior authorization from insurance, or you might have to pay the full cost.',
    relatedTerms: ['Pre-certification', 'Medical Necessity', 'Approval'],
    importanceLevel: 'high',
    iconName: 'CheckSquare',
  },
  {
    id: 'allowed-amount',
    term: 'Allowed Amount',
    category: 'coverage',
    technicalDefinition: 'The maximum amount an insurance company will pay for a covered service. Providers may not charge insured members more than this amount for covered services.',
    simpleDefinition: 'The maximum price insurance has agreed to pay for a service. If your doctor charges more, you usually do not pay the extra.',
    example: 'If a procedure costs $1,500 but the allowed amount is $1,200, you only pay your share of $1,200.',
    relatedTerms: ['Usual and Customary', 'Contracted Rate', 'Fee Schedule'],
    importanceLevel: 'medium',
    iconName: 'Receipt',
  },
  {
    id: 'exclusion',
    term: 'Exclusion',
    category: 'coverage',
    technicalDefinition: 'Medical services, conditions, or circumstances that are not covered by an insurance policy.',
    simpleDefinition: 'Things your insurance will not pay for. These are listed in your policy documents.',
    example: 'Cosmetic surgery is usually an exclusion unless medically necessary.',
    relatedTerms: ['Limitation', 'Coverage', 'Benefit'],
    importanceLevel: 'high',
    iconName: 'XCircle',
  },
  {
    id: 'formulary',
    term: 'Formulary',
    category: 'benefits',
    technicalDefinition: 'A list of prescription drugs covered by an insurance plan, often organized into tiers with different cost-sharing levels.',
    simpleDefinition: 'The list of medications your insurance covers. Drugs on the list cost less than those not on it.',
    example: 'Your insurance formulary covers generic blood pressure medications at $10 copay but brand names at $75.',
    relatedTerms: ['Tier', 'Preferred Drug', 'Generic', 'Prior Authorization'],
    importanceLevel: 'high',
    iconName: 'Pill',
  },
  {
    id: 'preexisting-condition',
    term: 'Preexisting Condition',
    category: 'coverage',
    technicalDefinition: 'A health condition that existed before an individual applied for or enrolled in a new health insurance policy. Under the ACA, these cannot be excluded from coverage.',
    simpleDefinition: 'A health problem you had before getting new insurance. Insurers cannot deny you coverage for these anymore.',
    example: 'If you have diabetes before signing up for insurance, it is a preexisting condition but must still be covered.',
    relatedTerms: ['Coverage', 'Exclusion', 'Guaranteed Issue'],
    importanceLevel: 'high',
    iconName: 'Heart',
  },
  {
    id: 'beneficiary',
    term: 'Beneficiary',
    category: 'benefits',
    technicalDefinition: 'The person designated to receive benefits from an insurance policy, typically in the event of the policyholder death in life insurance.',
    simpleDefinition: 'The person you choose to receive money from your insurance if something happens to you.',
    example: 'You name your spouse as your beneficiary on your life insurance policy.',
    relatedTerms: ['Primary Beneficiary', 'Contingent Beneficiary', 'Life Insurance'],
    importanceLevel: 'high',
    iconName: 'Users',
  },
  {
    id: 'grace-period',
    term: 'Grace Period',
    category: 'general',
    technicalDefinition: 'A period after a premium payment is due during which coverage remains in effect and the policyholder can make payment without penalty.',
    simpleDefinition: 'Extra time after your bill is due to make a payment before your insurance gets canceled.',
    example: 'Your premium is due on the 1st, but you have until the 15th (grace period) to pay without losing coverage.',
    relatedTerms: ['Premium', 'Lapse', 'Reinstatement'],
    importanceLevel: 'medium',
    iconName: 'Clock',
  },
];

export const medicalTerminology: MedicalTerm[] = [
  {
    id: 'hypertension',
    term: 'Hypertension',
    medicalDefinition: 'A chronic medical condition characterized by persistently elevated arterial blood pressure, defined as systolic pressure ≥130 mmHg or diastolic pressure ≥80 mmHg.',
    laymanDefinition: 'High blood pressure - when the force of blood against your artery walls is consistently too high, making your heart work harder.',
    category: 'condition',
    icd10Codes: ['I10'],
    severityLevel: 'moderate',
    riskImpactScore: 45,
    commonTreatments: ['Lifestyle modifications', 'ACE inhibitors', 'Diuretics', 'Beta blockers', 'Calcium channel blockers'],
    relatedConditions: ['Diabetes', 'Heart Disease', 'Stroke', 'Kidney Disease'],
    preventionTips: ['Maintain healthy weight', 'Exercise regularly', 'Reduce sodium intake', 'Limit alcohol', 'Manage stress'],
  },
  {
    id: 'diabetes-type-2',
    term: 'Diabetes Mellitus Type 2',
    medicalDefinition: 'A metabolic disorder characterized by hyperglycemia resulting from insulin resistance and relative insulin deficiency, typically associated with obesity and sedentary lifestyle.',
    laymanDefinition: 'A condition where your body cannot properly use insulin to control blood sugar levels, often related to diet and exercise habits.',
    category: 'condition',
    icd10Codes: ['E11.9'],
    severityLevel: 'moderate',
    riskImpactScore: 55,
    commonTreatments: ['Metformin', 'Insulin therapy', 'Diet modification', 'Exercise', 'Weight management', 'Blood glucose monitoring'],
    relatedConditions: ['Hypertension', 'Obesity', 'Heart Disease', 'Neuropathy'],
    preventionTips: ['Maintain healthy weight', 'Stay physically active', 'Eat a balanced diet', 'Limit sugar intake', 'Regular health screenings'],
  },
  {
    id: 'bmi',
    term: 'Body Mass Index (BMI)',
    medicalDefinition: 'A measure of body fat calculated using height and weight (weight in kg / height in m²), used to categorize individuals into underweight, normal, overweight, or obese classifications.',
    laymanDefinition: 'A number calculated from your height and weight that indicates if you are at a healthy weight. Higher numbers may indicate health risks.',
    category: 'test',
    severityLevel: 'mild',
    riskImpactScore: 30,
    commonTreatments: ['Diet modification', 'Exercise program', 'Behavioral therapy', 'Bariatric surgery'],
    relatedConditions: ['Obesity', 'Metabolic Syndrome'],
  },
  {
    id: 'myocardial-infarction',
    term: 'Myocardial Infarction',
    medicalDefinition: 'Acute coronary syndrome resulting from coronary artery occlusion causing myocardial ischemia and necrosis, commonly known as a heart attack.',
    laymanDefinition: 'A heart attack - when blood flow to part of your heart muscle is blocked, causing damage to the heart.',
    category: 'condition',
    icd10Codes: ['I21.9'],
    severityLevel: 'critical',
    riskImpactScore: 95,
    commonTreatments: ['Emergency angioplasty', 'Thrombolytics', 'Aspirin', 'Cardiac rehabilitation', 'Lifestyle changes', 'Medications'],
    relatedConditions: ['Coronary Artery Disease', 'Hypertension', 'High Cholesterol'],
    preventionTips: ['Control blood pressure', 'Manage cholesterol', 'Do not smoke', 'Exercise regularly', 'Eat heart-healthy diet'],
  },
  {
    id: 'hyperlipidemia',
    term: 'Hyperlipidemia',
    medicalDefinition: 'Elevated levels of lipids in the blood, including cholesterol and triglycerides, increasing cardiovascular disease risk.',
    laymanDefinition: 'High cholesterol - when you have too much fat in your blood, which can clog arteries and cause heart problems.',
    category: 'condition',
    icd10Codes: ['E78.5'],
    severityLevel: 'moderate',
    riskImpactScore: 50,
    commonTreatments: ['Statins', 'Dietary changes', 'Exercise', 'Fibrates', 'Niacin'],
    relatedConditions: ['Heart Disease', 'Atherosclerosis', 'Diabetes'],
    preventionTips: ['Eat healthy fats', 'Exercise regularly', 'Avoid trans fats', 'Limit saturated fats', 'Maintain healthy weight'],
  },
  {
    id: 'anxiety-disorder',
    term: 'Anxiety Disorder',
    medicalDefinition: 'A group of mental health conditions characterized by excessive fear, worry, or anxiety that interferes with daily functioning and persists over time.',
    laymanDefinition: 'Persistent, excessive worry or fear that affects your daily life and is difficult to control.',
    category: 'condition',
    icd10Codes: ['F41.9'],
    severityLevel: 'moderate',
    riskImpactScore: 40,
    commonTreatments: ['Cognitive behavioral therapy', 'SSRIs', 'Benzodiazepines', 'Mindfulness', 'Stress management'],
    relatedConditions: ['Depression', 'PTSD', 'Panic Disorder'],
    preventionTips: ['Practice stress management', 'Exercise regularly', 'Get adequate sleep', 'Limit caffeine', 'Seek social support'],
  },
  {
    id: 'sleep-apnea',
    term: 'Sleep Apnea',
    medicalDefinition: 'A sleep disorder characterized by repeated interruptions in breathing during sleep due to airway obstruction or lack of respiratory effort.',
    laymanDefinition: 'A condition where you stop breathing repeatedly during sleep, leading to poor sleep quality and health risks.',
    category: 'condition',
    icd10Codes: ['G47.33'],
    severityLevel: 'moderate',
    riskImpactScore: 45,
    commonTreatments: ['CPAP therapy', 'Weight loss', 'Positional therapy', 'Oral appliances', 'Surgery'],
    relatedConditions: ['Obesity', 'Hypertension', 'Heart Disease'],
    preventionTips: ['Maintain healthy weight', 'Avoid alcohol before bed', 'Sleep on your side', 'Treat nasal congestion', 'Quit smoking'],
  },
  {
    id: 'arthritis',
    term: 'Arthritis',
    medicalDefinition: 'Inflammation of one or more joints causing pain, swelling, stiffness, and decreased range of motion.',
    laymanDefinition: 'Joint inflammation causing pain, stiffness, and difficulty moving. Can affect one or many joints.',
    category: 'condition',
    icd10Codes: ['M15.9'],
    severityLevel: 'moderate',
    riskImpactScore: 35,
    commonTreatments: ['NSAIDs', 'Physical therapy', 'Exercise', 'Weight management', 'DMARDs', 'Corticosteroids'],
    relatedConditions: ['Osteoporosis', 'Obesity', 'Autoimmune Disease'],
    preventionTips: ['Maintain healthy weight', 'Stay active', 'Protect joints', 'Eat anti-inflammatory foods', 'Avoid repetitive stress'],
  },
  {
    id: 'asthma',
    term: 'Asthma',
    medicalDefinition: 'A chronic respiratory condition characterized by airway inflammation, bronchial hyperresponsiveness, and variable airflow obstruction.',
    laymanDefinition: 'A lung condition causing breathing difficulties, wheezing, and coughing due to inflamed and narrowed airways.',
    category: 'condition',
    icd10Codes: ['J45.909'],
    severityLevel: 'moderate',
    riskImpactScore: 40,
    commonTreatments: ['Inhaled corticosteroids', 'Bronchodilators', 'Leukotriene modifiers', 'Allergy medications', 'Trigger avoidance'],
    relatedConditions: ['Allergies', 'COPD', 'Respiratory Infections'],
    preventionTips: ['Avoid triggers', 'Control allergies', 'Get vaccinated', 'Monitor breathing', 'Take medications as prescribed'],
  },
  {
    id: 'obesity',
    term: 'Obesity',
    medicalDefinition: 'A medical condition characterized by excessive body fat accumulation that presents health risks, typically defined as BMI ≥30 kg/m².',
    laymanDefinition: 'Having too much body fat, which increases risk for many health problems like diabetes, heart disease, and joint issues.',
    category: 'condition',
    icd10Codes: ['E66.9'],
    severityLevel: 'moderate',
    riskImpactScore: 50,
    commonTreatments: ['Diet modification', 'Exercise program', 'Behavioral therapy', 'Medications', 'Bariatric surgery'],
    relatedConditions: ['Diabetes', 'Hypertension', 'Sleep Apnea', 'Heart Disease'],
    preventionTips: ['Eat balanced diet', 'Exercise regularly', 'Control portion sizes', 'Limit processed foods', 'Get adequate sleep'],
  },
];

export const icd10Codes: ICD10Code[] = [
  { code: 'I10', shortDescription: 'Essential hypertension', longDescription: 'Essential (primary) hypertension', category: 'Circulatory System', severityLevel: 'moderate', chronicCondition: true, riskImpactScore: 45 },
  { code: 'E11.9', shortDescription: 'Type 2 diabetes mellitus', longDescription: 'Type 2 diabetes mellitus without complications', category: 'Endocrine/Metabolic', severityLevel: 'moderate', chronicCondition: true, riskImpactScore: 55 },
  { code: 'E78.5', shortDescription: 'Hyperlipidemia', longDescription: 'Hyperlipidemia, unspecified', category: 'Endocrine/Metabolic', severityLevel: 'moderate', chronicCondition: true, riskImpactScore: 50 },
  { code: 'J45.909', shortDescription: 'Asthma', longDescription: 'Unspecified asthma, uncomplicated', category: 'Respiratory', severityLevel: 'moderate', chronicCondition: true, riskImpactScore: 40 },
  { code: 'F41.9', shortDescription: 'Anxiety disorder', longDescription: 'Anxiety disorder, unspecified', category: 'Mental Health', severityLevel: 'moderate', chronicCondition: true, riskImpactScore: 40 },
  { code: 'I25.10', shortDescription: 'Coronary artery disease', longDescription: 'Atherosclerotic heart disease of native coronary artery without angina pectoris', category: 'Circulatory System', severityLevel: 'severe', chronicCondition: true, riskImpactScore: 75 },
  { code: 'G47.33', shortDescription: 'Sleep apnea', longDescription: 'Obstructive sleep apnea', category: 'Nervous System', severityLevel: 'moderate', chronicCondition: true, riskImpactScore: 45 },
  { code: 'E66.9', shortDescription: 'Obesity', longDescription: 'Obesity, unspecified', category: 'Endocrine/Metabolic', severityLevel: 'moderate', chronicCondition: true, riskImpactScore: 50 },
  { code: 'M15.9', shortDescription: 'Osteoarthritis', longDescription: 'Polyosteoarthritis, unspecified', category: 'Musculoskeletal', severityLevel: 'moderate', chronicCondition: true, riskImpactScore: 35 },
  { code: 'I21.9', shortDescription: 'Acute myocardial infarction', longDescription: 'Acute myocardial infarction, unspecified', category: 'Circulatory System', severityLevel: 'critical', chronicCondition: false, riskImpactScore: 95 },
];

export const cptCodes: CPTCode[] = [
  { code: '99213', description: 'Office visit, established patient, low to moderate complexity', category: 'Evaluation & Management', procedureType: 'Office Visit', typicalSetting: 'office', averageCostRange: { min: 100, max: 200 }, typicalCoveragePercentage: 80, requiresPreauth: false },
  { code: '99214', description: 'Office visit, established patient, moderate complexity', category: 'Evaluation & Management', procedureType: 'Office Visit', typicalSetting: 'office', averageCostRange: { min: 150, max: 250 }, typicalCoveragePercentage: 80, requiresPreauth: false },
  { code: '80053', description: 'Comprehensive metabolic panel', category: 'Laboratory', procedureType: 'Blood Test', typicalSetting: 'outpatient', averageCostRange: { min: 30, max: 100 }, typicalCoveragePercentage: 90, requiresPreauth: false },
  { code: '93000', description: 'Electrocardiogram (ECG)', category: 'Cardiovascular', procedureType: 'Diagnostic Test', typicalSetting: 'office', averageCostRange: { min: 50, max: 150 }, typicalCoveragePercentage: 85, requiresPreauth: false },
  { code: '45378', description: 'Colonoscopy', category: 'Gastrointestinal', procedureType: 'Endoscopy', typicalSetting: 'outpatient', averageCostRange: { min: 800, max: 2500 }, typicalCoveragePercentage: 80, requiresPreauth: true },
  { code: '71046', description: 'Chest X-ray, 2 views', category: 'Radiology', procedureType: 'Imaging', typicalSetting: 'outpatient', averageCostRange: { min: 75, max: 200 }, typicalCoveragePercentage: 85, requiresPreauth: false },
  { code: '97110', description: 'Physical therapy, therapeutic exercises', category: 'Physical Medicine', procedureType: 'Therapy', typicalSetting: 'outpatient', averageCostRange: { min: 60, max: 120 }, typicalCoveragePercentage: 75, requiresPreauth: false },
  { code: '90834', description: 'Psychotherapy, 45 minutes', category: 'Mental Health', procedureType: 'Counseling', typicalSetting: 'office', averageCostRange: { min: 100, max: 200 }, typicalCoveragePercentage: 70, requiresPreauth: false },
];

export const medications: Medication[] = [
  {
    id: 'metformin',
    genericName: 'Metformin',
    brandNames: ['Glucophage', 'Fortamet', 'Glumetza'],
    drugClass: 'Biguanide',
    dosageForms: ['Tablet', 'Extended-release tablet'],
    commonDosages: ['500mg', '850mg', '1000mg'],
    uses: ['Type 2 diabetes management', 'Blood glucose control'],
    sideEffects: ['Nausea', 'Diarrhea', 'Stomach upset', 'Vitamin B12 deficiency'],
    interactions: ['Alcohol', 'Contrast dye', 'Certain antibiotics'],
    requiresPrescription: true,
  },
  {
    id: 'lisinopril',
    genericName: 'Lisinopril',
    brandNames: ['Prinivil', 'Zestril'],
    drugClass: 'ACE Inhibitor',
    dosageForms: ['Tablet'],
    commonDosages: ['5mg', '10mg', '20mg', '40mg'],
    uses: ['Hypertension', 'Heart failure', 'Post-myocardial infarction'],
    sideEffects: ['Dizziness', 'Dry cough', 'Headache', 'Fatigue'],
    interactions: ['NSAIDs', 'Potassium supplements', 'Lithium'],
    requiresPrescription: true,
  },
  {
    id: 'atorvastatin',
    genericName: 'Atorvastatin',
    brandNames: ['Lipitor'],
    drugClass: 'Statin',
    dosageForms: ['Tablet'],
    commonDosages: ['10mg', '20mg', '40mg', '80mg'],
    uses: ['High cholesterol', 'Cardiovascular disease prevention'],
    sideEffects: ['Muscle pain', 'Headache', 'Nausea', 'Elevated liver enzymes'],
    interactions: ['Grapefruit juice', 'Certain antibiotics', 'Antifungals'],
    requiresPrescription: true,
  },
  {
    id: 'albuterol',
    genericName: 'Albuterol',
    brandNames: ['Proventil', 'Ventolin'],
    drugClass: 'Beta-2 Agonist',
    dosageForms: ['Inhaler', 'Nebulizer solution'],
    commonDosages: ['90mcg per inhalation'],
    uses: ['Asthma', 'Bronchospasm', 'COPD'],
    sideEffects: ['Tremor', 'Nervousness', 'Headache', 'Rapid heartbeat'],
    interactions: ['Beta blockers', 'MAO inhibitors', 'Diuretics'],
    requiresPrescription: true,
  },
  {
    id: 'omeprazole',
    genericName: 'Omeprazole',
    brandNames: ['Prilosec'],
    drugClass: 'Proton Pump Inhibitor',
    dosageForms: ['Capsule', 'Tablet'],
    commonDosages: ['20mg', '40mg'],
    uses: ['GERD', 'Ulcers', 'Heartburn'],
    sideEffects: ['Headache', 'Diarrhea', 'Abdominal pain', 'Nausea'],
    interactions: ['Clopidogrel', 'Warfarin', 'Certain antifungals'],
    requiresPrescription: true,
  },
  {
    id: 'sertraline',
    genericName: 'Sertraline',
    brandNames: ['Zoloft'],
    drugClass: 'SSRI',
    dosageForms: ['Tablet', 'Oral solution'],
    commonDosages: ['25mg', '50mg', '100mg'],
    uses: ['Depression', 'Anxiety', 'OCD', 'PTSD'],
    sideEffects: ['Nausea', 'Insomnia', 'Drowsiness', 'Sexual dysfunction'],
    interactions: ['MAO inhibitors', 'Blood thinners', 'NSAIDs'],
    requiresPrescription: true,
  },
  {
    id: 'ibuprofen',
    genericName: 'Ibuprofen',
    brandNames: ['Advil', 'Motrin'],
    drugClass: 'NSAID',
    dosageForms: ['Tablet', 'Capsule', 'Liquid'],
    commonDosages: ['200mg', '400mg', '600mg', '800mg'],
    uses: ['Pain relief', 'Fever reduction', 'Inflammation'],
    sideEffects: ['Stomach upset', 'Heartburn', 'Dizziness', 'Increased bleeding risk'],
    interactions: ['Blood thinners', 'Aspirin', 'Other NSAIDs', 'Corticosteroids'],
    requiresPrescription: false,
  },
];

export function searchTerminology(query: string): { insurance: InsuranceTerm[]; medical: MedicalTerm[] } {
  const lowerQuery = query.toLowerCase();

  const insuranceResults = insuranceTerminology.filter(term =>
    term.term.toLowerCase().includes(lowerQuery) ||
    term.simpleDefinition.toLowerCase().includes(lowerQuery) ||
    term.technicalDefinition.toLowerCase().includes(lowerQuery)
  );

  const medicalResults = medicalTerminology.filter(term =>
    term.term.toLowerCase().includes(lowerQuery) ||
    term.laymanDefinition.toLowerCase().includes(lowerQuery) ||
    term.medicalDefinition.toLowerCase().includes(lowerQuery)
  );

  return { insurance: insuranceResults, medical: medicalResults };
}

export function getTermByName(termName: string): InsuranceTerm | MedicalTerm | undefined {
  const insurance = insuranceTerminology.find(t => t.term.toLowerCase() === termName.toLowerCase());
  if (insurance) return insurance;

  return medicalTerminology.find(t => t.term.toLowerCase() === termName.toLowerCase());
}

export function getRelatedTerms(termId: string): (InsuranceTerm | MedicalTerm)[] {
  const allTerms = [...insuranceTerminology, ...medicalTerminology];
  const term = allTerms.find(t => t.id === termId);

  if (!term) return [];

  const relatedTermNames = 'relatedTerms' in term ? term.relatedTerms : term.relatedConditions || [];

  return allTerms.filter(t =>
    relatedTermNames.some(name =>
      t.term.toLowerCase().includes(name.toLowerCase())
    )
  );
}
