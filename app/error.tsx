'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

import { Button } from '@/components/ui/button';

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const pathname = usePathname();
  const isHome = pathname === '/';

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="flex min-h-dvh flex-col items-center justify-center px-4">
      <p className="text-6xl font-light text-brand-500">500</p>
      <p className="mt-4 text-center text-2xl font-semibold">
        Oops! It&apos;s not you, it&apos;s us.
      </p>
      <p className="mt-2 text-center text-sm text-foreground-tertiary">
        Something broke, but we&apos;re working on it!
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button onClick={reset}>Try Again</Button>
        {!isHome && (
          <Button asChild variant="outline">
            <Link href="/">Go to home</Link>
          </Button>
        )}
      </div>
    </section>
  );
}
