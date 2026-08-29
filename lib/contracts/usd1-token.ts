import { defineChain } from 'viem';
import { bsc, mainnet, mantle, morph, plumeMainnet } from 'wagmi/chains';

// ── EVM (shared address across Ethereum & BSC) ──────────────────────
export const USD1_EVM_ADDRESS =
  '0x8d0D000Ee44948FC98c9B98A4FA4921476f08B0d' as const;

// ── Bridged EVM address (shared across most non-native chains) ──────
export const USD1_BRIDGED_ADDRESS =
  '0x111111d2bf19e43C34263401e0CAd979eD1cdb61' as const;

// ── Tempo USD1 address (deployed at a different address than other chains) ──
export const USD1_TEMPO_ADDRESS =
  '0x20C000000000000000000000111111111E910F0f' as const;

// ── CCIP Pool addresses (for balanceOf locked values) ───────────────
// Chainlink CCIP Lock/Release pool addresses — these hold native USD1 that
// backs bridged supply on destination chains. When USD1 is bridged via CCIP,
// native tokens are locked in these pools and equivalent tokens are minted
// on the destination chain.
export const CCIP_POOL_ADDRESSES = {
  /** LockReleaseTokenPool on Ethereum — etherscan.io/address/0x36a72eD0096B414521C45E3ddC9ed657d1D9c141 */
  ethereum: '0x36a72eD0096B414521C45E3ddC9ed657d1D9c141',
  /** LockReleaseTokenPool on BSC — bscscan.com/address/0xCe3f7378aE409e1CE0dD6fFA70ab683326b73f04 */
  bsc: '0xCe3f7378aE409e1CE0dD6fFA70ab683326b73f04',
  /** CCIP pool on Tempo — explore.tempo.xyz/address/0x891F30e80B0809800BbaB14633F9eCe8Fc210024 */
  tempo: '0x891F30e80B0809800BbaB14633F9eCe8Fc210024',
  /** CCIP pool on Aptos (fungible asset address) */
  aptos: '0x1eb155d08acc900954b6ccee01659b390399ae81ad4c582b73d41374c475caf6',
  /**
   * CCIP pool *state* account on Solana (owned by the pool program
   * 41FGToCmdaWa1dgZLKFAjvmx6e6AjVTX7SVRibvsMGVB). This account holds no
   * tokens itself — the locked USD1 sits in `SOLANA_CONFIG.poolTokenAccount`,
   * which this state account references.
   */
  solana: 'B4PB9qWUW6R18Gbpk5Km8mJ2GoQgCcVpgdqhU7C2n8fh',
} as const;

// ── AB Core chain (not in viem/chains) ──────────────────────────────
// @see https://chainlist.org/chain/36888
export const ab = defineChain({
  id: 36888,
  name: 'AB Core',
  nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
  rpcUrls: { default: { http: ['https://rpc.core.ab.org'] } },
  contracts: {
    multicall3: {
      // Custom multicall3 deployment on AB Core — differs from the canonical
      // multicall3 address (0xcA11bde05977b3631167028862bE2a173976CA11).
      address: '0xCA1121f9E7cC4bCE32b5f1f15b3d01426F5cE2a8',
    },
  },
});

// ── Tron ─────────────────────────────────────────────────────────────
// Tron does not use CCIP — no pool balance to track.
export const TRON_CONFIG = {
  /** TRC-20 token address in Base58Check format (Tron-specific encoding) */
  address: 'TPFqcBAaaUMCSVRCqPaQ9QnzKhmuoLR6Rc',
  decimals: 18,
  rpcs: ['https://api.trongrid.io', 'https://api.tronstack.io'],
} as const;

// ── Solana ───────────────────────────────────────────────────────────
export const SOLANA_CONFIG = {
  /** USD1 is a classic SPL Token mint (owner: TokenkegQfeZ…), not Token-2022. */
  mint: 'USD1ttGY1N17NEEHLmELoaybftRBUSErhqYiQzvEmuB',
  /**
   * SPL token account holding the USD1 locked by the CCIP pool. Owned by the
   * pool signer PDA 76pV3FfBso49rV8bn5L3CUhrxKyiGvH7AeawNnY211t5, and
   * referenced at byte offset 106 of the pool state account
   * (`CCIP_POOL_ADDRESSES.solana`). It is *not* an associated token account,
   * so it cannot be derived — it must be read from the pool state.
   */
  poolTokenAccount: '8c2WaLy3aW9rnFaq8cCZUYnQNSVa9oX2eUun4buZqhmf',
  decimals: 6,
  /**
   * ⚠️ Keyless public RPCs no longer serve Solana's *indexed* methods
   * (getTokenSupply, getTokenAccountBalance, getTokenAccountsByOwner) — they
   * reply "Indexed requests require a personal token" or 403. Both fetchers
   * below therefore use plain `getAccountInfo` reads, which these endpoints
   * still serve. Verify any RPC added here answers getAccountInfo.
   */
  rpcs: [
    'https://solana-rpc.publicnode.com',
    'https://api.mainnet-beta.solana.com',
  ],
} as const;

// ── Aptos ────────────────────────────────────────────────────────────
export const APTOS_CONFIG = {
  /** Fungible asset metadata address on Aptos — @see https://explorer.aptoslabs.com/fungible_asset/0x05fabd1b12e39967a3c24e91b7b8f67719a6dacee74f3c8b9fb7d93e855437d2 */
  metadata:
    '0x05fabd1b12e39967a3c24e91b7b8f67719a6dacee74f3c8b9fb7d93e855437d2',
  decimals: 6,
} as const;

