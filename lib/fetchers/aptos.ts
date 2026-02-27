import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';

import { APTOS_CONFIG } from '@/lib/contracts/usd1-token';

const aptos = new Aptos(new AptosConfig({ network: Network.MAINNET }));

export async function fetchAptosTotalSupply(): Promise<bigint> {
  const metadata = await aptos.getFungibleAssetMetadataByAssetType({
    assetType: APTOS_CONFIG.metadata,
  });

  if (!metadata) {
    throw new Error('Aptos fungible asset metadata not found');
  }

  if (metadata.supply_v2 == null) {
    throw new Error('Missing Aptos supply_v2');
  }

  return BigInt(metadata.supply_v2);
}
