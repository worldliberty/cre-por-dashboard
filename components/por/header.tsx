'use client';

import Image from 'next/image';
import Link from 'next/link';
import { RefreshButton } from '@/components/por/refresh-button';
import { RpcSettingsDialog } from '@/components/por/rpc-settings-dialog';

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
        <div className="flex items-center gap-4">
          <Link
            href="https://github.com/worldliberty/cre-por-dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-foreground-secondary transition-colors hover:text-foreground"
          >
            <svg
              role="img"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              className="size-5 fill-current"
            >
              <title>GitHub</title>
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
            <span className="hidden text-sm font-semibold md:inline">
              Go to Github
            </span>
          </Link>
          <RpcSettingsDialog />
          <RefreshButton onClick={onRefresh} isLoading={isLoading} />
        </div>
      </nav>
    </header>
  );
}
