'use client';

import { ContractDetails } from '@/components/por/contract-details';
import { Footer } from '@/components/por/footer';
import { Header } from '@/components/por/header';
import { Hero } from '@/components/por/hero';
import { StatsGrid } from '@/components/por/stats-grid';
import { usePorData } from '@/hooks/use-por-data';

export function PorDashboard() {
  const {
    reserves,
    rawValue,
    blockNumber,
    decimals,
    bundleTimestamp,
    fetchTime,
    isLoading,
    isError,
    refetch,
  } = usePorData();

  return (
    <div className="flex min-h-dvh flex-col">
      <Header onRefresh={refetch} isLoading={isLoading} />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 md:gap-8 md:px-6 xl:px-0">
        <Hero
          reserves={reserves}
          fetchTime={fetchTime}
          isLoading={isLoading}
          isError={isError}
        />
        <StatsGrid />
        <ContractDetails
          blockNumber={blockNumber}
          rawValue={rawValue}
          decimals={decimals}
          bundleTimestamp={bundleTimestamp}
          fetchTime={fetchTime}
        />
      </main>
      <div className="mx-auto w-full max-w-5xl px-4 md:px-6 xl:px-0">
        <Footer />
      </div>
    </div>
  );
}
