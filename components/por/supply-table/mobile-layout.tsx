'use client';

import type { VisibilityState } from '@tanstack/react-table';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { useMemo } from 'react';
import { MobileChainItem } from '@/components/por/supply-table/mobile-chain-item';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { ChainSupply } from '@/hooks/use-usd1-supply';
import { compareSupply } from '@/lib/utils/format';

// ── Mobile Layout ───────────────────────────────────────────────────

export function MobileSortButton({
  sortDesc,
  onToggle,
}: {
  sortDesc: boolean;
  onToggle: () => void;
}) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-3 -mr-3 h-8 text-xs font-medium"
      onClick={onToggle}
      aria-label={`Sort by supply, ${sortDesc ? 'descending' : 'ascending'}`}
    >
      Sort by: Supply
      {sortDesc ? (
        <ArrowDown className="ml-1 size-3.5" />
      ) : (
        <ArrowUp className="ml-1 size-3.5" />
      )}
    </Button>
  );
}

export function MobileLayout({
  data,
  sortDesc,
  columnVisibility,
}: {
  data: ChainSupply[];
  sortDesc: boolean;
  columnVisibility: VisibilityState;
}) {
  const sorted = useMemo(() => {
    return [...data].sort((a, b) =>
      sortDesc
        ? compareSupply(b.supply, a.supply)
        : compareSupply(a.supply, b.supply),
    );
  }, [data, sortDesc]);

  return (
    <CardContent className="p-0">
      {sorted.map((chain) => (
        <MobileChainItem
          key={chain.chain}
          chain={chain}
          columnVisibility={columnVisibility}
        />
      ))}
    </CardContent>
  );
}

// ── Mobile Layout Skeleton ──────────────────────────────────────────

export function MobileLayoutSkeleton({
  rowCount,
  columnVisibility,
}: {
  rowCount: number;
  columnVisibility: VisibilityState;
}) {
  return (
    <CardContent className="p-0">
      {Array.from({ length: rowCount }, (_, i) => `skeleton-${i}`).map(
        (key) => (
          <div
            key={key}
            className="border-t border-border-secondary px-4 py-4 first:border-t-0"
          >
            <div className="mb-3 flex items-center gap-3">
              <Skeleton className="size-8 rounded-full" />
              <Skeleton className="h-5 w-28 rounded" />
            </div>
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground-tertiary">
                  Contract
                </span>
                <Skeleton className="h-4 w-28 rounded" />
              </div>
              {columnVisibility.type !== false && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground-tertiary">Type</span>
                  <Skeleton className="h-4 w-16 rounded" />
                </div>
              )}
              {columnVisibility.lockedInPool !== false && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground-tertiary">
                    Locked in CCIP
                  </span>
                  <Skeleton className="h-4 w-24 rounded" />
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground-tertiary">Supply</span>
                <Skeleton className="h-4 w-28 rounded" />
              </div>
            </div>
          </div>
        ),
      )}
    </CardContent>
  );
}
