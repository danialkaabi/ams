import type { Metadata } from 'next';
import Link from 'next/link';
import MarketingLayout from '@/components/marketing/MarketingLayout';
import {
  IconAI,
  IconAPI,
  IconAlerts,
  IconArrow,
  IconCompanies,
  IconContracts,
  IconFleet,
  IconMaps,
  IconMarket,
  IconMobile,
  IconProjects,
} from '@/components/ui/Icons';

export const metadata: Metadata = {
  title: 'Platform',
  description:
    'Ten modules, one ecosystem. Fleet, Companies, Contracts, Projects, Maps, Market, AI, Alerts, API and App.',
};

const MODULES = [
  {
    n: '01',
    name: 'GO Fleet',
    tag: 'Vessel intelligence & offshore database',
    icon: IconFleet,
    href: '/app/fleet',
    points: [
      'Full vessel-type taxonomy — OSV, OCV, MODU, offshore production, floater wet and renewables',
      'Size class down to five AHTS bands and three PSV bands',
      'Ownership, AIS position and in-zone filters combined in a single query',
      'Save any query as a portfolio, or export the result set',
    ],
  },
  {
    n: '02',
    name: 'GO Companies',
    tag: 'Owners & operators',
    icon: IconCompanies,
    href: '/app/companies',
    points: [
      'Seven management tiers from beneficial owner through ISM manager',
      'Vessels by role, so you can see what a company actually controls',
      'Regional presence and utilisation by basin',
      'Charter history at company level on every profile',
    ],
  },
  {
    n: '03',
    name: 'GO Contracts',
    tag: 'Commercial agreements',
    icon: IconContracts,
    href: '/app/contracts',
    points: [
      'Live charter book with expiry countdowns',
      'Rate-vs-benchmark variance on every fixture',
      'Renewal exposure across the next twelve months',
      'Nothing rolls off unnoticed',
    ],
  },
  {
    n: '04',
    name: 'GO Projects',
    tag: 'Project tracking',
    icon: IconProjects,
    href: '/app/projects',
    points: [
      'Field developments, EPC awards and the tender pipeline',
      'Five phases from tender through to first oil',
      'CAPEX and forecast vessel demand per project',
      'The demand side of the market, not just the supply side',
    ],
  },
  {
    n: '05',
    name: 'GO Maps & Layers',
    tag: 'Spatial intelligence',
    icon: IconMaps,
    href: '/app/maps',
    points: [
      'Every vessel, platform and block on one live map',
      'Layer vessels against fields, concession blocks and pipelines',
      'Field utilisation trend over twelve months',
      'Click any vessel for its full profile',
    ],
  },
  {
    n: '06',
    name: 'GO Market',
    tag: 'Market data',
    icon: IconMarket,
    href: '/app/market',
    points: [
      'Day-rate benchmarks by region, vessel type and size class',
      'Five basins benchmarked side by side',
      'Regional utilisation with twelve-month trend',
      'Indicative term rates to frame a negotiation',
    ],
  },
  {
    n: '07',
    name: 'GO AI',
    tag: 'AI-assisted insight',
    icon: IconAI,
    href: '/app/ai',
    points: [
      'One query, one answer, synthesised across every module',
      'Availability, benchmark and counterparty risk in a single response',
      'Every claim traced back to the record behind it',
      'AI explains; people decide',
    ],
  },
  {
    n: '08',
    name: 'GO Alerts',
    tag: 'Real-time signals',
    icon: IconAlerts,
    href: '/app/alerts',
    points: [
      'Renewal dates and off-hire events',
      'Zone entry and exit on watched areas',
      'Ownership changes and new tenders',
      'Rate movement against your book',
    ],
  },
  {
    n: '09',
    name: 'GO API',
    tag: 'Platform access',
    icon: IconAPI,
    href: '/app/api',
    points: [
      'The same graph the screens run on, in your own systems',
      'REST endpoints for every core entity',
      'Scoped keys per environment',
      'Included with NOC & EPC Contractor accounts',
    ],
  },
  {
    n: '10',
    name: 'GO App',
    tag: 'Mobile intelligence',
    icon: IconMobile,
    href: '/app',
    points: [
      'Fleet, ownership and charter status on the go',
      'Push alerts for contract and project milestones',
      'Offline-ready field and platform maps',
      'AI-summarised briefings each morning',
    ],
  },
];

