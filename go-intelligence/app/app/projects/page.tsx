import type { Metadata } from 'next';
import PageHead from '@/components/app/PageHead';
import Panel from '@/components/ui/Panel';
import StatTile from '@/components/ui/StatTile';
import EmptyState from '@/components/ui/EmptyState';
import Badge, { statusTone } from '@/components/ui/Badge';
import { IconDownload, IconProjects } from '@/components/ui/Icons';
import { PROJECTS } from '@/data/projects';
import { PHASE_DESCRIPTIONS, PROJECT_PHASES } from '@/lib/taxonomy';
import { num, orDash, usdCompact } from '@/lib/format';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'GO Projects — field developments, EPC awards and the tender pipeline.',
};

export default function ProjectsPage() {
  const openTenders = PROJECTS.filter((p) => p.phase === 'Tender').length;
  const capex = PROJECTS.reduce((sum, p) => sum + (p.capex ?? 0), 0);
  const demand = PROJECTS.reduce((sum, p) => sum + (p.vesselsNeeded ?? 0), 0);

  return (
    <>
      <PageHead
        eyebrow="Intelligence · GO Projects"
        title="Projects"
        sub="Field developments, EPC awards, tender pipeline and vessel demand forecasts — the demand side of the market."
        actions={
          <button className="btn btn--ghost btn--sm" disabled={PROJECTS.length === 0}>
            <IconDownload size={14} />
            Export to Excel
          </button>
        }
      />

      <div className="grid grid-4" style={{ marginBottom: 16 }}>
        <StatTile
          label="Tracked projects"
          value={PROJECTS.length === 0 ? '—' : PROJECTS.length}
          empty={PROJECTS.length === 0}
        />
        <StatTile
          label="Open tenders"
          value={PROJECTS.length === 0 ? '—' : openTenders}
          empty={PROJECTS.length === 0}
          accent="amber"
        />
        <StatTile
          label="Combined CAPEX"
          value={capex === 0 ? '—' : usdCompact(capex)}
          empty={capex === 0}
          accent="gold"
        />
        <StatTile
          label="Forecast vessel demand"
          value={demand === 0 ? '—' : num(demand)}
          empty={demand === 0}
          accent="green"
        />
      </div>

      <Panel title="Project pipeline · by phase" style={{ marginBottom: 16 }}>
        <div className="panel-body">
          <div className="phases">
            {PROJECT_PHASES.map((phase) => {
              const count = PROJECTS.filter((p) => p.phase === phase).length;
              return (
                <div className="phase" key={phase}>
                  <div className="phase-name">{phase}</div>
                  <div
                    className="phase-count"
                    style={{ color: PROJECTS.length === 0 ? 'var(--text-5)' : 'var(--text)' }}
                  >
                    {PROJECTS.length === 0 ? '—' : count}
                  </div>
                  <div className="phase-desc">{PHASE_DESCRIPTIONS[phase]}</div>
                </div>
              );
            })}
          </div>
        </div>
      </Panel>

      <Panel
        title="Active projects"
        action={
          <span className="mono" style={{ fontSize: 11, color: 'var(--text-5)' }}>
            Vessel demand shown per project
          </span>
        }
      >
        {PROJECTS.length === 0 ? (
          <EmptyState
            icon={<IconProjects size={22} />}
            title="No projects recorded yet"
            body="Projects are the demand side of the market — where vessel requirements come from before they become fixtures. Record field developments, EPC awards and tenders and the phase pipeline, CAPEX total and demand forecast all calculate from them."
            file="data/projects.ts"
            fields={[
              'id',
              'name',
              'operator',
              'region',
              'phase',
              'capex',
              'vesselsNeeded',
              'field',
              'epcContractor',
              'tenderCloseDate',
            ]}
          />
        ) : (
          <div className="table-scroll">
            <table className="table">
              <thead>
                <tr>
                  <th>Project / field</th>
                  <th>Operator</th>
                  <th>Region</th>
                  <th className="th-num">CAPEX</th>
                  <th className="th-num">Vessels needed</th>
                  <th>Phase</th>
                </tr>
              </thead>
              <tbody>
                {PROJECTS.map((p) => (
                  <tr key={p.id}>
                    <td className="td-strong">{p.name}</td>
                    <td>{p.operator}</td>
                    <td>{p.region}</td>
                    <td className="td-num">{usdCompact(p.capex)}</td>
                    <td className="td-num">{orDash(p.vesselsNeeded)}</td>
                    <td>
                      <Badge tone={statusTone(p.phase)} dot>
                        {p.phase}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </>
  );
}
