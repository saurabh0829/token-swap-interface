# Token Swap Interface

A Uniswap V2 token swap interface built with Next.js, wagmi, and viem. Supports live price quotes, ERC-20 approval flow, slippage settings, price impact display, and pool reserve stats — with local mainnet forking via Hardhat.

#ScreenShots:
<img width="1424" height="800" alt="Screenshot 2026-06-24 at 15 37 22" src="https://github.com/user-attachments/assets/80d6340d-1c58-4830-9676-19bab960f0df" />


## Stack

- **Next.js 15** — app router, SSR disabled for wallet components
- **wagmi v2 + viem v2** — wallet connection, contract reads/writes
- **Hardhat** — local mainnet fork for free gas testing
- **Uniswap V2 Router** — `swapExactTokensForTokens`, `getAmountsOut`
- **Tailwind CSS v4** — styling

## Features

- Connect wallet via MetaMask (injected connector)
- Live price quotes from Uniswap V2 Router
- ERC-20 approval flow (checks allowance before swap)
- Slippage settings — 0.1% / 0.5% / 1% presets + custom
- Price impact calculation with high-impact warning
- Pool reserves display (WETH/USDC Uniswap V2 pair)
- Transaction status toasts (pending → confirming → confirmed)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment

Create a `.env.local` file:

```
ALCHEMY_MAINNET_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY
NEXT_PUBLIC_ALCHEMY_KEY=YOUR_KEY
```

### 3. Start the local Hardhat fork

```bash
export ALCHEMY_MAINNET_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY
npx hardhat node
```

This forks mainnet locally — all Uniswap pools and token contracts exist at the same addresses, gas is free, and each of the 20 test accounts starts with 10,000 ETH.

### 4. Configure MetaMask

- Network: **Localhost 8545** (already built into MetaMask)
- Chain ID: `31337`
- Import a test account using the private key printed when the Hardhat node starts

### 5. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Supported Tokens

| Symbol | Decimals | Address |
|--------|----------|---------|
| WETH | 18 | `0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2` |
| USDC | 6 | `0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48` |
| USDT | 6 | `0xdAC17F958D2ee523a2206206994597C13D831ec7` |
| DAI | 18 | `0x6B175474E89094C44Da98b954EedeAC495271d0F` |
| WBTC | 8 | `0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599` |

## Project Structure

```
src/
├── app/
│   ├── providers.tsx       # wagmi + react-query providers
│   ├── page.tsx            # home page
│   └── layout.tsx
├── components/
│   ├── SwapCard.tsx        # main swap UI
│   ├── TokenInput.tsx      # token amount + selector
│   ├── SlippageSettings.tsx
│   ├── PriceQuote.tsx      # rate, price impact, min received
│   ├── PoolStats.tsx       # live pool reserves
│   └── TransactionStatus.tsx
├── hooks/
│   ├── useSwapQuote.ts     # getAmountsOut via Uniswap router
│   ├── useTokenApproval.ts # allowance check + approve()
│   ├── useSwapExecute.ts   # swapExactTokensForTokens
│   └── usePoolData.ts      # Uniswap V2 pair getReserves()
└── lib/
    ├── tokens.ts           # token list
    ├── uniswap.ts          # router address + ABI
    └── slippage.ts         # calcMinAmountOut, calcPriceImpact
```

## Swap Flow

1. Enter amount → live quote fetched from `getAmountsOut`
2. Click **Approve** → MetaMask prompts ERC-20 `approve(router, maxUint256)`
3. Click **Swap** → MetaMask prompts `swapExactTokensForTokens`
4. UI shows pending → confirming → confirmed
