import type { Metadata } from 'next';
import Link from 'next/link';
import PageHead from '@/components/app/PageHead';
import Panel from '@/components/ui/Panel';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import { IconCompanies, IconContracts } from '@/components/ui/Icons';
import { COMPANIES, getCompany } from '@/data/companies';
import { VESSELS } from '@/data/vessels';
import { MANAGEMENT_TIERS } from '@/lib/taxonomy';
import { orDash, pct } from '@/lib/format';

export const metadata: Metadata = { title: 'Company profile' };

export function generateStaticParams() {
  return COMPANIES.map((c) => ({ id: c.id }));
}

function Spec({ k, v }: { k: string; v?: string | number | null }) {
  const missing = v === undefined || v === null || v === '';
  return (
    <div className="spec">
      <div className="spec-k">{k}</div>
      <div className={`spec-v${missing ? ' spec-v--empty' : ''}`}>
        {missing ? 'Not recorded' : v}
      </div>
    </div>
  );
}

export default function CompanyProfilePage({ params }: { params: { id: string } }) {
  const company = getCompany(params.id);

  if (!company) {
    return (
      <>
        <PageHead
          eyebrow="Intelligence · GO Companies"
          title="Company profile"
          actions={
            <Link href="/app/companies" className="btn btn--ghost btn--sm">
              Back to Companies
            </Link>
          }
        />
        <Panel>
          <EmptyState
            icon={<IconCompanies size={22} />}
            title={`No company recorded under “${params.id}”`}
            body="This is the company profile layout: headquarters and founding detail, vessels by role across all seven management tiers, regional presence with utilisation, the fleet list and company-level charter history."
            file="data/companies.ts"
            primaryHref="/app/companies"
            primaryLabel="Back to Companies"
            fields={['id', 'name', 'type', 'headquarters', 'founded', 'fleetSize', 'tierCounts', 'regionalPresence', 'charterHistory']}
          />
        </Panel>
      </>
    );
  }

  const fleet = VESSELS.filter(
    (v) =>
      v.registeredOwnerId === company.id ||
      v.beneficialOwnerId === company.id ||
      v.operatorId === company.id,
  );

  return (
    <>
      <PageHead
        eyebrow="Intelligence · GO Companies"
        title={company.name}
        actions={
          <Link href="/app/companies" className="btn btn--quiet btn--sm">
            Back to Companies
          </Link>
        }
      />

      <div className="row g10 wrapflex" style={{ marginBottom: 18 }}>
        <Badge tone="blue">{company.type}</Badge>
        {company.country && <Badge tone="grey">Registered in {company.country}</Badge>}
        {company.founded && <Badge tone="gold">Est. {company.founded}</Badge>}
      </div>

      <Panel title="Profile" style={{ marginBottom: 16 }}>
        <div className="spec-grid">
          <Spec k="Headquarters" v={company.headquarters} />
          <Spec k="Founded" v={company.founded} />
          <Spec k="Fleet size" v={company.fleetSize ? `${company.fleetSize} vessels` : undefined} />
          <Spec k="Operating regions" v={company.operatingRegions?.join(', ')} />
          <Spec k="Website" v={company.website} />
          <Spec k="Employees" v={company.employees} />
        </div>
      </Panel>

      <Panel title="Management structure · vessels by role" style={{ marginBottom: 16 }}>
        <div className="panel-body">
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(146px, 1fr))', gap: 12 }}>
            {MANAGEMENT_TIERS.map((tier) => {
              const count = company.tierCounts?.[tier];
              return (
                <div className="well" key={tier}>
                  <div
                    className="num"
                    style={{ fontSize: 24, color: count === undefined ? 'var(--text-5)' : 'var(--text)' }}
                  >
                    {count ?? '—'}
                  </div>
                  <div style={{ fontSize: 11.5, color: 'var(--text-4)', marginTop: 6, lineHeight: 1.45 }}>
                    {tier}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Panel>

      <div className="grid grid-2" style={{ marginBottom: 16 }}>
        <Panel title="Regional presence">
          <div className="panel-body">
            {!company.regionalPresence || company.regionalPresence.length === 0 ? (
              <p className="muted" style={{ fontSize: 13 }}>
                No regional presence recorded.
              </p>
            ) : (
              <div className="stack g16">
                {company.regionalPresence.map((r) => (
                  <div className="meter-row" key={r.region}>
                    <div className="meter-head">
                      <span className="meter-label">{r.region}</span>
                      <span className="meter-val">
                        {r.vesselCount} vsl · {pct(r.utilisationPct)}
                      </span>
                    </div>
                    <div className="meter">
                      <div
                        className="meter-fill"
                        style={{ width: `${Math.min(100, r.utilisationPct ?? 0)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Panel>

        <Panel title={`Fleet list${fleet.length ? ` · ${fleet.length}` : ''}`}>
          {fleet.length === 0 ? (
            <div className="panel-body">
              <p className="muted" style={{ fontSize: 13 }}>
                No vessels in the database reference this company. Set{' '}
                <span className="mono">registeredOwnerId</span> on a vessel to{' '}
                <span className="mono">&quot;{company.id}&quot;</span> and it appears here.
              </p>
            </div>
          ) : (
            <div className="table-scroll">
              <table className="table">
                <thead>
                  <tr>
                    <th>Vessel</th>
                    <th>Type</th>
                    <th>Region</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {fleet.map((v) => (
                    <tr key={v.imo}>
                      <td className="td-strong">
                        <Link href={`/app/fleet/${v.imo}`}>{v.name}</Link>
                      </td>
                      <td>{v.subType}</td>
                      <td>{orDash(v.region)}</td>
                      <td>{v.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Panel>
      </div>

      <Panel title="Charter history · company level">
        {!company.charterHistory || company.charterHistory.length === 0 ? (
          <EmptyState
            icon={<IconContracts size={22} />}
            title="No charter history recorded"
            body="Every GO Companies profile carries this section: which charterers this company has worked with, how many vessels, over what period, and the nature of the agreement."
            file="data/companies.ts"
            fields={['charterer', 'vessels', 'period', 'natureOfAgreement']}
          />
        ) : (
          <div className="table-scroll">
            <table className="table">
              <thead>
                <tr>
                  <th>Charterer</th>
                  <th>Vessels</th>
                  <th>Period</th>
                  <th>Nature of agreement</th>
                </tr>
              </thead>
              <tbody>
                {company.charterHistory.map((h, i) => (
                  <tr key={`${h.charterer}-${i}`}>
                    <td className="td-strong">{h.charterer}</td>
                    <td>{h.vessels}</td>
                    <td>{h.period}</td>
                    <td>{h.natureOfAgreement}</td>
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
