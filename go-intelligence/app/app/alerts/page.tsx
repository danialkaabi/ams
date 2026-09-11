import type { Metadata } from 'next';
import PageHead from '@/components/app/PageHead';
import Panel from '@/components/ui/Panel';
import EmptyState from '@/components/ui/EmptyState';
import Badge from '@/components/ui/Badge';
import { IconAlerts } from '@/components/ui/Icons';
import { ALERTS } from '@/data/alerts';
import { ALERT_TYPES } from '@/lib/taxonomy';
import { timeAgo } from '@/lib/format';

export const metadata: Metadata = {
  title: 'Alerts',
  description: 'GO Alerts — real-time signals on renewals, off-hire and zone entry.',
};

const SEVERITY_TONE = {
  Critical: 'red',
  Warning: 'amber',
  Info: 'blue',
} as const;

export default function AlertsPage() {
  return (
    <>
      <PageHead
        eyebrow="Workspace · GO Alerts"
        title="Alerts"
        sub="Real-time signals on renewals, off-hire, zone entry, tenders, ownership changes and rate movement."
        actions={
          <button className="btn btn--ghost btn--sm" disabled={ALERTS.length === 0}>
            Mark all read
          </button>
        }
      />

      <Panel title="Alert rules" style={{ marginBottom: 16 }}>
        <div className="panel-body">
          <p
            style={{
              fontSize: 13,
              color: 'var(--text-4)',
              marginBottom: 14,
              maxWidth: '76ch',
              lineHeight: 1.65,
            }}
          >
            These are the signal types the platform watches for. Each one fires
            off records you already hold — a renewal alert comes from a
            contract&rsquo;s expiry date, a zone-entry alert from a vessel&rsquo;s
            position, a rate alert from a benchmark moving against your book.
          </p>
          <div className="row g8 wrapflex">
            {ALERT_TYPES.map((t) => (
              <span className="pill" key={t}>
                <span className="dot" style={{ color: 'var(--blue-400)' }} />
                {t}
              </span>
            ))}
          </div>
        </div>
      </Panel>

      <Panel
        title={ALERTS.length === 0 ? 'Alert feed' : `Alert feed · ${ALERTS.length}`}
      >
        {ALERTS.length === 0 ? (
          <EmptyState
            icon={<IconAlerts size={22} />}
            title="No alerts"
            body="Nothing needs your attention — because nothing is being watched yet. Alerts generate from contracts, positions and benchmarks once those records exist."
            file="data/alerts.ts"
            fields={['id', 'type', 'severity', 'title', 'body', 'createdAt', 'vesselImo', 'contractId']}
          />
        ) : (
          <div>
            {ALERTS.map((a) => (
              <div className="feed-item" key={a.id}>
                <span className="feed-mark">
                  <IconAlerts size={15} />
                </span>
                <div className="grow">
                  <div className="between wrapflex" style={{ gap: 10 }}>
                    <span className="feed-title">{a.title}</span>
                    <Badge tone={SEVERITY_TONE[a.severity]} dot>
                      {a.severity}
                    </Badge>
                  </div>
                  {a.body && (
                    <p style={{ fontSize: 12.5, color: 'var(--text-4)', marginTop: 5, lineHeight: 1.55 }}>
                      {a.body}
                    </p>
                  )}
                  <div className="feed-meta">
                    {a.type} · {timeAgo(a.createdAt)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Panel>
    </>
  );
}
