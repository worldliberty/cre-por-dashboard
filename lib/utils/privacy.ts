/**
 * Checks if the user has enabled a universal opt-out signal
 * (Do Not Track or Global Privacy Control).
 */
export function hasUniversalOptOut(): boolean {
  if (typeof navigator === 'undefined') return false;

  // Do Not Track
  if (navigator.doNotTrack === '1') return true;

  // Global Privacy Control
  // @ts-expect-error — GPC is not yet in the TS lib typings
  if (navigator.globalPrivacyControl === true) return true;

  return false;
}
