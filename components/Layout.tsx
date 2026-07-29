import Head from 'next/head';
import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import { useReveal } from '@/lib/useReveal';

type Props = {
  children: ReactNode;
  title?: string;
  description?: string;
};

const SITE_TITLE = 'Al Annabi Marine Services (AMS)';
const DEFAULT_DESC =
  'Al Annabi Marine Services (AMS) — a Sea Horizon Offshore Marine Services and Adani Harbour Services joint venture delivering tug, port, and offshore energy support across Qatar.';

export default function Layout({ children, title, description }: Props) {
  useReveal();

  const fullTitle = title ? `${title} — ${SITE_TITLE}` : `${SITE_TITLE} — Delivering on a Vision`;

  return (
    <>
      <Head>
        <title>{fullTitle}</title>
        <meta name="description" content={description || DEFAULT_DESC} />
        <link rel="icon" href="/images/logo.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
