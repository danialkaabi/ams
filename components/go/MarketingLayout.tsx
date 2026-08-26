import Head from 'next/head';
import Link from 'next/link';
import { ReactNode } from 'react';

const LINKS = [
  { href: '/go#platform', label: 'Platform' },
  { href: '/go/modules', label: 'Modules' },
  { href: '/go/data', label: 'Data' },
  { href: '/go/pricing', label: 'Pricing' },
];

/** Public shell for the pages that sell the platform. */
export default function MarketingLayout({
  children,
  title,
  description,
}: {
  children: ReactNode;
  title: string;
  description?: string;
}) {
  return (
    <div className="go go-marketing">
      <Head>
        <title>{`${title} — GO Intelligence by Gemini Offshore`}</title>
        <meta
          name="description"
          content={
            description ??
            'GO Intelligence connects vessels, companies, contracts, projects, infrastructure and market data into one live commercial graph for offshore energy.'
          }
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </Head>

      <nav className="go-mk-nav">
        <Link href="/go">
          <div className="go-brand-mark">GEMINI OFFSHORE</div>
          <div className="go-brand-sub">GO Intelligence</div>
        </Link>
        <div className="go-mk-navlinks">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href}>
              {l.label}
            </Link>
          ))}
        </div>
        <div className="go-mk-navcta">
          <Link href="/go/dashboard" className="go-btn sm">
            Open the platform
          </Link>
          <Link href="/go/pricing" className="go-btn primary sm">
            Request access
          </Link>
        </div>
      </nav>

      {children}

      <footer className="go-foot">
        <div className="go-wrap" style={{ display: 'flex', gap: 28, flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <div style={{ maxWidth: 320 }}>
            <div className="go-brand-mark">GEMINI OFFSHORE</div>
            <p style={{ marginTop: 12, fontSize: 12.5, lineHeight: 1.6 }}>
              One knowledge graph. Every offshore decision. GO Intelligence is the commercial
              intelligence platform for the offshore energy industry.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 44, flexWrap: 'wrap', marginLeft: 'auto' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              <span className="eyebrow">Product</span>
              <Link href="/go/modules">Modules</Link>
              <Link href="/go/data">Data &amp; technology</Link>
              <Link href="/go/pricing">Pricing</Link>
              <Link href="/go/api">API</Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              <span className="eyebrow">Platform</span>
              <Link href="/go/dashboard">Dashboard</Link>
              <Link href="/go/fleet">Fleet</Link>
              <Link href="/go/contracts">Contracts</Link>
              <Link href="/go/maps">Maps</Link>
            </div>
          </div>
        </div>
        <div className="go-wrap" style={{ marginTop: 34, paddingTop: 20, borderTop: '1px solid var(--line)' }}>
          <p className="go-note">
            Figures, fixtures, rates and profiles shown across this platform are illustrative
            demonstration data. Rate benchmarks are indicative — confirm with broker quotes before fixing.
          </p>
        </div>
      </footer>
    </div>
  );
}
