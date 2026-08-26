import Link from 'next/link';
import { useMemo, useState } from 'react';
import AppShell from '@/components/go/AppShell';
import { useAccount } from '@/components/go/AccountContext';
import {
  Confidence, Disclaimer, Empty, Gate, Masked, PageHead, Panel, StatTile, Status,
  dateLabel, rate, usd,
} from '@/components/go/ui';
import { IconExport } from '@/components/go/Icons';
import { CONTRACTS, expiryLabel, daysUntil } from '@/data/go/contracts';
import { renewalExposure, contractsExpiringWithin, overdueRenewals } from '@/data/go/graph';
import { canSeeCommercialDetail } from '@/data/go/accounts';
import type { ContractStatus } from '@/data/go/types';

const STATUSES: ContractStatus[] = ['On Hire', 'Expiring Soon', 'Renewal Due', 'Overdue Renewal', 'Off Hire'];

export default function Contracts() {
  const { account, can, plan } = useAccount();
  const [status, setStatus] = useState<ContractStatus | ''>('');
  const [sort, setSort] = useState<'expiry' | 'variance' | 'value'>('expiry');

  const rows = useMemo(() => {
    const filtered = CONTRACTS.filter((c) => !status || c.status === status);
    return filtered.slice().sort((a, b) => {
      if (sort === 'expiry') return daysUntil(a.expiryDate) - daysUntil(b.expiryDate);
      if (sort === 'variance') return (a.vsBenchmarkPct ?? 0) - (b.vsBenchmarkPct ?? 0);
      return (b.ratePerDay ?? 0) - (a.ratePerDay ?? 0);
    });
  }, [status, sort]);

  if (!can('contracts')) {
    return (
      <AppShell title="Contracts">
        <Gate feature="GO Contracts" upgradeTo="NOC & EPC Contractor" />
      </AppShell>
    );
  }

  const active = CONTRACTS.filter((c) => c.status !== 'Off Hire');
  const acv = CONTRACTS.filter((c) => c.ratePerDay).reduce((s, c) => s + (c.ratePerDay ?? 0) * 365, 0);
  const exposure = renewalExposure();
  const maxBucket = Math.max(...exposure.map((e) => e.count), 1);

  return (
    <AppShell title="Contracts" wide>
      <PageHead
        eyebrow="Intelligence · GO Contracts"
        title="GO Contracts"
        lede="Live charter book with expiry countdowns, rate-vs-benchmark variance and renewal exposure — so nothing rolls off unnoticed."
      />

      <div className="go-grid c4" style={{ marginBottom: 14 }}>
        <StatTile value={active.length} label="Active charters" />
        <StatTile value={contractsExpiringWithin(90).length} label="Expiring < 90 days" tone="warn" />
        <StatTile value={overdueRenewals().length} label="Overdue renewal" tone="bad" />
        <StatTile value={usd(acv)} label="Annualised contract value" tone="accent-2" />
      </div>

      <Panel
        title="CHARTER BOOK · LIVE"
        note={`sorted by ${sort === 'expiry' ? 'expiry' : sort === 'variance' ? 'benchmark variance' : 'day rate'}`}
        actions={
          <>
            <select className="go-select" style={{ width: 160 }} value={status} onChange={(e) => setStatus(e.target.value as ContractStatus | '')} aria-label="Filter by status">
              <option value="">All statuses</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <select className="go-select" style={{ width: 170 }} value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} aria-label="Sort by">
              <option value="expiry">Sort by expiry</option>
              <option value="variance">Sort by variance</option>
              <option value="value">Sort by day rate</option>
            </select>
            <button className="go-btn sm" disabled={!can('export')} title={can('export') ? undefined : `Excel export is not included on the ${plan.name} account`}>
              <IconExport /> Export to Excel
            </button>
          </>
        }
        flush
      >
        <div className="go-tablewrap" style={{ maxHeight: 600, overflowY: 'auto' }}>
          <table className="go-table">
            <thead>
              <tr>
                <th>Vessel</th>
                <th>Type</th>
                <th>Charterer</th>
                <th>Rate/day</th>
                <th>vs benchmark</th>
                <th>Expires in</th>
                <th>Status</th>
                <th>Confidence</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => {
                const visible = canSeeCommercialDetail(account, c.ownerId);
                return (
                  <tr key={c.id}>
                    <td>
                      <Link href={`/go/fleet/${c.vesselImo}`} className="go-link">
                        {c.vesselName}
                      </Link>
                    </td>
                    <td>
                      {c.subType} <span style={{ color: 'var(--text-3)' }}>({c.sizeClass})</span>
                    </td>
                    <td>{c.charterer}</td>
                    <td className="num" style={{ color: 'var(--text)' }}>
                      {visible ? rate(c.ratePerDay) : <Masked />}
                    </td>
                    <td
                      className="num"
                      style={{ color: c.vsBenchmarkPct == null ? undefined : c.vsBenchmarkPct < 0 ? 'var(--bad)' : 'var(--ok)' }}
                    >
                      {visible && c.vsBenchmarkPct != null ? `${c.vsBenchmarkPct > 0 ? '+' : ''}${c.vsBenchmarkPct}%` : '—'}
                    </td>
                    <td className="num" title={dateLabel(c.expiryDate)}>
                      {c.status === 'Off Hire' ? '—' : expiryLabel(c.expiryDate)}
                    </td>
                    <td>
                      <Status value={c.status} />
                    </td>
                    <td>
                      <Confidence p={c.provenance} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {rows.length === 0 && <Empty>No charters match that filter.</Empty>}
        </div>
      </Panel>

      <div style={{ marginTop: 14 }}>
        <Panel title="RENEWAL EXPOSURE · NEXT 12 MONTHS" note="charters rolling off by quarter">
          <div className="go-grid c4">
            {exposure.map((e) => (
              <div key={e.label}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <span className="mono" style={{ fontSize: 11, color: 'var(--text-3)', letterSpacing: '0.14em' }}>
                    {e.label}
                  </span>
                  <span style={{ fontSize: 12.5, color: 'var(--text-2)', marginLeft: 'auto' }}>{e.count} expiring</span>
                </div>
                <div
                  style={{
                    marginTop: 10,
                    height: 84,
                    display: 'flex',
                    alignItems: 'flex-end',
                    background: 'var(--panel-2)',
                    borderRadius: 8,
                    padding: 6,
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      height: `${Math.max(6, (e.count / maxBucket) * 100)}%`,
                      background: e.count >= maxBucket ? 'var(--warn)' : 'var(--acc)',
                      borderRadius: 5,
                      transition: 'height 0.5s var(--ease)',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div style={{ marginTop: 14 }}>
        <Disclaimer>
          Variance is measured against the GO Market benchmark midpoint for the vessel&apos;s class and basin.
          Benchmarks are indicative — confirm with broker quotes before fixing or renewing.
        </Disclaimer>
      </div>
    </AppShell>
  );
}
