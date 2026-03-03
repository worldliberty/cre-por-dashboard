'use client';

import { useQueries } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';
import { useCallback, useRef } from 'react';
import { erc20Abi, formatUnits } from 'viem';
import { plumeMainnet } from 'viem/chains';
import { useReadContracts } from 'wagmi';
import { bsc, mainnet, mantle, monad, morph } from 'wagmi/chains';
import {
  ab,
  CCIP_POOL_ADDRESSES,
  CHAIN_META,
  type ChainName,
  SUPPLY_REFRESH_INTERVAL,
  USD1_BRIDGED_ADDRESS,
  USD1_EVM_ADDRESS,
} from '@/lib/contracts/usd1-token';
import {
  fetchAptosPoolBalance,
  fetchAptosTotalSupply,
} from '@/lib/fetchers/aptos';
import {
  fetchSolanaPoolBalance,
  fetchSolanaTotalSupply,
} from '@/lib/fetchers/solana';
import { fetchTronTotalSupply } from '@/lib/fetchers/tron';
import { customRpcsAtom } from '@/lib/store/rpc';
import { formatSupply } from '@/lib/utils/format';

// ── Types ────────────────────────────────────────────────────────────

export interface ChainSupply {
  chain: ChainName;
  label: string;
  supply: number | null;
  rawSupply: bigint | null;
  lockedInPool: number | null;
  rawLockedInPool: bigint | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

export interface Usd1SupplyData {
  nativeChains: ChainSupply[];
  bridgedChains: ChainSupply[];
  totalSupply: number;
  totalBridgedSupply: number;
  totalSupplyFormatted: string;
  totalBridgedSupplyFormatted: string;

