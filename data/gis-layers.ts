/**
 * MapLibre GIS layer configurations
 * Defines how offshore fields, installations, and pipelines are rendered
 */

import type { LayerSpecification, SourceSpecification } from 'maplibre-gl';
import type { FieldStatus, FieldType, InstallationType, PipelineProduct } from './gis-types';

// Field status colors
const FIELD_STATUS_COLORS: Record<FieldStatus, string> = {
  'Producing': '#2ecc71', // green
  'Development': '#f39c12', // orange
  'Appraisal': '#9b59b6', // purple
  'Discovery': '#3498db', // blue
  'Exploration': '#95a5a6', // gray
  'Decommissioned': '#7f8c8d', // dark gray
  'Abandoned': '#34495e', // darker gray
  'Shut-in': '#e74c3c', // red
  'Under Development': '#f39c12', // orange
};

const FIELD_TYPE_COLORS: Record<FieldType, string> = {
  'Oil Field': '#8b4513', // brown
  'Gas Field': '#87ceeb', // sky blue
  'Oil & Gas Field': '#d4a574', // tan
  'Condensate Field': '#daa520', // goldenrod
  'Heavy Oil Field': '#654321', // dark brown
  'Coal Seam Gas': '#2f4f4f', // dark slate gray
  'Geothermal Field': '#ff6347', // tomato
  'Wind Farm Area': '#add8e6', // light blue
};

const PIPELINE_PRODUCT_COLORS: Record<PipelineProduct, string> = {
  'Oil': '#8b4513', // brown
  'Gas': '#87ceeb', // sky blue
  'Water': '#4169e1', // royal blue
  'Condensate': '#daa520', // goldenrod
  'Brine': '#20b2aa', // light sea green
  'Electricity': '#ffff00', // yellow
  'Mixed': '#808080', // gray
};

// Installation type symbols (rendered as image layers in MapLibre)
export const INSTALLATION_SYMBOL_TYPES: Partial<Record<InstallationType, string>> = {
  'Fixed Platform': 'platform-fixed',
  'Production Platform': 'platform-production',
  'Drilling Platform': 'platform-drilling',
  'Wellhead Platform': 'platform-wellhead',
  'Jack-up': 'jackup',
  'Semi-submersible': 'semisubmersible',
  'FPSO': 'fpso',
  'FSO': 'fso',
  'FLNG': 'flng',
  'SPM': 'spm',
  'CALM Buoy': 'calm-buoy',
  'Subsea Manifold': 'subsea-manifold',
  'Subsea Tree': 'subsea-tree',
  'Well': 'well',
  'Wind Turbine': 'wind-turbine',
  'Offshore Substation': 'substation',
  'Offshore Terminal': 'terminal',
};

/**
 * GeoJSON Source for offshore fields
 * Expects features with properties: field_id, field_name, field_type, status, operator, country
 */
export const fieldsSource: SourceSpecification = {
  type: 'geojson',
  data: {
    type: 'FeatureCollection',
    features: [],
  },
};

/**
 * Layer: Field boundaries (fill)
 * Colored by status, configurable opacity
 */
export const fieldsLayerFill: LayerSpecification = {
  id: 'gis-fields-fill',
  type: 'fill',
  source: 'gis-fields',
  paint: {
    'fill-color': [
      'match',
      ['get', 'status'],
      'Producing',
      FIELD_STATUS_COLORS['Producing'],
      'Development',
      FIELD_STATUS_COLORS['Development'],
      'Appraisal',
      FIELD_STATUS_COLORS['Appraisal'],
      'Discovery',
      FIELD_STATUS_COLORS['Discovery'],
      'Exploration',
      FIELD_STATUS_COLORS['Exploration'],
      'Decommissioned',
      FIELD_STATUS_COLORS['Decommissioned'],
      'Abandoned',
      FIELD_STATUS_COLORS['Abandoned'],
      'Shut-in',
      FIELD_STATUS_COLORS['Shut-in'],
      'Under Development',
      FIELD_STATUS_COLORS['Under Development'],
      '#666',
    ],
    'fill-opacity': 0.25, // Translucent so underlying map is visible
  },
};

