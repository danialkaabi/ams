import type { Metadata } from 'next';
import Link from 'next/link';
import MarketingLayout from '@/components/marketing/MarketingLayout';
import { IconArrow } from '@/components/ui/Icons';

export const metadata: Metadata = {
  title: 'Company',
  description:
    'Gemini Offshore builds GO Intelligence — the offshore commercial intelligence platform. Vision, market, roadmap and leadership.',
};

const MARKET = [
  {
    v: '$268B',
    k: 'Global offshore oil & gas market by 2034',
    note: 'Up from $166B in 2026',
  },
  {
    v: '$36.3B',
    k: 'Offshore support vessel market by 2029',
    note: '7.2% CAGR',
  },
  {
    v: '3,700+',
    k: 'Offshore wells drilled globally in 2024',
    note: 'Up 9% year on year',
  },
];

const SCOPE = [
  {
    tag: 'TAM',
    title: 'Offshore commercial intelligence & data spend',
    body: 'Global operators, EPCs, charterers, financiers and insurers buying fragmented data today from a patchwork of providers.',
  },
  {
    tag: 'SAM',
    title: 'Middle East offshore operators, EPCs & service companies',
    body: 'The stated launch market — NOCs, IOCs, EPC contractors and marine service companies across the Gulf, home to the world’s largest offshore field.',
  },
  {
    tag: 'SOM',
    title: 'US$5M+ ARR target',
    body: 'At an estimated $60K–$100K average contract value, roughly 50–85 flagship enterprise accounts once reference accounts are in place.',
  },
];

const ROADMAP = [
  {
    year: 'Year 1',
    title: 'Win on contracts & ownership',
    focus:
      'Lead with the data competitors do not hold — ownership chains, charter history and contracts. Defer live tracking.',
    product: [
      'Ship Fleet, Companies, Contracts and Projects to production quality',
      'Build the ownership and charter-history dataset — the defensible layer',
      'Positions from free and historical AIS sources; no satellite spend yet',
    ],
    commercial: [
      'Sign 3–5 design-partner pilots across the UAE, Saudi Arabia and Qatar',
      'Hire the first Gulf-based commercial lead',
      'Attend two flagship regional industry events',
    ],
    team: [
      'Core engineering team of 3–5',
      'First customer success hire',
      'Incorporate a regional entity if required for contracting',
    ],
    target: '5–8 paying accounts · ~US$300K–500K ARR',
  },
  {
    year: 'Year 2',
    title: 'Scale regional leadership',
    focus:
      'Convert pilots into multi-year contracts, expand across the GCC, and build flagship references.',
    product: [
      'Ship GO AI, GO Alerts and GO API',
      'Licence regional satellite AIS — funded by Year 1 revenue',
      'Enterprise security and procurement readiness',
    ],
    commercial: [
      'Build a dedicated sales team of 2–3 account executives',
      'Land 2–3 flagship reference accounts at NOC/IOC scale',
      'Launch the account expansion and upsell motion',
    ],
    team: [
      'Scale engineering and data operations',
      'Formalise customer success as a function',
      'Evaluate a Series A raise to fund scale-up',
    ],
    target: '25–40 accounts · ~US$2M–2.5M ARR',
  },
  {
    year: 'Year 3',
    title: 'Expand beyond the Gulf',
    focus:
      'Category leadership in the Middle East, plus selective expansion into adjacent offshore basins.',
    product: [
      'Full ten-module platform live for all customers',
      'Partner integrations with chartering and EPC systems',
      'Extend data coverage to new target geographies',
    ],
    commercial: [
      'Open a second regional presence',
      'Pursue channel and data-partnership deals',
      'Build out marketing and analyst relations',
    ],
    team: [
      'Hire a regional GM for the new market',
      'Scale the org to support multi-region operations',
      'Institutionalise the data quality and verification pipeline',
    ],
    target: '50–85 flagship accounts · US$5M+ ARR',
  },
];

const LEADERSHIP = [
  { name: 'Ashwin Choolun', role: 'Founder' },
  { name: 'Dan Kaabi', role: 'Co-Founder' },
];

