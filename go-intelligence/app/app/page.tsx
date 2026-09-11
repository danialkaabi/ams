import type { Metadata } from 'next';
import Link from 'next/link';
import PageHead from '@/components/app/PageHead';
import Panel from '@/components/ui/Panel';
import StatTile from '@/components/ui/StatTile';
import EmptyState from '@/components/ui/EmptyState';
import Badge from '@/components/ui/Badge';
import {
  IconAlerts,
  IconArrow,
  IconContracts,
  IconFleet,
  IconMarket,
  IconPortfolio,
  IconProjects,
} from '@/components/ui/Icons';
import { VESSELS } from '@/data/vessels';
import { CONTRACTS } from '@/data/contracts';
import { PROJECTS } from '@/data/projects';
import { ALERTS } from '@/data/alerts';
import { UTILISATION, RATE_BENCHMARKS } from '@/data/market';
import { PORTFOLIOS } from '@/data/portfolio';
import { REGIONS } from '@/lib/taxonomy';
import { pct, rateBand, timeAgo } from '@/lib/format';

export const metadata: Metadata = { title: 'Dashboard' };

export default function DashboardPage() {
  const activeVessels = VESSELS.filter((v) => v.status === 'On Hire').length;
  const openContracts = CONTRACTS.filter((c) => c.status !== 'Completed').length;
  const unread = ALERTS.filter((a) => !a.read);
  const isEmpty = VESSELS.length === 0 && CONTRACTS.length === 0 && PROJECTS.length === 0;

  return (
    <>
      <PageHead
        eyebrow="Overview"
        title="Dashboard"
        sub="One screen: fleet, utilisation, live rates and your portfolio — built for commercial decisions."
        actions={
          <>
            <Link href="/app/fleet" className="btn btn--ghost btn--sm">
              Open GO Fleet
            </Link>
            <Link href="/app/data" className="btn btn--primary btn--sm">
              Add records
            </Link>
          </>
        }
      />

      {isEmpty && (
        <div
          className="panel panel-pad"
          style={{
            marginBottom: 20,
            background:
              'linear-gradient(178deg, rgba(95,168,232,0.08), transparent 60%), var(--navy-800)',
            borderColor: 'var(--line-2)',
          }}
        >
          <div className="between wrapflex">
            <div style={{ maxWidth: '64ch' }}>
              <span className="eyebrow eyebrow--blue" style={{ marginBottom: 9 }}>
                Platform ready · No records yet
              </span>
              <h2 style={{ fontSize: 17, marginBottom: 8 }}>
                Every screen is built. Nothing is filled in.
              </h2>
              <p style={{ fontSize: 13.5, color: 'var(--text-4)', lineHeight: 1.65 }}>
                The dashboard, fleet database, charter book, project pipeline,
                map and market screens are all wired to the record files in{' '}
                <span className="mono" style={{ color: 'var(--blue-300)' }}>
                  /data
                </span>
                . Add your vessels and companies there and every figure on this
                page calculates itself.
              </p>
            </div>
            <Link href="/app/data" className="btn btn--primary">
              Open Data Manager
              <IconArrow size={15} />
            </Link>
          </div>
        </div>
      )}

      {/* ---------- KPI row ---------- */}
      <div className="grid grid-4" style={{ marginBottom: 16 }}>
        <StatTile
          label="Active vessels"
          value={VESSELS.length === 0 ? '—' : activeVessels}
          empty={VESSELS.length === 0}
          foot={
            VESSELS.length === 0 ? (
              <span className="muted">No vessels recorded</span>
            ) : (
              <span className="muted">of {VESSELS.length} tracked</span>
            )
          }
        />
        <StatTile
          label="Open contracts"
          value={CONTRACTS.length === 0 ? '—' : openContracts}
          empty={CONTRACTS.length === 0}
          accent="gold"
          foot={
            CONTRACTS.length === 0 ? (
              <span className="muted">No fixtures recorded</span>
            ) : (
              <span className="muted">in the charter book</span>
            )
          }
        />
        <StatTile
          label="Tracked projects"
          value={PROJECTS.length === 0 ? '—' : PROJECTS.length}
          empty={PROJECTS.length === 0}
          accent="green"
          foot={
            PROJECTS.length === 0 ? (
              <span className="muted">No projects recorded</span>
            ) : (
              <span className="muted">across the pipeline</span>
            )
          }
        />
        <StatTile
          label="Live alerts"
          value={unread.length === 0 ? '—' : unread.length}
          empty={unread.length === 0}
          accent="amber"
          foot={
            unread.length === 0 ? (
              <span className="muted">Nothing to action</span>
            ) : (
              <span className="muted">unread</span>
            )
          }
        />
      </div>

      {/* ---------- Utilisation + rates ---------- */}
      <div
        className="grid"
        style={{
          gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
          marginBottom: 16,
          alignItems: 'start',
        }}
      >
        <Panel
          title="Regional OSV utilisation"
          action={
            <Link href="/app/market" className="link-arrow" style={{ fontSize: 12 }}>
              Market
            </Link>
          }
        >
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
                  Add utilisation points to{' '}
                  <span className="mono">data/market.ts</span> to populate the
                  five basins.
                </p>
              </div>
            ) : (
              <div className="stack g16">
                {UTILISATION.map((u) => (
                  <div className="meter-row" key={u.region}>
                    <div className="meter-head">
                      <span className="meter-label">{u.region}</span>
                      <span className="meter-val">{pct(u.utilisationPct)}</span>
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
          title="Live TC rates · USD/day"
          action={<span className="live"><span className="dot" />Live</span>}
        >
          <div className="panel-body">
            {RATE_BENCHMARKS.length === 0 ? (
              <EmptyState
                icon={<IconMarket size={22} />}
                title="No benchmarks recorded"
                body="Day-rate bands drive the rate ticker here, the variance column in the charter book and the benchmark line on every vessel profile."
                file="data/market.ts"
                fields={['region', 'sizeClass', 'lowUsdPerDay', 'highUsdPerDay', 'changePct']}
              />
            ) : (
              <div className="stack">
                {RATE_BENCHMARKS.slice(0, 8).map((b) => (
                  <div
                    key={`${b.region}-${b.sizeClass}`}
                    className="between"
                    style={{ padding: '9px 0', borderBottom: '1px solid var(--line)' }}
                  >
                    <span style={{ fontSize: 13 }}>{b.sizeClass}</span>
                    <span className="num" style={{ fontSize: 13 }}>
                      {rateBand(b.lowUsdPerDay, b.highUsdPerDay)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Panel>
      </div>

      {/* ---------- Portfolio + alerts ---------- */}
      <div
        className="grid"
        style={{ gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', alignItems: 'start' }}
      >
        <Panel
          title="My portfolio"
          action={
            <Link href="/app/portfolio" className="link-arrow" style={{ fontSize: 12 }}>
              All portfolios
            </Link>
          }
        >
          {PORTFOLIOS.length === 0 ? (
            <EmptyState
              icon={<IconPortfolio size={22} />}
              title="No portfolio yet"
              body="A portfolio is a saved set of vessels — usually the result of a GO Fleet query you want to keep watching."
              primaryHref="/app/fleet"
              primaryLabel="Build a query"
              file="data/portfolio.ts"
            />
          ) : (
            <div className="panel-body stack g12">
              {PORTFOLIOS.map((p) => (
                <Link href="/app/portfolio" key={p.id} className="well between">
                  <span style={{ fontSize: 13.5, color: 'var(--text)' }}>{p.name}</span>
                  <Badge tone="blue">{p.entries.length} vessels</Badge>
                </Link>
              ))}
            </div>
          )}
        </Panel>

        <Panel
          title="Recent alerts"
          action={
            <Link href="/app/alerts" className="link-arrow" style={{ fontSize: 12 }}>
              All alerts
            </Link>
          }
        >
          {ALERTS.length === 0 ? (
            <EmptyState
              icon={<IconAlerts size={22} />}
              title="No alerts"
              body="Renewal dates, off-hire events, zone entry and rate moves surface here once contracts and vessels are recorded."
              file="data/alerts.ts"
              fields={['type', 'severity', 'title', 'createdAt']}
            />
          ) : (
            <div>
              {ALERTS.slice(0, 6).map((a) => (
                <div className="feed-item" key={a.id}>
                  <span className="feed-mark">
                    <IconAlerts size={15} />
                  </span>
                  <div className="grow">
                    <div className="feed-title">{a.title}</div>
                    <div className="feed-meta">
                      {a.type} · {timeAgo(a.createdAt)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Panel>
      </div>
    </>
  );
}
