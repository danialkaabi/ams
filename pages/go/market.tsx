import { useMemo, useState } from 'react';
import AppShell from '@/components/go/AppShell';
import { useAccount } from '@/components/go/AccountContext';
import {
  Confidence, Disclaimer, Gate, Meter, PageHead, Panel, RateRange, Sparkline,
  StatTile, TrendMark,
} from '@/components/go/ui';
import { IconExport } from '@/components/go/Icons';
import { BENCHMARKS, UTILISATION } from '@/data/go/market';
import { REGIONS } from '@/data/go/types';
import type { Region } from '@/data/go/types';

export default function Market() {
  const { can, plan } = useAccount();
  const [region, setRegion] = useState<Region>('Middle East Gulf');
  const [compare, setCompare] = useState(false);

  const rows = useMemo(() => BENCHMARKS.filter((b) => b.region === region), [region]);
  const util = UTILISATION.find((u) => u.region === region)!;
  const rising = rows.filter((b) => b.trend === 'up').length;

  if (!can('market')) {
    return (
      <AppShell title="Market">
        <Gate feature="GO Market" upgradeTo="NOC & EPC Contractor" />
      </AppShell>
    );
  }

  return (
    <AppShell title="Market" wide>
      <PageHead
        eyebrow="Analysis · GO Market"
        title="GO Market"
        lede="Day-rate benchmarks by region, vessel type and size class — five basins, benchmarked side by side, with twelve months of history behind every midpoint."
        actions={
          <>
            <select className="go-select" style={{ width: 190 }} value={region} onChange={(e) => setRegion(e.target.value as Region)} aria-label="Select region">
              {REGIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <button className={`go-btn ${compare ? 'primary' : ''}`} onClick={() => setCompare((v) => !v)}>
              Compare basins
            </button>
            <button className="go-btn" disabled={!can('export')} title={can('export') ? undefined : `Excel export is not included on the ${plan.name} account`}>
              <IconExport /> Export
            </button>
          </>
        }
      />

      <div className="go-grid c4" style={{ marginBottom: 14 }}>
        <StatTile value={`${util.utilisationPct}%`} label={`${region} utilisation`} delta={{ value: `${util.utilisationPct - util.yearAgoPct > 0 ? '+' : ''}${util.utilisationPct - util.yearAgoPct} pts YoY`, dir: util.utilisationPct >= util.yearAgoPct ? 'up' : 'down' }} />
        <StatTile value={util.vesselCount} label="OSVs tracked in basin" tone="accent-2" />
        <StatTile value={rows.length} label="Published benchmarks" />
        <StatTile value={`${rising}/${rows.length}`} label="Benchmarks trending up" tone={rising > rows.length / 2 ? undefined : 'warn'} />
      </div>

      <Panel title={`TERM RATE BENCHMARKS · ${region.toUpperCase()}`} note="USD/day · indicative term rate" flush>
        <div className="go-tablewrap">
          <table className="go-table">
            <thead>
              <tr>
                <th>Vessel type</th>
                <th>Size class</th>
                <th>Low</th>
                <th>Mid</th>
                <th>High</th>
                <th>Band</th>
                <th>12-month trend</th>
                <th>30-day</th>
                <th>Confidence</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((b) => (
                <tr key={b.id}>
                  <td>
                    <strong>{b.subType}</strong>
                  </td>
                  <td>{b.sizeClass}</td>
                  <td className="num">${b.low.toLocaleString()}</td>
                  <td className="num" style={{ color: 'var(--text)' }}>
                    ${b.mid.toLocaleString()}
                  </td>
                  <td className="num">${b.high.toLocaleString()}</td>
                  <td style={{ width: 150 }}>
                    <RateRange low={b.low} high={b.high} actual={b.mid} />
                  </td>
                  <td style={{ width: 110 }}>
                    <Sparkline points={b.history} width={90} height={20} tone={b.trend === 'down' ? 'var(--bad)' : 'var(--acc)'} />
                  </td>
                  <td className="num" style={{ color: b.trend === 'down' ? 'var(--bad)' : b.trend === 'up' ? 'var(--ok)' : undefined }}>
                    <TrendMark trend={b.trend} /> {b.changePct > 0 ? '+' : ''}
                    {b.changePct}%
                  </td>
                  <td>
                    <Confidence p={b.provenance} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      {compare && (
        <div style={{ marginTop: 14 }}>
          <Panel title="FIVE REGIONS, ONE VIEW" note="medium-class midpoints, USD/day" flush>
            <div className="go-tablewrap">
              <table className="go-table">
                <thead>
                  <tr>
                    <th>Basin</th>
                    <th>Utilisation</th>
                    {['PSV', 'AHTS'].map((t) =>
                      ['Small', 'Medium', 'Large'].map((s) => (
                        <th key={`${t}-${s}`}>
                          {t} {s}
                        </th>
                      )),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {REGIONS.map((r) => {
                    const u = UTILISATION.find((x) => x.region === r)!;
                    return (
                      <tr key={r} style={r === region ? { background: 'var(--panel-3)' } : undefined}>
                        <td>
                          <strong>{r}</strong>
                        </td>
                        <td className="num">{u.utilisationPct}%</td>
                        {['PSV', 'AHTS'].map((t) =>
                          ['Small', 'Medium', 'Large'].map((s) => {
                            const b = BENCHMARKS.find((x) => x.region === r && x.subType === t && x.sizeClass === s);
                            return (
                              <td key={`${r}-${t}-${s}`} className="num">
                                {b ? `$${b.mid.toLocaleString()}` : '—'}
                              </td>
                            );
                          }),
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Panel>
        </div>
      )}

      <div className="go-grid c2" style={{ marginTop: 14 }}>
        <Panel title="REGIONAL UTILISATION" note="rolling 30-day average">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
            {UTILISATION.map((u) => (
              <Meter
                key={u.region}
                label={`${u.region} · ${u.vesselCount} vsl`}
                value={u.utilisationPct}
                tone={u.utilisationPct >= 85 ? 'ok' : u.utilisationPct < 78 ? 'warn' : undefined}
              />
            ))}
          </div>
        </Panel>

        <Panel title="HOW THE BENCHMARK IS BUILT">
          <ol style={{ margin: 0, paddingLeft: 18, display: 'grid', gap: 10, color: 'var(--text-2)', fontSize: 13, lineHeight: 1.55 }}>
            <li>Fixtures are ingested from broker reports, operator disclosures and customer charter books.</li>
            <li>Each fixture is normalised to a common basis: term charter, USD per day, fuel excluded.</li>
            <li>Outliers beyond two standard deviations of the 90-day rolling window are excluded, not deleted — they stay auditable.</li>
            <li>The published band is the interquartile range; the midpoint is the median of the surviving fixtures.</li>
            <li>Every band carries a confidence score reflecting fixture count, recency and source mix.</li>
          </ol>
        </Panel>
      </div>

      <div style={{ marginTop: 14 }}>
        <Disclaimer>
          Benchmarks are indicative term rates for concept demonstration. Spot, bareboat and project-specific
          fixtures price differently — confirm with broker quotes before fixing.
        </Disclaimer>
      </div>
    </AppShell>
  );
}
