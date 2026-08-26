import Link from 'next/link';
import { useMemo, useState } from 'react';
import AppShell from '@/components/go/AppShell';
import { useAccount } from '@/components/go/AccountContext';
import { Disclaimer, Gate, PageHead, Panel, Status, usd } from '@/components/go/ui';
import { IconArrow } from '@/components/go/Icons';
import { VESSELS } from '@/data/go/vessels';
import { COMPANY_BY_ID } from '@/data/go/companies';
import { findBenchmark } from '@/data/go/market';
import { PROJECTS } from '@/data/go/projects';
import { contractsExpiringWithin } from '@/data/go/graph';

/** The offshore charter cycle, start to end — how GO AI reaches an answer. */
const CYCLE = [
  { verb: 'Source', module: 'GO Fleet', note: 'Search the fleet by type, region and availability', href: '/go/fleet' },
  { verb: 'Vet', module: 'GO Companies', note: 'Ownership, management tier and counterparty risk', href: '/go/companies' },
  { verb: 'Benchmark', module: 'GO Market', note: 'Live day-rate benchmarks by region and vessel type', href: '/go/market' },
  { verb: 'Fix', module: 'GO Contracts', note: 'Draft terms, reference prior charter history', href: '/go/contracts' },
  { verb: 'Track', module: 'GO Maps', note: 'Real-time AIS position once on charter', href: '/go/maps' },
  { verb: 'Monitor', module: 'GO Alerts', note: 'Renewal dates, off-hire events, milestones', href: '/go/alerts' },
  { verb: 'Close', module: 'GO Projects', note: 'Log completion, update charter history', href: '/go/projects' },
];

type Answer = {
  headline: string;
  findings: { label: string; body: string; href?: string }[];
  modules: string[];
};

const PRESETS: { q: string; a: Answer }[] = [
  {
    q: 'Find available medium PSVs in the Middle East Gulf for a 6-month charter from March, benchmark the rate, and flag counterparty risk.',
    a: {
      headline: '3 medium PSVs available in the Safaniya Field vicinity within 72 hours.',
      findings: [
        {
          label: 'Availability · GO Fleet',
          body: 'Gulf Pioneer (Meridian Offshore) is off-hire at Safaniya and available immediately. Two further medium PSVs come free inside 72 hours as their current fixtures roll off.',
          href: '/go/fleet/9612847',
        },
        {
          label: 'Benchmark · GO Market',
          body: '$12,000–$18,000/day, medium PSV, Middle East Gulf — indicative term rate. A 6-month term at the midpoint prices the charter at roughly $2.7M.',
          href: '/go/market',
        },
        {
          label: 'Counterparty · GO Companies',
          body: 'Meridian Offshore: 31 registered vessels, 7-tier ownership chain verified, no adverse ownership flags. Charter history with Saudi Aramco, KOC and ADNOC Offshore since 2022.',
          href: '/go/companies/meridian-offshore',
        },
      ],
      modules: ['GO Fleet', 'GO Market', 'GO Companies'],
    },
  },
  {
    q: 'What is rolling off in the next 90 days and where am I exposed below benchmark?',
    a: {
      headline: 'Renewal exposure is concentrated in AHTS tonnage, and several fixtures sit materially below benchmark.',
      findings: [
        {
          label: 'Exposure · GO Contracts',
          body: 'Charters expiring inside 90 days are led by GO Endeavour (Saudi Aramco, Safaniya) at 18 days, fixed materially under the Medium AHTS benchmark for the basin — a legacy rate that has not been repriced since 2025.',
          href: '/go/contracts',
        },
        {
          label: 'Repricing headroom · GO Market',
          body: 'The AHTS midpoint for the Middle East Gulf has moved up over twelve months. Renewing at benchmark rather than rolling the existing rate recovers the gap on each vessel.',
          href: '/go/market',
        },
        {
          label: 'Demand cover · GO Projects',
          body: 'Open tenders in the basin define vessel scope that matches this tonnage — a credible alternative home if the incumbent charterer will not move on rate.',
          href: '/go/projects',
        },
      ],
      modules: ['GO Contracts', 'GO Market', 'GO Projects'],
    },
  },
  {
    q: 'Which tenders in the Gulf match my fleet, and what would a winning bid look like?',
    a: {
      headline: 'Open tenders in the Middle East Gulf define OSV scope your fleet can cover.',
      findings: [
        {
          label: 'Pipeline · GO Projects',
          body: 'Bul Hanine Redevelopment (QatarEnergy) and Hail & Ghasha Sour Gas (ADNOC Offshore) are both at tender with defined PSV and AHTS scope.',
          href: '/go/projects',
        },
        {
          label: 'Tonnage match · GO Fleet',
          body: 'Filter the fleet to medium and large PSV/AHTS coming off hire before the tender close dates — those are the units you can commit without breaking an existing fixture.',
          href: '/go/fleet',
        },
        {
          label: 'Pricing the bid · GO Market',
          body: 'Bid at or just inside the benchmark band for the class. Prior awards on comparable scope in this basin cluster around the midpoint rather than the low.',
          href: '/go/market',
        },
      ],
      modules: ['GO Projects', 'GO Fleet', 'GO Market'],
    },
  },
];

