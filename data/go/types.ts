/**
 * GO Intelligence — knowledge-graph entity model.
 *
 * Every node in the graph is an `Entity`: it carries provenance so any value on
 * screen can be traced back to the source it was ingested from, and a confidence
 * score so the UI can show the user how much to trust it. This is the contract
 * the whole platform is built on — "data you can actually trade on".
 */

export type Region =
  | 'Middle East Gulf'
  | 'West Africa'
  | 'South East Asia'
  | 'North Sea'
  | 'Gulf of Mexico';

export const REGIONS: Region[] = [
  'Middle East Gulf',
  'West Africa',
  'South East Asia',
  'North Sea',
  'Gulf of Mexico',
];

/* ------------------------------------------------------------------ *
 * Provenance & confidence
 * ------------------------------------------------------------------ */

export type SourceKind =
  | 'broker'
  | 'operator'
  | 'registry'
  | 'public-filing'
  | 'ais'
  | 'analyst'
  | 'customer';

export type VerificationState = 'verified' | 'scored' | 'unverified';

/** A single field's provenance record. Attached to anything commercially load-bearing. */
export type Provenance = {
  /** 0–100. Below `VERIFY_THRESHOLD` an analyst must confirm before publish. */
  confidence: number;
  source: SourceKind;
  sourceLabel: string;
  /** ISO date the value was last confirmed against its source. */
  asOf: string;
  state: VerificationState;
  verifiedBy?: string;
};

/** Any value that needs to be traceable is wrapped. */
export type Sourced<T> = {
  value: T;
  provenance: Provenance;
};

export const VERIFY_THRESHOLD = 70;

/* ------------------------------------------------------------------ *
 * Vessel taxonomy — GO Fleet
 * ------------------------------------------------------------------ */

export type VesselCategory =
  | 'OSV'
  | 'OCV'
  | 'MODU'
  | 'OFFSHORE PRODUCTION'
  | 'FLOATER WET'
  | 'RENEWABLE';

export type VesselSubType =
  | 'PSV'
  | 'AHTS'
  | 'AHT'
  | 'FSV'
  | 'CREW BOAT'
  | 'STANDBY / ERRV'
  | 'OCEAN GOING TUG'
  | 'DSV'
  | 'CONSTRUCTION / OCV'
  | 'WELL INTERVENTION'
  | 'JACK-UP'
  | 'SEMI-SUB'
  | 'DRILLSHIP'
  | 'FPSO'
  | 'FSO'
  | 'ACCOMMODATION'
  | 'CABLE LAY'
  | 'WIND SOV'
  | 'WTIV';

export type SizeClass =
  | 'Small'
  | 'Medium'
  | 'Large'
  | 'Very Large'
  | 'Super Large'
  | 'n/a';

export type VesselStatus =
  | 'On hire'
  | 'Off hire'
  | 'Standby'
  | 'Transit'
  | 'In yard'
  | 'Laid up';

export type AisStatus =
  | 'Underway'
  | 'On DP'
  | 'At anchor'
  | 'Moored'
  | 'Restricted manoeuvrability';

/** The seven management tiers. The defensible layer of the dataset. */
export type OwnershipTier =
  | 'beneficialOwner'
  | 'registeredOwner'
  | 'commercialManager'
  | 'operator'
  | 'commerciallyControlled'
  | 'technicalManager'
  | 'ismManager';

export const OWNERSHIP_TIERS: { key: OwnershipTier; label: string; note: string }[] = [
  { key: 'beneficialOwner', label: 'Beneficial Owner', note: 'Ultimate economic owner behind the SPV' },
  { key: 'registeredOwner', label: 'Registered Owner', note: 'Title holder on the flag registry' },
  { key: 'commercialManager', label: 'Commercial Manager', note: 'Markets and fixes the vessel' },
  { key: 'operator', label: 'Operator', note: 'Runs the vessel day to day' },
  { key: 'commerciallyControlled', label: 'Commercially Controlled By', note: 'Holds the charter-out right' },
  { key: 'technicalManager', label: 'Technical Manager', note: 'Maintenance and class' },
  { key: 'ismManager', label: 'ISM Manager', note: 'Safety-management certificate holder' },
];

