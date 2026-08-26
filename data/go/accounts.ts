import type { Account, AccountPlan, AccountType, FeatureKey, User } from './types';

/**
 * Three accounts, one platform. Every plan gets the whole core product — the
 * differentiators are seats, data scope, export and API. Nothing here is a
 * module paywall; that is deliberate ("Full Platform, Flat Price").
 */
const CORE: FeatureKey[] = ['fleet', 'companies', 'contracts', 'projects', 'maps', 'market', 'ai', 'alerts', 'app'];

export const PLANS: Record<AccountType, AccountPlan> = {
  shipowner: {
    type: 'shipowner',
    name: 'Shipowner / Operator',
    audience: 'For vessel owners and operators managing their own fleet commercially',
    priceUsd: 25_000,
    billing: 'per year, billed annually',
    seats: 10,
    dataScope: 'own-fleet',
    dataScopeLabel: 'Own fleet + regional market benchmarks',
    support: 'Dedicated Account Manager, standard business hours',
    features: CORE,
    tagline: 'Core Platform Access',
  },
  financier: {
    type: 'financier',
    name: 'Financier',
    audience: 'For lenders, lessors and investors monitoring fleet and market exposure',
    priceUsd: 50_000,
    billing: 'per year, billed annually',
    seats: 15,
    dataScope: 'financed-fleet',
    dataScopeLabel: 'Financed fleet exposure + regional market benchmarks',
    support: 'Dedicated Account Manager, standard business hours',
    features: [...CORE, 'export'],
    tagline: 'Core Platform + Export',
  },
  'noc-epc': {
    type: 'noc-epc',
    name: 'NOC & EPC Contractor',
    audience: 'For national oil companies and EPC contractors overseeing multi-operator activity',
    priceUsd: 75_000,
    billing: 'per year, billed annually',
    seats: 50,
    dataScope: 'full-regional',
    dataScopeLabel: 'Full regional fleet, contract and field data across all operators',
    support: 'Account Manager + Customer Success Manager, out-of-hours priority',
    features: [...CORE, 'export', 'api'],
    tagline: 'Full Platform + API Access',
  },
};

export const PLAN_ORDER: AccountType[] = ['shipowner', 'financier', 'noc-epc'];

export const FEATURE_LABELS: Record<FeatureKey, string> = {
  fleet: 'Fleet',
  companies: 'Companies',
  contracts: 'Contracts',
  projects: 'Projects',
  maps: 'Maps',
  market: 'Market',
  ai: 'AI',
  alerts: 'Alerts',
  app: 'App',
  export: 'Excel Export',
  api: 'API',
};

/**
 * Demo tenants. The account switcher in the app shell moves between these so a
 * prospect can see exactly what their own tier looks like before signing.
 */
export const DEMO_ACCOUNTS: Record<AccountType, Account> = {
  shipowner: {
    id: 'acct-falcon',
    organisation: 'Falcon Marine Services',
    type: 'shipowner',
    seatsUsed: 7,
    scopedCompanyIds: ['falcon-marine'],
    renewalDate: '2027-03-01',
    accountManager: 'D. Kaabi',
  },
  financier: {
    id: 'acct-icbc',
    organisation: 'ICBC Financial Leasing',
    type: 'financier',
    seatsUsed: 11,
    scopedCompanyIds: ['icbc-leasing', 'meridian-offshore', 'stanford-marine'],
    renewalDate: '2027-01-15',
    accountManager: 'A. Choolun',
  },
  'noc-epc': {
    id: 'acct-adnoc',
    organisation: 'ADNOC Offshore',
    type: 'noc-epc',
    seatsUsed: 38,
    scopedCompanyIds: [],
    renewalDate: '2027-06-30',
    accountManager: 'A. Choolun',
  },
};

export const DEMO_USER: User = {
  id: 'usr-1',
  name: 'Operations Team',
  initials: 'AC',
  email: 'ops@gointelligence.com',
  role: 'Admin',
  team: 'Commercial',
};

export function hasFeature(type: AccountType, feature: FeatureKey): boolean {
  return PLANS[type].features.includes(feature);
}

/**
 * Row-level data scope. `full-regional` sees everything; the other two see
 * public graph data plus commercially sensitive detail only on companies the
 * account owns or finances.
 */
export function canSeeCommercialDetail(account: Account, companyId: string): boolean {
  if (PLANS[account.type].dataScope === 'full-regional') return true;
  return account.scopedCompanyIds.includes(companyId);
}

/** Seat pressure drives the upsell conversation in the admin screen. */
export function seatUtilisation(account: Account): number {
  return Math.round((account.seatsUsed / PLANS[account.type].seats) * 100);
}
