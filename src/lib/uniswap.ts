export const ROUTER_ADDRESS = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D" as const;

export const ROUTER_ABI = [
    {
        name: "getAmountsOut",
        type: "function",
        stateMutability: "view",
        inputs:[
            {name: "amountIn", type:"uint256"},
            {name: "path", type:"address[]"},
        ],
        outputs: [
            {name: "amounts", type:"uint256[]"}
        ]
    },
    {
        name:"swapExactTokensForTokens",
        type:"function",
        stateMutability: "nonpayable",
        inputs:[
            {name:"amountIn", type:"uint256"},
            {name: "amountOutMin", type:"uint256"},
            {name: "path", type:"address[]"},
            {name: "to", type:"address"},
            {name: "deadline", type:"uint256"},
        ]
    }
] as const;