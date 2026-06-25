import { GraphQLClient, gql } from "graphql-request";

const UNISWAP_V2_SUBGRAPH = `https://gateway.thegraph.com/api/${process.env.NEXT_PUBLIC_GRAPH_API_KEY}/subgraphs/id/A3Np3RQbaBA6oKJgiwDJeo5T3zrYfGHPWFYayMwtNDum`;


export const graphClient = new GraphQLClient(UNISWAP_V2_SUBGRAPH);

export {gql};

export const POOL_ADDRESSES = {
  "WETH-USDC": "0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc",
  "WETH-USDT": "0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852",
  "WETH-DAI":  "0xa478c2975ab1ea89e8196811f51a7b7ade33eb11",
} as const;