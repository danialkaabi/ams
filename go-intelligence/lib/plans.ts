import type { AccountTier } from '@/data/types';

export interface Plan {
  tier: AccountTier;
  name: string;
  for: string;
  priceUsd: number;
  cycle: string;
  tierLabel: string;
  features: string[];
  seats: string;
  dataScope: string;
  support: string;
  featured?: boolean;
}

/** The three account types. Every account runs the same platform; API
 *  access and data export are what scale with the tier. */
export const PLANS: Plan[] = [
  {
    tier: 'shipowner',
    name: 'Shipowner / Operator',
    for: 'For vessel owners and operators managing their own fleet commercially.',
    priceUsd: 25_000,
    cycle: 'per year, billed annually',
    tierLabel: 'Core platform access',
    features: ['Fleet', 'Companies', 'Contracts', 'Projects', 'Maps', 'Market', 'AI', 'Alerts', 'App'],
    seats: 'Up to 10 users',
    dataScope: 'Own fleet plus regional market benchmarks',
    support: 'Dedicated account manager, standard business hours',
  },
  {
    tier: 'financier',
    name: 'Financier',
    for: 'For lenders, lessors and investors monitoring fleet and market exposure.',
    priceUsd: 50_000,
    cycle: 'per year, billed annually',
    tierLabel: 'Core platform + export',
    features: ['Fleet', 'Companies', 'Contracts', 'Projects', 'Maps', 'Market', 'AI', 'Alerts', 'Excel export', 'App'],
    seats: 'Up to 15 users',
    dataScope: 'Financed fleet exposure plus regional market benchmarks',
    support: 'Dedicated account manager, standard business hours',
  },
  {
    tier: 'noc-epc',
    name: 'NOC & EPC Contractor',
    for: 'For national oil companies and EPC contractors overseeing multi-operator activity.',
    priceUsd: 75_000,
    cycle: 'per year, billed annually',
    tierLabel: 'Full platform + API access',
    features: ['Fleet', 'Companies', 'Contracts', 'Projects', 'Maps', 'Market', 'AI', 'Alerts', 'API', 'Excel export', 'App'],
    seats: 'Up to 50 users',
    dataScope: 'Full regional fleet, contract and field data across all operators',
    support: 'Account manager and customer success manager, out-of-hours priority',
    featured: true,
  },
];
