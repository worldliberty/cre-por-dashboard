'use client';

import { Check, Copy, TriangleAlertIcon } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useCopyToClipboard } from 'usehooks-ts';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { ChainSupply } from '@/hooks/use-usd1-supply';
import { CHAIN_ICONS, CHAIN_META } from '@/lib/contracts/usd1-token';
import { formatSupply, truncateAddress } from '@/lib/utils/format';

export function ChainIcon({ chain, label }: { chain: string; label: string }) {
  const src = CHAIN_ICONS[chain as keyof typeof CHAIN_ICONS];
  const [errored, setErrored] = useState(false);

  if (!src || errored) {
    return (
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-foreground/10 text-xs font-bold text-foreground">
        {label.charAt(0)}
      </span>
    );
  }

  return (
    <Image
      src={src}
      alt={label}
      width={32}
      height={32}
      className="size-8 shrink-0 rounded-full"
      onError={() => setErrored(true)}
    />
  );
}

export function CopyAddressButton({ address }: { address: string }) {
  const [, copyFn] = useCopyToClipboard();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(id);
  }, [copied]);

  async function copy() {
    const ok = await copyFn(address);
    if (ok) setCopied(true);
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={copy}
          className="ml-auto flex items-center gap-1.5 font-mono text-sm text-foreground-tertiary transition-colors hover:text-foreground"
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
  );
}

/** Shared rendering for the "Locked in CCIP" value (used in desktop + mobile). */
export function LockedInPoolValue({ chain }: { chain: ChainSupply }) {
  const meta = CHAIN_META[chain.chain];

  if (chain.isLoading) return <Skeleton className="h-4 w-24 rounded" />;

  if (chain.isError)
    return (
      <span className="flex items-center gap-1.5 text-sm text-destructive">
        <TriangleAlertIcon className="size-3.5 shrink-0" />
        Failed
      </span>
    );

  if (chain.lockedInPool != null && chain.lockedInPool !== 0)
    return (
      <span className="text-sm font-medium text-foreground tabular-nums">
        {formatSupply(chain.lockedInPool)}
      </span>
    );

  if (meta.hasCcipLock)
    return (
      <span className="text-sm font-medium text-foreground tabular-nums">
        {formatSupply(0)}
      </span>
    );

  return <span className="text-sm text-foreground-tertiary">N/A</span>;
}
