/** Null-safe comparator for supply values. Nulls always sort last. */
export function compareSupply(
  a: number | null | undefined,
  b: number | null | undefined,
): number {
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;
  return a - b;
}

export function formatSupply(n: number): string {
  if (!Number.isFinite(n)) return '—';
  return n.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/** Truncate a blockchain address for display (e.g. `0xAbCd...1234`). */
export function truncateAddress(address: string): string {
  // 16 chars = 6 prefix + "..." (3) + 4 suffix + margin; anything shorter is already readable
  if (address.length <= 16) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
