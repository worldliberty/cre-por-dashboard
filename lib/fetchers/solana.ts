import { type Address, address, createSolanaRpc } from '@solana/kit';

import { SOLANA_CONFIG } from '@/lib/contracts/usd1-token';

const mint = address(SOLANA_CONFIG.mint);
const poolTokenAccount = address(SOLANA_CONFIG.poolTokenAccount);

/**
 * The subset of the SPL `jsonParsed` payload we read. `supply` is present on
 * mint accounts, `tokenAmount` on token accounts; both are raw base-unit
 * strings that still need scaling by `SOLANA_CONFIG.decimals`.
 */
interface ParsedSplInfo {
  supply?: string;
  tokenAmount?: { amount?: string };
}

/**
 * Read one account via `getAccountInfo` and pull a raw amount out of it,
 * falling back through each RPC in turn.
 *
 * ⚠️ Deliberately avoids Solana's *indexed* methods (getTokenSupply,
 * getTokenAccountBalance, getTokenAccountsByOwner): keyless public RPCs stopped
 * serving those, so they fail for every user. Plain account reads are still
 * served and carry the same numbers.
 */
async function readRawAmount(
  customRpcs: string[],
  account: Address,
  select: (info: ParsedSplInfo) => string | undefined,
  label: string,
): Promise<bigint> {
  let lastError: unknown;

  for (const url of [...customRpcs, ...SOLANA_CONFIG.rpcs]) {
    try {
      const rpc = createSolanaRpc(url);
      const { value } = await rpc
        .getAccountInfo(account, { encoding: 'jsonParsed' })
        .send();

      if (!value) throw new Error(`Solana ${label} account not found`);

      const data = value.data as { parsed?: { info?: ParsedSplInfo } };
      const raw = select(data.parsed?.info ?? {});

      // A legitimately empty pool reads "0", so check for absence, not falsiness.
      if (raw == null) throw new Error(`Missing Solana ${label}`);

      return BigInt(raw);
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error('All RPCs failed for Solana');
}

export function fetchSolanaTotalSupply(
  customRpcs: string[] = [],
): Promise<bigint> {
  return readRawAmount(customRpcs, mint, (info) => info.supply, 'total supply');
}

export function fetchSolanaPoolBalance(
  customRpcs: string[] = [],
): Promise<bigint> {
  return readRawAmount(
    customRpcs,
    poolTokenAccount,
    (info) => info.tokenAmount?.amount,
    'pool balance',
  );
}
