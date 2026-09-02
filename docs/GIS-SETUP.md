# Offshore GIS Intelligence Layer Setup

This guide walks you through the professional offshore GIS layer for GO Intelligence Live Map.

## Overview

The GIS layer adds offshore infrastructure visualization to the live AIS vessel tracking map:

- **Offshore Fields** — Oil & gas field boundaries with production status
- **Installations** — Platforms, FPSOs, wells, subsea equipment with professional symbols
- **Pipelines** — Export, import, and intra-field pipelines color-coded by product
- **Licence Areas** — Concession blocks and licence boundaries
- **Ports** — Major offshore support and loading terminals
- **Wind Farms** — Renewable energy installations

All layers integrate seamlessly with live vessel positions, allowing spatial queries like "Which vessels are in this field?" and "What's near this platform?"

## Architecture

### Files

```
data/
  gis-types.ts              # TypeScript types for fields, installations, pipelines
  gis-layers.ts             # MapLibre layer configurations
  gis-symbols.ts            # SVG symbols for installation types
  gis-spatial.ts            # Spatial queries (vessel-to-field matching)
  gis-demo-data.ts          # Demo fields/platforms/pipelines for testing

components/
  GISLayerControl.tsx       # UI: toggle layers on/off by category
```

### Data Model

**OffshoreField**
- field_id, field_name, field_type (Oil/Gas/Oil&Gas/Wind)
- operator, owners, country, basin
- status (Producing/Development/Discovery/Decommissioned)
- discovery_year, first_production, water_depth, total_area
- GeoJSON Polygon or MultiPolygon geometry

**OffshoreInstallation**
- installation_id, name, installation_type (Platform/FPSO/Well/etc.)
- field_id (link to parent field), operator, owner, country
- latitude, longitude (point geometry)
- status, commissioned_date, water_depth, capacity

**OffshoreePipeline**
- pipeline_id, name, operator, pipeline_type (Export/Intra-field/Import)
- product (Oil/Gas/Water/Electricity)
- origin, destination, status, diameter, length
- GeoJSON LineString or MultiLineString geometry

### Storage

Two approaches:

**Option 1: In-Memory (Development)**
- Demo data loaded from `gis-demo-data.ts`
- No database needed
- Instant startup, perfect for testing

**Option 2: PostGIS Database (Production)**
- Spatial queries run server-side: `ST_Contains`, `ST_DWithin`, `ST_Distance`
- Efficient for thousands of features
- Persistent storage

Currently, the demo uses in-memory data. Production setup requires a PostGIS-enabled PostgreSQL database.

## Quick Start (5 minutes)

### 1. View demo fields and installations
The GO Intelligence map already includes demo data. No additional setup needed.

### 2. Toggle layers on/off
In the map's layer control panel, check/uncheck:
- **OIL & GAS** → Fields, Platforms, Pipelines
- **LICENSING** → Licence Blocks
- **MARITIME** → Ports
- **RENEWABLES** → Wind Farms

Fields render as semi-transparent colored polygons. Installations render as professional maritime symbols. Pipelines are color-coded by product (brown=oil, blue=gas).

### 3. Interact with features

**Hover over a field** → Boundary highlights in gold

**Click a field** → Opens field details panel showing:
- Operator and partners
- Production status and water depth
- Associated installations
- Vessels currently in/near the field

**Hover over an installation** → Glow effect, marker enlarges

**Click an installation** → Opens installation details showing:
- Type (platform, FPSO, well)
- Field association
- Status and capacity
- Nearby vessels

## Spatial Queries

The `gis-spatial.ts` module provides vessel-to-infrastructure matching:

### Client-Side (JavaScript)

```typescript
import { vesselInField, findVesselsInField, getVesselContext } from '@/data/gis-spatial';

// Check if vessel is inside a field
const inside = vesselInField(vessel, field);

// Find all vessels in a field
const vessels = findVesselsInField(allVessels, field);

// Get vessel's operational context
const context = getVesselContext(vessel, fields, installations);
// Returns: current_field, nearest_installation, operating_basin, etc.
```

### Server-Side (PostGIS, future)

