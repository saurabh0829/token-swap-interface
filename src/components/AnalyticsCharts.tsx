"use client";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useSwapHistory, formatDate } from "@/hooks/useSwapHistory";
import { useState } from "react";

const RANGES = [
    { label: "7D", days: 7 },
    { label: "30D", days: 30 },
    { label: "90D", days: 90 }
];

export function AnalyticsCharts() {
    const [days, setDays] = useState(30);
    const { data, isLoading } = useSwapHistory("WETH-USDC", days)

    const chartData = data?.map((d) => ({
        date: formatDate(d.date),
        price: parseFloat(d.token0Price),
        tvl: parseFloat(d.reserveUSD)
    })) ?? [];

    if (isLoading)
        return <div className="h-64 items-center justify-center text-gray-800 text-sm">
            Loading...
        </div>

    return (
        <div className="border rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">
                    ETH price - WETH/USDC
                </h3>

                <div className="flex gap-1">
                    {RANGES.map((r) => (
                        <button
                            key={r.label}
                            onClick={() => setDays(r.days)}
                            className={
                                `px-3 py-1 text-xs rounded-lg
                                ${days === r.days
                                    ? "bg-blue-600 text-white"
                                    : "border hover:bg-gray-50"}`
                            }
                        >
                            {r.label}
                        </button>
                    ))}
                </div>
            </div>

            <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={chartData}>
                    <defs>
                        <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#2563eb" stopOpacity={0.15} />
                            <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                        dataKey="date"
                        tick={{ fontSize: 11, fill: "#9ca3af" }}
                        tickLine={false}
                        interval="preserveStartEnd"
                    />
                    <YAxis
                        tickFormatter={(v) => `$${v.toLocaleString()}`}
                        tick={{ fontSize: 11, fill: "#9ca3af" }}
                        tickLine={false}
                        width={70}
                    />
                    <Tooltip
                        formatter={(v: number | string | readonly (string | number)[] | undefined) => {
                            if (v === undefined || Array.isArray(v)) return ["—", "ETH price"];
                            return [`$${Number(v).toLocaleString("en-US", { maximumFractionDigits: 2 })}`, "ETH price"];
                        }}
                    />
                    <Area
                        type="monotone"
                        dataKey="price"
                        stroke="#2563eb"
                        fill="url(#priceGrad)"
                        strokeWidth={2}
                        dot={false}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}
