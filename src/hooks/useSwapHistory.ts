import {useQuery} from "@tanstack/react-query";
import { generateDayData } from "@/lib/mockData";

export interface DayData {
    date: number;
    dailyVolumeUSD: string;
    reserveUSD: string;
    token0Price:string;
    token1Price:string;
    dailyTxns: number
}

export function useSwapHistory(
    pair: string = "WETH-USDC",
    days: number = 30
){
    return useQuery({
        queryKey:["pairDayData", pair, days],
        queryFn: async () => generateDayData(days),
        staleTime: 1000 * 60 * 5,
    })
}

export function formatDate(unix:number):string{
    return new Date(unix * 1000).toLocaleDateString("en-US", {
        month:"short",
        day:'numeric'
    })
}

export function formatUSD(val:string | number) : string {
    const n = Number(val);
    if(n >= 1e9) return `$${(n/1e9).toFixed(2)}B`;
    if(n >= 1e6) return `$${(n/1e6).toFixed(1)}M`;
    if (n >= 1e3) return `$${(n / 1e3).toFixed(1)}K`;
    return `$${n.toFixed(2)}`;
}