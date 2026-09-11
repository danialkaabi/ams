import type { Metadata } from 'next';
import Link from 'next/link';
import PageHead from '@/components/app/PageHead';
import Panel from '@/components/ui/Panel';
import EmptyState from '@/components/ui/EmptyState';
import Badge from '@/components/ui/Badge';
import StatTile from '@/components/ui/StatTile';
import { IconCompanies, IconDownload } from '@/components/ui/Icons';
import { COMPANIES } from '@/data/companies';
import { MANAGEMENT_TIERS } from '@/lib/taxonomy';
import { num, orDash } from '@/lib/format';

export const metadata: Metadata = {
  title: 'Companies',
  description: 'GO Companies — owners, operators and counterparties.',
};

export default function CompaniesPage() {
  const owners = COMPANIES.filter((c) => c.type === 'OSV Owner / Operator').length;
  const totalFleet = COMPANIES.reduce((sum, c) => sum + (c.fleetSize ?? 0), 0);

  return (
    <>
      <PageHead
        eyebrow="Intelligence · GO Companies"
        title="Companies"
        sub="Owners and operators mapped through seven management tiers, with charter history on every profile."
        actions={
          <button className="btn btn--ghost btn--sm" disabled={COMPANIES.length === 0}>
            <IconDownload size={14} />
            Export to Excel
          </button>
        }
      />

      <div className="grid grid-4" style={{ marginBottom: 16 }}>
        <StatTile
          label="Companies"
          value={COMPANIES.length === 0 ? '—' : COMPANIES.length}
          empty={COMPANIES.length === 0}
        />
        <StatTile
          label="Owners / operators"
          value={COMPANIES.length === 0 ? '—' : owners}
          empty={COMPANIES.length === 0}
          accent="gold"
        />
        <StatTile
          label="Vessels represented"
          value={totalFleet === 0 ? '—' : num(totalFleet)}
          empty={totalFleet === 0}
          accent="green"
        />
        <StatTile
          label="Management tiers"
          value={MANAGEMENT_TIERS.length}
          accent="amber"
          foot={<span className="muted">Beneficial owner → ISM manager</span>}
        />
      </div>

      <Panel
        title="Ownership & management tiers"
        style={{ marginBottom: 16 }}
      >
        <div className="panel-body">
          <p style={{ fontSize: 13, color: 'var(--text-4)', marginBottom: 14, maxWidth: '76ch', lineHeight: 1.65 }}>
            Every company profile carries vessel counts at all seven tiers. The
            chain from beneficial owner through ISM manager is the defensible
            layer of the platform — it is what tells you who actually controls a
            vessel, and who you are really contracting with.
          </p>
          <div className="row g8 wrapflex">
            {MANAGEMENT_TIERS.map((t, i) => (
              <span className="pill" key={t}>
                <span className="mono" style={{ fontSize: 10, color: 'var(--blue-400)' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                {t}
              </span>
            ))}
          </div>
        </div>
      </Panel>

      <Panel
        title={
          COMPANIES.length === 0
            ? 'Company directory'
            : `Company directory · ${COMPANIES.length}`
        }
      >
        {COMPANIES.length === 0 ? (
          <EmptyState
            icon={<IconCompanies size={22} />}
            title="No companies recorded yet"
            body="Companies are what vessels hang off. Once recorded, each one gets a profile with vessels by role across the seven management tiers, regional presence, utilisation by basin and company-level charter history."
            file="data/companies.ts"
            fields={[
              'id',
              'name',
              'type',
              'country',
              'headquarters',
              'founded',
              'fleetSize',
              'operatingRegions',
              'tierCounts',
              'charterHistory',
            ]}
          />
        ) : (
          <div className="table-scroll">
            <table className="table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Type</th>
                  <th>Country</th>
                  <th className="th-num">Fleet size</th>
                  <th>Regions</th>
                </tr>
              </thead>
              <tbody>
                {COMPANIES.map((c) => (
                  <tr key={c.id}>
                    <td className="td-strong">
                      <Link href={`/app/companies/${c.id}`} className="link-arrow" style={{ fontSize: 13 }}>
                        {c.name}
                      </Link>
                    </td>
                    <td>
                      <Badge tone="blue">{c.type}</Badge>
                    </td>
                    <td>{orDash(c.country)}</td>
                    <td className="td-num">{orDash(c.fleetSize)}</td>
                    <td>{orDash(c.operatingRegions?.join(', '))}</td>
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
