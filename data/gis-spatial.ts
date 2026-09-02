/**
 * Spatial query functions for GIS-Vessel relationships
 * Uses PostGIS-style operations for matching vessels to offshore infrastructure
 *
 * In production, these would execute server-side against a PostGIS database.
 * For now, they work client-side with GeoJSON features.
 */

import type { LivePosition } from './ais-live';
import type { OffshoreField, OffshoreInstallation, VesselInField, VesselNearInstallation } from './gis-types';

/**
 * Convert degrees to nautical miles (for distance calculations)
 * 1 degree of latitude ≈ 60 nautical miles
 * 1 degree of longitude ≈ 60 * cos(latitude) nautical miles
 */
function degreesToNM(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const latDiff = lat2 - lat1;
  const lonDiff = lon2 - lon1;
  const latNM = latDiff * 60;
  const lonNM = lonDiff * 60 * Math.cos(((lat1 + lat2) / 2) * (Math.PI / 180));
  return Math.sqrt(latNM * latNM + lonNM * lonNM);
}

/**
 * ST_Contains equivalent: Check if point is inside a polygon
 * Simplified ray-casting algorithm (works for convex and concave polygons)
 */
function pointInPolygon(lat: number, lon: number, polygon: number[][]): boolean {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [lon1, lat1] = polygon[i];
    const [lon2, lat2] = polygon[j];
    const intersect = lat > Math.min(lat1, lat2) &&
      lat <= Math.max(lat1, lat2) &&
      lon <= Math.max(lon1, lon2) &&
      (lat1 !== lat2 ? lon < (lon2 - lon1) * (lat - lat1) / (lat2 - lat1) + lon1 : false);
    if (intersect) inside = !inside;
  }
  return inside;
}

/**
 * ST_Intersects equivalent: Check if point is within a MultiPolygon
 */
function pointInMultiPolygon(lat: number, lon: number, multiPolygon: number[][][]): boolean {
  return multiPolygon.some((polygon) => pointInPolygon(lat, lon, polygon));
}

/**
 * Check if vessel is currently inside a field polygon
 * Returns true if vessel position is within field geometry
 */
export function vesselInField(vessel: LivePosition, field: OffshoreField): boolean {
  const { lat, lon } = vessel;
  const geom = field.geometry;

  if (geom.type === 'Polygon') {
    const coordinates = geom.coordinates as number[][];
    return pointInPolygon(lat, lon, coordinates);
  } else if (geom.type === 'MultiPolygon') {
    const coordinates = geom.coordinates as number[][][];
    return pointInMultiPolygon(lat, lon, coordinates);
  }

  return false;
}

/**
 * ST_DWithin equivalent: Find vessels within N nautical miles of a field
 */
export function vesselNearField(vessel: LivePosition, field: OffshoreField, distanceNM: number): boolean {
  // For simplicity, use centroid of field polygon as reference point
  // In production, would use ST_Distance to polygon boundary
  const fieldLat = 27.9; // Placeholder: would calculate from geometry
  const fieldLon = 49.15;

  const distance = degreesToNM(vessel.lat, vessel.lon, fieldLat, fieldLon);
  return distance <= distanceNM;
}

/**
 * Find nearest installation to a vessel
 */
export function findNearestInstallation(
  vessel: LivePosition,
  installations: OffshoreInstallation[]
): VesselNearInstallation | null {
  let nearest: VesselNearInstallation | null = null;
  let minDistance = Infinity;

  for (const installation of installations) {
    const distance = degreesToNM(vessel.lat, vessel.lon, installation.latitude, installation.longitude);
    if (distance < minDistance) {
      minDistance = distance;
      nearest = {
        vessel_imo: vessel.imo,
        vessel_name: vessel.name,
        installation_id: installation.installation_id,
        installation_name: installation.name,
        distance_nm: Math.round(distance * 10) / 10, // Round to 0.1 NM
        bearing_deg: calculateBearing(vessel.lat, vessel.lon, installation.latitude, installation.longitude),
      };
    }
  }

  return nearest;
}

/**
 * Calculate bearing from vessel to installation (0-360 degrees)
 */
