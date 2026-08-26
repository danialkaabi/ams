import type { RateBenchmark, RegionalUtilisation, Region, SizeClass, Trend, VesselSubType } from './types';
import { REGIONS } from './types';
import { prov } from './provenance';

/** Middle East Gulf anchors from the strategy book; other basins scaled off these. */
const ME_ANCHORS: { subType: VesselSubType; sizeClass: SizeClass; mid: number; trend: Trend }[] = [
  { subType: 'PSV', sizeClass: 'Small', mid: 9500, trend: 'up' },
  { subType: 'PSV', sizeClass: 'Medium', mid: 15000, trend: 'up' },
  { subType: 'PSV', sizeClass: 'Large', mid: 19500, trend: 'flat' },
  { subType: 'AHTS', sizeClass: 'Small', mid: 11000, trend: 'down' },
  { subType: 'AHTS', sizeClass: 'Medium', mid: 20000, trend: 'up' },
  { subType: 'AHTS', sizeClass: 'Large', mid: 27500, trend: 'up' },
  { subType: 'AHTS', sizeClass: 'Very Large', mid: 38000, trend: 'flat' },
  { subType: 'AHTS', sizeClass: 'Super Large', mid: 52000, trend: 'up' },
];

/** Basin premium/discount vs the Middle East Gulf. */
const REGION_FACTOR: Record<Region, number> = {
  'Middle East Gulf': 1,
  'North Sea': 1.34,
  'Gulf of Mexico': 1.12,
  'West Africa': 1.06,
  'South East Asia': 0.88,
};

const REGION_TREND_SHIFT: Record<Region, number> = {
  'Middle East Gulf': 0,
  'North Sea': 1,
  'Gulf of Mexico': -1,
  'West Africa': 0,
  'South East Asia': -1,
};

function history(mid: number, trend: Trend, salt: number): number[] {
  const drift = trend === 'up' ? 0.011 : trend === 'down' ? -0.008 : 0.001;
  const out: number[] = [];
  for (let m = 11; m >= 0; m--) {
    const wobble = Math.sin((m + salt) * 1.7) * 0.022;
    out.push(Math.round((mid * (1 - drift * m)) * (1 + wobble)));
  }
  return out;
}

export const BENCHMARKS: RateBenchmark[] = REGIONS.flatMap((region, ri) =>
  ME_ANCHORS.map((a, ai) => {
    const mid = Math.round((a.mid * REGION_FACTOR[region]) / 100) * 100;
    const shift = REGION_TREND_SHIFT[region];
    const trend: Trend =
      shift === 0 ? a.trend : shift > 0 ? 'up' : a.trend === 'up' ? 'flat' : 'down';
    return {
      id: `${region}-${a.subType}-${a.sizeClass}`.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      region,
      subType: a.subType,
      sizeClass: a.sizeClass,
      low: Math.round((mid * 0.8) / 100) * 100,
      high: Math.round((mid * 1.2) / 100) * 100,
      mid,
      trend,
      changePct: +((trend === 'up' ? 1 : trend === 'down' ? -1 : 0.2) * (1.2 + ((ri + ai) % 5) * 0.6)).toFixed(1),
      history: history(mid, trend, ri * 3 + ai),
      provenance: prov(
        86 - ((ri + ai) % 7),
        'broker',
        'Aggregated broker fixtures (rolling 90 days)',
        '2026-08-22',
        ri === 0 ? 'A. Choolun' : undefined,
      ),
    };
  }),
);

export const BENCHMARK_BY_KEY = new Map(BENCHMARKS.map((b) => [`${b.region}|${b.subType}|${b.sizeClass}`, b]));

/** Falls back up the size ladder so every vessel can be benchmarked against something. */
export function findBenchmark(region: Region, subType: VesselSubType, sizeClass: SizeClass) {
  return (
    BENCHMARK_BY_KEY.get(`${region}|${subType}|${sizeClass}`) ??
    BENCHMARK_BY_KEY.get(`${region}|${subType}|Medium`) ??
    BENCHMARK_BY_KEY.get(`${region}|PSV|Medium`)
  );
}

export const UTILISATION: RegionalUtilisation[] = [
  { region: 'Middle East Gulf', utilisationPct: 84, yearAgoPct: 76, vesselCount: 412 },
  { region: 'West Africa', utilisationPct: 78, yearAgoPct: 74, vesselCount: 168 },
  { region: 'South East Asia', utilisationPct: 81, yearAgoPct: 79, vesselCount: 233 },
  { region: 'North Sea', utilisationPct: 88, yearAgoPct: 85, vesselCount: 191 },
  { region: 'Gulf of Mexico', utilisationPct: 76, yearAgoPct: 80, vesselCount: 147 },
];
