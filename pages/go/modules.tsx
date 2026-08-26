import Link from 'next/link';
import MarketingLayout from '@/components/go/MarketingLayout';
import { IconArrow } from '@/components/go/Icons';

const MODULES = [
  {
    n: '01', name: 'GO Fleet', href: '/go/fleet',
    line: 'Vessel intelligence and the offshore database.',
    body: 'Full vessel-type taxonomy — OSV, OCV, MODU, offshore production, floater wet and renewable — down to sub-type and size class. Filter by ownership, build year, features, energy efficiency, raw and derived AIS, and transaction history, then combine any of it with an in-zone predicate in a single query.',
    answers: ['Which medium PSVs are free in this basin inside 72 hours?', 'Who has been sitting inside Safaniya Field for more than seven days?'],
  },
  {
    n: '02', name: 'GO Companies', href: '/go/companies',
    line: 'Owners, operators and counterparties.',
    body: 'Every company profile carries the seven management tiers — beneficial owner, registered owner, commercial manager, operator, commercially controlled by, technical manager and ISM manager — plus fleet composition, regional utilisation and company-level charter history.',
    answers: ['Who really controls this vessel, behind the SPV?', 'Has this counterparty ever performed for a charterer at our scale?'],
  },
  {
    n: '03', name: 'GO Contracts', href: '/go/contracts',
    line: 'The live charter book.',
    body: 'Expiry countdowns, rate-versus-benchmark variance, renewal exposure by quarter and annualised contract value. The commercial record most vessel platforms simply do not hold: who fixed what, at what rate, for how long.',
    answers: ['What rolls off in the next 90 days?', 'Where are we fixed below the market and by how much?'],
  },
  {
    n: '04', name: 'GO Projects', href: '/go/projects',
    line: 'The demand side of the market.',
    body: 'Field developments, EPC awards and the tender pipeline, tracked from tender through award, mobilisation, execution and first oil — each with a vessel demand forecast attached.',
    answers: ['What tonnage will this basin need, and when?', 'Which tenders match the fleet we already have?'],
  },
  {
    n: '05', name: 'GO Maps & Layers', href: '/go/maps',
    line: 'Spatial intelligence.',
    body: 'Vessels rendered live against concession blocks, fields, platforms, pipelines and ports. Toggle layers, watch field utilisation trend over twelve months, and click straight through from a position to the full commercial profile.',
    answers: ['Who else is working this field right now?', 'Has utilisation here tightened over the last year?'],
  },
  {
    n: '06', name: 'GO Market', href: '/go/market',
    line: 'Day-rate benchmarks.',
    body: 'Indicative term rates by region, vessel type and size class across five basins, with twelve months of history behind each midpoint and a confidence score reflecting fixture count, recency and source mix.',
    answers: ['What is this class worth in this basin today?', 'How does the Gulf price against the North Sea?'],
  },
  {
    n: '07', name: 'GO AI', href: '/go/ai',
    line: 'Your commercial agent.',
    body: 'One query, one answer — synthesised across every core module, start to end of the charter cycle: source, vet, benchmark, fix, track, monitor, close. Every claim resolves to a record with its own source and confidence.',
    answers: ['Find available medium PSVs, benchmark the rate, flag counterparty risk.', 'Where am I exposed on renewals in the next quarter?'],
  },
  {
    n: '08', name: 'GO Alerts', href: '/go/alerts',
    line: 'Real-time signals.',
    body: 'Watch rules that evaluate against the live graph on every ingest cycle: renewals falling due, vessels going off hire, tonnage entering or leaving a zone, tenders opening, benchmarks moving, ownership chains changing. In-app, push, email or webhook.',
    answers: ['Tell me the moment a portfolio vessel comes free.', 'Alert me when a counterparty restructures its ownership.'],
  },
  {
    n: '09', name: 'GO API', href: '/go/api',
    line: 'Platform access.',
    body: 'REST over TLS, bearer authenticated, entitlement-scoped. Every record returns confidence, source and as-of alongside the value, so your own pipelines can gate on data quality rather than trusting a bare number.',
    answers: ['Feed the graph into our chartering system.', 'Gate our own model on data we can actually trust.'],
  },
  {
    n: '10', name: 'GO App', href: '/go/dashboard',
    line: 'Intelligence in your pocket.',
    body: 'Fleet, ownership and charter status on the go. Push alerts for contract and project milestones, offline-ready field and platform maps, and an AI-summarised briefing each morning — for the decision-makers who are rarely at a desk.',
    answers: ['What changed on my fleet overnight?', 'Show me this field without a connection.'],
  },
];

export default function Modules() {
  return (
    <MarketingLayout title="Modules" description="The ten modules of GO Intelligence — Fleet, Companies, Contracts, Projects, Maps, Market, AI, Alerts, API and App.">
      <section className="go-hero" style={{ paddingBottom: 40 }}>
        <div className="go-wrap">
          <span className="eyebrow">Product ecosystem</span>
          <h1 style={{ marginTop: 18 }}>Ten modules, one ecosystem</h1>
          <p className="lede">
            Every screen answers a commercial question rather than just displaying data. All ten modules are
            included on every account — what scales between plans is seats, data scope, export and API.
          </p>
        </div>
      </section>

      <section style={{ paddingBottom: 70 }}>
        <div className="go-wrap" style={{ display: 'grid', gap: 14 }}>
          {MODULES.map((m) => (
            <article
              key={m.name}
              className="go-panel"
              style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', padding: 0 }}
            >
              <div style={{ padding: 24, display: 'grid', gap: 16, gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1fr)' }}>
                <div>
                  <span className="go-modnum">{m.n}</span>
                  <h2 style={{ fontSize: 21, marginTop: 10 }}>{m.name}</h2>
                  <p style={{ color: 'var(--acc)', fontSize: 13.5, marginTop: 8 }}>{m.line}</p>
                  <p style={{ color: 'var(--text-2)', fontSize: 13.5, marginTop: 12, maxWidth: '62ch' }}>{m.body}</p>
                  <Link href={m.href} className="go-btn sm" style={{ marginTop: 18 }}>
                    Open {m.name} <IconArrow />
                  </Link>
                </div>
                <div style={{ borderLeft: '1px solid var(--line)', paddingLeft: 20 }}>
                  <span className="eyebrow">Questions it answers</span>
                  <ul style={{ margin: '12px 0 0', paddingLeft: 16, display: 'grid', gap: 10, color: 'var(--text-2)', fontSize: 12.5, lineHeight: 1.5 }}>
                    {m.answers.map((a) => (
                      <li key={a}>{a}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="go-sec">
        <div className="go-wrap" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.3rem)', letterSpacing: '-0.03em' }}>All ten. Every account.</h2>
          <p style={{ color: 'var(--text-2)', maxWidth: 560, margin: '16px auto 0' }}>
            No module upsells, no feature paywalls. Every account gets the whole system on day one.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 26, flexWrap: 'wrap' }}>
            <Link href="/go/dashboard" className="go-btn primary">
              Open the platform <IconArrow />
            </Link>
            <Link href="/go/pricing" className="go-btn">
              See pricing
            </Link>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
