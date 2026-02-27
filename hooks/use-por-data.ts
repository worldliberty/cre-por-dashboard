'use client';

import { decodeAbiParameters } from 'viem';
import { useBlockNumber, useReadContracts } from 'wagmi';
import {
  POR_ORACLE_ADDRESS,
  porOracleAbi,
  RESERVES_DECIMALS,
} from '@/lib/contracts/por-oracle';

const REFRESH_INTERVAL = 60_000;

const porContract = {
  address: POR_ORACLE_ADDRESS,
  abi: porOracleAbi,
} as const;

const bundleParams = [
  { name: 'timestamp', type: 'uint256' },
  { name: 'reserves', type: 'uint256' },
] as const;

function decodeBundleBytes(bundle: `0x${string}`) {
  const [timestamp, reserves] = decodeAbiParameters(bundleParams, bundle);
  return { timestamp, reserves };
}

export function usePorData() {
  const { data: blockNumber } = useBlockNumber({ watch: true });

  const { data, isLoading, isFetching, isError, refetch, dataUpdatedAt } = useReadContracts(
    {
      contracts: [
        { ...porContract, functionName: 'latestBundle' },
        { ...porContract, functionName: 'bundleDecimals' },
      ],
      query: {
        refetchInterval: REFRESH_INTERVAL,
      },
    },
  );

  const [bundleResult, decimalsResult] = data ?? [];

  const bundleFailed = bundleResult?.status === 'failure';
  const bundle = bundleResult?.result;
  const bundleDecimals = decimalsResult?.result;

  const decoded = bundle ? decodeBundleBytes(bundle) : undefined;
  const decimals = bundleDecimals?.[0] ?? RESERVES_DECIMALS;
  const reservesRaw = decoded?.reserves ?? 0n;
  const reserves = Number(reservesRaw) / 10 ** decimals;

  const hasError = isError || bundleFailed;

  return {
    reserves,
    rawValue: reservesRaw ? reservesRaw.toLocaleString() : '',
    blockNumber: blockNumber?.toLocaleString() ?? '',
    decimals,
    bundleTimestamp: decoded ? Number(decoded.timestamp) : undefined,
    fetchTime: dataUpdatedAt
      ? new Date(dataUpdatedAt).toLocaleTimeString()
      : '',
    isLoading,
    isFetching,
    isError: hasError,
    refetch,
  };
}
