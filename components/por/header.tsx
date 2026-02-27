'use client';

import { RefreshCw } from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';

interface HeaderProps {
  onRefresh: () => void;
  isLoading: boolean;
}

export function Header({ onRefresh, isLoading }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 flex justify-center px-4 pt-3 md:px-6 xl:px-40">
      <nav className="flex h-11 w-full max-w-5xl items-center justify-between rounded-full border border-border-secondary bg-background/80 px-4 backdrop-blur-xl md:h-[52px] md:px-6">
        <div className="flex items-center gap-2">
          <Image
            src="https://static.worldlibertyfinancial.com/assets/brand/usd1.svg"
            alt="USD1"
            width={32}
            height={32}
            className="size-8 shrink-0"
          />
          <span className="text-sm font-medium text-foreground md:text-base">
            Proof of Reserves
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onRefresh}
          disabled={isLoading}
          className="cursor-pointer gap-1.5 text-brand-500 hover:text-brand-600"
        >
          <span className="hidden sm:inline">Refresh data</span>
          <RefreshCw className={`size-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </nav>
    </header>
  );
}
