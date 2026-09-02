# GIS Layer Integration Guide

Complete walkthrough for integrating the offshore GIS layer into the GO Intelligence Live Map.

## What's Ready

✅ **Data Types** — TypeScript interfaces for fields, installations, pipelines, ports  
✅ **MapLibre Layers** — All GIS layer configurations (fields, installations, pipelines, etc.)  
✅ **SVG Symbols** — 16 professional maritime symbols for installation types  
✅ **Spatial Queries** — Vessel-to-infrastructure matching (in-memory, PostGIS-ready)  
✅ **Layer Control UI** — Sidebar component for toggling layers  
✅ **Demo Data** — Sample fields, installations, pipelines in North Sea and Arabian Gulf  
✅ **Documentation** — Full GIS setup guide with examples  

## Not Yet Built (Integration Tasks)

The foundation is complete. These integration tasks connect the components:

1. **Add GISLayerControl to the map sidebar** — Make layer toggles visible
2. **Load GIS demo data into MapLibre sources** — Populate the map
3. **Implement field/installation click handlers** — Show details on interaction
4. **Build field profile panel** — Display field intelligence when clicked
5. **Build installation profile panel** — Display installation details
6. **Wire vessel-to-field context** — Show current field/basin in vessel panel
7. **Add "View Vessels in Field" filtering** — Filter AIS layer by spatial query
8. **Connect legend to styling** — Show color coding explanation

## Step-by-Step Integration

### Step 1: Import GIS Components in the Map

Edit `pages/go/maps.tsx`:

```typescript
import GISLayerControl from '@/components/GISLayerControl';
import { DEMO_FIELDS, DEMO_INSTALLATIONS, DEMO_PIPELINES, DEMO_PORTS } from '@/data/gis-demo-data';
import type { GISLayerVisibility } from '@/data/gis-types';
import { useState } from 'react';

export default function Maps() {
  // ... existing state
  const [gisVisibility, setGISVisibility] = useState<GISLayerVisibility>({
    fields: true,
    installations: true,
    pipelines: true,
    licences: false,
    ports: true,
    wind_farms: false,
    installations_by_type: {},
    fields_by_status: {},
    fields_by_type: {},
  });

  return (
    <div className="map-container">
      {/* Your existing map JSX */}
      
      {/* Add layer control to sidebar */}
      <div className="map-sidebar-section">
        <GISLayerControl
          visibility={gisVisibility}
          onChange={setGISVisibility}
        />
      </div>
    </div>
  );
}
```

### Step 2: Initialize MapLibre with GIS Layers

If building a new Live Map component with MapLibre (recommended):

```typescript
import Map from 'maplibre-gl';
import { loadGISSymbols } from '@/data/gis-symbols';
import { 
  fieldsSource, fieldsLayerFill, fieldsLayerStroke,
  installationsSource, installationsLayer,
  pipelinesSource, pipelinesLayer,
  // ... import other layer configs
} from '@/data/gis-layers';
import { DEMO_FIELDS, DEMO_INSTALLATIONS, DEMO_PIPELINES } from '@/data/gis-demo-data';

export function initializeGISLayers(map: Map, visibility: GISLayerVisibility) {
  // 1. Load SVG symbols
  loadGISSymbols(map);

  // 2. Add GeoJSON sources
  map.addSource('gis-fields', {
    ...fieldsSource,
    data: {
      type: 'FeatureCollection',
      features: DEMO_FIELDS.map(field => ({
        type: 'Feature',
        id: field.field_id,
        properties: {
          field_id: field.field_id,
          field_name: field.field_name,
          status: field.status,
          operator: field.operator,
          country: field.country,
        },
        geometry: field.geometry,
      })),
    },
  });

  map.addSource('gis-installations', {
    ...installationsSource,
    data: {
      type: 'FeatureCollection',
      features: DEMO_INSTALLATIONS.map(inst => ({
        type: 'Feature',
        id: inst.installation_id,
        properties: {
          installation_id: inst.installation_id,
          name: inst.name,
          installation_type: inst.installation_type,
          field_id: inst.field_id,
          status: inst.status,
        },
        geometry: inst.geometry,
      })),
    },
  });

  // ... add other sources (pipelines, ports, etc.)

  // 3. Add layers in proper order (bottom to top)
  map.addLayer(fieldsLayerFill, 'before:aisle-vessels'); // Fields under vessels
  map.addLayer(fieldsLayerStroke, 'before:aisle-vessels');
  map.addLayer(installationsLayer, 'before:aisle-vessels');
  map.addLayer(pipelinesLayer, 'before:aisle-vessels');
  // ... add other layers

  // 4. Set initial visibility
  updateGISLayerVisibility(map, visibility);
}

function updateGISLayerVisibility(map: Map, visibility: GISLayerVisibility) {
  map.setLayoutProperty('gis-fields-fill', 'visibility', visibility.fields ? 'visible' : 'none');
  map.setLayoutProperty('gis-fields-stroke', 'visibility', visibility.fields ? 'visible' : 'none');
  map.setLayoutProperty('gis-installations', 'visibility', visibility.installations ? 'visible' : 'none');
  map.setLayoutProperty('gis-pipelines', 'visibility', visibility.pipelines ? 'visible' : 'none');
  // ... update other layer visibility
}
```

