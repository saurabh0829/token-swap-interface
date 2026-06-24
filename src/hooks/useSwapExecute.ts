import { useWriteContract, useWaitForTransactionReceipt, useAccount } from "wagmi";
import { ROUTER_ADDRESS, ROUTER_ABI } from "@/lib/uniswap";
import type { Token } from "@/lib/tokens"

export function useSwapExecute() {
    const { address } = useAccount();

    const {
        writeContract: executeSwap,
        data: swapTxHash,
        isPending: isSwapping,
        error: swapError
    } = useWriteContract()

    // Wait for the swap tx to land in a block
    const {
        isSuccess: isConfirmed,
        status: receiptStatus,
    } = useWaitForTransactionReceipt({ hash: swapTxHash })

    // the main swap fucntion
    const swap = (
        tokenIn: Token,
        tokenOut: Token,
        amountIn: bigint,
        amountOutMin: bigint //slippage adjusted minimum
        ) => {
        if (!address) return;

        // Deadline = 20min from now
        const deadline = BigInt(Math.floor(Date.now() / 1000) + 1200)

        executeSwap({
            address: ROUTER_ADDRESS,
            abi: ROUTER_ABI,
            functionName: "swapExactTokensForTokens",
            args: [
                amountIn,
                amountOutMin,
                [tokenIn.address, tokenOut.address],
                address,
                deadline,
            ]
        })
    }

    const isWaitingForReceipt = !!swapTxHash && receiptStatus === "pending";

    return {
        swap,
        swapTxHash,
        isSwapping: isSwapping || isWaitingForReceipt,
        isConfirmed,
        swapError
    }
}