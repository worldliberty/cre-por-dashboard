import { InfoIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface StatsGridProps {
  collateralizationRatio: string;
  totalSupplyFormatted: string;
  isLoading: boolean;
  hasSupplyError?: boolean;
  hasReservesError?: boolean;
}

function StatCard({
  label,
  value,
  isLoading,
  hasError,
  errorTooltip,
  skeletonWidth,
}: {
  label: string;
  value: string;
  isLoading: boolean;
  hasError?: boolean;
  errorTooltip?: string;
  skeletonWidth: string;
}) {
  return (
    <div className="relative flex flex-col gap-2 rounded-xs border border-border-secondary bg-background px-3 py-2 md:rounded-md md:px-5 md:py-3">
      <p className="text-sm text-foreground-tertiary">{label}</p>
      {isLoading ? (
        <Skeleton className={`h-[30px] ${skeletonWidth}`} />
      ) : hasError ? (
        <div className="flex items-center gap-2">
          <p className="text-xl font-semibold leading-[30px] text-foreground-tertiary">
            Unavailable
          </p>
          {errorTooltip && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button type="button" aria-label="Error details">
                  <InfoIcon className="size-4 text-foreground-tertiary" />
                </button>
              </TooltipTrigger>
              <TooltipContent>{errorTooltip}</TooltipContent>
            </Tooltip>
          )}
        </div>
      ) : (
        <p className="truncate text-xl font-semibold leading-[30px] text-foreground">
          {value}
        </p>
      )}
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_0_16px_0_rgba(234,172,8,0.08)]" />
    </div>
  );
}

export function StatsGrid({
  collateralizationRatio,
  totalSupplyFormatted,
  isLoading,
  hasSupplyError,
  hasReservesError,
}: StatsGridProps) {
  const hasRatioError = hasSupplyError || hasReservesError;
  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
      <StatCard
        label="Collateralization Ratio"
        value={collateralizationRatio}
        isLoading={isLoading}
        hasError={hasRatioError}
        errorTooltip={
          hasReservesError && hasSupplyError
            ? 'Cannot compute — reserves and supply data failed to load'
            : hasReservesError
              ? 'Cannot compute — reserves data failed to load'
              : hasSupplyError
                ? 'Cannot compute — one or more supply RPCs failed'
                : undefined
        }
        skeletonWidth="w-32"
      />
      <StatCard
        label="Total supply"
        value={`${totalSupplyFormatted} USD1`}
        isLoading={isLoading}
        hasError={hasSupplyError}
        errorTooltip={
          hasSupplyError
            ? 'Incomplete — one or more supply RPCs failed'
            : undefined
        }
        skeletonWidth="w-48"
      />
    </div>
  );
}
