// Insurance company logo mappings - Using local SVG assets
import licLogo from '../assets/logos/lic.svg';
import hdfcLogo from '../assets/logos/hdfc.svg';
import iciciLogo from '../assets/logos/icici.svg';
import sbiLogo from '../assets/logos/sbi.svg';
import maxLifeLogo from '../assets/logos/max-life.svg';
import bajajLogo from '../assets/logos/bajaj.svg';
import tataAiaLogo from '../assets/logos/tata-aia.svg';
import kotakLogo from '../assets/logos/kotak.svg';
import starHealthLogo from '../assets/logos/star-health.svg';
import careHealthLogo from '../assets/logos/care-health.svg';
import digitLogo from '../assets/logos/digit.svg';
import ackoLogo from '../assets/logos/acko.svg';
import defaultLogo from '../assets/logos/default.svg';

export const companyLogos: Record<string, string> = {
  // Life Insurance
  'LIC': licLogo,
  'HDFC Life': hdfcLogo,
  'HDFC ERGO': hdfcLogo,
  'ICICI Prudential Life': iciciLogo,
  'ICICI Lombard': iciciLogo,
  'ICICI Pru': iciciLogo,
  'SBI Life': sbiLogo,
  'Max Life': maxLifeLogo,
  'Max Bupa': maxLifeLogo,
  'Bajaj Allianz Life': bajajLogo,
  'Bajaj Allianz': bajajLogo,
  'Bajaj': bajajLogo,
  'Tata AIA': tataAiaLogo,
  'Tata AIG': tataAiaLogo,
  'Kotak Life': kotakLogo,
  'Kotak': kotakLogo,

  // Health Insurance
  'Star Health': starHealthLogo,
  'Care Health': careHealthLogo,
  'Care': careHealthLogo,

  // Motor Insurance
  'Digit Insurance': digitLogo,
  'Go Digit': digitLogo,
  'Digit': digitLogo,
  'Acko': ackoLogo,

  // Default fallback
  'default': defaultLogo
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