/**
 * Layer: Field boundaries (stroke)
 * Bold outline for visibility
 */
export const fieldsLayerStroke: LayerSpecification = {
  id: 'gis-fields-stroke',
  type: 'line',
  source: 'gis-fields',
  paint: {
    'line-color': [
      'match',
      ['get', 'status'],
      'Producing',
      FIELD_STATUS_COLORS['Producing'],
      'Development',
      FIELD_STATUS_COLORS['Development'],
      'Appraisal',
      FIELD_STATUS_COLORS['Appraisal'],
      'Discovery',
      FIELD_STATUS_COLORS['Discovery'],
      'Exploration',
      FIELD_STATUS_COLORS['Exploration'],
      'Decommissioned',
      FIELD_STATUS_COLORS['Decommissioned'],
      'Abandoned',
      FIELD_STATUS_COLORS['Abandoned'],
      'Shut-in',
      FIELD_STATUS_COLORS['Shut-in'],
      'Under Development',
      FIELD_STATUS_COLORS['Under Development'],
      '#999',
    ],
    'line-width': 2,
    'line-opacity': 0.7,
  },
};

/**
 * Layer: Field hover highlight
 * Thicker line with accent color on hover
 */
export const fieldsLayerHighlight: LayerSpecification = {
  id: 'gis-fields-highlight',
  type: 'line',
  source: 'gis-fields',
  paint: {
    'line-color': '#ffd700', // Gold accent
    'line-width': 3,
    'line-opacity': [
      'case',
      ['boolean', ['feature-state', 'hover'], false],
      1,
      0,
    ],
  },
};

/**
 * GeoJSON Source for offshore installations
 * Expects features with properties: installation_id, name, installation_type, status, field_id
 */
export const installationsSource: SourceSpecification = {
  type: 'geojson',
  data: {
    type: 'FeatureCollection',
    features: [],
  },
};

/**
 * Layer: Installation markers
 * Symbol-based, different icons for different types
 */
export const installationsLayer: LayerSpecification = {
  id: 'gis-installations',
  type: 'symbol',
  source: 'gis-installations',
  layout: {
    'icon-image': [
      'match',
      ['get', 'installation_type'],
      'Fixed Platform',
      'gis-platform-fixed',
      'Production Platform',
      'gis-platform-production',
      'Drilling Platform',
      'gis-platform-drilling',
      'FPSO',
      'gis-fpso',
      'FSO',
      'gis-fso',
      'FLNG',
      'gis-flng',
      'Jack-up',
      'gis-jackup',
      'Semi-submersible',
      'gis-semisubmersible',
      'Well',
      'gis-well',
      'Wind Turbine',
      'gis-wind-turbine',
      'Offshore Terminal',
      'gis-terminal',
      'Subsea Manifold',
      'gis-subsea-manifold',
      'SPM',
      'gis-spm',
      'gis-installation', // fallback
    ],
    'icon-size': 0.5,
    'icon-allow-overlap': true,
    'icon-ignore-placement': true,
  },
  paint: {
    'icon-opacity': [
      'case',
      ['boolean', ['feature-state', 'selected'], false],
      1,
      0.7,
    ],
  },
};

/**
 * Layer: Installation hover glow
 */
export const installationsGlowLayer: LayerSpecification = {
  id: 'gis-installations-glow',
  type: 'circle',
  source: 'gis-installations',
  paint: {
    'circle-radius': 12,
    'circle-color': '#ffd700',
    'circle-opacity': [
      'case',
      ['boolean', ['feature-state', 'hover'], false],
      0.3,
      0,
    ],
  },
};

/**
 * GeoJSON Source for pipelines
 * Expects features with properties: pipeline_id, name, product, status
 */
export const pipelinesSource: SourceSpecification = {
  type: 'geojson',
  data: {
    type: 'FeatureCollection',
    features: [],
  },
};

