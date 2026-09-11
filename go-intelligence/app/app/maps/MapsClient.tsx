'use client';

import { useState } from 'react';
import PageHead from '@/components/app/PageHead';
import Panel from '@/components/ui/Panel';
import EmptyState from '@/components/ui/EmptyState';
import { IconLayers, IconMaps } from '@/components/ui/Icons';
import { MAP_LAYERS, REGIONS } from '@/lib/taxonomy';
import { VESSELS } from '@/data/vessels';

/**
 * The map canvas. A real tile layer needs a provider key, so this renders
 * the chart furniture — graticule, scale, compass and coordinate readout —
 * and leaves the plotting surface ready for vessels once positions exist.
 */
function MapCanvas({ empty }: { empty: boolean }) {
  return (
    <div
      style={{
        position: 'relative',
        aspectRatio: '16 / 9',
        minHeight: 340,
        background:
          'radial-gradient(ellipse 70% 60% at 50% 40%, #12203a, #0a1220 70%)',
        borderRadius: 'var(--r-lg)',
        overflow: 'hidden',
        border: '1px solid var(--line)',
      }}
    >
      {/* Graticule */}
      <svg
        aria-hidden
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      >
        <defs>
          <pattern id="grat" width="62" height="62" patternUnits="userSpaceOnUse">
            <path
              d="M62 0H0v62"
              fill="none"
              stroke="rgba(95,168,232,0.10)"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grat)" />
        {/* A suggestion of coastline / block outlines so the surface reads
            as a chart rather than as empty graph paper. */}
        <path
          d="M-20 260 C 120 210, 210 300, 340 250 S 560 180, 700 230 S 880 300, 1040 245"
          fill="none"
          stroke="rgba(95,168,232,0.2)"
          strokeWidth="1.5"
          strokeDasharray="5 7"
        />
        <rect
          x="28%" y="26%" width="26%" height="34%"
          fill="rgba(95,168,232,0.05)"
          stroke="rgba(95,168,232,0.24)"
          strokeWidth="1"
          strokeDasharray="4 5"
          rx="3"
        />
        <rect
          x="58%" y="40%" width="20%" height="26%"
          fill="rgba(214,164,78,0.04)"
          stroke="rgba(214,164,78,0.22)"
          strokeWidth="1"
          strokeDasharray="4 5"
          rx="3"
        />
      </svg>

      {/* Compass */}
      <div
        className="mono"
        style={{
          position: 'absolute',
          top: 16,
          right: 18,
          textAlign: 'center',
          color: 'var(--text-4)',
          fontSize: 10,
          letterSpacing: '0.15em',
        }}
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M12 3 L15 13 L12 11 L9 13 Z" fill="var(--blue-400)" />
          <circle cx="12" cy="12" r="9" stroke="rgba(95,168,232,0.3)" strokeWidth="1" />
        </svg>
        N
      </div>

      {/* Scale bar */}
      <div
        style={{
          position: 'absolute',
          bottom: 16,
          left: 18,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <div
          style={{
            width: 64,
            height: 4,
            background:
              'linear-gradient(90deg, var(--blue-400) 50%, transparent 50%)',
            border: '1px solid var(--line-2)',
          }}
        />
        <span className="mono" style={{ fontSize: 10, color: 'var(--text-5)' }}>
          50 nm
        </span>
      </div>

      {/* Coordinate readout */}
      <div
        className="mono"
        style={{
          position: 'absolute',
          bottom: 16,
          right: 18,
          fontSize: 10.5,
          color: 'var(--text-5)',
        }}
      >
        — ° N &nbsp; — ° E
      </div>

      {empty && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'grid',
            placeItems: 'center',
            padding: 24,
          }}
        >
          <div
            style={{
              textAlign: 'center',
              maxWidth: 400,
              background: 'rgba(10,15,26,0.82)',
              backdropFilter: 'blur(6px)',
              border: '1px solid var(--line-2)',
              borderRadius: 'var(--r-lg)',
              padding: '24px 26px',
            }}
          >
            <div className="empty-mark" style={{ margin: '0 auto 14px' }}>
              <IconMaps size={22} />
            </div>
            <h3 className="empty-title" style={{ marginBottom: 9 }}>
              No positions to plot
            </h3>
            <p className="empty-body" style={{ margin: '0 auto' }}>
              Vessels appear here once records carry a{' '}
              <span className="mono" style={{ color: 'var(--blue-300)' }}>
                position
              </span>{' '}
              with latitude and longitude. Connect a tile provider and an AIS
              feed to make the basemap live.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MapsClient() {
  const [active, setActive] = useState<string[]>(['vessels', 'platforms', 'blocks']);
  const [region, setRegion] = useState<string>(REGIONS[0]);

  const toggleLayer = (id: string) =>
    setActive((a) => (a.includes(id) ? a.filter((x) => x !== id) : [...a, id]));

  const positioned = VESSELS.filter((v) => v.position);

  return (
    <>
      <PageHead
        eyebrow="Analysis · GO Maps & Layers"
        title="Maps & Layers"
        sub="Every vessel, platform and block on one live map — tracked against concession blocks, fields and pipelines."
        actions={
          <select
            className="select"
            style={{ width: 'auto', height: 31, fontSize: 12.5 }}
            value={region}
            onChange={(e) => setRegion(e.target.value)}
          >
            {REGIONS.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        }
      />

      <div
        className="grid"
        style={{ gridTemplateColumns: 'minmax(0, 1fr) 288px', alignItems: 'start' }}
      >
        <div className="stack g16" style={{ minWidth: 0 }}>
          <MapCanvas empty={positioned.length === 0} />

          <Panel title="Field utilisation trend">
            <div className="panel-body">
              <div className="ghost-bars">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    className="ghost-bar"
                    key={i}
                    style={{ height: `${26 + ((i * 13) % 58)}%`, opacity: 0.5 }}
                  />
                ))}
              </div>
              <div
                className="between"
                style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--line)' }}
              >
                <span className="mono" style={{ fontSize: 10.5, color: 'var(--text-5)' }}>
                  12 MO AGO
                </span>
                <span className="muted" style={{ fontSize: 12 }}>
                  Trend plots once utilisation points exist for this region
                </span>
                <span className="mono" style={{ fontSize: 10.5, color: 'var(--text-5)' }}>
                  TODAY
                </span>
              </div>
            </div>
          </Panel>
        </div>

        <div className="stack g16">
          <Panel title="Layers">
            <div className="panel-body stack g2" style={{ gap: 2 }}>
              {MAP_LAYERS.map((l) => (
                <button
                  key={l.id}
                  className={`rail-opt${active.includes(l.id) ? ' is-on' : ''}`}
                  onClick={() => toggleLayer(l.id)}
                >
                  <span className="checkbox">
                    {active.includes(l.id) && (
                      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#04121f" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <path d="m4.5 12.5 5 5 10-11" />
                      </svg>
                    )}
                  </span>
                  <span className="stack" style={{ gap: 2, minWidth: 0 }}>
                    <span>{l.name}</span>
                    <span style={{ fontSize: 10.5, color: 'var(--text-5)' }}>{l.desc}</span>
                  </span>
                </button>
              ))}
            </div>
          </Panel>

          <Panel
            title={`Vessels · ${region}`}
            action={
              <span className="mono" style={{ fontSize: 10.5, color: 'var(--text-5)' }}>
                {positioned.length}
              </span>
            }
          >
            {positioned.length === 0 ? (
              <EmptyState
                icon={<IconLayers size={20} />}
                title="No vessels in view"
                body="Vessels with a recorded position in this region are listed here, and clicking one opens its full profile."
                file="data/vessels.ts"
              />
            ) : (
              <div>
                {positioned.map((v) => (
                  <div className="feed-item" key={v.imo}>
                    <span className="feed-mark">
                      <IconMaps size={14} />
                    </span>
                    <div className="grow">
                      <div className="feed-title">{v.name}</div>
                      <div className="feed-meta">
                        {v.subType} · {v.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Panel>
        </div>
      </div>
    </>
  );
}
