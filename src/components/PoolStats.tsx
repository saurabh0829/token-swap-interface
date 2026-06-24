"use client";

import {usePoolData } from "@/hooks/usePoolData";
import { ExternalLink } from "lucide-react";
import type { Token } from "@/lib/tokens";

interface Props {
    tokenA: Token | undefined;
    tokenB: Token | undefined;
}

export function PoolStats({tokenA, tokenB}: Props){
    const { formattedA, formattedB, pairAddress, isLoading, error } = usePoolData(
        tokenA?.symbol ?? "",
        tokenB?.symbol ?? "",
        tokenA?.decimals ?? 18,
        tokenB?.decimals ?? 18,
        tokenA?.address,
        tokenB?.address,
    );

    // format large numbers: 
    const fmt = (v:string)=>
        Number(v).toLocaleString("en-US", {
            maximumFractionDigits: 2
        });

    return (
        <div className="border rounded-xl p-4 space-y-3 max-w-sm">
            <h3 className="text-sm font-semibold text-gray-700">Pool Reserves</h3>

            {isLoading && (
                <p className="text-xs text-gray-400">Loading reserves...</p>
            )}

            {error && (
                <p className="text-xs text-red-500">Failed to load: {error.message}</p>
            )}

            {formattedA && formattedB && (
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="font-medium">{tokenA?.symbol}</span>
                        <span className="text-gray-500">{fmt(formattedA)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="font-medium">{tokenB?.symbol}</span>
                        <span className="text-gray-500">{fmt(formattedB)}</span>
                    </div>
                </div>
            )}

            {pairAddress && (
                <a
                    href={`https://etherscan.io/address/${pairAddress}`}
                    target="_blank"
                    className="flex items-center gap-1 text-xs text-blue-500 hover:underline"
                >
                    View pool on Etherscan
                    <ExternalLink size={10} />
                </a>
            )}
        </div>
    )
}