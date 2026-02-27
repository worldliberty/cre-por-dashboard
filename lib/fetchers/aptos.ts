import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';

import { APTOS_CONFIG } from '@/lib/contracts/usd1-token';

export async function fetchAptosTotalSupply(
  customRpcs: string[] = [],
): Promise<bigint> {
  let lastError: unknown;

  // Try custom RPCs first
  for (const url of customRpcs) {
    try {
      const aptos = new Aptos(
        new AptosConfig({ network: Network.MAINNET, fullnode: url }),
      );
      const metadata = await aptos.getFungibleAssetMetadataByAssetType({
        assetType: APTOS_CONFIG.metadata,
      });

      if (!metadata) throw new Error('Aptos fungible asset metadata not found');
      if (metadata.supply_v2 == null)
        throw new Error('Missing Aptos supply_v2');

      return BigInt(metadata.supply_v2);
    } catch (err) {
      lastError = err;
    }
  }

  // Fall back to SDK default
  try {
    const aptos = new Aptos(new AptosConfig({ network: Network.MAINNET }));
    const metadata = await aptos.getFungibleAssetMetadataByAssetType({
      assetType: APTOS_CONFIG.metadata,
    });

    if (!metadata) throw new Error('Aptos fungible asset metadata not found');
    if (metadata.supply_v2 == null) throw new Error('Missing Aptos supply_v2');

    return BigInt(metadata.supply_v2);
  } catch (err) {
    lastError = err;
  }

  throw lastError;
}
