import Link from 'next/link';
import { GetStaticPaths, GetStaticProps } from 'next';
import AppShell from '@/components/go/AppShell';
import { useAccount } from '@/components/go/AccountContext';
import {
  Confidence, Disclaimer, Empty, Masked, Meter, Panel, SourceLine, Status,
  dateLabel, rate,
} from '@/components/go/ui';
import { COMPANIES } from '@/data/go/companies';
import { OWNERSHIP_TIERS } from '@/data/go/types';
import { companyNode } from '@/data/go/graph';
import { canSeeCommercialDetail } from '@/data/go/accounts';

type Props = { id: string };

export default function CompanyProfile({ id }: Props) {
  const { account } = useAccount();
  const node = companyNode(id);

  if (!node) {
    return (
      <AppShell title="Company">
        <Empty>No company with id {id} in the graph.</Empty>
      </AppShell>
    );
  }

  const { company: c, vessels, contracts, charteredIn, regionalSplit } = node;
  const canSeeRates = canSeeCommercialDetail(account, c.id);

  return (
    <AppShell title={c.name} wide>
      <div style={{ marginBottom: 14 }}>
        <Link href="/go/companies" className="go-link" style={{ fontSize: 12.5, color: 'var(--text-3)' }}>
          ← All companies
        </Link>
      </div>

      <div className="go-profile" style={{ marginBottom: 14 }}>
        <div className="go-profile-top">
          <div style={{ flex: 1, minWidth: 260 }}>
            <span className="eyebrow">Company profile</span>
            <h1 style={{ marginTop: 8 }}>{c.name}</h1>
            <div className="go-profile-sub">
              <span>Registered in {c.country}</span>
              <span className="go-pill acc">{c.role}</span>
              <span className="go-pill">Est. {c.founded}</span>
              <Confidence p={c.provenance} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 9, flexWrap: 'wrap' }}>
            <button className="go-btn sm">Watch counterparty</button>
            <Link href="/go/ai" className="go-btn sm primary">
              Run counterparty check
            </Link>
          </div>
        </div>

        <div className="go-keyfacts">
          <Fact label="Headquarters" value={c.headquarters} />
          <Fact label="Founded" value={String(c.founded)} />
          <Fact label="Fleet size" value={c.fleetSize ? `${c.fleetSize} vessels` : '—'} />
          <Fact label="Operating regions" value={c.operatingRegions.length ? c.operatingRegions.join(', ') : '—'} />
          <Fact label="Ownership chain" value={`${c.ownershipChainDepth} tiers verified`} />
          <Fact label="Website" value={c.website} />
        </div>
      </div>

      {c.riskFlags.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          <Panel title="COUNTERPARTY FLAGS">
            {c.riskFlags.map((f) => (
              <div key={f} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 13, color: 'var(--text-2)' }}>
                <span className="go-pill warn">
                  <span className="go-dot" />
                  Review
                </span>
                <span>{f}</span>
              </div>
            ))}
          </Panel>
        </div>
      )}

      <div style={{ marginBottom: 14 }}>
        <Panel title="MANAGEMENT STRUCTURE · VESSELS BY ROLE" note="the defensible layer — beneficial owner through ISM manager">
          <div className="go-tiers">
            {OWNERSHIP_TIERS.map((t) => (
              <div className="go-tier" key={t.key}>
                <div className="go-tier-count">{c.tierCounts[t.key]}</div>
                <div className="go-tier-label">{t.label}</div>
                <div className="go-tier-note">{t.note}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 14 }}>
            <SourceLine p={c.provenance} />
          </div>
        </Panel>
      </div>

      <div className="go-grid" style={{ gridTemplateColumns: 'minmax(0, 1.3fr) minmax(0, 1fr)', marginBottom: 14 }}>
        <Panel title="FLEET LIST" note={`${vessels.length} in the graph`} flush>
          <div className="go-tablewrap" style={{ maxHeight: 420, overflowY: 'auto' }}>
            <table className="go-table">
              <thead>
                <tr>
                  <th>Vessel</th>
                  <th>Type</th>
                  <th>Region</th>
                  <th>Built</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {vessels.map((v) => (
                  <tr key={v.imo}>
                    <td>
                      <Link href={`/go/fleet/${v.imo}`} className="go-link">
                        {v.name}
                      </Link>
                    </td>
                    <td>
                      {v.subType} <span style={{ color: 'var(--text-3)' }}>({v.sizeClass})</span>
                    </td>
                    <td>{v.region}</td>
                    <td className="num">{v.built}</td>
                    <td>
                      <Status value={v.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {vessels.length === 0 && <Empty>This company charters in rather than owns tonnage.</Empty>}
          </div>
        </Panel>

        <Panel title="REGIONAL OSV UTILISATION" note="basin utilisation vs this fleet's exposure">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
            {regionalSplit.map((r) => (
              <Meter
                key={r.region}
                label={`${r.region} · ${r.count} vsl`}
                value={r.count ? r.utilisationPct : 0}
                tone={r.count === 0 ? undefined : r.utilisationPct >= 85 ? 'ok' : 'two'}
              />
            ))}
          </div>
        </Panel>
      </div>

      <div style={{ marginBottom: 14 }}>
        <Panel title="CHARTER HISTORY · COMPANY LEVEL" note="every GO Companies profile carries this section" flush>
          <div className="go-tablewrap">
            <table className="go-table">
              <thead>
                <tr>
                  <th>Charterer</th>
                  <th>Vessels</th>
                  <th>Period</th>
                  <th>Nature of agreement</th>
                </tr>
              </thead>
              <tbody>
                {c.charterHistory.map((h) => (
                  <tr key={`${h.charterer}-${h.period}`}>
                    <td>
                      <strong>{h.charterer}</strong>
                    </td>
                    <td>{h.vessels}</td>
                    <td>{h.period}</td>
                    <td>{h.nature}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {c.charterHistory.length === 0 && <Empty>No company-level charter record held yet.</Empty>}
          </div>
        </Panel>
      </div>

      <Panel
        title={contracts.length ? 'LIVE FIXTURES · AS OWNER' : 'LIVE FIXTURES · AS CHARTERER'}
        note="from GO Contracts"
        flush
      >
        <div className="go-tablewrap" style={{ maxHeight: 400, overflowY: 'auto' }}>
          <table className="go-table">
            <thead>
              <tr>
                <th>Vessel</th>
                <th>{contracts.length ? 'Charterer' : 'Owner'}</th>
                <th>Rate/day</th>
                <th>Expires</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {(contracts.length ? contracts : charteredIn).slice(0, 20).map((ct) => (
                <tr key={ct.id}>
                  <td>
                    <Link href={`/go/fleet/${ct.vesselImo}`} className="go-link">
                      {ct.vesselName}
                    </Link>
                  </td>
                  <td>{contracts.length ? ct.charterer : ct.ownerId}</td>
                  <td className="num" style={{ color: 'var(--text)' }}>
                    {canSeeRates || !contracts.length ? rate(ct.ratePerDay) : <Masked />}
                  </td>
                  <td className="num">{dateLabel(ct.expiryDate)}</td>
                  <td>
                    <Status value={ct.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {contracts.length === 0 && charteredIn.length === 0 && <Empty>No live fixtures recorded.</Empty>}
        </div>
      </Panel>

      <div style={{ marginTop: 14 }}>
        <Disclaimer>
          Illustrative company profile for concept demonstration — fleet composition, management tiers,
          utilisation and charter history are not actual company data.
        </Disclaimer>
      </div>
    </AppShell>
  );
}

function Fact({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="go-keyfact">
      <div className="go-keyfact-label">{label}</div>
      <div className="go-keyfact-val">{value}</div>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = () => ({
  paths: COMPANIES.map((c) => ({ params: { id: c.id } })),
  fallback: false,
});

export const getStaticProps: GetStaticProps<Props> = ({ params }) => {
  const id = String(params?.id);
  if (!COMPANIES.some((c) => c.id === id)) return { notFound: true };
  return { props: { id } };
};
