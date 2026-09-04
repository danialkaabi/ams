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
 * Named vessels — empty landscape (all vessels removed)
 */
const HERO: Vessel[] = [];

/**
 * Deterministic fleet expansion
 * Returns empty fleet
 */
function generateFleet(): Vessel[] {
  return [];
}

/**
 * Specialist vessels (rigs, FPSOs, renewables)
 * Returns empty array
 */
function generateSpecialists(): Vessel[] {
  return [];
}

export const VESSELS: Vessel[] = [...HERO, ...generateFleet(), ...generateSpecialists()];
export const VESSEL_BY_IMO = new Map(VESSELS.map((v) => [v.imo, v]));

export const FLEET_TOTAL = VESSELS.length;
export const ACTIVE_VESSELS = VESSELS.filter((v) => v.status !== 'Laid up' && v.status !== 'In yard').length;