  isLoading: boolean;
  isFetching: boolean;
  isAllSettled: boolean;
  isAllError: boolean;
  hasPartialError: boolean;
  hasNativeError: boolean;
  erroredChains: string[];
  successCount: number;
  dataUpdatedAt: number | null;
  refetch: () => void;
}

// ── Helpers ──────────────────────────────────────────────────────────

/**
 * Convert raw bigint to a human-readable number.
 * Note: loses sub-cent precision for very large 18-decimal values
 * due to IEEE 754 float limits. Use `rawSupply` for exact math.
 */
function toHuman(raw: bigint, decimals: number): number {
  return Number(formatUnits(raw, decimals));
}

// ── EVM contract read configs ────────────────────────────────────────
// ⚠️ Order matters — indices are referenced positionally in
// nativeEvmResults and bridgedResults via the offset constants below.
// Do NOT reorder or insert entries without updating all index references.
//
// [0] totalSupply on Ethereum (native)
// [1] totalSupply on BSC (native)
// [2] balanceOf(ETH_POOL) on Ethereum
// [3] balanceOf(BSC_POOL) on BSC
// [4] totalSupply on Plume (bridged)
// [5] totalSupply on AB Core (bridged)
// [6] totalSupply on Monad (bridged)
// [7] totalSupply on Mantle (bridged)
// [8] totalSupply on Morph (bridged)

/** Index offset: native EVM supply entries start at 0 */
const NATIVE_SUPPLY_OFFSET = 0;
/** Index offset: CCIP pool balance entries start at 2 */
const POOL_BALANCE_OFFSET = 2;
/** Index offset: bridged chain supply entries start at 4 */
const BRIDGED_SUPPLY_OFFSET = 4;

const evmContracts = [
  {
    address: USD1_EVM_ADDRESS,
    abi: erc20Abi,
    functionName: 'totalSupply',
    chainId: mainnet.id,
  },
  {
    address: USD1_EVM_ADDRESS,
    abi: erc20Abi,
    functionName: 'totalSupply',
    chainId: bsc.id,
  },
  {
    address: USD1_EVM_ADDRESS,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [CCIP_POOL_ADDRESSES.ethereum],
    chainId: mainnet.id,
  },
  {
    address: USD1_EVM_ADDRESS,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [CCIP_POOL_ADDRESSES.bsc],
    chainId: bsc.id,
  },
  {
    address: USD1_BRIDGED_ADDRESS,
    abi: erc20Abi,
    functionName: 'totalSupply',
    chainId: plumeMainnet.id,
  },
  {
    address: USD1_BRIDGED_ADDRESS,
    abi: erc20Abi,
    functionName: 'totalSupply',
    chainId: ab.id,
  },
  {
    address: USD1_BRIDGED_ADDRESS,
    abi: erc20Abi,
    functionName: 'totalSupply',
    chainId: monad.id,
  },
  {
    address: USD1_BRIDGED_ADDRESS,
    abi: erc20Abi,
    functionName: 'totalSupply',
    chainId: mantle.id,
  },
  {
    address: USD1_BRIDGED_ADDRESS,
    abi: erc20Abi,
    functionName: 'totalSupply',
    chainId: morph.id,
  },
] as const;

// Runtime guard: if a contract is inserted or removed, positional indices
// in nativeEvmResults ([0-1] supply, [2-3] locked) and bridgedResults ([4-8])
// will silently break. This assertion surfaces the problem immediately.
if (evmContracts.length !== 9) {
  throw new Error(
    `Expected 9 EVM contracts but found ${evmContracts.length}. ` +
      'Update all positional index references when modifying evmContracts.',
  );
}

// ── Non-EVM query definitions ────────────────────────────────────────

const nonEvmChains = [
  { chain: 'tron' as const, fn: fetchTronTotalSupply },
  { chain: 'solana' as const, fn: fetchSolanaTotalSupply },
  { chain: 'aptos' as const, fn: fetchAptosTotalSupply },
];

const nonEvmPoolQueries = [
  { chain: 'solana' as const, fn: fetchSolanaPoolBalance },
  { chain: 'aptos' as const, fn: fetchAptosPoolBalance },
];

// ── Hook ─────────────────────────────────────────────────────────────

export function useUsd1Supply(): Usd1SupplyData {
  const customRpcs = useAtomValue(customRpcsAtom);

  // EVM chains via wagmi (9 calls)
  const evm = useReadContracts({
    contracts: evmContracts,
    query: { refetchInterval: SUPPLY_REFRESH_INTERVAL },
  });

  // Non-EVM chains via react-query
  const nonEvm = useQueries({
    queries: nonEvmChains.map(({ chain, fn }) => ({
      queryKey: ['usd1-supply', chain, customRpcs[chain]],
      queryFn: () => fn(customRpcs[chain]),
      refetchInterval: SUPPLY_REFRESH_INTERVAL,
      retry: 2,
      staleTime: 30_000,
    })),
  });

  // Non-EVM pool balances (Solana, Aptos)
  const nonEvmPools = useQueries({
    queries: nonEvmPoolQueries.map(({ chain, fn }) => ({
      queryKey: ['usd1-pool', chain, customRpcs[chain]],
      queryFn: () => fn(customRpcs[chain]),
      refetchInterval: SUPPLY_REFRESH_INTERVAL,
      retry: 2,
      staleTime: 30_000,
    })),
  });

  // ── Build per-chain results ──────────────────────────────────────

  const nativeEvmChainNames: ChainName[] = ['ethereum', 'bsc'];
  const nativeEvmResults: ChainSupply[] = nativeEvmChainNames.map(
    (chain, i) => {
      const supplyResult = evm.data?.at(NATIVE_SUPPLY_OFFSET + i);
      const lockedResult = evm.data?.at(POOL_BALANCE_OFFSET + i);
      const raw = supplyResult?.result;
      const rawLocked = lockedResult?.result;
      const isError = supplyResult?.status === 'failure';
      const meta = CHAIN_META[chain];

      return {
        chain,
        label: meta.label,
        supply: raw != null ? toHuman(raw, meta.decimals) : null,
        rawSupply: raw ?? null,
        lockedInPool:
          rawLocked != null ? toHuman(rawLocked, meta.decimals) : null,
        rawLockedInPool: rawLocked ?? null,
        isLoading: evm.isLoading,
        isError,
        error: isError ? new Error(`${meta.label} contract call failed`) : null,
      };
    },
  );

  // Build a map of pool balances by chain name
  const poolBalanceMap = new Map<string, bigint>();
  nonEvmPoolQueries.forEach(({ chain }, i) => {
    const q = nonEvmPools[i];
    if (q?.data != null) poolBalanceMap.set(chain, q.data);
  });

  // Non-EVM chains (tron, solana, aptos)
  const nonEvmResults: ChainSupply[] = nonEvmChains.map(({ chain }, i) => {
    const q = nonEvm[i];
    if (!q)
      return {
        chain,
        label: CHAIN_META[chain].label,
        supply: null,
        rawSupply: null,
        lockedInPool: null,
        rawLockedInPool: null,
        isLoading: true,
        isError: false,
        error: null,
      };
    const meta = CHAIN_META[chain];
    const rawLocked = poolBalanceMap.get(chain) ?? null;

    return {
      chain,
      label: meta.label,
      supply: q.data != null ? toHuman(q.data, meta.decimals) : null,
      rawSupply: q.data ?? null,
      lockedInPool:
        rawLocked != null ? toHuman(rawLocked, meta.decimals) : null,
      rawLockedInPool: rawLocked,
      isLoading: q.isLoading,
      isError: q.isError,
      error: q.error instanceof Error ? q.error : null,
    };
  });

  // Bridged EVM chains: indices [4-8]
  const bridgedChainNames: ChainName[] = [
    'plume',
    'ab',
    'monad',
    'mantle',
    'morph',
  ];
  const bridgedResults: ChainSupply[] = bridgedChainNames.map((chain, i) => {
    const result = evm.data?.at(BRIDGED_SUPPLY_OFFSET + i);
    const raw = result?.result;
    const isError = result?.status === 'failure';
    const meta = CHAIN_META[chain];

    return {
      chain,
      label: meta.label,
      supply: raw != null ? toHuman(raw, meta.decimals) : null,
      rawSupply: raw ?? null,
      lockedInPool: null,
      rawLockedInPool: null,
      isLoading: evm.isLoading,
      isError,
      error: isError ? new Error(`${meta.label} contract call failed`) : null,
    };
  });

  const nativeChains = [...nativeEvmResults, ...nonEvmResults];
  const bridgedChains = bridgedResults;
  const allChains = [...nativeChains, ...bridgedChains];

  // ── Aggregate ────────────────────────────────────────────────────

  // Only native chains count toward total supply. Bridged chain supply is
  // excluded because it is already accounted for — CCIP locks native USD1 on
  // the source chain and mints an equivalent amount on the destination chain.
  const successfulNative = nativeChains.filter((c) => c.supply != null);
  const totalSupply = successfulNative.reduce(
    (sum, c) => sum + (c.supply ?? 0),
    0,
  );

  const successfulBridged = bridgedChains.filter((c) => c.supply != null);
  const totalBridgedSupply = successfulBridged.reduce(
    (sum, c) => sum + (c.supply ?? 0),
    0,
  );

  const successCount = allChains.filter((c) => c.supply != null).length;
  const erroredChainEntries = allChains.filter((c) => c.isError);
  const errorCount = erroredChainEntries.length;
  const isAllSettled = allChains.every((c) => !c.isLoading);

  // Latch: once we've received data, never show loading skeletons again
  const hasLoaded = useRef(false);
  if (successCount > 0) hasLoaded.current = true;

  // Latest update time across all sources
  const nonEvmTimes = [
    ...nonEvm.map((q) => q.dataUpdatedAt),
    ...nonEvmPools.map((q) => q.dataUpdatedAt),
  ].filter((t) => t > 0);
  const allTimes = [
    ...(evm.dataUpdatedAt ? [evm.dataUpdatedAt] : []),
    ...nonEvmTimes,
  ];
  const dataUpdatedAt = allTimes.length > 0 ? Math.max(...allTimes) : null;

  const refetchRef = useRef(() => {});
  refetchRef.current = () => {
    evm.refetch();
    for (const q of nonEvm) q.refetch();
    for (const q of nonEvmPools) q.refetch();
  };
  const refetchAll = useCallback(() => refetchRef.current(), []);

  return {
    nativeChains,
    bridgedChains,
    totalSupply,
    totalBridgedSupply,
    totalSupplyFormatted: formatSupply(totalSupply),
    totalBridgedSupplyFormatted: formatSupply(totalBridgedSupply),

    isLoading: !hasLoaded.current,
    isFetching:
      evm.isFetching ||
      nonEvm.some((q) => q.isFetching) ||
      nonEvmPools.some((q) => q.isFetching),
    isAllSettled,
    isAllError: errorCount === allChains.length,
    hasPartialError: errorCount > 0 && successCount > 0,
    hasNativeError: nativeChains.some((c) => c.isError),
    erroredChains: erroredChainEntries.map((c) => c.label),
    successCount,
    dataUpdatedAt,
    refetch: refetchAll,
  };
}
