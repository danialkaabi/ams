import type { Metadata } from 'next';
import Link from 'next/link';
import PageHead from '@/components/app/PageHead';
import Panel from '@/components/ui/Panel';
import Badge from '@/components/ui/Badge';
import StatTile from '@/components/ui/StatTile';
import { IconAdmin, IconArrow, IconShield } from '@/components/ui/Icons';
import { VESSELS } from '@/data/vessels';
import { COMPANIES } from '@/data/companies';
import { CONTRACTS } from '@/data/contracts';
import { PROJECTS } from '@/data/projects';
import { RATE_BENCHMARKS, UTILISATION } from '@/data/market';
import { ALERTS } from '@/data/alerts';
import { PORTFOLIOS } from '@/data/portfolio';
import { CONFIDENCE_LEVELS } from '@/lib/taxonomy';

export const metadata: Metadata = {
  title: 'Data Manager',
  description: 'Where records enter GO Intelligence.',
};

const SOURCES = [
  {
    name: 'Vessels',
    file: 'data/vessels.ts',
    export: 'VESSELS',
    count: VESSELS.length,
    required: ['imo', 'name', 'category', 'subType', 'status'],
    feeds: 'GO Fleet, vessel profiles, the live map, dashboard KPIs',
    href: '/app/fleet',
  },
  {
    name: 'Companies',
    file: 'data/companies.ts',
    export: 'COMPANIES',
    count: COMPANIES.length,
    required: ['id', 'name', 'type'],
    feeds: 'GO Companies, ownership tiers, owner columns across the platform',
    href: '/app/companies',
  },
  {
    name: 'Contracts',
    file: 'data/contracts.ts',
    export: 'CONTRACTS',
    count: CONTRACTS.length,
    required: ['id', 'vesselImo', 'vesselName', 'charterer', 'charterType', 'status'],
    feeds: 'The charter book, expiry countdowns, renewal exposure',
    href: '/app/contracts',
  },
  {
    name: 'Projects',
    file: 'data/projects.ts',
    export: 'PROJECTS',
    count: PROJECTS.length,
    required: ['id', 'name', 'operator', 'region', 'phase'],
    feeds: 'The phase pipeline, CAPEX totals, vessel demand forecast',
    href: '/app/projects',
  },
  {
    name: 'Rate benchmarks',
    file: 'data/market.ts',
    export: 'RATE_BENCHMARKS',
    count: RATE_BENCHMARKS.length,
    required: ['region', 'sizeClass', 'lowUsdPerDay', 'highUsdPerDay'],
    feeds: 'The rate ticker, charter-book variance, vessel benchmark bands',
    href: '/app/market',
  },
  {
    name: 'Utilisation',
    file: 'data/market.ts',
    export: 'UTILISATION',
    count: UTILISATION.length,
    required: ['region', 'utilisationPct'],
    feeds: 'Regional utilisation on the dashboard and market screen',
    href: '/app/market',
  },
  {
    name: 'Alerts',
    file: 'data/alerts.ts',
    export: 'ALERTS',
    count: ALERTS.length,
    required: ['id', 'type', 'severity', 'title', 'createdAt'],
    feeds: 'The alert feed and the topbar badge',
    href: '/app/alerts',
  },
  {
    name: 'Portfolios',
    file: 'data/portfolio.ts',
    export: 'PORTFOLIOS',
    count: PORTFOLIOS.length,
    required: ['id', 'name', 'entries'],
    feeds: 'My Portfolio and the dashboard portfolio panel',
    href: '/app/portfolio',
  },
];

const VESSEL_TEMPLATE = `{
  imo: '9784521',
  name: 'Vessel Name',
  category: 'OSV',
  subType: 'AHTS',
  sizeClass: 'AHTS (Large)',
  status: 'On Hire',
  flag: 'Panama',
  built: 2018,
  region: 'Middle East Gulf',
  registeredOwnerId: 'your-company-id',
  bollardPullT: 150,
  charterHistory: [
    {
      date: 'Jan 2025',
      charterType: 'TC',
      ratePerDay: 15500,
      charterer: 'Charterer Name',
      fieldContractedTo: 'Field Name',
    },
  ],
}`;

