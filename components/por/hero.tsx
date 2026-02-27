import { TriangleAlertIcon } from 'lucide-react';
import { FormattedNumber } from '@/components/primitives/formatted-number';
import { Skeleton } from '@/components/ui/skeleton';

interface HeroProps {
  reserves: number;
  fetchTime: string;
  isLoading: boolean;
  isError: boolean;
}

export function Hero({ reserves, fetchTime, isLoading, isError }: HeroProps) {
  return (
    <section className="rounded-b-3xl py-16 text-center md:py-20">
      <p className="mb-6 text-sm text-foreground-secondary">
        Total reserves backing USD1
      </p>

      {isLoading && !reserves ? (
        <Skeleton className="mx-auto mb-6 h-[44px] w-80 max-w-full rounded-xl md:h-[60px] xl:h-[72px]" />
      ) : isError ? (
        <div className="mb-6 flex flex-col items-center gap-2">
          <p className="text-4xl font-semibold text-foreground-tertiary sm:text-5xl md:text-6xl">
            N/A
          </p>
          <p className="flex items-center gap-1.5 text-sm text-destructive">
            <TriangleAlertIcon className="size-3.5 shrink-0" />
            Unable to fetch reserves data
          </p>
        </div>
      ) : (
        <FormattedNumber
          value={reserves}
          symbol="USD"
          visibleDecimals={2}
          className="mb-6 text-4xl sm:text-5xl font-semibold text-brand-gradient md:text-6xl"
        />
      )}

      <p className="text-sm text-foreground-tertiary">
        {fetchTime ? `Last refresh: ${fetchTime}` : 'Loading...'}
      </p>
    </section>
  );
}
