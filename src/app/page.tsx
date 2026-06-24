"use client";

import dynamic from "next/dynamic";
import { PoolStats } from "@/components/PoolStats";
import { getToken } from "@/lib/tokens";

const SwapCard = dynamic(() => import("@/components/SwapCard").then(m => m.SwapCard), { ssr: false });

export default function Home(){
  return(
    <main className="min-h-screen flex flex-col items-center justify-center p-4 gap-4">
      <SwapCard/>
      <PoolStats tokenA={getToken("WETH")} tokenB={getToken("USDC")}/>
    </main>
  )
}