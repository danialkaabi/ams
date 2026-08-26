import Link from 'next/link';
import MarketingLayout from '@/components/go/MarketingLayout';
import { usd } from '@/components/go/ui';
import { FEATURE_LABELS, PLANS, PLAN_ORDER } from '@/data/go/accounts';
import type { FeatureKey } from '@/data/go/types';

const ALL_FEATURES: FeatureKey[] = [
  'fleet', 'companies', 'contracts', 'projects', 'maps', 'market',
  'ai', 'alerts', 'app', 'export', 'api',
];

const FAQ = [
  {
    q: 'Are any modules held back on the lower tiers?',
    a: 'No. All ten modules are on every account from day one — Fleet, Companies, Contracts, Projects, Maps, Market, AI, Alerts, App and the mobile app. What scales is seats, how much of the market you can see, and whether you can pull data out through Excel export or the API.',
  },
  {
    q: 'What does “data scope” actually restrict?',
    a: 'Public graph data — vessel particulars, ownership chains, fields, projects and market benchmarks — is on every account. Commercially sensitive detail such as fixed day rates is scoped: a shipowner account sees its own fleet, a financier sees its financed fleet, and an NOC or EPC account sees all operators across the region. Rows outside scope still appear, marked restricted, so you always know a fixture exists.',
  },
  {
    q: 'Can we add seats mid-term?',
    a: 'Yes. Seats are added pro rata against the remaining term, and your account manager can raise the ceiling without re-papering the contract.',
  },
  {
    q: 'How is the data verified?',
    a: 'Every field carries a confidence score and a source. Anything below the 70% threshold is queued for the analyst desk and does not reach a screen as fixable data until a human confirms it. Corrections you submit feed back into the extraction model.',
  },
  {
    q: 'Do you support procurement and security review?',
    a: 'Yes — enterprise security review, SSO, audit-trail export and a SOC 2 track are part of the enterprise readiness programme. Ask your account manager for the current security pack.',
  },
];

