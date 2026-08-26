import Link from 'next/link';
import AppShell from '@/components/go/AppShell';
import { useAccount } from '@/components/go/AccountContext';
import { Meter, PageHead, Panel, StatTile, dateLabel, usd } from '@/components/go/ui';
import { FEATURE_LABELS, PLANS, PLAN_ORDER, seatUtilisation } from '@/data/go/accounts';
import type { FeatureKey } from '@/data/go/types';

const ALL_FEATURES: FeatureKey[] = [
  'fleet', 'companies', 'contracts', 'projects', 'maps', 'market',
  'ai', 'alerts', 'app', 'export', 'api',
];

const SEATS = [
  { name: 'Operations Team', email: 'ops@gointelligence.com', role: 'Admin', lastSeen: 'Today' },
  { name: 'Chartering Desk', email: 'chartering@gointelligence.com', role: 'Analyst', lastSeen: 'Today' },
  { name: 'Commercial Manager', email: 'commercial@gointelligence.com', role: 'Analyst', lastSeen: 'Yesterday' },
  { name: 'Fleet Performance', email: 'performance@gointelligence.com', role: 'Viewer', lastSeen: '3 days ago' },
  { name: 'Finance', email: 'finance@gointelligence.com', role: 'Viewer', lastSeen: '1 week ago' },
];

export default function Admin() {
  const { account, plan, setAccountType } = useAccount();
  const used = seatUtilisation(account);

  return (
    <AppShell title="Account" wide>
      <PageHead
        eyebrow="Workspace · Account"
        title={account.organisation}
        lede={`${plan.name} account · ${plan.tagline}. Every account runs on the same platform — seats, data scope, export and API are what scale.`}
        actions={
          <Link href="/go/pricing" className="go-btn primary">
            Compare accounts
          </Link>
        }
      />

      <div className="go-grid c4" style={{ marginBottom: 14 }}>
        <StatTile value={`${account.seatsUsed}/${plan.seats}`} label="Seats in use" tone={used > 80 ? 'warn' : undefined} />
        <StatTile value={usd(plan.priceUsd)} label="Annual subscription" tone="accent-2" />
        <StatTile value={dateLabel(account.renewalDate)} label="Renews" />
        <StatTile value={plan.features.length} label="Entitled capabilities" />
      </div>

      <div className="go-grid" style={{ gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', marginBottom: 14 }}>
        <Panel title="ENTITLEMENTS ON THIS ACCOUNT" note={plan.dataScopeLabel}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {ALL_FEATURES.map((f) => {
              const on = plan.features.includes(f);
              return (
                <span key={f} className={`go-pill ${on ? 'acc' : ''}`} style={on ? undefined : { opacity: 0.45 }}>
                  {on ? '✓' : '—'} {FEATURE_LABELS[f]}
                </span>
              );
            })}
          </div>
          <div style={{ marginTop: 18, display: 'grid', gap: 14 }}>
            <Meter label="Seat utilisation" value={used} tone={used > 80 ? 'warn' : 'ok'} />
          </div>
          <p className="go-note" style={{ marginTop: 14 }}>
            Data scope: <strong style={{ color: 'var(--text-2)' }}>{plan.dataScopeLabel}</strong>. Rows outside
            scope render as <span className="go-masked">restricted</span> rather than being hidden — you can
            always see that a fixture exists, and what it would take to see it.
          </p>
        </Panel>

        <Panel title="SUPPORT & COMMERCIAL">
          <div style={{ display: 'grid', gap: 13, fontSize: 13, color: 'var(--text-2)', lineHeight: 1.55 }}>
            <div>
              <div className="go-keyfact-label">Support tier</div>
              <div style={{ marginTop: 5, color: 'var(--text)' }}>{plan.support}</div>
            </div>
            <div>
              <div className="go-keyfact-label">Account manager</div>
              <div style={{ marginTop: 5, color: 'var(--text)' }}>{account.accountManager}</div>
            </div>
            <div>
              <div className="go-keyfact-label">Contract term</div>
              <div style={{ marginTop: 5, color: 'var(--text)' }}>
                Annual, {usd(plan.priceUsd)} {plan.billing}
              </div>
            </div>
            <div>
              <div className="go-keyfact-label">Switch demo tenant</div>
              <div style={{ marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {PLAN_ORDER.map((t) => (
                  <button
                    key={t}
                    className={`go-btn sm ${t === account.type ? 'primary' : ''}`}
                    onClick={() => setAccountType(t)}
                  >
                    {PLANS[t].name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Panel>
      </div>

      <Panel
        title="SEATS"
        note={`${account.seatsUsed} of ${plan.seats} used`}
        actions={<button className="go-btn sm primary" disabled={account.seatsUsed >= plan.seats}>Invite user</button>}
        flush
      >
        <div className="go-tablewrap">
          <table className="go-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Last seen</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {SEATS.map((s) => (
                <tr key={s.email}>
                  <td>
                    <strong>{s.name}</strong>
                  </td>
                  <td className="num">{s.email}</td>
                  <td>
                    <span className={`go-pill ${s.role === 'Admin' ? 'acc' : ''}`}>{s.role}</span>
                  </td>
                  <td>{s.lastSeen}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="go-btn sm ghost">Manage</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <div style={{ marginTop: 14 }}>
        <Panel title="AUDIT TRAIL" note="source to screen — every read is logged">
          <div className="go-tablewrap">
            <table className="go-table">
              <tbody>
                {[
                  ['Today 08:14', 'Chartering Desk', 'Ran fleet query — PSV, Medium, ME Gulf, off hire'],
                  ['Today 07:52', 'Operations Team', 'Opened vessel profile — GO Endeavour (9784521)'],
                  ['Yesterday 16:30', 'Commercial Manager', 'Exported charter book (34 rows)'],
                  ['Yesterday 11:05', 'Operations Team', 'Created watch rule — charter expiring within 90 days'],
                  ['2 days ago', 'Finance', 'Viewed contract value summary'],
                ].map(([when, who, what]) => (
                  <tr key={`${when}-${what}`}>
                    <td className="num" style={{ width: 130 }}>
                      {when}
                    </td>
                    <td style={{ width: 180, color: 'var(--text)' }}>{who}</td>
                    <td>{what}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}
