import type { Alert } from './types';

/**
 * GO ALERTS — renewal dates, off-hire events, zone entry and rate moves.
 *
 * Empty by design. Add alerts here, or wire this module to a live rules
 * engine later; the alert feed and the topbar badge read from it either way.
 */
export const ALERTS: Alert[] = [];

export const unreadAlerts = () => ALERTS.filter((a) => !a.read);
