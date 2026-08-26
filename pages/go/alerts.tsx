import Link from 'next/link';
import { useMemo, useState } from 'react';
import AppShell from '@/components/go/AppShell';
import { useAccount } from '@/components/go/AccountContext';
import { Disclaimer, Empty, Gate, PageHead, Panel, StatTile } from '@/components/go/ui';
import { ALERTS, ALERT_RULES, UNREAD_ALERTS } from '@/data/go/alerts';
import type { AlertSeverity } from '@/data/go/types';

const HREF_BY_TYPE: Record<string, (id: string) => string> = {
  vessel: (id) => `/go/fleet/${id}`,
  company: (id) => `/go/companies/${id}`,
  contract: () => '/go/contracts',
  project: (id) => `/go/projects#${id}`,
  market: () => '/go/market',
};

export default function Alerts() {
  const { can } = useAccount();
  const [severity, setSeverity] = useState<AlertSeverity | ''>('');
  const [rules, setRules] = useState(ALERT_RULES);

  const feed = useMemo(() => ALERTS.filter((a) => !severity || a.severity === severity), [severity]);

  if (!can('alerts')) {
    return (
      <AppShell title="Alerts">
        <Gate feature="GO Alerts" upgradeTo="NOC & EPC Contractor" />
      </AppShell>
    );
  }

  return (
    <AppShell title="Alerts" wide>
      <PageHead
        eyebrow="Workspace · GO Alerts"
        title="GO Alerts"
        lede="Real-time signals on the events that move money: renewals falling due, vessels going off hire, tonnage entering a field, tenders opening, ownership chains changing."
        actions={
          <select className="go-select" style={{ width: 170 }} value={severity} onChange={(e) => setSeverity(e.target.value as AlertSeverity | '')} aria-label="Filter by severity">
            <option value="">All severities</option>
            <option value="critical">Critical</option>
            <option value="warning">Warning</option>
            <option value="info">Info</option>
          </select>
        }
      />

      <div className="go-grid c4" style={{ marginBottom: 14 }}>
        <StatTile value={UNREAD_ALERTS} label="Unread signals" tone="warn" />
        <StatTile value={ALERTS.filter((a) => a.severity === 'critical').length} label="Critical" tone="bad" />
        <StatTile value={rules.filter((r) => r.active).length} label="Active watch rules" />
        <StatTile value={ALERTS.length} label="Signals in the last 7 days" tone="accent-2" />
      </div>

      <div className="go-grid" style={{ gridTemplateColumns: 'minmax(0, 1.6fr) minmax(0, 1fr)' }}>
        <Panel title="SIGNAL FEED" note="newest first" flush>
          <div>
            {feed.map((a) => (
              <div key={a.id} className={`go-alert ${a.severity} ${a.read ? '' : 'unread'}`}>
                <span className="go-alert-rail" />
                <div style={{ flex: 1 }}>
                  <div className="go-alert-title">{a.title}</div>
                  <div className="go-alert-detail">{a.detail}</div>
                  <div className="go-alert-meta">
                    <span>{a.ageLabel}</span>
                    <span>·</span>
                    <span>{a.kind.replace(/-/g, ' ')}</span>
                    <span>·</span>
                    <Link href={HREF_BY_TYPE[a.entityType]?.(a.entityId) ?? '/go/dashboard'} className="go-link">
                      Open {a.entityType} →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
            {feed.length === 0 && <Empty>No signals at that severity.</Empty>}
          </div>
        </Panel>

        <div style={{ display: 'grid', gap: 14, alignContent: 'start' }}>
          <Panel
            title="WATCH RULES"
            actions={<button className="go-btn sm primary">New rule</button>}
            flush
          >
            <div>
              {rules.map((r) => (
                <label
                  key={r.id}
                  style={{
                    display: 'flex',
                    gap: 11,
                    alignItems: 'flex-start',
                    padding: '12px 16px',
                    borderBottom: '1px solid var(--line)',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={r.active}
                    onChange={() => setRules((rs) => rs.map((x) => (x.id === r.id ? { ...x, active: !x.active } : x)))}
                    style={{ marginTop: 3, accentColor: 'var(--acc)' }}
                  />
                  <div>
                    <div style={{ fontSize: 13, color: r.active ? 'var(--text)' : 'var(--text-3)' }}>{r.name}</div>
                    <div className="go-alert-meta" style={{ marginTop: 5 }}>
                      <span>{r.scope}</span>
                      <span>·</span>
                      <span>{r.channel}</span>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </Panel>

          <Panel title="DELIVERY CHANNELS">
            <div style={{ display: 'grid', gap: 11, fontSize: 12.5, color: 'var(--text-2)', lineHeight: 1.55 }}>
              <div>
                <strong style={{ color: 'var(--text)' }}>In-app</strong> — the feed on this screen, and the badge in the sidebar.
              </div>
              <div>
                <strong style={{ color: 'var(--text)' }}>Push</strong> — GO App, for the events that cannot wait for the desk.
              </div>
              <div>
                <strong style={{ color: 'var(--text)' }}>Email</strong> — daily digest or immediate, per rule.
              </div>
              <div>
                <strong style={{ color: 'var(--text)' }}>Webhook</strong> — POST to your own systems. Requires an API-enabled account.
              </div>
            </div>
          </Panel>
        </div>
      </div>

      <div style={{ marginTop: 14 }}>
        <Disclaimer>
          Illustrative alert feed for concept demonstration. Alert rules in production evaluate against the
          live graph on every ingest cycle.
        </Disclaimer>
      </div>
    </AppShell>
  );
}
