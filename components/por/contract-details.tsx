'use client';

import { Check, Copy, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { useState } from 'react';

import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ETHERSCAN_URL, POR_ORACLE_ADDRESS } from '@/lib/contracts/por-oracle';

interface ContractDetailsProps {
  blockNumber: string;
  rawValue: string;
  decimals: number;
  bundleTimestamp?: number;
  fetchTime: string;
}

function DetailField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="min-w-0 flex-1 basis-full md:basis-[calc(50%-12px)]">
      <p className="text-sm text-foreground-tertiary">{label}</p>
      <div className="mt-0.5 text-sm font-medium text-foreground">
        {children}
      </div>
    </div>
  );
}

export function ContractDetails({
  blockNumber,
  rawValue,
  decimals,
  bundleTimestamp,
  fetchTime,
}: ContractDetailsProps) {
  const [copied, setCopied] = useState(false);

  function copyAddress() {
    navigator.clipboard.writeText(POR_ORACLE_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Card className="border-border-secondary bg-background-secondary">
      <CardHeader>
        <CardTitle>Contract info</CardTitle>
        <CardAction>
          <Link
            href={ETHERSCAN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm font-medium text-brand-500 transition-opacity hover:opacity-70"
          >
            View on Etherscan
            <ExternalLink className="size-3.5" />
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-6">
          <DetailField label="Oracle contract">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={copyAddress}
                  className="flex items-center gap-1.5 break-all text-left font-mono"
                >
                  {POR_ORACLE_ADDRESS}
                  {copied ? (
                    <Check className="size-3.5 shrink-0 text-success-foreground" />
                  ) : (
                    <Copy className="size-3.5 shrink-0 text-foreground-tertiary" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent>
                {copied ? 'Copied!' : 'Click to copy'}
              </TooltipContent>
            </Tooltip>
          </DetailField>

          <DetailField label="Latest block">
            {blockNumber || '\u2014'}
          </DetailField>

          <DetailField label="Function">latestBundle()</DetailField>

          <DetailField label="Raw value">
            <span className="break-all">{rawValue || '\u2014'}</span>
          </DetailField>

          <DetailField label="Decimals">{String(decimals)}</DetailField>

          <DetailField label="Last updated">
            {bundleTimestamp
              ? new Date(bundleTimestamp * 1000).toLocaleString()
              : fetchTime || '\u2014'}
          </DetailField>
        </div>
      </CardContent>
    </Card>
  );
}
