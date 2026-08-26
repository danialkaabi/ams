import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import type { Account, AccountPlan, AccountType, FeatureKey } from '@/data/go/types';
import { DEMO_ACCOUNTS, DEMO_USER, PLANS, hasFeature } from '@/data/go/accounts';

type Ctx = {
  account: Account;
  plan: AccountPlan;
  user: typeof DEMO_USER;
  setAccountType: (t: AccountType) => void;
  can: (f: FeatureKey) => boolean;
};

const AccountCtx = createContext<Ctx | null>(null);

const STORAGE_KEY = 'go.accountType';

/**
 * Which tenant the app is currently being viewed as. Switching is a demo
 * affordance — in production this is resolved from the authenticated session —
 * but the entitlement checks downstream are the real ones.
 */
export function AccountProvider({ children }: { children: ReactNode }) {
  const [type, setType] = useState<AccountType>('noc-epc');

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY) as AccountType | null;
      if (saved && saved in PLANS) setType(saved);
    } catch {
      /* private mode or storage disabled — the default tenant is fine */
    }
  }, []);

  const setAccountType = useCallback((t: AccountType) => {
    setType(t);
    try {
      window.localStorage.setItem(STORAGE_KEY, t);
    } catch {
      /* non-fatal */
    }
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      account: DEMO_ACCOUNTS[type],
      plan: PLANS[type],
      user: DEMO_USER,
      setAccountType,
      can: (f: FeatureKey) => hasFeature(type, f),
    }),
    [type, setAccountType],
  );

  return <AccountCtx.Provider value={value}>{children}</AccountCtx.Provider>;
}

export function useAccount(): Ctx {
  const ctx = useContext(AccountCtx);
  if (!ctx) throw new Error('useAccount must be used inside <AccountProvider>');
  return ctx;
}