### Step 3: Add Hover Interactions

```typescript
function addGISInteractions(map: Map) {
  // Field hover
  map.on('mousemove', 'gis-fields-fill', (e) => {
    if (e.features?.length! > 0) {
      const feature = e.features![0];
      map.setFeatureState(
        { source: 'gis-fields', id: feature.id },
        { hover: true }
      );
    }
  });

  map.on('mouseleave', 'gis-fields-fill', (e) => {
    if (e.features?.length! > 0) {
      const feature = e.features![0];
      map.setFeatureState(
        { source: 'gis-fields', id: feature.id },
        { hover: false }
      );
    }
  });

  // Field click
  map.on('click', 'gis-fields-fill', (e) => {
    if (e.features?.length! > 0) {
      const feature = e.features![0];
      const field = DEMO_FIELDS.find(f => f.field_id === feature.id);
      if (field) {
        showFieldDetailsPanel(field); // TODO: implement
      }
    }
  });

  map.setCursor('pointer');
}
```

### Step 4: Create Field Details Panel

```typescript
// components/FieldDetailsPanel.tsx
import type { OffshoreField, VesselInField } from '@/data/gis-types';
import { findVesselsInField } from '@/data/gis-spatial';
import { VESSELS } from '@/data/go/vessels';

interface FieldDetailsPanelProps {
  field: OffshoreField;
  onClose: () => void;
}

export default function FieldDetailsPanel({ field, onClose }: FieldDetailsPanelProps) {
  const vesselPositions = VESSELS
    .filter(v => v.ais)
    .map(v => ({
      imo: v.imo,
      name: v.name,
      lat: v.ais.lat,
      lon: v.ais.lon,
      speedKn: v.ais.speedKn,
      headingDeg: v.ais.headingDeg,
      updated: v.ais.ageHours,
    }));

  const vesselsInField = findVesselsInField(vesselPositions, field);

  return (
    <div className="panel field-details">
      <button className="close-btn" onClick={onClose}>✕</button>

      <h2>{field.field_name}</h2>

      <div className="field-metadata">
        <div className="field-row">
          <span className="label">Country</span>
          <span className="value">{field.country}</span>
        </div>
        <div className="field-row">
          <span className="label">Basin</span>
          <span className="value">{field.basin}</span>
        </div>
        <div className="field-row">
          <span className="label">Operator</span>
          <span className="value">{field.operator}</span>
        </div>
        <div className="field-row">
          <span className="label">Status</span>
          <span className={`status-badge ${field.status.toLowerCase()}`}>
            {field.status}
          </span>
        </div>
        <div className="field-row">
          <span className="label">Water Depth</span>
          <span className="value">{field.water_depth} m</span>
        </div>
        <div className="field-row">
          <span className="label">First Production</span>
          <span className="value">{field.first_production}</span>
        </div>
      </div>

      <div className="section">
        <h3>Vessels in Field</h3>
        {vesselsInField.length > 0 ? (
          <ul className="vessel-list">
            {vesselsInField.map(v => (
              <li key={v.vessel_imo}>
                {v.vessel_name} · {v.distance_nm} NM inside
              </li>
            ))}
          </ul>
        ) : (
          <p className="empty">No vessels currently in field</p>
        )}
      </div>

      <button className="action-button">
        Filter Map to Vessels in Field
      </button>
    </div>
  );
}
```

### Step 5: Add Vessel Context Display

Update the existing vessel intelligence panel to show GIS context:

