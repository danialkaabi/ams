import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'GO Intelligence — Offshore Commercial Intelligence',
    template: '%s · GO Intelligence',
  },
  description:
    'One connected knowledge graph for offshore commercial decisions. Vessels, companies, contracts, projects, infrastructure and market data — by Gemini Offshore.',
  applicationName: 'GO Intelligence',
  authors: [{ name: 'Gemini Offshore' }],
  openGraph: {
    title: 'GO Intelligence — Offshore Commercial Intelligence',
    description:
      'One connected knowledge graph for offshore commercial decisions, by Gemini Offshore.',
    siteName: 'GO Intelligence',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#0a0f1a',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
