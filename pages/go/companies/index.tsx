import Link from 'next/link';
import { useMemo, useState } from 'react';
import AppShell from '@/components/go/AppShell';
import { useAccount } from '@/components/go/AccountContext';
import { Confidence, Empty, Gate, PageHead, Panel, StatTile } from '@/components/go/ui';
import { IconExport } from '@/components/go/Icons';
import { COMPANIES } from '@/data/go/companies';
import type { CompanyRole } from '@/data/go/types';

const ROLES: CompanyRole[] = [
  'OSV Owner / Operator', 'NOC', 'IOC', 'EPC Contractor',
  'Drilling Contractor', 'Financier / Lessor', 'Port & Terminal Operator',
];

export default function Companies() {
  const { can, plan } = useAccount();
  const [role, setRole] = useState<CompanyRole | ''>('');
  const [q, setQ] = useState('');

  const rows = useMemo(
    () =>
      COMPANIES.filter(
        (c) =>
          (!role || c.role === role) &&
          (!q || c.name.toLowerCase().includes(q.toLowerCase()) || c.country.toLowerCase().includes(q.toLowerCase())),
      ),
    [role, q],
  );

  if (!can('companies')) {
    return (
      <AppShell title="Companies">
        <Gate feature="GO Companies" upgradeTo="NOC & EPC Contractor" />
      </AppShell>
    );
  }

  const owners = COMPANIES.filter((c) => c.role === 'OSV Owner / Operator');

  return (
    <AppShell title="Companies" wide>
      <PageHead
        eyebrow="Intelligence · GO Companies"
        title="GO Companies"
        lede="Owners, operators, charterers and financiers — with the seven-tier management chain and charter history behind each one. This is the counterparty layer."
      />

      <div className="go-grid c4" style={{ marginBottom: 14 }}>
        <StatTile value={COMPANIES.length} label="Companies in scope" />
        <StatTile value={owners.length} label="OSV owners / operators" tone="accent-2" />
        <StatTile value={owners.reduce((s, c) => s + c.fleetSize, 0).toLocaleString()} label="Vessels under mapped ownership" />
        <StatTile
          value={COMPANIES.filter((c) => c.riskFlags.length > 0).length}
          label="Counterparties carrying flags"
          tone="warn"
        />
      </div>

      <Panel
        title="COMPANY DIRECTORY"
        actions={
          <>
            <input
              className="go-input"
              style={{ width: 200 }}
              placeholder="Search company or country"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              aria-label="Search companies"
            />
            <select className="go-select" style={{ width: 190 }} value={role} onChange={(e) => setRole(e.target.value as CompanyRole | '')} aria-label="Filter by role">
              <option value="">All roles</option>
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <button className="go-btn sm" disabled={!can('export')} title={can('export') ? undefined : `Excel export is not included on the ${plan.name} account`}>
              <IconExport /> Export
            </button>
          </>
        }
        flush
      >
        <div className="go-tablewrap">
          <table className="go-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Role</th>
                <th>Country</th>
                <th>Founded</th>
                <th>Fleet</th>
                <th>Chain depth</th>
                <th>Regions</th>
                <th>Flags</th>
                <th>Confidence</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.id}>
                  <td>
                    <Link href={`/go/companies/${c.id}`} className="go-link">
                      {c.name}
                    </Link>
                  </td>
                  <td>{c.role}</td>
                  <td>{c.country}</td>
                  <td className="num">{c.founded}</td>
                  <td className="num">{c.fleetSize || '—'}</td>
                  <td className="num">{c.ownershipChainDepth} tiers</td>
                  <td style={{ fontSize: 12 }}>{c.operatingRegions.length}</td>
                  <td>
                    {c.riskFlags.length ? (
                      <span className="go-pill warn" title={c.riskFlags.join(' · ')}>
                        <span className="go-dot" />
                        {c.riskFlags.length}
                      </span>
                    ) : (
                      <span className="go-pill ok">
                        <span className="go-dot" />
                        Clear
                      </span>
                    )}
                  </td>
                  <td>
                    <Confidence p={c.provenance} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length === 0 && <Empty>No companies match that search.</Empty>}
        </div>
      </Panel>
    </AppShell>
  );
}