export default function DataPage() {
  const total = SOURCES.reduce((s, x) => s + x.count, 0);

  return (
    <>
      <PageHead
        eyebrow="Platform · Data Manager"
        title="Data Manager"
        sub="Where records enter the platform. Every screen reads from these modules — nothing is hard-coded into a page."
      />

      <div className="grid grid-4" style={{ marginBottom: 16 }}>
        <StatTile
          label="Total records"
          value={total === 0 ? '—' : total}
          empty={total === 0}
          foot={<span className="muted">Across all modules</span>}
        />
        <StatTile
          label="Record types"
          value={SOURCES.length}
          accent="gold"
          foot={<span className="muted">Wired and ready</span>}
        />
        <StatTile
          label="Screens live"
          value={15}
          accent="green"
          foot={<span className="muted">All built, all empty</span>}
        />
        <StatTile
          label="Confidence levels"
          value={CONFIDENCE_LEVELS.length}
          accent="amber"
          foot={<span className="muted">Verified → low</span>}
        />
      </div>

      <Panel title="Record sources" style={{ marginBottom: 16 }}>
        <div className="table-scroll">
          <table className="table">
            <thead>
              <tr>
                <th>Record type</th>
                <th>File</th>
                <th>Export</th>
                <th className="th-num">Records</th>
                <th>Feeds</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {SOURCES.map((s) => (
                <tr key={s.name + s.export}>
                  <td className="td-strong">{s.name}</td>
                  <td className="mono" style={{ color: 'var(--blue-300)' }}>
                    {s.file}
                  </td>
                  <td className="mono">{s.export}</td>
                  <td className="td-num">
                    {s.count === 0 ? (
                      <Badge tone="grey">Empty</Badge>
                    ) : (
                      <Badge tone="green">{s.count}</Badge>
                    )}
                  </td>
                  <td style={{ whiteSpace: 'normal', maxWidth: 320, color: 'var(--text-4)' }}>
                    {s.feeds}
                  </td>
                  <td>
                    <Link href={s.href} className="link-arrow" style={{ fontSize: 12 }}>
                      Open
                      <IconArrow size={13} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <div className="grid grid-2" style={{ marginBottom: 16 }}>
        <Panel title="How to add a record">
          <div className="panel-body stack g14">
            <p style={{ fontSize: 13, color: 'var(--text-3)', lineHeight: 1.7 }}>
              Open the module, add an object to the exported array, save. The
              app picks it up on the next build — every count, chart, filter
              and table across the platform recalculates from it.
            </p>

            <div className="well">
              <div className="plan-meta-k" style={{ marginBottom: 10 }}>
                Example · data/vessels.ts
              </div>
              <pre
                className="mono"
                style={{
                  margin: 0,
                  fontSize: 11.5,
                  lineHeight: 1.65,
                  color: 'var(--text-3)',
                  overflowX: 'auto',
                  whiteSpace: 'pre',
                }}
              >
                {VESSEL_TEMPLATE}
              </pre>
            </div>

            <p style={{ fontSize: 12.5, color: 'var(--text-4)', lineHeight: 1.65 }}>
              Allowed values for{' '}
              <span className="mono" style={{ color: 'var(--blue-300)' }}>
                category
              </span>
              ,{' '}
              <span className="mono" style={{ color: 'var(--blue-300)' }}>
                subType
              </span>
              ,{' '}
              <span className="mono" style={{ color: 'var(--blue-300)' }}>
                sizeClass
              </span>{' '}
              and{' '}
              <span className="mono" style={{ color: 'var(--blue-300)' }}>
                region
              </span>{' '}
              live in{' '}
              <span className="mono" style={{ color: 'var(--blue-300)' }}>
                lib/taxonomy.ts
              </span>
              . TypeScript will reject anything outside them, so a typo fails at
              build time rather than showing up as a wrong row on a screen.
            </p>
          </div>
        </Panel>

        <Panel title="Required fields">
          <div className="panel-body stack g14">
            {SOURCES.map((s) => (
              <div key={s.name + s.export}>
                <div
                  className="between"
                  style={{ marginBottom: 7, alignItems: 'baseline' }}
                >
                  <span style={{ fontSize: 13, color: 'var(--text)', fontWeight: 500 }}>
                    {s.name}
                  </span>
                  <span className="mono" style={{ fontSize: 10.5, color: 'var(--text-5)' }}>
                    {s.file}
                  </span>
                </div>
                <div className="schema-chips">
                  {s.required.map((f) => (
                    <span className="schema-chip" key={f}>
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <Panel title="Data quality">
        <div className="panel-body">
          <p
            style={{
              fontSize: 13,
              color: 'var(--text-4)',
              marginBottom: 16,
              maxWidth: '76ch',
              lineHeight: 1.65,
            }}
          >
            Every record accepts an optional{' '}
            <span className="mono" style={{ color: 'var(--blue-300)' }}>
              provenance
            </span>{' '}
            object — source, retrieval date, confidence and a link. A wrong rate
            or a wrong owner costs real money, so the platform is built to carry
            the evidence alongside the value.
          </p>

          <div className="grid grid-4">
            {CONFIDENCE_LEVELS.map((c) => (
              <div className="well" key={c.id}>
                <div className="row g8" style={{ marginBottom: 8, color: 'var(--green)' }}>
                  <IconShield size={14} />
                  <span style={{ fontSize: 13, color: 'var(--text)', fontWeight: 600 }}>
                    {c.label}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-4)', lineHeight: 1.5 }}>
                  {c.desc}
                </div>
              </div>
            ))}
          </div>

          <div
            className="row g10"
            style={{
              marginTop: 18,
              paddingTop: 16,
              borderTop: '1px solid var(--line)',
              color: 'var(--text-4)',
              fontSize: 12.5,
            }}
          >
            <IconAdmin size={15} />
            When you outgrow file-based records, these modules are the seam:
            swap each export for a database query and no screen changes.
          </div>
        </div>
      </Panel>
    </>
  );
}
