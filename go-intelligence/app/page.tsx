import Link from 'next/link';
import MarketingLayout from '@/components/marketing/MarketingLayout';
import {
  IconAI,
  IconAPI,
  IconAlerts,
  IconArrow,
  IconCheck,
  IconCompanies,
  IconContracts,
  IconFleet,
  IconGraph,
  IconLayers,
  IconMaps,
  IconMarket,
  IconMobile,
  IconProjects,
  IconShield,
} from '@/components/ui/Icons';

/* The six entities the graph connects — the spine of the whole product. */
const ENTITIES = [
  { label: 'Vessels', icon: IconFleet },
  { label: 'Companies', icon: IconCompanies },
  { label: 'Contracts', icon: IconContracts },
  { label: 'Projects', icon: IconProjects },
  { label: 'Infrastructure', icon: IconLayers },
  { label: 'Market Data', icon: IconMarket },
];

const FRAGMENTS = [
  'AIS feeds',
  'Spreadsheets',
  'Operator websites',
  'Broker reports',
  'Government portals',
  'Emails',
  'PDFs & internal knowledge',
];

const PILLARS = [
  {
    title: 'Connected, not collected',
    body: 'Vessels, companies, contracts and infrastructure in a single graph — not another isolated database.',
    icon: IconGraph,
  },
  {
    title: 'Built for decisions',
    body: 'Every screen answers a commercial question rather than simply displaying the data behind it.',
    icon: IconContracts,
  },
  {
    title: 'AI explains. People decide.',
    body: 'Maps and AI surface the signal; your team makes the call, with the source behind every field.',
    icon: IconAI,
  },
];

const MODULES = [
  { n: '01', name: 'GO Fleet', desc: 'Vessel intelligence and the offshore database — full taxonomy, size class, ownership and AIS in one query.', icon: IconFleet },
  { n: '02', name: 'GO Companies', desc: 'Owners and operators, mapped through seven management tiers, with charter history on every profile.', icon: IconCompanies },
  { n: '03', name: 'GO Contracts', desc: 'The live charter book — expiry countdowns, rate-vs-benchmark variance and renewal exposure.', icon: IconContracts },
  { n: '04', name: 'GO Projects', desc: 'Field developments, EPC awards, the tender pipeline and vessel demand forecasts.', icon: IconProjects },
  { n: '05', name: 'GO Maps & Layers', desc: 'Spatial intelligence — vessels against fields, concession blocks, platforms and pipelines.', icon: IconMaps },
  { n: '06', name: 'GO Market', desc: 'Day-rate benchmarks across five basins, by vessel type and size class.', icon: IconMarket },
  { n: '07', name: 'GO AI', desc: 'One query answered across every module, from the start to the end of the charter cycle.', icon: IconAI },
  { n: '08', name: 'GO Alerts', desc: 'Real-time signals on renewals, off-hire, zone entry, tenders and ownership changes.', icon: IconAlerts },
  { n: '09', name: 'GO API', desc: 'Platform access — the same graph the screens run on, inside your own systems.', icon: IconAPI },
  { n: '10', name: 'GO App', desc: 'Mobile intelligence — fleet, contract and field intelligence wherever the decision gets made.', icon: IconMobile },
];

const DIFFERENTIATORS = [
  { title: 'Every workflow, one platform', body: 'Vessels, companies, contracts, fields, tenders and rates — not five vendors and five logins.' },
  { title: 'Full platform, flat price', body: 'No module upsells and no feature paywalls. Every account gets the whole system on day one.' },
  { title: '7-tier ownership', body: 'Beneficial owner through ISM manager, mapped across the offshore fleet.' },
  { title: 'Live tender & bid support', body: 'Track active tender opportunities and build the vessel case for a bid inside the platform.' },
  { title: 'Charter history & rates', body: 'Who fixed what, at what rate, for how long — the commercial record most platforms do not hold.' },
  { title: 'Five regions, one view', body: 'Middle East Gulf, Gulf of Mexico, West Africa, South East Asia and North Sea, benchmarked side by side.' },
];

