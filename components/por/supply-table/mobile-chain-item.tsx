'use client';

import type { VisibilityState } from '@tanstack/react-table';
import { ExternalLink, TriangleAlertIcon } from 'lucide-react';
import Link from 'next/link';
import {
  ChainIcon,
  CopyAddressButton,
  LockedInPoolValue,
} from '@/components/por/supply-table/cells';
import { Skeleton } from '@/components/ui/skeleton';
import type { ChainSupply } from '@/hooks/use-usd1-supply';
import {
  CHAIN_EXPLORER_URLS,
  CHAIN_META,
  CHAIN_TOKEN_ADDRESSES,
} from '@/lib/contracts/usd1-token';
import { formatSupply } from '@/lib/utils/format';

export function MobileChainItem({
  chain,
  columnVisibility,
}: {
  chain: ChainSupply;
  columnVisibility: VisibilityState;
}) {
  const address = CHAIN_TOKEN_ADDRESSES[chain.chain];
  const explorerUrl = CHAIN_EXPLORER_URLS[chain.chain];
  const meta = CHAIN_META[chain.chain];

  return (
    <div className="border-t border-border-secondary px-4 py-4 first:border-t-0">
      {/* Chain name + icon */}
      <div className="mb-3 flex items-center gap-3">
        <ChainIcon chain={chain.chain} label={chain.label} />
        <span className="text-base font-semibold text-foreground">
          {chain.label}
        </span>
      </div>

      {/* Key-value rows */}
      <div className="flex flex-col gap-2.5">
        {/* Contract */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-foreground-tertiary">Contract</span>
          <CopyAddressButton address={address} />
        </div>

        {/* Type */}
        {columnVisibility.type !== false && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground-tertiary">Type</span>
            <span className="text-sm font-medium text-foreground">
              {meta.native ? 'Native' : 'Bridged'}
            </span>
          </div>
        )}

        {/* Locked in CCIP */}
        {columnVisibility.lockedInPool !== false && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground-tertiary">
              Locked in CCIP
            </span>
            <LockedInPoolValue chain={chain} />
          </div>
        )}

        {/* Supply */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-foreground-tertiary">Supply</span>
          {chain.isLoading ? (
            <Skeleton className="h-4 w-28 rounded" />
          ) : chain.isError ? (
            <span className="flex items-center gap-1.5 text-sm text-destructive">
              <TriangleAlertIcon className="size-3.5 shrink-0" />
              Failed to fetch
            </span>
          ) : chain.supply != null ? (
            <span className="text-sm font-medium text-foreground tabular-nums">
              {formatSupply(chain.supply)}
            </span>
          ) : (
            <span className="text-sm text-foreground-tertiary">—</span>
          )}
        </div>

        {/* Explorer link */}
        <div className="flex justify-end">
          <Link
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-500 transition-opacity hover:opacity-70"
            aria-label={`View ${chain.label} on explorer`}
          >
            View on explorer
            <ExternalLink className="size-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
