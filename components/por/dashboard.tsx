'use client';

import { ChainSupplyDetails } from '@/components/por/chain-supply-details';
import { ContractDetails } from '@/components/por/contract-details';
import { Footer } from '@/components/por/footer';
import { Header } from '@/components/por/header';
import { Hero } from '@/components/por/hero';
import { StatsGrid } from '@/components/por/stats-grid';
import { WarningBanner } from '@/components/por/supply-warning-banner';
import { usePorData } from '@/hooks/use-por-data';
import { useUsd1Supply } from '@/hooks/use-usd1-supply';

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

  const {
    chains,
    totalSupply,
    totalSupplyFormatted,
    totalRawSupply,
    isLoading: supplyLoading,
    isAllSettled,
    hasPartialError,
    isAllError,
    erroredChains,
    refetch: refetchSupply,
  } = useUsd1Supply();

  const supplyError = hasPartialError || isAllError;
  const reservesError = isError;
  const allReady = isAllSettled && !isLoading;
  const hasAnyError = supplyError || reservesError;

  const collateralizationRatio =
    allReady && !hasAnyError && totalSupply > 0 && reserves > 0
      ? `${((reserves / totalSupply) * 100).toFixed(2)}%`
      : '—';

  return (
    <div className="flex min-h-dvh flex-col">
      <Header
        onRefresh={() => {
          refetch();
          refetchSupply();
        }}
        isLoading={isLoading || supplyLoading}
      />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 md:gap-8 md:px-6 xl:px-0 mb-20">
        <Hero
          reserves={reserves}
          fetchTime={fetchTime}
          isLoading={isLoading}
          isError={isError}
        />
        {allReady && reservesError && (
          <WarningBanner
            message="Failed to fetch reserves data — collateralization ratio is unavailable."
            refetch={refetch}
          />
        )}
        {allReady && supplyError && (
          <WarningBanner
            message={
              isAllError
                ? 'All supply RPCs failed — collateralization ratio is unavailable.'
                : `Failed to fetch supply from ${erroredChains.join(', ')} — collateralization ratio is unavailable.`
            }
            refetch={refetchSupply}
          />
        )}
        <StatsGrid
          collateralizationRatio={collateralizationRatio}
          totalSupplyFormatted={totalSupplyFormatted}
          isLoading={!allReady}
          hasSupplyError={allReady && supplyError}
          hasReservesError={allReady && reservesError}
        />
        <ContractDetails
          blockNumber={blockNumber}
          rawValue={rawValue}
          decimals={decimals}
          bundleTimestamp={bundleTimestamp}
          fetchTime={fetchTime}
        />
        <ChainSupplyDetails chains={chains} totalRawSupply={totalRawSupply} />
      </main>
      <div className="mx-auto w-full max-w-5xl px-4 md:px-6 xl:px-0">
        <Footer />
      </div>
    </div>
  );
}
