import type { Metadata } from 'next';
import Link from 'next/link';
import PageHead from '@/components/app/PageHead';
import Panel from '@/components/ui/Panel';
import StatTile from '@/components/ui/StatTile';
import EmptyState from '@/components/ui/EmptyState';
import Badge, { statusTone } from '@/components/ui/Badge';
import { IconContracts, IconDownload } from '@/components/ui/Icons';
import { CONTRACTS } from '@/data/contracts';
import { daysUntil, expiresIn, signedPct, usd, usdCompact } from '@/lib/format';

export const metadata: Metadata = {
  title: 'Contracts',
  description: 'GO Contracts — the live charter book.',
};

const QUARTERS = ['Q1', 'Q2', 'Q3', 'Q4'] as const;

export default function ContractsPage() {
  const active = CONTRACTS.filter((c) => c.status !== 'Completed');
  const expiring90 = CONTRACTS.filter((c) => {
    const d = daysUntil(c.expiryDate);
    return d !== undefined && d >= 0 && d <= 90;
  }).length;
  const overdue = CONTRACTS.filter((c) => c.status === 'Overdue Renewal').length;
  const acv = CONTRACTS.reduce((sum, c) => sum + (c.annualisedValue ?? 0), 0);

  /** Renewal exposure bucketed into the next four quarters. */
  const exposure = QUARTERS.map((q, i) => {
    const lo = i * 91;
    const hi = (i + 1) * 91;
    const count = CONTRACTS.filter((c) => {
      const d = daysUntil(c.expiryDate);
      return d !== undefined && d >= lo && d < hi;
    }).length;
    return { q, count };
  });

  const sorted = [...active].sort((a, b) => {
    const da = daysUntil(a.expiryDate) ?? Number.MAX_SAFE_INTEGER;
    const db = daysUntil(b.expiryDate) ?? Number.MAX_SAFE_INTEGER;
    return da - db;
  });

  return (
    <>
      <PageHead
        eyebrow="Intelligence · GO Contracts"
        title="Contracts"
        sub="Live charter book with expiry countdowns, rate-vs-benchmark variance and renewal exposure — so nothing rolls off unnoticed."
        actions={
          <button className="btn btn--ghost btn--sm" disabled={CONTRACTS.length === 0}>
            <IconDownload size={14} />
            Export to Excel
          </button>
        }
      />

      <div className="grid grid-4" style={{ marginBottom: 16 }}>
        <StatTile
          label="Active charters"
          value={CONTRACTS.length === 0 ? '—' : active.length}
          empty={CONTRACTS.length === 0}
        />
        <StatTile
          label="Expiring < 90 days"
          value={CONTRACTS.length === 0 ? '—' : expiring90}
          empty={CONTRACTS.length === 0}
          accent="amber"
        />
        <StatTile
          label="Overdue renewal"
          value={CONTRACTS.length === 0 ? '—' : overdue}
          empty={CONTRACTS.length === 0}
          accent="red"
        />
        <StatTile
          label="Annualised contract value"
          value={acv === 0 ? '—' : usdCompact(acv)}
          empty={acv === 0}
          accent="gold"
        />
      </div>

      <Panel
        title="Charter book · live"
        action={
          <span className="mono" style={{ fontSize: 11, color: 'var(--text-5)' }}>
            Sorted by expiry
          </span>
        }
        style={{ marginBottom: 16 }}
      >
        {CONTRACTS.length === 0 ? (
          <EmptyState
            icon={<IconContracts size={22} />}
            title="No fixtures in the charter book"
            body="This is the screen that stops a charter rolling off unnoticed. Record your fixtures and you get expiry countdowns, variance against the regional benchmark, and renewal exposure across the next twelve months."
            file="data/contracts.ts"
            fields={[
              'id',
              'vesselImo',
              'vesselName',
              'charterer',
              'charterType',
              'ratePerDay',
              'startDate',
              'expiryDate',
              'status',
              'annualisedValue',
            ]}
          />
        ) : (
          <div className="table-scroll">
            <table className="table">
              <thead>
                <tr>
                  <th>Vessel</th>
                  <th>Type</th>
                  <th>Charterer</th>
                  <th className="th-num">Rate/day</th>
                  <th className="th-num">vs Benchmark</th>
                  <th>Expires in</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((c) => {
                  const variance = c.vsBenchmarkPct;
                  const varianceColor =
                    variance === undefined
                      ? 'var(--text-5)'
                      : variance >= 0
                        ? 'var(--green)'
                        : 'var(--red)';
                  return (
                    <tr key={c.id}>
                      <td className="td-strong">
                        <Link href={`/app/fleet/${c.vesselImo}`}>{c.vesselName}</Link>
                      </td>
                      <td>{c.vesselType}</td>
                      <td>{c.charterer}</td>
                      <td className="td-num">{usd(c.ratePerDay)}</td>
                      <td className="td-num" style={{ color: varianceColor }}>
                        {signedPct(variance)}
                      </td>
                      <td className="mono">{expiresIn(c.expiryDate)}</td>
                      <td>
                        <Badge tone={statusTone(c.status)} dot>
                          {c.status}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      <Panel title="Renewal exposure · next 12 months">
        <div className="panel-body">
          <div className="grid grid-4">
            {exposure.map((e) => (
              <div className="well" key={e.q}>
                <div className="plan-meta-k" style={{ marginBottom: 8 }}>
                  {e.q}
                </div>
                <div
                  className="num"
                  style={{
                    fontSize: 26,
                    color: CONTRACTS.length === 0 ? 'var(--text-5)' : 'var(--text)',
                  }}
                >
                  {CONTRACTS.length === 0 ? '—' : e.count}
                </div>
                <div style={{ fontSize: 11.5, color: 'var(--text-5)', marginTop: 5 }}>
                  {CONTRACTS.length === 0 ? 'No fixtures recorded' : 'expiring'}
                </div>
              </div>
            ))}
          </div>

          {CONTRACTS.length === 0 && (
            <p className="muted" style={{ fontSize: 12, marginTop: 14 }}>
              Exposure is bucketed automatically from each fixture&rsquo;s{' '}
              <span className="mono">expiryDate</span> — no manual maintenance.
            </p>
          )}
        </div>
      </Panel>
    </>
  );
}