export type AisPosition = {
  lat: number;
  lon: number;
  /** Hours since the last position report — drives the "position age" filter. */
  ageHours: number;
  status: AisStatus;
  speedKn: number;
  headingDeg: number;
  /** Zone id the vessel is currently inside, if any. */
  zoneId?: string;
  daysInZone?: number;
};

export type CharterType = 'TC' | 'BB' | 'Spot' | 'COA' | 'Framework';

export type CharterRecord = {
  id: string;
  date: string;
  vesselImo: string;
  vesselName: string;
  subType: VesselSubType;
  charterType: CharterType;
  ratePerDay: number | null;
  charterer: string;
  chartererId: string;
  fieldContractedTo: string;
  fieldId?: string;
  durationMonths: number;
  provenance: Provenance;
};

export type Vessel = {
  imo: string;
  mmsi: string;
  name: string;
  category: VesselCategory;
  subType: VesselSubType;
  sizeClass: SizeClass;
  built: number;
  flag: string;
  dwt: number;
  bollardPullT?: number;
  deckAreaM2?: number;
  bhp?: number;
  /** EEXI / CII band — powers the Energy Efficiency filter group. */
  eexiBand?: 'A' | 'B' | 'C' | 'D' | 'E';
  dpClass?: 'DP1' | 'DP2' | 'DP3' | 'None';
  region: Region;
  status: VesselStatus;
  ownership: Record<OwnershipTier, string>;
  /** Company id of the beneficial owner — the primary graph edge. */
  ownerId: string;
  ais: AisPosition;
  fieldOperator?: string;
  operatingIn?: string;
  provenance: Provenance;
};

/* ------------------------------------------------------------------ *
 * Companies — GO Companies
 * ------------------------------------------------------------------ */

export type CompanyRole =
  | 'OSV Owner / Operator'
  | 'NOC'
  | 'IOC'
  | 'EPC Contractor'
  | 'Drilling Contractor'
  | 'Financier / Lessor'
  | 'Port & Terminal Operator';

export type CompanyCharterHistory = {
  charterer: string;
  vessels: string;
  period: string;
  nature: string;
};

export type Company = {
  id: string;
  name: string;
  role: CompanyRole;
  country: string;
  headquarters: string;
  founded: number;
  website: string;
  fleetSize: number;
  operatingRegions: Region[];
  /** Vessel counts per management tier — the profile's management structure block. */
  tierCounts: Record<OwnershipTier, number>;
  /** Counterparty risk signals surfaced by GO AI when vetting. */
  riskFlags: string[];
  ownershipChainDepth: number;
  charterHistory: CompanyCharterHistory[];
  provenance: Provenance;
};

/* ------------------------------------------------------------------ *
 * Contracts — GO Contracts
 * ------------------------------------------------------------------ */

export type ContractStatus =
  | 'On Hire'
  | 'Renewal Due'
  | 'Expiring Soon'
  | 'Off Hire'
  | 'Overdue Renewal';

export type Contract = {
  id: string;
  vesselImo: string;
  vesselName: string;
  subType: VesselSubType;
  sizeClass: SizeClass;
  charterer: string;
  chartererId: string;
  ownerId: string;
  charterType: CharterType;
  ratePerDay: number | null;
  /** Percentage variance against the GO Market benchmark midpoint. */
  vsBenchmarkPct: number | null;
  startDate: string;
  expiryDate: string;
  region: Region;
  fieldId?: string;
  status: ContractStatus;
  provenance: Provenance;
};

/* ------------------------------------------------------------------ *
 * Projects — GO Projects
 * ------------------------------------------------------------------ */

export type ProjectPhase =
  | 'Tender'
  | 'Awarded'
  | 'Mobilising'
  | 'Execution'
  | 'First Oil';

