import Link from 'next/link';
import MarketingLayout from '@/components/go/MarketingLayout';
import { IconArrow } from '@/components/go/Icons';
import { PLANS, PLAN_ORDER } from '@/data/go/accounts';
import { usd } from '@/components/go/ui';
import { VESSELS } from '@/data/go/vessels';

const MODULES = [
  { n: '01', name: 'GO Fleet', desc: 'Vessel intelligence and the offshore database — full taxonomy, size class, ownership and AIS in one query.' },
  { n: '02', name: 'GO Companies', desc: 'Owners and operators, mapped through seven management tiers with charter history on every profile.' },
  { n: '03', name: 'GO Contracts', desc: 'Commercial agreements — the live charter book, expiry countdowns and rate-vs-benchmark variance.' },
  { n: '04', name: 'GO Projects', desc: 'Field developments, EPC awards, tender pipeline and vessel demand forecasts.' },
  { n: '05', name: 'GO Maps & Layers', desc: 'Spatial intelligence — vessels against fields, concession blocks, platforms and pipelines.' },
  { n: '06', name: 'GO Market', desc: 'Day-rate benchmarks across five basins, by vessel type and size class.' },
  { n: '07', name: 'GO AI', desc: 'AI-assisted insight — one query answered across every module, start to end of the charter cycle.' },
  { n: '08', name: 'GO Alerts', desc: 'Real-time signals on renewals, off-hire, zone entry, tenders and ownership changes.' },
  { n: '09', name: 'GO API', desc: 'Platform access — the same graph the screens run on, in your own systems.' },
  { n: '10', name: 'GO App', desc: 'Mobile intelligence — fleet, contract and field intelligence wherever the decision gets made.' },
];

const PROBLEM = [
  'AIS feeds', 'Spreadsheets', 'Operator websites', 'Broker reports',
  'Government portals', 'Emails', 'PDFs & internal knowledge',
];

const DIFFERENTIATORS = [
  { title: 'Every workflow, one platform', body: 'Vessels, companies, contracts, fields, tenders and rates — not five vendors and five logins.' },
  { title: 'Full platform, flat price', body: 'No module upsells, no feature paywalls. Every account gets the whole system on day one.' },
  { title: '7-tier ownership, 12,000+ vessels', body: 'Beneficial owner through ISM manager, mapped across more than 12,000 offshore vessels worldwide.' },
  { title: 'Live tender & bid support', body: 'Track active tender opportunities and build the vessel case for a bid inside the platform.' },
  { title: 'Charter history & rates, not just position', body: 'Who fixed what, at what rate, for how long — the commercial record most platforms do not hold.' },
  { title: 'Five regions, one view', body: 'Middle East Gulf, Gulf of Mexico, West Africa, South East Asia and North Sea, benchmarked side by side.' },
];

const COMPETITORS = [
  { name: 'VesselsValue (Veson)', cells: ['y', 'y', 'n', 'n', 'n', 'y', 'n'] },
  { name: 'Kpler', cells: ['y', 'p', 'n', 'n', 'n', 'y', 'n'] },
  { name: 'Windward / Spire', cells: ['y', 'n', 'n', 'n', 'n', 'n', 'n'] },
  { name: 'Enverus / Wood Mackenzie', cells: ['n', 'p', 'y', 'y', 'y', 'y', 'n'] },
  { name: 'GO Intelligence', cells: ['y', 'y', 'y', 'y', 'y', 'y', 'y'] },
];

const COLS = ['Fleet / AIS', 'Companies', 'Contracts', 'Projects', 'Infra / Maps', 'Market data', 'Unified graph'];

