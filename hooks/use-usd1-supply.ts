'use client';

import { useQueries } from '@tanstack/react-query';
import { useRef } from 'react';
import { erc20Abi, formatUnits } from 'viem';
import { useReadContracts } from 'wagmi';
import { bsc, mainnet } from 'wagmi/chains';
import {
  CHAIN_META,
  type ChainName,
  SUPPLY_REFRESH_INTERVAL,
  USD1_EVM_ADDRESS,
} from '@/lib/contracts/usd1-token';
import { fetchAptosTotalSupply } from '@/lib/fetchers/aptos';
import { fetchSolanaTotalSupply } from '@/lib/fetchers/solana';
import { fetchTronTotalSupply } from '@/lib/fetchers/tron';

// ── Types ────────────────────────────────────────────────────────────

export interface ChainSupply {
  chain: ChainName;
  label: string;
  supply: number | null;
  rawSupply: bigint | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

export interface Usd1SupplyData {
  chains: ChainSupply[];
  totalSupply: number;
  totalSupplyFormatted: string;
  totalRawSupply: string;
  isLoading: boolean;
  isAllSettled: boolean;
  isAllError: boolean;
  hasPartialError: boolean;
  erroredChains: string[];
  successCount: number;
  dataUpdatedAt: number | null;
  refetch: () => void;
}

// ── Helpers ──────────────────────────────────────────────────────────

function toHuman(raw: bigint, decimals: number): number {
  return Number(formatUnits(raw, decimals));
}

function formatSupply(n: number): string {
  return n.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// ── EVM contract read configs ────────────────────────────────────────

const evmContract = {
  address: USD1_EVM_ADDRESS,
  abi: erc20Abi,
  functionName: 'totalSupply',
} as const;

const evmContracts = [
  { ...evmContract, chainId: mainnet.id },
  { ...evmContract, chainId: bsc.id },
] as const;

// ── Non-EVM query definitions ────────────────────────────────────────

const nonEvmQueries = [
  { chain: 'tron' as const, fn: fetchTronTotalSupply },
  { chain: 'solana' as const, fn: fetchSolanaTotalSupply },
  { chain: 'aptos' as const, fn: fetchAptosTotalSupply },
];

// ── Hook ─────────────────────────────────────────────────────────────

export function useUsd1Supply(): Usd1SupplyData {
  // EVM chains via wagmi
  const evm = useReadContracts({
    contracts: evmContracts,
    query: { refetchInterval: SUPPLY_REFRESH_INTERVAL },
  });

  // Non-EVM chains via react-query
  const nonEvm = useQueries({
    queries: nonEvmQueries.map(({ chain, fn }) => ({
      queryKey: ['usd1-supply', chain],
      queryFn: fn,
      refetchInterval: SUPPLY_REFRESH_INTERVAL,
      retry: 2,
      staleTime: 30_000,
    })),
  });

  // ── Build per-chain results ──────────────────────────────────────

  const evmChains: [ChainName, ChainName] = ['ethereum', 'bsc'];

  const evmResults: ChainSupply[] = evmChains.map((chain, i) => {
    const result = evm.data?.[i];
    const raw = result?.result as bigint | undefined;
    const isError = result?.status === 'failure';
    const meta = CHAIN_META[chain];

    return {
      chain,
      label: meta.label,
      supply: raw != null ? toHuman(raw, meta.decimals) : null,
      rawSupply: raw ?? null,
      isLoading: evm.isLoading,
      isError,
      error: isError ? new Error(`${meta.label} contract call failed`) : null,
    };
  });

  const nonEvmResults: ChainSupply[] = nonEvmQueries.map(({ chain }, i) => {
    const q = nonEvm[i];
    if (!q)
      return {
        chain,
        label: CHAIN_META[chain].label,
        supply: null,
        rawSupply: null,
        isLoading: true,
        isError: false,
        error: null,
      };
    const meta = CHAIN_META[chain];

    return {
      chain,
      label: meta.label,
      supply: q.data != null ? toHuman(q.data, meta.decimals) : null,
      rawSupply: q.data ?? null,
      isLoading: q.isLoading,
      isError: q.isError,
      error: q.error instanceof Error ? q.error : null,
    };
  });

  const chains = [...evmResults, ...nonEvmResults];

  // ── Aggregate ────────────────────────────────────────────────────

  const successfulChains = chains.filter((c) => c.supply != null);
  const totalSupply = successfulChains.reduce(
    (sum, c) => sum + (c.supply ?? 0),
    0,
  );

  // Sum raw supplies normalized to 18 decimals
  const totalRawSupply = chains.reduce((sum, c) => {
    if (c.rawSupply == null) return sum;
    const meta = CHAIN_META[c.chain];
    const scale = 10n ** BigInt(18 - meta.decimals);
    return sum + c.rawSupply * scale;
  }, 0n);
  const successCount = successfulChains.length;
  const erroredChainEntries = chains.filter((c) => c.isError);
  const errorCount = erroredChainEntries.length;
  const isAllSettled = chains.every((c) => !c.isLoading);

  // Latch: once we've received data, never show loading skeletons again
  const hasLoaded = useRef(false);
  if (successCount > 0) hasLoaded.current = true;

  // Latest update time across all sources
  const nonEvmTimes = nonEvm.map((q) => q.dataUpdatedAt).filter((t) => t > 0);
  const allTimes = [
    ...(evm.dataUpdatedAt ? [evm.dataUpdatedAt] : []),
    ...nonEvmTimes,
  ];
  const dataUpdatedAt = allTimes.length > 0 ? Math.max(...allTimes) : null;

  return {
    chains,
    totalSupply,
    totalSupplyFormatted: formatSupply(totalSupply),
    totalRawSupply: totalRawSupply > 0n ? totalRawSupply.toLocaleString() : '',
    isLoading: !hasLoaded.current,
    isAllSettled,
    isAllError: errorCount === chains.length,
    hasPartialError: errorCount > 0 && successCount > 0,
    erroredChains: erroredChainEntries.map((c) => c.label),
    successCount,
    dataUpdatedAt,
    refetch: () => {
      evm.refetch();
      for (const q of nonEvm) q.refetch();
    },
  };
}
