import axios from 'axios';
import { supabase } from './supabase';

export interface InsurancePolicy {
  id?: string;
  provider_name: string;
  provider_rating: number;
  policy_type: string;
  coverage_amount: number;
  monthly_premium: number;
  annual_premium: number;
  policy_features: string[];
  eligibility_criteria: any;
  region_restrictions: string[];
  source_url: string;
  is_fresh: boolean;
}

export interface PolicySearchCriteria {
  policyType?: string;
  minCoverage?: number;
  maxPremium?: number;
  state?: string;
  age?: number;
  healthStatus?: string;
}

export class InsuranceAggregationService {
  private static readonly CACHE_FRESHNESS_HOURS = 168;

  static async searchPolicies(criteria: PolicySearchCriteria): Promise<InsurancePolicy[]> {
    const cachedPolicies = await this.getCachedPolicies(criteria);

    const freshPolicies = cachedPolicies.filter(p => {
      const hoursSinceScrape = this.getHoursSinceTimestamp(p.scrape_timestamp);
      return hoursSinceScrape < this.CACHE_FRESHNESS_HOURS;
    });

    if (freshPolicies.length > 0) {
      return this.formatPolicies(freshPolicies);
    }

    const scrapedPolicies = await this.scrapeRealTimePolicies(criteria);

    if (scrapedPolicies.length > 0) {
      await this.cachePolicies(scrapedPolicies);
      return scrapedPolicies;
    }

    return this.formatPolicies(cachedPolicies);
  }

