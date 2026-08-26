import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import '@/styles/globals.css';
import '@/styles/go.css';
import { AccountProvider } from '@/components/go/AccountContext';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  // GO Intelligence runs inside its own account context; the AMS marketing
  // site does not need it.
  if (router.pathname.startsWith('/go')) {
    return (
      <AccountProvider>
        <Component {...pageProps} />
      </AccountProvider>
    );
  }

  return <Component {...pageProps} />;
}
