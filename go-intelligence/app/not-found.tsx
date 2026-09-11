import Link from 'next/link';
import Wordmark from '@/components/ui/Wordmark';
import { IconArrow } from '@/components/ui/Icons';

export default function NotFound() {
  return (
    <main className="auth">
      <div className="grid-bg" />
      <div className="auth-card" style={{ textAlign: 'center' }}>
        <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'center' }}>
          <Wordmark href="/" size="md" />
        </div>
        <div className="mono" style={{ fontSize: 42, color: 'var(--blue-500)', letterSpacing: '-0.04em' }}>
          404
        </div>
        <h1 style={{ fontSize: 18, marginTop: 12 }}>Off the chart</h1>
        <p style={{ fontSize: 13, color: 'var(--text-4)', marginTop: 10, lineHeight: 1.65 }}>
          This screen does not exist. Head back to the platform or the site.
        </p>
        <div className="row g10" style={{ justifyContent: 'center', marginTop: 22 }}>
          <Link href="/app" className="btn btn--primary btn--sm">
            Platform
            <IconArrow size={14} />
          </Link>
          <Link href="/" className="btn btn--ghost btn--sm">
            Site
          </Link>
        </div>
      </div>
    </main>
  );
}
