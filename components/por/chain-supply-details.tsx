'use client';

import { Check, Copy, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { ChainSupply } from '@/hooks/use-usd1-supply';
import {
  CHAIN_EXPLORER_URLS,
  CHAIN_TOKEN_ADDRESSES,
} from '@/lib/contracts/usd1-token';

interface ChainSupplyDetailsProps {
  chains: ChainSupply[];
  totalRawSupply: string;
}

function formatSupply(n: number): string {
  return n.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function truncateAddress(address: string): string {
  if (address.length <= 16) return address;
  return `${address.slice(0, 8)}…${address.slice(-6)}`;
}

function ChainRow({ chainSupply }: { chainSupply: ChainSupply }) {
  const [copied, setCopied] = useState(false);
  const address = CHAIN_TOKEN_ADDRESSES[chainSupply.chain];
  const explorerUrl = CHAIN_EXPLORER_URLS[chainSupply.chain];

  function copyAddress() {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex flex-col gap-2 border-b border-border-secondary py-3 last:border-b-0 md:flex-row md:items-center md:justify-between">
      {/* Left: chain label + supply */}
      <div className="min-w-0">
        <p className="text-sm text-foreground-tertiary">{chainSupply.label}</p>
        <p className="mt-0.5 text-sm font-medium text-foreground">
          {chainSupply.isLoading ? (
            <span className="inline-block h-4 w-32 animate-pulse rounded bg-foreground/10" />
          ) : chainSupply.supply != null ? (
            `${formatSupply(chainSupply.supply)} USD1`
          ) : (
            '—'
          )}
        </p>
      </div>

      {/* Right: token address (truncated, copyable) + explorer link */}
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={copyAddress}
              className="flex items-center gap-1.5 font-mono text-sm text-foreground-tertiary transition-colors hover:text-foreground"
            >
              {truncateAddress(address)}
              {copied ? (
                <Check className="size-3.5 shrink-0 text-success-foreground" />
              ) : (
                <Copy className="size-3.5 shrink-0" />
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent>
            {copied ? 'Copied!' : 'Click to copy address'}
          </TooltipContent>
        </Tooltip>

        <Link
          href={explorerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-500 transition-opacity hover:opacity-70"
        >
          <ExternalLink className="size-3.5" />
        </Link>
      </div>
    </div>
  );
}

export function ChainSupplyDetails({
  chains,
  totalRawSupply,
}: ChainSupplyDetailsProps) {
  return (
    <Card className="border-border-secondary bg-background-secondary">
      <CardHeader>
        <CardTitle>USD1 Supply by Chain</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="-my-3">
          {chains.map((chain) => (
            <ChainRow key={chain.chain} chainSupply={chain} />
          ))}
        </div>
        {totalRawSupply && (
          <div className="mt-4 border-t border-border-secondary pt-4">
            <p className="text-sm text-foreground-tertiary">
              Raw total supply (18-decimal)
            </p>
            <p className="mt-0.5 break-all text-sm font-medium text-foreground">
              {totalRawSupply}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