function calculateBearing(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const toDeg = (rad: number) => (rad * 180) / Math.PI;

  const dLon = toRad(lon2 - lon1);
  const y = Math.sin(dLon) * Math.cos(toRad(lat2));
  const x = Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) - Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLon);
  const bearing = toDeg(Math.atan2(y, x));

  return (bearing + 360) % 360;
}

/**
 * Find all vessels currently inside a field
 */
export function findVesselsInField(
  vessels: LivePosition[],
  field: OffshoreField
): VesselInField[] {
  return vessels
    .filter((v) => vesselInField(v, field))
    .map((v) => ({
      vessel_imo: v.imo,
      vessel_name: v.name,
      field_id: field.field_id,
      field_name: field.field_name,
      distance_nm: 0, // Inside field
    }));
}

/**
 * Find all vessels nearby a field (within N nautical miles)
 */
export function findVesselsNearField(
  vessels: LivePosition[],
  field: OffshoreField,
  radiusNM: number = 25
): VesselInField[] {
  const result: VesselInField[] = [];

  for (const vessel of vessels) {
    // Check inside first
    if (vesselInField(vessel, field)) {
      result.push({
        vessel_imo: vessel.imo,
        vessel_name: vessel.name,
        field_id: field.field_id,
        field_name: field.field_name,
        distance_nm: 0,
      });
    } else if (vesselNearField(vessel, field, radiusNM)) {
      // Use simple centroid distance for nearby
      const distance = degreesToNM(vessel.lat, vessel.lon, 27.9, 49.15);
      if (distance <= radiusNM) {
        result.push({
          vessel_imo: vessel.imo,
          vessel_name: vessel.name,
          field_id: field.field_id,
          field_name: field.field_name,
          distance_nm: Math.round(distance * 10) / 10,
        });
      }
    }
  }

  return result;
}

/**
 * Find all vessels near an installation
 */
export function findVesselsNearInstallation(
  vessels: LivePosition[],
  installation: OffshoreInstallation,
  radiusNM: number = 5
): VesselNearInstallation[] {
  return vessels
    .map((v) => ({
      vessel_imo: v.imo,
      vessel_name: v.name,
      installation_id: installation.installation_id,
      installation_name: installation.name,
      distance_nm: Math.round(degreesToNM(v.lat, v.lon, installation.latitude, installation.longitude) * 10) / 10,
      bearing_deg: calculateBearing(v.lat, v.lon, installation.latitude, installation.longitude),
    }))
    .filter((r) => r.distance_nm <= radiusNM);
}

/**
 * Determine vessel's current operational context
 */
export interface VesselContext {
  current_field?: OffshoreField;
  nearest_installation?: OffshoreInstallation;
  distance_to_installation?: number;
  operating_basin?: string;
  activities?: string[];
}

export function getVesselContext(
  vessel: LivePosition,
  fields: OffshoreField[],
  installations: OffshoreInstallation[]
): VesselContext {
  const context: VesselContext = {};

  // Find current field
  const fieldInside = fields.find((f) => vesselInField(vessel, f));
  if (fieldInside) {
    context.current_field = fieldInside;
    context.operating_basin = fieldInside.basin;
  }

  // Find nearest installation
  const nearest = findNearestInstallation(vessel, installations);
  if (nearest) {
    context.distance_to_installation = nearest.distance_nm;
    const installationDetail = installations.find((i) => i.installation_id === nearest.installation_id);
    if (installationDetail) {
      context.nearest_installation = installationDetail;
      if (!context.operating_basin && installationDetail.field_id) {
        const linkedField = fields.find((f) => f.field_id === installationDetail.field_id);
        if (linkedField) {
          context.operating_basin = linkedField.basin;
        }
      }
    }
  }

  return context;
}

/**
 * Batch spatial query: Match multiple vessels to multiple fields
 * Returns a map of vessel IMO to list of fields they're in/near
 */
export function matchVesselsToFields(
  vessels: LivePosition[],
  fields: OffshoreField[],
  radiusNM: number = 5
): Map<string, OffshoreField[]> {
  const matches = new Map<string, OffshoreField[]>();

  for (const vessel of vessels) {
    const matched: OffshoreField[] = [];

    for (const field of fields) {
      if (vesselInField(vessel, field) || vesselNearField(vessel, field, radiusNM)) {
        matched.push(field);
      }
    }

    if (matched.length > 0) {
      matches.set(vessel.imo, matched);
    }
  }

  return matches;
}
