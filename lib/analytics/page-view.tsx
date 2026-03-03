'use client';

import { useSetAtom } from 'jotai';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

import { trackPageViewAtom } from '@/lib/store/analytics';

export function PageView() {
  const pathname = usePathname();
  const trackPageView = useSetAtom(trackPageViewAtom);

  useEffect(() => {
    trackPageView(pathname);
  }, [pathname, trackPageView]);

  return null;
}
