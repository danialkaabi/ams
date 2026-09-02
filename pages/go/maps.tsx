import { useMemo, useState } from 'react';
import AppShell from '@/components/go/AppShell';
import { useAccount } from '@/components/go/AccountContext';
import { Gate, PageHead, Panel } from '@/components/go/ui';
import GISLayerControl from '@/components/GISLayerControl';
import LiveMapGIS from '@/components/go/LiveMapGIS';
import { ZONE_BY_ID } from '@/data/go/zones';
import { VESSELS } from '@/data/go/vessels';
import { DEMO_FIELDS, DEMO_INSTALLATIONS } from '@/data/gis-demo-data';
import { findVesselsInField, getVesselContext } from '@/data/gis-spatial';
import type { GISLayerVisibility, OffshoreField } from '@/data/gis-types';


export default function Maps() {
  const { can } = useAccount();
  const [selectedField, setSelectedField] = useState<OffshoreField | null>(null);
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

  const field = ZONE_BY_ID.get('safaniya-field')!;
  const inField = useMemo(() => VESSELS.filter((v) => v.ais.zoneId === 'safaniya-field'), []);
  const focused = inField[0];

  // Convert vessels to spatial query format
  const vesselPositions = inField.map((v) => ({
    mmsi: parseInt(v.mmsi || '0'),
    imo: v.imo,
    name: v.name,
    category: v.category,
    lat: v.ais.lat,
    lon: v.ais.lon,
    speedKn: v.ais.speedKn,
    headingDeg: v.ais.headingDeg,
    updated: Date.now(),
  }));

  // Get context for focused vessel
  const focusedContext = focused
    ? getVesselContext(
        {
          mmsi: parseInt(focused.mmsi || '0'),
          imo: focused.imo,
          name: focused.name,
          category: focused.category,
          lat: focused.ais.lat,
          lon: focused.ais.lon,
          speedKn: focused.ais.speedKn,
          headingDeg: focused.ais.headingDeg,
          updated: Date.now(),
        },
        DEMO_FIELDS,
        DEMO_INSTALLATIONS
      )
    : null;

  if (!can('maps')) {
    return (
      <AppShell title="Maps & Layers">
        <Gate feature="GO Maps & Layers" upgradeTo="NOC & EPC Contractor" />
      </AppShell>
    );
  }

  return (
    <AppShell title="Maps & Layers" wide>
      <PageHead
        eyebrow="Analysis · GO Maps & Layers"
        title="Offshore infrastructure and vessel operations"
        lede="Live map showing offshore fields, installations, pipelines, and ports in the North Sea and Arabian Gulf with integrated vessel tracking."
      />

      <div className="go-grid" style={{ gridTemplateColumns: 'minmax(0, 2.1fr) minmax(0, 1fr)' }}>
        <div className="go-map" style={{ position: 'relative' }}>
          <LiveMapGIS
            visibility={gisVisibility}
            onFieldClick={setSelectedField}
          />
        </div>

        <div style={{ display: 'grid', gap: 14, alignContent: 'start', minHeight: 0 }}>
          {/* GIS Layer Control */}
          <GISLayerControl visibility={gisVisibility} onChange={setGISVisibility} />

          {/* Selected Field Details */}
          {selectedField && (
            <Panel
              title={selectedField.field_name.toUpperCase()}
              note={selectedField.operator}
              onClose={() => setSelectedField(null)}
            >
              <div style={{ display: 'grid', gap: 8, fontSize: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-2)' }}>Country</span>
                  <span>{selectedField.country}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-2)' }}>Basin</span>
                  <span>{selectedField.basin}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-2)' }}>Status</span>
                  <span
                    className="go-pill"
                    style={{
                      fontSize: 10,
                      padding: '2px 6px',
                      background:
                        selectedField.status === 'Producing'
                          ? 'rgba(46, 204, 113, 0.2)'
                          : selectedField.status === 'Development'
                            ? 'rgba(243, 156, 18, 0.2)'
                            : 'rgba(52, 152, 219, 0.2)',
                      color:
                        selectedField.status === 'Producing'
                          ? '#2ecc71'
                          : selectedField.status === 'Development'
                            ? '#f39c12'
                            : '#3498db',
                    }}
                  >
                    {selectedField.status}
                  </span>
                </div>
                {selectedField.water_depth && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-2)' }}>Water Depth</span>
                    <span>{selectedField.water_depth} m</span>
                  </div>
                )}
                {selectedField.first_production && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-2)' }}>First Production</span>
                    <span>{selectedField.first_production}</span>
                  </div>
                )}
              </div>

              {/* Vessels in selected field */}
              {gisVisibility.fields && (
                <div style={{ marginTop: 12 }}>
                  <h4 style={{ fontSize: 11, color: 'var(--text-2)', margin: '6px 0', textTransform: 'uppercase' }}>
                    Vessels
                  </h4>
                  {findVesselsInField(vesselPositions, selectedField).length > 0 ? (
                    <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12 }}>
                      {findVesselsInField(vesselPositions, selectedField).map((v) => (
                        <li key={v.vessel_imo} style={{ color: 'var(--text-3)' }}>
                          {v.vessel_name}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p style={{ fontSize: 12, color: 'var(--text-3)', margin: 0 }}>No vessels</p>
                  )}
                </div>
              )}
            </Panel>
          )}

          {/* Demo Fields Quick Access */}
          {!selectedField && gisVisibility.fields && (
            <Panel title="GIS FIELDS" note="demo data · North Sea & Arabian Gulf" flush>
              <div className="go-tablewrap">
                <table className="go-table" style={{ minWidth: 0, fontSize: 12 }}>
                  <tbody>
                    {DEMO_FIELDS.map((f) => (
                      <tr
                        key={f.field_id}
                        className="go-rowlink"
                        onClick={() => setSelectedField(f)}
                        style={{ cursor: 'pointer' }}
                      >
                        <td>
                          <span className="go-link">{f.field_name} ›</span>
                          <div style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 2 }}>
                            {f.operator}
                          </div>
                        </td>
                        <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                          <span
                            style={{
                              fontSize: 9,
                              padding: '2px 4px',
                              background:
                                f.status === 'Producing'
                                  ? 'rgba(46, 204, 113, 0.3)'
                                  : 'rgba(243, 156, 18, 0.3)',
                              color: f.status === 'Producing' ? '#2ecc71' : '#f39c12',
                              borderRadius: 2,
                            }}
                          >
                            {f.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>
          )}

        </div>
      </div>
    </AppShell>
  );
}
