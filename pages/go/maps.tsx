import Link from 'next/link';
import { useMemo, useState } from 'react';
import AppShell from '@/components/go/AppShell';
import { useAccount } from '@/components/go/AccountContext';
import { Disclaimer, Gate, PageHead, Panel, Status } from '@/components/go/ui';
import GISLayerControl from '@/components/GISLayerControl';
import { ZONES, ZONE_BY_ID } from '@/data/go/zones';
import { VESSELS } from '@/data/go/vessels';
import { COMPANY_BY_ID } from '@/data/go/companies';
import { findBenchmark } from '@/data/go/market';
import { DEMO_FIELDS, DEMO_INSTALLATIONS } from '@/data/gis-demo-data';
import { findVesselsInField, getVesselContext } from '@/data/gis-spatial';
import type { LayerKind } from '@/data/go/types';
import type { GISLayerVisibility, OffshoreField } from '@/data/gis-types';

const LAYER_TOGGLES: { key: LayerKind; label: string }[] = [
  { key: 'field', label: 'Field' },
  { key: 'block', label: 'Block' },
  { key: 'platform', label: 'Platform' },
  { key: 'pipeline', label: 'Pipeline' },
  { key: 'port', label: 'Port' },
];

/**
 * Vessel positions projected onto the schematic canvas. The bounds are fitted to
 * the drawn Safaniya field rectangle so in-field tonnage renders inside the
 * boundary rather than floating next to it.
 */
const CANVAS_BOUNDS = { latMin: 27.73, latMax: 27.97, lonMin: 49.02, lonMax: 49.25 };
const FIELD_BOX = { x: 33, y: 34, w: 38, h: 34 };

function project(lat: number, lon: number) {
  const fx = (lon - CANVAS_BOUNDS.lonMin) / (CANVAS_BOUNDS.lonMax - CANVAS_BOUNDS.lonMin);
  const fy = 1 - (lat - CANVAS_BOUNDS.latMin) / (CANVAS_BOUNDS.latMax - CANVAS_BOUNDS.latMin);
  return {
    x: FIELD_BOX.x + Math.max(0, Math.min(1, fx)) * FIELD_BOX.w,
    y: FIELD_BOX.y + Math.max(0, Math.min(1, fy)) * FIELD_BOX.h,
  };
}

const VESSEL_TONE: Record<string, string> = {
  'On hire': '',
  Standby: 'standby',
  Transit: 'transit',
  'Off hire': 'off',
  'In yard': 'off',
  'Laid up': 'off',
};

