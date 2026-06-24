import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    // wagmi/connectors barrel loads all connectors including MetaMask SDK
    // and WalletConnect, which have optional peer deps we don't need.
    config.resolve.alias = {
      ...config.resolve.alias,
      "@react-native-async-storage/async-storage": false,
      "pino-pretty": false,
    };
    return config;
  },
};

export default nextConfig;