```typescript
// In VesselIntel.tsx or similar
import { getVesselContext } from '@/data/gis-spatial';
import { DEMO_FIELDS, DEMO_INSTALLATIONS } from '@/data/gis-demo-data';

function VesselGISContext({ vessel }: { vessel: Vessel }) {
  const context = getVesselContext(
    {
      imo: vessel.imo,
      mmsi: vessel.mmsi,
      name: vessel.name,
      category: vessel.category,
      lat: vessel.ais.lat,
      lon: vessel.ais.lon,
      speedKn: vessel.ais.speedKn,
      headingDeg: vessel.ais.headingDeg,
      updated: vessel.ais.ageHours,
    },
    DEMO_FIELDS,
    DEMO_INSTALLATIONS
  );

  return (
    <div className="gis-context">
      {context.current_field && (
        <div className="context-row">
          <span className="label">Operating Field</span>
          <span className="value">{context.current_field.field_name}</span>
        </div>
      )}
      {context.nearest_installation && (
        <div className="context-row">
          <span className="label">Nearest Installation</span>
          <span className="value">
            {context.nearest_installation.name} ({context.distance_to_installation} NM)
          </span>
        </div>
      )}
      {context.operating_basin && (
        <div className="context-row">
          <span className="label">Basin</span>
          <span className="value">{context.operating_basin}</span>
        </div>
      )}
    </div>
  );
}
```

### Step 6: Wire Layer Visibility Toggle

```typescript
function handleGISVisibilityChange(visibility: GISLayerVisibility) {
  // Update local state
  setGISVisibility(visibility);

  // Update MapLibre layer visibility
  if (mapRef.current) {
    updateGISLayerVisibility(mapRef.current, visibility);
  }
}
```

## File Organization After Integration

```
pages/go/
  maps.tsx                      # Main map page (wire everything here)

components/
  GISLayerControl.tsx           # Layer toggle sidebar (DONE)
  FieldDetailsPanel.tsx         # Field popup/panel (NEW)
  InstallationDetailsPanel.tsx  # Installation popup/panel (NEW)
  LiveMapGIS.tsx                # MapLibre wrapper with GIS layers (NEW)

data/gis-*.ts                   # All GIS modules (DONE)

styles/gis.css                  # GIS-specific styling (NEW)
```

## Testing Checklist

- [ ] Layer control appears in map sidebar
- [ ] Fields render as colored polygons
- [ ] Installations appear as maritime symbols
- [ ] Pipelines show as colored lines
- [ ] Ports display as anchor symbols
- [ ] Clicking a field opens details panel
- [ ] Field panel shows vessels inside
- [ ] Vessel panel shows current field/basin
- [ ] All layers can be toggled on/off
- [ ] Hover effects work (field outline highlight)
- [ ] Zoom levels don't distort symbols
- [ ] Colors match reference design (blues, greens, oranges)

## Styling Integration

Add to `styles/go.css`:

```css
/* GIS Layer Control */
.gis-layer-control {
  /* Already scoped in component, but can add global overrides */
}

/* Field Details Panel */
.field-details {
  background: var(--panel-bg);
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 16px;
  max-width: 400px;
}

.field-metadata {
  display: grid;
  gap: 8px;
  margin: 12px 0;
  font-size: 12px;
}

.field-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.field-row .label {
  color: var(--text-2);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-badge {
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 10px;
  font-weight: 600;
}

.status-badge.producing {
  background: rgba(46, 204, 113, 0.2);
  color: #2ecc71;
}

.status-badge.development {
  background: rgba(243, 156, 18, 0.2);
  color: #f39c12;
}

.status-badge.discovery {
  background: rgba(52, 152, 219, 0.2);
  color: #3498db;
}

/* Cursor feedback */
.maplibregl-canvas.clickable-layer {
  cursor: pointer;
}
```

## Performance Notes

**Demo data**: 5 fields + 7 installations + 4 pipelines loads instantly  
**Scaling to production**: Use PostGIS for queries + MapLibre clustering

## Next: Add to Existing Map Page

The current `pages/go/maps.tsx` has a schematic field diagram. To integrate GIS:

**Option A: Replace the schematic**
- Remove schematic canvas rendering
- Wire up MapLibre with GIS layers
- Preserve the vessel list and filters on the right

**Option B: Add as alternate view**
- Keep schematic as default
- Add "Switch to Live Map" button
- Toggle between schematic and GIS views

**Recommendation**: Option A — Replace the schematic with the live GIS map using real vessel AIS data and interactive field polygons.

## Questions?

Review the fully documented GIS modules:
- `data/gis-types.ts` — All TypeScript type definitions
- `data/gis-layers.ts` — MapLibre layer configurations
- `data/gis-spatial.ts` — Spatial query functions
- `docs/GIS-SETUP.md` — Comprehensive architecture guide

All code is production-ready and can be extended without modification.
