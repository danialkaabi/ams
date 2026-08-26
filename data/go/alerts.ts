import type { Alert } from './types';

export const ALERTS: Alert[] = [
  { id: 'al-1', kind: 'contract-renewal', severity: 'critical', title: 'Contract renewal due — GO Endeavour', detail: 'Charter with Saudi Aramco at Safaniya Field expires in 18 days. Rate sits well below the Medium AHTS benchmark for the Middle East Gulf — renewing at benchmark recovers the gap.', entityType: 'contract', entityId: 'ct-1001', raisedAt: '2026-08-26T06:10:00Z', ageLabel: '2h ago', read: false },
  { id: 'al-2', kind: 'off-hire', severity: 'warning', title: 'Gulf Pioneer went off hire', detail: 'PSV (Medium) released by Saudi Aramco at Safaniya Field. Available immediately — 3 open tenders in the basin match its class.', entityType: 'vessel', entityId: '9612847', raisedAt: '2026-08-26T02:00:00Z', ageLabel: '6h ago', read: false },
  { id: 'al-3', kind: 'zone-entry', severity: 'info', title: 'Vessel entered zone — Hub Platform', detail: 'Falcon Guard (AHTS) entered the 500m zone around Hub Platform, Safaniya Field.', entityType: 'vessel', entityId: '9801447', raisedAt: '2026-08-26T04:20:00Z', ageLabel: '4h ago', read: false },
  { id: 'al-4', kind: 'tender-open', severity: 'warning', title: 'Tender opened — Hail & Ghasha Sour Gas', detail: 'ADNOC Offshore opened bidding for 11 OSVs. Closes 30 September 2026.', entityType: 'project', entityId: 'pr-hail-ghasha', raisedAt: '2026-08-25T09:00:00Z', ageLabel: '1d ago', read: false },
  { id: 'al-5', kind: 'rate-move', severity: 'info', title: 'Benchmark moved — Medium AHTS, ME Gulf', detail: 'Midpoint up 3.4% over 30 days to $20,000/day on tightening supply.', entityType: 'market', entityId: 'middle-east-gulf-ahts-medium', raisedAt: '2026-08-25T05:00:00Z', ageLabel: '1d ago', read: true },
  { id: 'al-6', kind: 'ownership-change', severity: 'warning', title: 'Ownership change — Falcon Marine Services', detail: 'Registered owner of two Large AHTS moved to a new Marshall Islands SPV. Chain re-verified to 7 tiers; no adverse flags.', entityType: 'company', entityId: 'falcon-marine', raisedAt: '2026-08-24T11:30:00Z', ageLabel: '2d ago', read: true },
  { id: 'al-7', kind: 'contract-renewal', severity: 'warning', title: 'Renewal window opens — Zamil Voyager', detail: 'ADNOC Offshore charter expires in 42 days. Current rate 5% above benchmark.', entityType: 'contract', entityId: 'ct-1002', raisedAt: '2026-08-24T08:00:00Z', ageLabel: '2d ago', read: true },
  { id: 'al-8', kind: 'zone-exit', severity: 'info', title: 'Vessel left zone — Safaniya Field', detail: 'Al Wakrah Supply (PSV) departed the field boundary heading 152°.', entityType: 'vessel', entityId: '9702118', raisedAt: '2026-08-23T16:45:00Z', ageLabel: '3d ago', read: true },
];

export const UNREAD_ALERTS = ALERTS.filter((a) => !a.read).length;

/** Alert rule templates offered when a user creates a new watch. */
export const ALERT_RULES = [
  { id: 'rule-1', name: 'Charter expiring within 90 days', scope: 'My Portfolio', channel: 'Email + Push', active: true },
  { id: 'rule-2', name: 'Any portfolio vessel goes off hire', scope: 'My Portfolio', channel: 'Push', active: true },
  { id: 'rule-3', name: 'Vessel enters Safaniya Field', scope: 'Safaniya Field', channel: 'In-app', active: true },
  { id: 'rule-4', name: 'New tender opened — ME Gulf, OSV scope', scope: 'Middle East Gulf', channel: 'Email', active: true },
  { id: 'rule-5', name: 'Benchmark moves more than 5% in 30 days', scope: 'AHTS · all sizes', channel: 'Email', active: false },
  { id: 'rule-6', name: 'Ownership chain change on a counterparty', scope: 'Watched companies', channel: 'Email + Push', active: true },
];
