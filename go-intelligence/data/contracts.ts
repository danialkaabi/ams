import type { Contract } from './types';

/**
 * GO CONTRACTS — your charter book.
 *
 * Empty by design. Add fixtures here and the charter book, expiry
 * countdowns, renewal-exposure chart and contract KPIs populate.
 *
 * Minimum required fields: id, vesselImo, vesselName, vesselType,
 * charterer, charterType, status.
 * See data/types.ts for the full schema.
 */
export const CONTRACTS: Contract[] = [];

export function getContract(id: string): Contract | undefined {
  return CONTRACTS.find((c) => c.id === id);
}
