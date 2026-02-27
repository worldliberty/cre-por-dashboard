import { TronWeb } from 'tronweb';

import { TRON_CONFIG } from '@/lib/contracts/usd1-token';

const TOTAL_SUPPLY_ABI = [
  {
    constant: true,
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', type: 'uint256' }],
    type: 'function',
    stateMutability: 'view',
  },
];

export async function fetchTronTotalSupply(
  customRpcs: string[] = [],
): Promise<bigint> {
  const hexAddress = TronWeb.address.toHex(TRON_CONFIG.address);
  let lastError: unknown;

  for (const url of [...customRpcs, ...TRON_CONFIG.rpcs]) {
    try {
      const tronWeb = new TronWeb({ fullHost: url });
      tronWeb.setAddress(TRON_CONFIG.address);
      const contract = tronWeb.contract(TOTAL_SUPPLY_ABI, hexAddress);
      const supply = await contract.totalSupply().call();

      if (!supply) throw new Error('Missing totalSupply');

      return BigInt(supply.toString());
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError;
}
