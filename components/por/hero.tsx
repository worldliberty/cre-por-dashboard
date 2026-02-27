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
      ) : isError && !reserves ? (
        <p className="mb-6 text-4xl font-light text-destructive">
          Error loading data
        </p>
      ) : (
        <FormattedNumber
          value={reserves}
          symbol="USD"
          visibleDecimals={2}
          className="mb-6 text-3xl font-semibold text-brand-gradient md:text-4xl 2xl:text-5xl"
        />
      )}

      <p className="text-sm text-foreground-tertiary">
        {fetchTime ? `Last refresh: ${fetchTime}` : 'Loading...'}
      </p>
    </section>
  );
}