// ── Display metadata ─────────────────────────────────────────────────
// `native` = USD1 is natively minted on this chain (not "native currency").
// Bridged chains (`native: false`) receive USD1 via CCIP lock-and-mint.
//
// `decimals` = USD1 **token** decimals on that chain (NOT the chain's native
// currency decimals). On most EVM chains USD1 uses 18 decimals, which
// coincidentally matches `nativeCurrency.decimals` — we reference the chain
// object only for DRY convenience.
//
// ⚠️ That coincidence is not a rule: Monad (6) and Tempo (6) both diverge from
// their chain's `nativeCurrency.decimals` and are hardcoded. Getting this wrong
// silently misreports supply by orders of magnitude rather than erroring —
// Tempo read 18 here and rendered its 1,119.86 USD1 supply as "0.00". When
// adding a chain, read `decimals()` off the token contract instead of assuming.
export const CHAIN_META = {
  ethereum: {
    label: 'Ethereum',
    decimals: mainnet.nativeCurrency.decimals,
    native: true,
    hasCcipLock: true,
  },
  bsc: {
    label: 'BNB Chain',
    decimals: bsc.nativeCurrency.decimals,
    native: true,
    hasCcipLock: true,
  },
  tron: {
    label: 'Tron',
    decimals: TRON_CONFIG.decimals,
    native: true,
    hasCcipLock: false,
  },
  solana: {
    label: 'Solana',
    decimals: SOLANA_CONFIG.decimals,
    native: true,
    hasCcipLock: true,
  },
  aptos: {
    label: 'Aptos',
    decimals: APTOS_CONFIG.decimals,
    native: true,
    hasCcipLock: true,
  },
  // 6 decimals, verified against decimals() on 0x20C0…0F0f — not the 18 that
  // tempo.nativeCurrency.decimals reports.
  tempo: { label: 'Tempo', decimals: 6, native: true, hasCcipLock: true },
  plume: {
    label: 'Plume',
    decimals: plumeMainnet.nativeCurrency.decimals,
    native: false,
    hasCcipLock: false,
  },
  ab: {
    label: 'AB Core',
    decimals: ab.nativeCurrency.decimals,
    native: false,
    hasCcipLock: false,
  },
  monad: { label: 'Monad', decimals: 6, native: false, hasCcipLock: false },
  mantle: {
    label: 'Mantle',
    decimals: mantle.nativeCurrency.decimals,
    native: false,
    hasCcipLock: false,
  },
  morph: {
    label: 'Morph',
    decimals: morph.nativeCurrency.decimals,
    native: false,
    hasCcipLock: false,
  },
} as const;

export type ChainName = keyof typeof CHAIN_META;
export type NativeChainName =
  | 'ethereum'
  | 'bsc'
  | 'tron'
  | 'solana'
  | 'aptos'
  | 'tempo';
export type BridgedChainName = 'plume' | 'ab' | 'monad' | 'mantle' | 'morph';

// ── Token addresses per chain (for display / copy) ───────────────────
export const CHAIN_TOKEN_ADDRESSES: Record<ChainName, string> = {
  ethereum: USD1_EVM_ADDRESS,
  bsc: USD1_EVM_ADDRESS,
  tron: TRON_CONFIG.address,
  solana: SOLANA_CONFIG.mint,
  aptos: APTOS_CONFIG.metadata,
  tempo: USD1_TEMPO_ADDRESS,
  plume: USD1_BRIDGED_ADDRESS,
  ab: USD1_BRIDGED_ADDRESS,
  monad: USD1_BRIDGED_ADDRESS,
  mantle: USD1_BRIDGED_ADDRESS,
  morph: USD1_BRIDGED_ADDRESS,
};

// ── Block-explorer token page URLs ───────────────────────────────────
export const CHAIN_EXPLORER_URLS: Record<ChainName, string> = {
  ethereum: `https://etherscan.io/token/${USD1_EVM_ADDRESS}`,
  bsc: `https://bscscan.com/token/${USD1_EVM_ADDRESS}`,
  tron: `https://tronscan.org/#/token20/${TRON_CONFIG.address}`,
  solana: `https://solscan.io/token/${SOLANA_CONFIG.mint}`,
  aptos: `https://explorer.aptoslabs.com/fungible_asset/${APTOS_CONFIG.metadata}`,
  tempo: `https://explore.tempo.xyz/token/${USD1_TEMPO_ADDRESS}`,
  plume: `https://explorer.plume.org/token/${USD1_BRIDGED_ADDRESS}`,
  ab: `https://explorer.core.ab.org/token/${USD1_BRIDGED_ADDRESS}`,
  monad: `https://monadscan.com/token/${USD1_BRIDGED_ADDRESS}`,
  mantle: `https://mantlescan.xyz/token/${USD1_BRIDGED_ADDRESS}`,
  morph: `https://explorer.morphl2.io/token/${USD1_BRIDGED_ADDRESS}`,
};

// ── Chain icon paths ─────────────────────────────────────────────────
export const CHAIN_ICONS: Record<ChainName, string> = {
  ethereum: '/chains/ethereum.svg',
  bsc: '/chains/bsc.svg',
  tron: '/chains/tron.svg',
  solana: '/chains/solana.svg',
  aptos: '/chains/aptos.svg',
  tempo: '/chains/tempo.svg',
  plume: '/chains/plume.svg',
  ab: '/chains/ab.svg',
  monad: '/chains/monad.svg',
  mantle: '/chains/mantle.svg',
  morph: '/chains/morph.svg',
};

// ── Refresh interval (ms) ────────────────────────────────────────────
export const SUPPLY_REFRESH_INTERVAL = 60_000;
