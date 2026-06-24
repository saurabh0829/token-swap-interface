import {Loader2, CheckCircle, XCircle, ExternalLink} from "lucide-react"

interface Props{
    txHash?:`0x${string}`;
    isPending: boolean; //wallet popup open
    isConfirming:boolean; //tx submitted, waiting for block
    isConfirmed:boolean; //inckuded in block
    error?:Error | null;
    label?: string;
}

export function TransactionStatus({
    txHash, isPending, isConfirmed, isConfirming, error, label = "Transaction"
}:Props){
    if(!isPending && !isConfirming && !isConfirmed && !error)
        console.log("Nothing happening");
        
        return null;

    return(
        <div>
            {isPending && (
                <div className="flex items-center gap-2 text-yellow-600">
                    <Loader2 size={14} className="animate-spin"/>
                    Confirm {label} in your wallet
                </div>
            )}

            {isConfirming && (
                <div className="flex items-center gap-2 text-blue-600">
                    <Loader2 size={14} className="animate-spin"/>
                    {label} submitted - waiting for block...
                </div>
            )}

            {isConfirmed && (
                <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle size={14}/>
                    {label} confirmed!
                </div>
            )}

            {error && (
                <div className="flex items-center gap-2 text-red-600">
                    <XCircle size={14}/>
                    {label} failed: {error?.message.slice(0,4)}
                </div>
            )}

            {/* Link to etherscan - always show when hash exists */}
            {txHash && (
                <a 
                    href={`https://etherscan.io/tx/${txHash}`}
                    target="_blank"
                    className="flex items-center gap-1 text-blue-500 hover:underline text-xs"
                >
                    View Etherscan
                </a>
            )}
        </div>
    )
}