export default function Maps() {
  const { can } = useAccount();
  const [layers, setLayers] = useState<LayerKind[]>(['field', 'block', 'platform', 'pipeline', 'port']);
  const [focus, setFocus] = useState<string | null>('9784521');
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
  const focused = inField.find((v) => v.imo === focus) ?? inField[0];
  const bmPsv = findBenchmark('Middle East Gulf', 'PSV', 'Medium');
  const bmAhts = findBenchmark('Middle East Gulf', 'AHTS', 'Medium');

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

  const drawn = ZONES.filter((z) => layers.includes(z.kind) && (z.w !== 0 || z.kind === 'platform' || z.kind === 'port'));

  return (
    <AppShell title="Maps & Layers" wide>
      <PageHead
        eyebrow="Analysis · GO Maps & Layers"
        title="Every vessel, platform and block — one live map"
        lede="A cluster of OSVs operating inside Safaniya Field, tracked against concession blocks, platforms and pipelines in real time."
        actions={
          <div className="go-legend">
            {LAYER_TOGGLES.map((l) => (
              <button
                key={l.key}
                className={`go-chip ${layers.includes(l.key) ? 'on' : ''}`}
                style={layers.includes(l.key) ? { background: 'var(--acc-dim)', color: 'var(--acc)', borderColor: 'var(--acc)' } : { opacity: 0.55 }}
                onClick={() => setLayers((ls) => (ls.includes(l.key) ? ls.filter((x) => x !== l.key) : [...ls, l.key]))}
              >
                {l.label}
              </button>
            ))}
          </div>
        }
      />

      <div className="go-grid" style={{ gridTemplateColumns: 'minmax(0, 2.1fr) minmax(0, 1fr)' }}>
        <div className="go-map">
          <div className="go-map-grid" />

          {drawn
            .filter((z) => z.w && z.h)
            .map((z) => (
              <div
                key={z.id}
                className={`go-map-zone ${z.kind}`}
                style={{ left: `${z.x}%`, top: `${z.y}%`, width: `${z.w}%`, height: `${z.h}%` }}
              >
                {z.kind !== 'pipeline' && <span className="go-map-zonelabel">{z.name}</span>}
              </div>
            ))}

          {drawn
            .filter((z) => z.kind === 'platform' || z.kind === 'port')
            .map((z) => (
              <div key={z.id} className="go-map-node" style={{ left: `${z.x}%`, top: `${z.y}%` }}>
                <div className={z.kind === 'platform' ? 'go-map-platform' : 'go-map-port'} />
                <span className="go-map-nodelabel">{z.name}</span>
              </div>
            ))}

          {inField.map((v) => {
            const p = project(v.ais.lat, v.ais.lon);
            return (
              <button
                key={v.imo}
                className="go-map-node"
                style={{ left: `${p.x}%`, top: `${p.y}%`, background: 'none', border: 0, padding: 0 }}
                onClick={() => setFocus(v.imo)}
                aria-label={`${v.name} — ${v.status}`}
                title={`${v.name} · ${v.subType} · ${v.status}`}
              >
                <div
                  className={`go-map-vessel ${VESSEL_TONE[v.status] ?? ''}`}
                  style={{ transform: `rotate(${v.ais.headingDeg}deg)` }}
                />
                {focus === v.imo && <span className="go-map-nodelabel" style={{ color: 'var(--acc)' }}>{v.name}</span>}
              </button>
            );
          })}

          <div className="go-map-compass">
            <div style={{ fontSize: 13 }}>▲</div>
            N
          </div>

          <div className="go-map-hud">
            <span>27.90° N &nbsp; 49.15° E</span>
            <span>·</span>
            <span>{field.name} · operated &amp; licensed by {field.operator}</span>
            <span style={{ marginLeft: 'auto' }}>
              {inField.length} vessels in field · field utilisation {field.utilisationPct}% (was{' '}
              {field.utilisationYearAgoPct}% 12 mo ago)
            </span>
          </div>
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

          <Panel title={`ACTIVE VESSELS · ${field.name.toUpperCase()}`} note="click for the full profile" flush>
            <div className="go-tablewrap">
              <table className="go-table" style={{ minWidth: 0 }}>
                <tbody>
                  {inField.map((v) => (
                    <tr
                      key={v.imo}
                      className="go-rowlink"
                      onClick={() => setFocus(v.imo)}
                      style={focus === v.imo ? { background: 'var(--panel-3)' } : undefined}
                    >
                      <td>
                        <Link href={`/go/fleet/${v.imo}`} className="go-link">
                          {v.name} ›
                        </Link>
                        <div style={{ fontSize: 11.5, color: 'var(--text-3)', marginTop: 3 }}>
                          {v.subType} · {COMPANY_BY_ID.get(v.ownerId)?.name}
                        </div>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <Status value={v.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>

          <Panel title="FIELD UTILISATION TREND" note={`${inField.length} OSVs · ${field.name}`}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
              <div>
                <div className="eyebrow">12 mo ago</div>
                <div className="go-stat-val" style={{ fontSize: 22, color: 'var(--text-2)' }}>
                  {field.utilisationYearAgoPct}%
                </div>
              </div>
              <div style={{ color: 'var(--text-3)' }}>→</div>
              <div>
                <div className="eyebrow">Today</div>
                <div className="go-stat-val" style={{ fontSize: 26, color: 'var(--acc)' }}>
                  {field.utilisationPct}%
                </div>
              </div>
            </div>
          </Panel>

          <Panel title="MEDIUM OSV BENCHMARK · ME GULF">
            <div style={{ display: 'grid', gap: 12 }}>
              {[bmPsv, bmAhts].filter(Boolean).map((b) => (
                <div key={b!.id} style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                  <span className="go-pill acc">{b!.subType}</span>
                  <span className="mono" style={{ color: 'var(--text)', marginLeft: 'auto' }}>
                    ${b!.low.toLocaleString()}–${b!.high.toLocaleString()}/day
                  </span>
                </div>
              ))}
              <p className="go-note">Indicative term rates — confirm with broker quotes.</p>
            </div>
          </Panel>

          {focused && focusedContext && (
            <Panel title="SELECTED VESSEL">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Link href={`/go/fleet/${focused.imo}`} className="go-link" style={{ fontSize: 15 }}>
                  {focused.name}
                </Link>
                <Status value={focused.status} />
              </div>
              <p style={{ fontSize: 12.5, color: 'var(--text-2)', marginTop: 9 }}>
                {focused.subType} ({focused.sizeClass}) · IMO {focused.imo} · position{' '}
                {focused.ais.ageHours}h old · {focused.ais.status} · {focused.ais.daysInZone} days in field.
              </p>

              {/* GIS Context */}
              {focusedContext.current_field && (
                <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border)', fontSize: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ color: 'var(--text-2)' }}>Operating Field</span>
                    {focusedContext.current_field && (
                      <span className="go-link" style={{ fontSize: 12, cursor: 'pointer' }} onClick={() => setSelectedField(focusedContext.current_field!)}>
                        {focusedContext.current_field.field_name}
                      </span>
                    )}
                  </div>
                  {focusedContext.nearest_installation && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ color: 'var(--text-2)' }}>Nearest Installation</span>
                      <span>
                        {focusedContext.nearest_installation.name} ({focusedContext.distance_to_installation} NM)
                      </span>
                    </div>
                  )}
                  {focusedContext.operating_basin && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-2)' }}>Basin</span>
                      <span>{focusedContext.operating_basin}</span>
                    </div>
                  )}
                </div>
              )}
            </Panel>
          )}
        </div>
      </div>

      <div style={{ marginTop: 14 }}>
        <Disclaimer>
          Schematic map — illustrative, for concept purposes only. Production deploys vector basemap tiles
          with licensed concession-block, platform and pipeline layers, and satellite AIS from Year 2.
        </Disclaimer>
      </div>
    </AppShell>
  );
}
