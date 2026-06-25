import type { DayData } from "@/hooks/useSwapHistory";
import type { PoolPair } from "@/hooks/usePoolStats";

function seedRandom(seed: number) {
    let s = seed;
    return () => {
        s = (s * 16807 + 0) % 2147483647;
        return (s - 1) / 2147483646;
    };
}

export function generateDayData(days: number): DayData[] {
    const rand = seedRandom(42);
    const now = Math.floor(Date.now() / 1000);
    const DAY = 86400;

    let price = 3200;
    let reserve = 180_000_000;

    return Array.from({ length: days }, (_, i) => {
        price = price * (1 + (rand() - 0.5) * 0.04);
        reserve = reserve * (1 + (rand() - 0.5) * 0.02);
        const volume = 40_000_000 + rand() * 120_000_000;
        const txns = Math.floor(3000 + rand() * 8000);

        return {
            date: now - (days - 1 - i) * DAY,
            token0Price: price.toFixed(6),
            token1Price: (1 / price).toFixed(10),
            reserveUSD: reserve.toFixed(2),
            dailyVolumeUSD: volume.toFixed(2),
            dailyTxns: txns,
        };
    });
}

export const MOCK_TOP_PAIRS: PoolPair[] = [
    { id: "0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc", token0: { symbol: "USDC" }, token1: { symbol: "WETH" }, reserveUSD: "182340000", volumeUSD: "4821000000", txCount: "3241890", token0Price: "0.000312", token1Price: "3204.5" },
    { id: "0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852", token0: { symbol: "WETH" }, token1: { symbol: "USDT" }, reserveUSD: "145200000", volumeUSD: "3610000000", txCount: "2891200", token0Price: "3198.2", token1Price: "0.000313" },
    { id: "0xa478c2975ab1ea89e8196811f51a7b7ade33eb11", token0: { symbol: "DAI" },  token1: { symbol: "WETH" }, reserveUSD: "98100000",  volumeUSD: "1940000000", txCount: "1654300", token0Price: "0.000311", token1Price: "3212.1" },
    { id: "0xae461ca67b15dc8dc81ce7615e0320da1a9ab8d5", token0: { symbol: "DAI" },  token1: { symbol: "USDC" }, reserveUSD: "76400000",  volumeUSD: "1230000000", txCount: "982100",  token0Price: "1.0002",   token1Price: "0.9998" },
    { id: "0x3041cbd36888becc7bbcbc0045e3b1f144466f5f", token0: { symbol: "USDC" }, token1: { symbol: "USDT" }, reserveUSD: "62800000",  volumeUSD: "980000000",  txCount: "741200",  token0Price: "0.9999",   token1Price: "1.0001" },
    { id: "0xd3d2e2692501a5c9ca623199d38826e513033a17", token0: { symbol: "UNI" },  token1: { symbol: "WETH" }, reserveUSD: "41200000",  volumeUSD: "621000000",  txCount: "512400",  token0Price: "0.00182",  token1Price: "549.2" },
    { id: "0xf80758ab42c3b07da84053fd88804bcb6baa4b5c", token0: { symbol: "sUSD" }, token1: { symbol: "USDC" }, reserveUSD: "28900000",  volumeUSD: "412000000",  txCount: "328100",  token0Price: "0.9991",   token1Price: "1.0009" },
    { id: "0xce84867c3c02b05dc570d0135103d3fb9cc19433", token0: { symbol: "SUSHI" },token1: { symbol: "WETH" }, reserveUSD: "19400000",  volumeUSD: "289000000",  txCount: "241800",  token0Price: "0.000312", token1Price: "3204.5" },
    { id: "0x2fdbadf3c4d5a8666bc06645b8358ab803996e28", token0: { symbol: "YFI" },  token1: { symbol: "WETH" }, reserveUSD: "14100000",  volumeUSD: "198000000",  txCount: "89200",   token0Price: "2.812",    token1Price: "0.3556" },
    { id: "0xdc98556ce24f007a5ef6dc1ce96322d65832a819", token0: { symbol: "WETH" }, token1: { symbol: "LINK" }, reserveUSD: "11800000",  volumeUSD: "156000000",  txCount: "76400",   token0Price: "3204.5",   token1Price: "0.000312" },
];
