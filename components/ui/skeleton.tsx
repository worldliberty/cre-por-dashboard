import { cn } from '@/lib/utils';

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-full bg-background-disabled',
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
