/**
 * GO INTELLIGENCE — offshore taxonomy
 *
 * The controlled vocabularies the platform is built around, taken from the
 * Gemini Offshore strategy book. This is structure, not data: it defines the
 * shape of the filters and the allowed values for every record you enter.
 * Add your vessels, companies and contracts against these terms.
 */

/* ---------- Vessel classification ---------- */

export const VESSEL_CATEGORIES = [
  'OSV',
  'OCV',
  'MODU',
  'OFFSHORE PRODUCTION',
  'FLOATER WET',
  'RENEWABLE',
] as const;
export type VesselCategory = (typeof VESSEL_CATEGORIES)[number];

/** Sub-types available under each category. */
export const VESSEL_SUBTYPES: Record<VesselCategory, string[]> = {
  OSV: [
    'PSV',
    'AHTS',
    'AHT',
    'FSV',
    'Crew Boat',
    'Standby / ERRV',
    'Ocean Going Tug',
  ],
  OCV: [
    'Construction Support',
    'Dive Support (DSV)',
    'Well Intervention',
    'Cable Lay',
    'Pipe Lay',
    'Survey / ROV Support',
  ],
  MODU: ['Jack-up', 'Semi-submersible', 'Drillship', 'Tender Rig'],
  'OFFSHORE PRODUCTION': ['FPSO', 'FSO', 'FLNG', 'Fixed Platform', 'MOPU'],
  'FLOATER WET': ['Semi-sub Production', 'Spar', 'TLP', 'Barge'],
  RENEWABLE: [
    'SOV',
    'CTV',
    'WTIV / Jack-up Installation',
    'Cable Lay (Renewables)',
    'Heavy Lift',
  ],
};

/** Size classes, keyed by sub-type. Five bands for AHTS, three for PSV. */
export const SIZE_CLASSES: Record<string, string[]> = {
  AHTS: [
    'AHTS (Small)',
    'AHTS (Medium)',
    'AHTS (Large)',
    'AHTS (Very Large)',
    'AHTS (Super Large)',
  ],
  PSV: ['PSV (Small)', 'PSV (Medium)', 'PSV (Large)'],
  FSV: ['FSV (Small)', 'FSV (Medium)', 'FSV (Large)'],
  'Crew Boat': ['Crew Boat (Small)', 'Crew Boat (Medium)', 'Crew Boat (Large)'],
};

/** Flat list of every size class, for filter rendering. */
export const ALL_SIZE_CLASSES: string[] = Object.values(SIZE_CLASSES).flat();

/* ---------- Geography ---------- */

export const REGIONS = [
  'Middle East Gulf',
  'West Africa',
  'South East Asia',
  'North Sea',
  'Gulf of Mexico',
] as const;
export type Region = (typeof REGIONS)[number];

/* ---------- Ownership & management ----------
   The seven-tier chain is the defensible layer of the product: it is the
   thing competitors do not hold. Every company profile carries all seven. */

export const MANAGEMENT_TIERS = [
  'Beneficial Owner',
  'Registered Owner',
  'Commercial Manager',
  'Operator',
  'Commercially Controlled',
  'Technical Manager',
  'ISM Manager',
] as const;
export type ManagementTier = (typeof MANAGEMENT_TIERS)[number];

/* ---------- Commercial status ---------- */

export const VESSEL_STATUSES = [
  'On Hire',
  'Off Hire',
  'Standby',
  'Transit',
  'Underway / On DP',
  'In Port',
  'Laid Up',
  'Dry Dock',
] as const;
export type VesselStatus = (typeof VESSEL_STATUSES)[number];

export const CONTRACT_STATUSES = [
  'On Hire',
  'Expiring Soon',
  'Renewal Due',
  'Overdue Renewal',
  'Off Hire',
  'Completed',
] as const;
export type ContractStatus = (typeof CONTRACT_STATUSES)[number];

export const CHARTER_TYPES = [
  'TC', // Time charter
  'BBC', // Bareboat charter
  'VC', // Voyage charter
  'COA', // Contract of affreightment
  'Spot',
] as const;
export type CharterType = (typeof CHARTER_TYPES)[number];

/* ---------- Projects ---------- */

export const PROJECT_PHASES = [
  'Tender',
  'Awarded',
  'Mobilising',
  'Execution',
  'First Oil',
] as const;
export type ProjectPhase = (typeof PROJECT_PHASES)[number];

export const PHASE_DESCRIPTIONS: Record<ProjectPhase, string> = {
  Tender: 'Bids open · vessel scope defined',
  Awarded: 'EPC contractor appointed',
  Mobilising: 'Vessel fixtures being placed',
  Execution: 'Installation underway',
  'First Oil': 'Handover to operations',
};

/* ---------- Company types ---------- */

export const COMPANY_TYPES = [
  'OSV Owner / Operator',
  'National Oil Company',
  'International Oil Company',
  'EPC Contractor',
  'Drilling Contractor',
  'Charterer',
  'Financier / Lessor',
  'Broker',
  'Port & Terminal Operator',
] as const;
export type CompanyType = (typeof COMPANY_TYPES)[number];

/* ---------- Alerts ---------- */

export const ALERT_TYPES = [
  'Contract renewal',
  'Off-hire event',
  'Zone entry',
  'Zone exit',
  'Ownership change',
  'New tender',
  'Rate movement',
  'Position stale',
] as const;
export type AlertType = (typeof ALERT_TYPES)[number];

export const ALERT_SEVERITIES = ['Critical', 'Warning', 'Info'] as const;
export type AlertSeverity = (typeof ALERT_SEVERITIES)[number];

/* ---------- Map layers ---------- */

export const MAP_LAYERS = [
  { id: 'vessels', name: 'Vessels', desc: 'Live AIS positions' },
  { id: 'platforms', name: 'Platforms', desc: 'Fixed and floating structures' },
  { id: 'blocks', name: 'Concession Blocks', desc: 'Licensed acreage' },
  { id: 'fields', name: 'Fields', desc: 'Producing and development fields' },
  { id: 'pipelines', name: 'Pipelines', desc: 'Subsea infrastructure' },
  { id: 'zones', name: 'Custom Zones', desc: 'Your saved watch areas' },
] as const;

/* ---------- Filter rail groups ----------
   The GO Fleet query builder. Mirrors the strategy-book filter panel. */

export const FILTER_GROUPS = [
  { id: 'vessel-type', label: 'Vessel type' },
  { id: 'built', label: 'Built' },
  { id: 'sizes', label: 'Sizes' },
  { id: 'vessel', label: 'Vessel' },
  { id: 'features', label: 'Features' },
  { id: 'company', label: 'Company' },
  { id: 'energy-efficiency', label: 'Energy efficiency' },
  { id: 'ais-raw', label: 'AIS raw' },
  { id: 'ais-derived', label: 'AIS derived' },
  { id: 'transactions', label: 'Transactions' },
] as const;

/* ---------- Data confidence ----------
   Every field carries a confidence rating; anything below threshold is
   analyst-verified before it reaches a screen. */

export const CONFIDENCE_LEVELS = [
  { id: 'verified', label: 'Verified', desc: 'Analyst-confirmed against source' },
  { id: 'high', label: 'High', desc: 'Multiple corroborating sources' },
  { id: 'medium', label: 'Medium', desc: 'Single reliable source' },
  { id: 'low', label: 'Low', desc: 'Below threshold — queued for review' },
] as const;
export type ConfidenceLevel = (typeof CONFIDENCE_LEVELS)[number]['id'];
