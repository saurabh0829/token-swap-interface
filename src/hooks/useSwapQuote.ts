"use client";
import { useReadContract } from "wagmi";
import { parseUnits, formatUnits } from "viem";
import { ROUTER_ADDRESS, ROUTER_ABI } from "@/lib/uniswap";
import type { Token } from "@/lib/tokens";

export function useSwapQuote(
    tokenIn: Token | undefined,
    tokenOut: Token | undefined,
    amountIn: string
){
    const amountInWei = tryParseUnits(
        amountIn, tokenIn?.decimals ?? 18
    );

    const enabled = !!tokenIn && !!tokenOut && !!amountInWei && amountInWei > 0n;

    const {data, isLoading, error} = useReadContract({
        address: ROUTER_ADDRESS,
        abi: ROUTER_ABI,
        functionName: "getAmountOut",
        args: enabled ? [
            amountInWei,
            [tokenIn!.address, tokenOut!.address],
        ] : undefined,
        query:{enabled, refetchInterval:15_000},
    });

    const amounts = data as bigint[] | undefined;
    const amountOut = amounts?.[1];
    const formatted = amountOut
        ? formatUnits(amountOut, tokenOut?.decimals ?? 18)
        : undefined;

    return { 
        amountOut,
        formatted, 
        isLoading, error
    }
}

function tryParseUnits(val:string, dec:number):bigint{
    try {
        return parseUnits(val, dec)
    } catch {
        return 0n
    }
}