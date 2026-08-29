'use client';

import type {
  ColumnVisibilityState,
  SortingState,
} from '@tanstack/react-table';
import { flexRender, useTable } from '@tanstack/react-table';
import { columns } from '@/components/por/supply-table/columns';
import { supplyTableFeatures } from '@/components/por/supply-table/table-features';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { ChainSupply } from '@/hooks/use-usd1-supply';

// ── Desktop Table ───────────────────────────────────────────────────

export function DesktopTable({
  data,
  sorting,
  onSortingChange,
  columnVisibility,
  onColumnVisibilityChange,
}: {
  data: ChainSupply[];
  sorting: SortingState;
  onSortingChange: (sorting: SortingState) => void;
  columnVisibility: ColumnVisibilityState;
  onColumnVisibilityChange: (visibility: ColumnVisibilityState) => void;
}) {
  const table = useTable({
    features: supplyTableFeatures,
    data,
    columns,
    state: { sorting, columnVisibility },
    onSortingChange: (updater) => {
      const next = typeof updater === 'function' ? updater(sorting) : updater;
      onSortingChange(next);
    },
    onColumnVisibilityChange: (updater) => {
      const next =
        typeof updater === 'function' ? updater(columnVisibility) : updater;
      onColumnVisibilityChange(next);
    },
  });

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow
            key={headerGroup.id}
            className="border-b border-border-secondary bg-transparent hover:bg-transparent"
          >
            {headerGroup.headers.map((header, i) => (
              <TableHead
                key={header.id}
                className={`h-11 px-4 text-xs font-medium text-foreground-tertiary ${i > 0 ? 'text-right' : ''}`}
                aria-sort={
                  header.column.getIsSorted() === 'asc'
                    ? 'ascending'
                    : header.column.getIsSorted() === 'desc'
                      ? 'descending'
                      : header.column.getCanSort()
                        ? 'none'
                        : undefined
                }
                style={
                  // 150 is @tanstack/react-table's default column size — only
                  // apply an explicit width when a column defines a custom size.
                  header.column.getSize() !== 150
                    ? { width: header.column.getSize() }
                    : undefined
                }
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.map((row) => (
          <TableRow
            key={row.id}
            className="h-[72px] border-b border-border-secondary last:border-b-0"
          >
            {row.getVisibleCells().map((cell, i) => (
              <TableCell
                key={cell.id}
                className={`px-4 ${i > 0 ? 'text-right' : ''}`}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

// ── Desktop Table Skeleton ──────────────────────────────────────────

export function DesktopTableSkeleton({
  rowCount,
  showDetails = false,
}: {
  rowCount: number;
  showDetails?: boolean;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="border-b border-border-secondary bg-transparent hover:bg-transparent">
          <TableHead className="h-11 px-4 text-xs font-medium text-foreground-tertiary">
            Network
          </TableHead>
          <TableHead className="h-11 px-4 text-xs font-medium text-foreground-tertiary text-right">
            Contract
          </TableHead>
          {showDetails && (
            <TableHead className="h-11 px-4 text-xs font-medium text-foreground-tertiary text-right">
              Type
            </TableHead>
          )}
          {showDetails && (
            <TableHead className="h-11 px-4 text-xs font-medium text-foreground-tertiary text-right">
              Locked in CCIP
            </TableHead>
          )}
          <TableHead className="h-11 px-4 text-xs font-medium text-foreground-tertiary text-right">
            Supply
          </TableHead>
          <TableHead className="h-11 w-[80px] px-4" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: rowCount }, (_, i) => `skeleton-${i}`).map(
          (key) => (
            <TableRow
              key={key}
              className="h-[72px] border-b border-border-secondary last:border-b-0"
            >
              <TableCell className="px-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="size-8 rounded-full" />
                  <Skeleton className="h-4 w-24 rounded" />
                </div>
              </TableCell>
              <TableCell className="px-4 text-right">
                <Skeleton className="ml-auto h-4 w-28 rounded" />
              </TableCell>
              {showDetails && (
                <TableCell className="px-4 text-right">
                  <Skeleton className="ml-auto h-4 w-16 rounded" />
                </TableCell>
              )}
              {showDetails && (
                <TableCell className="px-4 text-right">
                  <Skeleton className="ml-auto h-4 w-24 rounded" />
                </TableCell>
              )}
              <TableCell className="px-4 text-right">
                <Skeleton className="ml-auto h-4 w-32 rounded" />
              </TableCell>
              <TableCell className="px-4">
                <Skeleton className="ml-auto size-4 rounded" />
              </TableCell>
            </TableRow>
          ),
        )}
      </TableBody>
    </Table>
  );
}
