import { useEffect, useRef } from 'react';
import MapLibre from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { DEMO_FIELDS, DEMO_INSTALLATIONS, DEMO_PIPELINES, DEMO_PORTS } from '@/data/gis-demo-data';
import { loadGISSymbols } from '@/data/gis-symbols';
import {
  fieldsLayerFill,
  fieldsLayerStroke,
  installationsLayer,
  pipelinesLayer,
  portsLayer,
} from '@/data/gis-layers';
import type { GISLayerVisibility, OffshoreField, OffshoreInstallation } from '@/data/gis-types';

type Map = MapLibre.Map;

interface LiveMapGISProps {
  visibility: GISLayerVisibility;
  onFieldClick?: (field: OffshoreField) => void;
  onInstallationClick?: (installation: OffshoreInstallation) => void;
}

export default function LiveMapGIS({ visibility, onFieldClick, onInstallationClick }: LiveMapGISProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Initialize map centered on North Sea
    map.current = new MapLibre.Map({
      container: mapContainer.current,
      style: 'https://tiles.openstreetmap.se/hydda/full/style.json',
      center: [2, 58],
      zoom: 5,
      pitch: 0,
      bearing: 0,
    });

    const currentMap = map.current;

    currentMap.on('load', () => {
      // Load SVG symbols for installations
      loadGISSymbols(currentMap);

      // Add GeoJSON sources
      currentMap.addSource('gis-fields', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: DEMO_FIELDS.map((field) => ({
            type: 'Feature',
            id: field.field_id,
            properties: {
              field_id: field.field_id,
              field_name: field.field_name,
              status: field.status,
              operator: field.operator,
              country: field.country,
            },
            geometry: field.geometry as any,
          })),
        } as any,
      });

      currentMap.addSource('gis-installations', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: DEMO_INSTALLATIONS.map((inst) => ({
            type: 'Feature',
            id: inst.installation_id,
            properties: {
              installation_id: inst.installation_id,
              name: inst.name,
              installation_type: inst.installation_type,
              field_id: inst.field_id,
              status: inst.status,
            },
            geometry: inst.geometry as any,
          })),
        } as any,
      });

      currentMap.addSource('gis-pipelines', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: DEMO_PIPELINES.map((pipeline) => ({
            type: 'Feature',
            id: pipeline.pipeline_id,
            properties: {
              pipeline_id: pipeline.pipeline_id,
              name: pipeline.name,
              pipeline_type: pipeline.pipeline_type,
              product: pipeline.product,
            },
            geometry: pipeline.geometry as any,
          })),
        } as any,
      });

      currentMap.addSource('gis-ports', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: DEMO_PORTS.map((port) => ({
            type: 'Feature',
            id: port.port_id,
            properties: {
              port_id: port.port_id,
              port_name: port.port_name,
              port_type: port.port_type.join(','),
              country: port.country,
            },
            geometry: port.geometry as any,
          })),
        } as any,
      });

      // Add layers (bottom to top)
      currentMap.addLayer(fieldsLayerFill);
      currentMap.addLayer(fieldsLayerStroke);
      currentMap.addLayer(installationsLayer);
      currentMap.addLayer(pipelinesLayer);
      currentMap.addLayer(portsLayer);

      // Add click handlers for fields
      currentMap.on('click', 'gis-fields-fill', (e) => {
        if (e.features && e.features.length > 0) {
          const feature = e.features[0];
          const field = DEMO_FIELDS.find((f) => f.field_id === feature.id);
          if (field && onFieldClick) {
            onFieldClick(field);
          }
        }
      });

      // Add click handlers for installations
      currentMap.on('click', 'gis-installations', (e) => {
        if (e.features && e.features.length > 0) {
          const feature = e.features[0];
          const installation = DEMO_INSTALLATIONS.find((i) => i.installation_id === feature.id);
          if (installation && onInstallationClick) {
            onInstallationClick(installation);
          }
        }
      });

      // Cursor feedback
      currentMap.on('mouseenter', 'gis-fields-fill', () => {
        currentMap.getCanvas().style.cursor = 'pointer';
      });
      currentMap.on('mouseleave', 'gis-fields-fill', () => {
        currentMap.getCanvas().style.cursor = '';
      });

      currentMap.on('mouseenter', 'gis-installations', () => {
        currentMap.getCanvas().style.cursor = 'pointer';
      });
      currentMap.on('mouseleave', 'gis-installations', () => {
        currentMap.getCanvas().style.cursor = '';
      });
    });

    return () => {
      // Cleanup happens via map removal on component unmount
    };
  }, [onFieldClick, onInstallationClick]);

  // Update layer visibility when visibility state changes
  useEffect(() => {
    if (!map.current) return;

    map.current.setLayoutProperty('gis-fields-fill', 'visibility', visibility.fields ? 'visible' : 'none');
    map.current.setLayoutProperty('gis-fields-stroke', 'visibility', visibility.fields ? 'visible' : 'none');
    map.current.setLayoutProperty('gis-installations', 'visibility', visibility.installations ? 'visible' : 'none');
    map.current.setLayoutProperty('gis-pipelines', 'visibility', visibility.pipelines ? 'visible' : 'none');
    map.current.setLayoutProperty('gis-ports', 'visibility', visibility.ports ? 'visible' : 'none');
  }, [visibility]);

  return (
    <div
      ref={mapContainer}
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
      }}
    />
  );
}
