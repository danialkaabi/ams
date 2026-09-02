/**
 * GIS data types for offshore infrastructure
 * Supports PostGIS geometry types (Polygon, MultiPolygon, LineString, Point)
 */

export type GeometryType = 'Point' | 'LineString' | 'Polygon' | 'MultiPolygon';

export interface GeoJSONGeometry {
  type: GeometryType;
  coordinates: number[] | number[][] | number[][][] | number[][][][];
}

export type FieldType =
  | 'Oil Field'
  | 'Gas Field'
  | 'Oil & Gas Field'
  | 'Condensate Field'
  | 'Heavy Oil Field'
  | 'Coal Seam Gas'
  | 'Geothermal Field'
  | 'Wind Farm Area';

export type FieldStatus =
  | 'Producing'
  | 'Development'
  | 'Appraisal'
  | 'Discovery'
  | 'Exploration'
  | 'Decommissioned'
  | 'Abandoned'
  | 'Shut-in'
  | 'Under Development';

export interface OffshoreField {
  field_id: string;
  field_name: string;
  field_type: FieldType;
  operator: string;
  owners: string[];
  country: string;
  basin: string;
  status: FieldStatus;
  discovery_year?: number;
  first_production?: number;
  water_depth?: number; // meters
  total_area?: number; // km²
  geometry: GeoJSONGeometry;
  source: 'manual' | 'import' | 'third-party';
  last_updated: number;
}

export type InstallationType =
  | 'Fixed Platform'
  | 'Wellhead Platform'
  | 'Central Processing Platform'
  | 'Production Platform'
  | 'Drilling Platform'
  | 'Jack-up'
  | 'Semi-submersible'
  | 'FPSO'
  | 'FSO'
  | 'FLNG'
  | 'SPM'
  | 'CALM Buoy'
  | 'Subsea Manifold'
  | 'Subsea Tree'
  | 'Well'
  | 'Mooring System'
  | 'Offshore Terminal'
  | 'Wind Turbine'
  | 'Offshore Substation'
  | 'Accommodation Platform'
  | 'Other';

export type InstallationStatus = 'Operational' | 'Under Construction' | 'Decommissioned' | 'Abandoned' | 'Standby';

export interface OffshoreInstallation {
  installation_id: string;
  name: string;
  installation_type: InstallationType;
  field_id?: string;
  operator: string;
  owner?: string;
  country: string;
  latitude: number;
  longitude: number;
  status: InstallationStatus;
  commissioned_date?: number;
  water_depth?: number; // meters
  elevation?: number; // meters (above sea level for wind turbines)
  capacity?: number; // production capacity
  capacity_unit?: string; // bbl/d, MMscf/d, MW
  linked_asset_id?: string;
  geometry: GeoJSONGeometry;
  source: 'manual' | 'import' | 'third-party';
  last_updated: number;
}

export type PipelineType =
  | 'Export'
  | 'Import'
  | 'Inter-field'
  | 'Intra-field'
  | 'Export Gas'
  | 'Export Oil'
  | 'Export Water'
  | 'Onshore Connection'
  | 'Submarine Cable';

export type PipelineProduct = 'Oil' | 'Gas' | 'Water' | 'Condensate' | 'Brine' | 'Electricity' | 'Mixed';

export type PipelineStatus = 'Operational' | 'Under Construction' | 'Planned' | 'Decommissioned' | 'Idle';

export interface OffshoreePipeline {
  pipeline_id: string;
  name: string;
  operator: string;
  pipeline_type: PipelineType;
  product: PipelineProduct;
  origin: string;
  destination: string;
  status: PipelineStatus;
  diameter?: number; // inches
  length?: number; // km
  commissioned_date?: number;
  geometry: GeoJSONGeometry;
  source: 'manual' | 'import' | 'third-party';
  last_updated: number;
}

export type LicenceType = 'Licence Block' | 'Concession Area' | 'Lease Area' | 'Production Sharing Agreement' | 'Contract Area';

export interface LicenceArea {
  licence_id: string;
  licence_name: string;
  licence_type: LicenceType;
  operator: string;
  country: string;
  basin: string;
  status: 'Active' | 'Expired' | 'Relinquished' | 'Pending';
  area?: number; // km²
  issue_date?: number;
  expiry_date?: number;
  geometry: GeoJSONGeometry;
  source: 'manual' | 'import' | 'third-party';
  last_updated: number;
}

export type PortType = 'Container' | 'Tanker' | 'LNG' | 'Offshore Support' | 'General Cargo' | 'Multipurpose' | 'Bulk' | 'Dry Dock';

export interface Port {
  port_id: string;
  port_name: string;
  port_type: PortType[];
  country: string;
  latitude: number;
  longitude: number;
  berths?: number;
  depth?: number; // meters
  capacity?: number;
  geometry: GeoJSONGeometry;
  source: 'manual' | 'import' | 'third-party';
  last_updated: number;
}

// Styling configuration
export interface FieldStyleConfig {
  classifyBy: 'status' | 'operator' | 'field_type' | 'country' | 'basin' | 'production_volume';
  colors: Record<string, string>;
  opacity: number;
  strokeWidth: number;
  strokeOpacity: number;
}

export interface InstallationStyleConfig {
  showByType: Partial<Record<InstallationType, boolean>>;
  symbolSize: number;
  opacity: number;
}

export interface PipelineStyleConfig {
  showByType: Partial<Record<PipelineType, boolean>>;
  lineWidth: number;
  opacity: number;
  colors: Record<PipelineProduct, string>;
}

// GIS layer visibility state
export interface GISLayerVisibility {
  fields: boolean;
  installations: boolean;
  pipelines: boolean;
  licences: boolean;
  ports: boolean;
  wind_farms: boolean;

  // Installation type filters
  installations_by_type: Partial<Record<InstallationType, boolean>>;

  // Field filters
  fields_by_status: Partial<Record<FieldStatus, boolean>>;
  fields_by_type: Partial<Record<FieldType, boolean>>;
}

// Spatial query results
export interface VesselInField {
  vessel_imo: string;
  vessel_name: string;
  field_id: string;
  field_name: string;
  distance_nm: number; // nautical miles (should be ~0 for inside)
  entry_time?: number;
  duration_hours?: number;
}

export interface VesselNearInstallation {
  vessel_imo: string;
  vessel_name: string;
  installation_id: string;
  installation_name: string;
  distance_nm: number;
  bearing_deg?: number;
  nearest_point_time?: number;
}

export interface InstallationDetails extends OffshoreInstallation {
  associated_field?: OffshoreField;
  associated_pipelines?: OffshoreePipeline[];
  nearby_vessels?: VesselNearInstallation[];
  vessel_visits_30d?: number;
}

export interface FieldDetails extends OffshoreField {
  total_installations: number;
  producing_installations: number;
  associated_platforms: OffshoreInstallation[];
  associated_pipelines: OffshoreePipeline[];
  current_vessels: VesselInField[];
  nearby_vessels: VesselNearInstallation[];
  annual_production?: Record<string, number>; // product type -> volume
  estimated_reserves?: Record<string, number>;
}
