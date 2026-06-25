import { useQuery } from "@tanstack/react-query";
import { MOCK_TOP_PAIRS } from "@/lib/mockData";

export interface PoolPair{
    id:string;
    token0:{symbol:string};
    token1: {symbol:string};
    reserveUSD : string;
    volumeUSD: string;
    txCount: string;
    token0Price: string;
    token1Price: string; 
}

export function usePoolStats(){
    return useQuery({
        queryKey: ["topPairs"],
        queryFn: async () => MOCK_TOP_PAIRS,
        staleTime: 1000 * 60 * 10,
    })
}