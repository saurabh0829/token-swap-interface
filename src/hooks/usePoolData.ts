import {useReadContract} from "wagmi";
import {formatUnits} from "viem";
import {mainnet} from "wagmi/chains";

const PAIR_ABI = [{
    name:"getReserves",
    type: "function",
    stateMutability:"view",
    inputs:[],
    outputs:[
        {name:"reserve0", type:"uint112"},
        {name:"reserve1", type:"uint112"},
        {name:"blockTimestampLast", type:"uint32"},
    ]
}] as const;

const PAIRS: Record<string, `0x${string}`> = {
    "WETH-USDC": "0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc",
    "WETH-USDT": "0x0d4a11d5EEaaC28EC3F61d100daF4d40471f1852",
}

export function usePoolData(
    symbolA: string, symbolB: string,
    decimalsA: number, decimalsB: number,
    addressA?: string, addressB?: string,
) {
    const pairKey = `${symbolA}-${symbolB}`;
    const pairAddr = PAIRS[pairKey] || PAIRS[`${symbolB}-${symbolA}`];

    const {data, isLoading, error} = useReadContract({
        address: pairAddr,
        abi: PAIR_ABI,
        functionName: "getReserves",
        chainId: mainnet.id,
        query: {
            enabled: !!pairAddr,
            refetchInterval: 30_000,
        },
    });

    const reserves = data as [bigint, bigint, number] | undefined;

    // Uniswap sorts tokens by address — token0 is the lower address.
    // If tokenA is NOT token0, swap which reserve maps to which token.
    const aIsToken0 = addressA && addressB
        ? addressA.toLowerCase() < addressB.toLowerCase()
        : true;

    const [rawA, rawB] = aIsToken0
        ? [reserves?.[0], reserves?.[1]]
        : [reserves?.[1], reserves?.[0]];

    return {
        isLoading,
        error,
        reserveA: rawA,
        reserveB: rawB,
        formattedA: rawA ? formatUnits(rawA, decimalsA) : undefined,
        formattedB: rawB ? formatUnits(rawB, decimalsB) : undefined,
        pairAddress: pairAddr,
    };
}