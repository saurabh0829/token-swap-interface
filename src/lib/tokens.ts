export interface Token {
    address: `0x${string}`;
    symbol: string;
    name: string;
    decimals: number;
    logo: string;
    color:string;
}

export const TOKENS: Token[] = [
     {
    address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    symbol: "WETH",
    name: "Wrapped Ether",
    decimals: 18,
    logo: "https://assets.coingecko.com/coins/images/2518/thumb/weth.png",
    color: "#627EEA",
  },
  {
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    symbol: "USDC",
    name: "USD Coin",
    decimals: 6, // ← 6, not 18
    logo: "https://assets.coingecko.com/coins/images/6319/thumb/usdc.png",
    color: "#2775CA",
  },
  {
    address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    symbol: "USDT",
    name: "Tether USD",
    decimals: 6, // ← 6, not 18
    logo: "https://assets.coingecko.com/coins/images/325/thumb/tether.png",
    color: "#26A17B",
  },
  {
    address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    symbol: "DAI",
    name: "Dai Stablecoin",
    decimals: 18,
    logo: "https://assets.coingecko.com/coins/images/9956/thumb/Badge_Dai.png",
    color: "#F5AC37",
  },
  {
    address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
    symbol: "WBTC",
    name: "Wrapped Bitcoin",
    decimals: 8, // ← 8, Bitcoin uses satoshis
    logo: "https://assets.coingecko.com/coins/images/7598/thumb/wrapped_bitcoin_wbtc.png",
    color: "#F09242",
  },
]

export const getToken = (symbol:string) => 
    TOKENS.find((t)=>t.symbol === symbol)

export const getTokenByAddress = (address: string):Token | undefined =>
    TOKENS.find((t)=> t.address.toLowerCase() === address.toLowerCase())

export const DEFAULT_TOKEN_IN = "WETH"
export const DEFAULT_TOKEN_OUT = "USDC"