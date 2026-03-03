import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';

import { APTOS_CONFIG, CCIP_POOL_ADDRESSES } from '@/lib/contracts/usd1-token';

async function withAptosFallback<T>(
  customRpcs: string[],
  query: (aptos: Aptos) => Promise<T>,
): Promise<T> {
  let lastError: unknown;

  for (const url of customRpcs) {
    try {
      const aptos = new Aptos(
        new AptosConfig({ network: Network.MAINNET, fullnode: url }),
      );
      return await query(aptos);
    } catch (err) {
      lastError = err;
    }
  }

  try {
    const aptos = new Aptos(new AptosConfig({ network: Network.MAINNET }));
    return await query(aptos);
  } catch (err) {
    lastError = err;
  }

  throw lastError instanceof Error
    ? lastError
    : new Error('All RPCs failed for Aptos');
}

export function fetchAptosTotalSupply(
  customRpcs: string[] = [],
): Promise<bigint> {
  return withAptosFallback(customRpcs, async (aptos) => {
    const metadata = await aptos.getFungibleAssetMetadataByAssetType({
      assetType: APTOS_CONFIG.metadata,
    });
    if (!metadata) throw new Error('Aptos fungible asset metadata not found');
    if (metadata.supply_v2 == null) throw new Error('Missing Aptos supply_v2');
    return BigInt(metadata.supply_v2);
  });
}

export function fetchAptosPoolBalance(
  customRpcs: string[] = [],
): Promise<bigint> {
  return withAptosFallback(customRpcs, async (aptos) => {
    const balances = await aptos.getCurrentFungibleAssetBalances({
      options: {
        where: {
          owner_address: { _eq: CCIP_POOL_ADDRESSES.aptos },
          asset_type: { _eq: APTOS_CONFIG.metadata },
        },
      },
    });

    const [balance] = balances;

    if (!balance || balance.amount === null)
      throw new Error('Aptos pool balance not found');

    return BigInt(balance.amount);
  });
}
