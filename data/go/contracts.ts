import type { Contract, ContractStatus } from './types';
import { prov } from './provenance';
import { VESSELS } from './vessels';
import { findBenchmark } from './market';

const TODAY = new Date('2026-08-26T00:00:00Z');

export function daysUntil(iso: string): number {
  return Math.round((new Date(iso).getTime() - TODAY.getTime()) / 86400000);
}

export function expiryLabel(iso: string): string {
  const d = daysUntil(iso);
  if (d < 0) return `${Math.abs(d)} days overdue`;
  if (d < 45) return `${d} days`;
  if (d < 365) return `${Math.round(d / 30)} months`;
  return `${(d / 365).toFixed(1)} years`;
}

function statusFor(expiry: string, offHire: boolean): ContractStatus {
  if (offHire) return 'Off Hire';
  const d = daysUntil(expiry);
  if (d < 0) return 'Overdue Renewal';
  if (d <= 30) return 'Renewal Due';
  if (d <= 90) return 'Expiring Soon';
  return 'On Hire';
}

type Seed = {
  id: string;
  imo: string;
  charterer: string;
  chartererId: string;
  rate: number | null;
  start: string;
  expiry: string;
  fieldId?: string;
  charterType?: Contract['charterType'];
  confidence?: number;
  verifiedBy?: string;
};

const SEEDS: Seed[] = [
  { id: 'ct-1001', imo: '9784521', charterer: 'Saudi Aramco', chartererId: 'saudi-aramco', rate: 15500, start: '2025-01-15', expiry: '2026-09-13', fieldId: 'safaniya-field', confidence: 92, verifiedBy: 'A. Choolun' },
  { id: 'ct-1002', imo: '9655013', charterer: 'ADNOC Offshore', chartererId: 'adnoc-offshore', rate: 21000, start: '2024-10-01', expiry: '2026-10-07', fieldId: 'upper-zakum', confidence: 88 },
  { id: 'ct-1003', imo: '9801447', charterer: 'QatarEnergy', chartererId: 'qatarenergy', rate: 26800, start: '2024-06-01', expiry: '2026-11-11', fieldId: 'al-shaheen', confidence: 90, verifiedBy: 'D. Kaabi' },
  { id: 'ct-1004', imo: '9702118', charterer: 'Kuwait Oil Company', chartererId: 'kuwait-oil', rate: 14200, start: '2025-03-01', expiry: '2027-02-26', fieldId: 'al-wafra', confidence: 84 },
  { id: 'ct-1005', imo: '9588122', charterer: 'Saudi Aramco', chartererId: 'saudi-aramco', rate: 16000, start: '2025-08-01', expiry: '2027-07-26', fieldId: 'safaniya-field', confidence: 91 },
  { id: 'ct-1006', imo: '9612847', charterer: '—', chartererId: '', rate: null, start: '2025-03-01', expiry: '2026-08-01', fieldId: 'safaniya-field', confidence: 95, verifiedBy: 'D. Kaabi' },
];

/** Extends the hand-written charter book across the wider fleet. */
function generated(): Contract[] {
  const charterers = [
    { name: 'Saudi Aramco', id: 'saudi-aramco' },
    { name: 'ADNOC Offshore', id: 'adnoc-offshore' },
    { name: 'QatarEnergy', id: 'qatarenergy' },
    { name: 'Kuwait Oil Company', id: 'kuwait-oil' },
    { name: 'Saipem', id: 'saipem' },
    { name: 'NMDC Energy', id: 'nmdc-energy' },
  ];
  const out: Contract[] = [];
  const onHire = VESSELS.filter((v) => v.status === 'On hire' && !SEEDS.some((s) => s.imo === v.imo));

  onHire.slice(0, 28).forEach((v, i) => {
    const c = charterers[i % charterers.length];
    const bm = findBenchmark(v.region, v.subType, v.sizeClass);
    const variance = ((i * 37) % 23) - 11;
    const rate = bm ? Math.round((bm.mid * (1 + variance / 100)) / 100) * 100 : 14000;
    const expiryDays = 20 + ((i * 53) % 700);
    const expiry = new Date(TODAY.getTime() + expiryDays * 86400000).toISOString().slice(0, 10);
    const start = new Date(TODAY.getTime() - (200 + ((i * 71) % 500)) * 86400000).toISOString().slice(0, 10);

    out.push({
      id: `ct-2${String(i).padStart(3, '0')}`,
      vesselImo: v.imo,
      vesselName: v.name,
      subType: v.subType,
      sizeClass: v.sizeClass,
      charterer: c.name,
      chartererId: c.id,
      ownerId: v.ownerId,
      charterType: i % 9 === 0 ? 'BB' : i % 7 === 0 ? 'Framework' : 'TC',
      ratePerDay: rate,
      vsBenchmarkPct: variance,
      startDate: start,
      expiryDate: expiry,
      region: v.region,
      fieldId: v.ais.zoneId,
      status: statusFor(expiry, false),
      provenance: prov(
        70 + ((i * 13) % 26),
        i % 3 === 0 ? 'broker' : i % 3 === 1 ? 'operator' : 'customer',
        i % 3 === 0 ? 'Broker fixture report' : i % 3 === 1 ? 'Operator disclosure' : 'Customer charter book',
        '2026-08-21',
      ),
    });
  });

  return out;
}

export const CONTRACTS: Contract[] = [
  ...SEEDS.map((s) => {
    const v = VESSELS.find((x) => x.imo === s.imo)!;
    const bm = findBenchmark(v.region, v.subType, v.sizeClass);
    const offHire = s.rate === null;
    return {
      id: s.id,
      vesselImo: v.imo,
      vesselName: v.name,
      subType: v.subType,
      sizeClass: v.sizeClass,
      charterer: s.charterer,
      chartererId: s.chartererId,
      ownerId: v.ownerId,
      charterType: s.charterType ?? 'TC',
      ratePerDay: s.rate,
      vsBenchmarkPct: s.rate && bm ? Math.round(((s.rate - bm.mid) / bm.mid) * 100) : null,
      startDate: s.start,
      expiryDate: s.expiry,
      region: v.region,
      fieldId: s.fieldId,
      status: statusFor(s.expiry, offHire),
      provenance: prov(s.confidence ?? 85, 'broker', 'Broker fixture report', '2026-08-21', s.verifiedBy),
    } satisfies Contract;
  }),
  ...generated(),
];

export const CONTRACT_BY_ID = new Map(CONTRACTS.map((c) => [c.id, c]));

export const CONTRACTS_BY_IMO = CONTRACTS.reduce<Record<string, Contract[]>>((acc, c) => {
  (acc[c.vesselImo] ||= []).push(c);
  return acc;
}, {});

export const ANNUALISED_CONTRACT_VALUE = CONTRACTS.filter((c) => c.ratePerDay).reduce(
  (sum, c) => sum + (c.ratePerDay ?? 0) * 365,
  0,
);
