import type {
  OwnershipTier,
  Region,
  SizeClass,
  Vessel,
  VesselCategory,
  VesselStatus,
  VesselSubType,
} from './types';
import { prov } from './provenance';

type OwnershipSeed = {
  beneficialOwner: string;
  registeredOwner?: string;
  commercialManager?: string;
  operator?: string;
  commerciallyControlled?: string;
  technicalManager?: string;
  ismManager?: string;
};

/** Collapses a partial chain to the full seven tiers, defaulting each to the beneficial owner. */
function chain(seed: OwnershipSeed): Record<OwnershipTier, string> {
  const b = seed.beneficialOwner;
  return {
    beneficialOwner: b,
    registeredOwner: seed.registeredOwner ?? b,
    commercialManager: seed.commercialManager ?? b,
    operator: seed.operator ?? b,
    commerciallyControlled: seed.commerciallyControlled ?? b,
    technicalManager: seed.technicalManager ?? b,
    ismManager: seed.ismManager ?? b,
  };
}

/**
 * Named vessels — the ones the strategy book walks through, plus enough
 * neighbours to make the Safaniya cluster on GO Maps read correctly.
 */
const HERO: Vessel[] = [
  {
    imo: '9784521',
    mmsi: '353998000',
    name: 'GO Endeavour',
    category: 'OSV',
    subType: 'AHTS',
    sizeClass: 'Medium',
    built: 2018,
    flag: 'Panama',
    dwt: 3200,
    bollardPullT: 150,
    bhp: 12240,
    eexiBand: 'B',
    dpClass: 'DP2',
    region: 'Middle East Gulf',
    status: 'On hire',
    ownerId: 'falcon-marine',
    ownership: chain({
      beneficialOwner: 'Falcon Marine Services',
      registeredOwner: 'Falcon Endeavour Shipping Ltd',
      technicalManager: 'Falcon Ship Management FZE',
      ismManager: 'Falcon Ship Management FZE',
    }),
    ais: { lat: 27.9, lon: 49.15, ageHours: 0.6, status: 'On DP', speedKn: 0.2, headingDeg: 118, zoneId: 'safaniya-field', daysInZone: 34 },
    fieldOperator: 'Saudi Aramco',
    operatingIn: 'Safaniya Field',
    provenance: prov(93, 'registry', 'IMO GISIS + Panama registry', '2026-08-18', 'A. Choolun'),
  },
  {
    imo: '9612847',
    mmsi: '538007412',
    name: 'Gulf Pioneer',
    category: 'OSV',
    subType: 'PSV',
    sizeClass: 'Medium',
    built: 2013,
    flag: 'Marshall Islands',
    dwt: 4100,
    deckAreaM2: 780,
    bhp: 7200,
    eexiBand: 'C',
    dpClass: 'DP2',
    region: 'Middle East Gulf',
    status: 'Off hire',
    ownerId: 'meridian-offshore',
    ownership: chain({
      beneficialOwner: 'Meridian Offshore',
      registeredOwner: 'Meridian Pioneer Navigation Inc',
      commercialManager: 'Meridian Chartering DMCC',
      technicalManager: 'Meridian Technical Services',
      ismManager: 'Meridian Technical Services',
    }),
    ais: { lat: 27.84, lon: 49.09, ageHours: 1.4, status: 'At anchor', speedKn: 0, headingDeg: 42, zoneId: 'safaniya-field', daysInZone: 9 },
    fieldOperator: 'Saudi Aramco',
    operatingIn: 'Safaniya Field',
    provenance: prov(90, 'registry', 'Marshall Islands registry', '2026-08-19', 'D. Kaabi'),
  },
  {
    imo: '9801447',
    mmsi: '353998221',
    name: 'Falcon Guard',
    category: 'OSV',
    subType: 'AHTS',
    sizeClass: 'Large',
    built: 2019,
    flag: 'Panama',
    dwt: 3300,
    bollardPullT: 155,
    bhp: 12500,
    eexiBand: 'B',
    dpClass: 'DP2',
    region: 'Middle East Gulf',
    status: 'On hire',
    ownerId: 'falcon-marine',
    ownership: chain({
      beneficialOwner: 'Falcon Marine Services',
      registeredOwner: 'Falcon Guard Shipping Ltd',
      technicalManager: 'Falcon Ship Management FZE',
      ismManager: 'Falcon Ship Management FZE',
    }),
    ais: { lat: 27.95, lon: 49.22, ageHours: 0.9, status: 'On DP', speedKn: 0.4, headingDeg: 271, zoneId: 'safaniya-field', daysInZone: 21 },
    fieldOperator: 'Saudi Aramco',
    operatingIn: 'Safaniya Field',
    provenance: prov(91, 'registry', 'IMO GISIS + Panama registry', '2026-08-17'),
  },
  {
    imo: '9655013',
    mmsi: '403512900',
    name: 'Zamil Voyager',
    category: 'OSV',
    subType: 'AHTS',
    sizeClass: 'Large',
    built: 2014,
    flag: 'Saudi Arabia',
    dwt: 2900,
    bollardPullT: 140,
    bhp: 11000,
    eexiBand: 'C',
    dpClass: 'DP2',
    region: 'Middle East Gulf',
    status: 'Standby',
    ownerId: 'zamil-marine',
    ownership: chain({ beneficialOwner: 'Zamil Offshore Marine' }),
    ais: { lat: 27.87, lon: 49.2, ageHours: 1.1, status: 'Underway', speedKn: 6.2, headingDeg: 95, zoneId: 'safaniya-field', daysInZone: 12 },
    fieldOperator: 'Saudi Aramco',
    operatingIn: 'Safaniya Field',
    provenance: prov(92, 'registry', 'Saudi flag registry', '2026-08-16', 'A. Choolun'),
  },
  {
    imo: '9702118',
    mmsi: '403512744',
    name: 'Al Wakrah Supply',
    category: 'OSV',
    subType: 'PSV',
    sizeClass: 'Medium',
    built: 2016,
    flag: 'Qatar',
    dwt: 4300,
    deckAreaM2: 820,
    bhp: 7600,
    eexiBand: 'B',
    dpClass: 'DP2',
    region: 'Middle East Gulf',
    status: 'Transit',
    ownerId: 'zamil-marine',
    ownership: chain({ beneficialOwner: 'Zamil Offshore Marine', commercialManager: 'Zamil Chartering' }),
    ais: { lat: 27.75, lon: 49.05, ageHours: 0.4, status: 'Underway', speedKn: 10.8, headingDeg: 152, zoneId: 'safaniya-field', daysInZone: 2 },
    fieldOperator: 'Saudi Aramco',
    operatingIn: 'Safaniya Field',
    provenance: prov(89, 'ais', 'Terrestrial AIS + registry', '2026-08-20'),
  },
  {
    imo: '9588122',
    mmsi: '431500912',
    name: 'Stanford Kite',
    category: 'OSV',
    subType: 'PSV',
    sizeClass: 'Medium',
    built: 2012,
    flag: 'Panama',
    dwt: 3900,
    deckAreaM2: 760,
    bhp: 7000,
    eexiBand: 'C',
    dpClass: 'DP2',
    region: 'Middle East Gulf',
    status: 'On hire',
    ownerId: 'stanford-marine',
    ownership: chain({
      beneficialOwner: 'Stanford Marine',
      registeredOwner: 'Stanford Kite Shipping Ltd',
      technicalManager: 'Stanford Marine Ship Management',
      ismManager: 'Stanford Marine Ship Management',
    }),
    ais: { lat: 26.94, lon: 50.42, ageHours: 2.2, status: 'Moored', speedKn: 0, headingDeg: 20 },
    fieldOperator: 'Saudi Aramco',
    operatingIn: 'Ras Tanura',
    provenance: prov(94, 'registry', 'IMO GISIS', '2026-08-12', 'A. Choolun'),
  },
];

