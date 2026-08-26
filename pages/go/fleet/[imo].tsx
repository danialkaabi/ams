import Link from 'next/link';
import { GetStaticPaths, GetStaticProps } from 'next';
import AppShell from '@/components/go/AppShell';
import { useAccount } from '@/components/go/AccountContext';
import {
  Confidence, Disclaimer, Empty, Masked, PageHead, Panel, RateRange,
  SourceLine, Status, dateLabel, monthLabel, rate,
} from '@/components/go/ui';
import { IconArrow } from '@/components/go/Icons';
import { VESSELS } from '@/data/go/vessels';
import { OWNERSHIP_TIERS } from '@/data/go/types';
import type { OwnershipTier } from '@/data/go/types';
import { vesselNode } from '@/data/go/graph';
import { canSeeCommercialDetail } from '@/data/go/accounts';

type Props = { imo: string };

export default function VesselProfile({ imo }: Props) {
  const { account } = useAccount();
  const node = vesselNode(imo);

  if (!node) {
    return (
      <AppShell title="Vessel">
        <Empty>No vessel with IMO {imo} in the graph.</Empty>
      </AppShell>
    );
  }

  const { vessel: v, owner, benchmark, charterHistory, activeContract } = node;
  const canSeeRates = canSeeCommercialDetail(account, v.ownerId);

  return (
    <AppShell title={v.name} wide>
      <div style={{ marginBottom: 14 }}>
        <Link href="/go/maps" className="go-link" style={{ fontSize: 12.5, color: 'var(--text-3)' }}>
          ← Back to live map
        </Link>
      </div>

      <div className="go-profile" style={{ marginBottom: 14 }}>
        <div className="go-profile-top">
          <div style={{ flex: 1, minWidth: 260 }}>
            <span className="eyebrow">Vessel profile</span>
            <h1 style={{ marginTop: 8 }}>{v.name}</h1>
            <div className="go-profile-sub">
              <span className="go-pill acc">{v.subType}</span>
              <Status value={v.status} />
              <Confidence p={v.provenance} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 9, flexWrap: 'wrap' }}>
            <button className="go-btn sm">Add to portfolio</button>
            <button className="go-btn sm">Create alert</button>
            <Link href="/go/ai" className="go-btn sm primary">
              Vet with GO AI <IconArrow />
            </Link>
          </div>
        </div>

        <div className="go-keyfacts">
          <Fact label="Owner" value={owner ? <Link href={`/go/companies/${owner.id}`} className="go-link">{owner.name}</Link> : v.ownership.beneficialOwner} />
          <Fact label="Flag" value={v.flag} />
          <Fact label="IMO" value={v.imo} />
          <Fact label="Type" value={`${v.subType} — ${v.sizeClass}`} />
          <Fact label="Operating in" value={node.zoneName ?? '—'} />
          <Fact label="Field operator" value={node.fieldOperator ?? '—'} />
        </div>
      </div>

      <div className="go-grid" style={{ gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', marginBottom: 14 }}>
        <Panel
          title={`${v.sizeClass.toUpperCase()} ${v.subType} BENCHMARK · ${v.region.toUpperCase()}`}
          note={benchmark ? `$${benchmark.low.toLocaleString()} – $${benchmark.high.toLocaleString()}/day` : undefined}
        >
          {benchmark ? (
            <>
              <RateRange low={benchmark.low} high={benchmark.high} actual={canSeeRates ? activeContract?.ratePerDay : null} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, color: 'var(--text-3)', marginTop: 6 }}>
                <span className="mono">${benchmark.low.toLocaleString()}</span>
                <span>indicative term rate — confirm with broker quotes</span>
                <span className="mono">${benchmark.high.toLocaleString()}</span>
              </div>
              {activeContract && (
                <p style={{ fontSize: 12.5, color: 'var(--text-2)', marginTop: 14 }}>
                  Currently fixed to <strong style={{ color: 'var(--text)' }}>{activeContract.charterer}</strong> at{' '}
                  {canSeeRates ? (
                    <>
                      <strong style={{ color: 'var(--text)' }}>{rate(activeContract.ratePerDay)}/day</strong>
                      {activeContract.vsBenchmarkPct != null && (
                        <>
                          {' '}—{' '}
                          <span style={{ color: activeContract.vsBenchmarkPct < 0 ? 'var(--bad)' : 'var(--ok)' }}>
                            {activeContract.vsBenchmarkPct > 0 ? '+' : ''}
                            {activeContract.vsBenchmarkPct}% vs benchmark
                          </span>
                        </>
                      )}
                    </>
                  ) : (
                    <Masked />
                  )}
                  . Expires {dateLabel(activeContract.expiryDate)}.
                </p>
              )}
            </>
          ) : (
            <Empty>No benchmark published for this class and basin yet.</Empty>
          )}
        </Panel>

        <Panel title="AIS · LAST POSITION" note={`${v.ais.ageHours}h old`}>
          <div className="go-grid c2" style={{ gap: 12 }}>
            <Fact label="Latitude" value={`${v.ais.lat.toFixed(3)}° N`} bare />
            <Fact label="Longitude" value={`${v.ais.lon.toFixed(3)}° E`} bare />
            <Fact label="AIS status" value={v.ais.status} bare />
            <Fact label="Speed" value={`${v.ais.speedKn} kn`} bare />
            <Fact label="Heading" value={`${v.ais.headingDeg}°`} bare />
            <Fact label="Days in zone" value={v.ais.daysInZone != null ? String(v.ais.daysInZone) : '—'} bare />
          </div>
        </Panel>
      </div>

      <div className="go-grid" style={{ gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', marginBottom: 14 }}>
        <Panel title="OWNERSHIP & MANAGEMENT · 7 TIERS" note="chain verified">
          {OWNERSHIP_TIERS.map((t) => (
            <div className="go-chainrow" key={t.key}>
              <div>
                <div className="go-chain-tier">{t.label}</div>
                <div style={{ fontSize: 10.5, color: 'var(--text-3)', marginTop: 3 }}>{t.note}</div>
              </div>
              <div className="go-chain-name">{v.ownership[t.key as OwnershipTier]}</div>
            </div>
          ))}
          <div style={{ marginTop: 12 }}>
            <SourceLine p={v.provenance} />
          </div>
        </Panel>

        <Panel title="TECHNICAL PARTICULARS">
          <div className="go-grid c2" style={{ gap: 12 }}>
            <Fact label="Built" value={String(v.built)} bare />
            <Fact label="DWT" value={v.dwt.toLocaleString()} bare />
            <Fact label="MMSI" value={v.mmsi} bare />
            <Fact label="DP class" value={v.dpClass ?? '—'} bare />
            {v.bollardPullT && <Fact label="Bollard pull" value={`${v.bollardPullT} t`} bare />}
            {v.deckAreaM2 && <Fact label="Deck area" value={`${v.deckAreaM2} m²`} bare />}
            {v.bhp && <Fact label="Installed power" value={`${v.bhp.toLocaleString()} bhp`} bare />}
            <Fact label="EEXI band" value={v.eexiBand ?? '—'} bare />
          </div>
        </Panel>
      </div>

      <Panel title="CHARTER HISTORY" note="who fixed what, at what rate, for how long" flush>
        <div className="go-tablewrap">
          <table className="go-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Charter type</th>
                <th>Rate (USD/day)</th>
                <th>vs benchmark</th>
                <th>Charterer</th>
                <th>Field contracted to</th>
                <th>Confidence</th>
              </tr>
            </thead>
            <tbody>
              {charterHistory.map((c) => (
                <tr key={c.id}>
                  <td>{monthLabel(c.startDate)}</td>
                  <td>{c.charterType}</td>
                  <td className="num" style={{ color: 'var(--text)' }}>
                    {canSeeRates ? rate(c.ratePerDay) : <Masked />}
                  </td>
                  <td className="num" style={{ color: c.vsBenchmarkPct == null ? undefined : c.vsBenchmarkPct < 0 ? 'var(--bad)' : 'var(--ok)' }}>
                    {canSeeRates && c.vsBenchmarkPct != null ? `${c.vsBenchmarkPct > 0 ? '+' : ''}${c.vsBenchmarkPct}%` : '—'}
                  </td>
                  <td>{c.charterer}</td>
                  <td>{c.fieldId ?? '—'}</td>
                  <td>
                    <Confidence p={c.provenance} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {charterHistory.length === 0 && <Empty>No charter record held for this vessel yet.</Empty>}
        </div>
      </Panel>

      <div style={{ marginTop: 14 }}>
        <Disclaimer>
          Illustrative vessel profile for concept demonstration — not actual charter data. Rates masked
          as <span className="go-masked">restricted</span> sit outside this account&apos;s data scope; NOC &amp; EPC
          accounts see all operators.
        </Disclaimer>
      </div>
    </AppShell>
  );
}

function Fact({ label, value, bare }: { label: string; value: React.ReactNode; bare?: boolean }) {
  if (bare) {
    return (
      <div>
        <div className="go-keyfact-label">{label}</div>
        <div className="go-keyfact-val" style={{ fontSize: 13 }}>
          {value}
        </div>
      </div>
    );
  }
  return (
    <div className="go-keyfact">
      <div className="go-keyfact-label">{label}</div>
      <div className="go-keyfact-val">{value}</div>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = () => ({
  // Pre-render the profiles the rest of the app links into; the long tail is
  // filled in on demand.
  paths: VESSELS.slice(0, 40).map((v) => ({ params: { imo: v.imo } })),
  fallback: 'blocking',
});

export const getStaticProps: GetStaticProps<Props> = ({ params }) => {
  const imo = String(params?.imo);
  if (!VESSELS.some((v) => v.imo === imo)) return { notFound: true };
  return { props: { imo } };
};
