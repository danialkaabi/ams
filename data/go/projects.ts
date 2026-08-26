import type { Project } from './types';
import { prov } from './provenance';

export const PROJECTS: Project[] = [
  {
    id: 'pr-safaniya-3', name: 'Safaniya Expansion Ph. 3', field: 'Safaniya Field', fieldId: 'safaniya-field',
    operator: 'Saudi Aramco', operatorId: 'saudi-aramco', region: 'Middle East Gulf',
    capexUsd: 2_100_000_000, vesselsNeeded: 12, vesselTypes: ['AHTS', 'PSV', 'CONSTRUCTION / OCV'],
    phase: 'Execution', epcContractor: 'McDermott International', firstOilTarget: '2027-Q2',
    provenance: prov(90, 'operator', 'Operator capital programme', '2026-08-10', 'A. Choolun'),
  },
  {
    id: 'pr-uz-750', name: 'Upper Zakum UZ-750', field: 'Upper Zakum Field', fieldId: 'upper-zakum',
    operator: 'ADNOC Offshore', operatorId: 'adnoc-offshore', region: 'Middle East Gulf',
    capexUsd: 1_800_000_000, vesselsNeeded: 9, vesselTypes: ['AHTS', 'PSV'],
    phase: 'Mobilising', epcContractor: 'NMDC Energy', firstOilTarget: '2028-Q1',
    provenance: prov(87, 'public-filing', 'EPC award announcement', '2026-07-29'),
  },
  {
    id: 'pr-al-shaheen-infill', name: 'Al Shaheen Infill', field: 'Al Shaheen Field', fieldId: 'al-shaheen',
    operator: 'QatarEnergy', operatorId: 'qatarenergy', region: 'Middle East Gulf',
    capexUsd: 1_400_000_000, vesselsNeeded: 8, vesselTypes: ['PSV', 'AHTS'],
    phase: 'Awarded', epcContractor: 'Saipem', firstOilTarget: '2028-Q3',
    provenance: prov(85, 'public-filing', 'Operator press release', '2026-08-03'),
  },
  {
    id: 'pr-bul-hanine', name: 'Bul Hanine Redevelopment', field: 'Bul Hanine Field', fieldId: 'bul-hanine',
    operator: 'QatarEnergy', operatorId: 'qatarenergy', region: 'Middle East Gulf',
    capexUsd: 1_200_000_000, vesselsNeeded: 7, vesselTypes: ['PSV', 'AHTS', 'DSV'],
    phase: 'Tender', tenderCloses: '2026-10-15',
    provenance: prov(76, 'broker', 'Tender bulletin', '2026-08-19'),
  },
  {
    id: 'pr-hail-ghasha', name: 'Hail & Ghasha Sour Gas', field: 'Hail & Ghasha', fieldId: 'hail-ghasha',
    operator: 'ADNOC Offshore', operatorId: 'adnoc-offshore', region: 'Middle East Gulf',
    capexUsd: 1_700_000_000, vesselsNeeded: 11, vesselTypes: ['AHTS', 'PSV', 'ACCOMMODATION'],
    phase: 'Tender', tenderCloses: '2026-09-30',
    provenance: prov(79, 'broker', 'Tender bulletin', '2026-08-22'),
  },
  {
    id: 'pr-manifa-4', name: 'Manifa Phase 4', field: 'Manifa Field',
    operator: 'Saudi Aramco', operatorId: 'saudi-aramco', region: 'Middle East Gulf',
    capexUsd: 900_000_000, vesselsNeeded: 6, vesselTypes: ['PSV', 'CREW BOAT'],
    phase: 'Execution', epcContractor: 'Saipem', firstOilTarget: '2027-Q1',
    provenance: prov(83, 'operator', 'Operator capital programme', '2026-07-31'),
  },
  {
    id: 'pr-marjan-inc', name: 'Marjan Increment Programme', field: 'Marjan Field',
    operator: 'Saudi Aramco', operatorId: 'saudi-aramco', region: 'Middle East Gulf',
    capexUsd: 1_100_000_000, vesselsNeeded: 8, vesselTypes: ['AHTS', 'CONSTRUCTION / OCV'],
    phase: 'Mobilising', epcContractor: 'McDermott International', firstOilTarget: '2027-Q4',
    provenance: prov(81, 'public-filing', 'EPC award announcement', '2026-08-08'),
  },
  {
    id: 'pr-al-wafra-redev', name: 'Al Wafra Redevelopment', field: 'Al Wafra Field', fieldId: 'al-wafra',
    operator: 'Kuwait Oil Company', operatorId: 'kuwait-oil', region: 'Middle East Gulf',
    capexUsd: 640_000_000, vesselsNeeded: 5, vesselTypes: ['PSV', 'STANDBY / ERRV'],
    phase: 'Awarded', epcContractor: 'NMDC Energy', firstOilTarget: '2029-Q1',
    provenance: prov(74, 'broker', 'Market intelligence', '2026-08-12'),
  },
  {
    id: 'pr-north-field-e', name: 'North Field East Marine Support', field: 'North Field',
    operator: 'QatarEnergy', operatorId: 'qatarenergy', region: 'Middle East Gulf',
    capexUsd: 480_000_000, vesselsNeeded: 9, vesselTypes: ['OCEAN GOING TUG', 'PSV'],
    phase: 'First Oil', firstOilTarget: '2026-Q3',
    provenance: prov(88, 'operator', 'Operator disclosure', '2026-08-14', 'D. Kaabi'),
  },
  {
    id: 'pr-zuluf-jacket', name: 'Zuluf Jacket Installation', field: 'Zuluf Field',
    operator: 'Saudi Aramco', operatorId: 'saudi-aramco', region: 'Middle East Gulf',
    capexUsd: 750_000_000, vesselsNeeded: 4, vesselTypes: ['CONSTRUCTION / OCV', 'AHTS'],
    phase: 'Execution', epcContractor: 'McDermott International', firstOilTarget: '2027-Q3',
    provenance: prov(80, 'operator', 'Operator capital programme', '2026-08-06'),
  },
  {
    id: 'pr-das-island', name: 'Das Island Terminal Upgrade', field: 'Das Island',
    operator: 'ADNOC Offshore', operatorId: 'adnoc-offshore', region: 'Middle East Gulf',
    capexUsd: 320_000_000, vesselsNeeded: 4, vesselTypes: ['OCEAN GOING TUG', 'CREW BOAT'],
    phase: 'Tender', tenderCloses: '2026-11-05',
    provenance: prov(72, 'broker', 'Tender bulletin', '2026-08-20'),
  },
  {
    id: 'pr-ruwais-subsea', name: 'Ruwais Subsea Tie-back', field: 'Ruwais',
    operator: 'ADNOC Offshore', operatorId: 'adnoc-offshore', region: 'Middle East Gulf',
    capexUsd: 410_000_000, vesselsNeeded: 3, vesselTypes: ['DSV', 'CONSTRUCTION / OCV'],
    phase: 'Tender', tenderCloses: '2026-09-18',
    provenance: prov(70, 'broker', 'Tender bulletin', '2026-08-23'),
  },
];

export const PROJECT_BY_ID = new Map(PROJECTS.map((p) => [p.id, p]));
export const COMBINED_CAPEX = PROJECTS.reduce((s, p) => s + p.capexUsd, 0);
export const FORECAST_VESSEL_DEMAND = PROJECTS.reduce((s, p) => s + p.vesselsNeeded, 0);
export const OPEN_TENDERS = PROJECTS.filter((p) => p.phase === 'Tender').length;
