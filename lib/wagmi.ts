import type { Transport } from 'viem';
import { plumeMainnet } from 'viem/chains';
import { createConfig, fallback, http } from 'wagmi';
import { bsc, mainnet, mantle, monad, morph } from 'wagmi/chains';
import { ab } from '@/lib/contracts/usd1-token';

export const DEFAULT_ETH_RPCS = [
  'https://rpc.ankr.com/eth',
  'https://ethereum.publicnode.com',
  'https://eth.drpc.org',
  'https://1rpc.io/eth',
];

export const DEFAULT_BSC_RPCS = [
  'https://rpc.ankr.com/bsc',
  'https://bsc-rpc.publicnode.com',
  'https://bsc-dataseed.binance.org',
  'https://1rpc.io/bnb',
];

export const DEFAULT_PLUME_RPCS = ['https://rpc.plume.org'];

export const DEFAULT_AB_RPCS = ['https://rpc.core.ab.org'];

export const DEFAULT_MONAD_RPCS = ['https://rpc.monad.xyz'];

export const DEFAULT_MANTLE_RPCS = ['https://rpc.mantle.xyz'];

export const DEFAULT_MORPH_RPCS = ['https://rpc.morphl2.io'];

const DEFAULT_RPCS: Record<number, string[]> = {
  [mainnet.id]: DEFAULT_ETH_RPCS,
  [bsc.id]: DEFAULT_BSC_RPCS,
  [plumeMainnet.id]: DEFAULT_PLUME_RPCS,
  [ab.id]: DEFAULT_AB_RPCS,
  [monad.id]: DEFAULT_MONAD_RPCS,
  [mantle.id]: DEFAULT_MANTLE_RPCS,
  [morph.id]: DEFAULT_MORPH_RPCS,
};

const ALL_CHAINS = [
  mainnet,
  bsc,
  plumeMainnet,
  ab,
  monad,
  mantle,
  morph,
] as const;

function buildTransport(
  chainId: number,
  customRpcs: Partial<Record<number, string[]>>,
) {
  const custom = customRpcs[chainId] ?? [];
  const defaults = DEFAULT_RPCS[chainId] ?? [];
  const urls = [...custom, ...defaults];
  if (urls.length === 0) {
    throw new Error(`No RPCs configured for chain ${chainId}`);
  }
  return fallback(urls.map((url) => http(url)));
}

export function createWagmiConfig(
  customRpcs: Partial<Record<number, string[]>> = {},
) {
  return createConfig({
    chains: ALL_CHAINS,
    transports: Object.fromEntries(
      ALL_CHAINS.map((chain) => [
        chain.id,
        buildTransport(chain.id, customRpcs),
      ]),
    ) as Record<(typeof ALL_CHAINS)[number]['id'], Transport>,
  });
}

export const config = createWagmiConfig();
