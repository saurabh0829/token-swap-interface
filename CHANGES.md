# Session Changes — Token Swap Interface

All bugs fixed and changes made during the Day 9 debugging session.

---

## 1. Connect Wallet Button — Not Working

**File:** `src/components/SwapCard.tsx`, `src/app/providers.tsx`

**Problem:**
- The "Connect Wallet" button was `disabled` with no `onClick` handler
- No wallet connectors were configured in the wagmi config — nothing to connect to

**Fix:**
- Added `injected()` connector to `createConfig` in `providers.tsx`
- Replaced the disabled button with a working one using `useConnect`:

```ts
// providers.tsx
import { injected } from "wagmi/connectors";
const config = createConfig({
    connectors: [injected()],
    ...
});

// SwapCard.tsx
const { connect, connectors } = useConnect()
<button onClick={() => connect({ connector: connectors[0] })}>
    Connect Wallet
</button>
```

---

## 2. wagmi Version Conflict with RainbowKit

**File:** `package.json`

**Problem:**
`wagmi@3.6.17` is incompatible with `@rainbow-me/rainbowkit@2.x` which requires `wagmi@^2.9.0`. Also, wagmi v3's connectors barrel tried to import dozens of optional peer deps that weren't installed, crashing the build.

**Fix:**
Downgraded wagmi to v2:
```bash
npm install wagmi@^2.19.5 --legacy-peer-deps
```

---

## 3. wagmi/connectors Barrel — Missing Optional Peer Deps

**File:** `next.config.ts`

**Problem:**
`wagmi/connectors` is a barrel file that loads ALL connectors (MetaMask SDK, WalletConnect, Safe, Porto, etc.) even when only `injected()` is used. Their optional peer deps (`@react-native-async-storage/async-storage`, `pino-pretty`, etc.) aren't installed, causing build errors.

**Fix:**
Stubbed out the missing packages with webpack aliases:
```ts
// next.config.ts
webpack: (config) => {
    config.resolve.alias = {
        ...config.resolve.alias,
        "@react-native-async-storage/async-storage": false,
        "pino-pretty": false,
    };
    return config;
},
```

---

## 4. Hardhat Config — Invalid Config Error

**File:** `hardhat.config.ts`

**Problem:**
Hardhat 3 requires an explicit `type` discriminator on every network. The old config didn't include it:
```
Error HHE15: Invalid config: Config error in config.networks.hardhat.type
```
Also, `process.env.ALCHEMY_MAINNET_URL` was not set, causing `undefined` to be passed as a URL.

**Fix:**
```ts
const config: HardhatUserConfig = {
    networks: {
        hardhat: {
            type: "edr-simulated",   // required in Hardhat 3
            ...(process.env.ALCHEMY_MAINNET_URL && {
                forking: { url: process.env.ALCHEMY_MAINNET_URL },
            }),
        }
    }
};
```
- `type: "edr-simulated"` = local in-process node (formerly implicit)
- Forking only enabled when env var is set, so `npx hardhat node` works without a key

---

## 5. Hydration Mismatch

**File:** `src/app/page.tsx`

**Problem:**
Server renders `isConnected = false` → "Connect Wallet". If MetaMask is already connected, client renders differently → React hydration mismatch error.

**Fix:**
Disable SSR for `SwapCard` since it's entirely client-side wallet UI:
```ts
const SwapCard = dynamic(
    () => import("@/components/SwapCard").then(m => m.SwapCard),
    { ssr: false }
);
```

---

## 6. PoolStats Component Not Showing

**File:** `src/components/PoolStats.tsx`, `src/hooks/usePoolData.ts`

**Problems (3):**
1. `stateMutability: "viem"` — typo in the ABI, should be `"view"`. Contract call never fired.
2. Reverse pair fallback was `` `${symbolB}-${symbolB}` `` (both B) instead of `` `${symbolB}-${symbolA}` ``
3. Bare `// comment` inside JSX rendered as literal text on screen
4. Component returned `null` on loading/error — invisible with no feedback

**Fixes:**
- Fixed ABI typo: `"viem"` → `"view"`
- Fixed reverse pair key: `${symbolB}-${symbolB}` → `${symbolB}-${symbolA}`
- Removed bare JS comment from JSX
- Added loading and error states instead of returning null

---

## 7. CORS Error — RPC Blocked

**File:** `src/app/providers.tsx`

**Problem:**
wagmi's default public RPC (`eth.merkle.io`) blocks browser requests. Ankr also started requiring an API key.

**Fix:**
Used PublicNode (free, CORS-enabled, no key required):
```ts
[mainnet.id]: http("https://ethereum.publicnode.com"),
```

---

## 8. WETH Reserve Showing 0

**File:** `src/hooks/usePoolData.ts`, `src/components/PoolStats.tsx`

**Problem:**
Uniswap V2 sorts token pairs by address. For WETH-USDC:
- USDC (`0xa0b8...`) < WETH (`0xc02a...`) → USDC is `token0`, WETH is `token1`
- The hook was mapping `reserve0 → tokenA (WETH)` and `reserve1 → tokenB (USDC)` — backwards
- WETH was being formatted with USDC decimals (6) → tiny number → displayed as 0

**Fix:**
Compare token addresses to determine which is token0, then assign reserves correctly:
```ts
const aIsToken0 = addressA && addressB
    ? addressA.toLowerCase() < addressB.toLowerCase()
    : true;

const [rawA, rawB] = aIsToken0
    ? [reserves?.[0], reserves?.[1]]
    : [reserves?.[1], reserves?.[0]];
```
Also pinned reads to `chainId: mainnet.id` so reads always use the mainnet RPC regardless of which chain the wallet is connected to.

---

## 9. Price Quote Showing 0.0

**File:** `src/lib/uniswap.ts`, `src/hooks/useSwapQuote.ts`

