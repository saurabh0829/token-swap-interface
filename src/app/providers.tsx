"use client";

import { WagmiProvider, createConfig, http } from "wagmi";
import { mainnet, localhost } from "wagmi/chains";
import { injected } from "wagmi/connectors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

const config = createConfig({
    chains: [mainnet, localhost],
    connectors: [injected()],
    transports: {
        [mainnet.id]: http("https://ethereum.publicnode.com"),
        [localhost.id]: http("http://127.0.0.1:8545"),
    },
});

export function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </WagmiProvider>
    );
}
