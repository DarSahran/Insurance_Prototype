// Insurance company logo mappings
// Using placeholder service for logos - in production, replace with actual logo URLs

export const companyLogos: Record<string, string> = {
  // Life Insurance
  'LIC': 'https://via.placeholder.com/120x60/003366/FFFFFF?text=LIC',
  'HDFC Life': 'https://via.placeholder.com/120x60/004C97/FFFFFF?text=HDFC+Life',
  'ICICI Prudential Life': 'https://via.placeholder.com/120x60/F37021/FFFFFF?text=ICICI+Pru',
  'SBI Life': 'https://via.placeholder.com/120x60/22409A/FFFFFF?text=SBI+Life',
  'Max Life': 'https://via.placeholder.com/120x60/E31E24/FFFFFF?text=Max+Life',
  'Bajaj Allianz Life': 'https://via.placeholder.com/120x60/0033A0/FFFFFF?text=Bajaj+Life',
  'Tata AIA': 'https://via.placeholder.com/120x60/5F259F/FFFFFF?text=Tata+AIA',
  'Kotak Life': 'https://via.placeholder.com/120x60/ED1C24/FFFFFF?text=Kotak',
  'Aditya Birla Sun Life': 'https://via.placeholder.com/120x60/A71930/FFFFFF?text=Birla+SL',
  'PNB MetLife': 'https://via.placeholder.com/120x60/FF8200/FFFFFF?text=PNB+Met',

  // Health Insurance
  'Star Health': 'https://via.placeholder.com/120x60/E31E24/FFFFFF?text=Star+Health',
  'HDFC ERGO': 'https://via.placeholder.com/120x60/004C97/FFFFFF?text=HDFC+ERGO',
  'ICICI Lombard': 'https://via.placeholder.com/120x60/F37021/FFFFFF?text=ICICI+Lom',
  'Care Health': 'https://via.placeholder.com/120x60/00A859/FFFFFF?text=Care+Health',
  'Bajaj Allianz Health': 'https://via.placeholder.com/120x60/0033A0/FFFFFF?text=Bajaj+Health',
  'Aditya Birla Health': 'https://via.placeholder.com/120x60/A71930/FFFFFF?text=Birla+Health',
  'Niva Bupa': 'https://via.placeholder.com/120x60/00539F/FFFFFF?text=Niva+Bupa',
  'Manipal Cigna': 'https://via.placeholder.com/120x60/009CDE/FFFFFF?text=Manipal',
  'Max Bupa': 'https://via.placeholder.com/120x60/E31E24/FFFFFF?text=Max+Bupa',
  'Religare Health': 'https://via.placeholder.com/120x60/8B1D41/FFFFFF?text=Religare',

  // Motor Insurance
  'Bajaj Allianz': 'https://via.placeholder.com/120x60/0033A0/FFFFFF?text=Bajaj+Gen',
  'Tata AIG': 'https://via.placeholder.com/120x60/5F259F/FFFFFF?text=Tata+AIG',
  'Digit Insurance': 'https://via.placeholder.com/120x60/FF6B00/FFFFFF?text=Digit',
  'Go Digit': 'https://via.placeholder.com/120x60/FF6B00/FFFFFF?text=Go+Digit',
  'IFFCO Tokio': 'https://via.placeholder.com/120x60/009639/FFFFFF?text=IFFCO',
  'Royal Sundaram': 'https://via.placeholder.com/120x60/ED1C24/FFFFFF?text=Royal+Sun',
  'Reliance General': 'https://via.placeholder.com/120x60/D71920/FFFFFF?text=Reliance',
  'Future Generali': 'https://via.placeholder.com/120x60/7AC143/FFFFFF?text=Future+Gen',
  'Liberty General': 'https://via.placeholder.com/120x60/004B8D/FFFFFF?text=Liberty',
  'Acko': 'https://via.placeholder.com/120x60/6C5CE7/FFFFFF?text=Acko',

  // Default fallback
  'default': 'https://via.placeholder.com/120x60/6B7280/FFFFFF?text=Insurance'
};

export const getCompanyLogo = (providerName: string): string => {
  // Try exact match first
  if (companyLogos[providerName]) {
    return companyLogos[providerName];
  }

  // Try partial match
  const lowerName = providerName.toLowerCase();
  for (const [key, value] of Object.entries(companyLogos)) {
    if (lowerName.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerName)) {
      return value;
    }
  }

  return companyLogos['default'];
};

export const formatINR = (amount: number | string): string => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

  if (isNaN(numAmount)) return '₹0';

  // Format large amounts in lakhs and crores
  if (numAmount >= 10000000) {
    return `₹${(numAmount / 10000000).toFixed(2)} Cr`;
  } else if (numAmount >= 100000) {
    return `₹${(numAmount / 100000).toFixed(2)} L`;
  } else {
    return `₹${numAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
  }
};

export const formatPremiumINR = (amount: number | string): string => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

  if (isNaN(numAmount)) return '₹0';

  return `₹${numAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
};
