import type { Account } from './types';

/**
 * The signed-in account.
 *
 * Placeholder values so the shell renders. Replace with a real session
 * once authentication is wired up — the tier drives which capabilities
 * (Excel export, API access) are offered across the platform.
 */
export const ACCOUNT: Account = {
  organisation: 'Gemini Offshore',
  tier: 'noc-epc',
  userName: 'Account Owner',
  userRole: 'Operations',
};
