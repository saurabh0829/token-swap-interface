"use client";
import {useState} from "react";
import { Settings } from "lucide-react";

const PRESETS = [0.1, 0.5, 1.0];

interface Props{
    slippage: number;
    onSlippage:(val:number)=>void
}

export function SlippageSettings({ slippage, onSlippage}:Props){
    const [open, setOpen] = useState(false);
    const [custom, setCustom] = useState("");

    const warning = 
    slippage<0.05 ? "May fail - too tight" : 
    slippage>5 ? "High slippage - front run risk":
    null

    return(
        <div>
            {/* Gear icon toggle */}
            <button
                onClick={()=>setOpen(!open)}
                className="p-2 hover:bg-gray-100 rounded-lg"
            >
                <Settings size={16}/>
            </button>

            {open && (
                <div className="absoute right-0 top-10 z-10">
                    <p className="text-sm font-medium mb-3">Slippage tolerance</p>

                    <div>
                        {PRESETS.map((p)=>(
                            <button
                                key={p}
                                onClick={()=>{
                                    onSlippage(p);
                                    setCustom("");
                                }}
                                className={`px-3 py-1.5 text-sm rounded-lg border 
                                ${slippage} === p
                                ? "bg-blue-600 text-white border-blue-600"
                                : "hover:bg-gray-50"
                            `}>
                                {p}%
                            </button>
                        ))}

                        {/* Custom input */}
                        <input
                            type="number"
                            placeholder="Cutom"
                            value={custom}
                            onChange={(e)=>{
                                const v = parseFloat(e.target.value);
                                if(!isNaN(v) && v>0 )onSlippage(v)
                            }}
                            className="w-20 border rounded-lg px-2 py-1.5 text-sm text-right"
                        />
                    </div>
                    {warning && (
                        <p className="text-xs text-amber-600">
                            {warning}
                        </p>
                    )}
                </div>
            )}
        </div>
    )
}