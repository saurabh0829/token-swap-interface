import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount } from "wagmi";
import { erc20Abi, maxUint256 } from "viem";
import { ROUTER_ADDRESS } from "@/lib/uniswap";

// checking whether we already have the approval
export function useTokenApproval(
    tokenAddress : `0x${string}` |undefined,
    amountNeeded:bigint
){
    const {address} = useAccount();

    // Step1: Read Current allowance - like chacking
    const {data: currentAllowance, refetch: refetchAllowance} = useReadContract({
        address: tokenAddress,
        abi: erc20Abi,
        functionName: "allowance",
        args: address && tokenAddress 
            ? [address, ROUTER_ADDRESS]
            :undefined,
        query: {enabled: !!address && !!tokenAddress},
    });

    // Step2: Write - approve(router, Max) if needed
    const {
        writeContract: approve,
        data: approveTxHash,
        isPending:isApproving,
    } = useWriteContract();

    // Step3 : Wait for approval tx to confirm
    const {isSuccess: isApproved, status: receiptStatus} = useWaitForTransactionReceipt({
        hash: approveTxHash,
    })

    // Does the router already have enough allowance?
    const needsApproval =
        currentAllowance !== undefined &&
        currentAllowance < amountNeeded;

    const requestApproval = () => {
        if (!tokenAddress) return;
        approve({
            address: tokenAddress,
            abi: erc20Abi,
            functionName: "approve",
            args: [ROUTER_ADDRESS, maxUint256]
        })
    }

    // isPending = wallet waiting for signature; receiptStatus 'pending' = tx mining
    const isWaitingForReceipt = !!approveTxHash && receiptStatus === "pending";

    return {
        needsApproval,
        requestApproval,
        isApproving: isApproving || isWaitingForReceipt,
        isApproved,
        refetchAllowance
    }
}