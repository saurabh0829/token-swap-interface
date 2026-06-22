import Image from "next/image";
import {TOKENS, type Token} from "@/lib/tokens";

interface Props {
    label:string;
    token:Token | undefined;
    amount: string;
    onTokenChange : (sym:string)=>void;
    onAmountChange?: (val:string)=>void;
    readOnly?: boolean;
}

export function TokenInput({label, token, amount, onTokenChange, onAmountChange, readOnly}:Props){
    return(
        <div className="bg-gray-50 border rounded-xl p-4">
            <p className="text-xs text-gray-700 underline font-semibold mb-2">{label}</p>
            <div className="flex items-center gap-2">
                <input 
                    type="number" 
                    placeholder="0.0"
                    value={amount}
                    readOnly={readOnly}
                    onChange={(e)=>onAmountChange?.(e.target.value)}
                    className="flex-1 bg-transparent text-xl font-semibold outline-none"
                />
                <select 
                    value={token?.symbol}
                    onChange={(e)=>onTokenChange(e.target.value)}
                    className="border rounded-lg px-2 py-1 text-sm font-semibold bg-white"
                >
                    {TOKENS.map((t)=>(
                        <option key={t.symbol} value={t.symbol}>
                            {t.symbol}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    )
}