"use client";
import { usePoolStats } from "@/hooks/usePoolStats";
import { formatUSD } from "@/hooks/useSwapHistory";
import { ExternalLink } from "lucide-react";

export function TopPairs() {
    const { data: pairs, isLoading } = usePoolStats();

    return (
        <div className="border rounded-xl overflow-hidden">
            <div className="p-4 border-b">
                <h3 className="text-sm font-semibold">
                    Top pool by volume
                </h3>
            </div>

            <table className="w-full text-sm">
                <thead>
                    <tr className="text-xs text-gray-400 border-b">
                        <th className="text-left px-4 py-2 font-medium">#</th>
                        <th className="text-left px-4 py-2 font-medium">Pool</th>
                        <th className="text-right px-4 py-2 font-medium">TVL</th>
                        <th className="text-right px-4 py-2 font-medium">Volume</th>
                        <th className="text-right px-4 py-2 font-medium">Txns</th>
                        <th className="px-4 py-2"></th>
                    </tr>
                </thead>

               <tbody>
          {isLoading
            ? [...Array(5)].map((_, i) => (
              <tr key={i} className="animate-pulse border-b">
                {[...Array(5)].map((_, j) => (
                  <td key={j} className="px-4 py-3">
                    <div className="h-4 bg-gray-100 rounded w-3/4"/>
                  </td>
                ))}
              </tr>
            ))
            : pairs?.map((pair, idx) => (
              <tr
                key={pair.id}
                className="border-b hover:bg-gray-50
                  transition-colors">
                <td className="px-4 py-3 text-gray-400">
                  {idx + 1}
                </td>
                <td className="px-4 py-3 font-medium">
                  {pair.token0.symbol}/{pair.token1.symbol}
                </td>
                <td className="px-4 py-3 text-right">
                  {formatUSD(pair.reserveUSD)}
                </td>
                <td className="px-4 py-3 text-right text-blue-600
                  font-medium">
                  {formatUSD(pair.volumeUSD)}
                </td>
                <td className="px-4 py-3 text-right text-gray-500">
                  {Number(pair.txCount).toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  <a
                    href={`https://etherscan.io/address/${pair.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-blue-500">
                    <ExternalLink size={13}/>
                  </a>
                </td>
              </tr>
            ))}
        </tbody>
        </table>
        </div >
    )
}