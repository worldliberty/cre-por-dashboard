import { address, createSolanaRpc } from '@solana/kit';

import { CCIP_POOL_ADDRESSES, SOLANA_CONFIG } from '@/lib/contracts/usd1-token';

const mint = address(SOLANA_CONFIG.mint);
const poolAddress = address(CCIP_POOL_ADDRESSES.solana);

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

  throw lastError instanceof Error
    ? lastError
    : new Error('All RPCs failed for Solana');
}

export async function fetchSolanaPoolBalance(
  customRpcs: string[] = [],
): Promise<bigint> {
  let lastError: unknown;

  for (const url of [...customRpcs, ...SOLANA_CONFIG.rpcs]) {
    try {
      const rpc = createSolanaRpc(url);
      const { value } = await rpc
        .getTokenAccountsByOwner(
          poolAddress,
          { mint },
          { encoding: 'jsonParsed' },
        )
        .send();

      const [account] = value;
      if (!account) throw new Error('Solana pool token account not found');

      // SPL Token "jsonParsed" format nests token info as:
      // account.data.parsed.info.tokenAmount.amount (raw string)
      const parsed = account.account.data.parsed;
      if (!parsed?.info?.tokenAmount?.amount) {
        throw new Error('Invalid Solana pool token account data');
      }

      return BigInt(parsed.info.tokenAmount.amount);
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error('All RPCs failed for Solana');
}
