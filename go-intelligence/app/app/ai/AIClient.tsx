'use client';

import { useState } from 'react';
import PageHead from '@/components/app/PageHead';
import Panel from '@/components/ui/Panel';
import { IconAI, IconArrow } from '@/components/ui/Icons';
import { VESSELS } from '@/data/vessels';
import { COMPANIES } from '@/data/companies';

/** The sequence GO AI reasons across — strategy book, section 09D. */
const CYCLE = [
  { step: 'Source', module: 'GO Fleet', desc: 'Search the fleet by type, region and availability' },
  { step: 'Vet', module: 'GO Companies', desc: 'Ownership, management tier and counterparty risk' },
  { step: 'Benchmark', module: 'GO Market', desc: 'Day-rate benchmarks by region and vessel type' },
  { step: 'Fix', module: 'GO Contracts', desc: 'Draft terms, reference prior charter history' },
  { step: 'Track', module: 'GO Maps', desc: 'Real-time position once on charter' },
  { step: 'Monitor', module: 'GO Alerts', desc: 'Renewal dates, off-hire events, milestones' },
  { step: 'Close', module: 'GO Projects', desc: 'Log completion, update charter history' },
];

const SUGGESTIONS = [
  'Find available medium PSVs in the Middle East Gulf for a 6-month charter from March, benchmark the rate, and flag counterparty risk.',
  'Which of my charters expire in the next 90 days, and how do their rates compare to the current benchmark?',
  'Show every AHTS over 100t bollard pull idle in the Gulf for more than 14 days.',
  'Who beneficially owns the vessels working the tenders we are bidding on?',
];

export default function AIClient() {
  const [query, setQuery] = useState('');
  const [submitted, setSubmitted] = useState<string | null>(null);

  const hasRecords = VESSELS.length > 0 || COMPANIES.length > 0;

  return (
    <>
      <PageHead
        eyebrow="Analysis · GO AI"
        title="GO AI — your commercial agent"
        sub="One query, one answer — drawn from every core module, start to end of the charter cycle."
      />

      <Panel style={{ marginBottom: 16 }}>
        <div className="panel-body">
          <div className="field">
            <label className="label" htmlFor="ai-q">
              Ask across the graph
            </label>
            <textarea
              id="ai-q"
              className="textarea"
              placeholder="Find available medium PSVs in the Middle East Gulf for a 6-month charter from March, benchmark the rate, and flag counterparty risk…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ minHeight: 88 }}
            />
          </div>

          <div className="between wrapflex" style={{ marginTop: 14 }}>
            <span className="muted" style={{ fontSize: 12 }}>
              Answers are synthesised across Fleet, Companies, Contracts,
              Projects, Maps and Market.
            </span>
            <button
              className="btn btn--primary btn--sm"
              onClick={() => setSubmitted(query.trim() || null)}
              disabled={!query.trim()}
            >
              <IconAI size={14} />
              Ask GO AI
            </button>
          </div>
        </div>
      </Panel>

      {/* Response area */}
      <Panel title="Response" style={{ marginBottom: 16 }}>
        <div className="panel-body">
          {!submitted ? (
            <div className="stack g12">
              <p className="muted" style={{ fontSize: 13 }}>
                Try one of these to see how a query is framed:
              </p>
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  className="well"
                  style={{ textAlign: 'left', cursor: 'pointer', width: '100%' }}
                  onClick={() => setQuery(s)}
                >
                  <span style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6 }}>
                    “{s}”
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="stack g16">
              <div className="well" style={{ borderColor: 'var(--line-2)' }}>
                <div className="plan-meta-k" style={{ marginBottom: 8 }}>
                  Your query
                </div>
                <p style={{ fontSize: 13.5, color: 'var(--text-2)', lineHeight: 1.6 }}>
                  “{submitted}”
                </p>
              </div>

              <div
                className="well"
                style={{
                  borderColor: 'rgba(214,164,78,0.3)',
                  background: 'rgba(214,164,78,0.05)',
                }}
              >
                <div className="row g10" style={{ marginBottom: 10, color: 'var(--gold)' }}>
                  <IconAI size={16} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>
                    {hasRecords ? 'Model not connected' : 'No records to reason over'}
                  </span>
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-3)', lineHeight: 1.65 }}>
                  {hasRecords
                    ? 'The platform holds records, but no language model is wired up yet. Connect one in Settings and point it at the record modules — GO AI reads the same graph the screens do.'
                    : 'GO AI answers from the records in the platform, not from general knowledge — that is what makes an answer defensible. Add vessels, companies, contracts and benchmarks, then connect a model in Settings.'}
                </p>
              </div>
            </div>
          )}
        </div>
      </Panel>

      <Panel title="How GO AI gets there — the offshore charter cycle">
        <div className="panel-body">
          <div
            className="grid"
            style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(172px, 1fr))', gap: 12 }}
          >
            {CYCLE.map((c, i) => (
              <div className="phase" key={c.step}>
                <div className="phase-name">
                  {String(i + 1).padStart(2, '0')} · {c.step}
                </div>
                <div style={{ fontSize: 13.5, color: 'var(--text)', fontWeight: 600 }}>
                  {c.module}
                </div>
                <div className="phase-desc">{c.desc}</div>
              </div>
            ))}
          </div>

          <p
            className="muted"
            style={{ fontSize: 12, marginTop: 16, display: 'flex', alignItems: 'center', gap: 8 }}
          >
            <IconArrow size={13} />
            AI explains. People decide — every claim traces back to the record
            behind it.
          </p>
        </div>
      </Panel>
    </>
  );
}
