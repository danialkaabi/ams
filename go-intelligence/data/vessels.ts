import type { Vessel } from './types';

/**
 * GO FLEET — your vessel records.
 *
 * Empty by design. Add vessels here and GO Fleet, the live map, the
 * dashboard and every vessel profile populate automatically.
 *
 * Minimum required fields: imo, name, category, subType, status.
 * See data/types.ts for the full schema and lib/taxonomy.ts for the
 * allowed values.
 *
 * Example:
 *
 *   export const VESSELS: Vessel[] = [
 *     {
 *       imo: '9784521',
 *       name: 'Example Vessel',
 *       category: 'OSV',
 *       subType: 'AHTS',
 *       sizeClass: 'AHTS (Large)',
 *       status: 'On Hire',
 *       flag: 'Panama',
 *       built: 2018,
 *       region: 'Middle East Gulf',
 *     },
 *   ];
 */
export const VESSELS: Vessel[] = [];

export function getVessel(imo: string): Vessel | undefined {
  return VESSELS.find((v) => v.imo === imo);
}
