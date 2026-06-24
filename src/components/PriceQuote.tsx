"use client";
import { AlertTriangle } from "lucide-react";
import { calcPriceImpact } from "@/lib/slippage";
import { formatUnits } from "viem";
import type { Token } from "@/lib/tokens";

interface Props {
  tokenIn: Token;
  tokenOut: Token;
  amountIn: bigint;
  amountOut: bigint;
  reserveIn: bigint;
  reserveOut: bigint;
  slippage: number;
}

export function PriceQuote({
  tokenIn, tokenOut, amountIn, amountOut,
  reserveIn, reserveOut, slippage
}: Props) {
  const toNum = (v: bigint, d: number) => Number(formatUnits(v, d));
  const impact = calcPriceImpact(
    toNum(amountIn, tokenIn.decimals),
    toNum(amountOut, tokenOut.decimals),
    toNum(reserveIn, tokenIn.decimals),
    toNum(reserveOut, tokenOut.decimals),
  );

  // Color code by severity — like HTTP status colors
  // Green < 1%  |  Yellow 1-3%  |  Red > 3%
  const impactColor =
    impact < 1 ? "text-green-300" :
    impact < 3 ? "text-yellow-300" :
    "text-red-600";

  // Exchange rate: how many tokenOut per 1 tokenIn
  const rate =
    Number(formatUnits(amountOut, tokenOut.decimals)) /
    Number(formatUnits(amountIn, tokenIn.decimals));

  // Minimum received after slippage
  const minReceived =
    Number(formatUnits(amountOut, tokenOut.decimals)) *
    (1 - slippage / 100);

return (
    <div className="space-y-2 text-xs text-white">
      {/* Rate */}
      <div className="flex justify-between">
        <span>Rate</span>
        <span>
          1 {tokenIn.symbol} = {rate.toFixed(4)} {tokenOut.symbol}
        </span>
      </div>

      {/* Price impact — the critical safety metric */}
      <div className="flex justify-between">
        <span>Price impact</span>
        <span className={impactColor}>
          {impact.toFixed(3)}%
        </span>
      </div>

      {/* Minimum received */}
      <div className="flex justify-between">
        <span>Min. received ({slippage}% slippage)</span>
        <span>
          {minReceived.toFixed(4)} {tokenOut.symbol}
        </span>
      </div>

 {/* High impact warning — like a 500 error banner */}
      {impact > 3 && (
        <div className="flex items-center gap-2 bg-red-50
          border border-red-200 rounded-lg p-2
          text-red-700">
          <AlertTriangle size={14} />
          <span>
            High price impact! You&apos;ll get significantly
            less than the market rate. Try a smaller amount.
          </span>
        </div>
      )}
    </div>
  );
}