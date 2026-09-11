import type { Metadata } from 'next';
import PageHead from '@/components/app/PageHead';
import Panel from '@/components/ui/Panel';
import Badge from '@/components/ui/Badge';
import { ACCOUNT } from '@/data/account';
import { PLANS } from '@/lib/plans';
import { REGIONS } from '@/lib/taxonomy';
import { usd } from '@/lib/format';

export const metadata: Metadata = {
  title: 'Settings',
  description: 'Account, workspace and integration settings.',
};

export default function SettingsPage() {
  const plan = PLANS.find((p) => p.tier === ACCOUNT.tier);

  return (
    <>
      <PageHead
        eyebrow="Platform · Settings"
        title="Settings"
        sub="Account, workspace defaults and the integrations the platform is waiting on."
      />

      <div className="grid grid-2" style={{ marginBottom: 16 }}>
        <Panel title="Account">
          <div className="spec-grid">
            <div className="spec">
              <div className="spec-k">Organisation</div>
              <div className="spec-v">{ACCOUNT.organisation}</div>
            </div>
            <div className="spec">
              <div className="spec-k">Account type</div>
              <div className="spec-v">{plan?.name}</div>
            </div>
            <div className="spec">
              <div className="spec-k">Seats</div>
              <div className="spec-v">{plan?.seats}</div>
            </div>
            <div className="spec">
              <div className="spec-k">Annual value</div>
              <div className="spec-v">{usd(plan?.priceUsd)}</div>
            </div>
          </div>
        </Panel>

        <Panel title="Workspace defaults">
          <div className="panel-body stack g16">
            <div className="field">
              <label className="label" htmlFor="s-region">
                Home region
              </label>
              <select className="select" id="s-region" defaultValue={REGIONS[0]}>
                {REGIONS.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label className="label" htmlFor="s-currency">
                Rate currency
              </label>
              <select className="select" id="s-currency" defaultValue="USD">
                <option>USD</option>
                <option>EUR</option>
                <option>GBP</option>
                <option>AED</option>
              </select>
            </div>
            <div className="field">
              <label className="label" htmlFor="s-units">
                Units
              </label>
              <select className="select" id="s-units" defaultValue="Metric">
                <option>Metric</option>
                <option>Imperial</option>
              </select>
            </div>
          </div>
        </Panel>
      </div>

      <Panel title="Capabilities on this account" style={{ marginBottom: 16 }}>
        <div className="panel-body">
          <div className="row g8 wrapflex">
            {plan?.features.map((f) => (
              <span className="plan-feat" key={f}>
                {f}
              </span>
            ))}
          </div>
          <p className="muted" style={{ fontSize: 12, marginTop: 14 }}>
            Change the tier in{' '}
            <span className="mono" style={{ color: 'var(--blue-300)' }}>
              data/account.ts
            </span>{' '}
            to see how the platform presents each account type — it drives
            export and API availability across every screen.
          </p>
        </div>
      </Panel>

      <Panel title="Integrations">
        <div className="table-scroll">
          <table className="table">
            <thead>
              <tr>
                <th>Integration</th>
                <th>Purpose</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Authentication', 'Sign-in, seats and role-based access', 'Not connected'],
                ['Database', 'Replace file-based records with live queries', 'Not connected'],
                ['AIS provider', 'Live vessel positions on the map', 'Not connected'],
                ['Map tiles', 'Basemap for GO Maps & Layers', 'Not connected'],
                ['Language model', 'Answers for GO AI', 'Not connected'],
                ['Email / CRM', 'Contact form and alert delivery', 'Not connected'],
              ].map(([name, purpose, status]) => (
                <tr key={name}>
                  <td className="td-strong">{name}</td>
                  <td style={{ whiteSpace: 'normal', color: 'var(--text-4)' }}>{purpose}</td>
                  <td>
                    <Badge tone="grey" dot>
                      {status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
}
