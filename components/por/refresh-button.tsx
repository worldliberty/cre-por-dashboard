'use client';

import { RefreshCw } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface RefreshButtonProps {
  onClick: () => void;
  isLoading: boolean;
}

export function RefreshButton({ onClick, isLoading }: RefreshButtonProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      disabled={isLoading}
      className="cursor-pointer gap-1.5 text-brand-500 hover:text-brand-600"
    >
      <RefreshCw className={`size-5 ${isLoading ? 'animate-spin' : ''}`} />
      <span className="hidden text-sm font-semibold md:inline">
        Refresh data
      </span>
    </Button>
  );
}
