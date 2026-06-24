"use client";
import { useState, useEffect } from "react";
import { ArrowUpDown } from "lucide-react";
import { parseUnits } from "viem";
import { useAccount, useConnect } from "wagmi";

import { useSwapQuote } from "@/hooks/useSwapQuote";
import { useTokenApproval } from "@/hooks/useTokenApproval";
import { useSwapExecute } from "@/hooks/useSwapExecute";
import { calcMinAmountOut } from "@/lib/slippage";
import { TOKENS, getToken } from "@/lib/tokens";

import { TokenInput } from "./TokenInput";
import { SlippageSettings } from "./SlippageSettings";
import { TransactionStatus } from "./TransactionStatus";
import { PriceQuote } from "./PriceQuote";
import { usePoolData } from "@/hooks/usePoolData";

export function SwapCard() {
    const { address, isConnected } = useAccount()
    const { connect, connectors } = useConnect()
    const [tokenInSym, setIn] = useState("WETH");
    const [tokenOutSym, setOut] = useState("USDC");
    const [amountIn, setAmt] = useState("1")
    const [slippage, setSlippage] = useState(0.5);

    const tokenIn = getToken(tokenInSym)
    const tokenOut = getToken(tokenOutSym)

    const { reserveA, reserveB } = usePoolData(
        tokenIn?.symbol ?? "",
        tokenOut?.symbol ?? "",
        tokenIn?.decimals ?? 18,
        tokenOut?.decimals ?? 18,
        tokenIn?.address,
        tokenOut?.address,
    )

    const amountInWei = safeParseUnits(amountIn, tokenIn?.decimals ?? 18);

    // Hook 1: Get live price quote
    const { amountOut, formatted, isLoading: quoteLoading } = useSwapQuote(tokenIn, tokenOut, amountIn)

    // Hook 2: Check/request approval
    const { needsApproval, requestApproval, isApproved, isApproving, refetchAllowance } = useTokenApproval(tokenIn?.address, amountInWei)

    // Hook 3: Execute swap
    const { swap, swapTxHash, isSwapping, isConfirmed, swapError } = useSwapExecute();

    // After approval confirms, refresh allowance
    useEffect(() => {
        if (isApproved) refetchAllowance();
    }, [isApproved, refetchAllowance])

    // the swap handler 
    const handleSwap = () => {
        if (!tokenIn || !tokenOut || !amountOut) return;

        const minOut = calcMinAmountOut(amountOut, slippage);

        swap(tokenIn, tokenOut, amountInWei, minOut)
    }

    // Dynamic button - shows the RIGHT action at each step
    const renderButton = () => {
        if (!isConnected) {
            return (
                <button
                    onClick={() => connect({ connector: connectors[0] })}
                    className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700"
                >
                    Connect Wallet
                </button>
            );
        }
        if (!amountIn) {
            return <button disabled className="w-full bg-gray-300 text-gray-500 py-3 rounded-xl font-semibold">Enter amount</button>
        }

        // Step 1: Needs approval first
        if (needsApproval) {
            return (
                <button
                    onClick={requestApproval}
                    disabled={isApproving}
                    className="w-full bg-amber-500 text-white py-3 rounded-xl font-semibold hover:bg-amber-600">
                    {isApproving
                        ? "Approving..."
                        : `Approve ${tokenIn?.symbol}`
                    }
                </button>
            );
        }

        // Step 2: Approved - ready to swap
        return (
            <button
                onClick={handleSwap}
                disabled={isSwapping || !amountOut}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700"
            >
                {isSwapping ? "Swapping..." : "Swap"}
            </button>
        )
    }

    const flip = () => { setIn(tokenOutSym); setOut(tokenInSym) }

    return (
        <div className="border rounded-2xl p-5 space-y-3 max-w-sm bg-gray-400">
            {/* Header with Slippage gear */}
            <div className="flex justify-between items-center">
                <h2 className="font-bold text-lg">Swap</h2>
                <SlippageSettings
                    slippage={slippage}
                    onSlippage={setSlippage}
                />
            </div>

            <TokenInput
                label="You Pay"
                token={tokenIn}
                amount={amountIn}
                onAmountChange={setAmt}
                onTokenChange={setIn}
            />

            <button
                onClick={flip}
                className="mx-auto flex w-8 h-8 items-center justify-center border rounded-lg hover:bg-gray-50"
            >
                <ArrowUpDown size={14} />
            </button>

            <TokenInput
                label="You Receive"
                token={tokenOut}
                amount={quoteLoading ? "..." : formatted ?? ""}
                readOnly
                onTokenChange={setOut}
            />

            {tokenIn && tokenOut && amountOut && reserveA && reserveB && (
                <PriceQuote
                    tokenIn={tokenIn}
                    tokenOut={tokenOut}
                    amountIn={amountInWei}
                    amountOut={amountOut}
                    reserveIn={reserveA}
                    reserveOut={reserveB}
                    slippage={slippage}
                />
            )}

            {/* Rate display */}
            {formatted && (
                <p className="text-xs text-white text-center">
                    1 {tokenIn?.symbol} ≈ {formatted} {tokenOut?.symbol} · Slippage: {slippage}
                </p>
            )}

            {/* Dynamic button - approve OR swap */}
            {renderButton()}

            {/* transaction status toast */}
            <TransactionStatus
                txHash={swapTxHash}
                isPending={isSwapping && !swapTxHash}
                isConfirming={!!swapTxHash && !isConfirmed}
                isConfirmed={isConfirmed}
                error={swapError}
                label="Swap"
            />
        </div>
    )
}

function safeParseUnits(v: string, d: number): bigint {
    try {
        return parseUnits(v, d)
    } catch {
        return 0n
    }
}