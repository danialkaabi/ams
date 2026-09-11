import type { Company } from './types';

/**
 * GO COMPANIES — your owner, operator and counterparty records.
 *
 * Empty by design. Add companies here; vessels reference them by `id`
 * through their seven management-tier fields.
 *
 * Minimum required fields: id, name, type.
 * See data/types.ts for the full schema.
 *
 * Example:
 *
 *   export const COMPANIES: Company[] = [
 *     {
 *       id: 'example-marine',
 *       name: 'Example Marine Services',
 *       type: 'OSV Owner / Operator',
 *       country: 'United Arab Emirates',
 *       headquarters: 'Dubai, UAE',
 *       founded: 1997,
 *       fleetSize: 34,
 *     },
 *   ];
 */
export const COMPANIES: Company[] = [];

export function getCompany(id: string): Company | undefined {
  return COMPANIES.find((c) => c.id === id);
}

/** Resolve a company id to its display name, for table cells. */
export function companyName(id?: string): string | undefined {
  if (!id) return undefined;
  return COMPANIES.find((c) => c.id === id)?.name;
}
