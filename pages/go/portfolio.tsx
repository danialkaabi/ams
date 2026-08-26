import Link from 'next/link';
import AppShell from '@/components/go/AppShell';
import { useAccount } from '@/components/go/AccountContext';
import {
  Confidence, Disclaimer, Masked, PageHead, Panel, RateRange, StatTile, Status,
  dateLabel, rate, usd,
} from '@/components/go/ui';
import { IconExport } from '@/components/go/Icons';
import { portfolio } from '@/data/go/graph';
import { expiryLabel } from '@/data/go/contracts';
import { canSeeCommercialDetail } from '@/data/go/accounts';

export default function Portfolio() {
  const { account, can, plan } = useAccount();
  const book = portfolio();

  const onHire = book.filter((n) => n.vessel.status === 'On hire').length;
  const acv = book.reduce((s, n) => s + (n.activeContract?.ratePerDay ?? 0) * 365, 0);
  const belowBenchmark = book.filter((n) => (n.activeContract?.vsBenchmarkPct ?? 0) < 0).length;

  return (
    <AppShell title="My Portfolio" wide>
      <PageHead
        eyebrow="Workspace · My Portfolio"
        title="My Portfolio"
        lede="The vessels this desk actually watches — saved from a fleet query, tracked across position, charter and benchmark in one place."
        actions={
          <>
            <Link href="/go/fleet" className="go-btn">
              Add from a fleet query
            </Link>
            <button className="go-btn" disabled={!can('export')} title={can('export') ? undefined : `Excel export is not included on the ${plan.name} account`}>
              <IconExport /> Export
            </button>
          </>
        }
      />

      <div className="go-grid c4" style={{ marginBottom: 14 }}>
        <StatTile value={book.length} label="Vessels tracked" />
        <StatTile value={onHire} label="On hire" tone="accent-2" />
        <StatTile value={usd(acv)} label="Annualised contract value" />
        <StatTile value={belowBenchmark} label="Fixed below benchmark" tone={belowBenchmark ? 'warn' : undefined} />
      </div>

      <Panel title="TRACKED VESSELS" note="position, fixture and benchmark in one row" flush>
        <div className="go-tablewrap">
          <table className="go-table">
            <thead>
              <tr>
                <th>Vessel</th>
                <th>Owner</th>
                <th>Position</th>
                <th>Charterer</th>
                <th>Rate/day</th>
                <th>vs benchmark</th>
                <th>Expires</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {book.map((n) => {
                const c = n.activeContract;
                const visible = canSeeCommercialDetail(account, n.vessel.ownerId);
                return (
                  <tr key={n.vessel.imo}>
                    <td>
                      <Link href={`/go/fleet/${n.vessel.imo}`} className="go-link">
                        {n.vessel.name}
                      </Link>
                      <div style={{ fontSize: 11.5, color: 'var(--text-3)', marginTop: 3 }}>
                        {n.vessel.subType} ({n.vessel.sizeClass}) · IMO {n.vessel.imo}
                      </div>
                    </td>
                    <td>
                      {n.owner && (
                        <Link href={`/go/companies/${n.owner.id}`} className="go-link">
                          {n.owner.name}
                        </Link>
                      )}
                    </td>
                    <td style={{ fontSize: 12.5 }}>
                      {n.zoneName ?? '—'}
                      <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 3 }}>
                        {n.vessel.ais.status} · {n.vessel.ais.ageHours}h old
                      </div>
                    </td>
                    <td>{c?.charterer ?? '—'}</td>
                    <td className="num" style={{ color: 'var(--text)' }}>
                      {visible ? rate(c?.ratePerDay ?? null) : <Masked />}
                      {n.benchmark && (
                        <div style={{ width: 110, marginTop: 6 }}>
                          <RateRange low={n.benchmark.low} high={n.benchmark.high} actual={visible ? c?.ratePerDay : null} />
                        </div>
                      )}
                    </td>
                    <td
                      className="num"
                      style={{ color: (c?.vsBenchmarkPct ?? 0) < 0 ? 'var(--bad)' : (c?.vsBenchmarkPct ?? 0) > 0 ? 'var(--ok)' : undefined }}
                    >
                      {visible && c?.vsBenchmarkPct != null ? `${c.vsBenchmarkPct > 0 ? '+' : ''}${c.vsBenchmarkPct}%` : '—'}
                    </td>
                    <td className="num" title={c ? dateLabel(c.expiryDate) : undefined}>
                      {c && c.status !== 'Off Hire' ? expiryLabel(c.expiryDate) : '—'}
                    </td>
                    <td>
                      <Status value={n.vessel.status} />
                      <div style={{ marginTop: 6 }}>
                        <Confidence p={n.vessel.provenance} compact />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>

      <div style={{ marginTop: 14 }}>
        <Disclaimer>
          A portfolio is a saved query, not a copy — vessels stay live against the graph, so position, fixture
          and benchmark refresh underneath it.
        </Disclaimer>
      </div>
    </AppShell>
  );
}