export const PROJECT_PHASES: { key: ProjectPhase; blurb: string }[] = [
  { key: 'Tender', blurb: 'Bids open · vessel scope defined' },
  { key: 'Awarded', blurb: 'EPC contractor appointed' },
  { key: 'Mobilising', blurb: 'Vessel fixtures being placed' },
  { key: 'Execution', blurb: 'Installation underway' },
  { key: 'First Oil', blurb: 'Handover to operations' },
];

export type Project = {
  id: string;
  name: string;
  field: string;
  fieldId?: string;
  operator: string;
  operatorId: string;
  region: Region;
  capexUsd: number;
  vesselsNeeded: number;
  vesselTypes: VesselSubType[];
  phase: ProjectPhase;
  tenderCloses?: string;
  epcContractor?: string;
  firstOilTarget?: string;
  provenance: Provenance;
};

/* ------------------------------------------------------------------ *
 * Spatial — GO Maps & Layers
 * ------------------------------------------------------------------ */

export type LayerKind = 'field' | 'block' | 'platform' | 'pipeline' | 'port';

export type Zone = {
  id: string;
  name: string;
  kind: LayerKind;
  operator: string;
  region: Region;
  /** Normalised 0–100 canvas coordinates for the schematic map. */
  x: number;
  y: number;
  w?: number;
  h?: number;
  lat: number;
  lon: number;
  utilisationPct?: number;
  utilisationYearAgoPct?: number;
};

/* ------------------------------------------------------------------ *
 * Market — GO Market
 * ------------------------------------------------------------------ */

export type Trend = 'up' | 'down' | 'flat';

export type RateBenchmark = {
  id: string;
  region: Region;
  subType: VesselSubType;
  sizeClass: SizeClass;
  low: number;
  high: number;
  mid: number;
  trend: Trend;
  changePct: number;
  /** 12 months of midpoint history, oldest first. */
  history: number[];
  provenance: Provenance;
};

export type RegionalUtilisation = {
  region: Region;
  utilisationPct: number;
  yearAgoPct: number;
  vesselCount: number;
};

/* ------------------------------------------------------------------ *
 * Alerts — GO Alerts
 * ------------------------------------------------------------------ */

export type AlertKind =
  | 'contract-renewal'
  | 'off-hire'
  | 'zone-entry'
  | 'zone-exit'
  | 'tender-open'
  | 'rate-move'
  | 'ownership-change';

export type AlertSeverity = 'critical' | 'warning' | 'info';

export type Alert = {
  id: string;
  kind: AlertKind;
  severity: AlertSeverity;
  title: string;
  detail: string;
  entityType: 'vessel' | 'contract' | 'project' | 'company' | 'market';
  entityId: string;
  raisedAt: string;
  ageLabel: string;
  read: boolean;
};

/* ------------------------------------------------------------------ *
 * Accounts & entitlements — the commercial model
 * ------------------------------------------------------------------ */

export type AccountType = 'shipowner' | 'financier' | 'noc-epc';

export type FeatureKey =
  | 'fleet'
  | 'companies'
  | 'contracts'
  | 'projects'
  | 'maps'
  | 'market'
  | 'ai'
  | 'alerts'
  | 'app'
  | 'export'
  | 'api';

export type DataScope =
  | 'own-fleet'
  | 'financed-fleet'
  | 'full-regional';

export type AccountPlan = {
  type: AccountType;
  name: string;
  audience: string;
  priceUsd: number;
  billing: string;
  seats: number;
  dataScope: DataScope;
  dataScopeLabel: string;
  support: string;
  features: FeatureKey[];
  tagline: string;
};

export type Account = {
  id: string;
  organisation: string;
  type: AccountType;
  seatsUsed: number;
  /** Company ids this account may see beyond public data (its own or financed fleet). */
  scopedCompanyIds: string[];
  renewalDate: string;
  accountManager: string;
};

export type User = {
  id: string;
  name: string;
  initials: string;
  email: string;
  role: 'Admin' | 'Analyst' | 'Viewer';
  team: string;
};
