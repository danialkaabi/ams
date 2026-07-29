import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

const LINKS = [
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/hse', label: 'HSE' },
  { href: '/contact', label: 'Contact' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <header className="site-head">
      <div className="wrap nav">
        <Link href="/" className="brand" onClick={() => setOpen(false)}>
          <img src="/images/logo.png" alt="AMS — Al Annabi Marine Services" />
          <span className="brand-text">
            Al Annabi Marine Services
            <small>An SHM &amp; Adani Group Joint Venture</small>
          </span>
        </Link>

        <nav className={`nav-links ${open ? 'open' : ''}`}>
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={router.pathname === link.href ? 'active' : ''}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="nav-cta">
          <Link href="/contact" className="btn btn-primary">
            Contact us
          </Link>
          <button
            className="menu-btn"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>
  );
}
