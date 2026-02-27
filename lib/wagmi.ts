import { createConfig, fallback, http } from 'wagmi';
import { bsc, mainnet } from 'wagmi/chains';

export const config = createConfig({
  chains: [mainnet, bsc],
  transports: {
    [mainnet.id]: fallback([
      http('https://rpc.ankr.com/eth'),
      http('https://ethereum.publicnode.com'),
      http('https://eth.drpc.org'),
      http('https://1rpc.io/eth'),
    ]),
    [bsc.id]: fallback([
      http('https://rpc.ankr.com/bsc'),
      http('https://bsc-rpc.publicnode.com'),
      http('https://bsc-dataseed.binance.org'),
      http('https://1rpc.io/bnb'),
    ]),
  },
});