const PIPELINE = [
  { n: '1', name: 'Ingest', desc: 'Brokers, operators, registries and public filings' },
  { n: '2', name: 'Extract', desc: 'AI parses documents, PDFs and filings' },
  { n: '3', name: 'Score', desc: 'Every field carries a confidence rating' },
  { n: '4', name: 'Verify', desc: 'Analysts confirm anything below threshold' },
  { n: '5', name: 'Improve', desc: 'Corrections feed back into the model' },
];

const COMPARISON = {
  cols: ['Fleet / AIS', 'Companies', 'Contracts', 'Projects', 'Infra / Maps', 'Market data', 'Unified graph'],
  rows: [
    { name: 'Vessel data platforms', cells: ['y', 'y', 'n', 'n', 'n', 'y', 'n'] },
    { name: 'Trade-flow platforms', cells: ['y', 'p', 'n', 'n', 'n', 'y', 'n'] },
    { name: 'Maritime risk platforms', cells: ['y', 'n', 'n', 'n', 'n', 'n', 'n'] },
    { name: 'Energy research platforms', cells: ['n', 'p', 'y', 'y', 'y', 'y', 'n'] },
    { name: 'GO Intelligence', cells: ['y', 'y', 'y', 'y', 'y', 'y', 'y'], us: true },
  ],
};

function Mark({ v }: { v: string }) {
  if (v === 'y') return <span className="mk-yes" aria-label="Yes">✓</span>;
  if (v === 'p') return <span className="mk-part" aria-label="Partial">◐</span>;
  return <span className="mk-no" aria-label="No">—</span>;
}

