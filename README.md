# USD1 Proof of Reserves Dashboard

**Live at [por.worldlibertyfinancial.com](https://por.worldlibertyfinancial.com)**

A real-time dashboard that reads [USD1](https://worldlibertyfinancial.com) stablecoin reserve data from a Chainlink oracle on Ethereum and tracks USD1 total supply across ten chains — five native (Ethereum, BNB Chain, Tron, Solana, Aptos) and five bridged (Plume, AB Core, Monad, Mantle, Morph). All data is sourced on-chain — no backend, no API keys required.

## Features

- Live reserves data, posted to Ethereum mainnet every 10 mins
- On-chain data via Chainlink oracle (`latestBundle()` + `bundleDecimals()`)
- Multi-chain USD1 supply tracking across 10 chains (5 native + 5 bridged)
- CCIP pool balance tracking (locked tokens on Ethereum, BSC, Solana, Aptos)
- Collateralization ratio computed from on-chain reserves vs. total supply
- Per-chain supply breakdown with token addresses, copy-to-clipboard, and block explorer links
- Responsive table UI with sortable columns (desktop) and card layout (mobile)
- The page auto refreshes every 60 seconds + manual refresh
- Contract details with copyable oracle address and Etherscan link
- Dark/light theme toggle (defaults to dark)
- Optional Google Analytics with cookie consent banner (Accept / Reject) plus DNT / GPC opt-out
- No API keys or backend required — uses public RPCs (with optional custom RPC endpoints for all 10 chains)

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript 5.9 |
| Web3 (EVM) | wagmi 3 + viem 2 (contract reads via `useReadContracts` multicall) |
| Web3 (non-EVM) | @aptos-labs/ts-sdk, @solana/kit, tronweb |
| State | React Query + Jotai (custom RPCs persisted in localStorage) |
| UI | @tanstack/react-table (sortable columns, responsive layout) |
| Styling | Tailwind CSS 4 + shadcn/ui (Radix Nova) |
| Linting | Biome 2 |
| Git hooks | Lefthook + Commitlint (conventional commits) |

## Prerequisites

- Node.js 24+ (see `.nvmrc`)
- pnpm 10+

## Getting Started

```bash
git clone https://github.com/worldliberty/cre-por-dashboard.git
cd cre-por-dashboard
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

## Available Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start dev server with Turbopack |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm lint` | Run Biome linter |
| `pnpm lint:fix` | Auto-fix lint/format issues |
| `pnpm typecheck` | TypeScript type checking |
| `pnpm clean` | Remove build artifacts and node_modules |

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout (fonts, providers, preconnects)
│   ├── page.tsx            # Home page → PorDashboard
│   ├── error.tsx           # Error boundary
│   ├── not-found.tsx       # 404 page
│   └── globals.css         # Tailwind + design tokens
├── components/
│   ├── por/                # Dashboard components
│   │   ├── dashboard.tsx   # Main orchestrator (fetches data, composes sections)
│   │   ├── header.tsx      # Logo, title, Live badge, theme toggle
│   │   ├── hero.tsx        # Large reserves display
│   │   ├── stats-grid.tsx  # Collateralization ratio + total supply cards
│   │   ├── contract-details.tsx  # Data source, oracle address, raw details
│   │   ├── supply-table/       # Per-chain USD1 supply breakdown
│   │   │   ├── details.tsx     # Main wrapper (card, footer, raw total supply)
│   │   │   ├── desktop-table.tsx  # Table layout (desktop)
│   │   │   ├── columns.tsx     # Column definitions (@tanstack/react-table)
│   │   │   ├── cells.tsx       # Reusable cell renderers
│   │   │   ├── mobile-layout.tsx  # Card layout (mobile)
│   │   │   └── mobile-chain-item.tsx  # Mobile card item
│   │   ├── cookie-consent.tsx  # Cookie consent banner
│   │   ├── warning-banner.tsx  # Supply warning banner
│   │   ├── refresh-button.tsx  # Extracted refresh button
│   │   ├── rpc-settings-dialog.tsx  # Custom RPC settings dialog
│   │   └── footer.tsx      # Data source disclaimer
│   ├── primitives/         # Reusable display components
│   │   └── formatted-number.tsx  # Number formatting
│   ├── providers/          # React context providers
│   │   ├── store.tsx       # Jotai StoreProvider
│   │   ├── theme.tsx       # next-themes ThemeProvider
│   │   └── wagmi.tsx       # WagmiProvider + QueryClientProvider
│   └── ui/                 # shadcn/ui component library (+ table.tsx)
├── hooks/
│   ├── use-por-data.ts     # Reads Chainlink oracle, decodes bundle, returns POR data
│   └── use-usd1-supply.ts  # Aggregates USD1 supply across all 10 chains
├── lib/
│   ├── analytics/           # Google Analytics (privacy-first)
│   │   ├── analytics.tsx    # GA script loader + consent management
│   │   └── page-view.tsx    # Page-view tracker component
│   ├── config/
│   │   ├── site.ts          # Site metadata
│   │   └── client.ts        # Client-side env vars
│   ├── contracts/
│   │   ├── por-oracle.ts   # Oracle address, ABI, constants
│   │   └── usd1-token.ts   # USD1 addresses, chain metadata, explorer URLs
│   ├── fetchers/           # Non-EVM supply fetchers (Tron, Solana, Aptos)
│   ├── schemas/rpc.ts      # Zod schemas for RPC URL validation
│   ├── store/
│   │   ├── index.ts        # Jotai store
│   │   ├── rpc.ts          # Custom RPCs atom with localStorage persistence
│   │   └── analytics.ts    # Analytics tracking atoms
│   ├── utils/
│   │   ├── format.ts       # Address truncation + number formatting helpers
│   │   └── privacy.ts      # DNT / GPC opt-out detection
│   ├── wagmi.ts            # Wagmi config (7 EVM chains, public RPCs with fallback)
│   └── utils.ts            # cn() classname utility
├── public/chains/           # Chain logo SVGs (10 chains)
├── types/
│   └── gtag.d.ts           # Google Analytics type declarations
```

## How It Works

### Reserves (Chainlink Oracle)
1. The app connects to Ethereum mainnet via public RPCs (no wallet needed)
2. `useReadContracts` (wagmi) multicalls `latestBundle()` and `bundleDecimals()` on the Chainlink oracle at [`0x691b...d4c4`](https://etherscan.io/address/0x691b74146cdba162449012aa32d3cbf5df77d4c4#readContract)
3. `latestBundle()` returns `bytes` which is `abi.encode(uint256 timestamp, uint256 reserves)` — decoded with viem's `decodeAbiParameters`
4. Reserves are divided by `10^decimals` (18) for the human-readable USD amount
5. RPC data auto-refreshes every 60 seconds; block number updates in real-time via `useBlockNumber({ watch: true })`

### USD1 Supply (Multi-chain)

**Native chains** (USD1 minted directly):
1. **Ethereum & BNB Chain** — ERC-20 `totalSupply()` via wagmi `useReadContracts` multicall (viem `erc20Abi`)
2. **Tron** — `totalSupply()` contract call via `tronweb` with RPC fallback (TronGrid → TronStack)
3. **Solana** — `getTokenSupply` on the USD1 mint via `@solana/kit` with RPC fallback (PublicNode → Ankr)
4. **Aptos** — `getFungibleAssetMetadataByAssetType` via `@aptos-labs/ts-sdk` (mainnet, reads `supply_v2`)

**Bridged chains** (USD1 bridged via CCIP):
5. **Plume, AB Core, Monad, Mantle, Morph** — ERC-20 `totalSupply()` on the bridged USD1 address (`0x1111...db61`) via wagmi multicall

**CCIP Pool balances:**
- Ethereum & BSC — ERC-20 `balanceOf(poolAddress)` via wagmi multicall
- Solana & Aptos — fetched via their respective non-EVM fetchers

Non-EVM fetchers run as `@tanstack/react-query` queries. The raw total supply displayed in the table footer normalizes per-chain `bigint` values to 18 decimals before summing (to avoid precision loss from mixed decimals). The collateralization ratio uses the human-readable total supply (reserves / total supply).

### Refresh
All data auto-refreshes every 60 seconds; block number updates in real-time via `useBlockNumber({ watch: true })`.

## RPC Configuration

The app uses public CORS-friendly RPCs with automatic fallback for each chain. No API keys needed.

### Custom RPC Endpoints

You can add your own RPC URLs per chain via the **Settings** (gear icon) button in the header:

1. Click the gear icon → "RPC Settings"
2. Add one or more URLs for any chain (all 10 chains supported)
3. Click **Save**

Custom endpoints are tried **first**, before falling back to the built-in defaults. Settings are validated (must be `http(s)` URLs) and persisted in `localStorage`.

### Default RPCs

| Chain | Endpoints |
|-------|-----------|
| Ethereum | Ankr, PublicNode, DRPC, 1RPC |
| BNB Chain | Ankr, PublicNode, Binance, 1RPC |
| Tron | TronGrid, TronStack |
| Solana | PublicNode, Ankr |
| Aptos | Aptos SDK default (mainnet) |
| Plume | rpc.plume.org |
| AB Core | rpc.core.ab.org |
| Monad | rpc.monad.xyz |
| Mantle | rpc.mantle.xyz |
| Morph | rpc.morphl2.io |

## Environment Variables

Copy `.env.example` to `.env.local` for optional configuration:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_GOOGLE_ID` | Google Analytics measurement ID (e.g. `G-XXXXXXXXXX`). Analytics are disabled when unset. Shows cookie consent banner. Also respects DNT / GPC. |

## Legal Disclaimer

### 1. "As-Is" Warranty Disclaimer
This software is provided "as is," without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose, and non-infringement. In no event shall the authors or copyright holders be liable for any claim, damages, or other liability, whether in an action of contract, tort, or otherwise, arising from, out of, or in connection with the software or the use or other dealings in the software.

### 2. Limitation of Liability
The entity posting this code shall not be held liable for any direct, indirect, incidental, special, exemplary, or consequential damages (including, but not limited to, procurement of substitute goods or services; loss of use, data, or profits; or business interruption) however caused and on any theory of liability, whether in contract, strict liability, or tort arising in any way out of the use of this software, even if advised of the possibility of such damage.

### 3. Not Legal/Financial/Professional Advice
The contents of this repository are for informational and educational purposes only. Nothing contained herein constitutes professional advice. Use of this code is at your own risk.

### 4. License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
