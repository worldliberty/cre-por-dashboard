import { createConfig, fallback, http } from 'wagmi';
import { mainnet } from 'wagmi/chains';

export const config = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: fallback([
      http('https://rpc.ankr.com/eth'),
      http('https://ethereum.publicnode.com'),
      http('https://eth.drpc.org'),
      http('https://1rpc.io/eth'),
    ]),
  },
});
