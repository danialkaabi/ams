import Link from 'next/link';
import { useMemo, useState } from 'react';
import AppShell from '@/components/go/AppShell';
import { useAccount } from '@/components/go/AccountContext';
import {
  Confidence, Disclaimer, Empty, Gate, PageHead, Panel, StatTile, Status,
  dateLabel, usd,
} from '@/components/go/ui';
import { IconExport } from '@/components/go/Icons';
import { PROJECTS, COMBINED_CAPEX, FORECAST_VESSEL_DEMAND, OPEN_TENDERS } from '@/data/go/projects';
import { PROJECT_PHASES } from '@/data/go/types';
import type { ProjectPhase } from '@/data/go/types';

export default function Projects() {
  const { can, plan } = useAccount();
  const [phase, setPhase] = useState<ProjectPhase | ''>('');

  const rows = useMemo(() => PROJECTS.filter((p) => !phase || p.phase === phase), [phase]);

  if (!can('projects')) {
    return (
      <AppShell title="Projects">
        <Gate feature="GO Projects" upgradeTo="NOC & EPC Contractor" />
      </AppShell>
    );
  }

  return (
    <AppShell title="Projects" wide>
      <PageHead
        eyebrow="Intelligence · GO Projects"
        title="GO Projects"
        lede="Field developments, EPC awards, tender pipeline and vessel demand forecasts — the demand side of the market."
      />

      <div className="go-grid c4" style={{ marginBottom: 14 }}>
        <StatTile value={PROJECTS.length} label="Tracked projects" />
        <StatTile value={OPEN_TENDERS} label="Open tenders" tone="accent-2" />
        <StatTile value={usd(COMBINED_CAPEX)} label="Combined CAPEX" />
        <StatTile value={FORECAST_VESSEL_DEMAND} label="Forecast vessel demand" tone="warn" />
      </div>

      <div style={{ marginBottom: 14 }}>
        <Panel title="PROJECT PIPELINE · BY PHASE" note="click a phase to filter">
          <div className="go-phases">
            {PROJECT_PHASES.map((p) => {
              const count = PROJECTS.filter((x) => x.phase === p.key).length;
              const on = phase === p.key;
              return (
                <button
                  key={p.key}
                  className="go-phase"
                  onClick={() => setPhase(on ? '' : p.key)}
                  style={{
                    textAlign: 'left',
                    cursor: 'pointer',
                    borderColor: on ? 'var(--acc)' : undefined,
                    background: on ? 'var(--acc-dim)' : undefined,
                  }}
                >
                  <div className="go-phase-count">{count}</div>
                  <div className="go-phase-name">{p.key}</div>
                  <div className="go-phase-blurb">{p.blurb}</div>
                </button>
              );
            })}
          </div>
        </Panel>
      </div>

      <Panel
        title="ACTIVE PROJECTS"
        note="vessel demand forecast shown per project"
        actions={
          <button className="go-btn sm" disabled={!can('export')} title={can('export') ? undefined : `Excel export is not included on the ${plan.name} account`}>
            <IconExport /> Export
          </button>
        }
        flush
      >
        <div className="go-tablewrap">
          <table className="go-table">
            <thead>
              <tr>
                <th>Project / Field</th>
                <th>Operator</th>
                <th>Region</th>
                <th>CAPEX</th>
                <th>Vessels needed</th>
                <th>EPC / tender</th>
                <th>Phase</th>
                <th>Confidence</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id} id={p.id}>
                  <td>
                    <strong>{p.name}</strong>
                    <div style={{ fontSize: 11.5, color: 'var(--text-3)', marginTop: 3 }}>{p.field}</div>
                  </td>
                  <td>
                    <Link href={`/go/companies/${p.operatorId}`} className="go-link">
                      {p.operator}
                    </Link>
                  </td>
                  <td>{p.region}</td>
                  <td className="num">{usd(p.capexUsd)}</td>
                  <td className="num">
                    {p.vesselsNeeded}
                    <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 3 }}>{p.vesselTypes.join(' · ')}</div>
                  </td>
                  <td style={{ fontSize: 12.5 }}>
                    {p.phase === 'Tender'
                      ? p.tenderCloses
                        ? `Closes ${dateLabel(p.tenderCloses)}`
                        : 'Bids open'
                      : p.epcContractor ?? '—'}
                  </td>
                  <td>
                    <Status value={p.phase} />
                  </td>
                  <td>
                    <Confidence p={p.provenance} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length === 0 && <Empty>No projects in that phase.</Empty>}
        </div>
      </Panel>

      <div style={{ marginTop: 14 }}>
        <Panel title="TENDER PIPELINE · BID SUPPORT" note="track opportunities and build the vessel case inside the platform">
          <div className="go-grid c2">
            {PROJECTS.filter((p) => p.phase === 'Tender').map((p) => (
              <div key={p.id} style={{ border: '1px solid var(--line)', borderRadius: 10, padding: 14, background: 'var(--panel-2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <strong style={{ color: 'var(--text)', fontSize: 13.5 }}>{p.name}</strong>
                  <span className="go-pill acc2" style={{ marginLeft: 'auto' }}>
                    {p.tenderCloses ? `Closes ${dateLabel(p.tenderCloses)}` : 'Open'}
                  </span>
                </div>
                <p style={{ fontSize: 12.5, color: 'var(--text-2)', marginTop: 9 }}>
                  {p.operator} · {usd(p.capexUsd)} CAPEX · vessel scope {p.vesselsNeeded} units ({p.vesselTypes.join(', ')}).
                </p>
                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  <Link href="/go/fleet" className="go-btn sm">
                    Match available tonnage
                  </Link>
                  <Link href="/go/market" className="go-btn sm ghost">
                    Benchmark the scope
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div style={{ marginTop: 14 }}>
        <Disclaimer>
          Project CAPEX, phases and vessel-demand forecasts are illustrative for concept demonstration.
          Tender dates should be confirmed against the operator&apos;s official bulletin before bidding.
        </Disclaimer>
      </div>
    </AppShell>
  );
}
