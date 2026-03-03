/**
 * Analytics consent store.
 *
 * Consent lifecycle: `null` (undecided → banner shown) →
 * `'granted'` (accepted) | `'denied'` (rejected).
 * DNT / GPC are checked separately via `hasUniversalOptOut()`.
 */

import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { getCookies, removeCookie } from 'typescript-cookie';

import { clientEnv } from '@/lib/config/client';
import { hasUniversalOptOut } from '@/lib/utils/privacy';

const GA_ID = clientEnv.NEXT_PUBLIC_GOOGLE_ID;
const GA_COOKIE_RE = /^(_ga|_gid|_gat|AMP_TOKEN|_gac_)/;

// ── Consent ──────────────────────────────────────────────────────────

type ConsentState = 'granted' | 'denied' | null;

/**
 * Persisted consent state: `null` = undecided, `'granted'` = accepted, `'denied'` = rejected.
 */
export const acceptedAnalyticsAtom = atomWithStorage<ConsentState>(
  'analytics-consent',
  null,
);

/** Remove all Google Analytics cookies from the current domain. */
export function clearGoogleAnalyticsCookies() {
  const domainParts = window.location.hostname.split('.');
  const domains = domainParts
    .map((_, i) => domainParts.slice(i).join('.'))
    .flatMap((d) => [d, `.${d}`]);

  for (const name of Object.keys(getCookies())) {
    if (!GA_COOKIE_RE.test(name)) continue;
    for (const domain of domains) {
      removeCookie(name, { domain, path: '/' });
    }
    removeCookie(name, { path: '/' });
  }
}

/** Write-only: accept analytics → grant consent + configure GA. */
export const acceptAnalyticsAtom = atom(null, (_get, set) => {
  set(acceptedAnalyticsAtom, 'granted');

  if (typeof window.gtag !== 'function') return;
  window.gtag('consent', 'update', { analytics_storage: 'granted' });
  window.gtag('config', GA_ID, { send_page_view: false });
});

/** Write-only: reject analytics → deny consent + clear GA cookies. */
export const rejectAnalyticsAtom = atom(null, (_get, set) => {
  set(acceptedAnalyticsAtom, 'denied');

  if (typeof window.gtag === 'function') {
    window.gtag('consent', 'update', { analytics_storage: 'denied' });
  }
  clearGoogleAnalyticsCookies();
});

// ── Tracking ────────────────────────────────────────────────────────

export const isTrackingEnabledAtom = atom((get) => {
  if (!GA_ID) return false;
  if (get(acceptedAnalyticsAtom) !== 'granted') return false;
  return !hasUniversalOptOut();
});

export const trackPageViewAtom = atom(null, (get, _set, pagePath: string) => {
  if (!get(isTrackingEnabledAtom)) return;
  if (typeof window.gtag !== 'function') return;
  window.gtag('config', GA_ID, { page_path: pagePath });
});
