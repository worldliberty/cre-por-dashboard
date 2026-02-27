'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';
import { useMemo, useState } from 'react';
import { WagmiProvider } from 'wagmi';

import { customRpcsAtom } from '@/lib/store/rpc';
import { createWagmiConfig } from '@/lib/wagmi';

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const customRpcs = useAtomValue(customRpcsAtom);

  const config = useMemo(
    () => createWagmiConfig(customRpcs.ethereum, customRpcs.bsc),
    [customRpcs.ethereum, customRpcs.bsc],
  );

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