/* ------------------------------------------------------------------ *
 * Deterministic fleet expansion
 *
 * Fills the database out to a realistic size so the GO Fleet query builder,
 * regional utilisation and company profiles all have something to bite on.
 * Seeded PRNG so IMOs, positions and statuses are stable across renders.
 * ------------------------------------------------------------------ */

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

const NAME_STEMS: Record<string, string[]> = {
  'stanford-marine': ['Stanford Condor', 'Stanford Goshawk', 'Stanford Osprey', 'Stanford Caracara', 'Stanford Falcon', 'Stanford Merlin', 'Stanford Kestrel', 'Stanford Harrier', 'Stanford Buzzard', 'Stanford Eagle'],
  'zamil-marine': ['Zamil 51', 'Zamil 57', 'Zamil 63', 'Zamil Endurance', 'Zamil Pearl', 'Zamil Dammam', 'Zamil Jubail', 'Zamil Khafji', 'Zamil Marjan', 'Zamil Berri', 'Zamil Manifa', 'Zamil Qatif'],
  'falcon-marine': ['Falcon Sentinel', 'Falcon Warrior', 'Falcon Trader', 'Falcon Horizon', 'Falcon Sovereign', 'Falcon Ranger', 'Falcon Dawn'],
  'meridian-offshore': ['Meridian Star', 'Meridian Trader', 'Meridian Spirit', 'Meridian Crest', 'Meridian Reach', 'Meridian Atlas', 'Meridian Summit', 'Meridian Vantage', 'Meridian Beacon'],
  'halul-offshore': ['Halul 51', 'Halul 62', 'Halul 74', 'Al Shaheen Star', 'Al Khor Supply', 'Doha Provider', 'Ras Laffan Guard', 'Dukhan Tide'],
  tidewater: ['Tidewater Enabler', 'Tidewater Provider', 'Tidewater Ranger', 'Tidewater Sentinel', 'Tidewater Voyager', 'Tidewater Pioneer', 'Tidewater Endeavour', 'Tidewater Resolute', 'Tidewater Frontier', 'Tidewater Meridian', 'Tidewater Horizon', 'Tidewater Vanguard'],
  'po-maritime': ['P&O Zakum', 'P&O Das', 'P&O Umm Shaif', 'P&O Ruwais', 'P&O Mubarraz', 'P&O Arzanah', 'P&O Nasr', 'P&O Sirri', 'P&O Delma'],
  ams: ['AMS Laffan 1', 'AMS Laffan 2', 'AMS Laffan 3', 'AMS Laffan 4', 'AMS Najam', 'AMS Al Wakra 1', 'AMS Khattaf', 'AMS Halul Guard'],
  saipem: ['Saipem Constructor', 'Saipem Installer', 'Saipem Castoro', 'Saipem Field Star'],
  'nmdc-energy': ['NMDC Falcon', 'NMDC Installer', 'NMDC Marine 7', 'NMDC Constructor', 'NMDC Support 3'],
  mcdermott: ['DB Intrepid', 'DB Resolute', 'North Ocean 105', 'Amazon Installer'],
  'icbc-leasing': ['Sino Offshore 12', 'Sino Offshore 18', 'Sino Offshore 24', 'Sino Offshore 31', 'Sino Offshore 37'],
  macquarie: ['Nordic Provider', 'Nordic Sentinel', 'Nordic Endeavour', 'Nordic Vantage'],
  'ades-international': ['Aquamarine Driller', 'Azure Driller', 'Aquamarine Explorer', 'Azure Explorer'],
};

