import Link from 'next/link';
import AppShell from '@/components/go/AppShell';
import { useAccount } from '@/components/go/AccountContext';
import {
  Confidence, Meter, PageHead, Panel, Sparkline, StatTile, Status, TrendMark,
  Disclaimer, rate, usd,
} from '@/components/go/ui';
import { IconArrow } from '@/components/go/Icons';
import { UTILISATION, BENCHMARKS } from '@/data/go/market';
import { ALERTS, UNREAD_ALERTS } from '@/data/go/alerts';
import { PROJECTS } from '@/data/go/projects';
import { CONTRACTS, expiryLabel } from '@/data/go/contracts';
import { ACTIVE_VESSELS } from '@/data/go/vessels';
import { portfolio, contractsExpiringWithin } from '@/data/go/graph';
import { canSeeCommercialDetail } from '@/data/go/accounts';

export default function Dashboard() {
  const { account, plan } = useAccount();
  const book = portfolio();
  const meRates = BENCHMARKS.filter((b) => b.region === 'Middle East Gulf');
  const openContracts = CONTRACTS.filter((c) => c.status !== 'Off Hire');
  const expiring = contractsExpiringWithin(90);

  return (
    <AppShell title="Dashboard" wide>
      <PageHead
        eyebrow="Intelligence · Dashboard"
        title={`Good morning, ${account.organisation}`}
        lede={`One screen: fleet, utilisation, live rates and your portfolio. Data scope on this account — ${plan.dataScopeLabel.toLowerCase()}.`}
        actions={
          <Link href="/go/ai" className="go-btn primary">
            Ask GO AI <IconArrow />
          </Link>
        }
      />

      <div className="go-grid c4" style={{ marginBottom: 14 }}>
        <StatTile value={ACTIVE_VESSELS} label="Active vessels in scope" delta={{ value: '+6', dir: 'up' }} />
        <StatTile value={openContracts.length} label="Open contracts" delta={{ value: '+2', dir: 'up' }} tone="accent-2" />
        <StatTile value={PROJECTS.length} label="Tracked projects" delta={{ value: '0', dir: 'flat' }} />
        <StatTile value={UNREAD_ALERTS} label="Live alerts" delta={{ value: '+3', dir: 'up' }} tone="warn" />
      </div>

      <div className="go-grid" style={{ gridTemplateColumns: 'minmax(0, 1.15fr) minmax(0, 1fr)', marginBottom: 14 }}>
        <Panel
          title="REGIONAL OSV UTILISATION"
          note="rolling 30-day average"
          actions={
            <Link href="/go/market" className="go-btn sm ghost">
              Market
            </Link>
          }
        >
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

        <Panel title="LIVE TC RATES" note="USD/day · Middle East Gulf" flush>
          <div className="go-tablewrap">
            <table className="go-table" style={{ minWidth: 420 }}>
              <tbody>
                {meRates.map((b) => (
                  <tr key={b.id}>
                    <td>
                      <strong>{b.subType}</strong> <span style={{ color: 'var(--text-3)' }}>{b.sizeClass}</span>
                    </td>
                    <td style={{ width: 100 }}>
                      <Sparkline points={b.history} width={72} height={18} tone={b.trend === 'down' ? 'var(--bad)' : 'var(--acc)'} />
                    </td>
                    <td className="num" style={{ color: 'var(--text)', textAlign: 'right' }}>
                      ${b.mid.toLocaleString()}
                    </td>
                    <td style={{ width: 28, textAlign: 'right' }}>
                      <TrendMark trend={b.trend} />
                    </td>
                    <td style={{ width: 62, textAlign: 'right' }}>
                      <Confidence p={b.provenance} compact />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>

      <div className="go-grid" style={{ gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr)' }}>
        <Panel
          title="MY PORTFOLIO"
          actions={
            <Link href="/go/portfolio" className="go-btn sm ghost">
              All
            </Link>
          }
          flush
        >
          <div className="go-tablewrap">
            <table className="go-table" style={{ minWidth: 0 }}>
              <tbody>
                {book.map((n) => (
                  <tr key={n.vessel.imo}>
                    <td>
                      <Link href={`/go/fleet/${n.vessel.imo}`} className="go-link">
                        {n.vessel.name}
                      </Link>
                      <div style={{ fontSize: 11.5, color: 'var(--text-3)', marginTop: 3 }}>
                        {n.vessel.subType} · {n.owner?.name}
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <Status value={n.vessel.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel
          title="RENEWAL EXPOSURE"
          note="next 90 days"
          actions={
            <Link href="/go/contracts" className="go-btn sm ghost">
              Charter book
            </Link>
          }
          flush
        >
          <div className="go-tablewrap">
            <table className="go-table" style={{ minWidth: 0 }}>
              <tbody>
                {expiring.slice(0, 6).map((c) => {
                  const visible = canSeeCommercialDetail(account, c.ownerId);
                  return (
                    <tr key={c.id}>
                      <td>
                        <Link href={`/go/fleet/${c.vesselImo}`} className="go-link">
                          {c.vesselName}
                        </Link>
                        <div style={{ fontSize: 11.5, color: 'var(--text-3)', marginTop: 3 }}>
                          {c.charterer} · {visible ? rate(c.ratePerDay) : '—'}
                        </div>
                      </td>
                      <td style={{ textAlign: 'right' }} className="num">
                        {expiryLabel(c.expiryDate)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel
          title="RECENT ALERTS"
          actions={
            <Link href="/go/alerts" className="go-btn sm ghost">
              All
            </Link>
          }
          flush
        >
          <div>
            {ALERTS.slice(0, 5).map((a) => (
              <div key={a.id} className={`go-alert ${a.severity} ${a.read ? '' : 'unread'}`} style={{ padding: '12px 14px' }}>
                <span className="go-alert-rail" />
                <div>
                  <div className="go-alert-title" style={{ fontSize: 12.5 }}>
                    {a.title}
                  </div>
                  <div className="go-alert-meta">{a.ageLabel}</div>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div style={{ marginTop: 16, display: 'grid', gap: 12 }}>
        <div className="go-grid c3">
          <Panel title="COMBINED TRACKED CAPEX">
            <div className="go-stat-val" style={{ fontSize: 24 }}>
              {usd(PROJECTS.reduce((s, p) => s + p.capexUsd, 0))}
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 8 }}>
              Across {PROJECTS.length} tracked field developments — the demand side of your charter market.
            </p>
          </Panel>
          <Panel title="FORECAST VESSEL DEMAND">
            <div className="go-stat-val" style={{ fontSize: 24 }}>
              {PROJECTS.reduce((s, p) => s + p.vesselsNeeded, 0)} OSVs
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 8 }}>
              Vessel scope defined across tracked projects for the next three years.
            </p>
          </Panel>
          <Panel title="ANNUALISED CONTRACT VALUE">
            <div className="go-stat-val" style={{ fontSize: 24 }}>
              {usd(CONTRACTS.filter((c) => c.ratePerDay).reduce((s, c) => s + (c.ratePerDay ?? 0) * 365, 0))}
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 8 }}>
              Sum of all live fixtures in scope, annualised at the fixed day rate.
            </p>
          </Panel>
        </div>
        <Disclaimer>
          Illustrative dashboard for concept demonstration. Rates are indicative term benchmarks —
          confirm with broker quotes before fixing.
        </Disclaimer>
      </div>
    </AppShell>
  );
}