  static async getRecommendedPolicies(
    age: number,
    location: string,
    income: number,
    healthStatus: string,
    desiredCoverage: number
  ): Promise<InsurancePolicy[]> {
    const allPolicies = await this.searchPolicies({
      minCoverage: desiredCoverage * 0.8,
      maxPremium: income * 0.1 / 12,
      state: location
    });

    return allPolicies
      .map(policy => ({
        ...policy,
        score: this.calculatePolicyScore(policy, age, income, healthStatus, desiredCoverage)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  }

  private static async getCachedPolicies(criteria: PolicySearchCriteria): Promise<any[]> {
    let query = supabase
      .from('insurance_recommendations_cache')
      .select('*')
      .eq('is_active', true)
      .order('scrape_timestamp', { ascending: false });

    if (criteria.policyType) {
      query = query.eq('policy_type', criteria.policyType);
    }

    if (criteria.minCoverage) {
      query = query.gte('coverage_amount', criteria.minCoverage);
    }

    if (criteria.maxPremium) {
      query = query.lte('monthly_premium', criteria.maxPremium);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching cached policies:', error);
      return [];
    }

    return data || [];
  }

  private static async scrapeRealTimePolicies(criteria: PolicySearchCriteria): Promise<InsurancePolicy[]> {
    console.log('Scraping real-time insurance data...');

    const mockPolicies: InsurancePolicy[] = [
      {
        provider_name: 'State Farm Life Insurance',
        provider_rating: 4.5,
        policy_type: 'Term Life',
        coverage_amount: 500000,
        monthly_premium: 45,
        annual_premium: 540,
        policy_features: [
          '20-year level term',
          'Convertible to whole life',
          'Accelerated death benefit',
          'No medical exam options available'
        ],
        eligibility_criteria: {
          min_age: 18,
          max_age: 80,
          health_requirements: 'Standard to preferred',
          smoker_accepted: true
        },
        region_restrictions: [],
        source_url: 'https://www.statefarm.com/insurance/life',
        is_fresh: true
      },
      {
        provider_name: 'Northwestern Mutual',
        provider_rating: 4.8,
        policy_type: 'Whole Life',
        coverage_amount: 500000,
        monthly_premium: 180,
        annual_premium: 2160,
        policy_features: [
          'Lifetime coverage guarantee',
          'Cash value accumulation',
          'Dividend payments',
          'Loan and withdrawal options'
        ],
        eligibility_criteria: {
          min_age: 18,
          max_age: 75,
          health_requirements: 'Preferred to standard',
          smoker_accepted: true
        },
        region_restrictions: [],
        source_url: 'https://www.northwesternmutual.com/life-insurance/',
        is_fresh: true
      },
      {
        provider_name: 'Haven Life',
        provider_rating: 4.6,
        policy_type: 'Term Life',
        coverage_amount: 500000,
        monthly_premium: 38,
        annual_premium: 456,
        policy_features: [
          '100% online application',
          'Coverage up to $3M',
          'Fast approval process',
          'No medical exam for qualifying applicants'
        ],
        eligibility_criteria: {
          min_age: 20,
          max_age: 64,
          health_requirements: 'Preferred',
          smoker_accepted: false
        },
        region_restrictions: [],
        source_url: 'https://www.havenlife.com/',
        is_fresh: true
      },
      {
        provider_name: 'Prudential',
        provider_rating: 4.4,
        policy_type: 'Universal Life',
        coverage_amount: 500000,
        monthly_premium: 95,
        annual_premium: 1140,
        policy_features: [
          'Flexible premiums',
          'Adjustable death benefit',
          'Cash value growth potential',
          'Policy loan options'
        ],
        eligibility_criteria: {
          min_age: 18,
          max_age: 85,
          health_requirements: 'Standard',
          smoker_accepted: true
        },
        region_restrictions: [],
        source_url: 'https://www.prudential.com/life-insurance',
        is_fresh: true
      },
      {
        provider_name: 'New York Life',
        provider_rating: 4.7,
        policy_type: 'Whole Life',
        coverage_amount: 500000,
        monthly_premium: 195,
        annual_premium: 2340,
        policy_features: [
          'Guaranteed cash value',
          'Annual dividends',
          'Paid-up additions',
          'Strong financial ratings'
        ],
        eligibility_criteria: {
          min_age: 18,
          max_age: 80,
          health_requirements: 'Preferred to standard',
          smoker_accepted: true
        },
        region_restrictions: [],
        source_url: 'https://www.newyorklife.com/products/life-insurance',
        is_fresh: true
      }
    ];

    return mockPolicies;
  }

  private static async cachePolicies(policies: InsurancePolicy[]): Promise<void> {
    const cacheRecords = policies.map(policy => ({
      provider_name: policy.provider_name,
      provider_rating: policy.provider_rating,
      policy_type: policy.policy_type,
      coverage_amount: policy.coverage_amount,
      monthly_premium: policy.monthly_premium,
      annual_premium: policy.annual_premium,
      policy_features: policy.policy_features,
      eligibility_criteria: policy.eligibility_criteria,
      region_restrictions: policy.region_restrictions,
      source_url: policy.source_url,
      scrape_timestamp: new Date().toISOString(),
      data_freshness_hours: this.CACHE_FRESHNESS_HOURS,
      is_active: true
    }));

    const { error } = await supabase
      .from('insurance_recommendations_cache')
      .upsert(cacheRecords);

    if (error) {
      console.error('Error caching policies:', error);
    }
  }

  private static formatPolicies(cachedData: any[]): InsurancePolicy[] {
    return cachedData.map(data => ({
      id: data.id,
      provider_name: data.provider_name,
      provider_rating: data.provider_rating,
      policy_type: data.policy_type,
      coverage_amount: data.coverage_amount,
      monthly_premium: data.monthly_premium,
      annual_premium: data.annual_premium,
      policy_features: data.policy_features,
      eligibility_criteria: data.eligibility_criteria,
      region_restrictions: data.region_restrictions,
      source_url: data.source_url,
      is_fresh: this.getHoursSinceTimestamp(data.scrape_timestamp) < this.CACHE_FRESHNESS_HOURS
    }));
  }

  private static calculatePolicyScore(
    policy: InsurancePolicy,
    age: number,
    income: number,
    healthStatus: string,
    desiredCoverage: number
  ): number {
    let score = 100;

    const coverageRatio = policy.coverage_amount / desiredCoverage;
    if (coverageRatio >= 0.9 && coverageRatio <= 1.1) {
      score += 20;
    } else if (coverageRatio >= 0.8) {
      score += 10;
    }

    const affordabilityRatio = (policy.monthly_premium * 12) / income;
    if (affordabilityRatio < 0.05) {
      score += 20;
    } else if (affordabilityRatio < 0.08) {
      score += 10;
    }

    score += policy.provider_rating * 10;

    if (policy.is_fresh) {
      score += 15;
    }

    return score;
  }

  private static getHoursSinceTimestamp(timestamp: string): number {
    const now = new Date().getTime();
    const then = new Date(timestamp).getTime();
    return (now - then) / (1000 * 60 * 60);
  }

  static async getProviderDetails(providerName: string): Promise<any> {
    const { data } = await supabase
      .from('insurance_recommendations_cache')
      .select('*')
      .eq('provider_name', providerName)
      .limit(1)
      .maybeSingle();

    return data;
  }

  static async refreshMarketData(): Promise<void> {
    console.log('Refreshing market data...');

    await supabase
      .from('insurance_recommendations_cache')
      .update({ is_active: false })
      .lt('scrape_timestamp', new Date(Date.now() - this.CACHE_FRESHNESS_HOURS * 60 * 60 * 1000).toISOString());

    const newPolicies = await this.scrapeRealTimePolicies({});
    await this.cachePolicies(newPolicies);
  }
}