type Mix = { category: VesselCategory; subType: VesselSubType; sizes: SizeClass[] };

const OSV_MIX: Mix[] = [
  { category: 'OSV', subType: 'PSV', sizes: ['Small', 'Medium', 'Large'] },
  { category: 'OSV', subType: 'AHTS', sizes: ['Small', 'Medium', 'Large', 'Very Large', 'Super Large'] },
  { category: 'OSV', subType: 'AHT', sizes: ['Small', 'Medium'] },
  { category: 'OSV', subType: 'FSV', sizes: ['Small', 'Medium'] },
  { category: 'OSV', subType: 'CREW BOAT', sizes: ['Small', 'Medium'] },
  { category: 'OSV', subType: 'STANDBY / ERRV', sizes: ['Small', 'Medium'] },
  { category: 'OSV', subType: 'OCEAN GOING TUG', sizes: ['Medium', 'Large'] },
];

const EPC_MIX: Mix[] = [
  { category: 'OCV', subType: 'CONSTRUCTION / OCV', sizes: ['Large', 'Very Large'] },
  { category: 'OCV', subType: 'DSV', sizes: ['Medium', 'Large'] },
  { category: 'OCV', subType: 'ACCOMMODATION', sizes: ['Large'] },
  { category: 'OCV', subType: 'CABLE LAY', sizes: ['Large'] },
];