export default function HomePage() {
  return (
    <MarketingLayout>
      {/* ---------- Hero ---------- */}
      <section className="hero">
        <div className="grid-bg" />
        <div className="wrap">
          <div className="hero-inner">
            <span className="eyebrow eyebrow--blue">
              Gemini Offshore · Offshore Commercial Intelligence
            </span>

            <h1 className="display">
              One knowledge graph.
              <br />
              Every offshore decision.
            </h1>

            <p className="lede">
              GO Intelligence is a single source of truth for offshore
              commercial decision-making — connecting vessels, companies,
              contracts, projects, infrastructure and market intelligence in
              one live graph.
            </p>

            <div className="row g10 wrapflex" style={{ marginTop: 4 }}>
              <Link href="/app" className="btn btn--primary btn--lg">
                Launch the platform
                <IconArrow size={16} />
              </Link>
              <Link href="/platform" className="btn btn--ghost btn--lg">
                Explore the modules
              </Link>
            </div>

            <div className="entity-strip" style={{ marginTop: 14 }}>
              {ENTITIES.map((e) => {
                const Icon = e.icon;
                return (
                  <span className="entity" key={e.label}>
                    <Icon size={14} />
                    {e.label}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Problem ---------- */}
      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">01 · The problem</span>
            <h2 className="section-title">
              Commercial teams are drowning in fragmented data
            </h2>
            <div className="rule-gold" />
            <p className="lede">
              Every source lives in its own silo, on its own schedule, in its
              own format. Valuable time is spent collecting data instead of
              making decisions.
            </p>
          </div>

          <div className="grid grid-4">
            {FRAGMENTS.map((f) => (
              <div className="shard" key={f}>
                {f}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Solution ---------- */}
      <section className="section" style={{ background: 'var(--navy-870)', borderBlock: '1px solid var(--line)' }}>
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">02 · The solution</span>
            <h2 className="section-title">One connected knowledge graph</h2>
            <div className="rule-blue" />
            <p className="lede">
              GO Intelligence connects fragmented offshore data into one live
              graph — not another isolated database.
            </p>
          </div>

          <div className="grid grid-3">
            {PILLARS.map((p) => {
              const Icon = p.icon;
              return (
                <article className="module" key={p.title}>
                  <span style={{ color: 'var(--blue-400)' }}>
                    <Icon size={22} />
                  </span>
                  <h3 className="module-name">{p.title}</h3>
                  <p className="module-desc">{p.body}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------- Modules ---------- */}
      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">03 · Product ecosystem</span>
            <h2 className="section-title">Ten modules, one ecosystem</h2>
            <div className="rule-gold" />
          </div>

          <div className="grid grid-3">
            {MODULES.map((m) => {
              const Icon = m.icon;
              return (
                <article className="module" key={m.n}>
                  <div className="between">
                    <span className="module-n">{m.n}</span>
                    <span style={{ color: 'var(--text-5)' }}>
                      <Icon size={17} />
                    </span>
                  </div>
                  <h3 className="module-name">{m.name}</h3>
                  <p className="module-desc">{m.desc}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------- Data & technology ---------- */}
      <section className="section" style={{ background: 'var(--navy-870)', borderBlock: '1px solid var(--line)' }}>
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">04 · Data & technology</span>
            <h2 className="section-title">Data you can actually trade on</h2>
            <div className="rule-blue" />
            <p className="lede">
              Every data point is scored, verified and traceable — because a
              wrong rate or a wrong owner costs real money.
            </p>
          </div>

          <div className="steps">
            {PIPELINE.map((s) => (
              <article className="step" key={s.n}>
                <div className="step-n">STEP {s.n}</div>
                <h3 className="step-name">{s.name}</h3>
                <p className="step-desc">{s.desc}</p>
              </article>
            ))}
          </div>

          <div className="grid grid-4" style={{ marginTop: 16 }}>
            {[
              { k: 'Confidence-scored', v: 'Every single field' },
              { k: 'Human-verified', v: 'Below-threshold data' },
              { k: 'Full audit trail', v: 'Source to screen' },
              { k: 'Source-linked', v: 'Every field traceable' },
            ].map((x) => (
              <div className="well" key={x.k}>
                <div className="row g8" style={{ color: 'var(--green)', marginBottom: 8 }}>
                  <IconShield size={15} />
                  <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text)' }}>
                    {x.k}
                  </span>
                </div>
                <div style={{ fontSize: 12.5, color: 'var(--text-4)' }}>{x.v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Competitive landscape ---------- */}
      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">05 · Competitive landscape</span>
            <h2 className="section-title">
              A fragmented market, one connected platform
            </h2>
            <div className="rule-gold" />
            <p className="lede">
              No single platform today combines fleet, commercial and
              infrastructure intelligence for offshore energy in one connected
              graph.
            </p>
          </div>

          <div className="panel">
            <div className="table-scroll">
              <table className="matrix">
                <thead>
                  <tr>
                    <th>Category</th>
                    {COMPARISON.cols.map((c) => (
                      <th key={c}>{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON.rows.map((r) => (
                    <tr key={r.name} className={r.us ? 'row-us' : undefined}>
                      <td>{r.name}</td>
                      {r.cells.map((c, i) => (
                        <td key={i}>
                          <Mark v={c} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <blockquote
            style={{
              marginTop: 26,
              paddingLeft: 22,
              borderLeft: '2px solid var(--gold)',
              fontSize: 17,
              lineHeight: 1.6,
              color: 'var(--text-2)',
              maxWidth: '76ch',
            }}
          >
            Vessel data platforms track ships. Energy data platforms track
            assets. GO Intelligence connects both — plus the contracts and
            companies between them — in a single commercial graph built for
            offshore decision-making.
          </blockquote>
        </div>
      </section>

      {/* ---------- Differentiators ---------- */}
      <section className="section" style={{ background: 'var(--navy-870)', borderBlock: '1px solid var(--line)' }}>
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">06 · Why we are different</span>
            <h2 className="section-title">
              The one-stop shop for commercial offshore decisions
            </h2>
            <div className="rule-blue" />
          </div>

          <div className="grid grid-3">
            {DIFFERENTIATORS.map((d) => (
              <article className="module" key={d.title}>
                <span style={{ color: 'var(--green)' }}>
                  <IconCheck size={18} />
                </span>
                <h3 className="module-name">{d.title}</h3>
                <p className="module-desc">{d.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="cta-band">
        <div className="grid-bg" />
        <div className="wrap">
          <span className="eyebrow eyebrow--gold">Gemini Offshore</span>
          <h2 className="section-title" style={{ maxWidth: '18ch' }}>
            One knowledge graph. Every offshore decision.
          </h2>
          <div className="row g10 wrapflex" style={{ justifyContent: 'center' }}>
            <Link href="/app" className="btn btn--primary btn--lg">
              Launch the platform
              <IconArrow size={16} />
            </Link>
            <Link href="/pricing" className="btn btn--ghost btn--lg">
              See pricing
            </Link>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
