import type { Metadata } from 'next';
import PageHead from '@/components/app/PageHead';
import Panel from '@/components/ui/Panel';
import EmptyState from '@/components/ui/EmptyState';
import StatTile from '@/components/ui/StatTile';
import { IconDownload, IconMarket } from '@/components/ui/Icons';
import { RATE_BENCHMARKS, UTILISATION } from '@/data/market';
import { ALL_SIZE_CLASSES, REGIONS } from '@/lib/taxonomy';
import { pct, rateBand, signedPct } from '@/lib/format';

export const metadata: Metadata = {
  title: 'Market',
  description: 'GO Market — day-rate benchmarks across five basins.',
};

export default function MarketPage() {
  const avgUtil =
    UTILISATION.length > 0
      ? UTILISATION.reduce((s, u) => s + u.utilisationPct, 0) / UTILISATION.length
      : undefined;

  return (
    <>
      <PageHead
        eyebrow="Analysis · GO Market"
        title="Market"
        sub="Day-rate benchmarks across five basins, by vessel type and size class — indicative term rates to frame a negotiation."
        actions={
          <button className="btn btn--ghost btn--sm" disabled={RATE_BENCHMARKS.length === 0}>
            <IconDownload size={14} />
            Export to Excel
          </button>
        }
      />

      <div className="grid grid-4" style={{ marginBottom: 16 }}>
        <StatTile
          label="Benchmarks recorded"
          value={RATE_BENCHMARKS.length === 0 ? '—' : RATE_BENCHMARKS.length}
          empty={RATE_BENCHMARKS.length === 0}
        />
        <StatTile
          label="Regions covered"
          value={REGIONS.length}
          accent="gold"
          foot={<span className="muted">Benchmarked side by side</span>}
        />
        <StatTile
          label="Size classes"
          value={ALL_SIZE_CLASSES.length}
          accent="green"
          foot={<span className="muted">Across the OSV taxonomy</span>}
        />
        <StatTile
          label="Average utilisation"
          value={avgUtil === undefined ? '—' : pct(avgUtil)}
          empty={avgUtil === undefined}
          accent="amber"
        />
      </div>

      <Panel title="Regional OSV utilisation" style={{ marginBottom: 16 }}>
        <div className="panel-body">
          {UTILISATION.length === 0 ? (
            <div className="stack g16">
              {REGIONS.map((r) => (
                <div className="meter-row" key={r}>
                  <div className="meter-head">
                    <span className="meter-label">{r}</span>
                    <span className="meter-val muted">—</span>
                  </div>
                  <div className="meter">
                    <div className="meter-fill" style={{ width: 0 }} />
                  </div>
                </div>
              ))}
              <p className="muted" style={{ fontSize: 12, marginTop: 4 }}>
                Add entries to <span className="mono">UTILISATION</span> in{' '}
                <span className="mono">data/market.ts</span>. Each carries a
                region, a percentage, a vessel count and last year&rsquo;s figure
                for the trend.
              </p>
            </div>
          ) : (
            <div className="stack g16">
              {UTILISATION.map((u) => (
                <div className="meter-row" key={u.region}>
                  <div className="meter-head">
                    <span className="meter-label">
                      {u.region}
                      {u.vesselCount !== undefined && (
                        <span className="muted"> · {u.vesselCount} vsl</span>
                      )}
                    </span>
                    <span className="meter-val">
                      {pct(u.utilisationPct)}
                      {u.priorYearPct !== undefined && (
                        <span
                          style={{
                            marginLeft: 8,
                            fontSize: 11,
                            color:
                              u.utilisationPct >= u.priorYearPct
                                ? 'var(--green)'
                                : 'var(--red)',
                          }}
                        >
                          {signedPct(u.utilisationPct - u.priorYearPct)}
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="meter">
                    <div
                      className="meter-fill"
                      style={{ width: `${Math.min(100, u.utilisationPct)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Panel>

      <Panel
        title="Day-rate benchmarks · USD/day"
        action={
          <span className="mono" style={{ fontSize: 11, color: 'var(--text-5)' }}>
            Indicative term rates
          </span>
        }
      >
        {RATE_BENCHMARKS.length === 0 ? (
          <EmptyState
            icon={<IconMarket size={22} />}
            title="No benchmarks recorded"
            body="Benchmarks are referenced in three places: the rate ticker on the dashboard, the variance column in the charter book, and the benchmark band on every vessel profile. Record them once and all three populate."
            file="data/market.ts"
            fields={['region', 'sizeClass', 'lowUsdPerDay', 'highUsdPerDay', 'changePct', 'asOf']}
          />
        ) : (
          <div className="table-scroll">
            <table className="table">
              <thead>
                <tr>
                  <th>Region</th>
                  <th>Size class</th>
                  <th className="th-num">Band</th>
                  <th className="th-num">Change</th>
                  <th>As of</th>
                </tr>
              </thead>
              <tbody>
                {RATE_BENCHMARKS.map((b) => (
                  <tr key={`${b.region}-${b.sizeClass}`}>
                    <td>{b.region}</td>
                    <td className="td-strong">{b.sizeClass}</td>
                    <td className="td-num">{rateBand(b.lowUsdPerDay, b.highUsdPerDay)}</td>
                    <td
                      className="td-num"
                      style={{
                        color:
                          b.changePct === undefined
                            ? 'var(--text-5)'
                            : b.changePct >= 0
                              ? 'var(--green)'
                              : 'var(--red)',
                      }}
                    >
                      {signedPct(b.changePct)}
                    </td>
                    <td className="mono">{b.asOf ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </>
  );
}
