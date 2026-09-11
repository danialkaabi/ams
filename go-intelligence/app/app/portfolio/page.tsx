import type { Metadata } from 'next';
import Link from 'next/link';
import PageHead from '@/components/app/PageHead';
import Panel from '@/components/ui/Panel';
import EmptyState from '@/components/ui/EmptyState';
import Badge, { statusTone } from '@/components/ui/Badge';
import { IconPortfolio, IconPlus } from '@/components/ui/Icons';
import { PORTFOLIOS } from '@/data/portfolio';
import { getVessel } from '@/data/vessels';
import { orDash } from '@/lib/format';

export const metadata: Metadata = {
  title: 'My Portfolio',
  description: 'Saved vessel watchlists in GO Intelligence.',
};

export default function PortfolioPage() {
  return (
    <>
      <PageHead
        eyebrow="Workspace · My Portfolio"
        title="My Portfolio"
        sub="Saved vessel watchlists — usually the result of a GO Fleet query you want to keep an eye on."
        actions={
          <Link href="/app/fleet" className="btn btn--primary btn--sm">
            <IconPlus size={14} />
            Build a query
          </Link>
        }
      />

      {PORTFOLIOS.length === 0 ? (
        <Panel>
          <EmptyState
            icon={<IconPortfolio size={22} />}
            title="No portfolios saved"
            body="Run a query in GO Fleet — vessel type, size class, region, days in zone — then save the result set as a portfolio. It stays live: as vessels move in and out of the criteria, the portfolio follows."
            file="data/portfolio.ts"
            primaryHref="/app/fleet"
            primaryLabel="Open GO Fleet"
            fields={['id', 'name', 'entries', 'savedQuery']}
          />
        </Panel>
      ) : (
        <div className="stack g16">
          {PORTFOLIOS.map((p) => (
            <Panel
              key={p.id}
              title={p.name}
              action={<Badge tone="blue">{p.entries.length} vessels</Badge>}
            >
              {p.entries.length === 0 ? (
                <div className="panel-body">
                  <p className="muted" style={{ fontSize: 13 }}>
                    This portfolio has no vessels in it yet.
                  </p>
                </div>
              ) : (
                <div className="table-scroll">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Vessel</th>
                        <th>IMO</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th>Note</th>
                      </tr>
                    </thead>
                    <tbody>
                      {p.entries.map((e) => {
                        const v = getVessel(e.vesselImo);
                        return (
                          <tr key={e.vesselImo}>
                            <td className="td-strong">
                              <Link href={`/app/fleet/${e.vesselImo}`}>
                                {v?.name ?? `IMO ${e.vesselImo}`}
                              </Link>
                            </td>
                            <td className="mono">{e.vesselImo}</td>
                            <td>{orDash(v?.subType)}</td>
                            <td>
                              {v ? (
                                <Badge tone={statusTone(v.status)} dot>
                                  {v.status}
                                </Badge>
                              ) : (
                                <span className="muted">Not in database</span>
                              )}
                            </td>
                            <td>{orDash(e.note)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </Panel>
          ))}
        </div>
      )}
    </>
  );
}
