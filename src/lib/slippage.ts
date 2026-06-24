export function calcMinAmountOut(
    amountOut: bigint,
    slippagePct: number
): bigint {
    const bps = BigInt(Math.floor(slippagePct * 100))
    return amountOut * (10000n - bps) / 10000n;
}

export function calcPriceImpact(
    amountIn: number,
    amountOut: number,
    reserveIn: number,
    reserveOut: number,
): number {
    if (reserveIn === 0) return 0;
    const idealOut = amountIn * reserveOut / reserveIn;
    if (idealOut === 0) return 0;
    const impact = (1 - amountOut / idealOut) * 100;
    return isNaN(impact) || !isFinite(impact) ? 0 : Math.max(0, impact);
}