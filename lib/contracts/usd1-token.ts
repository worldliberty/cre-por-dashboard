import { bsc, mainnet } from 'wagmi/chains';

// ── EVM (shared address across Ethereum & BSC) ──────────────────────
export const USD1_EVM_ADDRESS =
  '0x8d0D000Ee44948FC98c9B98A4FA4921476f08B0d' as const;

// ── Tron ─────────────────────────────────────────────────────────────
export const TRON_CONFIG = {
  address: 'TPFqcBAaaUMCSVRCqPaQ9QnzKhmuoLR6Rc',
  decimals: 18,
  rpcs: ['https://api.trongrid.io', 'https://api.tronstack.io'],
} as const;

// ── Solana ───────────────────────────────────────────────────────────
export const SOLANA_CONFIG = {
  mint: 'USD1ttGY1N17NEEHLmELoaybftRBUSErhqYiQzvEmuB',
  decimals: 6,
  rpcs: ['https://solana-rpc.publicnode.com', 'https://rpc.ankr.com/solana'],
} as const;

// ── Aptos ────────────────────────────────────────────────────────────
export const APTOS_CONFIG = {
  metadata:
    '0x05fabd1b12e39967a3c24e91b7b8f67719a6dacee74f3c8b9fb7d93e855437d2',
  decimals: 6,
} as const;

// ── Display metadata ─────────────────────────────────────────────────
export const CHAIN_META = {
  ethereum: { label: 'Ethereum', decimals: mainnet.nativeCurrency.decimals },
  bsc: { label: 'BNB Chain', decimals: bsc.nativeCurrency.decimals },
  tron: { label: 'Tron', decimals: TRON_CONFIG.decimals },
  solana: { label: 'Solana', decimals: SOLANA_CONFIG.decimals },
  aptos: { label: 'Aptos', decimals: APTOS_CONFIG.decimals },
} as const;

export type ChainName = keyof typeof CHAIN_META;

// ── Token addresses per chain (for display / copy) ───────────────────
export const CHAIN_TOKEN_ADDRESSES: Record<ChainName, string> = {
  ethereum: USD1_EVM_ADDRESS,
  bsc: USD1_EVM_ADDRESS,
  tron: TRON_CONFIG.address,
  solana: SOLANA_CONFIG.mint,
  aptos: APTOS_CONFIG.metadata,
};

// ── Block-explorer token page URLs ───────────────────────────────────
export const CHAIN_EXPLORER_URLS: Record<ChainName, string> = {
  ethereum: `https://etherscan.io/token/${USD1_EVM_ADDRESS}`,
  bsc: `https://bscscan.com/token/${USD1_EVM_ADDRESS}`,
  tron: `https://tronscan.org/#/token20/${TRON_CONFIG.address}`,
  solana: `https://solscan.io/token/${SOLANA_CONFIG.mint}`,
  aptos: `https://explorer.aptoslabs.com/fungible_asset/${APTOS_CONFIG.metadata}`,
};

// ── Refresh interval (ms) ────────────────────────────────────────────
export const SUPPLY_REFRESH_INTERVAL = 60_000;
