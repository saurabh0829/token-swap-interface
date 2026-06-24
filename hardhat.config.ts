import { HardhatUserConfig } from "hardhat/config";

const config: HardhatUserConfig = {
  networks: {
    hardhat: {
      type: "edr-simulated",
      ...(process.env.ALCHEMY_MAINNET_URL && {
        forking: { url: process.env.ALCHEMY_MAINNET_URL },
      }),
    }
  }
};
export default config;
