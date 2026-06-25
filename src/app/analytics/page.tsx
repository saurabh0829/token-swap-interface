"use client";
import { useSwapHistory, formatUSD } from "@/hooks/useSwapHistory";
import { AnalyticsCharts } from "@/components/AnalyticsCharts";
import { VolumeChart } from "@/components/VolumeChart";
import { TopPairs } from "@/components/TopPairs";

export default function AnalyticsPage() {
  // Fetch most recent day for headline stats
  const { data } = useSwapHistory("WETH-USDC", 1);
  const latest = data?.[0];

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">
        Uniswap V2 Analytics
      </h1>

      {/* Metric cards — current snapshot */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard
          label="ETH price"
          value={latest
            ? `$${parseFloat(latest.token0Price).toLocaleString()}`
            : "—"}
        />
        <StatCard
          label="24h volume"
          value={latest
            ? formatUSD(latest.dailyVolumeUSD)
            : "—"}
        />
        <StatCard
          label="TVL"
          value={latest
            ? formatUSD(latest.reserveUSD)
            : "—"}
        />
      </div>

      {/* Charts side by side */}
      <div className="grid grid-cols-2 gap-4">
        <AnalyticsCharts />
        <VolumeChart />
      </div>

      {/* Full-width pairs table */}
      <TopPairs />

      <p className="text-xs text-gray-400 text-center">
        Data from The Graph — Uniswap V2 subgraph
      </p>
    </main>
  );
}

// Reusable metric card — same pattern as your Harmony dashboard
function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="border rounded-xl p-4">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-xl font-semibold">{value}</p>
    </div>
  );
}