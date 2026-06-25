"use client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { useSwapHistory, formatDate, formatUSD } from "@/hooks/useSwapHistory";
import { useState } from "react";

export function VolumeChart() {
    const [activeIdx, setActiveIdx] = useState<number | null>(null);
    const { data, isLoading } = useSwapHistory("WETH-USDC", 30)

    const chartData = data?.map((d) => ({
        date: formatDate(d.date),
        volume: parseFloat(d.dailyVolumeUSD),
        txns: d.dailyTxns
    })) ?? []

    const total30d = chartData.reduce(
        (sum, d) => sum + d.volume,0
    )

    if (isLoading)
        return <div className="h-64 flex items-center justify-center text-gray-400 text-sm">Loading...</div>;

    return (
         <div className="border rounded-xl p-4 space-y-3">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-semibold">
            Volume — WETH/USDC (30 days)
          </h3>
          <p className="text-2xl font-semibold text-blue-600 mt-1">
            {formatUSD(total30d)}
          </p>
        </div>
        <p className="text-xs text-gray-400">30d total</p>
      </div>

            <ResponsiveContainer width="100%" height={200}>
        <BarChart
          data={chartData}
          onMouseLeave={() => setActiveIdx(null)}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false}/>
          <XAxis
            dataKey="date"
            tick={{fontSize: 10, fill: "#9ca3af"}}
            tickLine={false}
            interval={6}
          />
          <YAxis
            tickFormatter={formatUSD}
            tick={{fontSize: 10, fill: "#9ca3af"}}
            tickLine={false}
            width={60}
          />
            <Tooltip
            formatter={(v: number | string | readonly (string | number)[] | undefined) => {
              if (v === undefined || Array.isArray(v)) return ["—", "Volume"];
              return [formatUSD(Number(v)), "Volume"];
            }}
          />
          <Bar
            dataKey="volume"
            radius={[2,2,0,0]}
            onMouseEnter={(_, idx) => setActiveIdx(idx)}
          >
            {/* Highlight hovered bar — same as hover state in your tables */}
            {chartData.map((_, idx) => (
              <Cell
                key={idx}
                fill={activeIdx === idx
                  ? "#2563eb"       // hovered — vivid blue
                  : "#93c5fd"}     // rest — light blue
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
        </div>
    )
}