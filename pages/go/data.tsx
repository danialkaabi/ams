import Link from 'next/link';
import MarketingLayout from '@/components/go/MarketingLayout';
import { IconArrow } from '@/components/go/Icons';

const PIPELINE = [
  { n: '1', stage: 'Ingest', body: 'Brokers, operators, flag and class registries, public filings and customer submissions land in a staging store with their source attached — nothing enters the graph anonymously.' },
  { n: '2', stage: 'Extract', body: 'AI parses documents, PDFs and filings into typed entities and relationships. Extraction is deterministic where a schema exists and model-driven where it does not.' },
  { n: '3', stage: 'Score', body: 'Every field carries its own confidence rating, computed from source reliability, corroboration across sources, recency and extraction certainty.' },
  { n: '4', stage: 'Verify', body: 'Anything below the 70% threshold is queued to the analyst desk. It does not reach a screen as fixable data until a human confirms it.' },
  { n: '5', stage: 'Improve', body: 'Analyst corrections and customer-submitted fixes feed back into the extraction model, so the same class of error gets rarer over time.' },
];

const GUARANTEES = [
  { h: 'Confidence-scored', b: 'Every single field, not just the record.' },
  { h: 'Human-verified', b: 'Everything below threshold, before it publishes.' },
  { h: 'Full audit trail', b: 'Source to screen, on every value.' },
  { h: 'Source-linked', b: 'Every field traceable to where it came from.' },
];

const STACK = [
  { k: 'Data', v: 'PostgreSQL with a graph overlay — entities, typed edges and temporal versioning' },
  { k: 'Platform', v: 'Supabase for auth, row-level security and realtime subscriptions' },
  { k: 'Web', v: 'Next.js and React — server-rendered, statically cached where the data allows' },
  { k: 'Mobile', v: 'React Native — GO App on iOS and Android, offline-ready map and briefing' },
  { k: 'Access', v: 'Secure REST APIs, bearer auth, entitlement-scoped keys and signed webhooks' },
  { k: 'Positions', v: 'Free and historical AIS at launch; licensed regional satellite AIS from Year 2' },
];

export default function DataPage() {
  return (
    <MarketingLayout
      title="Data & technology"
      description="How GO Intelligence ingests, extracts, scores and verifies offshore data — confidence-scored, human-verified, fully traceable."
    >
      <section className="go-hero" style={{ paddingBottom: 40 }}>
        <div className="go-wrap">
          <span className="eyebrow">Data &amp; technology</span>
          <h1 style={{ marginTop: 18 }}>Data you can actually trade on</h1>
          <p className="lede">
            Every data point is scored, verified and traceable — because a wrong rate or a wrong owner costs
            real money. This is the part of the platform that has to be right before anything else matters.
          </p>
        </div>
      </section>

      <section style={{ paddingBottom: 60 }}>
        <div className="go-wrap">
          <span className="eyebrow">The data pipeline</span>
          <div style={{ display: 'grid', gap: 12, marginTop: 20 }}>
            {PIPELINE.map((p) => (
              <div key={p.n} className="go-panel" style={{ display: 'flex', gap: 18, padding: 20, alignItems: 'flex-start' }}>
                <span
                  style={{
                    width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
                    border: '1px solid var(--acc)', color: 'var(--acc)',
                    display: 'grid', placeItems: 'center',
                    fontFamily: "'IBM Plex Mono', monospace", fontSize: 12,
                  }}
                >
                  {p.n}
                </span>
                <div>
                  <h3 style={{ fontSize: 15 }}>{p.stage}</h3>
                  <p style={{ color: 'var(--text-2)', fontSize: 13.5, marginTop: 7, maxWidth: '76ch' }}>{p.body}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="go-grid c4" style={{ marginTop: 26 }}>
            {GUARANTEES.map((g) => (
              <div key={g.h} className="go-modcard">
                <h3 style={{ marginTop: 0 }}>{g.h}</h3>
                <p>{g.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="go-sec">
        <div className="go-wrap">
          <div className="go-sec-head">
            <span className="eyebrow">In the product</span>
            <h2>What that looks like on screen</h2>
            <p>
              Trust is not a marketing claim here, it is a UI component. Every commercially load-bearing value
              carries a confidence bar you can hover for its source, its as-of date and who verified it.
            </p>
          </div>

          <div className="go-panel">
            <div className="go-tablewrap">
              <table className="go-table">
                <thead>
                  <tr>
                    <th>Band</th>
                    <th>Score</th>
                    <th>What it means</th>
                    <th>How the platform treats it</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <span className="go-pill ok">
                        <span className="go-dot" />
                        High
                      </span>
                    </td>
                    <td className="num">85–100</td>
                    <td>Corroborated across sources, or analyst-verified against a primary document.</td>
                    <td>Published. Safe to fix on, subject to the usual broker confirmation.</td>
                  </tr>
                  <tr>
                    <td>
                      <span className="go-pill warn">
                        <span className="go-dot" />
                        Medium
                      </span>
                    </td>
                    <td className="num">70–84</td>
                    <td>Single credible source, recent, no contradiction in the graph.</td>
                    <td>Published with the score shown. Flagged if a decision depends on it.</td>
                  </tr>
                  <tr>
                    <td>
                      <span className="go-pill bad">
                        <span className="go-dot" />
                        Low
                      </span>
                    </td>
                    <td className="num">Below 70</td>
                    <td>Stale, uncorroborated, or extracted with low certainty.</td>
                    <td>Queued to the analyst desk. Never presented as fixable data.</td>
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
            <span className="eyebrow">Built on</span>
            <h2>The stack underneath</h2>
            <p>Chosen for the shape of the problem: a connected graph, read constantly by small expert teams, that has to stay auditable.</p>
          </div>
          <div className="go-panel">
            <div className="go-tablewrap">
              <table className="go-table">
                <tbody>
                  {STACK.map((s) => (
                    <tr key={s.k}>
                      <td style={{ width: 140 }}>
                        <strong>{s.k}</strong>
                      </td>
                      <td>{s.v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="go-grid c3" style={{ marginTop: 26 }}>
            {[
              { h: 'Row-level security', b: 'Data scope is enforced in the database, not in the UI. A key cannot read what the account cannot see.' },
              { h: 'Temporal by default', b: 'Records are versioned, not overwritten. You can always ask what the graph said on the day you fixed.' },
              { h: 'Enterprise readiness', b: 'SSO, audit-trail export and a SOC 2 track as part of the Year 2 procurement programme.' },
            ].map((c) => (
              <div key={c.h} className="go-modcard">
                <h3 style={{ marginTop: 0 }}>{c.h}</h3>
                <p>{c.b}</p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 28, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link href="/go/api" className="go-btn primary">
              See the API <IconArrow />
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
