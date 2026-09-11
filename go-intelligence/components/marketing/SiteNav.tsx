'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Wordmark from '@/components/ui/Wordmark';

const LINKS = [
  { href: '/platform', label: 'Platform' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/company', label: 'Company' },
];

export default function SiteNav() {
  const pathname = usePathname();

  return (
    <header className="site-nav">
      <div className="wrap">
        <Wordmark href="/" size="md" />

        <nav className="site-links" aria-label="Main">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`site-link${pathname === l.href ? ' is-active' : ''}`}
            >
              {l.label}
            </Link>
          ))}
          <Link href="/login" className="site-link site-link--keep">
            Sign in
          </Link>
          <Link href="/app" className="btn btn--primary btn--sm">
            Launch platform
          </Link>
        </nav>
      </div>
    </header>
  );
}
