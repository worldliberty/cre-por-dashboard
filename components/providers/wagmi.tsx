'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';
import { useMemo, useState } from 'react';
import { plumeMainnet } from 'viem/chains';
import { WagmiProvider } from 'wagmi';
import { bsc, mainnet, mantle, monad, morph } from 'wagmi/chains';
import { ab } from '@/lib/contracts/usd1-token';
import { customRpcsAtom } from '@/lib/store/rpc';
import { createWagmiConfig } from '@/lib/wagmi';

const CHAIN_NAME_TO_ID: Record<string, number> = {
  ethereum: mainnet.id,
  bsc: bsc.id,
  plume: plumeMainnet.id,
  ab: ab.id,
  monad: monad.id,
  mantle: mantle.id,
  morph: morph.id,
};

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const customRpcs = useAtomValue(customRpcsAtom);

  const config = useMemo(() => {
    const byChainId: Record<number, string[]> = {};
    for (const [name, urls] of Object.entries(customRpcs)) {
      const chainId = CHAIN_NAME_TO_ID[name];
      if (chainId && urls.length > 0) {
        byChainId[chainId] = urls;
      }
    }
    return createWagmiConfig(byChainId);
  }, [customRpcs]);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
