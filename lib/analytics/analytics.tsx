'use client';

import { useAtomValue } from 'jotai';
import Script from 'next/script';
import { useEffect } from 'react';
import { clientEnv } from '@/lib/config/client';
import {
  acceptedAnalyticsAtom,
  clearGoogleAnalyticsCookies,
} from '@/lib/store/analytics';
import { hasUniversalOptOut } from '@/lib/utils/privacy';

const GA_ID = clientEnv.NEXT_PUBLIC_GOOGLE_ID;

const CONSENT_SCRIPT = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', { analytics_storage: 'denied' });
`;

const INIT_SCRIPT = `
window.dataLayer = window.dataLayer || [];
gtag('js', new Date());
`;

export function Analytics() {
  const consent = useAtomValue(acceptedAnalyticsAtom);

  useEffect(() => {
    if (!GA_ID) return;
    if (typeof window.gtag !== 'function') return;

    if (consent === 'granted' && !hasUniversalOptOut()) {
      window.gtag('consent', 'update', { analytics_storage: 'granted' });
      window.gtag('config', GA_ID, { send_page_view: false });
    } else if (consent === 'denied') {
      window.gtag('consent', 'update', { analytics_storage: 'denied' });
      clearGoogleAnalyticsCookies();
    }
  }, [consent]);

  if (!GA_ID) return null;

  return (
    <>
      {/* biome-ignore lint/correctness/useUniqueElementIds: next/script requires static id */}
      <Script id="gtag-consent" strategy="afterInteractive">
        {CONSENT_SCRIPT}
      </Script>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      {/* biome-ignore lint/correctness/useUniqueElementIds: next/script requires static id */}
      <Script id="gtag-init" strategy="afterInteractive">
        {INIT_SCRIPT}
      </Script>
    </>
  );
}
