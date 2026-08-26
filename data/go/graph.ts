/**
 * GO Intelligence — graph resolvers.
 *
 * The point of the platform is that these entities are connected, not merely
 * collected. Everything below is an edge traversal the UI leans on: vessel →
 * owner → charter history → contract → field → project → benchmark.
 */
import type {
  Account,
  Company,
  Contract,
  Project,
  RateBenchmark,
  Region,
  Vessel,
} from './types';
import { COMPANIES, COMPANY_BY_ID } from './companies';
import { VESSELS, VESSEL_BY_IMO } from './vessels';
import { CONTRACTS, CONTRACTS_BY_IMO, daysUntil } from './contracts';
import { PROJECTS } from './projects';
import { ZONE_BY_ID } from './zones';
import { BENCHMARKS, findBenchmark, UTILISATION } from './market';
import { canSeeCommercialDetail } from './accounts';

export type VesselNode = {
  vessel: Vessel;
  owner?: Company;
  activeContract?: Contract;
  charterHistory: Contract[];
  benchmark?: RateBenchmark;
  zoneName?: string;
  fieldOperator?: string;
};

export function vesselNode(imo: string): VesselNode | undefined {
  const vessel = VESSEL_BY_IMO.get(imo);
  if (!vessel) return undefined;
  const history = (CONTRACTS_BY_IMO[imo] ?? [])
    .slice()
    .sort((a, b) => b.startDate.localeCompare(a.startDate));
  return {
    vessel,
    owner: COMPANY_BY_ID.get(vessel.ownerId),
    activeContract: history.find((c) => c.status !== 'Off Hire'),
    charterHistory: history,
    benchmark: findBenchmark(vessel.region, vessel.subType, vessel.sizeClass),
    zoneName: vessel.ais.zoneId ? ZONE_BY_ID.get(vessel.ais.zoneId)?.name : vessel.operatingIn,
    fieldOperator: vessel.fieldOperator,
  };
}

export type CompanyNode = {
  company: Company;
  vessels: Vessel[];
  contracts: Contract[];
  /** Vessels this company charters IN, for NOC/EPC and charterer profiles. */
  charteredIn: Contract[];
  regionalSplit: { region: Region; count: number; utilisationPct: number }[];
};

export function companyNode(id: string): CompanyNode | undefined {
  const company = COMPANY_BY_ID.get(id);
  if (!company) return undefined;
  const vessels = VESSELS.filter((v) => v.ownerId === id);
  const byRegion = new Map<Region, number>();
  vessels.forEach((v) => byRegion.set(v.region, (byRegion.get(v.region) ?? 0) + 1));

  return {
    company,
    vessels,
    contracts: CONTRACTS.filter((c) => c.ownerId === id),
    charteredIn: CONTRACTS.filter((c) => c.chartererId === id),
    regionalSplit: UTILISATION.map((u) => ({
      region: u.region,
      count: byRegion.get(u.region) ?? 0,
      utilisationPct: u.utilisationPct,
    })),
  };
}

export type ProjectNode = {
  project: Project;
  operator?: Company;
  /** Vessels already working inside the project's field — the demand-side read. */
  vesselsOnField: Vessel[];
  contractsOnField: Contract[];
};

export function projectNode(id: string): ProjectNode | undefined {
  const project = PROJECTS.find((p) => p.id === id);
  if (!project) return undefined;
  return {
    project,
    operator: COMPANY_BY_ID.get(project.operatorId),
    vesselsOnField: project.fieldId ? VESSELS.filter((v) => v.ais.zoneId === project.fieldId) : [],
    contractsOnField: project.fieldId ? CONTRACTS.filter((c) => c.fieldId === project.fieldId) : [],
  };
}

/* ------------------------------------------------------------------ *
 * Entitlement-aware reads
 * ------------------------------------------------------------------ */

/** Masks the rate when the account's data scope doesn't cover the counterparty. */
export function visibleRate(account: Account, contract: Contract): number | null | 'restricted' {
  return canSeeCommercialDetail(account, contract.ownerId) ? contract.ratePerDay : 'restricted';
}

/** The slice of the charter book an account is entitled to see in full. */
export function scopedContracts(account: Account): Contract[] {
  return CONTRACTS.filter((c) => canSeeCommercialDetail(account, c.ownerId));
}

/* ------------------------------------------------------------------ *
 * Portfolio & dashboard aggregates
 * ------------------------------------------------------------------ */

export const PORTFOLIO_IMOS = ['9784521', '9612847', '9702118', '9801447', '9655013'];

export function portfolio(): VesselNode[] {
  return PORTFOLIO_IMOS.map((imo) => vesselNode(imo)).filter((n): n is VesselNode => !!n);
}

export function contractsExpiringWithin(days: number): Contract[] {
  return CONTRACTS.filter((c) => {
    if (c.status === 'Off Hire') return false;
    const d = daysUntil(c.expiryDate);
    return d >= 0 && d <= days;
  });
}

export function overdueRenewals(): Contract[] {
  return CONTRACTS.filter((c) => c.status === 'Overdue Renewal');
}

/** Charter renewals grouped into the next four quarters — the exposure chart. */
export function renewalExposure(): { label: string; count: number }[] {
  const buckets = [
    { label: 'Q1', count: 0 },
    { label: 'Q2', count: 0 },
    { label: 'Q3', count: 0 },
    { label: 'Q4', count: 0 },
  ];
  CONTRACTS.forEach((c) => {
    if (c.status === 'Off Hire') return;
    const d = daysUntil(c.expiryDate);
    if (d < 0 || d > 365) return;
    buckets[Math.min(3, Math.floor(d / 91))].count += 1;
  });
  return buckets;
}

