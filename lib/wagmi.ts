import { createConfig, fallback, http } from 'wagmi';
import { bsc, mainnet } from 'wagmi/chains';

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

export function createWagmiConfig(
  customEthRpcs: string[] = [],
  customBscRpcs: string[] = [],
) {
  return createConfig({
    chains: [mainnet, bsc],
    transports: {
      [mainnet.id]: fallback(
        [...customEthRpcs, ...DEFAULT_ETH_RPCS].map((url) => http(url)),
      ),
      [bsc.id]: fallback(
        [...customBscRpcs, ...DEFAULT_BSC_RPCS].map((url) => http(url)),
      ),
    },
  });
}

export const config = createWagmiConfig();
