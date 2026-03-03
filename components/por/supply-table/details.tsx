'use client';

import type { SortingState, VisibilityState } from '@tanstack/react-table';
import { Columns3, RefreshCw } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useIsClient, useMediaQuery } from 'usehooks-ts';
import {
  DesktopTable,
  DesktopTableSkeleton,
} from '@/components/por/supply-table/desktop-table';
import {
  MobileLayout,
  MobileLayoutSkeleton,
  MobileSortButton,
} from '@/components/por/supply-table/mobile-layout';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { ChainSupply } from '@/hooks/use-usd1-supply';
import { CHAIN_META } from '@/lib/contracts/usd1-token';

const TOGGLEABLE_COLUMNS = [
  { id: 'type', label: 'Type' },
  { id: 'lockedInPool', label: 'Locked in CCIP' },
] as const;

const DEFAULT_HIDDEN: VisibilityState = { type: false, lockedInPool: false };

interface ChainSupplyDetailsProps {
  nativeChains: ChainSupply[];
  bridgedChains: ChainSupply[];
}

export function ChainSupplyDetails({
  nativeChains,
  bridgedChains,
}: ChainSupplyDetailsProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)', {
    defaultValue: true,
    initializeWithValue: false,
  });

  const mounted = useIsClient();
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'supply', desc: true },
  ]);

  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>(DEFAULT_HIDDEN);
  const showDetails =
    columnVisibility.type !== false || columnVisibility.lockedInPool !== false;
  const toggleColumn = (columnId: string) =>
    setColumnVisibility((prev) => ({
      ...prev,
      [columnId]: prev[columnId] === false,
    }));

  const sortDesc = sorting[0]?.id === 'supply' ? sorting[0].desc : true;

  const allChains = useMemo(
    () => [...nativeChains, ...bridgedChains],
    [nativeChains, bridgedChains],
  );

  const rawTotalSupply = useMemo(() => {
    const entries = nativeChains.flatMap((c) =>
      c.rawSupply != null
        ? [{ raw: c.rawSupply, decimals: CHAIN_META[c.chain].decimals }]
        : [],
    );
    if (entries.length === 0) return null;
    const sum = entries.reduce((acc, { raw, decimals }) => {
      if (decimals > 18)
        throw new Error(`Unsupported token decimals > 18: ${decimals}`);
      return acc + raw * 10n ** BigInt(18 - decimals);
    }, 0n);
    return sum.toString();
  }, [nativeChains]);

  const isLoading = allChains.some((c) => c.isLoading);
  const rowCount = allChains.length;

  const showSpinner = !mounted || isLoading;

  const content = showSpinner ? (
    !mounted ? (
      <div className="flex flex-1 items-center justify-center">
        <RefreshCw className="size-5 animate-spin text-brand-500" />
      </div>
    ) : isDesktop ? (
      <DesktopTableSkeleton rowCount={rowCount} showDetails={showDetails} />
    ) : (
      <MobileLayoutSkeleton
        rowCount={rowCount}
        columnVisibility={columnVisibility}
      />
    )
  ) : isDesktop ? (
    <DesktopTable
      data={allChains}
      sorting={sorting}
      onSortingChange={setSorting}
      columnVisibility={columnVisibility}
      onColumnVisibilityChange={setColumnVisibility}
    />
  ) : (
    <MobileLayout
      data={allChains}
      sortDesc={sortDesc}
      columnVisibility={columnVisibility}
    />
  );

  return (
    <Card
      aria-busy={showSpinner}
      // min-height prevents layout shift while data loads (10 rows × ~52px + header/footer)
      className="min-h-[600px] border-border-secondary bg-background-secondary"
    >
      <CardHeader className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle className="text-lg font-semibold">
          Total supply by network
        </CardTitle>
        {mounted && (
          <div className="flex items-center gap-1">
            {!isDesktop && (
              <MobileSortButton
                sortDesc={sortDesc}
                onToggle={() => setSorting([{ id: 'supply', desc: !sortDesc }])}
              />
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="-mr-3 h-8 gap-1.5 text-xs sm:mr-0"
                >
                  <Columns3 className="size-3.5" />
                  Customize
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {TOGGLEABLE_COLUMNS.map(({ id, label }) => (
                  <DropdownMenuCheckboxItem
                    key={id}
                    checked={columnVisibility[id] !== false}
                    onCheckedChange={() => toggleColumn(id)}
                  >
                    {label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </CardHeader>
      {content}
      {rawTotalSupply && (
        <div className="flex flex-col gap-0.5 border-t border-border-secondary px-4 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
          <p className="shrink-0 text-sm text-foreground-tertiary">
            Raw total supply (18-decimal)
          </p>
          <p className="break-all text-sm font-medium text-foreground pr-0 md:pr-18">
            {rawTotalSupply}
          </p>
        </div>
      )}
    </Card>
  );
}
