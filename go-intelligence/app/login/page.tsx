import type { Metadata } from 'next';
import Link from 'next/link';
import Wordmark from '@/components/ui/Wordmark';
import { IconArrow } from '@/components/ui/Icons';

export const metadata: Metadata = {
  title: 'Sign in',
  description: 'Sign in to GO Intelligence.',
};

export default function LoginPage() {
  return (
    <main className="auth">
      <div className="grid-bg" />

      <div className="auth-card">
        <div style={{ marginBottom: 26 }}>
          <Wordmark href="/" size="md" />
        </div>

        <h1 style={{ fontSize: 21, letterSpacing: '-0.025em' }}>Sign in</h1>
        <p style={{ fontSize: 13, color: 'var(--text-4)', marginTop: 8, lineHeight: 1.6 }}>
          Access the offshore commercial graph.
        </p>

        <form className="stack g16" style={{ marginTop: 26 }}>
          <div className="field">
            <label className="label" htmlFor="email">Work email</label>
            <input
              className="input"
              id="email"
              name="email"
              type="email"
              placeholder="you@company.com"
              autoComplete="username"
            />
          </div>

          <div className="field">
            <label className="label" htmlFor="password">Password</label>
            <input
              className="input"
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          {/* Authentication is not wired up yet — this link goes straight
              through to the platform so the shell can be reviewed. */}
          <Link href="/app" className="btn btn--primary btn--block">
            Sign in
            <IconArrow size={15} />
          </Link>
        </form>

        <div
          style={{
            marginTop: 22,
            paddingTop: 18,
            borderTop: '1px solid var(--line)',
            fontSize: 12.5,
            color: 'var(--text-5)',
            lineHeight: 1.6,
          }}
        >
          Authentication is not connected yet. Wire this form to your identity
          provider before launch — the button currently opens the platform
          directly.
        </div>

        <div style={{ marginTop: 18, fontSize: 12.5 }}>
          <Link href="/" className="link-arrow" style={{ fontSize: 12.5 }}>
            Back to site
          </Link>
        </div>
      </div>
    </main>
  );
}
