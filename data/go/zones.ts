import type { Zone } from './types';

/**
 * Spatial layer seed. `x`/`y` are 0–100 canvas coordinates for the schematic
 * map renderer; `lat`/`lon` are the real anchors the production map will use
 * once the tile layer is wired in.
 */
export const ZONES: Zone[] = [
  {
    id: 'safaniya-field',
    name: 'Safaniya Field',
    kind: 'field',
    operator: 'Saudi Aramco',
    region: 'Middle East Gulf',
    x: 30, y: 30, w: 44, h: 42,
    lat: 27.9, lon: 49.15,
    utilisationPct: 82,
    utilisationYearAgoPct: 68,
  },
  { id: 'block-12', name: 'Block 12', kind: 'block', operator: 'Saudi Aramco', region: 'Middle East Gulf', x: 6, y: 12, w: 22, h: 30, lat: 28.4, lon: 48.7 },
  { id: 'block-19', name: 'Block 19', kind: 'block', operator: 'Saudi Aramco', region: 'Middle East Gulf', x: 76, y: 18, w: 20, h: 28, lat: 28.1, lon: 49.8 },
  { id: 'hub-platform', name: 'Hub Platform', kind: 'platform', operator: 'Saudi Aramco', region: 'Middle East Gulf', x: 52, y: 47, lat: 27.92, lon: 49.2 },
  { id: 'safaniya-wp-7', name: 'Wellhead Platform 7', kind: 'platform', operator: 'Saudi Aramco', region: 'Middle East Gulf', x: 38, y: 58, lat: 27.83, lon: 49.05 },
  { id: 'safaniya-wp-11', name: 'Wellhead Platform 11', kind: 'platform', operator: 'Saudi Aramco', region: 'Middle East Gulf', x: 66, y: 62, lat: 27.79, lon: 49.31 },
  { id: 'trunkline-a', name: 'Trunkline A', kind: 'pipeline', operator: 'Saudi Aramco', region: 'Middle East Gulf', x: 38, y: 59, w: 28, h: 1, lat: 27.81, lon: 49.18 },
  { id: 'ras-tanura', name: 'Ras Tanura', kind: 'port', operator: 'Saudi Aramco', region: 'Middle East Gulf', x: 14, y: 82, lat: 26.64, lon: 50.16 },
  { id: 'upper-zakum', name: 'Upper Zakum Field', kind: 'field', operator: 'ADNOC Offshore', region: 'Middle East Gulf', x: 0, y: 0, w: 0, h: 0, lat: 24.87, lon: 53.13, utilisationPct: 79, utilisationYearAgoPct: 72 },
  { id: 'al-shaheen', name: 'Al Shaheen Field', kind: 'field', operator: 'QatarEnergy', region: 'Middle East Gulf', x: 0, y: 0, w: 0, h: 0, lat: 26.55, lon: 52.02, utilisationPct: 86, utilisationYearAgoPct: 81 },
  { id: 'bul-hanine', name: 'Bul Hanine Field', kind: 'field', operator: 'QatarEnergy', region: 'Middle East Gulf', x: 0, y: 0, w: 0, h: 0, lat: 25.65, lon: 52.25, utilisationPct: 74, utilisationYearAgoPct: 70 },
  { id: 'hail-ghasha', name: 'Hail & Ghasha', kind: 'field', operator: 'ADNOC Offshore', region: 'Middle East Gulf', x: 0, y: 0, w: 0, h: 0, lat: 24.55, lon: 52.6, utilisationPct: 69, utilisationYearAgoPct: 61 },
  { id: 'al-wafra', name: 'Al Wafra Field', kind: 'field', operator: 'Kuwait Oil Company', region: 'Middle East Gulf', x: 0, y: 0, w: 0, h: 0, lat: 28.62, lon: 47.93, utilisationPct: 71, utilisationYearAgoPct: 73 },
];

export const ZONE_BY_ID = new Map(ZONES.map((z) => [z.id, z]));

/** The zones drawn on the Safaniya schematic in GO Maps. */
export const SAFANIYA_LAYERS = ZONES.filter((z) => z.w !== 0 || z.kind === 'platform' || z.kind === 'port');
