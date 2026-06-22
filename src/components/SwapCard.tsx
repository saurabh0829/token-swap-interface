"use client";

import { useState } from "react";
import { ArrowUpDown } from "lucide-react";
import { useSwapQuote } from "@/hooks/useSwapQuote";
import { TOKENS, getToken } from "@/lib/tokens";
import Image from "next/image";
import { TokenInput } from "./TokenInput";

export function SwapCard(){
    const [tokenInSym, setIn] = useState("WETH");
    const [tokenOutSym, setOut] = useState("USDC");
    const [amountIn, setAmt] = useState("1")

    const tokenIn = getToken(tokenInSym)
    const tokenOut = getToken(tokenOutSym)

    const {formatted, isLoading} = useSwapQuote(tokenIn, tokenOut, amountIn);

    const flip = ()=>{
        setIn(tokenOutSym);
        setOut(tokenInSym);
    };

    return(
        <div className="border bg-amber-100 rounded-2xl p-5 space-y-3 max-w-sm">
            <h2 className="font-bold text-lg">Swap</h2>

            {/* You sell */}
            <TokenInput
                label="You Pay"
                token={tokenIn}
                amount={amountIn}
                onAmountChange={setAmt}
                onTokenChange={setIn}
            />

            {/* Flip button */}
            <button 
                onClick={flip}
                className="mx-auto flex w-8 h-8 items-center justify-center border rounded-lg hover:bg-gray-50 transition-colors"
            >
                <ArrowUpDown size={14}/>
            </button>

            {/* You receive */}
            <TokenInput
                label="You Receive"
                token={tokenOut}
                amount={isLoading ? "..." : formatted ?? ""}
                readOnly
                onTokenChange={setOut}
            />
            <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700">
                Swap-coming Day 10
            </button>
        </div>
    )
}