/* The charter cycle GO AI reasons across — strategy book, section 09D. */
const CYCLE = [
  { step: 'Source', module: 'GO Fleet', desc: 'Search the fleet by type, region and availability' },
  { step: 'Vet', module: 'GO Companies', desc: 'Ownership, management tier and counterparty risk' },
  { step: 'Benchmark', module: 'GO Market', desc: 'Day-rate benchmarks by region and vessel type' },
  { step: 'Fix', module: 'GO Contracts', desc: 'Draft terms, reference prior charter history' },
  { step: 'Track', module: 'GO Maps', desc: 'Real-time position once on charter' },
  { step: 'Monitor', module: 'GO Alerts', desc: 'Renewal dates, off-hire events, milestones' },
  { step: 'Close', module: 'GO Projects', desc: 'Log completion, update charter history' },
];

export default function PlatformPage() {
  return (
    <MarketingLayout>
      <section className="hero" style={{ paddingBlock: 'clamp(56px, 8vw, 96px)' }}>
        <div className="grid-bg" />
        <div className="wrap">
          <div className="hero-inner">
            <span className="eyebrow eyebrow--blue">Product ecosystem</span>
            <h1 className="display" style={{ fontSize: 'clamp(30px, 4.4vw, 52px)' }}>
              Ten modules, one ecosystem.
            </h1>
            <p className="lede">
              Every module reads from the same graph. A vessel you find in
              Fleet carries its owner from Companies, its fixture from
              Contracts, its position from Maps and its benchmark from Market —
              without you joining anything by hand.
            </p>
          </div>
        </div>
      </section>

      {/* ---------- The charter cycle ---------- */}
      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">The offshore charter cycle</span>
            <h2 className="section-title">Start to end, on one platform</h2>
            <div className="rule-gold" />
            <p className="lede">
              The modules are not a menu — they are the sequence of a charter.
              Each one hands off to the next.
            </p>
          </div>

          <div
            className="grid"
            style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(184px, 1fr))', gap: 12 }}
          >
            {CYCLE.map((c, i) => (
              <article className="step" key={c.step}>
                <div className="step-n">
                  {String(i + 1).padStart(2, '0')} · {c.module}
                </div>
                <h3 className="step-name">{c.step}</h3>
                <p className="step-desc">{c.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Module detail ---------- */}
      <section className="section" style={{ background: 'var(--navy-870)', borderBlock: '1px solid var(--line)' }}>
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">Every module</span>
            <h2 className="section-title">What each one does</h2>
            <div className="rule-blue" />
          </div>

          <div className="grid grid-2" style={{ gap: 18 }}>
            {MODULES.map((m) => {
              const Icon = m.icon;
              return (
                <article className="panel" key={m.n}>
                  <div className="panel-head">
                    <div className="row g10">
                      <span style={{ color: 'var(--blue-400)' }}>
                        <Icon size={18} />
                      </span>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>
                          {m.name}
                        </div>
                        <div style={{ fontSize: 11.5, color: 'var(--text-5)' }}>{m.tag}</div>
                      </div>
                    </div>
                    <span className="module-n">{m.n}</span>
                  </div>

                  <div className="panel-body">
                    <ul className="stack g10">
                      {m.points.map((p) => (
                        <li
                          key={p}
                          className="row g10"
                          style={{ alignItems: 'flex-start', fontSize: 13, color: 'var(--text-3)' }}
                        >
                          <span
                            style={{
                              width: 4,
                              height: 4,
                              borderRadius: '50%',
                              background: 'var(--blue-500)',
                              marginTop: 7,
                              flex: 'none',
                            }}
                          />
                          <span style={{ lineHeight: 1.6 }}>{p}</span>
                        </li>
                      ))}
                    </ul>

                    <Link href={m.href} className="link-arrow" style={{ marginTop: 16 }}>
                      Open {m.name}
                      <IconArrow size={14} />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="grid-bg" />
        <div className="wrap">
          <h2 className="section-title" style={{ maxWidth: '20ch' }}>
            Every screen answers a commercial question.
          </h2>
          <Link href="/app" className="btn btn--primary btn--lg">
            Launch the platform
            <IconArrow size={16} />
          </Link>
        </div>
      </section>
    </MarketingLayout>
  );
}
