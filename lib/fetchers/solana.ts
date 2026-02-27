import { address, createSolanaRpc } from '@solana/kit';

import { SOLANA_CONFIG } from '@/lib/contracts/usd1-token';

const mint = address(SOLANA_CONFIG.mint);

export async function fetchSolanaTotalSupply(
  customRpcs: string[] = [],
): Promise<bigint> {
  let lastError: unknown;

  for (const url of [...customRpcs, ...SOLANA_CONFIG.rpcs]) {
    try {
      const rpc = createSolanaRpc(url);
      const { value } = await rpc.getTokenSupply(mint).send();

      if (!value.amount) throw new Error('Missing token supply amount');

      return BigInt(value.amount);
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError;
}
