import { ExternalLink } from 'lucide-react';
import Link from 'next/link';

import { ETHERSCAN_URL } from '@/lib/contracts/por-oracle';

export function StatsGrid() {
  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
      <div className="rounded-xs border border-border-secondary bg-background px-3 py-2 shadow-input md:rounded-md md:px-5 md:py-3">
        <p className="text-sm text-foreground-tertiary">
          Collateralization Ratio
        </p>
        <p className="mt-0.5 text-sm font-medium text-foreground">
          100% (Fully backed 1:1)
        </p>
      </div>

      <div className="rounded-xs border border-border-secondary bg-background px-3 py-2 shadow-input md:rounded-md md:px-5 md:py-3">
        <p className="text-sm text-foreground-tertiary">Data source</p>
        <Link
          href={ETHERSCAN_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-0.5 flex items-center gap-1 text-sm font-medium text-foreground"
        >
          Chainlink Oracle
          <ExternalLink className="size-3.5 text-brand-500" />
        </Link>
      </div>
    </div>
  );
}
