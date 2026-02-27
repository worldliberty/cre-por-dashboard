'use client';

import { Provider } from 'jotai';

import { store } from '@/lib/store';

export function StoreProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