export default function Pricing() {
  return (
    <MarketingLayout
      title="Pricing"
      description="Three GO Intelligence accounts — Shipowner/Operator, Financier and NOC & EPC Contractor. Full platform on every plan."
    >
      <section className="go-hero" style={{ paddingBottom: 40 }}>
        <div className="go-wrap">
          <span className="eyebrow">Subscription packages</span>
          <h1 style={{ marginTop: 18, maxWidth: '18ch' }}>Three accounts. One platform.</h1>
          <p className="lede">
            Every account runs on the same GO Intelligence platform, with all ten modules live from day one.
            Seats, data scope, export and API access scale with the account type.
          </p>
        </div>
      </section>

      <section style={{ paddingBottom: 60 }}>
        <div className="go-wrap">
          <div className="go-grid c3">
            {PLAN_ORDER.map((t) => {
              const p = PLANS[t];
              return (
                <div key={t} className={`go-price ${t === 'noc-epc' ? 'featured' : ''}`}>
                  {t === 'noc-epc' && <span className="go-price-tag">Full platform + API</span>}
                  <h3>{p.name}</h3>
                  <p className="go-price-aud">{p.audience}</p>
                  <div className="go-price-amount">{usd(p.priceUsd)}</div>
                  <div className="go-price-billing">{p.billing}</div>

                  <div style={{ marginTop: 18 }}>
                    <span className="eyebrow">{p.tagline}</span>
                    <ul className="go-featlist">
                      {ALL_FEATURES.map((f) => (
                        <li key={f} className={p.features.includes(f) ? 'on' : ''} style={p.features.includes(f) ? undefined : { opacity: 0.4 }}>
                          {p.features.includes(f) ? '✓' : '—'} {FEATURE_LABELS[f]}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="go-spec">
                    <div className="go-spec-row">
                      <div className="go-spec-k">Seats</div>
                      <div className="go-spec-v">Up to {p.seats} users</div>
                    </div>
                    <div className="go-spec-row">
                      <div className="go-spec-k">Data scope</div>
                      <div className="go-spec-v">{p.dataScopeLabel}</div>
                    </div>
                    <div className="go-spec-row">
                      <div className="go-spec-k">Support</div>
                      <div className="go-spec-v">{p.support}</div>
                    </div>
                  </div>

                  <div style={{ marginTop: 22, display: 'grid', gap: 8 }}>
                    <Link href="/go/dashboard" className={`go-btn ${t === 'noc-epc' ? 'primary' : ''}`} style={{ justifyContent: 'center' }}>
                      Preview this account
                    </Link>
                    <a href="mailto:sales@gointelligence.com?subject=GO%20Intelligence%20access" className="go-btn ghost" style={{ justifyContent: 'center' }}>
                      Request access
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="go-note" style={{ marginTop: 22, textAlign: 'center' }}>
            Shipowner / Operator: core platform only. Financier: core platform plus Excel export. NOC &amp; EPC
            Contractor: full platform with API access.
          </p>
        </div>
      </section>

      <section className="go-sec">
        <div className="go-wrap">
          <div className="go-sec-head">
            <span className="eyebrow">Side by side</span>
            <h2>What changes between accounts</h2>
            <p>The product does not get smaller on a lower tier. The seat count, the slice of the market you can see, and how much data you can take out of the platform do.</p>
          </div>

          <div className="go-panel">
            <div className="go-tablewrap">
              <table className="go-table go-compare">
                <thead>
                  <tr>
                    <th>Capability</th>
                    {PLAN_ORDER.map((t) => (
                      <th key={t}>{PLANS[t].name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ALL_FEATURES.map((f) => (
                    <tr key={f}>
                      <td>{FEATURE_LABELS[f]}</td>
                      {PLAN_ORDER.map((t) => (
                        <td key={t}>
                          {PLANS[t].features.includes(f) ? <span className="go-yes">✓</span> : <span className="go-no">—</span>}
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr>
                    <td>
                      <strong>Seats</strong>
                    </td>
                    {PLAN_ORDER.map((t) => (
                      <td key={t} className="num">
                        {PLANS[t].seats}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td>
                      <strong>Data scope</strong>
                    </td>
                    {PLAN_ORDER.map((t) => (
                      <td key={t} style={{ fontSize: 12 }}>
                        {PLANS[t].dataScopeLabel}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td>
                      <strong>Support</strong>
                    </td>
                    {PLAN_ORDER.map((t) => (
                      <td key={t} style={{ fontSize: 12 }}>
                        {PLANS[t].support}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td>
                      <strong>Annual price</strong>
                    </td>
                    {PLAN_ORDER.map((t) => (
                      <td key={t} className="num" style={{ color: 'var(--text)' }}>
                        {usd(PLANS[t].priceUsd)}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section className="go-sec">
        <div className="go-wrap">
          <div className="go-sec-head">
            <span className="eyebrow">Questions</span>
            <h2>What buyers ask first</h2>
          </div>
          <div className="go-grid c2">
            {FAQ.map((f) => (
              <div key={f.q} className="go-modcard">
                <h3 style={{ marginTop: 0 }}>{f.q}</h3>
                <p>{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="go-sec">
        <div className="go-wrap" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.3rem)', letterSpacing: '-0.03em' }}>
            Start with a design-partner pilot.
          </h2>
          <p style={{ color: 'var(--text-2)', maxWidth: 620, margin: '16px auto 0' }}>
            Pilots run on your own fleet and counterparties, in your own basin, against the live graph — not
            a sandbox.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 26, flexWrap: 'wrap' }}>
            <a href="mailto:sales@gointelligence.com?subject=GO%20Intelligence%20pilot" className="go-btn primary">
              Request access
            </a>
            <Link href="/go/dashboard" className="go-btn">
              Open the platform
            </Link>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