const FLAGS = ['Panama', 'Marshall Islands', 'Liberia', 'Saudi Arabia', 'Qatar', 'UAE', 'Singapore', 'Bahamas'];
const STATUSES: VesselStatus[] = ['On hire', 'On hire', 'On hire', 'Standby', 'Transit', 'Off hire', 'In yard'];

const OWNER_REGIONS: Record<string, Region[]> = {
  'stanford-marine': ['Middle East Gulf', 'Middle East Gulf', 'South East Asia', 'West Africa'],
  'zamil-marine': ['Middle East Gulf'],
  'falcon-marine': ['Middle East Gulf', 'Middle East Gulf', 'South East Asia'],
  'meridian-offshore': ['Middle East Gulf', 'Middle East Gulf', 'West Africa'],
  'halul-offshore': ['Middle East Gulf'],
  tidewater: ['Middle East Gulf', 'West Africa', 'North Sea', 'Gulf of Mexico', 'South East Asia'],
  'po-maritime': ['Middle East Gulf', 'Middle East Gulf', 'West Africa'],
  ams: ['Middle East Gulf'],
  saipem: ['Middle East Gulf', 'West Africa'],
  'nmdc-energy': ['Middle East Gulf'],
  mcdermott: ['Middle East Gulf', 'Gulf of Mexico'],
  'icbc-leasing': ['Middle East Gulf', 'South East Asia'],
  macquarie: ['North Sea', 'Gulf of Mexico', 'Middle East Gulf'],
  'ades-international': ['Middle East Gulf'],
};

const REGION_CENTRES: Record<Region, [number, number]> = {
  'Middle East Gulf': [26.8, 51.4],
  'West Africa': [4.2, 6.1],
  'South East Asia': [3.1, 108.4],
  'North Sea': [58.2, 2.1],
  'Gulf of Mexico': [27.4, -91.2],
};

const EPC_OWNERS = new Set(['saipem', 'nmdc-energy', 'mcdermott']);

/**
 * Rigs, floating production and renewable tonnage. These sit outside the OSV/OCV
 * owner fleets above but belong in the same taxonomy, so the GO Fleet category
 * filter reflects the real market rather than support vessels alone.
 */
