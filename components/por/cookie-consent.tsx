'use client';

import { useAtomValue, useSetAtom } from 'jotai';
import { CookieIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useIsClient } from 'usehooks-ts';
import { Button } from '@/components/ui/button';
import { clientEnv } from '@/lib/config/client';
import {
  acceptAnalyticsAtom,
  acceptedAnalyticsAtom,
  rejectAnalyticsAtom,
} from '@/lib/store/analytics';

export function CookieConsent() {
  const isClient = useIsClient();
  const consent = useAtomValue(acceptedAnalyticsAtom);
  const accept = useSetAtom(acceptAnalyticsAtom);
  const reject = useSetAtom(rejectAnalyticsAtom);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (consent !== null || !clientEnv.NEXT_PUBLIC_GOOGLE_ID) return;
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, [consent]);

  if (!isClient) return null;
  if (!clientEnv.NEXT_PUBLIC_GOOGLE_ID) return null;
  if (consent !== null) return null;

  return (
    <div
      className={`fixed bottom-4 right-4 left-4 z-50 mx-auto max-w-md rounded-xl border border-border bg-background/95 p-4 shadow-lg backdrop-blur-sm transition-all duration-300 sm:left-auto sm:mx-0 ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}
    >
      <div className="flex items-start gap-3">
        <CookieIcon className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
        <div className="flex-1 space-y-3">
          <p className="text-sm text-muted-foreground">
            We use cookies and tracking technologies to enhance your experience
            and analyze site usage. Click &quot;Accept&quot; to allow all
            cookies and tracking technologies or &quot;Reject&quot; to decline
            non-essential cookies. Learn more in our{' '}
            <a
              href="https://docs.worldlibertyfinancial.com/legal/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 hover:text-foreground"
            >
              Privacy Policy
            </a>
          </p>
          <div className="flex gap-2">
            <Button size="sm" variant="default" onClick={() => accept()}>
              Accept
            </Button>
            <Button size="sm" variant="outline" onClick={() => reject()}>
              Reject
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
