import type { RateBenchmark, UtilisationPoint } from './types';

/**
 * GO MARKET — day-rate benchmarks and regional utilisation.
 *
 * Empty by design. Add benchmarks here and the market screen, the rate
 * ticker on the dashboard and the rate-vs-benchmark variance column in
 * the charter book all populate.
 *
 * Example:
 *
 *   export const RATE_BENCHMARKS: RateBenchmark[] = [
 *     {
 *       region: 'Middle East Gulf',
 *       sizeClass: 'AHTS (Medium)',
 *       lowUsdPerDay: 16000,
 *       highUsdPerDay: 24000,
 *     },
 *   ];
 */
export const RATE_BENCHMARKS: RateBenchmark[] = [];

export const UTILISATION: UtilisationPoint[] = [];

/** Look up the benchmark band for a region and size class. */
export function benchmarkFor(
  region: string,
  sizeClass: string,
): RateBenchmark | undefined {
  return RATE_BENCHMARKS.find(
    (b) => b.region === region && b.sizeClass === sizeClass,
  );
}