export default function Ai() {
  const { can } = useAccount();
  const [q, setQ] = useState(PRESETS[0].q);
  const [asked, setAsked] = useState(PRESETS[0].q);

  const answer = useMemo(() => {
    const hit = PRESETS.find((p) => p.q === asked);
    if (hit) return hit.a;
    // Anything off-script still resolves against the live graph rather than
    // returning nothing — this is the shape a real answer takes.
    const available = VESSELS.filter((v) => v.status === 'Off hire' || v.status === 'Standby').slice(0, 3);
    const bm = findBenchmark('Middle East Gulf', 'PSV', 'Medium');
    return {
      headline: `${available.length} vessels in the graph are available or on standby against that request.`,
      findings: [
        {
          label: 'Availability · GO Fleet',
          body: available.map((v) => `${v.name} (${v.subType}, ${COMPANY_BY_ID.get(v.ownerId)?.name})`).join('; ') || 'No idle tonnage matched.',
          href: '/go/fleet',
        },
        {
          label: 'Benchmark · GO Market',
          body: bm
            ? `Reference band $${bm.low.toLocaleString()}–$${bm.high.toLocaleString()}/day for the closest published class.`
            : 'No published benchmark for that class yet.',
          href: '/go/market',
        },
        {
          label: 'Demand · GO Projects',
          body: `${PROJECTS.filter((p) => p.phase === 'Tender').length} open tenders and ${contractsExpiringWithin(90).length} charters rolling off inside 90 days set the near-term demand picture.`,
          href: '/go/projects',
        },
      ],
      modules: ['GO Fleet', 'GO Market', 'GO Projects'],
    } satisfies Answer;
  }, [asked]);

  if (!can('ai')) {
    return (
      <AppShell title="GO AI">
        <Gate feature="GO AI" upgradeTo="NOC & EPC Contractor" />
      </AppShell>
    );
  }

  return (
    <AppShell title="GO AI" wide>
      <PageHead
        eyebrow="Analysis · GO AI"
        title="GO AI — your commercial agent"
        lede="One query, one answer — drawn from every core module, start to end of the charter cycle. AI explains; people decide."
      />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setAsked(q);
        }}
        style={{ marginBottom: 14 }}
      >
        <div className="go-ai-query">
          <textarea
            value={q}
            onChange={(e) => setQ(e.target.value)}
            rows={2}
            aria-label="Ask GO AI"
            style={{
              width: '100%',
              background: 'transparent',
              border: 0,
              color: 'var(--text)',
              font: 'inherit',
              resize: 'vertical',
              outline: 'none',
            }}
          />
          <div style={{ display: 'flex', gap: 9, marginTop: 12, flexWrap: 'wrap' }}>
            <button type="submit" className="go-btn primary">
              Ask GO AI <IconArrow />
            </button>
            {PRESETS.map((p, i) => (
              <button
                key={i}
                type="button"
                className="go-btn sm ghost"
                onClick={() => {
                  setQ(p.q);
                  setAsked(p.q);
                }}
              >
                Example {i + 1}
              </button>
            ))}
          </div>
        </div>
      </form>

      <div style={{ marginBottom: 14 }}>
        <Panel title="GO AI RESPONSE — SYNTHESISED ACROSS MODULES" note={answer.modules.join(' · ')}>
          <div className="go-ai-answer">
            <p style={{ fontSize: 15.5, color: 'var(--text)', lineHeight: 1.5 }}>{answer.headline}</p>
            {answer.findings.map((f, i) => (
              <div className="go-ai-step" key={f.label}>
                <span className="go-ai-stepnum">{i + 1}</span>
                <div>
                  <div className="eyebrow" style={{ color: 'var(--acc)' }}>{f.label}</div>
                  <p style={{ fontSize: 13.5, color: 'var(--text-2)', marginTop: 6 }}>{f.body}</p>
                  {f.href && (
                    <Link href={f.href} className="go-link" style={{ fontSize: 12.5, display: 'inline-block', marginTop: 8 }}>
                      Open the source module →
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
          <p className="go-note" style={{ marginTop: 14 }}>
            Every claim above resolves to a record in the graph with its own source and confidence score.
            GO AI never asserts a rate or an owner it cannot trace.
          </p>
        </Panel>
      </div>

      <div style={{ marginBottom: 14 }}>
        <Panel title="HOW GO AI GETS THERE — THE OFFSHORE CHARTER CYCLE">
          <div className="go-cycle">
            {CYCLE.map((s) => (
              <Link href={s.href} className="go-cycle-step" key={s.verb}>
                <div className="go-cycle-verb">{s.verb}</div>
                <div className="go-cycle-mod">{s.module}</div>
                <div className="go-cycle-note">{s.note}</div>
              </Link>
            ))}
          </div>
        </Panel>
      </div>

      <div className="go-grid c3">
        <Panel title="AVAILABLE NOW" note="off hire or standby">
          {VESSELS.filter((v) => v.status === 'Off hire' || v.status === 'Standby')
            .slice(0, 5)
            .map((v) => (
              <div key={v.imo} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderBottom: '1px solid var(--line)' }}>
                <Link href={`/go/fleet/${v.imo}`} className="go-link" style={{ fontSize: 13 }}>
                  {v.name}
                </Link>
                <span style={{ marginLeft: 'auto' }}>
                  <Status value={v.status} />
                </span>
              </div>
            ))}
        </Panel>
        <Panel title="DEMAND SIGNALS" note="open tenders">
          {PROJECTS.filter((p) => p.phase === 'Tender').map((p) => (
            <div key={p.id} style={{ padding: '7px 0', borderBottom: '1px solid var(--line)' }}>
              <div style={{ fontSize: 13, color: 'var(--text)' }}>{p.name}</div>
              <div style={{ fontSize: 11.5, color: 'var(--text-3)', marginTop: 3 }}>
                {p.operator} · {p.vesselsNeeded} vessels · {usd(p.capexUsd)}
              </div>
            </div>
          ))}
        </Panel>
        <Panel title="WHAT GO AI WILL NOT DO">
          <ul style={{ margin: 0, paddingLeft: 18, display: 'grid', gap: 9, fontSize: 12.5, color: 'var(--text-2)', lineHeight: 1.55 }}>
            <li>Assert a rate or an owner without a traceable source record.</li>
            <li>Fill a gap in the graph with a plausible-sounding estimate.</li>
            <li>Fix, bid or commit on your behalf — it prepares the decision, you make it.</li>
            <li>Return data from outside your account&apos;s entitled scope.</li>
          </ul>
        </Panel>
      </div>

      <div style={{ marginTop: 14 }}>
        <Disclaimer>
          Illustrative sample query and response — for concept demonstration only.
        </Disclaimer>
      </div>
    </AppShell>
  );
}