/**
 * Layer: Pipelines
 * Color-coded by product (oil, gas, water, etc.)
 */
export const pipelinesLayer: LayerSpecification = {
  id: 'gis-pipelines',
  type: 'line',
  source: 'gis-pipelines',
  paint: {
    'line-color': [
      'match',
      ['get', 'product'],
      'Oil',
      PIPELINE_PRODUCT_COLORS['Oil'],
      'Gas',
      PIPELINE_PRODUCT_COLORS['Gas'],
      'Water',
      PIPELINE_PRODUCT_COLORS['Water'],
      'Condensate',
      PIPELINE_PRODUCT_COLORS['Condensate'],
      'Brine',
      PIPELINE_PRODUCT_COLORS['Brine'],
      'Electricity',
      PIPELINE_PRODUCT_COLORS['Electricity'],
      '#999',
    ],
    'line-width': [
      'interpolate',
      ['linear'],
      ['zoom'],
      3, // at zoom 3
      0.5, // width 0.5px
      12, // at zoom 12
      3, // width 3px
    ],
    'line-opacity': 0.6,
  },
};

/**
 * Layer: Pipeline hover highlight
 */
export const pipelinesHighlightLayer: LayerSpecification = {
  id: 'gis-pipelines-highlight',
  type: 'line',
  source: 'gis-pipelines',
  paint: {
    'line-color': '#ffd700',
    'line-width': 4,
    'line-opacity': [
      'case',
      ['boolean', ['feature-state', 'hover'], false],
      1,
      0,
    ],
  },
};

/**
 * GeoJSON Source for licence areas
 */
export const licencesSource: SourceSpecification = {
  type: 'geojson',
  data: {
    type: 'FeatureCollection',
    features: [],
  },
};

/**
 * Layer: Licence area boundaries
 * Dashed, subtle styling
 */
export const licencesLayer: LayerSpecification = {
  id: 'gis-licences',
  type: 'line',
  source: 'gis-licences',
  paint: {
    'line-color': '#9370db', // Medium purple
    'line-width': 1.5,
    'line-opacity': 0.5,
    'line-dasharray': [4, 4],
  },
};

/**
 * GeoJSON Source for ports
 */
export const portsSource: SourceSpecification = {
  type: 'geojson',
  data: {
    type: 'FeatureCollection',
    features: [],
  },
};

/**
 * Layer: Ports
 * Anchor symbol markers
 */
export const portsLayer: LayerSpecification = {
  id: 'gis-ports',
  type: 'symbol',
  source: 'gis-ports',
  layout: {
    'icon-image': 'gis-port',
    'icon-size': 0.6,
    'icon-allow-overlap': true,
    'text-field': ['get', 'port_name'],
    'text-font': ['Open Sans Regular', 'Arial Unicode MS Regular'],
    'text-size': 10,
    'text-offset': [0, 1.5],
    'text-anchor': 'top',
  },
  paint: {
    'text-color': '#d4a574',
    'text-opacity': 0.8,
  },
};

/**
 * Layer: Wind farms
 * Semi-transparent overlay
 */
export const windFarmsLayer: LayerSpecification = {
  id: 'gis-wind-farms',
  type: 'fill',
  source: 'gis-wind-farms',
  paint: {
    'fill-color': '#add8e6',
    'fill-opacity': 0.15,
  },
};

export const windFarmsStrokeLayer: LayerSpecification = {
  id: 'gis-wind-farms-stroke',
  type: 'line',
  source: 'gis-wind-farms',
  paint: {
    'line-color': '#87ceeb',
    'line-width': 1.5,
    'line-opacity': 0.5,
  },
};

// Export color schemes for legend and styling
export const GIS_COLOR_SCHEMES = {
  fieldStatus: FIELD_STATUS_COLORS,
  fieldType: FIELD_TYPE_COLORS,
  pipelineProduct: PIPELINE_PRODUCT_COLORS,
};