export default function GoHome() {
  return (
    <MarketingLayout title="Offshore commercial intelligence">
      <section className="go-hero">
        <div className="go-wrap">
          <span className="eyebrow">Gemini Offshore · GO Intelligence</span>
          <h1 style={{ marginTop: 18 }}>One knowledge graph. Every offshore decision.</h1>
          <p className="lede">
            GO Intelligence is the single source of truth for offshore commercial decision-making —
            connecting vessels, companies, contracts, projects, infrastructure and market data in one
            live graph. Not another isolated database.
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 30, flexWrap: 'wrap', position: 'relative' }}>
            <Link href="/go/dashboard" className="go-btn primary">
              Open the live platform <IconArrow />
            </Link>
            <Link href="/go/pricing" className="go-btn">
              See the three accounts
            </Link>
          </div>

          <div className="go-grid c4" style={{ marginTop: 56, position: 'relative' }}>
            {[
              { v: '12,000+', l: 'Offshore vessels mapped worldwide' },
              { v: '7 tiers', l: 'Ownership chain, beneficial owner to ISM' },
              { v: '5 basins', l: 'Benchmarked side by side' },
              { v: '10 modules', l: 'One platform, one flat price' },
            ].map((s) => (
              <div key={s.l} className="go-stat">
                <span className="go-stat-val" style={{ fontSize: 24 }}>
                  {s.v}
                </span>
                <span className="go-stat-label">{s.l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="go-sec">
        <div className="go-wrap">
          <div className="go-sec-head">
            <span className="eyebrow">The problem</span>
            <h2>Commercial teams are drowning in fragmented data</h2>
            <p>
              Every source lives in its own silo, on its own schedule, in its own format. Valuable time is
              spent collecting data instead of making decisions.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {PROBLEM.map((p) => (
              <span key={p} className="go-chip" style={{ padding: '9px 15px', fontSize: 13 }}>
                {p}
              </span>
            ))}
          </div>

          <div className="go-grid c3" style={{ marginTop: 44 }}>
            {[
              { h: 'Connected, not collected', b: 'Vessels, companies, contracts and infrastructure in a single graph — every entity linked to every other one.' },
              { h: 'Built for decisions', b: 'Every screen answers a commercial question rather than just displaying data.' },
              { h: 'AI explains. People decide.', b: 'Maps and AI surface the signal; your team makes the call. GO AI never fixes on your behalf.' },
            ].map((c) => (
              <div key={c.h} className="go-modcard">
                <h3 style={{ marginTop: 0 }}>{c.h}</h3>
                <p>{c.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="go-sec" id="platform">
        <div className="go-wrap">
          <div className="go-sec-head">
            <span className="eyebrow">Product ecosystem</span>
            <h2>Ten modules, one ecosystem</h2>
            <p>
              Every account gets all ten. What scales between plans is seats, data scope, export and API —
              never which parts of the product you are allowed to open.
            </p>
          </div>
          <div className="go-grid c3">
            {MODULES.map((m) => (
              <div key={m.name} className="go-modcard">
                <span className="go-modnum">{m.n}</span>
                <h3>{m.name}</h3>
                <p>{m.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 28 }}>
            <Link href="/go/modules" className="go-btn">
              Walk through every module <IconArrow />
            </Link>
          </div>
        </div>
      </section>

      <section className="go-sec">
        <div className="go-wrap">
          <div className="go-sec-head">
            <span className="eyebrow">Why we&apos;re different</span>
            <h2>The one-stop shop for commercial offshore decisions</h2>
            <p>From tender to charter to contract — every offshore commercial workflow, on one connected platform.</p>
          </div>
          <div className="go-grid c3">
            {DIFFERENTIATORS.map((d) => (
              <div key={d.title} className="go-modcard">
                <h3 style={{ marginTop: 0 }}>{d.title}</h3>
                <p>{d.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="go-sec">
        <div className="go-wrap">
          <div className="go-sec-head">
            <span className="eyebrow">Competitive landscape</span>
            <h2>A fragmented market, one connected platform</h2>
            <p>
              Vessel data platforms track ships. Energy data platforms track assets. GO Intelligence connects
              both — plus the contracts and companies between them — in a single commercial graph built for
              offshore decision-making.
            </p>
          </div>
          <div className="go-panel">
            <div className="go-tablewrap">
              <table className="go-table go-compare">
                <thead>
                  <tr>
                    <th>Platform</th>
                    {COLS.map((c) => (
                      <th key={c}>{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COMPETITORS.map((c) => (
                    <tr key={c.name} style={c.name === 'GO Intelligence' ? { background: 'var(--acc-dim)' } : undefined}>
                      <td>
                        <strong style={c.name === 'GO Intelligence' ? { color: 'var(--acc)' } : undefined}>{c.name}</strong>
                      </td>
                      {c.cells.map((v, i) => (
                        <td key={i}>
                          {v === 'y' ? <span className="go-yes">✓</span> : v === 'p' ? <span className="go-part">◐</span> : <span className="go-no">—</span>}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section className="go-sec">
        <div className="go-wrap">
          <div className="go-sec-head">
            <span className="eyebrow">Subscription packages</span>
            <h2>Three accounts. One platform.</h2>
            <p>
              Every account runs on the same GO Intelligence platform. API access and data export scale with
              account type.
            </p>
          </div>
          <div className="go-grid c3">
            {PLAN_ORDER.map((t) => {
              const p = PLANS[t];
              return (
                <div key={t} className={`go-price ${t === 'noc-epc' ? 'featured' : ''}`}>
                  {t === 'noc-epc' && <span className="go-price-tag">Full platform</span>}
                  <h3>{p.name}</h3>
                  <p className="go-price-aud">{p.audience}</p>
                  <div className="go-price-amount">{usd(p.priceUsd)}</div>
                  <div className="go-price-billing">{p.billing}</div>
                  <div className="go-spec">
                    <div className="go-spec-row">
                      <div className="go-spec-k">Seats</div>
                      <div className="go-spec-v">Up to {p.seats} users</div>
                    </div>
                    <div className="go-spec-row">
                      <div className="go-spec-k">Data scope</div>
                      <div className="go-spec-v">{p.dataScopeLabel}</div>
                    </div>
                  </div>
                  <div style={{ marginTop: 20 }}>
                    <Link href="/go/pricing" className={`go-btn ${t === 'noc-epc' ? 'primary' : ''}`} style={{ width: '100%', justifyContent: 'center' }}>
                      Details
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="go-sec">
        <div className="go-wrap" style={{ textAlign: 'center' }}>
          <span className="eyebrow">Launch market · Middle East Gulf</span>
          <h2 style={{ fontSize: 'clamp(1.7rem, 3.4vw, 2.6rem)', marginTop: 16, letterSpacing: '-0.03em' }}>
            See it against your own fleet.
          </h2>
          <p style={{ color: 'var(--text-2)', maxWidth: 620, margin: '16px auto 0' }}>
            The platform is live with {VESSELS.length} vessels loaded across five basins. Open it as a
            shipowner, a financier or an NOC and see exactly what your team would see.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 28, flexWrap: 'wrap' }}>
            <Link href="/go/dashboard" className="go-btn primary">
              Open the platform <IconArrow />
            </Link>
            <Link href="/go/pricing" className="go-btn">
              Request access
            </Link>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
