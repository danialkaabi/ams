import type { Metadata } from 'next';
import Link from 'next/link';
import MarketingLayout from '@/components/marketing/MarketingLayout';
import { PLANS } from '@/lib/plans';
import { usd } from '@/lib/format';
import { IconArrow, IconCheck } from '@/components/ui/Icons';

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'Three account types, one platform. Shipowner, Financier and NOC & EPC Contractor accounts for GO Intelligence.',
};

const FAQ = [
  {
    q: 'Are modules sold separately?',
    a: 'No. Every account gets the whole platform on day one — no module upsells and no feature paywalls. What scales with the account type is data scope, seat count, export and API access.',
  },
  {
    q: 'What does data scope mean?',
    a: 'A shipowner account sees its own fleet against regional benchmarks. A financier account sees its financed exposure. An NOC or EPC account sees full regional fleet, contract and field data across all operators.',
  },
  {
    q: 'Is the API included?',
    a: 'API access is included with the NOC & EPC Contractor account. Excel export is included from the Financier account upward.',
  },
  {
    q: 'How is the platform supported?',
    a: 'Every account has a dedicated account manager. NOC and EPC accounts add a customer success manager and out-of-hours priority support.',
  },
];

export default function PricingPage() {
  return (
    <MarketingLayout>
      <section className="hero" style={{ paddingBlock: 'clamp(56px, 8vw, 96px)' }}>
        <div className="grid-bg" />
        <div className="wrap">
          <div className="hero-inner">
            <span className="eyebrow eyebrow--gold">Subscription packages</span>
            <h1 className="display" style={{ fontSize: 'clamp(30px, 4.4vw, 52px)' }}>
              Three accounts. One platform.
            </h1>
            <p className="lede">
              Every account runs on the same GO Intelligence platform. Data
              scope, seats, export and API access scale with the account type.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="grid grid-3" style={{ gap: 20, alignItems: 'stretch' }}>
            {PLANS.map((p) => (
              <article
                key={p.tier}
                className={`plan${p.featured ? ' plan--feature' : ''}`}
              >
                {p.featured && <span className="plan-flag">Full platform</span>}

                <h2 className="plan-name">{p.name}</h2>
                <p className="plan-for">{p.for}</p>

                <div className="plan-price">{usd(p.priceUsd)}</div>
                <div className="plan-cycle">{p.cycle}</div>

                <div className="plan-tier">{p.tierLabel}</div>
                <div className="plan-feats">
                  {p.features.map((f) => (
                    <span className="plan-feat" key={f}>
                      <IconCheck size={12} />
                      {f}
                    </span>
                  ))}
                </div>

                <div className="plan-meta">
                  <div>
                    <div className="plan-meta-k">Seats</div>
                    <div className="plan-meta-v">{p.seats}</div>
                  </div>
                  <div>
                    <div className="plan-meta-k">Data scope</div>
                    <div className="plan-meta-v">{p.dataScope}</div>
                  </div>
                  <div>
                    <div className="plan-meta-k">Support</div>
                    <div className="plan-meta-v">{p.support}</div>
                  </div>
                </div>

                <div className="plan-cta" style={{ marginTop: 'auto', paddingTop: 24 }}>
                  <Link
                    href="/company#contact"
                    className={`btn btn--block ${p.featured ? 'btn--gold' : 'btn--ghost'}`}
                  >
                    Talk to us
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <p
            className="muted"
            style={{ marginTop: 22, fontSize: 12.5, textAlign: 'center' }}
          >
            Shipowner / Operator: core platform only. Financier: core platform
            plus Excel export. NOC &amp; EPC Contractor: full platform with API
            access.
          </p>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--navy-870)', borderBlock: '1px solid var(--line)' }}>
        <div className="wrap wrap-narrow">
          <div className="section-head">
            <span className="eyebrow">Questions</span>
            <h2 className="section-title">What every account includes</h2>
            <div className="rule-gold" />
          </div>

          <div className="grid grid-2">
            {FAQ.map((f) => (
              <article className="well" key={f.q}>
                <h3 style={{ fontSize: 14.5, marginBottom: 9 }}>{f.q}</h3>
                <p style={{ fontSize: 13, color: 'var(--text-4)', lineHeight: 1.65 }}>
                  {f.a}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="grid-bg" />
        <div className="wrap">
          <h2 className="section-title" style={{ maxWidth: '20ch' }}>
            See the platform with your own fleet in it.
          </h2>
          <Link href="/app" className="btn btn--primary btn--lg">
            Launch the platform
            <IconArrow size={16} />
          </Link>
        </div>
      </section>
    </MarketingLayout>
  );
}
