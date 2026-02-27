import Link from 'next/link';

import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <section className="flex min-h-dvh flex-col items-center justify-center px-4">
      <p className="text-6xl font-light text-brand-500">404</p>
      <p className="mt-4 text-center text-2xl font-semibold">
        This page does not exist
      </p>
      <p className="mt-2 text-center text-sm text-foreground-tertiary">
        The page you are looking for does not exist or has been removed.
      </p>
      <Button asChild className="mt-6">
        <Link href="/">Go to home</Link>
      </Button>
    </section>
  );
}