```sql
-- Vessels inside a field
SELECT v.* FROM vessels v
WHERE ST_Contains(fields.geometry, ST_Point(v.lon, v.lat))
  AND fields.field_id = 'js-field';

-- Vessels within 25 NM of a field
SELECT v.*, ST_Distance(v.point, fields.geometry) / 1852 as distance_nm
FROM vessels v, fields
WHERE ST_DWithin(v.point, fields.geometry, 25 * 1852)
  AND fields.field_id = 'js-field'
ORDER BY distance_nm ASC;

-- Find nearest platform to a vessel
SELECT i.* FROM installations i
WHERE i.field_id = 'js-field'
ORDER BY ST_Distance(i.point, ST_Point($lon, $lat)) ASC
LIMIT 1;
```

## Styling Configuration

Fields are color-coded by **Status** by default:

```
Producing       → Green (#2ecc71)
Development     → Orange (#f39c12)
Appraisal       → Purple (#9b59b6)
Discovery       → Blue (#3498db)
Exploration     → Gray (#95a5a6)
Decommissioned  → Dark Gray (#7f8c8d)
Abandoned       → Darker Gray (#34495e)
Shut-in         → Red (#e74c3c)
```

To change classification (e.g., by Operator or Basin), modify the MapLibre paint property in `gis-layers.ts`:

```typescript
'fill-color': [
  'match',
  ['get', 'operator'],  // Changed from 'status'
  'Equinor', '#2ecc71',
  'Shell', '#f39c12',
  'Saudi Aramco', '#9b59b6',
  '#666',
]
```

Pipelines are color-coded by **Product**:

```
Oil         → Brown (#8b4513)
Gas         → Sky Blue (#87ceeb)
Water       → Royal Blue (#4169e1)
Condensate  → Goldenrod (#daa520)
Brine       → Light Sea Green (#20b2aa)
Electricity → Yellow (#ffff00)
```

## Symbol Reference

Installation types use professional maritime SVG symbols:

| Type | Symbol |
|------|--------|
| Fixed Platform | Vertical tower with legs |
| Production Platform | Tower with processing equipment |
| Drilling Platform | Derrick with drilling rig |
| Jack-up Rig | Barge with extended legs |
| Semi-submersible | Floating hull with columns |
| FPSO | Ship-shaped vessel with flare stack |
| FSO | Storage vessel without flare |
| FLNG | LNG carrier with cargo tanks |
| Well | Circle with center dot |
| Subsea Manifold | Connection node with ports |
| SPM | Mooring buoy |
| Wind Turbine | Tower with three rotor blades |
| Offshore Terminal | Pier with loading equipment |

## Adding Custom GIS Data

### Option 1: Demo Data (Quickest)

Edit `data/gis-demo-data.ts` to add your fields, installations, or pipelines:

```typescript
export const DEMO_FIELDS: OffshoreField[] = [
  {
    field_id: 'my-field',
    field_name: 'My New Field',
    field_type: 'Oil Field',
    operator: 'My Operator',
    // ... rest of properties
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [lon1, lat1],
          [lon2, lat2],
          [lon3, lat3],
          [lon1, lat1],  // Close the polygon
        ],
      ],
    },
  },
];
```

### Option 2: Import from GeoJSON

Create `public/gis/my-fields.geojson`:

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "id": "js-field",
      "properties": {
        "field_id": "js-field",
        "field_name": "Johan Sverdrup",
        "field_type": "Oil & Gas Field",
        "operator": "Equinor",
        "status": "Producing"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[...]]
      }
    }
  ]
}
```

Then load in the map component:

```typescript
const response = await fetch('/gis/my-fields.geojson');
const data = await response.json();
setFieldsGeoJSON(data);
```

### Option 3: Import from KML/Shapefile (Future)

Build an import tool using:
- **KML** → Use `geokml` library to convert to GeoJSON
- **Shapefile** → Use `shapefile` library to extract features
- **CSV with coordinates** → Build a simple parser and project to GeoJSON

```typescript
import * as shapefile from 'shapefile';

