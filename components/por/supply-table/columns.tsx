// 'use client' is needed because column cell renderers use React hooks
// via imported components (e.g. Tooltip, CopyAddressButton).
'use client';

import type { ColumnDef, SortFn } from '@tanstack/react-table';
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ExternalLink,
  Info,
  TriangleAlertIcon,
} from 'lucide-react';
import Link from 'next/link';
import {
  ChainIcon,
  CopyAddressButton,
  LockedInPoolValue,
} from '@/components/por/supply-table/cells';
import type { SupplyTableFeatures } from '@/components/por/supply-table/table-features';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { ChainSupply } from '@/hooks/use-usd1-supply';
import {
  CHAIN_EXPLORER_URLS,
  CHAIN_META,
  CHAIN_TOKEN_ADDRESSES,
} from '@/lib/contracts/usd1-token';
import { compareSupply, formatSupply } from '@/lib/utils/format';

// ── Custom sorting: nulls always last ───────────────────────────────

const supplySort: SortFn<SupplyTableFeatures, ChainSupply> = (rowA, rowB) =>
  compareSupply(rowA.original.supply, rowB.original.supply);

// ── Column definitions ──────────────────────────────────────────────

export const columns: ColumnDef<SupplyTableFeatures, ChainSupply>[] = [
  {
    id: 'network',
    header: 'Network',
    cell: ({ row }) => {
      const { chain, label } = row.original;
      return (
        <div className="flex items-center gap-3">
          <ChainIcon chain={chain} label={label} />
          <span className="font-medium text-foreground">{label}</span>
        </div>
      );
    },
  },
  {
    id: 'contract',
    header: 'Contract',
    cell: ({ row }) => {
      const address = CHAIN_TOKEN_ADDRESSES[row.original.chain];
      return <CopyAddressButton address={address} />;
    },
  },
  {
    id: 'type',
    header: 'Type',
    size: 143, // fits "Bridged" label + cell padding without wrapping
    cell: ({ row }) => {
      const meta = CHAIN_META[row.original.chain];
      return (
        <span className="text-sm text-foreground">
          {meta.native ? 'Native' : 'Bridged'}
        </span>
      );
    },
  },
  {
    id: 'lockedInPool',
    header: () => (
      <div className="flex items-center justify-end gap-1">
        <span>Locked in CCIP</span>
        <Tooltip>
          <TooltipTrigger asChild>
            <button type="button" aria-label="What is Locked in CCIP?">
              <Info className="size-3.5 text-foreground-tertiary" />
            </button>
          </TooltipTrigger>
          <TooltipContent className="max-w-56">
            The exact amount of USD1 locked in the CCIP bridge contract only
          </TooltipContent>
        </Tooltip>
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex justify-end">
        <LockedInPoolValue chain={row.original} />
      </div>
    ),
  },
  {
    id: 'supply',
    accessorFn: (row) => row.supply,
    header: ({ column }) => {
      const sorted = column.getIsSorted();
      return (
        <Button
          variant="ghost"
          size="sm"
          className="-mr-3 ml-auto h-8 text-xs font-medium"
          onClick={() => column.toggleSorting(sorted === 'asc')}
        >
          Supply
          {sorted === 'asc' ? (
            <ArrowUp className="ml-1 size-3.5" />
          ) : sorted === 'desc' ? (
            <ArrowDown className="ml-1 size-3.5" />
          ) : (
            <ArrowUpDown className="ml-1 size-3.5" />
          )}
        </Button>
      );
    },
    sortFn: supplySort,
    cell: ({ row }) => {
      const { supply, isLoading, isError } = row.original;
      if (isLoading) return <Skeleton className="ml-auto h-4 w-32 rounded" />;
      if (isError)
        return (
          <span className="flex items-center justify-end gap-1.5 text-sm text-destructive">
            <TriangleAlertIcon className="size-3.5 shrink-0" />
            Failed to fetch
          </span>
        );
      if (supply == null)
        return <span className="text-sm text-foreground-tertiary">—</span>;
      return (
        <span className="text-sm font-medium text-foreground tabular-nums">
          {formatSupply(supply)}
        </span>
      );
    },
  },
  {
    id: 'actions',
    size: 80, // icon button width + padding
    header: '',
    cell: ({ row }) => {
      const explorerUrl = CHAIN_EXPLORER_URLS[row.original.chain];
      return (
        <div className="flex items-center justify-end gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href={explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View ${row.original.label} on explorer`}
                className="inline-flex size-8 items-center justify-center rounded-md text-brand-500 transition-opacity hover:opacity-70"
              >
                <ExternalLink className="size-4" />
              </Link>
            </TooltipTrigger>
            <TooltipContent>View on explorer</TooltipContent>
          </Tooltip>
        </div>
      );
    },
  },
];
