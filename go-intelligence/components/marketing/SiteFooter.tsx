import Link from 'next/link';
import Wordmark from '@/components/ui/Wordmark';

const COLUMNS = [
  {
    heading: 'Platform',
    links: [
      { href: '/platform', label: 'All modules' },
      { href: '/app/fleet', label: 'GO Fleet' },
      { href: '/app/companies', label: 'GO Companies' },
      { href: '/app/contracts', label: 'GO Contracts' },
      { href: '/app/maps', label: 'GO Maps & Layers' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { href: '/company', label: 'About' },
      { href: '/pricing', label: 'Pricing' },
      { href: '/company#leadership', label: 'Leadership' },
      { href: '/company#contact', label: 'Contact' },
    ],
  },
  {
    heading: 'Account',
    links: [
      { href: '/login', label: 'Sign in' },
      { href: '/app', label: 'Launch platform' },
      { href: '/app/api', label: 'API access' },
    ],
  },
];

export default function SiteFooter() {
  return (
    <footer className="site-foot">
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <Wordmark href={null} size="md" />
            <p
              style={{
                marginTop: 14,
                fontSize: 13,
                color: 'var(--text-4)',
                maxWidth: '34ch',
                lineHeight: 1.65,
              }}
            >
              One connected knowledge graph for offshore commercial
              decisions — vessels, companies, contracts, projects,
              infrastructure and market data.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.heading}>
              <div className="foot-h">{col.heading}</div>
              {col.links.map((l) => (
                <Link key={l.href + l.label} href={l.href} className="foot-link">
                  {l.label}
                </Link>
              ))}
            </div>
          ))}
        </div>

        <div className="foot-bottom">
          <span>
            © {new Date().getFullYear()} Gemini Offshore. All rights reserved.
          </span>
          <span className="mono" style={{ letterSpacing: '0.1em' }}>
            GO INTELLIGENCE
          </span>
        </div>
      </div>
    </footer>
  );
}
