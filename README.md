# USD1 Proof of Reserves Dashboard

A real-time dashboard that reads [USD1](https://worldlibertyfinancial.com) stablecoin reserve data directly from the Ethereum blockchain via a Chainlink oracle smart contract. All data is sourced on-chain — no backend, no API keys required.

## Features

- Live reserves data from Ethereum mainnet
- On-chain data via Chainlink oracle (`latestBundle()` + `bundleDecimals()`)
- Auto-refresh every 60 seconds + manual refresh
- Contract details with copyable oracle address and Etherscan link
- Dark/light theme toggle (defaults to dark)
- Responsive design (mobile + desktop)
- No API keys or backend required — uses public Ethereum RPCs

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript 5.9 |
| Web3 | wagmi 3 + viem 2 (contract reads via `useReadContracts` multicall) |
| State | React Query (@tanstack/react-query) |
| Styling | Tailwind CSS 4 + shadcn/ui (Radix Nova) |
| Linting | Biome 2 |
| Git hooks | Lefthook + Commitlint (conventional commits) |

## Prerequisites

- Node.js 24+ (see `.nvmrc`)
- pnpm 10+

## Getting Started

```bash
git clone <repo-url>
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
│   │   ├── stats-grid.tsx  # Collateralization ratio + data source cards
│   │   ├── contract-details.tsx  # Oracle address, Etherscan link, raw details
│   │   └── footer.tsx      # Data source disclaimer
│   ├── primitives/         # Reusable display components
│   │   └── formatted-number.tsx  # Number formatting
│   ├── providers/          # React context providers
│   │   ├── theme.tsx       # next-themes ThemeProvider
│   │   └── wagmi.tsx       # WagmiProvider + QueryClientProvider
│   └── ui/                 # shadcn/ui component library
├── hooks/
│   └── use-por-data.ts     # Core hook: reads contract, decodes bundle, returns POR data
├── lib/
│   ├── config/site.ts      # Site metadata
│   ├── contracts/por-oracle.ts  # Oracle address, ABI, constants
│   ├── wagmi.ts            # Wagmi config (mainnet, public RPCs with fallback)
│   └── utils.ts            # cn() classname utility
```

## How It Works

1. The app connects to Ethereum mainnet via public RPCs (no wallet needed)
2. `useReadContracts` (wagmi) multicalls `latestBundle()` and `bundleDecimals()` on the Chainlink oracle at [`0x691b...d4c4`](https://etherscan.io/address/0x691b74146cdba162449012aa32d3cbf5df77d4c4#readContract)
3. `latestBundle()` returns `bytes` which is `abi.encode(uint256 timestamp, uint256 reserves)` — decoded with viem's `decodeAbiParameters`
4. Reserves are divided by `10^decimals` (18) for the human-readable USD amount
5. Data auto-refreshes every 60 seconds; block number updates in real-time via `useBlockNumber({ watch: true })`

## RPC Configuration

The app uses 5 public CORS-friendly Ethereum RPCs with automatic fallback (configured in `lib/wagmi.ts`). No API keys needed. For better reliability, you can replace them with your own RPC URL (Alchemy, Infura, etc.).

## Legal Disclaimer

### 1. "As-Is" Warranty Disclaimer
This software is provided "as is," without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose, and non-infringement. In no event shall the authors or copyright holders be liable for any claim, damages, or other liability, whether in an action of contract, tort, or otherwise, arising from, out of, or in connection with the software or the use or other dealings in the software.

### 2. Limitation of Liability
The entity posting this code shall not be held liable for any direct, indirect, incidental, special, exemplary, or consequential damages (including, but not limited to, procurement of substitute goods or services; loss of use, data, or profits; or business interruption) however caused and on any theory of liability, whether in contract, strict liability, or tort arising in any way out of the use of this software, even if advised of the possibility of such damage.

### 3. Not Legal/Financial/Professional Advice
The contents of this repository are for informational and educational purposes only. Nothing contained herein constitutes professional advice. Use of this code is at your own risk.

### 4. License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