const SPECIALIST: { name: string; category: VesselCategory; subType: VesselSubType; owner: string; ownerId: string; region: Region }[] = [
  { name: 'Vantage Emerald Driller', category: 'MODU', subType: 'JACK-UP', owner: 'Vantage Drilling', ownerId: 'vantage-drilling', region: 'Middle East Gulf' },
  { name: 'Vantage Topaz Driller', category: 'MODU', subType: 'JACK-UP', owner: 'Vantage Drilling', ownerId: 'vantage-drilling', region: 'Middle East Gulf' },
  { name: 'Vantage Sapphire Driller', category: 'MODU', subType: 'JACK-UP', owner: 'Vantage Drilling', ownerId: 'vantage-drilling', region: 'Middle East Gulf' },
  { name: 'Foresight Explorer', category: 'MODU', subType: 'SEMI-SUB', owner: 'Foresight Drilling', ownerId: 'foresight-drilling', region: 'South East Asia' },
  { name: 'Foresight Pioneer', category: 'MODU', subType: 'DRILLSHIP', owner: 'Foresight Drilling', ownerId: 'foresight-drilling', region: 'West Africa' },
  { name: 'Foresight Discoverer', category: 'MODU', subType: 'JACK-UP', owner: 'Foresight Drilling', ownerId: 'foresight-drilling', region: 'Middle East Gulf' },
  { name: 'Safaniya Producer', category: 'OFFSHORE PRODUCTION', subType: 'FPSO', owner: 'Saudi Aramco', ownerId: 'saudi-aramco', region: 'Middle East Gulf' },
  { name: 'Zakum Producer', category: 'OFFSHORE PRODUCTION', subType: 'FPSO', owner: 'ADNOC Offshore', ownerId: 'adnoc-offshore', region: 'Middle East Gulf' },
  { name: 'Bonga Producer', category: 'OFFSHORE PRODUCTION', subType: 'FPSO', owner: 'Meridian Offshore', ownerId: 'meridian-offshore', region: 'West Africa' },
  { name: 'Gulf Storage 1', category: 'FLOATER WET', subType: 'FSO', owner: 'Meridian Offshore', ownerId: 'meridian-offshore', region: 'Middle East Gulf' },
  { name: 'Gulf Storage 2', category: 'FLOATER WET', subType: 'FSO', owner: 'Meridian Offshore', ownerId: 'meridian-offshore', region: 'South East Asia' },
  { name: 'Dogger Servitor', category: 'RENEWABLE', subType: 'WIND SOV', owner: 'Macquarie Asset Management', ownerId: 'macquarie', region: 'North Sea' },
  { name: 'Dogger Installer', category: 'RENEWABLE', subType: 'WTIV', owner: 'Macquarie Asset Management', ownerId: 'macquarie', region: 'North Sea' },
  { name: 'Nordic Wind Tender', category: 'RENEWABLE', subType: 'WIND SOV', owner: 'Macquarie Asset Management', ownerId: 'macquarie', region: 'North Sea' },
];

function generateSpecialists(): Vessel[] {
  const rand = rng(7717);
  return SPECIALIST.map((s, i) => {
    const [clat, clon] = REGION_CENTRES[s.region];
    return {
      imo: String(9450000 + i * 613),
      mmsi: String(370000000 + i * 104729),
      name: s.name,
      category: s.category,
      subType: s.subType,
      sizeClass: s.category === 'MODU' || s.category === 'OFFSHORE PRODUCTION' ? 'n/a' : 'Large',
      built: 2008 + Math.floor(rand() * 17),
      flag: FLAGS[Math.floor(rand() * FLAGS.length)],
      dwt: 12000 + Math.floor(rand() * 90000),
      bhp: 8000 + Math.floor(rand() * 20000),
      eexiBand: (['A', 'B', 'C', 'D'] as const)[Math.floor(rand() * 4)],
      dpClass: (['DP2', 'DP3'] as const)[Math.floor(rand() * 2)],
      region: s.region,
      status: (['On hire', 'On hire', 'Standby', 'In yard'] as VesselStatus[])[Math.floor(rand() * 4)],
      ownerId: s.ownerId,
      ownership: chain({
        beneficialOwner: s.owner,
        registeredOwner: `${s.name} Holdings Ltd`,
        technicalManager: `${s.owner} Technical Services`,
        ismManager: `${s.owner} Technical Services`,
      }),
      ais: {
        lat: +(clat + (rand() - 0.5) * 2).toFixed(3),
        lon: +(clon + (rand() - 0.5) * 2).toFixed(3),
        ageHours: +(rand() * 8).toFixed(1),
        status: s.category === 'OFFSHORE PRODUCTION' || s.category === 'FLOATER WET' ? 'Moored' : 'On DP',
        speedKn: 0,
        headingDeg: Math.floor(rand() * 360),
        daysInZone: Math.floor(rand() * 400),
      },
      provenance: prov(75 + Math.floor(rand() * 22), 'registry', 'IMO GISIS + class records', '2026-08-13'),
    } satisfies Vessel;
  });
}