**Problems (2):**
1. Wrong function name: `getAmountOut` → should be `getAmountsOut` (plural). `getAmountOut` is an internal library function, not on the router.
2. ABI typo: `"output"` → should be `"outputs"` (missing `s`), making the ABI malformed so viem couldn't decode the response.

**Fix:**
```ts
// uniswap.ts
{
    name: "getAmountsOut",   // was: getAmountOut
    outputs: [               // was: output
        {name: "amounts", type:"uint256[]"}
    ]
}

// useSwapQuote.ts
functionName: "getAmountsOut",  // was: getAmountOut
```

---

## 10. Cannot Mix BigInt and Other Types

**File:** `src/lib/slippage.ts`, `src/components/PriceQuote.tsx`, `src/components/SwapCard.tsx`

**Problem:**
`SwapCard` was passing `formattedA`/`formattedB` (decimal strings like `"4946.5"`) into `PriceQuote` as `reserveIn`/`reserveOut` (typed as `bigint`). Then `formatUnits("4946.5", 18)` in `PriceQuote` produced garbage → `Number(garbage)` → NaN → price impact showed `NaN%`.

**Root cause chain:**
```
formattedA (string "4946.5")
  → passed as reserveIn (bigint prop)
  → toNum(reserveIn, decimals) calls formatUnits(string, 18)
  → viem formatUnits on a string = garbage string
  → Number(garbage) = NaN
  → calcPriceImpact receives NaN → returns NaN%
```

**Fix:**
1. `SwapCard` now destructures `reserveA`/`reserveB` (raw bigints) from `usePoolData` and passes those — not the formatted strings
2. `calcPriceImpact` changed to accept `number` instead of `bigint`, with conversion happening in `PriceQuote` via `formatUnits`
3. Added NaN/Infinity guard as last defence:
```ts
export function calcPriceImpact(amountIn: number, amountOut: number, reserveIn: number, reserveOut: number): number {
    if (reserveIn === 0) return 0;
    const idealOut = amountIn * reserveOut / reserveIn;
    if (idealOut === 0) return 0;
    const impact = (1 - amountOut / idealOut) * 100;
    return isNaN(impact) || !isFinite(impact) ? 0 : Math.max(0, impact);
}
```

---

## 11. "Approving..." Button Stuck After Confirmation

**File:** `src/hooks/useTokenApproval.ts`

**Problem:**
`isLoading` from `useWaitForTransactionReceipt` has changed semantics in tanstack-query v5 (wagmi v2's underlying query library) and could stay truthy after confirmation.

**Fix:**
Use the explicit `status` string instead:
```ts
const { isSuccess: isApproved, status: receiptStatus } = useWaitForTransactionReceipt({
    hash: approveTxHash,
})

const isWaitingForReceipt = !!approveTxHash && receiptStatus === "pending";

return {
    isApproving: isApproving || isWaitingForReceipt,
    ...
}
```
`receiptStatus` is `"pending"` while mining and `"success"` once confirmed — unambiguous.

---

## 12. Swap Never Confirmed

**File:** `src/hooks/useSwapExecute.ts`

**Problems (2):**
1. `useWaitForTransactionReceipt()` called with **no hash** — watching nothing, so `isConfirmed` never became true and `isSwapping` never cleared
2. `mutate: executeSwap` — wagmi v2's `useWriteContract` returns `writeContract`, not `mutate`. Every swap click would throw `TypeError: executeSwap is not a function`

**Fix:**
```ts
// Pass the hash to watch
const { isSuccess: isConfirmed, status: receiptStatus } =
    useWaitForTransactionReceipt({ hash: swapTxHash })  // was: no arg

// Correct wagmi v2 API
const { writeContract: executeSwap, ... } = useWriteContract()  // was: mutate

// Clean isSwapping state
const isWaitingForReceipt = !!swapTxHash && receiptStatus === "pending";
return { isSwapping: isSwapping || isWaitingForReceipt, ... }
```

---

## 13. localhost Chain Added for Hardhat Testing

**File:** `src/app/providers.tsx`

Added `localhost` chain (chain ID 31337) so the app can connect to the local Hardhat fork:
```ts
import { mainnet, localhost } from "wagmi/chains";

const config = createConfig({
    chains: [mainnet, localhost],
    transports: {
        [mainnet.id]: http("https://ethereum.publicnode.com"),
        [localhost.id]: http("http://127.0.0.1:8545"),
    },
});
```

---

## How to Test with Local Hardhat Fork

```bash
# 1. Start the fork
export ALCHEMY_MAINNET_URL="https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY"
npx hardhat node

# 2. In MetaMask: switch to Localhost 8545 (built-in, chain ID 31337)
# 3. Import Account #0 private key printed by hardhat node (10,000 ETH)

# 4. Start the app
npm run dev
```

Swap flow: Enter amount → Approve token → Swap → Confirmed

---

## Key Concepts Learned

| Concept | Detail |
|---|---|
| Uniswap V2 token ordering | Pairs sort tokens by address — always check which is `token0` before mapping reserves |
| wagmi v2 `status` vs `isLoading` | Use `status === "pending"` not `isLoading` for reliable tx state in tanstack-query v5 |
| wagmi v2 API | `useWriteContract` returns `writeContract`, not `mutate` |
| Hardhat 3 config | Every network needs an explicit `type: "edr-simulated"` or `type: "http"` |
| Next.js + wallets | Disable SSR (`ssr: false`) for any component that reads wallet state |
| wagmi barrel imports | `wagmi/connectors` loads ALL connectors — stub missing optional peer deps with `resolve.alias: false` |
| `getAmountsOut` vs `getAmountOut` | Router exposes `getAmountsOut` (plural) — `getAmountOut` is an internal library function |
