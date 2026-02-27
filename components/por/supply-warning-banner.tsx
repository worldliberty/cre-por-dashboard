import { RefreshCwIcon, TriangleAlertIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WarningBannerProps {
  message: string;
  refetch: () => void;
}

export function WarningBanner({ message, refetch }: WarningBannerProps) {
  return (
    <div
      role="alert"
      className="flex flex-col gap-3 rounded-xs border border-destructive/30 bg-destructive/5 px-3 py-2 sm:flex-row sm:items-center sm:justify-between md:rounded-md md:px-5 md:py-3"
    >
      <div className="flex items-start gap-2 sm:items-center">
        <TriangleAlertIcon className="mt-0.5 size-4 shrink-0 text-destructive sm:mt-0" />
        <p className="text-sm text-foreground-secondary">{message}</p>
      </div>
      <Button variant="outline" size="sm" onClick={refetch}>
        <RefreshCwIcon data-icon="inline-start" />
        Refresh
      </Button>
    </div>
  );
}