const source = await shapefile.open('/path/to/file.shp');
const collection = await source.read();
// Normalize to OffshoreField type
```

## Vessel-to-Field Integration

### Automatic Vessel Context

When a vessel is selected, the map displays:

```
CURRENT FIELD: Johan Sverdrup
NEAREST INSTALLATION: Johan Sverdrup P2 (3.8 NM)
OPERATING BASIN: North Sea
NEARBY VESSELS: 5 vessels within 25 NM
```

This is computed by `getVesselContext()` in `gis-spatial.ts`.

### Filter Vessels by Field

Clicking "VIEW VESSELS IN FIELD" button:
1. Finds all vessels inside the field polygon
2. Filters the AIS layer to show only those vessels
3. Highlights the field boundary in gold

Implemented in the field details panel.

## Performance Optimization

### For Development

Demo data (18 fields + 7 installations + 4 pipelines) loads instantly. No optimization needed.

### For Production (1000s of features)

1. **Clustering** — Group nearby installations at low zoom levels
2. **Geometry Simplification** — Reduce polygon vertex count
3. **Server-Side Rendering** — Only send visible features based on viewport bbox
4. **Indexed Queries** — PostGIS spatial indexes on geometry columns
5. **Lazy Loading** — Load layers on-demand when toggled on

In MapLibre:

```typescript
// Cluster installations at zoom < 8
{
  id: 'gis-installations-cluster',
  type: 'circle',
  source: {
    type: 'geojson',
    data: installationsGeoJSON,
    cluster: true,
    clusterMaxZoom: 8,
    clusterRadius: 50,
  },
  // ... paint properties
}
```

## Layer Stacking Order

On the map, layers render in this order (bottom to top):

1. Base map (ocean, land)
2. **Licence areas** (dashed, subtle)
3. **Field boundaries** (semi-transparent fill + stroke)
4. **Pipelines** (colored lines)
5. **Ports** (anchor symbols)
6. **Installations** (platform/FPSO/well symbols)
7. **Live AIS vessels** (colorful chevrons, ALWAYS on top)

This ensures vessel chevrons remain the highest-priority moving objects.

## Database Schema (PostGIS)

When implementing production storage:

```sql
CREATE TABLE offshore_fields (
  field_id VARCHAR PRIMARY KEY,
  field_name VARCHAR NOT NULL,
  field_type VARCHAR,
  operator VARCHAR,
  owners TEXT[],
  country VARCHAR,
  basin VARCHAR,
  status VARCHAR,
  discovery_year INT,
  first_production INT,
  water_depth FLOAT,
  total_area FLOAT,
  geometry GEOMETRY(Polygon, 4326),  -- WGS84 lat/lon
  source VARCHAR,
  last_updated TIMESTAMP
);

CREATE INDEX idx_fields_geometry ON offshore_fields USING GIST(geometry);

-- Similar tables for installations, pipelines, licences, ports
```

## API Endpoints (Future)

When backend is ready:

```
GET /api/gis/fields              → All fields
GET /api/gis/fields/:field_id    → Field details + spatial context
GET /api/gis/installations       → All installations
GET /api/gis/vessels-in-field/:field_id    → Vessels inside field
GET /api/gis/vessels-near/:lat/:lon/:radius → Vessels near coordinates
POST /api/gis/import             → Import GeoJSON/KML/Shapefile
```

## Next Steps

1. **Test demo** — Open the map, toggle layers, click features
2. **Add your data** — Update `gis-demo-data.ts` with real fields/platforms
3. **Connect to PostGIS** — When ready, replace demo data with database queries
4. **Build import tools** — Allow users to upload their own GIS datasets
5. **Historical playback** — Archive vessel-to-field relationships over time
6. **Alerts** — Notify when vessels enter/exit fields or approach installations

## Troubleshooting

### Fields/installations not showing

1. Check layer visibility — Toggle "Fields" and "Platforms" in layer control
2. Verify zoom level — Some layers only show at zoom > 5
3. Check map bounds — Features might be outside current viewport

### Symbols not rendering

1. Ensure MapLibre symbols are loaded — `loadGISSymbols(map)` called in map initialization
2. Check browser console for image loading errors
3. Verify SVG data URIs are valid (check `gis-symbols.ts`)

### Performance issues with many features

1. Use clustering for installations
2. Simplify polygon geometries
3. Implement viewport-based fetching (only load features visible on screen)
4. Use PostGIS spatial indexes

## Questions?

Check the demo implementation in this repository. All GIS types, layers, and spatial functions are fully documented and ready to extend.
