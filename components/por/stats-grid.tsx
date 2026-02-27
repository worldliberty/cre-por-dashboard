import { Skeleton } from '@/components/ui/skeleton';

interface StatsGridProps {
  collateralizationRatio: string;
  totalSupplyFormatted: string;
  isLoading: boolean;
}

export function StatsGrid({
  collateralizationRatio,
  totalSupplyFormatted,
  isLoading,
}: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
      <div className="relative flex flex-col gap-2 rounded-xs border border-border-secondary bg-background px-3 py-2 md:rounded-md md:px-5 md:py-3">
        <p className="text-sm text-foreground-tertiary">
          Collateralization Ratio
        </p>
        {isLoading ? (
          <Skeleton className="h-[30px] w-32" />
        ) : (
          <p className="truncate text-xl font-semibold leading-[30px] text-foreground">
            {collateralizationRatio}
          </p>
        )}
        <div className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_0_16px_0_rgba(234,172,8,0.08)]" />
      </div>

      <div className="relative flex flex-col gap-2 rounded-xs border border-border-secondary bg-background px-3 py-2 md:rounded-md md:px-5 md:py-3">
        <p className="text-sm text-foreground-tertiary">Total supply</p>
        {isLoading ? (
          <Skeleton className="h-[30px] w-48" />
        ) : (
          <p className="truncate text-xl font-semibold leading-[30px] text-foreground">
            {totalSupplyFormatted} USD1
          </p>
        )}
        <div className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_0_16px_0_rgba(234,172,8,0.08)]" />
      </div>
    </div>
  );
}