function generateFleet(): Vessel[] {
  const out: Vessel[] = [];
  let imoCounter = 9300000;

  Object.entries(NAME_STEMS).forEach(([ownerId, names], ownerIdx) => {
    const rand = rng(1000 + ownerIdx * 97);
    const mix = EPC_OWNERS.has(ownerId) ? EPC_MIX : OSV_MIX;
    const regions = OWNER_REGIONS[ownerId] ?? ['Middle East Gulf'];

    names.forEach((name, i) => {
      const m = mix[Math.floor(rand() * mix.length)];
      const sizeClass = m.sizes[Math.floor(rand() * m.sizes.length)];
      const region = regions[Math.floor(rand() * regions.length)];
      const [clat, clon] = REGION_CENTRES[region];
      const status = STATUSES[Math.floor(rand() * STATUSES.length)];
      imoCounter += 137 + Math.floor(rand() * 900);
      const owner = ownerId
        .split('-')
        .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
        .join(' ');
      const confidence = 68 + Math.floor(rand() * 30);

      out.push({
        imo: String(imoCounter),
        mmsi: String(400000000 + Math.floor(rand() * 99999999)),
        name,
        category: m.category,
        subType: m.subType,
        sizeClass,
        built: 2004 + Math.floor(rand() * 21),
        flag: FLAGS[Math.floor(rand() * FLAGS.length)],
        dwt: 1200 + Math.floor(rand() * 6000),
        bollardPullT: m.subType === 'AHTS' || m.subType === 'AHT' || m.subType === 'OCEAN GOING TUG'
          ? 60 + Math.floor(rand() * 140)
          : undefined,
        deckAreaM2: m.subType === 'PSV' ? 500 + Math.floor(rand() * 700) : undefined,
        bhp: 3000 + Math.floor(rand() * 14000),
        eexiBand: (['A', 'B', 'C', 'C', 'D', 'E'] as const)[Math.floor(rand() * 6)],
        dpClass: (['DP1', 'DP2', 'DP2', 'DP3', 'None'] as const)[Math.floor(rand() * 5)],
        region,
        status,
        ownerId,
        ownership: chain({
          beneficialOwner: owner,
          registeredOwner: `${name} Shipping Ltd`,
          technicalManager: `${owner} Ship Management`,
          ismManager: `${owner} Ship Management`,
        }),
        ais: {
          lat: +(clat + (rand() - 0.5) * 3).toFixed(3),
          lon: +(clon + (rand() - 0.5) * 3).toFixed(3),
          ageHours: +(rand() * 11).toFixed(1),
          status: (['Underway', 'On DP', 'At anchor', 'Moored'] as const)[Math.floor(rand() * 4)],
          speedKn: +(rand() * 12).toFixed(1),
          headingDeg: Math.floor(rand() * 360),
          daysInZone: Math.floor(rand() * 60),
        },
        provenance: prov(
          confidence,
          (['registry', 'broker', 'ais', 'operator'] as const)[Math.floor(rand() * 4)],
          'Automated ingest',
          '2026-08-15',
        ),
      });
    });
  });

  return out;
}

export const VESSELS: Vessel[] = [...HERO, ...generateFleet(), ...generateSpecialists()];
export const VESSEL_BY_IMO = new Map(VESSELS.map((v) => [v.imo, v]));

export const FLEET_TOTAL = VESSELS.length;
export const ACTIVE_VESSELS = VESSELS.filter((v) => v.status !== 'Laid up' && v.status !== 'In yard').length;