export default function CompanyPage() {
  return (
    <MarketingLayout>
      <section className="hero" style={{ paddingBlock: 'clamp(56px, 8vw, 96px)' }}>
        <div className="grid-bg" />
        <div className="wrap">
          <div className="hero-inner">
            <span className="eyebrow eyebrow--gold">Gemini Offshore</span>
            <h1 className="display" style={{ fontSize: 'clamp(30px, 4.4vw, 52px)' }}>
              Why we exist
            </h1>
            <blockquote className="hero-quote">
              To become the world’s most trusted commercial intelligence
              platform for the offshore energy industry.
            </blockquote>
            <p className="lede">
              GO Intelligence provides a single source of truth for offshore
              commercial decision-making — connecting vessels, companies,
              contracts, projects, infrastructure and market intelligence.
            </p>
          </div>
        </div>
      </section>

      {/* ---------- Market ---------- */}
      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">Market opportunity</span>
            <h2 className="section-title">
              A large, growing and underserved market
            </h2>
            <div className="rule-gold" />
          </div>

          <div className="grid grid-3">
            {MARKET.map((m) => (
              <div className="panel panel-pad" key={m.v}>
                <div
                  className="num"
                  style={{ fontSize: 38, letterSpacing: '-0.04em', marginBottom: 12 }}
                >
                  {m.v}
                </div>
                <div style={{ fontSize: 13.5, color: 'var(--text-2)', lineHeight: 1.55 }}>
                  {m.k}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-5)', marginTop: 7 }}>
                  {m.note}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-3" style={{ marginTop: 16 }}>
            {SCOPE.map((s) => (
              <article className="module" key={s.tag}>
                <span className="module-n">{s.tag}</span>
                <h3 className="module-name">{s.title}</h3>
                <p className="module-desc">{s.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Roadmap ---------- */}
      <section className="section" style={{ background: 'var(--navy-870)', borderBlock: '1px solid var(--line)' }}>
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">Go-to-market roadmap</span>
            <h2 className="section-title">Focused launch, enterprise value</h2>
            <div className="rule-blue" />
            <p className="lede">
              Launch in the Middle East, win flagship enterprise customers,
              build reference accounts, then expand globally.
            </p>
          </div>

          <div className="stack g16">
            {ROADMAP.map((r) => (
              <article className="panel" key={r.year}>
                <div className="panel-head">
                  <div className="row g12">
                    <span className="badge badge--gold">{r.year}</span>
                    <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>
                      {r.title}
                    </span>
                  </div>
                  <span className="mono hide-sm" style={{ fontSize: 11.5, color: 'var(--blue-300)' }}>
                    {r.target}
                  </span>
                </div>

                <div className="panel-body">
                  <p style={{ fontSize: 13.5, color: 'var(--text-3)', marginBottom: 18 }}>
                    {r.focus}
                  </p>

                  <div className="grid grid-3">
                    {([
                      ['Product', r.product],
                      ['Commercial', r.commercial],
                      ['Team & ops', r.team],
                    ] as const).map(([heading, items]) => (
                      <div className="well" key={heading}>
                        <div className="plan-meta-k" style={{ marginBottom: 11 }}>
                          {heading}
                        </div>
                        <ul className="stack g9" style={{ gap: 9 }}>
                          {items.map((it) => (
                            <li
                              key={it}
                              style={{ fontSize: 12.5, color: 'var(--text-3)', lineHeight: 1.55 }}
                            >
                              {it}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  <div
                    className="mono"
                    style={{
                      marginTop: 16,
                      fontSize: 11.5,
                      color: 'var(--blue-300)',
                      paddingTop: 14,
                      borderTop: '1px solid var(--line)',
                    }}
                  >
                    TARGET BY YEAR END · {r.target}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Leadership ---------- */}
      <section className="section" id="leadership">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">Leadership</span>
            <h2 className="section-title">The founding team</h2>
            <div className="rule-gold" />
          </div>

          <div className="grid grid-2" style={{ maxWidth: 720 }}>
            {LEADERSHIP.map((p) => (
              <div className="panel panel-pad row g16" key={p.name}>
                <span
                  className="avatar"
                  style={{ width: 46, height: 46, fontSize: 15, borderRadius: 'var(--r)' }}
                >
                  {p.name.split(' ').map((w) => w[0]).join('')}
                </span>
                <div>
                  <div style={{ fontSize: 15.5, color: 'var(--text)', fontWeight: 600 }}>
                    {p.name}
                  </div>
                  <div style={{ fontSize: 12.5, color: 'var(--text-5)', marginTop: 3 }}>
                    {p.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Contact ---------- */}
      <section className="section" id="contact" style={{ background: 'var(--navy-870)', borderBlock: '1px solid var(--line)' }}>
        <div className="wrap wrap-narrow">
          <div className="section-head">
            <span className="eyebrow">Contact</span>
            <h2 className="section-title">Talk to us</h2>
            <div className="rule-blue" />
            <p className="lede">
              Tell us which fleet, basin or counterparty you need visibility on
              and we will show you the platform against it.
            </p>
          </div>

          <form className="panel panel-pad grid grid-2" style={{ gap: 16 }}>
            <div className="field">
              <label className="label" htmlFor="c-name">Name</label>
              <input className="input" id="c-name" name="name" placeholder="Your name" />
            </div>
            <div className="field">
              <label className="label" htmlFor="c-company">Company</label>
              <input className="input" id="c-company" name="company" placeholder="Your company" />
            </div>
            <div className="field">
              <label className="label" htmlFor="c-email">Work email</label>
              <input className="input" id="c-email" name="email" type="email" placeholder="you@company.com" />
            </div>
            <div className="field">
              <label className="label" htmlFor="c-tier">Account type</label>
              <select className="select" id="c-tier" name="tier" defaultValue="">
                <option value="" disabled>Select…</option>
                <option>Shipowner / Operator</option>
                <option>Financier</option>
                <option>NOC &amp; EPC Contractor</option>
                <option>Not sure yet</option>
              </select>
            </div>
            <div className="field" style={{ gridColumn: '1 / -1' }}>
              <label className="label" htmlFor="c-msg">What are you trying to see?</label>
              <textarea
                className="textarea"
                id="c-msg"
                name="message"
                placeholder="Fleet, basin, counterparty or decision you need visibility on…"
              />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <button type="button" className="btn btn--primary">
                Request a walkthrough
                <IconArrow size={15} />
              </button>
              <p className="muted" style={{ fontSize: 11.5, marginTop: 11 }}>
                This form is not yet wired to a backend — connect it to your
                inbox or CRM before going live.
              </p>
            </div>
          </form>
        </div>
      </section>
    </MarketingLayout>
  );
}
